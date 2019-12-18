const express = require('express');
const fs = require('fs');
const server = express();

server.get('/convert', (req, res) => {
    var Scrooge = require('./src/scrooge');
    var request = {
        from: req.query.from,
        to: req.query.to,
        amount: req.query.amount
    }
    if (Object.entries(request).filter(argument => argument[1]).length < 3) {
        res.json({
            error: true,
            errorMsg: 'Insufficient arguments'
        });
        res.sendStatus(400);
    }

    var scrooge = new Scrooge();
    scrooge.convert(request.amount, request.from, request.to)
        .then(conversion => {
            res.contentType('application/vnd.api+json');
            res.json({
                date: new Date(),
                result: conversion
            })
            res.sendStatus(200);
        });
})

server.route('/coins/:id')
    .post((req, res) => {
        let coinId = req.params.id;
        fs.readFile('coins.json', (err, data) => {
            if (err) throw err;

            let config = JSON.parse(data);
            let coinIndex = config.adjacentCoins.indexOf(coinId);
            if (coinIndex != -1)
                res.sendStatus(400);
            else
                config.adjacentCoins.push(coinId);

            fs.writeFile('coins.json', JSON.stringify(config, null, 2), () => {
                res.json({
                    error: false,
                    message: 'Coin successfully added.'
                })
                res.sendStatus(200);
            })
        });
    })
    .delete((req, res) => {
        let coinId = req.params.id;
        fs.readFile('coins.json', (err, data) => {
            if (err) throw err;

            let config = JSON.parse(data);
            let coinIndex = config.adjacentCoins.indexOf(coinId);
            if (coinIndex == -1)
                res.sendStatus(400);
            else
                config.adjacentCoins.splice(coinIndex, 1);

            fs.writeFile('coins.json', JSON.stringify(config, null, 2), () => {
                res.json({
                    error: false,
                    message: 'Coin successfully deleted.'
                })
                res.sendStatus(200);
            })
        });
    });

server.listen(3000);
