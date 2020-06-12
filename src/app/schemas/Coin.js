const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema({
    code : {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: '-'
    },
    lastro: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Coin = mongoose.model("Coin", CoinSchema);
module.exports = Coin;