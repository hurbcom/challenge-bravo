'use strict'

const Currency = require('../models/Currency')
const client = require('../config/cache/redis-connection')
const Validator = require('Validator')
const { default: axios } = require('axios')
const base_url = process.env.CONVERSION_ENDPOINT

class ConversionController {
    async getConversion(req, res){

        const { to, from, amount  } = req.query
        const { data } = await axios.get(`${base_url}/last/${from}-${to}`)

        let converted_value

        Object.entries(data).forEach(async([key, value]) => {
            converted_value = value.bid * amount
            client.setex(
                `${from}${to}`,
                process.env.REDIS_TTL,
                JSON.stringify(value)
            )
        })

        return res
        .status(200)
        .json({
            data: data,
            converted_value: converted_value,
            info: "data from api"
        })
    }
}

module.exports = new ConversionController()