import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, ValidateIf } from 'class-validator';

export class CreateFictitiumDto {
    @ApiProperty({ example: 'Hotel Urbano Coin' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'HURB' })
    @IsString()
    code: string;

    @ApiProperty({ required: false, default: 'USD' })
    @IsString()
    baseCode: string;

    @ApiProperty({ required: false })
    @ValidateIf((obj) => !obj['quotation'])
    @IsNumber()
    amount?: number;

    @ApiProperty({ required: false, default: '1' })
    @ValidateIf((obj) => !obj['quotation'])
    @IsNumber()
    baseAmount?: number;

    @ApiProperty({ required: false, default: '1' })
    @ValidateIf((obj) => !obj['amount'] && !obj['baseAmount'])
    @IsNumber()
    quotation?: number;
}
