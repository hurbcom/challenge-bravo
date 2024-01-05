import { IsDate, IsDateString, IsNumber, IsString, IsUUID } from "class-validator";

export class CurrencyApiResponseDto {
    @IsUUID()
    _id: string

    @IsString()
    code: string;

    @IsString()
    codein: string;

    @IsString()
    name: string;

    @IsNumber()
    high: string;

    @IsNumber()
    low: string;
    
    @IsNumber()
    varBid: string;

    @IsNumber()
    pctChange: string;

    @IsNumber()
    bid: string;

    @IsNumber()
    ask: string;

    @IsDateString()
    timestamp: string;

    @IsDate()
    created_at: string;
};
