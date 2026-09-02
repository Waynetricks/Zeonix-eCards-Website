# Zeonix eCards Backend Server

## Overview
Node.js backend server for handling contact form submissions, with comprehensive validation, email notifications, and logging.

## API Endpoints

### POST `/api/contact`
Submit a new inquiry.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "0699 068 552",
  "email": "john@example.com",
  "eventType": "Wedding",
  "date": "2026-12-31",
  "guests": "150",
  "message": "Looking for elegant wedding invitations"
}
```

**Required Fields:**
- `name` (string, 2-100 chars)
- `phone` (valid Tanzanian phone number)
- `eventType` (one of: Wedding, Birthday, Send-off, Kitchen Party, Graduation, Custom Event)

**Optional Fields:**
- `email` (valid email format)
- `date` (future date in YYYY-MM-DD format)
- `guests` (positive integer, 1-10000)
- `message` (string, max 1000 chars)

**Success Response (200):**
```json
{
  "ok": true,
  "inquiry": {
    "id": "INQ-1234567890-abc123",
    "name": "John Doe",
    "eventType": "Wedding",
    "submittedAt": "2026-09-02T10:30:00.000Z"
  },
  "message": "Inquiry received successfully. We will contact you soon.",
  "savedCount": 42,
  "emailSent": true,
  "emailSuccess": true,
  "timestamp": "2026-09-02T10:30:00.000Z",
  "nextSteps": [...]
}
```

**Error Responses:**
- `400` - Validation error
- `404` - Not found
- `429` - Rate limit exceeded
- `500` - Server error

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "ok": true,
  "message": "Contact API healthy",
  "timestamp": "2026-09-02T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

### GET `/api/health/detailed`
Detailed health check with system information.

## Validation Rules

### Name
- Required
- 2-100 characters
- Only letters, spaces, hyphens, apostrophes
- HTML tags are escaped

### Phone
- Required
- Valid Tanzanian phone number format
- Accepts: 0699 068 552, +255699068552, 0699068552
- Automatically formatted to +255XXXXXXXXX

### Email
- Optional
- Valid email format (name@domain.com)
- Maximum 254 characters
- Converted to lowercase

### Event Type
- Required
- Must be one of: Wedding, Birthday, Send-off, Kitchen Party, Graduation, Custom Event

### Date
- Optional
- Must be valid date in YYYY-MM-DD format
- Must be in the future
- Automatically validated and formatted

### Guests
- Optional
- Positive integer (1-10000)
- Parsed and validated

### Message
- Optional
- Maximum 1000 characters
- HTML tags are escaped

## Security Features

### Input Sanitization
- All string inputs are trimmed
- HTML entities are escaped to prevent XSS
- Maximum length limits enforced
- Special characters validated per field type

### Rate Limiting
- 100 requests per 15 minutes per IP address
- Prevents abuse and spam
- Automatic cleanup of old entries

### Error Handling
- Structured error responses
- No stack traces in production
- Unique error IDs for tracking
- Comprehensive logging

### Data Protection
- No sensitive data in error messages
- Email credentials in environment variables
- JSON file storage with proper permissions
- Request logging without sensitive user data

## Logging System

### Log Levels
- `ERROR` - Critical errors requiring attention
- `WARN` - Warning conditions
- `INFO` - Informational messages (default in production)
- `DEBUG` - Debug information (development only)

### Log Storage
- Logs saved to `server/logs/server.log`
- JSON format for easy parsing
- Console output in development
- Automatic log rotation (manual cleanup needed)

### What's Logged
- All API requests and responses
- Validation failures
- Email sending results
- Server errors
- Rate limit violations
- System health information

## Email System

### Configuration
Email settings in `.env` file:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=zeonix.business@example.com
```

### Email Template
- Professional HTML format
- Customer details section
- Event information
- Quick action links (WhatsApp, Call, Email)
- Timestamp and submission details

### Error Handling
- Email failures don't block form submission
- Errors logged for troubleshooting
- Graceful degradation when email not configured

## Monitoring and Maintenance

### Health Checks
- Basic health endpoint for load balancers
- Detailed endpoint for system monitoring
- Submission count tracking
- Email configuration status

### Performance
- Async email sending (non-blocking)
- Efficient JSON file operations
- Memory usage monitoring
- Request timing logging

### Maintenance Tasks
1. Regularly check log files
2. Monitor submission count growth
3. Verify email delivery
4. Clean up old rate limit entries
5. Backup submission data

## Testing

### Run Tests
```bash
npm run test:server
```

### Test Coverage
- Input validation
- Phone number formatting
- Email validation
- Date parsing
- Sanitization
- Error handling

### Manual Testing
```bash
# Test API endpoint
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"0699068552","eventType":"Wedding"}'

# Check health
curl http://localhost:3001/api/health

# Check detailed health
curl http://localhost:3001/api/health/detailed
```

## Deployment Notes

### Environment Variables
- All sensitive data in `.env`
- `.env.example` for reference
- Never commit `.env` to version control

### File Permissions
- `server/data/` must be writable
- `server/logs/` must be writable
- JSON files created with proper permissions

### Scaling Considerations
- Current: File-based storage (JSON)
- Future: Database migration possible
- Rate limiting per IP
- Async email processing

### Backup Strategy
- Regular backups of `server/data/submissions.json`
- Log rotation or external log management
- Email delivery reports monitoring