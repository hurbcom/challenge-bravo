const express = require('express');
const router = express.Router();
const Coins = require('../models/coins');
const conversionCoins = require('../controller/conversCoins')

router.get('/', async (req, res) => {
    try {
        let {from, to, amount} = req.query;
        const regex = /^[0-9,.]+$/;  

        if (!(from && to && amount)) {
            return res.status(400).json('Oops! Missing data in the search, check and try again');
        }
        if (!regex.test(amount)){
            return res.status(403).json('This amount is not allowed')
        }
        if (amount.includes(',')){
            amount = amount.replace(',', '.');
        }

        const originData = await Coins.findOne({name: from});
        const comparativeData = await Coins.findOne({name: to});        
        const amountParse = parseFloat(amount);

        if (!originData) {
            return res.status(400).json({
                message: `This ${from} currency has not yet been added!`,
            });
        } else if (!comparativeData){
            return res.status(400).json({
                message: `This ${to} currency has not yet been added!`,
            });
        }

        const valueAmountComparative = conversionCoins(originData.amount,comparativeData.amount,amount)

        return res.status(200).json({
            message: `VALUES CONVERSATION ${from} => ${to}`,
            data: valueAmountComparative,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
})

module.exports = router;
