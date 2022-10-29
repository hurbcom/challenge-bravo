const mongoose = require('mongoose');
const Currency = mongoose.model('Currency');
const Sync = require('./sync')

// convert
exports.convert = async (req, res) => {
  try {

		Sync.updateCurrencies()

		// Verifica se campo obrigatorio existe
		if(req.body["from"] === undefined) throw ("'from' is required")
		if(req.body["to"] === undefined) throw ("'to' is required")
		if(req.body["value"] === undefined) throw ("'value' is required")

    var currencyFrom = await Currency.find({symbol:(req.body.from).toUpperCase()})
    var currencyTo = await Currency.find({symbol:(req.body.to).toUpperCase()})
		console.log("FROM",currencyFrom)
		console.log("TO",currencyTo)
		// se a origem for USD
    if((req.body.from).toUpperCase() === "USD"){
			console.log(req.body.value +"*"+ currencyTo[0].rate)
			var resp = req.body.value * currencyTo[0].rate

		} else if((req.body.to).toUpperCase() === "USD"){ // se o destino for USD
			console.log(req.body.value +"/"+ currencyFrom[0].rate)
			var resp = req.body.value / currencyFrom[0].rate

		}else{ // se não tiver USD na conversão
			var currencyBase = await Currency.find({symbol:"USD"})
			var convertToBase = req.body.value / currencyFrom[0].rate
			console.log("COUNT_TO_BASE",req.body.value +"/"+ currencyFrom[0].rate)
			console.log("TO_BASE",convertToBase)
			var resp = convertToBase * currencyTo[0].rate
		}

    res.status(200).send({from:req.body.from.toUpperCase(), to:req.body.to.toUpperCase(), value: req.body.value, result:resp, text:req.body.value+" "+req.body.from.toUpperCase()+" = "+resp.toFixed(2)+" "+req.body.to.toUpperCase()});

  } catch (e) {

    res.status(500).send({error:true, message: e});

  }
};