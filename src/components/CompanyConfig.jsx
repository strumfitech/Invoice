import React, { useState, useEffect } from 'react';
import storage from '../services/storage.js';
import { useAuth } from './AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function CompanyConfig() {
  const [companies, setCompanies] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', bankAccount: '', cui: '', registrationNumber: '' });
  const [deleteModal, setDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCompanies();
    }
  }, [user]);

  const loadCompanies = async () => {
    const data = await storage.getCompanies(user.uid);
    setCompanies(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing !== null) {
        await storage.updateCompany(companies[editing].id, { ...form, userId: user.uid });
        await loadCompanies();
        setEditing(null);
      } else {
        await storage.saveCompany({ ...form, userId: user.uid });
        await loadCompanies();
      }
      setForm({ name: '', address: '', bankAccount: '', cui: '', registrationNumber: '' });
    } catch (error) {
      console.error('Error saving company:', error);
      alert('Eroare la salvarea companiei');
    }
  };

  const editCompany = (index) => {
    setForm(companies[index]);
    setEditing(index);
  };

  const deleteCompany = async (companyId) => {
    try {
      await storage.deleteCompany(companyId);
      await loadCompanies();
      setDeleteModal(false);
      setCompanyToDelete(null);
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Eroare la ștergerea companiei');
    }
  };

  const confirmDelete = () => {
    if (companyToDelete) {
      deleteCompany(companyToDelete.id);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          ← Înapoi la Dashboard
        </button>
      </div>
      <h2>Configurare Societate</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nume Companie</label>
            <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Adresa</label>
            <input className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Cont Bancar</label>
            <input className="form-control" value={form.bankAccount} onChange={e => setForm({ ...form, bankAccount: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">CUI</label>
            <input className="form-control" value={form.cui} onChange={e => setForm({ ...form, cui: e.target.value })} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nr Inregistrare</label>
            <input className="form-control" value={form.registrationNumber} onChange={e => setForm({ ...form, registrationNumber: e.target.value })} required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">{editing !== null ? 'Actualizează' : 'Adaugă'} Companie</button>
        {editing !== null && <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => { setEditing(null); setForm({ name: '', address: '', bankAccount: '', cui: '', registrationNumber: '' }); }}>Anulează</button>}
      </form>

      <h3>Companii Salvate</h3>
      {companies.length === 0 ? (
        <p>Nicio companie adăugată.</p>
      ) : (
        <div className="list-group">
          {companies.map((company, index) => (
            <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{company.name}</strong> - {company.address} - CUI: {company.cui}
              </div>
              <div>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editCompany(index)}>Editează</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => { setCompanyToDelete(companies[index]); setDeleteModal(true); }}>Șterge</button>
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
              <p>Ești sigur că vrei să ștergi compania {companyToDelete?.name}?</p>
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
