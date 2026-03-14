import test from 'node:test';
import assert from 'node:assert/strict';
import { createClinicServer } from '../src/app.js';

const startServer = () =>
  new Promise((resolve) => {
    const server = createClinicServer();
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${addr.port}` });
    });
  });

const stopServer = (server) => new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));

test('clinic API supports doctor, patient, and appointment flow', async () => {
  const { server, baseUrl } = await startServer();

  try {
    const health = await fetch(`${baseUrl}/health`);
    assert.equal(health.status, 200);

    const doctorRes = await fetch(`${baseUrl}/api/doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Dr. House', specialty: 'Diagnostics', email: 'house@example.com' })
    });
    assert.equal(doctorRes.status, 201);
    const doctor = (await doctorRes.json()).data;

    const patientRes = await fetch(`${baseUrl}/api/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Jane Roe', email: 'jane@example.com', phone: '+1-555-2121' })
    });
    assert.equal(patientRes.status, 201);
    const patient = (await patientRes.json()).data;

    const startsAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const appointmentRes = await fetch(`${baseUrl}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId: doctor.id, patientId: patient.id, startsAt, reason: 'Routine checkup' })
    });
    assert.equal(appointmentRes.status, 201);

    const conflictRes = await fetch(`${baseUrl}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId: doctor.id, patientId: patient.id, startsAt, reason: 'Conflict checkup' })
    });
    assert.equal(conflictRes.status, 409);

    const dashboardRes = await fetch(`${baseUrl}/api/dashboard`);
    assert.equal(dashboardRes.status, 200);
    const dashboard = (await dashboardRes.json()).data;
    assert.ok(dashboard.appointments >= 1);
  } finally {
    await stopServer(server);
  }
});
