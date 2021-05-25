const cron = require('node-cron');
const app = require('./app');
const config = require('./config/config');
const integration = require('./app/helpers/integration');

let server;
// eslint-disable-next-line prefer-const
server = app.listen(config.server_port, () => {});

cron.schedule('* 1 * * *', async () => {
  integration.run();
});

process.on('SIGTERM', () => {
  if (server) {
    server.close();
  }
});
