module.exports = app => {

    const currencyValuesModel = {};
    // const currencyCoverageValues = app.data.currencyValues.currency;

    const jsonfile = require('jsonfile');
    const currencyValuefile = './api/data/currencyValues.json';

    currencyValuesModel.addCurrency = (currency, conversionRate) => {

        return new Promise((resolve, reject) => {

            jsonfile.readFile(currencyValuefile, (err, objFile) => {

                if(!objFile.currency[currency])
                {
                    if(typeof conversionRate === 'number')
                    {   
                        objFile.currency[currency] = conversionRate;
                        jsonfile.writeFile(currencyValuefile, objFile);
    
                        resolve({
                            "success": true,
                            "message": "Currency " + currency + " successfully registered!"
                        });
                    }
                    else 
                    {
                        reject(failMessage('conversion Rate must be a number'));
                    }
                }
                else 
                {
                    reject(failMessage('currency Already Registered'));
                }         
            });
        });
    }
    
    //Endpoint de Conversão de moedas
    failMessage = (message) => {
        return {
            "success": false,
            "errorMessage": message 
        };
    }

    return currencyValuesModel;

}