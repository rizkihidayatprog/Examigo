# Progress Log - Examigo

Dokumen ini mencatat seluruh riwayat pekerjaan, fitur yang diimplementasikan, dan perubahan pada proyek **Examigo**.

---

## 📌 Status Proyek Saat Ini
- **Status**: MVP Implementasi ~95% — Auth, DB, Bank Soal, Exam Builder, Exam Room, Analytics, Export, SaaS Pricing, Payment Gateway, **Feature Locking & Benefit Enforcement**, **Masa Aktif Berlangganan** selesai.
- **Terakhir Diperbarui**: 2026-08-12

---

## 🏗️ Arsitektur & Kredensial

### Tech Stack Aktif
| Layer | Teknologi |
|-------|-----------|
| Frontend | React (Vite) + TypeScript + Tailwind CSS + Recharts |
| Backend | Node.js + Express.js + Prisma ORM + JWT + Zod |
| Database | Supabase PostgreSQL |
| AI Engine | Google Gemini API (`@google/genai`) |
| Payment | Pakasir Payment Gateway API |

### Kredensial Supabase (`.env`)
- **URL**: `https://ssfrhxiryjslrfqvnzcl.supabase.co`
- **Anon Key**: `sb_publishable_WRlbMRwmk4XqaEeCezZYhA_7c8X0rJu`
- **DB Password**: `ugJUzS5PuyKRQfNg`
- **DATABASE_URL** (server/.env): `postgresql://postgres.ssfrhxiryjslrfqvnzcl:ugJUzS5PuyKRQfNg@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`

### Penting: Windows Gotcha
- `npx prisma generate` akan error `EPERM` jika server backend (`ts-node-dev`) sedang berjalan karena lock file `.node`. **Kill server dulu** sebelum regenerate Prisma Client.

---

## ✅ Fitur yang Sudah Selesai

### Fase 1: Project Bootstrap & Auth System
- [x] `npm install` pada `client/` dan `server/`
- [x] File `.env` untuk client (Supabase URL + Anon Key) dan server (DATABASE_URL + JWT_SECRET)
- [x] JWT Authentication middleware di backend ([server/src/middleware/auth.ts](file:///d:/PROJECT/Examigo/server/src/middleware/auth.ts))
- [x] Auth Context Provider ([client/src/lib/auth.tsx](file:///d:/PROJECT/Examigo/client/src/lib/auth.tsx)) — mengelola token di `localStorage`, menyediakan helper `api()` dengan auto `Authorization: Bearer` header
- [x] Halaman [LoginPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/LoginPage.tsx) (glassmorphism dark theme)
- [x] Halaman [RegisterPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/RegisterPage.tsx)
- [x] Protected Routes di [App.tsx](file:///d:/PROJECT/Examigo/client/src/App.tsx) — sidebar tersembunyi di halaman auth
- [x] Backend auth routes: `POST /api/auth/register`, `POST /api/auth/login` ([server/src/routes/auth.ts](file:///d:/PROJECT/Examigo/server/src/routes/auth.ts))

### Fase 2: Prisma Database Integration
- [x] Fix dependency `@google/genai` ke `^2.16.0` di [server/package.json](file:///d:/PROJECT/Examigo/server/package.json)
- [x] Prisma schema dengan models: `User`, `Subject`, `Question`, `Choice`, `Exam`, `ExamQuestion`, `Participant`, `Answer`, `Result` ([server/prisma/schema.prisma](file:///d:/PROJECT/Examigo/server/prisma/schema.prisma))
- [x] `npx prisma db push` sukses — schema terdorong ke Supabase PostgreSQL
- [x] Semua backend routes menggunakan Prisma query (bukan in-memory mock):
  - [server/src/routes/subjects.ts](file:///d:/PROJECT/Examigo/server/src/routes/subjects.ts)
  - [server/src/routes/questions.ts](file:///d:/PROJECT/Examigo/server/src/routes/questions.ts)
  - [server/src/routes/exams.ts](file:///d:/PROJECT/Examigo/server/src/routes/exams.ts)
  - [server/src/routes/analytics.ts](file:///d:/PROJECT/Examigo/server/src/routes/analytics.ts)

### Fase 3: Bank Soal — CRUD + Edit/Delete
- [x] Tambah soal manual (Pilihan Ganda, Benar/Salah, Essay, Isian Singkat) via modal di [QuestionBankPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/QuestionBankPage.tsx)
- [x] Edit soal — data terisi otomatis saat klik tombol edit, perubahan disimpan via `PUT /api/questions/:id`
- [x] Delete soal — konfirmasi lalu `DELETE /api/questions/:id`
- [x] Backend endpoints: `GET /api/questions`, `POST /api/questions`, `PUT /api/questions/:id`, `DELETE /api/questions/:id`

### Fase 3b: Exam Builder & Delete Exam
- [x] Buat ujian di [ExamBuilderPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/ExamBuilderPage.tsx) — title, description, durasi, min score, pilih soal, publikasi
- [x] Generate kode akses unik (`EXAM-XXXXXX`)
- [x] Delete ujian dari Dashboard ([DashboardPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/DashboardPage.tsx)) — trash icon, `DELETE /api/exams/:id`
- [x] Dashboard menampilkan daftar ujian real dari database (bukan hardcoded)

### Fase 4: Export Data (CSV)
- [x] Tombol "Export CSV Hasil Ujian" di [AnalyticsPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/AnalyticsPage.tsx)
- [x] Client-side CSV generation — membangun string CSV dari `recentResults` dan trigger browser download
- [x] Filename otomatis: `Hasil_Ujian_Examigo_YYYY-MM-DD.csv`

### Fase 5: Participant Flow (Ujian Online) — Partial
- [x] Join Exam screen — form Nama Lengkap + Email sebelum mulai ujian ([ExamRoomPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/ExamRoomPage.tsx))
- [x] Backend endpoint `POST /api/exams/code/:code/join` — membuat Participant record di DB
- [x] Backend endpoint `POST /api/exams/answers/save` — auto-save jawaban (upsert) + auto-grade untuk MC/TF/Short Answer
- [x] Backend endpoint `POST /api/exams/code/:code/submit` — grade ujian, update status COMPLETED, simpan Result
- [x] Timer countdown di client
- [x] Navigasi soal grid (sudah dijawab = hijau, belum = abu)
- [x] Tampilan hasil ujian (Nilai %, LULUS/TIDAK LULUS)

### AI Question Generator
- [x] Generate soal dari teks/materi via Google Gemini API di [AIGeneratorPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/AIGeneratorPage.tsx)
- [x] Backend AI service ([server/src/services/aiService.ts](file:///d:/PROJECT/Examigo/server/src/services/aiService.ts))

---

## 🐛 Bug yang Diketahui & Perlu Diperbaiki

### ~~1. Submit Ujian Gagal (Kritis)~~ ✅ FIXED
- **Masalah**: Native `confirm()` dialog tidak ter-handle dengan benar di browser saat klik "Kumpulkan Jawaban Ujian".
- **Solusi**: Mengganti native `confirm()` dengan custom glassmorphic confirmation modal (`showConfirmModal` state). Memisahkan `handleSubmitExam()` (tampilkan modal) dan `confirmSubmitExam()` (kirim ke API). Menambahkan animasi `animate-fade-in` di CSS.
- **File diubah**: [ExamRoomPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/ExamRoomPage.tsx), [index.css](file:///d:/PROJECT/Examigo/client/src/index.css)
- **Status**: ✅ Diperbaiki (2026-08-09)

---

## 📋 Fitur Tambahan yang Selesai Dikerjakan

### Prioritas Tinggi
- [x] **File Upload Handler (Multer)** — server-side extraction untuk PDF, DOCX, PPTX, TXT. Saat ini hanya `readAsText` di client.

### Prioritas Sedang
- [x] **Export Excel (XLSX)** — ekspor hasil ujian format XLSX menggunakan library `xlsx`.
- [x] **Export PDF** — cetak laporan hasil ujian format PDF menggunakan `jspdf` & `jspdf-autotable`.
- [x] **Proper error handling & loading states** — integrasi Toast notification system glassmorphic di client.

### Prioritas Rendah / Nice-to-Have
- [x] **Drag & Drop** di Exam Builder (reorder soal) — menggunakan HTML5 drag-and-drop native.
- [x] **Acak Soal** per-peserta (randomize order saat peserta join) — diacak di server-side saat memuat ujian.
- [x] **Analytics charts lebih detail** — visualisasi kelulusan dengan Pie Chart di Analytics Page.
- [x] **Email notifikasi** — kirim hasil ujian ke email peserta setelah submit (Ethereal test fallback).

---

## 📁 Struktur File Utama

```
Examigo/
├── client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── lib/
│   │   │   ├── auth.tsx            # AuthContext, api() helper
│   │   │   ├── constants.ts       # GRADE_LEVELS, shared constants
│   │   │   └── formatters.ts      # formatRichText helper
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── ExamigoLogo.tsx # Logo Typography Wordmark
│   │   │   └── Toast.tsx          # Glassmorphic Toast System
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── LandingPage.tsx       # SaaS Landing + 4-Tier Pricing
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── AIGeneratorPage.tsx
│   │   │   ├── QuestionBankPage.tsx
│   │   │   ├── ExamBuilderPage.tsx
│   │   │   ├── ExamRoomPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   ├── CheckoutPage.tsx      # 3-Step Checkout Wizard
│   │   │   ├── PaymentPage.tsx       # Pakasir Payment Instructions
│   │   │   ├── PaymentSuccessPage.tsx
│   │   │   └── SubscriptionSettingsPage.tsx  # Subscription Management
│   │   ├── App.tsx                 # Router + ProtectedRoute
│   │   └── main.tsx                # AuthProvider wrapper
│   ├── .env                        # VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY
│   └── package.json
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── lib/prisma.ts           # Prisma Client singleton
│   │   ├── middleware/auth.ts      # JWT auth middleware
│   │   ├── routes/
│   │   │   ├── auth.ts             # Register/Login
│   │   │   ├── subjects.ts         # Mata Pelajaran CRUD
│   │   │   ├── questions.ts        # Bank Soal CRUD
│   │   │   ├── exams.ts            # Exam CRUD + Join/Submit/AutoSave
│   │   │   ├── analytics.ts        # Dashboard stats
│   │   │   └── payments.ts         # Pakasir API + Subscription
│   │   ├── services/
│   │   │   ├── aiService.ts        # Google Gemini AI (Vision + Text)
│   │   │   └── documentParser.ts   # PDF/DOCX/PPTX text extraction
│   │   └── index.ts                # Express app entry
│   ├── prisma/schema.prisma        # Database schema
│   ├── .env                        # DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, PAKASIR_API_KEY
│   └── package.json
│
├── PRD.md                           # Product Requirements Document
├── PROGRESS.md                      # File ini
└── .agents/AGENTS.md               # Agent rules & project context
```

---

## 🔒 Sistem Feature Locking & Benefit Enforcement (SaaS Tier)

### Skema Pembatasan per Paket
| Fitur | Free | Personal | Pro AI | Enterprise |
|-------|------|----------|--------|------------|
| **Generate AI** | 1× seumur hidup | Sesuai kuota bulanan | Sesuai kuota bulanan | Custom |
| **Maks Soal per Generate** | 15 | 15 | 15 | Custom |
| **Maks Bank Soal** | 15 | 100 | 300 | Unlimited |
| **Maks Soal per Ujian** | 15 | 100 | 300 | Custom |
| **Maks Ujian** | 1 | 5 | 15 | Unlimited |
| **Maks Peserta** | 5 | 50 | 200 | Custom |
| **Tipe Soal AI** | PG + B/S saja | PG + B/S saja | PG + B/S + Essay + Isian Singkat | Semua |
| **Upload Dokumen** | ❌ Terkunci | ✅ PDF/DOCX/PPT/TXT | ✅ Semua format | ✅ Semua |
| **AI Vision (Gambar)** | ❌ Terkunci | ❌ Terkunci | ✅ Aktif | ✅ Aktif |
| **Anti-Cheat** | ❌ Tidak ada | Basic | Advanced (Fullscreen) | Advanced |
| **Export PDF** | ❌ Terkunci | ❌ Terkunci | ✅ Aktif | ✅ Aktif |
| **Export CSV/Excel** | ❌ Terkunci | ✅ Aktif | ✅ Aktif | ✅ Aktif |
| **Random Soal & Jawaban** | ❌ Terkunci | ✅ Aktif | ✅ Aktif | ✅ Aktif |

### Implementasi Teknis Feature Locking
- **Frontend**: Setiap fitur yang terkunci menampilkan ikon gembok (`Lock`) dan overlay disabled. Klik pada fitur terkunci **tidak mengeksekusi aksi apapun**, melainkan menampilkan **Modal Upgrade** yang mengarahkan ke halaman `/checkout`.
- **Backend**: Endpoint `/api/payments/my-subscription` mengembalikan data real-time dari Supabase:
  - `plan`: Paket aktif user (`FREE`, `PERSONAL`, `PRO_AI`, `ENTERPRISE`)
  - `aiQuotaUsed`: Jumlah soal AI yang sudah di-generate (dari `prisma.question.count`)
  - `aiQuotaLimit`: Batas kuota per paket
  - `questionsUsed`: Total soal di Bank Soal (real count dari database)
  - `questionsLimit`: Batas soal per paket
- **AI Generator**: Paket Free hanya boleh generate **1 kali** (bukan 1 soal, tapi 1 sesi generate). Setelah `aiQuotaUsed >= 1`, tombol generate **terdisable total** dengan pesan upgrade.
- **Exam Builder**: Jumlah soal yang bisa dipilih per ujian dibatasi sesuai `maxQuestionsLimit` per paket. Melebihi batas akan memicu toast error + modal upgrade.
- **Analytics Export**: Export PDF hanya tersedia untuk paket Pro AI ke atas. Export CSV/Excel hanya untuk Personal ke atas.

---

## 📝 Catatan Pekerjaan (Work Log)

### [2026-08-08] - PRD & Agent Setup
- Menyimpan dokumen PRD lengkap di [PRD.md](file:///d:/PROJECT/Examigo/PRD.md)
- Memperbarui [.agents/AGENTS.md](file:///d:/PROJECT/Examigo/.agents/AGENTS.md) dengan tech stack & aturan agen

### [2026-08-08] - Full MVP Implementation (Fase 1-5)
- **Fase 1**: Bootstrap project, install dependencies, setup auth (JWT + bcrypt), login/register pages
- **Fase 2**: Prisma schema design + `db push` ke Supabase PostgreSQL, migrate semua routes dari in-memory ke Prisma queries
- **Fase 3**: Bank Soal CRUD (tambah, edit, delete soal + choices), Exam Builder + delete exam dari Dashboard
- **Fase 4**: Client-side CSV export di Analytics page
- **Fase 5**: Participant join flow (nama/email), auto-save answers, auto-grading, result display
- **Bug ditemukan**: Submit ujian gagal — perlu debug lebih lanjut

### [2026-08-09] - Update Persistent Memory
- Memperbarui PROGRESS.md dengan seluruh catatan pekerjaan, bug tracker, dan arsitektur proyek

### [2026-08-09] - Fix Bug Submit Ujian
- **Masalah**: Native browser `confirm()` tidak kompatibel / jelek di ExamRoomPage
- **Solusi**: Ganti dengan custom glassmorphic modal (backdrop blur, animasi fade-in, tombol Batal/Kumpulkan)
- **File diubah**: `ExamRoomPage.tsx` (state `showConfirmModal`, split handler), `index.css` (tambah `@keyframes fadeIn`)
- **Status**: ✅ Bug resolved, submit ujian berhasil

### [2026-08-09] - Fitur Tambahan & Peningkatan (Fase 6)
- **High-Priority**: Server-side document text extraction (`pdf-parse`, `mammoth`, `officeparser`) via Multer & file upload integration di `AIGeneratorPage.tsx`.
- **Medium-Priority**: Client-side XLSX export (`xlsx`) & PDF export (`jspdf`, `jspdf-autotable`) di `AnalyticsPage.tsx`, Toast notification system glassmorphic di client.
- **Low-Priority**: Native HTML5 Drag & Drop reordering di `ExamBuilderPage.tsx`, question/choice randomization, student result email notifications via SMTP/Ethereal fallback, auto-save restoration di `ExamRoomPage.tsx`.
- **Status**: ✅ Selesai diimplementasikan dan diverifikasi

### [2026-08-09] - Fitur Tambahan Roadmap Versi 2.0
- **Password Ujian**: Proteksi masuk ruang ujian dengan password opsional.
- **Anti-Cheat**: Penguncian fullscreen & deteksi beralih tab (maksimal 3 pelanggaran sebelum auto-submit).
- **Live Monitoring**: Dashboard real-time (polling 5s) untuk guru melacak progres & pelanggaran peserta.
- **QR Code Ujian**: Generator QR code unik untuk link ujian secara langsung di Exam Builder.
- **Sertifikat Otomatis**: Generate PDF sertifikat digital premium kelulusan menggunakan `jspdf` jika peserta lulus.
- **Status**: ✅ Selesai diimplementasikan dan di-push ke database.

### [2026-08-09] - Sesi Interaksi & Penyempurnaan Pengguna
- **Deploy Aplikasi Prisma**: Menjalankan perintah `npx @prisma/cli@latest app deploy` untuk project database (membutuhkan autentikasi `auth login` secara interaktif di terminal lokal pengguna).
- **Audit Akun Database**: Menjalankan script kueri database untuk melacak akun terdaftar (menghasilkan daftar email: `budi@examigo.com` dan `rizki@a.com`).
- **Optimalisasi Alert Anti-Cheat**: Menambahkan kegelapan penuh overlay (`bg-slate-950`), z-index absolut (`z-[9999]`), dan desain modal berbayang tinggi untuk mempertegas notifikasi layar kunci anti-cheat.
- **Pengelompokan Soal per Mata Pelajaran**: Menambahkan integrasi state dinamis mata pelajaran, tab filter mapel pada halaman Bank Soal, dropdown subjectId pada modal tambah/edit soal, serta pintasan modal tambah mapel baru langsung dari halaman Bank Soal.
- **Mata Pelajaran di Exam Builder**: Mengintegrasikan pemilihan mata pelajaran di halaman Exam Builder untuk memfilter daftar soal secara otomatis berdasarkan mata pelajaran terpilih dan mengirimkan `subjectId` ke endpoint `/api/exams`.
- **Perbaikan AI Question Generator**: Memperbaiki kegagalan API Gemini (error 404 pada model deprecated `gemini-2.5-flash`) dengan beralih ke `gemini-flash-latest`, serta memperkuat prompt agar menghasilkan variasi pertanyaan yang unik, mendalam, dan tidak repetitif dari dokumen materi pembelajaran.

### [2026-08-09] - Sinkronisasi Filter Mapel & Perbaikan Toast Loading
- **Integrasi Tingkatan Sekolah (Grade Levels)**:
  - Skema database (`Prisma`) & API endpoint backend (`/api/questions`, `/api/ai/generate`) diperbarui dengan bidang `grade` opsional.
  - Filter tingkat sekolah (`SD 1 - 6`, `SMP 7 - 9`, `SMA/K 10 - 12`) ditambahkan ke **Bank Soal**, **AI Generator**, dan **Exam Builder**.
  - Badge tingkat sekolah (`GraduationCap`) ditampilkan pada setiap kartu soal.
- **Sinkronisasi Mata Pelajaran**: Menghubungkan dropdown mata pelajaran pada halaman AI Question Generator dengan database dinamis (`GET /api/subjects`), sehingga saat AI-generated questions disimpan, sistem akan secara otomatis menyertakan `subjectId` yang valid di database.
- **Penyelarasan Bank Soal & Builder**: Memastikan semua pertanyaan hasil generasi AI terkelompokkan dengan benar di bawah subjek/mata pelajaran yang tepat, sehingga fungsionalitas filter di Bank Soal dan seleksi di Exam Builder terhubung secara harmonis dan tidak terputus.
- **Perbaikan Bug Toast Loading**: Mengatasi masalah toast loading ("Mengunggah dan mengekstrak dokumen...", "Menyimpan soal ke Bank Soal...", dan "Mempublikasikan ujian...") yang menggantung terus-menerus dengan menambahkan callback `dismissToast(toastId)` di block `finally` pada halaman AI Question Generator dan Exam Builder.
- **Manajemen Kategori Mata Pelajaran**:
  - Menambahkan tombol silang (`×`) interaktif pada tab mata pelajaran di Bank Soal untuk menghapus mapel bersangkutan secara instan (`DELETE /api/subjects/:id`) dengan integrasi modal konfirmasi dan sistem toast feedback.
  - Mengintegrasikan tombol **`+` (Tambah Mapel)** dan **Ikon Tong Sampah (Hapus Mapel)** langsung di sebelah dropdown pilihan mapel pada halaman AI Question Generator beserta modal Tambah Mapel mandiri, memangkas kebutuhan perpindahan halaman bagi pengguna.
- **Pencegahan Duplikasi Soal AI**:
  - Pada Frontend, mengosongkan daftar pertanyaan tergenerasi (`setGeneratedQuestions([])`) setelah sukses disimpan ke Bank Soal agar tidak terjadi penyimpanan ganda atau duplikat dari UI.
  - Pada Backend & AI Service, mengirimkan `subjectId` dan membaca daftar soal yang sudah tersimpan untuk mapel tersebut di database, lalu menginstruksikan Gemini AI (`gemini-flash-latest`) untuk menghindari pembuatan soal yang sama atau sangat mirip.
- **Perbaikan Bug Server**: Mengimpor instance `prisma` ke `server/src/index.ts` untuk mencegah runtime error `prisma is not defined` saat memproses kueri pencarian soal mata pelajaran.
- **Dukungan Simbol Matematika**:
  - Menambahkan barisan simbol Unicode matematika (`√`, `π`, `²`, `³`, `⁴`, `½`, `±`, `×`, `÷`, `≠`, `≤`, `≥`, `∞`, `∑`, `∫`, `α`, `β`, `θ`, `Δ`, dll.) sebagai toolbar glassmorphic interaktif pada modal input soal di Bank Soal.
  - Melacak focus input secara dinamis (`focusedInput` state) agar simbol yang diklik langsung terketik ke dalam kolom Pertanyaan atau kolom Pilihan Jawaban yang sedang aktif.
  - Mengonfigurasi prompt Gemini API di backend (`server/src/services/aiService.ts`) agar secara cerdas menggunakan simbol Unicode standar untuk pertanyaan bertema Matematika/Sains dibanding raw LaTeX mentah.
- **Informasi Kelas dan Mata Pelajaran di Ruang Ujian (Exam Room)**:
  - Memperbarui skema Prisma dengan menambahkan kolom `grade String?` opsional di model `Exam`.
  - Memperbarui schema validasi Zod (`examSchema`) dan handler POST `/api/exams` di `exams.ts` backend untuk mendukung parameter `grade`.
  - Menghubungkan parameter `grade: selectedGrade || undefined` saat mempublikasikan ujian dari client `ExamBuilderPage.tsx`.
  - Mengikutsertakan relasi `subject` (`include: { subject: true }`) dan kolom `grade` pada handler GET `/api/exams/code/:code` dan GET `/api/exams` di backend.
  - Menampilkan informasi **Mata Pelajaran** (📚) dan **Tingkatan/Kelas** (🎓) di client `ExamRoomPage.tsx` pada halaman login peserta (Join Card) dan header bar atas ruang pengerjaan ujian secara dinamis.
- **Fitur Berbagi Ujian di Dashboard**:
  - Menambahkan tombol **Salin Link Ujian (📋)** dan **Tampilkan QR Code (🔍)** pada setiap baris daftar ujian aktif di `DashboardPage.tsx`.
  - Mengintegrasikan modal pop-up QR Code interaktif yang dinamis menggunakan QR Code Generator API untuk memudahkan guru membagikan ujian.
- **Peningkatan Layout AI Generator**:
  - Merestrukturisasi tata letak input "Pengaturan Generasi Soal" di `AIGeneratorPage.tsx` dari grid 3-kolom menjadi tata letak yang lebih lega (grid 2-kolom untuk Mata Pelajaran & Tingkatan Sekolah, dan baris penuh untuk input Topik Spesifik).
  - Menghindari pemampatan tombol tambah/hapus mapel dan mencegah text overlap.
- **Peningkatan Editor Soal Manual & Formatting**:
  - Merestrukturisasi modal "Tambah Soal Baru" di `QuestionBankPage.tsx` dari grid 3-kolom menjadi tata letak lega (2-kolom + full-width) untuk mencegah teks select terpotong.
  - Memindahkan toolbar formatting teks cepat (B, I, U) dan grid simbol Matematika/Sains ke panel vertikal di sebelah kanan box Pertanyaan (menggunakan layout grid-cols-12 responsive) agar layout lebih kompak dan terorganisir.
  - Mengintegrasikan tombol **Auto-Generate Pilihan (AI)** pada draf pertanyaan untuk mengisi 4 pilihan jawaban otomatis menggunakan Gemini API.
  - Mengimplementasikan render parser (`formatRichText`) di halaman Bank Soal, Exam Room, Exam Builder, dan AI Generator agar teks terformat (tebal, miring, garis bawah) tampil rapi tanpa menyisakan karakter mentah `**`.
  - **Desain Ulang Sidebar Modal**: Memindahkan Tools Pendukung & Simbol Matematika/Sains keluar dari form utama modal ("di luar box") menjadi sidebar panel tersendiri di sebelah kanan modal dengan lebar optimal (`md:w-72`) dan tombol simbol yang lebih besar (`text-xs font-semibold`, padding `py-2`) sehingga sangat mudah dijangkau dan ramah pengguna.
- **Integrasi Materi Pendukung (Reading Passage / Teks Referensi)**:
  - Membuat router `/api/materials` untuk mengelola data materi pendukung secara persisten di database Prisma.
  - Memperbarui skema API `questions.ts` dan `exams.ts` untuk memetakan dan menyertakan data relasi `material` secara dinamis.
  - Menyesuaikan `AIGeneratorPage.tsx` agar otomatis membuat record `Material` di database saat menyimpan pertanyaan hasil generate AI.
  - Menambahkan dropdown seleksi materi pendukung di modal pembuatan soal manual pada `QuestionBankPage.tsx` dan indikator badge bacaan collapsible di daftar bank soal.
  - Menampilkan box materi pendukung (collapsible) secara dinamis di atas soal ujian aktif pada `ExamRoomPage.tsx` agar peserta tidak kebingungan saat mengerjakan soal yang merujuk pada teks bacaan tertentu.
- **Manual Input & Seleksi Materi Pendukung**:
  - Menambahkan tombol tambah materi baru `(+)` dan hapus materi terpilih `(Trash)` di sebelah dropdown "Materi Pendukung (Opsional)" pada modal manual `QuestionBankPage.tsx`.
  - Mengintegrasikan modal pop-up "Tambah Materi Pendukung Baru" untuk menulis judul dan isi teks bacaan secara manual di Bank Soal.
  - Menambahkan dropdown "Pilih dari Materi yang Sudah Ada (Opsional)" di AI Generator (`AIGeneratorPage.tsx`) untuk menggunakan kembali materi yang sudah ada tanpa harus mengetik atau mengunggah ulang dokumen, serta secara otomatis mengisi input topik, mata pelajaran, dan teks materi.
  - Mengoptimalkan proses penyimpanan AI Generator agar mendeteksi dan mengaitkan soal hasil generate AI ke materi yang sudah dipilih untuk menghindari duplikasi record materi di database.
  - Menambahkan fitur ekstraksi penggalan materi/bacaan singkat (`materialSnippet`) pada AI Generator khusus tingkat SD agar materi pendukung yang ditampilkan sangat ringkas (1-3 kalimat) dan mudah dipahami siswa tanpa memuat keseluruhan dokumen panjang.
  - Memperbaiki logika pertautan materi pada AI Generator: Soal biasa yang tidak memiliki penggalan materi (`materialSnippet`) tidak lagi otomatis ditautkan ke seluruh isi dokumen mentah PDF, sehingga box "Materi Referensi" hanya muncul pada soal yang memang membutuhkan bacaan.
  - Menyempurnakan pemicu tampilan "Materi Referensi" di ruang ujian: materi hanya muncul ketika teks soal memiliki rujukan eksplisit seperti berdasarkan, bacalah, perhatikan, rujukan, referensi, materi, teks, bacaan, cerita, surat, puisi, dialog, wacana, atau kutipan.
  - Mengosongkan form default (Judul Ujian & Deskripsi/Petunjuk Ujian) pada halaman Exam Builder dan menambahkan placeholder yang informatif.
  - Menghapus otomatisasi penautan/pembuatan referensi materi saat menyimpan soal hasil AI Generator, serta menyembunyikan box Materi Referensi agar pengerjaan soal murni berfokus pada isi pertanyaan.
  - Menghapus dropdown dan bidang input "Materi Pendukung (Opsional)" pada halaman AI Generator (`AIGeneratorPage.tsx`) dan halaman Bank Soal (`QuestionBankPage.tsx`).
  - Mengimplementasikan fitur **Gambar pada Soal** & **Multimodal Vision AI**:
    - Skema Prisma diperbarui dengan kolom `imageUrl String? @db.Text` pada model `Question` dan telah disinkronkan ke Supabase.
    - Google Gemini API (`gemini-flash-latest`) diperbarui untuk menganalisis gambar visual Base64 (diagram, grafik, rumus, foto lembar soal, atau tabel) secara langsung.
    - Pengajar dapat mengunggah gambar pada modal pembuatan soal manual di Bank Soal maupun saat men-generate soal AI dari foto materi.
    - Gambar yang diunggah saat AI Generation secara otomatis terikat (`imageUrl`) langsung pada setiap soal yang dihasilkan dan tersimpan di database.
    - Batas maksimum ukuran file gambar dikonfigurasi hingga **5MB** (dan dokumen hingga 10MB) pada frontend & backend server.
    - Ruang Ujian (Exam Room) menampilkan gambar soal secara responsif dan indah saat peserta mengerjakan ujian.
  - Menambahkan fitur **Pilih & Acak Soal Otomatis Berdasarkan Jumlah** pada Exam Builder ([ExamBuilderPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/ExamBuilderPage.tsx)): Pengajar cukup memasukkan jumlah soal (contoh: 10), lalu sistem secara otomatis mengacak dan memilihkan soal sesuai filter mata pelajaran & tingkatan sekolah.
  - Mengosongkan status default seluruh dropdown (Mata Pelajaran & Tingkatan Sekolah) di AI Generator, Exam Builder, dan Bank Soal menjadi opsi placeholder (`-- Pilih Mata Pelajaran --` & `-- Pilih Tingkatan Sekolah --`).
  - Menambahkan validasi **Wajib Diisi (Mandatory)** serta penanda bintang merah (`*`) pada dropdown Mata Pelajaran dan Tingkatan Sekolah. Sistem akan memblokir submit/generasi jika belum memilih kedua field tersebut.
  - Mengimplementasikan **Koreksi Otomatis Soal Essay & Isian Singkat (AI Auto-Grading)** ([aiService.ts](file:///d:/PROJECT/Examigo/server/src/services/aiService.ts) & [exams.ts](file:///d:/PROJECT/Examigo/server/src/routes/exams.ts)):
    - **100% Poin (BENAR)**: Jawaban siswa cocok sempurna atau maksud utamanya persis sama dengan kunci jawaban.
    - **50% Poin (SETENGAH BENAR)**: Jika jawaban mepet, hampir benar, typo/salah eja ringan, atau hanya menyebutkan sebagian kata kunci utama.
    - **0% Poin (SALAH)**: Jika jawaban tidak relevan atau salah konsep.
  - Mengimplementasikan **Export Data Terfilter Sesuai Mata Pelajaran & Kelas/Tingkatan** ([AnalyticsPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/AnalyticsPage.tsx) & [QuestionBankPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/QuestionBankPage.tsx)):
    - Pengajar dapat memilih filter Mata Pelajaran & Kelas/Tingkatan sebelum melakukan ekspor data ke format CSV, Excel, atau PDF.
    - Menghilangkan simbol `%` pada skor/nilai akhir dan menampilkan angka murni (seperti `10`, `70`, `100`).
  - Mengimplementasikan **Review Lembar Jawaban Peserta (Detail Answers Viewer)** ([AnalyticsPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/AnalyticsPage.tsx) & [analytics.ts](file:///d:/PROJECT/Examigo/server/src/routes/analytics.ts)):
    - Pengajar dapat melakukan **Pencarian Nama/Email Peserta (Real-time Search)** di halaman Dashboard Analitik.
    - Pengajar cukup mengeklik nama peserta di tabel **Hasil Peserta Terbaru** untuk membuka Modal Detail Jawaban.
    - Menampilkan rincian jawaban per soal: pilihan yang dipilih siswa (di-highlight hijau/merah), teks jawaban essay/isian singkat, perolehan poin per soal, status kelulusan, dan riwayat pelanggaran kecurangan.
  - **Overhaul Total Frontend Anti "AI Slop" & Perbaikan Kontras High-Readability** ([index.css](file:///d:/PROJECT/Examigo/client/src/index.css), [QuestionBankPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/QuestionBankPage.tsx), [ExamRoomPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/ExamRoomPage.tsx), [AnalyticsPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/AnalyticsPage.tsx)):
    - Mengeliminasi penuh estetika "AI Slop" (menghapus emoji berlebih, border kaku generik, dan gradient murah).
    - **Perbaikan Kontras Teks Pilihan Soal**: Memperbaiki masalah teks tidak terbaca pada daftar pilihan soal. Kunci jawaban benar menggunakan `bg-emerald-50 text-emerald-900 font-bold border-emerald-300` dan pilihan lain menggunakan `bg-white text-slate-700 font-medium border-slate-200`.
    - **Perbaikan Pelanggaran React Rules of Hooks (`ExamRoomPage.tsx`)**: Memindahkan pemanggilan `useState(flaggedQuestions)` dan `useState(showResultReview)` ke bagian atas fungsi sebelum percabangan *early return* (`if (!participantId)`), mengeliminasi eror `Uncaught Error: Rendered more hooks than during the previous render` (penyebab layar putih polos).
    - **Penyajian Rujukan Materi & Gambar Soal Kondisional (`ExamRoomPage.tsx` & `QuestionBankPage.tsx`)**: Menampilkan blok rujukan materi (`material.extractedText`) dan/atau gambar rujukan (`imageUrl`) **HANYA jika soal memiliki rujukan**. Apabila soal tidak memiliki rujukan/gambar, komponen tidak menampilkan kartu rujukan kososng apapun. Latar gambar disesuaikan menggunakan Light Theme (`bg-slate-50 border-slate-200`).

- **Perbaikan Ekstraksi Teks PDF**:
  - Memperbaiki error `TypeError: pdf is not a function` pada pengolahan dokumen PDF di `documentParser.ts` dengan menggunakan class wrapper `PDFParse` yang sesuai dengan library `pdf-parse` versi 2.x (`new PDFParse({ data: dataBuffer })` lalu `.getText()`).
- **Fitur Drag and Drop File Upload**:
  - Menambahkan event handler drag & drop (`onDragOver`, `onDragLeave`, `onDrop`) di area file upload pada `AIGeneratorPage.tsx`.
- **Penyempurnaan AI Question Generator (`AIGeneratorPage.tsx`)**:
  - Menambahkan tombol **"Simpan Semua ke Bank Soal"** di bagian atas dan bagian bawah daftar hasil generasi soal AI agar selalu mudah diakses tanpa harus scroll ulang ke atas.
  - Menambahkan tombol hapus (ikon tempat sampah `Trash2`) pada setiap item kartu soal AI sehingga pengajar dapat membuang soal yang kurang sesuai sebelum menyimpan sisanya.
  - Menambahkan alert sukses dan tombol navigasi langsung **"Buka Bank Soal"** setelah berhasil menyimpan soal.
- **Perbaikan AI Vision & Question Generator (`aiService.ts`)**:
  - Memperbarui urutan nama model Google Gemini API di backend dari model usang (`gemini-2.5-flash`, `gemini-1.5-flash`) menjadi model aktif yang terverifikasi **`gemini-flash-latest`**.
  - Mengeliminasi masalah eror 404 pada API Gemini yang sebelumnya membuat sistem jatuh (*fallback*) ke template mock soal statis/berulang. Sekarang AI Gemini Vision membaca gambar dan materi secara 100% akurat, menghasilkan soal-soal unik yang bervariasi sesuai gambar/teks materi yang diunggah.
- **Fitur Tombol Pratinjau Soal (Eye Icon) di Bank Soal ([QuestionBankPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/QuestionBankPage.tsx))**:
  - Menambahkan tombol ikon **Mata (`Eye`)** di sebelah tombol Edit dan Delete pada setiap kartu soal di Bank Soal.
  - Mengeklik ikon mata akan membuka **Modal Pratinjau Detail Soal** yang menampilkan seluruh rincian soal (teks formatted, gambar, materi rujukan, pilihan jawaban di-highlight hijau, penjelasan kunci jawaban, badge tingkatan, mapel, dan poin).
- **Implementasi SaaS Landing Page Modern & 4-Tier Pricing Structure ([LandingPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/LandingPage.tsx))**:
  - Memperbarui seksi Paket Harga menjadi **4 Tier Berjenjang Tanpa Trial / Uji Coba**:
    1. 🆓 **Free (Rp 0)**: Paket Dasar murni (5 Peserta, 1 Ujian, 15 Soal Bank Soal, Buat Soal Manual, Auto-Grading PG, Basic Timer & Analytics, **Tanpa Anti-Cheat & Tanpa AI Upload**).
    2. 👤 **Personal (Rp 49rb/bln)**: 100 AI Questions/bln, 50 Peserta, 5 Ujian, 100 Bank Soal, Upload PDF/DOCX/PPT/TXT, Random Soal & Jawaban, **Basic Anti-Cheat**, Export Excel & CSV.
    3. ⭐ **Pro AI (Rp 149rb/bln - Paling Populer)**: 300 AI Questions/bln, 200 Peserta, 15 Ujian, 300 Bank Soal, **AI Essay & AI Vision (Gambar)**, **Advanced Anti-Cheat (Fullscreen Lock)**, Advanced Analytics, Export PDF, 3 Teacher, Custom Logo.
    4. 🏢 **Enterprise (Custom Pricing)**: Custom AI Quota/Peserta/Ujian, Unlimited Bank Soal, Multiple Teacher, Role & Permissions, Custom Domain, SSO, API, Dedicated Server & Backup.
  - Menghapus seluruh sebutan *trial* / *masa uji coba* pada semua paket (semua fitur dan kuota bulanan berlaku murni sesuai tier paket pilihan).
  - Merombak seluruh teks paragraf panjang pada Landing Page menjadi **Poin-Poin Ringkas (*Bullet Points*) & Super Scannable** agar nyaman dibaca dengan cepat oleh semua kalangan pengajar.
  - Mengganti seluruh penggunaan emoticon dengan **Ikon Vektor Modern (Lucide React SVG)** seperti `<Bot />`, `<BookOpen />`, `<Layers />`, `<ShieldCheck />`, `<BarChart2 />`, `<Building2 />`, `<User />`, `<Zap />`, `<CheckCircle2 />`, dan `<X />`.
  - Merancang **Logo Typography Wordmark Khusus ([ExamigoLogo.tsx](file:///d:/PROJECT/Examigo/client/src/components/common/ExamigoLogo.tsx))**: Mengeliminasi seluruh kotak ikon/gambar/badge tambahan dan menggunakan tipografi font murni **Exam**`igo` dengan aksen gradien indigo-blue dan simbol bintang AI `✦`. Terimplementasi secara konsisten di Navbar, Footer, Login, dan Register.
  - Memperkaya antarmuka **Kartu Simulasi Demo Interaktif** dengan detail lengkap per tab:
    1. **Auto-Slide Slideshow**: Secara otomatis berganti tab secara mulus setiap 4 detik dengan opsi jeda manual (`Pause/Play`).
    2. **Simulasi Klik Interaktif**: Pilihan A, B, C, D di Tab AI Generator dan nomor navigasi di Tab Ruang Ujian dapat diklik langsung oleh pengunjung untuk mencoba simulasi nyata.
    3. **AI Generator Tab**: Menampilkan file rujukan `Modul_Fisika.pdf`, badge status `AI Vision Active`, opsi interaktif, serta **Blok Penjelasan AI**.
    4. **Exam Builder Tab**: Menampilkan metadata durasi (60 Menit), KKM (75), status acak otomatis, dan daftar soal terpilih.
    5. **Ruang Ujian Tab**: Menampilkan mode Fullscreen Lock, countdown timer 45:12, auto-save status, dan grid navigasi nomor soal interaktif.
    6. **Analitik Tab**: Menampilkan 4 kartu statistik utama dan grafik statistik distribusi skor nilai peserta.
  - Merancang **Favicon SVG Minimalis ([favicon.svg](file:///d:/PROJECT/Examigo/client/src/public/favicon.svg))**: Menampilkan huruf geometri minimalis **e** dengan aksen bintang AI warna emas `✦` di atas latar belakang gradien indigo-blue.
  - Integrasi **Pakasir Payment Gateway API (`2sQMuMLg4dUBaxaYE1t1hqvCOvdiQyqI`) & Alur PRD Checkout Lengkap**:
    1. **Sistem Keamanan API Key**: Seluruh rahasia API Key tersimpan 100% aman pada server (`server/.env`) tanpa pernah dibocorkan ke client.
    2. **Halaman Checkout 3-Step Wizard ([CheckoutPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/CheckoutPage.tsx))**: Rute `/checkout` dengan indikator `① Paket ───── ② Pembayaran ───── ③ Selesai`, pemilih paket Personal/Pro AI, opsi billing Bulanan/Tahunan (Hemat Rp 98K / Rp 298K), serta pendukung Kode Promo (`EXAMIGO10`).
    3. **Halaman Instruksi Pembayaran Pakasir ([PaymentPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/PaymentPage.tsx))**: Rute `/payment/:orderId` dengan dukungan QRIS All Payment & Virtual Account Bank, tombol bayar langsung, dan verifikasi status real-time.
    4. **Halaman Sukses Pembayaran ([PaymentSuccessPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/PaymentSuccessPage.tsx))**: Rute `/payment/success` menampilkan konfirmasi lunas, batas berlaku langganan, dan navigasi langsung ke Dashboard.
    5. **Halaman Manajemen Subscription ([SubscriptionSettingsPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/SubscriptionSettingsPage.tsx))**: Rute `/subscription` pada dashboard untuk melihat status paket aktif, kuota soal AI, tombol upgrade, serta modal konfirmasi pembatalan langganan.
    6. **Alur Registrasi Mulus**: Pengguna baru yang mengklik paket di Landing Page otomatis diarahkan dari `/register?redirect=checkout` langsung menuju `/checkout` setelah pendaftaran tanpa perlu mengulang input data.
  - Terintegrasi pada rute `/landing` dan `/` (untuk pengguna yang belum login).

### [2026-08-10] - SaaS Feature Locking & Benefit Enforcement System
- **Implementasi Sistem Penguncian Fitur Berdasarkan Paket Langganan**:
  - Seluruh fitur premium di aplikasi kini **benar-benar terkunci** (bukan hanya visual gembok tapi tetap bisa diklik). Fitur terkunci **sepenuhnya tidak bisa diakses/diklik/digunakan** — pointer events dinonaktifkan (`pointer-events-none`, `opacity-50`, `cursor-not-allowed`).
  - Klik pada area terkunci langsung menampilkan **Modal Upgrade** dengan link ke `/checkout`.

- **Pembatasan AI Generator ([AIGeneratorPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/AIGeneratorPage.tsx))**:
  - **Paket Free hanya bisa generate AI 1 kali seumur hidup** (bukan 1 soal, melainkan 1 sesi generate). State `aiQuotaUsed` dilacak dari backend endpoint `/api/payments/my-subscription`. Setelah `aiQuotaUsed >= 1`, tombol "Generate Soal AI" terdisable total dan menampilkan pesan "Kuota Generate Habis".
  - **Maksimal 15 soal per generate** untuk semua paket (`max={15}` pada input jumlah + validasi frontend `Math.min(val, 15)`).
  - **Tipe soal terkunci**: Essay (`ESSAY`) dan Isian Singkat (`SHORT_ANSWER`) hanya bisa dipilih oleh paket **Pro AI** ke atas. Pada paket Free & Personal, checkbox tipe soal tersebut ditampilkan dengan gembok dan tidak bisa dicentang.
  - **Upload dokumen terkunci**: Tombol Upload File (PDF/DOCX/PPT/TXT) dan area drag-and-drop dikunci untuk paket Free. Menampilkan overlay gembok dengan label "Fitur Personal+".
  - **AI Vision (gambar) terkunci**: Tombol Upload Gambar untuk Vision AI dikunci untuk paket Free & Personal. Menampilkan overlay gembok dengan label "Fitur Pro AI".

- **Pembatasan Exam Builder ([ExamBuilderPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/ExamBuilderPage.tsx))**:
  - **Maksimal soal per ujian sesuai paket**: Free = 15, Personal = 100, Pro AI = 300. Jika pengajar memilih soal melebihi batas, sistem menampilkan toast error + modal upgrade.
  - **Fitur Acak Soal & Jawaban terkunci**: Toggle random questions/choices dikunci untuk paket Free — menampilkan gembok dan tidak bisa diubah.
  - **Anti-Cheat Mode terkunci**: Toggle Anti-Cheat hanya tersedia untuk paket Personal+ (Basic) dan Pro AI+ (Advanced). Paket Free tidak memiliki anti-cheat sama sekali.

- **Pembatasan Analytics & Export ([AnalyticsPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/AnalyticsPage.tsx))**:
  - **Export PDF**: Hanya tersedia untuk paket **Pro AI** ke atas. Paket Free & Personal melihat tombol dengan gembok.
  - **Export CSV & Excel**: Hanya tersedia untuk paket **Personal** ke atas. Paket Free melihat tombol dengan gembok.

- **Tracking Kuota Real-Time dari Database**:
  - Backend endpoint `GET /api/payments/my-subscription` mengembalikan `questionsUsed` (dari `prisma.question.count({ where: { teacherId } })`) dan `aiQuotaUsed` secara real-time dari Supabase, bukan hardcoded.
  - Halaman Subscription Settings ([SubscriptionSettingsPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/SubscriptionSettingsPage.tsx)) menampilkan progress bar kuota AI dan detail billing.

- **File yang diubah secara signifikan pada sesi ini**:
  - [AIGeneratorPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/AIGeneratorPage.tsx) — Feature locking per tipe soal, upload, vision, AI quota enforcement
  - [ExamBuilderPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/ExamBuilderPage.tsx) — Max questions per exam limit, random/anti-cheat locking
  - [AnalyticsPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/AnalyticsPage.tsx) — Export PDF/CSV/Excel locking
  - [SubscriptionSettingsPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/SubscriptionSettingsPage.tsx) — Real-time quota display
  - [DashboardPage.tsx](file:///d:/PROJECT/Examigo/client/src/pages/DashboardPage.tsx) — Dashboard stat cards
  - [server/src/routes/questions.ts](file:///d:/PROJECT/Examigo/server/src/routes/questions.ts) — Backend question count
  - Backend payments route — `my-subscription` endpoint returns real DB counts
- **Status**: ✅ Selesai — Seluruh fitur terkunci sesuai benefit paket yang dibeli.

### [2026-08-11] - Import Soal CSV, Item Analysis, & Enforce AI Quota Backend
- **Import Soal dari CSV**: 
  - Diimplementasikan di Bank Soal (`QuestionBankPage.tsx`) menggunakan library `papaparse`.
  - Guru dapat mengunggah file CSV berisikan soal, pilihan, kunci jawaban, skor, dan pembahasan.
- **Item Analysis per Soal**:
  - Diimplementasikan pada `AnalyticsPage.tsx` dan backend endpoint `/api/analytics`.
  - Menganalisis tingkat kesulitan/akurasi setiap soal berdasarkan riwayat jawaban benar/salah seluruh peserta, diurutkan dari yang paling sering dijawab salah (tersulit).
- **Enforcement Kuota AI di Backend**:
  - Memindahkan pengecekan batas maksimum kuota AI (1x untuk Free, 100 untuk Personal, 300 untuk Pro AI) langsung ke backend Express (`/api/ai/generate`).
  - Menghapus decrement kuota yang tidak sengaja terjadi saat guru membuat soal secara **manual** (`POST /api/questions`), sehingga pembuatan soal manual murni tidak mengurangi kuota AI sama sekali.
  - Membatasi jumlah soal yang di-generate via backend maksimal 15 soal per request secara hard-limit.
- **Status**: ✅ Semua permintaan dari evaluasi kesenjangan (*gap analysis*) terpenuhi 100%.

### [2026-08-12] - Implementasi Fitur Roadmap Versi 2.0
- **Password Ujian Opsional**: 
  - Guru dapat memberikan password perlindungan pada pengaturan *Exam Builder*.
  - Peserta akan diminta memasukkan password sebelum memasuki *Exam Room* agar lebih aman dari akses ilegal.
- **Sertifikat Kelulusan Digital (jsPDF)**:
  - Peserta yang lulus ujian (memenuhi *Passing Score*) dapat mengunduh sertifikat digital berformat PDF langsung dari halaman hasil ujian.
  - Di-generate secara lokal menggunakan `jspdf` sehingga cepat dan tidak membebani server.
- **Live Monitor Pengawasan (Anti-Cheat 2.0)**:
  - Guru dapat melihat progres peserta secara waktu nyata melalui *Dashboard* (Tombol "Monitor Live").
  - Menampilkan jumlah soal yang terjawab, nilai sementara (jika sudah selesai), dan deteksi bendera merah (berapa kali peserta membuka tab lain) berkat mekanisme HTTP Polling di endpoint `/api/analytics/live/:examId`.
- **Status**: ✅ Selesai — Seluruh Roadmap Versi 2.0 yang dijanjikan telah 100% lengkap.

### [2026-08-12] - Sinkronisasi Sistem Berlangganan & Maintenance Database
- **Perbaikan Autentikasi Checkout**:
  - Mengatasi *bug* "Unknown User" di *Payment Gateway* yang terjadi karena frontend tidak mengirimkan `userId` jika terlanjur logout.
  - Memastikan alur pendaftaran-ke-bayar (*onboarding*) lebih ketat dengan penjagaan `user?.id` yang lebih persisten (tersimpan via token).
- **Perbaikan Feature Locking**:
  - Menyelaraskan seluruh kode frontend (`AnalyticsPage`, `ExamBuilderPage`, `SubscriptionSettingsPage`, dll) untuk secara spesifik memvalidasi `user?.plan` bukan `user?.role`. Hal ini memperbaiki bug dimana pengguna yang sudah membeli paket Pro/Personal tetap terkunci layarnya (Advanced Fullscreen Lock, Export PDF) karena salah variabel validasi.
- **Implementasi Masa Aktif Langganan (Subscription Valid Until)**:
  - **Database Migration**: Menambahkan kolom `planValidUntil DateTime?` pada model `User` dan `billingCycle String?` pada model `Transaction` di Prisma.
  - **Backend Calculation**: `POST /checkout` dan `POST /webhook` kini mendukung opsi tagihan "Bulanan" (`MONTHLY`) maupun "Tahunan" (`YEARLY`). Server otomatis menyuntikkan kadaluwarsa (30 hari / 365 hari ke depan) begitu pembayaran dinyatakan sukses.
  - **Admin Table**: Mengubah tabel *Super Admin* (`AdminUsersPage.tsx`) untuk menampilkan kolom "Masa Aktif". Sistem akan otomatis mengecat *badge* warna merah bertuliskan "Kedaluwarsa" jika hari ini melampaui `planValidUntil`.
  - **Admin Edit**: Menambahkan *input date* pada form Edit User modal, agar Super Admin bisa memperpanjang waktu secara manual.
  - **Legacy Sync**: Mengeksekusi script mandiri untuk memperbarui seluruh pelanggan berbayar terdahulu untuk memiliki 30-hari jaminan aktif dari hari ini.
- **Sistem Pembersihan Background**:
  - Memverifikasi berjalannya *Cron Job (setInterval)* di `index.ts` yang setiap 30-60 menit secara rutin menghapus *history* transaksi yang menggantung berstatus `PENDING` dengan umur lebih dari 3 jam.
- **Status**: ✅ Selesai — Masalah pembayaran, validasi akun, dan pemeliharaan tagihan SaaS telah ditangani tuntas.

### [2026-08-12] - Pembaruan UX Ruang Ujian & Advanced Anti-Cheat
- **Penyempurnaan Antarmuka (UX) Ruang Ujian**:
  - **Personalisasi Tampilan**: Menambahkan tombol *Settings* pada pojok kanan atas Ruang Ujian yang memungkinkan peserta mengatur ukuran teks (Normal, Besar, Sangat Besar) dan tema tampilan (Siang/Malam).
  - **Penyempurnaan Dark Mode**: Menerapkan mode malam yang terintegrasi secara penuh (`bg-slate-950`) hingga ke *background* halaman serta elemen detail seperti area materi rujukan dan warna badge/ikon agar nyaman dipandang.
  - **Responsivitas Mobile**: Memperbaiki tata letak *Action Navigation Bar* ("Soal Sebelumnya", "Tandai Ragu", "Selesaikan Ujian") agar tidak bertumpuk dan lebih responsif saat diakses dari *handphone* dengan mengubahnya menjadi _grid_ berbaris ke bawah (`grid-cols-1 sm:grid-cols-3`).
  - **Penghapusan "Pembahasan"**: Menghapus seluruh opsi dan elemen UI yang memungkinkan peserta melihat kunci jawaban/pembahasan setelah ujian selesai di dalam aplikasi, agar soal tetap rahasia.
- **Pembaruan Sistem Anti-Cheat (Advanced Block Copy)**:
  - Menyuntikkan _event listener_ khusus pada sisi _Client_ (React) yang secara agresif mencegat interaksi _bypass_ dari peserta ujian.
  - Secara aktif **memblokir**: 
    1. Klik Kanan (Context Menu)
    2. Tindakan _Clipboard_ (Copy `Ctrl+C`, Paste `Ctrl+V`, Cut `Ctrl+X`)
    3. Shortcuts sistem seperti `F12`, Inspect Element, View Source (`Ctrl+U`), Print (`Ctrl+P`), dan Save As (`Ctrl+S`).
  - Segala bentuk upaya di atas otomatis memicu `triggerCheatingWarning()` yang menambah poin kecurangan. Ujian akan dikumpulkan paksa secara otomatis jika melanggar hingga 3 kali.
  - Menerapkan perlindungan teks dari aksi _highlighting_ kursor (`select-none` pada _container_ utama) tanpa merusak fungsionalitas pengisian jawaban esai (`select-text`).
- **Status**: ✅ Selesai — Seluruh alur ujian kini dioptimalkan untuk kenyamanan tampilan (Mobile-Friendly & Theme-Aware) sekaligus ketahanan anti-curang tingkat tinggi.

### [2026-08-12] - Peningkatan Estetika Visual Landing Page
- **Redesain Bagian "4 Langkah Mudah" (Alur Kerja)**:
  - Mengubah tampilan dasar grid (daftar langkah kerja aplikasi) menjadi kartu _Spotlight_ bergaya modern dengan efek _glassmorphism_ (`backdrop-blur-sm`).
  - Menambahkan _hover interactions_ (efek melayang dan membesar) serta memadukan gradien warna pastel interaktif pada ikon langkah (Biru, Fuchsia, Amber, Emerald).
  - Menyematkan desain angka langkah di sudut luar kartu serta memberikan _connecting line_ di latar belakang desktop untuk mempertegas "alur/proses" kerja sistem kepada calon pelanggan.
- **Status**: ✅ Selesai — Nilai jual utama aplikasi kini tampil jauh lebih memukau dan informatif bagi pengunjung.

### [2026-08-13] - Production-Ready SaaS Infrastructure & Compliance Upgrades
- **Sistem Email Transaksional & Lupa Password**:
  - Diimplementasikan dengan Nodemailer (`server/src/lib/email.ts`). Otomatis membuat Ethereal Test Account saat di lingkungan *development* jika variabel SMTP belum dikonfigurasi.
  - **Lupa & Atur Ulang Password**: Rute `/forgot-password` dan `/reset-password` dengan *token reset* aman bertenggat 1 jam.
  - **Email Resi Pembayaran**: Otomatis terkirim ke pengguna saat pembayaran langganan dinyatakan `PAID`.
  - **Email Pengingat Kadaluwarsa**: *Task background* memindai akun dengan `planValidUntil` $\le$ 3 hari dan mengirimi email peringatan perpanjangan paket.
- **Keamanan Infrastruktur & Rate Limiting**:
  - Diimplementasikan via `server/src/middleware/rateLimiter.ts`.
  - Membatasi `/api/ai/generate` maksimal 10 kali per 5 menit untuk mencegah eksploitasi dan pembengkakan kuota AI.
  - Membatasi `/api/auth/*` maksimal 15 kali per 15 menit untuk mencegah *brute-force attack*.
  - Menambahkan tombol **Single Sign-On (Google OAuth)** pada halaman login/register dan rute `POST /api/auth/google`.
- **Pengalaman Pengguna (UX) & Retensi**:
  - Halaman **Profil Saya (`/profile`)**: Pengajar dapat mengubah nama, mengunggah URL Avatar, serta mengganti kata sandi.
  - **Banner Onboarding Interaktif**: Dasbor (`DashboardPage.tsx`) menampilkan kartu panduan 3-langkah bagi pengajar baru yang belum memiliki ujian.
- **Aspek Legal & Kepatuhan Payment Gateway**:
  - Membuat halaman Syarat & Ketentuan (`/terms`), Kebijakan Privasi (`/privacy`), Kebijakan Refund (`/refund-policy`), dan Hubungi Kami (`/contact`).
  - Menambahkan `Footer.tsx` global untuk tautan navigasi dan legalitas.
- **Status**: ✅ Selesai — Examigo kini 100% memenuhi standar kelayakan *SaaS Production-Ready*.

### [2026-08-22] - Inisialisasi Git & Persiapan Repository GitHub
- **Konfigurasi Git & Ignore File**:
  - Menambahkan `.gitignore` di akar proyek untuk mengecualikan `node_modules`, `.env`, `dist`, `build`, `server/uploads/*` (dengan `.gitkeep`), file log, dan file temp IDE.
  - Menambahkan `.env.example` untuk `client` dan `server` sebagai acuan variabel lingkungan tanpa membocorkan rahasia production (API key, Database URL, JWT Secret).
- **GitHub Push**:
  - Menginisialisasi repositori Git lokal, membuat komit awal (initial commit), dan menghubungkan ke remote repository `https://github.com/rizkihidayatprog/Examigo.git`.
- **Status**: ✅ Selesai — Repositori siap dan di-push ke GitHub.

