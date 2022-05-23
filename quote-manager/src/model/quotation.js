const Mongoose = require('mongoose')
const { SchemaTypes } = Mongoose

const quoteSchema = new Mongoose.Schema({
    coinName: { type: SchemaTypes.String, required: true },
    coinCode: { type: SchemaTypes.String, required: true, unique: true },
    type: { type: SchemaTypes.String, required: true, enum: ["API", "FIXE"] },
    quote: {
        sale: { type: SchemaTypes.String },
        buy: { type: SchemaTypes.String }
    }
}, { collection: 'quote' })

module.exports = Mongoose.model('QuoteModel', quoteSchema)