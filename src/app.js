import http from 'node:http';
import { URL } from 'node:url';
import { ClinicStore } from './store.js';

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' };

const send = (res, status, body) => {
  res.writeHead(status, jsonHeaders);
  res.end(JSON.stringify(body));
};

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });

const toInt = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const requiredFields = (obj, fields) => fields.filter((f) => !obj[f]);

export function createClinicServer() {
  const store = new ClinicStore();

  return http.createServer(async (req, res) => {
    const requestUrl = new URL(req.url, 'http://localhost');
    const { pathname, searchParams } = requestUrl;

    if (req.method === 'GET' && pathname === '/health') {
      return send(res, 200, { status: 'ok', service: 'clinic-api', timestamp: new Date().toISOString() });
    }

    if (req.method === 'GET' && pathname === '/api/doctors') {
      return send(res, 200, { data: store.doctors });
    }

    if (req.method === 'POST' && pathname === '/api/doctors') {
      try {
        const body = await parseBody(req);
        const missing = requiredFields(body, ['name', 'specialty', 'email']);
        if (missing.length) return send(res, 400, { error: `Missing fields: ${missing.join(', ')}` });
        const doctor = store.createDoctor(body);
        return send(res, 201, { data: doctor });
      } catch (err) {
        return send(res, 400, { error: err.message });
      }
    }

    if (req.method === 'GET' && pathname === '/api/patients') {
      return send(res, 200, { data: store.patients });
    }

    if (req.method === 'POST' && pathname === '/api/patients') {
      try {
        const body = await parseBody(req);
        const missing = requiredFields(body, ['name', 'email', 'phone']);
        if (missing.length) return send(res, 400, { error: `Missing fields: ${missing.join(', ')}` });
        const patient = store.createPatient(body);
        return send(res, 201, { data: patient });
      } catch (err) {
        return send(res, 400, { error: err.message });
      }
    }

    if (req.method === 'GET' && pathname === '/api/appointments') {
      const doctorId = toInt(searchParams.get('doctorId'));
      const patientId = toInt(searchParams.get('patientId'));
      const date = searchParams.get('date');

      const filtered = store.appointments.filter((appt) => {
        if (doctorId && appt.doctorId !== doctorId) return false;
        if (patientId && appt.patientId !== patientId) return false;
        if (date && !appt.startsAt.startsWith(date)) return false;
        return true;
      });

      return send(res, 200, { data: filtered });
    }

    if (req.method === 'POST' && pathname === '/api/appointments') {
      try {
        const body = await parseBody(req);
        const missing = requiredFields(body, ['doctorId', 'patientId', 'startsAt', 'reason']);
        if (missing.length) return send(res, 400, { error: `Missing fields: ${missing.join(', ')}` });

        const doctorId = toInt(body.doctorId);
        const patientId = toInt(body.patientId);
        const startsAt = new Date(body.startsAt);

        if (!doctorId || !patientId || Number.isNaN(startsAt.getTime())) {
          return send(res, 400, { error: 'Invalid doctorId, patientId, or startsAt' });
        }

        const doctor = store.doctors.find((d) => d.id === doctorId);
        const patient = store.patients.find((p) => p.id === patientId);
        if (!doctor) return send(res, 404, { error: 'Doctor not found' });
        if (!patient) return send(res, 404, { error: 'Patient not found' });

        const conflict = store.appointments.find((appt) => appt.doctorId === doctorId && appt.startsAt === startsAt.toISOString());
        if (conflict) return send(res, 409, { error: 'Doctor already has an appointment at that time' });

        const appointment = store.createAppointment({
          doctorId,
          patientId,
          startsAt: startsAt.toISOString(),
          reason: String(body.reason),
          notes: body.notes ? String(body.notes) : null
        });

        return send(res, 201, { data: appointment });
      } catch (err) {
        return send(res, 400, { error: err.message });
      }
    }

    if (req.method === 'DELETE' && pathname.startsWith('/api/appointments/')) {
      const id = toInt(pathname.split('/').pop());
      if (!id) return send(res, 400, { error: 'Invalid appointment id' });
      const index = store.appointments.findIndex((appt) => appt.id === id);
      if (index === -1) return send(res, 404, { error: 'Appointment not found' });
      const [removed] = store.appointments.splice(index, 1);
      return send(res, 200, { data: removed });
    }

    if (req.method === 'GET' && pathname === '/api/dashboard') {
      const upcoming = store.appointments
        .filter((a) => new Date(a.startsAt) >= new Date())
        .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))
        .slice(0, 5);
      return send(res, 200, {
        data: {
          doctors: store.doctors.length,
          patients: store.patients.length,
          appointments: store.appointments.length,
          upcoming
        }
      });
    }

    return send(res, 404, { error: 'Route not found' });
  });
}
