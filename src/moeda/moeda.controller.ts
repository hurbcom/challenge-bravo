import { Controller, Post, Body } from '@nestjs/common';
import { MoedaService } from './moeda.service';
import { NovaMoedaDto } from './dto/nova-moeda.dto';

@Controller('moeda')
export class MoedaController {
  constructor(private readonly moedaService: MoedaService) {}

  @Post()
  async inserirNovaMoeda(@Body() novaMoedaDto: NovaMoedaDto): Promise<void> {
    await this.moedaService.inserirNovaMoeda(novaMoedaDto);
  }
}
    