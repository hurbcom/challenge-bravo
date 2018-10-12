const app = require('express')();
const uuidv4 = require('uuid/v4');
const { register } = require('./core/helpers');
const routers = require('./core/routers');


const addRequestId = (req, _res, next) => {
  req.id = uuidv4();
  next();
};


register(
  [addRequestId],
  [routers],
)(app);


module.exports = app;
