import {
    CurrencyConversion,
    CurrencyConverted,
} from "@/domain/useCase/CurrencyConversion";
import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ConvertDto } from "@/modules/convert/convert.dto";
import { CurrencyRepository, CURRENCY_REPOSITORY } from "@/domain/repository";

@ApiTags("Convert")
@Controller("convert")
export class ConvertController {
    private usercase: CurrencyConversion;

    constructor(
        @Inject(CURRENCY_REPOSITORY) private readonly repo: CurrencyRepository
    ) {
        this.usercase = new CurrencyConversion(this.repo);
    }

    @Get()
    async convert(
        @Query() { from, to, amount }: ConvertDto
    ): Promise<CurrencyConverted> {
        return this.usercase.convert(from, to, amount);
    }
}
