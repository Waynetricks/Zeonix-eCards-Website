# Zeonix eCards - Setup and Configuration Guide

## Environment Setup

### 1. Clone and Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your actual values:
   ```
   # Email Configuration (Required for inquiry notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-business-email@gmail.com
   SMTP_PASSWORD=your-app-password
   EMAIL_FROM=your-business-email@gmail.com
   EMAIL_TO=zeonix.business@actual-email.com
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # Frontend API URL
   VITE_CONTACT_API_URL=http://localhost:3001/api/contact
   ```

### 3. Email Configuration (Gmail Example)

#### For Gmail Users:
1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "App" → "Other" → Enter "Zeonix eCards"
   - Copy the generated 16-character password
   - Use this password as `SMTP_PASSWORD`

#### For Other Email Providers:
Update these values in `.env`:
- `SMTP_HOST`: Your SMTP server (e.g., smtp.gmail.com, smtp.office365.com)
- `SMTP_PORT`: Usually 587 for TLS, 465 for SSL
- `SMTP_SECURE`: false for STARTTLS, true for SSL
- `SMTP_USER`: Your email address
- `SMTP_PASSWORD`: Your email password or app-specific password

## Running the Application

### Development Mode (Recommended)
Run both frontend and backend simultaneously:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Production Build
```bash
npm run build
npm run preview
```

## Testing the Integration

### 1. Test Backend API
```bash
cd server
node contact-service.test.mjs
```

### 2. Test Form Submission
1. Visit http://localhost:5173
2. Scroll to "Contact & Order" section
3. Fill out the form with test data
4. Submit and verify:
   - Success message appears
   - Data saved to `server/data/submissions.json`
   - Email sent to configured `EMAIL_TO`

### 3. Test WhatsApp Integration
Click any WhatsApp button throughout the site:
- Navbar WhatsApp button
- Floating WhatsApp button (bottom right)
- WhatsApp button in Contact section
- WhatsApp button in Services section
- WhatsApp link in Footer

## Security Notes

### Sensitive Data Protection
- Email credentials are stored in `.env` (never committed to git)
- Form submissions are stored locally in JSON files
- No sensitive data is exposed in frontend code
- WhatsApp number is hardcoded but can be moved to env if needed

### Environment File Security
- `.env` is included in `.gitignore`
- `.env.example` contains template values only
- Never commit actual credentials

## Troubleshooting

### Email Not Sending
1. Check `.env` file configuration
2. Verify email credentials are correct
3. Check console logs for SMTP connection errors
4. For Gmail, ensure "Less secure app access" is enabled or use App Password

### Form Submission Errors
1. Check browser console for API errors
2. Verify backend server is running (`npm run dev:server`)
3. Check `server/data/submissions.json` permissions
4. Test API endpoint directly: `curl -X POST http://localhost:3001/api/contact -H "Content-Type: application/json" -d '{"name":"Test","phone":"0699000000","eventType":"Wedding"}'`

### WhatsApp Issues
1. WhatsApp buttons open `https://wa.me/255699068552` with pre-filled message
2. Ensure WhatsApp is installed on the device
3. Message template can be modified in components

## Deployment Considerations

### Frontend Hosting
- Build output: `dist/` folder
- Can be deployed to Netlify, Vercel, GitHub Pages, etc.
- Update `VITE_CONTACT_API_URL` to point to production backend

### Backend Hosting
- Node.js server (`server/index.mjs`)
- Requires environment variables set on host
- Can be deployed to Railway, Heroku, AWS, etc.
- Ensure `server/data/` directory has write permissions

### Database Scaling
- Current: Local JSON file storage
- Future: Can migrate to MongoDB, PostgreSQL, etc.
- Admin dashboard can be built using stored submissions

## Admin Dashboard (Future Feature)
Submissions are stored in `server/data/submissions.json` and can be used to build an admin dashboard where Zeonix can:
- View all customer inquiries
- Filter by event type or date
- Export data for follow-up
- Mark inquiries as contacted/completed