import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { exportTransactionsToExcel } from '../utils/exportExcel';
import {
  Settings as SettingsIcon,
  Tag,
  Plus,
  Trash2,
  Sun,
  Moon,
  DownloadCloud,
  Shield,
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('expense');
  const [newCatColor, setNewCatColor] = useState('#6366f1');
  const [catMsg, setCatMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCatMsg({ text: '', type: '' });

    if (!newCatName.trim()) {
      setCatMsg({ text: 'Category name is required', type: 'error' });
      return;
    }

    try {
      const res = await api.post('/api/categories', {
        name: newCatName,
        type: newCatType,
        color: newCatColor,
      });

      if (res.data.success) {
        setCatMsg({ text: 'Category created successfully!', type: 'success' });
        setNewCatName('');
        fetchCategories();
      }
    } catch (err) {
      setCatMsg({
        text: err.response?.data?.message || 'Failed to create category',
        type: 'error',
      });
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this custom category?')) {
      try {
        await api.delete(`/api/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Cannot delete category');
      }
    }
  };

  const handleExportFullBackup = async () => {
    try {
      const [incRes, expRes] = await Promise.all([
        api.get('/api/income?limit=1000'),
        api.get('/api/expense?limit=1000'),
      ]);

      const allData = [
        ...(incRes.data.incomes || []).map((i) => ({ ...i, type: 'income' })),
        ...(expRes.data.expenses || []).map((e) => ({ ...e, type: 'expense' })),
      ];

      exportTransactionsToExcel({
        fileName: 'full_financial_database_backup',
        transactions: allData,
      });
    } catch (err) {
      alert('Failed to generate full data backup.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px' }}>
      <div>
        <h2 style={{ fontSize: '1.85rem' }}>Application Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Configure categories, visual aesthetics, and database backup exports.
        </p>
      </div>

      {/* Theme Preference */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Visual Theme Preference</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Choose your interface style. System preferences are automatically remembered.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setTheme('dark')}
            className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '0.5rem', padding: '0.75rem 1.25rem' }}
          >
            <Moon size={18} /> Modern Dark Mode
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '0.5rem', padding: '0.75rem 1.25rem' }}
          >
            <Sun size={18} /> High-Contrast Light Mode
          </button>
        </div>
      </div>

      {/* Custom Categories Manager */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Tag size={18} color="var(--color-primary)" /> Custom Categories Management
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Create custom labels for unique revenue streams or niche expense tags.
        </p>

        {catMsg.text && (
          <div
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              fontSize: '0.88rem',
              background: catMsg.type === 'success' ? 'var(--color-income-light)' : 'var(--color-expense-light)',
              color: catMsg.type === 'success' ? 'var(--color-income)' : 'var(--color-expense)',
              border: `1px solid ${catMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            }}
          >
            {catMsg.text}
          </div>
        )}

        {/* Add Category Inline Form */}
        <form
          onSubmit={handleCreateCategory}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 120px',
            gap: '1rem',
            marginBottom: '1.5rem',
            alignItems: 'flex-end',
          }}
        >
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Category Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Crypto, Gym, Freelance"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Type *</label>
            <select
              className="form-select"
              value={newCatType}
              onChange={(e) => setNewCatType(e.target.value)}
            >
              <option value="expense">Expense Category</option>
              <option value="income">Income Category</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Tag Color</label>
            <input
              type="color"
              className="form-input"
              style={{ height: '40px', padding: '0.2rem' }}
              value={newCatColor}
              onChange={(e) => setNewCatColor(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '40px', gap: '0.35rem' }}>
            <Plus size={16} /> Add Tag
          </button>
        </form>

        {/* Existing Categories List */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          {categories.map((cat) => (
            <div
              key={cat._id || cat.name}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
              }}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: cat.color || '#6366f1',
                }}
              />
              <span style={{ fontWeight: 600 }}>{cat.name}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({cat.type})</span>
              {!cat.isDefault && (
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  style={{ color: 'var(--color-expense)', padding: '0.1rem', cursor: 'pointer' }}
                  title="Delete Category"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Complete Data Backup */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <DownloadCloud size={18} color="var(--color-income)" /> Full Data Backup Export
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Download your complete transaction ledger in Excel format for external auditing or tax submission.
        </p>

        <button onClick={handleExportFullBackup} className="btn btn-secondary" style={{ gap: '0.5rem' }}>
          <DownloadCloud size={16} /> Export All Raw Data (.xlsx)
        </button>
      </div>
    </div>
  );
};

export default Settings;
