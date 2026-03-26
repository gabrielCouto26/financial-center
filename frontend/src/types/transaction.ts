export enum Category {
  FOOD = "FOOD",
  TRANSPORT = "TRANSPORT",
  HOUSING = "HOUSING",
  ENTERTAINMENT = "ENTERTAINMENT",
  HEALTH = "HEALTH",
  SHOPPING = "SHOPPING",
  EDUCATION = "EDUCATION",
  UTILITIES = "UTILITIES",
  OTHER = "OTHER",
}

export enum TransactionType {
  PERSONAL = "PERSONAL",
  COUPLE = "COUPLE",
  GROUP = "GROUP",
}

export type TransactionSplit = {
  userId: string;
  percentage: number;
};

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: string;
  createdAt: string;
  updatedAt: string;
  creatorUserId: string;
  paidByUserId: string;
  couple: { id: string } | null;
  group: { id: string; name: string } | null;
  splits: TransactionSplit[];
}

export interface CreateTransactionRequest {
  name: string;
  amount: number;
  category: Category;
  date: string;
  type: TransactionType;
  paidByUserId?: string;
  groupId?: string;
  participantUserIds?: string[];
  splits?: TransactionSplit[];
}
