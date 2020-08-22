const Status = require("http-status")

module.exports = ({
    response: { Success, Fail },
    currencyRepository
}) => {
    const get = (req, res, next) => {
        return Promise.resolve()
            .then(async () => {
                return await currencyRepository.getAll()
            })
            .then(data => res.status(Status.OK).json(Success(data)))
    }

    const post = (req, res, next, data) => {
        return Promise.resolve()
            .then(async () => {
                const id = await currencyRepository.add(data)
                return {
                    id: id,
                    ...data
                }
            })
            .then(data => res.status(Status.OK).json(Success(data)))
    }

    const del = (req, res, next, id) => {
        return Promise.resolve()
            .then(async () => {
                const removed = await currencyRepository.remove(id)
                if (!removed)
                    throw new Error(`ID not found.`)
                return `Removed ID: ${removed}.`
            })
            .then(data => res.status(Status.OK).json(Success(data)))
            .catch(err => {
                if (err.message.includes('not found'))
                    return res.status(Status.NOT_FOUND).json(Fail(err.message))
                throw err
            })
    }


    return ({
        get,
        post,
        del
    })
}