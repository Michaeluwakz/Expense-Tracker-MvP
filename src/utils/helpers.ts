import { Category, Expense, ExpenseSummary } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const calculateExpensesByCategory = (
  expenses: Expense[],
  categories: Category[]
): ExpenseSummary[] => {
  const summary: ExpenseSummary[] = categories.map((category) => ({
    categoryId: category.id,
    totalAmount: 0,
  }));

  expenses.forEach((expense) => {
    const categorySummary = summary.find((item) => item.categoryId === expense.category);
    if (categorySummary) {
      categorySummary.totalAmount += expense.amount;
    }
  });

  return summary.sort((a, b) => b.totalAmount - a.totalAmount);
};

export const getMonthlyExpenses = (expenses: Expense[]): Record<string, number> => {
  const monthlyData: Record<string, number> = {};
  
  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = 0;
    }
    
    monthlyData[monthYear] += expense.amount;
  });
  
  return monthlyData;
};

export const getCategoryById = (categoryId: string, categories: Category[]): Category | undefined => {
  return categories.find((category) => category.id === categoryId);
};