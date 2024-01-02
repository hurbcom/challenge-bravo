import CurrencyEntity, {
    CurrencyEntityProps,
} from "../entities/currency.entity";
import CurrencyRepository from "../repositories/currency.repository";

export default class UpdateCurrencyUseCase {
    constructor(private readonly currencyRepository: CurrencyRepository) {}

    async execute(body: any): Promise<CurrencyEntityProps | null> {
        const currencyResponse = await this.currencyRepository.findBy({
            code: body.code,
        });
        if (currencyResponse) {
            const currencyId = currencyResponse[0].props._id;
            await this.currencyRepository.update(currencyId, body);
            return {
                _id: body._id,
                name: body.name,
                code: body.code,
                codeIn: body.codeIn,
                bid: body.bid,
                isFictitious: body.isFictitious,
            };
        }
        return null;
    }
}
