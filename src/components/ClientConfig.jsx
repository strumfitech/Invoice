import React, { useState, useEffect } from 'react';
import storage from '../services/storage.js';
import { useAuth } from './AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api/getFirmaByCUI';

export default function ClientConfig() {
  const [clients, setClients] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', cui: '14986667', email: '' });
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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
      body: JSON.stringify({
        cui: cleanCUI,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (!result.data) {
      alert('Nu s-au găsit date pentru acest CUI');
      return;
    }

    const firma = result.data;

    const adresa = [
      firma.adresa_strada && `Str. ${firma.adresa_strada}`,
      firma.adresa_nr_strada && `Nr. ${firma.adresa_nr_strada}`,
      firma.adresa_localitate,
      firma.adresa_judet,
    ]
      .filter(Boolean)
      .join(', ');

    setForm((prev) => ({
      ...prev,
      name: firma.nume || '',
      cui: firma.cod_fiscal || cleanCUI,
      address: adresa,
      phone: firma.tel || '',
      registrationCode: firma.cod_inmatriculare || '',
    }));
  } catch (err) {
    console.error('INFOCUI error:', err);
    alert('Eroare la preluarea datelor firmei');
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
      setForm({ name: '', address: '', cui: '', email: '', phone: '', registrationCode: '' });
      setShowDetails(false);
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
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label>CUI</label>
            <div className="input-group">
              <input
                className="form-control"
                value={form.cui}
                onChange={(e) => setForm({ ...form, cui: e.target.value })}
                placeholder="Introduceți CUI-ul"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  fetchCompanyData();
                  setShowDetails(true);
                }}
                disabled={loading}
              >
                {loading ? 'Se caută...' : 'Preia date'}
              </button>
            </div>
          </div>
        </div>

        {showDetails && (
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
              <label>Număr Telefon</label>
              <input
                type="tel"
                className="form-control"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label>Cod Înmatriculare</label>
              <input
                className="form-control"
                value={form.registrationCode}
                onChange={(e) => setForm({ ...form, registrationCode: e.target.value })}
              />
            </div>
          </div>
        )}

        {showDetails && (
          <button className="btn btn-primary mt-3" disabled={loading}>
            {editing !== null ? 'Actualizează' : 'Adaugă'}
          </button>
        )}
      </form>

      <h3 className="mt-5">Clienți Salvați</h3>
      {clients.length === 0 ? (
        <p>Niciun client adăugat.</p>
      ) : (
        <div className="row">
          {clients.map((client, index) => (
            <div key={client.id || index} className="col-12 col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{client.name}</h5>
                  <p className="card-text">
                    CUI: {client.cui}<br />
                    Adresă: {client.address}<br />
                    {client.phone && `Telefon: ${client.phone}`}<br />
                    {client.registrationCode && `Cod Înmatriculare: ${client.registrationCode}`}
                  </p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary" onClick={() => editClient(index)}>Editează</button>
                    <button className="btn btn-outline-danger" onClick={() => { setClientToDelete(clients[index]); setDeleteModal(true); }}>Șterge</button>
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
