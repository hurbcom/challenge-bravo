'use strict'

const mongoose = require('mongoose');

async function conn() {
    try{
        const conn = await mongoose.connect(process.env.DB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        return conn
    } catch (e) {
        throw new Error(e)
    }
}

module.exports = conn()