// Enhanced error handling and logging middleware
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'server.log');

// Log levels
const LogLevel = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Current log level based on environment
const currentLogLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;

function shouldLog(level) {
  const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
  return levels.indexOf(level) <= levels.indexOf(currentLogLevel);
}

function formatLogMessage(level, message, metadata = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...metadata
  };
  
  return JSON.stringify(logEntry);
}

function writeToLog(level, message, metadata = {}) {
  if (!shouldLog(level)) return;
  
  const logEntry = formatLogMessage(level, message, metadata);
  
  // Write to file
  fs.appendFileSync(logFile, logEntry + '\n', 'utf8');
  
  // Also write to console in development
  if (process.env.NODE_ENV !== 'production') {
    const colors = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m',  // Yellow
      INFO: '\x1b[36m',  // Cyan
      DEBUG: '\x1b[90m'  // Gray
    };
    const reset = '\x1b[0m';
    
    console.log(`${colors[level]}[${level}]${reset} ${message}`);
    if (Object.keys(metadata).length > 0) {
      console.log('  Metadata:', metadata);
    }
  }
}

// Public logging functions
export const logger = {
  error: (message, metadata = {}) => writeToLog(LogLevel.ERROR, message, metadata),
  warn: (message, metadata = {}) => writeToLog(LogLevel.WARN, message, metadata),
  info: (message, metadata = {}) => writeToLog(LogLevel.INFO, message, metadata),
  debug: (message, metadata = {}) => writeToLog(LogLevel.DEBUG, message, metadata),
};

// Error handler middleware
export function errorHandler(err, req, res) {
  const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  
  logger.error('Server Error', {
    errorId,
    message: err.message,
    stack: err.stack,
    url: req?.url,
    method: req?.method,
    timestamp: new Date().toISOString()
  });

  // Don't expose internal errors in production
  const isProduction = process.env.NODE_ENV === 'production';
  const errorMessage = isProduction 
    ? 'An unexpected error occurred. Please try again later.'
    : err.message;

  const response = {
    ok: false,
    errorId,
    message: errorMessage,
    timestamp: new Date().toISOString()
  };

  if (!isProduction) {
    response.stack = err.stack;
  }

  const statusCode = err.statusCode || 500;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(response));
}

// Request logger middleware
export function requestLogger(req, res, next) {
  const startTime = Date.now();
  
  // Log request
  logger.debug('Request received', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });

  // Log response when completed
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
    
    return originalEnd.apply(this, args);
  };
  
  if (next) next();
}

// Validation error handler
export function validationErrorHandler(validationResult, req, res) {
  logger.warn('Validation failed', {
    errors: validationResult.details || validationResult.message,
    payload: req.body,
    url: req.url,
    timestamp: new Date().toISOString()
  });

  const response = {
    ok: false,
    message: validationResult.message,
    validationErrors: validationResult.details || [],
    timestamp: new Date().toISOString()
  };

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  res.writeHead(400, headers);
  res.end(JSON.stringify(response));
}

// Rate limiting helper (basic implementation)
const rateLimitStore = new Map();
export function rateLimiter(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
  const maxRequests = options.maxRequests || 100; // 100 requests per window
  
  return function(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    if (!rateLimitStore.has(ip)) {
      rateLimitStore.set(ip, { count: 1, startTime: now });
    } else {
      const record = rateLimitStore.get(ip);
      
      if (now - record.startTime > windowMs) {
        // Reset counter if window has passed
        record.count = 1;
        record.startTime = now;
      } else {
        record.count++;
        
        if (record.count > maxRequests) {
          logger.warn('Rate limit exceeded', {
            ip,
            count: record.count,
            maxRequests,
            windowMs,
            timestamp: new Date().toISOString()
          });
          
          const response = {
            ok: false,
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((windowMs - (now - record.startTime)) / 1000),
            timestamp: new Date().toISOString()
          };
          
          const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json',
          };
          
          res.writeHead(429, headers);
          res.end(JSON.stringify(response));
          return;
        }
      }
    }
    
    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance to clean up
      const cutoff = now - windowMs;
      for (const [key, record] of rateLimitStore.entries()) {
        if (record.startTime < cutoff) {
          rateLimitStore.delete(key);
        }
      }
    }
    
    if (next) next();
  };
}