const COLLECTION_NAME = 'currencies';

class CurrencyRepository {
    constructor({ mongoDBConnection }) {
        this.db = mongoDBConnection.db;
    }

    findByKey(key) {
        return this.db.collection(COLLECTION_NAME).findOne({ key });
    }

    list() {
        return this.db.collection(COLLECTION_NAME).find().toArray();
    }

    insert(newCurrency) {
        this.db.collection(COLLECTION_NAME).insertOne(newCurrency);
    }

    delete(currency) {
        this.db.collection(COLLECTION_NAME).deleteOne({ key: currency });
    }
}
module.exports = CurrencyRepository;
