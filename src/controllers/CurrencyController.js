const { convertAmount } = require('../helpers/currencyHelpers');
const fs = require('fs');

class CurrencyController {

    availableCurrencies(req, res) {
        return res.json({ data : available_currencies });
    }

    addAvailableCurrencies(req, res) {
        try {
            const { currencyName } = req.body;

            if(available_currencies.includes(currencyName)) {
                return res.status(200).json({ "message" : `This currency already exists.` });
            }

            available_currencies.push(currencyName);
            fs.appendFile('./src/available_currencies', "\n"+currencyName, (err) => {
                if (err) throw err;
                return res.status(201).json({ "message" : `Currency ${currencyName} has been added successfully.` });
            });
            
        } catch(e) {
            return res.status(400).json({ "message" : e.message });
        }
    }

    async convert(req, res) {
        const { from, to, amount } = req.query;
        try {
            const convertedValue = await convertAmount(from, to, amount);
            return res.json({ "value" : convertedValue });    
        } catch (e) {
            return res.status(400).json({ "message" : e.message });
        }
    }
}

module.exports  = new CurrencyController();