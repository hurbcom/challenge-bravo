const mongoose = require('../database');

var currencySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    com:{
        type:String,
        required:true,
        unique:true,
    },
    tur:{
        type:String,
        required:true,
        unique:true,
    },
    par:{
        type:String,
        required:true,
        unique:true,
    },
});

//Export the model
module.exports = mongoose.model('Currency', currencySchema);