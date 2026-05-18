---
layout: post
title: "Setup Homelab Minimalis Menggunakan Raspberry Pi 4"
date: 2026-05-10 20:30:00 +0700
categories: [server, cloud, sysadmin, raspberry-pi]
lang: id
---

# Setup Homelab Minimalis Menggunakan Raspberry Pi 4

Membangun homelab dengan Raspberry Pi 4 adalah salah satu cara paling efisien untuk belajar Linux server, Docker, jaringan, monitoring, automation, dan self-hosted services tanpa konsumsi listrik besar atau biaya tinggi.

Panduan ini fokus pada setup yang:

* Hemat daya
* Stabil untuk penggunaan 24/7
* Mudah di-upgrade
* Cocok untuk belajar DevOps/sysadmin
* Bisa dijalankan dari rumah dengan internet standar

---

# 1. Tujuan Homelab

Dengan setup minimalis ini, Anda bisa belajar:

* Linux administration
* Docker & containerization
* Reverse proxy
* Monitoring server
* NAS ringan
* VPN pribadi
* Self-hosted applications
* CI/CD dasar
* Networking & DNS internal

---

# 2. Hardware yang Dibutuhkan

## Wajib

| Komponen     | Rekomendasi                              |
| ------------ | ---------------------------------------- |
| SBC          | Raspberry Pi 4 Model B 4GB atau 8GB      |
| Storage OS   | microSD A2 32GB minimum                  |
| Storage data | SSD SATA + USB 3.0 enclosure             |
| Power supply | Official USB-C 5V 3A                     |
| Cooling      | Heatsink + fan                           |
| Network      | LAN gigabit lebih stabil dibanding Wi-Fi |

## Opsional

| Komponen       | Fungsi                |
| -------------- | --------------------- |
| UPS mini       | Proteksi mati listrik |
| Switch gigabit | Expand network        |
| Case aluminium | Pendinginan pasif     |
| HDD eksternal  | Backup/NAS            |

---

# 3. Arsitektur Homelab Minimalis

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

# 4. Install Sistem Operasi

## Pilihan OS

### Rekomendasi utama

* Raspberry Pi OS Lite 64-bit

### Alternatif

* Ubuntu Server
* DietPi

---

## Flash OS ke microSD

Gunakan:

* [Raspberry Pi Imager](https://www.raspberrypi.com/software/?utm_source=chatgpt.com)
* [balenaEtcher](https://etcher.balena.io/?utm_source=chatgpt.com)

Aktifkan saat flashing:

* SSH
* Hostname
* Username/password
* Wi-Fi (jika perlu)

---

# 5. Initial Server Setup

Login via SSH:

```bash
ssh user@ip-raspberrypi
```

Update sistem:

```bash
sudo apt update && sudo apt upgrade -y
```

Set timezone:

```bash
sudo raspi-config
```

Aktifkan:

* SSH
* Boot via SSD (jika pakai SSD)

---

# 6. Gunakan SSD untuk Stabilitas

microSD sering rusak untuk workload server jangka panjang.

Rekomendasi:

* OS tetap di SD
* Data & container di SSD

Atau full boot SSD jika enclosure kompatibel.

Cek disk:

```bash
lsblk
```

Format SSD:

```bash
sudo mkfs.ext4 /dev/sda1
```

Mount otomatis:

```bash
sudo nano /etc/fstab
```

Contoh:

```text
UUID=xxxxx /mnt/storage ext4 defaults,noatime 0 2
```

---

# 7. Install Docker

Install Docker resmi:

```bash
curl -fsSL https://get.docker.com | sh
```

Tambahkan user:

```bash
sudo usermod -aG docker $USER
```

Logout/login ulang.

Test:

```bash
docker run hello-world
```

---

# 8. Install Docker Compose

Versi modern:

```bash
sudo apt install docker-compose-plugin -y
```

Test:

```bash
docker compose version
```

---

# 9. Struktur Folder Homelab

Contoh:

```text
/home/pi/homelab/
├── compose/
├── volumes/
├── backups/
├── scripts/
└── monitoring/
```

---

# 10. Install Portainer (Web UI Docker)

Buat volume:

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

Akses:

```text
http://IP_PI:9000
```

---

# 11. Setup Reverse Proxy

Rekomendasi:

* Nginx Proxy Manager
* Traefik

Manfaat:

* Domain internal
* HTTPS otomatis
* Reverse proxy container

---

# 12. Monitoring Stack

## Prometheus + Grafana

### Grafana

Grafana

### Prometheus

Prometheus

### Node Exporter

Monitoring CPU/RAM/disk.

Contoh docker-compose:

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

# 13. Self-Hosted Apps yang Cocok untuk Raspberry Pi

## Ringan

| App          | Fungsi           |
| ------------ | ---------------- |
| Pi-hole      | DNS ad blocker   |
| Vaultwarden  | Password manager |
| Uptime Kuma  | Uptime monitor   |
| File Browser | File manager     |
| AdGuard Home | DNS filtering    |

## Sedang

| App       | Fungsi          |
| --------- | --------------- |
| Nextcloud | Cloud pribadi   |
| Jellyfin  | Media streaming |
| Immich    | Backup foto     |

---

# 14. Setup NAS Ringan

## Samba

Install:

```bash
sudo apt install samba -y
```

Tambah shared folder:

```bash
sudo nano /etc/samba/smb.conf
```

Contoh:

```ini
[Shared]
path = /mnt/storage/shared
browseable = yes
read only = no
guest ok = no
```

Tambah user Samba:

```bash
sudo smbpasswd -a pi
```

Restart:

```bash
sudo systemctl restart smbd
```

---

# 15. Remote Access Aman

Hindari langsung membuka port publik.

Gunakan:

* Tailscale
* WireGuard

Install Tailscale:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

---

# 16. Backup Strategy

Minimal:

* Backup compose files
* Backup volumes penting
* Backup database

Tools:

* rsync
* Restic
* Duplicati

Contoh:

```bash
rsync -av /home/pi/homelab /mnt/backup/
```

---

# 17. Optimasi Performa Raspberry Pi

## Gunakan ARM-compatible image

Contoh:

* `linuxserver/*`
* `arm64v8/*`

## Kurangi swap berlebihan

```bash
sudo dphys-swapfile swapoff
```

## Pantau suhu

```bash
vcgencmd measure_temp
```

Target ideal:

* < 70°C

---

# 18. Konsumsi Daya

Estimasi:

* Idle: 3–5W
* Beban sedang: 6–8W

Jika 24/7:

* Jauh lebih hemat dibanding mini PC/server bekas

---

# 19. Upgrade Path

Jika nanti kebutuhan meningkat:

| Tahap         | Upgrade                   |
| ------------- | ------------------------- |
| Storage       | SSD lebih besar           |
| RAM           | Upgrade ke Pi 5 / mini PC |
| Cluster       | Tambah node Pi            |
| Orchestration | Kubernetes / k3s          |
| Network       | VLAN + managed switch     |

---

# 20. Roadmap Belajar dari Homelab

## Beginner

* Linux CLI
* SSH
* Docker
* Networking dasar

## Intermediate

* Reverse proxy
* Monitoring
* CI/CD
* DNS internal

## Advanced

* Kubernetes
* Infrastructure as Code
* GitOps
* Observability
* High availability

---

# 21. Stack Minimal yang Direkomendasikan

Untuk penggunaan awal:

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

Sudah cukup untuk:

* Belajar DevOps
* Server rumah
* Monitoring
* DNS filtering
* NAS ringan
* Remote access aman

---

# 22. Tips Penting

* Gunakan LAN, bukan Wi-Fi
* Hindari microSD murah
* Selalu gunakan pendingin
* Backup rutin
* Jangan expose port sembarangan
* Gunakan VPN untuk akses remote
* Monitor suhu & storage health

---

# 23. Resource Resmi

* [Raspberry Pi Documentation](https://www.raspberrypi.com/documentation/?utm_source=chatgpt.com)
* [Docker Documentation](https://docs.docker.com/?utm_source=chatgpt.com)
* [Portainer Documentation](https://docs.portainer.io/?utm_source=chatgpt.com)
* [Grafana Documentation](https://grafana.com/docs/?utm_source=chatgpt.com)
* [Tailscale Documentation](https://tailscale.com/kb/?utm_source=chatgpt.com)

---

# Penutup

Homelab berbasis Raspberry Pi 4 adalah platform belajar yang sangat efektif untuk memahami sistem modern: containerization, observability, networking, automation, dan self-hosting.

Dengan investasi kecil dan konsumsi daya rendah, Anda sudah bisa membangun environment yang mendekati praktik production skala kecil.
