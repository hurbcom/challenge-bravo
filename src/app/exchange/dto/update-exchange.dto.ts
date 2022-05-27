import { PartialType } from '@nestjs/swagger';
import { CreateExchangeDto } from './create-exchange.dto';

export class UpdateExchangeDto extends PartialType(CreateExchangeDto) {}
