import { BadRequestException } from '@nestjs/common';
import { Category, TransactionType } from '@prisma/client';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  const prisma = {
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const coupleService = {
    findCoupleSummary: jest.fn(),
    getRequiredCoupleRecord: jest.fn(),
  };

  let service: TransactionsService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new TransactionsService(prisma as never, coupleService as never);
  });

  it('creates a personal transaction without shared fields', async () => {
    prisma.transaction.create.mockResolvedValue({
      id: 'tx-1',
      name: 'Rent',
      amount: 1200,
      category: Category.HOUSING,
      type: TransactionType.PERSONAL,
      date: new Date('2026-03-26T00:00:00.000Z'),
      createdAt: new Date('2026-03-26T00:00:00.000Z'),
      updatedAt: new Date('2026-03-26T00:00:00.000Z'),
      creatorUserId: 'user-id',
      paidByUserId: 'user-id',
      coupleLinkId: null,
      splits: [],
    });

    await expect(
      service.create('user-id', {
        name: 'Rent',
        amount: 1200,
        category: Category.HOUSING,
        date: '2026-03-26',
        type: TransactionType.PERSONAL,
      }),
    ).resolves.toMatchObject({
      type: TransactionType.PERSONAL,
      paidByUserId: 'user-id',
      splits: [],
    });
  });

  it('rejects personal transactions with payer or split fields', async () => {
    await expect(
      service.create('user-id', {
        name: 'Rent',
        amount: 1200,
        category: Category.HOUSING,
        date: '2026-03-26',
        type: TransactionType.PERSONAL,
        paidByUserId: 'user-id',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates a couple transaction with default 50/50 splits', async () => {
    coupleService.getRequiredCoupleRecord.mockResolvedValue({
      id: 'couple-id',
      members: [{ userId: 'user-id' }, { userId: 'partner-id' }],
    });
    prisma.transaction.create.mockResolvedValue({
      id: 'tx-2',
      name: 'Groceries',
      amount: 200,
      category: Category.FOOD,
      type: TransactionType.COUPLE,
      date: new Date('2026-03-26T00:00:00.000Z'),
      createdAt: new Date('2026-03-26T00:00:00.000Z'),
      updatedAt: new Date('2026-03-26T00:00:00.000Z'),
      creatorUserId: 'user-id',
      paidByUserId: 'user-id',
      coupleLinkId: 'couple-id',
      splits: [
        { userId: 'user-id', percentage: 50 },
        { userId: 'partner-id', percentage: 50 },
      ],
    });

    await expect(
      service.create('user-id', {
        name: 'Groceries',
        amount: 200,
        category: Category.FOOD,
        date: '2026-03-26',
        type: TransactionType.COUPLE,
        paidByUserId: 'user-id',
      }),
    ).resolves.toMatchObject({
      type: TransactionType.COUPLE,
      couple: { id: 'couple-id' },
      splits: [
        { userId: 'user-id', percentage: 50 },
        { userId: 'partner-id', percentage: 50 },
      ],
    });
  });

  it('rejects couple splits when they do not total 100', async () => {
    coupleService.getRequiredCoupleRecord.mockResolvedValue({
      id: 'couple-id',
      members: [{ userId: 'user-id' }, { userId: 'partner-id' }],
    });

    await expect(
      service.create('user-id', {
        name: 'Internet',
        amount: 120,
        category: Category.UTILITIES,
        date: '2026-03-26',
        type: TransactionType.COUPLE,
        paidByUserId: 'partner-id',
        splits: [
          { userId: 'user-id', percentage: 40 },
          { userId: 'partner-id', percentage: 50 },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lists personal and accessible couple transactions', async () => {
    coupleService.findCoupleSummary.mockResolvedValue({ id: 'couple-id' });
    prisma.transaction.findMany.mockResolvedValue([
      {
        id: 'tx-1',
        name: 'Rent',
        amount: 1200,
        category: Category.HOUSING,
        type: TransactionType.PERSONAL,
        date: new Date('2026-03-26T00:00:00.000Z'),
        createdAt: new Date('2026-03-26T00:00:00.000Z'),
        updatedAt: new Date('2026-03-26T00:00:00.000Z'),
        creatorUserId: 'user-id',
        paidByUserId: 'user-id',
        coupleLinkId: null,
        splits: [],
      },
    ]);

    const result = await service.findAllAccessibleByUser('user-id');

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { creatorUserId: 'user-id', type: TransactionType.PERSONAL },
            { coupleLinkId: 'couple-id', type: TransactionType.COUPLE },
          ],
        },
      }),
    );
    expect(result).toHaveLength(1);
  });
});
