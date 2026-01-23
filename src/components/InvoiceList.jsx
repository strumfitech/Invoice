import React, { useEffect, useState } from 'react';
import storage from '../services/storage.js';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { useTranslation } from 'react-i18next';

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [query, setQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
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

  const exportInvoices = () => {
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

  const exportSingleInvoice = (inv) => {
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
    <div className="py-2">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div className="flex-grow-1" style={{ minWidth: '300px' }}>
          <input
            className="input-2026 w-100"
            placeholder={t('invoice_list.search')}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button className="btn glass-card py-2 px-4 fw-bold" onClick={exportInvoices}>
          📤 {t('invoice_list.export')}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-5 glass-card">
          <p className="text-dimmed mb-0">{t('invoice_list.no_invoices')}</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map(inv => (
            <div key={inv.id} className="col-12 col-md-6 col-xl-4">
              <div className="glass-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold mb-1">#{inv.id}</h5>
                    <p className="text-dimmed small mb-0">{new Date(inv.date).toLocaleDateString()}</p>
                  </div>
                  <div className="stat-glow h5 mb-0">
                    {Number(inv.total).toFixed(2)} <span className="small">{inv.currency}</span>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <Link to={`/invoice/${inv.id}/preview`} className="btn-neon flex-grow-1 text-center py-2 text-decoration-none">
                    🔎 {t('invoice_list.preview')}
                  </Link>
                  <button className="btn glass-card p-2" onClick={() => exportSingleInvoice(inv)} title={t('invoice_list.export_single')}>
                    💾
                  </button>
                  <button className="btn glass-card p-2 text-danger" onClick={() => { setInvoiceToDelete(inv); setDeleteModal(true); }} title={t('invoice_list.delete')}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <div className={`modal fade ${deleteModal ? 'show' : ''}`} style={{ display: deleteModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content glass-card border-0" style={{ background: 'var(--bg-dark)' }}>
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">{t('invoice_list.confirm_delete')}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setDeleteModal(false)}></button>
            </div>
            <div className="modal-body">
              <p className="text-dimmed">{t('invoice_list.delete_confirmation')} <span className="text-white fw-bold">#{invoiceToDelete?.id}</span>?</p>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn glass-card px-4" onClick={() => setDeleteModal(false)}>{t('common.no')}</button>
              <button type="button" className="btn btn-danger px-4" onClick={confirmDelete}>{t('common.yes')}</button>
            </div>
          </div>
        </div>
      </div>
      {deleteModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}
