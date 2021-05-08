import { ICreateExchangeDTO } from "@modules/exchanges/dtos/ICreateExchangeDTO";
import { Exchange } from "@modules/exchanges/infra/typeorm/entities/Exchange";

import { IExchangeRepository } from "../IExchangeRepository";

class ExchangesRepositoryInMemory implements IExchangeRepository {
    exchanges: Exchange[] = [];

    async findByExchange(
        from: string,
        to: string,
        base: string
    ): Promise<Exchange> {
        return this.exchanges.find(
            (exchange) =>
                exchange.from === from &&
                exchange.to === to &&
                exchange.base === base
        );
    }

    async create({
        from,
        to,
        expires_date,
        amount,
        rate,
        base,
    }: ICreateExchangeDTO): Promise<Exchange> {
        const exchange = new Exchange();

        Object.assign(exchange, {
            from,
            to,
            expires_date,
            amount,
            rate,
            base,
            created_date: new Date(),
        });

        this.exchanges.push(exchange);

        return exchange;
    }
}

export { ExchangesRepositoryInMemory };
