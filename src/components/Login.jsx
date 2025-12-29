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
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          {t('auth.back')}
        </button>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">{t('auth.login')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">{t('auth.email')}</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">{t('auth.password')}</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.password')}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">{t('auth.login')}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
