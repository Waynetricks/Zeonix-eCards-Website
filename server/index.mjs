import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { validateInquiry } from './contact-service.mjs';
import { sendInquiryEmail, isEmailConfigured } from './email-service.mjs';
import { logger, errorHandler, requestLogger, validationErrorHandler, rateLimiter } from './error-handler.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const submissionsFile = path.join(dataDir, 'submissions.json');
const PORT = process.env.PORT || 3001;

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
  fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2), 'utf8');
}

const server = http.createServer(async (req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Apply request logging
  req.startTime = Date.now();
  requestLogger(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    res.writeHead(200, headers);
    res.end(JSON.stringify({ 
      ok: true, 
      message: 'Contact API healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }));
    return;
  }

  if (req.method === 'GET' && req.url === '/api/health/detailed') {
    const submissions = loadSubmissions();
    res.writeHead(200, headers);
    res.end(JSON.stringify({
      ok: true,
      message: 'Detailed health check',
      timestamp: new Date().toISOString(),
      submissionCount: submissions.length,
      emailConfigured: isEmailConfigured(),
      dataFile: submissionsFile,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    }));
    return;
  }

  if (req.method !== 'POST' || req.url !== '/api/contact') {
    res.writeHead(404, headers);
    res.end(JSON.stringify({ 
      ok: false, 
      message: 'Not found',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Apply rate limiting (100 requests per 15 minutes per IP)
  const rateLimitCheck = rateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 100 });
  try {
    await new Promise((resolve, reject) => {
      rateLimitCheck(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (rateLimitError) {
    return; // Rate limit response already sent
  }

  let raw = '';
  let requestBody = {};

  req.on('data', (chunk) => {
    raw += chunk;
  });

  req.on('end', async () => {
    try {
      // Parse and validate JSON
      if (!raw) {
        throw new Error('Empty request body');
      }

      try {
        requestBody = JSON.parse(raw);
      } catch (parseError) {
        throw new Error('Invalid JSON payload');
      }

      // Log received payload (sanitized)
      logger.debug('Received inquiry payload', {
        hasName: !!requestBody.name,
        hasPhone: !!requestBody.phone,
        hasEventType: !!requestBody.eventType,
        hasEmail: !!requestBody.email,
        payloadSize: raw.length
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
        id: `INQ-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown'
      };

      // Store inquiry in database
      submissions.push(inquiry);
      saveSubmissions(submissions);

      logger.info('Inquiry saved successfully', {
        inquiryId: inquiry.id,
        name: inquiry.name,
        eventType: inquiry.eventType,
        submissionCount: submissions.length
      });

      // Send email notification (async, don't wait for it to respond)
      let emailResult = { ok: false, message: 'Email not configured' };
      if (isEmailConfigured()) {
        try {
          emailResult = await sendInquiryEmail(inquiry);
          if (emailResult.ok) {
            logger.info('Inquiry email sent successfully', {
              inquiryId: inquiry.id,
              messageId: emailResult.messageId
            });
          } else {
            logger.warn('Failed to send inquiry email', {
              inquiryId: inquiry.id,
              error: emailResult.message
            });
          }
        } catch (emailError) {
          logger.error('Email sending failed', {
            inquiryId: inquiry.id,
            error: emailError.message,
            stack: emailError.stack
          });
          emailResult = { ok: false, message: emailError.message };
        }
      } else {
        logger.warn('Email service not configured - skipping email notification');
      }

      const response = {
        ok: true,
        inquiry: {
          id: inquiry.id,
          name: inquiry.name,
          eventType: inquiry.eventType,
          submittedAt: inquiry.storedAt
        },
        message: 'Inquiry received successfully. We will contact you soon.',
        savedCount: submissions.length,
        emailSent: isEmailConfigured(),
        emailSuccess: emailResult?.ok || false,
        timestamp: new Date().toISOString(),
        nextSteps: [
          'You will receive a response within 24 hours',
          'Check your WhatsApp for immediate assistance',
          'Keep an eye on your email for design options'
        ]
      };

      res.writeHead(200, headers);
      res.end(JSON.stringify(response));

      logger.info('Inquiry processed successfully', {
        inquiryId: inquiry.id,
        responseTime: Date.now() - req.startTime,
        emailSent: isEmailConfigured(),
        emailSuccess: emailResult?.ok || false
      });

    } catch (error) {
      errorHandler(error, req, res);
    }
  });

  // Handle request errors
  req.on('error', (error) => {
    logger.error('Request error', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method
    });
  });
});

server.listen(PORT, () => {
  console.log(`Contact API listening on http://localhost:${PORT}`);
  console.log(`Saved submissions: ${path.join(__dirname, 'data', 'submissions.json')}`);
  
  if (isEmailConfigured()) {
    console.log('✓ Email notifications are ENABLED');
    console.log(`  Sending to: ${process.env.EMAIL_TO}`);
  } else {
    console.log('⚠ Email notifications are DISABLED');
    console.log('  Set SMTP_USER and SMTP_PASSWORD in .env to enable');
  }
  
  console.log(`\nEnvironment: ${process.env.NODE_ENV || 'development'}`);
});
