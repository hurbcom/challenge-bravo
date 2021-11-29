const Router = require("express");
const routes = new Router();

const ConversionController = require('./Controller/ConversionController')

routes.get("/", ConversionController.conversion);


module.exports = routes;