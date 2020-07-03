const mongoose = require('mongoose');
const Currencies = require('../models/currencies');

// Buscas
async function findAll() {
    return await Currencies.find({}, 'code name -_id');
}
async function find(code) {
    return await Currencies.findOne({ code: code }, 'code name -_id');
}

// Salvando
async function save(data) {
    const currency = new Currencies(data);
    await currency.save();
}

// Deletando
async function remove(code) {
    return await Currencies.findOneAndRemove({ code: code });
}

module.exports = {
    findAll,
    find,
    save,
    remove
}