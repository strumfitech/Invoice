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
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#6E5B78', color: 'white' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" style={{ color: 'white' }} to="/">Factura SPA</Link>
        <div className="d-flex gap-2 ms-auto">
          {user ? (
            <div className="dropdown">
              <button className="btn dropdown-toggle" style={{ backgroundColor: 'white', color: 'black' }} type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                {user.email}
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <>
              <Link className="btn" style={{ backgroundColor: 'white', color: 'black', padding: '8px 16px' }} to="/login">Login</Link>
              <Link className="btn" style={{ backgroundColor: 'white', color: 'black', padding: '8px 16px' }} to="/register">Înregistrare</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
