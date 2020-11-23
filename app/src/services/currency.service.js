import Currency from '../schemas/Currency';

export default () => {

    const save = async (currency) => {
        const foundCurrency = await Currency.findByName(currency);

        if (foundCurrency) {
            throw new Error('Currency already exists.')
        }

        await Currency.save(currency);
    }

    const remove = async (currency) => {
        const foundCurrency = await Currency.findByName(currency);

        if (!foundCurrency) {
            throw new Error('Currency does not exist.');
        }

        const deleteCount = await Currency.remove(currency);
        
        if (deleteCount !== 1) {
            throw new Error('Failed to delete.');
        }
    }

    return {
        save,
        remove
    };
}