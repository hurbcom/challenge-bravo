import type express from "express";
import type { CurrencyService } from "../../application/CurrencyService";
import { Currency } from "../../domain/Currency";
import { validate } from "../validations/Validate";
import {
    convertSchema,
    addCurrencySchema,
    removeCurrencySchema,
    addExchangeRateSchema,
} from "../validations/Schemas";
import logger from "../helpers/Logger";

interface AppError {
    statusCode: number;
    message: string;
}

export class CurrencyController {
    constructor(private currencyService: CurrencyService) {}
    registerRoutes(app: express.Application) {
        app.get(
            "/api/convert",
            validate(convertSchema),
            this.convert.bind(this)
        );
        app.post(
            "/api/currencies",
            validate(addCurrencySchema),
            this.addCurrency.bind(this)
        );
        app.delete(
            "/api/currencies",
            validate(removeCurrencySchema),
            this.removeCurrency.bind(this)
        );
        app.post(
            "/api/exchange-rate",
            validate(addExchangeRateSchema),
            this.addExchangeRate.bind(this)
        );
    }
    async convert(req: express.Request, res: express.Response) {
        try {
            const { from, to, amount } = req.query;
            logger.info(
                `Converting currency from ${from} to ${to} with amount ${amount}`
            );
            const value = await this.currencyService.convert(
                { code: from as string },
                { code: to as string },
                Number(amount)
            );

            const result = `${Number(amount).toLocaleString("pt-BR", {
                style: "currency",
                currency: from as string,
            })} = ${value.toLocaleString("pt-BR", {
                style: "currency",
                currency: to as string,
            })}`;

            res.status(200).json({
                statusCode: 200,
                content: result,
            });
            logger.info(`Conversion successful: ${result}`);
        } catch (error) {
            const appError: AppError = {
                statusCode: 400,
                message: (error as Error).message,
            };
            logger.error(`Conversion error: ${appError.message}`);
            res.status(appError.statusCode).json(appError);
        }
    }

    async addCurrency(req: express.Request, res: express.Response) {
        try {
            const { code } = req.body;
            logger.info(`Adding currency with code ${code}`);
            await this.currencyService.addCurrency(new Currency(code));
            res.status(201).json({
                statusCode: 201,
                content: "Created with success!",
            });
            logger.info(`Currency ${code} added successfully`);
        } catch (error) {
            const appError: AppError = {
                statusCode: 400,
                message: (error as Error).message,
            };
            logger.error(`Add currency error: ${appError.message}`);
            res.status(appError.statusCode).json(appError);
        }
    }

    async removeCurrency(req: express.Request, res: express.Response) {
        try {
            const { code } = req.body;
            logger.info(`Removing currency with code ${code}`);
            const { deletedCount } = await this.currencyService.removeCurrency(
                new Currency(code)
            );
            if (deletedCount) {
                res.status(200).json({
                    statusCode: 200,
                    content: `Currency code ${code} removed with success!`,
                });
                logger.info(`Currency ${code} removed successfully`);
            } else {
                res.status(400).json({
                    statusCode: 400,
                    content: `Currency code ${code} not found!`,
                });
                logger.warn(`Currency ${code} not found`);
            }
        } catch (error) {
            const appError: AppError = {
                statusCode: 400,
                message: (error as Error).message,
            };
            logger.error(`Remove currency error: ${appError.message}`);
            res.status(appError.statusCode).json(appError);
        }
    }

    async addExchangeRate(req: express.Request, res: express.Response) {
        try {
            const { from, to, rate } = req.body;
            logger.info(
                `Adding exchange rate from ${from} to ${to} with rate ${rate}`
            );
            await this.currencyService.addExchangeRate(
                new Currency(from),
                new Currency(to),
                rate
            );
            res.status(201).json({
                statusCode: 201,
                content: "Created with success!",
            });
            logger.info(
                `Exchange rate from ${from} to ${to} added successfully`
            );
        } catch (error) {
            const appError: AppError = {
                statusCode: 400,
                message: (error as Error).message,
            };
            logger.error(`Add exchange rate error: ${appError.message}`);
            res.status(appError.statusCode).json(appError);
        }
    }
}
