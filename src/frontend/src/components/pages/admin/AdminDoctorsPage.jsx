import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../../Sidebar.jsx';
import { DashboardHeader } from '../../DashboardHeader.jsx';
import { getAdminDoctors, getAdminActivity } from '../../../services/api.js';
import { AdminCreateModal } from './AdminCreateModal.jsx';
import '../../../styles/pages/Dashboard.css';

function ratingLabel(r) {
  if (r === null || r === undefined) return '-';
  const n = Number(r);
  if (Number.isNaN(n)) return String(r);
  return n.toFixed(1);
}

export function AdminDoctorsPage({ onLogout, user, onHomeClick }) {
  const navigate = useNavigate();
  const userName = user?.name || 'Administrateur';

  const [doctors, setDoctors] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState('');
  const [minRating, setMinRating] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const requestParams = useMemo(() => ({ q, min_rating: minRating }), [q, minRating]);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const [items, activity] = await Promise.all([
          getAdminDoctors(requestParams),
          getAdminActivity(),
        ]);
        if (cancelled) return;
        setDoctors(Array.isArray(items) ? items : []);
        setRecentActivity(Array.isArray(activity) ? activity : []);
      } catch (e) {
        console.error('Erreur lors du chargement des médecins:', e);
        if (!cancelled) setDoctors([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [requestParams, refreshKey]);

  return (
    <div className="app-container">
      <Sidebar userRole="admin" user={user} onLogout={onLogout} onHomeClick={onHomeClick} />

      <div className="main-content">
        <DashboardHeader
          title="Médecins"
          subtitle={`Bienvenue, ${userName}`}
          user={user}
          onLogout={onLogout}
          onHomeClick={onHomeClick}
          notifications={recentActivity.map((a, i) => ({ id: i, action: a.action, description: a.user, time: a.time }))}
        />

        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
            <h3 className="card-title">Liste des médecins</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-primary" onClick={() => setCreateOpen(true)}>Ajouter</button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/dashboard')}>Retour au dashboard</button>
            </div>
          </div>
          <div className="card-content">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 12rem', gap: '0.75rem', marginBottom: '1rem' }}>
              <input
                className="input"
                style={{ marginBottom: 0 }}
                placeholder="Rechercher par nom..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select className="input" style={{ marginBottom: 0 }} value={minRating} onChange={(e) => setMinRating(e.target.value)}>
                <option value="">Tous les scores</option>
                <option value="4.5">4.5+</option>
                <option value="4">4.0+</option>
                <option value="3.5">3.5+</option>
                <option value="3">3.0+</option>
              </select>
            </div>

            {loading ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>Chargement...</p>
            ) : doctors.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>Aucun médecin.</p>
            ) : (
              <div className="dashboard-table-container">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Spécialité</th>
                      <th>Note</th>
                      <th>Avis</th>
                      <th>Exp.</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((d) => (
                      <tr key={d.id}>
                        <td>{d.name}</td>
                        <td className="text-muted">{d.specialty || '-'}</td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span>⭐</span>
                            <span>{ratingLabel(d.rating)}</span>
                          </span>
                        </td>
                        <td className="text-muted">{d.reviews ?? '-'}</td>
                        <td className="text-muted">{d.experience || '-'}</td>
                        <td>
                          <span className={`badge ${d.status === 'Actif' ? 'badge-success' : 'badge-secondary'}`}>{d.status}</span>
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

      <AdminCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
