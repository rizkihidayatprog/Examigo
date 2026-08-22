# 📚 Examigo - Product Requirements Document (PRD)

### **AI-Powered Online Exam Builder**

## Deskripsi
**Examigo** adalah platform **Software as a Service (SaaS)** berbasis web yang membantu guru, dosen, sekolah, universitas, lembaga kursus, dan perusahaan dalam membuat, mengelola, serta menyelenggarakan ujian secara online dengan lebih cepat dan efisien.

Keunggulan utama Examigo adalah **AI Question Generator**, di mana pengguna cukup mengunggah materi pembelajaran dalam format **PDF, DOCX, PPT/PPTX, atau teks**, kemudian AI akan membaca isi materi dan secara otomatis membuat soal ujian lengkap dengan pilihan jawaban, kunci jawaban, serta tingkat kesulitan yang dapat disesuaikan.

Selain fitur AI, Examigo juga menyediakan **Bank Soal**, **Exam Builder**, **Pelaksanaan Ujian Online**, **Penilaian Otomatis**, **Dashboard Analitik**, dan **Export Hasil** dalam satu platform modern yang dapat diakses melalui desktop maupun perangkat mobile tanpa perlu menginstal aplikasi.

---

# 🎯 Tujuan Produk
Membantu institusi pendidikan dan perusahaan menghemat waktu dalam proses pembuatan soal, pelaksanaan ujian, dan evaluasi hasil belajar melalui platform berbasis web yang modern dan mudah digunakan.

---

# 👥 Target Pengguna

### Pendidikan
* Guru
* Dosen
* Sekolah SD, SMP, SMA/SMK
* Universitas
* Bimbingan Belajar
* Lembaga Kursus

### Perusahaan
* HRD
* Training Center
* Assessment Center
* Divisi Learning & Development

---

# ❗ Permasalahan yang Diselesaikan
Banyak guru dan instruktur masih membuat soal secara manual, sehingga prosesnya memakan waktu dan sulit dikelola.

Beberapa kendala yang sering terjadi:
* Membuat soal membutuhkan waktu lama.
* Sulit membuat variasi soal.
* Bank soal tidak terorganisir.
* Koreksi ujian masih dilakukan secara manual.
* Sulit menganalisis hasil ujian peserta.
* Tidak ada sistem terpusat untuk membuat dan mengelola ujian.

---

# 💡 Solusi
Examigo menyederhanakan proses tersebut dengan alur berikut:
1. Pengguna mengunggah materi pembelajaran.
2. AI menganalisis isi materi.
3. AI menghasilkan soal secara otomatis.
4. Pengguna dapat mengedit soal sebelum digunakan.
5. Soal disimpan ke Bank Soal.
6. Pengguna membuat dan mempublikasikan ujian.
7. Peserta mengerjakan ujian secara online.
8. Nilai dan analitik ditampilkan secara otomatis.

---

# 🚀 Fitur Utama

## 🤖 AI Question Generator
Pengguna dapat mengunggah:
* PDF
* DOCX
* PPT / PPTX
* TXT

AI akan menghasilkan:
* Pilihan Ganda
* Essay
* Benar / Salah
* Isian Singkat

Pengguna juga dapat menentukan:
* Jumlah soal
* Tingkat kesulitan
* Topik
* Mata pelajaran

---

## 📚 Bank Soal
Semua soal akan tersimpan dalam Bank Soal dan dapat digunakan kembali.

Fitur:
* Folder
* Kategori
* Tag
* Search
* Filter
* Import
* Export
* Edit soal

---

## 📝 Exam Builder
Halaman untuk menyusun ujian.

Fitur:
* Tambah soal
* Hapus soal
* Drag & Drop urutan soal
* Preview ujian
* Acak soal
* Acak pilihan jawaban

---

## ⏰ Pengaturan Ujian
Pengguna dapat mengatur:
* Judul ujian
* Jadwal mulai
* Jadwal selesai
* Durasi
* Jumlah soal
* Nilai minimum
* Password ujian
* Status publikasi

---

## 👨‍🎓 Halaman Peserta
Peserta dapat:
* Mengakses ujian melalui link atau kode ujian.
* Mengerjakan soal secara online.
* Melihat sisa waktu.
* Menyimpan jawaban otomatis (Auto Save).
* Mengirim jawaban saat selesai.

---

## 📊 Dashboard Analitik
Dashboard menyediakan informasi seperti:
* Jumlah peserta
* Nilai rata-rata
* Persentase kelulusan
* Grafik hasil ujian
* Statistik jawaban benar dan salah
* Analisis tingkat kesulitan soal

---

## 📥 Export Data
Mendukung ekspor ke:
* Excel (.xlsx)
* CSV
* PDF

---

# 🔄 Alur Penggunaan
1. Login ke Examigo.
2. Upload materi pembelajaran.
3. AI membuat soal otomatis.
4. Pengguna meninjau dan mengedit soal.
5. Simpan ke Bank Soal.
6. Susun ujian menggunakan Exam Builder.
7. Publikasikan ujian.
8. Peserta mengerjakan ujian.
9. Sistem melakukan penilaian otomatis.
10. Hasil ditampilkan pada Dashboard Analitik.

---

# 🎨 UI/UX Design System & Specification

Examigo mengusung konsep **Clean, Minimal, Educational, dan Mobile-First (Focus-First)**. Desain mengutamakan kesederhanaan, kejelasan informasi, serta kenyamanan peserta saat mengerjakan ujian tanpa gangguan visual berlebihan.

---

## 🎨 Konsep Visual & Color Palette

### 1. Mode Default: Light Mode
- **Background Utama**: `#F8FAFC` (Slate-50 - Bersih & Nyaman di mata)
- **Kartu & Surface**: `#FFFFFF` (Putih murni dengan border 1px `#E2E8F0` dan bayangan lembut `shadow-sm`)
- **Primary Color**: `#2563EB` (Blue-600 - Profesional, tenang, cocok untuk pendidikan)
- **Primary Dark**: `#1D4ED8` (Blue-700 - Hover state)
- **Text Primary**: `#0F172A` (Slate-900 - Kontras tinggi & keterbacaan maksimal)
- **Text Secondary**: `#64748B` (Slate-500 - Subteks & label)
- **Border System**: `#E2E8F0` (Slate-200 - Garis pemisah halus)

### 2. Accent & Status Colors
- **Success / Lulus**: `#16A34A` (Emerald-600) / Penanda `✓` (Sudah Dijawab)
- **Warning / Ragu**: `#F59E0B` (Amber-500) / Penanda `⚑` (Ditandai Ragu) & Timer `< 10m`
- **Danger / Gagal**: `#DC2626` (Red-600) / Timer `< 5m` (Berkedip)

### 3. Typography & Touch Targets
- **Font Utama**: **Plus Jakarta Sans** (Google Fonts).
- **Hierarki Font**:
  - Headings: 24px - 32px (Bold / ExtraBold).
  - Body Text: 16px (Medium).
  - Pilihan Jawaban: 16px - 18px (Medium, Line Height longgar).
- **Touch Targets**: Minimum **48px height** pada tombol navigasi dan kartu pilihan jawaban (sangat nyaman digunakan di smartphone).

---

## 📱 Fitur UI Per Halaman

### 1. Dashboard Pengajar & Navigasi Utama
- **Sidebar**: Berwarna putih (`#FFFFFF`) dengan border pemisah `1px border-slate-200` dan penanda menu aktif biru `bg-blue-50 text-blue-600 font-bold border-l-4 border-blue-600`.
- **Metrics Overview Cards**: Kartu indikator bersih (`Total Ujian`, `Bank Soal`, `Jumlah Peserta`, `Nilai Rata-rata`). Nilai rata-rata ditampilkan sebagai murni angka murni tanpa `%`.
- **Daftar Ujian Aktif & Terbaru**: Tabel / list bersih dilengkapi tombol aksi cepat (`Monitor Live`, `QR Code`, `Salin Link`, `Buka Ujian`, `Hapus`).

### 2. Mode Fokus Ujian Peserta (`ExamRoomPage`)
Tampilan halaman ujian dibuat **fokus total pada pengerjaan soal**, bebas dari menu distraksi.
- **Top Header Bar**:
  - Judul Ujian, Kode Akses, Mapel, dan Kelas.
  - Status Auto Save (`Tersimpan` / `Menyimpan...`).
  - **Timer Bertahap**:
    - `> 10m`: Normal (`⏱ 48:32`)
    - `5 - 10m`: Warning Kuning (`⚠ 08:32`)
    - `< 5m`: Danger Merah Berkedip (`⚠ 02:45`)
- **Kartu Soal & Progress Bar**:
  - Menampilkan progress pengerjaan `Soal 12 dari 40 (30%)` dengan indikator visual progress bar.
  - Teks soal berukuran 16-18px dengan dukungan gambar materi (maks 5MB).
- **Kartu Opsi Jawaban (Pilihan Ganda & Benar/Salah)**:
  - Minimum height 52px (Touch Target 48px+).
  - Penanda jelas: `● C. Jawaban` (Terpilih) vs `○ A. Jawaban` (Belum terpilih).
- **Navigasi Nomor Soal (Side Panel & Grid)**:
  - Legenda Status Aksesibel (tidak hanya mengandalkan warna):
    - `✓` **Sudah Dijawab** (Green `#16A34A`)
    - `○` **Belum Dijawab** (Slate `#64748B`)
    - `⚑` **Ditandai Ragu** (Amber `#F59E0B`)
- **Modal Konfirmasi Submit**:
  - Judul: `Selesaikan Ujian?`
  - Menyajikan rincian `35 dari 40 soal dijawab, 5 soal belum dijawab` dengan kotak peringatan kuning jika ada soal kosong.
- **Halaman Hasil Ujian (Result Screen)**:
  - Hirarki tampilan: `🎉 Ujian Selesai!` → `Nilai Akhir Murni (85/100)` → `Ringkasan Status` → Tombol `[ Lihat Pembahasan Soal ]`.

---

# 🛠 Teknologi

## Frontend
* React.js (Vite)
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Router
* TanStack Query
* React Hook Form
* Recharts

## Backend
* Node.js
* Express.js
* Prisma ORM
* JWT Authentication
* Multer
* Zod Validation

## Database
* PostgreSQL (Supabase Free)

## File Storage
* Supabase Storage (Free)
Digunakan untuk menyimpan: PDF, DOCX, PPT, Gambar.

## AI
* Google Gemini API
* OpenAI API (opsional)

## Deployment
* **Frontend**: Vercel (Free)
* **Backend**: Render (Free)
* **Database & Storage**: Supabase (Free)

---

# 🗄 Struktur Database Models
* **Users**: Data pengguna dan hak akses.
* **Subjects**: Kategori atau mata pelajaran.
* **Materials**: Materi yang diunggah pengguna.
* **Questions**: Soal hasil AI atau soal manual.
* **Choices**: Pilihan jawaban untuk soal objektif.
* **Exams**: Informasi ujian.
* **Exam Questions**: Relasi antara ujian dan soal.
* **Participants**: Data peserta ujian.
* **Answers**: Jawaban yang diberikan peserta.
* **Results**: Nilai akhir dan hasil ujian.

---

# ⭐ Keunggulan Examigo
* Membuat soal otomatis dari materi pembelajaran.
* Mendukung berbagai format dokumen.
* Soal dapat diedit sebelum dipublikasikan.
* Bank soal terorganisir dengan baik.
* Penilaian otomatis untuk soal objektif.
* Dashboard analitik untuk mengevaluasi hasil ujian.
* Responsif di desktop maupun perangkat mobile.
* Arsitektur modern menggunakan React.js dan Node.js.
* Memanfaatkan layanan gratis (Supabase Free, Vercel, Render) sehingga biaya operasional awal sangat rendah.

---

# 🚀 Roadmap Pengembangan

### Versi 1.0 (MVP)
* Login & Manajemen Pengguna
* AI Question Generator
* Bank Soal
* Exam Builder
* Ujian Online
* Penilaian Otomatis
* Dashboard Analitik

### Versi 2.0
* Sertifikat Otomatis
* QR Code Ujian
* Live Monitoring Peserta
* Anti-Cheat (Deteksi perpindahan tab, Fullscreen Mode)

---

# 💰 Nilai Jual (Unique Selling Proposition)
Examigo menggabungkan **AI Question Generator**, **Bank Soal**, **Exam Builder**, **Pelaksanaan Ujian**, **Penilaian Otomatis**, dan **Dashboard Analitik** dalam satu platform berbasis web yang mudah digunakan.
