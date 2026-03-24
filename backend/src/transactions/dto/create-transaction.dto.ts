import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  MinLength,
  IsPositive,
} from 'class-validator';
import { Category } from '@prisma/client';

export { Category };

export class CreateTransactionDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;

  @IsEnum(Category)
  category!: Category;

  @IsDateString()
  date!: string;
}
