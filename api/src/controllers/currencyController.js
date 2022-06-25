const {
  createCurrencyRepository,
} = require('../repositories/currencyRepository')

function createCurrencyController() {
  const currencyRepository = createCurrencyRepository()
  return {
    async find(ctx) {
      const currencies = await currencyRepository.getAll()
      ctx.body = { data: currencies }
      ctx.status = 200
    },

    async findOne(ctx) {
      const { code } = ctx.params
      const currency = await currencyRepository.get(code)
      ctx.body = { data: currency }
      ctx.status = 200
    },

    async create(ctx) {
      const data = ctx.request.body
      const currency = await currencyRepository.add(data)
      ctx.body = { data: currency }
      ctx.status = 201
    },

    async update(ctx) {
      const { code } = ctx.params
      const data = ctx.request.body
      const currency = await currencyRepository.update(data)
      ctx.body = { data: currency }
      ctx.status = 200
    },

    async delete(ctx) {
      const { code } = ctx.params
      await currencyRepository.delete(code)
      ctx.status = 200
    },
  }
}

module.exports = { createCurrencyController }
