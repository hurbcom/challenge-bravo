const mongoose = require('mongoose')

const currencySchema = new mongoose.Schema({
	name: String
});

module.exports = currencySchema