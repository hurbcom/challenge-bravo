const app = require('./app');
const config = require('./config/config');

let server;
server = app.listen(config.server_port, () => {
    console.log('Run server')
});

process.on('SIGTERM', () => {
  if (server) {
    server.close();
  }
});
