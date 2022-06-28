const { object, string, number, ValidationError } = require('yup')

function createConversionValidator() {
  return {
    validateConversion(data) {
      const conversionSchema = object({
        from: string().required().uppercase(),
        to: string().required().uppercase(),
        amount: number().required().positive(),
      }).noUnknown()

      return conversionSchema.validateSync(data, { abortEarly: false })
    },
  }
}

module.exports = { createConversionValidator, ValidationError }
