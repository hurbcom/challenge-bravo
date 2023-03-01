import {
    IsDefined,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
} from "class-validator";

export class Currency {
    @IsDefined()
    @IsNotEmpty()
    id: string;

    @IsIn(["fixed", "coingate"])
    @IsNotEmpty()
    sourceType: string;

    @IsOptional()
    name?: string;

    @IsOptional()
    @IsNumber()
    dollarRate?: number;

    constructor(data: {
        id: string;
        sourceType: string;
        name?: string;
        dollarRate?: number;
    }) {
        this.id = data.id;
        this.sourceType = data.sourceType;
        this.name = data.name;
        this.dollarRate = data.dollarRate;
    }
}
