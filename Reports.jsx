import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MonthlyReportChart, CategoryPieChart } from '../components/Charts';
import Loader from '../components/Loader';
import { formatCurrency } from '../utils/formatters';
import { exportTransactionsToPDF } from '../utils/exportPdf';
import { exportTransactionsToExcel } from '../utils/exportExcel';
import {
  BarChart3,
  Calendar,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  PieChart as PieIcon,
} from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [categoryIncomes, setCategoryIncomes] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    fetchReports();
  }, [selectedYear]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [mRes, yRes, expPieRes, incPieRes] = await Promise.all([
        api.get(`/api/report/monthly?year=${selectedYear}`),
        api.get('/api/report/yearly'),
        api.get('/api/report/category-pie?type=expense'),
        api.get('/api/report/category-pie?type=income'),
      ]);

      if (mRes.data.success) {
        setMonthlyData(mRes.data.report || []);
        setSummary(mRes.data.summary || {});
      }
      if (yRes.data.success) {
        setYearlyData(yRes.data.report || []);
      }
      if (expPieRes.data.success) {
        setCategoryExpenses(expPieRes.data.categories || []);
      }
      if (incPieRes.data.success) {
        setCategoryIncomes(incPieRes.data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching analytics reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    // Generate synthetic transactions for report
    const reportRows = monthlyData.map((m) => ({
      date: new Date(selectedYear, m.monthIndex - 1, 1),
      title: `${m.month} Financial Summary`,
      category: `Savings: ${m.savingsRate}%`,
      paymentMethod: 'Monthly Ledger',
      type: m.savings >= 0 ? 'income' : 'expense',
      amount: Math.abs(m.savings),
    }));

    exportTransactionsToPDF({
      title: `${selectedYear} Annual Financial Report`,
      userName: user?.name,
      currency: user?.currency,
      transactions: reportRows,
      summary: {
        totalIncome: summary.totalIncome,
        totalExpense: summary.totalExpense,
        netSavings: summary.netSavings,
        savingsRate: summary.savingsRate,
      },
    });
  };

  const handleExportExcel = () => {
    const reportRows = monthlyData.map((m) => ({
      date: `${m.month} ${selectedYear}`,
      title: 'Monthly Summary',
      category: `Income: $${m.income} | Expense: $${m.expense}`,
      type: m.savings >= 0 ? 'SAVINGS' : 'DEFICIT',
      amount: m.savings,
      paymentMethod: `${m.savingsRate}% Rate`,
      description: `Incomes: ${m.incomeCount}, Expenses: ${m.expenseCount}`,
    }));

    exportTransactionsToExcel({
      fileName: `annual_financial_report_${selectedYear}`,
      transactions: reportRows,
      summary: {
        totalIncome: summary.totalIncome,
        totalExpense: summary.totalExpense,
        netSavings: summary.netSavings,
        savingsRate: summary.savingsRate,
      },
    });
  };

  if (loading) {
    return <Loader text="Generating detailed financial reports & charts..." fullPage />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header & Year Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem' }}>Financial Analytics & Reports</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Comprehensive yearly performance, spending patterns, and cash flow intelligence.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Year Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: 'var(--bg-surface)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Calendar size={16} color="var(--color-primary)" />
            <select
              style={{ fontWeight: 600, color: 'var(--text-main)' }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            >
              {[2024, 2025, 2026, 2027, 2028].map((yr) => (
                <option key={yr} value={yr}>
                  Year {yr}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleExportPDF} className="btn btn-sm btn-secondary" style={{ gap: '0.4rem' }}>
            <FileText size={15} color="#f43f5e" /> Export PDF
          </button>
          <button onClick={handleExportExcel} className="btn btn-sm btn-secondary" style={{ gap: '0.4rem' }}>
            <FileSpreadsheet size={15} color="#10b981" /> Export Excel
          </button>
        </div>
      </div>

      {/* Annual Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            {selectedYear} Total Income
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-heading)' }}>
            {formatCurrency(summary.totalIncome || 0, user?.currency || 'USD')}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #f43f5e' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            {selectedYear} Total Expenses
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f43f5e', fontFamily: 'var(--font-heading)' }}>
            {formatCurrency(summary.totalExpense || 0, user?.currency || 'USD')}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #6366f1' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            {selectedYear} Net Accumulated Savings
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366f1', fontFamily: 'var(--font-heading)' }}>
            {formatCurrency(summary.netSavings || 0, user?.currency || 'USD')}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #06b6d4' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            {selectedYear} Average Savings Rate
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#06b6d4', fontFamily: 'var(--font-heading)' }}>
            {summary.savingsRate || 0}%
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>
          Monthly Cashflow Comparison ({selectedYear})
        </h3>
        <MonthlyReportChart monthlyTrends={monthlyData} />
      </div>

      {/* Category Pie Charts (Expense & Income) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Expense by Category</h3>
          <CategoryPieChart categories={categoryExpenses} type="expense" />
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Income by Category</h3>
          <CategoryPieChart categories={categoryIncomes} type="income" />
        </div>
      </div>

      {/* Monthly Ledger Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Monthly Financial Breakdown</h3>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Income</th>
                <th>Total Expense</th>
                <th>Net Savings</th>
                <th>Savings Rate</th>
                <th>Activity</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((m) => (
                <tr key={m.month}>
                  <td style={{ fontWeight: 600 }}>{m.month}</td>
                  <td style={{ color: 'var(--color-income)', fontWeight: 600 }}>
                    {formatCurrency(m.income, user?.currency || 'USD')}
                  </td>
                  <td style={{ color: 'var(--color-expense)', fontWeight: 600 }}>
                    {formatCurrency(m.expense, user?.currency || 'USD')}
                  </td>
                  <td
                    style={{
                      color: m.savings >= 0 ? 'var(--color-income)' : 'var(--color-expense)',
                      fontWeight: 700,
                    }}
                  >
                    {formatCurrency(m.savings, user?.currency || 'USD')}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        m.savingsRate >= 20 ? 'badge-income' : 'badge-primary'
                      }`}
                    >
                      {m.savingsRate}%
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {m.incomeCount} In / {m.expenseCount} Out
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
