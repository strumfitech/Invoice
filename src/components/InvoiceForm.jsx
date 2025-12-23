import React, { useState, useEffect } from 'react';
import InvoiceLineItemRow from './InvoiceLineItemRow.jsx';

export default function InvoiceForm({ onSubmit }){
  const [company, setCompany] = useState({ name:'', address:'', bankAccount:'', cui:'', registrationNumber:''});
  const [recipient, setRecipient] = useState({ name:'', address:'', cui:''});
  const [lines, setLines] = useState([ { id: 1, type:'Product', name:'', code:'', currencyUnit:'pcs', vatRate:19, quantity:1, unitPrice:0, lineValue:0, lineTax:0, lineTotal:0 } ]);

  useEffect(()=>{
    const c = localStorage.getItem('company');
    if(c){ setCompany(JSON.parse(c)); }
  },[]);

  useEffect(()=>{
    localStorage.setItem('company', JSON.stringify(company));
  },[company]);

  const updateLine = (idx, patch)=>{
    const next = lines.map((l,i)=> i===idx? {...l, ...patch}:l);
    setLines(next);
  };

  // Recalculate line values when line data changes
  useEffect(()=>{
    const recalc = lines.map(l => {
      const lineValue = l.unitPrice * l.quantity;
      const lineTax = (l.vatRate / 100) * l.unitPrice * l.quantity;
      const lineTotal = lineValue + lineTax;
      return { ...l, lineValue, lineTax, lineTotal };
    });
    setLines(recalc);
  },[lines.length, lines.map(l=>l.unitPrice).join(','), lines.map(l=>l.quantity).join(',')]);

  const addLine = ()=>{
    setLines([{ id: lines.length+1, type:'Product', name:'', code:'', currencyUnit:'pcs', vatRate:19, quantity:1, unitPrice:0, lineValue:0, lineTax:0, lineTotal:0 }, ...lines]);
  };

  const submit = (e)=>{
    e.preventDefault();
    if(!company.name || !company.address || !company.cui || !company.registrationNumber){
      alert('Completati detaliile companiei inainte de a salva factura.');
      return;
    }
    if(lines.length===0 || lines.some(l=>!l.name || l.unitPrice<=0 || l.quantity<=0)){ 
      alert('Adaugati cel putin o linie valida cu nume, pret si cantitate (>0).');
      return;
    }
    onSubmit({ company, recipient, lines});
  };

  return (
    <form onSubmit={submit}>
      <div className="mb-4">
        <h4>Detalii Companie</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nume Companie</label>
            <input className="form-control" value={company.name} onChange={e=>setCompany({...company, name:e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Adresa</label>
            <input className="form-control" value={company.address} onChange={e=>setCompany({...company, address:e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Cont Bancar</label>
            <input className="form-control" value={company.bankAccount} onChange={e=>setCompany({...company, bankAccount:e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="form-label">CUI</label>
            <input className="form-control" value={company.cui} onChange={e=>setCompany({...company, cui:e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nr Inregistrare</label>
            <input className="form-control" value={company.registrationNumber} onChange={e=>setCompany({...company, registrationNumber:e.target.value})} />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4>Destinatar Factura</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nume Destinatar</label>
            <input className="form-control" value={recipient.name} onChange={e=>setRecipient({...recipient, name:e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Adresa Destinatar</label>
            <input className="form-control" value={recipient.address} onChange={e=>setRecipient({...recipient, address:e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="form-label">CUI Destinatar</label>
            <input className="form-control" value={recipient.cui} onChange={e=>setRecipient({...recipient, cui:e.target.value})} />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <h4>Linii Factura</h4>
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
            {lines.map((line, idx)=> (
              <InvoiceLineItemRow key={line.id} index={idx} line={line} onChange={(updates)=>{
                const next = lines.map((l,i)=> i===idx ? { ...l, ...updates } : l);
                setLines(next);
              }} />
            ))}
          </tbody>
        </table>
        <button type="button" className="btn btn-secondary" onClick={addLine}>Adauga Linie</button>
      </div>

      <div className="mb-3">
        <button className="btn btn-primary" type="submit">Salveaza Factura</button>
      </div>
    </form>
  );
}
