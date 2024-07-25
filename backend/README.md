# Fleets Monorepo

Ce projet contient le code backend du projet Fleets. Suivez les instructions ci-dessous pour cloner le dépôt, configurer l'environnement et démarrer le serveur de développement.

## Prérequis

- [Git](https://git-scm.com/)
- [pnpm](https://pnpm.io/)
- Fichiers `.env` et `fleets-7f5ae-77a48098ca0a.json` (assurez-vous d'avoir ces fichiers à la racine du projet avant de commencer)

## Installation

1. Clonez le dépôt du projet :
    ```sh
    git clone git@gitlab.com:fleets-team/back-gpe.git Fleets-monorepo
    ```

2. Accédez au répertoire cloné :
    ```sh
    cd Fleets-monorepo
    ```

3. Allez dans le répertoire backend :
    ```sh
    cd backend
    ```

4. Copiez les fichiers de configuration nécessaires :
    ```sh
    cp ../../.env ./
    cp ../../fleets-7f5ae-77a48098ca0a.json ./
    ```

5. Installez les dépendances avec pnpm :
    ```sh
    pnpm install
    ```

6. Démarrez le serveur de développement :
    ```sh
    pnpm dev
    ```
