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
            await client.setex(
                'allCurrencies',
                process.env.REDIS_TTL,
                JSON.stringify(allCurrencies)
            )

            res
            .status(200)
            .json({
                data: allCurrencies,
                info: 'data from database'
            })
        } catch (e) {
            throw new Error(e)
        }
    }

    async getConversion(req, res){
        res.status(200).json()
    }

    async addCurrency(req, res){

        const {
            code,
            codein,
            name,
            high,
            low,
            varBid,
            pctChange,
            bid,
            ask,
            timestamp,
            create_date
        } = req.body;

        const data = {
            code,
            codein,
            name,
            high,
            low,
            varBid,
            pctChange,
            bid,
            ask,
            timestamp,
            create_date
        };

        const rules = {
            code       : 'required',
            codein     : 'required',
            name       : 'required',
            high       : 'required',
            low        : 'required',
            varBid     : 'required',
            pctChange  : 'required',
            bid        : 'required',
            ask        : 'required',
            timestamp  : 'required',
            create_date: 'required|dateformat'
        };

        const messages = {
            'code.required'          : 'code is required',
            'codein.required'        : 'codein is required',
            'name.required'          : 'name is required',
            'high.required'          : 'high is required',
            'low.required'           : 'low is required',
            'varBid.required'        : 'varBid is required',
            'pctChange.required'     : 'pctChange is required',
            'bid.required'           : 'bid is required',
            'ask.required'           : 'ask is required',
            'timestamp.required'     : 'timestamp is required',
            'create_date.required'   : 'create_date is required',
            'create_date.dateformat' : 'create_date format invalid'

        }

        const v = Validator.make(data, rules, messages)

        if (v.fails()) {
            const errors = v.getErrors();
            res
            .status(400)
            .json(errors)
        }

        try {
            const currencyExists = await Currency.findOne({ code: data.code });
            if(currencyExists){
                res
                .status(400)
                .json({
                    data: currencyExists,
                    info: 'currency already exists.'
                });
            }
            const newCurrency = await Currency.create({
                data
            })

            res
            .status(201)
            .json({
                data: newCurrency,
                info: 'currency created!'
            })
        }catch (e) {
            res.json(e);
        }

    }

    async deleteCurrency(req, res){
        res.status(200).json()
    }
}

module.exports = new CurrencyController()