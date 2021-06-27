const { app } = require('../../server/server');
const Controller = require('./controller');

const controller = new Controller();

app.post('/api/coin', controller.addCoin.bind(controller));
app.patch('/api/coin', controller.updateCoin.bind(controller));
app.del('/api/coin', controller.deleteCoin.bind(controller));

console.log('Imported route')
