const express = require('express');
const { QUOTATIONS, updateQuotes } = require('./quotation');
const api = express();

api.set('view engine', 'ejs');
api.use(express.static(__dirname + '/../public'));

/*
 * aqui é feita a primeira atualização das cotações
 */
updateQuotes();

/* 
 * caso a rota raiz seja acessada, séra renderizada uma página de index
 * com instruções para a relazação de uma consulta na API 
 */
api.get('/', (request, response) => {
  response.render('index');
})

api.get('/api', (request, response) => {

  let { from, to, amount } = request.query;

  /* verifica-se se os parâmetros necessários foram passados */
  if (from && to && amount) {
    try {
      /* verifica se algum parametro fornecido é invalido */
      if (!QUOTATIONS[from].quotes[to]) throw new Error();
      /* result recebe o produto de 'amount' pela cotação atual */
      let result = amount * QUOTATIONS[from].quotes[to]
      /* retorno result */
      response
        .status(200)
        .send({ from, to, amount, result });
    } catch (error) {
      /*
       * caso o código da moeda fornecido por parametro seja inválido, será lançado um erro
       */
      throw new Error('One or more currency codes provided are not available for query');
    }

  } else {
    /* 
     * caso a cláusula acima não seja satisfeita, séra lançado um erro
     */
    throw new Error('One or more parameters missing or misspelled');
  }
})

/*
 * rota que tratará de paths não encontrados
 */
api.use((request, response) => {
  response
    .status(404)
    .send({
      response: 'Error',
      message: 'Page not found',
      path: request.path,
    });
});

/*
 * rota que tratará dos erros no servidor
 */
api.use((error, request, response, next) => {
  response
    .status(500)
    .send({
      response: 'Error',
      message: error.message,
      path: request.path,
    });
})

/*
 * aqui é definido que a cada 20 segundos as cotações serão atualizadas
 */
setInterval(updateQuotes, 20000);

module.exports = api;