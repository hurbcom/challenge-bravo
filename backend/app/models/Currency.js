const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const CurrencySchema = new Schema({
    symbol: {
        type: String,
        required: true,
        index: true,
    },
    label: {
        type: String,
        required: false,
    },
}, {
    collection: "currency",
});

module.exports = model("Currency", CurrencySchema);