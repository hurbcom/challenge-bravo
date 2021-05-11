require("dotenv").config({
    path: ".env"
});
const express = require('express')

class AppController{
    constructor(){
        this.express= express()
        this.middlewares()
        this.routes()
    }

    middlewares(){
        this.express.use(express.json())
        this.express.use(require('./app/helpers/checkDate'))
    }

    routes(){
        this.express.use(require("./routes"))
        // this.express.use(require("./app/helpers/checkDate"));
    }
}

module.exports = new AppController().express