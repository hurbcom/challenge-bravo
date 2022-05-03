const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;

// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.on('connected', () => {
    // eslint-disable-next-line no-console
    console.log('Mongoose default connection is open');
});

module.exports = mongoose;
