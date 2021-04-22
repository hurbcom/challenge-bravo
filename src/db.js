const mongoose = require('mongoose');
const host = process.env.MONGO_HOST || 'mongo';
const port = process.env.MONGO_PORT || '27017';
const database = process.env.MONGO_DB || 'challenge-bravo';

// Realizando conexão com o mongodb
let url = `mongodb://${host}:${port}/${database}`;
let mongoDB = process.env.MONGODB_URI || url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na Ligação ao MongoDB'));