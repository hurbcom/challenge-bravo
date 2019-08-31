var fs = require('fs');

const filePath = './database.json'
const encode = 'utf8'

const error = msg => ({ status: 'failure', result: msg })

function getQuotation(req, res, response, next) {
    const rate = response.data[req.query.to]

    const result = (req.query.amount * rate).toFixed(2)

    console.log(result)

    return res.send({ ...req.query, result })
}

module.exports = { getQuotation }