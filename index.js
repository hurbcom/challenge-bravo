const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const currencyApi = require('./currencyapi.js')

const app = express() // iniciar o app

app.use(morgan('dev')) // Log de execução
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json()) //np o tipo de dados que iremos receber (Json)
app.use(cors()) //determina o domínio de origem 

//Buscar dados
app.get('/', function (req, res) {
    let from = req.query.from;
    let to = req.query.to;
    let amount = req.query.amount;

    if(isNaN(amount)){
        res.status(400);
        res.send("Amount inválido");
        return;
    }

    currencyApi.getValue(from, to, function(response){
        if(response.status == 404){
            res.status(404);
            res.send("Moeda não encontrada");
            return;
        }
        let finalValue = amount * response[0].bid;
        finalValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: to.toUpperCase() }).format(finalValue);

       let result = {
           from: from.toUpperCase(),
           to: to.toUpperCase(),
           amount: amount,
           value:  finalValue
       } 
       res.send(result);
  });
});

app.listen(2162, () => {
    console.log('Express started at http://localhost:2162')
})

