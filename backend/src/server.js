const app = require('./app')
const IntegrationController = require('./app/controllers/IntegrationController')
const truncate = require("./utils/truncate");


app.listen(process.env.PORT || 3000,async ()=>{
    await truncate();
    IntegrationController.getCurrencies()
})
