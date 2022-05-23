const {Router} = require('express')
const updateQuotation = require('../controller/updateQuotation')
const utils = require('../util')
const router = Router()

router.put('/quote', (req,res)=>{
    res.status(200).send("Requisição recebida")
    updateQuotation.byAPI()
})

router.put('/quote/fixe', (req,res)=>{
    try {
        const {coin, buy, sale} = req.body
        const quote = {coin, buy, sale}
        updateQuotation.fixe(quote)
        res.status(200).send()
    } catch (error) {
        const response = utils.responseError(error)
        res.status(response.status).json(response)
    }

})

module.exports = router