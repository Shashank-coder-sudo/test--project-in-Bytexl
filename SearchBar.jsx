import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value = '', onChange, placeholder = 'Search transactions by title or memo...' }) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '420px',
      }}
    >
      <Search
        size={18}
        color="var(--text-muted)"
        style={{ position: 'absolute', left: '1rem', pointerEvents: 'none' }}
      />
      <input
        type="text"
        className="form-input"
        style={{
          paddingLeft: '2.75rem',
          paddingRight: value ? '2.5rem' : '1rem',
          borderRadius: 'var(--radius-md)',
          height: '42px',
        }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="btn-icon"
          style={{
            position: 'absolute',
            right: '0.5rem',
            padding: '0.25rem',
            background: 'transparent',
            border: 'none',
          }}
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
