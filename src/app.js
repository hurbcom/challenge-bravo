const app = require('express')();
const addRequestId = require('express-request-id')();
const helmet = require('helmet');
const morgan = require('morgan');
const { register } = require('./core/helpers');
const routers = require('./core/routers');


const undefinedRouter = (_req, res) => {
  res.sendStatus(404);
};


register(
  [addRequestId],
  [morgan('dev')],
  [helmet()],
  [routers],
  [undefinedRouter],
)(app);


module.exports = app;
