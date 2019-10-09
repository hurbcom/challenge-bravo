const mongoose = require('mongoose');

module.exports = mongoose.connect('mongodb://banco/myDataBase',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})