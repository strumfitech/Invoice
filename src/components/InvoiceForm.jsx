import React, { useState, useEffect } from 'react';
import InvoiceLineItemRow from './InvoiceLineItemRow.jsx';
import storage from '../services/storage.js';
import { useAuth } from './AuthContext.jsx';
import { useTranslation } from 'react-i18next';

export default function InvoiceForm({ onSubmit }){
  const { user } = useAuth();
  const { t } = useTranslation();
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
      errors.push(t('invoice.select_company_error'));
    }

    // Validate client
    const recipient = clients[selectedClient];
    if(!recipient){
      errors.push(t('invoice.select_client_error'));
    }

    // Validate products
    if(lines.length===0){
      errors.push(t('invoice.add_product_error'));
    } else if(lines.some(l=>!l.name || l.unitPrice<=0 || l.quantity<=0)){
      errors.push(t('invoice.product_validation_error'));
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
            <h6>{t('invoice.validation_errors')}</h6>
            <ul className="mb-0">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-4">
          <h4>{t('invoice.select_company')}</h4>
        <select className="form-select" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
          <option value="">{t('common.select')}...</option>
          {companies.map((comp, idx) => (
            <option key={idx} value={idx}>{comp.name} - {comp.cui}</option>
          ))}
        </select>
        {companies.length === 0 && <p className="text-muted mt-2">{t('common.no_companies')}</p>}
      </div>

      <div className="mb-4">
        <h4>{t('invoice.select_client')}</h4>
        <select className="form-select" value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
          <option value="">{t('common.select')}...</option>
          {clients.map((cli, idx) => (
            <option key={idx} value={idx}>{cli.name} - {cli.cui}</option>
          ))}
        </select>
        {clients.length === 0 && <p className="text-muted mt-2">{t('common.no_clients')}</p>}
      </div>

      <div className="mb-4">
        <h4>{t('invoice.due_date')}</h4>
        <input type="date" className="form-control" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      </div>

      <div className="mb-4">
        <h4>{t('invoice.currency')}</h4>
        <select className="form-select" value={currency} onChange={e => setCurrency(e.target.value)}>
          <option value="RON">RON</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <div className="mb-4">
        <h4>{t('invoice.select_template')}</h4>
        <select className="form-select" value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)}>
          <option value="">{t('invoice.template_implicit')}</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} ({template.layout})
            </option>
          ))}
        </select>
        <small className="text-muted">{t('invoice.template_description')}</small>
      </div>

      <div className="mb-3">
        <h4>{t('invoice.products')}</h4>
        <div className="row">
          {lines.map((line, idx) => (
            <div key={line.id} className="col-md-12 mb-3">
              <div className="card">
                <div className="card-body">
                  {compactLines.has(idx) ? (
                    <div className="d-flex justify-content-between align-items-center">
                      <span><strong>{line.name}</strong> - Total: {Number(line.lineTotal).toFixed(2)} {currency}</span>
                      <div>
                        <button className="btn btn-outline-secondary btn-sm me-2" type="button" onClick={() => toggleCompact(idx)}>{t('common.view')}</button>
                        <button className="btn btn-danger btn-sm" type="button" onClick={() => setDeleteLineIndex(idx)}>{t('common.delete')}</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="row g-2">
                        <div className="col-3">
                          <label className="form-label">{t('invoice.type')}</label>
                          <select className="form-select form-select-sm" value={line.type} onChange={e => updateLine(idx, { type: e.target.value })}>
                            <option value="Product">{t('invoice.product_service')}</option>
                          </select>
                        </div>
                        <div className="col-9">
                          <label className="form-label">{t('invoice.name')}</label>
                          <input className="form-control form-control-sm" value={line.name} onChange={e => updateLine(idx, { name: e.target.value })} />
                        </div>
                        <div className="col-3">
                          <label className="form-label">{t('invoice.code')}</label>
                          <input className="form-control form-control-sm" value={line.code} onChange={e => updateLine(idx, { code: e.target.value })} />
                        </div>
                        <div className="col-3">
                          <label className="form-label">{t('invoice.units')}</label>
                          <select className="form-select form-select-sm" value={line.currencyUnit} onChange={e => updateLine(idx, { currencyUnit: e.target.value })}>
                            <option value="pcs">{t('invoice.pieces')}</option>
                            <option value="set">{t('invoice.set')}</option>
                          </select>
                        </div>
                        <div className="col-3">
                          <label className="form-label">{t('invoice.vat_rate')}</label>
                          <input className="form-control form-control-sm" type="number" value={line.vatRate} onChange={e => updateLine(idx, { vatRate: Number(e.target.value) })} />
                        </div>
                        <div className="col-3">
                          <label className="form-label">{t('invoice.quantity')}</label>
                          <input className="form-control form-control-sm" type="number" value={line.quantity} onChange={e => updateLine(idx, { quantity: Number(e.target.value) })} />
                        </div>
                        <div className="col-6">
                          <label className="form-label">{t('invoice.unit_price')}</label>
                          <input className="form-control form-control-sm" type="number" step="0.01" value={line.unitPrice} onChange={e => updateLine(idx, { unitPrice: Number(e.target.value) })} />
                        </div>
                        <div className="col-6">
                          <label className="form-label">{t('invoice.total')}</label>
                          <input className="form-control form-control-sm" readOnly value={Number(line.lineTotal).toFixed(2)} />
                        </div>
                      </div>
                      <div className="mt-3 d-flex justify-content-between align-items-center">
                        <button className="btn btn-outline-info btn-sm" type="button" onClick={() => toggleCompact(idx)}>{t('common.view')}</button>
                        <button className="btn btn-success btn-sm" type="button" onClick={() => {
                          // Validate current product line
                          if (!lines[idx].name || lines[idx].unitPrice <= 0 || lines[idx].quantity <= 0) {
                            alert(t('invoice.product_validation_error'));
                            return;
                          }
                          alert(t('common.save'));
                        }}>{t('invoice.save')}</button>
                        <button className="btn btn-danger btn-sm" type="button" onClick={() => setDeleteLineIndex(idx)}>{t('common.delete')}</button>
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
              <h6 className="mb-0">{t('invoice.add_line')}</h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-2">
                  <label className="form-label">{t('invoice.type')}</label>
                  <select className="form-select" value={newLine.type} onChange={e => setNewLine({ ...newLine, type: e.target.value })}>
                    <option value="Product">{t('invoice.product_service')}</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">{t('invoice.name')}</label>
                  <input className="form-control" value={newLine.name} onChange={e => setNewLine({ ...newLine, name: e.target.value })} placeholder={t('invoice.name')} />
                </div>
                <div className="col-md-1">
                  <label className="form-label">{t('invoice.code')}</label>
                  <input className="form-control" value={newLine.code} onChange={e => setNewLine({ ...newLine, code: e.target.value })} placeholder={t('invoice.code')} />
                </div>
                <div className="col-md-1">
                  <label className="form-label">{t('invoice.units')}</label>
                  <select className="form-select" value={newLine.currencyUnit} onChange={e => setNewLine({ ...newLine, currencyUnit: e.target.value })}>
                    <option value="pcs">{t('invoice.pieces')}</option>
                    <option value="set">{t('invoice.set')}</option>
                  </select>
                </div>
                <div className="col-md-1">
                  <label className="form-label">{t('invoice.vat_rate')}</label>
                  <input className="form-control" type="number" value={newLine.vatRate} onChange={e => setNewLine({ ...newLine, vatRate: Number(e.target.value) })} />
                </div>
                <div className="col-md-1">
                  <label className="form-label">{t('invoice.quantity')}</label>
                  <input className="form-control" type="number" value={newLine.quantity} onChange={e => setNewLine({ ...newLine, quantity: Number(e.target.value) })} />
                </div>
                <div className="col-md-2">
                  <label className="form-label">{t('invoice.unit_price')}</label>
                  <input className="form-control" type="number" step="0.01" value={newLine.unitPrice} onChange={e => setNewLine({ ...newLine, unitPrice: Number(e.target.value) })} placeholder="0.00" />
                </div>
                <div className="col-md-1 d-flex flex-column align-items-end gap-2">
                  <button type="button" className="btn btn-success w-100" onClick={() => { addNewLine(); setShowInlineAdd(false); }}>{t('invoice.add')}</button>
                  <button type="button" className="btn btn-outline-danger w-100" onClick={() => setShowInlineAdd(false)}>{t('common.cancel')}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3">
          <button type="button" className="btn btn-success" onClick={addLine}>{t('invoice.add_products')}</button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="alert alert-danger mb-3">
          <h6>{t('invoice.validation_errors')}</h6>
          <ul className="mb-0">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-3 text-center mt-5">
        <button className="btn btn-success" type="submit">{t('invoice.save_invoice')}</button>
      </div>

      {/* Add Line Modal */}
      <div className={`modal fade ${showAddModal ? 'show' : ''}`} style={{ display: showAddModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{t('invoice.add_line')}</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">{t('invoice.type')}</label>
                <select className="form-select" value={newLine.type} onChange={e => setNewLine({ ...newLine, type: e.target.value })}>
                  <option value="Product">{t('invoice.product_service')}</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">{t('invoice.name')}</label>
                <input className="form-control" value={newLine.name} onChange={e => setNewLine({ ...newLine, name: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">{t('invoice.code')}</label>
                <input className="form-control" value={newLine.code} onChange={e => setNewLine({ ...newLine, code: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">{t('invoice.units')}</label>
                <select className="form-select" value={newLine.currencyUnit} onChange={e => setNewLine({ ...newLine, currencyUnit: e.target.value })}>
                  <option value="pcs">{t('invoice.pieces')}</option>
                  <option value="set">{t('invoice.set')}</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">{t('invoice.vat_rate')}</label>
                <input className="form-control" type="number" value={newLine.vatRate} onChange={e => setNewLine({ ...newLine, vatRate: Number(e.target.value) })} />
              </div>
              <div className="mb-3">
                <label className="form-label">{t('invoice.quantity')}</label>
                <input className="form-control" type="number" value={newLine.quantity} onChange={e => setNewLine({ ...newLine, quantity: Number(e.target.value) })} />
              </div>
              <div className="mb-3">
                <label className="form-label">{t('invoice.unit_price')}</label>
                <input className="form-control" type="number" step="0.01" value={newLine.unitPrice} onChange={e => setNewLine({ ...newLine, unitPrice: Number(e.target.value) })} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>{t('common.cancel')}</button>
              <button type="button" className="btn btn-primary" onClick={addNewLine}>{t('invoice.add')}</button>
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
              <h5 className="modal-title">{t('invoice.confirm_delete')}</h5>
              <button type="button" className="btn-close" onClick={() => setDeleteLineIndex(null)}></button>
            </div>
            <div className="modal-body">
              <p>{t('invoice.delete_confirmation')}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setDeleteLineIndex(null)}>{t('invoice.no')}</button>
              <button type="button" className="btn btn-danger" onClick={deleteLine}>{t('invoice.yes')}</button>
            </div>
          </div>
        </div>
      </div>
      {deleteLineIndex !== null && <div className="modal-backdrop fade show"></div>}

      </form>
    </div>
  );
}
