import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import storage from '../services/storage.js';
import { getExchangeRates, convertAmount } from '../services/currency.js';
import { useAuth } from './AuthContext.jsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function InvoicePreview(){
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rates, setRates] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (user) {
      loadInvoices();
    }
  }, [user]);

  useEffect(() => {
    getExchangeRates().then(setRates);
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await storage.getInvoices(user.uid);
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container py-5 text-center">Se încarcă...</div>;
  }

  const inv = invoices.find(v => String(v.id) === String(id));

  if(!inv){
    return (
      <div className="container py-5">
        <h2>Factura negăsită</h2>
        <p>Factura cu ID-ul {id} nu a fost găsită în istoric.</p>
      </div>
    );
  }

  const company = inv.company || {};
  const recipient = inv.recipient || {};
  const lines = inv.lines || [];

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsPDF = () => {
    const element = document.getElementById('invoice-content');
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Factura_${inv.id}.pdf`);
    });
  };

  const handlePreviewInvoice = () => {
    const element = document.getElementById('invoice-content');
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      setPreviewImage(imgData);
      setPreviewModal(true);
    });
  };

  return (
    <div className="container py-5">
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-outline-secondary back-btn" onClick={() => navigate('/')}>← Înapoi</button>
          <h2 className="mb-0">Factura #{inv.id}</h2>
        </div>
        <div className="d-flex justify-content-center gap-2 mt-3 invoice-preview-buttons">
          <button className="btn btn-secondary" onClick={handlePrint}>Print</button>
          <button className="btn btn-primary" onClick={handleSaveAsPDF}>Save as PDF</button>
          <button className="btn btn-outline-primary" onClick={handlePreviewInvoice}>Preview Invoice</button>
        </div>
      </div>
      <div id="invoice-content" className="invoice-content" style={{ backgroundColor: 'white', padding: '8mm', minHeight: '247mm', boxSizing: 'border-box', maxWidth: '210mm', margin: '0 auto', fontSize: '14px', lineHeight: '1.4' }}>
        <div className="d-flex justify-content-between mb-4">
          <div>
            <h5>Companie:</h5>
            <div>{company.name || ''}</div>
            <div>{company.address || ''}</div>
            <div>Cont: {company.bankAccount || ''}</div>
            <div>CUI: {company.cui || ''}</div>
            <div>Nr Inregistrare: {company.registrationNumber || ''}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1>Factura</h1>
            <h3>Nr. {inv.id}</h3>
            <div>Data: {new Date(inv.date).toLocaleDateString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h5>Destinatar:</h5>
            <div>{recipient.name || ''}</div>
            <div>{recipient.address || ''}</div>
            <div>CUI: {recipient.cui || ''}</div>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="invoice-table" style={{ marginBottom: '20px', borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', border: '1px solid black' }}>Tip</th>
              <th style={{ padding: '10px', border: '1px solid black' }}>Denumire articol</th>
              <th style={{ padding: '10px', border: '1px solid black' }}>Cod</th>
              <th style={{ padding: '10px', border: '1px solid black' }}>Unitati</th>
              <th style={{ padding: '10px', border: '1px solid black' }}>TVA %</th>
              <th style={{ padding: '10px', border: '1px solid black' }}>Cantitate</th>
              <th style={{ padding: '10px', border: '1px solid black' }}>Pret Unitar</th>
              <th style={{ padding: '10px', border: '1px solid black' }}>Valoare</th>
              <th style={{ padding: '10px', border: '1px solid black' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((ln) => (
              <tr key={ln.id}>
                <td style={{ padding: '10px', border: '1px solid black' }}>{ln.type}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{ln.name}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{ln.code}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{ln.currencyUnit}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{ln.vatRate}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{ln.quantity}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{Number(ln.unitPrice).toFixed(2)}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{Number(ln.lineValue).toFixed(2)}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{Number(ln.lineTotal).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="text-end">
          <div><strong>Subtotal:</strong> {Number(inv.subtotal).toFixed(2)} {inv.currency} {inv.currency !== 'RON' && rates.RON ? `(${convertAmount(inv.subtotal, inv.currency, 'RON', rates).toFixed(2)} RON)` : ''}</div>
          <div><strong>TVA:</strong> {Number(inv.totalTax).toFixed(2)} {inv.currency} {inv.currency !== 'RON' && rates.RON ? `(${convertAmount(inv.totalTax, inv.currency, 'RON', rates).toFixed(2)} RON)` : ''}</div>
          <div><strong>Total:</strong> {Number(inv.total).toFixed(2)} {inv.currency} {inv.currency !== 'RON' && rates.RON ? `(${convertAmount(inv.total, inv.currency, 'RON', rates).toFixed(2)} RON)` : ''}</div>
        </div>
      </div>

      {/* Preview Modal */}
      <div className={`modal fade ${previewModal ? 'show' : ''}`} style={{ display: previewModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Preview Factură</h5>
              <button type="button" className="btn-close" onClick={() => setPreviewModal(false)}></button>
            </div>
            <div className="modal-body text-center">
              {previewImage && <img src={previewImage} alt="Factura Preview" style={{ maxWidth: '100%', height: 'auto' }} />}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setPreviewModal(false)}>Închide</button>
            </div>
          </div>
        </div>
      </div>
      {previewModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}
