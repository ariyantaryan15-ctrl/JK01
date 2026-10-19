BluMeal — HTML + CSS + JS dengan login email & kata sandi
==========================================================
Isi folder:
  server.js     -> server Node.js (tanpa dependensi): file statis + API akun & data
  index.html    -> struktur halaman (Masuk/Daftar, Hari Ini, Menu, Progres, Profil)
  style.css     -> tampilan
  script.js     -> logika aplikasi + data bahan & resep
  images/       -> foto resep
  data/db.json  -> (dibuat otomatis) akun & data per akun

Cara menjalankan (butuh Node.js 18+):
  1. Buka folder di VS Code, lalu di terminal:  node server.js
  2. Buka http://localhost:3000
  (Membuka index.html langsung / Live Server TIDAK lagi cukup, karena login butuh server.)
  Port lain: PORT=8080 node server.js

Akun demo: demo@blumeal.id / demo1234 (tombol "Coba akun demo" di layar login; dibuat otomatis, datanya direset tiap login sehingga selalu mulai dari profil kosong).

Alur:
  - Daftar dengan email + kata sandi (min. 6 karakter), lalu isi form di tab Profil
    (wajib sekali di awal). Setelah itu data tersimpan di server per akun,
    jadi tetap ada saat ganti HP/browser.
  - Tombol "Keluar" ada di bawah tab Profil.

Catatan:
  - Kata sandi di-hash dengan scrypt; sesi memakai cookie HttpOnly (30 hari).
  - Cadangkan folder data/ bila ingin menyimpan akun. Jangan di-commit ke Git.
  - Untuk dipakai publik, jalankan di belakang HTTPS (cookie otomatis "Secure").
  - Alasan rekomendasi memakai rule-based AI (tanpa API luar).
