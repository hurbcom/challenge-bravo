import { ApiProperty } from '@nestjs/swagger';

class QuotationInfoDto {
    @ApiProperty()
    exchangeRate: number;

    @ApiProperty()
    lastUpdate?: string;
}

export class ResponseQuotationDto {
    @ApiProperty({ type: QuotationInfoDto })
    info: QuotationInfoDto;

    @ApiProperty()
    result: number;
}
