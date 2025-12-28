import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          <span className="fw-bold">i</span>
          <span className="text-primary fw-bold">Factura</span>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/new">Factură Nouă</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/invoices">Istoric Facturi</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/analytics">Analytics</Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Configurare
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><Link className="dropdown-item" to="/companies">Societate</Link></li>
                    <li><Link className="dropdown-item" to="/clients">Clienți</Link></li>
                    <li><Link className="dropdown-item" to="/templates">Template-uri</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/reminders">Mementouri</Link></li>
                  </ul>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex gap-2">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                       style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: '600' }}>
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="d-none d-md-inline">{user.email.split('@')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
                  <li><h6 className="dropdown-header">{user.email}</h6></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="/password-reset">
                    <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Schimbă Parola
                  </a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>
                    <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Deconectare
                  </button></li>
                </ul>
              </div>
            ) : (
              <>
                <Link className="btn btn-outline-primary" to="/login">Conectare</Link>
                <Link className="btn btn-primary" to="/register">Înregistrare</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
