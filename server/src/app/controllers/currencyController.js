const express = require('express')
const Currency = require('../models/currencyModel')

const router = express.Router()

router.get('/', async(req, res) => {
    console.log('O Servidor está ligado.');
    res.status(200).send('Seja bem vindo ao conversor de Moedas')
})


router.get(`/quotation/`, async (req, res) => {
    try {
        if ((req.query.from  &&  req.query.to && req.query.amount) == null) {
            return res.status(400).send('Não é possivel realizar a cotação com valores faltantes.')
        }
            if (req.query.from  ==  req.query.to) {
                return res.status(400).send('Não é possivel realizar cotação com a mesma moeda.')
            }

        
        const resultFrom = await Currency.findOne({name: JSON.parse(JSON.stringify(req.query.from))})
        const resulTo = await Currency.findOne({name: JSON.parse(JSON.stringify(req.query.to))})
        const amount = req.query.amount

        const quotCom = {com: JSON.parse((resultFrom.com * amount)/resulTo.com)}
        const quotTur = {tur: JSON.parse((resultFrom.tur * amount)/resulTo.tur)}  
        const quotPar = {par: JSON.parse((resultFrom.par * amount)/resulTo.par)}
        const quotation = {quotCom , quotTur, quotPar} 

        return res.status(200).send(quotation)
        
    } catch (error) {
        return res.status(400).send({error: 'Não é possivel realizar a cotação.'})
    }
});


router.post('/insertcoin', async(req, res) => {
    const { name } = req.body
    try {
        if (await Currency.findOne({ name })) {
            return res.status(400).send({error: 'This planet already exists'})
        }
        const currency = await Currency.create(req.body)
            return res.status(200).send({ currency })
            
    } catch (error) {
            return res.status(400).send({error: 'Registration Failed'})
    }
})



router.delete('/clear/:id', async(req, res) => {
    const id = {_id: req.params.id}
    try {
        if (await Currency.findOne(id) == null) {
            return res.status(400).send({error: 'Esta moeda não existe.'})
        }
        
        const currency = await Currency.findOneAndDelete(id)

        return res.status(200).send('Moeda apagada com sucesso.')

    } catch (error) {
        return res.status(400).send({error: 'Falha ao apagar registro.'})
    }
})


module.exports = app => app.use(router)