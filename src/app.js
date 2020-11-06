const express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
var routes = require('./routes/routes');

const app = express();
const port = process.env.NODE_ENV || 3333

mongoose.connect('mongodb+srv://desafio_hurb:desafio@cluster0.a62kf.mongodb.net/CurrencySchema?retryWrites=true&w=majority', {
    useNewUrlParser: true,
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(routes);

app.set('port', port);

app.listen(port, () => { console.log(`App running on port ${port}`) });

module.exports = app;