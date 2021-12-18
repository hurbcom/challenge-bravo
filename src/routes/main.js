module.exports = (app, accessProtectionMiddleware) => {

    const express = require('express');
    const router = express.Router();

    const Currency = require('../controllers/currency');

    router.get('/', accessProtectionMiddleware, async (req, res) => {
        res.json(await Currency.getAll());
    });

    router.get('/:code', accessProtectionMiddleware, async (req, res) => {
        res.json(await Currency.getByCode(req.params.code.toUpperCase()));
    });

    router.get('/convert', accessProtectionMiddleware, async (req, res) => {
        const coins = await Currency.getAll()

        coins.HURB = {
            bid: 33
        }

        const { from, to, amount } = req.query;

        let fromBID = 0;
        if(from == 'BRL') fromBID = 1;
        else fromBID = coins[from].bid;

        let toBID = 0;
        if(to == 'BRL') toBID = 1;
        else toBID = coins[to].bid;

        const calc = ( ( (1/toBID) / (1/fromBID) ) * amount );

        res.json({ from, to, amount, calc });
    });

    router.get('/all', accessProtectionMiddleware, async (req, res) => {
        res.json(await Currency.getAll());
    });


    app.use('/', router);
};