import React, { useState, useEffect } from 'react';
import storage from '../services/storage.js';
import { useAuth } from './AuthContext.jsx';

export default function ClientConfig() {
  const [clients, setClients] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', cui: '', email: '' });
  const { user } = useAuth();

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

  const deleteClient = async (index) => {
    try {
      await storage.deleteClient(clients[index].id);
      await loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Eroare la ștergerea clientului');
    }
  };

  return (
    <div className="container py-5">
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
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteClient(index)}>Șterge</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
