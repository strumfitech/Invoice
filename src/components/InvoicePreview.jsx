import React from 'react';
import { useParams } from 'react-router-dom';
import storage from '../services/storage.js';

export default function InvoicePreview(){
  const { id } = useParams();
  const invoices = storage.getInvoices();
  const inv = invoices.find(v => String(v.id) === String(id));

  if(!inv){
    return (
      <div className="container py-5">
        <h2>Factura negăsită</h2>
        <p>Factura cu ID-ul {id} nu a fost găsită în istoric.</p>
      </div>
    );
  }

  const company = inv.company || {};
  const lines = inv.lines || [];

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Factura #{inv.id}</h2>
        <button className="btn btn-primary" onClick={() => window.print()}>Print/Save as PDF</button>
      </div>
      <div className="card-custom card p-3 mb-3">
        <div><strong>Companie:</strong> {company.name || ''}</div>
        <div>{company.address || ''}</div>
        <div>Cont: {company.bankAccount || ''} | CUI: {company.cui || ''} | Nr Inregistrare: {company.registrationNumber || ''}</div>
      </div>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Tip</th>
            <th>Denumire articol</th>
            <th>Cod</th>
            <th>Unitati</th>
            <th>TVA %</th>
            <th>Cantitate</th>
            <th>Pret Unitar</th>
            <th>Valoare</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((ln) => (
            <tr key={ln.id}>
              <td>{ln.type}</td>
              <td>{ln.name}</td>
              <td>{ln.code}</td>
              <td>{ln.currencyUnit}</td>
              <td>{ln.vatRate}</td>
              <td>{ln.quantity}</td>
              <td>{ln.unitPrice}</td>
              <td>{ln.lineValue}</td>
              <td>{ln.lineTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-end mb-3">
        <strong>Subtotal:</strong> {inv.subtotal} &nbsp; <strong>TVA:</strong> {inv.totalTax} &nbsp; <strong>Total:</strong> {inv.total}
      </div>
    </div>
  );
}
