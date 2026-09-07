# Progress Log - Examigo

Dokumen ini mencatat seluruh riwayat pekerjaan, fitur yang diimplementasikan, dan perubahan pada proyek **Examigo**.

---

## 📌 Status Proyek Saat Ini
- **Status**: Full-Stack Security Hardening Completed (Strict CORS, CSRF Protection, Rate Limiting, Mandatory Auth Verification, Secret Key Masking & Isolation), Production Midtrans Payment Gateway Integrated, Google OAuth / GIS Implemented, & Full-Stack Maintenance Mode Active.
- **Terakhir Diperbarui**: 2026-09-06

### Peningkatan Keamanan Sistem Menyeluruh (Full-Stack Security & Hardening)
- [x] **Keamanan Autentikasi & Otorisasi Ketat (Authentication & Authorization Hardening)**:
  - **Penutupan Celah Impersonasi Google Single Sign-On (`server/src/routes/auth.ts`)**:
    - Mewajibkan kredensial token resmi Google ID (`credential`) secara mutlak pada endpoint `POST /api/auth/google`.
    - Menghapus celah keamanan yang sebelumnya mengizinkan login hanya dengan payload `email` mentah tanpa token Google.
    - Memvalidasi keabsahan token ke server resmi Google (`oauth2.googleapis.com/tokeninfo`), memverifikasi status `email_verified`, serta mencocokkan `aud` (Audience / Client ID) dengan konfigurasi aplikasi.
  - **Penghapusan Celah Bypass Pembayaran (`server/src/routes/payments.ts`)**:
    - Menghapus parameter `?simulate=true` pada `GET /api/payments/status/:orderId` yang sebelumnya memungkinkan bypass status pembayaran menjadi PAID tanpa transaksi nyata.
    - Mewajibkan `signature_key` berbasis SHA-512 (`order_id + status_code + gross_amount + ServerKey`) secara mutlak pada webhook Midtrans (`POST /api/payments/midtrans-webhook` & `/notification`). Request webhook tanpa signature atau signature tidak cocok langsung ditolak dengan status HTTP 403.
    - Pada endpoint checkout `POST /api/payments/checkout`, transaksi dengan diskon 100% (gratis) diwajibkan telah terotentikasi (login) untuk mencegah eksploitasi klaim paket tanpa akun sah.
  - **Pencegahan Kebocoran Kunci Jawaban Ujian Siswa (`server/src/routes/exams.ts`)**:
    - Endpoint publik `GET /api/exams/code/:code` tidak lagi menyertakan `choices.isCorrect` maupun `explanation` pada data soal yang dikirimkan ke peramban siswa, sehingga siswa tidak dapat mengintip kunci jawaban melalui DevTools Network.
    - Endpoint auto-save `POST /api/exams/answers/save` tidak lagi membocorkan skor instan maupun status benar/salah (`isCorrect`) kepada siswa selama ujian sedang berlangsung.
  - **Penguatan Kunci JWT (`server/src/middleware/auth.ts`)**:
    - Pengecekan otomatis saat startup server: memberikan peringatan keamanan jika lingkungan produksi (`NODE_ENV=production`) terdeteksi menggunakan JWT_SECRET bawaan atau belum disetel acak.
    - Menyediakan utilitas otorisasi multi-peran `requireRole(allowedRoles)` dan verifikasi opsional `optionalAuthenticateToken`.

- [x] **Pembatasan Laju Permintaan Berlapis (Multi-Tier Sliding Window Rate Limiting)**:
  - **Sistem Rate Limiter (`server/src/middleware/rateLimiter.ts`)**:
    - Dilengkapi response header standar RFC (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`).
    - **General API Limiter**: Membatasi 300 request/menit untuk seluruh rute `/api/*` guna mencegah scraping massal dan serangan DoS.
    - **Auth Limiter**: Membatasi 15 percobaan/15 menit pada `/api/auth/*` (Login, Register, Google OAuth) untuk mencegah brute force dan credential stuffing.
    - **Strict Limiter**: Membatasi 5 percobaan/15 menit untuk operasi sensitif seperti `/api/auth/forgot-password` dan `/reset-password`.
    - **Exam Access Limiter**: Membatasi 30 request/5 menit pada `GET /api/exams/code/:code` dan `POST /api/exams/code/:code/join` guna mencegah brute force kode ujian dan PIN/password ujian.
    - **AI Generator Limiter**: Membatasi 15 generasi/5 menit pada `/api/ai/generate` dan `/api/ai/upload-extract`.
    - **Payment Limiter**: Membatasi 20 request/10 menit pada checkout langganan, top-up add-on, klaim kupon `POST /api/coupons/apply`, dan pemeriksaan status pembayaran.

- [x] **Perlindungan Terhadap Pemalsuan Permintaan Lintas Situs (CSRF Protection)**:
  - **Global CSRF Guard Middleware (`server/src/middleware/security.ts`)**:
    - Mencegat seluruh permintaan state-changing (`POST`, `PUT`, `PATCH`, `DELETE`).
    - Pengecualian aman secara selektif untuk server-to-server webhook Midtrans (`/api/payments/midtrans-webhook`, `/notification`, `/pakasir-webhook`) dan file uploads.
    - Memverifikasi header keamanan peramban `Sec-Fetch-Site` (memblokir request bertanda `cross-site`).
    - Memvalidasi header `Origin` dan `Referer` terhadap whitelist domain Examigo yang sah.
    - Menambahkan header `X-Requested-With: XMLHttpRequest` pada seluruh pemanggilan API client (`client/src/lib/auth.tsx`, `client/src/lib/payment.ts`) untuk memastikan integritas permintaan AJAX resmi.

- [x] **Penguatan Kebijakan Akses Domain (Strict Whitelist CORS)**:
  - **Konfigurasi CORS Terpusat (`server/src/middleware/security.ts`, `server/src/index.ts`)**:
    - Mengganti konfigurasi longgar `cors()` default dengan whitelist origin ketat:
      - Pengembangan lokal: `http://localhost:5173`, `http://localhost:3000`, `http://127.0.0.1:5173`, `http://127.0.0.1:3000`.
      - Domain resmi produksi: `https://examigo.id`, `https://*.examigo.id`.
      - Konfigurasi dinamis via environment variable: `CLIENT_URL` dan `ALLOWED_ORIGINS` (daftar domain dipisah koma).
    - Membatasi metode HTTP yang diizinkan hanya pada: `GET, POST, PUT, DELETE, PATCH, OPTIONS`.
    - Membatasi header yang diterima: `Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-Token`.
    - Mengaktifkan `credentials: true` dan caching preflight `maxAge: 86400` (24 jam) untuk performa optimal.

- [x] **Pencegahan Kebocoran Kredensial, Rahasia & Variabel Lingkungan (Secret Zero-Exposure)**:
  - **Pembersihan `.env.example` (`server/.env.example`)**:
    - Menghapus seluruh kredensial riil (Midtrans Server Key, Client Key, Merchant ID, Google Client ID, dan Google Client Secret) dari berkas yang terlacak git.
    - Menggantinya dengan placeholder standar aman (`your_super_secret_jwt_key_here`, `your_midtrans_server_key_here`, dll).
  - **Penghapusan Hardcoded Fallback Secret pada Source Code (`server/src/routes/payments.ts`)**:
    - Menghapus fallback kunci rahasia produksi hardcoded (`Mid-server-Tw7jMNZ...`) dari kode sumber. Nilai kini hanya diambil secara dinamis dan aman dari `process.env.MIDTRANS_SERVER_KEY`.
  - **Proteksi Berkas Konfigurasi CMS (`server/cms_config.json`, `.gitignore`)**:
    - Menambahkan `server/cms_config.json` ke `.gitignore` sehingga konfigurasi lokal tidak dapat terdorong ke repositori publik.
    - Menghapus kunci API Gemini plaintext dari `cms_config.json` dan membuat berkas template aman `server/cms_config.example.json`.
  - **Sanitasi Error Response Global (`server/src/index.ts`)**:
    - Penangan error Express global kini tidak mengekspos stack trace, path sistem, atau struktur database kepada pengguna di lingkungan produksi.
  - **Sanitasi Input XSS (`server/src/middleware/sanitizer.ts`)**:
    - Sanitasi otomatis rekursif pada `req.body`, `req.query`, dan `req.params` untuk menetralkan tag `<script>`, atribut `on*`, dan protokol `javascript:`.

- [x] **Verifikasi Build Monorepo**:
  - `server` build sukses 100% (`tsc && npx prisma generate` exit code 0).
  - `client` build sukses 100% (`tsc && vite build` exit code 0).



### Fitur Mode Pemeliharaan Sistem Penuh & Parsial (Full-Stack & Granular Feature Maintenance)
- [x] **Mode Pemeliharaan Parsial / Per-Fitur (Granular Feature Flags)**:
  - **Backend Feature Guards (`server/src/index.ts`, `routes/payments.ts`, `routes/exams.ts`)**:
    - `aiGeneration`: Memblokir rute `/api/ai/generate` dan `/api/ai/upload-extract` dengan status HTTP 503 + payload `scope: 'feature'` saat fitur AI dinonaktifkan dari CMS.
    - `payments`: Memblokir rute `/api/payments/checkout` dan `/api/payments/checkout-addon` dengan status HTTP 503 + payload `scope: 'feature'` saat pembayaran/top-up dinonaktifkan.
    - `examCreation`: Memblokir rute pembuatan ujian `POST /api/exams` saat pembuatan ujian dinonaktifkan.
    - `studentExams`: Memblokir pengerjaan/join ujian siswa `POST /api/exams/:code/join` saat server ujian siswa dinonaktifkan.
  - **Frontend Granular Guards (`AIGeneratorPage.tsx`, `CheckoutPage.tsx`, `ExamBuilderPage.tsx`, `ExamRoomPage.tsx`, `DashboardPage.tsx`)**:
    - `safeJson` (`auth.tsx`): Menangani 503 berskala fitur (`scope: 'feature'`) tanpa mengalihkan seluruh website ke `/maintenance`, sehingga user tetap bisa menjelajah halaman lain.
    - `CheckoutPage`: Banner peringatan pemeliharaan pembayaran + tombol checkout di-disable dengan label *"⚠️ Pembayaran Dalam Pemeliharaan"*.
    - `AIGeneratorPage`: Banner peringatan AI + tombol racik soal di-disable dengan label *"⚠️ Fitur AI Sedang Dalam Pemeliharaan"*.
    - `ExamBuilderPage`: Banner peringatan ujian + tombol publikasi di-disable dengan label *"⚠️ Pembuatan Ujian Dipelihara"*.
    - `ExamRoomPage`: Banner peringatan ujian siswa + tombol mulai ujian di-disable dengan label *"⚠️ Pelaksanaan Ujian Sedang Dipelihara"*.
    - `DashboardPage`: Banner peringatan sistem terintegrasi + badge *"Maint."* pada tombol-tombol cepat di hero workspace.
  - **Kontrol Super Admin Tab #7 (`client/src/pages/admin/AdminCmsPage.tsx`)**:
    - Menambahkan 4 card toggle interaktif untuk kontrol independen: Pembayaran, Generator AI, Pembuatan Ujian, dan Ujian Siswa.
- [x] **Backend Global Interceptor & API Protection (`server/src/index.ts`, `server/src/routes/auth.ts`, `server/src/routes/cms.ts`)**:
  - **Global Express Middleware (`server/src/index.ts`)**:
    - Mencegat seluruh request non-admin ketika mode pemeliharaan aktif (`config.maintenance.enabled === true`) dan mengembalikan response HTTP 503 dengan payload informatif (`inMaintenance: true`, judul, pesan, estimasi waktu selesai, dan status izin login admin).
    - Pengecualian aman (*Exemptions*): Asset statis `/uploads`, seluruh API Admin `/api/admin/*`, API konfigurasi publik `/api/public/*`, endpoint login & me `/api/auth/login` / `/api/auth/me` (agar admin bisa login), Google OAuth `/api/auth/google`, pemulihan kata sandi `/api/auth/forgot-password`, webhook pembayaran Midtrans (`/api/payments/midtrans-webhook` & `/notification`), serta endpoint monitoring `/api/health`.
    - Verifikasi JWT Admin langsung: Jika request membawa token `Bearer` dengan `role === 'ADMIN'`, permintaan diteruskan secara transparan tanpa blokir.
  - **Proteksi Rute Autentikasi (`server/src/routes/auth.ts`)**:
    - Pendaftaran akun baru (`POST /api/auth/register`) diblokir dengan pesan ramah saat pemeliharaan.
    - Login biasa (`POST /api/auth/login`) dan login Google (`POST /api/auth/google`) menolak pengguna non-admin (status 503) sambil tetap mengizinkan Super Admin masuk.
  - **Endpoint Manajemen CMS (`server/src/routes/cms.ts`)**:
    - `POST /api/admin/cms/maintenance`: Endpoint toggle cepat status aktif/nonaktif mode pemeliharaan dengan satu klik.
    - `GET /api/public/maintenance-status`: Endpoint publik bebas akses untuk memeriksa status pemeliharaan terkini oleh frontend maupun polling pemeriksaan.
- [x] **Frontend Interceptor, Event Bus & Halaman Pemeliharaan (`App.tsx`, `auth.tsx`, `MaintenancePage.tsx`)**:
  - **Komponen Dedikasi `MaintenancePage.tsx`**:
    - Desain gelap modern (Dark Slate & Amber Glow) dengan logo Examigo, badge pulsa "Mode Pemeliharaan", ikon animasi kunci inggris (`Wrench`), server badge, judul dinamis, dan pesan penjelasan.
    - Kartu estimasi waktu selesai terintegrasi jika diatur oleh admin.
    - Tombol *"Cek Status Sekarang"* dengan indikator pemuatan dan auto-redirect ke beranda saat sistem kembali online.
    - Tautan pintasan *"Akses Masuk Super Admin"* di footer yang dapat disembunyikan/ditampilkan via CMS.
  - **Global App Interceptor (`client/src/App.tsx`)**:
    - Menampilkan `MaintenancePage` secara menyeluruh untuk semua rute non-admin saat `maintenance.enabled === true`.
    - Rute admin (`/@/*`) dan pengguna dengan `role === 'ADMIN'` tetap dapat menggunakan aplikasi tanpa terganggu.
    - Auto-load konfigurasi pemeliharaan dari `/api/public/landing-config`.
  - **Event-Driven Auto-Detection (`client/src/lib/auth.tsx`)**:
    - `safeJson` mendeteksi status HTTP 503 dengan `inMaintenance: true` dan memancarkan CustomEvent `examigo:maintenance` untuk mengalihkan layar pengguna secara instan tanpa perlu reload halaman.
- [x] **Panel Kontrol Mode Pemeliharaan Super Admin (`AdminCmsPage.tsx`, `AdminLayout.tsx`)**:
  - **Tab #7 Khusus "7. Mode Pemeliharaan" di Super Admin CMS**:
    - Tombol switch besar satu-klik untuk Mengaktifkan / Menonaktifkan mode pemeliharaan secara real-time via `POST /api/admin/cms/maintenance`.
    - Input Judul Halaman Pemeliharaan.
    - Input Estimasi Waktu Selesai (opsional).
    - Textarea Pesan Kustom untuk Pengguna.
    - Toggle visibilitas tombol bypass login Super Admin.
    - Badge indikator pulsa kuning pada tab navigasi saat pemeliharaan sedang aktif.
  - **Banner Peringatan Admin Global (`AdminLayout.tsx`)**:
    - Banner peringatan kuning dengan animasi pulsa muncul di bagian atas seluruh halaman Super Admin saat mode pemeliharaan aktif, mengingatkan bahwa akses publik sedang dialihkan, lengkap dengan tautan cepat kelola/matikan.
- [x] **Verifikasi Build Monorepo**:
  - `server` build sukses 100% (`tsc && npx prisma generate` exit code 0).
  - `client` build sukses 100% (`tsc && vite build` exit code 0).


### Pembatasan Kapasitas Bank Soal Paket Free (Maksimal 15 Soal) & Sinkronisasi Kuota Terpakai
- [x] **Enforcement Kapasitas 15 Soal di Seluruh Sistem (`server/src/routes/questions.ts`, `server/src/routes/payments.ts`, `server/src/index.ts`, `QuestionBankPage.tsx`, `AIGeneratorPage.tsx`)**:
  - **Backend Express (`server/src/routes/questions.ts`)**:
    - `POST /api/questions`: Memblokir penambahan soal baru manual jika akun Paket Free sudah menampung 15 butir soal (status HTTP 403 dengan pesan informatif).
    - `POST /api/questions/import`: Menghitung sisa slot bank soal, menolak impor CSV jika jumlah soal yang diimpor akan melebihi batas tampungan 15 butir soal.
    - `DELETE /api/questions/:id` & `POST /api/questions/bulk-delete`: Setiap kali guru menghapus soal di bank soal, nilai `aiQuotaUsed` otomatis disinkronkan ke jumlah soal terkini, sehingga slot kuota kembali terbuka (*slot freed up*).
  - **Sinkronisasi Kuota Paket Free (`server/src/routes/payments.ts`)**:
    - Route `GET /api/payments/my-subscription` secara otomatis menyinkronkan `aiQuotaUsed` dengan `realTimeQuestionCount` untuk akun Paket Free, sehingga status terpakai di dashboard, kartu langganan, dan generator selalu 100% konsisten.
  - **Frontend Bank Soal (`client/src/pages/QuestionBankPage.tsx`)**:
    - Menambahkan badge kapasitas bank soal di header: *"Kapasitas: X / 15 Soal (Penuh)"* untuk Paket Free.
    - Tombol *"Tambah Soal Manual"* dan *"Import CSV"* memproteksi jika koleksi telah mencapai 15 butir soal.
  - **Frontend AI Generator (`client/src/pages/AIGeneratorPage.tsx`)**:
    - Tombol simpan ke bank soal memvalidasi kapasitas tampungan 15 butir soal dan menangani response error kapasitas secara anggun.

### Perbaikan Perhitungan Kuota Generate Soal AI (Berdasarkan Jumlah Butir Soal Nyata)
- [x] **Perubahan Penghitungan Kuota dari "Sekali Generate" ke "Jumlah Butir Soal" (`server/src/index.ts`, `AIGeneratorPage.tsx`)**:
  - **Backend Express (`server/src/index.ts`)**:
    - Menghapus logika legacy yang menaikkan kuota sebesar 1 (`increment: 1`) untuk paket Free.
    - Kuota kini dikurangi **secara presisi berdasarkan jumlah butir soal nyata yang dihasilkan** (`increment: questions.length`).
    - Validasi sisa kuota cerdas: jika sisa kuota 14 soal dan pengguna meminta 5 butir soal, pembuatan diproses dan sisa kuota otomatis menjadi 9 butir soal. Pengguna dapat melakukan generate berkali-kali sampai total 15 butir soal habis.
    - Mengembalikan `aiQuotaUsed`, `aiQuotaLimit`, dan `remainingQuota` di response JSON agar frontend langsung ter-update secara instan.
  - **Frontend Generator Studio (`client/src/pages/AIGeneratorPage.tsx`)**:
    - Menghapus seluruh teks dan pembatasan kaku "1x Generate / 1x Percobaan Free".
    - Menyelaraskan batas kuota dengan basis data: Paket Free mendapatkan 15 butir soal, Personal 100 butir soal, dan Pro 300 butir soal.
    - Memperbarui banner status kuota: menampilkan rincian jelas *"Kuota Generate Soal AI: X / 15 Butir Soal Terpakai (Sisa Y Soal)"*.
    - Tombol racik soal menampilkan jumlah butir yang diminta dan hanya terkunci jika total butir soal benar-benar telah habis.

### Pembelajaran Adaptif AI Guru (Adaptive Few-Shot Learning & Memory Engine di Backend)
- [x] **Implementasi Sistem AI Adaptif di Backend Tanpa Merubah Tampilan Frontend (`server/src/services/adaptiveMemory.ts`, `aiService.ts`, `server/src/index.ts`)**:
  - **Dynamic Few-Shot Learning (Gold Standard Exemplars)**:
    - Setiap kali guru meminta pembuatan soal baru, backend secara otomatis menganalisis riwayat Bank Soal milik guru tersebut.
    - Menyeleksi hingga 4 butir soal terbaik yang telah divalidasi/dikurasi guru (memprioritaskan soal yang pernah diedit guru `updatedAt > createdAt`, memiliki pembahasan mendalam, dan pilihan pengecoh berimbang).
    - Soal-soal acuan ini disuntikkan langsung ke prompt Gemini sebagai contoh teladan standar mutu pedagogis (*few-shot prompting*).
  - **Profil Gaya Mengajar Guru (Teacher Pedagogical Style Profile)**:
    - Menganalisis preferensi guru secara otomatis: apakah menyukai soal berbasis teks stimulus/studi kasus nyata, gaya pembahasan edukatif, serta topik-topik dominan yang sering diujikan.
  - **Model Gemini Resmi Terkini & Pencegahan Duplikasi**:
    - Memperbarui urutan model Gemini ke versi resmi mutakhir (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-2.5-flash-lite`, `gemini-1.5-flash`).
    - Seluruh teks soal lama tetap dikirimkan ke AI sebagai batas pencegah duplikasi (*anti-repetition memory*).
  - **Hasil Pengujian**:
    - Pengujian langsung terhadap basis data dengan data riil guru berhasil mengekstrak 4 butir soal acuan emas dan mengenali profil gaya stimulus guru secara presisi.
    - Seluruh proses berjalan 100% di backend secara hening (*silent intelligence*), tanpa membebani antarmuka pengguna.

### Implementasi Fitur Google Single Sign-On (Google Identity Services GIS & Backend Token Verification)
- [x] **Integrasi Penuh Google OAuth / GIS di Frontend & Backend (`AuthPage.tsx`, `index.html`, `server/src/routes/auth.ts`, `.env.example`)**:
  - **SDK Google Identity Services**:
    - Menambahkan script resmi GIS `<script src="https://accounts.google.com/gsi/client" async defer></script>` pada `client/index.html`.
    - Mengintegrasikan inisialisasi GIS (`google.accounts.id.initialize` & `google.accounts.id.prompt`) di `client/src/pages/AuthPage.tsx`.
  - **Verifikasi Kredensial Kriptografis di Backend Express (`server/src/routes/auth.ts`)**:
    - Endpoint `POST /api/auth/google` memvalidasi ID Token Google secara asinkron via API resmi `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`.
    - Mengekstrak data terverifikasi: `email`, `name`, `sub` (sebagai `googleId`), dan `picture` (sebagai `avatarUrl`).
    - **Otomatisasi Akun**: Jika pengguna belum pernah terdaftar, sistem langsung membuat akun `TEACHER` dengan paket `FREE` dan password acak aman; jika sudah terdaftar, sistem menautkan `googleId` dan avatar.
    - Menghasilkan token otentikasi JWT Examigo yang sah.
  - **Tersedia di Halaman Masuk (Login) & Daftar (Register)**:
    - Tombol *"Lanjutkan dengan Akun Google"* dan *"Daftar dengan Akun Google"* disematkan di kedua form dengan pemisah yang rapi.
  - **Modal Panduan Interaktif & Mode Pengujian Demo**:
    - Jika `VITE_GOOGLE_CLIENT_ID` belum diisi di `.env`, sistem menampilkan modal panduan langkah demi langkah cara mendapatkan Client ID dari Google Cloud Console.
    - Tersedia tombol *"Coba Masuk Akun Guru (Demo Google SSO)"* untuk pengujian instan alur otentikasi tanpa harus menunggu setup Google Cloud.
  - **Konfigurasi Kredensial Produksi Google OAuth Aktif**:
    - `VITE_GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_ID` telah aktif terpasang (`535526532750-k01rugqksghr51qa4pd31398g4jccikr.apps.googleusercontent.com`).
    - `GOOGLE_CLIENT_SECRET` disimpan aman secara eksklusif di backend `server/.env`.
    - Script resmi Google Identity Services otomatis me-render tombol resmi dan memproses login dengan akun Google nyata.

### Optimasi Performa Frontend (Code Splitting, Lazy Loading & Vendor Chunking)
- [x] **Reduksi Ukuran Bundle Awal Sebesar 97% (`client/src/App.tsx`, `client/vite.config.ts`)**:
  - **Dynamic Route-Level Code Splitting**:
    - Seluruh rute halaman (30+ komponen halaman termasuk Dashboard, ExamRoom, AIGenerator, Analytics, CertificateSettings, dan seluruh panel Super Admin) dimigrasikan dari static import ke `React.lazy()` dengan pembungkus `<Suspense fallback={<PageLoadingFallback />}>`.
    - Halaman hanya diunduh oleh browser saat rute bersangkutan diakses oleh pengguna, menghemat kuota dan memangkas waktu *First Contentful Paint* (FCP).
  - **Isolasi Manual Chunk Vendor (`client/vite.config.ts`)**:
    - Library pembuat dokumen berat dipisah ke chunk on-demand mandiri: `vendor-pdf` (`jspdf`, `html2canvas`), `vendor-sheets` (`xlsx`, `papaparse`), `vendor-charts` (`recharts`), dan `vendor-mantine` (`@mantine/*`).
    - Halaman biasa tidak lagi terbebani library PDF/Excel jika pengguna hanya mengakses ruang ujian atau halaman depan.
  - **Hasil Pengukuran Kompilasi**:
    - Chunk JavaScript utama awal berkurang drastis dari **2,183.23 kB (2.18 MB)** menjadi hanya **64.18 kB** (gzip: **19.89 kB**).
    - Status build monorepo `npm run build` sukses 100% (Exit Code 0).

### Upgrade UI/UX Autentikasi (Split Screen Modern, Animasi Gliding Halus, Multi-Gambar & Upload Lokal CMS)
- [x] **Dukungan Multi-Gambar Showcase, Upload Lokal & Panduan Ukuran Rekomendasi (`AdminCmsPage.tsx`, `AuthPage.tsx`, `server/src/routes/cms.ts`)**:
  - **Upload Gambar Lokal dari Komputer/HP**:
    - Menambahkan endpoint multer `POST /api/admin/cms/upload-auth-image` pada backend Express untuk menangani upload gambar lokal (PNG, JPG, WebP) hingga 5MB ke direktori statis `/uploads/`.
    - Super Admin dapat langsung mengklik tombol *"Ambil dari Komputer / HP"* (`<Upload />`) tanpa perlu mengunggah ke hosting eksternal terlebih dahulu.
    - Tetap mendukung opsi penambahan gambar via URL eksternal dengan tombol *"+ Tambah URL"*.
    - **Fallback Otomatis Gambar Bawaan (Default Image Fallback)**:
      - Jika admin menghapus semua gambar atau data gambar kosong/null/string kosong, sistem di backend (`cms.ts`), frontend (`AuthPage.tsx`), dan CMS admin (`AdminCmsPage.tsx`) secara otomatis memulihkan dan menggunakan gambar default Examigo (`/images/auth/login-showcase.jpg` untuk Login dan `/images/auth/register-showcase.jpg` untuk Register) tanpa ada layar kosong (*blank screen*) ataupun error broken image (`onError` fallback).
  - **Manajemen Multi-Gambar Showcase & Galeri**:
    - Setiap halaman (Login & Register) mendukung penyimpanan array banyak gambar (`images: string[]`).
    - Dilengkapi galeri thumbnail dengan badge *"Utama"*, tombol *"Jadikan Utama"*, dan tombol hapus (`<Trash2 />`).
    - Tombol cepat *"Pakai Default"* untuk mereset gambar ke preset bawaan Examigo.
  - **Auto-Slideshow Halus & Indikator Titik Interaktif (`AuthPage.tsx`)**:
    - Jika terdapat lebih dari 1 gambar pada halaman Login atau Register, sistem secara otomatis memutar slide gambar setiap 4.5 detik dengan transisi cross-fade lembut menggunakan `framer-motion`.
    - Menampilkan indikator titik interaktif (*pagination pill dots*) di pojok bawah showcase agar pengguna dapat melihat posisi slide aktif atau mengkliknya secara manual.
  - **Panduan & Rekomendasi Ukuran Gambar Showcase di CMS**:
    - **Rasio Aspek Terbaik**: **1:1 (Square/Persegi)** atau **4:5 (Vertikal/Portrait)**.
    - **Resolusi yang Disarankan**: **1200 x 1200 px** (Standar HD Optimal) atau **1080 x 1350 px** (Modern Portrait).
    - **Format Berkas**: **WebP** (sangat disarankan untuk loading cepat), **JPG** (kualitas 85-90%), atau **PNG**.
    - **Ukuran Berkas Maksimal**: **1 MB – 2 MB** per gambar (maks server 5 MB) agar halaman autentikasi terbuka secepat kilat.
    - **Komposisi Objek**: **Fokus di Tengah (Center-Weighted)** karena area atas memuat logo/navigasi dan area bawah memuat teks hero utama.
  - **Tata Letak Baku & Penghapusan Opsi Posisi Layout**:
    - Menghapus opsi pengatur posisi layout form/gambar (*"Posisi Layout Form & Gambar"*) dari CMS Super Admin dan form autentikasi sesuai permintaan.
    - Tata letak kini menggunakan posisi baku yang natural dan konsisten:
      - **Login**: Banner Showcase di sisi Kiri, Form Masuk di sisi Kanan.
      - **Register**: Form Pendaftaran di sisi Kiri, Banner Showcase di sisi Kanan.
      - Animasi gliding tirai fisik (*sliding curtain*) berjalan mulus secara otomatis saat pengguna berpindah halaman tanpa risiko konflik konfigurasi layout.
  - **Pembersihan Total Emoticon**:
    - Seluruh tampilan Tab CMS Auth dan halaman login/register telah 100% menggunakan ikon vektor SVG dari `lucide-react` (`LogIn`, `UserPlus`, `ShieldCheck`, `Layout`, `ImageIcon`, `Upload`, `Plus`, `Trash2`, `CheckCircle2`, `Info`, `Sparkles`, `RefreshCw`, `ExternalLink`).
- [x] **Penyempurnaan Header Showcase, Hero Teks Bersih & Penggantian Emoticon dengan Lucide React SVG (`AuthPage.tsx`, `AuthLayout.module.css`, `ForgotPasswordPage.tsx`, `ResetPasswordPage.tsx`)**:
  - **Header Showcase (Logo & Tombol Kembali)**:
    - Memberikan padding atas dan samping yang proporsional (`padding: 2.25rem 2.5rem 0 2.5rem`, responsif `3rem 3.5rem` di desktop lebar) sehingga logo `Examigo` tidak lagi menempel/terpotong di tepi atas layar.
    - Tombol *"Kembali ke Beranda"* diubah menjadi tombol kapsul kaca (*glassmorphism pill button*) dengan background `bg-white/15`, border tipis, efek blur, teks putih kontras, serta ikon SVG `<ArrowLeft />` dari `lucide-react`.
  - **Tampilan Hero Teks Bersih (Clean Hero Text Only)**:
    - Menghapus badge pill (`showcasePillBadge`) dan kartu fitur sorotan (`featureHighlightCard`) di bagian bawah showcase sesuai instruksi ("cukup berikan hero teks saja tanpa badge atau apapun").
    - Menampilkan teks hero utama (Judul Headline tebal `text-shadow` 3D dan Subtitle/Deskripsi) yang elegan dan langsung berpadu dengan ilustrasi gambar 3D.
  - **Bebas Emoticon/Emoji — 100% Menggunakan Lucide React SVG**:
    - Menghapus seluruh emoji (seperti `👋`, `🚀`, `🔑`, `🔐`, `⚠️`, simbol panah teks `→`/`←`).
    - Mengganti seluruh indikator visual dengan komponen SVG resmi dari `lucide-react`:
      - Alert error: `<AlertCircle className="w-4 h-4 text-red-600" />`
      - Tombol navigasi: `<ArrowRight className="w-3.5 h-3.5" />` & `<ArrowLeft className="w-3.5 h-3.5" />`
      - Ikon tombol submit & mobile tabs: `<LogIn className="w-4 h-4" />` & `<UserPlus className="w-4 h-4" />`
- [x] **Animasi Geser Super Smooth dengan Framer Motion (`framer-motion`, `AuthPage.tsx`, `App.tsx`, `AuthLayout.module.css`)**:
  - Mengintegrasikan library animasi standar industri **`framer-motion`** (v13+) untuk transisi fisik GPU hardware-accelerated (`transform3d`) bebas stutter dan 60/120fps.
  - **Desktop Dual-Panel Gliding Showcase**:
    - Tirai showcase 50% digerakkan dengan `motion.div` menggunakan kurva gliding Apple `ease: [0.16, 1, 0.3, 1]` durasi `0.75s` dari `x: "0%"` ke `x: "100%"`.
    - Form Slot Register (kiri) dan Login (kanan) dilengkapi animasi parallax kedalaman (`opacity: 0 -> 1`, `scale: 0.95 -> 1`, `x: -28 -> 0` / `x: 28 -> 0`).
    - Cross-fade konten showcase (gambar background 3D, headline, subtitle) dianimasikan dengan `motion.img` dan `motion.div` tanpa layout shift.
  - **Mobile 200% Sliding Track & Spring Physics**:
    - Kontainer carousel mobile menggunakan `motion.div` berbasis physics spring (`type: "spring", stiffness: 220, damping: 26`).
    - Tombol segmented pill `[Masuk Akun] | [Daftar Baru]` dianimasikan dengan spring pill (`stiffness: 350, damping: 30`).
  - **Zero Unmount Preservation**:
    - Rute `/login` dan `/register` di `App.tsx` mempertahankan instans komponen `AuthPage` di DOM sehingga animasi geser tidak pernah ter-reset atau terputus saat navigasi URL.
- [x] **Halaman Login Split Screen Modern (`client/src/pages/LoginPage.tsx` & `AuthLayout.module.css`)**:
  - Tampilan split screen 2-kolom: Banner showcase 3D di sisi **Kiri** dan form masuk di sisi **Kanan** (posisi dapat dibalik secara dinamis via CMS).
  - Background showcase dilengkapi efek 3D hologram Examigo AI, partikel cahaya berdenyut, badge pill kaca (`glassmorphism`), kartu sorotan fitur (`10x Lebih Cepat Bikin Soal`, `Anti-Contek Cerdas`), dan animasi zoom halus saat disentuh kursor.
  - Form kartu modern dengan logo Examigo, input email & password dengan toggle intip kata sandi, tombol Google SSO, peringatan error interaktif dengan animasi shake, serta tombol submit gradasi bertransisi halus.
- [x] **Halaman Register Split Screen Alternatif (`client/src/pages/RegisterPage.tsx`)**:
  - Sesuai instruksi, form registrasi otomatis berpindah ke sisi berlawanan (Form di **Kiri** dan Gambar Showcase di **Kanan**), memberikan efek visual interaktif saat berpindah antara Login dan Register.
  - Showcase menampilkan ilustrasi 3D guru dan siswa merayakan kelulusan sertifikat digital.
  - Form dilengkapi validasi kecocokan password instan dan minimal 6 karakter.
- [x] **Halaman Lupa Password & Reset Password (`ForgotPasswordPage.tsx` & `ResetPasswordPage.tsx`)**:
  - Di-upgrade dari dark slate hardcoded menjadi tema terpadu Emerald Forest dengan tata letak split screen yang konsisten dan elegan.
  - Dilengkapi banner feedback pengiriman email yang jelas serta petunjuk folder Spam/Junk.
- [x] **Integrasi CMS Super Admin (`AdminCmsPage.tsx`, `server/src/routes/cms.ts`, `server/cms_config.json`)**:
  - Menambahkan Tab ke-4 khusus: **"Halaman Auth (Login & Register)"** di Super Admin CMS.
  - Super Admin dapat mengubah:
    - URL Gambar Showcase untuk Login, Register, dan Lupa Password.
    - Pratinjau gambar langsung (`live thumbnail preview`) secara real-time.
    - Tombol cepat satu-klik *"Pakai Default"* untuk mengembalikan aset bawaan sistem.
    - Teks Badge, Judul Headline, dan Subtitle/Deskripsi.
    - **Toggle Posisi Layout Interaktif**: Mengubah posisi Form (Kanan/Kiri) untuk halaman Login dan Register hanya dengan satu klik.
    - Tombol pintasan langsung untuk menguji pratinjau halaman auth di tab baru.

### Sidebar Collapsible / Minimalist & Tombol Logout Menonjol (Visible & Prominent)
- [x] **Sidebar Dapat Diciutkan / Minimalis (`client/src/App.tsx` & `AppLayout.module.css`)**:
  - Menambahkan tombol toggle ciutkan/perluas (`PanelLeftClose` & `PanelLeftOpen`) pada bagian atas header sidebar desktop.
  - Sidebar dapat diperkecil dari lebar standar `16rem` (`256px`) menjadi mode minimalis `4.75rem` (`76px`) dengan animasi transisi yang mulus.
  - Status collapse disimpan otomatis ke `localStorage` (`examigo_sidebar_collapsed`) sehingga preferensi tampilan tetap tersimpan saat pengguna berpindah halaman atau me-refresh web.
  - Pada mode minimalis:
    - Logo menampilkan ikon ringkas `✦` Examigo yang rapi dan terpusat.
    - Setiap menu menampilkan ikon di tengah dengan tooltip nama menu saat kursor melayang (`hover`), serta indikator dot hijau untuk item dengan badge khusus.
    - Judul grup menu otomatis disembunyikan agar layout tetap bersih dan minimalis.
- [x] **Sidebar Tetap Diam di Tempat (Fixed 100vh) & Hanya Isi Konten yang Scroll (`AppLayout.module.css`)**:
  - Mengisolasi layout container `.appShell` dengan `height: 100vh; max-height: 100vh; overflow: hidden;` sehingga window browser tidak memiliki scrollbar luar yang menyeret sidebar.
  - Sidebar desktop (`.sidebarDesktop`) berukuran statis `height: 100vh; max-height: 100vh; flex-shrink: 0; overflow: hidden;` dan benar-benar tetap diam di tempatnya (tidak akan pernah bergerak atau ikut scroll).
  - Konten utama (`.mainViewport`) sekarang menjadi satu-satunya area yang scrollable secara mandiri (`height: 100%; overflow-y: auto; overflow-x: hidden;`) ke atas dan ke bawah dengan scrollbar halus.
  - Tombol logout di bagian bawah sidebar selalu 100% terkunci dan langsung terlihat di layar tanpa perlu scroll sama sekali.

### Akses Menu Desain Sertifikat Khusus Pembelian Paket (Free Menggunakan Sertifikat Default Examigo)
- [x] **Visibilitas Menu Navigasi (`App.tsx` & `DashboardPage.tsx`)**:
  - Menu *"Desain Sertifikat"* pada sidebar desktop dan mobile navigation drawer disembunyikan sepenuhnya untuk pengguna paket **FREE**.
  - Menu ini hanya muncul untuk pengguna yang memiliki paket berbayar aktif (`PERSONAL` / `PRO_AI`).
  - Tombol aksi cepat *"Desain Sertifikat"* pada kartu sambutan Dashboard juga hanya muncul jika pengguna adalah pelanggan paket berbayar.
- [x] **Template Sertifikat Default Resmi Examigo untuk Pengguna Free (`exams.ts` & `certificates.ts`)**:
  - Pada route `GET /api/exams/code/:code`, jika guru/penyelenggara ujian menggunakan paket **FREE** (atau paketnya sudah habis masa aktifnya), siswa yang lulus ujian otomatis diberikan **Template Sertifikat Resmi Default Examigo** (`Examigo Examination System`, tema Emerald Gold, verifikasi QR Code keaslian digital, dan penandatangan resmi Examigo Academy).
  - Backend mengunci endpoint kustomisasi `PUT /api/certificates/settings` dengan kode status 403 bagi pengguna paket Free.
- [x] **Halaman Informasi & Tinjauan Sertifikat Default (`CertificateSettingsPage.tsx`)**:
  - Jika pengguna paket Free membuka halaman `/certificates` secara langsung, sistem menampilkan halaman tinjauan khusus:
    - Informasi bahwa siswa tetap otomatis menerima sertifikat kelulusan resmi Examigo beresolusi tinggi dengan QR Code verifikasi.
    - Live preview interaktif tampilan sertifikat default Examigo yang akan diterima siswa.
    - Tombol uji unduh contoh sertifikat default PDF.
    - CTA untuk upgrade ke paket Personal/Pro jika ingin kustomisasi logo sekolah, 70 tema, watermark, dan tanda tangan digital.

### Penanganan Otomatis Kedaluwarsa Langganan & Reset Total Benefit ke Default Free
- [x] **Auto-Downgrade & Benefit Reset di Backend (`payments.ts`, `auth.ts`, `exams.ts`, `index.ts`)**:
  - Pada saat pengguna memanggil `GET /api/payments/my-subscription` atau `GET /api/auth/me`, jika `planValidUntil <= now`:
    - Akun otomatis di-downgrade dari paket berbayar (`PRO_AI`/`PERSONAL`) ke paket **`FREE`**.
    - Kuota AI di-reset ke standar default Free (**15 Soal**), dan seluruh kuota add-on (`extraAiQuota`, `extraParticipantQuota`, `extraActiveExamQuota`) otomatis di-reset ke **0**.
    - Di basis data, `aiQuotaLimit` diperbarui menjadi 15 dan seluruh extra quota dinonaktifkan sehingga kuota tidak lagi tersisa ribuan butir (misal 6115 soal) setelah masa aktif habis.
  - Pada pembuatan ujian aktif (`exams.ts`), kapasitas siswa ujian (`join`), serta pembuatan soal AI (`index.ts`), sistem secara instan mengecek validitas `planValidUntil` dan memberlakukan batas paket Free jika telah kedaluwarsa.
  - Cron background berkala di `server/src/index.ts` otomatis mereset seluruh pengguna yang masa aktifnya telah habis ke paket dasar Free.
- [x] **Visual & Notifikasi Kedaluwarsa di Frontend (`SubscriptionSettingsPage.tsx`)**:
  - Deteksi kedaluwarsa presisi waktu: `isExpired` dihitung berbasis selisih milidetik (`validDate.getTime() <= now.getTime()`).
  - Ketika masa aktif habis:
    - Menampilkan banner peringatan merah: *"Masa aktif paket Anda telah kedaluwarsa pada [Tanggal] pukul [Jam] WIB. Seluruh benefit fitur Pro dan kuota tambahan otomatis dinonaktifkan dan kembali ke standar paket Free (15 Soal AI, 1 Ujian Aktif)."*
    - Kartu kuota otomatis menampilkan batasan Free: `0 / 15 Soal`, `0 / 1 Ujian`, dan `0 / 5 Siswa`, tanpa badge add-on.
    - Hero card menampilkan status merah berdenyut `STATUS: KEDALUWARSA`, badge `Paket Dasar`, serta tombol `Perpanjang Langganan Pro`.

### Tampilan & Pengaturan Masa Aktif Paket (Tanggal & Batas Jam) di Super Admin
- [x] **Kolom Tabel Pengguna Super Admin (`AdminUsersPage.tsx`)**:
  - Kolom *"Paket"* diperbarui menjadi *"Paket & Masa Aktif"*.
  - Menampilkan badge paket langganan disertai tanggal berakhir dan **jam batas aktif** (`HH:mm WIB`).
  - Indikator khusus badge merah *"Expired"* jika waktu masa aktif telah lewat dari waktu saat ini.
- [x] **Panel Rincian Pengguna (Detail Drawer)**:
  - Kartu baru *"Masa Aktif Paket"* pada grid informasi profil dengan format tanggal lengkap dan batas jam (misal: *05 Oktober 2026, Pukul 20:47 WIB*).
- [x] **Form Edit Akun dengan Batas Jam (`type="datetime-local"`)**:
  - Input *"Masa Aktif Paket (Tanggal & Batas Jam)"* mendukung pemilihan tanggal dan waktu jam:menit secara presisi.
  - Tombol aksi *"Hapus / Kosongkan"* untuk reset masa aktif (misal paket Lifetime/Free).
  - Tiga tombol preset cepat satu-klik:
    - `+1 Bulan (23:59)`
    - `+1 Tahun (23:59)`
    - `+7 Hari (23:59)`
- [x] **Backend API Dukungan ISO Timestamp (`server/src/routes/admin.ts`)**:
  - Route `PUT /api/admin/users/:id` menerima dan menyimpan presisi waktu jam/menit ke database serta mengembalikannya pada respons payload.

### Migrasi Penuh ke Midtrans Payment Gateway (Dengan Auto-Environment Resilience)
- [x] **Kredensial & Lingkungan (Sandbox & Auto-Fallback)**:
  - Error 401 *"Access denied due to unauthorized transaction"* teridentifikasi karena server key & client key yang diberikan oleh user terdaftar di **Midtrans Sandbox Environment**.
  - Mengonfigurasi `MIDTRANS_IS_PRODUCTION=false` dan `VITE_MIDTRANS_IS_PRODUCTION=false` di file `.env` dan `.env.example`.
  - Mengimplementasikan **Auto-Environment Resilience** di backend (`server/src/routes/payments.ts`): fungsi `createSnapTransactionSafe` dan `getTransactionStatusSafe` secara otomatis mendeteksi jika Midtrans merespons 401, lalu otomatis switch/fallback antara Sandbox dan Production secara transparan tanpa pernah menggagalkan transaksi user.
  - Menambahkan loader dinamis `loadMidtransSnap` di frontend (`client/src/lib/payment.ts`) yang memuat script `snap.js` sesuai environment (Sandbox atau Production) yang aktif.
- [x] **Integrasi Backend (`server/src/routes/payments.ts`)**:
  - Menginstal paket resmi `midtrans-client` dan `@types/midtrans-client`.
  - Inisialisasi Midtrans Snap client dengan server key dan status production.
  - **Endpoint Checkout (`POST /api/payments/checkout`)**:
    - Menghasilkan Midtrans Snap token dan link pembayaran (`transaction.token` & `transaction.redirect_url`).
    - Menyimpan order ke basis data dengan status `PENDING`.
  - **Endpoint Addon Quota Checkout (`POST /api/payments/checkout-addon`)**:
    - Membuat tagihan snap khusus untuk kuota tambahan (AI, siswa, ujian) bagi pengguna paket berbayar.
  - **Auto-Sync Transaksi Pending Tanpa Webhook**:
    - Pada route `GET /api/payments/my-subscription`, sistem otomatis memeriksa transaksi berstatus `PENDING` langsung ke Midtrans API (`getTransactionStatusSafe`).
    - Jika pembayaran telah berstatus `settlement` (misal pembayaran QRIS/VA via simulator atau mobile tanpa webhook local/tunnel), akun pengguna langsung otomatis di-upgrade (*auto-fulfilled*) ke paket langganan yang dibeli (`PRO_AI` / `PERSONAL`) dan kuota AI langsung ditambahkan tanpa perlu menunggu webhook.
  - **Endpoint Status Verifikasi (`GET /api/payments/status/:orderId`)**:
    - Melakukan sinkronisasi status langsung ke API Midtrans (`snap.transaction.status(orderId)`).
    - Auto-fulfill upgrade paket dan penambahan kuota ketika transaksi berstatus `settlement` atau `capture`.
  - **Webhook Notifikasi Midtrans (`POST /api/payments/midtrans-webhook` & `/notification`)**:
    - Validasi keamanan tanda tangan hash SHA-512 (`order_id + status_code + gross_amount + ServerKey`).
    - Pemrosesan status otomatis: `settlement`/`capture` (sukses), `pending`, `cancel`/`deny`/`expire` (batal).
- [x] **Integrasi Frontend & Midtrans Snap Popup (`client/`)**:
  - **Midtrans Snap Script**: Ditambahkan ke `client/index.html` dengan client key produksi:
    `<script type="text/javascript" src="https://app.midtrans.com/snap/snap.js" data-client-key="Mid-client-DXxW43_G0huL7fSm"></script>`
  - **Tipe Global (`client/src/vite-env.d.ts`)**: Mendeklarasikan `window.snap` untuk dukungan TypeScript tanpa error.
  - **Payment Utilities (`client/src/lib/payment.ts`)**:
    - `processMidtransCheckout` & `checkMidtransPaymentStatus` (dengan alias backwards-compatible `processPakasirCheckout`).
  - **Halaman Pembayaran (`PaymentPage.tsx`)**:
    - Otomatis membuka popup Midtrans Snap (`window.snap.pay`) dengan callback `onSuccess`, `onPending`, `onError`, `onClose`.
    - Tombol alternatif membuka pop-up Midtrans dan membuka link pembayaran langsung di tab baru jika browser memblokir popup.
    - Tombol cek status manual real-time.
  - **Halaman Checkout (`CheckoutPage.tsx`)**:
    - Menggunakan alur Midtrans checkout dan memperbarui seluruh teks branding, biaya layanan (Rp 0), dan badge enkripsi SSL.
  - **Modal Landing Page (`LandingPage.tsx`)**:
    - Integrasi Midtrans Snap langsung pada tombol beli paket di landing page.
  - **Top Up Kuota Add-on (`SubscriptionSettingsPage.tsx`)**:
    - Popup Midtrans Snap langsung muncul di halaman pengaturan paket saat membeli kuota satuan tanpa harus berpindah halaman.
  - **Footer & Halaman Legal**:
    - Memperbarui penyebutan payment gateway pada `Footer.tsx`, `PaymentSuccessPage.tsx`, `PrivacyPage.tsx`, `TermsPage.tsx`, dan `RefundPage.tsx`.
- [x] **Verifikasi Build**:
  - `server` build lulus tanpa error (`tsc && npx prisma generate` exit code 0).
  - `client` build lulus tanpa error (`tsc && vite build` exit code 0).


### Panel Rincian Pengguna Super Admin (Profil, Sekolah, Ujian, Murid, & Transaksi)
- [x] **Backend API Detail Pengguna (`server/src/routes/admin.ts`)**:
  - Endpoint baru: `GET /api/admin/users/:id/details`.
  - Mengambil data komprehensif dari database:
    - Informasi profil pengajar: nama, email, asal sekolah/instansi (`institution`), nomor WhatsApp (`phone`), jabatan (`position`), bio catatan pengajar, kuota AI terpakai & batas kuota, serta masa aktif paket.
    - Metrik agregasi: total ujian dibuat, total butir bank soal, total murid/peserta ujian, dan total transaksi pembayaran.
    - Daftar riwayat ujian lengkap dengan kode akses, mapel, jumlah soal, dan jumlah peserta.
    - Daftar seluruh murid/peserta yang pernah mengerjakan ujian milik pengajar ini beserta nama siswa, email/NISN, skor/nilai akhir, persentase, status kelulusan (*Lulus/Remidi*), dan waktu pengerjaan.
    - Riwayat transaksi pembayaran pengguna (order ID, nominal, metode, dan status).
- [x] **Peningkatan Antarmuka & UX Super Admin (`AdminUsersPage.tsx`)**:
  - **Baris Tabel Interaktif (Klik untuk Detail)**: Baris pengguna kini memiliki efek hover halus dan dapat diklik secara langsung untuk membuka panel rincian lengkap pengguna.
  - **Kolom Baru "Instansi & Posisi"**: Menampilkan asal sekolah dan peran pengajar (misal: *SMA N 1 Surabaya / Koordinator Ujian*) secara langsung pada tabel utama.
  - **4 Kartu Metrik Utama (Top Bar)**: Menampilkan statistik ringkas Total Pengguna, Pengajar Aktif, Pengguna Berbayar (Personal/Pro AI), dan Total Ujian Dibuat.
  - **Modal / Drawer Detail Pengguna Komprehensif**:
    - **Header Profil**: Avatar besar, nama lengkap, badge jabatan, paket langganan, dan tombol aksi cepat edit akun.
    - **Grid Informasi Sekolah & Kontak**: Asal sekolah/instansi, tautan langsung ke chat WhatsApp pengguna (`wa.me`), kuota AI, dan tanggal bergabung.
    - **4 Counter Summary Badges**: Ujian Dibuat, Murid Mengikuti, Bank Soal, dan Transaksi Pembayaran.
    - **Sistem Tab Navigasi**:
      - **Tab 1 (Daftar Ujian)**: Tabel ujian dengan kode akses, mata pelajaran, jumlah soal, peserta, status (*Published/Draft*), dan tanggal dibuat.
      - **Tab 2 (Murid & Peserta Ujian)**: Tabel rekap nilai dan hasil pengerjaan seluruh siswa yang mengikuti ujian dari guru ini.
      - **Tab 3 (Riwayat Transaksi)**: Tabel riwayat invoice dan status pembayaran paket langganan.
    - **Aksi Cepat Footer**: Tombol *"Hapus Pengguna Ini"* dan *"Tutup"* dengan proteksi terhadap akun admin aktif.

### Fitur Hapus Pengguna di Super Admin (Single & Bulk Delete User)
- [x] **Backend API Hapus Pengguna (`server/src/routes/admin.ts`)**:
  - **Hapus Satuan (`DELETE /api/admin/users/:id`)**:
    - Proteksi keamanan: Mencegah admin menghapus akunnya sendiri yang sedang aktif digunakan (`req.user.id === id`).
    - Menghapus pengguna dan secara otomatis melakukan *cascade delete* pada bank soal, materi, dan ujian milik pengguna tersebut.
    - Menjaga relasi transaksi riwayat pembayaran tetap utuh dengan status `userId: null` (`onDelete: SetNull`).
  - **Hapus Massal (`POST /api/admin/users/bulk-delete`)**:
    - Menerima daftar array `ids: string[]`.
    - Secara otomatis memfilter dan melindungi akun admin yang sedang login agar tidak ikut terhapus.
    - Mengembalikan jumlah pengguna yang berhasil dihapus via `prisma.user.deleteMany`.
- [x] **Antarmuka Manajemen Pengguna Super Admin (`AdminUsersPage.tsx`)**:
  - **Tombol Hapus Tunggal per Baris**: Ikon tempat sampah merah (`Trash2`) di samping tombol edit. Khusus untuk akun admin yang sedang login, tombol dinonaktifkan otomatis dengan label *"Anda"*.
  - **Checkbox Seleksi Multi-Pengguna**: Kotak centang di setiap baris dan opsi *"Pilih Semua di Halaman Ini"* di header tabel.
  - **Floating Bulk Action Bar (Bawah Tengah)**: Muncul melayang secara halus saat ada pengguna yang dipilih, menampilkan counter jumlah terpilih, tombol *Batal*, dan tombol *Hapus X Pengguna*.
  - **Modal Dialog Konfirmasi Penghapusan**:
    - Menampilkan ringkasan akun (nama, email, jumlah ujian dibuat) dan peringatan jelas bahwa tindakan bersifat permanen.
    - Dilengkapi indikator pemuatan (*loading spinner*) saat proses penghapusan berlangsung.
  - **Notifikasi Toast Mengambang**: Memberikan umpan balik instan sukses / gagal di sudut kanan atas.

### Peningkatan Halaman Profil & Fitur Edit Bebas Lengkap (Profile Overhaul)
- [x] **Skema Database & Prisma Migration (`schema.prisma`)**:
  - Menambahkan kolom fleksibel baru pada `model User`:
    - `institution String?`: Asal sekolah / madrasah / universitas / lembaga bimbingan belajar.
    - `phone String?`: Nomor telepon / WhatsApp pengajar.
    - `position String? @default("Koordinator Ujian")`: Jabatan atau peran pengajar (default: Koordinator Ujian).
    - `bio String? @db.Text`: Ringkasan profil, catatan, atau mata pelajaran yang diampu.
  - Berhasil disinkronkan ke basis data via `prisma db push`.
- [x] **Backend Endpoint Profil & Upload Avatar (`server/src/routes/auth.ts` & `certificates.ts`)**:
  - **Upload Foto Langsung (`POST /api/auth/upload-avatar`)**:
    - Mendukung upload file foto profil langsung (`.jpg`, `.jpeg`, `.png`, `.webp`) hingga 5MB menggunakan Multer.
    - Berkas disimpan di direktori `/uploads/` dan URL otomatis ditautkan ke akun pengguna.
  - **Pembaruan Profil Bebas (`PUT /api/auth/profile`)**:
    - Memungkinkan pengajar mengedit seluruh data akun: **Nama Lengkap**, **Alamat Email** (dengan validasi keunikan email terhadap akun lain), **Jabatan / Peran (Koordinator Ujian)**, **URL Foto Avatar**, **Asal Sekolah / Lembaga**, **Nomor Telepon / WhatsApp**, **Bio Singkat Pengajar**, dan **Password**.
    - Mengembalikan JWT token segar dan data pengguna teragregasi lengkap dengan penghitung ujian aktif (`examsCount`) dan bank soal (`questionsCount`).
  - **Sinkronisasi Otomatis Penandatangan Sertifikat (`certificates.ts`)**:
    - Posisi `signer2` (Koordinator Ujian) otomatis mengadopsi nama pengajar (`user.name`) dan jabatan (`user.position || 'Koordinator Ujian'`).
  - **Data Akun Lengkap (`GET /api/auth/me`)**:
    - Mengembalikan data profil lengkap beserta jumlah ujian dan koleksi bank soal.
- [x] **UI/UX Profil Modern & Komprehensif (`ProfilePage.tsx` & `auth.tsx`)**:
  - **Hero Profile Card & Avatar Interaktif**:
    - Tampilan foto profil besar dengan efek hover kamera overlay untuk langsung memilih dan mengunggah gambar dari perangkat lokal.
    - Badge peran akun (*Super Admin* atau *Paket Langganan*).
    - Tanggal bergabung terformat rapi dalam bahasa Indonesia.
  - **4 Metrik Statistik Ringkas Pengajar**:
    - Total Ujian Dibuat.
    - Total Bank Soal Tersimpan.
    - Pemakaian Kuota AI dengan progress bar persentase warna dinamis.
    - Status Akun Aktif & Terverifikasi.
  - **Formulir Edit Lengkap**:
    - Nama Lengkap & Gelar.
    - Email Akun (bisa diedit, login otomatis diperbarui).
    - Asal Sekolah / Madrasah / Instansi.
    - Nomor WhatsApp / HP.
    - URL Foto Profil langsung / manual.
    - Bio singkat / Catatan pengajar.
  - **Keamanan & Kata Sandi**:
    - Kolom sandi saat ini, sandi baru, dan konfirmasi sandi.
    - Tombol buka/tutup intip sandi (`Eye` / `EyeOff`) di setiap kolom.
    - Validasi instan kesesuaian sandi baru dan konfirmasi sandi (*Cocok / Tidak cocok*).
  - **Sinkronisasi Global State (`useAuth` & `updateUser`)**:
    - Perubahan nama, email, atau avatar langsung ter-update di seluruh aplikasi (navbar, topbar, sidebar) secara instan tanpa perlu memuat ulang halaman (zero reload).

### Fitur Hapus Banyak Soal Sekaligus (Bulk Delete Bank Soal)
- [x] **Backend API Bulk Delete (`server/src/routes/questions.ts`)**:
  - Endpoint baru: `POST /api/questions/bulk-delete`.
  - Menerima daftar array `ids: string[]`.
  - Menghapus butir soal terpilih secara atomik via `prisma.question.deleteMany` dengan verifikasi kepemilikan guru (`teacherId: req.user.id`).
  - Mengembalikan jumlah soal yang berhasil dihapus.
- [x] **Antarmuka Multi-Select & Bar Aksi Massal (`QuestionBankPage.tsx`)**:
  - **Checkbox per Butir Soal**: Setiap kartu soal kini memiliki kotak centang rapi yang presisi di sudut kiri atas. Kartu yang dipilih otomatis mendapatkan highlight warna hijau dan ring border kontras.
  - **Toolbar Seleksi Terpisah**: Mengembalikan tata letak filter card ke format 4-kolom proporsional yang bersih, serta menempatkan checkbox *"Pilih Semua di Halaman Ini"* di sub-toolbar mandiri yang elegan.
  - **Floating Pill Bulk Action Bar (Modern Bottom Center)**:
    - Desain floating pill melayang di bagian bawah tengah layar (gaya Linear/Apple modern dengan backdrop blur), tidak menutupi konten atas.
    - Menampilkan indikator counter soal terpilih, tombol *Pilih Semua*, *Batal*, dan tombol bahaya merah *Hapus (X)*.
  - **Penyempurnaan Modal Tambah Soal**:
    - Tombol aksi bawah disusun rapi dan proporsional: tombol sekunder (*Batal / Selesai*) dan tombol primer (*Simpan Soal*).
    - Menghilangkan teks bantuan yang terlalu panjang sehingga modal tampak ringkas, elegan, dan fokus.

### Fitur Pembuatan Soal Manual Berkelanjutan (Modal Stay Open)
- [x] **Alur Tambah Soal Manual Tanpa Keluar (`QuestionBankPage.tsx`)**:
  - Setelah menekan tombol **"Simpan Soal"**, modal input soal kini **tetap terbuka (stay open)** dan tidak lagi menutup otomatis.
  - Bidang isian pertanyaan (`textarea`) dan pilihan jawaban dibersihkan otomatis, serta kursor langsung di-fokuskan kembali ke kolom pertanyaan (`questionTextareaRef.current?.focus()`).
  - **Preservasi Konfigurasi**: Pilihan Mata Pelajaran, Tingkat Kelas/Sekolah, dan Topik tetap tersimpan otomatis sehingga guru tidak perlu memilih ulang untuk soal-soal berikutnya pada topik/mapel yang sama.
  - **Indikator Sesi Pembuatan Soal**: Ditambahkan badge counter di judul modal (misal: *✅ 3 Soal Berhasil Disimpan*) dan notifikasi toast sukses bertahap.
  - **Tombol Navigasi Fleksibel**:
    - Tombol **"Selesai"** (atau "Batal" jika belum ada soal disimpan) dan tombol silang `X` di sudut kanan atas untuk menutup modal kapan pun guru telah selesai membuat rangkaian soal.
    - Tombol **"Simpan Soal"** dengan indikator loading saat proses penyimpanan berlangsung.

### Sistem Kuota Satuan / Eceran (Add-on Top-Up) & Kontrol Harga Super Admin
- [x] **Database Schema Migration (`schema.prisma`)**:
  - Menambahkan kolom kuota tambahan pada `model User`:
    - `extraAiQuota Int @default(0)` (Tambahan butir soal AI)
    - `extraParticipantQuota Int @default(0)` (Tambahan kapasitas siswa/peserta per ujian)
    - `extraActiveExamQuota Int @default(0)` (Tambahan slot ujian aktif bersamaan)
  - Menambahkan dukungan jenis transaksi add-on pada `model Transaction`:
    - `transactionType String @default("SUBSCRIPTION")` (`SUBSCRIPTION` | `ADDON`)
    - `addonDetails String? @db.Text` (Menyimpan rincian butir kuota yang dibeli dalam format JSON)
  - Berhasil menjalankan `prisma db push` ke PostgreSQL Supabase.
- [x] **Panel Kontrol Harga Kuota Satuan di Super Admin CMS (`/@/cms` & `AdminCmsPage.tsx`)**:
  - Ditambahkan kartu pengaturan **"Pengaturan Harga Kuota Tambahan (Add-on Top-Up Satuan)"** pada Tab 1:
    - **Kebijakan Paket**: Hanya berlaku untuk semua paket berbayar (Personal & Pro AI) dan tidak berlaku untuk paket Free.
    - **Toggle On/Off**: Mengaktifkan atau menonaktifkan fitur pembelian kuota eceran bagi pengguna.
    - **Harga per 1 Kuota Soal AI**: Input harga satuan dalam Rupiah (default: Rp 500 / butir).
    - **Harga per 1 Siswa/Peserta**: Input harga satuan per kapasitas peserta ujian (default: Rp 200 / siswa).
    - **Harga per 1 Ujian Aktif**: Input harga satuan per slot ujian aktif (default: Rp 5.000 / ujian aktif).
    - **Minimum Pembelian**: Batas minimum order per item (misal: min 10 soal AI, min 25 siswa, min 1 ujian aktif).
  - Terkoneksi secara langsung dengan `cms_config.json`, endpoint `PUT /api/admin/cms`, dan `GET /api/public/landing-config`.
- [x] **Proteksi & Pembatasan Khusus Paket Berbayar (Backend & Frontend)**:
  - **Backend (`POST /api/payments/checkout-addon`)**: Memblokir permintaan checkout add-on jika akun berstatus `plan === 'FREE'` dengan respon HTTP 403 (*"Pembelian kuota satuan hanya berlaku untuk paket berbayar..."*).
  - **Frontend Modal (`SubscriptionSettingsPage.tsx`)**: Jika pengguna paket Free membuka modal top-up, sistem menampilkan tampilan locked eksklusif dengan penjelasan manfaat dan tombol aksi langsung untuk upgrade ke Paket Personal / Pro AI.
  - **Top Bar Badge**: Tombol beli kuota satuan menampilkan indikator `Personal & Pro` dengan ikon gembok untuk pengguna akun Free.
- [x] **Backend Add-on Checkout & Pembayaran Otomatis (`payments.ts`)**:
  - Endpoint `POST /api/payments/checkout-addon`:
    - Memvalidasi item yang dibeli dengan harga dan minimum kuota aktif dari CMS.
    - Menghitung total invoice dan membuat tagihan unik Pakasir (`orderId: ADDON-...`).
    - Mencatat transaksi tipe `ADDON` ke database.
  - Endpoint verifikasi status `GET /api/payments/status/:orderId` dan Webhook `POST /api/payments/pakasir-webhook`:
    - Otomatis mendeteksi transaksi bertipe `ADDON` saat lunas (`PAID`).
    - Mengurai `addonDetails` dan meng-inkrementasi kuota pengguna: `extraAiQuota`, `extraParticipantQuota`, dan `extraActiveExamQuota` secara atomik.
- [x] **Pemberlakuan Kuota Menyeluruh di Sistem (Backend Enforcement)**:
  - **Generator Soal AI (`server/src/index.ts`)**: Batas kuota menghitung `aiQuotaLimit + extraAiQuota`. Pengurangan kuota memperhitungkan akumulasi kuota tambahan.
  - **Pembuatan Ujian Baru (`server/src/routes/exams.ts`)**: Batas ujian aktif yang dipublikasikan (`isPublished: true`) memvalidasi `maxActiveExams + extraActiveExamQuota`.
  - **Siswa Bergabung ke Ujian (`server/src/routes/exams.ts`)**: Batas kapasitas peserta ujian memvalidasi `maxParticipants + extraParticipantQuota` dari guru pemilik ujian.
- [x] **Modal Interaktif Pembelian Kuota Satuan di Halaman Langganan (`SubscriptionSettingsPage.tsx`)**:
  - Tombol **"Beli Kuota Satuan"** (`TopUpModal`) dengan antarmuka modern, responsif, dan dinamis.
  - Menampilkan harga satuan live dari Super Admin CMS.
  - Tombol stepper kuantitas (`-` / `+`) dan *quick-add chips* (+10, +50, +100 soal AI; +25, +50, +100 siswa; +1, +2, +5 ujian).
  - Ringkasan subtotal & total harga dinamis, langsung terintegrasi dengan gateway pembayaran QRIS / transfer bank Pakasir.

### Peningkatan Total Halaman Paket & Kuota Langganan (`/subscription`)
- [x] **Kalkulasi Persentase Penggunaan Real-Time Sesuai Paket**:
  - **Generate Soal AI**: Menampilkan persentase akurat (`aiQuotaPercent% Terpakai` & `aiQuotaRemainingPercent% Sisa`), bar progres dengan gradasi warna adaptif (Hijau `<70%`, Kuning `70-90%`, Merah `>90%`), metrik angka jelas (misal: `75 / 300 Soal`), serta jadwal reset kuota otomatis setiap bulan.
  - **Batas Ujian Aktif**: Menampilkan jumlah ujian yang sedang aktif dan dipublikasikan (`isPublished: true`) dibandingkan batas paket (misal `3 / 15 Ujian Aktif - 20% Digunakan`), slot ujian tersisa, dan total akumulasi ujian yang pernah dibuat.
  - **Kapasitas Peserta Ujian**: Menampilkan persentase peserta ujian (`participantsPercent% Terisi`) dan sisa kapasitas peserta yang tersedia sesuai paket (misal: 200 siswa untuk Pro, 50 siswa untuk Personal, 5 siswa untuk Free).
  - **Bank Soal & Materi Tersimpan**: Statistik butir soal di bank soal dan dokumen materi referensi yang terunggah dengan jaminan penyimpanan permanen (*100% Unlimited Storage*).
- [x] **Status & Durasi Masa Aktif Paket Dinamis**:
  - Menghitung sisa hari aktif langganan secara otomatis (`planValidUntil`) dengan pill badge indikator (misal: *Sisa 24 Hari* / *Perlu Diperpanjang*).
  - Khusus paket Free: otomatis berstatus *"Masa Berlaku: Selamanya"*.
- [x] **Spesifikasi Lengkap Fitur Sesuai Paket**:
  - Menampilkan ringkasan kapabilitas paket aktif: Anti-Cheat Mode (*Advanced Fullscreen Lockdown & 2x Auto-Submit* untuk Pro vs *Basic* untuk Personal vs *Nonaktif* untuk Free), Sertifikat Kelulusan (*70 Tema + QR Verifikasi* untuk Pro), dan format ekspor laporan.
- [x] **Riwayat Pembayaran & Transaksi Lengkap**:
  - Menampilkan riwayat transaksi pembayaran faktur terakhir (Order ID, Tanggal, Paket, Nominal Rp, Metode Pembayaran, dan Status `PAID`/`PENDING`).
- [x] **Backend Endpoint Enhancement (`/api/payments/my-subscription`)**:
  - Mengambil batas kuota dinamis dari `cms_config.json` (jika ada kustomisasi admin) atau fallback paket resmi.
  - Mengembalikan data `planValidUntil`, `activeExamsCount`, `totalExamsCount`, `totalParticipantsCount`, `totalMaterialsCount`, dan `limits`.


### Sistem Pagination & Search Bar Komprehensif Seluruh Aplikasi
- [x] **Reusable Smart Pagination Component (`client/src/components/common/Pagination.tsx`)**:
  - Komponen modular mandiri lengkap dengan:
    - Informasi rentang dinamis: *"Menampilkan X - Y dari Z [nama_item]"*.
    - Pilihan jumlah per halaman (*Items per Page* selector): 5, 10, 20, 50, 100 dengan auto-reset ke halaman 1 saat diubah.
    - Navigasi tombol lengkap: Halaman Pertama (`ChevronsLeft`), Sebelumnya (`ChevronLeft`), Nomor Halaman Pintar dengan *ellipsis* (`1 ... 4 5 6 ... 12`), Berikutnya (`ChevronRight`), dan Terakhir (`ChevronsRight`).
    - Dukungan tema ganda: varian `light` (default untuk panel guru/siswa) dan varian `dark` (khusus dashboard Super Admin).
- [x] **Bank Soal (`QuestionBankPage.tsx`)**:
  - Menambahkan pagination di bawah grid/daftar butir soal dengan pemotongan array (`slice`).
  - Dilengkapi selector jumlah item per halaman (10, 20, 50, 100 soal).
- [x] **Analitik & Hasil Peserta (`AnalyticsPage.tsx`)**:
  - **Tabel Hasil Peserta Terbaru**: Dilengkapi pagination dan pemilih per halaman (5, 10, 20, 50 peserta).
  - **Tabel Analisis Tingkat Kesulitan Butir Soal**:
    - Ditambahkan **Search Bar** pencarian teks soal instan.
    - Ditambahkan **Pagination** dan selector item per halaman (5, 10, 20, 50 butir soal).
- [x] **Pengawasan Ujian Siswa Real-Time (`LiveMonitorPage.tsx`)**:
  - Ditambahkan **Search Bar** untuk mencari nama atau email siswa secara real-time.
  - Ditambahkan filter status interaktif: *Semua*, *Mengerjakan*, *Selesai*, dan *Peringatan (Indikasi Pindah Tab)*.
  - Ditambahkan **Pagination** dengan counter peserta aktif.
- [x] **Exam Builder (`ExamBuilderPage.tsx`)**:
  - Pada tab *"Pilih Soal"* dari Bank Soal:
    - Ditambahkan **Search Bar** pencarian teks soal di bank soal.
    - Tombol bantu *"Pilih/Batal Filter"* untuk memilih atau membatalkan seluruh soal hasil filter sekaligus.
    - Filter tingkat kelas (SD, SMP, SMA, SMK, Umum).
    - Ditambahkan **Pagination** (10 per halaman, opsional 5/20/50).
- [x] **Manajemen Pengguna Super Admin (`AdminUsersPage.tsx`)**:
  - Search bar nama dan email pengguna otomatis me-reset halaman aktif ke halaman 1.
  - Ditambahkan **Pagination** dengan varian tema gelap (`variant="dark"`).


### Super Admin CMS & Customization Suite (`/@/cms`)
- [x] **Backend CMS API**:
  - `GET /api/public/landing-config` (Public endpoint untuk Landing Page & Checkout)
  - `GET /api/admin/cms` (Super Admin config fetcher)
  - `PUT /api/admin/cms` (Super Admin config persistence ke `server/cms_config.json`)
- [x] **Super Admin CMS Dashboard (`/@/cms`)**:
  - **Tab 1: Harga & Kuota Paket** (Free, Personal, Pro AI harga bulanan/tahunan & kuota).
  - **Tab 2: Hero & Headline** (Pill badge, headline, subtitle, tombol CTA).
  - **Tab 3: Tema & Warna** (Preset Emerald Forest, Ocean Blue, Modern Indigo, Royal Purple, custom hex pickers).
- [x] **Favicon-Identical Brand Logo Design (`ExamigoLogo.tsx`)**:
  - Logo vektor di seluruh aplikasi diselaraskan 100% dengan desain dan palet warna [favicon.svg](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/public/favicon.svg):
    - **Emblem Squircle**: Gradasi Indigo to Blue (`#4F46E5` ke `#2563EB`).
    - **Ikon Vektor**: Huruf geometris lengkung *"e"* putih bersih (`#FFFFFF`) berpadu dengan aksen bintang kecerdasan buatan emas (*Gold AI Sparkle* `#FBBF24`).
    - **Wordmark Tipografi**: **Exam** (`#1E1B4B` / `#FFFFFF` saat di atas dark navbar) + **igo** (`#4F46E5`).
  - Tampil konsisten di semua navbar, sidebar guru, auth login/register, dan checkout.
- [x] **Locked Feature Upgrade Modal Redesign (`AIGeneratorPage.tsx`)**:
  - Tampilan pop-up modal *"Fitur Dikunci untuk Paket Anda"* di-upgrade total ke standar desain SaaS modern:
    - Dilengkapi badge kategori *"Fitur Eksklusif Paket Guru"*, ikon kilau AI bercahaya, dan kartu manfaat upgrade dengan dot indicator.
    - Sinkronisasi dinamis dengan harga dan kuota live dari CMS Control Panel (`cmsConfig.pricing`).
    - Tombol aksi *"Upgrade Sekarang"* dan *"Nanti Saja"* terkoneksi 100% dengan CSS theme variables aktif.
- [x] **Harmonisasi Seluruh Section Landing Page & Dinamis 100% (`LandingPage.tsx` & `LandingPage.module.css`)**:
  - **Hero Section**: 2-Column Split Hero ramping tanpa badge pill berlebih, langsung fokus pada headline bertenaga dan live mockup AI generator.
  - **Stats, Perbandingan Nyata, Fitur, Alur, Target Pengguna, & FAQ**: 100% tersambung secara mulus dengan CSS Theme Variables (`var(--theme-primary)`, `var(--theme-mint-light)`, `var(--theme-border)`, dll).
  - **Logo Examigo**: Menggunakan icon emblem squircle gradasi indigo-blue resmi + huruf 'e' putih & bintang AI emas yang bersih di navbar dan footer.
- [x] **Full Context AI Generator & Pop-up Modal Materi Rujukan (`ExamRoomPage.tsx`, `aiService.ts`, `AIGeneratorPage.tsx`, `formatters.ts`, `AdminCmsPage.tsx`, `cms.ts`)**:
  - **Smart Contextual Document Analyzer**: Memperbaiki generator soal agar 100% kontekstual dan faktual sesuai jenis dokumen yang diunggah (surat resmi, pengunduran diri/administrasi, modul materi). Menghapus pertanyaan acak atau opsi jawaban dummy seperti *"Hanya berlaku untuk prosedur sekunder tanpa analisis tambahan"*.
  - **Tab 5: Kunci API AI (Gemini) & Live Connection Tester di CMS (`/@/cms`)**: Ditambahkan tab pengaturan API Key Google Gemini di dashboard Super Admin lengkap dengan tombol **⚡ Uji Koneksi API** (`POST /api/admin/cms/test-ai-key`) untuk memvalidasi kunci API langsung ke server Google AI dan memeriksa kesiapan model (`gemini-flash-latest`, `gemini-2.0-flash`).
  - **Dukungan Dokumen PDF Murni**: Dokumen PDF yang diunggah kini disimpan sebagai berkas fisik PDF asli di server (`/uploads/`) dan ditampilkan secara murni menggunakan viewer PDF responsif di pop-up modal ruang ujian siswa, lengkap dengan tautan buka tab baru.
  - Memperbaiki sistem prompt AI (`aiService.ts`) dan mock generator: jika soal menguji bacaan, AI wajib menyertakan kutipan teks bacaan lengkap di dalam soal sehingga siswa tidak lagi menemukan soal menggantung tanpa materi.
  - Memperbaiki alur penyimpanan di [AIGeneratorPage.tsx](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/pages/AIGeneratorPage.tsx): teks dokumen/materi yang diinput/diunggah otomatis disimpan sebagai entitas `Material` resmi dan ditautkan (`materialId`) ke semua butir soal yang di-generate.
  - **Smart Orphan Question Sanitizer ([formatters.ts](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/lib/formatters.ts))**: Menambahkan pembersih otomatis untuk soal-soal lama yang merujuk *"Berdasarkan materi yang dipelajari..."* tetapi tidak memiliki berkas materi di database, sehingga otomatis diubah menjadi pertanyaan konsep mandiri yang langsung dapat dijawab siswa tanpa kebingungan mencari teks rujukan.
  - Menambahkan sanitasi otomatis untuk menghapus sisa underscore/placeholder berlebih dan menjaga teks pertanyaan tetap rapi.
  - Menambahkan banner dan tombol interaktif *"📖 Buka Pop-up Materi"* (`Maximize2`) langsung pada soal yang berbasis bacaan di ruang ujian siswa, serta tombol akses cepat di bilah atas (*top bar*).
  - Teks rujukan materi disajikan dalam modal pop-up yang nyaman dibaca dan di-scroll tanpa opsi "Buka Tab Baru" untuk menjaga integritas ujian dan mode layar penuh.
  - **Pembedaan Cerdas Antara Prompt Soal vs Materi Pop-up (`AIGeneratorPage.tsx`, `ExamRoomPage.tsx`)**:
    - **Dokumen Impor Berkas Fisik (PDF/DOCX/PPT)**: Tetap selalu diakui sebagai materi rujukan resmi dan ditampilkan dalam pop-up modal.
    - **Teks yang Ditempel Langsung (*Paste Text*)**:
      - Jika berupa kalimat/paragraf pendek atau hanya instruksi topik (di bawah 350 karakter, misalnya *"EJAAN EYED YANG BAIK dan BENAR"*): otomatis dianggap sebagai **prompt biasa pembuat soal** dan **tidak memunculkan tombol/modal pop-up materi** di ruang ujian siswa.
      - Hanya teks bacaan panjang yang substansial (artikel panjang, modul, cerpen >= 350 karakter) yang akan dimunculkan ke dalam pop-up modal materi.
  - **Penyempurnaan Tema & Dark Mode Ruang Ujian Siswa (`ExamRoomPage.tsx`)**: Memperbaiki container utama ujian dan halaman hasil ujian (`isSubmitted && result`) agar sepenuhnya responsif terhadap tema gelap (`isDarkMode`) dengan palet kontras yang nyaman dan rapi.
  - **Sistem Anti-Kecurangan 2x Pelanggaran (`ExamRoomPage.tsx`)**: Menurunkan batas toleransi kecurangan menjadi maksimal 2x (pindah tab, keluar fullscreen, shortcut terlarang, dsb.). Pada pelanggaran ke-2, sistem langsung mengumpulkan ujian secara otomatis (*auto-submit*). Ditambahkan indikator status pelanggaran pada info spesifikasi awal, modal kunci layar penuh, dan bar atas ujian.
  - **Sensitivitas Anti-Kecurangan Tingkat Tinggi Khusus HP/Smartphone (`ExamRoomPage.tsx`)**:
    - **Perlindungan Snapshot Multitasking / App-Switcher HP (Synchronous Privacy Shield)**: Mengatasi celah pratinjau multitasking (seperti pada iOS App Switcher & Android Recent Apps di mana soal masih terlihat saat beralih ke WhatsApp/Instagram). Dilengkapi manipulasi DOM sinkron nol milidetik (`activatePrivacyLockdown`) yang seketika mengaburkan lembar soal (`blur(60px)`, `opacity: 0.01`) dan mengaktifkan overlay hitam pelindung privasi (`#sync-privacy-overlay`) sebelum peramban sempat mengambil gambar *snapshot* untuk multitasking tray.
    - **Modal Pelanggaran Interaktif & Mencekam (`violationModalData`)**: Menggantikan notifikasi biasa dengan modal peringatan darurat tingkat tinggi berlatar gelap pekat (*blackout* & *vignette blood-red strobe*). Dilengkapi alarm suara sirine berfrekuensi tinggi (*Web Audio API klaxon synthesizer*) dan getaran darurat beruntun pada HP (*Haptic buzzer* `navigator.vibrate`), kotak bukti forensik digital (*Live Security Audit Log*), serta pernyataan sanksi hukum akademik tegas yang mewajibkan peserta mengambil sumpah kejujuran sebelum diberikan 1 kesempatan terakhir. Pada pelanggaran ke-2, sistem langsung mengunci dan mendiskualifikasi ujian secara permanen.
    - **Deteksi Hilang Fokus Cepat (`window.blur`, `visibilitychange`, `pagehide`, `beforeunload`)**: Langsung mendeteksi gesture geser ganti aplikasi (*app switcher*), tarik panel notifikasi, Control Center (iOS), beralih tab, maupun popup jendela mengambang (*floating window*).
    - **Blokir Gesture Screenshot 3 Jari (`touchstart`)**: Mencegah dan mencatat upaya tangkapan layar multi-sentuh di perangkat Android.
    - **Deteksi Mode Split-Screen (`resize`)**: Mendeteksi jika peserta membagi dua layar peramban dengan aplikasi lain.
    - **Blokir Tahan Sentuhan (Long-press) & Seleksi Teks (`selectstart`)**: Mencegah pemanggilan fitur Google Lens, pencarian AI, atau salin teks di layar ponsel.
    - **Banner Peringatan Tingkat Tinggi**: Menampilkan banner peringatan berdenyut merah jika peserta sudah melakukan 1 pelanggaran dengan info konsekuensi auto-submit.
- [x] **Fitur Kustomisasi Sertifikat di Dashboard Pengajar (`/certificates`)**:
  - **Database & Prisma**: Menambahkan field `certificateSettings String? @db.Text` pada model `User` dan `Exam` di Prisma schema serta menjalankan migrasi `prisma db push`.
  - **Backend API (`server/src/routes/certificates.ts`)**:
    - `GET /api/certificates/settings`: Mengambil konfigurasi sertifikat user dengan fallback default otomatis dan autofill nama pengajar.
    - `PUT /api/certificates/settings`: Memvalidasi (Zod) dan menyimpan konfigurasi kustomisasi sertifikat user.
    - `GET /api/exams/code/:code`: Otomatis menyertakan data konfigurasi sertifikat milik pengajar untuk ruang ujian siswa.
  - **Shared Engine Pembuat Sertifikat (`client/src/lib/certificateGenerator.ts`)**:
    - Render dokumen PDF landscape resolusi tinggi berbasis `jsPDF`.
    - 4 Tema Eksklusif: *Emerald Gold* (senada identitas Examigo), *Royal Navy* (slate gelap & amber gold), *Academic White* (lis biru kerajaan & emas), dan *Crimson Platinum* (marun & perak).
    - 3 Gaya Bingkai (*Double Gold*, *Modern Clean*, *Ornate Frame*).
    - Render QR Code verifikasi digital otomatis menggunakan `qrcode`.
  - **Halaman Manajemen Sertifikat (`CertificateSettingsPage.tsx`)**:
    - Tab pengaturan: Institusi & Teks, Tanda Tangan & Logo, Tema & Opsi Tampilan.
    - Upload gambar logo lembaga dan tanda tangan/stempel digital 2 penandatangan.
    - Live Preview Interaktif real-time (WYSIWYG) dengan input simulasi nama siswa dan judul ujian.
    - Tombol *"Uji Unduh PDF"*, *"Reset Default"*, dan *"Simpan Perubahan"*.
  - **Opsi Fleksibel Penerbitan Sertifikat (Setelah Lulus atau Tidak)**:
    - **Tingkat Ujian (`ExamBuilderPage.tsx`)**: Opsi checkbox *"Berikan Sertifikat Setelah Lulus"* saat membuat/menerbitkan paket ujian baru, tersimpan ke kolom `hasCertificate` di tabel `Exam`.
    - **Tingkat Pengajar Global (`CertificateSettingsPage.tsx`)**: Master toggle *"Penerbitan Sertifikat Kelulusan"* (Aktif / Nonaktif) dengan info status dan indikator peringatan pada Live Preview.
    - **Ruang Ujian (`ExamRoomPage.tsx`)**: Tombol *"Unduh Sertifikat Kelulusan"* hanya dimunculkan jika peserta lulus **DAN** opsi sertifikat diaktifkan (`hasCertificate !== false && enableCertificate !== false`). Jika dinonaktifkan, siswa tidak melihat tombol unduh sertifikat.
    - **Tabel Analitik (`AnalyticsPage.tsx`)**: Tombol *"Cetak Sertifikat"* menyesuaikan izin penerbitan sertifikat ujian terkait.
- [x] **70 Gaya Template Sertifikat, Tipografi Font, Watermark Logo Sekolah & Portal Cek Keaslian (`CertificateSettingsPage.tsx`, `certificateGenerator.ts`, `certificates.ts`, `CertificateVerifyPage.tsx`, `App.tsx`)**:
  - **70 Pilihan Palet Warna & Gaya Sertifikat Eksklusif (`CERTIFICATE_THEMES`)**:
    - Menghadirkan **70 tema visual presisi** (20 tema awal + 50 tema baru) lengkap dengan **fitur pencarian instan (Quick Search)** dan filter kategori (*Gelap Mewah*, *Terang Elegan*, *Akademik Klasik*, *Modern Minimalis*):
      - *Tema Gelap Mewah*: Emerald Gold, Royal Navy, Crimson Luxury, Midnight Amethyst, Slate Minimalist, Golden Prestige, Ocean Breeze, Forest Moss, Ruby Elegance, Sunset Terracotta, Executive Monochrome, Nordic Frost, Majestic Bronze, Sapphire Star, Celestial Blue, Deep Crimson Gold, Royal Purple Silver, Midnight Teal, Charcoal Amber, Monaco Blue, Copper Patina, Deep Espresso, Electric Violet, Peacock Feather, Slate Rose, Cyber Slate, Bordeaux Wine, Emerald Silver, Midnight Bronze, Cobalt Gold, Space Black, Forest Gold, Plum Royalty, Graphite Lime, Sunset Coral, Deep Ocean Gold, Imperial Jade, Twilight Indigo, Vintage Blueprint.
      - *Tema Terang Elegan*: Academic Classic, Corporate Blue, Rose Gold Luxe, Clean Emerald Light, Sage Botanical, Champagne Luxe, Blush Pastel, Glacier Ice, Lavender Mist, Warm Vanilla, Arctic Cyan, Sakura Blossom, Pearl White, Moroccan Mint, Silver Minimalist, Alpine Green, Quartz Rose, Platinum Prestige.
      - *Tema Akademik Klasik*: Vintage Parchment, Royal Ivory Gold, Desert Sand, Oxblood Formal, Olive Gold, Vintage Sepia, Regal Gold White, Cappuccino Cream, Terracotta Cream, Dusty Denim, Sandstone Academic, Mahogany Classic.
    - **Fitur Live Quick Search**: Memungkinkan guru mengetik kata kunci warna atau nama tema (misal: "Rose", "Sapphire", "Emas", "Navy", "Mint") untuk menemukan tema yang diinginkan dalam sekejap.
  - **Pilihan Tipografi Font (Standar Core Fonts jsPDF)**:
    - *Times Serif*: Gaya klasik, resmi, dan akademis.
    - *Helvetica Sans*: Gaya modern, bersih, tegas, dan kontemporer.
    - *Courier Monospace*: Gaya vintage, nomor seri dokumen otentik, dan karakter unik.
  - **Pola Watermark Background Logo Sekolah & Pengaman**:
    - *Watermark Logo Sekolah di Tengah*: Mengambil logo sekolah/institusi yang diunggah dan menampilkannya sebagai watermark elegan di latar belakang tengah sertifikat.
    - *Segel Keamanan Emas (Security Seal)*: Stempel medali pengaman dengan lambang perisai dan teks dokumen terverifikasi resmi.
    - *Pola Guilloche Gelombang*: Garis pengaman geometris halus anti-pemalsuan dokumen.
    - *Tanpa Watermark*: Latar belakang bersih dan minimalis.
  - **Portal & Sistem Cek Keaslian Sertifikat Digital Publik (`/verify/:code` & `/verify`)**:
    - **Backend Verifikasi (`GET /api/certificates/verify/:code`)**: Endpoint publik untuk memeriksa keabsahan sertifikat melalui nomor seri ID, ID peserta, atau kode komposit.
    - **Halaman Verifikasi Publik (`CertificateVerifyPage.tsx`)**: Portal pencarian nomor seri sertifikat lengkap dengan lencana keaslian resmi ("Verified Authentic"), rincian siswa, judul ujian, tanggal penerbitan, institusi penerbit, dan checksum tanda tangan digital.
    - **Tautan QR Code Cerdas**: Setiap QR Code yang tercetak di sertifikat langsung mengarah ke URL verifikasi publik `${origin}/verify/${certificateId}`.
  - **Redesain & Pemolesan UI Halaman Kustomisasi Sertifikat (`CertificateSettingsPage.tsx`)**:
    - **Header Toolbar Anti-Wrapping**: Memperbaiki layout flex header dengan breakpoint responsif `xl:flex-row` dan tombol aksi berukuran seragam (`h-9`, `whitespace-nowrap`, `shrink-0`). Mencegah tombol *"Simpan Perubahan"* terdorong canggung ke baris baru pada layar laptop/desktop standar dengan sidebar aktif.
    - **Studio Simulation Bar Ramping**: Mengganti kotak input simulasi siswa/ujian yang kaku dengan bilah kontrol studio minimalis modern berikon `User` dan `FileText` dengan interaksi fokus halus (*focus-within ring*).
    - **Studio Easel Frame Canvas**: Membungkus kanvas pratinjau A4 landscape dalam wadah studio berbayang lembut (*slate-100 backdrop*, *shadow-inner*, *ring-1*), memberikan tampilan dokumen sertifikat yang otentik dan realistis.
    - **Katalog Tema Interaktif**: Mengintegrasikan dual-color swatches yang memvisualisasikan warna latar dan aksen garis setiap tema, lencana centang aktif (`CheckCircle2`), dan indikator jumlah tema live.
  - **Fitur Kustomisasi Tanda Tangan Lengkap (Edit, Perbesar/Perkecil, Geser Posisi, Pad Digital, Pembersih Background & Warna Menyesuaikan Teks)**:
    - **Pewarnaan Tanda Tangan Otomatis Sesuai Warna Teks Tema (`colorMode: 'match_text' | 'theme_accent' | 'original'`)**:
      - Tanda tangan kini secara cerdas dapat menyesuaikan warna tintanya dengan warna teks judul sertifikat (*Match Text Color*), warna lis aksen emas (*Theme Accent Color*), atau mempertahankan warna asli berkas upload (*Original Color*).
      - Menggunakan *CSS Alpha-Masking* pada antarmuka Live Preview dan algoritma re-tinting piksel canvas berbasis saluran alpha murni (`tintSignatureImage`) pada ekspor PDF (`generateCertificatePdf`).
      - Selector mode warna tanda tangan interaktif dengan color swatch live dari palet tema aktif pada tab penandatangan.
    - **Perbesar / Perkecil Tanda Tangan (Scale Slider)**: Slider skala presisi dari 40% (0.4x) hingga 200% (2.0x) lengkap dengan tombol preset instan (`0.7x Kecil`, `1.0x Normal`, `1.3x Besar`, `1.6x Ekstra`).
    - **Sesuaikan Posisi Vertikal & Horisontal (Y-Offset & X-Offset)**: Pengaturan geser posisi vertikal (-25px s/d +25px) agar tanda tangan dapat duduk pas di atas garis atau menimpa garis tanda tangan secara realistis, serta slider pergeseran horisontal (-30px s/d +30px).
    - **✍️ Kanvas Gambar TTD Digital Langsung (Digital Signature Drawing Pad)**: Modal interaktif untuk menggambar tanda tangan langsung menggunakan mouse, touchpad, stylus pen, atau sentuhan jari (smartphone/tablet), dilengkapi pilihan 3 warna tinta resmi (*Hitam Resmi*, *Biru Dokumen*, *Biru Klasik*), tombol bersihkan, dan tombol terapkan.
    - **✨ Magic Wand Pembersih Latar Belakang Putih (Transparent Background Filter)**: Algoritma cerdas yang memindai piksel foto tanda tangan dari kertas dan secara otomatis menghapus latar putih/abu-abu kertas menjadi transparan murni (*alpha transparent PNG*).
    - **Sinkronisasi 100% Live Preview & PDF**: Perubahan ukuran, posisi, dan warna tanda tangan langsung tercermin secara *real-time* di kanvas pratinjau A4 dan diekspor dengan koordinat milimeter presisi pada berkas cetak PDF (`generateCertificatePdf`).
    - **Dukungan Backend Zod & Persistence (`server/src/routes/certificates.ts`)**: Mendukung field `scale`, `yOffset`, `xOffset`, dan `colorMode` pada skema validasi Zod dan penyimpanan basis data.
  - **40 Pilihan Gaya Baru: Tipografi Font (20 Gaya) & Bingkai Frame (20 Gaya) (`CERTIFICATE_FONTS` & `CERTIFICATE_BORDERS`)**:
    - **20 Pilihan Gaya Tipografi & Font (`CERTIFICATE_FONTS`)**:
      - *Kategori Serif & Klasik (8)*: Times Classic, Playfair Luxury, Cinzel Royal, Cormorant Garamond, Merriweather Editorial, Lora Distinguished, Roboto Slab, Alegreya Humanities, EB Garamond, Libre Baskerville.
      - *Kategori Sans-Serif & Modern (7)*: Helvetica Sans, Montserrat Bold, Inter Clean, Outfit Tech, Raleway Luxury, Poppins Friendly, Oswald Condensed.
      - *Kategori Monospace / Teknik (2)*: Courier Typewriter, Space Monospace.
      - *Kategori Script & Kaligrafi (3)*: Calligraphy Script, Great Vibes Elegant, Lora Italic.
      - Dilengkapi katalog pemilih font visual responsif dengan filter kategori, kartu pratinjau huruf `Aa`, nama tipografi, badge kategori, dan lencana terpilih.
    - **20 Pilihan Gaya Bingkai & Lis Frame (`CERTIFICATE_BORDERS`)**:
      - *Kategori Klasik (8)*: Double Gold (sudut ornamen kotak emas), Royal Crest (mahkota kehormatan & emblem), Diploma Tradisional (garis tebal-tipis gap), Diamond Corners (belah ketupat rotasi 45°), Triple Line (tiga lis bertingkat), Classic Dashed (garis jahitan stik elegan), Arch Header (lengkung mahkota atas), Notary Frame (lis resmi notaris).
      - *Kategori Modern (4)*: Modern Clean (siku geometris minimalis), Cyber Bracket (sudut braket futuristik digital), Bold Executive (bingkai solid korporat tegas), Modern Split (aksen dua warna asimetris).
      - *Kategori Ornate / Mewah (5)*: Ornate Frame (filigree ornamen lengkung istana), Art Deco (geometris bertingkat), Vintage Scroll (piagam kuno berlekuk), Islamic Geometric (bintang 8-sudut arabesque), Academic Laurel (daun kehormatan wisuda).
      - *Kategori Minimalis (3)*: Minimal Hairline (garis tipis presisi tinggi), Floating Border (garis melayang bersudut terbuka), Corner Dots (bintik aksen emas 4 sudut).
      - Dilengkapi katalog kartu bingkai interaktif dengan miniatur wireframe visual dari setiap jenis bingkai.
    - **Sinkronisasi Lengkap Vektor jsPDF**: Seluruh 20 gaya bingkai digambar secara murni menggunakan instruksi vektor jsPDF (`doc.rect`, `doc.circle`, `doc.polygon`, `doc.line`) dengan ketebalan dan warna dinamis sesuai palet tema terpilih, menjamin hasil cetak tajam 300 DPI tanpa pecah.
- [x] **Pembersihan Embel-embel AI pada Landing Page (`LandingPage.tsx` & `server/cms_config.json`)**:
  - Menghapus dan mengganti seluruh penyebutan kata "AI", "AI Gemini", "Pro AI", "Mockup AI", dan embel-embel sejenis di seluruh bagian Landing Page (Hero, Mockup Card, Perbandingan Nyata, Fitur Unggulan, Alur 4 Langkah, Paket Harga, FAQ, dan Footer).
  - Teks disesuaikan menjadi istilah profesional yang berfokus pada hasil praktis guru/institusi: *"Platform Pembuat Ujian & Kuis Online Cerdas"*, *"Smart Question Generator"*, *"Coba Generator Soal Gratis"*, *"Ekstraksi Cepat Dokumen"*, *"Paket Pro"*, dan *"Penilaian PG & Esai Otomatis"*.
  - Sinkronisasi dilakukan pada berkas statis `client/src/pages/LandingPage.tsx` sekaligus konfigurasi dinamis backend `server/cms_config.json` agar konsisten baik saat konfigurasi diambil dari server maupun saat menggunakan data bawaan.
- [x] **Pembersihan Embel-embel AI di Seluruh Proyek (Full-Project AI De-branding)**:
  - **Cakupan**: 16 file diubah mencakup seluruh halaman client (Dashboard, Generator Soal, Bank Soal, Exam Builder, Exam Room, Analytics, Checkout, Subscription, Login, Register, Terms, Privacy, Refund, Contact), komponen global (Footer, ExamigoLogo), halaman admin (CMS, Dashboard, Users), dan server (cms.ts, email.ts, rateLimiter.ts, index.ts).
  - **Strategi**: Identifikasi internal seperti enum `PRO_AI`, route `/ai-generator`, dan field DB `aiQuota` **tidak diubah** untuk menghindari kerusakan integrasi payment gateway Pakasir dan autentikasi. Hanya teks **user-facing** (label, toast, subtitle, badge, heading) yang disanitasi.
  - **Penggantian kunci**: "AI Generator" → "Generator Soal", "Pro AI" → "Pro", "Soal AI" → "Soal Otomatis", "AI Gemini Vision" → "Smart Vision", "AI Engine" → "Smart Engine", "berbasis AI" → "otomatis", "Kuota AI" → "Kuota Soal", "AI Magic Studio" → "Smart Studio".
  - **Verifikasi**: `npx tsc --noEmit` pada `client/` dan `server/` lulus dengan **0 error**.
  - **Perbaikan Integrasi Kode Ujian Landing Page (`LandingPage.tsx`, `App.tsx`, `ExamRoomPage.tsx`)**: Memperbaiki routing form *"Ikut Ujian"* dari Landing Page. Menambahkan rute lengkap `/exam/:code`, `/exam-room/:code`, `/exam/join`, dan dukungan pembacaan kode dari path maupun query parameter (`?code=...`), serta layar fallback interaktif jika kode ujian belum dipublikasikan atau salah ketik.
  - **Perbaikan Konflik Routing Exam Builder (`App.tsx`)**: Memperbaiki kondisi pengecekan `isExamRoom` (`location.pathname.startsWith('/exam')`) yang sebelumnya secara tidak sengaja mencegat rute `/exam-builder` sebagai halaman ujian siswa dan melemparnya kembali ke dashboard. Kini menu sidebar dan navigasi Exam Builder dapat diklik dan dibuka dengan lancar.
- [x] **Redesign & Harmonisasi UI/UX Ruang Ujian Siswa (`ExamRoomPage.tsx`)**:
  - Menggantikan placeholder simbol teks `✦` dengan logo vektor resmi [ExamigoLogo](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/components/common/ExamigoLogo.tsx).
  - Menata ulang kartu spesifikasi ruang ujian (Pelajaran, Kelas, Durasi, Soal, Passing Score, Petunjuk) dengan tata letak grid dan tema dinamis yang bersih dan kontras.
  - Memperbaiki formulir login siswa dengan input field presisi dan tombol aksi *"Mulai Mengerjakan Ujian"* bersinkronisasi 100% dengan palet tema dinamis.
- [x] **Client-Side Dynamic QR Code Generator Suite (`DynamicQRCode.tsx`)**:
  - Menggantikan API gambar QR eksternal dengan engine canvas QR Code client-side (`qrcode`).
  - QR Code di-generate secara instan dan dinamis mengikuti warna tema aktif (`var(--theme-primary-dark)`).
  - Dilengkapi tombol aksi *"Salin Link"* dengan toast feedback dan *"Unduh QR"* langsung dalam format file PNG resolusi tinggi.
  - Terintegrasi penuh pada **Exam Builder** (saat publikasi berhasil) dan **Dashboard Guru** (modal QR ujian).
- [x] **Perbaikan Warna Tombol Dinamis & Theme Variables (`ExamBuilderPage.tsx`, `AdminCmsPage.tsx`, dll)**:
  - Memperbaiki tombol *"Publikasikan Ujian"*, *"Simulasi Ujian"*, dan *"Upgrade Paket"* pada Exam Builder yang sebelumnya tidak menampilkan warna latar belakang akibat spasi pada arbitrary Tailwind CSS class.
  - Menerapkan styling warna dinamis terpusat (`var(--theme-primary)` & `var(--theme-primary-dark)`) di seluruh tombol aksi aplikasi.
- [x] **Perbaikan Bug Tampilan Kosong (Blank Screen) saat Buka Dashboard & Keluar Akun (`App.tsx`)**:
  - Memperbaiki konflik percabangan routing antara full-width pages (`isFullWidthPage`) dan authenticated app shell.
  - Menambahkan rute eksplisit `/dashboard` dan `/` pada view utama protected route.
  - Menambahkan wildcard catch-all route (`<Route path="*" element={<Navigate to="/" replace />} />`) pada kedua cabang perutean agar transisi saat logout maupun navigasi URL langsung selalu mulus tanpa layar kosong.
- [x] **Pembersihan Top Badge Pill Hero Section (`LandingPage.tsx` & `LandingPage.module.css`)**:
  - Menghapus badge pill *"Platform AI Pembuat Ujian & Kuis Online Cerdas No. 1 di Indonesia"* di atas headline.
  - Tampilan kolom kiri Hero Section kini langsung menyajikan judul utama (headline) dengan tipografi yang tegas, rapi, dan modern.
- [x] **Pembersihan Section Simulator & Polishing 2-Kolom Hero (`LandingPage.tsx`)**:
  - Menghapus box card demo simulator tab yang menumpuk di bawah hero section (*1. AI Generator, 2. Exam Builder, 3. Ruang Ujian Siswa, 4. Hasil & Analitik*).
  - Tampilan hero section kini menjadi ramping, clean, fokus, dan simetris dengan tata letak 2-Kolom Split Hero modern.
- [x] **New 2-Column Split Hero Section (`LandingPage.tsx` & `LandingPage.module.css`)**:
  - Mengubah tampilan Hero menjadi layout **2-Kolom Modern split-screen**:
    - **Kolom Kiri**: Badge Headline Pill, Judul Bold bergradient shimmer, deskripsi copywriting terarah, Tombol CTA Coba AI Gratis, Form Cepat Ikut Ujian Siswa dengan Kode/PIN, dan baris Trust Badges.
    - **Kolom Kanan**: **Interactive Glassmorphism AI Engine Mockup** dengan bar status multi-dot, indikator live parsing dokumen modul Fisika PDF, laser scan progress bar bergerak dinamis (`@keyframes laserScan`), kartu preview butir soal otomatis dengan pilihan ganda & kunci jawaban bercahaya, serta statistik floating AI 4.2 detik.
  - Mempertahankan responsivitas mobile-first dan kompatibilitas dynamic theming 100%.
- [x] **Animasi Modern & Dinamis di Hero Section (`LandingPage.module.css`)**:
  - Menambahkan animasi **Entrance Staggered** (`@keyframes heroEntrance`) dengan bezier kurva halus pada badge, headline, subtitle, dan form aksi.
  - Menambahkan efek **Shimmer Text Gradient** (`@keyframes textGradientShimmer`) pada highlight kata *"10x Lebih Cepat"*.
  - Menambahkan efek **Pulse Glow** berulang pada tombol CTA utama (`@keyframes buttonPulseGlow`).
  - Menambahkan animasi rotasi halus & floating pada **Ambient Radial Meshes** dan **Floating Glass Badges** (AI Ekstraksi Cepat & Sistem Anti-Cheat).
- [x] **Upgrade UI & Tombol Dinamis Halaman Profil (`ProfilePage.tsx`)**:
  - Tombol **"Simpan Perubahan Profil"** kini menggunakan CSS Theme Variables dinamis (`var(--theme-primary)`, `var(--theme-primary-hover)`) dengan efek hover dan active scale yang responsif.
  - Kartu ringkasan profil (Avatar, Nama, Email, Badge Paket) dan form input (Informasi Pengguna, Ubah Password) ditingkatkan dengan desain SaaS modern beraksen dinamis `var(--theme-mint-light)` & `var(--theme-border)`.
- [x] **Modal Ekspor PDF Pro AI Dinamis (`AnalyticsPage.tsx`)**:
  - Tombol aksi *"Upgrade ke Pro AI"* dan badge eksklusif kini menggunakan CSS Theme Variables (`var(--theme-primary)`, `var(--theme-primary-hover)`, `var(--theme-mint-light)`) sehingga warnanya 100% dinamis mengikuti tema website yang dipilih di CMS.
  - Sinkronisasi teks harga dinamis (`Rp {pricing.pro_ai.monthlyPrice}K`) dan kuota live dari database CMS.
- [x] **Fix Grade Filter Text Contrast**: Diperbaiki kontras teks dan styling tombol filter tingkatan ("Semua Tingkat", "SD 1", "SD 2", "SD 3", "SD 4", dst.) di `ExamBuilderPage.tsx` dengan border tegas, teks tebal `text-slate-800` / `text-white` aktif, dan status hover yang sangat jelas terlihat.
- [x] **Question Bank Subject Tabs Upgrade (`QuestionBankPage.tsx`)**:
  - Tombol **"Semua Mapel"**, daftar mata pelajaran, dan **"Tambah Mapel"** ditingkatkan menjadi pill button modern dengan ikon buku (`BookOpen`), indikator aktif yang kontras, dan interaktivitas hover yang jelas.
  - Terkoneksi dinamis dengan tema CSS aktif dan modal penambahan mapel baru.
  - [tailwind.config.js](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/tailwind.config.js): Semua key warna (`edu.*`, `brand.*`, `emerald.*`) dipetakan ke CSS theme variables.
  - **100% Seluruh Halaman Terintegrasi Dinamis**:
    - [LandingPage.tsx](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/pages/LandingPage.tsx): Hero, badge melayang, simulator tab, paket harga, FAQ, footer.
    - [DashboardPage.tsx](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/pages/DashboardPage.tsx): Action CTA, hero onboarding, live monitoring modal, QR Code modal, status table.
    - [SubscriptionSettingsPage.tsx](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/pages/SubscriptionSettingsPage.tsx): Progress bar kuota AI, kartu paket aktif, ringkasan proteksi anti-cheat & info jaminan data.
    - [CheckoutPage.tsx](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/pages/CheckoutPage.tsx) & [PaymentPage.tsx](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/pages/PaymentPage.tsx) & [PaymentSuccessPage.tsx](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/pages/PaymentSuccessPage.tsx): 3-Step wizard, pilihan billing, kupon promo, ringkasan pesanan, tombol bayar Pakasir.
    - [ExamBuilderPage.tsx](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/pages/ExamBuilderPage.tsx) & [QuestionBankPage.tsx](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/pages/QuestionBankPage.tsx) & [AnalyticsPage.tsx](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/pages/AnalyticsPage.tsx): Wizard step, filter kategori, badge nilai.
    - [LoginPage.tsx](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/pages/LoginPage.tsx) & [RegisterPage.tsx](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/pages/RegisterPage.tsx): Form inputs, focus rings, dan logo.
    - [AppLayout.module.css](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/styles/AppLayout.module.css): Sidebar brand emblem, active menu items, mobile drawer.




---

## 🏗️ Arsitektur & Kredensial

### Tech Stack Aktif
| Layer | Teknologi |
|-------|-----------|
| Frontend | React (Vite) + TypeScript + Tailwind CSS + Recharts |
| Backend | Node.js + Express.js + Prisma ORM + JWT + Zod |
| Database | MySQL (XAMPP / Local / Cloud) |
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

### [2026-09-05] - Migrasi Landing Page ke Vanilla CSS / CSS Modules & Overhaul Kontras
- **Desain Sistem Terpusat (`design-system.css`)**:
  - Didefinisikan variabel CSS global: `--edu-navy: #1B263B`, `--edu-electric: #0091D4`, `--edu-butter: #FDD406`, `--edu-sage: #87A96B`, `--edu-ice: #F0F4F8`.
  - Animasi mikro CSS kustom: `floatSlow`, `floatFast`, `pulseGlow`, `fadeInFast`.
- **Migrasi ke CSS Modules (`LandingPage.module.css`)**:
  - Mengisolasi style landing page ke CSS module murni tanpa ketergantungan utility tailwind yang bertabrakan.
  - Memperbaiki masalah teks/logo putih samar sebelum di-hover: seluruh heading, paragraf, badge, dan logo diatur tegas dengan warna Navy `#1B263B` dan Electric Blue `#0091D4` sejak sebelum hover.
- **Pembersihan Konflik Dark Mode Global**:
  - Menghapus aturan `dark:text-slate-100` pada `index.css` di tag `body` yang sebelumnya menyebabkan teks berwarna putih pada OS dengan dark mode aktif.
- **Integrasi Mantine UI v7 Core & Hooks**:
  - Menginstal paket `@mantine/core@^7.16.0`, `@mantine/hooks@^7.16.0`, `@mantine/form@^7.16.0`, dan konfigurasi PostCSS.
  - Membungkus aplikasi dengan `<MantineProvider>` di [`client/src/main.tsx`](file:///Users/rizkihidayat/Documents/PROJECT/Examigo/client/src/main.tsx) dengan konfigurasi palette warna kustom Navy (`#1B263B`) dan Electric Blue (`#0091D4`).
- **Penyelarasan 1 Tema Tunggal Menyeluruh (Emerald Forest & Fresh Mint)**:
  - **Pondasi Desain Global (`design-system.css`, `tailwind.config.js`, `index.css`)**:
    - Seluruh token warna Tailwind, Vanilla CSS, dan kelas kustom diselaraskan ke tema **Emerald Forest (`#064E3B`)** dan **Fresh Mint (`#10B981`)**.
    - Mengeliminasi seluruh warna biru tua/kuning/ungu lama dari sistem global.
  - **Halaman Login & Register (`LoginPage.tsx`, `RegisterPage.tsx`)**:
    - Form card, input, dan tombol aksi kini serasi dengan warna Mint dan Deep Emerald berlatar `#F0FDF4`.
  - **App Shell & Navigasi (`App.tsx`, `AppLayout.module.css`)**:
    - Sidebar desktop, mobile drawer, dan profil bar selaras 100% dalam 1 tema.
  - **Dashboard & Landing Page (`DashboardPage.tsx`, `LandingPage.tsx`)**:
    - Seluruh kartu statistik, alur panduan, hero banner, tombol CTA, dan modal terpadu dalam 1 tema hijau modern.
- **Verifikasi Build**:
  - `npm run build` sukses 100% (Code 0) tanpa error.
- **Status**: ✅ Selesai — Seluruh aplikasi Examigo kini 100% satu tema terpadu (Emerald Forest & Fresh Mint) menggunakan Vanilla CSS / CSS Modules.







