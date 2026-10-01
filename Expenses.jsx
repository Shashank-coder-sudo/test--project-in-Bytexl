import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency } from '../utils/formatters';
import { exportTransactionsToPDF } from '../utils/exportPdf';
import { exportTransactionsToExcel } from '../utils/exportExcel';
import TransactionTable from '../components/TransactionTable';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';
import Loader from '../components/Loader';
import { PlusCircle, FileText, FileSpreadsheet, TrendingDown, Receipt } from 'lucide-react';

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  const [filterState, setFilterState] = useState({
    category: 'All',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    page: 1,
    limit: 10,
    sortBy: 'date',
    order: 'desc',
  });

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [debouncedSearch, filterState]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = {
        search: debouncedSearch,
        category: filterState.category,
        startDate: filterState.startDate,
        endDate: filterState.endDate,
        minAmount: filterState.minAmount,
        maxAmount: filterState.maxAmount,
        page: filterState.page,
        limit: filterState.limit,
        sortBy: filterState.sortBy,
        order: filterState.order,
      };

      const res = await api.get('/api/expense', { params });
      if (res.data.success) {
        setExpenses(res.data.expenses.map((e) => ({ ...e, type: 'expense' })));
        setTotalAmount(res.data.totalAmount || 0);
        setTotalPages(res.data.totalPages || 1);
        setTotalRecords(res.data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      if (res.data.success) {
        setCategories(res.data.categories.filter((c) => c.type === 'expense'));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSaveExpense = async (formData) => {
    try {
      setFormLoading(true);
      if (editingExpense) {
        await api.put(`/api/expense/${editingExpense._id}`, formData);
      } else {
        await api.post('/api/expense', formData);
      }
      setShowModal(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save expense transaction');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        await api.delete(`/api/expense/${id}`);
        fetchExpenses();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete expense record');
      }
    }
  };

  const handleExportPDF = () => {
    exportTransactionsToPDF({
      title: 'Expense Statement Ledger',
      userName: user?.name,
      currency: user?.currency,
      transactions: expenses,
      summary: { totalIncome: 0, totalExpense: totalAmount, netSavings: -totalAmount },
    });
  };

  const handleExportExcel = () => {
    exportTransactionsToExcel({
      fileName: 'expense_ledger',
      transactions: expenses,
      summary: { totalExpense: totalAmount },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header & Export Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem' }}>Expense Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Monitor bills, shopping, subscriptions, food, and daily outlays.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button onClick={handleExportPDF} className="btn btn-sm btn-secondary" style={{ gap: '0.4rem' }}>
            <FileText size={15} color="#f43f5e" /> PDF Export
          </button>
          <button onClick={handleExportExcel} className="btn btn-sm btn-secondary" style={{ gap: '0.4rem' }}>
            <FileSpreadsheet size={15} color="#10b981" /> Excel Export
          </button>
          <button
            onClick={() => {
              setEditingExpense(null);
              setShowModal(true);
            }}
            className="btn btn-expense"
            style={{ gap: '0.45rem' }}
          >
            <PlusCircle size={17} /> Add Expense
          </button>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderLeft: '4px solid var(--color-expense)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-expense-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-expense)',
            }}
          >
            <TrendingDown size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Filtered Expense Total
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-expense)', fontFamily: 'var(--font-heading)' }}>
              {formatCurrency(totalAmount, user?.currency || 'USD')}
            </div>
          </div>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by merchant, title or notes..."
        />
      </div>

      {/* Filters Component */}
      <Filters
        categories={categories}
        filterState={filterState}
        onFilterChange={setFilterState}
        onReset={() =>
          setFilterState({
            category: 'All',
            startDate: '',
            endDate: '',
            minAmount: '',
            maxAmount: '',
            page: 1,
            limit: 10,
            sortBy: 'date',
            order: 'desc',
          })
        }
      />

      {/* Transactions Table & Pagination */}
      {loading ? (
        <Loader text="Loading expense records..." />
      ) : (
        <>
          <TransactionTable
            transactions={expenses}
            currency={user?.currency || 'USD'}
            onEdit={(item) => {
              setEditingExpense(item);
              setShowModal(true);
            }}
            onDelete={handleDeleteExpense}
            showTypeBadge={false}
          />

          <Pagination
            currentPage={filterState.page}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={(p) => setFilterState({ ...filterState, page: p })}
          />
        </>
      )}

      {/* Add / Edit Expense Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? 'Edit Expense Entry' : 'Log New Outlay / Expense'}
      >
        <ExpenseForm
          initialData={editingExpense}
          categories={categories}
          onSubmit={handleSaveExpense}
          onCancel={() => {
            setShowModal(false);
            setEditingExpense(null);
          }}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Expenses;
