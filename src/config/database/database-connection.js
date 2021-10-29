'use strict'

const mongoose = require("mongoose")

module.exports = async function conn() {
    try{
        const conn = await mongoose.connect(process.env.DB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log("\x1b[32m", 'Connected to DB')
        return conn
    } catch (e) {
        console.log("\x1b[31m", 'Failed connected to DB XXXXXXXX')
        return new Error(e)
    }
}
