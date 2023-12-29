import { Request, Response } from 'express';
import { CurrencyEntityProps } from '../../domain/entities/currency.entity';
import ValidationError from '../../domain/errors/validation.error';
import UpdateCurrencyUseCase from '../../domain/use-cases/update-currency.use-case';
import RegisterNewCurrencyCurrencyCase from '../../domain/use-cases/register-new-currency.use-case';
import ShowApiAllCurrenciesUseCase from '../../domain/use-cases/show-api-all-currencies.use-case';
import ShowApiCurrencyUseCase from '../../domain/use-cases/show-api-currency.use-case';
import ShowAllCurrenciesUseCase from '../../domain/use-cases/show-all-currencies.use-case';
import ShowCurrencyUseCase from '../../domain/use-cases/show-currency.use-case';
import ConvertCurrencyUseCase from '../../domain/use-cases/convert-currency.use-case';
import { ConvertInput } from '../../domain/entities/dto/convert-input.dto';

export default class CurrencyController {
    constructor(
        private readonly registerNewCurrency: RegisterNewCurrencyCurrencyCase,
        private readonly updateCurrencyUseCase: UpdateCurrencyUseCase,
        private readonly showCurrencyUseCase: ShowCurrencyUseCase,
        private readonly showApiCurrencyUseCase: ShowApiCurrencyUseCase,
        private readonly showAllCurrenciesUseCase: ShowAllCurrenciesUseCase,
        private readonly showApiAllCurrenciesUseCase: ShowApiAllCurrenciesUseCase,
        private readonly convertCurrencyUseCase: ConvertCurrencyUseCase) { }

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

    async getAllCurrency(
        request: Request,
        response: Response
    ): Promise<void> {
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

    async getAllApiCurrency(
        request: Request,
        response: Response
    ): Promise<void> {
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
        const {code} = request.params
        try {
            const currencyHistory: any = await this.showApiCurrencyUseCase.execute(code);
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

    async convert(
        request: Request,
        response: Response
    ): Promise<void> {
        const { from, to, amount = 1 } = request.query;
        if (!from && !to) {
            throw new Error('Bad request. "from" and "to" are required')
        }
        if (!Number(amount)) {
            throw new Error('Bad request. Amount need to be a number')
        }
        try {
            const currencyHistory: any = await this.convertCurrencyUseCase.execute(from as string, to as string, amount as number,);
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
}
