import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
} from "class-validator";

export class CreateCurrencyDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({
        message: "The name can't be empty or undefined",
    })
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({
        message: "The code can't be empty or undefined",
    })
    code: string;

    @ApiProperty()
    @IsDefined()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    value: number;
}

export class UpdateCurrencyDto {
    @ApiProperty()
    @IsDefined()
    @IsNotEmpty({
        message: "The code can't be empty or undefined",
    })
    @IsString()
    code: string;

    @ApiProperty()
    @IsDefined()
    @IsNotEmpty({
        message: "The name can't be empty or undefined",
    })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    value: number;
}
