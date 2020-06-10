const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema({
    code : String,
    name: String,
    value: Number,
    lastro: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Coin = mongoose.model("Coin", CoinSchema);
module.exports = Coin;