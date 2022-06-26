const {
  createCurrencyRepository,
} = require('../repositories/currencyRepository')
const {
  createCurrencyValidator,
  ValidationError,
} = require('../validators/currencyValidator')

class CurrencyAlreadyExistsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CurrencyAlreadyExistsError'
  }
}

class CurrencyInvalidDataError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidCurrencyDataError'
  }
}

class CurrencyNotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CurrencyNotFoundError'
  }
}

class CurrencyUpdateError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CurrencyUpdateError'
  }
}

function createCurrencyService() {
  const currencyRepository = createCurrencyRepository()
  const currencyValidator = createCurrencyValidator()

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

    async create(data) {
      let currencyData
      try {
        currencyData = currencyValidator.validateCurrencyCreation(data)
      } catch (err) {
        if (err instanceof ValidationError) {
          throw new CurrencyInvalidDataError(err.errors.join(', '))
        } else {
          throw err
        }
      }

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

    async update(data, code) {
      let currencyData
      try {
        currencyData = currencyValidator.validateCurrencyUpdate(data)
      } catch (err) {
        if (err instanceof ValidationError) {
          throw new CurrencyInvalidDataError(err.errors.join(', '))
        } else {
          throw err
        }
      }

      const currency = await currencyRepository.get(code)
      if (!currency) {
        throw new CurrencyNotFoundError('Currency not found.')
      }

      if (currency.type === 'real') {
        throw new CurrencyUpdateError(
          'Only fictitious currencies can be updated.'
        )
      }

      const updatedCurrency = await currencyRepository.update({
        ...currencyData,
        code,
      })
      return updatedCurrency
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
  CurrencyInvalidDataError,
  CurrencyUpdateError,
}
