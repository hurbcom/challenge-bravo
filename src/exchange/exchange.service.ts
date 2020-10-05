import { Injectable } from '@nestjs/common';

@Injectable()
export class ExchangeService {
  async convertAmount({from, to, amount}): Promise<any> {
    throw new Error();
  }
}
