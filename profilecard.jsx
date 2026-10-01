import React from 'react';
import { User, Mail, DollarSign, Calendar, ShieldCheck } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const ProfileCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
          }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        {/* User Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)' }}>{user.name}</h3>
            <span className="badge badge-primary" style={{ gap: '0.25rem' }}>
              <ShieldCheck size={12} /> Verified
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <Mail size={14} /> {user.email}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <DollarSign size={13} /> Base Currency: {user.currency || 'USD'}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={13} /> Member Since: {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
