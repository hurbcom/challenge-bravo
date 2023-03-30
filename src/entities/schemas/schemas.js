"use strict";
const CurrencyConversionSchema = {
    type: "object",
    properties: {
        "from": {
            type: "string",
            minLength: 3,
            maxLength: 4,
            pattern: "^[A-Z]{3,4}$",
            required: true
        },
        "to": {
            type: "string",
            minLength: 3,
            maxLength: 4,
            pattern: "^[A-Z]{3,4}$",
            required: true
        },
        "amount": {
            type: "number",
            required: true
        }
    }
};
const saveCurrencySchema = {
    type: "object",
    properties: {
        "currency": {
            type: "string",
            minLength: 3,
            maxLength: 4,
            pattern: "^[A-Z]{3,4}$",
            required: true
        },
        "isFictional": {
            type: "boolean",
            required: false
        },
        "currencyBackingUnitValue": {
            type: "number",
            multipleOfPrecision: 0.01,
            required: false
        }
    }
};
const deleteCurrencySchema = {
    type: "object",
    properties: {
        "currency": {
            type: "string",
            minLength: 3,
            maxLength: 4,
            pattern: "^[A-Z]{3,4}$",
            required: true
        }
    }
};
module.exports = {
    CurrencyConversionSchema: CurrencyConversionSchema,
    saveCurrencySchema: saveCurrencySchema,
    deleteCurrencySchema: deleteCurrencySchema
};
