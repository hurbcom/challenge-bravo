const express = require('express');
const router = express.Router();
const Coins = require('../models/coins');

router.delete('/delete/:code', async (req, res) => {
    try {
        const code = req.params.code;      
        
        await Coins.deleteOne({code: code});        

        const deletedDocument = await Coins.findOne({ code: code });

        if (!deletedDocument) {
            return res.status(200).json({
                message: 'Coin deleted'
            });         
        } else {
            return res.status(201).json({
                message: 'Coin not deleted'
            });         
        }        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error
        });
    }
})

module.exports = router;
