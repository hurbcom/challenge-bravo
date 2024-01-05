import { CurrencyResponseDto } from "../entities/dto/currency-response.dto";
import CurrencyRepository from "../repositories/currency.repository";

export default class UpdateCurrencyUseCase {
    constructor(private readonly currencyRepository: CurrencyRepository) {}

    async execute(body: any): Promise<CurrencyResponseDto | null> {
        const currencyResponse = await this.currencyRepository.findBy({
            code: body.code,
        });
        if (currencyResponse) {
            const currencyId = currencyResponse._id;
            await this.currencyRepository.update(currencyId, body);
            return {
                _id: body._id,
                name: body.name,
                code: body.code,
                codein: body.codein,
                bid: body.bid,
                isFictitious: body.isFictitious,
                timestamp: body.timestamp,
                created_at: body.created_at
            };
        }
        return null;
    }
}
