import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Templates() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Default template structure
  const defaultTemplate = {
    id: null,
    name: 'Template Nou',
    layout: 'classic', // classic, modern, minimalist
    colors: {
      primary: '#6E5B78',
      secondary: '#f8f9fa',
      text: '#333333',
      accent: '#007bff'
    },
    fonts: {
      heading: 'Arial, sans-serif',
      body: 'Arial, sans-serif',
      size: {
        heading: '18px',
        body: '14px',
        small: '12px'
      }
    },
    logo: null, // base64 image
    showLogo: true,
    headerText: 'Factura',
    footerText: '',
    paperSize: 'A4' // A4, Letter
  };

  useEffect(() => {
    if (user) {
      loadTemplates();
    }
  }, [user]);

  const loadTemplates = () => {
    const saved = localStorage.getItem(`templates_${user.uid}`);
    if (saved) {
      setTemplates(JSON.parse(saved));
    } else {
      // Add default template
      const defaultTemplates = [
        {
          ...defaultTemplate,
          id: 'default-classic',
          name: 'Clasic',
          layout: 'classic'
        },
        {
          ...defaultTemplate,
          id: 'default-modern',
          name: 'Modern',
          layout: 'modern',
          colors: {
            primary: '#2c3e50',
            secondary: '#ecf0f1',
            text: '#34495e',
            accent: '#3498db'
          }
        },
        {
          ...defaultTemplate,
          id: 'default-minimalist',
          name: 'Minimalist',
          layout: 'minimalist',
          colors: {
            primary: '#ffffff',
            secondary: '#f8f9fa',
            text: '#212529',
            accent: '#6c757d'
          }
        }
      ];
      setTemplates(defaultTemplates);
      localStorage.setItem(`templates_${user.uid}`, JSON.stringify(defaultTemplates));
    }
  };

  const saveTemplates = (newTemplates) => {
    setTemplates(newTemplates);
    localStorage.setItem(`templates_${user.uid}`, JSON.stringify(newTemplates));
  };

  const createNewTemplate = () => {
    const newTemplate = {
      ...defaultTemplate,
      id: Date.now().toString(),
      name: `Template ${templates.length + 1}`
    };
    setCurrentTemplate(newTemplate);
    setIsEditing(true);
  };

  const editTemplate = (template) => {
    setCurrentTemplate({ ...template });
    setIsEditing(true);
  };

  const saveTemplate = () => {
    if (!currentTemplate.name.trim()) {
      alert('Introduceți un nume pentru template');
      return;
    }

    const updatedTemplates = [...templates];
    const existingIndex = updatedTemplates.findIndex(t => t.id === currentTemplate.id);

    if (existingIndex >= 0) {
      updatedTemplates[existingIndex] = currentTemplate;
    } else {
      updatedTemplates.push(currentTemplate);
    }

    saveTemplates(updatedTemplates);
    setIsEditing(false);
    setCurrentTemplate(null);
  };

  const deleteTemplate = (templateId) => {
    if (templateId.startsWith('default-')) {
      alert('Nu puteți șterge template-urile implicite');
      return;
    }

    if (confirm('Sigur doriți să ștergeți acest template?')) {
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      saveTemplates(updatedTemplates);
    }
  };

  const duplicateTemplate = (template) => {
    const duplicated = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copie)`
    };
    const updatedTemplates = [...templates, duplicated];
    saveTemplates(updatedTemplates);
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentTemplate({
          ...currentTemplate,
          logo: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateTemplateField = (field, value) => {
    setCurrentTemplate({
      ...currentTemplate,
      [field]: value
    });
  };

  const updateNestedField = (parent, field, value) => {
    setCurrentTemplate({
      ...currentTemplate,
      [parent]: {
        ...currentTemplate[parent],
        [field]: value
      }
    });
  };

  const updateFontSize = (type, value) => {
    setCurrentTemplate({
      ...currentTemplate,
      fonts: {
        ...currentTemplate.fonts,
        size: {
          ...currentTemplate.fonts.size,
          [type]: value
        }
      }
    });
  };

  if (isEditing && currentTemplate) {
    return (
      <div className="container py-5">
        <div className="mb-3">
          <button className="btn btn-outline-secondary" onClick={() => { setIsEditing(false); setCurrentTemplate(null); }}>
            ← Înapoi la Template-uri
          </button>
        </div>

        <h2>Editor Template</h2>

        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5>Setări Template</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Nume Template</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentTemplate.name}
                      onChange={(e) => updateTemplateField('name', e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Layout</label>
                    <select
                      className="form-select"
                      value={currentTemplate.layout}
                      onChange={(e) => updateTemplateField('layout', e.target.value)}
                    >
                      <option value="classic">Clasic</option>
                      <option value="modern">Modern</option>
                      <option value="minimalist">Minimalist</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Dimensiune Hârtie</label>
                    <select
                      className="form-select"
                      value={currentTemplate.paperSize}
                      onChange={(e) => updateTemplateField('paperSize', e.target.value)}
                    >
                      <option value="A4">A4</option>
                      <option value="Letter">Letter</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Logo Companie</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    {currentTemplate.logo && (
                      <div className="mt-2">
                        <img src={currentTemplate.logo} alt="Logo" style={{ maxHeight: '50px' }} />
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={currentTemplate.showLogo}
                        onChange={(e) => updateTemplateField('showLogo', e.target.checked)}
                      />
                      <label className="form-check-label">Afișează logo</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Text Antet</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentTemplate.headerText}
                      onChange={(e) => updateTemplateField('headerText', e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Text Subsol</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={currentTemplate.footerText}
                      onChange={(e) => updateTemplateField('footerText', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5>Culori</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label">Primary</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={currentTemplate.colors.primary}
                      onChange={(e) => updateNestedField('colors', 'primary', e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Secondary</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={currentTemplate.colors.secondary}
                      onChange={(e) => updateNestedField('colors', 'secondary', e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Text</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={currentTemplate.colors.text}
                      onChange={(e) => updateNestedField('colors', 'text', e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Accent</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={currentTemplate.colors.accent}
                      onChange={(e) => updateNestedField('colors', 'accent', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-header">
                <h5>Fonturi</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Font Antet</label>
                    <select
                      className="form-select"
                      value={currentTemplate.fonts.heading}
                      onChange={(e) => updateNestedField('fonts', 'heading', e.target.value)}
                    >
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="Times New Roman, serif">Times New Roman</option>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="Verdana, sans-serif">Verdana</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Font Corp</label>
                    <select
                      className="form-select"
                      value={currentTemplate.fonts.body}
                      onChange={(e) => updateNestedField('fonts', 'body', e.target.value)}
                    >
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="Times New Roman, serif">Times New Roman</option>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="Verdana, sans-serif">Verdana</option>
                    </select>
                  </div>
                  <div className="col-4">
                    <label className="form-label">Antet</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentTemplate.fonts.size.heading}
                      onChange={(e) => updateFontSize('heading', e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label">Corp</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentTemplate.fonts.size.body}
                      onChange={(e) => updateFontSize('body', e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label">Mic</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentTemplate.fonts.size.small}
                      onChange={(e) => updateFontSize('small', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <button className="btn btn-success w-100" onClick={saveTemplate}>
                Salvează Template
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          ← Înapoi la Dashboard
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Template-uri Facturi</h2>
        <button className="btn btn-primary" onClick={createNewTemplate}>
          + Template Nou
        </button>
      </div>

      <div className="row">
        {templates.map((template) => (
          <div key={template.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <div className="flex-grow-1">
                  <h5 className="card-title">{template.name}</h5>
                  <p className="card-text">
                    Layout: {template.layout}<br />
                    Dimensiune: {template.paperSize}
                  </p>
                  <div
                    className="border rounded p-2 mb-3"
                    style={{
                      backgroundColor: template.colors.secondary,
                      borderColor: template.colors.primary
                    }}
                  >
                    <div
                      className="text-center mb-2"
                      style={{
                        color: template.colors.primary,
                        fontFamily: template.fonts.heading,
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      {template.headerText}
                    </div>
                    {template.showLogo && template.logo && (
                      <div className="text-center mb-2">
                        <img
                          src={template.logo}
                          alt="Logo"
                          style={{ maxHeight: '30px' }}
                        />
                      </div>
                    )}
                    <div
                      style={{
                        color: template.colors.text,
                        fontFamily: template.fonts.body,
                        fontSize: '12px'
                      }}
                    >
                      Preview template
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary flex-fill"
                      onClick={() => editTemplate(template)}
                    >
                      Editează
                    </button>
                    <button
                      className="btn btn-outline-secondary flex-fill"
                      onClick={() => duplicateTemplate(template)}
                    >
                      Duplicare
                    </button>
                    {!template.id.startsWith('default-') && (
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => deleteTemplate(template.id)}
                      >
                        Șterge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
