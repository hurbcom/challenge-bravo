const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const schema = new Schema({
  symbol: {
    type: String,
    required: true,
		trim: true,
		unique: true
  },
	rate:{
		type: Number,
		required: true,
		trim: true
	},
	date:{
		type: String,
    required: true,
    trim: true
	}
});

schema.plugin(uniqueValidator);

module.exports = mongoose.model('Currency', schema);