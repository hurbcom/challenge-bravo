import express, { json } from 'express'
import './setup.js'
import cors from 'cors'
import initRedis from './db.js'

const app = express()

app.use(cors())
app.use(json())

export function init() {
    initRedis()
    return Promise.resolve(app)
}

export default app
