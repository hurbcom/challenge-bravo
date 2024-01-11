const mongoose = require('mongoose');
const {Schema} = mongoose;

const coinsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,            
        },
        amount: {
            type: Number,
            required: true,
        },  
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Coins', coinsSchema);
