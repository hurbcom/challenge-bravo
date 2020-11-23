import Currency from '../schemas/Currency';
import { BadRequest, Conflict, NotFound } from '../api/middlewares/error/model/HttpError';

export default () => {

    const save = async (currency) => {
        const foundCurrency = await Currency.findByName(currency);

        if (foundCurrency) {
            throw new Conflict('Currency already exists.')
        }

        await Currency.save(currency);
    }

    const remove = async (currency) => {
        const foundCurrency = await Currency.findByName(currency);

        if (!foundCurrency) {
            throw new NotFound(`${currency} not found.`);
        }

        const deleteCount = await Currency.remove(currency);
        
        if (deleteCount !== 1) {
            throw new Error('Failed to delete.');
        }
    }

    const findOne = async (currency) => {
        const foundCurrency = await Currency.findByName(currency);

        if (!foundCurrency) {
            throw new NotFound(`${currency} not found.`);
        }

        return foundCurrency;
    }

    const getAll = async () =>  await Currency.getAll();

    return {
        save,
        remove,
        findOne,
        getAll
    };
}