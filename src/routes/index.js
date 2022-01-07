import express from 'express'
import * as currencyController from '../controllers/currencyController.js'

const route = express.Router()

route.get('/health', (req, res) => {
    res.json({ status: 'UP!' })
})

route.get('/currency', currencyController.getAllCurrency)
route.get('/currency/conversion', currencyController.convertCurrency)
route.post('/currency', currencyController.createCurrency)
route.delete('/currency/:currencyCode', currencyController.deleteCurrency)

export default route
