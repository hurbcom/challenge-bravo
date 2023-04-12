import { Controller, Get } from '@nestjs/common';
import * as npmPackage from './../package.json';
import { ApiTags } from '@nestjs/swagger';
@Controller()
@ApiTags('Api')
export class AppController {
    @Get()
    getVersion(): { version: string } {
        return { version: npmPackage.version };
    }
}
