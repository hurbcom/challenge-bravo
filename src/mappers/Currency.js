class Currency {
    constructor () {
        // -
    }

    toDTO (currencyObj) {
        return {
            currencyId: currencyObj.id,
            currencyCode: currencyObj.from || currencyObj.to || currencyObj.code,
            currencyQuote: +currencyObj.quote_value || +currencyObj.bid
        }
    }

    toDomain () {
        // -
    }

    toPersistence () {
        // -
    }
}

export default new Currency();