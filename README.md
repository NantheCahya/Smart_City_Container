# Smart City Kabupaten Jember — The Persistent Pipeline

Proyek ini mendemonstrasikan containerization menggunakan Docker Compose dengan dua layanan:
- **Web**: aplikasi monitoring berbasis Node.js yang berjalan pada port `3000`.
- **Database**: MySQL 8.4 untuk menyimpan data pada tabel `log_sensor`.

Kedua layanan terhubung melalui Docker Network (`smartcity-network`). Data MySQL disimpan pada named Docker Volume (`mysql_data`) agar tetap tersedia ketika container dihentikan dan dibuat ulang.

## Teknologi
- Docker Desktop dan Docker Compose
- Node.js 22
- MySQL 8.4
- `mysql2`

## Struktur proyek

```text
.
├── app.js
├── index.html
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json (jika tersedia)
├── .env.example
├── .gitignore
└── database/
    └── init.sql
```

## Persiapan

1. Pastikan Docker Desktop sudah berjalan.
2. Salin `.env.example` menjadi `.env`.
3. Ganti nilai `DB_PASSWORD` dan `MYSQL_ROOT_PASSWORD` dengan password yang kuat. Untuk konfigurasi ini, keduanya harus sama karena aplikasi menggunakan akun root MySQL.
4. Jangan mengunggah `.env` ke GitHub. File tersebut sudah dimasukkan ke `.gitignore`.

PowerShell:

```powershell
Copy-Item .env.example .env
```

Buka `.env` dan ubah nilai password sebelum menjalankan aplikasi.

## Menjalankan aplikasi

Dari folder proyek, jalankan:

```powershell
docker compose up -d --build
```

Periksa status container:

```powershell
docker compose ps
```

Buka dashboard melalui:

```text
http://localhost:3000
```

API data tersedia pada:

```text
http://localhost:3000/api/logs
```

## Memeriksa database

```powershell
docker exec -it smart-city-db mysql -u root -p smartcity
```

Masukkan password yang ditetapkan pada `.env`, kemudian jalankan:

```sql
SELECT * FROM log_sensor;
```

## Menguji persistensi Docker Volume

Hentikan dan hapus container tanpa menghapus volume:

```powershell
docker compose down
```

Jalankan kembali:

```powershell
docker compose up -d
```

Periksa data:

```powershell
docker exec -it smart-city-db mysql -u root -p smartcity
```

```sql
SELECT * FROM log_sensor;
```

Data tetap tersedia karena disimpan pada named volume `mysql_data`. **Jangan gunakan `docker compose down -v`** jika ingin mempertahankan data volume.

## Catatan database

File `database/init.sql` digunakan untuk membuat tabel `log_sensor` ketika MySQL menginisialisasi direktori data yang masih kosong. Jika volume database sudah berisi data, perubahan pada file init tidak otomatis dijalankan ulang.

## Catatan keamanan

- Jangan commit file `.env`, password, token, atau kredensial.
- `.env.example` hanya berisi placeholder dan aman untuk dijadikan contoh konfigurasi.
- Untuk penggunaan di luar demonstrasi lokal, sebaiknya buat akun database khusus aplikasi dengan hak akses terbatas, bukan menggunakan akun `root`.

## Mengunggah ke GitHub

Sebelum melakukan commit, pastikan file `.env` tidak ikut terpilih. Periksa dengan:

```powershell
git status
```

Jika belum membuat repository lokal:

```powershell
git init
git add .
git status
git commit -m "Initial commit - Smart City Persistent Pipeline"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Ganti `USERNAME/REPOSITORY` dengan alamat repository GitHub milik sendiri. Jangan pernah menjalankan `git add -f .env` atau mengunggah file `.env`.

Jika kredensial pernah ter-commit ke repository, menghapus file pada commit terbaru saja tidak cukup untuk menghilangkannya dari riwayat Git. Ganti kredensial yang terpapar.
