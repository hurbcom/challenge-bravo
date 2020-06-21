module.exports = app => {

    const cronUpdateCurrencyValues = {};  
    const jsonfile = require('jsonfile');
    const currencyValuefile = './api/data/currencyValues.json';
    const fetch = require('node-fetch');


    cronUpdateCurrencyValues.updateAll = async () => {
         
        //Atualiza os valores das cryptomoedas no arquivo
         await updateCryptoValues();

         return new Promise((resolve, reject) => {
                    
            fetch('https://api.exchangeratesapi.io/latest?base=USD')
                .then(res => res.json())
                .then(json => {
                    var rates = json.rates;
                    //Lê o arquivo que possui todas as moedas disponiveis
                    jsonfile.readFile(currencyValuefile, (err, objFile) => {
                        Object.keys(objFile.currency).forEach(currency => {
                            if(typeof rates[currency] !== 'undefined')
                            {
                                objFile.currency[currency] = rates[currency];
                            }                                    
                        });
                        
                        //Atualiza o arquivo que armazena os valores de cada moeda
                        jsonfile.writeFile(currencyValuefile, objFile);
                    });                    
            
                    resolve({
                        "success": true,
                        "message": "Success"
                    });
                })
                .catch(err=> {
                    reject({
                    "success": false,
                    "message": "An error Occurred" + JSON.stringify(err)
                    });
                });
        });
    }

    //Responsável por atualizar todas as criptomoedas armazenadas
    updateCryptoValues = () => {
       
        return new Promise((resolve, reject) => {

            var receivedObjCrypto = {};
            fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
            .then(res => res.json())
            .then(json => {

                //Varre a resposta da API de Criptomoedas e armazena na variavel receivedObjCrypto
                json.forEach(cryptoCoin => {
                    receivedObjCrypto[cryptoCoin.symbol.toUpperCase()] = (cryptoCoin.high_24h + cryptoCoin.low_24h) / 2;
                });
                
                //Abre e manipula o arquivo com as moedas armazenadas
                jsonfile.readFile(currencyValuefile, (err, objFile) => {
                    Object.keys(objFile.currency).forEach(currency => {
                        if(typeof receivedObjCrypto[currency] !== 'undefined')
                        {
                            objFile.currency[currency] = receivedObjCrypto[currency];
                        }                                    
                    });
                    //Atualiza o arquivo que armazena os valores de cada moeda
                    jsonfile.writeFile(currencyValuefile, objFile);
                })
                resolve({"success": true});
            })
            .catch(err=> {
                reject({"success": true})
            });

        })
    }

    return cronUpdateCurrencyValues;
}