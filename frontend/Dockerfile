# Node léger
FROM node:18-alpine

# Dossier de travail
WORKDIR /app

# Copier package.json et installer dépendances
COPY package*.json ./
RUN npm install

# Copier le code du frontend
COPY . .

# Builder l'application React
RUN npm run build

# Installer "serve" pour servir l'app
RUN npm install -g serve

# Exposer le port
EXPOSE 3000

# Lancer le serveur
CMD ["serve", "-s", "build", "-l", "3000"]
