const mongoose = require('mongoose');

const log = new mongoose.Schema({
    queryDate: Date,
    coinBase: String,
    coinName:String,
    // basecurrencyquote: Number,
    // nationalCoin: String,
    // nationalcurrencyquote: Number,
    // conversion:String
    coin: Object,

})

const Historicalquotes = mongoose.model('Historicalquotes', log, 'historicalquotes');

module.exports.Historicalquotes = Historicalquotes;


const HistoricalquotesTest = mongoose.model('HistoricalquotesTest', log, 'historicalquotesTest');

module.exports.HistoricalquotesTest = HistoricalquotesTest;
