import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { MoreVertical } from 'lucide-react';
import { Sidebar } from '../../Sidebar.jsx';
import { DashboardHeader } from '../../DashboardHeader.jsx';
import { deleteArchivedAdminDoctor, getAdminActivity, getArchivedAdminDoctors } from '../../../services/api.js';
import { useToast } from '../../ui/useToast.js';
import '../../../styles/pages/Dashboard.css';

function Menu({ onDelete }) {
  return (
    <div style={{
      position: 'absolute',
      right: 0,
      top: 'calc(100% + 6px)',
      background: 'var(--background)',
      border: '1px solid var(--border)',
      borderRadius: '0.5rem',
      boxShadow: 'var(--shadow)',
      zIndex: 20,
      minWidth: '180px',
      padding: '0.25rem',
    }}>
      <button type="button" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={onDelete}>
        Supprimer definitivement
      </button>
    </div>
  );
}

export function AdminArchivePage({ onLogout, user, onHomeClick }) {
  const navigate = useNavigate();
  const toast = useToast();
  const userName = user?.name || 'Administrateur';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const lastRefreshKeyRef = useRef(refreshKey);

  const requestParams = useMemo(() => ({ q }), [q]);
  const [menuFor, setMenuFor] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let debounce = null;

    const load = async (showLoading) => {
      if (showLoading) setLoading(true);
      try {
        const [items, activity] = await Promise.all([
          getArchivedAdminDoctors(requestParams),
          getAdminActivity(),
        ]);
        if (cancelled) return;
        setDoctors(Array.isArray(items) ? items : []);
        setRecentActivity(Array.isArray(activity) ? activity : []);
      } catch (e) {
        console.error('Erreur archive doctors:', e);
        if (!cancelled) setDoctors([]);
      } finally {
        if (!cancelled && showLoading) setLoading(false);
      }
    };

    const isManualRefresh = lastRefreshKeyRef.current !== refreshKey;
    lastRefreshKeyRef.current = refreshKey;
    if (isManualRefresh) load(true);
    else debounce = setTimeout(() => load(true), 250);

    const interval = setInterval(() => load(false), 7000);

    return () => {
      cancelled = true;
      if (debounce) clearTimeout(debounce);
      clearInterval(interval);
    };
  }, [requestParams, refreshKey]);

  return (
    <div className="app-container" onClick={() => setMenuFor(null)}>
      <Sidebar
        userRole="admin"
        user={user}
        onLogout={onLogout}
        onHomeClick={onHomeClick}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="main-content">
        <DashboardHeader
          title="Archive"
          subtitle={`Bienvenue, ${userName}`}
          user={user}
          onLogout={onLogout}
          onHomeClick={onHomeClick}
          notifications={recentActivity.map((a, i) => ({ id: i, action: a.action, description: a.user, time: a.time }))}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
            <h3 className="card-title">Medecins inactifs</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/dashboard')}>Retour au dashboard</button>
            </div>
          </div>
          <div className="card-content">
            <input
              className="input"
              placeholder="Rechercher par nom..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            {loading ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>Chargement...</p>
            ) : doctors.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>Aucun medecin archive.</p>
            ) : (
              <div className="dashboard-table-container">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Specialite</th>
                      <th>Exp.</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((d) => (
                      <tr key={d.id}>
                        <td>{d.name}</td>
                        <td className="text-muted">{d.specialty || '-'}</td>
                        <td className="text-muted">{d.experience || '-'}</td>
                        <td style={{ width: '48px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            aria-label="Actions"
                            onClick={() => setMenuFor((cur) => (cur === d.id ? null : d.id))}
                          >
                            <MoreVertical size={16} />
                          </button>
                          {menuFor === d.id ? (
                            <Menu
                              onDelete={async () => {
                                try {
                                  await deleteArchivedAdminDoctor(d.id);
                                  toast.success('Medecin supprime.');
                                  setMenuFor(null);
                                  setRefreshKey((k) => k + 1);
                                } catch (e) {
                                  console.error(e);
                                  toast.error('Impossible de supprimer.');
                                }
                              }}
                            />
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
