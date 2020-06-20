module.exports = app => {

    const currencyCoverageValues = app.data.currencyValues;
    const currencyModel = app.models.currencyModel;
    const currencyValuesModel = app.models.currencyValuesModel;
    const controller = {};

    //Lista todas as moedas disponiveis para conversão na api
    controller.listAllCurrencies = (req, res) => {
      res.status(200).json(currencyCoverageValues.currency)
    }

    //Realiza a conversão de moedas
    controller.convert = (req, res) => {

      if(!req.query.from || !req.query.to || !req.query.amount)
      {
        res.status(400).json({'success': false, errorMessage: "Fields From, To and Amount Required!"})
      }
      else
      {
        conversion = currencyModel.convertFromTo(req.query.from, req.query.to, parseInt(req.query.amount));
        if(conversion.success)
        {
          res.status(200).json(conversion)
        }
        else 
        {
          res.status(400).json(conversion)
        }
      }
    }

    //Adiciona uma nova moeda para conversão 
    controller.addCurrency = (req, res) => {

      currencyValuesModel.addCurrency(req.body.currency, parseInt(req.body.conversionRate))
      .then(resolved => res.status(201).json(resolved))
      .catch(err => res.status(200).json(err))
    }


  
    return controller;

  }