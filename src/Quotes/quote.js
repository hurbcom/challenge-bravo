const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quoteSchema = new Schema({  
    source: {type: String, required: true}, 
    name: {type: String, required: true}, 
    quote: {type: Number, required: true},  
    date: {type: Date, required: true},
});
   
module.exports = mongoose.model('quote', quoteSchema);  