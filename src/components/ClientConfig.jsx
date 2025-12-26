import React, { useState, useEffect } from 'react';
import storage from '../services/storage.js';
import { useAuth } from './AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://us-central1-factura-b478b.cloudfunctions.net/getFirmaByCUI';

export default function ClientConfig() {
  const [clients, setClients] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', cui: '', email: '' });
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) loadClients();
  }, [user]);

  const loadClients = async () => {
    const data = await storage.getClients(user.uid);
    setClients(data);
  };

  /* =========================
     🔹 ANAF / CUI INTEGRATION
     ========================= */

  const normalizeCUI = (value) =>
    value.replace(/RO/gi, '').replace(/\s+/g, '').trim();

  const fetchCompanyData = async () => {
    const cleanCUI = normalizeCUI(form.cui);

    if (!cleanCUI || isNaN(cleanCUI)) {
      alert('Introduceți un CUI valid');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify([
          { cui: Number(cleanCUI) }
      ]),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        alert('Nu s-au găsit date pentru acest CUI');
        return;
      }

      const firma = data[0];
      const general = firma.date_generale || {};
      const address = firma.adresa_domiciliu_fiscal || {};

      setForm((prev) => ({
        ...prev,
        name: general.denumire || '',
        cui: general.cui || cleanCUI,
        address: [
          address.strada,
          address.numar,
          address.localitate,
          address.judet,
        ]
          .filter(Boolean)
          .join(', '),
      }));
    } catch (err) {
      console.error('ANAF error:', err);
      alert('Eroare la preluarea datelor din ANAF');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     🔹 CRUD EXISTENT (neschimbat)
     ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing !== null) {
        await storage.updateClient(clients[editing].id, {
          ...form,
          userId: user.uid,
        });
        setEditing(null);
      } else {
        await storage.saveClient({ ...form, userId: user.uid });
      }
      await loadClients();
      setForm({ name: '', address: '', cui: '', email: '' });
    } catch (error) {
      console.error(error);
      alert('Eroare la salvare');
    }
  };

  const editClient = (index) => {
    setForm(clients[index]);
    setEditing(index);
  };

  const deleteClient = async (clientId) => {
    await storage.deleteClient(clientId);
    await loadClients();
    setDeleteModal(false);
  };

  const confirmDelete = () => {
    if (clientToDelete) deleteClient(clientToDelete.id);
  };

  /* =========================
     🔹 UI (neschimbat)
     ========================= */

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/')}>
        ← Înapoi
      </button>

      <h2>Adaugă Client</h2>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label>Nume Client</label>
            <input
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="col-md-6">
            <label>Adresă</label>
            <input
              className="form-control"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>

          <div className="col-md-6">
            <label>CUI</label>
            <div className="input-group">
              <input
                className="form-control"
                value={form.cui}
                onChange={(e) => setForm({ ...form, cui: e.target.value })}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={fetchCompanyData}
                disabled={loading}
              >
                {loading ? 'Se caută...' : 'Preia date'}
              </button>
            </div>
          </div>

          <div className="col-md-6">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <button className="btn btn-primary mt-3" disabled={loading}>
          {editing !== null ? 'Actualizează' : 'Adaugă'}
        </button>
      </form>
    </div>
  );
}
