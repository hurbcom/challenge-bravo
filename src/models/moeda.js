const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MoedaSchema = new Schema({
    moeda:{
        type: String,
        required: false,
        },
    cotacaodolar: {
        type: Number,
        required: false,
    },    
});

module.exports = mongoose.model('Moeda', MoedaSchema);

