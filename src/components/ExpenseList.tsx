import React, { useState } from 'react';
import { Expense } from '../types';
import { useExpenses, getCategoryIcon } from '../context/ExpenseContext';
import { formatCurrency, formatDate, getCategoryById } from '../utils/helpers';
import ExpenseForm from './ExpenseForm';
import { Trash2, Edit } from 'lucide-react';

const ExpenseList: React.FC = () => {
  const { expenses, categories, deleteExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (expenses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No expenses found. Add your first expense!</p>
      </div>
    );
  }

  // Filter expenses by category
  const filteredExpenses = filter === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category === filter);

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
  });

  const handleDeleteExpense = (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this expense?');
    if (confirm) {
      deleteExpense(id);
    }
  };

  const handleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-3 py-2 rounded-md ${
              sortBy === 'date' ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleSort('date')}
          >
            Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            className={`px-3 py-2 rounded-md ${
              sortBy === 'amount' ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleSort('amount')}
          >
            Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {editingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-4 max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Expense</h2>
            <ExpenseForm
              initialValues={editingExpense}
              isEditing
              onSubmit={() => setEditingExpense(null)}
            />
            <button
              onClick={() => setEditingExpense(null)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-3">
        {sortedExpenses.map((expense) => {
          const category = getCategoryById(expense.category, categories);
          
          return (
            <li 
              key={expense.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center p-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                  style={{ backgroundColor: category?.color || '#64748B' }}
                >
                  <span className="text-white">
                    {category && getCategoryIcon(category.icon)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{expense.description}</p>
                  <p className="text-sm text-gray-500">{formatDate(expense.date)} · {category?.name || 'Uncategorized'}</p>
                </div>
                
                <div className="ml-4 flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</span>
                  
                  <button 
                    onClick={() => setEditingExpense(expense)}
                    className="text-gray-400 hover:text-gray-700 transition-colors duration-200"
                    aria-label="Edit expense"
                  >
                    <Edit size={18} />
                  </button>
                  
                  <button 
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    aria-label="Delete expense"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ExpenseList;