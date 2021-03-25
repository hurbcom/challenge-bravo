const mongoose = require('mongoose');

const { enums } = require('./enums');

try {
  mongoose.connect(enums.mongo.connString, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Conectado ao mongo');
} catch (e) {
  console.log(e);
}
