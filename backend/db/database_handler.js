const mongoose = require('mongoose');
const databaseConfig = require('../config/database');

const dbConnect = async (dbName = null, env = null) => {
    const dbURI = getDbURI(dbName, env);

    await mongoose.connect(dbURI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

const dbClose = async (forceDrop = false) => {
    if(forceDrop) await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
}

const dbClear = async () => {
    const { collections } = mongoose.connection;

    for(key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}

const getDbURI = (dbName = null, env = null) => {
    let fullDbURI = databaseConfig.uri;

    if(dbName) {
        fullDbURI = `${fullDbURI}/${dbName}`;
        if(env) fullDbURI = `${fullDbURI}_${env}`;
    }

    return fullDbURI;
}

 module.exports = { dbConnect, dbClose, dbClear }