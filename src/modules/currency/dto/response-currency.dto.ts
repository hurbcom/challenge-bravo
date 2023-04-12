import { ApiProperty } from '@nestjs/swagger';

export class ResponseCurrencyDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    exchangeRate: number;

    @ApiProperty()
    type: string;

    @ApiProperty()
    lastUpdate: string;
}
