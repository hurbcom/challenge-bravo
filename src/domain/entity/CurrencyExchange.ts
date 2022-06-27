import { CantBeNegativeExcepition } from "@/domain/exception";

export interface CreateCurrencyExchange {
    name: string;
    code: string;
    value: number;
}

export class CurrencyExchange {
    readonly name: string;
    readonly code: string;
    value: number;
    readonly createdAt: Date;
    updatedAt: Date;

    constructor({ code, name, value }: CreateCurrencyExchange) {
        this.validate(value);
        this.code = code.toUpperCase();
        this.name = name;
        this.value = value;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    private validate(value) {
        if (value <= 0) {
            throw new CantBeNegativeExcepition(
                `The value can't be negative or zero`
            );
        }
    }

    updateValue(value: number): void {
        this.value = value;
        this.updatedAt = new Date();
    }
}
