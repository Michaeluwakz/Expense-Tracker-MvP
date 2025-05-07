import React from 'react';
import { useExpenses, getCategoryIcon } from '../context/ExpenseContext';
import { formatCurrency, calculateTotalExpenses, calculateExpensesByCategory } from '../utils/helpers';

const ExpenseSummary: React.FC = () => {
  const { expenses, categories } = useExpenses();
  
  const totalExpenses = calculateTotalExpenses(expenses);
  const expensesByCategory = calculateExpensesByCategory(expenses, categories);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
        <p className="text-3xl font-bold text-slate-800 mt-2">{formatCurrency(totalExpenses)}</p>
        <p className="text-sm text-gray-500">Total Expenses</p>
      </div>
      
      <h3 className="text-md font-medium text-gray-700 mb-3">Expenses by Category</h3>
      
      {expensesByCategory.length === 0 ? (
        <p className="text-gray-500 text-sm">No expenses recorded yet.</p>
      ) : (
        <ul className="space-y-3">
          {expensesByCategory
            .filter(summary => summary.totalAmount > 0)
            .map((summary) => {
              const category = categories.find((c) => c.id === summary.categoryId);
              if (!category) return null;
              
              const percentage = totalExpenses ? (summary.totalAmount / totalExpenses) * 100 : 0;
              
              return (
                <li key={summary.categoryId} className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-white">
                      {getCategoryIcon(category.icon)}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium text-gray-800">{category.name}</p>
                      <p className="font-semibold text-gray-800">{formatCurrency(summary.totalAmount)}</p>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: category.color 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</p>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default ExpenseSummary;