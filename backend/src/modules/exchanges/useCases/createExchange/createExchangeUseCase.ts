import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";

import appConfig from "@config/app";
import { ICurrenciesRepository } from "@modules/currencies/repositories/ICurrenciesRepository";
import { Exchange } from "@modules/exchanges/infra/typeorm/entities/Exchange";
import { IExchangeRepository } from "@modules/exchanges/repositories/IExchangeRepository";
import { AppError } from "@shared/errors/AppError";
import { api } from "@shared/services/api";
import { findValues } from "@shared/utils/jsonHandler.utils";

interface IRequest {
    from: string;
    to: string;
    amount: number;
}

@injectable()
class CreateExchangeUseCase {
    constructor(
        @inject("ExchangeRepository")
        private exchangeRepository: IExchangeRepository,
        @inject("CurrenciesRepository")
        private currenciesRepository: ICurrenciesRepository
    ) {}

    async getExchangeFromApi(currency: string): Promise<any> {
        const fromData = await api.get(`/${currency}`).then((res) => {
            return res.data[0];
            // convertInfo = res.data;
        });
        return fromData.price_usd ?? 1;
    }
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

        const base = "USD";
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
            console.log("historico");
            const now = new Date().getDate();
            const diffTime = Math.abs(
                now - convertExpired.created_date.getDate()
            );
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

            if (
                diffHours < 24 &&
                convertExpired.from === from &&
                convertExpired.rate.toString() !== "0"
            ) {
                console.log("resgate");
                let value = amount * convertExpired.rate;

                // in case convertion returns very small rates
                if (!value) {
                    value = 0;
                }
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

        const fromData = await this.getExchangeFromApi(from);
        const toData = await this.getExchangeFromApi(to);

        let rate = fromData / toData;

        let value = rate
            ? rate * amount // rate valid
            : (fromData * amount) / toData; // try to compensate rate diference with amount

        // in case convertion returns very small rates
        if (!value) {
            value = 0;
        }

        if (!rate) {
            rate = 0;
        }

        const exchange = await this.exchangeRepository.create({
            from,
            to,
            expires_date: new Date(),
            amount,
            value,
            rate,
            base,
        });

        return exchange;
    }
}

export { CreateExchangeUseCase };
