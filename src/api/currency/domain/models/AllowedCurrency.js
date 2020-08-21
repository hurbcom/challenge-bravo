const t = require('tcomb')

const AllowedCurrency = t.struct({
    id: t.maybe(t.String),
    abbreviation: t.maybe(t.String),
    createdAt: t.maybe(t.Date),
    updatedAt: t.maybe(t.Date)
})

module.exports = compose(AllowedCurrency)