const express = require('express');
const router = express.Router();
const Coins = require('../models/coins');
const conversionCoins = require('../controller/conversCoins')

router.get('/', async (req, res) => {
    try {
        let {from, to, amount} = req.query;
        from = from.toUpperCase();
        to = to.toUpperCase();

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

        // REDIS
        const originData = await Coins.findOne({code: from});
        const comparativeData = await Coins.findOne({code: to});   

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

        const valueAmountComparative = conversionCoins(originData.value,comparativeData.value,amountParse);

        return res.status(200).json({
            message: `${from}=>${to}`,
            value: valueAmountComparative,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error
        });
    }
})

module.exports = router;
