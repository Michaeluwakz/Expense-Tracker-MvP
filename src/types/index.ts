export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
};

export type ExpenseSummary = {
  categoryId: string;
  totalAmount: number;
};