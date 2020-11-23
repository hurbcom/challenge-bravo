import { getRatesFromApi } from './external/exchangeRateApi';

export default ({ getRates } = { getRates: getRatesFromApi }) => {

    async function calculateExchangeRate({ from, to, amount, reference }) {
        
        const conversion = await getRates({ from, to, reference });

        const rate = (conversion[to] / conversion[from]);
        
        return {
            [from]: amount,
            [to]: amount * rate,
            [reference]: rate
        };
    }

    return {
        calculateExchangeRate
    }
}