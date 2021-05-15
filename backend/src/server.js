const app = require('./app')
const IntegrationController = require('./app/controllers/IntegrationController')
const truncate = require("./utils/truncate");
var cors = require('cors')

const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('../swagger.json');

app.use(cors({
    origin: '*'
}));


app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.listen(process.env.PORT || 3000,async ()=>{
    IntegrationController.getCurrencies()
})
