var fs = require('fs');

const filePath = './database.json'
const encode = 'utf8'
const defaultJson = '{"currencies":[]}'

const error = msg => ({ status: 'failure', result: msg })

const currencyExists = (obj, code) => obj.currencies.some(e => e.code === code.toUpperCase())
const getCurrencyIndex = (obj, code) => obj.currencies.findIndex(e => e.code === code.toUpperCase())

function getCurrency(req, res, next) {
    fs.readFile(filePath, encode, (err, data) => {
        if (err) return res.send(error(err))       
        if (!data) return res.send(defaultJson)
                
        console.log('1')
        var obj = JSON.parse(data)

        if (obj != null) response = obj

        return res.send(response);        
    });
}

function getCurrencyByCode(req, res, next) {
    fs.readFile(filePath, encode, (err, data) => {
        if (err) return res.send(error(err))       
        if (!data) return res.send(defaultJson)
        
        var obj = JSON.parse(data);

        if (obj != null) response = obj

        obj.currencies.forEach(function(currency) {                
            if (currency != null) {
                if (currency.code == req.params.code.toUpperCase()) {
                    response = currency;
                }
            } 
        });

        return res.send(response);
    });
}

function addCurrency(req, res, next) {
    fs.readFile(filePath, encode, (err, data) => {
        if (err) return res.send(error(err))                  

        var obj = JSON.parse(data || defaultJson);

        if (obj != null) response = obj
        
        if (Object.keys(req.body).length > 0) { 
            if (!currencyExists(obj, req.body.code)) {
                obj.currencies.push(req.body)

                fs.writeFile(filePath, JSON.stringify(obj), err => {
                    if (err) res.send(error(err))
                    
                    response = obj            
                });        
            }
        }

        return res.send(response)
    });
}

function removeCurrency(req, res, next) {
    fs.readFile(filePath, encode, (err, data) => {
        if (err) return res.send(error(err))       
        if (!data) return res.send(defaultJson) 

        var obj = JSON.parse(data);

        if (obj != null) response = obj

        if (currencyExists(obj, req.params.code)) {
            var codeIndex = getCurrencyIndex(obj,req.params.code)

            obj.currencies.splice(codeIndex,1)

            fs.writeFile(filePath, JSON.stringify(obj), err => {
                if (err) res.send(error(err))  
                
                response = obj
            });
        }  

        return res.send(response);
    });
}

module.exports = { getCurrency, getCurrencyByCode, addCurrency, removeCurrency }