'use strict'

const mongoose = require('mongoose');


async function conn() {
    try{
        await mongoose.connect(process.env.DB_URI)
    }catch (e) {
        throw new Error(e)
    }
}

module.exports = conn()