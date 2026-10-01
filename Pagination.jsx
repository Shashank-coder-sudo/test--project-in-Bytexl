import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange, totalRecords = 0 }) => {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '1.5rem',
        padding: '0.75rem 0',
      }}
    >
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Showing page {currentPage} of {totalPages} ({totalRecords} total entries)
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-sm btn-secondary"
          style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
          .map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`btn btn-sm ${currentPage === pageNumber ? 'btn-primary' : 'btn-secondary'}`}
              style={{ minWidth: '34px', padding: '0.45rem' }}
            >
              {pageNumber}
            </button>
          ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-sm btn-secondary"
          style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
