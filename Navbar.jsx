import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Wallet,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings as SettingsIcon,
  Menu,
  X,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Income', path: '/income', icon: TrendingUp },
    { name: 'Expenses', path: '/expenses', icon: TrendingDown },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
  ];

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: 0,
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 0
    }}>
      {/* Brand Logo */}
      <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
        }}>
          <Wallet color="#ffffff" size={22} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, var(--text-main), #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Expensify
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '-4px', fontWeight: 600 }}>
            FINANCIAL INTELLIGENCE
          </span>
        </div>
      </Link>

      {/* Desktop Navigation Links */}
      {isAuthenticated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="desktop-links">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="btn btn-sm"
                style={{
                  color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--color-primary-light)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent',
                  gap: '0.45rem',
                }}
              >
                <Icon size={16} />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          style={{ width: '38px', height: '38px' }}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {user?.name?.split(' ')[0] || 'Account'}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn-sm btn-secondary"
              title="Logout"
              style={{ padding: '0.5rem 0.75rem', color: 'var(--color-expense)' }}
            >
              <LogOut size={16} />
              <span className="logout-text">Logout</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Link to="/login" className="btn btn-sm btn-secondary">
              Login
            </Link>
            <Link to="/register" className="btn btn-sm btn-primary">
              Get Started
            </Link>
          </div>
        )}

        {/* Mobile Menu Hamburger */}
        {isAuthenticated && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-icon mobile-menu-btn"
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
      </div>

      {/* Mobile Drawer */}
      {isAuthenticated && mobileMenuOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            borderTop: '1px solid var(--border-color)',
            borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
            zIndex: 99,
          }}
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', width: '100%' }}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', width: '100%' }}
          >
            <UserIcon size={18} />
            My Profile
          </Link>
          <Link
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', width: '100%' }}
          >
            <SettingsIcon size={18} />
            Settings
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
