import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { getCategoryIcon } from '../context/ExpenseContext';

interface ExpenseFormProps {
  onSubmit: () => void;
  initialValues?: {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
  };
  isEditing?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  initialValues = {
    id: '',
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  },
  isEditing = false,
}) => {
  const { categories, addExpense, editExpense } = useExpenses();
  const [amount, setAmount] = useState(initialValues.amount || 0);
  const [category, setCategory] = useState(initialValues.category || (categories[0]?.id || ''));
  const [description, setDescription] = useState(initialValues.description || '');
  const [date, setDate] = useState(initialValues.date || new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!category) {
      setError('Please select a category');
      return;
    }
    
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }
    
    if (!date) {
      setError('Please select a date');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Submit the form
    const expenseData = {
      amount,
      category,
      description,
      date,
    };
    
    if (isEditing && initialValues.id) {
      editExpense(initialValues.id, expenseData);
    } else {
      addExpense(expenseData);
    }
    
    // Reset form (only for new expenses)
    if (!isEditing) {
      setAmount(0);
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
    
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount ($)
        </label>
        <input
          type="number"
          id="amount"
          value={amount || ''}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          step="0.01"
          min="0"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="0.00"
          required
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Netflix subscription"
          required
        />
      </div>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 text-white rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
        >
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;