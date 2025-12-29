import React, { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PasswordInput from './PasswordInput.jsx';

export default function Register() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const getErrorMessage = (errorCode) => {
    const errorMap = {
      'auth/email-already-in-use': t('auth.error.email_already_in_use'),
      'auth/weak-password': t('auth.error.weak_password'),
      'auth/invalid-email': t('auth.error.invalid_email'),
      'auth/too-many-requests': t('auth.error.too_many_requests'),
      'auth/network-request-failed': t('auth.error.network_request_failed'),
    };
    return errorMap[errorCode] || t('auth.error.default');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(email, password);
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
          <h2 className="text-center mb-4">{t('auth.register')}</h2>
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
            <button type="submit" className="btn btn-primary w-100">{t('auth.register_button')}</button>
          </form>

          <div className="card mt-4">
            <div className="card-body">
              <h6 className="card-title">{t('auth.password_requirements')}</h6>
              <ul className="list-unstyled small text-muted mb-0">
                <li>{t('auth.password_min_length')}</li>
                <li>{t('auth.password_combination')}</li>
                <li>{t('auth.password_not_guessable')}</li>
                <li>{t('auth.password_secure')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
