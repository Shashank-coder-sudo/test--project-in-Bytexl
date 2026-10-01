import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '1.25rem',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'var(--color-expense-light)',
          color: 'var(--color-expense)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AlertTriangle size={36} />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
        404
      </h1>
      <h3 style={{ fontSize: '1.4rem' }}>Page Not Found</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', fontSize: '0.92rem' }}>
        The page you are looking for does not exist or has been moved. Return to the dashboard to continue tracking your expenses.
      </p>

      <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '0.5rem', gap: '0.5rem' }}>
        <Home size={18} /> Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
