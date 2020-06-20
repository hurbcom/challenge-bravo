module.exports = app => {

    const currencyValuesModel = {};  
    const jsonfile = require('jsonfile');
    const currencyValuefile = './api/data/currencyValues.json';

    /**
     * Adiciona moedas para serem consumidas pela api
     * 
     * @param {string} currency Sigla da Moeda
     * @param {number} conversionRate Valor do Lastro em Dólar
     * 
     * @returns {Promise} array
     */
    currencyValuesModel.addCurrency = (currency, conversionRate) => {

        return new Promise((resolve, reject) => {

            //Lê o arquivo que possui todas as moedas disponiveis
            jsonfile.readFile(currencyValuefile, (err, objFile) => {

                if(!objFile.currency[currency])
                {
                    if(typeof conversionRate === 'number')
                    {   
                        objFile.currency[currency] = conversionRate;
                        //Atualiza o arquivo incluindo a moeda recebida com seu respectivo lastro
                        jsonfile.writeFile(currencyValuefile, objFile);
    
                        resolve({
                            "success": true,
                            "message": "Currency " + currency + " successfully registered!"
                        });
                    }
                    else 
                    {
                        reject(failMessage('Conversion Rate must be a number'));
                    }
                }
                else 
                {
                    reject(failMessage('Currency '+currency+' is already registered'));
                }         
            });
        });
    }

    /**
     * Remove moedas que podem ser consumidas pela api
     * 
     * @param {string} currency 
     * 
     * @returns {Promise} array
     */
    currencyValuesModel.removeCurrency = (currency) => {

        return new Promise((resolve, reject) => {

            //Lê o arquivo que possui todas as moedas disponiveis
            jsonfile.readFile(currencyValuefile, (err, objFile) => {

                if(objFile.currency[currency])
                {
                    delete objFile.currency[currency];
                    //Atualiza o arquivo removendo a moeda recebida
                    jsonfile.writeFile(currencyValuefile, objFile);

                    resolve({
                        "success": true,
                        "message": "Currency " + currency + " successfully deleted!"
                    });
                }
                else 
                {
                    reject(failMessage('Currency ' + currency + ' is not Registered'));
                }         
            });
        });
    }
    
    /**
     * Retorno de Mensagem com erro
     * 
     * @param {string} message 
     */
    failMessage = (message) => {
        return {
            "success": false,
            "errorMessage": message 
        };
    }

    return currencyValuesModel;

}