import type { Application } from "express";
import {
    OpenAPIRegistry,
    OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import type { ZodSchema } from "zod";
import swaggerUi from "swagger-ui-express";
import {
    convertSchema,
    addCurrencySchema,
    removeCurrencySchema,
    addExchangeRateSchema,
    resultResponseSchema,
} from "./Schemas";

const registry = new OpenAPIRegistry();

registry.register("convert", convertSchema);
registry.register("addCurrency", addCurrencySchema);
registry.register("removeCurrency", removeCurrencySchema);
registry.register("addExchangeRate", addExchangeRateSchema);

const responseOk = {
    description: "Object with user data.",
    content: {
        "application/json": {
            schema: resultResponseSchema,
        },
    },
};

const requestBody = (description: string, schema: ZodSchema) => {
    return {
        description,
        content: {
            "application/json": {
                schema,
            },
        },
    };
};

registry.registerPath({
    method: "get",
    path: "/api/health",
    summary: "Health check application",
    responses: {
        200: responseOk,
    },
});

registry.registerPath({
    method: "get",
    path: "/api/convert/",
    summary: "Convert currency",
    request: {
        query: convertSchema,
    },
    responses: {
        200: responseOk,
    },
});

registry.registerPath({
    method: "post",
    path: "/api/currencies/",
    summary: "Add new currency",
    request: {
        body: requestBody("Object to add new currency", addCurrencySchema),
    },
    responses: {
        200: responseOk,
    },
});

registry.registerPath({
    method: "delete",
    path: "/api/currencies/",
    summary: "Remove a currency",
    request: {
        body: requestBody("Object to remove a currency", removeCurrencySchema),
    },
    responses: {
        200: responseOk,
    },
});

registry.registerPath({
    method: "post",
    path: "/api/exchange-rate/",
    summary: "Add exchange rate",
    request: {
        body: requestBody(
            "Object to add new exchange rate",
            addExchangeRateSchema
        ),
    },
    responses: {
        200: responseOk,
    },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const setupSwagger = (app: Application) => {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(
            generator.generateDocument({
                openapi: "3.0.0",
                info: {
                    version: "1.0.0",
                    title: "Currency Conversion API",
                    description:
                        "An API for currency conversion, supporting operations to convert currencies, manage currencies, and exchange rates.",
                },
            })
        )
    );
};
