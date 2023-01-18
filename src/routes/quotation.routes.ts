import { Router } from 'express'
import quotationApi from '../services/api'

const quotationRouter = Router()

quotationRouter.get('/', async (req, res) => {
    const response = await quotationApi.get('/last/USD-BRL')
    res.json(response.data)
})

export { quotationRouter }