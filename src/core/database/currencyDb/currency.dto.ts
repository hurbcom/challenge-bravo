import { ApiProperty } from "@nestjs/swagger";

export class CurrencyDto {
    id?: string;
    @ApiProperty({ example: 'BTC' })
    readonly currency: string;
    @ApiProperty()
    readonly rate: number;
}