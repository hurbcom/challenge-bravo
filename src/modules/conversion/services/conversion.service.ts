import { Injectable } from '@nestjs/common';

import { AwesomeApiService } from '../../../libraries/price/price-services/awesome-api.service';

@Injectable()
export class ConversionService {
    constructor(private readonly priceService: AwesomeApiService) {}

    public async convert({ to, from, value }) {
        return this.priceService.getPrices();
    }
}
