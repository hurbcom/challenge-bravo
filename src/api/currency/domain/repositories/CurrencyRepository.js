module.exports = ({
    database,
    redisClient,
    logger
}) => {


    const getAll = () => {
        return new Promise((resolve, reject) => {
            redisClient.get('GET_ALL_CURRENCY_RESPONSE', async (err, data) => {
                if (err) throw err
                if (data) {
                    currencies = JSON.parse(data)
                }
                else {
                    currencies = await database.select('*').from('currencies')
                    redisClient.set('GET_ALL_CURRENCY_RESPONSE', JSON.stringify(currencies))
                }
                resolve(currencies)
            })
        })
    }

    const add = (data) => {
        redisClient.del('GET_ALL_CURRENCY_RESPONSE') // clears getAll() cache
        return database.insert(data).into('currencies')
    }

    const remove = (id) => {
        redisClient.del('GET_ALL_CURRENCY_RESPONSE') // clears getAll() cache
        return database.table('currencies').del().where('id', id)
    }

    return ({
        getAll,
        add,
        remove
    })
}