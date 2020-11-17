import ConversionService from '../services/ConversionService';
import CurrencyModel from '../models/CurrencyModel';
import ServerError from '../../utils/ServerError';

/**
 * Class to convert currency.
 */
class ConversionController {
    /**
     * Make a convertion based on URL params
     *
     * @param {Request} req the request object
     * @param {Response} res the response object
     *
     * @returns a promise that resolves after the response is sent. The response body includes the result of conversion
     */
    async index(req, res) {
        const { from, to, amount } = req.query;

        const currencyFrom = await CurrencyModel.findOne({
            where: {
                initials: from
            }
        });

        if (!currencyFrom) {
            throw new ServerError(`Moeda ${from} não cadastrada`);
        }

        const currencyTo = await CurrencyModel.findOne({
            where: {
                initials: to
            }
        });

        if (!currencyTo) {
            throw new ServerError(`Moeda ${from} não cadastrada`);
        }

        const response = await ConversionService.makeConversion(currencyFrom, currencyTo, amount);

        return res.status(200).json({ response: `${to} ${response}` });
    }
}

export default new ConversionController();
