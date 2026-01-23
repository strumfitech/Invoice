import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import storage from '../services/storage.js';
import InvoiceList from './InvoiceList.jsx';

export default function Home() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
    recentInvoices: []
  });

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
    try {
      const invoices = await storage.getInvoices(user.uid);
      const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
      const pendingInvoices = invoices.filter(inv => {
        const dueDate = new Date(inv.dueDate);
        const today = new Date();
        return dueDate > today;
      }).length;

      setStats({
        totalInvoices: invoices.length,
        totalRevenue,
        pendingInvoices,
        recentInvoices: invoices.slice(0, 5)
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const MockChart = ({ color }) => (
    <div className="chart-glow">
      <svg className="chart-svg" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ stroke: color, filter: `drop-shadow(0 0 5px ${color})` }}>
        <path d="M0,35 Q15,30 25,15 T45,10 T65,30 T85,5 T100,20" />
      </svg>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="row pt-2 mb-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="fw-bold mb-0">{t('dashboard.title')}</h1>
            <p className="text-dimmed small mb-0 font-monospace" style={{ letterSpacing: '2px' }}>QUANTUM CORE v3.0</p>
          </div>
          <div className="glass-card px-3 py-2 d-none d-md-flex align-items-center gap-2">
            <span className="text-dimmed small">Encrypted Session</span>
            <span className="small fw-bold text-success">●</span>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Top Stats - Large Cards with Charts */}
        <div className="col-lg-6 col-xl-4">
          <div className="glass-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <div className="text-dimmed small mb-1">{t('stats.total_revenue')}</div>
                <div className="stat-glow h2 mb-0">{stats.totalRevenue.toFixed(2)} <span className="h6">RON</span></div>
              </div>
              <span className="btn-neon p-2" style={{ borderRadius: '12px' }}>💰</span>
            </div>
            <MockChart color="var(--accent-secondary)" />
          </div>
        </div>

        <div className="col-lg-6 col-xl-4">
          <div className="glass-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <div className="text-dimmed small mb-1">{t('stats.active_invoices')}</div>
                <div className="stat-glow h2 mb-0">{stats.pendingInvoices}</div>
              </div>
              <span className="btn-neon p-2" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>⏳</span>
            </div>
            <MockChart color="#f59e0b" />
          </div>
        </div>

        <div className="col-lg-12 col-xl-4">
          <div className="glass-card p-4 h-100 d-flex flex-column justify-content-center">
            <div className="d-flex justify-content-between align-items-end mb-2">
              <div className="text-dimmed small">{t('stats.total_invoices')}</div>
              <div className="fw-bold">{stats.totalInvoices}</div>
            </div>
            <div className="progress glass-card" style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
              <div className="progress-bar" style={{ width: '75%', background: 'var(--accent-gradient)', borderRadius: '10px', boxShadow: '0 0 10px var(--accent-primary)' }}></div>
            </div>
            <p className="small text-dimmed mt-2 mb-0 text-center">75% din cota lunară utilizată</p>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        {/* Main Content Area - Recent Transactions */}
        <div className="col-lg-8">
          <div className="glass-card h-100 overflow-hidden">
            <div className="p-4 border-bottom" style={{ borderColor: 'var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="h5 fw-bold mb-0">Ultimile Tranzacții</h3>
                <Link to="/invoices" className="small text-decoration-none" style={{ color: 'var(--accent-secondary)' }}>Vezi Tot Istoricul</Link>
              </div>
            </div>
            <div className="p-4">
              <InvoiceList />
            </div>
          </div>
        </div>

        {/* Sidebar Actions Area */}
        <div className="col-lg-4">
          <div className="glass-card p-4 h-100">
            <h3 className="h5 fw-bold mb-4">Panou Acțiuni</h3>
            <div className="row g-3">
              <div className="col-12">
                <Link to="/new" className="btn-neon w-100 p-4 text-decoration-none d-block text-center rounded-4 shadow-lg">
                  <div className="h3 mb-2">📥</div>
                  <div className="fw-bold h5 mb-0">{t('dashboard.new_invoice')}</div>
                  <p className="small mb-0 opacity-75">Creează document nou în câteva secunde</p>
                </Link>
              </div>
              <div className="col-6">
                <Link to="/clients" className="glass-card w-100 p-3 text-decoration-none d-block text-center border-0" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="h4 mb-1">🏢</div>
                  <div className="small fw-bold">{t('dashboard.clients')}</div>
                </Link>
              </div>
              <div className="col-6">
                <Link to="/analytics" className="glass-card w-100 p-3 text-decoration-none d-block text-center border-0" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="h4 mb-1">📈</div>
                  <div className="small fw-bold">{t('dashboard.analytics')}</div>
                </Link>
              </div>
              <div className="col-12 mt-4">
                <div className="p-3 rounded-4" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' }}>
                  <p className="small text-dimmed mb-3">Configurare Rapidă</p>
                  <div className="d-flex flex-wrap gap-2">
                    <Link to="/companies" className="btn glass-card btn-sm px-3 py-2 small border-0" style={{ background: 'rgba(255,255,255,0.05)' }}>🔧 Companii</Link>
                    <Link to="/templates" className="btn glass-card btn-sm px-3 py-2 small border-0" style={{ background: 'rgba(255,255,255,0.05)' }}>🎨 Design</Link>
                    <Link to="/reminders" className="btn glass-card btn-sm px-3 py-2 small border-0" style={{ background: 'rgba(255,255,255,0.05)' }}>🔔 Alerte</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
