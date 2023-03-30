"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const currency_controller_1 = __importDefault(require("./src/controllers/currency-controller"));
const swaggerFile = require('./swagger_output.json');
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
currency_controller_1.default.getCurrencyConversion(app);
currency_controller_1.default.saveNewCurrency(app);
currency_controller_1.default.deleteExistingCurrency(app);
app.use('/doc', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerFile));
app.use((err, req, res, next) => {
    var responseData;
    if (err.name === 'JsonSchemaValidation') {
        // Log the error however you please
        console.log(err.message);
        // logs "express-jsonschema: Invalid data found"
        // Set a bad request http response status or whatever you want
        res.status(400);
        // Format the response body however you want
        responseData = {
            statusText: 'Bad Request',
            jsonSchemaValidation: true,
            validations: err.validations // All of your validation information
        };
        // Take into account the content type if your app serves various content types
        if (req.xhr || req.get('Content-Type') === 'application/json') {
            res.json(responseData);
        }
        else {
            // If this is an html request then you should probably have
            // some type of Bad Request html template to respond with
            res.render('badrequestTemplate', responseData);
        }
    }
    else {
        // pass error to next error middleware handler
        next(err);
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
