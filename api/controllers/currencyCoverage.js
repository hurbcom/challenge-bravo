module.exports = app => {

    const currencyCoverageValues = app.data.currencyValues;
    const currencyModel = app.models.currencyModel;
    const controller = {};

    controller.listAllCurrencies = (req, res) => {
      res.status(200).json(currencyCoverageValues.currency)
    }

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



  
    return controller;

  }