# MEDBOOK - Product Backlog

**Projet :** MEDBOOK - Plateforme de Gestion de Rendez-vous Médicaux  
**Version :** 1.0  
**Date de création :** 21 mai 2026  
**Product Owner :** Équipe MEDBOOK  
**Équipe Scrum :** 6 développeurs  

---

## Table des matières

1. [Vue d'ensemble du Product Backlog](#vue-densemble)
2. [Organisation des Sprints](#organisation-des-sprints)
3. [Product Backlog détaillé](#product-backlog-détaillé)
4. [Sprint Planning](#sprint-planning)
5. [Vélocité et Estimations](#vélocité-et-estimations)

---

## Vue d'ensemble

### Résumé exécutif

Le Product Backlog de MEDBOOK est organisé en **4 sprints de 2 semaines** sur une durée totale de **8 semaines**. Il couvre l'ensemble des fonctionnalités nécessaires pour développer une plateforme complète de gestion de rendez-vous médicaux avec authentification, réservation, agenda partagé, notifications et gestion administrative.

### Capacité estimée

- **Équipe :** 6 développeurs
- **Durée des Sprints :** 2 semaines (10 jours de travail)
- **Vélocité estimée :** 40-50 Story Points par sprint
- **Total backlog :** ~180 Story Points
- **Nombre de Sprints :** 4

---

## Organisation des Sprints

| Sprint | Durée | Focus Principal | Story Points | Dépendances |
|--------|-------|-----------------|--------------|-------------|
| **Sprint 1** | Semaines 1-2 | Infrastructure, Authentification, Modèles | 45 SP | Aucune |
| **Sprint 2** | Semaines 3-4 | Gestion RDV Patient, API REST | 48 SP | Sprint 1 |
| **Sprint 3** | Semaines 5-6 | Gestion Agenda Médecin, Notifications | 42 SP | Sprint 2 |
| **Sprint 4** | Semaines 7-8 | Admin, Tests, Déploiement | 45 SP | Sprint 3 |

---

## Product Backlog détaillé

### SPRINT 1 : Fondations et Authentification (45 SP)

#### US-001 : Configuration de l'environnement backend
**Priorité :** MUST | **Story Points :** 8 | **Sprint :** 1 | **Status :** À faire

**User Story :**  
En tant que développeur, je veux configurer l'environnement Laravel avec les migrations et seeders, afin que l'application soit prête pour le développement.

**Critères d'acceptation :**
- [ ] Le projet Laravel est initialisé avec les dépendances (Composer)
- [ ] La base de données est créée et les migrations s'exécutent sans erreur
- [ ] Les fichiers `.env` et configuration sont en place
- [ ] Des données de test (seeders) sont disponibles pour le développement
- [ ] L'API REST répond sur `http://localhost:8000/api/`
- [ ] Les CORS sont configurés correctement

**Tâches techniques :**
- Installation Laravel 11, configuration `.env`
- Création base de données MySQL
- Mise en place migrations
- Configuration Sanctum
- Configuration CORS

**Dépendances :** Aucune  
**Responsable :** Lead Backend

---

#### US-002 : Configuration de l'environnement frontend
**Priorité :** MUST | **Story Points :** 5 | **Sprint :** 1 | **Status :** À faire

**User Story :**  
En tant que développeur, je veux configurer Vite et React avec les dépendances, afin que le frontend soit prêt pour le développement.

**Critères d'acceptation :**
- [ ] Le projet React est initialisé avec Vite
- [ ] Les dépendances npm sont installées sans erreur
- [ ] L'application React démarre sur `http://localhost:5173`
- [ ] ESLint et Prettier sont configurés
- [ ] Les variables d'environnement API sont définies

**Tâches techniques :**
- Setup Vite + React + JSX
- Installation dépendances (axios, react-router, etc.)
- Configuration ESLint et Prettier
- Setup variables d'environnement

**Dépendances :** Aucune  
**Responsable :** Lead Frontend

---

#### US-003 : Créer les modèles de base de données
**Priorité :** MUST | **Story Points :** 8 | **Sprint :** 1 | **Status :** À faire

**User Story :**  
En tant que développeur backend, je veux créer les modèles et tables pour User, Doctor, Appointment et DoctorSlot, afin que la structure de données soit en place.

**Critères d'acceptation :**
- [ ] Table `users` créée avec champs : id, name, email, password, role, phone, created_at
- [ ] Table `doctors` créée avec champs : id, user_id, specialization, bio, created_at
- [ ] Table `doctor_slots` créée avec champs : id, doctor_id, start_time, end_time, is_available
- [ ] Table `appointments` créée avec champs : id, patient_id, doctor_id, slot_id, status, notes
- [ ] Les relations Eloquent sont définies correctement
- [ ] Les migrations sont réversibles

**Tâches techniques :**
- Création migrations Laravel
- Définition modèles Eloquent
- Configuration relations HasMany, BelongsTo, ManyToMany
- Soft deletes pour les suppressions

**Dépendances :** US-001  
**Responsable :** Backend Lead

---

#### US-004 : Implémenter l'authentification avec Sanctum
**Priorité :** MUST | **Story Points :** 8 | **Sprint :** 1 | **Status :** À faire

**User Story :**  
En tant que développeur backend, je veux implémenter une authentification sécurisée avec Laravel Sanctum, afin que les utilisateurs puissent se connecter de manière sécurisée.

**Critères d'acceptation :**
- [ ] Endpoint `/api/auth/register` fonctionne pour créer un utilisateur
- [ ] Endpoint `/api/auth/login` retourne un token Sanctum valide
- [ ] Endpoint `/api/auth/logout` révoque le token
- [ ] Les mots de passe sont hashés avec bcrypt
- [ ] Les tokens expirent après 24 heures
- [ ] La validation des données est effectuée côté backend

**Tâches techniques :**
- Configuration Sanctum
- Création contrôleurs AuthController
- Validation input avec FormRequest
- Gestion tokens et sessions

**Dépendances :** US-001, US-003  
**Responsable :** Backend Lead

---

#### US-005 : Créer l'interface de connexion/inscription (Frontend)
**Priorité :** MUST | **Story Points :** 8 | **Sprint :** 1 | **Status :** À faire

**User Story :**  
En tant qu'utilisateur, je veux avoir une interface intuitive de connexion et inscription, afin que je puisse accéder à l'application.

**Critères d'acceptation :**
- [ ] Formulaire inscription avec : email, password, password confirmation, name, role
- [ ] Formulaire connexion avec : email, password
- [ ] Validation frontend avec feedback utilisateur
- [ ] Tokens stockés dans localStorage ou sessionStorage
- [ ] Redirection automatique vers dashboard après connexion réussie
- [ ] Erreurs d'authentification affichées clairement

**Tâches techniques :**
- Création composants React LoginForm, RegisterForm
- Intégration API avec axios
- Gestion state avec context/hook
- Validation formulaires avec React Hook Form
- Redirections avec React Router

**Dépendances :** US-002, US-004  
**Responsable :** Frontend Lead

---

#### US-006 : Mettre en place le système de rôles (RBAC)
**Priorité :** MUST | **Story Points :** 5 | **Sprint :** 1 | **Status :** À faire

**User Story :**  
En tant que développeur, je veux implémenter un système de contrôle d'accès basé sur les rôles, afin que chaque utilisateur accède uniquement aux fonctionnalités autorisées.

**Critères d'acceptation :**
- [ ] Trois rôles définis : Patient, Doctor, Admin
- [ ] Middleware de vérification du rôle en place
- [ ] Les routes API sont protégées par rôle
- [ ] Frontend affiche/masque les éléments selon le rôle
- [ ] Impossible d'accéder à une route non autorisée

**Tâches techniques :**
- Middleware Laravel pour rôles
- Policy Eloquent pour autorisations
- Composants React conditionnels selon rôle
- Route protection frontend

**Dépendances :** US-001, US-003, US-004  
**Responsable :** Backend Lead + Frontend Lead

---

### SPRINT 2 : Gestion RDV Patient et API (48 SP)

#### US-007 : Récupérer la liste des médecins par spécialité
**Priorité :** MUST | **Story Points :** 5 | **Sprint :** 2 | **Status :** À faire

**User Story :**  
En tant que patient, je veux visualiser la liste des médecins filtrée par spécialité, afin de trouver le praticien adapté à mes besoins.

**Critères d'acceptation :**
- [ ] Endpoint GET `/api/doctors?specialization=Cardiology` retourne les médecins
- [ ] Résultats incluent : nom, spécialité, bio, photo, note moyenne
- [ ] Pagination fonctionnelle (10 médecins par page)
- [ ] Tri par nom ou note disponible
- [ ] Les données sont cachées en base de données (caching)
- [ ] Réponse en < 500ms

**Tâches techniques :**
- Contrôleur DoctorController
- Query optimization avec select/eager loading
- Pagination Laravel
- Cache avec Redis/Memcached
- Seed données de test

**Dépendances :** US-003  
**Responsable :** Backend

---

#### US-008 : Afficher les disponibilités d'un médecin
**Priorité :** MUST | **Story Points :** 8 | **Sprint :** 2 | **Status :** À faire

**User Story :**  
En tant que patient, je veux voir les créneaux horaires disponibles d'un médecin, afin de choisir un rendez-vous.

**Critères d'acceptation :**
- [ ] Endpoint GET `/api/doctors/{id}/slots?date=2026-05-25` retourne les créneaux
- [ ] Affichage des créneaux libres en calendrier interactif
- [ ] Format horaire : HH:MM (ex: 09:30 - 10:00)
- [ ] Impossible de sélectionner un créneau passé
- [ ] Les créneaux occupés ne sont pas affichés
- [ ] Filtre par date (7 jours suivants par défaut)

**Tâches techniques :**
- Logique allocation créneaux horaires
- API endpoint slots
- Composant Calendrier React (react-big-calendar ou similar)
- Validation backend des dates

**Dépendances :** US-007  
**Responsable :** Backend + Frontend

---

#### US-009 : Réserver un rendez-vous (Patient)
**Priorité :** MUST | **Story Points :** 8 | **Sprint :** 2 | **Status :** À faire

**User Story :**  
En tant que patient, je veux réserver un rendez-vous chez un médecin, afin de planifier ma visite médicale.

**Critères d'acceptation :**
- [ ] Endpoint POST `/api/appointments` crée un RDV
- [ ] Validation : le créneau doit être disponible
- [ ] Validation : le patient ne peut pas avoir 2 RDV au même créneau
- [ ] Confirmation de la réservation affichée au patient
- [ ] Statut initial : "pending_confirmation"
- [ ] Raison de la visite optionnelle (textarea)
- [ ] Email de confirmation envoyé

**Tâches techniques :**
- AppointmentController@store
- Validation Appointment unique par créneau
- Transaction DB pour éviter conditions de course
- Queue email avec Mailable
- Response avec rendez-vous créé

**Dépendances :** US-008, US-004  
**Responsable :** Backend

---

#### US-010 : Afficher la liste de mes rendez-vous (Patient)
**Priorité :** MUST | **Story Points :** 5 | **Sprint :** 2 | **Status :** À faire

**User Story :**  
En tant que patient, je veux voir tous mes rendez-vous passés et à venir, afin de suivre mes consultations.

**Critères d'acceptation :**
- [ ] Endpoint GET `/api/me/appointments` retourne mes RDV
- [ ] Tri automatique : à venir en premier, puis passés
- [ ] Affichage : médecin, date, heure, statut, raison
- [ ] Bouton "Voir détails" affiche notes du médecin
- [ ] Pagination 10 RDV par page
- [ ] Filtre statut : pending, confirmed, cancelled, completed

**Tâches techniques :**
- Contrôleur AppointmentController@index filtre par patient
- Relations Eloquent avec Doctor
- Formatage dates avec Carbon
- Frontend liste avec tri/filtres

**Dépendances :** US-009  
**Responsable :** Backend + Frontend

---

#### US-011 : Annuler un rendez-vous (Patient)
**Priorité :** SHOULD | **Story Points :** 3 | **Sprint :** 2 | **Status :** À faire

**User Story :**  
En tant que patient, je veux annuler un rendez-vous, afin de libérer le créneau pour un autre patient.

**Critères d'acceptation :**
- [ ] Endpoint PUT `/api/appointments/{id}/cancel` annule le RDV
- [ ] Annulation impossible si < 24h avant le RDV
- [ ] Le créneau devient disponible pour les autres patients
- [ ] Motif d'annulation optionnel (pour feedback)
- [ ] Confirmation d'annulation affichée
- [ ] Email de confirmation envoyé au médecin

**Tâches techniques :**
- AppointmentController@cancel
- Vérification timing (24h minimum)
- Libération slot
- Email notification médecin
- Soft delete ou status 'cancelled'

**Dépendances :** US-009  
**Responsable :** Backend

---

#### US-012 : Interface Patient Dashboard
**Priorité :** MUST | **Story Points :** 8 | **Sprint :** 2 | **Status :** À faire

**User Story :**  
En tant que patient, je veux voir mon tableau de bord personnel avec mes rendez-vous et actions rapides, afin d'accéder facilement aux fonctionnalités principales.

**Critères d'acceptation :**
- [ ] Dashboard affiche : RDV à venir, derniers RDV, actions rapides
- [ ] Bouton "Prendre RDV" prominent
- [ ] Affichage du prochain RDV en haut
- [ ] Statistiques : nombre RDV ce mois, total RDV
- [ ] Lien vers profil et paramètres
- [ ] Responsive design (mobile-friendly)

**Tâches techniques :**
- Composant PatientDashboard
- Appels API pour statistiques
- Responsive layout avec Tailwind/Material-UI
- Composants réutilisables

**Dépendances :** US-010  
**Responsable :** Frontend

---

### SPRINT 3 : Gestion Médecin et Notifications (42 SP)

#### US-013 : Gestion de l'agenda du médecin
**Priorité :** MUST | **Story Points :** 10 | **Sprint :** 3 | **Status :** À faire

**User Story :**  
En tant que médecin, je veux gérer mes créneaux horaires (ajouter, modifier, supprimer), afin de rendre disponibles les heures où je peux consulter.

**Critères d'acceptation :**
- [ ] Endpoint POST `/api/me/slots` crée un créneau horaire
- [ ] Endpoint PUT `/api/slots/{id}` modifie un créneau
- [ ] Endpoint DELETE `/api/slots/{id}` supprime un créneau
- [ ] Création multiple de créneaux (ex: tous les jours 9h-12h)
- [ ] Validation : pas d'empiètement entre créneaux
- [ ] Impossible de supprimer un créneau avec RDV confirmé
- [ ] Visualisation calendrier des créneaux existants

**Tâches techniques :**
- SlotController avec validation
- Logique répétition créneaux (récurrence)
- Calendrier drag-drop pour modification
- Soft delete pour compatibilité RDV

**Dépendances :** US-004  
**Responsable :** Backend + Frontend

---

#### US-014 : Interface Médecin Dashboard
**Priorité :** MUST | **Story Points :** 8 | **Sprint :** 3 | **Status :** À faire

**User Story :**  
En tant que médecin, je veux voir mon tableau de bord avec les rendez-vous du jour et ma planification, afin de gérer efficacement ma journée.

**Critères d'acceptation :**
- [ ] Affichage RDV d'aujourd'hui et demain
- [ ] Vue calendrier semaine/mois des RDV
- [ ] Affichage liste des patients à venir avec détails
- [ ] Bouton pour marquer RDV comme "complété"
- [ ] Statistiques : RDV ce mois, taux annulation
- [ ] Accès direct à gestion des slots

**Tâches techniques :**
- DoctorDashboard component
- Calendrier React pour RDV
- API endpoints RDV par médecin
- Notifications RDV urgent (< 1h)

**Dépendances :** US-013  
**Responsable :** Frontend

---

#### US-015 : Confirmer/Refuser un rendez-vous (Médecin)
**Priorité :** MUST | **Story Points :** 5 | **Sprint :** 3 | **Status :** À faire

**User Story :**  
En tant que médecin, je veux confirmer ou refuser les rendez-vous demandés, afin de valider la consultation.

**Critères d'acceptation :**
- [ ] Endpoint PUT `/api/appointments/{id}/confirm` confirme un RDV
- [ ] Endpoint PUT `/api/appointments/{id}/reject` refuse un RDV
- [ ] Motif de refus obligatoire (textarea)
- [ ] Patient reçoit notification confirmation/refus
- [ ] RDV refusé libère le créneau automatiquement
- [ ] Interface avec boutons Confirmer/Refuser

**Tâches techniques :**
- AppointmentController@confirm/@reject
- Event pour notifications
- Queue jobs pour emails
- Soft notification au médecin

**Dépendances :** US-009, US-014  
**Responsable :** Backend

---

#### US-016 : Ajouter des notes à un rendez-vous (Médecin)
**Priorité :** SHOULD | **Story Points :** 5 | **Sprint :** 3 | **Status :** À faire

**User Story :**  
En tant que médecin, je veux ajouter des notes cliniques à un rendez-vous après la consultation, afin de documenter la visite.

**Critères d'acceptation :**
- [ ] Endpoint PUT `/api/appointments/{id}/notes` sauvegarde les notes
- [ ] Notes en texte riche (optionnel : HTML)
- [ ] Modèle de notes pré-rempli (anamnèse, diagnostic, traitement)
- [ ] Patient peut consulter les notes après permission médecin
- [ ] Historique des modifications de notes
- [ ] Limite : 5000 caractères par note

**Tâches techniques :**
- Migration pour notes field
- Rich text editor (TinyMCE ou Quill)
- Audit trail pour modifications
- Permission patient pour lecture

**Dépendances :** US-009, US-014  
**Responsable :** Backend + Frontend

---

#### US-017 : Système de notifications en temps réel
**Priorité :** MUST | **Story Points :** 10 | **Sprint :** 3 | **Status :** À faire

**User Story :**  
En tant qu'utilisateur, je veux recevoir des notifications en temps réel, afin d'être informé des changements importants (RDV confirmé, annulé, etc.).

**Critères d'acceptation :**
- [ ] Notifications pour : RDV confirmé, refusé, rappel 24h, rappel 1h
- [ ] Notifications push optionnelles (avec service worker)
- [ ] Notifications email avec template professionnel
- [ ] Notifications in-app (badge dans interface)
- [ ] Centre de notifications pour consulter historique
- [ ] Utilisateur peut gérer préférences notifications

**Tâches techniques :**
- Table notifications en DB
- Event/Listener Laravel
- Queue jobs pour envoi emails
- WebSocket optionnel pour temps réel (Socket.io)
- Service Worker pour notifications push
- Composant notifications React

**Dépendances :** US-009, US-015  
**Responsable :** Backend + Frontend

---

### SPRINT 4 : Administration, Tests et Déploiement (45 SP)

#### US-018 : Interface Admin - Gestion des utilisateurs
**Priorité :** MUST | **Story Points :** 10 | **Sprint :** 4 | **Status :** À faire

**User Story :**  
En tant qu'administrateur, je veux gérer tous les utilisateurs (patients et médecins), afin de superviser la plateforme.

**Critères d'acceptation :**
- [ ] Affichage liste paginée de tous les utilisateurs
- [ ] Recherche par nom/email
- [ ] Filtre par rôle (Patient/Doctor)
- [ ] Actions : voir détails, modifier, désactiver/activer, supprimer
- [ ] Affichage dernière connexion et activité
- [ ] Endpoint GET `/api/admin/users` protégé
- [ ] Audit log des modifications

**Tâches techniques :**
- AdminUserController avec CRUD
- Middleware admin pour protection
- Policy Eloquent pour autorisation
- Table audit_logs pour tracer modifications
- Frontend AdminPanel avec DataTable

**Dépendances :** US-006  
**Responsable :** Backend + Frontend

---

#### US-019 : Interface Admin - Statistiques et rapports
**Priorité :** SHOULD | **Story Points :** 8 | **Sprint :** 4 | **Status :** À faire

**User Story :**  
En tant qu'administrateur, je veux voir des statistiques globales sur la plateforme, afin d'évaluer la performance du service.

**Critères d'acceptation :**
- [ ] Dashboard avec graphiques : RDV/mois, médecins actifs, patients actifs
- [ ] Taux de confirmation/annulation des RDV
- [ ] Médecins les plus sollicités
- [ ] Créneau pic de réservation
- [ ] Rapport exportable (PDF/CSV)
- [ ] Filtres : date range, spécialité

**Tâches techniques :**
- Requêtes analytics optimisées
- Charts library (Chart.js, ApexCharts)
- Export PDF/CSV (Laravel Excel)
- Cache pour performances
- Cronjob pour mise à jour statistiques

**Dépendances :** US-018  
**Responsable :** Backend + Frontend

---

#### US-020 : Prescription médicale après RDV
**Priorité :** SHOULD | **Story Points :** 8 | **Sprint :** 4 | **Status :** À faire

**User Story :**  
En tant que médecin, je veux créer une ordonnance digitale après la consultation, afin de prescrire des traitements au patient.

**Critères d'acceptation :**
- [ ] Création prescription liée au RDV
- [ ] Champs : médicaments, dosage, durée, instructions
- [ ] Génération PDF ordonnance professionnelle
- [ ] Patient reçoit ordonnance digitale
- [ ] Historique ordonnances du patient consultable
- [ ] Signature numérique du médecin (optionnel)

**Tâches techniques :**
- Model Prescription + migration
- Relation RDV-Prescription
- Template PDF ordonnance
- Endpoint POST `/api/appointments/{id}/prescription`
- Email avec PDF attaché

**Dépendances :** US-009, US-016  
**Responsable :** Backend

---

#### US-021 : Tests unitaires backend
**Priorité :** MUST | **Story Points :** 8 | **Sprint :** 4 | **Status :** À faire

**User Story :**  
En tant que développeur, je veux avoir une couverture de tests complète du backend, afin de garantir la fiabilité de l'API.

**Critères d'acceptation :**
- [ ] Tests pour tous les contrôleurs (minimum 80% couverture)
- [ ] Tests authentification et autorisation
- [ ] Tests validation des données
- [ ] Tests des relations Eloquent
- [ ] Tests de cas d'erreur (404, 403, 422, 500)
- [ ] PHPUnit configuré et exécution en CI/CD
- [ ] Mock de dépendances externes

**Tâches techniques :**
- Tests Feature (endpoints)
- Tests Unit (méthodes)
- Factory Laravel pour données test
- Utilisation assertEquals, assertDatabaseHas, etc.
- Coverage report avec PCOV

**Dépendances :** US-004 + toutes US Sprint 1-3  
**Responsable :** Équipe Backend

---

#### US-022 : Tests d'intégration et e2e
**Priorité :** SHOULD | **Story Points :** 8 | **Sprint :** 4 | **Status :** À faire

**User Story :**  
En tant que développeur, je veux tester les flux utilisateur complets (e2e), afin de valider le fonctionnement global de l'application.

**Critères d'acceptation :**
- [ ] Scénario : Inscription → Connexion → Prise RDV
- [ ] Scénario : Médecin confirme RDV
- [ ] Scénario : Annulation RDV
- [ ] Tests avec Playwright ou Cypress
- [ ] Tests responsive (mobile, tablet, desktop)
- [ ] Tests en headless mode
- [ ] Rapports de couverture visuelle

**Tâches techniques :**
- Setup Playwright/Cypress
- Page objects pour DRY tests
- Fixtures et data setup
- CI/CD integration (GitHub Actions)
- Screenshot comparison

**Dépendances :** US-021 + US-005 + US-012  
**Responsable :** QA/Frontend

---

#### US-023 : Sécurité et protection données
**Priorité :** MUST | **Story Points :** 8 | **Sprint :** 4 | **Status :** À faire

**User Story :**  
En tant que développeur, je veux implémenter les meilleures pratiques de sécurité, afin de protéger les données sensibles des utilisateurs.

**Critères d'acceptation :**
- [ ] CSRF token sur tous les formulaires POST
- [ ] Validation backend obligatoire (pas de confiance au frontend)
- [ ] Protection XSS (sanitization entrées/sorties)
- [ ] Mots de passe hashés avec bcrypt (cost: 12)
- [ ] Rate limiting sur endpoints authentification
- [ ] HTTPS forcé en production
- [ ] Headers de sécurité (X-Frame-Options, CSP, HSTS)
- [ ] Dépendances à jour (Composer/npm audit)

**Tâches techniques :**
- Middleware Laravel security headers
- Validateur input custom
- Escape output Blade/React
- Gestion tokens sécurisée
- Secrets gestion (.env sécurisé)
- Regular security audit

**Dépendances :** US-001, US-002, US-004  
**Responsable :** Backend Lead

---

#### US-024 : Déploiement et CI/CD
**Priorité :** MUST | **Story Points :** 8 | **Sprint :** 4 | **Status :** À faire

**User Story :**  
En tant que développeur, je veux configurer un pipeline de déploiement automatisé, afin que le code soit testé et déployé facilement.

**Critères d'acceptation :**
- [ ] GitHub Actions workflow configuré
- [ ] Tests exécutés automatiquement sur PR
- [ ] Linter (ESLint, PHP_CodeSniffer) lancé
- [ ] Build frontend optimisé
- [ ] Déploiement automatique en staging après merge
- [ ] Déploiement manuel en production
- [ ] Rollback possible facilement
- [ ] Logs de déploiement disponibles

**Tâches techniques :**
- GitHub Actions YAML files
- Laravel deployment (Forge, Hetzner, ou VPS)
- Frontend build optimization (minification, tree-shake)
- Environment secrets gestion
- Database migrations automatique
- Health check post-deploy

**Dépendances :** US-021, US-022  
**Responsable :** DevOps/Backend Lead

---

## Backlog Refinement et Ajustements

### Éléments non estimés (à raffiner)

| ID | Titre | Priorité | Raison | Sprint estimé |
|-----|-------|----------|--------|---------------|
| US-025 | Dark mode toggle | COULD | Amélioration UX optionnelle | Sprint 4+ |
| US-026 | Export rendez-vous (iCal) | COULD | Intégration calendrier externe | Sprint 4+ |
| US-027 | Système de notation médecin | COULD | Retours utilisateurs | Sprint 4+ |
| US-028 | Chat patient-médecin | WONT | Complexité ajoutée | Futur |

---

## Vélocité et Estimations

### Historique de vélocité

| Sprint | SP Planifiés | SP Réalisés | Vélocité | % Complétion |
|--------|-------------|-----------|----------|-------------|
| Sprint 1 | 45 | - | - | - |
| Sprint 2 | 48 | - | - | - |
| Sprint 3 | 42 | - | - | - |
| Sprint 4 | 45 | - | - | - |
| **Total** | **180** | - | **45 SP/sprint** | - |

### Calcul des estimations

- **8 SP :** Feature majeure (1-2 jours)
- **5 SP :** Feature moyenne (0.5-1 jour)
- **3 SP :** Bug ou feature mineure (2-4 heures)
- **1 SP :** Task simple (< 2 heures)

### Capacité de l'équipe

- **Équipe :** 6 développeurs
- **Capacité/jour :** 6-8 SP (8h × 6 devs = 48 SP capacity théorique)
- **Facteur ajustement :** 0.85 (meetings, emails, etc.)
- **Vélocité réelle estimée :** 40-45 SP/sprint

---

## Critères de Done (Definition of Done)

Une User Story n'est considérée comme "terminée" que si :

✅ **Développement :**
- Code écrit et testé
- Code reviewé par au moins 2 pairs
- Tests unitaires écrits (≥ 80% couverture)

✅ **Qualité :**
- Pas de code duplication (DRY)
- Lint passants (ESLint, PHPStan)
- Pas de warnings en console

✅ **Documentation :**
- Code commenté (méthodes complexes)
- API documentée (if applicable)
- Changes notifiés en CHANGELOG

✅ **Tests :**
- Tests unitaires passants
- Tests d'intégration (si applicable)
- Tests e2e pour features UI majeures

✅ **Déploiement :**
- Prêt à merger en main
- Migrations DB testées
- Environment variables documentées

---

## Contacts et Responsabilités

| Rôle | Personne | Contact | Disponibilité |
|------|----------|---------|--------------|
| Product Owner | Lead Project | po@medbook.local | Full-time |
| Scrum Master | Agile Coach | sm@medbook.local | Full-time |
| Lead Backend | Senior Dev | backend@medbook.local | Full-time |
| Lead Frontend | Senior Dev | frontend@medbook.local | Full-time |
| QA/Tester | QA Engineer | qa@medbook.local | Full-time |
| DevOps | DevOps Eng | devops@medbook.local | Full-time |

---

## Conclusion

Ce Product Backlog fournit une feuille de route claire pour le développement de MEDBOOK sur 8 semaines. Chaque User Story est détaillée, estimée et priorisée selon la méthodologie MoSCoW. Le backlog est flexible et peut être ajusté lors des cérémonies Scrum (Sprint Planning, Refinement).

**Dernière mise à jour :** 21 mai 2026  
**Version :** 1.0 - Prêt pour Sprint 1
