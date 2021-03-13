const mongoose = require('mongoose');
const { enums } = require('../configs/enums');
const { Logs } = require('../models/schemas/logs');



(async () => {
  try {
    mongoose.connect(enums.mongo.connString, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado ao mongo");
  } catch (e) {
    console.log(e);
  }



  try {
    const obj = {
      envio: true,
      dataCriacao: new Date(),
      modulo: "testes",
      statusCode: 200,
      conteudo: { "USD": { "BRL": 7.00 } },
    }
    let teste = await Logs(obj).save()
    console.log(teste);
    console.log(await Logs.find({}).count());
    console.log("foi");
    process.exit()
  } catch (e) {
    console.log(e);
    process.exit()
  }
})()

