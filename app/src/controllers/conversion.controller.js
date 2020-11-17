import Status from 'http-status';
import { getRate as getRates } from '../services/external/exchangeRate';

export default ({ getRate } = { getRate: getRates }) => {
    
    async function convert(req, res, next) {
        const { from, to, amount } = req.query;

        try {
            const reference = 'USD';

            const conversion = await getRate(from, to, reference);

            const rate = (conversion[to] / conversion[from]);
            const response = {
                'reference': reference,
                [from]: amount,
                [to]: amount * rate,
                'exchange rate': rate,
            };

            return res.status(Status.OK).json(response);
        } catch (e) {
            return next(e);
        }
    };

    return {
        convert
    }
}