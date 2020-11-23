import Status from 'http-status';
import conversionService from '../services/conversion.service';
import { constants } from '../config';

export default ({ service } = { service: conversionService() }) => {
    const { calculateExchangeRate } = service;
    const { REFERENCE_CURRENCY } = constants;

    async function convert(req, res, next) {

        try {
            const exchangeRate = await calculateExchangeRate({ ...req.query, reference: REFERENCE_CURRENCY });

            return res.status(Status.OK).json(exchangeRate);
        } catch (e) {
            return next(e);
        }
    };

    return {
        convert
    }
}