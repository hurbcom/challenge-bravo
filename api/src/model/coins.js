const mongoose = require('mongoose')

const { Schema } = mongoose

// Define schema for coins items
const coinSchema = new Schema({
    name: {
        type: String,
    },
    value: {
        type: String,
    },
    lastUpdate: {
        type: String,
    },
})

const Coins = mongoose.model('coins', coinSchema)

module.exports = Coins
