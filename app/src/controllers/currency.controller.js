import Status from 'http-status';
import currencyService from '../services/currency.service';

export default ({ service } = { service: currencyService() }) => {
    const { save, remove, getAll } = service;

    async function post(req, res, next) {
        const { currency } = req.body;

        try {
            await save(currency);

            return res.status(Status.OK).send();
        } catch (e) {
            return next(e);
        }
    }

    async function index(req, res, next) {
        
        try {
            const result = await getAll();

            return res.status(Status.OK).json(result);
        } catch (e) {
            return next(e);
        }
    }

    async function del(req, res, next) {
        const { currency } = req.body;

        try {
            await remove(currency);

            return res.status(Status.OK).json('Deleted');
        } catch (e) {
            next(e);
        }
    }

    return {
        post,
        index, 
        del
    }
}