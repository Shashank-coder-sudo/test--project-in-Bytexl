import React from 'react';
import { Heart, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.5rem 2rem',
        marginTop: 'auto',
        background: 'var(--bg-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span>Expensify Tracker &copy; {new Date().getFullYear()}</span>
        <span>• Modern Financial Management</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Shield size={14} color="#10b981" /> 256-bit Encrypted Ledger
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          Built with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> for Smart Finance
        </span>
      </div>
    </footer>
  );
};

export default Footer;
