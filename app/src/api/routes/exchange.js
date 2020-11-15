import { Router } from 'express';
import Status from 'http-status';
import { getRate } from '../../services/exchangeRateAPI';

export default () => {
    const router = Router();
    
   /**
    * @todo
    * - add a validator to check the query params
    * - separate the logic from the routes
    * - standardize api response object
    * 
    */
    router.get('/exchange', async (req, res, next) => {
        const { from, to, amount } = req.query;

        const rate = await getRate(from, to);

        return res.status(Status.OK).json(rate);
    });

    return router;
}