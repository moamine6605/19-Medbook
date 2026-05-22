# MEDBOOK - Cahier des Charges

**Document Type :** Cahier des Charges Fonctionnel  
**Projet :** MEDBOOK - Plateforme de Gestion de Rendez-vous Médicaux  
**Version :** 1.0  
**Date :** 21 mai 2026  
**Auteur :** Équipe Projet MEDBOOK  
**Classification :** Interne - Confidentiel

---

## Table des matières

1. [Présentation générale](#1-présentation-générale)
2. [Analyse des besoins](#2-analyse-des-besoins)
3. [Acteurs du système](#3-acteurs-du-système)
4. [Fonctionnalités détaillées](#4-fonctionnalités-détaillées)
5. [Contraintes techniques](#5-contraintes-techniques)
6. [Architecture du système](#6-architecture-du-système)
7. [Sécurité et conformité](#7-sécurité-et-conformité)
8. [Planning prévisionnel](#8-planning-prévisionnel)
9. [Livrables attendus](#9-livrables-attendus)
10. [Conclusion](#10-conclusion)

---

## 1. Présentation générale

### 1.1 Contexte

Le secteur de la santé fait face à des défis majeurs en termes de gestion des rendez-vous médicaux. Les patients doivent contacter les cabinets par téléphone, email ou se déplacer en personne, ce qui engendre :
- Pertes de temps pour les patients et le personnel administratif
- Taux d'oubli élevés de rendez-vous
- Manque de visibilité sur les disponibilités médicales
- Absence de suivi digital des consultations

### 1.2 Problématique

**Comment permettre aux patients d'accéder facilement à des services de santé et aux médecins de gérer efficacement leurs agendas ?**

Les défis spécifiques :
- Patients : Comment trouver un médecin disponible rapidement ?
- Médecins : Comment gérer efficacement les demandes de RDV ?
- Admin : Comment superviser et optimiser la plateforme ?

### 1.3 Objectifs du projet

**Objectif général :** Créer une plateforme web de gestion de rendez-vous médicaux permettant une interaction fluide entre patients et médecins.

**Objectifs spécifiques :**

| # | Objectif | Indicateur de réussite |
|---|----------|----------------------|
| O1 | Simplifier la prise de RDV pour les patients | 80% de satisfaction utilisateur |
| O2 | Optimiser la gestion agenda pour les médecins | Réduction 30% appels pour RDV |
| O3 | Réduire les no-show de rendez-vous | Réduction 40% annulation/oubli |
| O4 | Améliorer la traçabilité des consultations | 100% RDV documentés |
| O5 | Sécuriser les données médicales | Conformité RGPD et sécurité 100% |
| O6 | Permettre la scalabilité du système | Support 10,000+ utilisateurs |

### 1.4 Solution proposée

MEDBOOK est une **plateforme web responsive** permettant :

**Pour les patients :**
- Rechercher des médecins par spécialité
- Consulter les disponibilités en temps réel
- Réserver un rendez-vous
- Annuler/modifier un RDV
- Recevoir des rappels
- Consulter historique et ordonnances

**Pour les médecins :**
- Gérer créneaux horaires et disponibilités
- Consulter liste des rendez-vous
- Confirmer/refuser demandes de RDV
- Documenter consultations (notes cliniques)
- Générer ordonnances digitales
- Voir statistiques de sa pratique

**Pour les administrateurs :**
- Gérer utilisateurs (patients/médecins)
- Superviser la plateforme
- Analyser statistiques d'usage
- Gérer signalements et support

### 1.5 Périmètre du projet

#### Inclus ✅
- Inscription/authentification utilisateurs
- Gestion rendez-vous (réservation/annulation)
- Gestion agenda médecins
- Notifications (email, in-app)
- Gestion admin
- Ordonnances digitales
- Tests et sécurité
- Documentation

#### Exclus ❌
- Paiement en ligne (v2)
- Intégration calendriers externes (v2)
- Chat patient-médecin (v2)
- Vidéo consultation (v2)
- Système d'assurance (v2)

---

## 2. Analyse des besoins

### 2.1 Besoins fonctionnels

#### BF-001 : Authentification et gestion des comptes

**Inscription utilisateur**
- Création compte par email
- Validation email (lien de confirmation)
- Saisie profil : nom, prénom, téléphone
- Définition rôle : Patient ou Médecin
- Mot de passe fort (min 8 car, majuscule, minuscule, chiffre)

**Connexion**
- Login par email/password
- Option "Se souvenir de moi" (14 jours)
- Récupération mot de passe oublie
- Déconnexion
- Sessions multiples (max 3 sessions/utilisateur)

**Gestion profil**
- Modification données personnelles
- Changement mot de passe
- Upload photo de profil
- Suppression compte (soft delete)

#### BF-002 : Recherche et consultation médecins

**Recherche médecins**
- Filtrer par spécialité (liste prédéfinie)
- Filtrer par localisation (code postal)
- Recherche texte (nom médecin)
- Affichage liste : nom, spécialité, bio, photo, évaluation moyenne
- Pagination
- Tri par pertinence, avis, disponibilité

**Consultation profil médecin**
- Photo, bio, qualifications
- Spécialités
- Localisation/adresse
- Horaires générales
- Avis patients (ratings)
- Lien vers prise RDV

#### BF-003 : Réservation de rendez-vous

**Sélection créneau**
- Affichage calendrier interactif
- Créneau de 30 minutes
- Plage horaire : 6h-22h
- Impossibilité de sélectionner créneau passé
- Affichage créneaux disponibles uniquement

**Création RDV**
- Saisie raison de visite (optionnel)
- Confirmation avant soumission
- Email de confirmation à patient
- Statut initial : "Pending"
- Attente confirmation médecin (validé dans 24h)

**Confirmation médecin**
- Médecin reçoit demande
- Action : Confirmer ou Refuser
- Si refus : motif obligatoire
- Patient reçoit notification

#### BF-004 : Gestion agenda médecin

**Création créneaux**
- Définir créneaux horaires
- Répétition automatique (quotidienne, hebdomadaire)
- Durée consultation : 30 min (configurable)
- Pause lunch (non-réservable)
- Jours fermés (vacances, congés)

**Modification/Suppression**
- Modification créneau libre
- Suppression créneau (impossible si RDV confirmé)
- Blocage créneau pour travail administratif

**Visualisation**
- Calendrier agenda
- Vue jour/semaine/mois
- Affichage RDV avec patient
- Couleur-code : libre, occupé, bloqué

#### BF-005 : Gestion des notifications

**Email**
- Confirmation réservation (patient)
- Rappel 24h avant RDV (patient+médecin)
- Rappel 1h avant RDV (patient+médecin)
- Annulation/refus RDV
- Ordonnance prescription

**In-app**
- Badge notifications non-lues
- Centre notifications (historique)
- Notification RDV urgents (< 1h)

**Push (optionnel)**
- Service Worker
- Browser notification
- Géré par préférences utilisateur

#### BF-006 : Gestion des rendez-vous

**Statuts RDV**
- **Pending :** Demande émise, attente confirmation
- **Confirmed :** Validé par médecin
- **Rejected :** Refusé par médecin
- **Completed :** RDV effectué
- **Cancelled :** Annulé par patient/médecin

**Annulation**
- Patient : Jusqu'à 24h avant RDV
- Médecin : Anytime (notifie patient)
- Motif optionnel
- Créneau libéré immédiatement

**Documentation**
- Notes cliniques (médecin)
- Raison visite (patient)
- Durée effective

#### BF-007 : Ordonnances médicales

**Génération**
- Formulaire : médicaments, dosage, durée, instructions
- Modèle pré-rempli (spécialité médecin)
- Liée au RDV spécifique

**Distribution**
- PDF généré automatiquement
- Email patient avec PDF
- Historique ordonnances patient consultable
- Archivage sécurisé

#### BF-008 : Administration et supervision

**Gestion utilisateurs**
- Liste utilisateurs paginée
- Recherche par nom/email
- Filtres : rôle, statut actif/inactif
- Actions : voir détails, modifier, désactiver, supprimer
- Audit log

**Statistiques**
- Graphiques RDV/mois, par spécialité
- Taux de confirmation/annulation
- Médecins les plus actifs
- Heures creuses/pics
- Rapport exportable (PDF/CSV)

**Paramètres globaux**
- Gestion spécialités
- Configuration durée créneau standard
- Paramètres email
- Règles métier (ex: délai min 24h avant RDV)

### 2.2 Besoins non-fonctionnels

#### BNF-001 : Performance

| Critère | Valeur cible |
|---------|------------|
| Temps réponse API | < 500ms (p95) |
| Chargement page | < 3s (p95) |
| Taux de disponibilité | 99.5% uptime |
| Temps de recherche médecin | < 1s |
| Charge DB : 10,000 RDV/jour | Sans dégradation |

#### BNF-002 : Scalabilité

- Support 10,000 utilisateurs actifs
- Croissance 100% /an sans refactor
- Load balancing frontend/backend
- Réplication DB pour haute disponibilité
- Cache distribué (Redis)

#### BNF-003 : Maintenabilité

- Code modulaire et testable
- Couverture tests ≥ 80%
- Documentation code (JSDoc, PHPDoc)
- Utilisation design patterns SOLID
- Versioning API (v1, v2)

#### BNF-004 : Compatibilité

**Navigateurs :**
- Chrome (dernière version)
- Firefox (dernière version)
- Safari (dernière version)
- Edge (dernière version)

**Appareils :**
- Desktop (1920x1080+)
- Tablet (768-1024px)
- Mobile (320-768px)
- Responsive design obligatoire

#### BNF-005 : Accessibilité

- WCAG 2.1 AA conformité
- Navigation clavier complète
- Alt text images
- Contraste minimum 4.5:1
- Structure heading logique

#### BNF-006 : Localisation

- Interface en français
- Format dates JJ/MM/AAAA
- Format heure 24h
- Devises EUR
- Support timezone France (optionnel : multi-timezone v2)

---

## 3. Acteurs du système

### 3.1 Patient

**Profil :**
- Utilisateur cherchant une consultation médicale
- Accès en ligne (web responsive)
- Niveau technique : moyen à élevé

**Besoins principaux :**
1. Trouver un médecin adapté
2. Consulter disponibilités
3. Réserver facilement
4. Recevoir confirmation/rappels
5. Gérer ses RDV
6. Accéder historique et ordonnances

**Cas d'usage principal :**
```
Patient se connecte 
  → Recherche médecin par spécialité
  → Consulte calendrier médecin
  → Sélectionne créneau
  → Remplit raison visite
  → Reçoit confirmation email
  → Reçoit rappel 24h/1h
  → Consulte notes et ordonnance après RDV
```

**Scénario d'oubli :**
- Patient reçoit rappel 1h avant
- Clique sur lien pour marquer "reçu"
- Historique conservé

### 3.2 Médecin

**Profil :**
- Praticien gérant patients
- Accès web + statistiques
- Niveau technique : moyen

**Besoins principaux :**
1. Gérer créneaux de disponibilité
2. Consulter demandes de RDV
3. Confirmer/refuser RDV
4. Documenter consultations
5. Générer ordonnances
6. Analyser sa pratique

**Cas d'usage principal :**
```
Médecin se connecte
  → Consulte RDV du jour
  → Voit demandes en attente
  → Confirme/refuse demandes
  → Pendant/après RDV : ajoute notes
  → Génère ordonnance
  → Clôture RDV
  → Voit statistiques pratique
```

**Workflow quotidien :**
- Matin : Consultation vue jour
- Check demandes avant consultations
- Après consultation : notes + ordonnance
- Soir : Gestion créneaux semaine prochaine

### 3.3 Administrateur

**Profil :**
- Personnel supervisant plateforme
- Accès interface admin
- Niveau technique : avancé

**Besoins principaux :**
1. Gérer tous les utilisateurs
2. Superviser statistiques globales
3. Gérer signalements/support
4. Configurer paramètres système
5. Générer rapports
6. Archiver données

**Cas d'usage principal :**
```
Admin se connecte
  → Visualise dashboard
  → Consulte statistiques globales
  → Gère utilisateurs (création/suppression)
  → Voit audit log
  → Exporte rapport mensuel
  → Configure paramètres métier
```

### 3.4 Systèmes externes

**API Externes :**
- Email service (SMTP ou service mail)
- Éventuellement : SMS (Twilio) - v2
- Éventuellement : Paiement (Stripe) - v2

---

## 4. Fonctionnalités détaillées

### 4.1 Module Authentification

#### Inscription

**Flux :**
```
1. User clic "S'inscrire"
2. Saisie email
3. Système vérifie email unique
4. Saisie password (validation forte)
5. Saisie données personnelles (nom, prénom, tél)
6. Sélection rôle (Patient / Médecin)
7. Si Médecin : saisie spécialité
8. Confirmation conditions utilisations
9. Compte créé, email de confirmation envoyé
10. User valide email (lien 24h)
11. Compte activé, redirection login
```

**Validations :**
- Email unique et valide (RFC 5322)
- Password min 8 car (1 maj, 1 min, 1 chiffre, 1 spécial)
- Nom/prénom min 2 caractères
- Téléphone format français (10 chiffres)

#### Connexion

**Flux :**
```
1. User saisit email/password
2. Backend valide credentials
3. Token JWT/Sanctum généré (exp: 24h)
4. Frontend stocke token (localStorage/sessionStorage)
5. User redirigé vers dashboard
6. Toutes requêtes API incluent token
```

**Sécurité :**
- Rate limiting : 5 tentatives/15min
- Password hashé bcrypt (cost: 12)
- Session expiration 24h
- Token révocation possible

#### Récupération mot de passe

**Flux :**
```
1. User clic "Mot de passe oublié"
2. Saisit email
3. Email envoyé avec lien reset (valide 1h)
4. User clic lien → formulaire reset
5. Saisit nouveau password
6. Validation backend
7. Password mis à jour, sessions invalidées
```

### 4.2 Module Recherche Médecins

#### Listing

**Critères de recherche :**
- Spécialité (select dropdown)
- Localisation (input texte code postal)
- Recherche texte (nom médecin)
- Tri (pertinence, avis, dispo)

**Affichage :**
- Carte médecin : photo, nom, spécialité, avis moyenne, localisation
- Bouton "Voir profil" → détails complets
- Pagination 12 résultats/page

**Performance :**
- Recherche indexée DB
- Cache Redis 5 minutes
- Lazy loading images

#### Profil Médecin

**Affichage :**
- Photo haute résolution
- Bio (texte riche)
- Qualifications/diplômes
- Spécialités
- Localisation/plan (Google Maps)
- Horaires générales (lundi-vendredi)
- Avis patients (nb + moyenne)
- Bouton "Prendre RDV" → réservation

### 4.3 Module Réservation RDV

#### Calendrier Sélection Créneau

**Composant :**
- Vue par défaut : 7 prochains jours
- Sélection date → liste créneaux horaires
- Créneau format : "09:30 - 10:00" (30 min)
- Couleur : vert (libre), gris (occupé)
- Impossible de sélectionner créneau < 2h avant
- Impossible de sélectionner créneau passé

**Données affichées :**
```
Semaine du 25/05/2026
Lun 25  [Matin libre] [Après-midi: 14:30-15:00]
Mar 26  [Matin complet] [Après-midi libre]
Mer 27  [Jour fermé - Vacances]
...
```

#### Formulaire Réservation

**Champs :**
- Médecin (pré-sélectionné)
- Date/Heure (pré-sélectionné)
- Raison visite (textarea, 500 char max, optionnel)
- Checkbox conditions
- Boutons : "Confirmer" / "Annuler"

**Validation :**
- Date/heure valide et disponible
- Patient n'a pas déjà un RDV à ce créneau
- Raison > 2 caractères si remplie

#### Confirmation

**Écran confirmation :**
- Résumé RDV : médecin, date, heure
- Message : "Votre demande a été enregistrée"
- Information : "Le médecin confirmera sous 24h"
- Bouton : "Retour à mes RDV"

**Email patient :**
```
Objet : Demande de rendez-vous - Dr. Dupont

Votre demande de rendez-vous a été créée avec succès.

Détails :
- Médecin : Dr. Dupont (Cardiologue)
- Date : 25/05/2026
- Heure : 14:30
- Raison : Consultation cardiaque
- Statut : En attente de confirmation

Le médecin confirmera votre rendez-vous sous 24 heures.
Vous recevrez un email dès confirmation.

Lien pour annuler :
[https://medbook.local/appointments/123/cancel]
```

**Notification médecin :**
- Badge "1 nouvelle demande"
- Email : "Nouvelle demande RDV - Patient X"

### 4.4 Module Gestion Agenda Médecin

#### Création Créneaux

**Formulaire :**
- Date début
- Heure début/fin
- Répétition : "Une fois" / "Quotidien" / "Chaque semaine"
- Si répétition : date fin + jours sélectionnés
- Durée par défaut : 30 min (modifiable)
- Bouton "Créer créneaux"

**Logique répétition :**
```
Exemple : Créer créneaux (Mon-Ven, 9h-12h, 30 min slots)
Résultat : 
- Lun 25/05 : 9:00-9:30, 9:30-10:00, 10:00-10:30, etc.
- Mar 26/05 : idem
- ...jusqu'à date fin
```

#### Visualisation Calendrier

**Vue jour :**
- Timeline vertical 6h-22h
- Bloc pour chaque créneau (30 min)
- Code couleur : libre (gris), occupé (bleu), RDV confirmé (vert)
- Hover : infos patient RDV
- Click créneau : options (bloquer, supprimer)

**Vue semaine :**
- 7 colonnes (lun-dim)
- Même timeline 6h-22h
- Affichage tous créneaux + RDV

**Vue mois :**
- Calendrier classique
- Nb RDV/jour affiché
- Click jour → vue jour

#### Gestion Absences

**Paramétrage :**
- Type : congé, jour fermé, formation
- Date début/fin
- Description optionnelle
- Tous les créneaux bloqués automatiquement

**Affichage :**
- Fond gris (différent de créneau libre)
- Tooltip explicitif

### 4.5 Module Notifications

#### Type Notifications

| Événement | Destinataire | Timing | Canal |
|-----------|-------------|--------|-------|
| RDV confirmé | Patient | Immédiat | Email + In-app |
| Rappel RDV | Both | 24h avant | Email + Push |
| Rappel RDV | Both | 1h avant | Email + Push |
| RDV refusé | Patient | Immédiat | Email + In-app |
| Annulation RDV | Both | Immédiat | Email + In-app |
| Ordonnance | Patient | After RDV | Email + In-app |

#### In-app

**Composant notification :**
- Badge coin haut-droit (nb non-lues)
- Popup liste 5 dernières notifs
- Click : redirection contexte (ex: RDV)
- "Voir tout" : page historique notifications

**Historique :**
- Page accessible depuis menu
- Liste toutes notifications (30 jours)
- Filtre : type, lu/non-lu
- Suppression individuelle
- Mark as read bulk action

#### Préférences

**Page paramètres :**
- Email : activer/désactiver par type
- Push : activer/désactiver
- Fréquence digests (si applicable)
- Horaires "do not disturb" (ex: 22h-8h)

### 4.6 Module Ordonnances

#### Création Ordonnance

**Contexte :**
- Liée à un RDV marqué "completed"
- Accessible depuis détails RDV

**Formulaire :**
- Médecin pré-rempli
- Patient pré-rempli
- Date création automatique
- Champs prescription :
  - Ligne 1-5 : nom médicament + dosage + durée
  - Exemple : "Aspirine 500mg - 2x par jour - 10 jours"
  - Instructions spéciales (textarea)
- Modèles pré-définis (optionnel)

**Génération PDF :**
- Template professionnel
- Entête : nom/logo clinique, adresse
- Patient : nom, date naissance
- Médecin : nom, spécialité, signature
- Ordonnance : date, médicaments, durée
- QR code vers ordonnance digitale (optionnel)
- Pied de page : date, numéro RDV

#### Distribution

**Workflow :**
```
Médecin crée ordonnance
  → Système génère PDF
  → Email envoyé patient + PDF
  → Ordonnance stockée en base
  → Accessible historique patient
```

**Email :**
```
Objet : Ordonnance du Dr. Dupont - 25/05/2026

Voici votre ordonnance médicale en pièce jointe.

Détails :
- Dr. Dupont (Cardiologue)
- Date : 25/05/2026
- Médicaments prescrits : [liste]

Vous pouvez consulter votre ordonnance en ligne :
[Lien sécurisé ordonnance]
```

### 4.7 Module Administration

#### Gestion Utilisateurs

**Liste utilisateurs :**
- Tableau : email, nom, rôle, date création, statut, actions
- Recherche : email/nom
- Filtres : rôle (Patient/Doctor), statut (actif/inactif)
- Pagination 50 users/page
- Export CSV

**Actions :**
- Voir détails complets
- Modifier (nom, email, tél)
- Désactiver (login bloqué)
- Activer
- Supprimer (soft delete)

**Audit :**
- Log création/modification/suppression
- User qui a effectué action
- Timestamp
- Historique queryable

#### Statistiques

**Dashboard Admin :**
- KPI : total users, médecins, patients, RDV ce mois
- Graphique : RDV/mois (6 derniers mois)
- Graphique : RDV/spécialité
- Taux confirmation : X% (meta: > 85%)
- Taux annulation : Y% (meta: < 20%)
- Médecins top 5 activité
- Heures pic (graphique heatmap)

**Rapport exportable :**
- Format PDF ou CSV
- Période sélectionnable
- Inclut : KPI, graphiques, insights
- Header : date générée, période couverte

#### Paramètres Système

**Gestion spécialités :**
- Liste modifiable spécialités
- Ajout/suppression
- Utilisé pour filtres patients

**Règles métier :**
- Délai minimum réservation : X heures avant
- Durée créneau standard : 30 min
- Validité token email : 24h
- Durée session : 24h
- Max sessions par user : 3

**Paramètres email :**
- Serveur SMTP
- Email expéditeur
- Templates modifiables

---

## 5. Contraintes techniques

### 5.1 Stack technologique

| Layer | Technologie | Version | Justification |
|-------|-------------|---------|--------------|
| **Frontend** | React | 18+ | Library UI moderne, composants réutilisables, large communauté |
| | Vite | 5+ | Build tool rapide, HMR optimisé, config simple |
| | React Router | 6+ | Routing SPA fluide, guards auth, nested routes |
| | Axios | 1.6+ | HTTP client simple, interceptors pour auth tokens |
| | Tailwind CSS | 3+ | Utility-first, design consistent, fast styling |
| | React Hook Form | 7+ | Gestion forms légère, validation, performance |
| **Backend** | Laravel | 11 | Framework PHP robuste, eloquent ORM, migrations |
| | PHP | 8.3+ | Stabilité, performance, security fixes |
| | Sanctum | 3+ | API auth tokens, CSRF protection, simple |
| **Database** | MySQL | 8.0+ | Fiabilité, ACID, indexing, réplication support |
| **API** | REST | - | Standard industrie, stateless, scalable |
| **DevOps** | GitHub | - | Version control, CI/CD, collaboration |
| | Docker | Optional | Containerization (optionnel pour v1) |

### 5.2 Environnements

**Développement (Local)**
- XAMPP : PHP 8.3 + MySQL
- Node 18+ + npm
- Git
- VS Code avec extensions (Laravel Extension Pack, ES7+ React/Redux)
- Postman pour tests API

**Staging**
- VPS Linux (Ubuntu 22.04)
- PHP 8.3 avec PHP-FPM
- MySQL 8.0
- Nginx
- Node pour frontend build
- HTTPS avec Let's Encrypt

**Production**
- Hébergement Cloud (Hetzner, OVH, ou AWS)
- Linux Ubuntu 22.04
- PHP 8.3 + FPM
- MySQL 8.0 avec réplication
- Nginx reverse proxy
- Redis pour cache
- HTTPS obligatoire
- Monitoring (status page, alertes)

### 5.3 Dépendances clés

**Frontend :**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x",
  "axios": "^1.6.0",
  "react-hook-form": "^7.x",
  "tailwindcss": "^3.x",
  "date-fns": "^2.x",
  "react-big-calendar": "^1.x"
}
```

**Backend :**
```
laravel/framework: ^11.0
laravel/sanctum: ^3.0
fakerphp/faker: ^1.x (dev)
phpunit/phpunit: ^10.x (dev)
laravel/pint: ^1.x (dev)
```

### 5.4 Contraintes d'intégration

**GitHub :**
- Repo public (ou privé, selon choix)
- Branching : main, develop, feature/* , hotfix/*
- PR reviews obligatoires
- CI/CD GitHub Actions

**Email :**
- Service SMTP (Mailtrap dev, SendGrid prod)
- Templates Blade professionnels
- Queued jobs asynchrones

**Storage :**
- Photos utilisateurs : /storage/profiles
- Ordonnances PDF : /storage/prescriptions
- Backup DB quotidien

---

## 6. Architecture du système

### 6.1 Architecture générale

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│                   (React SPA - Vite)                    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/HTTPS
                       │ JSON (REST API)
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  Reverse Proxy (Nginx)                   │
│         Load Balancing / Cache / SSL Termination         │
└──────────────────────┬──────────────────────────────────┘
                       │
     ┌─────────────────┼─────────────────┐
     │                 │                 │
┌────▼────┐      ┌────▼────┐      ┌────▼────┐
│ API 1   │      │ API 2   │      │ API 3   │
│(Laravel)│      │(Laravel)│      │(Laravel)│
└────┬────┘      └────┬────┘      └────┬────┘
     │                │                 │
     └────────────────┼─────────────────┘
                      │
     ┌────────────────┼────────────────┐
     │                │                │
┌────▼─────┐   ┌─────▼────┐    ┌──────▼──┐
│ MySQL DB │   │ Redis    │    │ Storage │
│(Primary) │   │ (Cache)  │    │ (Files) │
└──────────┘   └──────────┘    └─────────┘
```

### 6.2 Architecture Frontend

```
/src
├── /components
│   ├── /auth (Login, Register, ResetPassword)
│   ├── /patient (Dashboard, Search, BookAppointment, MyAppointments)
│   ├── /doctor (Dashboard, ManageSlots, ConfirmAppointments)
│   ├── /admin (Dashboard, UserManagement, Statistics)
│   ├── /shared (Header, Sidebar, Footer, Notification)
│
├── /pages (Layout wrappers)
│   ├── PatientLayout.jsx
│   ├── DoctorLayout.jsx
│   ├── AdminLayout.jsx
│
├── /services
│   ├── api.js (axios instance + interceptors)
│   ├── authService.js (login, logout, token management)
│   ├── doctorService.js (API calls)
│   ├── appointmentService.js
│
├── /context
│   ├── AuthContext.jsx (current user, token)
│   ├── NotificationContext.jsx (in-app notifications)
│
├── /hooks
│   ├── useAuth.js
│   ├── useNotification.js
│   ├── useFetch.js
│
├── /constants
│   ├── roles.js
│   ├── appointmentStatus.js
│   ├── specialities.js
│
├── /styles
│   ├── index.css (Tailwind + custom)
│
├── App.jsx (Routes)
├── main.jsx (Entry point)
```

### 6.3 Architecture Backend

```
/app
├── /Http
│   ├── /Controllers
│   │   ├── Auth/AuthController.php
│   │   ├── DoctorController.php
│   │   ├── AppointmentController.php
│   │   ├── SlotController.php
│   │   ├── Admin/UserController.php
│   │   ├── Admin/StatisticController.php
│   │
│   ├── /Middleware
│   │   ├── CheckRole.php
│   │   ├── VerifyApiToken.php
│   │
│   ├── /Requests (Validation)
│   │   ├── LoginRequest.php
│   │   ├── RegisterRequest.php
│   │   ├── AppointmentRequest.php
│
├── /Models
│   ├── User.php (with role)
│   ├── Doctor.php
│   ├── Patient.php (extends User)
│   ├── Appointment.php
│   ├── DoctorSlot.php
│   ├── Prescription.php
│   ├── Notification.php
│
├── /Events
│   ├── AppointmentCreated.php
│   ├── AppointmentConfirmed.php
│
├── /Listeners
│   ├── SendAppointmentNotification.php
│
├── /Mail
│   ├── AppointmentConfirmation.php
│   ├── AppointmentReminder.php
│
├── /Services (Business Logic)
│   ├── AppointmentService.php
│   ├── SlotService.php
│   ├── NotificationService.php
│   ├── PrescriptionService.php
│
/routes
├── api.php (API routes)
├── web.php (SPA fallback)

/database
├── /migrations
├── /seeders
├── /factories
```

### 6.4 Modèle de données

**Diagramme ER simplifié :**

```
USERS (parent)
├─ id (PK)
├─ email (UNIQUE)
├─ password (hashed)
├─ name
├─ role (enum: patient, doctor, admin)
├─ phone
├─ profile_photo_url
├─ is_active
├─ created_at
│
├─── DOCTOR (extends)
│    ├─ specialization
│    ├─ bio
│    └─ user_id (FK USERS)
│
└─── PATIENT
     ├─ date_of_birth
     └─ user_id (FK USERS)

DOCTOR_SLOTS
├─ id (PK)
├─ doctor_id (FK DOCTORS)
├─ start_time (datetime)
├─ end_time (datetime)
├─ is_available (boolean)
├─ created_at
│
└─ INDEX (doctor_id, start_time)

APPOINTMENTS
├─ id (PK)
├─ patient_id (FK USERS)
├─ doctor_id (FK DOCTORS)
├─ slot_id (FK DOCTOR_SLOTS, nullable)
├─ status (enum: pending, confirmed, rejected, cancelled, completed)
├─ reason (text, nullable)
├─ notes (text, nullable)
├─ created_at
│
└─ INDEX (patient_id, doctor_id, status)

PRESCRIPTIONS
├─ id (PK)
├─ appointment_id (FK APPOINTMENTS)
├─ doctor_id (FK DOCTORS)
├─ patient_id (FK USERS)
├─ content (json: array medicaments)
├─ created_at
│
└─ INDEX (patient_id, appointment_id)

NOTIFICATIONS
├─ id (PK)
├─ user_id (FK USERS)
├─ type (enum: appointment, reminder, etc.)
├─ data (json)
├─ read_at (nullable)
├─ created_at
│
└─ INDEX (user_id, created_at)
```

### 6.5 Flux API principal

**Exemple : Réservation RDV**

```
CLIENT
  1. GET /api/doctors?specialization=Cardio
     → Liste médecins + note moyenne
  
  2. GET /api/doctors/5/slots?date=2026-05-25
     → Créneaux disponibles Dr. Dupont
  
  3. POST /api/appointments
     Request:
     {
       "doctor_id": 5,
       "slot_id": 123,
       "reason": "Consultation cardiaque"
     }
     → Vérifie slot disponible
     → Crée appointment (status: pending)
     → Event AppointmentCreated
     → Return 201 Created
  
  4. Event Listener
     → Queue email patient (confirmation)
     → Notification médecin (nouvelle demande)

MÉDECIN (après 24h)
  5. GET /api/me/appointments?status=pending
     → Voir demandes en attente
  
  6. PUT /api/appointments/123/confirm
     → Appointment.status = confirmed
     → Event AppointmentConfirmed
     → Queue email patient (confirmation médicale)

PATIENT
  7. Email reçu "RDV confirmé"
  8. GET /api/me/appointments
     → Voir RDV confirmé
```

---

## 7. Sécurité et conformité

### 7.1 Authentification et autorisation

**Authentification :**
- Laravel Sanctum tokens (stateless)
- Token expiration : 24 heures
- Token révocation possible
- Refresh token pattern (optional)

**Hashage password :**
- Algorithme : bcrypt
- Cost factor : 12 (ajustable selon performance)
- Jamais stocké en plain text

**RBAC (Role-Based Access Control) :**
- Trois rôles : Patient, Doctor, Admin
- Middleware `CheckRole` pour route protection
- Policy Eloquent pour resource-level auth

**Exemple :**
```php
// Middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('role:doctor')->group(function () {
        Route::post('/appointments/{id}/confirm', ...);
    });
});

// Policy (Appointment)
public function update(User $user, Appointment $appt) {
    return $user->id === $appt->doctor_id;
}
```

### 7.2 Protection CSRF et XSS

**CSRF :**
- Token CSRF sur tous forms POST/PUT/DELETE
- Sanctum inclut middleware CSRF
- SameSite cookies strict

**XSS :**
- Input validation backend (FormRequest)
- Output sanitization (Blade escape)
- React sanitize automatiquement
- CSP header strict (optionnel)

### 7.3 SQL Injection

**Protection :**
- Eloquent ORM (parameterized queries)
- Jamais de string interpolation en SQL
- Validation input stricte

**Exemple :**
```php
// ❌ Unsafe
$users = DB::select("SELECT * FROM users WHERE email = '" . $email . "'");

// ✅ Safe - Eloquent
$user = User::where('email', $email)->first();

// ✅ Safe - Parameterized
$users = DB::select('SELECT * FROM users WHERE email = ?', [$email]);
```

### 7.4 Données sensibles

**Données sensibles :**
- Passwords : hashés bcrypt
- Tokens API : stockés sécurisé en base
- Email : indexé, pas exposé inutilement
- Dossiers médicaux : chiffrage optionnel (v2)

**Accès :**
- Patient voit que ses propres RDV
- Médecin voit patients assignés
- Admin voit tout avec audit log

### 7.5 Conformité RGPD

**Droits utilisateurs :**
- Droit accès : Endpoint export données
- Droit suppression : Soft delete compte
- Droit rectification : Modification profil
- Consentement : Checkbox inscription

**Politiques :**
- Privacy policy lien (requis avant inscription)
- Cookies banner (optionnel pour v1)
- Durée rétention : 2 ans après last login

### 7.6 Validation des données

**Frontend validation :**
- React Hook Form + validation custom
- Email format, password strength
- Feedback immédiat utilisateur

**Backend validation (obligatoire) :**
- FormRequest validation rules
- Custom rules si nécessaire
- Messages d'erreur localisés

**Exemple :**
```php
// AppointmentRequest
public function rules() {
    return [
        'doctor_id' => 'required|exists:doctors,id',
        'slot_id' => 'required|exists:doctor_slots,id',
        'reason' => 'nullable|string|max:500',
    ];
}
```

### 7.7 Headers de sécurité

**Middleware sécurité :**
```php
// Laravel
$middleware = [
    'X-Frame-Options' => 'DENY',
    'X-Content-Type-Options' => 'nosniff',
    'X-XSS-Protection' => '1; mode=block',
    'Referrer-Policy' => 'strict-origin-when-cross-origin',
    'Content-Security-Policy' => "default-src 'self'",
];
```

---

## 8. Planning prévisionnel

### 8.1 Calendrier Scrum

| Phase | Durée | Dates estimées |
|-------|-------|----------------|
| **Sprint 1** : Fondations + Auth | 2 semaines | 21/05 - 03/06 |
| **Sprint 2** : Gestion RDV Patient | 2 semaines | 04/06 - 17/06 |
| **Sprint 3** : Gestion Médecin | 2 semaines | 18/06 - 01/07 |
| **Sprint 4** : Admin + Tests + Deploy | 2 semaines | 02/07 - 15/07 |
| **Buffer/Correction** | 1 semaine | 16/07 - 22/07 |

### 8.2 Organisation Scrum

**Équipe :**
- 1 Product Owner (PO)
- 1 Scrum Master (SM)
- 6 Développeurs (2 lead, 4 juniors)

**Rôles :**
- Lead Backend : Architecture, mentoring
- Lead Frontend : Design system, composants
- 4 Développeurs : Implementation
- QA intégré (rotations)

**Cérémonies :**

| Cérémonie | Quand | Durée | Participants |
|-----------|-------|-------|------------|
| Daily Standup | 9h30 | 15 min | Équipe |
| Sprint Planning | J1 | 2h | Équipe + PO |
| Refinement | J3 | 1.5h | Équipe + PO |
| Sprint Review | J10 | 1h | Équipe + PO + Stakeholders |
| Sprint Retro | J10 | 1h | Équipe + SM |

### 8.3 Jalons majeurs

| Jalon | Date cible | Critère succès |
|-------|-----------|---------------|
| **MVP** | 15/07 | Fonctionnalités core opérationnelles |
| **Beta** | 22/07 | Tests intégration réussis |
| **Production** | 29/07 | Déploiement et go-live |
| **Soutenance** | 05/08 | Présentation projet |

---

## 9. Livrables attendus

### 9.1 Code source

| Livrable | Format | Contenu |
|----------|--------|---------|
| Frontend | GitHub repo | Code React complet + tests |
| Backend | GitHub repo | Code Laravel complet + tests |
| Database | SQL scripts | Migrations + seeders |
| CI/CD | GitHub Actions | Workflows test/build/deploy |

### 9.2 Documentation

| Livrable | Contenu |
|----------|---------|
| **README** | Installation, démarrage rapide, structure |
| **API Docs** | Endpoints détaillés, exemples, erreurs |
| **Architecture** | Diagrammes, design decisions |
| **Deployment** | Guide production, monitoring |
| **Coding Standards** | Conventions code, patterns |

### 9.3 Tests

| Livrable | Métrique |
|----------|----------|
| **Unit Tests** | ≥ 80% couverture backend |
| **Integration Tests** | Flux critiques couverts |
| **E2E Tests** | Scénarios principaux |
| **Performance** | Benchmarks baseline |

### 9.4 Rapports

| Livrable | Contenu |
|----------|---------|
| **Sprint Reports** | Rétrospectives et plannings |
| **Bug Tracker** | Issues GitHub avec priorités |
| **Performance Report** | Métriques, optimisations |
| **Security Audit** | Findings, recommendations |

### 9.5 Déploiement

| Livrable | Description |
|----------|------------|
| **Environnement Staging** | Mirror production, tests |
| **Environnement Production** | Application en ligne |
| **Monitoring** | Logs, alertes, status page |
| **Backup Strategy** | DB + files backup plan |

---

## 10. Conclusion

### Résumé

MEDBOOK est une plateforme complète de gestion de rendez-vous médicaux qui répond aux besoins critiques du secteur de la santé. Ce cahier des charges fournit une spécification détaillée permettant à l'équipe de développement de créer un produit de qualité, sécurisé et maintenable.

### Alignement avec objectifs

✅ **Objectif O1** : Interface intuitive et responsive répondra aux attentes des patients  
✅ **Objectif O2** : Agenda intelligent avec notifications automatiques optimisera travail médecin  
✅ **Objectif O3** : Rappels RDV et confirmations réduiront no-shows  
✅ **Objectif O4** : Documentation auto (notes + ordonnances) assurera traçabilité  
✅ **Objectif O5** : Sécurité renforcée (bcrypt, RBAC, RGPD) protégera données  
✅ **Objectif O6** : Architecture scalable avec cache + load balancing support croissance  

### Points clés à retenir

1. **Priorité : Patient Experience** - Interface simple, responsive, accessible
2. **Sécurité first** - Données médicales sensibles, conformité obligatoire
3. **Scalabilité** - Architecture préparée pour croissance 10x
4. **Quality** - Tests, code review, CI/CD dès jour 1
5. **Maintenance** - Code clean, documentation, monitoring

### Approbations

| Rôle | Signature | Date |
|------|-----------|------|
| Product Owner | ________________ | 21/05/2026 |
| Scrum Master | ________________ | 21/05/2026 |
| Lead Backend | ________________ | 21/05/2026 |
| Lead Frontend | ________________ | 21/05/2026 |

---

**Document prepared by :** Équipe MEDBOOK  
**Last revision :** 21 mai 2026  
**Next review :** Fin Sprint 2 (17/06/2026)
