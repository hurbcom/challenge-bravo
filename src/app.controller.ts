import { Controller, Get } from '@nestjs/common';
import * as npmPackage from './../package.json';
@Controller()
export class AppController {
    @Get()
    getVersion(): { version: string } {
        return { version: npmPackage.version };
    }
}
