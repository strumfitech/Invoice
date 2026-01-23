import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/quantum.css';
import './i18n.js';

// Load Space Grotesk Font for 2026 Design
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// Note: Bootstrap CSS is loaded via the index.html CDN in this scaffold

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
