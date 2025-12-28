import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ backgroundColor: '#6E5B78', color: 'white', padding: '80px 0' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4" style={{ color: 'white' }}>iFactura</h1>
              <p className="lead fs-5 mb-4">
                Aplicația modernă pentru gestionarea facturilor. Simplu, rapid și complet offline.
              </p>
              <p className="mb-4">
                Creează facturi profesionale, calculează TVA automat și exportă în PDF. Totul stocat sigur pe dispozitivul tău.
              </p>
              <div className="d-flex gap-3">
                <Link to="/register" className="btn btn-light btn-lg px-4 py-2 fw-bold">
                  Începe Gratuit
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-2 fw-bold">
                  Conectează-te
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
            <h2 className="fw-bold">Funcționalități Principale</h2>
            <p className="text-muted">Tot ce ai nevoie pentru facturarea profesională</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                    📱
                  </div>
                  <h5 className="card-title fw-bold">Offline Complet</h5>
                  <p className="card-text text-muted">
                    Funcționează fără conexiune la internet. Datele tale rămân private și sigure pe dispozitiv.
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
                  <h5 className="card-title fw-bold">Rapid și Intuitiv</h5>
                  <p className="card-text text-muted">
                    Interfață modernă pentru crearea facturilor în câteva minute. Template-uri profesionale incluse.
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
                  <h5 className="card-title fw-bold">Securitate Maximă</h5>
                  <p className="card-text text-muted">
                    Stocare locală criptată. Nicio dată nu părăsește dispozitivul tău. Confidențialitate 100%.
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
              <h2 className="fw-bold mb-4">De ce iFactura?</h2>
              <div className="mb-3">
                <h5 className="text-primary">💼 Gestionare Completă</h5>
                <p>Adăugă produse nelimitate, calculează TVA automat, gestionează clienți și exportă în PDF sau previzualizează online.</p>
              </div>
              <div className="mb-3">
                <h5 className="text-primary">🎨 Design Profesjonal</h5>
                <p>Facturi cu aspect modern și profesional, ușor de citit și perfect pentru prezentare clienților.</p>
              </div>
              <div className="mb-3">
                <h5 className="text-primary">📊 Rapoarte și Istoric</h5>
                <p>Vizualizează toate facturile create, caută rapid și menține un istoric complet al activității.</p>
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
          <h2 className="fw-bold mb-3">Gata să Digitalizezi Facturarea?</h2>
          <p className="lead mb-4 text-muted">
            Alătură-te mii de afaceri care economisesc timp și bani cu iFactura.
          </p>
          <Link to="/register" className="btn btn-lg px-5 py-3 fw-bold" style={{ backgroundColor: '#6E5B78', color: 'white' }}>
            Începe Acum - Gratuit
          </Link>
        </div>
      </section>
    </div>
  );
}
