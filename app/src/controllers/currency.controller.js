import Status from 'http-status';
import Currency from '../schemas/Currency';
import currencyService from '../services/currency.service';

export default () => {
    const { save } = currencyService();

    async function post(req, res, next) {
        const { currency } = req.body;

        try {
            await save(currency);

            return res.status(Status.OK).send();
        } catch (e) {
            return next(e);
        }
    }

    async function getAll(req, res, next) {
        
        try {
            const result = await Currency.getAll();

            return res.status(Status.OK).json(result);
        } catch (e) {
            return next(e);
        }
    }

    return {
        post,
        getAll
    }
}