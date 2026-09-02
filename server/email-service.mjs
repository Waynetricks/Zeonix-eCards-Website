import nodemailer from 'nodemailer';

// Email configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;
const EMAIL_TO = process.env.EMAIL_TO || 'zeonix.business@example.com';

// Create reusable transporter
let transporter = null;

function initializeTransporter() {
  if (!SMTP_USER || !SMTP_PASSWORD) {
    console.warn('Email configuration missing. Email notifications will be disabled.');
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });

    // Verify connection configuration
    transporter.verify((error) => {
      if (error) {
        console.error('SMTP connection error:', error.message);
        transporter = null;
      } else {
        console.log('SMTP server is ready to send messages');
      }
    });

    return transporter;
  } catch (error) {
    console.error('Failed to create email transporter:', error.message);
    return null;
  }
}

// Initialize on module load
initializeTransporter();

export async function sendInquiryEmail(inquiry) {
  if (!transporter) {
    console.warn('Email transporter not available. Skipping email notification.');
    return { ok: false, message: 'Email service not configured' };
  }

  try {
    const { name, phone, email, eventType, date, guests, message } = inquiry;
    
    const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Not specified';
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          New Inquiry from Zeonix eCards Website
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #4F46E5; margin-top: 0;">Customer Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <a href="tel:${phone}" style="color: #4F46E5; text-decoration: none;">${phone}</a>
              </td>
            </tr>
            ${email ? `<tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <a href="mailto:${email}" style="color: #4F46E5; text-decoration: none;">${email}</a>
              </td>
            </tr>` : ''}
          </table>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #4F46E5; margin-top: 0;">Event Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Event Type:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${eventType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Event Date:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${formattedDate}</td>
            </tr>
            ${guests ? `<tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Estimated Guests:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${guests}</td>
            </tr>` : ''}
          </table>
        </div>
        
        ${message ? `<div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #4F46E5; margin-top: 0;">Additional Message</h3>
          <p style="line-height: 1.6; color: #4a5568;">${message.replace(/\n/g, '<br>')}</p>
        </div>` : ''}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 14px;">
            This inquiry was submitted from the Zeonix eCards website on 
            ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}.
          </p>
          <p style="color: #718096; font-size: 14px;">
            <strong>Quick Actions:</strong><br>
            • <a href="https://wa.me/255699068552?text=Hello%20${encodeURIComponent(name)}%2C%20I%20saw%20your%20inquiry%20about%20${encodeURIComponent(eventType)}%20invitations.%20Let%27s%20discuss%20your%20requirements!" 
               style="color: #4F46E5; text-decoration: none;">Reply via WhatsApp</a><br>
            • <a href="tel:${phone}" style="color: #4F46E5; text-decoration: none;">Call the customer</a><br>
            ${email ? `• <a href="mailto:${email}" style="color: #4F46E5; text-decoration: none;">Send email response</a><br>` : ''}
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Zeonix eCards Website" <${EMAIL_FROM}>`,
      to: EMAIL_TO,
      subject: `New Inquiry: ${eventType} - ${name}`,
      html: htmlContent,
      text: `New inquiry from ${name} for ${eventType}. Phone: ${phone}${email ? `, Email: ${email}` : ''}. Event Date: ${date || 'Not specified'}. Guests: ${guests || 'Not specified'}. Message: ${message || 'None'}. Submitted: ${new Date().toISOString()}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Inquiry email sent:', info.messageId);
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send inquiry email:', error.message);
    return { ok: false, message: error.message };
  }
}

export function isEmailConfigured() {
  return transporter !== null && SMTP_USER && SMTP_PASSWORD;
}