import test from 'node:test';
import assert from 'node:assert/strict';

import { validateInquiry } from './contact-service.mjs';

test('validateInquiry rejects missing required details', () => {
  const result = validateInquiry({
    name: '',
    phone: '',
    eventType: '',
  });

  assert.equal(result.ok, false);
  assert.match(result.message, /name/i);
});

test('validateInquiry accepts valid inquiry payloads', () => {
  const result = validateInquiry({
    name: 'Neema Mushi',
    phone: '0699 000 000',
    eventType: 'Wedding',
    message: 'Need a green and white invite',
  });

  assert.equal(result.ok, true);
});

test('validateInquiry accepts valid email when provided', () => {
  const result = validateInquiry({
    name: 'John Doe',
    phone: '+255699068552',
    eventType: 'Birthday',
    email: 'john@example.com',
  });

  assert.equal(result.ok, true);
  assert.equal(result.cleaned.email, 'john@example.com');
});

test('validateInquiry rejects invalid email', () => {
  const result = validateInquiry({
    name: 'John Doe',
    phone: '0699068552',
    eventType: 'Birthday',
    email: 'invalid-email',
  });

  assert.equal(result.ok, false);
  assert.match(result.message, /email/i);
});

test('validateInquiry validates phone numbers', () => {
  const result1 = validateInquiry({
    name: 'Test User',
    phone: '0699',
    eventType: 'Wedding',
  });

  const result2 = validateInquiry({
    name: 'Test User',
    phone: '+255699068552',
    eventType: 'Wedding',
  });

  assert.equal(result1.ok, false);
  assert.equal(result2.ok, true);
});

test('validateInquiry formats phone numbers correctly', () => {
  const result = validateInquiry({
    name: 'Test User',
    phone: '0699 068 552',
    eventType: 'Graduation',
  });

  assert.equal(result.ok, true);
  assert.equal(result.cleaned.phone, '+255699068552');
});

test('validateInquiry validates name length', () => {
  const result1 = validateInquiry({
    name: 'A', // Too short
    phone: '0699068552',
    eventType: 'Wedding',
  });

  const result2 = validateInquiry({
    name: 'Valid Name',
    phone: '0699068552',
    eventType: 'Wedding',
  });

  assert.equal(result1.ok, false);
  assert.equal(result2.ok, true);
});

test('validateInquiry validates date format', () => {
  const result1 = validateInquiry({
    name: 'Test User',
    phone: '0699068552',
    eventType: 'Wedding',
    date: 'invalid-date',
  });

  const result2 = validateInquiry({
    name: 'Test User',
    phone: '0699068552',
    eventType: 'Wedding',
    date: '2026-12-31',
  });

  assert.equal(result1.ok, false);
  assert.equal(result2.ok, true);
});

test('validateInquiry validates guest numbers', () => {
  const result1 = validateInquiry({
    name: 'Test User',
    phone: '0699068552',
    eventType: 'Wedding',
    guests: '0',
  });

  const result2 = validateInquiry({
    name: 'Test User',
    phone: '0699068552',
    eventType: 'Wedding',
    guests: '150',
  });

  assert.equal(result1.ok, false);
  assert.equal(result2.ok, true);
});

test('validateInquiry sanitizes inputs', () => {
  const result = validateInquiry({
    name: 'Test User', // Valid name without special characters
    phone: '0699 068 552',
    eventType: 'Wedding',
    message: 'Test message with <b>HTML</b> and <script>alert("xss")</script>',
  });

  assert.equal(result.ok, true);
  // Check that HTML was escaped in message (sanitizeString converts < to &lt; etc.)
  assert(!result.cleaned.message.includes('<script>'));
  assert(!result.cleaned.message.includes('<b>'));
  // Actually check for escaped versions
  assert(result.cleaned.message.includes('&lt;script&gt;'));
  assert(result.cleaned.message.includes('&lt;b&gt;'));
});