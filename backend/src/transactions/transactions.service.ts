import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, Category } from './dto/create-transaction.dto';

export interface TransactionResponse {
  id: string;
  name: string;
  amount: number;
  category: Category;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    const transaction = await this.prisma.transaction.create({
      data: {
        name: dto.name,
        amount: dto.amount,
        category: dto.category,
        date: new Date(dto.date),
        userId,
      },
    });

    return this.mapToResponse(transaction);
  }

  async findAllByUser(userId: string): Promise<TransactionResponse[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    return transactions.map((t) => this.mapToResponse(t));
  }

  private mapToResponse(transaction: {
    id: string;
    name: string;
    amount: unknown;
    category: Category;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
  }): TransactionResponse {
    return {
      id: transaction.id,
      name: transaction.name,
      amount: Number(transaction.amount),
      category: transaction.category,
      date: transaction.date,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }
}
