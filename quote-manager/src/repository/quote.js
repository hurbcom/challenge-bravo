const Mongoose = require('mongoose')
const { models } = Mongoose

exports.getCoinsApiUpdate = () => {
    const query = { type: "API" }
    const project = { _id: 0, coinCode: 1 }
    return models.QuoteModel.find(query, project)
}

exports.updateQuoteValue = (quote) => {
    const query = { coinCode: quote.coinCode }
    const upset = { 'quote.sale': quote.sale, 'quote.buy': quote.buy }
    return models.QuoteModel.findOneAndUpdate(query, upset)
}