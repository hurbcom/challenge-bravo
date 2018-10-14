const cluster = require('cluster');
const os = require('os');
const app = require('./src/app');
const { env } = require('./src/core/helpers');


const cpus = os.cpus();
if (cluster.isMaster) {
  cpus.forEach(() => {
    cluster.fork();
  });
  cluster.on('listening', (worker) => {
    console.log(`Cluster ${worker.process.pid} connected`);
  });
  cluster.on('disconnect', (worker) => {
    console.log(`Cluster ${worker.process.pid} disconnected`);
  });
  cluster.on('exit', (worker) => {
    console.log(`Cluster ${worker.process.pid} lost`);
    cluster.fork();
  });
} else {
  const server = app.listen(env.PORT || 3000, () => {
    const { port } = server.address();
    console.log(`CHALLENGE-BRAVO STARTED ON PORT: ${port}!`);
  });
}
