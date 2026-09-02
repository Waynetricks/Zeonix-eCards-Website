const allowedEventTypes = new Set([
  'Wedding',
  'Birthday',
  'Send-off',
  'Kitchen Party',
  'Graduation',
  'Custom Event',
]);

// Input sanitization and validation utilities
function sanitizeString(value, maxLength = 500) {
  if (typeof value !== 'string') return '';
  let trimmed = value.trim();
  // Basic HTML escaping to prevent XSS
  trimmed = trimmed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  // Limit length
  if (trimmed.length > maxLength) {
    trimmed = trimmed.substring(0, maxLength);
  }
  return trimmed;
}

function validateName(name) {
  if (!name) return { isValid: false, message: 'Full name is required.' };
  if (name.length < 2) return { isValid: false, message: 'Name must be at least 2 characters.' };
  if (name.length > 100) return { isValid: false, message: 'Name cannot exceed 100 characters.' };
  // Allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-'.]+$/.test(name)) {
    return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes.' };
  }
  return { isValid: true, value: name };
}

function validateEmail(email) {
  if (!email) return { isValid: true, value: '', message: '' }; // Email is optional
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please provide a valid email address (e.g., name@example.com).' };
  }
  
  if (email.length > 254) {
    return { isValid: false, message: 'Email address is too long.' };
  }
  
  return {
    isValid: true,
    value: email.trim().toLowerCase()
  };
}

function validatePhone(phone) {
  if (!phone) return { isValid: false, message: 'Phone or WhatsApp number is required.' };
  
  // Remove all non-digit characters except + for international numbers
  const cleanedPhone = phone.replace(/[^\d+]/g, '');
  
  // Tanzanian phone number validation (local and international)
  const tzPhoneRegex = /^(?:\+?255|0)?[67]\d{8}$/;
  const isValid = tzPhoneRegex.test(cleanedPhone);
  
  if (!isValid) {
    return { 
      isValid: false, 
      message: 'Please enter a valid Tanzanian phone number (e.g., 0699 068 552 or +255699068552).' 
    };
  }
  
  // Format: ensure it starts with +255 for consistency
  let formattedPhone = cleanedPhone;
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '+255' + formattedPhone.substring(1);
  } else if (!formattedPhone.startsWith('+')) {
    formattedPhone = '+255' + formattedPhone;
  }
  
  return {
    isValid: true,
    value: formattedPhone
  };
}

function validateEventType(eventType) {
  if (!eventType) {
    return { isValid: false, message: 'Event type is required.' };
  }
  
  if (!allowedEventTypes.has(eventType)) {
    return { 
      isValid: false, 
      message: `Please select a valid event type from: ${Array.from(allowedEventTypes).join(', ')}.` 
    };
  }
  
  return { isValid: true, value: eventType };
}

function validateDate(date) {
  if (!date) return { isValid: true, value: '', message: '' };
  
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return { isValid: false, message: 'Please enter a valid date.' };
    }
    
    // Ensure date is not in the past (optional, could be relaxed for event planning)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) {
      return { 
        isValid: false, 
        message: 'Event date cannot be in the past. Please select a future date.' 
      };
    }
    
    // Format as YYYY-MM-DD
    const formattedDate = parsedDate.toISOString().split('T')[0];
    return { isValid: true, value: formattedDate };
  } catch {
    return { isValid: false, message: 'Please enter a valid date in YYYY-MM-DD format.' };
  }
}

function validateGuests(guests) {
  if (!guests) return { isValid: true, value: '', message: '' };
  
  const guestsNum = parseInt(guests, 10);
  if (isNaN(guestsNum)) {
    return { isValid: false, message: 'Please enter a valid number for estimated guests.' };
  }
  
  if (guestsNum < 1) {
    return { isValid: false, message: 'Number of guests must be at least 1.' };
  }
  
  if (guestsNum > 10000) {
    return { isValid: false, message: 'Number of guests cannot exceed 10,000.' };
  }
  
  return { isValid: true, value: guestsNum.toString() };
}

function validateMessage(message) {
  if (!message) return { isValid: true, value: '', message: '' };
  
  if (message.length > 1000) {
    return { 
      isValid: false, 
      message: 'Message cannot exceed 1000 characters.' 
    };
  }
  
  return { isValid: true, value: message };
}

export function validateInquiry(payload = {}) {
  // Step 1: Sanitize all inputs
  const sanitizedPayload = {
    name: sanitizeString(payload.name, 100),
    phone: sanitizeString(payload.phone, 20),
    email: sanitizeString(payload.email, 254),
    eventType: sanitizeString(payload.eventType, 50),
    date: sanitizeString(payload.date, 20),
    guests: sanitizeString(payload.guests, 10),
    message: sanitizeString(payload.message, 1000),
  };

  // Step 2: Validate each field
  const validations = {
    name: validateName(sanitizedPayload.name),
    phone: validatePhone(sanitizedPayload.phone),
    email: validateEmail(sanitizedPayload.email),
    eventType: validateEventType(sanitizedPayload.eventType),
    date: validateDate(sanitizedPayload.date),
    guests: validateGuests(sanitizedPayload.guests),
    message: validateMessage(sanitizedPayload.message),
  };

  // Step 3: Check for validation errors
  const errors = [];
  for (const [field, validation] of Object.entries(validations)) {
    if (!validation.isValid && validation.message) {
      errors.push(validation.message);
    }
  }

  if (errors.length > 0) {
    return { 
      ok: false, 
      message: errors[0], // Return first error for simplicity
      details: errors // All errors for debugging
    };
  }

  // Step 4: Prepare cleaned data
  return {
    ok: true,
    cleaned: {
      name: validations.name.value,
      phone: validations.phone.value,
      email: validations.email.value,
      eventType: validations.eventType.value,
      date: validations.date.value,
      guests: validations.guests.value,
      message: validations.message.value,
      createdAt: new Date().toISOString(),
    },
    validationDetails: {
      allFieldsValid: true,
      timestamp: new Date().toISOString(),
    }
  };
}
