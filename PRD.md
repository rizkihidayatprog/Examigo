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
* **Core**: React.js 18 (Vite) + TypeScript
* **Styling**: Tailwind CSS + shadcn/ui + CSS Modules
* **Icons & Animation**: Lucide React + Framer Motion (GPU Hardware-Accelerated)
* **Routing**: React Router v6 (Route-Level Code Splitting & Lazy Loading)
* **State & Data Fetching**: TanStack Query (React Query)
* **Charts & Analytics**: Recharts
* **Document Generation**: jsPDF + html2canvas (Sertifikat & Export PDF), XLSX + PapaParse (Excel/CSV)
* **Theming**: Dynamic CSS Variable Theme Engine (Konfigurasi warna primer/aksen via CMS)

## Backend
* **Runtime & Framework**: Node.js + Express.js (TypeScript)
* **ORM**: Prisma ORM
* **Database**: MySQL / MariaDB / PostgreSQL (Fleksibel via konfigurasi koneksi Prisma)
* **Authentication**: JWT (JSON Web Tokens) + Google Identity Services (GIS / Google OAuth) dengan verifikasi token kriptografis backend
* **Security & Middleware**:
  * Multi-Tier Sliding Window Rate Limiting (Dinamis via CMS & Dev Mode Bypass)
  * CSRF Protection (`Sec-Fetch-Site`, `Origin`/`Referer` Whitelist)
  * Strict Whitelist CORS & Input Sanitizer (Anti-XSS)
  * Anti-Leak: Kunci jawaban (`isCorrect`, `explanation`) dihilangkan dari payload API publik ujian
* **File Upload**: Multer (Local Storage `/uploads/` dengan validasi MIME & batas ukuran)
* **Email System**: Nodemailer (SMTP) untuk Reset Password & Notifikasi Pembayaran
* **Validation**: Zod & TypeScript type safety

## Payment Gateway
* **Sistem Dual Gateway Terintegrasi**:
  1. **Direct Dynamic QRIS (`bits-qris`)**:
     * Standar Nasional EMVCo / GPN.
     * Generasi QR dinamis dengan nominal unik (1-999) untuk verifikasi otomatis.
     * Auto-Approve instan atau persetujuan manual Super Admin.
  2. **Midtrans Native Core API**:
     * Virtual Account Bank: BCA VA, BNI VA, BRI (BRIVA), Permata VA.
     * Mandiri Bill Payment (Biller Code `70012` & Bill Key).
     * QRIS Dinamis Midtrans.
     * Webhook terverifikasi dengan enkripsi SHA-512 Signature Key.
  3. **Mayar Gateway Support**: Modul payment link & webhook terintegrasi.
* **Manajemen Gateway di CMS**: Opsi `USER_CHOICE` (pembeli memilih), `BITS_QRIS`, atau `MIDTRANS`.

## AI Engine
* **Google Gemini API**: Model resmi mutakhir (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`).
* **Adaptive Memory Engine**: Few-shot learning adaptif berbasis riwayat soal terbaik guru & profil gaya mengajar guru untuk menghasilkan soal berkualitas tinggi tanpa repetisi.

---

# 🗄 Struktur Database Models (Prisma)
* **Users**: Data akun, role (`ADMIN`, `TEACHER`, `STUDENT`), plan (`FREE`, `PERSONAL`, `PRO_AI`, `ENTERPRISE`), masa berlaku langganan, kuota AI terpakai & batas kuota, kuota add-on tambahan, Google ID, reset password token, dan pengaturan sertifikat.
* **Subjects**: Kategori atau mata pelajaran milik guru.
* **Materials**: Materi yang diunggah guru (PDF, DOCX, PPT, TXT) beserta teks hasil ekstraksi.
* **Questions**: Bank soal (Pilihan Ganda, Essay, Benar/Salah, Isian Singkat) lengkap dengan tingkat kesulitan, poin, topik, gambar, dan pembahasan.
* **Choices**: Pilihan opsi jawaban untuk soal objektif (`text`, `isCorrect`).
* **Exams**: Ujian online dengan kode akses unik, durasi, jadwal, nilai KKM, password, opsi acak soal/jawaban, konfigurasi sertifikat, dan kolom kustom peserta.
* **Exam Questions**: Relasi ujian dan butir soal dengan nomor urut (`order`) dan bobot poin.
* **Participants**: Data peserta ujian, token, status pengerjaan (`IN_PROGRESS`, `COMPLETED`, `EXPIRED`), field kustom, dan penghitung indikasi kecurangan (`cheatingCount`).
* **Answers**: Rekam jawaban peserta dengan sistem auto-save berkala, skor, dan waktu simpan otomatis.
* **Results**: Nilai akhir, skor maksimum, persentase kelulusan, dan status kelulusan (`isPassed`).
* **Transactions**: Riwayat pembayaran langganan & add-on, status (`PENDING`, `PAID`, `EXPIRED`, `FAILED`), metode bayar, URL pembayaran, rincian diskon, dan relasi kupon.
* **Coupons**: Sistem kupon diskon persentase promo dengan batas pemakaian (`maxUses`), kuota terpakai (`usedCount`), masa kedaluwarsa, dan status aktif.
* **Feedbacks**: Ulasan dan testimoni pengguna dengan rating bintang (1-5), kategori, dan moderasi publikasi untuk ditampilkan di landing page.

---

# 🛡️ Fitur Integritas & Anti-Curang (Proctoring)
* **Deteksi Perpindahan Tab / Jendela**: Sistem mencatat setiap kali peserta berpindah tab, membuka jendela lain, atau kehilangan fokus browser (`cheatingCount`).
* **Peringatan Bertingkat**: Memberikan alert pop-up kepada peserta saat terdeteksi beralih dari halaman ujian.
* **Mode Layar Penuh (Fullscreen Enforcement)**: Meminta peserta berada dalam mode layar penuh selama pengerjaan.
* **Pencegahan DevTools Inspect**: Payload API pengerjaan ujian siswa secara ketat tidak menyertakan kunci jawaban dan pembahasan.

---

# 🎓 Sertifikat Digital Otomatis
* **Desain & Kustomisasi**: Guru dapat mengatur template sertifikat, judul, nama institusi, tanda tangan digital, dan logo.
* **Nomor Sertifikat Unik**: Setiap sertifikat memiliki kode identifikasi unik berformat standar.
* **Validasi Publik (`/certificate/verify/:certNumber`)**: Siapa pun dapat memverifikasi keabsahan sertifikat secara online dengan memindai QR code pada sertifikat.
* **Export PDF**: Peserta yang lulus (mencapai KKM) dapat langsung mengunduh sertifikat digital berkualitas tinggi.

---

# 📡 Live Monitoring Ujian
* **Monitoring Real-time (`LiveMonitorPage`)**: Guru dapat melihat daftar peserta yang sedang mengerjakan secara live.
* **Indikator Status & Keamanan**: Menampilkan progress soal yang telah dijawab, sisa waktu masing-masing peserta, dan counter pelanggaran/indikasi kecurangan secara langsung.
* **Aksi Pengawas**: Guru dapat menghentikan atau memaksa submit ujian bagi peserta tertentu jika terjadi pelanggaran berat.

---

# ⚙️ Super Admin & CMS Terpusat
Tersedia portal Super Admin lengkap pada rute `/@/*` / `/admin/*`:
1. **Admin Dashboard**: Metrik pendapatan, total pengguna, total transaksi aktif, dan grafik pertumbuhan.
2. **Manajemen Pengguna (`AdminUsersPage`)**: Kelola akun, ubah role, upgrade/downgrade paket manual, tambah kuota AI, reset akun, dan pencarian/filter.
3. **Manajemen Transaksi (`AdminTransactionsPage`)**: Pantau semua transaksi masuk, verifikasi manual/auto pembayaran QRIS, tolak transaksi kedaluwarsa, dan tombol batch *"Setujui Semua Pending"*.
4. **Manajemen Kupon (`AdminCouponsPage`)**: Buat kupon promo diskon (1-100%), batas pemakaian, dan tanggal kedaluwarsa.
5. **Moderasi Testimoni (`AdminFeedbackPage`)**: Tinjau masukan/ulasan pengguna dan pilih mana yang tampil di Landing Page.
6. **Admin CMS 10 Tab (`AdminCmsPage`)**:
   * *Tab 1: Info Umum & Kontak* (Nama platform, tagline, email, WhatsApp, telepon, alamat, medsos).
   * *Tab 2: Hero & Statistik* (Headline beranda, subteks, badge promo, statistik counter).
   * *Tab 3: Fitur Unggulan* (Daftar fitur, ikon, dan deskripsi).
   * *Tab 4: Halaman Autentikasi* (Showcase login/register, multi-gambar, upload lokal, auto-slideshow, rekomendasi ukuran gambar).
   * *Tab 5: Paket & Harga* (Harga bulanan/tahunan dinamis, kuota AI, batas peserta, harga kuota add-on).
   * *Tab 6: Testimoni* (Manajemen review sorotan).
   * *Tab 7: Mode Pemeliharaan* (Master switch maintenance global 503 + granular guards per fitur: Pembayaran, AI, Buat Ujian, Ujian Siswa).
   * *Tab 8: Gateway Pembayaran* (Pilihan gateway BITS_QRIS / MIDTRANS / USER_CHOICE, konfigurasi static QRIS, tester EMVCo live, toggle Auto-Approve).
   * *Tab 9: Rate Limiter & Dev Mode* (Master switch mode dev bypass, 1-klik reset antrean cache IP, batas request kustom per kategori).
   * *Tab 10: Footer & Legalitas* (Pengaturan link footer, halaman Kebijakan Privasi, Syarat Ketentuan, Kebijakan Pengembalian Dana, dan Kontak).

---

# 🚀 Roadmap & Status Pengembangan

### Versi 1.x (Selesai & Berjalan di Produksi)
* [x] Login, Registrasi, Lupa Kata Sandi & Google Single Sign-On (GIS).
* [x] AI Question Generator (PDF, DOCX, PPT, TXT) dengan Gemini API & Adaptive Memory.
* [x] Bank Soal terorganisir dengan Kategori, Filter, Import CSV, dan Export.
* [x] Exam Builder dengan Drag & Drop, Acak Soal, Acak Opsi, dan Batas KKM.
* [x] Ruang Ujian Siswa responsif dengan Auto Save berkala dan status indikator aksesibel.
* [x] Penilaian Otomatis & Dashboard Analitik Hasil Ujian.
* [x] Dual Payment Gateway (Direct Dynamic QRIS & Midtrans Core API Native VA/QRIS).
* [x] Sistem Kupon Promo & Diskon Checkout Otomatis.
* [x] Sertifikat Digital Otomatis & Halaman Verifikasi Publik (`/certificate/verify/:certNumber`).
* [x] Live Monitoring Peserta Ujian Real-Time (`LiveMonitorPage`).
* [x] Proctoring / Anti-Cheat (Deteksi pergantian tab, fullscreen lock, counter pelanggaran).
* [x] Portal Super Admin & CMS Manajemen 10 Tab Lengkap.
* [x] Keamanan Menyeluruh (Rate Limiter dinamis, Dev Mode, CSRF Guard, CORS Whitelist, XSS Sanitizer).

### Versi 2.0 (Pengembangan Lanjutan)
* [ ] Aplikasi Mobile Peserta Berbasis PWA / Native (Offline Sync).
* [ ] AI Automated Essay Grading (Penilaian Essay otomatis menggunakan LLM).
* [ ] Proctoring Berbasis Kamera Web (AI Face & Object Detection).
* [ ] Integrasi LMS Sekolah / Kampus (Google Classroom & Moodle LTI Integration).

---

# 🛒 Checkout & Subscription PRD

## 1. Alur Utama Checkout
- **Free**: Langsung menuju Dashboard tanpa biaya (Kapasitas: 15 butir soal di Bank Soal & 15 kuota AI, 1 ujian aktif, 30 peserta).
- **Personal & Pro AI**:
  - Belum Login: `Pricing` ➔ `Mulai Sekarang` ➔ `Register/Login` ➔ `Checkout`.
  - Sudah Login: `Pricing` / `Dashboard` ➔ `Upgrade Paket` ➔ `Checkout`.
- **3-Step Progress Bar**: `① Paket ───── ② Pembayaran ───── ③ Selesai`.

## 2. Halaman Checkout (`/checkout` & `/checkout-addon`)
- **Pilihan Siklus Billing**:
  - **Bulanan**: Personal (Rp 49.000/bln), Pro AI (Rp 149.000/bln).
  - **Tahunan**: Diskon hemat tahunan (Personal Rp 490.000/thn, Pro AI Rp 1.490.000/thn).
  - Nilai harga disinkronkan secara dinamis dari pengaturan Admin CMS.
- **Top-up Add-on Fleksibel**:
  - Tambah Kuota Soal AI (Kelipatan 50 butir).
  - Tambah Batas Peserta Ujian (Kelipatan 100 peserta).
  - Tambah Kuota Ujian Aktif (Kelipatan 5 ujian).
- **Ringkasan Pesanan (Order Summary)**:
  - Rincian Paket/Add-on, Siklus Billing, Harga Dasar, Biaya Layanan, Potongan Kupon Promo, dan Total Nominal.
  - Form Kupon Promo dengan validasi server instan.

## 3. Halaman Pembayaran (`/payment/:orderId`)
- **Pilihan Saluran Pembayaran Terstruktur**:
  - **QRIS Dinamis**: Standar QRIS EMVCo nasional (BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, LinkAja) dengan tombol "Unduh Gambar QR" dan kode unik otomatis.
  - **Virtual Account Bank (Midtrans Core API)**:
    - BCA Virtual Account
    - Mandiri Bill Payment (Kode Perusahaan `70012` & Bill Key)
    - BNI Virtual Account
    - BRI Virtual Account (BRIVA)
    - Permata Virtual Account
- **Pengalaman Pengguna 100% Otomatis**:
  - Auto-polling status transaksi di background setiap 3 detik.
  - Live countdown timer pembayaran 24 jam.
  - Transisi instan ke halaman sukses (**Step 03. Selesai**) tanpa perlu reload manual.
  - Auto-Approve instan saat pembayaran terverifikasi.

## 4. Subscription Management & Lifecycle
- **Aktivasi Otomatis**: Masa aktif akun (`planValidUntil`) dan kuota AI langsung ditambahkan begitu transaksi berstatus `PAID`.
- **Pembatalan Langganan (`POST /api/payments/cancel-subscription`)**:
  - Pengguna dapat membatalkan langganan kapan saja melalui halaman Pengaturan Langganan.
  - Akun langsung ditransisikan ke paket `FREE` secara instan.
  - **Jaminan Keamanan Data 100%**: Seluruh bank soal, materi pelajaran, dan riwayat ujian tetap tersimpan aman tanpa ada data yang dihapus.

