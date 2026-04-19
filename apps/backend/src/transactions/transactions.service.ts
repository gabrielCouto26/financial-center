import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Category,
  Prisma,
  TransactionDirection,
  TransactionType,
} from '@prisma/client';
import { CoupleService } from '../couple/couple.service';
import { GroupsService } from '../groups/groups.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTransactionDto,
  CreateTransactionSplitDto,
} from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';

type TransactionRecord = Prisma.TransactionGetPayload<{
  include: {
    splits: true;
    group: true;
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
  direction: TransactionDirection;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  creatorUserId: string;
  paidByUserId: string;
  couple: { id: string } | null;
  group: { id: string; name: string } | null;
  splits: TransactionSplitResponse[];
};

export type PaginatedTransactionsResponse = {
  items: TransactionResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coupleService: CoupleService,
    private readonly groupsService: GroupsService,
  ) {}

  async create(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    switch (dto.type) {
      case TransactionType.PERSONAL:
        return this.createPersonal(userId, dto);
      case TransactionType.COUPLE:
        return this.createCouple(userId, dto);
      case TransactionType.GROUP:
        return this.createGroup(userId, dto);
      default:
        throw new BadRequestException('Unsupported transaction type');
    }
  }

  async findAllAccessibleByUser(
    userId: string,
  ): Promise<TransactionResponse[]> {
    const transactions = await this.findAccessibleTransactions(userId);
    return transactions.map((transaction) => this.mapToResponse(transaction));
  }

  async listAccessibleByUser(
    userId: string,
    query: ListTransactionsQueryDto,
  ): Promise<PaginatedTransactionsResponse> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where = await this.buildAccessibleWhere(userId, query);

    const [transactions, totalItems] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          splits: {
            orderBy: { createdAt: 'asc' },
          },
          group: true,
        },
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      items: transactions.map((transaction) => this.mapToResponse(transaction)),
      page,
      pageSize,
      totalItems,
      totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
    };
  }

  async findOne(
    userId: string,
    transactionId: string,
  ): Promise<TransactionResponse> {
    const where = await this.buildAccessibleWhere(userId);
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        AND: [where, { id: transactionId }],
      },
      include: {
        splits: {
          orderBy: { createdAt: 'asc' },
        },
        group: true,
      },
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found or access denied');
    }

    return this.mapToResponse(transaction);
  }

  async update(
    userId: string,
    transactionId: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionResponse> {
    await this.findOne(userId, transactionId);

    const updateData: Prisma.TransactionUpdateInput = {
      name: dto.name,
      amount: dto.amount,
      category: dto.category,
      direction: dto.direction,
      date: dto.date ? new Date(dto.date) : undefined,
      payer: dto.paidByUserId
        ? { connect: { id: dto.paidByUserId } }
        : undefined,
    };

    if (dto.splits) {
      updateData.splits = {
        deleteMany: {},
        create: dto.splits.map((split) => ({
          userId: split.userId,
          percentage: split.percentage,
        })),
      };
    }

    const transaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: updateData,
      include: {
        splits: {
          orderBy: { createdAt: 'asc' },
        },
        group: true,
      },
    });

    return this.mapToResponse(transaction);
  }

  async findRecentAccessibleByUser(
    userId: string,
    limit: number,
  ): Promise<TransactionResponse[]> {
    const transactions = await this.findAccessibleTransactions(userId, limit);
    return transactions.map((transaction) => this.mapToResponse(transaction));
  }

  private async findAccessibleTransactions(
    userId: string,
    limit?: number,
  ): Promise<TransactionRecord[]> {
    const where = await this.buildAccessibleWhere(userId);

    return this.prisma.transaction.findMany({
      where,
      include: {
        splits: {
          orderBy: { createdAt: 'asc' },
        },
        group: true,
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      ...(typeof limit === 'number' ? { take: limit } : {}),
    });
  }

  private async buildAccessibleWhere(
    userId: string,
    query?: Pick<ListTransactionsQueryDto, 'search' | 'dateFrom' | 'dateTo'>,
  ): Promise<Prisma.TransactionWhereInput> {
    const couple = await this.coupleService.findCoupleSummary(userId);
    const groups = await this.groupsService.listForUser(userId);
    const filters: Prisma.TransactionWhereInput[] = [];
    const trimmedSearch = query?.search?.trim();

    if (trimmedSearch) {
      filters.push({
        name: {
          contains: trimmedSearch,
          mode: 'insensitive',
        },
      });
    }

    if (query?.dateFrom || query?.dateTo) {
      const date: Prisma.DateTimeFilter = {};
      if (query.dateFrom) {
        date.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        const inclusiveDateTo = new Date(query.dateTo);
        inclusiveDateTo.setUTCHours(23, 59, 59, 999);
        date.lte = inclusiveDateTo;
      }
      filters.push({ date });
    }

    filters.push({
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
        ...(groups.length > 0
          ? [
              {
                groupId: { in: groups.map((group) => group.id) },
                type: TransactionType.GROUP,
              },
            ]
          : []),
      ],
    });

    return {
      AND: filters,
    };
  }

  private async createPersonal(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    if (
      dto.paidByUserId ||
      dto.splits ||
      dto.groupId ||
      dto.participantUserIds
    ) {
      throw new BadRequestException(
        'Personal transactions cannot include shared-expense fields',
      );
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        name: dto.name,
        amount: dto.amount,
        category: dto.category,
        type: TransactionType.PERSONAL,
        direction: dto.direction,
        date: new Date(dto.date),
        creatorUserId: userId,
        paidByUserId: userId,
      },
      include: {
        splits: true,
        group: true,
      },
    });

    return this.mapToResponse(transaction);
  }

  private async createCouple(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    if (dto.groupId || dto.participantUserIds) {
      throw new BadRequestException(
        'Couple transactions cannot include group fields',
      );
    }

    const couple = await this.coupleService.getRequiredCoupleRecord(userId);
    const memberIds = couple.members.map((member) => member.userId);

    if (!dto.paidByUserId) {
      throw new BadRequestException(
        'Couple transactions require a paidByUserId',
      );
    }
    if (!memberIds.includes(dto.paidByUserId)) {
      throw new BadRequestException('Payer must be part of the couple');
    }

    const normalizedSplits = this.normalizeCoupleSplits(dto.splits, memberIds);
    const transaction = await this.prisma.transaction.create({
      data: {
        name: dto.name,
        amount: dto.amount,
        category: dto.category,
        type: TransactionType.COUPLE,
        direction: dto.direction,
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
        group: true,
      },
    });

    return this.mapToResponse(transaction);
  }

  private async createGroup(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    if (!dto.groupId) {
      throw new BadRequestException('Group transactions require a groupId');
    }
    if (!dto.paidByUserId) {
      throw new BadRequestException(
        'Group transactions require a paidByUserId',
      );
    }
    if (dto.participantUserIds && dto.splits) {
      throw new BadRequestException(
        'Use participantUserIds or splits, not both',
      );
    }

    const group = await this.groupsService.getRequiredGroupRecord(
      userId,
      dto.groupId,
    );
    const memberIds = group.members.map((member) => member.userId);
    if (!memberIds.includes(dto.paidByUserId)) {
      throw new BadRequestException('Payer must be a group member');
    }

    const normalizedSplits = this.normalizeGroupSplits(
      dto.splits,
      dto.participantUserIds,
      memberIds,
    );
    const transaction = await this.prisma.transaction.create({
      data: {
        name: dto.name,
        amount: dto.amount,
        category: dto.category,
        type: TransactionType.GROUP,
        direction: dto.direction,
        date: new Date(dto.date),
        creatorUserId: userId,
        paidByUserId: dto.paidByUserId,
        groupId: group.id,
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
        group: true,
      },
    });

    return this.mapToResponse(transaction);
  }

  private normalizeCoupleSplits(
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

    this.assertValidSplitSet(splits, memberIds);
    return splits;
  }

  private normalizeGroupSplits(
    splits: CreateTransactionSplitDto[] | undefined,
    participantUserIds: string[] | undefined,
    memberIds: string[],
  ): CreateTransactionSplitDto[] {
    if (splits) {
      this.assertValidSplitSet(splits, memberIds);
      return splits;
    }

    const participants = participantUserIds?.length
      ? this.normalizeParticipants(participantUserIds, memberIds)
      : memberIds;

    const basePercentage = Math.floor(10000 / participants.length) / 100;
    const splitsWithRemainder = participants.map((participant) => ({
      userId: participant,
      percentage: basePercentage,
    }));
    const total = splitsWithRemainder.reduce(
      (sum, split) => sum + split.percentage,
      0,
    );
    splitsWithRemainder[splitsWithRemainder.length - 1].percentage =
      this.roundPercentage(
        splitsWithRemainder[splitsWithRemainder.length - 1].percentage +
          (100 - total),
      );

    return splitsWithRemainder;
  }

  private normalizeParticipants(
    participantUserIds: string[],
    memberIds: string[],
  ): string[] {
    const unique = new Set(participantUserIds);
    if (unique.size !== participantUserIds.length) {
      throw new BadRequestException('Group participants must be unique');
    }

    for (const participant of participantUserIds) {
      if (!memberIds.includes(participant)) {
        throw new BadRequestException('Participant must be a group member');
      }
    }

    return participantUserIds;
  }

  private assertValidSplitSet(
    splits: CreateTransactionSplitDto[],
    allowedUserIds: string[],
  ): void {
    if (splits.length < 2) {
      throw new BadRequestException('At least two participants are required');
    }

    const seen = new Set<string>();
    let total = 0;
    for (const split of splits) {
      if (!allowedUserIds.includes(split.userId)) {
        throw new BadRequestException('Split user is not allowed');
      }
      if (seen.has(split.userId)) {
        throw new BadRequestException('Each participant must appear once');
      }
      seen.add(split.userId);
      total += split.percentage;
    }

    if (Math.abs(total - 100) > 0.001) {
      throw new BadRequestException('Split percentages must total 100');
    }
  }

  private roundPercentage(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private mapToResponse(transaction: TransactionRecord): TransactionResponse {
    return {
      id: transaction.id,
      name: transaction.name,
      amount: Number(transaction.amount),
      category: transaction.category,
      type: transaction.type,
      direction: transaction.direction,
      date: transaction.date,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      creatorUserId: transaction.creatorUserId,
      paidByUserId: transaction.paidByUserId,
      couple: transaction.coupleLinkId
        ? { id: transaction.coupleLinkId }
        : null,
      group: transaction.group
        ? { id: transaction.group.id, name: transaction.group.name }
        : null,
      splits: transaction.splits.map((split) => ({
        userId: split.userId,
        percentage: Number(split.percentage),
      })),
    };
  }
}
