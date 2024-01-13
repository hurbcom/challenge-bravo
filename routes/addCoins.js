const express = require('express');
const router = express.Router();
const moment = require('moment');
const Coins = require('../models/coins');

router.post('/insert', async (req, res) => {
    try {
        let {code, name, value} = req.body;      
        const regex = /^[0-9,.]+$/;  

        if (!(code && value)) {
            return res.status(404).json('Information is missing')
        }
        if (!regex.test(value)){
            return res.status(403).json('This amount is not allowed')
        }
        if (value.includes(',')){
            value = value.replace(',', '.');
        }
        
        const checkCoinOnDB = await Coins.findOne({code: code});
        if (checkCoinOnDB) {
            return res.status(400).json({
                message: 'This coin already exists',
            });
        }

        const amount = parseFloat(value);        

        const Coin = new Coins({code, name, amount});
        await Coin.save();

        return res.status(201).json({
            message: 'Coin saved success',
            Coin,
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
