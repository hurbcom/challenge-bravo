const express = require('express')
const Currency = require('../models/currencyModel')

const router = express.Router()

router.get('/', async(req, res) => {
    console.log('O Servidor está ligado.');
    res.status(200).send('Seja bem vindo ao conversor de Moedas')
})

// Endereço para a realização da cotação
router.get(`/quotation/`, async (req, res) => {
    // Realiza-se verificações de segurança e aprovação.
    try {
        if ((req.query.from  &&  req.query.to && req.query.amount) == null) {
            return res.status(400).send('Não é possivel realizar a cotação com valores faltantes.')
        }
            if (req.query.from  ==  req.query.to) {
                return res.status(400).send('Não é possivel realizar cotação com a mesma moeda.')
            }

        // Realiza a presquiza para dos parametros de FROM e TO
        const resultFrom = await Currency.findOne({name: JSON.parse(JSON.stringify(req.query.from))})
        const resulTo = await Currency.findOne({name: JSON.parse(JSON.stringify(req.query.to))})

        // Guarda o valor de AMOUNT
        const amount = req.query.amount

        // Realiza o cálculo de cotação
        const quotCom = {com: JSON.parse((resultFrom.com * amount)/resulTo.com)}
        const quotTur = {tur: JSON.parse((resultFrom.tur * amount)/resulTo.tur)}  
        const quotPar = {par: JSON.parse((resultFrom.par * amount)/resulTo.par)}

        // Consolida os valores para a resposta
        const quotation = {quotCom , quotTur, quotPar} 

        // A Resposta é dada
        return res.status(200).send(quotation)
        
    } catch (error) {
        // Caso haja um erro...
        return res.status(400).send({error: 'Não é possivel realizar a cotação.'})
    }
});


router.post('/insertcoin', async(req, res) => {
    // Recolhe a Chave de name e realiza a contagem de caracter.
    const { name } = req.body
    const countChar = {name}    
    
    // Realiza-se verificações de segurança e aprovação.
    try {
        if (await (countChar.name).length != 3 ) {
            return res.status(400).send({error: 'Insira a sigla da moeda com 3 caracteres'})
            }    
                if (await Currency.findOne({ name })) {
                    return res.status(400).send({error: 'Esta moeda já existe.'})
                }
                    // Realiza a inserção da informação e responde ao usuário
                    const currency = await Currency.create(req.body)
                        return res.status(200).send('Moeda inserida com sucesso.')

    } catch (error) {
            // Caso haja um erro...
            return res.status(400).send({error: 'Falha ao registrar.'})
    }
})



router.delete('/clear/:id', async(req, res) => {
    // Resgata dentro do parâmetro o numero do identificador
    const id = {_id: req.params.id}

    // Realiza-se verificações de segurança e aprovação.
    try {
        if (await Currency.findOne(id) == null) {
            return res.status(400).send({error: 'Esta moeda não existe.'})
        }
        
        // Apaga o registro e responde ao usuário
        const currency = await Currency.findOneAndDelete(id)
        return res.status(200).send('Moeda apagada com sucesso.')

    } catch (error) {
        // Caso haja um erro...
        return res.status(400).send({error: 'Falha ao apagar registro.'})
    }
})

module.exports = app => app.use(router)