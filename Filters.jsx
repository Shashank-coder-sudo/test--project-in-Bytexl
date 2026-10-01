import React, { useState } from 'react';
import { Filter, RotateCcw, Calendar, DollarSign, SlidersHorizontal } from 'lucide-react';

const Filters = ({
  categories = [],
  filterState = {},
  onFilterChange,
  onReset,
  showAmountFilter = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    category = 'All',
    startDate = '',
    endDate = '',
    minAmount = '',
    maxAmount = '',
    sortBy = 'date',
    order = 'desc',
  } = filterState;

  const handleChange = (key, value) => {
    onFilterChange({ ...filterState, [key]: value });
  };

  const hasActiveFilters =
    category !== 'All' || startDate || endDate || minAmount || maxAmount || sortBy !== 'date' || order !== 'desc';

  return (
    <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Filter size={18} color="var(--color-primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Filter & Sort Options</span>
          {hasActiveFilters && (
            <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
              Active
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="btn btn-sm btn-secondary"
              style={{ gap: '0.35rem', color: 'var(--color-expense)' }}
            >
              <RotateCcw size={14} />
              Reset Filters
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-sm btn-secondary"
            style={{ gap: '0.35rem' }}
          >
            <SlidersHorizontal size={14} />
            {isOpen ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
          }}
        >
          {/* Category Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Category</label>
            <select
              className="form-select"
              style={{ height: '38px', padding: '0.4rem 0.75rem' }}
              value={category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c._id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>From Date</label>
            <input
              type="date"
              className="form-input"
              style={{ height: '38px', padding: '0.4rem 0.75rem' }}
              value={startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>To Date</label>
            <input
              type="date"
              className="form-input"
              style={{ height: '38px', padding: '0.4rem 0.75rem' }}
              value={endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
            />
          </div>

          {/* Min Amount */}
          {showAmountFilter && (
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Min Amount ($)</label>
              <input
                type="number"
                placeholder="0.00"
                className="form-input"
                style={{ height: '38px', padding: '0.4rem 0.75rem' }}
                value={minAmount}
                onChange={(e) => handleChange('minAmount', e.target.value)}
              />
            </div>
          )}

          {/* Max Amount */}
          {showAmountFilter && (
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Max Amount ($)</label>
              <input
                type="number"
                placeholder="10000.00"
                className="form-input"
                style={{ height: '38px', padding: '0.4rem 0.75rem' }}
                value={maxAmount}
                onChange={(e) => handleChange('maxAmount', e.target.value)}
              />
            </div>
          )}

          {/* Sort By */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Sort By</label>
            <select
              className="form-select"
              style={{ height: '38px', padding: '0.4rem 0.75rem' }}
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [newSort, newOrder] = e.target.value.split('-');
                onFilterChange({ ...filterState, sortBy: newSort, order: newOrder });
              }}
            >
              <option value="date-desc">Newest Date First</option>
              <option value="date-asc">Oldest Date First</option>
              <option value="amount-desc">Highest Amount First</option>
              <option value="amount-asc">Lowest Amount First</option>
              <option value="title-asc">Title (A - Z)</option>
              <option value="title-desc">Title (Z - A)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
