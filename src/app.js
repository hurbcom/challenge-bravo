const app = require('express')();
const { register } = require('./core/helpers');
const routers = require('./core/routers');


register(
  routers,
)(app);


module.exports = app;
