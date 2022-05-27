import { Injectable } from '@nestjs/common';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { UpdateExchangeDto } from './dto/update-exchange.dto';
import { ExchangeHttpService } from '../../core/exchange-http/exchange-http.service';
import * as _ from 'lodash';

@Injectable()
export class ExchangeService {

  constructor(
    private readonly exchangeHttpService: ExchangeHttpService
  ) { }

  create(createExchangeDto: CreateExchangeDto) {
    return 'This action adds a new exchange';
  }

  findAll() {
    return `This action returns all exchange`;
  }

  async findOne(id: string) {
    let response = await this.exchangeHttpService.get(`/latest?base=USD&symbols=${id}`);
    console.log(response.data.rates);
    return `This action returns a #${_.get(response.data.rates, id)} exchange`;
  }

  update(id: number, updateExchangeDto: UpdateExchangeDto) {
    return `This action updates a #${id} exchange`;
  }

  remove(id: number) {
    return `This action removes a #${id} exchange`;
  }
}
