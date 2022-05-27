const { Router } = require('express')
const updateQuotation = require('../controller/updateQuotation')
const utils = require('../util')
const router = Router()

router.put('/quote', async (req, res) => {
    try {
        const response = await updateQuotation.byAPI()
        res.status(response.status).json(response)
    } catch (error) {
        const response = utils.responseError(error)
        res.status(response.status).json(response)
        console.error(error)
    }
})

router.put('/quote/:code', async (req, res) => {
    try {
        const { code } = req.params
        const { buy, sale } = req.body
        const quote = { coinCode: code, buy, sale }

        const result = await updateQuotation.manual(quote)

        res.status(result.status).json(result)

    } catch (error) {
        const response = utils.responseError(error)
        res.status(response.status).json(response)
        console.error(error)
    }

})

module.exports = router