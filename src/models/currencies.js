const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CurrenciesSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        // validate: {
        //     validator: () => Promise.resolve(false),
        //     message: 'Moeda já cadastrada.'
        // }
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
});

CurrenciesSchema.path('code').index({ unique: true });


module.exports = mongoose.model('Currencies', CurrenciesSchema);