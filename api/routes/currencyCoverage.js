module.exports = app => {
    const currency = app.controllers.currencyCoverage;
  
    app
    .route('/api/v1/listCurrency')
      .get(currency.listAllCurrencies);

    
  }