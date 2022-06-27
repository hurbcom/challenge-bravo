import { Module } from "@nestjs/common";
import { CURRENCY_REPOSITORY } from "@/domain/repository";
import { ConvertController } from "@/modules/convert/convert.controller";
import { CurrencyRepositoryMemory } from "@/domain/repository";

@Module({
    imports: [],
    controllers: [ConvertController],
    providers: [
        {
            provide: CURRENCY_REPOSITORY,
            useClass: CurrencyRepositoryMemory,
        },
    ],
})
export class ConvertModule {}
