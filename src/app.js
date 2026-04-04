const { URL } = require('node:url');
const {
  services,
  priceList,
  priceListPostText,
  appointments,
  contactMessages,
} = require('./data/store');
const { validateAppointment, validateContactMessage } = require('./validators');

function json(res, status, payload) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type',
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(new Error('Invalid JSON payload.'));
      }
    });

    req.on('error', reject);
  });
}

async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'access-control-allow-headers': 'content-type',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    json(res, 200, {
      status: 'ok',
      service: 'Pauline & NG Dental API',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/services') {
    json(res, 200, { data: services });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/price-list') {
    json(res, 200, { data: priceList });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/price-list/post') {
    json(res, 200, { data: { text: priceListPostText } });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/appointments') {
    json(res, 200, { data: appointments });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/appointments') {
    try {
      const payload = await readJsonBody(req);
      const errors = validateAppointment(payload);
      const serviceExists = services.some((service) => service.id === payload.serviceId);

      if (!serviceExists) {
        errors.push('serviceId does not match any available service.');
      }

      if (errors.length > 0) {
        json(res, 400, { errors });
        return;
      }

      const appointment = {
        id: `apt-${Date.now()}`,
        patientName: payload.patientName.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone.trim(),
        preferredDate: new Date(payload.preferredDate).toISOString(),
        serviceId: payload.serviceId,
        notes: typeof payload.notes === 'string' ? payload.notes.trim() : '',
        createdAt: new Date().toISOString(),
      };

      appointments.push(appointment);

      json(res, 201, {
        message: 'Appointment request submitted successfully.',
        data: appointment,
      });
      return;
    } catch (error) {
      json(res, 400, { errors: [error.message] });
      return;
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/contact') {
    json(res, 200, { data: contactMessages });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/contact') {
    try {
      const payload = await readJsonBody(req);
      const errors = validateContactMessage(payload);

      if (errors.length > 0) {
        json(res, 400, { errors });
        return;
      }

      const message = {
        id: `msg-${Date.now()}`,
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: typeof payload.phone === 'string' ? payload.phone.trim() : '',
        subject: typeof payload.subject === 'string' ? payload.subject.trim() : 'General Inquiry',
        message: payload.message.trim(),
        createdAt: new Date().toISOString(),
      };

      contactMessages.push(message);

      json(res, 201, {
        message: 'Contact message received successfully.',
        data: message,
      });
      return;
    } catch (error) {
      json(res, 400, { errors: [error.message] });
      return;
    }
  }

  json(res, 404, { error: 'Route not found' });
}

module.exports = {
  handler,
};
