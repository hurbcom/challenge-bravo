const Status = require("http-status")

module.exports = ({
    response: { Success, Fail },
    currencyConversionService,
    currencyRepository
}) => {

    const get = (req, res, next, from, to, amount) => {
        return Promise.resolve()
            .then(async () => {
                const allowedCurrencies = await currencyRepository.getAll()
                if (allowedCurrencies.some(e => e.abbreviation === from) &&
                    allowedCurrencies.some(e => e.abbreviation === to))
                    return Math.round(await currencyConversionService.convert(from, to, amount) * 100) / 100;
                return "not allowed"
            })
            .then(data => res.status(Status.OK).json(Success(data)))
    }

    return ({
        get
    })
}