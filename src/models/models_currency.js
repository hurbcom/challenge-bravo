import mongoose from 'mongoose';

const CurrencySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    code: {
        type: String,
        require: true
    },
    rate: {
        type: Number,
        require: true
    },
    fiatOrFic: {
        type: Boolean,
        required: true
    },
},
{
    versionKey: false,
    timestamps: true
}
)

const currency =  mongoose.model('Currency', CurrencySchema);

export default currency;