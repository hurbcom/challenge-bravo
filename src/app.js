const app = require('express')();
const helmet = require('helmet');
const morgan = require('morgan');
const uuidv4 = require('uuid/v4');
const { register } = require('./core/helpers');
const routers = require('./core/routers');


const assignId = (req, _res, next) => {
  req.id = uuidv4();
  next();
};

const undefinedRouter = (_req, res) => {
  res.sendStatus(404);
};


register(
  [assignId],
  [morgan('dev')],
  [helmet()],
  [routers],
  [undefinedRouter],
)(app);


module.exports = app;
