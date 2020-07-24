const { MongoClient } = require('mongodb');
const Configuration = require('../config/config');

module.exports = class MongoDBConnection {
    constructor() {
        this.mongoClient = new MongoClient(Configuration.MONGODB_DEFAULT_URL, {
            useUnifiedTopology: true,
        });
        this.mongoClient.connect();
        this.db = this.mongoClient.db(Configuration.DB_NAME);
    }
};
