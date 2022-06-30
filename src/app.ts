import express from 'express'
import { appRoutes } from './routes'
import { errorMiddleware } from './middlewares/error.middleware'
import { Request, Response } from 'express'

const app = express()

app.use(express.json())

appRoutes(app)

app.get('/', (req: Request, res: Response) => {
    
    res.status(200).json({
        message: "Hello World"
    })
})

app.use(errorMiddleware)

export default app;