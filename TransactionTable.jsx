import React from 'react';
import { Edit2, Trash2, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';

const TransactionTable = ({
  transactions = [],
  onEdit,
  onDelete,
  currency = 'USD',
  showTypeBadge = true,
}) => {
  if (transactions.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <Tag size={42} strokeWidth={1.5} color="var(--text-muted)" />
        <h4 style={{ color: 'var(--text-main)' }}>No Transactions Found</h4>
        <p style={{ fontSize: '0.85rem' }}>
          No records match your active search or filter criteria. Add a new transaction above.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title / Memo</th>
            <th>Category</th>
            <th>Payment Method</th>
            {showTypeBadge && <th>Type</th>}
            <th>Amount</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isIncome = tx.type === 'income' || tx.paymentMethod === 'Bank Transfer' && !tx.type;
            const itemColor = isIncome ? 'var(--color-income)' : 'var(--color-expense)';
            const categoryBg = getCategoryColor(tx.category);

            return (
              <tr key={tx._id}>
                <td style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                  {formatDate(tx.date)}
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{tx.title}</span>
                    {tx.description && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {tx.description}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: `${categoryBg}20`,
                      color: categoryBg,
                      border: `1px solid ${categoryBg}40`,
                    }}
                  >
                    {tx.category || 'General'}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {tx.paymentMethod || 'Credit Card'}
                </td>
                {showTypeBadge && (
                  <td>
                    <span
                      className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}
                    >
                      {isIncome ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {isIncome ? 'INCOME' : 'EXPENSE'}
                    </span>
                  </td>
                )}
                <td>
                  <span
                    style={{
                      fontWeight: 700,
                      color: itemColor,
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1rem',
                    }}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(tx)}
                        className="btn-icon"
                        title="Edit Transaction"
                      >
                        <Edit2 size={15} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(tx._id)}
                        className="btn-icon"
                        title="Delete Transaction"
                        style={{ color: 'var(--color-expense)' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
