import Status from 'http-status';
import conversionService from '../services/conversion.service';
import { constants } from '../config';

export default ({ service } = { service: conversionService() }) => {
    const { calculateExchangeRate } = service;
    const { REFERENCE_CURRENCY } = constants;

    async function convert(req, res, next) {
        const { from, to, amount } = req.query;

        try {
            const exchangeRate = await calculateExchangeRate(from, to, amount, REFERENCE_CURRENCY);

            return res.status(Status.OK).json(exchangeRate);
        } catch (e) {
            return next(e);
        }
    };

    return {
        convert
    }
}