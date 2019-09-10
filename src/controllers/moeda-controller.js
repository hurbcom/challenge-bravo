'use-strict'

// carregando biblioteca de file system
const fs = require("fs");

// carregando json com todas as moedas
const moedas = require("../../moedas.json");


// início api para inclusão de moeda
exports.post = (req, res, next) => {
  // variável da moeda enviada para api
  const moeda = req.body.moeda; 
  // verificando se existe esta moeda cadastrada no json de moedas
  if(!moedas.hasOwnProperty(moeda)){
  // inserindo moeda no objeto moedas
  moedas[moeda] = "1";
  // gravando o novo objeto no json
  fs.writeFile("./moedas.json", JSON.stringify(moedas), function(err) {
  // resposta de erro
  if(err) {
  res.json(err);  
  }
  // resposta de de sucesso
  res.json({'Resposta':'Moeda adicionada com sucesso!.'});  
  });   
  }
  // resposta caso a moeda ja exista no json moedas
  else {
  res.json({'Resposta':'Moeda já existente.'});  
  }
};

// início da api para exclusão de moeda
 exports.delete = (req, res, next) => {
  // variável da moeda enviada para api
  let moeda = req.params.moeda; 
  // verificando se existe esta moeda cadastrada no json de moedas
  if(moedas.hasOwnProperty(moeda)){
  // excluindo a moeda no objeto moedas
  delete moedas[moeda];
  // gravando o novo objeto no json
  fs.writeFile("./moedas.json", JSON.stringify(moedas), function(err) {
    // resposta de erro
    if(err) {
    res.json({'Resposta':'Erro ao Excluir Moeda.'});  
    }
    // resposta de de sucesso
    res.json({'Resposta':'Moeda excluida com sucesso!.'});  
    });   
  }
  // resposta caso a moeda não exista no json moedas
  else {
    res.json({'Resposta':'Moeda não existe.'});  
  }
 };


