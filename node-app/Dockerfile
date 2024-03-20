# Utiliser l'image officielle de Node.js comme base
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances du projet, y compris Express
RUN npm install
RUN npm install @nestjs/cli
# Copier le reste des fichiers du projet dans le répertoire de travail du conteneur
COPY . .

# Compiler l'application TypeScript en JavaScript
COPY build-app-nest.sh .
RUN chmod +x build-app-nest.sh
#RUN npm run build

# Exposer le port sur lequel l'application va écouter
EXPOSE 3001

ENTRYPOINT ["./build-app-nest.sh"]
# Définir la commande pour démarrer l'application
#CMD ["node", "app/server.js"]
#CMD ["npm", "run", "start:prod"]