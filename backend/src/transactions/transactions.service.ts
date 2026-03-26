import { BadRequestException, Injectable } from '@nestjs/common';
import { Category, Prisma, TransactionType } from '@prisma/client';
import { CoupleService } from '../couple/couple.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTransactionDto,
  CreateTransactionSplitDto,
} from './dto/create-transaction.dto';

type TransactionRecord = Prisma.TransactionGetPayload<{
  include: {
    splits: true;
  };
}>;

export type TransactionSplitResponse = {
  userId: string;
  percentage: number;
};

export type TransactionResponse = {
  id: string;
  name: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  creatorUserId: string;
  paidByUserId: string;
  couple: { id: string } | null;
  splits: TransactionSplitResponse[];
};

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coupleService: CoupleService,
  ) {}

  async create(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    if (dto.type === TransactionType.PERSONAL) {
      return this.createPersonal(userId, dto);
    }

    return this.createCouple(userId, dto);
  }

  async findAllAccessibleByUser(
    userId: string,
  ): Promise<TransactionResponse[]> {
    const couple = await this.coupleService.findCoupleSummary(userId);
    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [
          {
            creatorUserId: userId,
            type: TransactionType.PERSONAL,
          },
          ...(couple
            ? [
                {
                  coupleLinkId: couple.id,
                  type: TransactionType.COUPLE,
                },
              ]
            : []),
        ],
      },
      include: {
        splits: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });

    return transactions.map((transaction) => this.mapToResponse(transaction));
  }

  private async createPersonal(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    if (dto.paidByUserId || dto.splits) {
      throw new BadRequestException(
        'Personal transactions cannot include payer or splits',
      );
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        name: dto.name,
        amount: dto.amount,
        category: dto.category,
        type: TransactionType.PERSONAL,
        date: new Date(dto.date),
        creatorUserId: userId,
        paidByUserId: userId,
      },
      include: {
        splits: true,
      },
    });

    return this.mapToResponse(transaction);
  }

  private async createCouple(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    const couple = await this.coupleService.getRequiredCoupleRecord(userId);
    const memberIds = new Set(couple.members.map((member) => member.userId));

    if (!dto.paidByUserId) {
      throw new BadRequestException(
        'Couple transactions require a paidByUserId',
      );
    }
    if (!memberIds.has(dto.paidByUserId)) {
      throw new BadRequestException('Payer must be part of the couple');
    }

    const normalizedSplits = this.normalizeSplits(
      dto.splits,
      couple.members.map((member) => member.userId),
    );

    const transaction = await this.prisma.transaction.create({
      data: {
        name: dto.name,
        amount: dto.amount,
        category: dto.category,
        type: TransactionType.COUPLE,
        date: new Date(dto.date),
        creatorUserId: userId,
        paidByUserId: dto.paidByUserId,
        coupleLinkId: couple.id,
        splits: {
          create: normalizedSplits.map((split) => ({
            userId: split.userId,
            percentage: split.percentage,
          })),
        },
      },
      include: {
        splits: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return this.mapToResponse(transaction);
  }

  private normalizeSplits(
    splits: CreateTransactionSplitDto[] | undefined,
    memberIds: string[],
  ): CreateTransactionSplitDto[] {
    if (!splits) {
      return memberIds.map((memberId) => ({
        userId: memberId,
        percentage: 50,
      }));
    }

    if (splits.length !== 2) {
      throw new BadRequestException('Couple transactions require two splits');
    }

    const seen = new Set<string>();
    let total = 0;
    for (const split of splits) {
      if (!memberIds.includes(split.userId)) {
        throw new BadRequestException('Split user must be part of the couple');
      }
      if (seen.has(split.userId)) {
        throw new BadRequestException('Each couple member must appear once');
      }
      seen.add(split.userId);
      total += split.percentage;
    }

    if (seen.size !== memberIds.length) {
      throw new BadRequestException('Both couple members must be included');
    }

    if (Math.abs(total - 100) > 0.001) {
      throw new BadRequestException('Split percentages must total 100');
    }

    return splits;
  }

  private mapToResponse(transaction: TransactionRecord): TransactionResponse {
    return {
      id: transaction.id,
      name: transaction.name,
      amount: Number(transaction.amount),
      category: transaction.category,
      type: transaction.type,
      date: transaction.date,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      creatorUserId: transaction.creatorUserId,
      paidByUserId: transaction.paidByUserId,
      couple: transaction.coupleLinkId
        ? { id: transaction.coupleLinkId }
        : null,
      splits: transaction.splits.map((split) => ({
        userId: split.userId,
        percentage: Number(split.percentage),
      })),
    };
  }
}
