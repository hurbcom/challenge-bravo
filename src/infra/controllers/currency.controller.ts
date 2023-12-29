import { Request, Response } from 'express';
import { CurrencyEntityProps } from '../../domain/entities/currency.entity';
import ValidationError from '../../domain/errors/validation.error';
import UpdateCurrencyUseCase from '../../domain/use-cases/update-currency.use-case';
import RegisterNewCurrencyCurrencyCase from '../../domain/use-cases/register-new-currency.use-case';
import ShowApiAllCurrenciesUseCase from '../../domain/use-cases/show-api-all-currencies.use-case';
import ShowApiCurrencyUseCase from '../../domain/use-cases/show-api-currency.use-case';
import ShowAllCurrenciesUseCase from '../../domain/use-cases/show-all-currencies.use-case';
import ShowCurrencyUseCase from '../../domain/use-cases/show-currency.use-case';

export default class CurrencyController {
    constructor(
        private readonly registerNewCurrency: RegisterNewCurrencyCurrencyCase,
        private readonly updateCurrencyUseCase: UpdateCurrencyUseCase,
        private readonly showCurrencyUseCase: ShowCurrencyUseCase,
        private readonly showApiCurrencyUseCase: ShowApiCurrencyUseCase,
        private readonly showAllCurrenciesUseCase: ShowAllCurrenciesUseCase,
        private readonly showApiAllCurrenciesUseCase: ShowApiAllCurrenciesUseCase) { }

    async postCurrency(
        request: Request<unknown, unknown, CurrencyEntityProps>,
        response: Response
    ): Promise<void> {
        const { body } = request;
        try {
            const currency = await this.registerNewCurrency.execute(body);

            if (!currency) {
                response.status(401)
            } else {
                response.status(201).json(currency);
            }

        } catch (e) {
            let statusCode: number;

            if (e instanceof ValidationError) {
                statusCode = 400;
            } else {
                statusCode = 500;
            }

            response.status(statusCode).json(e);
        }
    }

    async updateCurrency(
        request: Request,
        response: Response
    ): Promise<void> {
        const { body } = request;
        try {
            const currency = await this.updateCurrencyUseCase.execute(body);
            response.status(201).json(currency);
        } catch (e) {
            let statusCode: number;

            if (e instanceof ValidationError) {
                statusCode = 400;
            } else {
                statusCode = 500;
            }

            response.status(statusCode).json(e);
        }
    }

    async getOneCurrency(
        request: Request,
        response: Response
    ): Promise<void> {
        const { body } = request;
        try {
            const currency = await this.showCurrencyUseCase.execute(body);
            response.status(201).json(currency);
        } catch (e) {
            let statusCode: number;

            if (e instanceof ValidationError) {
                statusCode = 400;
            } else {
                statusCode = 500;
            }

            response.status(statusCode).json(e);
        }
    }

    async getAllApiCurrency(
        request: Request,
        response: Response
    ): Promise<void> {
        const { body } = request;
        const { code } = request.params;
        try {
            const currencyHistory: any = await this.showApiAllCurrenciesUseCase.execute(code);
            response.status(200).json(currencyHistory);
        } catch (e) {
            let statusCode: number;

            if (e instanceof ValidationError) {
                statusCode = 400;
            } else {
                statusCode = 500;
            }

            response.status(statusCode).json(e);
        }
    }

    async getApiCurrency(
        request: Request,
        response: Response
    ): Promise<void> {
        try {
            const currencyHistory: any = await this.showApiCurrencyUseCase.execute();
            response.status(200).json(currencyHistory);
        } catch (e) {
            let statusCode: number;

            if (e instanceof ValidationError) {
                statusCode = 400;
            } else {
                statusCode = 500;
            }

            response.status(statusCode).json(e);
        }
    }

    async getAllCurrency(
        request: Request,
        response: Response
    ): Promise<void> {
        const { body } = request;
        try {
            const topTenCurrency = await this.showAllCurrenciesUseCase.execute();
            response.status(200).json(topTenCurrency);
        } catch (e) {
            let statusCode: number;

            if (e instanceof ValidationError) {
                statusCode = 400;
            } else {
                statusCode = 500;
            }

            response.status(statusCode).json(e);
        }
    }
}
