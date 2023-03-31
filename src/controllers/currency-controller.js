"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_jsonschema_1 = __importDefault(require("express-jsonschema"));
const schemas_1 = __importDefault(require("../entities/schemas/schemas"));
const currency_conversion_impl_1 = __importDefault(require("../impl/currency-conversion-impl"));
const config_currency_impl_1 = __importDefault(require("../impl/config-currency-impl"));
const currencyConversion = new currency_conversion_impl_1.default();
const configCurrency = new config_currency_impl_1.default();
const validate = express_jsonschema_1.default.validate;
const getCurrencyConversion = (app) => {
    app.post('/currency-conversion', validate({ body: schemas_1.default.CurrencyConversionSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        /* #swagger.tags = ['CurrencyController']
            #swagger.description = 'Endpoint Usado para conversão monetária.' */
        /* #swagger.parameters['CurrencyConversionRequest'] = {
                in: 'body',
                description: 'converção monetária.',
                required: true,
                schema: { $ref: "#/definitions/CurrencyConvertion" }
        } */
        /* #swagger.responses[200] = {
            description: 'Conversão obtida com sucesso.',
            schema: { $ref: '#/definitions/SuccessCurrencyConversion' }
        } */
        const body = req.body;
        const response = yield currencyConversion.getCurrencyConversion(body).catch(err => checkAndReturnErrorByType(err, res));
        res.send({ quotation: response });
    }));
};
const saveNewCurrency = (app) => {
    app.put('/save-currency', validate({ body: schemas_1.default.saveCurrencySchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        /* #swagger.tags = ['CurrencyController']
            #swagger.description = 'Endpoint usado para salvar uma nova moeda para conversão.' */
        /* #swagger.parameters['SaveCurrencyRequest'] = {
                in: 'body',
                description: 'Salvar Nova Moeda para uso na api de conversão.',
                required: true,
                schema: { $ref: "#/definitions/SaveNewCurrency" }
        } */
        /* #swagger.responses[200] = {
            description: 'Nova moeda cadastrada com sucesso.',
            schema: { $ref: '#/definitions/SuccessNewCurrency' }
        } */
        /* #swagger.responses[500] = {
            description: 'erro moeda cadastrada duas vezes.',
            schema: { $ref: '#/definitions/ErrorNewCurrency' }
        } */
        const body = req.body;
        yield configCurrency.saveCurrency(body).catch(err => checkAndReturnErrorByType(err, res));
        res.status(200);
        res.send({
            message: "Nova moeda salva com sucesso."
        });
    }));
};
const deleteExistingCurrency = (app) => {
    app.delete('/delete-currency', validate({ body: schemas_1.default.deleteCurrencySchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        /* #swagger.tags = ['CurrencyController']
            #swagger.description = 'Endpoint para deletar uma moeda previamente cadastrada na api.' */
        /* #swagger.parameters['DeleteCurrencyRequest'] = {
                in: 'body',
                description: 'Deletar Moeda Existente na API - Não tente deletar a moeda usada de lastro.',
                required: true,
                schema: { $ref: "#/definitions/DeleteCurrency" }
        } */
        /* #swagger.responses[200] = {
            description: 'moeda deletada com sucesso.',
            schema: { $ref: '#/definitions/SuccessDeleteCurrency' }
        } */
        /* #swagger.responses[500] = {
            description: 'erro moeda deletada duas vezes.',
            schema: { $ref: '#/definitions/ErrorDeleteCurrency' }
        } */
        const body = req.body;
        yield configCurrency.deleteCurrency(body).catch(err => checkAndReturnErrorByType(err, res));
        res.status(200);
        res.send({
            message: "Moeda Deletada com sucesso."
        });
    }));
};
const checkAndReturnErrorByType = (err, res) => {
    console.log(err);
    res.status(500);
    res.send(getErrorJson(500, "ErroInexperado", err.message));
};
const getErrorJson = (statusCode, type, message) => {
    return {
        statusCode: statusCode,
        errorType: type,
        message: message
    };
};
module.exports = {
    getCurrencyConversion: getCurrencyConversion,
    saveNewCurrency: saveNewCurrency,
    deleteExistingCurrency: deleteExistingCurrency
};
