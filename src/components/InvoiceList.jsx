import React, { useEffect, useState } from 'react';
import storage from '../services/storage.js';
import { Link } from 'react-router-dom';

export default function InvoiceList(){
  const [invoices, setInvoices] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(()=>{
    const data = storage.getInvoices();
    setInvoices(data);
  },[]);

  const deleteInvoice = (id)=>{
    const updated = invoices.filter(inv => inv.id !== id);
    setInvoices(updated);
    storage.saveInvoices(updated);
  };

  const exportInvoices = ()=>{
    const blob = new Blob([JSON.stringify(invoices, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoices.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportSingleInvoice = (inv)=> {
    const blob = new Blob([JSON.stringify(inv, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Factura_${inv.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filtered = invoices.filter(inv => {
    const q = query.toLowerCase();
    if (!q) return true;
    const dateStr = new Date(inv.date).toLocaleDateString().toLowerCase();
    return String(inv.id).toLowerCase().includes(q) || dateStr.includes(q) || String(inv.total).toLowerCase().includes(q);
  });

  return (
    <div className="container py-5">
      <h2>Istoric facturi</h2>
      <div className="mb-3">
        <input className="form-control" placeholder="Cauta factura..." value={query} onChange={e=>setQuery(e.target.value)} />
      </div>
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={exportInvoices}>Exporta facturi JSON</button>
      </div>
      {filtered.length === 0 ? (
        <p>Nicio factura salvata.</p>
      ) : (
        <div className="list-group">
          {filtered.map(inv => (
            <div key={inv.id} className="card mb-2 p-2 bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Factura {inv.id}</strong> - {new Date(inv.date).toLocaleString()} - Total: {inv.total} {inv.currency}
                </div>
                <div className="d-flex gap-2">
                  <Link to={`/invoice/${inv.id}/preview`} className="btn btn-sm btn-outline-primary">Preview</Link>
                  <button className="btn btn-sm btn-outline-success" onClick={()=>exportSingleInvoice(inv)}>Export JSON</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>deleteInvoice(inv.id)}>Sterge</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
