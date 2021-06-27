const { app } = require('../../server/server');
const Controller = require('./controller');

const controller = new Controller();

app.get('/api/exchange', controller.getCurrency.bind(controller));

console.log('Imported route')
