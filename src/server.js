const express = require('express');
const app = express();

app.use('/', (req, res) => {
    res.send({"data": "ok"})
})

module.exports = app;