import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { NovaMoedaDto } from './dto/nova-moeda.dto';
import { ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';

@Injectable()
export class MoedaService {
  @ApiCreatedResponse({ description: 'Moeda inserida ou atualizada com sucesso' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao inserir/atualizar nova moeda' })
  @ApiBody({ type: NovaMoedaDto })
  async inserirNovaMoeda(novaMoedaDto: NovaMoedaDto): Promise<any> {
    //Salvar a moeda no arquivo moedas.json
    try {
      let moedas: NovaMoedaDto[] = [];
      if (fs.existsSync('src/moeda/moedas.json')) {
        const data = fs.readFileSync('src/moeda/moedas.json', 'utf8');
        moedas = JSON.parse(data);
      }

      // Verificar se a moeda já existe
      const moedaExistente = moedas.find(m => m.nome === novaMoedaDto.nome);
      if (moedaExistente) {
        // Atualizar a moeda existente
        moedaExistente.valorEmReal = novaMoedaDto.valorEmReal;
        fs.writeFileSync('src/moeda/moedas.json', JSON.stringify(moedas, null, 2));
        return { message: `Moeda "${novaMoedaDto.nome}" atualizada com sucesso!` };
      }

      // Inserir a nova moeda
      moedas.push(novaMoedaDto);
      fs.writeFileSync('src/moeda/moedas.json', JSON.stringify(moedas, null, 2));
      return { message: `Moeda "${novaMoedaDto.nome}" inserida com sucesso!` };
    } catch (error) {
      throw new Error('Erro ao inserir/atualizar nova moeda: ' + error.message);
    }
  }
}
