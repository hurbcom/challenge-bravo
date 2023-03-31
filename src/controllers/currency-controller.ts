import express from "express";
import expressjsonschema from "express-jsonschema";
import CurrencyConversionRequest from "../entities/currency-controller/currency-conversion-request";
import Schemas from "../entities/schemas/schemas";
import CurrencyConversionImpl from "../impl/currency-conversion-impl";
import ConfigCurrencyImpl from "../impl/config-currency-impl";
import SaveCurrencyRequest from "../entities/currency-controller/save-currency-request";
import DeleteCurrencyRequest from "../entities/currency-controller/delete-currency-request";
import ApiError from "../impl/errors/api-error";
import CurrencyError from "../impl/errors/currency-error";
const currencyConversion = new CurrencyConversionImpl();
const configCurrency = new ConfigCurrencyImpl();
const validate = expressjsonschema.validate;


const getCurrencyConversion = (app: express.Express) => {
    app.post('/currency-conversion', validate({ body: Schemas.CurrencyConversionSchema }), async (req, res) => {        
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
        const body: CurrencyConversionRequest = req.body;
        const response = await currencyConversion.getCurrencyConversion(body).catch(err => checkAndReturnErrorByType(err, res));
        
        res.send({ quotation: response });
    });    
}

const saveNewCurrency = (app: express.Express) => {
    app.put('/save-currency', validate({ body: Schemas.saveCurrencySchema }), async (req, res) => {
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

        
        const body: SaveCurrencyRequest = req.body;
        await configCurrency.saveCurrency(body).catch(err => checkAndReturnErrorByType(err, res));

        res.status(200);
        res.send({ 
            message: "Nova moeda salva com sucesso."
         })
    });
}

const deleteExistingCurrency = (app: express.Express) => {
    app.delete('/delete-currency', validate({ body: Schemas.deleteCurrencySchema }), async (req, res) => {
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

        
        const body: DeleteCurrencyRequest = req.body;
        await configCurrency.deleteCurrency(body).catch(err => checkAndReturnErrorByType(err, res));

        res.status(200);
        res.send({ 
            message: "Moeda Deletada com sucesso."
         })
    });
}

const checkAndReturnErrorByType = (err: any, res: express.Response) => {
    console.log(err);
    res.status(500);
    res.send(getErrorJson(500, "ErroInexperado", err.message));
}

const getErrorJson = (statusCode: number, type: string, message: string) => {
    return {
        statusCode: statusCode,
        errorType: type,
        message: message

    }
}

export = {
    getCurrencyConversion: getCurrencyConversion,
    saveNewCurrency: saveNewCurrency,
    deleteExistingCurrency: deleteExistingCurrency
}