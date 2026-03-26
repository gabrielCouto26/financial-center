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

  const groupsService = {
    listForUser: jest.fn(),
    getRequiredGroupRecord: jest.fn(),
  };

  let service: TransactionsService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new TransactionsService(
      prisma as never,
      coupleService as never,
      groupsService as never,
    );
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
      group: null,
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
      group: null,
      splits: [],
    });
  });

  it('rejects personal transactions with shared-expense fields', async () => {
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
      group: null,
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
      group: null,
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

  it('creates a group transaction with equal split across participants', async () => {
    groupsService.getRequiredGroupRecord.mockResolvedValue({
      id: 'group-id',
      members: [
        { userId: 'user-a' },
        { userId: 'user-b' },
        { userId: 'user-c' },
      ],
    });
    prisma.transaction.create.mockResolvedValue({
      id: 'tx-group',
      name: 'Taxi',
      amount: 90,
      category: Category.TRANSPORT,
      type: TransactionType.GROUP,
      date: new Date('2026-03-26T00:00:00.000Z'),
      createdAt: new Date('2026-03-26T00:00:00.000Z'),
      updatedAt: new Date('2026-03-26T00:00:00.000Z'),
      creatorUserId: 'user-a',
      paidByUserId: 'user-a',
      coupleLinkId: null,
      group: { id: 'group-id', name: 'Trip' },
      splits: [
        { userId: 'user-a', percentage: 33.33 },
        { userId: 'user-b', percentage: 33.33 },
        { userId: 'user-c', percentage: 33.34 },
      ],
    });

    await expect(
      service.create('user-a', {
        name: 'Taxi',
        amount: 90,
        category: Category.TRANSPORT,
        date: '2026-03-26',
        type: TransactionType.GROUP,
        groupId: 'group-id',
        paidByUserId: 'user-a',
      }),
    ).resolves.toMatchObject({
      type: TransactionType.GROUP,
      group: { id: 'group-id', name: 'Trip' },
    });
  });

  it('rejects group transactions when participant and split modes are mixed', async () => {
    await expect(
      service.create('user-a', {
        name: 'Taxi',
        amount: 90,
        category: Category.TRANSPORT,
        date: '2026-03-26',
        type: TransactionType.GROUP,
        groupId: 'group-id',
        paidByUserId: 'user-a',
        participantUserIds: ['user-a', 'user-b'],
        splits: [
          { userId: 'user-a', percentage: 50 },
          { userId: 'user-b', percentage: 50 },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lists personal, couple, and accessible group transactions', async () => {
    coupleService.findCoupleSummary.mockResolvedValue({ id: 'couple-id' });
    groupsService.listForUser.mockResolvedValue([{ id: 'group-id' }]);
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
        group: null,
        splits: [],
      },
    ]);

    await service.findAllAccessibleByUser('user-id');

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { creatorUserId: 'user-id', type: TransactionType.PERSONAL },
            { coupleLinkId: 'couple-id', type: TransactionType.COUPLE },
            { groupId: { in: ['group-id'] }, type: TransactionType.GROUP },
          ],
        },
      }),
    );
  });
});
