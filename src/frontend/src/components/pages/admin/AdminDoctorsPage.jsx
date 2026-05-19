import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { MoreVertical } from 'lucide-react';
import { Sidebar } from '../../Sidebar.jsx';
import { DashboardHeader } from '../../DashboardHeader.jsx';
import { archiveAdminDoctor, getAdminDoctors, getAdminActivity, adminUpdateUser } from '../../../services/api.js';
import { AdminCreateModal } from './AdminCreateModal.jsx';
import { useToast } from '../../ui/useToast.js';
import '../../../styles/pages/Dashboard.css';

function ratingLabel(r) {
  if (r === null || r === undefined) return '-';
  const n = Number(r);
  if (Number.isNaN(n)) return String(r);
  return n.toFixed(1);
}

function isDoctorActive(doctor) {
  return doctor.status === 'Actif' || doctor.is_active === true;
}

function statusBadgeClass(doctor) {
  if (doctor.status === 'Inactif') return 'badge-secondary';
  return isDoctorActive(doctor) ? 'badge-success' : 'badge-secondary';
}

export function AdminDoctorsPage({ onLogout, user, onHomeClick }) {
  const navigate = useNavigate();
  const toast = useToast();
  const userName = user?.name || 'Administrateur';

  const [doctors, setDoctors] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState('');
  const [minRating, setMinRating] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [createKey, setCreateKey] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const lastRefreshKeyRef = useRef(refreshKey);
  const [menuFor, setMenuFor] = useState(null);
  const [updatingDoctorId, setUpdatingDoctorId] = useState(null);

  const requestParams = useMemo(() => ({ q, min_rating: minRating }), [q, minRating]);

  useEffect(() => {
    let cancelled = false;
    let debounce = null;

    const load = async (showLoading) => {
      if (showLoading) setLoading(true);
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
        if (!cancelled && showLoading) setLoading(false);
      }
    };

    const isManualRefresh = lastRefreshKeyRef.current !== refreshKey;
    lastRefreshKeyRef.current = refreshKey;

    // When user just created something, refresh immediately (no debounce).
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
    <div className="app-container" onClick={() => setMenuFor(null)}>
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
              <button type="button" className="btn btn-primary" onClick={() => { setCreateKey((k) => k + 1); setCreateOpen(true); }}>Ajouter</button>
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
                      <th>Action</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.filter((d) => d.status !== 'Inactif').map((d) => {
                      const active = isDoctorActive(d);
                      const nextActive = !active;

                      return (
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
                          <span className={`badge ${statusBadgeClass(d)}`}>{d.status}</span>
                        </td>
                        <td>
                          {d.user_id ? (
                            <button
                              type="button"
                              className={["btn", active ? "btn-danger" : "btn-primary"].filter(Boolean).join(" ")}
                              disabled={updatingDoctorId === d.id}
                              onClick={async () => {
                                const previousDoctors = doctors;
                                setUpdatingDoctorId(d.id);
                                setDoctors((items) => items.map((item) => (
                                  item.id === d.id
                                    ? { ...item, is_active: nextActive, status: nextActive ? 'Actif' : 'Désactivé' }
                                    : item
                                )));

                                try {
                                  await adminUpdateUser(d.user_id, { is_active: nextActive });
                                  toast.success(active ? 'Médecin désactivé.' : 'Médecin activé.');
                                  setRefreshKey((k) => k + 1);
                                } catch (e) {
                                  console.error(e);
                                  setDoctors(previousDoctors);
                                  toast.error('Impossible de changer le statut.');
                                } finally {
                                  setUpdatingDoctorId(null);
                                }
                              }}
                            >
                              {active ? 'Désactiver' : 'Activer'}
                            </button>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
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
                              <button
                                type="button"
                                className="btn btn-ghost"
                                style={{ width: '100%', justifyContent: 'flex-start' }}
                                onClick={async () => {
                                  try {
                                    await archiveAdminDoctor(d.id);
                                    toast.success('Médecin archivé.');
                                    setMenuFor(null);
                                    setRefreshKey((k) => k + 1);
                                  } catch (e) {
                                    console.error(e);
                                    toast.error('Impossible d’archiver.');
                                  }
                                }}
                              >
                                Envoyer a l'archive
                              </button>
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    );
                    })}
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
        kind="doctor"
        onClose={() => setCreateOpen(false)}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
