var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var morgan = require('morgan');
var logger = require('../services/logger.js');

module.exports = function () {
    var app = express();

    app.use(morgan('common', {
        stream: {
            write: function (message) {
                logger.info(message)
            }
        }
    }));
    app.use(bodyParser.json());
    app.use(expressValidator());

    consign()
        .include('controllers')
        .then('services')
        .into(app);

    return app;
};
