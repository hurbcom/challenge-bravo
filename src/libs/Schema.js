import * as yup from 'yup';

class Schema {
    constructor () {
        // -
    }

    generateCurrencySchema() {
        const currencySchema = {
            symbol: yup.string().min(3).required(),
            quotation: yup.number()
        }
        
        return yup.object().shape(currencySchema);
    }

    async validate (schema, DTO) {
        return await schema.validate(DTO, { abortEarly: false });
    }

}

export default new Schema();