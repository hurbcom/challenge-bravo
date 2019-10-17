const { Router } = require("express");
const ConvertController = require("../controllers/convert.controller");

var ConvertRouter = new Router();

ConvertRouter.get("/", ConvertController.get);

exports.ConvertRouter = ConvertRouter;