const mongoose = require('mongoose')

mongoose.Promise = global.Promise;

// Conector central do banco de dados
mongoose.connect('mongodb://localhost:27017/challengeBravo', {
    useNewUrlParser: true,
    useCreateIndex: true,
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});

module.exports = mongoose