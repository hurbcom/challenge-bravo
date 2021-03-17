const mongoose = require('mongoose');

const logRequest = new mongoose.Schema({
  error: Boolean,
  errorMessage:String,
  creationDate: Date,
  quoteCreated: Date,
  entryRequest: Object,
  output:Object,
  logs:Array
});

const Logs = mongoose.model('LogRequest', logRequest, 'logRequest');

module.exports.Logs = Logs;
