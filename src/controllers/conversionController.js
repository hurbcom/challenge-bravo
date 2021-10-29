'use strict'

const Currency = require('../models/Currency')
const client = require('../config/cache/redis-connection')
const Validator = require('Validator')
const { default: axios } = require('axios')
const base_url = process.env.CONVERSION_ENDPOINT

class ConversionController {
    async getConversion(req, res){

        const {
            to,
            from,
            amount
        } = req.query


        const data = {
            to,
            from,
            amount
        }

        const rules = {
            to        : 'required',
            from      : 'required',
            amount    : 'required|numeric',
        }

        const messages = {
            required: ':attr is required',
            numeric: ':attr needs to be a number'
        }

        const existsCurrency = await Currency.exists({ code: data.from, codein: data.to })

        function existsConversion(name, value, params) {
            if (existsCurrency) {
                return false
            }
            return true
        }

        const v = Validator.make(data, rules, messages)
        v.extend('existsConversion', existsConversion, ':attr not exists in database or api.')

        if (v.fails()) {
            const errors = v.getErrors()

            return res
            .status(400)
            .json(errors)
        }

        try {
            const { data } = await axios.get(`${base_url}/last/${from}-${to}`)

            if(!data){
                return res
                .status(400)
                .json({
                    message: 'Invalid params'
                })
            }

            let converted_value

            Object.entries(data).forEach(async([key, value]) => {
                converted_value = amount / value.bid
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
                converted_value: parseFloat(converted_value).toFixed(process.env.DECIMAL_PLACES),
                info: "data from api"
            })

        } catch (e) {
            return res
            .status(500)
            .json(e)
        }
    }
}

module.exports = new ConversionController()