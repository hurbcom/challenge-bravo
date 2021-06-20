const { app } = require('../../server/server');
const Controller = require('./controller');

const controller = new Controller();

app.get('/api/coin', controller.getCurrency.bind(controller));

console.log('Imported route')
