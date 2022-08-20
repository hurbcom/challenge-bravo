import express, { json } from 'express'
import './setup.js'
import 'express-async-errors'
import cors from 'cors'
import initRedis from './db.js'
import router from './routes/routes.js'
import errorHandler from './middlewares/errorHandlingMiddleware.js'

const app = express()

app.use(cors())
app.use(json())
app.use(router)
app.use(errorHandler)

export function init() {
    initRedis()
    return Promise.resolve(app)
}

export default app