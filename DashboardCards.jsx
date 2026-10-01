import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const DashboardCards = ({ stats = {}, currency = 'USD' }) => {
  const {
    totalBalance = 0,
    totalIncome = 0,
    totalExpense = 0,
    savings = 0,
    savingsRate = 0,
    incomeCount = 0,
    expenseCount = 0,
  } = stats;

  const cards = [
    {
      label: 'Net Balance',
      value: formatCurrency(totalBalance, currency),
      subtext: totalBalance >= 0 ? 'Healthy Financial Standing' : 'Negative Deficit Warning',
      icon: Wallet,
      color: '#6366f1',
      bgLight: 'rgba(99, 102, 241, 0.15)',
      trendIcon: totalBalance >= 0 ? ArrowUpRight : ArrowDownRight,
      trendColor: totalBalance >= 0 ? '#10b981' : '#f43f5e',
    },
    {
      label: 'Total Income',
      value: formatCurrency(totalIncome, currency),
      subtext: `${incomeCount} recorded earnings`,
      icon: TrendingUp,
      color: '#10b981',
      bgLight: 'rgba(16, 185, 129, 0.15)',
      trendIcon: ArrowUpRight,
      trendColor: '#10b981',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(totalExpense, currency),
      subtext: `${expenseCount} tracked outflows`,
      icon: TrendingDown,
      color: '#f43f5e',
      bgLight: 'rgba(244, 63, 94, 0.15)',
      trendIcon: ArrowDownRight,
      trendColor: '#f43f5e',
    },
    {
      label: 'Total Savings',
      value: formatCurrency(savings, currency),
      subtext: `${savingsRate}% savings rate`,
      icon: PiggyBank,
      color: '#06b6d4',
      bgLight: 'rgba(6, 182, 212, 0.15)',
      trendIcon: Percent,
      trendColor: '#06b6d4',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;
        return (
          <div
            key={index}
            className="glass-panel stat-card glass-panel-hover"
            style={{
              borderLeft: `4px solid ${card.color}`,
            }}
          >
            <div className="stat-info">
              <span className="stat-label">{card.label}</span>
              <span className="stat-value" style={{ color: card.color }}>
                {card.value}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
                <TrendIcon size={14} color={card.trendColor} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {card.subtext}
                </span>
              </div>
            </div>

            <div
              className="stat-icon-wrapper"
              style={{
                background: card.bgLight,
                color: card.color,
                boxShadow: `0 4px 12px ${card.bgLight}`,
              }}
            >
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
