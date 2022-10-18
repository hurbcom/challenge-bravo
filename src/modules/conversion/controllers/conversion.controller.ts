import { CacheInterceptor, CacheTTL, Controller, Get, NotFoundException, Query, UseInterceptors } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ConversionParamsDto } from '../dto/conversion-params.dto';
import { ConversionResponseDto } from '../dto/conversion-response.dto';
import { ConversionService } from '../services/conversion.service';

@ApiTags('Conversion')
@Controller('conversion')
export class ConversionController {
    constructor(private readonly _conversionService: ConversionService) {}

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(60)
    @Get('/')
    @ApiResponse({
        status: 200,
        type: ConversionResponseDto,
    })
    async convert(@Query() queryParams: ConversionParamsDto): Promise<ConversionResponseDto | NotFoundException> {
        return await this._conversionService.convert(queryParams);
    }
}
