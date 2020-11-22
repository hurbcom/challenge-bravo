import Currency from '../schemas/Currency';

export default () => {

    const save = async (currency) => {
        const foundCurrency = await Currency.findByName(currency);

        if (foundCurrency) {
            throw new Error('Currency already exists.')
        }

        await Currency.save(currency);
    }

    return {
        save
    };
}