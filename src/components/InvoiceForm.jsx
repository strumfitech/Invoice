import React, { useState, useEffect } from 'react';
import InvoiceLineItemRow from './InvoiceLineItemRow.jsx';
import storage from '../services/storage.js';
import { useAuth } from './AuthContext.jsx';

export default function InvoiceForm({ onSubmit }){
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('RON');
  const [lines, setLines] = useState([ { id: 1, type:'Product', name:'', code:'', currencyUnit:'pcs', vatRate:19, quantity:1, unitPrice:0, lineValue:0, lineTotal:0 } ]);

  useEffect(()=>{
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    const c = await storage.getCompanies(user.uid);
    setCompanies(c);
    const cl = await storage.getClients(user.uid);
    setClients(cl);
  };

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
    const company = companies[selectedCompany];
    if(!company){
      alert('Selectati o companie.');
      return;
    }
    const recipient = clients[selectedClient];
    if(!recipient){
      alert('Selectati un client.');
      return;
    }
    if(lines.length===0 || lines.some(l=>!l.name || l.unitPrice<=0 || l.quantity<=0)){
      alert('Adaugati cel putin o linie valida cu nume, pret si cantitate (>0).');
      return;
    }
    onSubmit({ company, recipient, dueDate, currency, lines});
  };

  return (
    <form onSubmit={submit}>
      <div className="mb-4">
        <h4>Selectează Companie</h4>
        <select className="form-select" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
          <option value="">Alege o companie...</option>
          {companies.map((comp, idx) => (
            <option key={idx} value={idx}>{comp.name} - {comp.cui}</option>
          ))}
        </select>
        {companies.length === 0 && <p className="text-muted mt-2">Nicio companie adăugată. Mergi la <a href="/companies">Configurare Societate</a>.</p>}
      </div>

      <div className="mb-4">
        <h4>Selectează Client</h4>
        <select className="form-select" value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
          <option value="">Alege un client...</option>
          {clients.map((cli, idx) => (
            <option key={idx} value={idx}>{cli.name} - {cli.cui}</option>
          ))}
        </select>
        {clients.length === 0 && <p className="text-muted mt-2">Niciun client adăugat. Mergi la <a href="/clients">Adauga Client</a>.</p>}
      </div>

      <div className="mb-4">
        <h4>Data Scadenței</h4>
        <input type="date" className="form-control" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      </div>

      <div className="mb-4">
        <h4>Moneda</h4>
        <select className="form-select" value={currency} onChange={e => setCurrency(e.target.value)}>
          <option value="RON">RON</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <div className="mb-3">
        <h4>Linii Factura</h4>
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th style={{ minWidth: '80px' }}>Tip</th>
                <th style={{ minWidth: '150px' }}>Denumire articol</th>
                <th style={{ minWidth: '80px' }}>Cod</th>
                <th style={{ minWidth: '70px' }}>Unitati</th>
                <th style={{ minWidth: '60px' }}>TVA %</th>
                <th style={{ minWidth: '80px' }}>Cantitate</th>
                <th style={{ minWidth: '90px' }}>Pret Unitar</th>
                <th style={{ minWidth: '80px' }}>Valoare</th>
                <th style={{ minWidth: '80px' }}>Total</th>
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
        </div>
        <div className="mt-3">
          <button type="button" className="btn btn-secondary" onClick={addLine}>Adauga Linie</button>
        </div>
      </div>

      <div className="mb-3">
        <button className="btn btn-primary" type="submit">Salveaza Factura</button>
      </div>
    </form>
  );
}
