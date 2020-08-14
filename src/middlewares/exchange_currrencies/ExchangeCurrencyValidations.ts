/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Joi from 'joi';

class ExchangeValidation {
  public async validateExchange({ to, from, amount }: any) {
    let validation: Joi.ValidationResult;

    const parameters = { to, from, amount };
    const schema = Joi.object().keys({
      to: Joi.string().required().min(3).max(3),
      from: Joi.string().required().min(3).max(3),
      amount: Joi.number().required(),
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

export default ExchangeValidation;
