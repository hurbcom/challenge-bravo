import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Health")
@Controller()
export class AppController {
    @Get("/health")
    healthCheck() {
        return {
            timestamp: new Date().toISOString(),
        };
    }
}
