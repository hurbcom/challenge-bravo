const express = require("express");
const routes = express.Router();

const {Currencyquotation} = require('./services/coins');

routes.get("/", function (req, res) {
  return res.send("Você esta no Desafio");
});
routes.post("/", function (req, res) {
  return res.send("Você esta no Desafio");
});


routes.get("/coin", Currencyquotation.get);
// routes.post("/limpaMemoria", PostComandos.limpaMemoria);



// routes.get("/cpu", CPU.cpuStatus);



module.exports = routes;
