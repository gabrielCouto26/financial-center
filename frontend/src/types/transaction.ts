export enum Category {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  HOUSING = 'HOUSING',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HEALTH = 'HEALTH',
  SHOPPING = 'SHOPPING',
  EDUCATION = 'EDUCATION',
  UTILITIES = 'UTILITIES',
  OTHER = 'OTHER',
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  category: Category;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  name: string;
  amount: number;
  category: Category;
  date: string;
}
