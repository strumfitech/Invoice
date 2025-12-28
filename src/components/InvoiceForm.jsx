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
  const [lines, setLines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLine, setNewLine] = useState({ type:'Product', name:'', code:'', currencyUnit:'pcs', vatRate:19, quantity:1, unitPrice:'' });
  const [deleteLineIndex, setDeleteLineIndex] = useState(null);
  const [compactLines, setCompactLines] = useState(new Set());
  const [validationErrors, setValidationErrors] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showInlineAdd, setShowInlineAdd] = useState(false);

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

    // Load templates
    const saved = localStorage.getItem(`templates_${user.uid}`);
    if (saved) {
      setTemplates(JSON.parse(saved));
    } else {
      // Add default templates
      const defaultTemplates = [
        { id: 'default-classic', name: 'Clasic', layout: 'classic' },
        { id: 'default-modern', name: 'Modern', layout: 'modern' },
        { id: 'default-minimalist', name: 'Minimalist', layout: 'minimalist' }
      ];
      setTemplates(defaultTemplates);
    }
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
    if (window.innerWidth < 1000) {
      if (window.innerWidth < 500) {
        setShowAddModal(true);
      } else {
        setLines([{ id: lines.length+1, type:'Product', name:'', code:'', currencyUnit:'pcs', vatRate:19, quantity:1, unitPrice:'', lineValue:0, lineTax:0, lineTotal:0 }, ...lines]);
      }
    } else {
      // On desktop > 1000px, show inline form
      setShowInlineAdd(true);
    }
  };

  const addNewLine = () => {
    const lineValue = newLine.unitPrice * newLine.quantity;
    const lineTax = (newLine.vatRate / 100) * newLine.unitPrice * newLine.quantity;
    const lineTotal = lineValue + lineTax;
    setLines([{ id: lines.length+1, ...newLine, lineValue, lineTax, lineTotal }, ...lines]);
    setNewLine({ type:'Product', name:'', code:'', currencyUnit:'pcs', vatRate:19, quantity:1, unitPrice:'' });
    setShowAddModal(false);
  };

  const deleteLine = () => {
    if (deleteLineIndex !== null) {
      setLines(lines.filter((_, i) => i !== deleteLineIndex));
      setDeleteLineIndex(null);
    }
  };

  const toggleCompact = (idx) => {
    const newCompact = new Set(compactLines);
    if (newCompact.has(idx)) {
      newCompact.delete(idx);
    } else {
      newCompact.add(idx);
    }
    setCompactLines(newCompact);
  };

  const submit = (e)=>{
    e.preventDefault();

    // Clear previous errors
    setValidationErrors([]);

    const errors = [];

    // Validate company
    const company = companies[selectedCompany];
    if(!company){
      errors.push('Selectați o companie.');
    }

    // Validate client
    const recipient = clients[selectedClient];
    if(!recipient){
      errors.push('Selectați un client.');
    }

    // Validate products
    if(lines.length===0){
      errors.push('Adăugați cel puțin un produs.');
    } else if(lines.some(l=>!l.name || l.unitPrice<=0 || l.quantity<=0)){
      errors.push('Toate produsele trebuie să aibă nume, preț (>0) și cantitate (>0).');
    }

    // If there are errors, display them
    if(errors.length > 0){
      setValidationErrors(errors);
      return;
    }

    // Get selected template
    const template = selectedTemplate ? templates.find(t => t.id === selectedTemplate) : null;

    // Clear errors and submit
    setValidationErrors([]);
    onSubmit({ company, recipient, dueDate, currency, lines, template });
  };

  return (
    <div className="container-fluid py-4">
      <form onSubmit={submit}>
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="alert alert-danger mb-4">
            <h6>Erori de validare:</h6>
            <ul className="mb-0">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

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

      <div className="mb-4">
        <h4>Selectează Template</h4>
        <select className="form-select" value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)}>
          <option value="">Template implicit</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} ({template.layout})
            </option>
          ))}
        </select>
        <small className="text-muted">Template-urile personalizează aspectul facturii PDF</small>
      </div>

      <div className="mb-3">
        <h4>Produse</h4>
        <div className="row">
          {lines.map((line, idx) => (
            <div key={line.id} className="col-md-12 mb-3">
              <div className="card">
                <div className="card-body">
                  {compactLines.has(idx) ? (
                    <div className="d-flex justify-content-between align-items-center">
                      <span><strong>{line.name}</strong> - Total: {Number(line.lineTotal).toFixed(2)} {currency}</span>
                      <div>
                        <button className="btn btn-outline-secondary btn-sm me-2" type="button" onClick={() => toggleCompact(idx)}>Extinde</button>
                        <button className="btn btn-danger btn-sm" type="button" onClick={() => setDeleteLineIndex(idx)}>Șterge</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="row g-2">
                        <div className="col-3">
                          <label className="form-label">Tip</label>
                          <select className="form-select form-select-sm" value={line.type} onChange={e => updateLine(idx, { type: e.target.value })}>
                            <option value="Product">Produs/Serviciu</option>
                          </select>
                        </div>
                        <div className="col-9">
                          <label className="form-label">Denumire articol</label>
                          <input className="form-control form-control-sm" value={line.name} onChange={e => updateLine(idx, { name: e.target.value })} />
                        </div>
                        <div className="col-3">
                          <label className="form-label">Cod</label>
                          <input className="form-control form-control-sm" value={line.code} onChange={e => updateLine(idx, { code: e.target.value })} />
                        </div>
                        <div className="col-3">
                          <label className="form-label">Unitati</label>
                          <select className="form-select form-select-sm" value={line.currencyUnit} onChange={e => updateLine(idx, { currencyUnit: e.target.value })}>
                            <option value="pcs">Bucati</option>
                            <option value="set">Set</option>
                          </select>
                        </div>
                        <div className="col-3">
                          <label className="form-label">TVA %</label>
                          <input className="form-control form-control-sm" type="number" value={line.vatRate} onChange={e => updateLine(idx, { vatRate: Number(e.target.value) })} />
                        </div>
                        <div className="col-3">
                          <label className="form-label">Cantitate</label>
                          <input className="form-control form-control-sm" type="number" value={line.quantity} onChange={e => updateLine(idx, { quantity: Number(e.target.value) })} />
                        </div>
                        <div className="col-6">
                          <label className="form-label">Pret Unitar</label>
                          <input className="form-control form-control-sm" type="number" step="0.01" value={line.unitPrice} onChange={e => updateLine(idx, { unitPrice: Number(e.target.value) })} />
                        </div>
                        <div className="col-6">
                          <label className="form-label">Total</label>
                          <input className="form-control form-control-sm" readOnly value={Number(line.lineTotal).toFixed(2)} />
                        </div>
                      </div>
                      <div className="mt-3 d-flex justify-content-between align-items-center">
                        <button className="btn btn-outline-info btn-sm" type="button" onClick={() => toggleCompact(idx)}>Compactează</button>
                        <button className="btn btn-success btn-sm" type="button" onClick={() => {
                          // Validate current product line
                          if (!lines[idx].name || lines[idx].unitPrice <= 0 || lines[idx].quantity <= 0) {
                            alert('Completează toate câmpurile obligatorii pentru acest produs');
                            return;
                          }
                          alert('Produs salvat cu succes!');
                        }}>Salvare</button>
                        <button className="btn btn-danger btn-sm" type="button" onClick={() => setDeleteLineIndex(idx)}>Șterge</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Inline Add Form for Desktop */}
        {showInlineAdd && (
          <div className="card mt-3">
            <div className="card-header">
              <h6 className="mb-0">Adaugă Produs Nou</h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-2">
                  <label className="form-label">Tip</label>
                  <select className="form-select" value={newLine.type} onChange={e => setNewLine({ ...newLine, type: e.target.value })}>
                    <option value="Product">Produs/Serviciu</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Denumire articol</label>
                  <input className="form-control" value={newLine.name} onChange={e => setNewLine({ ...newLine, name: e.target.value })} placeholder="Nume produs" />
                </div>
                <div className="col-md-1">
                  <label className="form-label">Cod</label>
                  <input className="form-control" value={newLine.code} onChange={e => setNewLine({ ...newLine, code: e.target.value })} placeholder="Cod" />
                </div>
                <div className="col-md-1">
                  <label className="form-label">Unități</label>
                  <select className="form-select" value={newLine.currencyUnit} onChange={e => setNewLine({ ...newLine, currencyUnit: e.target.value })}>
                    <option value="pcs">Buc</option>
                    <option value="set">Set</option>
                  </select>
                </div>
                <div className="col-md-1">
                  <label className="form-label">TVA %</label>
                  <input className="form-control" type="number" value={newLine.vatRate} onChange={e => setNewLine({ ...newLine, vatRate: Number(e.target.value) })} />
                </div>
                <div className="col-md-1">
                  <label className="form-label">Cantitate</label>
                  <input className="form-control" type="number" value={newLine.quantity} onChange={e => setNewLine({ ...newLine, quantity: Number(e.target.value) })} />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Preț Unitate</label>
                  <input className="form-control" type="number" step="0.01" value={newLine.unitPrice} onChange={e => setNewLine({ ...newLine, unitPrice: Number(e.target.value) })} placeholder="0.00" />
                </div>
                <div className="col-md-1 d-flex align-items-end">
                  <button type="button" className="btn btn-success me-2" onClick={() => { addNewLine(); setShowInlineAdd(false); }}>Adaugă</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowInlineAdd(false)}>Anulează</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3">
          <button type="button" className="btn btn-secondary" onClick={addLine}>Adauga Produse</button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="alert alert-danger mb-3">
          <h6>Erori de validare:</h6>
          <ul className="mb-0">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-3 text-center mt-5">
        <button className="btn btn-success" type="submit">Salveaza Factura</button>
      </div>

      {/* Add Line Modal */}
      <div className={`modal fade ${showAddModal ? 'show' : ''}`} style={{ display: showAddModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Adaugă Linie</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tip</label>
                <select className="form-select" value={newLine.type} onChange={e => setNewLine({ ...newLine, type: e.target.value })}>
                  <option value="Product">Produs/Serviciu</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Denumire articol</label>
                <input className="form-control" value={newLine.name} onChange={e => setNewLine({ ...newLine, name: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Cod</label>
                <input className="form-control" value={newLine.code} onChange={e => setNewLine({ ...newLine, code: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Unitati</label>
                <select className="form-select" value={newLine.currencyUnit} onChange={e => setNewLine({ ...newLine, currencyUnit: e.target.value })}>
                  <option value="pcs">Bucati</option>
                  <option value="set">Set</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">TVA %</label>
                <input className="form-control" type="number" value={newLine.vatRate} onChange={e => setNewLine({ ...newLine, vatRate: Number(e.target.value) })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Cantitate</label>
                <input className="form-control" type="number" value={newLine.quantity} onChange={e => setNewLine({ ...newLine, quantity: Number(e.target.value) })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Pret Unitar</label>
                <input className="form-control" type="number" step="0.01" value={newLine.unitPrice} onChange={e => setNewLine({ ...newLine, unitPrice: Number(e.target.value) })} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Anulează</button>
              <button type="button" className="btn btn-primary" onClick={addNewLine}>Adaugă</button>
            </div>
          </div>
        </div>
      </div>
      {showAddModal && <div className="modal-backdrop fade show"></div>}

      {/* Delete Line Modal */}
      <div className={`modal fade ${deleteLineIndex !== null ? 'show' : ''}`} style={{ display: deleteLineIndex !== null ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmare Ștergere</h5>
              <button type="button" className="btn-close" onClick={() => setDeleteLineIndex(null)}></button>
            </div>
            <div className="modal-body">
              <p>Ești sigur că vrei să ștergi această linie?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setDeleteLineIndex(null)}>Nu</button>
              <button type="button" className="btn btn-danger" onClick={deleteLine}>Da</button>
            </div>
          </div>
        </div>
      </div>
      {deleteLineIndex !== null && <div className="modal-backdrop fade show"></div>}

      </form>
    </div>
  );
}
