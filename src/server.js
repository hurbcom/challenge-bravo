const express = require('express');
const app = express();
const databaseConfig = require('./config/database');
const mongoose = require('mongoose');
const mongo = mongoose.connect(databaseConfig.uri, databaseConfig.options);

mongo.then(() => {
    console.log('connected');
}, error => {
    console.log(error, 'error');
})

app.use('/', (req, res) => {
    res.send({"data": "ok"})
})

module.exports = app;