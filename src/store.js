export class ClinicStore {
  constructor() {
    this.doctors = [];
    this.patients = [];
    this.appointments = [];
    this.ids = { doctor: 1, patient: 1, appointment: 1 };
    this.seed();
  }

  seed() {
    this.createDoctor({ name: 'Dr. Anya Patel', specialty: 'Cardiology', email: 'anya.patel@clinic.local' });
    this.createDoctor({ name: 'Dr. Leo Kim', specialty: 'Pediatrics', email: 'leo.kim@clinic.local' });
    this.createPatient({ name: 'Maria Lopez', email: 'maria.lopez@example.com', phone: '+1-555-3001' });
    this.createPatient({ name: 'David Owen', email: 'david.owen@example.com', phone: '+1-555-3002' });
  }

  createDoctor(payload) {
    const doctor = { id: this.ids.doctor++, ...payload, createdAt: new Date().toISOString() };
    this.doctors.push(doctor);
    return doctor;
  }

  createPatient(payload) {
    const patient = { id: this.ids.patient++, ...payload, createdAt: new Date().toISOString() };
    this.patients.push(patient);
    return patient;
  }

  createAppointment(payload) {
    const appointment = { id: this.ids.appointment++, status: 'scheduled', ...payload, createdAt: new Date().toISOString() };
    this.appointments.push(appointment);
    return appointment;
  }
}
