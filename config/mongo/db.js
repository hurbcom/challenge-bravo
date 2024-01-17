// Conexão MongoDBs
const mongoose = require('mongoose');

const url = "mongodb://challenge:bravo@mongo:27017/coins_rate_constance"

const connectDb = async () => {
    await mongoose.connect(url);
}

module.exports = connectDb;
