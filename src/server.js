import { createClinicServer } from './app.js';

const port = Number(process.env.PORT) || 3000;
const server = createClinicServer();

server.listen(port, '0.0.0.0', () => {
  console.log(`Clinic API running on http://0.0.0.0:${port}`);
});
