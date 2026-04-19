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

export enum TransactionDirection {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
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
  direction: TransactionDirection;
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
  direction: TransactionDirection;
  paidByUserId?: string;
  groupId?: string;
  participantUserIds?: string[];
  splits?: TransactionSplit[];
}

export type UpdateTransactionRequest = Partial<CreateTransactionRequest>;

export interface PaginatedTransactions {
  items: Transaction[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
