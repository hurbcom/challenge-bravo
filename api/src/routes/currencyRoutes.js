const Router = require('@koa/router')
const {
  addCurrency,
  getCurrency,
  getAllCurrencies,
  updateCurrency,
  deleteCurrency,
} = require('../queries/currencyQueries')

const router = new Router()

router.post('/currencies', async (ctx) => {
  const data = ctx.request.body
  const currency = await addCurrency(data)
  ctx.body = { data: currency }
  ctx.status = 201
})

router.get('/currencies/:code', async (ctx) => {
  const { code } = ctx.params
  const currency = await getCurrency(code)
  ctx.body = { data: currency }
  ctx.status = 200
})

router.get('/currencies', async (ctx) => {
  const currencies = await getAllCurrencies()
  ctx.body = { data: currencies }
  ctx.status = 200
})

router.put('/currencies/:code', async (ctx) => {
  const { code } = ctx.params
  const data = ctx.request.body
  const currency = await updateCurrency(code, data)
  ctx.body = { data: currency }
  ctx.status = 200
})

router.del('/currencies/:code', async (ctx) => {
  const { code } = ctx.params
  await deleteCurrency(code)
  ctx.status = 200
})

module.exports = router
