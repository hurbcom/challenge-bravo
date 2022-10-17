import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConversionParamsDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    to: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    from: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    amount: number;
}
