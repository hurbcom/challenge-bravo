const { Router } = require('express')
const controllerConverter = require('../controller/converter')
const utils = require('../util')
const router = Router()


router.get('/converter', async (req, res) => {
    try {
        const {from, to, value, type} = req.query
        const converterValue = {from, to, value, type}

        const response = await controllerConverter.calculate(converterValue)

        res.status(response.status).json(response)
        console.log('Calculo efetuado com sucesso')
    } catch (error) {
        const response = utils.responseError(error)
        res.status(response.status).json(response)
        console.error(error)
    }
})




module.exports = router