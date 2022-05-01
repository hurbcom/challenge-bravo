const mongoose = require('../database');

const { Schema } = mongoose;

const schema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    rate: {
        type: Number,
        required: false,
        default: null,
    },
});

module.exports = mongoose.model('Currencies', schema);
