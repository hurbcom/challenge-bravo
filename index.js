const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const app = express();

const PORT = 3000;
const HOST = "0.0.0.0";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

mongoose
  .connect("mongodb://db:27017/docker-node-mongo", { useNewUrlParser: true
  })
  .then(result => {
    console.log("MongoDB Conectado");
  })
  .catch(error => {
    console.log(error);
  });

require("./src/router/currencyRouter")(app);

app.listen(PORT, HOST, () => {
  console.log(`Listening on port with docker : ${PORT}`);
});
