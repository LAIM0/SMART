# Définir l'image de base à utiliser pour l'environnement Node.js
FROM node:16 AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier le reste des fichiers du projet dans le conteneur
COPY . .

# Construire l'application React pour la production
RUN npm run build

# Utiliser Nginx pour servir l'application React construite
FROM nginx:alpine

# Copier les fichiers construits depuis l'étape de construction à Nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Exposer le port 80 pour accéder à l'application React
EXPOSE 80

# Démarrer Nginx et servir l'application
CMD ["nginx", "-g", "daemon off;"]
