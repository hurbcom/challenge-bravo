const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
var currency = require('./currency')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    var result = 0

    currency = req.query

    const url = `https://api.exchangeratesapi.io/latest?base=${currency.from}`

    axios.get(url).then(response => {        
        rate = response.data.rates[currency.to]

        result = currency.amount * rate        
        console.log(result)

        return res.send({ ...currency, result })
    })    
})

app.listen(3000)