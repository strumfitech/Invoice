import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="container-fluid p-0 overflow-hidden">
      {/* Hero Section 2026 */}
      <section className="min-vh-100 d-flex align-items-center position-relative">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="glass-card d-inline-block px-3 py-1 mb-4">
                <span className="small fw-bold">v3.0 - Quantum Edition</span>
              </div>
              <h1 className="display-2 fw-bold mb-4">
                {t('landing.hero_title')}
              </h1>
              <p className="lead fs-4 text-dimmed mb-5">
                {t('landing.hero_subtitle')}
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn-neon px-5 py-3 fw-bold text-decoration-none">
                  {t('landing.start_free')}
                </Link>
                <Link to="/login" className="btn glass-card px-5 py-3 fw-bold text-decoration-none border-2">
                  {t('landing.sign_in')}
                </Link>
              </div>
            </div>
            <div className="col-lg-6 position-relative">
              <div className="glass-card p-5 text-center position-relative overflow-hidden"
                style={{ transform: 'perspective(1000px) rotateY(-15deg) rotateX(10deg)', border: '2px solid var(--accent-primary)' }}>
                <div style={{ fontSize: '10rem', filter: 'drop-shadow(0 0 30px var(--accent-primary))' }}>📄</div>
                <div className="position-absolute bottom-0 start-0 w-100 p-4 bg-gradient-to-t from-dark to-transparent">
                  <div className="stat-glow h2 mb-0">$2,450.00</div>
                  <p className="small text-dimmed">Factură Recentă</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid 2026 */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">{t('landing.main_features')}</h2>
            <p className="text-dimmed">{t('landing.features_subtitle')}</p>
          </div>
          <div className="row g-4">
            {[
              { icon: '📱', color: 'var(--accent-primary)', title: t('landing.offline_title'), desc: t('landing.offline_desc') },
              { icon: '⚡', color: 'var(--accent-secondary)', title: t('landing.fast_title'), desc: t('landing.fast_desc') },
              { icon: '🔒', color: '#10b981', title: t('landing.secure_title'), desc: t('landing.secure_desc') },
            ].map((f, i) => (
              <div key={i} className="col-md-4">
                <div className="glass-card p-5 h-100 text-center">
                  <div className="mb-4 d-inline-flex p-3 rounded-circle" style={{ background: f.color + '22', border: `1px solid ${f.color}` }}>
                    <span style={{ fontSize: '2rem' }}>{f.icon}</span>
                  </div>
                  <h4 className="fw-bold mb-3">{f.title}</h4>
                  <p className="text-dimmed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section 2026 */}
      <section className="py-5 mb-5">
        <div className="container">
          <div className="glass-card p-5 text-center overflow-hidden position-relative">
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'var(--accent-gradient)', opacity: 0.05 }}></div>
            <h2 className="display-5 fw-bold mb-4">{t('landing.cta_title')}</h2>
            <p className="lead text-dimmed mb-5 max-w-2xl mx-auto">
              {t('landing.cta_subtitle')}
            </p>
            <Link to="/register" className="btn-neon px-5 py-3 fw-bold text-decoration-none d-inline-block">
              {t('landing.start_now')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
