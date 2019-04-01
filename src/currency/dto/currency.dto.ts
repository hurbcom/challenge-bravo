import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsPositive } from 'class-validator';

import { Currency } from '../definitions/currency';
import { CURRENCY } from '../providers/currency';
import { IsNotEqualTo } from '../validators/is-not-equal-to/is-not-equal-to.validator';

export class CurrencyDto {
    @IsIn(CURRENCY)
    from: Currency;

    @IsIn(CURRENCY)
    @IsNotEqualTo('from')
    to: Currency;

    @IsNumber()
    @IsPositive()
    @Transform(value => +value)
    amount: number;
}
