import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext.jsx';
import { ThemeProvider, useTheme } from './components/ThemeContext.jsx';
import { useTranslation } from 'react-i18next';
import Sidebar from './components/Sidebar.jsx';
import Landing from './components/Landing.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import CompanyConfig from './components/CompanyConfig.jsx';
import ClientConfig from './components/ClientConfig.jsx';
import Analytics from './components/Analytics.jsx';
import Templates from './components/Templates.jsx';
import PasswordReset from './components/PasswordReset.jsx';
import Reminders from './components/Reminders.jsx';
import NewInvoicePage from './pages/NewInvoicePage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import InvoicePreview from './components/InvoicePreview.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-5 text-center"><div className="stat-glow">Loading...</div></div>;
  return user ? children : <Navigate to="/" replace />;
}


function AppContent() {
  const { user, loading, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  if (loading) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="glass-card p-5 text-center">
        <div className="spinner-border text-primary mb-3"></div>
        <div className="stat-glow h4">Quantum Loading...</div>
      </div>
    </div>
  );

  return (
    <div className="d-flex flex-column flex-md-row">
      {user && (
        <div className="d-md-none p-3 px-4 d-flex justify-content-between align-items-center sticky-top glass-card mx-3 mt-3"
          style={{ zIndex: 1100, borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
          <div className="d-flex align-items-center gap-2">
            <div className="btn-neon p-1 rounded-circle" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>i</div>
            <span className="fw-bold small">{user.email?.split('@')[0]}</span>
          </div>
          <div className="d-flex gap-2 gap-sm-3 align-items-center">
            <button onClick={() => i18n.changeLanguage(i18n.language === 'ro' ? 'en' : 'ro')} className="btn btn-link p-0 text-decoration-none" style={{ fontSize: '1.2rem' }}>
              {i18n.language === 'ro' ? '🇺🇸' : '🇷🇴'}
            </button>
            <button onClick={toggleTheme} className="btn btn-link p-0 text-decoration-none" style={{ fontSize: '1.2rem' }}>{isDarkMode ? '☀️' : '🌙'}</button>
            <Link to="/password-reset" className="btn btn-link p-0 text-decoration-none" style={{ fontSize: '1.2rem' }}>🔑</Link>
            <button onClick={logout} className="btn btn-link p-0 text-decoration-none" style={{ fontSize: '1.2rem' }}>🚪</button>
          </div>
        </div>
      )}
      <Sidebar />
      <div className={user ? "main-content-2026 flex-grow-1 w-100" : "flex-grow-1 w-100"}>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Landing />} />
          <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/companies" element={<ProtectedRoute><CompanyConfig /></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute><ClientConfig /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
          <Route path="/password-reset" element={<ProtectedRoute><PasswordReset /></ProtectedRoute>} />
          <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
          <Route path="/new" element={<ProtectedRoute><NewInvoicePage /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/invoice/:id/preview" element={<ProtectedRoute><InvoicePreview /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
