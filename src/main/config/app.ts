import express from 'express'
import configureRoutes from './routes'

const app = express()
configureRoutes(app)

export default app
