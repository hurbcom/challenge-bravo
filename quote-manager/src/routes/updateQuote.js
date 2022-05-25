const {Router} = require('express')
const updateQuotation = require('../controller/updateQuotation')
const utils = require('../util')
const router = Router()

router.put('/quote', (req,res)=>{
    res.status(200).json("Requisição recebida")
    updateQuotation.byAPI()
})

router.put('/quote/manual', async (req,res)=>{
    try {
        const {coin, buy, sale} = req.body
        const quote = {coinCode: coin, buy, sale}

        const result = await updateQuotation.manual(quote)

        res.status(result.status).json(result)

    } catch (error) {
        const response = utils.responseError(error)
        res.status(response.status).json(response)
        console.error(error)
    }

})

module.exports = router