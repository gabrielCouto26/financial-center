import type { Transaction } from './transaction';

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
  };
  recentTransactions: Transaction[];
};
