import mongoose from '../config/mongoose.js'

const CurrencySchema = new mongoose.Schema({
    code: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        require: true
    },
    inDollar: {
        type: Number,
        require: true
    },
    isFiatOrFictitious: {
        type: Boolean,
        required: true
    }
},
{
    versionKey: false,
    timestamps: true
}
)

export default mongoose.model('Currency', CurrencySchema)
