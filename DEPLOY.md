# Block Shooter - VPS Deployment Guide

## Deployment

### Overview

Welcome to the deployment guide for your Three.js Multiplayer MVP.

This guide assumes you have just purchased a fresh Ubuntu Linux VPS (from DigitalOcean, Linode, AWS, etc.) and have basic SSH access to it.

Use the sections below to move through the deployment phases. You can copy the commands directly from the code blocks into your server terminal.

## 1. Make Image Public

By default, GitHub makes images pushed to GHCR (GitHub Container Registry) private. To avoid having to mess with GitHub authentication tokens on your server, make it public.

- Go to your GitHub repository in the browser.
- Look at the right sidebar for **Packages** and click your `-server` package.
- Click **Package Settings** (bottom right).
- Scroll down to **Danger Zone** -> **Change visibility** and set it to **Public**.

## 2. SSH Into Your Server

Open your local terminal (Command Prompt, PowerShell, or macOS Terminal) and connect to your new server using its IP address.

```bash
ssh root@YOUR_SERVER_IP
```

*Note: If your VPS provider gave you a different default username (like `ubuntu`), replace `root` with that username.*

## 3. Install Docker

Once logged into your server, run this official script to download and install Docker automatically. It takes about a minute.

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

## 4. Open the Firewall (UFW)

Ubuntu servers usually have a strict firewall enabled. You **must** open port `9208` for both TCP (Express web traffic) and UDP (Geckos WebRTC game traffic).

```bash
ufw allow 9208/tcp
ufw allow 9208/udp
ufw reload
```

## 5. Pull and Run Your Game

Tell Docker to pull your image from GitHub and run it. **Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` before running!**

```bash
docker run -d --name block-shooter --restart unless-stopped -p 9208:9208/tcp -p 9208:9208/udp ghcr.io/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME-server:latest
```

### What these flags do:

- `-d`: Runs the server in the background (detached).
- `--restart unless-stopped`: Tells Docker to automatically reboot your game server if it crashes.
- `-p 9208:9208`: Maps the internet's port to the container's port.

## 6. Play & Manage

Your game is now live! Open your browser and go to:

```text
http://YOUR_SERVER_IP:9208
```

### Helpful Server Commands

If you ever need to check on the server or update it, SSH back in and use these:

**See if the container is running:**

```bash
docker ps
```

**Read the live server logs (kills, errors):**

```bash
docker logs -f block-shooter
```

**Update the game after pushing new code:**

```bash
docker pull ghcr.io/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME-server:latest
docker stop block-shooter
docker rm block-shooter
```

*After running those three update commands, just run the big `docker run` command from Step 5 again to boot the new version.*
