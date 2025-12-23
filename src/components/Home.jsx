import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4">Factura SPA</h1>
      <p className="lead mb-4">Aplicație de facturi offline, stocare in localStorage, React + JavaScript, Bootstrap.</p>
      <Link to="/new" className="btn btn-primary btn-lg">Adauga factura noua</Link>
    </div>
  );
}
