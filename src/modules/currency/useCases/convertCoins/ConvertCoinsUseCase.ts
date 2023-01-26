import {
    ICurrencyRepository,
    IConvertedCoins,
} from "../../repositories/ICurrencyRepository";

class ConvertCoinsUseCase {
    constructor(private currencyRepository: ICurrencyRepository) {}

    async execute({ from, to, amount }: IConvertedCoins): Promise<number> {
        const code = await this.currencyRepository.findByCode(from);
        const code1 = await this.currencyRepository.findByCode(to);
        if (!(code && code1)) {
            throw new Error(
                `Coins ${from} or ${to} does not exists in database. P`
            );
        }

        const convertion = await this.currencyRepository.convertCoins({
            from,
            to,
            amount,
        });

        return convertion;
    }
}

export { ConvertCoinsUseCase };
