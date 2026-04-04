# Pauline & NG Dental Backend

This repository contains a simple Node.js backend API for the Pauline & NG Dental website.

## Features

- Health endpoint for uptime checks
- Services endpoint to list clinic services
- Price list endpoint with post-ready text
- Appointment request endpoint with validation
- Contact form endpoint with validation
- CORS support and JSON responses without external dependencies

## API Endpoints

- `GET /api/health`
- `GET /api/services`
- `GET /api/price-list`
- `GET /api/price-list/post`
- `GET /api/appointments`
- `POST /api/appointments`
- `GET /api/contact`
- `POST /api/contact`

### Example appointment request

```json
{
  "patientName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1-555-123-4567",
  "preferredDate": "2026-08-03T10:00:00.000Z",
  "serviceId": "svc-general-dentistry",
  "notes": "Morning schedule preferred"
}
```

### Example contact request

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1-555-987-6543",
  "subject": "Insurance question",
  "message": "Do you accept dental insurance plans?"
}
```

## Run locally

```bash
npm run dev
```

Server starts on `http://localhost:3000` by default.
