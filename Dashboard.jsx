import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardCards from '../components/DashboardCards';
import { MonthlyReportChart, CategoryPieChart } from '../components/Charts';
import TransactionTable from '../components/TransactionTable';
import Modal from '../components/Modal';
import IncomeForm from '../components/IncomeForm';
import ExpenseForm from '../components/ExpenseForm';
import Loader from '../components/Loader';
import { PlusCircle, TrendingUp, TrendingDown, ArrowRight, BarChart3, Wallet } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {},
    monthlyTrends: [],
    categoryBreakdown: [],
    recentTransactions: [],
  });
  const [categories, setCategories] = useState([]);

  // Modals state
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchCategories();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleAddIncome = async (formData) => {
    try {
      setFormLoading(true);
      await api.post('/api/income', formData);
      setShowIncomeModal(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add income');
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddExpense = async (formData) => {
    try {
      setFormLoading(true);
      await api.post('/api/expense', formData);
      setShowExpenseModal(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading your financial dashboard..." fullPage />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', letterSpacing: '-0.02em' }}>
            Hello, {user?.name?.split(' ')[0] || 'User'} 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Here is your live financial snapshot and cashflow performance.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowIncomeModal(true)}
            className="btn btn-income"
            style={{ gap: '0.45rem' }}
          >
            <PlusCircle size={17} />
            Quick Add Income
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="btn btn-expense"
            style={{ gap: '0.45rem' }}
          >
            <PlusCircle size={17} />
            Quick Add Expense
          </button>
        </div>
      </div>

      {/* Dashboard KPI Metric Cards */}
      <DashboardCards stats={data.stats} currency={user?.currency || 'USD'} />

      {/* Visual Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* Monthly Trend Bar Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Income vs Expense Trend</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>6-Month cashflow trajectory</span>
            </div>
            <Link to="/reports" className="btn btn-sm btn-secondary" style={{ gap: '0.35rem' }}>
              <BarChart3 size={14} /> Full Analytics
            </Link>
          </div>
          <MonthlyReportChart monthlyTrends={data.monthlyTrends || []} />
        </div>

        {/* Category Breakdown Doughnut Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Expenses by Category</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top spending distributions</span>
            </div>
            <Link to="/expenses" className="btn btn-sm btn-secondary" style={{ gap: '0.35rem' }}>
              Manage
            </Link>
          </div>
          <CategoryPieChart categories={data.categoryBreakdown || []} type="expense" />
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Recent Transactions</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest 8 income and expense logs</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/income" className="btn btn-sm btn-secondary">
              All Incomes <ArrowRight size={13} />
            </Link>
            <Link to="/expenses" className="btn btn-sm btn-secondary">
              All Expenses <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <TransactionTable
          transactions={data.recentTransactions || []}
          currency={user?.currency || 'USD'}
          showTypeBadge={true}
        />
      </div>

      {/* Quick Add Income Modal */}
      <Modal
        isOpen={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        title="Add New Income Stream"
      >
        <IncomeForm
          categories={categories}
          onSubmit={handleAddIncome}
          onCancel={() => setShowIncomeModal(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Quick Add Expense Modal */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Log New Expense"
      >
        <ExpenseForm
          categories={categories}
          onSubmit={handleAddExpense}
          onCancel={() => setShowExpenseModal(false)}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
