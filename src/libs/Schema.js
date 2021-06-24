import * as yup from 'yup';

class Schema {
    constructor () {
        // -
    }

    generateCurrencySchema() {
        const currencySchema = {
            currencyCode: yup.string().min(3).required(),
            currencyQuote: yup.number().positive()
        }
        
        return yup.object().shape(currencySchema);
    }

    async validate (schema, DTO) {
        return await schema.validate(DTO, { abortEarly: false });
    }

}

export default new Schema();