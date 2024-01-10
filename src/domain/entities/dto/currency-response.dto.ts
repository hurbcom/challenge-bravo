import { IsBoolean, IsDate, IsDateString, IsNumber, IsString, IsUUID } from "class-validator";

export class CurrencyResponseDto {
    @IsUUID()    
    _id: string;

    @IsString()
    name: string;

    @IsString()
    code: string;

    @IsString()
    codein: string;

    @IsNumber()
    bid: number;

    @IsBoolean()
    isFictitious: boolean;

    @IsDateString()
    timestamp: string;
    
    @IsDate()
    created_at: string;
};

