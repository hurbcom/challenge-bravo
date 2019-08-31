const express = require('express')
const bodyParser = require('body-parser')
var fs = require('fs');

const axios = require('axios')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.get('/currency', function(req, res){
    fs.readFile('./database.json', 'utf8', function(err, data){
        if (err) {
            var response = {status: 'falha', resultado: err};
            res.json(response);
        } else {
            console.log(data)
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
            res.json(response);
        }
    });
});

app.get('/currency/:code', function(req, res){
    fs.readFile('./database.json', 'utf8', function(err, data){
        if (err) {
            var response = {status: 'falha', resultado: err};
            res.json(response);
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
            res.json(response);
        }
    });
});

app.post('/currency', function(req, res){
    fs.readFile('./database.json', 'utf8', function(err, data){
        if (err) {
            var response = {status: 'falha', resultado: err};
            res.json(response);
        } else {            
            var obj = JSON.parse(data);            

            if (Object.keys(req.body).length > 0) {
                obj.currencies.push(req.body);

                fs.writeFile('./database.json', JSON.stringify(obj), function(err) {
                    if (err) {
                    var response = {status: 'falha', resultado: err};
                    res.json(response);
                    } else {
                    var response = {status: 'sucesso', resultado: 'Registro incluído com sucesso'};
                    res.json(response);
                    }
                });
            } else {
                var response = {status: 'falha', resultado: 'Nenhum registro a ser incluído'};
                res.json(response);
            }            
        }
    });
});

app.delete('/currency/:code', function(req, res){
    fs.readFile('./database.json', 'utf8', function(err, data){
        if (err) {
            var response = {status: 'falha', resultado: err};
            res.json(response);
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
                    res.json(response);
                } else {
                    var response = {status: 'sucesso', resultado: `Registro ${codeDeleted} excluído com sucesso`};
                    res.json(response);
                }
            });
        }
    });
});

app.listen(3000)