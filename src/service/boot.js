const app = require('../app');
const config = require('../config/index');
const { CronJob } = require('cron');
const { convertImport } = require('./api');

module.exports = (err) => {
  console.clear();
  if (err) {
    return console.log(err);
  }
  app.listen(config.app.port, (err) => {
    if (err) {
      return console.log('erro');
    }
    console.log(`Iniciou em http://localhost:${config.app.port}`);
  });

  const updateJob = new CronJob('*/15 * * * *', () => {
    convertImport()
        .then((data) => console.log("Import Data Finished"))
        .catch((err) => console.error(err));
}, null, true, 'America/Sao_Paulo');

updateJob.start();

};