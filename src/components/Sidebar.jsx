import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { useTheme } from './ThemeContext.jsx';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { path: '/dashboard', icon: '🏠', label: t('nav.home') || 'Home' },
        { path: '/invoices', icon: '📄', label: t('nav.invoices') },
        { path: '/new', icon: '➕', label: t('nav.new_invoice'), isAction: true },
        { path: '/analytics', icon: '📊', label: t('nav.analytics') },
        { path: '/clients', icon: '👥', label: t('nav.clients') },
    ];

    if (!user) return null;

    return (
        <div className="sidebar-2026">
            <div className="mb-4 d-none d-md-block">
                <Link to="/dashboard" className="text-decoration-none">
                    <div className="btn-neon p-2" style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="fw-bold">i</span>
                    </div>
                </Link>
            </div>

            <div className="d-flex flex-md-column gap-2 gap-md-3 flex-grow-1 w-100 justify-content-around justify-content-md-start align-items-center">

                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`btn btn-link text-decoration-none glass-card ${isActive ? 'active-nav' : ''} ${item.isAction ? 'action-btn-2026' : 'p-3'}`}
                            title={item.label}
                            style={{
                                fontSize: item.isAction ? '1.5rem' : '1.2rem',
                                background: isActive ? 'var(--accent-gradient)' : (item.isAction ? 'var(--accent-gradient)' : 'transparent'),
                                border: isActive ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                                boxShadow: (isActive || item.isAction) ? '0 0 20px rgba(168, 85, 247, 0.4)' : 'none',
                                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                transition: 'all 0.3s ease',
                                width: item.isAction ? '60px' : 'auto',
                                height: item.isAction ? '60px' : 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: item.isAction ? '50%' : '15px'
                            }}
                        >
                            <span style={{ filter: (isActive || item.isAction) ? 'drop-shadow(0 0 5px white)' : 'none' }}>
                                {item.icon}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <div className="d-none d-md-flex flex-column gap-2 mt-auto align-items-center w-100 px-2 pb-3">
                <button className="btn btn-link text-decoration-none p-2" onClick={() => i18n.changeLanguage(i18n.language === 'ro' ? 'en' : 'ro')} title={i18n.language === 'ro' ? 'English' : 'Română'}>
                    {i18n.language === 'ro' ? '🇺🇸' : '🇷🇴'}
                </button>
                <button className="btn btn-link text-decoration-none p-2" onClick={toggleTheme}>
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
                <Link to="/password-reset" className="btn btn-link text-decoration-none p-2" title={t('nav.password_reset')}>
                    🔑
                </Link>
                <div className="glass-card p-1 mb-2 text-center w-100" style={{ fontSize: '0.65rem', border: 'none', background: 'rgba(255,255,255,0.05)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.email?.split('@')[0]}
                </div>
                <button className="btn btn-link text-decoration-none p-2" onClick={handleLogout} title={t('nav.logout')}>
                    🚪
                </button>
            </div>

            <style>{`
        .active-nav {
          transform: scale(1.1);
        }
      `}</style>
        </div>
    );
}
