const express = require('express');
const router = express.Router();
const coinController = require("../controller/coinsController")

router.get('/', async (req, res) => {
    const {status,responseConverCoin} = coinController.ConverCoinAmount(req, res)
    return res.status(status).json(responseConverCoin);  
});

router.post('/insert', async (req, res) => {
    const {status,responseInsertCoin} = coinController.InsertCoin(req, res)
    return res.status(status).json(responseInsertCoin);  
});

router.put('/update', async (req, res) => {
    const {status,responseInsertCoin} = coinController.UpdateCoin(req, res)
    return res.status(status).json(responseInsertCoin);  
});

router.delete('/delete/:code', async (req, res) => {
    const {status,responseDeleteCoin} = coinController.DeleteCoin(req, res)
    return res.status(status).json(responseDeleteCoin);     
});

module.exports = router;
