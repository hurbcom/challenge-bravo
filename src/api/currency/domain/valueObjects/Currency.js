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

Currency.prototype.isSupportedUsing = function (allowedCurrencies) {
    // Tries to find if allowedCurrencies has the abbreviation
    // for is faster, 
    // check https://stackoverflow.com/questions/8217419/how-to-determine-if-javascript-array-contains-an-object-with-an-attribute-that-e
    for (var i = 0; i < allowedCurrencies.length; i++) {
        if (allowedCurrencies[i].abbreviation === this.abbreviation) {
            return true
        }
    }
    return false
}

const currencyFactory = abbreviation => {
    if (!abbreviation)
        throw Error('abbreviation must not be empty')
    const validation = validate(abbreviation, Abbreviation)

    if (!validation.isValid())
        throw Error(validation.firstError().message)

    const currencyObject = Currency({ abbreviation: abbreviation.toUpperCase() })
    return currencyObject
}

module.exports = currencyFactory