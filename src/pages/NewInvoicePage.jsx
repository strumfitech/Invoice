import React from 'react';
import InvoiceForm from '../components/InvoiceForm.jsx';
import storage from '../services/storage.js';
import { useNavigate } from 'react-router-dom';

export default function NewInvoicePage(){
  const navigate = useNavigate();

  const handleSubmit = (invoice) => {
    // Ensure id and date
    const id = String(Date.now());
    const prepared = { ...invoice, id, date: new Date().toISOString() };
    // Normalize line calculations
    const lines = prepared.lines.map(l => {
      const lineValue = l.unitPrice * l.quantity;
      const lineTax = (l.vatRate / 100) * l.unitPrice * l.quantity;
      const lineTotal = lineValue + lineTax;
      return { ...l, lineValue, lineTax, lineTotal };
    });
    const subtotal = lines.reduce((a,b)=> a + b.lineValue, 0);
    const totalTax = lines.reduce((a,b)=> a + b.lineTax, 0);
    const total = lines.reduce((a,b)=> a + b.lineTotal, 0);
    const finalInvoice = { ...prepared, lines, subtotal, totalTax, total };
    const existing = storage.getInvoices();
    existing.push(finalInvoice);
    localStorage.setItem('invoices', JSON.stringify(existing));
    navigate('/invoices');
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">Creează Factură</h2>
      <InvoiceForm onSubmit={handleSubmit} />
    </div>
  );
}
