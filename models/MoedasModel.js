const mongoose = require('mongoose');
const ModelName = 'Moedas';
const autoincrement = require('mongoose-sequence')(mongoose)

const Model = mongoose.Schema({
    moeda: {
        type: String,
        index: true,
        required: true
    },
    sigla: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

Model.plugin(autoincrement, { inc_field: 'moeda_id' }).set('toJSON', {
    getters: true,
    virtuals: true
});

module.exports = mongoose.model(ModelName, Model);