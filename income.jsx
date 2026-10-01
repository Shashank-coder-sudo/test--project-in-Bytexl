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
import IncomeForm from '../components/IncomeForm';
import Loader from '../components/Loader';
import { PlusCircle, FileText, FileSpreadsheet, TrendingUp, DollarSign } from 'lucide-react';

const Income = () => {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
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
  const [editingIncome, setEditingIncome] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchIncomes();
  }, [debouncedSearch, filterState]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchIncomes = async () => {
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

      const res = await api.get('/api/income', { params });
      if (res.data.success) {
        setIncomes(res.data.incomes.map((i) => ({ ...i, type: 'income' })));
        setTotalAmount(res.data.totalAmount || 0);
        setTotalPages(res.data.totalPages || 1);
        setTotalRecords(res.data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching incomes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      if (res.data.success) {
        setCategories(res.data.categories.filter((c) => c.type === 'income'));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSaveIncome = async (formData) => {
    try {
      setFormLoading(true);
      if (editingIncome) {
        await api.put(`/api/income/${editingIncome._id}`, formData);
      } else {
        await api.post('/api/income', formData);
      }
      setShowModal(false);
      setEditingIncome(null);
      fetchIncomes();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save income transaction');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteIncome = async (id) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await api.delete(`/api/income/${id}`);
        fetchIncomes();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete income record');
      }
    }
  };

  const handleExportPDF = () => {
    exportTransactionsToPDF({
      title: 'Income Statement Ledger',
      userName: user?.name,
      currency: user?.currency,
      transactions: incomes,
      summary: { totalIncome: totalAmount, totalExpense: 0, netSavings: totalAmount },
    });
  };

  const handleExportExcel = () => {
    exportTransactionsToExcel({
      fileName: 'income_ledger',
      transactions: incomes,
      summary: { totalIncome: totalAmount },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header & Export Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem' }}>Income Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Track salaries, freelance revenues, dividends, and cash inflows.
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
              setEditingIncome(null);
              setShowModal(true);
            }}
            className="btn btn-income"
            style={{ gap: '0.45rem' }}
          >
            <PlusCircle size={17} /> Add Income
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
          borderLeft: '4px solid var(--color-income)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-income-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-income)',
            }}
          >
            <TrendingUp size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Filtered Income Volume
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-income)', fontFamily: 'var(--font-heading)' }}>
              {formatCurrency(totalAmount, user?.currency || 'USD')}
            </div>
          </div>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by income source or notes..."
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
        <Loader text="Loading income records..." />
      ) : (
        <>
          <TransactionTable
            transactions={incomes}
            currency={user?.currency || 'USD'}
            onEdit={(item) => {
              setEditingIncome(item);
              setShowModal(true);
            }}
            onDelete={handleDeleteIncome}
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

      {/* Add / Edit Income Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingIncome(null);
        }}
        title={editingIncome ? 'Edit Income Entry' : 'Log New Income Stream'}
      >
        <IncomeForm
          initialData={editingIncome}
          categories={categories}
          onSubmit={handleSaveIncome}
          onCancel={() => {
            setShowModal(false);
            setEditingIncome(null);
          }}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Income;
