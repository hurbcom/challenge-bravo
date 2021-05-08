import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";

import { ICurrenciesRepository } from "@modules/currencies/repositories/ICurrenciesRepository";
import { Exchange } from "@modules/exchanges/infra/typeorm/entities/Exchange";
import { IExchangeRepository } from "@modules/exchanges/repositories/IExchangeRepository";
import appConfig from "@shared/config/app";
import { AppError } from "@shared/errors/AppError";
import { api } from "@shared/services/api";
import { findValues } from "@shared/utils/jsonHandler.utils";

interface IRequest {
    from: string;
    to: string;
    // expires_at: Date;
    amount: number;
    // value: number;
    // rate: number;
    // base: string;
}

@injectable()
class CreateExchangeUseCase {
    constructor(
        @inject("ExchangeRepository")
        private exchangeRepository: IExchangeRepository,
        @inject("CurrenciesRepository")
        private currenciesRepository: ICurrenciesRepository
    ) {}

    async execute({ from, to, amount }: IRequest): Promise<Exchange> {
        const currencyFromUnavailable = await this.currenciesRepository.findBySymbol(
            from
        );

        const currencyToUnavailable = await this.currenciesRepository.findBySymbol(
            to
        );

        if (!currencyFromUnavailable || !currencyToUnavailable) {
            throw new AppError(
                "Currency is not available yet. Please make sure to register this symbol"
            );
        }

        let base = "USD";
        const today = new Date();
        const expireDate = today.setDate(today.getDate() + 1);

        const convertExpired = await this.exchangeRepository.findByExchange(
            from,
            to,
            base
        );

        const convertedData = new Exchange();

        // get exchange data from available history
        if (convertExpired) {
            const now = new Date().getDate();
            const diffTime = Math.abs(
                now - convertExpired.created_date.getDate()
            );
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

            if (diffHours < 24) {
                const value = (amount * convertExpired.rate).toFixed(2);

                Object.assign(convertedData, {
                    id: uuidv4(),
                    from,
                    to,
                    amount,
                    value,
                    rate: convertExpired.rate,
                    base,
                    expires_date: expireDate,
                });

                return convertedData;
            }
        }

        let convertInfo;
        // get exchange data from external API
        await api
            .get(`/live?access_key=${appConfig.EXCHANGE_API.apiKey}`)
            .then((res) => {
                convertInfo = res.data;
            });

        base = convertInfo.source;
        const rateTo = findValues(convertInfo.quotes, `USD${to}`); // .toFixed(2);
        const rateFrom = findValues(convertInfo.quotes, `USD${from}`); // .toFixed(2);
        const value = parseInt(((rateTo / rateFrom) * amount).toFixed(2), 10);

        const exchange = await this.exchangeRepository.create({
            from,
            to,
            expires_date: new Date(),
            amount,
            value,
            rate: rateTo / rateFrom,
            base,
        });

        return exchange;
    }
}

export { CreateExchangeUseCase };
