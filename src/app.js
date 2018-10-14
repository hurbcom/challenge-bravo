const app = require('express')();
const helmet = require('helmet');
const morgan = require('morgan');
const uuidv4 = require('uuid/v4');
const { register } = require('./core/helpers');
const routers = require('./core/routers');


const addRequestId = (req, _res, next) => {
  req.id = uuidv4();
  next();
};


register(
  [addRequestId],
  [morgan('dev')],
  [helmet()],
  [routers],
)(app);


module.exports = app;
