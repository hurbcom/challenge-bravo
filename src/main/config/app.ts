import express from 'express'
import configureRoutes from './routes'
import configureMiddlewares from './middlewares'
const app = express()

configureMiddlewares(app)
configureRoutes(app)

export default app
