const {
  createConversionValidator,
  ValidationError,
} = require('../validators/conversionValidator')
const {
  createCurrencyRepository,
} = require('../repositories/currencyRepository')

class ConversionInvalidDataError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ConversionInvalidDataError'
  }
}

class ConversionCurrencyNotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ConversionCurrencyNotFoundError'
  }
}

function createConversionService() {
  const conversionValidator = createConversionValidator()
  const currencyRepository = createCurrencyRepository()
  return {
    async findOne(data) {
      let conversion
      try {
        conversion = conversionValidator.validateConversion(data)
      } catch (err) {
        if (err instanceof ValidationError) {
          throw new ConversionInvalidDataError(err.errors.join(', '))
        } else {
          throw err
        }
      }

      const { from, to, amount } = conversion

      const fromCurrency = await currencyRepository.get(from)
      if (!fromCurrency) {
        throw new ConversionCurrencyNotFoundError(
          `${fromCurrency} currency not found.`
        )
      }

      const toCurrency = await currencyRepository.get(to)
      if (!toCurrency) {
        throw new ConversionCurrencyNotFoundError(
          `${toCurrency} currency not found.`
        )
      }

      conversion.result = (amount / fromCurrency.rate) * toCurrency.rate

      return conversion
    },
  }
}

module.exports = {
  createConversionService,
  ConversionInvalidDataError,
  ConversionCurrencyNotFoundError,
}
