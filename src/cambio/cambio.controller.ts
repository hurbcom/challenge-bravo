import { Controller, Get, Query } from '@nestjs/common';
import { CambioService } from './cambio.service';

@Controller('cambio')
export class CambioController {
  constructor(private readonly cambioService: CambioService) {}

  @Get() // A rota raiz 'cambio' aceitará os parâmetros de query 
  async converterMoeda(
    @Query('from') moedaOrigem: string, 
    @Query('to') moedaDestino: string, 
    @Query('amount') valor: number
  ): Promise<number> {
    return await this.cambioService.converterMoeda(moedaOrigem, moedaDestino, valor);
  }
}