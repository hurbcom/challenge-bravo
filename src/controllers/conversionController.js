'use strict'

const Currency = require('../models/Currency')
const client = require('../config/cache/redis-connection')
const Validator = require('Validator')
const { default: axios } = require('axios')
const base_url = process.env.CONVERSION_ENDPOINT

class ConversionController {
    async getConversion(req, res){
        res.status(200).json()
    }
}

module.exports = new ConversionController()