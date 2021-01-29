const { MongoClient } = require('mongodb');

class MongoDBConnection {
    constructor() {
        console.log(process.env.MONGODB_URL)
        this.mongoClient = new MongoClient(process.env.MONGODB_URL, {
            useUnifiedTopology: true,
        });
        this.mongoClient.connect();
        this.db = this.mongoClient.db('CurrencyAPI');
    }
};

module.exports = new MongoDBConnection();
