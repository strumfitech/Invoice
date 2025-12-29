import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import storage from '../services/storage.js';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('year'); // 'month', 'quarter', 'year'

  useEffect(() => {
    if (user) {
      loadInvoices();
    }
  }, [user]);

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

  // Calculate KPIs
  const calculateKPIs = () => {
    const now = new Date();
    let filteredInvoices = invoices;

    // Filter by date range
    if (dateFilter === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filteredInvoices = invoices.filter(inv => new Date(inv.date) >= monthAgo);
    } else if (dateFilter === 'quarter') {
      const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      filteredInvoices = invoices.filter(inv => new Date(inv.date) >= quarterAgo);
    } else if (dateFilter === 'year') {
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      filteredInvoices = invoices.filter(inv => new Date(inv.date) >= yearAgo);
    }

    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const totalTax = filteredInvoices.reduce((sum, inv) => sum + (inv.totalTax || 0), 0);
    const invoiceCount = filteredInvoices.length;

    return { totalRevenue, totalTax, invoiceCount, filteredInvoices };
  };

  const { totalRevenue, totalTax, invoiceCount, filteredInvoices } = calculateKPIs();

  // Monthly revenue chart data
  const getMonthlyRevenueData = () => {
    const monthlyData = {};
    filteredInvoices.forEach(inv => {
      const date = new Date(inv.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (inv.total || 0);
    });

    const labels = Object.keys(monthlyData).sort();
    const data = labels.map(month => monthlyData[month]);

    return {
      labels,
      datasets: [{
        label: 'Venituri Lunare (RON)',
        data,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }]
    };
  };

  // Top clients chart data
  const getTopClientsData = () => {
    const clientRevenue = {};
    filteredInvoices.forEach(inv => {
      const clientName = inv.recipient?.name || 'Client Necunoscut';
      clientRevenue[clientName] = (clientRevenue[clientName] || 0) + (inv.total || 0);
    });

    const sortedClients = Object.entries(clientRevenue)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      labels: sortedClients.map(([name]) => name),
      datasets: [{
        data: sortedClients.map(([,revenue]) => revenue),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }]
    };
  };

  // VAT evolution chart data
  const getVATEvolutionData = () => {
    const monthlyVAT = {};
    filteredInvoices.forEach(inv => {
      const date = new Date(inv.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyVAT[monthKey] = (monthlyVAT[monthKey] || 0) + (inv.totalTax || 0);
    });

    const labels = Object.keys(monthlyVAT).sort();
    const data = labels.map(month => monthlyVAT[month]);

    return {
      labels,
      datasets: [{
        label: 'TVA Lunar (RON)',
        data,
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      }]
    };
  };

  if (loading) {
    return <div className="container py-5 text-center">{t('common.loading')}</div>;
  }

  return (
    <div className="container py-5">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          ← {t('analytics.back')}
        </button>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{t('analytics.title')}</h2>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="month">{t('analytics.month')}</option>
            <option value="quarter">{t('analytics.quarter')}</option>
            <option value="year">{t('analytics.year')}</option>
            <option value="all">{t('analytics.all')}</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{t('analytics.revenue')}</h5>
              <h3 className="text-success">{Number(totalRevenue).toFixed(2)} RON</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{t('analytics.vat')}</h5>
              <h3 className="text-warning">{Number(totalTax).toFixed(2)} RON</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{t('analytics.count')}</h5>
              <h3 className="text-info">{invoiceCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>{t('analytics.monthly_revenue')}</h5>
            </div>
            <div className="card-body">
              <Bar data={getMonthlyRevenueData()} options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false }
                }
              }} />
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>{t('analytics.top_clients')}</h5>
            </div>
            <div className="card-body">
              <Doughnut data={getTopClientsData()} options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' }
                }
              }} />
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>{t('analytics.vat_evolution')}</h5>
            </div>
            <div className="card-body">
              <Line data={getVATEvolutionData()} options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false }
                }
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
