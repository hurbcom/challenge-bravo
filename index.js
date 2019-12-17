var express = require('express');
var server = express();

server.get('/convert', (req, res, next) => {
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
    scrooge.convert(10, 'BRL', 'USD')
        .then( conversion => {
            res.contentType('application/vnd.api+json');
            res.json({
                date: new Date(),
                result: conversion
            })
            res.sendStatus(200);
        });
 })

server.listen(3000);