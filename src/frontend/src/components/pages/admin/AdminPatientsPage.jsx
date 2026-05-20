import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Sidebar } from '../../Sidebar.jsx';
import { DashboardHeader } from '../../DashboardHeader.jsx';
import { getAdminPatients, getAdminActivity } from '../../../services/api.js';
import { AdminCreateModal } from './AdminCreateModal.jsx';
import '../../../styles/pages/Dashboard.css';

function calcAge(birthDate) {
  if (!birthDate) return null;
  const d = new Date(birthDate);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return age;
}

export function AdminPatientsPage({ onLogout, user, onHomeClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = user?.name || 'Administrateur';

  const [patients, setPatients] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [createKey, setCreateKey] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const lastRefreshKeyRef = useRef(refreshKey);

  const syncCreateParam = (nextOpen) => {
    const params = new URLSearchParams(location.search);
    if (nextOpen) params.set('create', 'patient');
    else params.delete('create');
    const nextSearch = params.toString();
    navigate(`${location.pathname}${nextSearch ? `?${nextSearch}` : ''}`, { replace: true });
  };
  const createOpen = new URLSearchParams(location.search).get('create') === 'patient';

  useEffect(() => {
    let cancelled = false;
    let debounce = null;

    const load = async (showLoading) => {
      if (showLoading) setLoading(true);
      try {
        const [items, activity] = await Promise.all([
          getAdminPatients({ q }),
          getAdminActivity(),
        ]);
        if (cancelled) return;
        setPatients(Array.isArray(items) ? items : []);
        setRecentActivity(Array.isArray(activity) ? activity : []);
      } catch (e) {
        console.error('Erreur lors du chargement des patients:', e);
        if (!cancelled) setPatients([]);
      } finally {
        if (!cancelled && showLoading) setLoading(false);
      }
    };

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
  }, [q, refreshKey]);

  return (
    <div className="app-container">
      <Sidebar userRole="admin" user={user} onLogout={onLogout} onHomeClick={onHomeClick} />

      <div className="main-content">
        <DashboardHeader
          title="Patients"
          subtitle={`Bienvenue, ${userName}`}
          user={user}
          onLogout={onLogout}
          onHomeClick={onHomeClick}
          notifications={recentActivity.map((a, i) => ({ id: i, action: a.action, description: a.user, time: a.time }))}
        />

        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
            <h3 className="card-title">Liste des patients</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => { setCreateKey((k) => k + 1); syncCreateParam(true); }}
              >
                Ajouter
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/dashboard')}>Retour au dashboard</button>
            </div>
          </div>
          <div className="card-content">
            <input
              className="input"
              placeholder="Rechercher par nom ou email..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            {loading ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>Chargement...</p>
            ) : patients.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>Aucun patient.</p>
            ) : (
              <div className="dashboard-table-container">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Âge</th>
                      <th>Groupe sanguin</th>
                      <th>Inscription</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td className="text-muted">{p.email || '-'}</td>
                        <td className="text-muted">{calcAge(p.birth_date) ?? '-'}</td>
                        <td className="text-muted">{p.blood_type || '-'}</td>
                        <td className="text-muted">{p.created_at || '-'}</td>
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
        kind="patient"
        onClose={() => { syncCreateParam(false); }}
        onCreated={() => { setRefreshKey((k) => k + 1); syncCreateParam(false); }}
      />
    </div>
  );
}
