import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
} from "class-validator";

export class ConvertDto {
    @ApiProperty()
    @IsNotEmpty({
        message: "The from can't be empty or undefined",
    })
    @IsString()
    from: string;

    @ApiProperty()
    @IsNotEmpty({
        message: "The to can't be empty or undefined",
    })
    @IsString()
    to: string;

    @ApiProperty()
    @IsDefined()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    amount: number;
}
