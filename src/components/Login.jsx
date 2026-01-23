import React, { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PasswordInput from './PasswordInput.jsx';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const getErrorMessage = (errorCode) => {
    const errorMap = {
      'auth/user-not-found': t('auth.error.user_not_found'),
      'auth/wrong-password': t('auth.error.wrong_password'),
      'auth/invalid-email': t('auth.error.invalid_email'),
      'auth/too-many-requests': t('auth.error.too_many_requests'),
      'auth/network-request-failed': t('auth.error.network_request_failed'),
    };
    return errorMap[errorCode] || t('auth.error.default');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(getErrorMessage(result.error));
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center pt-5">
        <div className="col-md-5">
          <div className="glass-card p-5">
            <div className="text-center mb-4">
              <div className="btn-neon d-inline-flex p-3 mb-3">
                <span style={{ fontSize: '2rem' }}>📄</span>
              </div>
              <h2 className="fw-bold">{t('auth.login')}</h2>
              <p className="text-dimmed">Continuă în universul iFactura</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label small text-dimmed">{t('auth.email')}</label>
                <input
                  type="email"
                  className="form-control input-2026"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label small text-dimmed">{t('auth.password')}</label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.password')}
                  required
                  className="input-2026"
                />
              </div>

              {error && (
                <div className="alert border-0 bg-danger bg-opacity-10 text-danger mb-4 small">
                  {error}
                </div>
              )}

              <button type="submit" className="btn-neon w-100 py-3 mb-4">
                {t('auth.login')}
              </button>

              <div className="text-center">
                <span className="text-dimmed small">Nu ai cont? </span>
                <a href="/register" className="small text-decoration-none" style={{ color: 'var(--accent-secondary)' }}>Creează unul</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
