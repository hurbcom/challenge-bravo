const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const { currencyRouter } = require('./routes/currencyRoutes')
const { conversionRouter } = require('./routes/conversionRoutes')

const app = new Koa()
app.use(bodyParser())
app.use(currencyRouter.routes())
app.use(conversionRouter.routes())

app.listen(3000)

console.log('Application is running on port 3000')
