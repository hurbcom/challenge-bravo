const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

const connect = async () => {
    const uri = await mongod.getUri();

    const mongooseOpts = {
        poolSize: 10,
        bufferMaxEntries: 0,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    await mongoose.connect(uri, mongooseOpts);
}

const clearDatabase = async () => {
    await mongoose.model("Currency").deleteMany({});
}

const closeDatabase = async () => {
    await mongoose.connection.close();
    await mongod.stop();
}

module.exports = {connect, closeDatabase, clearDatabase };
