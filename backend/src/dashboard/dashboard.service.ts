import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
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
  recentTransactions: TransactionResponse[];
};

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

    const { totalSpentThisMonth, personalNet } =
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
      recentTransactions,
    };
  }

  private async getPersonalAndMonthlyMetrics(userId: string): Promise<{
    totalSpentThisMonth: number;
    personalNet: number;
  }> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const accessibleTransactions =
      await this.transactionsService.findAllAccessibleByUser(userId);

    let totalSpentThisMonth = 0;
    let personalNet = 0;

    for (const transaction of accessibleTransactions) {
      const amount = Number(transaction.amount);
      const isThisMonth =
        new Date(transaction.date) >= monthStart &&
        new Date(transaction.date) < nextMonthStart;

      if (transaction.type === TransactionType.PERSONAL) {
        personalNet -= amount;
        if (isThisMonth) {
          totalSpentThisMonth += amount;
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
      if (isThisMonth) {
        totalSpentThisMonth += share;
      }
    }

    return {
      totalSpentThisMonth: this.roundCurrency(totalSpentThisMonth),
      personalNet: this.roundCurrency(personalNet),
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
}
