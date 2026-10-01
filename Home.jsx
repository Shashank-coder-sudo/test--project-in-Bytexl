import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  PieChart,
  Download,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: TrendingUp,
      title: 'Income & Expense Tracking',
      description:
        'Log transactions with customized categories, payment channels, and memos in milliseconds.',
      color: '#10b981',
    },
    {
      icon: PieChart,
      title: 'Intelligent Visual Analytics',
      description:
        'Interactive Chart.js breakdowns of monthly spending trends, category distributions, and net savings.',
      color: '#6366f1',
    },
    {
      icon: Download,
      title: 'One-Click PDF & Excel Export',
      description:
        'Generate structured financial statements, export formatted spreadsheets for taxes and audits.',
      color: '#f59e0b',
    },
    {
      icon: ShieldCheck,
      title: 'Bank-Grade Security',
      description:
        'JWT token protection with salted bcrypt encryption and user-isolated MongoDB architecture.',
      color: '#06b6d4',
    },
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="glow-bg" />

      {/* Hero Section */}
      <section
        style={{
          padding: '4rem 1.5rem 3rem',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <div
          className="badge badge-primary"
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', gap: '0.5rem' }}
        >
          <Zap size={15} /> All-in-One Modern MERN Financial Platform
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            maxWidth: '850px',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
          }}
        >
          Take Full Command of Your Money with Smart Insights
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            lineHeight: 1.6,
          }}
        >
          Effortlessly monitor income streams, curb unwanted expenses, analyze category breakdowns, and export tax-ready reports in seconds.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              Launch Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                Start Free Today <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                Sign In to Account
              </Link>
            </>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            width: '100%',
            marginTop: '3.5rem',
            textAlign: 'left',
          }}
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-panel glass-panel-hover" style={{ padding: '1.75rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: `${f.color}20`,
                    color: f.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
