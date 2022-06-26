const {
  createCurrencyService,
  CurrencyAlreadyExistsError,
  CurrencyNotFoundError,
  CurrencyInvalidDataError,
  CurrencyUpdateError,
} = require('../services/currencyService')

function createCurrencyController() {
  const currencyService = createCurrencyService()
  return {
    async find(ctx) {
      const currencies = await currencyService.find()
      ctx.body = { data: currencies }
      ctx.status = 200
    },

    async findOne(ctx) {
      try {
        const code = ctx.params.code.toUpperCase()
        const currency = await currencyService.findOne(code)
        ctx.body = { data: currency }
        ctx.status = 200
      } catch (err) {
        if (err instanceof CurrencyNotFoundError) {
          ctx.body = {
            data: null,
            error: err.message,
          }
          ctx.status = 404
        }
      }
    },

    async create(ctx) {
      try {
        const data = ctx.request.body
        const currency = await currencyService.create(data)
        ctx.body = { data: currency }
        ctx.status = 201
      } catch (err) {
        if (err instanceof CurrencyInvalidDataError) {
          ctx.body = {
            data: null,
            error: err.message,
          }
          ctx.status = 400
        } else if (err instanceof CurrencyAlreadyExistsError) {
          ctx.body = {
            data: null,
            error: err.message,
          }
          ctx.status = 422
        } else {
          throw err
        }
      }
    },

    async update(ctx) {
      try {
        const code = ctx.params.code.toUpperCase()
        const data = ctx.request.body
        const currency = await currencyService.update(data, code)
        ctx.body = { data: currency }
        ctx.status = 200
      } catch (err) {
        if (err instanceof CurrencyNotFoundError) {
          ctx.body = {
            data: null,
            error: err.message,
          }
          ctx.status = 404
        } else if (err instanceof CurrencyInvalidDataError) {
          ctx.body = {
            data: null,
            error: err.message,
          }
          ctx.status = 400
        } else if (err instanceof CurrencyUpdateError) {
          ctx.body = {
            data: null,
            error: err.message,
          }
          ctx.status = 422
        } else {
          throw err
        }
      }
    },

    async delete(ctx) {
      try {
        const code = ctx.params.code.toUpperCase()
        await currencyService.delete(code)
        ctx.status = 200
      } catch (err) {
        if (err instanceof CurrencyNotFoundError) {
          ctx.body = {
            data: null,
            error: err.message,
          }
          ctx.status = 404
        } else {
          throw err
        }
      }
    },
  }
}

module.exports = { createCurrencyController }
