const axios = require('axios')
const mongoose = require('mongoose');
const Currency = mongoose.model('Currency')
require('dotenv').config();
const helpers = require('../helpers')

const BASE_URL_API = "https://api.apilayer.com/"
const API_KEY = process.env.API_KEY

var today = helpers.today()



exports.updateCurrencies = async (req, res) => {

	const data = await Currency.find({"symbol":"USD"});

	// Se não encontrar registro dolar USD, ou a data do registro for diferente de HOJE
	if(data.length === 0 || data[0].date !== today){
		var headers = {"apikey":"xinvzCdoSTxdt0jlpRnL9hZmSXgzKgvO"}

		axios.get(BASE_URL_API+"fixer/latest?base=USD", {headers}).then(resp =>{
			
			Currency.updateOne({symbol:"USD"},{name:"United States Dollar", symbol:"USD", rate:1, date:resp.data.date}, {upsert: true, setDefaultsOnInsert: true}).catch(error=>{
				console.log(error)
			})

			for(var item in resp.data.rates){
				Currency.updateOne({symbol:item}, {symbol:item, rate:resp.data.rates[item], date:resp.data.date}, {upsert: true, setDefaultsOnInsert: true}).then(r=>console.log(r)).catch(e=>console.log(e))
			}

		}).catch(err=>{
			console.log("ERR",err)
		})
	}
}
