const Status = require("http-status")

module.exports = ({
    response: { Success, Fail },
    currencyConversionService,
    currencyRepository,
    currencyFactory
}) => {

    const get = (req, res, next, from, to, amount) => {
        return Promise.resolve()
            .then(async () => {
                amount = amount.replace(',', '.') // Simplifying for API user

                console.log(!amount)
                // checks if amount is number
                if (!amount || isNaN(amount))
                    throw Error("amount is an invalid number")

                const allowedCurrencies = await currencyRepository.getAll()

                fromCurrency = currencyFactory(from)
                toCurrency = currencyFactory(to)

                const isFromSupported = fromCurrency.isSupportedUsing(allowedCurrencies)
                const isToSupported = toCurrency.isSupportedUsing(allowedCurrencies)

                if (!isFromSupported) throw Error(`${from} is not supported`)
                if (!isToSupported) throw Error(`${to} is not supported`)

                const converted = await currencyConversionService.convert(fromCurrency,
                    toCurrency,
                    amount)
                const conversionResult = Math.round(converted * 100) / 100;

                // Cryptocurrencies have very low value
                return (conversionResult == 0) ? converted : conversionResult
            })
            .then(data => res.status(Status.OK).json(Success(data)))
            .catch(err => {
                throw err
            })
    }

    return ({
        get
    })
}