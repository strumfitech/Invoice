import React, { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import PasswordInput from './PasswordInput.jsx';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (register(email, password)) {
      navigate('/');
    } else {
      setError('Email-ul există deja');
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          ← Înapoi
        </button>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Înregistrare</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Parolă</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Introdu parola"
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">Înregistrează-te</button>
          </form>

          <div className="card mt-4">
            <div className="card-body">
              <h6 className="card-title">Cerinte Parolă</h6>
              <ul className="list-unstyled small text-muted mb-0">
                <li>• Parola trebuie să aibă cel puțin 6 caractere</li>
                <li>• Folosește o combinație de litere, cifre și simboluri</li>
                <li>• Nu utiliza parole ușor de ghicit</li>
                <li>• Parolele sunt stocate în siguranță și criptate</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
