import React, { useEffect, useState } from 'react';
import storage from '../services/storage.js';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { useTranslation } from 'react-i18next';

export default function InvoiceList(){
  const [invoices, setInvoices] = useState([]);
  const [query, setQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(()=>{
    if (user) {
      loadInvoices();
    }
  }, [user]);

  const loadInvoices = async () => {
    const data = await storage.getInvoices(user.uid);
    setInvoices(data);
  };

  const deleteInvoice = async (invoiceId) => {
    try {
      await storage.deleteInvoice(invoiceId);
      await loadInvoices(); // Reload the list
      setDeleteModal(false);
      setInvoiceToDelete(null);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert(t('common.error_deleting_invoice'));
    }
  };

  const confirmDelete = () => {
    if (invoiceToDelete) {
      deleteInvoice(invoiceToDelete.firestoreId);
    }
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
      <h2>{t('invoice_list.title')}</h2>
      <div className="mb-3">
        <input className="form-control" placeholder={t('invoice_list.search')} value={query} onChange={e=>setQuery(e.target.value)} />
      </div>
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={exportInvoices}>{t('invoice_list.export')}</button>
      </div>
      {filtered.length === 0 ? (
        <p>{t('invoice_list.no_invoices')}</p>
      ) : (
        <div className="row">
          {filtered.map(inv => (
            <div key={inv.id} className="col-12 col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="flex-grow-1">
                    <h5 className="card-title">{t('common.invoice')} {inv.id}</h5>
                    <p className="card-text">
                      {t('common.date')}: {new Date(inv.date).toLocaleString()}<br />
                      {t('common.total')}: {Number(inv.total).toFixed(2)} {inv.currency}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="d-flex gap-2 justify-content-center">
                      <Link to={`/invoice/${inv.id}/preview`} className="btn btn-primary">{t('invoice_list.preview')}</Link>
                      <button className="btn btn-success" onClick={()=>exportSingleInvoice(inv)}>{t('invoice_list.export_single')}</button>
                      <button className="btn btn-danger" onClick={() => { setInvoiceToDelete(inv); setDeleteModal(true); }}>{t('invoice_list.delete')}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <div className={`modal fade ${deleteModal ? 'show' : ''}`} style={{ display: deleteModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{t('invoice_list.confirm_delete')}</h5>
              <button type="button" className="btn-close" onClick={() => setDeleteModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>{t('invoice_list.delete_confirmation')} {invoiceToDelete?.id}?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary px-4 py-2" onClick={() => setDeleteModal(false)}>{t('common.no')}</button>
              <button type="button" className="btn btn-danger px-4 py-2" onClick={confirmDelete}>{t('common.yes')}</button>
            </div>
          </div>
        </div>
      </div>
      {deleteModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}
