const {
  addCurrency,
  getCurrency,
  getAllCurrencies,
  updateCurrency,
  deleteCurrency,
} = require('../queries/currencyQueries')

function createCurrencyController() {
  return {
    async find(ctx) {
      const currencies = await getAllCurrencies()
      ctx.body = { data: currencies }
      ctx.status = 200
    },

    async findOne(ctx) {
      const { code } = ctx.params
      const currency = await getCurrency(code)
      ctx.body = { data: currency }
      ctx.status = 200
    },

    async create(ctx) {
      const data = ctx.request.body
      const currency = await addCurrency(data)
      ctx.body = { data: currency }
      ctx.status = 201
    },

    async update(ctx) {
      const { code } = ctx.params
      const data = ctx.request.body
      const currency = await updateCurrency(code, data)
      ctx.body = { data: currency }
      ctx.status = 200
    },

    async delete(ctx) {
      const { code } = ctx.params
      await deleteCurrency(code)
      ctx.status = 200
    },
  }
}

module.exports = { createCurrencyController }
