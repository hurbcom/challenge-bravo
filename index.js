const Koa = require('koa')
const uuidv1 = require('uuid/v1')
const Router = require('koa-router')
const converter = require('./converter')
const fetch = require('node-fetch')

const quote = {}
const router = new Router({})
const notifications = new Array()


const update_quote = async () => {
    let now = Date.now
    console.info('Updating quotation.')
    try{
        let address = 'http://api.promasters.net.br/cotacao/v1/valores'
        let result = await fetch(address, {method: 'get'})
        let json = await result.json()
        for (let key of Object.keys(json.valores)){
            quote[key] = json.valores[key].valor
        }
        return true
    } catch (e) {
        console.error(e.message, e.stack)
    }
    console.info('Finished to update quotation.', {execution_ms: Date.now() - start})
}

setInterval(update_quote, 15000)


const is_valid = (v) => {
    if (v == undefined || v == null || v == '')
        return false
    return true
}

router.get('convert', '/convert', ctx => {
    console.info(`${ctx.request.id}`)
    
    let from = ctx.request.query['from']
    if (!is_valid(from))
        notifications.push(`'from' attribute must be assigned.`)

    let to = ctx.request.query['to']
    if (!is_valid(to))
        notifications.push(`'to' attribute must be assigned.`)

    let amount = ctx.request.query['amount']
    if (!is_valid(amount))
        notifications.push(`'amount' attribute must be assigned.`)
    
    if (notifications.length > 0){
        ctx.status = 400
        ctx.body = {error: notifications}
        return
    }

    ctx.body = {response: converter(from, to, amount, quote)}
})

const app = new Koa()
app.use(async (ctx, next) => {
    notifications.forEach(() => notifications.pop())
    ctx.request.id = uuidv1()
    let start = Date.now()
    console.info(`${ctx.request.id} Starting request ${ctx.request.path}`)
    await next()
    console.info(`${ctx.request.id} Ending request ${ctx.request.path}`, {execution_ms: Date.now() - start})
})

app.use(router.routes())
app.listen(5000)
