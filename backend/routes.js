const express = require("express");
const routes = express.Router();

const {Currencyquotation} = require('./services/coins');
const {UpdateCoin} = require('./services/updateCoins');

routes.get("/", function (req, res) {
  return res.send("Você esta no Desafio");
});
routes.post("/", function (req, res) {
  return res.send("Você esta no Desafio");
});


routes.get("/coin", Currencyquotation.get);

routes.get("/test", Currencyquotation.getTest);

routes.put("/update", UpdateCoin.add);

routes.delete("/delete", UpdateCoin.delete);

// routes.get("/cpu", CPU.cpuStatus);



module.exports = routes;
