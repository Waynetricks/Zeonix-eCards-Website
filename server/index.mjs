import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { validateInquiry } from './contact-service.mjs';
import { sendInquiryEmail, isEmailConfigured } from './email-service.mjs';
import { logger, errorHandler, requestLogger, validationErrorHandler, rateLimiter } from './error-handler.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';

// ---------------------------------------------------------------------------
// Configuration (all overridable via environment variables)
// ---------------------------------------------------------------------------
const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Persistent data directory — point DATA_DIR at a mounted volume in production
// so submissions survive restarts and redeploys.
const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, 'data');
const submissionsFile = path.join(dataDir, 'submissions.json');

// Static frontend build output (produced by `npm run build` → dist/)
const distDir = path.resolve(__dirname, '..', 'dist');

// CORS allowlist. Comma-separated list of origins allowed to call the API
// cross-origin, e.g. CORS_ORIGINS=https://zeonixecards.com,https://www.zeonixecards.com
// Same-origin requests (frontend served by this server) never need CORS.
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Only trust X-Forwarded-For when explicitly running behind a reverse proxy /
// PaaS ingress (otherwise the header is client-spoofable and defeats rate
// limiting).
const trustProxy = process.env.TRUST_PROXY === 'true';

// ---------------------------------------------------------------------------
// Data persistence (atomic writes so a crash can't corrupt the JSON store)
// ---------------------------------------------------------------------------
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(submissionsFile)) {
  fs.writeFileSync(submissionsFile, '[]', 'utf8');
}

function loadSubmissions() {
  try {
    const raw = fs.readFileSync(submissionsFile, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSubmissions(submissions) {
  const tmpFile = `${submissionsFile}.${process.pid}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(submissions, null, 2), 'utf8');
  fs.renameSync(tmpFile, submissionsFile);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getClientIp(req) {
  if (trustProxy) {
    const xff = req.headers['x-forwarded-for'];
    if (typeof xff === 'string' && xff.length > 0) {
      // Leftmost entry is the original client when a proxy appends to the chain
      return xff.split(',')[0].trim();
    }
  }
  return req.socket.remoteAddress || 'unknown';
}

// Common response headers — security first, then CORS allowlist.
// Same-origin requests (frontend served by this server) never need CORS
// headers; only allowlisted origins get them (no more wildcard `*`).
function baseHeaders(req, extra = {}) {
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    ...extra,
  };

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    headers['Access-Control-Max-Age'] = '600';
    headers['Vary'] = headers['Vary'] ? `${headers['Vary']}, Origin` : 'Origin';
  }

  return headers;
}

function sendJson(req, res, statusCode, payload) {
  const body = JSON.stringify(payload);
  const headers = baseHeaders(req, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });

  // Compress API responses when the client supports it
  const acceptEncoding = req.headers['accept-encoding'] || '';
  if (body.length > 1024 && /\bgzip\b/.test(acceptEncoding)) {
    headers['Content-Length'] = undefined;
    zlib.gzip(body, (err, gzipped) => {
      if (err) {
        res.writeHead(statusCode, headers);
        res.end(body);
        return;
      }
      res.writeHead(statusCode, { ...headers, 'Content-Encoding': 'gzip', 'Content-Length': gzipped.length });
      res.end(gzipped);
    });
    return;
  }

  res.writeHead(statusCode, headers);
  res.end(body);
}

// ---------------------------------------------------------------------------
// Static frontend serving (production build in dist/)
// ---------------------------------------------------------------------------
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

// Content-Security-Policy for the site. Google Fonts (loaded by src/index.css)
// and wa.me / WhatsApp Web (opened in a new tab by contact buttons) are
// accounted for; everything else is locked to same-origin.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

function sendNotFound(req, res, message = 'Not found') {
  sendJson(req, res, 404, { ok: false, message, timestamp: new Date().toISOString() });
}

function serveFile(req, res, filePath, { immutable }) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.stat(filePath, (statErr, stat) => {
    if (statErr || !stat.isFile()) {
      sendNotFound(req, res);
      return;
    }

    const headers = baseHeaders(req, {
      'Content-Type': contentType,
      // Hashed Vite assets are immutable; other public files revalidate hourly
      'Cache-Control': immutable
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600, must-revalidate',
    });

    const acceptEncoding = req.headers['accept-encoding'] || '';
    const compressible = /^(text\/|application\/(json|javascript|xml|manifest))/.test(contentType);

    if (compressible && /\bgzip\b/.test(acceptEncoding)) {
      const stream = fs.createReadStream(filePath).pipe(zlib.createGzip());
      stream.on('error', () => res.destroy());
      res.writeHead(200, { ...headers, 'Content-Encoding': 'gzip' });
      stream.pipe(res);
    } else {
      const stream = fs.createReadStream(filePath);
      stream.on('error', () => res.destroy());
      res.writeHead(200, { ...headers, 'Content-Length': stat.size });
      stream.pipe(res);
    }
  });
}

function serveStatic(req, res, pathname) {
  // Prevent path traversal (decode then normalize; must stay inside distDir)
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    sendJson(req, res, 400, { ok: false, message: 'Bad request', timestamp: new Date().toISOString() });
    return;
  }

  const resolved = path.normalize(path.join(distDir, decodedPath));
  if (!resolved.startsWith(distDir + path.sep) && resolved !== distDir) {
    sendJson(req, res, 403, { ok: false, message: 'Forbidden', timestamp: new Date().toISOString() });
    return;
  }

  fs.stat(resolved, (err, stat) => {
    if (!err && stat.isFile()) {
      serveFile(req, res, resolved, { immutable: resolved.includes(`${path.sep}assets${path.sep}`) });
      return;
    }

    // SPA fallback — unknown paths get index.html (single-page app)
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      serveFile(req, res, indexPath, { immutable: false });
    } else {
      sendNotFound(req, res, 'Frontend build not found. Run `npm run build` first.');
    }
  });
}

// ---------------------------------------------------------------------------
// Contact form endpoint (validation → storage → email — unchanged behavior)
// ---------------------------------------------------------------------------
const contactHandler = async (req, res) => {
  // Rate limiting (100 requests per 15 minutes per IP)
  const rateLimitCheck = rateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
    keyResolver: getClientIp,
  });
  try {
    await new Promise((resolve, reject) => {
      rateLimitCheck(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch {
    return; // Rate limit response already sent
  }

  let raw = '';
  let tooLarge = false;

  req.on('data', (chunk) => {
    raw += chunk;
    if (raw.length > 64 * 1024) {
      tooLarge = true;
      req.destroy();
    }
  });

  req.on('end', async () => {
    try {
      if (tooLarge) return; // connection already destroyed

      if (!raw) {
        const err = new Error('Empty request body');
        err.statusCode = 400;
        throw err;
      }

      let requestBody;
      try {
        requestBody = JSON.parse(raw);
      } catch {
        const err = new Error('Invalid JSON payload');
        err.statusCode = 400;
        throw err;
      }

      logger.debug('Received inquiry payload', {
        hasName: !!requestBody.name,
        hasPhone: !!requestBody.phone,
        hasEventType: !!requestBody.eventType,
        hasEmail: !!requestBody.email,
        payloadSize: raw.length,
      });

      const validation = validateInquiry(requestBody);

      if (!validation.ok) {
        validationErrorHandler(validation, req, res);
        return;
      }

      const submissions = loadSubmissions();
      const inquiry = {
        ...validation.cleaned,
        storedAt: new Date().toISOString(),
        id: `INQ-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ip: getClientIp(req),
        userAgent: req.headers['user-agent'] || 'unknown',
      };

      // Store inquiry in database
      submissions.push(inquiry);
      saveSubmissions(submissions);

      logger.info('Inquiry saved successfully', {
        inquiryId: inquiry.id,
        name: inquiry.name,
        eventType: inquiry.eventType,
        submissionCount: submissions.length,
      });

      // Send email notification
      let emailResult = { ok: false, message: 'Email not configured' };
      if (isEmailConfigured()) {
        try {
          emailResult = await sendInquiryEmail(inquiry);
          if (emailResult.ok) {
            logger.info('Inquiry email sent successfully', {
              inquiryId: inquiry.id,
              messageId: emailResult.messageId,
            });
          } else {
            logger.warn('Failed to send inquiry email', {
              inquiryId: inquiry.id,
              error: emailResult.message,
            });
          }
        } catch (emailError) {
          logger.error('Email sending failed', {
            inquiryId: inquiry.id,
            error: emailError.message,
            stack: emailError.stack,
          });
          emailResult = { ok: false, message: emailError.message };
        }
      } else {
        logger.warn('Email service not configured - skipping email notification');
      }

      sendJson(req, res, 200, {
        ok: true,
        inquiry: {
          id: inquiry.id,
          name: inquiry.name,
          eventType: inquiry.eventType,
          submittedAt: inquiry.storedAt,
        },
        message: 'Inquiry received successfully. We will contact you soon.',
        savedCount: submissions.length,
        emailSent: isEmailConfigured(),
        emailSuccess: emailResult?.ok || false,
        timestamp: new Date().toISOString(),
        nextSteps: [
          'You will receive a response within 24 hours',
          'Check your WhatsApp for immediate assistance',
          'Keep an eye on your email for design options',
        ],
      });

      logger.info('Inquiry processed successfully', {
        inquiryId: inquiry.id,
        responseTime: Date.now() - req.startTime,
        emailSent: isEmailConfigured(),
        emailSuccess: emailResult?.ok || false,
      });
    } catch (error) {
      errorHandler(error, req, res);
    }
  });

  req.on('error', (error) => {
    logger.error('Request error', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
    });
  });
};

// ---------------------------------------------------------------------------
// Request router
// ---------------------------------------------------------------------------
function handler(req, res) {
  let url;
  try {
    url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch {
    sendJson(req, res, 400, { ok: false, message: 'Bad request', timestamp: new Date().toISOString() });
    return;
  }
  const pathname = url.pathname;
  req.startTime = Date.now();
  requestLogger(req, res);

  // CORS pre-flight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, baseHeaders(req));
    res.end();
    return;
  }

  // Contact form submission
  if (req.method === 'POST' && pathname === '/api/contact') {
    contactHandler(req, res);
    return;
  }

  // API routes
  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(req, res, 200, {
      ok: true,
      message: 'Contact API healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/health/detailed') {
    const submissions = loadSubmissions();
    sendJson(req, res, 200, {
      ok: true,
      message: 'Detailed health check',
      timestamp: new Date().toISOString(),
      submissionCount: submissions.length,
      emailConfigured: isEmailConfigured(),
      dataFile: submissionsFile,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
    return;
  }

  if (pathname.startsWith('/api/')) {
    sendNotFound(req, res);
    return;
  }

  // Static frontend + SPA fallback
  if (req.method === 'GET' || req.method === 'HEAD') {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Content-Security-Policy', contentSecurityPolicy);
    if (isProduction) {
      // We run behind TLS-terminating proxies on every supported host
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    serveStatic(req, res, pathname);
    return;
  }

  sendJson(req, res, 405, { ok: false, message: 'Method not allowed', timestamp: new Date().toISOString() });
}

const server = http.createServer(handler);

// ---------------------------------------------------------------------------
// Start & graceful shutdown (SIGTERM is sent by PaaS platforms on redeploy)
// ---------------------------------------------------------------------------
server.listen(PORT, HOST, () => {
  console.log(`Zeonix eCards server running (host ${HOST}, port ${PORT})`);
  console.log(`Environment: ${isProduction ? 'production' : process.env.NODE_ENV || 'development'}`);
  console.log(`Static frontend: ${fs.existsSync(path.join(distDir, 'index.html')) ? distDir : '(missing — run `npm run build`)'}`);
  console.log(`Saved submissions: ${submissionsFile}`);

  if (allowedOrigins.length > 0) {
    console.log(`CORS allowlist: ${allowedOrigins.join(', ')}`);
  } else {
    console.log('CORS: same-origin only (set CORS_ORIGINS to allow cross-origin API calls)');
  }

  if (isEmailConfigured()) {
    console.log('✓ Email notifications are ENABLED');
    console.log(`  Sending to: ${process.env.EMAIL_TO}`);
  } else {
    console.log('⚠ Email notifications are DISABLED');
    console.log('  Set SMTP_USER and SMTP_PASSWORD to enable');
  }
});

function shutdown(signal) {
  logger.info(`${signal} received — closing server`);
  server.close(() => {
    logger.info('Server closed cleanly');
    process.exit(0);
  });
  // Force-exit if connections don't drain in time
  setTimeout(() => process.exit(0), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
