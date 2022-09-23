import express, { json } from 'express'
import './setup.js'
import 'express-async-errors'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import initRedis from './db.js'
import router from './routes/routes.js'
import errorHandler from './middlewares/errorHandlingMiddleware.js'
import swaggerDocs from '../swagger.json' assert { type: 'json' }

const app = express()

app.use(cors())
app.use(json())
app.use(router)
app.use('/api-documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(errorHandler)

export function init() {
    initRedis()
    return Promise.resolve(app)
}

export default app