import { getRate as getRates } from './external/exchangeRateApi';

export default ({ getRate } = { getRate: getRates }) => {

    async function calculateExchangeRate({ from, to, amount, reference }) {
        
        const conversion = await getRate({ from, to, amount, reference });

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