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
            var result = 'Nenhuma moeda foi encontrado';

            if (obj != null) {
                result = obj;
            }

            obj.currencies.forEach(function(currency) {
                if (currency != null) {
                    if (currency.code == req.query.code) {
                        result = currency;
                    }
                } 
            });

            var response = result;
            res.json(response);
        }
    });
});

app.listen(3000)