import { ApiProperty } from '@nestjs/swagger';

export class NovaMoedaDto {
  @ApiProperty({ description: 'Nome da moeda' })
  nome: string;

  @ApiProperty({ description: 'Valor em real da moeda' })
  valorEmReal: number;
}
