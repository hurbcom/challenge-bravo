const Controller = require('../controllers/MoedasController');

module.exports = function(app) {
    app.post('/api/v1/moedas', Controller.Create);
    app.get('/api/v1/moedas', Controller.FindAll);
    app.get('/api/v1/moedas/converter', Controller.Converter);
    app.delete('/api/v1/moedas/:id', Controller.Remove);
}