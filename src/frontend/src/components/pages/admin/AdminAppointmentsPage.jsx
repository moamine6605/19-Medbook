import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Sidebar } from '../../Sidebar.jsx';
import { DashboardHeader } from '../../DashboardHeader.jsx';
import { getAdminAppointments, getAdminActivity } from '../../../services/api.js';
import { AdminCreateModal } from './AdminCreateModal.jsx';
import '../../../styles/pages/Dashboard.css';

function formatTiming(timing) {
  return timing === 'ended' ? 'Terminé' : 'À venir';
}

function formatStatus(status) {
  if (!status) return '';
  if (status === 'completed') return 'Complété';
  if (status === 'cancelled') return 'Annulé';
  if (status === 'in-progress') return 'En cours';
  if (status === 'upcoming') return 'Planifié';
  return status;
}

export function AdminAppointmentsPage({ onLogout, user, onHomeClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = user?.name || 'Administrateur';

  const [appointments, setAppointments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState('');
  const [timing, setTiming] = useState('all'); // all|upcoming|ended
  const [range, setRange] = useState('all'); // all|day|week|month
  const [anchorDate, setAnchorDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [createKey, setCreateKey] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const lastRefreshKeyRef = useRef(refreshKey);

  const syncCreateParam = (nextOpen) => {
    const params = new URLSearchParams(location.search);
    if (nextOpen) params.set('create', 'appointment');
    else params.delete('create');
    const nextSearch = params.toString();
    navigate(`${location.pathname}${nextSearch ? `?${nextSearch}` : ''}`, { replace: true });
  };
  const createOpen = new URLSearchParams(location.search).get('create') === 'appointment';

  const requestParams = useMemo(() => ({
    q,
    timing,
    range,
    date: range === 'all' ? '' : anchorDate,
  }), [q, timing, range, anchorDate]);

  useEffect(() => {
    let cancelled = false;
    let debounce = null;

    const load = async (showLoading) => {
      if (showLoading) setLoading(true);
      try {
        const [items, activity] = await Promise.all([
          getAdminAppointments(requestParams),
          getAdminActivity(),
        ]);
        if (cancelled) return;
        setAppointments(Array.isArray(items) ? items : []);
        setRecentActivity(Array.isArray(activity) ? activity : []);
      } catch (e) {
        console.error('Erreur lors du chargement des rendez-vous:', e);
        if (!cancelled) setAppointments([]);
      } finally {
        if (!cancelled && showLoading) setLoading(false);
      }
    };

    // Small debounce for typing, then keep data fresh in the background.
    const isManualRefresh = lastRefreshKeyRef.current !== refreshKey;
    lastRefreshKeyRef.current = refreshKey;
    if (isManualRefresh) {
      load(true);
    } else {
      debounce = setTimeout(() => load(true), 250);
    }
    const interval = setInterval(() => load(false), 5000);

    return () => {
      cancelled = true;
      if (debounce) clearTimeout(debounce);
      clearInterval(interval);
    };
  }, [requestParams, refreshKey]);

  return (
    <div className="app-container">
      <Sidebar userRole="admin" user={user} onLogout={onLogout} onHomeClick={onHomeClick} />

      <div className="main-content">
        <DashboardHeader
          title="Tous les rendez-vous"
          subtitle={`Bienvenue, ${userName}`}
          user={user}
          onLogout={onLogout}
          onHomeClick={onHomeClick}
          notifications={recentActivity.map((a, i) => ({ id: i, action: a.action, description: a.user, time: a.time }))}
        />

        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
            <h3 className="card-title">Liste des rendez-vous</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setCreateKey((k) => k + 1);
                  syncCreateParam(true);
                }}
              >
                Ajouter
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/dashboard')}>Retour au dashboard</button>
            </div>
          </div>
          <div className="card-content">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 12rem 12rem 12rem', gap: '0.75rem', marginBottom: '1rem' }}>
              <input
                className="input"
                style={{ marginBottom: 0 }}
                placeholder="Rechercher par patient ou médecin..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select className="input" style={{ marginBottom: 0 }} value={timing} onChange={(e) => setTiming(e.target.value)}>
                <option value="all">Tous</option>
                <option value="upcoming">À venir</option>
                <option value="ended">Terminés</option>
              </select>
              <select className="input" style={{ marginBottom: 0 }} value={range} onChange={(e) => setRange(e.target.value)}>
                <option value="all">Toutes dates</option>
                <option value="day">Jour</option>
                <option value="week">Semaine</option>
                <option value="month">Mois</option>
              </select>
              <input
                className="input"
                style={{ marginBottom: 0, visibility: range === 'all' ? 'hidden' : 'visible' }}
                type="date"
                value={anchorDate}
                onChange={(e) => setAnchorDate(e.target.value)}
              />
            </div>

            {loading ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>Chargement...</p>
            ) : appointments.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>Aucun rendez-vous.</p>
            ) : (
              <div className="dashboard-table-container">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Heure</th>
                      <th>Patient</th>
                      <th>Médecin</th>
                      <th>Spécialité</th>
                      <th>État</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id}>
                        <td>{a.date}</td>
                        <td>{a.time || '-'}</td>
                        <td>{a.patient}</td>
                        <td>{a.doctor}</td>
                        <td className="text-muted">{a.doctor_specialty || '-'}</td>
                        <td>
                          <span className={`badge ${a.timing === 'ended' ? 'badge-secondary' : 'badge-primary'}`}>
                            {formatTiming(a.timing)}
                          </span>
                        </td>
                        <td className="text-muted">{formatStatus(a.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdminCreateModal
        key={createKey}
        open={createOpen}
        kind="appointment"
        onClose={() => { syncCreateParam(false); }}
        onCreated={() => { setRefreshKey((k) => k + 1); syncCreateParam(false); }}
      />
    </div>
  );
}
