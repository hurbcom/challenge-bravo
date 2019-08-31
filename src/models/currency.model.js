var fs = require('fs');
const filePath = './database.json'

const currency = {
    code: ""
}

function getCurrency(req, res, next) {
    fs.readFile(filePath, 'utf8', function(err, data){
        if (err) {
            var response = {status: 'falha', resultado: err};
            res.send(response);
        } else {
            var obj = JSON.parse(data);
            var result = {status: 'falha', resultado: 'Nenhuma moeda foi encontrada' };

            if (obj != null) {
                result = obj;
            }

            if (Object.keys(req.query).length > 0) {
                obj.currencies.forEach(function(currency) {
                    if (currency != null) {
                        if (currency.code == req.query.code.toUpperCase()) {
                            result = currency;
                        }
                    } 
                });
            }

            var response = result;
            res.send(response);
        }
    });
}

function getCurrencyByCode(req, res, next) {
    fs.readFile('./database.json', 'utf8', function(err, data){
        if (err) {
            var response = {status: 'falha', resultado: err};
            res.send(response);
        } else {            
            var obj = JSON.parse(data);
            var result = {status: 'falha', resultado: 'Nenhuma moeda foi encontrada' } ;

            if (obj != null) {
                result = obj;
            }

            obj.currencies.forEach(function(currency) {                
                if (currency != null) {
                    if (currency.code == req.params.code.toUpperCase()) {
                        result = currency;
                    }
                } 
            });

            var response = result;
            res.send(response);
        }
    });
}

function addCurrency(req, res, next) {
    fs.readFile('./database.json', 'utf8', function(err, data){
        if (err) {
            var response = {status: 'falha', resultado: err};
            res.send(response);
        } else {            
            var obj = JSON.parse(data);            

            if (Object.keys(req.body).length > 0) {
                obj.currencies.push(req.body);

                fs.writeFile('./database.json', JSON.stringify(obj), function(err) {
                    if (err) {
                    var response = {status: 'falha', resultado: err};
                    res.send(response);
                    } else {
                    var response = {status: 'sucesso', resultado: 'Registro incluído com sucesso'};
                    res.send(response);
                    }
                });
            } else {
                var response = {status: 'falha', resultado: 'Nenhum registro a ser incluído'};
                res.send(response);
            }            
        }
    });
}

function removeCurrency(req, res, next) {
    fs.readFile('./database.json', 'utf8', function(err, data){
        if (err) {
            var response = {status: 'falha', resultado: err};
            res.send(response);
        } else {
            var obj = JSON.parse(data);
            var codeDeleted = req.params.code.toUpperCase();
            var codeIndex = obj.currencies.findIndex(e => e.code === codeDeleted)

            console.log(codeDeleted)
            console.log(codeIndex)
            
            obj.currencies.splice(codeIndex,1)

            fs.writeFile('./database.json', JSON.stringify(obj), function(err) {
                if (err) {
                    var response = {status: 'falha', resultado: err};
                    res.send(response);
                } else {
                    var response = {status: 'sucesso', resultado: `Registro ${codeDeleted} excluído com sucesso`};
                    res.send(response);
                }
            });
        }
    });
}

module.exports = { getCurrency, getCurrencyByCode, addCurrency, removeCurrency }