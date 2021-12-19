module.exports = (app, accessProtectionMiddleware) => {

    const express = require('express');
    const router = express.Router();

    const Currency = require('../controllers/currency');
    const { isNullOrEmpty } = require('../utils');

    router.get('/', accessProtectionMiddleware, async (req, res) => {
        res.json({
            version: process.env.API_VERSION || "1.0.0",
            description: process.env.API_DESCRIPTION || "Api to currencies conversion.",
            author: process.env.API_AUTHOR || "Leonardo Neves <leo.mvhost@hotmail.com>"
        });
    });

    router.get('/currencies', accessProtectionMiddleware, async (req, res) => {
        const result = await Currency.getAll();
        res.status(result.status).json(result.data);
    });

    router.get('/currencies/convert', accessProtectionMiddleware, async (req, res) => {
        const result = await Currency.conversion(req.query);
        res.status(result.status).json(result.data);
    });

    router.get('/currencies/:code', accessProtectionMiddleware, async (req, res) => {
        const result = await Currency.getByCode(req.params.code.toUpperCase())
        res.status(result.status).json(result.data);
    });

    router.post('/currencies', accessProtectionMiddleware, async (req, res) => {
        if(
            isNullOrEmpty(req.body) ||
            isNullOrEmpty(req.body.code) ||
            isNullOrEmpty(req.body.bid)
        ) {
            return res.send(400).end();
        }

        const result = await Currency.newCurrency(req.body.code.toUpperCase(), req.body.bid);
        res.status(result.status).end();
    });

    router.delete('/currencies/:code', accessProtectionMiddleware, async (req, res) => {
        const result = await Currency.removeCurrency(req.params.code.toUpperCase())
        res.status(result.status).json(result.data);
    });

    app.use('/', router);
};