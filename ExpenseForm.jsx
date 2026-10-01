import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit3 } from 'lucide-react';

const ExpenseForm = ({ initialData = null, categories = [], onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'Credit Card',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || 'Food',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: initialData.description || '',
        paymentMethod: initialData.paymentMethod || 'Credit Card',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Expense title is required';
    if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than zero';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Filter expense-type categories or fallback
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Title */}
      <div className="form-group">
        <label className="form-label">Expense Title / Merchant *</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Grocery store, Netflix subscription, Flight ticket"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        {errors.title && <span style={{ color: 'var(--color-expense)', fontSize: '0.8rem' }}>{errors.title}</span>}
      </div>

      {/* Amount & Category */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Amount ($) *</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className="form-input"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          {errors.amount && <span style={{ color: 'var(--color-expense)', fontSize: '0.8rem' }}>{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            className="form-select"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {expenseCategories.length > 0 ? (
              expenseCategories.map((c) => (
                <option key={c._id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))
            ) : (
              <>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
                <option value="Others">Others</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Date & Payment Method */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Date *</label>
          <input
            type="date"
            className="form-input"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          {errors.date && <span style={{ color: 'var(--color-expense)', fontSize: '0.8rem' }}>{errors.date}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <select
            className="form-select"
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="PayPal">PayPal</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Notes / Description (Optional)</label>
        <textarea
          className="form-textarea"
          placeholder="Add receipt notes or memo..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {/* Submit / Cancel Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-expense" disabled={loading}>
          {initialData ? <Edit3 size={18} /> : <PlusCircle size={18} />}
          {loading ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
