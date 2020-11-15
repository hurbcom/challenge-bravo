import { Router } from 'express';
import Status from 'http-status';
import { getRate as getRates } from '../../services/exchangeRateAPI';

export default ({ getRate } = { getRate: getRates }) => {
    const router = Router();
    
   /**
    * @todo
    * - standardize api response object
    *   . always return comparison to USD because of 'lastro'
    *   . return from, to, the exchange rate and the conversion value
    * - add a validator
    *   . check the query params
    *   . check if it is allowed currency
    * - separate the logic from the routes
    * - error handling
    * - tests
    */
    router.get('/conversion', async (req, res, next) => {
        const { from, to, amount } = req.query;

        const rate = await getRate(from, to);

        return res.status(Status.OK).json(rate);
    });

    return router;
}