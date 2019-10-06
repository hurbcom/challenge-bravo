'use strict';

const currency_routes = require('./currency');
module.exports = function(app) {
    currency_routes(app);
};