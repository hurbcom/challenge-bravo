import { check } from 'express-validator';

export const convertValidator = [
    check('from').exists(),
    check('to').exists(),
    check('amount').exists().isNumeric()
]
