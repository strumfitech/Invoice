import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import storage from '../services/storage.js';
import InvoiceList from './InvoiceList.jsx';

export default function Home(){
  const { user } = useAuth();
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

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #ecfeff 100%)',
        padding: '5rem 0'
      }}>
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-4">
              Gestionați facturile cu ușurință
            </h1>
            <p className="lead text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Platforma completă pentru generarea, gestionarea și urmărirea facturilor
            </p>
          </div>

          {/* Quick Actions */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <Link to="/new" className="dashboard-card text-decoration-none">
                <div className="dashboard-card-icon">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="h5 fw-semibold mb-2">Factură Nouă</h3>
                <p className="text-muted small">Creați o factură nouă în câteva minute</p>
              </Link>
            </div>

            <div className="col-md-4">
              <Link to="/companies" className="dashboard-card text-decoration-none">
                <div className="dashboard-card-icon">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="h5 fw-semibold mb-2">Companie</h3>
                <p className="text-muted small">Configurați datele companiei</p>
              </Link>
            </div>

            <div className="col-md-4">
              <Link to="/clients" className="dashboard-card text-decoration-none">
                <div className="dashboard-card-icon">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="h5 fw-semibold mb-2">Clienți</h3>
                <p className="text-muted small">Gestionați baza de date cu clienți</p>
              </Link>
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="text-center mb-5">
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/templates" className="btn btn-outline-primary">
                <svg className="me-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Template-uri
              </Link>
              <Link to="/analytics" className="btn btn-outline-primary">
                <svg className="me-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </Link>
              <Link to="/reminders" className="btn btn-outline-primary">
                <svg className="me-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mementouri
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container py-5">
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <div className="display-4 fw-bold text-primary mb-2">{stats.totalInvoices}</div>
                <div className="text-muted">Total Facturi</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <div className="display-6 fw-bold text-success mb-2">{stats.totalRevenue.toFixed(2)} RON</div>
                <div className="text-muted">Venituri Totale</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <div className="display-6 fw-bold text-warning mb-2">{stats.pendingInvoices}</div>
                <div className="text-muted">Facturi Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h3 className="card-title h4 mb-4">Facturi Recente</h3>
            <InvoiceList />
          </div>
        </div>
      </div>
    </div>
  );
}
