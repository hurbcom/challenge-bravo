import { BadRequest } from "../error/model/HttpError";
import CurrencyService from '../../../services/currency.service';

async function checkAllowedCurrencies(currencies) {
    const service = new CurrencyService();
    const allCurrencies = await service.getAll();

    for (const key in currencies) {
        const found = allCurrencies.find(currency => currency === currencies[key]);

        if (found === undefined) {
            throw new BadRequest(`${currencies[key]} is not allowed, insert it before converting.`);
        }
    }
}

function inputValidation({ from, to, amount }) {
    if (!from) throw new BadRequest('from currency missing');
    if (!to) throw new BadRequest('to currency missing');
    if (!amount) throw new BadRequest('amount to convert missing');

    const decimal = Number.parseFloat(amount);

    if(Number.isNaN(decimal)) throw new BadRequest('amount is not a number');
}

export default async (req, res, next) => {
    const { from, to, amount } = req.query;
    
    try {
        inputValidation({ from, to, amount });
        await checkAllowedCurrencies({ from, to });
    } catch(e) {
        return next(e);
    }

    next();
}