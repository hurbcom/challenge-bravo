const { Schema, model } = require("mongoose");
const ModelName = 'Coin';

const CoinSchema = new Schema({
    to: {
        type: String,
        required: true,
        index: true,
    },
    label: {
        type: String,
        required: false,
    }
}, {
    timestamps: true
    
},{
    collection: "coin",
});

module.exports = model(ModelName, CoinSchema);