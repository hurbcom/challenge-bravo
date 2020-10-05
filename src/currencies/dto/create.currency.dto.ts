import { IsNotEmpty, Length } from 'class-validator';

export class CreateCurrencyDto {
  @IsNotEmpty()
  @Length(3,3)
  currency: string;

  @IsNotEmpty()
  value: number;
}