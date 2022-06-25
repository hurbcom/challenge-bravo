const {
  createCurrencyRepository,
  NotFoundError,
} = require('../repositories/currencyRepository')

class CurrencyAlreadyExistsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CurrencyAlreadyExistsError'
  }
}

class CurrencyNotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CurrencyNotFoundError'
  }
}

function createCurrencyService() {
  const currencyRepository = createCurrencyRepository()
  return {
    async find() {
      const currencies = await currencyRepository.getAll()
      return currencies
    },

    async findOne(code) {
      const currency = await currencyRepository.get(code)
      if (!currency) {
        throw new CurrencyNotFoundError('Currency not found.')
      }

      return currency
    },

    async create(currencyData) {
      const currencyAlreadyExists = await currencyRepository.get(
        currencyData.code
      )
      if (currencyAlreadyExists) {
        throw new CurrencyAlreadyExistsError(
          'A currency with this code has already been created.'
        )
      }

      const currency = await currencyRepository.add(currencyData)

      return currency
    },

    async update(currencyData, code) {
      try {
        const currency = await currencyRepository.update({
          ...currencyData,
          code,
        })
        return currency
      } catch (err) {
        if (err instanceof NotFoundError) {
          throw new CurrencyNotFoundError(err.message)
        }
      }
    },

    async delete(code) {
      const count = await currencyRepository.remove(code)
      if (count !== 1) {
        throw new CurrencyNotFoundError('Currency not found.')
      }
    },
  }
}

module.exports = {
  createCurrencyService,
  CurrencyAlreadyExistsError,
  CurrencyNotFoundError,
}
