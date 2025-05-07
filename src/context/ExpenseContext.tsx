import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category, Expense } from '../types';
import { generateId } from '../utils/helpers';
import useLocalStorage from '../hooks/useLocalStorage';
import { Wallet, ShoppingCart, Home, Car, Coffee, Gift, Film, BookOpen, Utensils, Plane, Plus } from 'lucide-react';

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  editExpense: (id: string, updatedExpense: Omit<Expense, 'id'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
}

const defaultCategories: Category[] = [
  { id: 'subscription', name: 'Subscriptions', color: '#8B5CF6', icon: 'Film' },
  { id: 'food', name: 'Food & Dining', color: '#F59E0B', icon: 'Utensils' },
  { id: 'transportation', name: 'Transportation', color: '#10B981', icon: 'Car' },
  { id: 'housing', name: 'Housing', color: '#3B82F6', icon: 'Home' },
  { id: 'shopping', name: 'Shopping', color: '#EC4899', icon: 'ShoppingCart' },
  { id: 'entertainment', name: 'Entertainment', color: '#6366F1', icon: 'Film' },
  { id: 'education', name: 'Education', color: '#0EA5E9', icon: 'BookOpen' },
  { id: 'travel', name: 'Travel', color: '#F97316', icon: 'Plane' },
  { id: 'other', name: 'Other', color: '#64748B', icon: 'Wallet' },
];

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', defaultCategories);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: generateId() };
    setExpenses([...expenses, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const editExpense = (id: string, updatedExpense: Omit<Expense, 'id'>) => {
    setExpenses(
      expenses.map((expense) => (expense.id === id ? { ...updatedExpense, id } : expense))
    );
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: generateId() };
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (id: string) => {
    // Don't delete a category if it has expenses
    const hasExpenses = expenses.some((expense) => expense.category === id);
    if (hasExpenses) {
      alert('Cannot delete category with expenses. Please delete or reassign those expenses first.');
      return;
    }
    setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        addExpense,
        deleteExpense,
        editExpense,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Wallet':
      return <Wallet size={20} />;
    case 'ShoppingCart':
      return <ShoppingCart size={20} />;
    case 'Home':
      return <Home size={20} />;
    case 'Car':
      return <Car size={20} />;
    case 'Coffee':
      return <Coffee size={20} />;
    case 'Gift':
      return <Gift size={20} />;
    case 'Film':
      return <Film size={20} />;
    case 'BookOpen':
      return <BookOpen size={20} />;
    case 'Utensils':
      return <Utensils size={20} />;
    case 'Plane':
      return <Plane size={20} />;
    default:
      return <Plus size={20} />;
  }
};