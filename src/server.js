const http = require('node:http');
const { handler } = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  handler(req, res);
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Pauline & NG Dental backend running on port ${port}`);
});
