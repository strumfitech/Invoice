import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import storage from '../services/storage.js';
import { getExchangeRates, convertAmount } from '../services/currency.js';
import { useAuth } from './AuthContext.jsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const getTemplateStyles = (template) => {
  if (!template) return {};

  return {
    fontFamily: template.fonts?.body || 'Arial, sans-serif',
    color: template.colors?.text || '#333333',
    backgroundColor: template.colors?.secondary || '#f8f9fa',
    '--primary-color': template.colors?.primary || '#6E5B78',
    '--accent-color': template.colors?.accent || '#007bff'
  };
};

const applyTemplateToInvoice = (template, invoiceElement) => {
  if (!template || !invoiceElement) return;

  // Apply font family
  if (template.fonts?.body) {
    invoiceElement.style.fontFamily = template.fonts.body;
  }

  // Apply colors
  if (template.colors?.text) {
    invoiceElement.style.color = template.colors.text;
  }
  if (template.colors?.secondary) {
    invoiceElement.style.backgroundColor = template.colors.secondary;
  }

  // Apply header text
  const headerElement = invoiceElement.querySelector('h1');
  if (headerElement && template.headerText) {
    headerElement.textContent = template.headerText;
  }

  // Apply logo if exists
  if (template.showLogo && template.logo) {
    const logoImg = document.createElement('img');
    logoImg.src = template.logo;
    logoImg.style.maxHeight = '50px';
    logoImg.style.marginBottom = '10px';

    const headerContainer = invoiceElement.querySelector('.d-flex.justify-content-between.mb-4');
    if (headerContainer) {
      headerContainer.insertBefore(logoImg, headerContainer.firstChild);
    }
  }

  // Apply footer text
  if (template.footerText) {
    const footerDiv = document.createElement('div');
    footerDiv.textContent = template.footerText;
    footerDiv.style.marginTop = '20px';
    footerDiv.style.fontSize = '12px';
    footerDiv.style.textAlign = 'center';
    invoiceElement.appendChild(footerDiv);
  }
};

export default function InvoicePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [rates, setRates] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fitPreview, setFitPreview] = useState(true);
  const [previewScale, setPreviewScale] = useState(1);
  const [invoiceSize, setInvoiceSize] = useState({ width: 0, height: 0 });

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

  // Apply template after component mounts if invoice has one
  React.useLayoutEffect(() => {
    if (!loading) {
      const currentInv = invoices.find(v => String(v.id) === String(id));
      if (currentInv && currentInv.template) {
        const invoiceElement = document.getElementById('invoice-content');
        if (invoiceElement) {
          applyTemplateToInvoice(currentInv.template, invoiceElement);
        }
      }
    }
  }, [loading, invoices, id]);

  const inv = invoices.find(v => String(v.id) === String(id));
  const lines = inv?.lines || [];

  const updatePreviewScale = React.useCallback(() => {
    const container = document.querySelector('.invoice-container-mobile');
    const invoiceElement = document.getElementById('invoice-content');
    if (!container || !invoiceElement) return;

    const invoiceWidth = invoiceElement.scrollWidth;
    const invoiceHeight = invoiceElement.scrollHeight;
    if (!invoiceWidth || !invoiceHeight) return;

    const containerRect = container.getBoundingClientRect();
    const availableWidth = containerRect.width;
    const availableHeight = window.innerHeight - containerRect.top - 24;
    if (availableWidth <= 0 || availableHeight <= 0) return;

    const scale = Math.min(availableWidth / invoiceWidth, availableHeight / invoiceHeight, 1);
    setInvoiceSize({ width: invoiceWidth, height: invoiceHeight });
    setPreviewScale(Number.isFinite(scale) ? scale : 1);
  }, []);

  useEffect(() => {
    if (!fitPreview || !inv) {
      setPreviewScale(1);
      return;
    }

    const handleResize = () => {
      window.requestAnimationFrame(updatePreviewScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [fitPreview, inv, updatePreviewScale, id, lines.length]);

  if (loading) {
    return <div className="container py-5 text-center">{t('common.loading')}</div>;
  }

  if (!inv) {
    return (
      <div className="container py-5">
        <h2>{t('invoice_preview.not_found_title')}</h2>
        <p>{t('invoice_preview.not_found_body', { id })}</p>
      </div>
    );
  }

  const company = inv.company || {};
  const recipient = inv.recipient || {};

  // Function to format address on multiple lines
  const formatAddress = (address) => {
    if (!address) return '';

    // Split by comma and limit to 2 lines
    const parts = address.split(',');
    if (parts.length <= 2) {
      return parts.join(',\n');
    }

    // If more than 2 parts, combine first two and put rest on next line
    const firstLine = parts.slice(0, 2).join(', ');
    const secondLine = parts.slice(2).join(', ');
    return `${firstLine}\n${secondLine}`;
  };


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

  const scaleWrapStyle = fitPreview && invoiceSize.width && invoiceSize.height
    ? {
        width: `${invoiceSize.width * previewScale}px`,
        height: `${invoiceSize.height * previewScale}px`,
        margin: '0 auto'
      }
    : {};

  const invoiceStyle = {
    backgroundColor: 'white',
    padding: '8mm',
    minHeight: '297mm',
    width: '210mm',
    color: '#1a1a1a',
    margin: fitPreview ? '0' : '0 auto',
    transformOrigin: fitPreview ? 'top left' : 'top center',
    transform: fitPreview ? `scale(${previewScale})` : 'none',
    boxSizing: 'border-box'
  };

  return (
    <>
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <button className="btn glass-card p-2 px-3 fw-bold" onClick={() => navigate('/invoices')}>
                ← <span className="d-none d-sm-inline">{t('invoice_preview.back_to_history')}</span>
              </button>
              <div className="text-center order-3 order-sm-0 w-100 w-sm-auto mt-2 mt-sm-0">
                <h2 className="fw-bold mb-0" style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>{t('common.invoice')} <span className="stat-glow">#{inv.id}</span></h2>
                <p className="text-dimmed small mb-0">{t('invoice_preview.generated_on')} {new Date(inv.date).toLocaleDateString()}</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn-neon p-2 px-3 d-none d-sm-block" onClick={handleSaveAsPDF}>{t('invoice_preview.export_pdf')}</button>
                <button className="btn glass-card p-2" onClick={handlePrint} title={t('invoice_preview.print')}>🖨️</button>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-lg-9 mb-4 overflow-hidden">
                <div className="invoice-container-mobile" style={{ overflowX: 'auto', paddingBottom: '20px', WebkitOverflowScrolling: 'touch' }}>
                  <div className="invoice-scale-wrap" style={scaleWrapStyle}>
                    <div id="invoice-content" className="invoice-content shadow-lg rounded-4" style={invoiceStyle}>
                    <div className="d-flex justify-content-between mb-5 gap-3" style={{ borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                      <div style={{ maxWidth: '35%' }}>
                        <h6 className="fw-bold mb-2">{t('invoice_preview.supplier')}:</h6>
                        <div className="fw-bold" style={{ fontSize: '14px' }}>{company.name || ''}</div>
                        <div style={{ fontSize: '11px', color: '#666' }}>{company.address || ''}</div>
                        <div style={{ fontSize: '11px' }}><strong>{t('invoice_preview.account')}:</strong> {company.bankAccount || ''}</div>
                        <div style={{ fontSize: '11px' }}><strong>{t('invoice_preview.cui')}:</strong> {company.cui || ''}</div>
                      </div>

                      <div className="text-center">
                        <h1 className="fw-bold" style={{ fontSize: '26px', color: '#1a1a1a', marginBottom: '5px' }}>{t('invoice_preview.invoice_label')}</h1>
                        <div className="fw-bold" style={{ fontSize: '16px' }}>{t('invoice_preview.number_label')} {inv.id}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{t('common.date')}: {new Date(inv.date).toLocaleDateString()}</div>
                      </div>

                      <div className="text-end" style={{ maxWidth: '35%' }}>
                        <h6 className="fw-bold mb-2">{t('invoice_preview.recipient')}:</h6>
                        <div className="fw-bold" style={{ fontSize: '14px' }}>{recipient.name || ''}</div>
                        <div style={{ fontSize: '11px', whiteSpace: 'pre-line', color: '#666' }}>{formatAddress(recipient.address || '')}</div>
                        <div style={{ fontSize: '11px' }}><strong>{t('invoice_preview.cui')}:</strong> {recipient.cui || ''}</div>
                      </div>
                    </div>
                    <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                      <table className="invoice-table" style={{ marginBottom: '20px', borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
                        <thead>
                          <tr>
                            <th style={{ padding: '10px', border: '1px solid black' }}>{t('invoice.type')}</th>
                            <th style={{ padding: '10px', border: '1px solid black' }}>{t('invoice.name')}</th>
                            <th style={{ padding: '10px', border: '1px solid black' }}>{t('invoice.code')}</th>
                            <th style={{ padding: '10px', border: '1px solid black' }}>{t('invoice.units')}</th>
                            <th style={{ padding: '10px', border: '1px solid black' }}>{t('invoice.vat_rate')}</th>
                            <th style={{ padding: '10px', border: '1px solid black' }}>{t('invoice.quantity')}</th>
                            <th style={{ padding: '10px', border: '1px solid black' }}>{t('invoice.unit_price')}</th>
                            <th style={{ padding: '10px', border: '1px solid black' }}>{t('invoice_preview.value')}</th>
                            <th style={{ padding: '10px', border: '1px solid black' }}>{t('invoice.total')}</th>
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
                      <div className="text-end mt-4">
                        <div style={{ fontSize: '14px' }}><strong>{t('invoice_preview.subtotal')}:</strong> {Number(inv.subtotal).toFixed(2)} {inv.currency} {inv.currency !== 'RON' && rates.RON ? `(${convertAmount(inv.subtotal, inv.currency, 'RON', rates).toFixed(2)} RON)` : ''}</div>
                        <div style={{ fontSize: '14px' }}><strong>{t('invoice_preview.vat')}:</strong> {Number(inv.totalTax).toFixed(2)} {inv.currency} {inv.currency !== 'RON' && rates.RON ? `(${convertAmount(inv.totalTax, inv.currency, 'RON', rates).toFixed(2)} RON)` : ''}</div>
                        <div className="fw-bold mt-2" style={{ fontSize: '18px', borderTop: '2px solid #eee', paddingTop: '10px' }}>
                          <strong>{t('common.total')}:</strong> {Number(inv.total).toFixed(2)} {inv.currency} {inv.currency !== 'RON' && rates.RON ? `(${convertAmount(inv.total, inv.currency, 'RON', rates).toFixed(2)} RON)` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            <div className="col-12 col-lg-3 mt-4 mt-lg-0">
                    <div className="glass-card p-4 sticky-top" style={{ top: '20px' }}>
                      <h5 className="fw-bold mb-4">{t('invoice_preview.quick_actions')}</h5>
                      <button className="btn-neon w-100 mb-3 py-3" onClick={handleSaveAsPDF}><span aria-hidden="true">💾</span> {t('invoice_preview.download_pdf')}</button>
                      <button className="btn glass-card w-100 mb-3 py-2 text-start" onClick={handlePrint}><span aria-hidden="true">🖨️</span> {t('invoice_preview.print_invoice')}</button>
                      <button className="btn glass-card w-100 mb-3 py-2 text-start" onClick={handlePreviewInvoice}><span aria-hidden="true">🔍</span> {t('invoice_preview.preview_image')}</button>
                      <button
                        className="btn glass-card w-100 mb-3 py-2 text-start zoom-controls"
                        onClick={() => setFitPreview((current) => !current)}
                      >
                        {fitPreview ? t('invoice_preview.view_mode_detailed') : t('invoice_preview.view_mode_fit')}
                      </button>

                      <hr className="my-4" style={{ borderColor: 'var(--glass-border)' }} />

                      <h5 className="fw-bold mb-3 small text-dimmed">{t('invoice_preview.quick_summary')}</h5>
                      <div className="mb-2 d-flex justify-content-between">
                        <span className="small">{t('invoice_preview.subtotal')}:</span>
                        <span className="fw-bold">{Number(inv.subtotal).toFixed(2)} {inv.currency}</span>
                      </div>
                      <div className="mb-4 d-flex justify-content-between">
                        <span className="small">{t('invoice_preview.total_vat')}:</span>
                        <span className="fw-bold">{Number(inv.totalTax).toFixed(2)} {inv.currency}</span>
                      </div>
                      <div className="stat-glow h3 text-end">{Number(inv.total).toFixed(2)} {inv.currency}</div>
                    </div>
                  </div>
            </div>

            {/* Preview Modal */}
            <div className={`modal fade ${previewModal ? 'show' : ''}`} style={{ display: previewModal ? 'block' : 'none' }} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content glass-card border-0" style={{ background: 'var(--bg-dark)' }}>
                  <div className="modal-header border-0">
                    <h5 className="modal-title fw-bold">{t('invoice_preview.preview_title')}</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setPreviewModal(false)}></button>
                  </div>
                  <div className="modal-body text-center">
                    {previewImage && <img src={previewImage} alt={t('invoice_preview.preview_alt')} className="rounded-3 shadow" style={{ maxWidth: '100%', height: 'auto' }} />}
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn glass-card py-2 px-4" onClick={() => setPreviewModal(false)}>{t('invoice_preview.close')}</button>
                  </div>
                </div>
              </div>
            </div>
            {previewModal && <div className="modal-backdrop fade show"></div>}

            <style>{`
        .invoice-table th, .invoice-table td {
          font-size: 11px;
          padding: 8px !important;
          word-break: break-word;
        }
        
        @media (max-width: 991px) {
          .invoice-container-mobile {
            background: rgba(0,0,0,0.05);
            border-radius: 15px;
            padding: 10px !important;
          }
          
          #invoice-content {
            box-shadow: none !important;
            border: 1px solid #eee;
          }
        }

        @media (max-width: 576px) {
          #invoice-content {
            width: 210mm !important; /* Keep A4 width for PDF generation consistency */
          }
          
          .invoice-container-mobile {
            height: auto;
            min-height: 400px;
            overflow: visible;
          }
        }
        
        /* Reset background for print */
        @media print {
          body { background: white !important; }
          .container-fluid { padding: 0 !important; }
          .row { margin: 0 !important; }
          .col-lg-9 { width: 100% !important; padding: 0 !important; }
          .invoice-content { 
            box-shadow: none !important; 
            margin: 0 !important; 
            width: 100% !important; 
            transform: none !important;
          }
          .btn, .glass-card.sticky-top, .zoom-controls, .d-flex.justify-content-between.align-items-center { 
            display: none !important; 
          }
        }
      `}</style>
          </div>
        </div>
      </div>
    </>
        );
}
