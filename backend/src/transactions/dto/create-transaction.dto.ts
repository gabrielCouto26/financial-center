import {
  ArrayMinSize,
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  MinLength,
  IsPositive,
  IsArray,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Category,
  TransactionDirection,
  TransactionType,
} from '@prisma/client';

export { Category, TransactionDirection, TransactionType };

export class CreateTransactionSplitDto {
  @IsUUID()
  userId!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  percentage!: number;
}

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

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsEnum(TransactionDirection)
  direction!: TransactionDirection;

  @IsOptional()
  @IsUUID()
  paidByUserId?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionSplitDto)
  splits?: CreateTransactionSplitDto[];

  @IsOptional()
  @IsUUID()
  groupId?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @IsUUID('4', { each: true })
  participantUserIds?: string[];
}
