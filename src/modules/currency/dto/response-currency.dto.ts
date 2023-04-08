import { ApiProperty } from '@nestjs/swagger';

export class ResponseCurrencyDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    rate: string;

    @ApiProperty()
    type: string;
}
