/* eslint-disable no-underscore-dangle */
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

async function globalSetup() {
    // it's needed in global space, because we don't want to create a new instance every test-suite
    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    global.__MONGOINSTANCE = instance;
    process.env.MONGODB_URL = `${uri}bravo`;

    // The following is to make sure the database is clean before an test starts
    await mongoose.connect(process.env.MONGODB_URL, { });
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
}

module.exports = globalSetup;
