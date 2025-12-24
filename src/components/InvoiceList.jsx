import React, { useEffect, useState } from 'react';
import storage from '../services/storage.js';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function InvoiceList(){
  const [invoices, setInvoices] = useState([]);
  const [query, setQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const { user } = useAuth();

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
      alert('Eroare la ștergerea facturii');
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
                  <strong>Factura {inv.id}</strong> - {new Date(inv.date).toLocaleString()} - Total: {Number(inv.total).toFixed(2)} {inv.currency}
                </div>
                <div className="d-flex gap-2">
                  <Link to={`/invoice/${inv.id}/preview`} className="btn btn-sm btn-outline-primary">Preview</Link>
                  <button className="btn btn-sm btn-outline-success" onClick={()=>exportSingleInvoice(inv)}>Export JSON</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => { setInvoiceToDelete(inv); setDeleteModal(true); }}>Sterge</button>
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
              <h5 className="modal-title">Confirmare Ștergere</h5>
              <button type="button" className="btn-close" onClick={() => setDeleteModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Ești sigur că vrei să ștergi factura {invoiceToDelete?.id}?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary px-4 py-2" onClick={() => setDeleteModal(false)}>Nu</button>
              <button type="button" className="btn btn-danger px-4 py-2" onClick={confirmDelete}>Da</button>
            </div>
          </div>
        </div>
      </div>
      {deleteModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}
