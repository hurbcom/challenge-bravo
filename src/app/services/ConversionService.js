/**
 * Service to perform conversion currency.
 */
class ConversionService {
    /**
     * Function for make calc
     *
     * @param {string} from the currency to compare
     * @param {string} to the currency to find out the value
     * @param {string} amount the value to conversion
     *
     * @returns a promise that resolves after the response is sent. The response body includes the result of conversion
     */
    async makeConversion(from, to, amount) {
        const dollarFrom = from.value;
        const dollarTo = to.value;

        const valueToConvert = dollarFrom / dollarTo;

        const result = valueToConvert * amount;

        return result.toLocaleString('pt-BR');
    }
}

export default new ConversionService();
