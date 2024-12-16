# Étape 1 : Utilisation de l'image officielle Node.js avec pnpm préinstallé
FROM node:18 AS builder

# Installer pnpm globalement
RUN corepack enable && corepack prepare pnpm@latest --activate

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires pour installer les dépendances
COPY package.json pnpm-lock.yaml ./

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le reste du code source
COPY . .

# Construire l'application (pour les projets avec une étape de build, par exemple React, Vue ou Next.js)
RUN pnpm build

# Étape 2 : Utilisation d'une image Node.js plus légère pour l'exécution
FROM node:18-slim

# Installer pnpm dans l'image finale
RUN corepack enable && corepack prepare pnpm@latest --activate

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires depuis l'étape de build
COPY --from=builder /app ./

# Exposer le port (changer le port selon votre application)
EXPOSE 3000

# Commande pour démarrer l'application (ajustez selon votre projet)
CMD ["pnpm", "start"]
