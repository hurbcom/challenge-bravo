'use strict'

const Currency = require('../models/Currency')
const client = require('../config/cache/redis-connection')
const Validator = require('Validator');
const { default: axios } = require('axios')
const base_url = process.env.CONVERSION_ENDPOINT

class CurrencyController {
    async getAllSupportedCurrencies(req, res){
        try {
            const { data } = await axios.get(`${base_url}/json/all`)

            let allCurrencies = []

            Object.entries(data).forEach(async([key, value]) => {

                let currency = {
                    code: value.code,
                    codein: value.codein,
                    name: value.name,
                    high: value.high,
                    low: value.low,
                    varBid: value.varBid,
                    pctChange: value.pctChange,
                    bid: value.bid,
                    ask: value.ask,
                    timestamp: value.timestamp,
                    create_date: value.create_date
                }

                allCurrencies.push(currency)
            })

            await Currency.insertMany(allCurrencies)
            await client.setex('allCurrencies', 600, JSON.stringify(allCurrencies))

            res
            .status(200)
            .json({
                data: data,
                info: 'data from external api'
            })
        } catch (e) {
            throw new Error(e)
        }
    }

    async getConversion(req, res){
        res.status(200).json()
    }

    async addCurrency(req, res){
        res.status(200).json()
    }

    async deleteCurrency(req, res){
        res.status(200).json()
    }
}

module.exports = new CurrencyController()