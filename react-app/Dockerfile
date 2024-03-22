# Définir l'image de base à utiliser pour l'environnement Node.js
FROM node:18 AS build

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

# Étape 2: Servir l'application
FROM node:alpine as runner

WORKDIR /usr/src/app

# Copier le build depuis l'étape de construction
COPY --from=build /usr/src/app/next.config.js ./
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

# Exposer le port (le port par défaut de Next.js est 3000)
EXPOSE 3000

# Démarrer l'application Next.js
#CMD ["npm", "start"]
CMD ["npm", "run", "dev"]