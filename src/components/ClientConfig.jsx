import React, { useState, useEffect } from 'react';
import storage from '../services/storage.js';
import { useAuth } from './AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
    alert(t('client.cui_error'));
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
      alert(t('client.no_data_found'));
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
    alert(t('client.fetch_error'));
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
      alert(t('client.save_error'));
    }
  };

  const editClient = (index) => {
    setForm(clients[index]);
    setEditing(index);
    setShowDetails(true); // Automatically show all fields when editing
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
        ← {t('common.back')}
      </button>

      <h2>{t('client.add_client')}</h2>

      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label>{t('client.cui')}</label>
            <div className="input-group">
              <input
                className="form-control"
                value={form.cui}
                onChange={(e) => setForm({ ...form, cui: e.target.value })}
                placeholder={t('client.cui')}
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
                {loading ? t('client.searching') : t('client.fetch_data')}
              </button>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="row g-3">
            <div className="col-md-6">
              <label>{t('client.name')}</label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <label>{t('client.address')}</label>
              <input
                className="form-control"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
            </div>



            <div className="col-md-6">
              <label>{t('client.phone')}</label>
              <input
                type="tel"
                className="form-control"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label>{t('client.registration_code')}</label>
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
            {editing !== null ? t('client.update') : t('client.add')}
          </button>
        )}
      </form>

      <h3 className="mt-5">{t('client.saved_clients')}</h3>
      {clients.length === 0 ? (
        <p>{t('client.no_clients')}</p>
      ) : (
        <div className="row">
          {clients.map((client, index) => (
            <div key={client.id || index} className="col-12 col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{client.name}</h5>
                  <p className="card-text">
                    {t('client.cui')}: {client.cui}<br />
                    {t('client.address')}: {client.address}<br />
                    {client.phone && `${t('client.phone')}: ${client.phone}`}<br />
                    {client.registrationCode && `${t('client.registration_code')}: ${client.registrationCode}`}
                  </p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary" onClick={() => editClient(index)}>{t('client.edit')}</button>
                    <button className="btn btn-outline-danger" onClick={() => { setClientToDelete(clients[index]); setDeleteModal(true); }}>{t('client.delete')}</button>
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
              <h5 className="modal-title">{t('client.delete')}</h5>
              <button type="button" className="btn-close" onClick={() => setDeleteModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>{t('client.delete_confirmation')} {clientToDelete?.name}?</p>
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
