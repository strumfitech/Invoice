import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ backgroundColor: '#6E5B78', color: 'white', padding: '80px 0' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4" style={{ color: 'white' }}>{t('landing.hero_title')}</h1>
              <p className="lead fs-5 mb-4">
                {t('landing.hero_subtitle')}
              </p>
              <p className="mb-4">
                {t('landing.hero_description')}
              </p>
              <div className="d-flex gap-3">
                <Link to="/register" className="btn btn-light btn-lg px-4 py-2 fw-bold">
                  {t('landing.start_free')}
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-2 fw-bold">
                  {t('landing.sign_in')}
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div style={{ fontSize: '8rem', opacity: 0.8 }}>📄</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">{t('landing.main_features')}</h2>
            <p className="text-muted">{t('landing.features_subtitle')}</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                    📱
                  </div>
                  <h5 className="card-title fw-bold">{t('landing.offline_title')}</h5>
                  <p className="card-text text-muted">
                    {t('landing.offline_desc')}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                    ⚡
                  </div>
                  <h5 className="card-title fw-bold">{t('landing.fast_title')}</h5>
                  <p className="card-text text-muted">
                    {t('landing.fast_desc')}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                    🔒
                  </div>
                  <h5 className="card-title fw-bold">{t('landing.secure_title')}</h5>
                  <p className="card-text text-muted">
                    {t('landing.secure_desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ backgroundColor: '#e9ecef', padding: '60px 0' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-4">{t('landing.why_title')}</h2>
              <div className="mb-3">
                <h5 className="text-primary">{t('landing.management_title')}</h5>
                <p>{t('landing.management_desc')}</p>
              </div>
              <div className="mb-3">
                <h5 className="text-primary">{t('landing.design_title')}</h5>
                <p>{t('landing.design_desc')}</p>
              </div>
              <div className="mb-3">
                <h5 className="text-primary">{t('landing.reports_title')}</h5>
                <p>{t('landing.reports_desc')}</p>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div style={{ fontSize: '6rem', color: '#6E5B78' }}>📊</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">{t('landing.cta_title')}</h2>
          <p className="lead mb-4 text-muted">
            {t('landing.cta_subtitle')}
          </p>
          <Link to="/register" className="btn btn-lg px-5 py-3 fw-bold" style={{ backgroundColor: '#6E5B78', color: 'white' }}>
            {t('landing.start_now')}
          </Link>
        </div>
      </section>
    </div>
  );
}
