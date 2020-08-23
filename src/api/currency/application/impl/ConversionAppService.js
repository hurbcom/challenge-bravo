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
                const allowedCurrencies = await currencyRepository.getAll()

                fromCurrency = currencyFactory(from)
                toCurrency = currencyFactory(to)

                const isFromSupported = allowedCurrencies.some(e => e.abbreviation === fromCurrency.abbreviation)
                const isToSupported = allowedCurrencies.some(e => e.abbreviation === toCurrency.abbreviation)

                if (!isFromSupported) throw Error(`${from} is not supported`)
                if (!isToSupported) throw Error(`${to} is not supported`)

                return Math.round(await currencyConversionService.convert(fromCurrency,
                    toCurrency,
                    amount) * 100) / 100;
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