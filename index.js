const express = require('express');
const helmet = require('helmet');
const { validationResult } = require('express-validator');
const validation = require('./src/validation.js');
const fs = require('fs');
const server = express();

server.use(helmet());

server.get('/convert', validation('convert'), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        res.status(422)
            .json({
                errors: errors.array()
            })

    var Scrooge = require('./src/scrooge');
    var scrooge = new Scrooge();
    var { from, to, amount } = req.query;

    scrooge.convert(from, to, amount)
        .then(conversion => {
            res.contentType('application/vnd.api+json')
                .status(200)
                .json({
                date: new Date(),
                result: conversion
            })
        });
})

server.route('/coins/:id')
    .post(validation('add'), (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            res.status(422)
                .json({
                    errors: errors.array()
                });

        let coinId = req.params.id;
        fs.readFile('coins.json', (err, data) => {
            if (err) throw err;

            let config = JSON.parse(data);
            config.adjacentCoins.push(coinId);

            fs.writeFile('coins.json', JSON.stringify(config, null, 2), () => {
                res.json({
                    errors: [],
                    message: 'Coin successfully added.'
                })
                res.sendStatus(200);
            })
        });
    })
    .delete(validation('remove'), (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            res.status(422)
                .json({
                    errors: errors.array()
                });
        let coinId = req.params.id;
        fs.readFile('coins.json', (err, data) => {
            if (err) throw err;

            let config = JSON.parse(data);
            config.adjacentCoins
                .splice(config.adjacentCoins.indexOf(coinId), 1);

            fs.writeFile('coins.json', JSON.stringify(config, null, 2), () => {
                res.json({
                    errors: [],
                    message: 'Coin successfully deleted.'
                })
                res.sendStatus(200);
            })
        });
    });

server.listen(3000);
