import { IsNumberString, IsString } from "class-validator";

export class ConvertInputDto {
    @IsString()
    from: string;

    @IsString()
    to: string;
    
    @IsNumberString()
    amount: number;
}
