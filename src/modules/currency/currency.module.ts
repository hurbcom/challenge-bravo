import { Module } from "@nestjs/common";
import { CurrencyController } from "@/modules/currency/currency.controller";
import {
    CurrencyRepositoryMemory,
    CURRENCY_REPOSITORY,
} from "@/domain/repository";
import { CurrencyService } from "./currency.service";

@Module({
    imports: [],
    controllers: [CurrencyController],
    providers: [
        {
            provide: CURRENCY_REPOSITORY,
            useClass: CurrencyRepositoryMemory,
        },
        CurrencyService,
    ],
    exports: [CurrencyService],
})
export class CurrencyModule {}
