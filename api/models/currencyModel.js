module.exports = app => {
    
    const currencyModel = {};
    const currencyCoverageValues = app.data.currencyValues.currency;

    currencyModel.convertFromTo = (from, to, amount) => {

        let dolarValue = currencyModel.toDolar(amount, from);
        if(dolarValue.success)
        {
            return currencyModel.toCurrency(dolarValue.value, to);
        }
    }
 
    //Converte valor para Dolar
    currencyModel.toDolar = (amount, currency) => {

        let convertedToDolar = currencyCoverageValues[currency];
        if(convertedToDolar)
        {
            if(typeof amount !== 'number'){
                return failMessage('Amount should be a valid Number!');
            }
            return {
                "success": true, 
                "value": amount/convertedToDolar
            }
        }
        else 
        {
            return failMessage('Currency ' + currency + ' not Available!');            
        }
    }

    //Converte valor para moeda correta
    currencyModel.toCurrency = (amount, currency) => {

        let convertedToDolar = currencyCoverageValues[currency];
        if(convertedToDolar)
        {
            if(typeof amount !== 'number'){
                return failMessage('Amount should be a valid Number!');
            }
            return {
                "success": true, 
                "currency": currency,
                "value": (amount * convertedToDolar).toFixed(2),
                
            }
        }
        else 
        {
            return failMessage('Currency ' + currency + ' not Available!');
        }
    }


    failMessage = (message) => {
        return {
            "success": false,
            "errorMessage": message 
        };
    }

    return currencyModel;
}
