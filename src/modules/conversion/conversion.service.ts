import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversionService {
    convert({ to, from, value }) {
        return {
            to,
            from,
            value,
        };
    }
}
