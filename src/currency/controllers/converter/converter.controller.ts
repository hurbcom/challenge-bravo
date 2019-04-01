import { Controller, Get } from '@nestjs/common';

@Controller('converter')
export class ConverterController {
    @Get()
    async convert() {
        return {};
    }
}
