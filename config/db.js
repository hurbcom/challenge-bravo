const mongoose = require('mongoose');

const url = 'mongodb://mongo:27017/challenge_coins_rate';

const connectDb = async () => {
    console.log("Entrando na conexão");
    await mongoose.connect(url);
    console.log("Conectado com sucesso");
}

module.exports = connectDb;
