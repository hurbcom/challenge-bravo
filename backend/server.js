const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const {enums} = require('./configs/enums');

class App {
  constructor() {
    this.express = express();

    this.database();
    this.middlewares();
    this.routes();

    
    this.express.listen(enums.apiPort, () =>
      console.log(`Sua API REST está funcionando na porta ${enums.apiPort} `)
    );
  }

  database() {
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

  }

  middlewares() {
    this.express.use(express.json());
    this.express.use(cors());
  }

  routes() {
    this.express.use(require("./routes"));
  }
}
module.exports = new App().express;