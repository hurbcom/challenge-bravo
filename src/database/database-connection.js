'use strict'
const dbParams = require('./database')
const dBurl = require('./helpers/url-parser')

const mongoose = require('mongoose');

async function conn() {
    await mongoose.connect(dBurl.resolve());
}

module.exports = conn()