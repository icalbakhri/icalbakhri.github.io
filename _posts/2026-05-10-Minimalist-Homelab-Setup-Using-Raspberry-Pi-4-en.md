---
layout: post
title: "Minimalist Homelab Setup Using Raspberry Pi 4"
date: 2026-05-10 20:30:00 +0700
categories: [server, cloud, sysadmin, raspberry-pi]
lang: en
---

# Minimal Homelab Setup Using Raspberry Pi 4

> A complete guide to building a low-power, budget-friendly homelab using a Raspberry Pi 4 for learning servers, Docker, monitoring, lightweight NAS, and self-hosted applications.

---

# 1. Homelab Goals

Building a homelab with Raspberry Pi 4 is one of the most efficient ways to learn:

* Linux server administration
* Docker and containerization
* Reverse proxy configuration
* Infrastructure monitoring
* Lightweight NAS deployment
* Private VPN networking
* Self-hosted applications
* Basic CI/CD workflows
* Networking and internal DNS

This guide focuses on a setup that is:

* Low power consumption
* Stable for 24/7 operation
* Easy to upgrade
* Suitable for DevOps/sysadmin learning
* Practical for home internet environments

---

# 2. Required Hardware

## Essential Components

| Component    | Recommendation                        |
| ------------ | ------------------------------------- |
| SBC          | Raspberry Pi 4 Model B 4GB or 8GB     |
| OS Storage   | A2-rated microSD card (minimum 32GB)  |
| Data Storage | SATA SSD + USB 3.0 enclosure          |
| Power Supply | Official USB-C 5V 3A adapter          |
| Cooling      | Heatsink and fan                      |
| Networking   | Gigabit Ethernet preferred over Wi-Fi |

## Optional Components

| Component      | Purpose                          |
| -------------- | -------------------------------- |
| Mini UPS       | Protection against power outages |
| Gigabit Switch | Network expansion                |
| Aluminum Case  | Passive cooling                  |
| External HDD   | Backup and NAS storage           |

---

# 3. Minimal Homelab Architecture

```text
Internet
   │
Router
   │
Raspberry Pi 4
   ├── Docker
   │     ├── Portainer
   │     ├── Pi-hole
   │     ├── Grafana
   │     ├── Prometheus
   │     ├── Jellyfin
   │     └── Nextcloud
   │
   ├── Samba/NFS
   └── Tailscale VPN
```

---

# 4. Install the Operating System

## Recommended OS

### Primary Recommendation

* Raspberry Pi OS Lite 64-bit

### Alternatives

* Ubuntu Server
* DietPi

---

## Flash the OS to microSD

Use one of the following tools:

* [Raspberry Pi Imager](https://www.raspberrypi.com/software/?utm_source=chatgpt.com)
* [balenaEtcher](https://etcher.balena.io/?utm_source=chatgpt.com)

During flashing, enable:

* SSH
* Hostname
* Username/password
* Wi-Fi configuration (if needed)

---

# 5. Initial Server Setup

Connect via SSH:

```bash
ssh user@raspberrypi-ip
```

Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

Configure timezone and localization:

```bash
sudo raspi-config
```

Enable:

* SSH
* SSD boot (if supported)

---

# 6. Use an SSD for Stability

microSD cards tend to fail under long-term server workloads.

Recommended approach:

* Keep OS on microSD
* Store Docker volumes and data on SSD

Or use full SSD boot if your enclosure supports it.

Check disks:

```bash
lsblk
```

Format SSD:

```bash
sudo mkfs.ext4 /dev/sda1
```

Configure automatic mounting:

```bash
sudo nano /etc/fstab
```

Example:

```text
UUID=xxxxx /mnt/storage ext4 defaults,noatime 0 2
```

---

# 7. Install Docker

Install Docker officially:

```bash
curl -fsSL https://get.docker.com | sh
```

Add your user to the Docker group:

```bash
sudo usermod -aG docker $USER
```

Log out and log back in.

Test Docker:

```bash
docker run hello-world
```

---

# 8. Install Docker Compose

Modern installation method:

```bash
sudo apt install docker-compose-plugin -y
```

Verify installation:

```bash
docker compose version
```

---

# 9. Recommended Homelab Directory Structure

Example:

```text
/home/pi/homelab/
├── compose/
├── volumes/
├── backups/
├── scripts/
└── monitoring/
```

---

# 10. Install Portainer (Docker Web UI)

Create Docker volume:

```bash
docker volume create portainer_data
```

Run container:

```bash
docker run -d \
  -p 9000:9000 \
  --name=portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce
```

Access:

```text
http://PI_IP:9000
```

---

# 11. Configure a Reverse Proxy

Recommended options:

* Nginx Proxy Manager
* Traefik

Benefits:

* Internal domains
* Automatic HTTPS
* Reverse proxy for containers

---

# 12. Monitoring Stack

## Prometheus + Grafana

### Grafana

Grafana

### Prometheus

Prometheus

### Node Exporter

Used for monitoring CPU, RAM, disk, and system metrics.

Example Docker Compose:

```yaml
services:
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
```

---

# 13. Recommended Self-Hosted Apps for Raspberry Pi

## Lightweight Apps

| Application  | Purpose             |
| ------------ | ------------------- |
| Pi-hole      | DNS ad blocking     |
| Vaultwarden  | Password manager    |
| Uptime Kuma  | Uptime monitoring   |
| File Browser | Web file management |
| AdGuard Home | DNS filtering       |

## Medium Resource Usage

| Application | Purpose                  |
| ----------- | ------------------------ |
| Nextcloud   | Personal cloud storage   |
| Jellyfin    | Media streaming          |
| Immich      | Photo backup and gallery |

---

# 14. Lightweight NAS Setup

## Samba

Install Samba:

```bash
sudo apt install samba -y
```

Edit configuration:

```bash
sudo nano /etc/samba/smb.conf
```

Example share:

```ini
[Shared]
path = /mnt/storage/shared
browseable = yes
read only = no
guest ok = no
```

Create Samba user:

```bash
sudo smbpasswd -a pi
```

Restart service:

```bash
sudo systemctl restart smbd
```

---

# 15. Secure Remote Access

Avoid exposing services directly to the public internet.

Recommended tools:

* Tailscale
* WireGuard

Install Tailscale:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

---

# 16. Backup Strategy

At minimum:

* Backup Docker Compose files
* Backup important Docker volumes
* Backup databases

Recommended tools:

* rsync
* Restic
* Duplicati

Example:

```bash
rsync -av /home/pi/homelab /mnt/backup/
```

---

# 17. Raspberry Pi Performance Optimization

## Use ARM-Compatible Images

Examples:

* `linuxserver/*`
* `arm64v8/*`

## Reduce Excessive Swapping

```bash
sudo dphys-swapfile swapoff
```

## Monitor Temperature

```bash
vcgencmd measure_temp
```

Recommended operating temperature:

* Below 70°C

---

# 18. Power Consumption

Estimated usage:

* Idle: 3–5W
* Moderate load: 6–8W

Running 24/7 is significantly more power-efficient than using:

* Old desktop PCs
* Enterprise servers
* Many mini PCs

---

# 19. Upgrade Path

As your homelab grows:

| Stage         | Upgrade                    |
| ------------- | -------------------------- |
| Storage       | Larger SSD                 |
| Compute       | Upgrade to Pi 5 or mini PC |
| Scalability   | Add more Pi nodes          |
| Orchestration | Kubernetes or k3s          |
| Networking    | VLANs and managed switches |

---

# 20. Suggested Learning Roadmap

## Beginner

* Linux CLI
* SSH
* Docker
* Basic networking

## Intermediate

* Reverse proxy
* Monitoring
* CI/CD
* Internal DNS

## Advanced

* Kubernetes
* Infrastructure as Code
* GitOps
* Observability
* High availability

---

# 21. Recommended Minimal Stack

For a practical starter setup:

```text
Raspberry Pi OS
Docker
Portainer
Pi-hole
Uptime Kuma
Tailscale
Grafana
Samba
```

This setup is already sufficient for:

* DevOps learning
* Home server hosting
* Infrastructure monitoring
* DNS filtering
* Lightweight NAS
* Secure remote access

---

# 22. Important Tips

* Use Ethernet instead of Wi-Fi
* Avoid cheap microSD cards
* Always use proper cooling
* Backup regularly
* Avoid exposing unnecessary ports
* Use VPN for remote access
* Monitor temperature and storage health

---

# 23. Official Resources

* [Raspberry Pi Documentation](https://www.raspberrypi.com/documentation/?utm_source=chatgpt.com)
* [Docker Documentation](https://docs.docker.com/?utm_source=chatgpt.com)
* [Portainer Documentation](https://docs.portainer.io/?utm_source=chatgpt.com)
* [Grafana Documentation](https://grafana.com/docs/?utm_source=chatgpt.com)
* [Tailscale Documentation](https://tailscale.com/kb/?utm_source=chatgpt.com)

---

# Conclusion

A homelab built around Raspberry Pi 4 provides an excellent platform for learning modern infrastructure concepts such as containerization, observability, networking, automation, and self-hosting.

With relatively low investment and minimal power usage, you can build a small-scale environment that closely resembles real-world production infrastructure.
