import React from 'react';
import { Link } from 'react-router-dom';
import InvoiceList from './InvoiceList.jsx';

export default function Home(){
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-column flex-md-row">
        <h1 className="mb-3 mb-md-0">Generare factura</h1>
        <div className="d-flex gap-2 flex-wrap justify-content-center">
          <Link to="/companies" className="btn btn-outline-secondary">Configurare Societate</Link>
          <Link to="/clients" className="btn btn-outline-info">Adauga Client</Link>
          <Link to="/reminders" className="btn btn-outline-warning">Mementouri</Link>
          <Link to="/new" className="btn btn-primary">Adauga factura noua</Link>
        </div>
      </div>
      <InvoiceList />
    </div>
  );
}
