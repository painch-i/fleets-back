import * as digitalocean from "@pulumi/digitalocean";
import * as pulumi from "@pulumi/pulumi";

// Configuration
const config = new pulumi.Config();
const region = config.get("region") || "nyc3"; // Remplacez par votre région préférée
const sshKeyFingerprint = config.require("sshKeyFingerprint"); // Ajoutez votre empreinte de clé SSH
const nodeVersion = config.get("nodeVersion") || "18.x"; // Version de Node.js à installer

// Création du droplet (VPS)
const droplet = new digitalocean.Droplet("node-vps", {
    image: "debian-11-x64", // Image Debian 11
    region: region,
    size: "s-1vcpu-1gb", // Taille du droplet (ajustez selon vos besoins)
    sshKeys: [sshKeyFingerprint],
    tags: ["node", "vps"],
    userData: `#!/bin/bash
apt-get update
apt-get upgrade -y
apt-get install -y curl software-properties-common

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_${nodeVersion} | bash -
apt-get install -y nodejs

# Vérification des versions
node -v
npm -v
`,
});

// Exporter l'adresse IP publique du VPS
export const ipAddress = droplet.ipv4Address;
