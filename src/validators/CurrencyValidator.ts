import { check } from 'express-validator';

export const addCurrencyValidator = [
    check('symbol').exists(),
    check('conversionFactor').exists().isNumeric()
]

export const removeCurrencyValidator = [
    check('symbol').exists(),
]
