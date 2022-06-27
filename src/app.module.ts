import { Module } from "@nestjs/common";

import { AppController } from "@/app.controller";
import { CurrencyModule } from "@/modules/currency";
import { ConvertModule } from "@/modules/convert";

@Module({
    imports: [CurrencyModule, ConvertModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
