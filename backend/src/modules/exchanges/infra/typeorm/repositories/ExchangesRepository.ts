import { getRepository, Repository } from "typeorm";
import { ICreateExchangeDTO } from "@modules/exchanges/dtos/ICreateExchangeDTO";
import { Exchange } from "@modules/exchanges/infra/typeorm/entities/Exchange";
import { IExchangeRepository } from "@modules/exchanges/repositories/IExchangeRepository";

class ExchangeRepository implements IExchangeRepository {
    private repository: Repository<Exchange>;

    constructor() {
        this.repository = getRepository(Exchange);
    }

    async findByExchange(
        from: string,
        to: string,
        base: string
    ): Promise<Exchange> {
        const expiredExchange = await this.repository.findOne({
            where: [{ from, to, base }],
            order: {
                created_date: "DESC",
            },
        });
        return expiredExchange;
    }

    async create({
        from,
        to,
        expires_date,
        amount,
        value,
        rate,
        base,
    }: ICreateExchangeDTO): Promise<Exchange> {
        const exchange = this.repository.create({
            from,
            to,
            expires_date,
            amount,
            value,
            rate,
            base,
        });

        this.repository.save(exchange);

        return exchange;
    }
}

export { ExchangeRepository };
