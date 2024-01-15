const mongoose = require('mongoose');

const url = "mongodb://challenge:bravo@mongo:27017/coins_rate_constance"

const connectDb = async () => {
    console.log("Entrando na conexão");
    await mongoose.connect(url);
    console.log("Conectado com sucesso");
}

module.exports = connectDb;
