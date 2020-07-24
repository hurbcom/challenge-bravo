const MongoDBConnection = require('./mongo-db-connection');

const CURRENCY_COLLECTION_NAME = 'currencies';
class CurrencyDao {
    constructor(container) {
        this.db = container.get(MongoDBConnection).db;
    }

    findByKey(key) {
        return this.db.collection(CURRENCY_COLLECTION_NAME).findOne({ key });
    }

    list() {
        return this.db.collection(CURRENCY_COLLECTION_NAME).find().toArray();
    }

    insert(newCurrency) {
        this.db.collection(CURRENCY_COLLECTION_NAME).insertOne(newCurrency);
    }

    delete(currency) {
        this.db.collection(CURRENCY_COLLECTION_NAME).deleteOne({ key: currency });
    }
}
module.exports = CurrencyDao;
