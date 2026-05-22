# MEDBOOK - Work Breakdown Structure (WBS)

**Document Type :** Work Breakdown Structure  
**Projet :** MEDBOOK - Plateforme de Gestion de Rendez-vous Médicaux  
**Version :** 1.0  
**Date :** 21 mai 2026  
**Responsable :** Scrum Master  
**Durée totale :** 8 semaines (04/06 - 29/07)

---

## Table des matières

1. [Vue d'ensemble WBS](#vue-densemble)
2. [Hiérarchie détaillée](#hiérarchie-détaillée)
3. [Dictionnaire WBS](#dictionnaire-wbs)
4. [Estimations et dépendances](#estimations-et-dépendances)
5. [Assignation des responsabilités](#assignation-des-responsabilités)
6. [Calendrier de livraison](#calendrier-de-livraison)
7. [Risques et mitigations](#risques-et-mitigations)

---

## Vue d'ensemble

### Structure générale

```
MEDBOOK (Projet Total : 180 SP / 8 semaines)
│
├── 1. Gestion du Projet (20 SP)
├── 2. Analyse & Conception (25 SP)
├── 3. Développement Frontend (45 SP)
├── 4. Développement Backend (50 SP)
├── 5. Base de Données (15 SP)
├── 6. Intégration & Tests (20 SP)
├── 7. Sécurité & Déploiement (20 SP)
├── 8. Documentation (10 SP)
└── 9. Soutenance & Formation (5 SP)

Durée projet : 8 semaines
Équipe : 6 développeurs
Vélocité : 45 SP/sprint
```

---

## Hiérarchie détaillée

### 1. GESTION DU PROJET (20 SP)

**WBS 1.0 : Gestion Projet**

| ID | Lot de travail | Durée | SP | Responsable | Dépendances |
|----|----------------|-------|----|-----------|----|
| 1.1 | Initiation et lancement | 2 j | 3 | Scrum Master | - |
| 1.2 | Planification détaillée 4 sprints | 3 j | 5 | PO + SM | 1.1 |
| 1.3 | Mise en place infrastructure projet | 2 j | 3 | DevOps | 1.1 |
| 1.4 | Communication & reporting | Continue | 4 | SM | - |
| 1.5 | Gestion risques & changements | Continue | 5 | PO + SM | - |

#### 1.1 Initiation et lancement
**Objectif :** Démarrage officiel du projet avec tous les stakeholders  
**Tâches :**
- [ ] Kickoff meeting avec équipe (2h)
- [ ] Définition vision et objectifs
- [ ] Assignation rôles RACI
- [ ] Setup outils collaboration (GitHub, Slack, Jira)
- [ ] Établir conventions de communication

**Livrables :**
- Project Charter signé
- Contact list
- Communication plan

**Responsable :** Scrum Master  
**Ressources :** 1 SM, 6 devs (2h)

#### 1.2 Planification détaillée 4 sprints
**Objectif :** Détailler tous les sprints et raffiner backlog  
**Tâches :**
- [ ] Clarifier user stories avec PO (3 jours)
- [ ] Estimation collective story points
- [ ] Planifier sprint 1 détaillé
- [ ] Préparer estimations sprints 2-4
- [ ] Définir Definition of Done
- [ ] Setup velocity baseline

**Livrables :**
- Product Backlog priorisé
- Sprint 1 planné et assigné
- Velocity estimate (45 SP/sprint)

**Responsable :** PO + Scrum Master  
**Ressources :** Équipe complète

#### 1.3 Mise en place infrastructure projet
**Objectif :** Infrastructure technique ready  
**Tâches :**
- [ ] GitHub repo setup (main, develop, feature branches)
- [ ] GitHub Actions CI/CD initial
- [ ] Jira project creation
- [ ] Slack workspace + channels
- [ ] Wiki/Confluence pour documentation
- [ ] VCS conventions (gitflow)

**Livrables :**
- GitHub repos opérationnels
- CI/CD pipeline basique
- Project management board

**Responsable :** DevOps Lead  
**Ressources :** 1 DevOps, 1 Backend Lead

#### 1.4 Communication & Reporting
**Objectif :** Suivi continu et communication efficace  
**Tâches (continues) :**
- [ ] Daily standups (15 min)
- [ ] Weekly status reports
- [ ] Sprint reports (reviews + retros)
- [ ] Stakeholder updates (bi-weekly)
- [ ] Issue tracking et escalation

**Livrables :**
- Status reports
- Meeting notes
- Escalation tracking

**Responsable :** Scrum Master

#### 1.5 Gestion risques & changements
**Objectif :** Identifier et mitiger risques  
**Tâches (continues) :**
- [ ] Identification risques (weekly)
- [ ] Évaluation impact/probabilité
- [ ] Plan de mitigation
- [ ] Gestion changements de scope
- [ ] Suivi dépendances externes

**Livrables :**
- Risk register
- Change log
- Mitigation plans

**Responsable :** PO + Scrum Master

---

### 2. ANALYSE & CONCEPTION (25 SP)

**WBS 2.0 : Analyse et Conception**

| ID | Lot de travail | Durée | SP | Responsable | Dépendances |
|----|----------------|-------|----|-----------|----|
| 2.1 | Analyse détaillée besoins | 3 j | 5 | BA + PO | 1.1 |
| 2.2 | Design wireframes & mockups | 4 j | 8 | UI/UX Designer | 2.1 |
| 2.3 | Architecture système | 3 j | 5 | Tech Lead | 2.1 |
| 2.4 | Design API REST | 2 j | 4 | Backend Lead | 2.3 |
| 2.5 | Design base de données | 2 j | 3 | DB Lead | 2.1 |

#### 2.1 Analyse détaillée besoins
**Objectif :** Comprendre 100% les besoins métier  
**Tâches :**
- [ ] Interviews stakeholders (médecins, patients, admin)
- [ ] Affinage user personas
- [ ] User journeys détaillées
- [ ] Scenarios d'usage critiques
- [ ] Non-functional requirements review
- [ ] Acceptance criteria détaillé

**Livrables :**
- Business requirements document
- User personas
- Use case diagrams
- User journeys

**Responsable :** Business Analyst + PO  
**Ressources :** BA, PO, 2 devs pour validation tech

#### 2.2 Design wireframes & mockups
**Objectif :** Interface visuelle approuvée  
**Tâches :**
- [ ] Wireframes basse fidélité (Balsamiq)
- [ ] Design system définition
- [ ] Maquettes haute fidélité (Figma)
- [ ] Prototypage interactif
- [ ] Validation stakeholders
- [ ] Design tokens (colors, fonts, spacing)

**Livrables :**
- Wireframes + feedback
- Design mockups (Figma)
- Interactive prototype
- Design system guide
- Figma component library

**Responsable :** UI/UX Designer  
**Ressources :** Designer, Frontend Lead, 1 dev frontend

#### 2.3 Architecture système
**Objectif :** Architecture technique validée  
**Tâches :**
- [ ] Diagramme architecture (C4 model)
- [ ] Technology stack selection
- [ ] Design patterns (MVC, Repository, Service)
- [ ] Error handling strategy
- [ ] Logging & monitoring architecture
- [ ] Scalability considerations
- [ ] Security architecture review

**Livrables :**
- Architecture ADR (Architecture Decision Records)
- C4 diagrams
- Component diagrams
- Technology stack document
- Design patterns guide

**Responsable :** Tech Lead / Architect  
**Ressources :** Backend Lead, Frontend Lead, Senior Dev

#### 2.4 Design API REST
**Objectif :** Specification API complète  
**Tâches :**
- [ ] OpenAPI/Swagger specification
- [ ] Endpoint design (GET, POST, PUT, DELETE)
- [ ] Error codes & response formats
- [ ] Authentication flow (Sanctum)
- [ ] Rate limiting strategy
- [ ] Pagination standards
- [ ] API versioning strategy

**Livrables :**
- OpenAPI spec (YAML)
- Swagger UI documentation
- API design guidelines
- Mock API server (optionnel)

**Responsable :** Backend Lead  
**Ressources :** Backend Lead, 1 Senior Backend Dev

#### 2.5 Design base de données
**Objectif :** Schéma DB optimisé  
**Tâches :**
- [ ] ER diagram détaillé
- [ ] Normalisation (3NF minimum)
- [ ] Indexing strategy
- [ ] Partitioning (si nécessaire)
- [ ] Backup & recovery plan
- [ ] Data migration strategy (si applicable)
- [ ] Performance tuning assumptions

**Livrables :**
- ER diagram (Lucidchart/Draw.io)
- Database design document
- Indexing strategy
- Performance assumptions
- Migration scripts template

**Responsable :** DB Lead  
**Ressources :** Backend Lead, DBA/Database specialist

---

### 3. DÉVELOPPEMENT FRONTEND (45 SP)

**WBS 3.0 : Frontend React**

| ID | Lot de travail | Durée | SP | Responsable | Sprint | Dépendances |
|----|----------------|-------|----|-----------|----|------------|
| 3.1 | Setup & configuration | 2 j | 5 | Frontend Lead | 1 | 1.3 |
| 3.2 | Component library | 5 j | 8 | Frontend Lead | 1 | 3.1 |
| 3.3 | Auth pages & flows | 3 j | 5 | Dev Frontend | 1 | 3.2, 2.2 |
| 3.4 | Patient dashboard & search | 4 j | 8 | Dev Frontend | 2 | 3.3 |
| 3.5 | Appointment booking flow | 4 j | 8 | Dev Frontend | 2 | 3.4, 4.3 |
| 3.6 | Doctor dashboard & agenda | 4 j | 8 | Dev Frontend | 3 | 3.3 |
| 3.7 | Admin interface | 3 j | 5 | Dev Frontend | 4 | 3.3 |
| 3.8 | Notifications & messages | 2 j | 4 | Dev Frontend | 3 | 3.2 |

#### 3.1 Setup & Configuration Frontend
**Objectif :** Environnement React prêt pour développement  
**Tâches :**
- [ ] Vite project initialization
- [ ] Dependencies installation (axios, react-router, etc.)
- [ ] Tailwind CSS setup + customization
- [ ] ESLint & Prettier configuration
- [ ] Environment variables setup
- [ ] Mock API setup (Mirage.js optionnel)
- [ ] Project structure initialization

**Durée estimée :** 2 jours  
**Story Points :** 5  
**Livrables :**
- Vite project opérationnel
- Build pipeline configuré
- Dev server running
- Code style rules applied

**Responsable :** Frontend Lead  
**Dépendance :** Mise en place infra (1.3)

#### 3.2 Component Library
**Objectif :** Composants réutilisables cohérents  
**Tâches :**
- [ ] Base components (Button, Input, Card, Modal)
- [ ] Form components (Form, Field, Select, Checkbox)
- [ ] Layout components (Header, Sidebar, Container)
- [ ] Display components (Badge, Alert, Spinner)
- [ ] Storybook setup
- [ ] Component documentation
- [ ] Testing setup (Vitest + React Testing Library)

**Durée estimée :** 5 jours  
**Story Points :** 8  
**Livrables :**
- Reusable components library
- Storybook documentation
- Test suite pour composants

**Responsable :** Frontend Lead  
**Équipe :** Frontend Lead + 1 Dev Frontend

#### 3.3 Auth Pages & Flows
**Objectif :** Login/Register/Reset password opérationnel  
**Tâches :**
- [ ] Login page & component
- [ ] Register page avec validation
- [ ] Reset password flow
- [ ] Auth context/hooks
- [ ] Token management (localStorage)
- [ ] Protected routes
- [ ] Error handling & messages
- [ ] Integration API backend

**Durée estimée :** 3 jours  
**Story Points :** 5  
**Livrables :**
- Working auth pages
- AuthContext implementation
- Protected routing
- API integration tests

**Responsable :** Dev Frontend  
**Dépendance :** 3.2, 2.2, 4.1 (backend auth)

#### 3.4 Patient Dashboard & Search
**Objectif :** Patient peut chercher et voir ses RDV  
**Tâches :**
- [ ] Patient dashboard layout
- [ ] Doctor search & filter component
- [ ] Doctor profile page
- [ ] My appointments list
- [ ] Pagination & sorting
- [ ] Real-time updates (optionnel)
- [ ] Responsive design

**Durée estimée :** 4 jours  
**Story Points :** 8  
**Livrables :**
- Patient dashboard opérationnel
- Search functionality
- My appointments page
- Responsive layouts

**Responsable :** Dev Frontend  
**Dépendance :** 3.3, 4.7 (API doctors)

#### 3.5 Appointment Booking Flow
**Objectif :** Patient peut réserver un RDV  
**Tâches :**
- [ ] Calendar component (react-big-calendar)
- [ ] Slot selection logic
- [ ] Booking form
- [ ] Confirmation modal
- [ ] Error handling (slot unavailable, etc.)
- [ ] Success message
- [ ] Integration API

**Durée estimée :** 4 jours  
**Story Points :** 8  
**Livrables :**
- Working booking flow
- Calendar component
- API integration

**Responsable :** Dev Frontend  
**Dépendance :** 3.4, 4.8 (API appointments)

#### 3.6 Doctor Dashboard & Agenda
**Objectif :** Médecin peut gérer son agenda  
**Tâches :**
- [ ] Doctor dashboard layout
- [ ] Agenda calendar (week/month view)
- [ ] Create slots form
- [ ] Manage slots (edit/delete)
- [ ] Appointments pending approval
- [ ] Confirm/reject flows
- [ ] Responsive design

**Durée estimée :** 4 jours  
**Story Points :** 8  
**Livrables :**
- Doctor dashboard
- Slot management interface
- Appointment approval flow

**Responsable :** Dev Frontend  
**Dépendance :** 3.3, 4.9 (API slots)

#### 3.7 Admin Interface
**Objectif :** Admin supervise plateforme  
**Tâches :**
- [ ] Admin dashboard
- [ ] User management table
- [ ] Statistics & charts
- [ ] System settings
- [ ] User CRUD operations
- [ ] Report generation (CSV/PDF)
- [ ] Audit logs viewer

**Durée estimée :** 3 jours  
**Story Points :** 5  
**Livrables :**
- Admin panel opérationnel
- User management interface
- Statistics dashboard

**Responsable :** Dev Frontend  
**Dépendance :** 3.3, 4.10 (API admin)

#### 3.8 Notifications & Messages
**Objectif :** Utilisateurs reçoivent notifications  
**Tâches :**
- [ ] Notification bell component
- [ ] Notification center
- [ ] Toast notifications
- [ ] WebSocket integration (optionnel)
- [ ] Notification preferences
- [ ] Email templates (frontend compatible)
- [ ] Push notifications (Service Worker)

**Durée estimée :** 2 jours  
**Story Points :** 4  
**Livrables :**
- Notification system
- Notification center page
- Real-time notification updates

**Responsable :** Dev Frontend  
**Dépendance :** 3.2, 4.11 (API notifications)

---

### 4. DÉVELOPPEMENT BACKEND (50 SP)

**WBS 4.0 : Backend Laravel**

| ID | Lot de travail | Durée | SP | Responsable | Sprint | Dépendances |
|----|----------------|-------|----|-----------|----|------------|
| 4.1 | Setup & configuration | 2 j | 5 | Backend Lead | 1 | 1.3, 2.3 |
| 4.2 | Models & Migrations | 3 j | 5 | Backend Dev | 1 | 4.1 |
| 4.3 | Auth system (Sanctum) | 3 j | 6 | Backend Dev | 1 | 4.2 |
| 4.4 | RBAC & Permissions | 2 j | 4 | Backend Dev | 1 | 4.3 |
| 4.5 | Doctor endpoints | 2 j | 4 | Backend Dev | 2 | 4.2 |
| 4.6 | Slots management API | 3 j | 5 | Backend Dev | 2 | 4.2 |
| 4.7 | Appointment CRUD | 4 j | 8 | Backend Dev | 2 | 4.2, 4.6 |
| 4.8 | Appointment logic & validation | 3 j | 5 | Backend Dev | 2 | 4.7 |
| 4.9 | Admin endpoints | 3 j | 5 | Backend Dev | 3 | 4.2 |
| 4.10 | Statistics & reporting | 2 j | 4 | Backend Dev | 4 | 4.9 |
| 4.11 | Notifications system | 3 j | 6 | Backend Dev | 3 | 4.3 |
| 4.12 | Error handling & logging | 2 j | 4 | Backend Lead | 4 | 4.1 |

#### 4.1 Setup & Configuration Backend
**Objectif :** Environnement Laravel prêt  
**Tâches :**
- [ ] Laravel project initialization
- [ ] Dependencies via Composer
- [ ] Environment configuration
- [ ] Database connection setup
- [ ] App service provider configuration
- [ ] API middleware setup (CORS, auth, etc.)
- [ ] Logging configuration

**Durée estimée :** 2 jours  
**Story Points :** 5  
**Livrables :**
- Laravel app opérationnel
- API server running on :8000
- Environment configured

**Responsable :** Backend Lead  
**Dépendance :** 1.3, 2.3

#### 4.2 Models & Migrations
**Objectif :** Structure BD complète en place  
**Tâches :**
- [ ] User model & migration
- [ ] Doctor model & migration
- [ ] Patient model & migration (extends User)
- [ ] Appointment model & migration
- [ ] DoctorSlot model & migration
- [ ] Prescription model & migration
- [ ] Notification model & migration
- [ ] Relationships definition (HasMany, BelongsTo)
- [ ] Scopes & mutators

**Durée estimée :** 3 jours  
**Story Points :** 5  
**Livrables :**
- All models defined
- Migrations created
- Relationships functional
- Database schema complete

**Responsable :** Backend Dev (Senior)  
**Dépendance :** 4.1, 2.5 (DB design)

#### 4.3 Auth System (Sanctum)
**Objectif :** Authentification JWT/tokens sécurisée  
**Tâches :**
- [ ] Sanctum configuration
- [ ] Register endpoint (validation, hashing)
- [ ] Login endpoint (token generation)
- [ ] Logout endpoint (token revocation)
- [ ] Reset password flow
- [ ] Email verification (optional)
- [ ] Token middleware
- [ ] CSRF protection

**Durée estimée :** 3 jours  
**Story Points :** 6  
**Livrables :**
- Working auth endpoints
- Token generation & validation
- Email verification flow
- Security best practices applied

**Responsable :** Backend Dev  
**Dépendance :** 4.2

#### 4.4 RBAC & Permissions
**Objectif :** Contrôle d'accès basé sur rôles  
**Tâches :**
- [ ] Role & Permission models
- [ ] Middleware CheckRole
- [ ] Policy classes (Appointment, Slot, User)
- [ ] Gate definitions
- [ ] Seeder pour roles/permissions
- [ ] Authorization checks dans controllers

**Durée estimée :** 2 jours  
**Story Points :** 4  
**Livrables :**
- Role/permission system
- Authorization middleware
- Policies implemented

**Responsable :** Backend Dev  
**Dépendance :** 4.3

#### 4.5 Doctor Endpoints
**Objectif :** API listing et détails médecins  
**Tâches :**
- [ ] GET /api/doctors (list)
- [ ] GET /api/doctors/{id} (detail)
- [ ] Filtering by specialization
- [ ] Search by name
- [ ] Pagination
- [ ] Caching for performance
- [ ] Rating calculation

**Durée estimée :** 2 jours  
**Story Points :** 4  
**Livrables :**
- Doctor API endpoints
- Query optimization
- Caching implemented

**Responsable :** Backend Dev  
**Dépendance :** 4.2

#### 4.6 Slots Management API
**Objectif :** CRUD créneaux horaires  
**Tâches :**
- [ ] POST /api/doctors/slots (create)
- [ ] PUT /api/slots/{id} (update)
- [ ] DELETE /api/slots/{id} (delete)
- [ ] GET /api/doctors/{id}/slots (list by doctor & date)
- [ ] Recurrence logic (daily, weekly)
- [ ] Validation (no overlap, business hours)
- [ ] Availability calculation

**Durée estimée :** 3 jours  
**Story Points :** 5  
**Livrables :**
- Slots CRUD API
- Recurrence logic
- Validation rules

**Responsable :** Backend Dev  
**Dépendance :** 4.2, 4.4

#### 4.7 Appointment CRUD
**Objectif :** Créer/lire/modifier rendez-vous  
**Tâches :**
- [ ] POST /api/appointments (create)
- [ ] GET /api/appointments/{id} (detail)
- [ ] GET /api/me/appointments (my appointments)
- [ ] PUT /api/appointments/{id} (update)
- [ ] Slot availability check
- [ ] Conflict detection (patient already booked)
- [ ] Status management (pending, confirmed, etc.)
- [ ] Authorization checks

**Durée estimée :** 4 jours  
**Story Points :** 8  
**Livrables :**
- Appointment CRUD endpoints
- Conflict detection
- Status transitions

**Responsable :** Backend Dev  
**Dépendance :** 4.2, 4.6, 4.4

#### 4.8 Appointment Logic & Validation
**Objectif :** Confirmer/refuser, notes, ordonnances  
**Tâches :**
- [ ] PUT /api/appointments/{id}/confirm
- [ ] PUT /api/appointments/{id}/reject
- [ ] PUT /api/appointments/{id}/cancel
- [ ] PUT /api/appointments/{id}/notes
- [ ] POST /api/appointments/{id}/prescription
- [ ] Validation métier (24h rule, etc.)
- [ ] Events & listeners

**Durée estimée :** 3 jours  
**Story Points :** 5  
**Livrables :**
- Appointment state transitions
- Prescription generation
- Business rules enforced

**Responsable :** Backend Dev  
**Dépendance :** 4.7

#### 4.9 Admin Endpoints
**Objectif :** APIs administration  
**Tâches :**
- [ ] GET /api/admin/users (list)
- [ ] POST /api/admin/users (create)
- [ ] PUT /api/admin/users/{id} (edit)
- [ ] DELETE /api/admin/users/{id} (delete)
- [ ] User activation/deactivation
- [ ] Audit log tracking
- [ ] Admin authorization

**Durée estimée :** 3 jours  
**Story Points :** 5  
**Livrables :**
- Admin CRUD endpoints
- Audit logging
- User management API

**Responsable :** Backend Dev  
**Dépendance :** 4.2, 4.4

#### 4.10 Statistics & Reporting
**Objectif :** Statistiques pour dashboard admin  
**Tâches :**
- [ ] GET /api/admin/statistics (overview)
- [ ] Appointments count by month
- [ ] Doctors by specialization
- [ ] Confirmation/cancellation rates
- [ ] Peak hours analysis
- [ ] Report generation (PDF/CSV)
- [ ] Caching pour performances

**Durée estimée :** 2 jours  
**Story Points :** 4  
**Livrables :**
- Statistics endpoints
- Report generation
- Performance metrics

**Responsable :** Backend Dev  
**Dépendance :** 4.9

#### 4.11 Notifications System
**Objectif :** Emails et in-app notifications  
**Tâches :**
- [ ] Notification model & migration
- [ ] Event listeners (AppointmentCreated, etc.)
- [ ] Mailable classes (confirmation, reminder, etc.)
- [ ] Queue jobs for email sending
- [ ] In-app notification creation
- [ ] Push notification setup (optional)
- [ ] Notification preferences

**Durée estimée :** 3 jours  
**Story Points :** 6  
**Livrables :**
- Notification system complete
- Email templates
- Queue jobs for async sending

**Responsable :** Backend Dev  
**Dépendance :** 4.3

#### 4.12 Error Handling & Logging
**Objectif :** Exception handling et observabilité  
**Tâches :**
- [ ] Exception handler customization
- [ ] Error response standardization
- [ ] Logging setup (Laravel Pail)
- [ ] Error tracking (Sentry optional)
- [ ] Detailed error messages
- [ ] HTTP status codes proper usage
- [ ] Request/response logging

**Durée estimée :** 2 jours  
**Story Points :** 4  
**Livrables :**
- Exception handling
- Structured logging
- Error response format

**Responsable :** Backend Lead  
**Dépendance :** 4.1

---

### 5. BASE DE DONNÉES (15 SP)

**WBS 5.0 : Infrastructure Base de Données**

| ID | Lot de travail | Durée | SP | Responsable | Sprint | Dépendances |
|----|----------------|-------|----|-----------|----|------------|
| 5.1 | Database setup & optimization | 2 j | 5 | DB Lead | 1 | 4.2 |
| 5.2 | Indexing strategy | 1.5 j | 3 | DB Lead | 1 | 5.1 |
| 5.3 | Backup & recovery procedures | 1.5 j | 3 | DevOps | 2 | 5.1 |
| 5.4 | Data seeding & fixtures | 1.5 j | 2 | Backend Dev | 1 | 4.2 |
| 5.5 | Performance tuning | 1.5 j | 2 | DB Lead | 4 | 5.2 |

#### 5.1 Database Setup & Optimization
**Objectif :** Base de données optimisée  
**Tâches :**
- [ ] MySQL server configuration
- [ ] Database creation
- [ ] Character set & collation
- [ ] Connection pooling setup
- [ ] Query optimization (EXPLAIN analysis)
- [ ] Statistics gathering
- [ ] Parameter tuning

**Durée estimée :** 2 jours  
**Story Points :** 5  
**Livrables :**
- Optimized database
- Configuration documented
- Performance baseline

**Responsable :** DB Lead  
**Dépendance :** 4.2

#### 5.2 Indexing Strategy
**Objectif :** Indexes optimisés pour requêtes  
**Tâches :**
- [ ] Identifier slow queries
- [ ] Create indexes (composite, partial)
- [ ] Index maintenance strategy
- [ ] Query plan analysis
- [ ] Avoid index bloat
- [ ] Regular maintenance tasks

**Durée estimée :** 1.5 jours  
**Story Points :** 3  
**Livrables :**
- Indexes created & tested
- Maintenance plan

**Responsable :** DB Lead  
**Dépendance :** 5.1

#### 5.3 Backup & Recovery Procedures
**Objectif :** Données sécurisées en cas de disaster  
**Tâches :**
- [ ] Backup strategy (full, incremental)
- [ ] Backup schedule
- [ ] Off-site backup storage
- [ ] Recovery time objective (RTO)
- [ ] Recovery point objective (RPO)
- [ ] Restore procedures documentation
- [ ] Testing restore procedures

**Durée estimée :** 1.5 jours  
**Story Points :** 3  
**Livrables :**
- Backup scripts
- Recovery procedures
- RTO/RPO defined

**Responsable :** DevOps  
**Dépendance :** 5.1

#### 5.4 Data Seeding & Fixtures
**Objectif :** Données de test complètes  
**Tâches :**
- [ ] Faker integration
- [ ] Seeders pour doctors, patients, appointments
- [ ] Realistic test data (100+ records)
- [ ] Relationships properly seeded
- [ ] Database reset for clean state
- [ ] Fixture loading in tests

**Durée estimée :** 1.5 jours  
**Story Points :** 2  
**Livrables :**
- Database seeders
- Test fixtures
- Development data

**Responsable :** Backend Dev  
**Dépendance :** 4.2

#### 5.5 Performance Tuning
**Objectif :** Database queries performantes  
**Tâches :**
- [ ] Query profiling
- [ ] Slow query log analysis
- [ ] Cache warming strategy
- [ ] Connection pooling tuning
- [ ] Memory allocation optimization
- [ ] Load testing avec données réelles

**Durée estimée :** 1.5 jours  
**Story Points :** 2  
**Livrables :**
- Optimized configurations
- Performance metrics
- Recommendations

**Responsable :** DB Lead  
**Dépendance :** 5.2

---

### 6. INTÉGRATION & TESTS (20 SP)

**WBS 6.0 : Intégration et Tests**

| ID | Lot de travail | Durée | SP | Responsable | Sprint | Dépendances |
|----|----------------|-------|----|-----------|----|------------|
| 6.1 | Unit tests backend | 5 j | 8 | Backend Dev | 4 | 4.1-4.12 |
| 6.2 | Integration tests API | 3 j | 5 | Backend Dev | 4 | 6.1 |
| 6.3 | Frontend component tests | 3 j | 5 | Frontend Dev | 4 | 3.1-3.8 |
| 6.4 | E2E tests (Playwright) | 3 j | 6 | QA/Frontend | 4 | 6.3 |

#### 6.1 Unit Tests Backend
**Objectif :** Couverture tests ≥ 80%  
**Tâches :**
- [ ] Tests pour models (validations, scopes)
- [ ] Tests pour services (business logic)
- [ ] Tests pour helpers/utilities
- [ ] Mocking dépendances externes
- [ ] Assertions sur state changes
- [ ] Coverage report (PHPUnit)
- [ ] Test suites organization

**Durée estimée :** 5 jours  
**Story Points :** 8  
**Livrables :**
- Unit test suite
- Code coverage report (≥80%)
- CI pipeline with tests

**Responsable :** Backend Dev (Senior)  
**Dépendance :** 4.1-4.12

#### 6.2 Integration Tests API
**Objectif :** API endpoints fonctionnels  
**Tâches :**
- [ ] Feature tests pour endpoints
- [ ] HTTP request/response testing
- [ ] Database state assertions
- [ ] Auth & authorization tests
- [ ] Error handling tests
- [ ] Rate limiting tests
- [ ] API contract tests

**Durée estimée :** 3 jours  
**Story Points :** 5  
**Livrables :**
- Integration test suite
- API contract documentation
- Test database snapshots

**Responsable :** Backend Dev  
**Dépendance :** 6.1

#### 6.3 Frontend Component Tests
**Objectif :** Components testés avec React Testing Library  
**Tâches :**
- [ ] Render tests pour tous components
- [ ] User interaction tests
- [ ] Props testing
- [ ] State management tests
- [ ] Error boundary tests
- [ ] Accessibility tests (a11y)
- [ ] Coverage report (Vitest)

**Durée estimée :** 3 jours  
**Story Points :** 5  
**Livrables :**
- Component test suite
- Coverage report (≥80%)
- Accessibility report

**Responsable :** Frontend Dev  
**Dépendance :** 3.1-3.8

#### 6.4 E2E Tests (Playwright)
**Objectif :** Scénarios utilisateur complets  
**Tâches :**
- [ ] Playwright project setup
- [ ] Page objects pattern
- [ ] Critical user journeys
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile testing
- [ ] Visual regression tests (optional)
- [ ] Performance testing (Lighthouse)
- [ ] Test execution in CI/CD

**Durée estimée :** 3 jours  
**Story Points :** 6  
**Livrables :**
- E2E test suite
- Test report & artifacts
- CI/CD integration

**Responsable :** QA/Frontend Lead  
**Dépendance :** 6.3

---

### 7. SÉCURITÉ & DÉPLOIEMENT (20 SP)

**WBS 7.0 : Sécurité et Déploiement**

| ID | Lot de travail | Durée | SP | Responsable | Sprint | Dépendances |
|----|----------------|-------|----|-----------|----|------------|
| 7.1 | Security hardening | 3 j | 6 | Security Lead | 4 | 4.1-4.12, 3.1-3.8 |
| 7.2 | OWASP & vulnerability scanning | 2 j | 4 | Security Lead | 4 | 7.1 |
| 7.3 | CI/CD pipeline complete | 3 j | 6 | DevOps | 4 | 1.3, 6.1-6.4 |
| 7.4 | Staging deployment | 1 j | 2 | DevOps | 4 | 7.3 |
| 7.5 | Production deployment | 1 j | 2 | DevOps | 4 | 7.4 |

#### 7.1 Security Hardening
**Objectif :** Application sécurisée contre attaques communes  
**Tâches :**
- [ ] CSRF token implementation
- [ ] XSS protection (input validation, output escaping)
- [ ] SQL injection prevention (parameterized queries)
- [ ] Password hashing (bcrypt cost 12)
- [ ] Rate limiting on auth endpoints
- [ ] Security headers (X-Frame-Options, CSP, HSTS)
- [ ] HTTPS enforcement
- [ ] CORS configuration
- [ ] Input validation & sanitization

**Durée estimée :** 3 jours  
**Story Points :** 6  
**Livrables :**
- Security implementation complete
- Security checklist signed off
- Penetration test ready

**Responsable :** Security Lead / Backend Lead  
**Dépendance :** 4.1-4.12, 3.1-3.8

#### 7.2 OWASP & Vulnerability Scanning
**Objectif :** Scanner & corriger vulnérabilités connues  
**Tâches :**
- [ ] OWASP Top 10 review
- [ ] Dependency scanning (composer audit, npm audit)
- [ ] Static code analysis (PHPStan, ESLint)
- [ ] Dynamic security testing (DAST)
- [ ] SQL injection testing
- [ ] XSS testing
- [ ] Vulnerability remediation

**Durée estimée :** 2 jours  
**Story Points :** 4  
**Livrables :**
- Security audit report
- Vulnerability list & fixes
- Remediation plan

**Responsable :** Security Lead  
**Dépendance :** 7.1

#### 7.3 CI/CD Pipeline Complete
**Objectif :** Automatisation build, test, deploy  
**Tâches :**
- [ ] GitHub Actions workflows
- [ ] Linting (ESLint, PHP_CodeSniffer)
- [ ] Build jobs (frontend, backend)
- [ ] Test execution (unit, integration, e2e)
- [ ] Code coverage reporting
- [ ] Artifact creation
- [ ] Deployment jobs (staging)
- [ ] Notifications (Slack, email)

**Durée estimée :** 3 jours  
**Story Points :** 6  
**Livrables :**
- CI/CD workflows configured
- Automated test execution
- Build artifacts

**Responsable :** DevOps Lead  
**Dépendance :** 1.3, 6.1-6.4

#### 7.4 Staging Deployment
**Objectif :** Application running sur environnement staging  
**Tâches :**
- [ ] Staging server setup (cloud VPS)
- [ ] Database provisioning
- [ ] Environment variables configuration
- [ ] SSL certificates (Let's Encrypt)
- [ ] Nginx configuration
- [ ] Deploy scripts
- [ ] Monitoring setup (optional)
- [ ] Smoke tests

**Durée estimée :** 1 jour  
**Story Points :** 2  
**Livrables :**
- Staging environment ready
- Deployment playbooks
- Access documentation

**Responsable :** DevOps Lead  
**Dépendance :** 7.3

#### 7.5 Production Deployment
**Objectif :** Application deployée en production  
**Tâches :**
- [ ] Production server setup
- [ ] Database replication (high availability)
- [ ] Redis cache setup
- [ ] Load balancer configuration
- [ ] Monitoring & alerting
- [ ] Log aggregation
- [ ] Status page setup
- [ ] Runbooks pour incidents
- [ ] Deployment & go-live

**Durée estimée :** 1 jour  
**Story Points :** 2  
**Livrables :**
- Production environment live
- Monitoring dashboards
- Support procedures

**Responsable :** DevOps Lead  
**Dépendance :** 7.4

---

### 8. DOCUMENTATION (10 SP)

**WBS 8.0 : Documentation Projet**

| ID | Lot de travail | Durée | SP | Responsable | Sprint | Dépendances |
|----|----------------|-------|----|-----------|----|------------|
| 8.1 | Technical documentation | 2 j | 3 | Tech Writer | 4 | 4.1-4.12, 3.1-3.8 |
| 8.2 | API documentation (OpenAPI) | 2 j | 3 | Backend Lead | 4 | 2.4, 4.1-4.12 |
| 8.3 | User guides & tutorials | 1.5 j | 2 | Technical Writer | 4 | 3.1-3.8 |
| 8.4 | Code documentation & comments | 1 j | 2 | Developers | Continu | - |

#### 8.1 Technical Documentation
**Objectif :** Guide architectural et technique  
**Tâches :**
- [ ] Architecture documentation
- [ ] Component diagrams
- [ ] Sequence diagrams
- [ ] Database schema documentation
- [ ] API architecture
- [ ] Deployment procedures
- [ ] Troubleshooting guide
- [ ] Runbooks pour opérations

**Durée estimée :** 2 jours  
**Story Points :** 3  
**Livrables :**
- Technical documentation
- Architecture diagrams
- Operational procedures

**Responsable :** Tech Writer / Architect  
**Dépendance :** 4.1-4.12, 3.1-3.8

#### 8.2 API Documentation (OpenAPI)
**Objectif :** API reference complète & interactive  
**Tâches :**
- [ ] OpenAPI specification (YAML)
- [ ] Swagger UI setup
- [ ] Endpoint documentation
- [ ] Example requests/responses
- [ ] Error codes documentation
- [ ] Authentication guide
- [ ] Rate limiting information
- [ ] Changelog API

**Durée estimée :** 2 jours  
**Story Points :** 3  
**Livrables :**
- OpenAPI specification
- Interactive API documentation
- Example client code

**Responsable :** Backend Lead  
**Dépendance :** 2.4, 4.1-4.12

#### 8.3 User Guides & Tutorials
**Objectif :** Guides pour utilisateurs finaux  
**Tâches :**
- [ ] Patient quick start guide
- [ ] Doctor user guide
- [ ] Admin user guide
- [ ] FAQ section
- [ ] Video tutorials (optional)
- [ ] Accessibility guidelines
- [ ] Mobile app guide

**Durée estimée :** 1.5 jours  
**Story Points :** 2  
**Livrables :**
- User guides (PDF + Web)
- Video tutorials
- FAQ database

**Responsable :** Technical Writer  
**Dépendance :** 3.1-3.8

#### 8.4 Code Documentation & Comments
**Objectif :** Code auto-documenté et commenté  
**Tâches (continues) :**
- [ ] JSDoc/PHPDoc comments
- [ ] Complex logic explanation
- [ ] Type hints/annotations
- [ ] README pour chaque module
- [ ] Inline comments pour edge cases
- [ ] Examples dans code

**Durée estimée :** 1 jour  
**Story Points :** 2  
**Livrables :**
- Well-documented codebase
- Code standards enforced
- Documentation generator output

**Responsable :** Developers  
**Dépendance :** Continu pendant développement

---

### 9. SOUTENANCE & FORMATION (5 SP)

**WBS 9.0 : Présentation et Formation**

| ID | Lot de travail | Durée | SP | Responsable | Sprint | Dépendances |
|----|----------------|-------|----|-----------|----|------------|
| 9.1 | Préparation présentation | 2 j | 3 | PO + Tech Lead | 4 | 8.1-8.4 |
| 9.2 | Formation utilisateurs | 1 j | 2 | Tech Writer | 4 | 8.3 |

#### 9.1 Préparation Présentation
**Objectif :** Présentation projet complète  
**Tâches :**
- [ ] Slides création (problem, solution, features, demo)
- [ ] Live demo preparation
- [ ] Video recording (backup)
- [ ] Q&A preparation
- [ ] Metrics & achievements
- [ ] Lessons learned
- [ ] Future roadmap

**Durée estimée :** 2 jours  
**Story Points :** 3  
**Livrables :**
- Presentation slides
- Demo scenarios
- Supporting materials

**Responsable :** PO + Tech Lead  
**Dépendance :** 8.1-8.4

#### 9.2 Formation Utilisateurs
**Objectif :** Utilisateurs formés sur plateforme  
**Tâches :**
- [ ] Training material preparation
- [ ] Live training sessions
- [ ] Q&A support
- [ ] Knowledge base setup
- [ ] Support contact information
- [ ] Community setup (optional)

**Durée estimée :** 1 jour  
**Story Points :** 2  
**Livrables :**
- Training materials
- Training videos
- Support resources

**Responsable :** Technical Writer  
**Dépendance :** 8.3

---

## Dictionnaire WBS

### Format standard pour chaque Work Package

```
ID: X.Y.Z
Titre: [Titre du lot]
Description: [Description concise]

Objectif:
- [Objectif 1]
- [Objectif 2]

Tâches:
- [ ] Tâche 1
- [ ] Tâche 2
- [ ] Tâche 3

Durée estimée: X jours
Story Points: Y
Ressources: [Liste ressources]

Livrables:
- Livrable 1
- Livrable 2

Dépendances:
- WBS X.Y.Z
- WBS A.B.C

Responsable: [Nom]
Critères d'acceptation:
- Critère 1
- Critère 2
```

---

## Estimations et dépendances

### Matrice des dépendances

```
SPRINT 1 (45 SP - Semaines 1-2)
├─ 1.1 Initiation [3 SP] ──────────────────┐
├─ 1.3 Infrastructure [3 SP] ────────┬──────┤
├─ 2.1 Analyse besoins [5 SP] ───────┤
├─ 2.3 Architecture [5 SP] ──────┬───┤
├─ 2.5 DB Design [3 SP] ────┬────┤
├─ 3.1 Frontend setup [5 SP] │────┼────┐
├─ 3.2 Component library [8 SP] ────┤
├─ 4.1 Backend setup [5 SP] ────────┼─┐
├─ 4.2 Models & Migrations [5 SP] ──┼─┼┐
├─ 4.3 Auth system [6 SP] ──────────┼─┼├─┐
├─ 4.4 RBAC [4 SP] ────────────────────┘
└─ 5.1 DB setup [5 SP] ────────────┘

Chemin critique : 1.1 → 1.3 → 4.1 → 4.2 → 4.3
Durée critique : 22 SP
```

### Critical Path Analysis

**Chemin critique (priorité):**
```
Initiation (1.1)
  ↓ (2j)
Infrastructure (1.3)
  ↓ (2j)
Backend Setup (4.1)
  ↓ (2j)
Models (4.2)
  ↓ (3j)
Auth System (4.3)
  ↓ (3j)
Appointment CRUD (4.7)
  ↓ (4j)
Integration Tests (6.2)
  ↓ (3j)

Total durée critique: 22 jours ouvrables
Buffer recommandé : 2 jours (urgences)
```

### Slack Time par WBS

| WBS | Durée planifiée | Slack estimé | Risk level |
|-----|-----------------|-------------|-----------|
| 1.1 | 2j | 1j | Low |
| 4.2 | 3j | 0.5j | Critical |
| 4.7 | 4j | 0j | Critical |
| 6.2 | 3j | 0.5j | Critical |
| 7.3 | 3j | 1j | High |

---

## Assignation des responsabilités

### Matrice RACI

| WBS | Responsable | Accountable | Consulted | Informed |
|-----|------------|------------|-----------|----------|
| 1.0 | Scrum Master | PO | Tech Lead | Équipe |
| 2.1 | Business Analyst | PO | Tech Lead | - |
| 2.2 | UI/UX Designer | Frontend Lead | - | Équipe |
| 3.x | Frontend Lead | Frontend Lead | Backend Lead | PO |
| 4.x | Backend Lead | Backend Lead | Frontend Lead | PO |
| 5.x | DBA / DB Lead | DevOps | Backend Lead | - |
| 6.x | QA Lead | QA Lead | Backend + Frontend | - |
| 7.x | DevOps | DevOps | Tech Lead | Équipe |
| 8.x | Tech Writer | Tech Lead | Developers | - |
| 9.x | PO | PO | Tech Lead | Stakeholders |

### Team Structure

```
PROJECT MANAGER (Scrum Master)
├─ BACKEND TEAM
│  ├─ Backend Lead (Senior)
│  ├─ Backend Dev 1 (Senior)
│  ├─ Backend Dev 2 (Junior)
│  └─ DBA / Database specialist
│
├─ FRONTEND TEAM
│  ├─ Frontend Lead (Senior)
│  ├─ Frontend Dev 1 (Senior)
│  ├─ Frontend Dev 2 (Junior)
│  └─ UI/UX Designer
│
└─ DEVOPS & QA
   ├─ DevOps Lead
   ├─ QA Engineer
   └─ Tech Writer

Total: 6 développeurs + 1 SM + 1 PO
```

---

## Calendrier de livraison

### Gantt Chart Simplifié

```
SPRINT 1 (21/05 - 03/06)
[1.x Project Mgmt ████]
[2.x Analysis/Design ████]
[3.1-3.2 Frontend Setup ████]
[4.1-4.4 Backend Core ████]
[5.1-5.2 Database ████]

SPRINT 2 (04/06 - 17/06)
[2.3-2.5 Complete Design ██]
[3.3-3.5 Patient Features ████]
[4.5-4.8 Appointments ████]
[5.3-5.4 DB Ops ████]

SPRINT 3 (18/06 - 01/07)
[3.6-3.8 Doctor/Admin ████]
[4.9-4.11 Admin API ████]
[6.1-6.3 Testing ████]
[7.3 CI/CD Pipeline ████]

SPRINT 4 (02/07 - 15/07)
[6.4 E2E Tests ████]
[7.1-7.5 Security/Deploy ████]
[8.x Documentation ████]
[9.x Soutenance ████]

BUFFER (16/07 - 22/07)
[Fixes & Refinements ██]

LAUNCH (29/07)
[Production Go-Live]
```

### Date importantes

| Jalon | Date | Critère |
|-------|------|---------|
| **Kickoff** | 21/05 | Team réunie, projet lancé |
| **Sprint 1 End** | 03/06 | Infrastructure + Auth prête |
| **Sprint 2 End** | 17/06 | Patient features opérationnelles |
| **Sprint 3 End** | 01/07 | Doctor + Admin + Tests ✅ |
| **Sprint 4 End** | 15/07 | Production ready |
| **UAT** | 22-29/07 | Derniers tests |
| **Go-Live** | 29/07 | Production launch |
| **Soutenance** | 05/08 | Présentation projet |

---

## Risques et mitigations

### Registre des risques

| # | Risque | Probabilité | Impact | Score | Mitigation |
|---|--------|------------|--------|-------|-----------|
| R1 | Retard dans design API | Medium | High | 6 | Architecture review sprint 1 |
| R2 | Bugs sécurité découverts tard | Medium | Critical | 8 | Security review sprint 3 |
| R3 | Performance BD insuffisante | Low | High | 4 | Load testing sprint 3 |
| R4 | Team member unavailable | Low | Medium | 2 | Documentation + pair programming |
| R5 | Scope creep | Medium | High | 6 | Strict sprint planning |
| R6 | Deployment issues | Medium | Critical | 8 | Staging deployment sprint 4 |
| R7 | Integration problems | Medium | Medium | 4 | Integration tests sprint 4 |

### Plan de mitigation détaillé

**R2 - Bugs sécurité (Score: 8 - CRITICAL)**
```
Risque: Vulnérabilités découvertes après go-live
Impact: Données patients compromises, conformité RGPD
Probabilité: Medium (complexité sécurité)

Mitigation:
1. Security review chaque sprint
2. OWASP scanning dans CI/CD
3. Dependency updates régulières
4. Penetration testing sprint 4
5. Incident response plan prêt

Contingency:
- Security patch deployment process
- Rollback procedures
- User communication plan
```

**R6 - Deployment issues (Score: 8 - CRITICAL)**
```
Risque: Problèmes déploiement bloquent go-live
Impact: Retard launch, users affectés
Probabilité: Medium (première déploiement)

Mitigation:
1. Staging identical production sprint 4
2. Deployment dry-run avant go-live
3. DevOps runbooks complètes
4. Blue-green deployment setup
5. Health check automation

Contingency:
- Rollback scripts testés
- Hotfix process établi
- 24h support après launch
```

---

## Conclusion

Ce WBS fournit une décomposition complète du projet MEDBOOK en work packages discrets, estimés, et assignés. Il servira de base pour :
- Planification détaillée (Jira tickets)
- Allocation ressources
- Suivi progrès (burndown charts)
- Gestion risques
- Identification chemins critiques

**Utilisation pratique:**
1. Chaque WBS → 1-3 tickets Jira
2. Daily standups tracent WBS
3. Sprint reviews valident livrables par WBS
4. Burndown charts affichent SP par WBS

**Document maintenu par :** Scrum Master  
**Dernière mise à jour :** 21 mai 2026  
**Version :** 1.0 - Baseline établie pour Sprint 1
