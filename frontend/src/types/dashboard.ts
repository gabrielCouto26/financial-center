import type { Transaction } from './transaction';
import type { Category } from './transaction';

export type DashboardData = {
  period: {
    month: string;
  };
  summary: {
    totalSpentThisMonth: number;
    currentBalance: number;
  };
  couple: {
    isLinked: boolean;
    youOwe: number;
    owedToYou: number;
    net: number;
  };
  groups: {
    totalNet: number;
    groupCount: number;
    items: Array<{
      id: string;
      name: string;
      net: number;
    }>;
  };
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
  recentTransactions: Transaction[];
};
