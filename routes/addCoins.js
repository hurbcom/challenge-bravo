const express = require('express');
const router = express.Router();
const moment = require('moment');
const Coins = require('../models/coins');

router.post('/insert', async (req, res) => {
    try {
        const {name, amountCoin} = req.body;      
        const regex = /^[0-9,.]+$/;  

        if (!(name && amountCoin)) {
            return res.status(404).json('Information is missing')
        }
        if (!regex.test(amountCoin)){
            return res.status(403).json('This amount is not allowed')
        }
        if (amountCoin.includes(',')){
            amountCoin = amountCoin.replace(',', '.');
        }
        
        const checkCoinOnDB = await Coins.findOne({name: name});
        if (checkCoinOnDB) {
            return res.status(400).json({
                message: 'This coin already exists',
            });
        }

        const amount = parseFloat(amountCoin);        

        const Coin = new Coins({name, amount});
        await Coin.save();

        return res.status(201).json({
            message: 'Coin saved success',
            Coin,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
})

module.exports = router;
