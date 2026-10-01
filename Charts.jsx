import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import { categoryColors } from '../utils/formatters';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Common Chart Options
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8',
        font: { family: 'Inter', size: 12 },
      },
    },
    tooltip: {
      backgroundColor: '#111726',
      titleColor: '#f8fafc',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 10,
      boxPadding: 4,
      usePointStyle: true,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
    },
  },
};

// 1. Expense Chart (Line / Area)
export const ExpenseChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map((item) => item.month || item.date || 'Period'),
    datasets: [
      {
        label: 'Monthly Expense ($)',
        data: data.map((item) => item.expense || item.amount || 0),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.18)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#f43f5e',
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div style={{ height: '280px', width: '100%' }}>
      <Line data={chartData} options={baseOptions} />
    </div>
  );
};

// 2. Income Chart (Line / Area)
export const IncomeChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map((item) => item.month || item.date || 'Period'),
    datasets: [
      {
        label: 'Monthly Income ($)',
        data: data.map((item) => item.income || item.amount || 0),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.18)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#10b981',
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div style={{ height: '280px', width: '100%' }}>
      <Line data={chartData} options={baseOptions} />
    </div>
  );
};

// 3. Monthly Report (Grouped Bar: Income vs Expense)
export const MonthlyReportChart = ({ monthlyTrends = [] }) => {
  const chartData = {
    labels: monthlyTrends.map((t) => t.month),
    datasets: [
      {
        label: 'Income ($)',
        data: monthlyTrends.map((t) => t.income),
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 6,
      },
      {
        label: 'Expense ($)',
        data: monthlyTrends.map((t) => t.expense),
        backgroundColor: 'rgba(244, 63, 94, 0.85)',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div style={{ height: '320px', width: '100%' }}>
      <Bar data={chartData} options={baseOptions} />
    </div>
  );
};

// 4. Category Pie / Doughnut Chart
export const CategoryPieChart = ({ categories = [], type = 'expense' }) => {
  if (categories.length === 0) {
    return (
      <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No category data available for chart.
      </div>
    );
  }

  const defaultPalette = ['#ef4444', '#f59e0b', '#ec4899', '#6366f1', '#a855f7', '#14b8a6', '#3b82f6', '#10b981', '#06b6d4'];

  const chartData = {
    labels: categories.map((c) => c.category || c.name),
    datasets: [
      {
        data: categories.map((c) => c.total || c.amount || 0),
        backgroundColor: categories.map(
          (c, idx) => categoryColors[c.category || c.name] || defaultPalette[idx % defaultPalette.length]
        ),
        borderWidth: 2,
        borderColor: 'rgba(17, 23, 38, 0.8)',
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          boxWidth: 12,
          font: { family: 'Inter', size: 11 },
        },
      },
      tooltip: {
        backgroundColor: '#111726',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    cutout: '68%',
  };

  return (
    <div style={{ height: '280px', width: '100%' }}>
      <Doughnut data={chartData} options={pieOptions} />
    </div>
  );
};
