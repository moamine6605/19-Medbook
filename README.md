# Medbook

Une plateforme de prise de rendez-vous médicaux qui permet aux patients de trouver des médecins, de prendre des rendez-vous en ligne et de gérer leurs besoins de santé.

## Qu'est-ce que Medbook ?

Medbook est une plateforme en ligne qui met en relation les patients et les médecins. Vous pouvez :
- Parcourir les médecins par spécialité
- Prendre des rendez-vous en ligne
- Voir votre historique de rendez-vous
- Gérer vos ordonnances médicales

L'application se compose de deux parties principales :
- **Frontend** : Le site web que vous voyez et utilisez (construit avec React)
- **Backend** : Le système qui gère les données et les comptes utilisateurs (construit avec Laravel)

---

## 🚀 Démarrage Rapide (Pour les Développeurs)

Si vous êtes développeur et avez déjà les outils nécessaires installés, voici la configuration rapide :

```bash
# 1. Installer les dépendances du backend
cd src/backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate

# 2. Installer les dépendances du frontend
cd ../frontend
npm install
cp .env.example .env

# 3. Lancer les deux applications (dans deux terminaux séparés)
# Terminal 1 - Backend :
cd ../backend
php artisan serve

# Terminal 2 - Frontend :
cd ../frontend
npm run dev
```

Puis ouvrez `http://localhost:5173` dans votre navigateur.

---

## 📋 Configuration Requise

Avant d'installer Medbook, assurez-vous que votre ordinateur dispose de ces programmes :

### Logiciels Nécessaires
- **PHP** : Version 8.3 ou supérieure
- **Node.js** : Version 18 ou supérieure (inclut npm)
- **Composer** : Pour la gestion des paquets PHP
- **Git** : Pour cloner le projet depuis GitHub

### Comment vérifier si vous les avez :
```bash
php --version    # Doit afficher PHP 8.3 ou supérieur
node --version   # Doit afficher Node.js 18 ou supérieur
npm --version    # Doit afficher npm 9 ou supérieur
composer --version  # Doit afficher la version de Composer
git --version    # Doit afficher la version de Git
```

Si l'une de ces commandes échoue, vous devez d'abord installer ce logiciel.

---

## 📥 Guide d'Installation

Suivez ces étapes pour configurer Medbook sur votre ordinateur.

### Étape 1 : Télécharger le Projet

Ouvrez votre terminal/invite de commande et exécutez :

```bash
# Cloner le projet depuis GitHub
git clone https://github.com/yourusername/19-Medbook.git

# Aller dans le dossier du projet
cd 19-Medbook
```

### Étape 2 : Installer le Backend

Le backend est la partie qui tourne sur le serveur et gère toutes les données.

```bash
# Aller dans le dossier backend
cd src/backend

# Installer les dépendances PHP
composer install

# Copier le fichier d'environnement (contient vos paramètres)
cp .env.example .env

# Générer une clé de sécurité
php artisan key:generate

# Configurer la base de données (crée les tables de la base de données)
php artisan migrate
```

### Étape 3 : Installer le Frontend

Le frontend est l'interface du site web que les utilisateurs voient.

```bash
# Retourner à la racine du projet, puis aller dans frontend
cd ../frontend

# Installer les dépendances JavaScript
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

### Étape 4 : Lancer l'Application

Vous devez lancer deux fenêtres de terminal séparées :

**Fenêtre de Terminal 1 (Backend) :**
```bash
cd 19-Medbook/src/backend
php artisan serve
```

**Fenêtre de Terminal 2 (Frontend) :**
```bash
cd 19-Medbook/src/frontend
npm run dev
```

### Étape 5 : Ouvrir dans le Navigateur

Ouvrez votre navigateur web et allez sur :
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8000/api/status

---

## 👤 Comptes Utilisateurs

Medbook dispose de trois types d'utilisateurs :

1. **Patient** : Peut prendre des rendez-vous et voir son historique médical
2. **Médecin** : Peut voir les rendez-vous et gérer les patients
3. **Administrateur** : Peut voir les statistiques globales et les analyses

### Accès par Défaut
- Inscrivez-vous comme nouvel utilisateur depuis la page d'accueil
- Les rôles sont attribués lors de l'inscription (vous serez assigné comme patient par défaut)

---

## 🛠️ Commandes Courantes

### Commandes Backend (dans src/backend)
```bash
php artisan serve              # Démarrer le serveur backend
php artisan migrate            # Exécuter les migrations de base de données
php artisan migrate:fresh      # Réinitialiser et réexécuter toutes les migrations
php artisan tinker             # Ouvrir un shell PHP interactif
```

### Commandes Frontend (dans src/frontend)
```bash
npm run dev                    # Démarrer le serveur de développement
npm run build                  # Construire pour la production
npm run lint                   # Vérifier le code pour les problèmes
```

---

## 🔧 Dépannage

### Erreurs "Command not found" (commande introuvable)
- Assurez-vous d'avoir installé tous les logiciels requis (voir Configuration Requise ci-dessus)
- Essayez de redémarrer votre terminal après avoir installé de nouveaux logiciels

### Le backend ne démarre pas
- Vérifiez si le port 8000 est déjà utilisé par une autre application
- Essayez de lancer `php artisan serve --port=8001` à la place

### Le frontend ne démarre pas
- Vérifiez si le port 5173 est déjà utilisé
- Essayez de fermer d'autres applications qui pourraient utiliser ce port

### Erreurs de base de données
- Assurez-vous d'avoir exécuté `php artisan migrate` après l'installation
- Vérifiez que votre fichier `.env` a les paramètres de base de données corrects
- Essayez de lancer `php artisan migrate:fresh` pour réinitialiser la base de données

### Erreurs "Module not found" (module introuvable)
- Assurez-vous d'avoir exécuté `npm install` dans le dossier frontend
- Supprimez le dossier `node_modules` et relancez `npm install`

---

## 📁 Structure du Projet

```
19-Medbook/
├── src/
│   ├── backend/           # API Laravel (PHP)
│   │   ├── app/           # Code de l'application
│   │   ├── config/        # Fichiers de configuration
│   │   ├── database/      # Fichiers de base de données et migrations
│   │   └── routes/        # Routes de l'API
│   └── frontend/          # Interface React (JavaScript)
│       ├── src/
│       │   ├── components/ # Composants d'interface réutilisables
│       │   └── pages/     # Composants des pages principales
│       └── public/        # Fichiers statiques
└── README.md             # Ce fichier
```

---

## 🤝 Obtenir de l'Aide

Si vous rencontrez des problèmes :

1. Consultez la section Dépannage ci-dessus
2. Assurez-vous que toutes les versions de logiciels respectent les exigences
3. Essayez de redémarrer les deux serveurs (backend et frontend)
4. Consultez la sortie du terminal pour des messages d'erreur spécifiques

---

## 📄 Licence

Ce projet est open source et disponible sous la Licence MIT.

---

## 🌐 Liens

- Frontend : http://localhost:5173
- Backend API : http://localhost:8000
- Statut de l'API : http://localhost:8000/api/status