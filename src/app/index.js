const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const json = require('koa-json');
const exchange = require('./exchange');

const server = new Koa();
const router = new Router();

server.use(helmet());
server.use(json());
server.use(bodyParser());

router.get('/health', ctx => {
  ctx.body = {
    server: 'up'
  };
});

const domain = exchange(router);

router.use('/v1/exchange', domain.routes());

server
  .use(router.routes())
  .use(router.allowedMethods());

module.exports = server;