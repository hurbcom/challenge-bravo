import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const convertSchema = z
    .object({
        from: z.string().min(1).openapi({
            description: "Currency 'from'",
            example: "USD",
        }),
        to: z
            .string()
            .min(1)
            .openapi({ description: "Currency 'to'", example: "BRL" }),
        amount: z
            .string()
            .transform((val) => Number.parseFloat(val))
            .refine((val) => !Number.isNaN(val), {
                message: "Amount must be a number",
            })
            .openapi({
                description: "Amount to convert",
                example: "123.45",
            }),
    })
    .openapi({ description: "Schema for currency conversion" });

export const addCurrencySchema = z
    .object({
        code: z
            .string()
            .min(1)
            .openapi({ description: "Currency code", example: "EUR" }),
    })
    .openapi({ description: "Schema for adding a new currency" });

export const addCurrencyRequestSchema = z
    .object({
        body: addCurrencySchema,
    })
    .openapi({});

export const removeCurrencySchema = z
    .object({
        code: z
            .string()
            .min(1)
            .openapi({ description: "Currency code", example: "EUR" }),
    })
    .openapi({ description: "Schema for removing a currency" });

export const removeCurrencyRequestSchema = z
    .object({
        body: removeCurrencySchema,
    })
    .openapi({});
export const addExchangeRateSchema = z
    .object({
        from: z
            .string()
            .min(1)
            .openapi({ description: "Currency code 'from'", example: "USD" }),
        to: z
            .string()
            .min(1)
            .openapi({ description: "Currency code 'to'", example: "EUR" }),
        rate: z
            .number()
            .min(0)
            .openapi({ description: "Exchange rate", example: 1.2 }),
    })
    .openapi({ description: "Schema for adding an exchange rate" });

export const addExchangeRateRequestSchema = z
    .object({
        body: addExchangeRateSchema,
    })
    .openapi({});

export const resultResponseSchema = z
    .object({
        statusCode: z
            .number()
            .openapi({ description: "HTTP Status Code", example: 200 }),
        content: z.any().openapi({ description: "Result data" }),
    })
    .openapi("Result");

export const healthResponseSchema = z
    .object({
        status: z
            .string()
            .openapi({ description: "HTTP Status Code", example: "ok" }),
    })
    .openapi("Result");
