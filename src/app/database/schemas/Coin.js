const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema({
    code : {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        default: '-'
    },
    lastro: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
});

const Coin = mongoose.model("Coin", CoinSchema);
module.exports = Coin;