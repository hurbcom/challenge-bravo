const mongoose = require('mongoose')
const DATABASE_URL = 'mongodb+srv://currency:currency@currency-api-gktii.mongodb.net'

mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.set('useCreateIndex', true)

mongoose.Promise = global.Promise

module.exports = mongoose