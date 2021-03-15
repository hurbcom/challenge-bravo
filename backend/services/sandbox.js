const mongoose = require('mongoose');
const { enums } = require('../configs/enums');
const { Logs } = require('../models/schemas/logs');
const axios = require('axios');


(async () => {
  // try {
  //   mongoose.connect(enums.mongo.connString, {
  //     useCreateIndex: true,
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   });
  //   console.log("Conectado ao mongo");
  // } catch (e) {
  //   console.log(e);
  // }



  // try {
  //   const obj = {
  //     envio: true,
  //     dataCriacao: new Date(),
  //     modulo: "testes",
  //     statusCode: 200,
  //     conteudo: { "USD": { "BRL": 7.00 } },
  //   }
  //   let teste = await Logs(obj).save()
  //   console.log(teste);
  //   console.log(await Logs.find({}).count());
  //   console.log("foi");
  //   process.exit()
  // } catch (e) {
  //   console.log(e);
  //   process.exit()
  // }
  let array = []
  console.time("start")
  for (let i = 0; i < 201; i++) {
    let test = axios({
      url: `http://localhost:1234/coin/?from=BTC&to=EUR&amount=${i * 3.1256}`,
      method: "get"
    })
    // console.log(test.data);
    // array.push(i)
    i = i - 1
  }
  // array.map(async (x) => {
  // })
  console.timeEnd("start")


  // process.exit()




})()

