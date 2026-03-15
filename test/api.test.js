const http = require('node:http');
const test = require('node:test');
const assert = require('node:assert/strict');

const { handler } = require('../src/app');

async function request(path, options = {}) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}${path}`, options);
  const body = await response.json();

  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

  return { response, body };
}

test('GET /api/health returns ok status', async () => {
  const { response, body } = await request('/api/health');

  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');
});

test('GET /api/services returns seeded services', async () => {
  const { response, body } = await request('/api/services');

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(body.data));
  assert.ok(body.data.length >= 1);
});

test('POST /api/appointments validates service IDs', async () => {
  const { response, body } = await request('/api/appointments', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      patientName: 'Alice',
      email: 'alice@example.com',
      phone: '123',
      preferredDate: '2027-01-01T10:00:00.000Z',
      serviceId: 'missing-service',
    }),
  });

  assert.equal(response.status, 400);
  assert.ok(body.errors.includes('serviceId does not match any available service.'));
});

test('POST /api/contact accepts valid payload', async () => {
  const { response, body } = await request('/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Bob',
      email: 'bob@example.com',
      message: 'Hello!',
    }),
  });

  assert.equal(response.status, 201);
  assert.equal(body.message, 'Contact message received successfully.');
});
