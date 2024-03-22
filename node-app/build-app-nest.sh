#!/bin/sh
echo "Construction de l'application NestJS..."
npx nest build

# Vérifier si le dossier /dist existe
if [ -d "./dist" ]; then
    echo "Le dossier /dist a été créé avec succès."
else
    echo "Échec de la création du dossier /dist."
    exit 1
fi

# Démarrer l'application en mode production
# echo "Démarrage de l'application en mode production..."
# npm run start:prod
echo "Démarrage de l'application en mode dev..."
npm run start:dev