import React from 'react';
import { Link } from 'react-router-dom';
import InvoiceList from './InvoiceList.jsx';

export default function Home(){
  return (
    <div className="container py-5">
      <div className="mb-5">
        <h1 className="text-center mb-5">Generare factura</h1>
        <div className="text-center mb-4">
          <Link to="/new" className="btn btn-primary">Adauga factura noua</Link>
        </div>
        <div className="d-flex gap-2 justify-content-center flex-wrap">
          <Link to="/companies" className="btn btn-secondary home-btn">Configurare Societate</Link>
          <Link to="/clients" className="btn btn-secondary home-btn">Adauga Client</Link>
          <Link to="/reminders" className="btn btn-secondary home-btn">Mementouri</Link>
        </div>
      </div>
      <InvoiceList />
    </div>
  );
}
