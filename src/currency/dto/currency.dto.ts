import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsPositive } from 'class-validator';

import { CURRENCY } from '../providers/currency';

export class CurrencyDto {
    @IsIn(CURRENCY)
    from: string;

    @IsIn(CURRENCY)
    to: string;

    @IsNumber()
    @IsPositive()
    @Transform(value => +value)
    amount: number;
}
