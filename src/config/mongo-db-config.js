const { MongoClient } = require('mongodb');

class MongoDBConnection {
    constructor() {
        this.mongoClient = new MongoClient(process.env.MONGODB_URL, {
            useUnifiedTopology: true,
        });
        this.mongoClient.connect();
        this.db = this.mongoClient.db('CurrencyAPI');
    }
}

module.exports = new MongoDBConnection();
