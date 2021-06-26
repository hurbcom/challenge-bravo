import * as yup from 'yup';

class Schema {
    constructor () {
        this.code = yup.string().min(3);
        this.positiveNumber = yup.number().positive();
    }

    generateCurrencySchema() {
        const currencySchema = {
            currencyCode: this.code.required(),
            currencyQuote: this.positiveNumber
        }
        
        return yup.object().shape(currencySchema);
    }

    generateCurrencyConversionSchema() {
        const currencyConversionSchema = {
            from: this.code.required(),
            to: this.code.required(),
            amount: this.positiveNumber.required()
        }
        
        return yup.object().shape(currencyConversionSchema);
    }

    async validate (schema, DTO) {
        return await schema.validate(DTO, { abortEarly: false });
    }

}

export default new Schema();