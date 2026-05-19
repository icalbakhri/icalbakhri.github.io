---
layout: default
title: Tentang
permalink: /tentang/
---

<article class="article-content py-4">
    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
        Tentang Saya
    </h1>
    
    <p>
        Halo! Saya <strong>{{ site.author.name }}</strong>, seorang System Administrator & DevOps Enthusiast.
    </p>
    
    <p>
        Blog <strong>{{ site.title }}</strong> ini adalah tempat saya mendokumentasikan perjalanan, eksperimen, dan catatan-catatan kecil seputar dunia IT, khususnya di bidang:
    </p>
    
    <ul>
        <li>Linux & Server Administration</li>
        <li>Docker & Containerization</li>
        <li>Self-hosting & Homelab</li>
        <li>Web Server (Caddy, Nginx, FrankenPHP)</li>
    </ul>

    <h2>Filosofi log.ical</h2>
    <p>
        Nama <em>log.ical</em> diambil dari gabungan kata "log" (catatan sistem) dan nama saya. Tujuannya sederhana: membagikan dokumentasi teknis dan solusi dari masalah yang saya temui sehari-hari, sehingga bisa bermanfaat juga bagi orang lain yang mungkin mengalami kendala serupa.
    </p>

    <h2>Hubungi Saya</h2>
    <p>
        Jika Anda ingin berdiskusi, berkolaborasi, atau sekadar menyapa, jangan ragu untuk menghubungi saya melalui:
    </p>
    <ul>
        {% if site.author.email %}
        <li><strong>Email:</strong> <a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a></li>
        {% endif %}
        
        {% if site.author.github %}
        <li><strong>GitHub:</strong> <a href="https://github.com/{{ site.author.github }}">@{{ site.author.github }}</a></li>
        {% endif %}
        
        {% if site.author.linkedin %}
        <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/{{ site.author.linkedin }}">Profil LinkedIn</a></li>
        {% endif %}
        
        {% if site.author.twitter %}
        <li><strong>Twitter/X:</strong> <a href="https://twitter.com/{{ site.author.twitter }}">@{{ site.author.twitter }}</a></li>
        {% endif %}
    </ul>
</article>
