const mongoose = require("mongoose");

const dbURI =
    "mongodb+srv://hurb:D4t4b4s3@cluster-hurb.f7bim.mongodb.net/CurrencyConverter?retryWrites=true&w=majority";

try {  
  mongoose.connect(dbURI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
  }, () => {
      console.log('Banco de dados conectado!');
  })
} catch(err) {
  console.log(err)
}

// Models
require("../models/currencyModel");