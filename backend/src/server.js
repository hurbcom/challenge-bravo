const app = require('./app')
const IntegrationController = require('./app/controllers/IntegrationController')
const truncate = require("./utils/truncate");

const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('../swagger.json');

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );

app.listen(process.env.PORT || 3000,async ()=>{
    IntegrationController.getCurrencies()
})
