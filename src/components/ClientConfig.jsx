import React, { useState, useEffect } from 'react';
import storage from '../services/storage.js';
import { useAuth } from './AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function ClientConfig() {
  const [clients, setClients] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', cui: '', email: '' });
  const [deleteModal, setDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadClients();
    }
  }, [user]);

  const loadClients = async () => {
    const data = await storage.getClients(user.uid);
    setClients(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing !== null) {
        await storage.updateClient(clients[editing].id, { ...form, userId: user.uid });
        await loadClients();
        setEditing(null);
      } else {
        await storage.saveClient({ ...form, userId: user.uid });
        await loadClients();
      }
      setForm({ name: '', address: '', cui: '', email: '' });
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Eroare la salvarea clientului');
    }
  };

  const editClient = (index) => {
    setForm(clients[index]);
    setEditing(index);
  };

  const deleteClient = async (clientId) => {
    try {
      await storage.deleteClient(clientId);
      await loadClients();
      setDeleteModal(false);
      setClientToDelete(null);
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Eroare la ștergerea clientului');
    }
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete.id);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          ← Înapoi la Dashboard
        </button>
      </div>
      <h2>Adaugă Client</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nume Client</label>
            <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Adresa</label>
            <input className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">CUI</label>
            <input className="form-control" value={form.cui} onChange={e => setForm({ ...form, cui: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">{editing !== null ? 'Actualizează' : 'Adaugă'} Client</button>
        {editing !== null && <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => { setEditing(null); setForm({ name: '', address: '', cui: '' }); }}>Anulează</button>}
      </form>

      <h3>Clienți Salvați</h3>
      {clients.length === 0 ? (
        <p>Niciun client adăugat.</p>
      ) : (
        <div className="list-group">
          {clients.map((client, index) => (
            <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{client.name}</strong> - {client.address} - CUI: {client.cui}
              </div>
              <div>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editClient(index)}>Editează</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => { setClientToDelete(clients[index]); setDeleteModal(true); }}>Șterge</button>
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
              <p>Ești sigur că vrei să ștergi clientul {clientToDelete?.name}?</p>
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
