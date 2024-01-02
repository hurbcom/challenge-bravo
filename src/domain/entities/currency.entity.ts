import { plainToClass } from "class-transformer";
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    validateSync,
} from "class-validator";
import ValidationError, { Failure } from "../errors/validation.error";

export class CurrencyEntityProps {
    @IsOptional()
    readonly _id?: any;

    @IsString({
        message: "should_be_string",
    })
    @IsNotEmpty({
        message: "field_required",
    })
    readonly name: string;

    @IsNotEmpty({
        message: "field_required",
    })
    @IsString({
        message: "should_be_string",
    })
    readonly code: string;

    @IsNotEmpty({
        message: "field_required",
    })
    @IsString({
        message: "should_be_string",
    })
    readonly codeIn: string;

    @IsNotEmpty({
        message: "field_required",
    })
    @IsNumber()
    readonly bid: number;

    @IsNotEmpty({
        message: "field_required",
    })
    @IsBoolean()
    readonly isFictitious: boolean;
}

export default class CurrencyEntity {
    public readonly props: CurrencyEntityProps;
    constructor(currencyEntityProps: CurrencyEntityProps) {
        const classObject = plainToClass(
            CurrencyEntityProps,
            currencyEntityProps
        );
        const errors = validateSync(classObject, {
            stopAtFirstError: true,
        });
        if (errors.length) {
            const failures: Failure[] = [];
            errors.forEach((error) =>
                failures.push({
                    msg: (error.constraints as Record<string, string>)[
                        Object.keys(
                            error.constraints as Record<string, string>
                        )[0]
                    ],
                    param: error.property,
                })
            );

            throw new ValidationError(failures);
        }

        this.props = classObject;
    }
}
