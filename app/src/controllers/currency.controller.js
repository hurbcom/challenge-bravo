import Status from 'http-status';
import CurrencyService from '../services/currency.service';

export default class CurrencyController {
    
    constructor(currencyService = new CurrencyService()) {
        this.currencyService = currencyService;
    }

    post = async (req, res, next) => { 
        const { currency } = req.body;

        try {
            await this.currencyService.save(currency);

            return res.status(Status.OK).send();
        } catch (e) {
            return next(e);
        }
    }

    index = async (req, res, next) => {
        
        try {
            const result = await this.currencyService.getAll();

            return res.status(Status.OK).json(result);
        } catch (e) {
            return next(e);
        }
    }

    del = async (req, res, next) => {
        const { currency } = req.body;

        try {
            await this.currencyService.remove(currency);

            return res.status(Status.OK).json('Deleted');
        } catch (e) {
            next(e);
        }
    }
}