module.exports = app => {
  
    const controller = app.controllers.currencyCoverage;

    //Endpoint de lista de todas as moedas disponiveis
    app.route('/api/v1/listCurrency')
      .get(controller.listAllCurrencies);

    //Endpoint de Conversão de moedas  
    app.route('/api/v1/convert')
    .get(controller.convert);

    //Endpoint de adição de uma nova moeda para conversão 
    app.route('/api/v1/currency')
    .post(controller.addCurrency);

   //Endpoint de remoção de uma nova moeda para conversão 
    app.route('/api/v1/currency')
    .delete(controller.removeCurrency);

      //Endpoint que atualiza os valores das moedas cadsatradas
      app.route('/api/v1/updateCurrencyValues')
      .get(controller.updateCurrencyValues);


    
  }