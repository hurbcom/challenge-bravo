import { ICreateExchangeDTO } from "@modules/exchanges/dtos/ICreateExchangeDTO";
import { Exchange } from "@modules/exchanges/infra/typeorm/entities/Exchange";

interface IExchangeRepository {
    findByExchange(from: string, to: string, base: string): Promise<Exchange>;
    create(data: ICreateExchangeDTO): Promise<Exchange>;
}

export { IExchangeRepository };
