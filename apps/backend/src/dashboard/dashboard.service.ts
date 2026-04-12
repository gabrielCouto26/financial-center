import { Injectable } from '@nestjs/common';
import {
  Category,
  TransactionDirection,
  TransactionType,
} from '@prisma/client';
import {
  CoupleDashboardSummary,
  CoupleService,
} from '../couple/couple.service';
import { GroupDashboardSummary, GroupsService } from '../groups/groups.service';
import {
  TransactionResponse,
  TransactionsService,
} from '../transactions/transactions.service';

export type DashboardResponse = {
  period: {
    month: string;
  };
  summary: {
    totalSpentThisMonth: number;
    currentBalance: number;
  };
  couple: CoupleDashboardSummary;
  groups: GroupDashboardSummary;
  personal: {
    currentMonthTotal: number;
    previousMonthTotal: number;
    monthOverMonthPercentage: number | null;
    categoryBreakdown: Array<{
      category: Category;
      amount: number;
      percentage: number;
    }>;
    secondaryHighlights: Array<{
      label: string;
      amount: number;
    }>;
  };
  recentTransactions: TransactionResponse[];
};

type PersonalDashboardSummary = DashboardResponse['personal'];

@Injectable()
export class DashboardService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly coupleService: CoupleService,
    private readonly groupsService: GroupsService,
  ) {}

  async getDashboard(userId: string): Promise<DashboardResponse> {
    const [couple, groups, recentTransactions] = await Promise.all([
      this.coupleService.getDashboardSummary(userId),
      this.groupsService.getDashboardSummary(userId),
      this.transactionsService.findRecentAccessibleByUser(userId, 10),
    ]);

    const { totalSpentThisMonth, personalNet, personal } =
      await this.getPersonalAndMonthlyMetrics(userId);

    return {
      period: {
        month: this.getCurrentMonthKey(),
      },
      summary: {
        totalSpentThisMonth: this.roundCurrency(totalSpentThisMonth),
        currentBalance: this.roundCurrency(
          personalNet + couple.net + groups.totalNet,
        ),
      },
      couple,
      groups,
      personal,
      recentTransactions,
    };
  }

  private async getPersonalAndMonthlyMetrics(userId: string): Promise<{
    totalSpentThisMonth: number;
    personalNet: number;
    personal: PersonalDashboardSummary;
  }> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );

    const accessibleTransactions =
      await this.transactionsService.findAllAccessibleByUser(userId);

    let totalSpentThisMonth = 0;
    let personalNet = 0;
    let currentMonthPersonalTotal = 0;
    let previousMonthPersonalTotal = 0;
    const categoryTotals = new Map<Category, number>();

    for (const transaction of accessibleTransactions) {
      const amount = Number(transaction.amount);
      const transactionDate = new Date(transaction.date);
      const isThisMonth =
        transactionDate >= monthStart && transactionDate < nextMonthStart;
      const isPreviousMonth =
        transactionDate >= previousMonthStart && transactionDate < monthStart;

      if (transaction.type === TransactionType.PERSONAL) {
        const signedAmount =
          transaction.direction === TransactionDirection.INCOME
            ? amount
            : -amount;

        personalNet += signedAmount;
        if (isThisMonth) {
          if (transaction.direction === TransactionDirection.EXPENSE) {
            totalSpentThisMonth += amount;
            currentMonthPersonalTotal += amount;
            categoryTotals.set(
              transaction.category,
              (categoryTotals.get(transaction.category) ?? 0) + amount,
            );
          }
        }
        if (
          isPreviousMonth &&
          transaction.direction === TransactionDirection.EXPENSE
        ) {
          previousMonthPersonalTotal += amount;
        }
        continue;
      }

      const userSplit = transaction.splits.find(
        (split) => split.userId === userId,
      );
      if (!userSplit) {
        continue;
      }

      const share = amount * (Number(userSplit.percentage) / 100);
      if (
        isThisMonth &&
        transaction.direction === TransactionDirection.EXPENSE
      ) {
        totalSpentThisMonth += share;
      }
    }

    const roundedCurrentMonthPersonalTotal = this.roundCurrency(
      currentMonthPersonalTotal,
    );
    const roundedPreviousMonthPersonalTotal = this.roundCurrency(
      previousMonthPersonalTotal,
    );
    const categoryBreakdown = [...categoryTotals.entries()]
      .map(([category, total]) => ({
        category,
        amount: this.roundCurrency(total),
        percentage:
          roundedCurrentMonthPersonalTotal === 0
            ? 0
            : this.roundPercentage(
                (this.roundCurrency(total) / roundedCurrentMonthPersonalTotal) *
                  100,
              ),
      }))
      .sort((left, right) => right.amount - left.amount);

    return {
      totalSpentThisMonth: this.roundCurrency(totalSpentThisMonth),
      personalNet: this.roundCurrency(personalNet),
      personal: {
        currentMonthTotal: roundedCurrentMonthPersonalTotal,
        previousMonthTotal: roundedPreviousMonthPersonalTotal,
        monthOverMonthPercentage:
          roundedPreviousMonthPersonalTotal === 0
            ? null
            : this.roundPercentage(
                ((roundedCurrentMonthPersonalTotal -
                  roundedPreviousMonthPersonalTotal) /
                  roundedPreviousMonthPersonalTotal) *
                  100,
              ),
        categoryBreakdown,
        secondaryHighlights: [
          {
            label: 'Lazer',
            amount: this.roundCurrency(
              categoryTotals.get(Category.ENTERTAINMENT) ?? 0,
            ),
          },
          {
            label: 'Outros',
            amount: this.roundCurrency(categoryTotals.get(Category.OTHER) ?? 0),
          },
        ],
      },
    };
  }

  private getCurrentMonthKey(): string {
    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    return `${now.getFullYear()}-${month}`;
  }

  private roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private roundPercentage(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
