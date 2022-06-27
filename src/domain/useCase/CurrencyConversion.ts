import {
    CantBeNegativeExcepition,
    NotFoundException,
} from "@/domain/exception";
import { CurrencyRepository } from "@/domain/repository";

export interface CurrencyConverted {
    from: string;
    to: string;
    value: number;
}

export class CurrencyConversion {
    constructor(private readonly repository: CurrencyRepository) {}

    async convert(
        codeFrom: string,
        codeTo: string,
        amount: number
    ): Promise<CurrencyConverted> {
        if (amount <= 0) {
            throw new CantBeNegativeExcepition(
                `Amount can't be negative or zero`
            );
        }

        const currencyFrom = await this.repository.getByCode(codeFrom);
        if (!currencyFrom) {
            throw new NotFoundException(`The currency ${codeFrom} not found`);
        }

        const currencyTo = await this.repository.getByCode(codeTo);
        if (!currencyTo) {
            throw new NotFoundException(`The currency ${codeTo} not found`);
        }

        const valueCurrencyConversion =
            (amount * currencyFrom.value) / currencyTo.value;
        return {
            from: codeFrom.toUpperCase(),
            to: codeTo.toUpperCase(),
            value: Number(valueCurrencyConversion.toFixed(5)),
        };
    }
}
