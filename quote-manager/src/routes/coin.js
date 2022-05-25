const { Router } = require('express')
const controllerCoin = require('../controller/coin')
const utils = require('../util')
const router = Router()

router.get('/coin/list', async (req, res) => {
    try {
        const { type } = req.query

        const response = await controllerCoin.getAll(type)
        res.status(response.status).json(response)

        console.log("Busca efetuada com sucesso" + type ? " - type: " + type : '')
    } catch (error) {
        const response = utils.responseError(error)
        res.status(response.status).json(response)
        console.error(error)
    }
})

router.get('/coin/:code', async (req, res) => {
    try {
        const { code } = req.params

        const response = await controllerCoin.getCoin(code)
        res.status(response.status).json(response)

        console.log("Busca efetuada com sucesso - coinCode: " + code)
    } catch (error) {
        const response = utils.responseError(error)
        res.status(response.status).json(response)
        console.error(error)
    }
})

router.post('/coin', async (req, res) => {
    try {
        const { coinCode, coinName, type, quote } = req.body
        const coin = { coinCode, coinName, type, quote }

        const response = await controllerCoin.add(coin)
        res.status(response.status).json(response)

        console.log("Moeda criada com sucesso - coinCode: " + coinCode)
    } catch (error) {
        const response = utils.responseError(error)
        res.status(response.status).json(response)
        console.error(error)
    }
})

router.put('/coin/:code', async (req, res) => {
    try {
        const { code } = req.params
        const { coinName, type, quote } = req.body
        const coin = { coinName, type, quote }

        const response = await controllerCoin.update(code, coin)
        res.status(response.status).json(response)

        console.log("Moeda atualizada com sucesso - coinCode: " + code)
    } catch (error) {
        const response = utils.responseError(error)
        res.status(response.status).json(response)
        console.error(error)
    }
})

router.delete('/coin/:code', async (req, res) => {
    try {
        const { code } = req.params

        const response = await controllerCoin.delete(code)
        res.status(response.status).json(response)

        console.log("Moeda removida com sucesso - coinCode: " + code)
    } catch (error) {
        const response = utils.responseError(error)
        res.status(response.status).json(response)
        console.error(error)
    }
})

module.exports = router