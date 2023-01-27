import {
    ICurrencyRepository,
    IConvertedCoins,
} from "../../repositories/ICurrencyRepository";

class ConvertCoinsUseCase {
    constructor(private currencyRepository: ICurrencyRepository) {}

    async execute({ from, to, amount }: IConvertedCoins): Promise<number> {
        if ([from, to, amount].includes(undefined)) {
            throw new Error(
                "Please, inform data to variables from, to and amount"
            );
        }

        const fromRepositoryCode = await this.currencyRepository.findByCode(
            from
        );
        const toRepositoryCode = await this.currencyRepository.findByCode(to);
        if (!(fromRepositoryCode && toRepositoryCode)) {
            throw new Error(
                `Coins ${from} or ${to} does not exists in database`
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
