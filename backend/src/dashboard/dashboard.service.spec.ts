import {
  Category,
  TransactionDirection,
  TransactionType,
} from '@prisma/client';
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
      items: [
        { id: 'group-a', name: 'Trip', net: -30 },
        { id: 'group-b', name: 'Dinner Club', net: -15 },
        { id: 'group-c', name: 'Office', net: 0 },
      ],
    });
    transactionsService.findRecentAccessibleByUser.mockResolvedValue([
      {
        id: 'tx-1',
        name: 'Groceries',
        amount: 200,
        category: 'FOOD',
        type: TransactionType.COUPLE,
        direction: TransactionDirection.EXPENSE,
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
        direction: TransactionDirection.EXPENSE,
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
        direction: TransactionDirection.EXPENSE,
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
        direction: TransactionDirection.EXPENSE,
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
    expect(result.personal.currentMonthTotal).toBe(400);
    expect(result.personal.previousMonthTotal).toBe(0);
    expect(result.personal.monthOverMonthPercentage).toBeNull();
    expect(result.personal.categoryBreakdown).toEqual([
      {
        category: Category.HOUSING,
        amount: 400,
        percentage: 100,
      },
    ]);
    expect(result.personal.secondaryHighlights).toEqual([
      { label: 'Lazer', amount: 0 },
      { label: 'Outros', amount: 0 },
    ]);
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
      items: [],
    });
    transactionsService.findRecentAccessibleByUser.mockResolvedValue([]);
    transactionsService.findAllAccessibleByUser.mockResolvedValue([]);

    const result = await service.getDashboard('user-id');

    expect(result.summary.totalSpentThisMonth).toBe(0);
    expect(result.summary.currentBalance).toBe(0);
    expect(result.couple.isLinked).toBe(false);
    expect(result.groups.groupCount).toBe(0);
    expect(result.personal.currentMonthTotal).toBe(0);
    expect(result.personal.previousMonthTotal).toBe(0);
    expect(result.personal.monthOverMonthPercentage).toBeNull();
    expect(result.personal.categoryBreakdown).toEqual([]);
    expect(result.personal.secondaryHighlights).toEqual([
      { label: 'Lazer', amount: 0 },
      { label: 'Outros', amount: 0 },
    ]);
    expect(result.recentTransactions).toEqual([]);
  });

  it('builds personal category breakdown and previous-month comparison from personal transactions only', async () => {
    const now = new Date();
    const currentMonthDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      10,
    ).toISOString();
    const previousMonthDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      10,
    ).toISOString();

    coupleService.getDashboardSummary.mockResolvedValue({
      isLinked: false,
      youOwe: 0,
      owedToYou: 0,
      net: 0,
    });
    groupsService.getDashboardSummary.mockResolvedValue({
      totalNet: 0,
      groupCount: 0,
      items: [],
    });
    transactionsService.findRecentAccessibleByUser.mockResolvedValue([]);
    transactionsService.findAllAccessibleByUser.mockResolvedValue([
      {
        id: 'personal-food',
        name: 'Groceries',
        amount: 80,
        category: Category.FOOD,
        type: TransactionType.PERSONAL,
        direction: TransactionDirection.EXPENSE,
        date: currentMonthDate,
        createdAt: currentMonthDate,
        updatedAt: currentMonthDate,
        creatorUserId: 'user-id',
        paidByUserId: 'user-id',
        couple: null,
        group: null,
        splits: [],
      },
      {
        id: 'personal-entertainment',
        name: 'Cinema',
        amount: 20,
        category: Category.ENTERTAINMENT,
        type: TransactionType.PERSONAL,
        direction: TransactionDirection.EXPENSE,
        date: currentMonthDate,
        createdAt: currentMonthDate,
        updatedAt: currentMonthDate,
        creatorUserId: 'user-id',
        paidByUserId: 'user-id',
        couple: null,
        group: null,
        splits: [],
      },
      {
        id: 'personal-other',
        name: 'Misc',
        amount: 10,
        category: Category.OTHER,
        type: TransactionType.PERSONAL,
        direction: TransactionDirection.EXPENSE,
        date: currentMonthDate,
        createdAt: currentMonthDate,
        updatedAt: currentMonthDate,
        creatorUserId: 'user-id',
        paidByUserId: 'user-id',
        couple: null,
        group: null,
        splits: [],
      },
      {
        id: 'personal-previous',
        name: 'Older groceries',
        amount: 50,
        category: Category.FOOD,
        type: TransactionType.PERSONAL,
        direction: TransactionDirection.EXPENSE,
        date: previousMonthDate,
        createdAt: previousMonthDate,
        updatedAt: previousMonthDate,
        creatorUserId: 'user-id',
        paidByUserId: 'user-id',
        couple: null,
        group: null,
        splits: [],
      },
      {
        id: 'couple-current',
        name: 'Shared dinner',
        amount: 90,
        category: Category.FOOD,
        type: TransactionType.COUPLE,
        direction: TransactionDirection.EXPENSE,
        date: currentMonthDate,
        createdAt: currentMonthDate,
        updatedAt: currentMonthDate,
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

    const result = await service.getDashboard('user-id');

    expect(result.personal.currentMonthTotal).toBe(110);
    expect(result.personal.previousMonthTotal).toBe(50);
    expect(result.personal.monthOverMonthPercentage).toBe(120);
    expect(result.personal.categoryBreakdown).toEqual([
      { category: Category.FOOD, amount: 80, percentage: 72.73 },
      { category: Category.ENTERTAINMENT, amount: 20, percentage: 18.18 },
      { category: Category.OTHER, amount: 10, percentage: 9.09 },
    ]);
    expect(result.personal.secondaryHighlights).toEqual([
      { label: 'Lazer', amount: 20 },
      { label: 'Outros', amount: 10 },
    ]);
    expect(result.summary.totalSpentThisMonth).toBe(155);
  });

  it('excludes income from expense metrics while increasing current balance', async () => {
    const now = new Date();
    const currentMonthDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      12,
    ).toISOString();

    coupleService.getDashboardSummary.mockResolvedValue({
      isLinked: true,
      youOwe: 0,
      owedToYou: 0,
      net: -50,
    });
    groupsService.getDashboardSummary.mockResolvedValue({
      totalNet: 25,
      groupCount: 1,
      items: [{ id: 'group-id', name: 'Trip', net: 25 }],
    });
    transactionsService.findRecentAccessibleByUser.mockResolvedValue([]);
    transactionsService.findAllAccessibleByUser.mockResolvedValue([
      {
        id: 'salary',
        name: 'Salary',
        amount: 1000,
        category: Category.OTHER,
        type: TransactionType.PERSONAL,
        direction: TransactionDirection.INCOME,
        date: currentMonthDate,
        createdAt: currentMonthDate,
        updatedAt: currentMonthDate,
        creatorUserId: 'user-id',
        paidByUserId: 'user-id',
        couple: null,
        group: null,
        splits: [],
      },
      {
        id: 'rent',
        name: 'Rent',
        amount: 400,
        category: Category.HOUSING,
        type: TransactionType.PERSONAL,
        direction: TransactionDirection.EXPENSE,
        date: currentMonthDate,
        createdAt: currentMonthDate,
        updatedAt: currentMonthDate,
        creatorUserId: 'user-id',
        paidByUserId: 'user-id',
        couple: null,
        group: null,
        splits: [],
      },
      {
        id: 'shared-income',
        name: 'Refund',
        amount: 200,
        category: Category.OTHER,
        type: TransactionType.COUPLE,
        direction: TransactionDirection.INCOME,
        date: currentMonthDate,
        createdAt: currentMonthDate,
        updatedAt: currentMonthDate,
        creatorUserId: 'user-id',
        paidByUserId: 'partner-id',
        couple: { id: 'couple-id' },
        group: null,
        splits: [
          { userId: 'user-id', percentage: 50 },
          { userId: 'partner-id', percentage: 50 },
        ],
      },
    ]);

    const result = await service.getDashboard('user-id');

    expect(result.summary.totalSpentThisMonth).toBe(400);
    expect(result.personal.currentMonthTotal).toBe(400);
    expect(result.personal.categoryBreakdown).toEqual([
      {
        category: Category.HOUSING,
        amount: 400,
        percentage: 100,
      },
    ]);
    expect(result.summary.currentBalance).toBe(575);
  });
});
