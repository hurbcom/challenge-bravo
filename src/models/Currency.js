import db from '../database'

const CurrencySchema = new db.Schema({
  currency: {
    type: String,
    required: true,
    uppercase: true,
    unique: true
  }
})

export default db.model('Currency', CurrencySchema)
