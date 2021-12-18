module.exports = (app, accessProtectionMiddleware) => {

    const express = require('express');
    const router = express.Router();

    const Currency = require('../controllers/currency');

    router.get('/', accessProtectionMiddleware, async (req, res) => {
        res.json({
            version: process.env.API_VERSION || "1.0.0",
            description: process.env.API_DESCRIPTION || "Api to currencies conversion.",
            author: process.env.API_AUTHOR || "Leonardo Neves <leo.mvhost@hotmail.com>"
        });
    });

    router.get('/currencies', accessProtectionMiddleware, async (req, res) => {
        res.json(await Currency.getAll());
    });

    router.get('/currencies/convert', accessProtectionMiddleware, async (req, res) => {
        res.json(await Currency.conversion(req.query));
    });

    router.get('/currencies/:code', accessProtectionMiddleware, async (req, res) => {
        res.json(await Currency.getByCode(req.params.code.toUpperCase()));
    });

    app.use('/', router);
};