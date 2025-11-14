# Attendease

Application mobile de gestion des présences des étudiants :

-marquer la présence par scan de code QR.
-gérer les exams , les salles et les professeurs superviseurs.
-exporter le listes complètes (présents/absents) avec l'exam et la salle sous forme csv.

## Prérequis

### Pour le développement mobile (Frontend)
- Node.js (v14 ou supérieur)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Un émulateur Android/iOS ou un appareil physique
- Expo Go (application mobile)

### Installation d'Expo
```bash
# Installation globale d'Expo CLI
npm install -g expo-cli

# Vérifier l'installation
expo --version
```

### Pour le backend (Laravel)
- PHP 8.1 ou supérieur
- Composer
- MySQL 5.7 ou supérieur
- Laravel 10.x

## Installation

### Backend (Laravel)
1. Cloner le repository
```bash
git clone [URL_DU_REPO]
cd attendease-api
```

2. Installer les dépendances
```bash
composer install
```

3. Configurer l'environnement
```bash
cp .env.example .env
php artisan key:generate
```

4. Configurer la base de données dans le fichier `.env`
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=attendease
DB_USERNAME=root
DB_PASSWORD=
```

5. Exécuter les migrations
```bash
php artisan migrate
```

6. Démarrer le serveur
```bash
php artisan serve
```

### Frontend (React Native avec Expo)
1. Installer les dépendances
```bash
cd attendease-mobile
npm install
```

2. Configurer l'URL de l'API
Modifier le fichier `src/lib/api.ts` ainsi que `ListScreen.tsx`  avec l'URL de votre serveur Laravel "votre_ip:port/api"

3. Démarrer l'application
```bash
# Démarrer avec npx expo
npx expo start

# Ou avec expo-cli si installé globalement
expo start
```

4. Scanner le QR code avec l'application Expo Go sur votre téléphone

## Fonctionnalités
- Scan de QR code pour marquer les présences
- Liste des présences en temps réel
- Export des données en CSV
- Interface intuitive et responsive

## Structure du Projet
```
attendease/
├── attendease-api/        # Backend Laravel
│   ├── app/
│   ├── database/
│   └── routes/
└── attendease-mobile/     # Frontend React Native
    ├── src/
    │   ├── screens/
    │   ├── components/
    │   └── lib/
    └── assets/
```

## Contribution
1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence
Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
