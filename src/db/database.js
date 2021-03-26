require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../config/index');
const boot = require('../service/boot');

const dbConnect = async (dbName = null, env = null) =>  {
   const db = getDb(dbName, env);

    const teste = await mongoose.connect(db, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    if (teste) {
        mongoose.createConnection(config.db.connectionString, boot);
      } else {
        console.log('No connection string provided.');
      }


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

const getDb = (dbName = null, env = null) => {
    let fullDb = config.db.connectionString;
    
    if(dbName) {
        fullDb = `${fullDb}/${dbName}`;
        if(env) fullDb = `${fullDb}_${env}`;
    }

    return fullDb;
}


 module.exports = { dbConnect, dbClose, dbClear }