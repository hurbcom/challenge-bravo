import CurrencyEntity, {
    CurrencyEntityProps,
} from "../entities/currency.entity";
import CurrencyRepository from "../repositories/currency.repository";

export default class RegisterNewCurrencyCase {
    constructor(private readonly currencyRepository: CurrencyRepository) {}

    async execute(
        currencyEntityProps: CurrencyEntityProps
    ): Promise<CurrencyEntityProps> {
        const currency = new CurrencyEntity(currencyEntityProps);

        const codeAlreadyInUse = await this.currencyRepository.findBy({
            code: currency.props.code,
        });

        if (codeAlreadyInUse) {
            throw "code_already_in_use";
        }

        const registeredCurrency = await this.currencyRepository.insert(
            currency
        );
        const { props } = registeredCurrency;

        return {
            _id: props._id,
            name: props.name,
            code: props.code,
            codein: props.codein,
            bid: props.bid,
            isFictitious: props.isFictitious,
        };
    }
}
