import { getRate as getRates } from '../services/exchangeRateAPI';

export default ({ getRate } = { getRate: getRates }) => {
    
    async function convert(req, res, next) {
        const { from, to, amount } = req.query;

        const rate = await getRate(from, to);

        return res.status(Status.OK).json(rate);
    };

    return {
        convert
    }
}