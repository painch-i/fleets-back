# Fleets ⚓️

A mobile application that brings together travelers on the same route.

## Table of Contents

- 🚀 [Getting Started](#🚀-getting-started)

  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

- 🔏 [App Signing](#🔏-app-signing)

  - [Generating Certificates](#generating-certificates)
    - [For Android](#for-android)
    - [For iOS](#for-ios)
  - [Create .env File](#create-.env-file)

- 🔄 [Development Workflow](#🔄-development-workflow)

  - [Code Linting](#code-linting)
  - [Building in Release Mode](#building-in-release-mode)

- 🏃 [Running the Project](#🏃-running-the-project)
  - [Web](#web)
  - [Mobile](#mobile)
    - [IOS](#ios)
    - [ANDROID](#android)

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or above (https://nodejs.org/en/download/) \*
- Yarn (https://classic.yarnpkg.com/en/docs/install/) \*
- Android Studio
- Xcode

### Installation

1. Clone this repo
2. Installing dependencies

```bash
yarn install
```

## 🔏 App Signing

### Generating Certificates

Certificates are essential for uploading an app to the stores.

#### For Android

You need to generate a releaseKey.keystore file that you will keep in ./android/app, your keystore must be private. For that, you will be asked to put a password that you will need to remember and put in a .env in the root of this project.

```bash
keytool -genkey -v -keystore ./android/app/releaseKey.keystore -keyalg RSA -keysize 2048 -validity 36500 -alias my-key-alias
```

#### For Ios

### Create .env File

Add all of your certificates informations in the .env in the root of the project.

```bash
KEYSTORE_PASSWORD="your_keystore_password"
KEY_ALIAS="my-key-alias"
KEY_PASSWORD="your_key_password"
```

## 🔄 Development Workflow

### Code Linting

To check the quality of your code and detect potential errors, you can use the lint command :

```bash
yarn lint
```

To automatically correct minor problems in the code, use the command :

```bash
yarn lint:fix
```

---

### Building in Release Mode

To build in mobile, we need the `android` and `ios` folders generated by Ionic.
These folders are first generated by the `yarn mobile:add` command, then committed to the git.

Once you've developed a new feature & tested it everywhere, you need to synchronize these changes with the mobile projects.

To do that, you need to run the `yarn ionic cap sync --no-build` command, which will update the `android` and `ios` folders with the modified TypeScript code.

Synchronize changes with mobile projects

```bash
yarn build
npx cap sync --no-build
```

Build in release mode (ios || android)

```bash
yarn ionic cap build ios --configuration=release
```

## 🏃 Running the project

### Web

In dev mode (with hot reload)

```bash
yarn dev
```

---

### Mobile

This will launch the app in dev mode (with hot reload) on a physical device or emulator.

First of all, to have all the web assets on mobile, you need to run this command to build.

```bash
yarn build
npx cap sync --no-build
```

---

#### IOS

In dev mode (with hot reload), the target device will be asked.

```bash
yarn ios
```

If you want to run the build yourself via Xcode.

```bash
yarn ionic:serve
yarn mobile:open ios
```

---

#### ANDROID

In dev mode (with hot reload), the target device will be asked.

```bash
yarn android
```

If you want to run the build yourself via Android studio.

```bash
yarn ionic:serve
yarn mobile:open android
```
