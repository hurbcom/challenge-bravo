const { MongoClient } = require('mongodb');

const { MONGO_URI, DBNAME } = process.env;
if (!MONGO_URI || !DBNAME) throw new Error('Missing required env variable');

class MongoDB {
    constructor() {
        this.connection = null;
    }

    async getConnection() {
        if(this.connection) {
            return this.connection;
        }
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        const conn = await MongoClient.connect(MONGO_URI, options);
        this.connection = conn.db(DBNAME);
        return this.connection;
    }

    async executeOperation(operation) {
        const conn = await this.getConnection();
        return operation(conn);
    }
}

module.exports = new MongoDB();
