# Clinic Backend API

A complete starter backend for clinic management using Node.js built-in modules only (no external dependencies).

## Features
- Health check endpoint.
- Doctor and patient creation/listing.
- Appointment scheduling with conflict prevention per doctor/time.
- Appointment filtering by doctor, patient, and date.
- Appointment cancellation.
- Simple dashboard summary endpoint.

## Run
```bash
npm start
```

## Test
```bash
npm test
```

## API Endpoints

### Health
- `GET /health`

### Doctors
- `GET /api/doctors`
- `POST /api/doctors`

### Patients
- `GET /api/patients`
- `POST /api/patients`

### Appointments
- `GET /api/appointments?doctorId=1&patientId=2&date=2026-03-14`
- `POST /api/appointments`
- `DELETE /api/appointments/:id`

### Dashboard
- `GET /api/dashboard`

## Example appointment payload
```json
{
  "doctorId": 1,
  "patientId": 1,
  "startsAt": "2026-03-14T10:00:00.000Z",
  "reason": "Routine checkup",
  "notes": "Patient requested blood pressure review"
}
```
