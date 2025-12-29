import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { useTheme } from './ThemeContext.jsx';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
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
                  <Link className="nav-link" to="/new">{t('nav.new_invoice')}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/invoices">{t('nav.invoices')}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/analytics">{t('nav.analytics')}</Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {t('nav.settings')}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><Link className="dropdown-item" to="/companies">{t('nav.companies')}</Link></li>
                    <li><Link className="dropdown-item" to="/clients">{t('nav.clients')}</Link></li>
                    <li><Link className="dropdown-item" to="/templates">{t('nav.templates')}</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/reminders">{t('nav.reminders')}</Link></li>
                  </ul>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={toggleTheme}
              title={t(isDarkMode ? 'theme.light_mode' : 'theme.dark_mode')}
            >
              {isDarkMode ? (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193-9.193a.5.5 0 0 1-.707 0l-1.414 1.414a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
                </svg>
              ) : (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
                </svg>
              )}
            </button>

            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2"
                type="button"
                id="languageDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Schimbă limba"
              >
                {i18n.language === 'ro' ? 'RO' : 'EN'}
              </button>
              <ul className="dropdown-menu" aria-labelledby="languageDropdown">
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => changeLanguage('ro')}
                  >
                    <span className="me-2">🇷🇴</span>
                    Română
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => changeLanguage('en')}
                  >
                    <span className="me-2">🇺🇸</span>
                    English
                  </button>
                </li>
              </ul>
            </div>
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
                    {t('nav.password_reset')}
                  </a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>
                    <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t('nav.logout')}
                  </button></li>
                </ul>
              </div>
            ) : (
              <>
                <Link className="btn btn-outline-primary" to="/login">{t('auth.login')}</Link>
                <Link className="btn btn-primary" to="/register">{t('auth.register')}</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
