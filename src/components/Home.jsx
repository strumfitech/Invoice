import React from 'react';
import { Link } from 'react-router-dom';
import InvoiceList from './InvoiceList.jsx';

export default function Home(){
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Factura SPA Dashboard</h1>
        <div className="d-flex gap-2">
          <Link to="/companies" className="btn btn-outline-secondary btn-lg">Configurare Societate</Link>
          <Link to="/clients" className="btn btn-outline-info btn-lg">Adauga Client</Link>
          <Link to="/new" className="btn btn-primary btn-lg">Adauga factura noua</Link>
        </div>
      </div>
      <p className="lead mb-4">Aplicație de facturi offline, stocare in localStorage, React + JavaScript, Bootstrap.</p>
      <InvoiceList />
    </div>
  );
}
