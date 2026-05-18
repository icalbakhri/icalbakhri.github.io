---
layout: post
title: "Mendongkrak Performa Nextcloud dengan Docker dan FrankenPHP"
date: 2026-05-18 20:30:00 +0700
categories: [docker, nextcloud, sysadmin]
lang: id
---

Sebagai seseorang yang mengelola *self-hosted cloud storage*, masalah performa selalu menjadi tantangan. Nextcloud adalah platform yang luar biasa tangguh, tetapi ketika dipadukan dengan *stack* standar seperti Apache atau Nginx + PHP-FPM, responnya kadang terasa kurang "menggigit" saat diakses oleh banyak *user* sekaligus atau saat mengelola file dalam jumlah masif.

Karena alasan itulah, saya mulai bereksperimen dengan **FrankenPHP**.

### Mengapa FrankenPHP?

FrankenPHP adalah modern *application server* untuk PHP yang dibangun di atas Caddy web server. Berbeda dengan PHP-FPM, FrankenPHP hanya menggunakan satu *binary* tunggal. Ia memiliki dukungan bawaan untuk fitur-fitur HTTP modern seperti *Early Hints* (103), *worker mode*, dan performa *concurrency* yang luar biasa berkat arsitektur Go di belakangnya.

Hasilnya? Waktu respons yang jauh lebih cepat dan penggunaan *resources* (CPU & RAM) yang jauh lebih efisien.

### Nextcloud + FrankenPHP Custom Docker Image

Untuk mempermudah implementasi ini, saya telah membangun dan mempublikasikan *custom Docker image* Nextcloud yang sudah di-bundling langsung dengan FrankenPHP. Anda tidak perlu lagi melakukan setup konfigurasi Caddyfile atau PHP-ini yang rumit dari awal.

Anda dapat melihat repositori dan *image* lengkapnya di tautan berikut:
* **Docker Hub:** [icalbakhri/nextcloud-frankenphp](https://hub.docker.com/r/icalbakhri/nextcloud-frankenphp)
* **GitHub Repository:** [icalbakhri/nextcloud-frankenphp](https://github.com/icalbakhri/nextcloud-frankenphp)

### Cara Deploy Menggunakan Docker Compose

Jika Anda ingin mencoba menjalankan *image* ini di server Anda, ini adalah contoh `docker-compose.yml` dasar yang bisa langsung Anda gunakan:

```yaml
version: '3.8'

services:
  db:
    image: mariadb:10.6
    restart: always
    command: --transaction-isolation=READ-COMMITTED --log-bin=binlog --binlog-format=ROW
    volumes:
      - db_data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=rahasia_root
      - MYSQL_PASSWORD=nextcloud_password
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud

  nextcloud:
    image: icalbakhri/nextcloud-frankenphp:latest
    restart: always
    ports:
      - "8080:80"
    links:
      - db
    volumes:
      - nextcloud_data:/var/www/html
    environment:
      - MYSQL_PASSWORD=nextcloud_password
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_HOST=db

volumes:
  db_data:
  nextcloud_data:
```
