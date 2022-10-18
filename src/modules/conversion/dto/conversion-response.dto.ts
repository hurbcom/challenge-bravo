import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { CurrencyEntity } from '../../currency/entities/currency.entity';

interface ParseParams {
    toCurrency: CurrencyEntity;
    fromCurrency: CurrencyEntity;
    amount: number;
}

export class ConversionResponseDto {
    @ApiProperty()
    @IsString()
    from: string;

    @ApiProperty()
    @IsString()
    to: string;

    @ApiProperty()
    @IsNumber()
    amount: number;

    static parse({ toCurrency, fromCurrency, amount }: ParseParams): ConversionResponseDto {
        const calcRatio = (fromCurrency.ratio * amount) / toCurrency.ratio;
        const conversionResponseDto = new ConversionResponseDto();
        conversionResponseDto.from = toCurrency.code;
        conversionResponseDto.to = fromCurrency.code;
        conversionResponseDto.amount = calcRatio;
        return conversionResponseDto;
    }
}
