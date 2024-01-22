const mongoose = require('mongoose');
const {Schema} = mongoose;

const coinsSchema = new Schema(
    {
        code: {
            type: String,
            required: true,            
        },
        name: {
            type: String,
            required: true,
        },  
        value: {
            type: Number,
            required: true,
        },          
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Coins', coinsSchema);
