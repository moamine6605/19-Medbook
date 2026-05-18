import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../../Sidebar.jsx';
import { DashboardHeader } from '../../DashboardHeader.jsx';
import { getAdminPatients, getAdminActivity, adminUpdateUser, adminDeleteUser } from '../../../services/api.js';
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
  const userName = user?.name || 'Administrateur';

  const [patients, setPatients] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
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
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
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
              <button type="button" className="btn btn-primary" onClick={() => setCreateOpen(true)}>Ajouter</button>
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
                      <th>Rôle</th>
                      <th>Statut</th>
                      <th>Âge</th>
                      <th>Groupe sanguin</th>
                      <th>Inscription</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td className="text-muted">{p.email || '-'}</td>
                        <td>
                          <select
                            className="input"
                            style={{ padding: '0.35rem 0.5rem' }}
                            value={p.role || 'patient'}
                            onChange={async (e) => {
                              try {
                                await adminUpdateUser(p.id, { role: e.target.value });
                                setRefreshKey((k) => k + 1);
                              } catch (err) {
                                console.error(err);
                                alert('Erreur lors de la mise à jour du rôle.');
                              }
                            }}
                          >
                            <option value="patient">patient</option>
                            <option value="doctor">doctor</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={p.is_active ? 'btn btn-outline' : 'btn btn-primary'}
                            onClick={async () => {
                              try {
                                await adminUpdateUser(p.id, { is_active: !p.is_active });
                                setRefreshKey((k) => k + 1);
                              } catch (err) {
                                console.error(err);
                                alert('Erreur lors de la mise à jour du statut.');
                              }
                            }}
                          >
                            {p.is_active ? 'Actif' : 'Désactivé'}
                          </button>
                        </td>
                        <td className="text-muted">{calcAge(p.birth_date) ?? '-'}</td>
                        <td className="text-muted">{p.blood_type || '-'}</td>
                        <td className="text-muted">{p.created_at || '-'}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            style={{ color: 'var(--destructive)', background: 'rgba(239, 68, 68, 0.05)' }}
                            onClick={async () => {
                              if (!window.confirm('Supprimer ce compte utilisateur ?')) return;
                              try {
                                await adminDeleteUser(p.id);
                                setRefreshKey((k) => k + 1);
                              } catch (err) {
                                console.error(err);
                                alert('Suppression impossible.');
                              }
                            }}
                          >
                            Supprimer
                          </button>
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
