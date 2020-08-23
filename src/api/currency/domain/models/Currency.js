const t = require('tcomb')

const AllowedCurrency = t.struct({
    abbreviation: t.String
})

module.exports = compose(AllowedCurrency)