import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsPositive } from 'class-validator';

import { Currency } from '../definitions/currency';
import { CURRENCY } from '../providers/currency';

export class CurrencyDto {
    @IsIn(CURRENCY)
    from: Currency;

    @IsIn(CURRENCY)
    to: Currency;

    @IsNumber()
    @IsPositive()
    @Transform(value => +value)
    amount: number;
}
