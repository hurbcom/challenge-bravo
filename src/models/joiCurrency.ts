import joi from "joi";

const currency = joi
    .object({
        params: joi.object({
            code: joi.string().uppercase().min(2).max(6).required().messages({
                "string.base": "The code must be a string",
                "string.empty": "The code cannot be empty",
                "any.required": "The code is required",
                "string.min": "The code must be at least 2 characters long",
                "string.max": "The code must be at most 6 characters long",
            }),
        }),
        query: joi.object({
            from: joi.string().uppercase().min(2).max(6).messages({
                "string.base": "The from must be a string",
                "string.empty": "The from cannot be empty",
                "string.min": "The from must be at least 2 characters long",
                "string.max": "The from must be at most 6 characters long",
            }),
            to: joi.string().uppercase().min(2).max(6).messages({
                "string.base": "The to must be a string",
                "string.empty": "The to cannot be empty",
                "string.min": "The to must be at least 2 characters long",
                "string.max": "The to must be at most 6 characters long",
            }),
            amount: joi.number().positive().required().messages({
                "number.base": "The amount must be a number",
                "number.empty": "The amount cannot be empty",
                "number.positive": "The amount must be positive",
                "any.required": "The amount is required",
            }),
        }),
        body: joi.object({
            name: joi.string().required().messages({
                "string.base": "The name must be a string",
                "string.empty": "The name cannot be empty",
                "any.required": "The name is required",
            }),
            code: joi.string().uppercase().min(2).max(6).required().messages({
                "string.base": "The code must be a string",
                "string.empty": "The code cannot be empty",
                "string.min": "The code must be at least 2 characters long",
                "string.max": "The code must be at most 6 characters long",
                "any.required": "The code is required",
            }),
            value: joi.number().positive().required().messages({
                "number.base": "The value must be a number",
                "number.empty": "The value cannot be empty",
                "number.positive": "The value must be positive",
                "any.required": "The value is required",
            }),
        }),
    })
    .unknown();

export const schema = {
    currency,
};
