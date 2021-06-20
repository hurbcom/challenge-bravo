const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(bodyParser());

app.get('/', (req, res) => {
    res.send(`The application is running`);
});

module.exports = { app };
