/* eslint-disable no-console */
require('dotenv/config');
const os = require('os');
const cluster = require('cluster');
const createServer = require('./src/app');

const PORT = process.env.PORT || 3000;
const clusterWorkerSize = os.cpus().length;

if (clusterWorkerSize > 1) {
    if (cluster.isMaster) {
        for (let i = 0; i < clusterWorkerSize; i += 1) {
            cluster.fork();
        }

        cluster.on('exit', (worker) => {
            console.log('Worker', worker.id, ' has exitted.');
        });
    } else {
        const app = createServer();

        app.listen(PORT, (error) => {
            if (!error) {
                console.log(`Express server listening on port ${PORT} and worker ${process.pid}`);
            } else {
                console.log('Error occured, server can\'t start', error);
            }
        });
    }
} else {
    const app = createServer();

    app.listen(PORT, (error) => {
        if (!error) {
            console.log(`Express server listening on port ${PORT} with the single worker ${process.pid}`);
        } else {
            console.log('Error occured, server can\'t start', error);
        }
    });
}
