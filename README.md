# AttendEase - Application mobile pour la gestion des présences

Cette application React Native permet de scanner des codes QR pour prendre les présences et générer des listes exportables.

## Fonctionnalités

- Authentification des utilisateurs
- Scanner des codes QR d'étudiants
- Visualiser la liste des présences
- Exporter les données au format CSV

## Technologies utilisées

- React Native avec Expo
- React Navigation
- AsyncStorage pour le stockage local
- Partage de fichiers natif

## Installation

1. Cloner le dépôt
```bash
git clone https://github.com/votre-utilisateur/attendease.git
cd attendease
```

2. Installer les dépendances
```bash
npm install
```

3. Démarrer l'application
```bash
# Pour le web (exécutable dans un navigateur)
npm run web

# Pour Android
npm run android

# Pour iOS
npm run ios
```

## Utilisation

1. Connectez-vous avec n'importe quelle combinaison email/mot de passe
2. Naviguez entre les écrans de scan et de liste via la barre de navigation
3. Scannez des codes QR ou utilisez le scan simulé pour tester
4. Consultez la liste des présences et exportez-la si nécessaire

## Développement

Cette application a été créée en convertissant un projet Next.js en une application React Native compatible web.
