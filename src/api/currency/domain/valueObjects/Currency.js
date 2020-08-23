const t = require('tcomb-validation');
const validate = require('tcomb-validation').validate

const MAX_CURRENCY_ABBREV_LENGTH = 3

const hasNumber = e => /\d/.test(e)
const hasAbbrevLength = e => e.length === MAX_CURRENCY_ABBREV_LENGTH
const abbrevRules = e => hasAbbrevLength(e) && !hasNumber(e)

const Abbreviation = t.refinement(t.String, abbrevRules, 'Currency Abbreviation')

const Currency = t.struct({
    abbreviation: Abbreviation
}, 'Currency')

// Currency.prototype.isSupported = 

const currencyFactory = abbreviation => {
    const validation = validate(abbreviation, Abbreviation)
    if (!validation.isValid())
        throw Error(validation.firstError().message)
    const currencyObject = Currency({ abbreviation: abbreviation.toUpperCase() })
    return currencyObject
}

module.exports = currencyFactory