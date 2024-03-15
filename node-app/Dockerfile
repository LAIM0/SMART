# Utiliser l'image officielle de Node.js comme base
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances du projet, y compris Express
RUN npm install

# Copier le reste des fichiers du projet dans le répertoire de travail du conteneur
COPY . .

# Exposer le port sur lequel l'application va écouter
EXPOSE 3001

# Définir la commande pour démarrer l'application
CMD ["node", "app/server.js"]
