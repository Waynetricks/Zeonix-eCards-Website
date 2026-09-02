// Environment variable checker
// Run with: node server/check-env.mjs

import 'dotenv/config';
import { isEmailConfigured } from './email-service.mjs';

console.log('=== Zeonix eCards Environment Check ===\n');

// Check required variables
const requiredVars = [
  'SMTP_HOST',
  'SMTP_PORT', 
  'SMTP_USER',
  'SMTP_PASSWORD',
  'EMAIL_FROM',
  'EMAIL_TO'
];

console.log('Required Environment Variables:');
let allPresent = true;

for (const varName of requiredVars) {
  const value = process.env[varName];
  const isPresent = value && value.trim() !== '';
  const status = isPresent ? '✓' : '✗';
  
  if (isPresent) {
    // Show first few chars for sensitive values
    const displayValue = varName.includes('PASSWORD') 
      ? '•'.repeat(Math.min(value.length, 8))
      : varName.includes('EMAIL') || varName.includes('USER')
        ? value
        : value;
    
    console.log(`  ${status} ${varName.padEnd(20)} = ${displayValue}`);
  } else {
    console.log(`  ${status} ${varName.padEnd(20)} = (MISSING)`);
    allPresent = false;
  }
}

console.log('\nOptional Environment Variables:');
const optionalVars = ['PORT', 'NODE_ENV', 'VITE_CONTACT_API_URL'];
for (const varName of optionalVars) {
  const value = process.env[varName] || '(not set)';
  console.log(`  ${varName.padEnd(20)} = ${value}`);
}

console.log('\n=== Email Service Status ===');
if (isEmailConfigured()) {
  console.log('✓ Email service is CONFIGURED and READY');
  console.log(`  Host: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
  console.log(`  From: ${process.env.EMAIL_FROM}`);
  console.log(`  To: ${process.env.EMAIL_TO}`);
} else {
  console.log('✗ Email service is NOT CONFIGURED');
  console.log('  Set SMTP_USER and SMTP_PASSWORD in .env to enable email notifications');
}

console.log('\n=== Server Configuration ===');
console.log(`Port: ${process.env.PORT || 3001}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`API URL: ${process.env.VITE_CONTACT_API_URL || '/api/contact'}`);

console.log('\n=== Recommendations ===');
if (!allPresent) {
  console.log('1. Copy .env.example to .env');
  console.log('2. Fill in missing values (especially email credentials)');
  console.log('3. For Gmail: Generate an App Password at https://myaccount.google.com/apppasswords');
} else {
  console.log('✓ All required environment variables are set');
  console.log('✓ Email notifications will be sent for form submissions');
  console.log('✓ Run "npm run dev" to start the application');
}

process.exit(allPresent ? 0 : 1);