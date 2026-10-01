import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ showLabel = true }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1rem',
      }}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {theme === 'dark' ? (
        <Sun size={18} color="#f59e0b" />
      ) : (
        <Moon size={18} color="#6366f1" />
      )}
      {showLabel && (
        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
      )}
    </button>
  );
};

export default ThemeToggle;
