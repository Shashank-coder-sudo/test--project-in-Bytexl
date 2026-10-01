import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  BarChart3,
  User,
  Settings,
  ShieldCheck,
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Income Hub', path: '/income', icon: TrendingUp },
    { name: 'Expense Hub', path: '/expenses', icon: TrendingDown },
    { name: 'Analytics & Reports', path: '/reports', icon: BarChart3 },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'App Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        width: '260px',
        minHeight: 'calc(100vh - 70px)',
        borderRight: '1px solid var(--border-color)',
        borderRadius: 0,
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <div style={{ padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Main Workspace
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`
              }
              style={{
                justifyContent: 'flex-start',
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                border: '1px solid transparent',
              }}
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </div>

      {/* Security Badge Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-primary-light)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
          <ShieldCheck size={18} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Bank-Grade Security</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          JWT Authenticated & End-to-End Encrypted Financial Ledger.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
