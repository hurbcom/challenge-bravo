import { ApiProperty } from '@nestjs/swagger';

export class CreateFicticiusDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    code: string;

    @ApiProperty({ required: false, default: 'USD' })
    baseCode: string;

    @ApiProperty({ required: false })
    amount?: number;

    @ApiProperty({ required: false, default: '1' })
    baseAmount?: number;

    @ApiProperty({ required: false, default: '1' })
    quotation?: number;
}
