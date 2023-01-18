
import express from 'express'

import { quotationRouter } from './routes/quotation.routes';

const app = express()

app.use(quotationRouter)

app.listen(3333, () => console.log('server running on port 3333'))