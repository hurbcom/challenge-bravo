import CurrencySchema from '../schemas/CurrencySchema';

export default class CurrencyDao {

    async findByName(currency) {
        const document = await CurrencySchema.findOne({ currency });

        if (document) {
            return document.get('currency');
        }
        
        return document;
    }

    async getAll() {
        const documents = await CurrencySchema.find({});

        return documents.map(doc => doc.get('currency'));
    }

    async remove(currency) {
        const result = await CurrencySchema.deleteOne({ currency });

        return result.deletedCount;
    }

    async save(currency) {
        await CurrencySchema.create({ currency });
    }
}