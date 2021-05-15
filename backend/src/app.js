require("dotenv").config({
    path: ".env"
});
const express = require('express')
var cors = require('cors')


class AppController{
    constructor(){
        this.express= express()
        this.middlewares()
        this.routes()
    }

    middlewares(){
        this.express.use(cors({origin: '*'}));
        this.express.use(express.json())
        this.express.use(require('./app/helpers/checkDate'))
    }

    routes(){
        this.express.use(require("./routes"))
    }
}

module.exports = new AppController().express