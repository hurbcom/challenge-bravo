const { object, string, number, ValidationError } = require('yup')

function createConversionValidator() {
  return {
    validateConversion(data) {
      const conversionSchema = object({
        from: string().required(),
        to: string().required(),
        amount: number().required().positive(),
      }).noUnknown()

      return conversionSchema.validateSync(data, { abortEarly: false })
    },
  }
}

module.exports = { createConversionValidator, ValidationError }
