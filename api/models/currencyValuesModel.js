module.exports = app => {

    const currencyValuesModel = {};  
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

    currencyValuesModel.removeCurrency = (currency) => {

        return new Promise((resolve, reject) => {

            jsonfile.readFile(currencyValuefile, (err, objFile) => {

                if(objFile.currency[currency])
                {
                    delete objFile.currency[currency];
                    jsonfile.writeFile(currencyValuefile, objFile);

                    resolve({
                        "success": true,
                        "message": "Currency " + currency + " successfully deleted!"
                    });
                }
                else 
                {
                    reject(failMessage('currency is not Registered'));
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