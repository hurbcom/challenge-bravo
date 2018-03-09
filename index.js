const Koa = require('koa')
const uuidv1 = require('uuid/v1')
const Router = require('koa-router')
const converter = require('./converter')

const router = new Router({})

router.get('convert', '/convert', ctx => {
    console.log(`${ctx.request.id}`)
    let from = ctx.request.query['from']
    if (from == undefined || from == null || from == ''){
        ctx.status = 400
        ctx.body = {error: `'from' attribute must be assigned.`}
        return
    }
    let to = ctx.request.query['to']
    let amount = ctx.request.query['amount']
    ctx.body = {response: converter(from, to, amount)}
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
