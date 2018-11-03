const CONVERTER = require("./converter")
const express   = require('express');
const app       = express();

app.get('/currency', function (req, res) {

    let from = req.query.from.toUpperCase()
    let to = req.query.to.toUpperCase()
    let amount = req.query.amount
    
    let result = CONVERTER.FromToCurrency(from,to,amount)

        if(!result) {
            res.status(500).send({error:"There was an error while trying to convert. Try again"})
            return
        }
        
        let response = {
            from,
            to,
            amount,
            result
        }

        res.send(response)
    
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port!');
});