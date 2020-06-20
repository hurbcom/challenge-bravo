const mongoose = require('mongoose');
const mongoConfig = require('./mongodata');
const db = mongoose.connection;

db.on('connecting', function() {
    console.log('MongoDB: Conectando...');
});

db.on('error', function(error) {
    console.log('Error na conexão MongoDB: ' + error);
    mongoose.disconnect();
});

db.on('connected', function() {
    console.log('MongoDB: conectado!');
});

db.once('open', function() {
    console.log('MongoDB: conexão aberta!');
});

db.on('reconnected', function() {
    console.log('MongoDB: reconectado!');
});

db.on('disconnected', function() {
    console.log('MongoDB desconectado!');
});

mongoose.connect(mongoConfig.db.url, mongoConfig.db.options);

module.exports = db;