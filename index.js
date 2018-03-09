const Koa = require('koa')
const uuidv1 = require('uuid/v1')
const Router = require('koa-router')

const router = new Router({})

router.get('convert', '/convert', ctx => {
    console.log(`${ctx.request.id}`)
    ctx.body = {response: 'oi japa!'}
})

const app = new Koa()
app.use(async (ctx, next) => {
    ctx.request.id = uuidv1()
    console.info(`${ctx.request.id} Starting request ${ctx.request.path}`)
    await next()
    console.info(`${ctx.request.id} Ending request ${ctx.request.path}`)
})
app.use(router.routes())
app.listen(5000)
