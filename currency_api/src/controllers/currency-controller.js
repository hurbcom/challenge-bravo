const mongoose = require('mongoose');
const Currency = mongoose.model('Currency');
const Sync = require('./sync')
const helpers = require('../helpers')

var today = helpers.today()

// list all
exports.listAll = async (req, res) => {

	Sync.updateCurrencies()

  try {

    const data = await Currency.find({}, '-__v -_id');
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({error:true, message: 'Falha ao carregar dados.'});
  }
};



// create
exports.create = async (req, res) => {

	Sync.updateCurrencies()
  
	try {
		// Verifica se campo obrigatorio existe
		if(req.body["symbol"] === undefined) throw ("'symbol' is required")
		if(req.body["rate"] === undefined) throw ("'rate' is required")

    const currency = new Currency({
      symbol: (req.body.symbol).toUpperCase(),
      rate: req.body.rate,
			date: today
    });

    var resp = await currency.save();

    res.status(201).send({message: resp});

  } catch (e) {

    res.status(500).send({error:true, message: e});

  }
};


// update
exports.update  = async (req, res) => {

	Sync.updateCurrencies()
	
	try{

		if(req.body["symbol"] === undefined) throw ("'symbol' is required")
		if(req.body["rate"] === undefined) throw ("'rate' is required")

		var newData = {rate:req.body.rate, date:today}

		var resp = await Currency.updateOne({symbol:req.body.symbol}, newData, {upsert: true, setDefaultsOnInsert: true})

		res.status(201).send({message: resp});
	} catch (e){
		res.status(500).send({error:true, message: e});
	}
}


// delete
exports.delete  = async (req, res) => {

	try{

		if(req.body["symbol"] === undefined) throw ("'symbol' is required")

		var resp = await Currency.deleteOne({symbol:(req.body.symbol).toUpperCase()})
		
		res.status(201).send({message: resp});
	} catch (e){
		res.status(500).send({error:true, message: e});
	}
}