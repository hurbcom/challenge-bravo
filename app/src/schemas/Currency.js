import mongoose, { Schema } from 'mongoose';

const CurrencySchema = new Schema(
    {
        currency: { type: String, unique: true, required: true }
    },
    {
        timestamps: true
    }
);

const Currency = mongoose.model('Currency', CurrencySchema);

async function findByName(currency) {
    const document = await Currency.findOne({ currency });

    if (document) {
        return document.get('currency');
    }
    
    return document;
}

async function getAll() {
    const documents = await Currency.find({});

    return documents.map(doc => doc.get('currency'));
}

async function remove(currency) {
    const result = await Currency.deleteOne({ currency });

    return result.deletedCount;
}

async function save(currency) {
    await Currency.create({ currency });
}

export default { 
    findByName,
    getAll,
    remove,
    save
}