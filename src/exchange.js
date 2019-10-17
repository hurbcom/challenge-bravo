const Currency = require('./Currency/currency').currency;
const Quote = require('./Quotes/quote');
const QuoteService = require('./Quotes/quoteService');

const getExchange = async (req, res, next) => {
    if(req.query.from != undefined && req.query.to != undefined && req.query.amount != undefined ){
        let from = req.query.from;
        let to = req.query.to;
        let amount = req.query.amount;

        let now = new Date();
        let start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),1,0,0);
        let end = new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,0,59,59);

        result = await Quote.find({ 'date': {
            $gte: start,
            $lt: end
        }}, (err, date) => {});
        
        if(result.length == 0){
            result = await QuoteService.updateQuotes();             
            if(result.status == 'error'){
                return res.status(404).json({'error': result.error});
            }
        }
    
        resultFrom = await Currency.find({ 'currency': from }, (err, currency) => {});
        resultTo = await Currency.find({ 'currency': to }, (err, currency) => {});

        if(resultFrom.length == 0){
            return res.status(404).json({'error':"Moeda '" + from + "' não encontrada"});
        } else if(resultTo.length == 0) {
            return res.status(404).json({'error':"Moeda '" + to + "' não encontrada"});         
        }

        exchangeFrom = await Quote.find({name: from}, (err, exchange) => {});
        exchangeTo = await Quote.find({name: to}, (err, exchange) => {});

        if(exchangeFrom.length == 0){
            return res.status(404).json({'error':"Moeda '" + from + "' não encontrada"});
        } else if(exchangeTo.length == 0) {
            return res.status(404).json({'error':"Moeda '" + to + "' não encontrada"});           
        }

        exchange = (amount/exchangeFrom[0].quote)*exchangeTo[0].quote;
        return res.status(200).json({'exchange': exchange})
    } else {
        return res.status(400).json({'error':'Parâmetro incorreto'})
    }
}

module.exports = { getExchange }