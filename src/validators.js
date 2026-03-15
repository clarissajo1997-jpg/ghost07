function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidDate(value) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function validateAppointment(payload = {}) {
  const errors = [];

  if (!isNonEmptyString(payload.patientName)) {
    errors.push('patientName is required.');
  }

  if (!isValidEmail(payload.email)) {
    errors.push('A valid email is required.');
  }

  if (!isNonEmptyString(payload.phone)) {
    errors.push('phone is required.');
  }

  if (!isValidDate(payload.preferredDate)) {
    errors.push('preferredDate must be a valid date string.');
  }

  if (!isNonEmptyString(payload.serviceId)) {
    errors.push('serviceId is required.');
  }

  return errors;
}

function validateContactMessage(payload = {}) {
  const errors = [];

  if (!isNonEmptyString(payload.name)) {
    errors.push('name is required.');
  }

  if (!isValidEmail(payload.email)) {
    errors.push('A valid email is required.');
  }

  if (!isNonEmptyString(payload.message)) {
    errors.push('message is required.');
  }

  return errors;
}

module.exports = {
  validateAppointment,
  validateContactMessage,
};
