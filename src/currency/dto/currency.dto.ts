import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsPositive, IsBase64 } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

import { Currency } from '../definitions/currency';
import { CURRENCY } from '../providers/currency';
import { IsNotEqualTo } from '../validators/is-not-equal-to/is-not-equal-to.validator';

export class CurrencyDto {
    @IsIn(CURRENCY)
    @ApiModelProperty({ enum: CURRENCY })
    from: Currency;

    @IsIn(CURRENCY)
    @IsNotEqualTo('from')
    @ApiModelProperty({ enum: CURRENCY })
    to: Currency;

    @IsNumber()
    @IsPositive()
    @Transform(value => +value)
    @ApiModelProperty({
        exclusiveMinimum: 0,
    })
    amount: number;
}
