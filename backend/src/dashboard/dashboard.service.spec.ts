import { TransactionType } from '@prisma/client';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  const transactionsService = {
    findRecentAccessibleByUser: jest.fn(),
    findAllAccessibleByUser: jest.fn(),
  };
  const coupleService = {
    getDashboardSummary: jest.fn(),
  };
  const groupsService = {
    getDashboardSummary: jest.fn(),
  };

  let service: DashboardService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new DashboardService(
      transactionsService as never,
      coupleService as never,
      groupsService as never,
    );
  });

  it('aggregates summary, couple, groups, and recent transactions', async () => {
    coupleService.getDashboardSummary.mockResolvedValue({
      isLinked: true,
      youOwe: 0,
      owedToYou: 120,
      net: 120,
    });
    groupsService.getDashboardSummary.mockResolvedValue({
      totalNet: -45,
      groupCount: 3,
    });
    transactionsService.findRecentAccessibleByUser.mockResolvedValue([
      {
        id: 'tx-1',
        name: 'Groceries',
        amount: 200,
        category: 'FOOD',
        type: TransactionType.COUPLE,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creatorUserId: 'user-id',
        paidByUserId: 'user-id',
        couple: { id: 'couple-id' },
        group: null,
        splits: [
          { userId: 'user-id', percentage: 50 },
          { userId: 'partner-id', percentage: 50 },
        ],
      },
    ]);
    transactionsService.findAllAccessibleByUser.mockResolvedValue([
      {
        id: 'personal-tx',
        name: 'Rent',
        amount: 400,
        category: 'HOUSING',
        type: TransactionType.PERSONAL,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creatorUserId: 'user-id',
        paidByUserId: 'user-id',
        couple: null,
        group: null,
        splits: [],
      },
      {
        id: 'couple-tx',
        name: 'Groceries',
        amount: 200,
        category: 'FOOD',
        type: TransactionType.COUPLE,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creatorUserId: 'user-id',
        paidByUserId: 'user-id',
        couple: { id: 'couple-id' },
        group: null,
        splits: [
          { userId: 'user-id', percentage: 50 },
          { userId: 'partner-id', percentage: 50 },
        ],
      },
      {
        id: 'group-tx',
        name: 'Dinner',
        amount: 150,
        category: 'FOOD',
        type: TransactionType.GROUP,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creatorUserId: 'user-id',
        paidByUserId: 'friend-id',
        couple: null,
        group: { id: 'group-id', name: 'Trip' },
        splits: [
          { userId: 'user-id', percentage: 40 },
          { userId: 'friend-id', percentage: 60 },
        ],
      },
    ]);

    const result = await service.getDashboard('user-id');

    expect(result.summary.totalSpentThisMonth).toBe(560);
    expect(result.summary.currentBalance).toBe(-325);
    expect(result.couple.net).toBe(120);
    expect(result.groups.totalNet).toBe(-45);
    expect(result.recentTransactions).toHaveLength(1);
  });

  it('returns zeroed summary blocks for users without linked couple or groups', async () => {
    coupleService.getDashboardSummary.mockResolvedValue({
      isLinked: false,
      youOwe: 0,
      owedToYou: 0,
      net: 0,
    });
    groupsService.getDashboardSummary.mockResolvedValue({
      totalNet: 0,
      groupCount: 0,
    });
    transactionsService.findRecentAccessibleByUser.mockResolvedValue([]);
    transactionsService.findAllAccessibleByUser.mockResolvedValue([]);

    const result = await service.getDashboard('user-id');

    expect(result.summary.totalSpentThisMonth).toBe(0);
    expect(result.summary.currentBalance).toBe(0);
    expect(result.couple.isLinked).toBe(false);
    expect(result.groups.groupCount).toBe(0);
    expect(result.recentTransactions).toEqual([]);
  });
});
