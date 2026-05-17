import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import {
  createAdminAppointment,
  createAdminDoctor,
  createAdminPatient,
  getAdminDoctors,
  getAdminPatients,
} from '../../../services/api.js';
import '../../../styles/components/AdminCreateModal.css';

function apiErrorMessage(err) {
  const data = err?.response?.data;
  if (!data) return 'Une erreur est survenue.';
  if (typeof data === 'string') return data;
  if (data.message) return data.message;
  if (data.errors && typeof data.errors === 'object') {
    const firstKey = Object.keys(data.errors)[0];
    if (firstKey && Array.isArray(data.errors[firstKey]) && data.errors[firstKey][0]) {
      return data.errors[firstKey][0];
    }
  }
  return 'Une erreur est survenue.';
}

export function AdminCreateModal({ open, onClose, onCreated }) {
  const [kind, setKind] = useState('appointment'); // appointment|patient|doctor
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Patient form
  const [pName, setPName] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [pPassword, setPPassword] = useState('');
  const [pBirthDate, setPBirthDate] = useState('');
  const [pBloodType, setPBloodType] = useState('');

  // Doctor form
  const [dName, setDName] = useState('');
  const [dEmail, setDEmail] = useState('');
  const [dPassword, setDPassword] = useState('');
  const [dSpecialty, setDSpecialty] = useState('');
  const [dExperience, setDExperience] = useState('');
  const [dRating, setDRating] = useState('');

  // Appointment form
  const [aPatientId, setAPatientId] = useState('');
  const [aDoctorId, setADoctorId] = useState('');
  const [aDate, setADate] = useState(() => new Date().toISOString().slice(0, 10));
  const [aTime, setATime] = useState('09:00');
  const [aType, setAType] = useState('in-person');
  const [aStatus, setAStatus] = useState('upcoming');
  const [aReason, setAReason] = useState('');

  const needsLists = useMemo(() => open && kind === 'appointment', [open, kind]);

  useEffect(() => {
    if (!open) return;
    setError('');
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    if (!needsLists) return;

    (async () => {
      try {
        const [p, d] = await Promise.all([
          getAdminPatients({ q: '' }),
          getAdminDoctors({ q: '', min_rating: '' }),
        ]);
        if (cancelled) return;
        setPatients(Array.isArray(p) ? p : []);
        setDoctors(Array.isArray(d) ? d : []);
      } catch (e) {
        if (!cancelled) {
          setPatients([]);
          setDoctors([]);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [needsLists]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      if (kind === 'patient') {
        await createAdminPatient({
          name: pName,
          email: pEmail,
          password: pPassword,
          birth_date: pBirthDate || null,
          blood_type: pBloodType || null,
        });
      } else if (kind === 'doctor') {
        await createAdminDoctor({
          name: dName,
          email: dEmail,
          password: dPassword,
          specialty: dSpecialty,
          experience: dExperience,
          rating: dRating === '' ? null : Number(dRating),
        });
      } else {
        await createAdminAppointment({
          patient_id: Number(aPatientId),
          doctor_id: Number(aDoctorId),
          date: aDate,
          time: aTime,
          type: aType,
          status: aStatus,
          reason: aReason || null,
        });
      }

      onCreated?.(kind);
      onClose?.();
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="acm-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="acm-modal" role="dialog" aria-modal="true" aria-label="Ajouter">
        <div className="acm-header">
          <div className="acm-title">Ajouter</div>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>
        <div className="acm-body">
          <div className="acm-grid">
            <div>
              <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Type</label>
              <select className="input" value={kind} onChange={(e) => setKind(e.target.value)} style={{ marginBottom: 0 }}>
                <option value="appointment">Rendez-vous</option>
                <option value="patient">Patient</option>
                <option value="doctor">Médecin</option>
              </select>
            </div>
          </div>

          {kind === 'patient' && (
            <div className="acm-grid" style={{ marginTop: '0.75rem' }}>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Nom</label>
                <input className="input" style={{ marginBottom: 0 }} value={pName} onChange={(e) => setPName(e.target.value)} />
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email</label>
                <input className="input" style={{ marginBottom: 0 }} type="email" value={pEmail} onChange={(e) => setPEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Mot de passe</label>
                <input className="input" style={{ marginBottom: 0 }} type="password" value={pPassword} onChange={(e) => setPPassword(e.target.value)} />
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Date de naissance (optionnel)</label>
                <input className="input" style={{ marginBottom: 0 }} type="date" value={pBirthDate} onChange={(e) => setPBirthDate(e.target.value)} />
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Groupe sanguin (optionnel)</label>
                <select className="input" style={{ marginBottom: 0 }} value={pBloodType} onChange={(e) => setPBloodType(e.target.value)}>
                  <option value="">Sélectionner...</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          )}

          {kind === 'doctor' && (
            <div className="acm-grid" style={{ marginTop: '0.75rem' }}>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Nom</label>
                <input className="input" style={{ marginBottom: 0 }} value={dName} onChange={(e) => setDName(e.target.value)} />
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email</label>
                <input className="input" style={{ marginBottom: 0 }} type="email" value={dEmail} onChange={(e) => setDEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Mot de passe</label>
                <input className="input" style={{ marginBottom: 0 }} type="password" value={dPassword} onChange={(e) => setDPassword(e.target.value)} />
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Spécialité</label>
                <input className="input" style={{ marginBottom: 0 }} value={dSpecialty} onChange={(e) => setDSpecialty(e.target.value)} />
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Expérience</label>
                <input className="input" style={{ marginBottom: 0 }} placeholder="ex: 8 ans" value={dExperience} onChange={(e) => setDExperience(e.target.value)} />
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Note (optionnel)</label>
                <input className="input" style={{ marginBottom: 0 }} type="number" step="0.1" min="0" max="5" value={dRating} onChange={(e) => setDRating(e.target.value)} />
              </div>
            </div>
          )}

          {kind === 'appointment' && (
            <div className="acm-grid" style={{ marginTop: '0.75rem' }}>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Patient</label>
                <select className="input" style={{ marginBottom: 0 }} value={aPatientId} onChange={(e) => setAPatientId(e.target.value)}>
                  <option value="">Sélectionner...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}{p.email ? ` (${p.email})` : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Médecin</label>
                <select className="input" style={{ marginBottom: 0 }} value={aDoctorId} onChange={(e) => setADoctorId(e.target.value)}>
                  <option value="">Sélectionner...</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}{d.specialty ? ` - ${d.specialty}` : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Date</label>
                <input className="input" style={{ marginBottom: 0 }} type="date" value={aDate} onChange={(e) => setADate(e.target.value)} />
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Heure</label>
                <input className="input" style={{ marginBottom: 0 }} type="time" value={aTime} onChange={(e) => setATime(e.target.value)} />
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Type</label>
                <select className="input" style={{ marginBottom: 0 }} value={aType} onChange={(e) => setAType(e.target.value)}>
                  <option value="in-person">En personne</option>
                  <option value="video">Vidéo</option>
                </select>
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Statut</label>
                <select className="input" style={{ marginBottom: 0 }} value={aStatus} onChange={(e) => setAStatus(e.target.value)}>
                  <option value="upcoming">À venir</option>
                  <option value="in-progress">En cours</option>
                  <option value="completed">Complété</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="text-muted" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Raison (optionnel)</label>
                <input className="input" style={{ marginBottom: 0 }} value={aReason} onChange={(e) => setAReason(e.target.value)} />
              </div>
            </div>
          )}

          {error && <div className="acm-error">{error}</div>}

          <div className="acm-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={busy}>Annuler</button>
            <button type="button" className="btn btn-primary" onClick={submit} disabled={busy}>
              {busy ? 'Enregistrement...' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
