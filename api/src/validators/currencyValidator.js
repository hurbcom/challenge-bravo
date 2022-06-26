const { object, string, number, mixed, ValidationError } = require('yup')

function createCurrencyValidator() {
  return {
    validateCurrencyCreation(data) {
      const currencyCreationSchema = object({
        type: mixed().required().oneOf(['real', 'fictitious']),
        name: string().when('type', {
          is: (val) => val && val === 'fictitious',
          then: (schema) => schema.required(),
          otherwise: (schema) => schema.notRequired(),
        }),
        code: string()
          .required()
          .matches(/^[a-z]$/i, 'code should contain alphabetic characters only')
          .uppercase(),
        rate: number()
          .positive()
          .when('type', {
            is: (val) => val && val === 'fictitious',
            then: (schema) => schema.required(),
            otherwise: (schema) => schema.notRequired(),
          }),
      }).noUnknown()

      return currencyCreationSchema.validateSync(data, { abortEarly: false })
    },

    validateCurrencyUpdate(data) {
      const currencyUpdateSchema = object({
        name: string().required(),
        code: string()
          .required()
          .matches(/^[a-z]$/i, 'code should contain alphabetic characters only')
          .uppercase(),
        rate: number().required().positive(),
      }).noUnknown()

      return currencyUpdateSchema.validateSync(data, { abortEarly: false })
    },
  }
}

module.exports = { createCurrencyValidator, ValidationError }
