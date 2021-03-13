const express = require("express");
const routes = express.Router();



routes.get("/", function (req, res) {
  return res.send("Você esta no Desafio");
});
routes.post("/", function (req, res) {
  return res.send("Você esta no Desafio");
});

// routes.post("/limpaMemoria", PostComandos.limpaMemoria);



// routes.get("/cpu", CPU.cpuStatus);



module.exports = routes;
