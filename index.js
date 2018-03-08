const Koa = require('koa')
const Router = require('koa-router')

const router = new Router({})

router.get('convert', '/convert', function(ctx){
    console.log("Oi japa!")
})

const app = new Koa()
app.use(router.routes())
app.listen(5000)


