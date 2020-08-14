/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Joi from 'joi';

class DeleteValidation {
  public async validateId({ id }: any) {
    let validation: Joi.ValidationResult;

    const parameters = { id };
    const schema = Joi.object().keys({
      id: Joi.string().required(),
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

export default DeleteValidation;
