import Joi from 'joi';
import { CurrencyType } from "../app/models/CurrencyModel";

export const conversion = {
    query: Joi.object({
        to: Joi.string().required(),
        from: Joi.string().required(),
        amount: Joi.number(),
        decimalPlaces: Joi.number().integer().max(30),
    }),
}

export const add = {
    body: Joi.object({
        symbol: Joi.string().required().alphanum().max(15),
        type: Joi.string().required().valid(CurrencyType.crypto, CurrencyType.fixed, CurrencyType.scrapper, CurrencyType.fiat),
        rate: Joi.number(),
        scrpprRateAsset: Joi.string(),
        scrpprUrl: Joi.string(),
        scrpprAmountTag: Joi.string(),
        scrpprRateTag: Joi.string(),
        scrpprDecimalSymbol: Joi.string().valid(',', '.')
    }),
}

export const login = {
    body: Joi.object({
        login: Joi.string().required(),
        password: Joi.string().required()
    }),
}