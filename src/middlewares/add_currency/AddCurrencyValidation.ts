/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Joi from 'joi';

class AddCurrencyValidation {
  public async validateCurrency({ code, name }: any) {
    let validation: Joi.ValidationResult;

    const parameters = { code, name };
    const schema = Joi.object().keys({
      code: Joi.string().required().min(3).max(3),
      name: Joi.string(),
    });
    try {
      validation = schema.validate(parameters);
      if (validation.error) {
        throw new Error('Invalid arguments');
      } else {
        return validation;
      }
    } catch (err) {
      throw new Error(`Invalid arguments ${err.details[0].message}`);
    }
  }
}

export default AddCurrencyValidation;
