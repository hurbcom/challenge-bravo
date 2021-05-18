const app = require('./app');
const config = require('./config/config');

let server;
// eslint-disable-next-line prefer-const
server = app.listen(config.server_port, () => {});

process.on('SIGTERM', () => {
    if (server) {
        server.close();
    }
});
