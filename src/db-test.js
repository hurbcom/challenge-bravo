const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const database = 'challenge-bravo';

const mongod = new MongoMemoryServer();
mongod.getUri(database).then((mongoDB) => {    
    // Realizando conexão com o mongodb
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.Promise = global.Promise;
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Erro na Ligação ao MongoDB'));
});