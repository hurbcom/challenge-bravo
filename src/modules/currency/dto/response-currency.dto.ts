import { ApiProperty } from '@nestjs/swagger';

export class ResponseCurrencyDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    exchangeRate: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    lastUpdate: string;
}
