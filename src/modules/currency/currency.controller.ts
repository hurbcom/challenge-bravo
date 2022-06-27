import { CurrencyExchange } from "@/domain/entity";
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateCurrencyDto, UpdateCurrencyDto } from "./currency.dto";
import { CurrencyService } from "./currency.service";

@ApiTags("Currency")
@Controller("currency")
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) {}

    @Get()
    async getAll(): Promise<CurrencyExchange[]> {
        return this.currencyService.findAll();
    }

    @Get(":code")
    async getByCode(@Param("code") code: string): Promise<CurrencyExchange> {
        return this.currencyService.getByCode(code);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() currency: CreateCurrencyDto
    ): Promise<CurrencyExchange> {
        return this.currencyService.create(currency);
    }

    @Patch()
    async update(
        @Body() updateCurrency: UpdateCurrencyDto
    ): Promise<CurrencyExchange> {
        return this.currencyService.update(updateCurrency);
    }

    @Delete(":code")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param("code") code: string): Promise<void> {
        return this.currencyService.remove(code);
    }
}
