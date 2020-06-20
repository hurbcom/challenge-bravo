module.exports = app => {

    const currencyCoverageValues = app.data.currencyValues;
    const controller = {};

    controller.listAllCurrencies = (req, res) => res.status(200).json(currencyCoverageValues.currency);
  
    return controller;

  }