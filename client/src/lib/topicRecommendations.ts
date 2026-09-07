import { GRADE_TOPICS_DB } from './gradeTopics';
import { JenjangType, getJenjangFromGrade, getGradeNumber } from './constants';

export type DifficultyType = 'EASY' | 'MEDIUM' | 'HARD';

export interface TopicRecommendation {
  label: string;
  prompt: string;
  difficulty?: DifficultyType;
}

export type SubjectDifficultyMap = Record<DifficultyType, TopicRecommendation[]>;

export const SD_FASE_A_SUBJECT_TOPICS: Record<string, SubjectDifficultyMap> = {
  "matematika": {
    "EASY": [
      {
        "label": "Mengenal Bilangan 1-10 & Benda Bergambar",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang mengenal lambang bilangan 1 sampai 10 dan menghitung banyak buah atau pensil bergambar",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Bilangan 11-20 & Benda Konkret",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang mengenal bilangan 11 sampai 20 dan mencocokkan jumlah benda konkret",
        "difficulty": "EASY"
      },
      {
        "label": "Penjumlahan Bilangan 1-10 dengan Buah Bergambar",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang penjumlahan sederhana 1 sampai 10 menggunakan bantuan gambar buah atau kue",
        "difficulty": "EASY"
      },
      {
        "label": "Pengurangan Bilangan 1-10 Sisa Benda",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang pengurangan sederhana 1 sampai 10 (benda yang dimakan atau diambil)",
        "difficulty": "EASY"
      },
      {
        "label": "Membandingkan Banyak Benda (Lebih / Kurang)",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang membandingkan dua kelompok benda menggunakan kata lebih banyak, lebih sedikit, atau sama dengan",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Bangun Segitiga, Segiempat, Lingkaran",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang menyebutkan nama bangun datar sederhana (lingkaran, segitiga, segiempat) pada benda di kelas",
        "difficulty": "EASY"
      },
      {
        "label": "Mengurutkan Bilangan 1-20 Terkecil ke Terbesar",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang menyusun urutan bilangan 1 sampai 20 dari yang paling kecil atau paling besar",
        "difficulty": "EASY"
      },
      {
        "label": "Melanjutkan Pola Warna & Bentuk Sederhana",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang melanjutkan pola warna atau bentuk geometri sederhana yang berulang (merah-kuning-merah...)",
        "difficulty": "EASY"
      },
      {
        "label": "Mengukur Panjang dengan Jengkal / Korek Api",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang mengukur panjang pensil atau meja menggunakan satuan tidak baku (jengkal, korek api)",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Waktu Pagi, Siang, dan Malam Hari",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang membedakan waktu pagi, siang, dan malam serta kegiatan yang dilakukan (sarapan, tidur)",
        "difficulty": "EASY"
      },
      {
        "label": "Mengelompokkan Benda Ukuran Besar dan Kecil",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang membedakan benda berukuran besar, sedang, dan kecil di sekitar lingkungan bermain",
        "difficulty": "EASY"
      },
      {
        "label": "Membaca Jam Analog Tepat Waktu (Pukul 07.00)",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang membaca posisi jarum jam pendek dan panjang pada jam dinding tepat waktu",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Penjumlahan Bilangan sampai 20 Soal Cerita",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang menyelesaikan soal cerita penjumlahan bilangan 1 sampai 20 dalam kehidupan sehari-hari",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pengurangan Bilangan sampai 20 Sisa Benda",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang menyelesaikan soal cerita pengurangan bilangan sampai 20 yang mudah dipahami anak",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menentukan Nilai Tempat Puluhan dan Satuan",
        "prompt": "Buatkan soal Matematika Kelas 1-2 SD tentang menentukan angka puluhan dan angka satuan pada bilangan belasan dan puluhan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pola Barisan Bilangan Loncat 2 dan Loncat 5",
        "prompt": "Buatkan soal Matematika Kelas 1-2 SD tentang melanjutkan pola barisan bilangan loncat dua (2, 4, 6, ...) atau loncat lima",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghitung Uang Logam Rp 500 dan Rp 1.000",
        "prompt": "Buatkan soal Matematika Kelas 1-2 SD tentang menghitung jumlah koin uang logam Rp 500 dan Rp 1.000 untuk membeli jajanan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghitung Selisih Banyak Benda Nyata",
        "prompt": "Buatkan soal Matematika Kelas 1-2 SD tentang menghitung selisih jumlah kelereng atau buku antara dua orang anak",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghubungkan Bentuk Bangun Datar Benda Rumah",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang menentukan bentuk permukaan jam dinding (lingkaran), pintu (persegi panjang), atau atap rumah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membandingkan Berat (Lebih Berat / Ringan)",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang membandingkan berat dua benda menggunakan timbangan jungkat-jungkit sederhana",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghitung Banyak Sisi dan Pojok Bangun Datar",
        "prompt": "Buatkan soal Matematika Kelas 1-2 SD tentang menghitung jumlah garis sisi dan pojok (sudut) pada segitiga dan segiempat",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menentukan Urutan Hari dalam Seminggu",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang menentukan nama hari sebelum dan sesudah suatu hari (kemarin, besok, lusa)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Operasi Hitung Campuran Sederhana Bilangan 1-20",
        "prompt": "Buatkan soal Matematika Kelas 1-2 SD tentang menyelesaikan hitung campuran sederhana (contoh: 8 + 5 - 3) pada soal cerita buah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membaca Diagram Gambar Buah Kesukaan",
        "prompt": "Buatkan soal Matematika Kelas 1-2 SD tentang membaca jumlah data buah kesukaan teman dari tabel gambar 1 gambar mewakili 1 benda",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Pemecahan Masalah Dua Langkah Tambah-Kurang",
        "prompt": "Buatkan soal Matematika Kelas 1-2 SD tentang cerita dua langkah: membeli buah lalu membagikan sebagian ke adik",
        "difficulty": "HARD"
      },
      {
        "label": "Menemukan Angka Hilang pada Barisan Loncat",
        "prompt": "Buatkan soal Matematika Kelas 1-2 SD tentang menganalisis dan menemukan dua angka yang hilang pada barisan bilangan loncat",
        "difficulty": "HARD"
      },
      {
        "label": "Perhitungan Uang Belanja & Kembalian Kecil",
        "prompt": "Buatkan soal Matematika Kelas 1-2 SD tentang menghitung sisa kembalian uang saku saat membeli pensil dan penghapus di kantin",
        "difficulty": "HARD"
      },
      {
        "label": "Logika Perbandingan Tiga Benda Terpanjang",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang menyimpulkan benda yang paling panjang atau paling berat dari perbandingan 3 benda",
        "difficulty": "HARD"
      },
      {
        "label": "Penguraian Pasangan Angka Bilangan 10-20",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang menguraikan suatu angka (misal angka 10) menjadi pasangan penjumlahan berbeda",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Bentuk yang Polanya Berbeda",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang menganalisis sekelompok bentuk dan menemukan satu bangun yang polanya berbeda",
        "difficulty": "HARD"
      },
      {
        "label": "Menyimpulkan Waktu Tempuh Belajar Jam Analog",
        "prompt": "Buatkan soal Matematika Kelas 1-2 SD tentang menentukan jam selesai belajar jika mulai pukul 08.00 selama 2 jam",
        "difficulty": "HARD"
      },
      {
        "label": "Menentukan Urutan Posisi Antrean Siswa",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang menentukan urutan ke berapa seorang anak dalam antrean cuci tangan (ke-1 sampai ke-10)",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Selisih Terbanyak pada Piktogram",
        "prompt": "Buatkan soal Matematika Kelas 1-2 SD tentang menyimpulkan data piktogram dan menghitung selisih antara item terbanyak dan tersedikit",
        "difficulty": "HARD"
      },
      {
        "label": "Membentuk Bangun Baru dari Gabungan Segitiga",
        "prompt": "Buatkan soal Matematika Kelas 1-2 SD tentang membayangkan dan menganalisis bentuk yang tercipta jika dua segitiga disatukan",
        "difficulty": "HARD"
      },
      {
        "label": "Memecahkan Teka-teki Angka Misterius Sederhana",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang tebak bilangan: Aku lebih besar dari 12 dan lebih kecil dari 15, aku angka ganjil",
        "difficulty": "HARD"
      },
      {
        "label": "Evaluasi Berat Benda Seimbang pada Timbangan",
        "prompt": "Buatkan soal Matematika Kelas 1 SD tentang menentukan berapa kelereng yang dibutuhkan agar timbangan seimbang dengan 1 apel",
        "difficulty": "HARD"
      }
    ]
  },
  "indonesia": {
    "EASY": [
      {
        "label": "Mengenal Huruf Abjad A-Z Kapital & Kecil",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang mengenal huruf abjad A sampai Z, membedakan huruf besar dan huruf kecil",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Huruf Vokal (a, i, u, e, o)",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang menemukan dan menghitung huruf vokal (a, i, u, e, o) dalam sebuah kata sederhana",
        "difficulty": "EASY"
      },
      {
        "label": "Mengeja Suku Kata Sederhana (ba, bi, bu, be, bo)",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang mengeja suku kata terbuka dua huruf (ba, ca, da, ga, ma, na)",
        "difficulty": "EASY"
      },
      {
        "label": "Kosakata Benda di Dalam Rumah & Ruang Kelas",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang menyebutkan nama benda di kelas (meja, kursi, papan tulis, buku, pensil)",
        "difficulty": "EASY"
      },
      {
        "label": "Melengkapi Kata Rumpang Berdasarkan Gambar",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang melengkapi huruf yang hilang pada nama benda bergambar (contoh: B_K_ -> BUKU)",
        "difficulty": "EASY"
      },
      {
        "label": "Membaca Kalimat Pendek 3-4 Kata",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang memahami makna kalimat pendek sederhana (contoh: 'Ibu memasak sayur bayam')",
        "difficulty": "EASY"
      },
      {
        "label": "Penggunaan Tanda Titik (.) & Huruf Kapital Nama",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang mengenali tanda titik di akhir kalimat dan huruf kapital pada nama orang",
        "difficulty": "EASY"
      },
      {
        "label": "Kata Tanya Sederhana (Apa, Siapa, Di Mana)",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang memilih kata tanya yang tepat (apa untuk benda, siapa untuk orang, di mana untuk tempat)",
        "difficulty": "EASY"
      },
      {
        "label": "Menyimak Cerita Bergambar & Tokoh Utama",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang menyebutkan nama tokoh dan sifat baiknya dari cerita pendek bergambar 2 kalimat",
        "difficulty": "EASY"
      },
      {
        "label": "Ungkapan Sopan: Tolong, Maaf, Terima Kasih",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang menggunakan kata ajaib sopan santun (tolong saat butuh bantuan, maaf saat salah, terima kasih)",
        "difficulty": "EASY"
      },
      {
        "label": "Kosakata Anggota Tubuh Manusia",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang menuliskan kata nama anggota tubuh (mata, telinga, tangan, kaki, hidung)",
        "difficulty": "EASY"
      },
      {
        "label": "Lawan Kata (Antonim) Sederhana: Besar - Kecil",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang lawan kata sederhana sehari-hari (besar-kecil, tinggi-pendek, bersih-kotor)",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Menyusun Kata Acak Menjadi Kalimat Utuh",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang menyusun 3-4 kata yang diacak menjadi kalimat bermakna benar",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengurutkan 3 Gambar Berseri Runtut",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang menentukan urutan nomor cerita yang runtut dari 3 gambar berseri kegiatan harian",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membedakan Kalimat Ajakan (Ayo, Mari) & Larangan",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang membedakan kalimat ajakan yang ramah dan kalimat larangan santun (jangan)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menjawab Pertanyaan Berdasarkan Teks 2 Kalimat",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang membaca bacaan mini 2 kalimat lalu menjawab pertanyaan siapa dan apa",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengenal Kata Kerja Tindakan Sederhana",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang menentukan kata kerja aktivitas (berlari, menyiram, membaca, mencuci)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kalimat Pujian dan Cara Merespons Santun",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang memberikan kalimat pujian kepada teman dan membalas dengan ucapan terima kasih",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menentukan Tanda Tanya (?) pada Kalimat Tanya",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang memilih tanda baca yang tepat: titik (.) atau tanda tanya (?) pada akhir kalimat",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Melengkapi Kalimat Percakapan Rumpang",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang mengisi titik-titik pada dialog sapaan dua orang sahabat di sekolah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membedakan Suara Benda dan Hewan (Tiruan Bunyi)",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang tiruan bunyi hewan dan benda (kucing meong, ayam kukuruyuk, bel kring)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menuliskan Informasi Diri (Nama & Nama Sekolah)",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang penggunaan huruf kapital yang benar saat menulis nama diri dan nama jalan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menemukan Kata Berima Sama pada Lagu Anak",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang menemukan kata yang ujung bunyinya sama pada lirik lagu anak (contoh: rupa-rupa)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengidentifikasi Benda Berdasarkan Ciri-Ciri",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1 SD tentang tebak benda: 'Bentukku bulat, aku dipakai bermain bola kaki, siapakah aku?'",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Menemukan Pesan Moral dari Dongeng Fabel Singkat",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang menyimpulkan pesan kebaikan (sikap jujur/setia kawan) dari cerita fabel kancil & kura-kura",
        "difficulty": "HARD"
      },
      {
        "label": "Menyimpulkan Perasaan Tokoh dalam Cerita Bergambar",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang menganalisis perasaan tokoh (sedih, gembira, bangga) berdasarkan peristiwa cerita",
        "difficulty": "HARD"
      },
      {
        "label": "Menentukan Sebab Akibat Sederhana pada Bacaan",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang menganalisis mengapa Budi sakit gigi (akibat lupa sikat gigi sebelum tidur)",
        "difficulty": "HARD"
      },
      {
        "label": "Mengoreksi Penulisan Huruf Kapital & Tanda Titik",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang menemukan kesalahan penulisan huruf besar dan tanda titik pada sebuah kalimat",
        "difficulty": "HARD"
      },
      {
        "label": "Menentukan Judul yang Paling Tepat untuk Cerita",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang memilih judul yang paling sesuai untuk bacaan cerita 3 kalimat",
        "difficulty": "HARD"
      },
      {
        "label": "Menyusun Cerita Utuh dari 4 Kalimat Acak",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang mengurutkan 4 kalimat peristiwa agar menjadi cerita yang runtut dan logis",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Alasan Mengapa Harus Mengucap Maaf",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang studi kasus: apa yang harus diucapkan jika tidak sengaja menumpahkan air minum teman",
        "difficulty": "HARD"
      },
      {
        "label": "Membedakan Fakta Nyata & Khayalan Dongeng",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang membedakan peristiwa yang nyata terjadi dan khayalan (hewan bisa bicara)",
        "difficulty": "HARD"
      },
      {
        "label": "Menemukan Makna Kata Kiasan Sederhana (Kutu Buku)",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang memahami arti ungkapan ramah anak seperti 'kutu buku' (suka membaca buku)",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Sikap Tokoh yang Patut Dicontoh",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang mengevaluasi perbuatan tokoh dalam cerita yang boleh dan tidak boleh ditiru",
        "difficulty": "HARD"
      },
      {
        "label": "Mengubah Kalimat Berita Menjadi Kalimat Tanya",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang menyusun pertanyaan yang jawabannya sesuai dengan kalimat yang disediakan",
        "difficulty": "HARD"
      },
      {
        "label": "Membuat Kalimat Perpisahan yang Paling Sopan",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 1-2 SD tentang memilih ungkapan pamit yang santun saat hendak pulang dari rumah kakek",
        "difficulty": "HARD"
      }
    ]
  },
  "pancasila": {
    "EASY": [
      {
        "label": "Mengenal Burung Garuda & 5 Simbol Sila",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang mengenal lambang negara Garuda Pancasila dan 5 simbol sila pada perisai",
        "difficulty": "EASY"
      },
      {
        "label": "Simbol Sila Pertama: Bintang Emas & Berdoa",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang lambang Bintang Emas sila pertama dan contoh perilakunya seperti berdoa sebelum makan",
        "difficulty": "EASY"
      },
      {
        "label": "Simbol Sila Kedua: Rantai Emas & Tolong Teman",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang simbol Rantai Emas sila kedua dan contoh sikap saling menolong teman",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Identitas Diri Sendiri & Teman",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang mengenal nama, jenis kelamin, dan ciri fisik diri sendiri dengan percaya diri",
        "difficulty": "EASY"
      },
      {
        "label": "Aturan di Rumah: Bangun Pagi & Merapikan Kamar",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang aturan sehari-hari di rumah seperti merapikan tempat tidur dan meletakkan sepatu",
        "difficulty": "EASY"
      },
      {
        "label": "Aturan di Sekolah: Tertib & Mendengarkan Guru",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang tata tertib di kelas seperti mengangkat tangan sebelum bertanya dan tidak gaduh",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Bendera Merah Putih & Maknanya",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang warna bendera Indonesia (Merah artinya berani, Putih artinya suci)",
        "difficulty": "EASY"
      },
      {
        "label": "Lagu Kebangsaan Indonesia Raya & Sikap Berdiri",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang judul lagu kebangsaan dan sikap siap saat upacara bendera",
        "difficulty": "EASY"
      },
      {
        "label": "Menghargai Perbedaan Ciri Fisik Teman Sekelas",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang menerima perbedaan bentuk rambut (lurus, ikal) dan warna kulit teman dengan rukun",
        "difficulty": "EASY"
      },
      {
        "label": "Sikap Gotong Royong Membersihkan Ruang Kelas",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang contoh kerja sama piket kelas menyapu lantai dan membuang sampah",
        "difficulty": "EASY"
      },
      {
        "label": "Menyayangi Anggota Keluarga di Rumah",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang sikap patuh kepada ayah ibu dan tidak berebut mainan dengan adik",
        "difficulty": "EASY"
      },
      {
        "label": "Semboyan Bhinneka Tunggal Ika Sederhana",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang pita yang dicengkeram burung Garuda dan artinya: berbeda-beda tetapi tetap satu",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Menerapkan Sikap Sopan Santun kepada Guru",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang contoh tindakan mengucapkan salam dan membungkukkan badan saat berpapasan dengan guru",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menganalisis Akibat Melanggar Aturan di Rumah",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang akibat tidur terlalu larut malam (terlambat bangun dan terlambat ke sekolah)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghargai Perbedaan Agama & Ibadah Teman",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang sikap tenang dan tidak mengganggu saat teman yang berbeda agama sedang berdoa",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Contoh Musyawarah Memilih Ketua Kelas",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1-2 SD tentang simbol Pohon Beringin & Kepala Banteng serta contoh musyawarah mufakat di kelas",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Berbagi Makanan & Mainan dengan Saudara",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang penerapan sila kedua saat melihat teman tidak membawa bekal makanan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Melaksanakan Tugas Piket Sesuai Jadwal",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1-2 SD tentang tanggung jawab dan kejujuran melaksanakan tugas piket kebersihan kelas",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menjaga Ketertiban saat Mengantre di Kantin",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang budaya antre yang adil dan tertib saat membeli makanan di kantin sekolah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Memelihara Kebersihan Lingkungan Sekolah",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang perilaku memilah sampah daun dan plastik di tempat sampah sekolah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghormati Teman yang Sedang Berbicara",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang mendengarkan teman yang sedang presentasi atau berbicara di depan kelas",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengakui Kesalahan & Mau Minta Maaf",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang sikap kesatria meminta maaf ketika tidak sengaja menjatuhkan botol minum teman",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Simbol Padi dan Kapas: Keadilan untuk Semua",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1-2 SD tentang makna simbol Padi dan Kapas pada sila kelima (kemakmuran dan keadilan)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membantu Orang Tua Pekerjaan Ringan di Rumah",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang contoh membantu ibu menyiram tanaman atau merapikan piring makan sendiri",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Evaluasi Kasus Menghargai Perbedaan Hobi",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1-2 SD tentang studi kasus: bagaimana menyikapi teman yang memiliki hobi menggambar saat kita suka sepak bola",
        "difficulty": "HARD"
      },
      {
        "label": "Menyelesaikan Perselisihan Antar Teman Secara Damai",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1-2 SD tentang menganalisis cara terbaik menyelesaikan perebutan bola di lapangan bermain tanpa bertengkar",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Manfaat Mematuhi Tata Tertib Sekolah",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang menganalisis mengapa sekolah yang muridnya tertib terasa aman dan nyaman untuk belajar",
        "difficulty": "HARD"
      },
      {
        "label": "Mengambil Keputusan Bersama saat Bermain Kelompok",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1-2 SD tentang bagaimana cara kelompok memutuskan permainan yang adil jika ada perbedaan pilihan",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Nilai Kejujuran Mengembalikan Barang Teman",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang apa yang harus dilakukan ketika menemukan tempat pensil teman yang tertinggal di bawah meja",
        "difficulty": "HARD"
      },
      {
        "label": "Menghubungkan Sila Pancasila dengan Perbuatan Nyata",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1-2 SD tentang mencocokkan tindakan menengok teman sakit dengan sila kedua Pancasila",
        "difficulty": "HARD"
      },
      {
        "label": "Menumbuhkan Rasa Bangga Memakai Produk Indonesia",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1-2 SD tentang mencintai tanah air dengan bangga memakai sepatu atau tas buatan pengrajin Indonesia",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Hak dan Kewajiban Anak di Rumah",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1-2 SD tentang membedakan hak anak (disayangi, diberi makan) dan kewajiban anak (belajar, patuh)",
        "difficulty": "HARD"
      },
      {
        "label": "Memecahkan Masalah Menolak Ajakan Buruk Teman",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1-2 SD tentang cara menolak dengan sopan ajakan teman untuk mencoret-coret dinding sekolah",
        "difficulty": "HARD"
      },
      {
        "label": "Menghubungkan Perilaku Gotong Royong dengan Persatuan",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1-2 SD tentang mengapa pekerjaan berat membersihkan halaman sekolah menjadi cepat selesai jika dikerjakan bersama",
        "difficulty": "HARD"
      },
      {
        "label": "Studi Kasus Bersikap Adil Membagi Kue dengan Saudara",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1 SD tentang bagaimana membagi sepotong kue bolu secara adil bersama adik agar tidak ada yang menangis",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Kepedulian terhadap Korban Bencana Alam",
        "prompt": "Buatkan soal Pendidikan Pancasila Kelas 1-2 SD tentang menyumbangkan baju layak pakai atau buku cerita untuk anak-anak korban bencana",
        "difficulty": "HARD"
      }
    ]
  },
  "ipas": {
    "EASY": [
      {
        "label": "Mengenal Bagian Tubuh Kepala, Tangan, Kaki",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang menyebutkan nama bagian tubuh luar (kepala, mata, telinga, hidung, mulut, tangan, kaki)",
        "difficulty": "EASY"
      },
      {
        "label": "Fungsi 5 Panca Indera Manusia",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang fungsi mata melihat, telinga mendengar, hidung mencium, lidah mengecap, dan kulit meraba",
        "difficulty": "EASY"
      },
      {
        "label": "Cara Merawat Kebersihan Diri & Menggosok Gigi",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang kebiasaan mandi 2 kali sehari, mencuci tangan pakai sabun, dan menggosok gigi sebelum tidur",
        "difficulty": "EASY"
      },
      {
        "label": "Benda Hidup (Makhluk Hidup) & Benda Tak Hidup",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang membedakan benda hidup (tumbuhan, ayam, kucing) dan benda mati (batu, kursi, buku)",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Hewan Peliharaan di Rumah & Suaranya",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang nama hewan peliharaan (kucing, anjing, ikan, kelinci) serta makanan kesukaannya",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Bagian Tumbuhan: Daun, Bunga, Akar",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang bagian luar tumbuhan sederhana (daun hijau, batang pohon, bunga warna-warni)",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Cuaca: Hari Cerah, Berawan, & Hujan",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang ciri-ciri hari cerah (matahari bersinar) dan hari hujan (turun air dari langit, memakai payung)",
        "difficulty": "EASY"
      },
      {
        "label": "Benda Langit: Matahari Siang, Bulan Bintang Malam",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang benda-benda langit yang terlihat di siang hari dan malam hari",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Anggota Keluarga Inti di Rumah",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang sebutan anggota keluarga (ayah, ibu, kakak, adik, kakek, nenek)",
        "difficulty": "EASY"
      },
      {
        "label": "Menjaga Kebersihan Rumah & Tempat Sampah",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang membuang sampah pada tempat sampah dan merapikan mainan setelah selesai bermain",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Makanan Sehat Bergizi (Nasi, Sayur, Buah)",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang contoh makanan sehat untuk pertumbuhan anak (sayur bayam, buah pisang, telur, susu)",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Rasa Makanan: Manis, Asin, Asam, Pahit",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang rasa gula manis, garam asin, jeruk nipis asam, dan obat pahit menggunakan lidah",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Mengelompokkan Hewan Berdasarkan Tempat Hidup",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang mengelompokkan hewan yang hidup di darat (kucing, sapi) dan di air (ikan, lumba-lumba)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kebutuhan Makhluk Hidup: Makan, Air, & Udara",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang apa yang dibutuhkan tanaman dan hewan agar tidak layu atau mati (air, sinar matahari, makanan)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membedakan Benda Kasar dan Benda Halus",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang mengenali permukaan kasar (kulit nanas, batu) dan halus (kain sutra, kaca) menggunakan kulit",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pakaian yang Sesuai dengan Kondisi Cuaca",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang memilih pakaian tipis saat udara panas dan memakai jaket tebal/jas hujan saat musim hujan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Merawat Tanaman Hias dengan Menyiram Air",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang cara merawat tanaman di halaman agar tumbuh subur dan berbunga indah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membedakan Bunyi Keras dan Bunyi Pelan",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang sumber bunyi keras (klakson truk, petir) dan bunyi pelan (bisikan teman, detak jam)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membedakan Sumber Cahaya Alami dan Buatan",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang sumber cahaya alami (matahari, kunang-kunang) dan buatan manusia (lampu, senter, lilin)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kegunaan Benda-Benda di Sekitar Kita",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang fungsi payung melindungi dari hujan dan fungsi kacamata melindungi dari silau matahari",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengidentifikasi Ciri-Ciri Rumah Sehat",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang rumah yang memiliki ventilasi udara cukup, jendela bersih, dan halaman bebas jentik nyamuk",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengenal Perubahan Wujud Es Menjadi Air",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang es batu yang dibiarkan di udara terbuka akan mencair menjadi air",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menjaga Kesehatan Mata saat Membaca Buku",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang posisi duduk tegak dan jarak baca buku yang baik di tempat yang terang",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membedakan Benda Padat dan Benda Cair Sederhana",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang contoh benda padat (batu, kayu) dan benda cair yang mengalir (air, susu, kecap)",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Analisis Manfaat Sinar Matahari bagi Kehidupan",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang menganalisis apa yang terjadi pada tanaman jika disimpan di dalam lemari gelap tanpa sinar matahari",
        "difficulty": "HARD"
      },
      {
        "label": "Menyimpulkan Akibat Lingkungan yang Kotor & Sampah",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang menganalisis timbulnya lalat, nyamuk demam berdarah, dan penyakit diare akibat saluran air tersumbat",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Hewan Berdasarkan Cara Bergeraknya",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang mengelompokkan hewan yang melompat (kelinci, katak), terbang (burung, capung), dan berenang",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Pola Makan Bergizi Seimbang vs Jajanan Manis",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang mengevaluasi efek sering makan permen tanpa makan nasi terhadap kesehatan gigi dan energi tubuh",
        "difficulty": "HARD"
      },
      {
        "label": "Memecahkan Masalah Penghematan Penggunaan Air Bersih",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang cara bijak menghemat air saat menyikat gigi dan mencuci tangan di wastafel sekolah",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Perubahan Panjang Bayangan Matahari",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang mengapa bayangan tubuh kita panjang di pagi hari dan pendek tepat di bawah kaki saat tengah hari",
        "difficulty": "HARD"
      },
      {
        "label": "Menghubungkan Bentuk Paruh Burung & Makanan",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang paruh burung pipit runcing untuk mematuk biji padi dan paruh bebek lebar untuk mencari cacing di lumpur",
        "difficulty": "HARD"
      },
      {
        "label": "Mengidentifikasi Bahaya Benda Tajam di Rumah",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang mengenali benda berbahaya yang tidak boleh dijadikan mainan (pisau dapur, colokan listrik, gunting)",
        "difficulty": "HARD"
      },
      {
        "label": "Membedakan Ciri Anak yang Sehat dan Bugar",
        "prompt": "Buatkan soal IPAS Kelas 1 SD tentang menganalisis tanda-tanda tubuh anak sehat (mata bersinar, lincah bergerak, nafsu makan baik)",
        "difficulty": "HARD"
      },
      {
        "label": "Menjelaskan Mengapa Perlu Tidur Cukup 8-9 Jam",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang mengapa tubuh anak membutuhkan istirahat malam agar otak cerdas dan badan tumbuh tinggi",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Perbedaan Pertumbuhan Anak Kucing",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang melihat tahapan anak kucing yang baru lahir menyusu lalu bertambah besar dan bisa berlari",
        "difficulty": "HARD"
      },
      {
        "label": "Mengapa Tanaman Daunnya Layu saat Musim Kemarau",
        "prompt": "Buatkan soal IPAS Kelas 1-2 SD tentang mengidentifikasi penyebab rumput menjadi kuning dan kering ketika tidak ada hujan",
        "difficulty": "HARD"
      }
    ]
  },
  "inggris": {
    "EASY": [
      {
        "label": "Basic Greetings (Good morning, Hello)",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang salam dasar sehari-hari (Good morning, Good afternoon, Goodbye, Hello)",
        "difficulty": "EASY"
      },
      {
        "label": "English Alphabet Letters & Sounds",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang menyebutkan dan mencocokkan huruf abjad bahasa Inggris A-Z",
        "difficulty": "EASY"
      },
      {
        "label": "Numbers 1 to 10 (One to Ten)",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang menghitung angka 1 sampai 10 (one, two, three, four, five, six, seven, eight, nine, ten)",
        "difficulty": "EASY"
      },
      {
        "label": "Primary Colors: Red, Blue, Yellow, Green",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang menyebutkan warna primer benda (red apple, blue sky, yellow sun, green leaf)",
        "difficulty": "EASY"
      },
      {
        "label": "Cute Animals: Cat, Dog, Bird, Fish",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang nama-nama hewan peliharaan populer dalam bahasa Inggris",
        "difficulty": "EASY"
      },
      {
        "label": "Yummy Fruits: Apple, Banana, Orange",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang nama buah-buahan favorit anak dalam bahasa Inggris",
        "difficulty": "EASY"
      },
      {
        "label": "Classroom Objects: Book, Pencil, Bag",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang benda-benda di dalam tas sekolah (book, pencil, ruler, eraser, bag)",
        "difficulty": "EASY"
      },
      {
        "label": "Parts of the Face: Eyes, Nose, Mouth",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang nama bagian wajah (eyes, ears, nose, mouth) dengan gambar sederhana",
        "difficulty": "EASY"
      },
      {
        "label": "Family Members: Father, Mother, Baby",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang anggota keluarga inti (father, mother, brother, sister, baby)",
        "difficulty": "EASY"
      },
      {
        "label": "Action Verbs: Stand up, Sit down, Walk",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang instruksi gerak kelas (stand up, sit down, listen, open your book)",
        "difficulty": "EASY"
      },
      {
        "label": "Self Introduction: 'My name is...'",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang kalimat perkenalan nama diri dan umur ('What is your name? - My name is Edo')",
        "difficulty": "EASY"
      },
      {
        "label": "Simple Shapes: Circle, Square, Triangle",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang nama bentuk geometri dasar dalam bahasa Inggris",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Numbers 11 to 20 & Simple Counting",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1-2 SD tentang membaca dan menghitung angka 11 sampai 20 (eleven to twenty)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Asking 'What is this?' and 'It is a...'",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang tanya jawab nama benda di ruang kelas menggunakan 'It is a book/pen'",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Matching Animals with Colors (The cat is black)",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang mendeskripsikan warna hewan (contoh: 'The bird is yellow')",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Asking 'How many...?' with Plural -s",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1-2 SD tentang menanyakan jumlah benda (contoh: 'How many pencils? - Three pencils')",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Parts of the Body: Touch your shoulders",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang menghubungkan bagian tubuh dengan instruksi lagu (Head, shoulders, knees, toes)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Expressing Likes: 'I like apples'",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang mengungkapkan makanan/minuman kesukaan menggunakan 'I like milk/apples'",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Polite Expressions: Please and Thank you",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang menggunakan kata sopan 'Please' saat meminta dan 'Thank you' saat diberi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Opposites: Big vs Small, Happy vs Sad",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1-2 SD tentang kata sifat berlawanan sederhana (big elephant, small ant, happy, sad)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Days of the Week: Sunday to Saturday",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1-2 SD tentang menyebutkan nama-nama hari dalam seminggu",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Animal Sounds: 'The dog says woof'",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang menirukan dan mencocokkan suara binatang dalam bahasa Inggris",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Describing Family: 'This is my mother'",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang mengenalkan foto keluarga ('This is my father, he is tall')",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Prepositions of Place: In, On, Under",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1-2 SD tentang posisi benda sederhana (the cat is on the table, the book is in the bag)",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Reading a 2-Sentence Mini Story",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1-2 SD tentang membaca 2 kalimat pendek tentang kelinci putih dan menjawab pertanyaannya",
        "difficulty": "HARD"
      },
      {
        "label": "Identifying the Odd One Out in Word Categories",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang menemukan 1 kata yang bukan bagian dari kelompoknya (contoh: apple, banana, car, mango)",
        "difficulty": "HARD"
      },
      {
        "label": "Completing Simple Missing Letters in Sentences",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang melengkapi huruf rumpang pada kalimat bergambar anak sekolah",
        "difficulty": "HARD"
      },
      {
        "label": "Answering 'How are you?' based on facial expression",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang menyimpulkan ekspresi wajah (smiling = I am happy, crying = I am sad)",
        "difficulty": "HARD"
      },
      {
        "label": "Solving a Simple English Animal Riddle",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1 SD tentang teka-teki hewan: 'I am green. I can jump and swim. Who am I? - Frog'",
        "difficulty": "HARD"
      },
      {
        "label": "Unscrambling 3 Words into a Full English Sentence",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1-2 SD tentang menyusun kata acak (is / cat / This / my) menjadi kalimat utuh yang tepat",
        "difficulty": "HARD"
      },
      {
        "label": "Correcting Capital Letters & Full Stop in English",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1-2 SD tentang menemukan kalimat bahasa Inggris dengan penulisan huruf besar dan titik yang benar",
        "difficulty": "HARD"
      },
      {
        "label": "Distinguishing 'He is...' and 'She is...'",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1-2 SD tentang memilih kata ganti yang benar: 'He' untuk anak laki-laki dan 'She' untuk anak perempuan",
        "difficulty": "HARD"
      },
      {
        "label": "Inferring Action from Classroom Situation",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1-2 SD tentang situasi ketika guru mulai mengajar, apa yang harus dilakukan siswa (Listen carefully)",
        "difficulty": "HARD"
      },
      {
        "label": "Matching Daily Routine with Morning/Night",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1-2 SD tentang menghubungkan waktu (morning / night) dengan kegiatan (eat breakfast / sleep)",
        "difficulty": "HARD"
      },
      {
        "label": "Counting Mixed Objects and Writing in English Words",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1-2 SD tentang menghitung 4 apel dan 3 jeruk lalu menuliskan total dalam kata bahasa Inggris (seven)",
        "difficulty": "HARD"
      },
      {
        "label": "Evaluating Good Habits in Simple English",
        "prompt": "Buatkan soal Bahasa Inggris Kelas 1-2 SD tentang memilih kebiasaan baik: 'Wash your hands before eating'",
        "difficulty": "HARD"
      }
    ]
  },
  "seni": {
    "EASY": [
      {
        "label": "Mengenal Warna Primer: Merah, Kuning, Biru",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang menyebutkan 3 warna pokok (primer): merah, kuning, dan biru",
        "difficulty": "EASY"
      },
      {
        "label": "Macam-Macam Garis: Lurus, Lengkung, Zig-zag",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang mengenal bentuk garis lurus, garis lengkung, garis zig-zag, dan garis gelombang",
        "difficulty": "EASY"
      },
      {
        "label": "Menggambar Bentuk Alam: Matahari, Gunung, Bunga",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang unsur dasar menggambar pemandangan alam sederhana di sekitar rumah",
        "difficulty": "EASY"
      },
      {
        "label": "Kolase Sobekan Kertas Warna & Daun Kering",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang bahan dan cara menempel kertas warna atau daun kering pada pola gambar",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Ketukan Nada Panjang dan Pendek Lagu",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang membedakan bunyi panjang dan bunyi pendek pada lagu anak (contoh: lagu Cicak di Dinding)",
        "difficulty": "EASY"
      },
      {
        "label": "Menyanyikan Lagu Anak Riang Gembira",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang judul lagu anak-anak bertema alam (Pelangi-Pelangi, Balonku, Bintang Kecil)",
        "difficulty": "EASY"
      },
      {
        "label": "Gerak Tari Menirukan Binatang (Kelinci Melompat)",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang gerakan tari menirukan kelinci melompat atau kupu-kupu mengepakkan sayap",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Alat Musik Pukul Sederhana (Rebana, Botol)",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang bunyi alat musik ritmis dipukul seperti rebana, gendang, atau tepukan tangan",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Bahan Alam untuk Prakarya (Biji-Bijian)",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang bahan kerajinan dari alam seperti biji jagung, biji kacang hijau, dan cangkang kerang",
        "difficulty": "EASY"
      },
      {
        "label": "Alat Mewarnai: Krayon, Pensil Warna, Cat Air",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang fungsi krayon dan pensil warna untuk memperindah gambar",
        "difficulty": "EASY"
      },
      {
        "label": "Menjaga Kerapian dan Kebersihan Meja Gambar",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang sikap merapikan kembali alat mewarnai ke dalam kotak setelah selesai berkarya",
        "difficulty": "EASY"
      },
      {
        "label": "Membuat Bentuk Bebas dari Plastisin / Tanah Liat",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang melatih motorik halus meremas dan membentuk plastisin menjadi buah atau hewan",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Memadukan Warna Primer Jadi Warna Sekunder",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang pencampuran warna: merah + kuning = oranye, biru + kuning = hijau",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menentukan Pola Hiasan Bingkai Berulang",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang menghias tepi kertas dengan pola gambar bunga dan daun selang-seling",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membedakan Tempo Lagu Cepat dan Lambat",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang membedakan lagu anak yang dinyanyikan dengan tempo cepat riang vs lambat lembut",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Gerak Tari Menirukan Tumbuhan Ditiup Angin",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang gerakan meliukkan badan ke kanan dan ke kiri menirukan pohon tertiup angin sepoi-sepoi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membuat Cetakan Gambar dari Pelepah Pisang",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang teknik mencetak bentuk bintang menggunakan penampang pelepah pisang dan pewarna",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membedakan Alat Musik Gesek dan Petik",
        "prompt": "Buatkan soal Seni Budaya Kelas 1-2 SD tentang cara membunyikan biola (digesek) dan gitar (dipetik) secara sederhana",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menggunting dan Menempel Pola Kertas Origami",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang kehati-hatian menggunakan gunting saat memotong kertas origami sesuai garis pola",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Ekspresi Wajah saat Menyanyikan Lagu Sedih/Gembira",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang kesesuaian ekspresi senyum saat menyanyi riang dan tenang saat bernyanyi khidmat",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Memanfaatkan Kardus Bekas Menjadi Rumah Mainan",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang mendaur ulang kotak susu atau kardus sepatu bekas menjadi mainan mobil-mobilan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menyelaraskan Tepukan Tangan dengan Irama Lagu",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang bermain musik ritmis tepuk tangan bersama teman satu kelas mengikuti ketukan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengenal Baju Adat Daerah Sederhana",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang mengenal keindahan pakaian adat daerah yang dipakai saat upacara hari Kartini",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghargai Karya Gambar Buatan Teman",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang sikap memuji keindahan lukisan teman tanpa mencela atau menertawakannya",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Menganalisis Perpaduan Warna Kontras pada Lukisan",
        "prompt": "Buatkan soal Seni Budaya Kelas 1-2 SD tentang mengapa warna kuning matahari terlihat menyala indah di atas latar biru langit",
        "difficulty": "HARD"
      },
      {
        "label": "Menyimpulkan Pesan Keindahan dari Lagu Daerah",
        "prompt": "Buatkan soal Seni Budaya Kelas 1-2 SD tentang pesan cinta tanah air dan alam pedesaan dari lirik lagu daerah anak",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Kekompakan Gerak Tari Berpasangan",
        "prompt": "Buatkan soal Seni Budaya Kelas 1-2 SD tentang mengapa dua penari anak harus kompak bergerak seirama dengan musik pengiring",
        "difficulty": "HARD"
      },
      {
        "label": "Mengevaluasi Pemilihan Bahan untuk Kerajinan Tangan",
        "prompt": "Buatkan soal Seni Budaya Kelas 1-2 SD tentang memilih lem yang kuat dan aman untuk menempelkan biji jagung pada karton tebal",
        "difficulty": "HARD"
      },
      {
        "label": "Mengimprovisasi Alat Musik Ritmis dari Benda Dapur",
        "prompt": "Buatkan soal Seni Budaya Kelas 1-2 SD tentang memanfaatkan sendok dan gelas kaca berisi air untuk menghasilkan nada tinggi-rendah",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Proporsi Gambar Bunga dan Vas",
        "prompt": "Buatkan soal Seni Budaya Kelas 1-2 SD tentang meletakkan gambar vas bunga di tengah kertas agar tidak miring atau terlalu kecil",
        "difficulty": "HARD"
      },
      {
        "label": "Menyimpulkan Suasana Hati dari Melodi Lagu",
        "prompt": "Buatkan soal Seni Budaya Kelas 1-2 SD tentang mengidentifikasi apakah sebuah alunan instrumen terasa menenangkan untuk tidur atau mengobarkan semangat",
        "difficulty": "HARD"
      },
      {
        "label": "Mengombinasikan Berbagai Tekstur pada Karya Kolase",
        "prompt": "Buatkan soal Seni Budaya Kelas 1-2 SD tentang menggabungkan kapas halus untuk awan dan ranting kering untuk batang pohon",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Cara Terbaik Menyimpan Karya Gambar Basah",
        "prompt": "Buatkan soal Seni Budaya Kelas 1 SD tentang apa yang harus dilakukan pada kertas lukisan cat air yang masih basah agar tidak robek atau luntur",
        "difficulty": "HARD"
      },
      {
        "label": "Membedakan Topeng Karakter Baik dan Jahat",
        "prompt": "Buatkan soal Seni Budaya Kelas 1-2 SD tentang warna merah dan mata melotot pada topeng raksasa vs warna putih tersenyum pada ksatria",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Makna Gerak Salam Pembuka Tari Tradisional",
        "prompt": "Buatkan soal Seni Budaya Kelas 1-2 SD tentang gerakan menyatukan kedua telapak tangan di depan dada sebagai tanda menghormati penonton",
        "difficulty": "HARD"
      },
      {
        "label": "Memberikan Saran Positif untuk Karya Kerajinan Teman",
        "prompt": "Buatkan soal Seni Budaya Kelas 1-2 SD tentang cara memberikan saran yang baik agar karya lipat origami teman menjadi lebih rapi",
        "difficulty": "HARD"
      }
    ]
  },
  "pjok": {
    "EASY": [
      {
        "label": "Gerak Lokomotor: Berjalan, Berlari, Melompat",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang mengenal gerak berpindah tempat (lokomotor) seperti berjalan lurus, berlari santai, dan melompat",
        "difficulty": "EASY"
      },
      {
        "label": "Gerak Non-Lokomotor: Mengayun Lengan & Membungkuk",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang mengenal gerak tanpa berpindah tempat seperti memutar kepala, mengayun lengan, dan menekuk lutut",
        "difficulty": "EASY"
      },
      {
        "label": "Gerak Manipulatif: Melempar dan Menangkap Bola",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang gerak memakai benda: melempar bola kasti dengan satu tangan dan menangkap bola dengan dua tangan",
        "difficulty": "EASY"
      },
      {
        "label": "Menjaga Keseimbangan: Berdiri Satu Kaki Bangau",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang latihan sikap berdiri dengan satu kaki seperti burung bangau merentangkan kedua tangan",
        "difficulty": "EASY"
      },
      {
        "label": "Pemanasan Sebelum Olahraga Agar Tidak Sakit",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang pentingnya melakukan gerakan peregangan dan pemanasan ringan sebelum mulai berolahraga",
        "difficulty": "EASY"
      },
      {
        "label": "Pendinginan Setelah Olahraga & Mengatur Nafas",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang gerakan pendinginan santai dan menarik nafas panjang setelah selesai berlari",
        "difficulty": "EASY"
      },
      {
        "label": "Pakaian Olahraga yang Nyaman dan Bersih",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang memakai kaos olahraga yang menyerap keringat dan memakai sepatu beralas karet",
        "difficulty": "EASY"
      },
      {
        "label": "Kebiasaan Minum Air Putih Cukup Setelah Olahraga",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang pentingnya minum air putih agar tidak kehausan dan tubuh tetap segar setelah berolahraga",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Bagian Tubuh yang Tidak Boleh Disentuh Orang",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang pendidikan keselamatan diri: bagian tubuh pribadi yang tertutup baju tidak boleh disentuh orang lain",
        "difficulty": "EASY"
      },
      {
        "label": "Cara Mencuci Tangan Bersih 6 Langkah",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang langkah mencuci tangan dengan sabun setelah berolahraga dan sebelum makan",
        "difficulty": "EASY"
      },
      {
        "label": "Senam Irama Sederhana Diiringi Musik Riang",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang melakukan gerakan senam bersama teman mengikuti irama lagu anak ceria",
        "difficulty": "EASY"
      },
      {
        "label": "Berjalan Santai Mengikuti Aba-Aba Guru",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang disiplin berjalan rapi berbaris mengikuti tiupan peluit guru olahraga",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Mempraktikkan Permainan Kucing dan Tikus",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang aturan bermain kucing dan tikus berkelompok melatih kelincahan dan kerja sama",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Berjalan di Atas Garis Lurus Menjaga Keseimbangan",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang teknik melangkahkan kaki satu per satu di atas garis lurus tanpa goyah atau jatuh",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menendang Bola ke Arah Sasaran Gawang Mini",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang posisi kaki saat menendang bola pelan ke arah keranjang atau gawang mini",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membedakan Gerak Cepat Lari dan Gerak Lambat Jalan",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang mengatur kecepatan kaki saat aba-aba jalan pelan dan lari cepat menuju garis finish",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sikap Duduk yang Baik untuk Kesehatan Tulang",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang kebiasaan duduk tegak saat menulis agar tulang punggung tidak bungkuk",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menjaga Keselamatan Diri saat Bermain di Kolam Dangkal",
        "prompt": "Buatkan soal PJOK Kelas 1-2 SD tentang aturan aman bermain di kolam air dangkal didampingi guru dan tidak berlari di lantai licin",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Latihan Menangkap Bola Memantul ke Dinding",
        "prompt": "Buatkan soal PJOK Kelas 1-2 SD tentang koordinasi mata dan tangan menangkap bola karet yang memantul di lantai",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengganti Pakaian Olahraga Basah Keringat",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang mengganti kaos seragam olahraga yang basah dengan baju seragam bersih agar tidak masuk angin",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sikap Sportif Menerima Kekalahan saat Lomba Lari",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang bersalaman memberi selamat kepada teman yang menang dan tidak menangis atau marah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Latihan Berguling di Atas Matras Busa Empuk",
        "prompt": "Buatkan soal PJOK Kelas 1-2 SD tentang menjaga posisi kepala menunduk saat berguling ke depan di atas matras senam",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghindari Bermain di Dekat Jalan Raya Berbahaya",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang memilih lapangan rumput atau halaman sekolah yang aman untuk bermain bola",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Merawat Kuku Tangan dan Kaki Tetap Pendek Bersih",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang memotong kuku yang panjang agar tidak menyimpan kuman penyebab sakit perut",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Menganalisis Bahaya Tidak Melakukan Pemanasan",
        "prompt": "Buatkan soal PJOK Kelas 1-2 SD tentang mengapa otot kaki bisa kram atau sakit jika langsung berlari kencang tanpa pemanasan",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Manfaat Gerakan Seimbang bagi Ketangkasan",
        "prompt": "Buatkan soal PJOK Kelas 1-2 SD tentang mengapa latihan berjalan di balok titian berguna agar anak tidak mudah tersandung dan jatuh",
        "difficulty": "HARD"
      },
      {
        "label": "Mengambil Keputusan Tepat saat Teman Terjatuh",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang tindakan pertama yang harus diambil ketika melihat teman tersandung saat bermain lari estafet",
        "difficulty": "HARD"
      },
      {
        "label": "Evaluasi Pola Hidup Sehat: Tidur, Olahraga, Makanan",
        "prompt": "Buatkan soal PJOK Kelas 1-2 SD tentang membandingkan anak yang rajin olahraga dan tidur teratur dengan anak yang sering begadang main HP",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Gerakan Tubuh saat Berlari Kencang",
        "prompt": "Buatkan soal PJOK Kelas 1-2 SD tentang posisi badan condong ke depan dan ayunan kedua lengan yang selaras dengan langkah kaki",
        "difficulty": "HARD"
      },
      {
        "label": "Menyimpulkan Pentingnya Mematuhi Wasit Olahraga",
        "prompt": "Buatkan soal PJOK Kelas 1-2 SD tentang mengapa setiap pemain harus menghormati keputusan guru wasit agar permainan tetap menyenangkan",
        "difficulty": "HARD"
      },
      {
        "label": "Memecahkan Masalah Menolong Diri Sendiri dari Cedera Ringan",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang membersihkan luka gores kecil dengan air bersih lalu melapor kepada bapak/ibu guru UKS",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Mengapa Minum Es Manis Kurang Baik Pasca Lari",
        "prompt": "Buatkan soal PJOK Kelas 1-2 SD tentang mengapa air putih suhu ruangan jauh lebih sehat untuk mengembalikan cairan tubuh dibanding minuman bersoda",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Sikap Kerja Sama saat Bermain Estafet Bola",
        "prompt": "Buatkan soal PJOK Kelas 1-2 SD tentang kunci kemenangan regu estafet bukan hanya satu anak yang cepat, melainkan operan bola yang rapi tanpa jatuh",
        "difficulty": "HARD"
      },
      {
        "label": "Mengidentifikasi Alat Olahraga yang Rusak & Berbahaya",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang tidak menggunakan hula hoop yang patah atau matras yang robek agar tidak mencelakai badan",
        "difficulty": "HARD"
      },
      {
        "label": "Mengapa Tubuh Berkeringat saat Berolahraga",
        "prompt": "Buatkan soal PJOK Kelas 1-2 SD tentang memahami bahwa keringat adalah tanda alami tubuh sedang mendinginkan panas badan setelah aktif bergerak",
        "difficulty": "HARD"
      },
      {
        "label": "Menjaga Batas Privasi Tubuh di Ruang Ganti Olahraga",
        "prompt": "Buatkan soal PJOK Kelas 1 SD tentang bersikap sopan dan menjaga aurat/privasi saat berganti pakaian olahraga di ruang tertutup",
        "difficulty": "HARD"
      }
    ]
  },
  "agama": {
    "EASY": [
      {
        "label": "Mengucap Basmalah & Hamdalah Sebelum & Sesudah Aktivitas",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang membiasakan membaca Bismillah sebelum makan dan Alhamdulillah setelah selesai makan",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Rukun Iman: Beriman kepada Allah & Malaikat",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang rukun iman pertama meyakini Allah Maha Esa dan malaikat ciptaan-Nya",
        "difficulty": "EASY"
      },
      {
        "label": "Asmaul Husna: Ar-Rahman dan Ar-Rahim",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang arti Asmaul Husna Ar-Rahman (Maha Pengasih) dan Ar-Rahim (Maha Penyayang)",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Rukun Islam: Syahadat, Sholat, Zakat, Puasa",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang menghafal lima rukun Islam dan mengucapkan dua kalimat syahadat",
        "difficulty": "EASY"
      },
      {
        "label": "Nama 5 Waktu Sholat Fardhu dalam Sehari",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang menyebutkan sholat Subuh, Dzuhur, Ashar, Maghrib, dan Isya",
        "difficulty": "EASY"
      },
      {
        "label": "Urutan Gerakan Wudhu yang Benar Bergambar",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang membasuh tangan, berkumur, membasuh wajah, tangan sampai siku, dan membasuh kaki",
        "difficulty": "EASY"
      },
      {
        "label": "Menghafal Surat Al-Fatihah dan Al-Ikhlas",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang membaca ayat surat Al-Fatihah dan surat Al-Ikhlas dengan tartil",
        "difficulty": "EASY"
      },
      {
        "label": "Berbakti kepada Orang Tua: Ayah dan Ibu",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang menghormati orang tua dengan mencium tangan saat pamit berangkat sekolah",
        "difficulty": "EASY"
      },
      {
        "label": "Kisah Teladan Nabi Muhammad SAW yang Jujur",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang gelar Al-Amin yang artinya orang yang dapat dipercaya dan selalu berkata jujur",
        "difficulty": "EASY"
      },
      {
        "label": "Adab Makan dan Minum Sambil Duduk Pakai Tangan Kanan",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang adab makan secara Islam: duduk rapi, menggunakan tangan kanan, dan tidak meniup makanan panas",
        "difficulty": "EASY"
      },
      {
        "label": "Menyayangi Teman & Suka Berbagi Rezeki",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang bersikap dermawan membagi kue kepada teman yang lapar",
        "difficulty": "EASY"
      },
      {
        "label": "Bersuci dari Najis: Buang Air Kecil di Toilet",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang adab masuk kamar mandi dengan kaki kiri dan beristinja membersihkan najis dengan air",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Membedakan Perbuatan Terpuji (Mahmudah) dan Tercela",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang membedakan perbuatan terpuji (menolong) dan tercela (mengejek)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menjaga Kebersihan Sebagian dari Iman",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang hadits kebersihan adalah sebagian dari iman dengan mencuci pakaian dan menjaga kebersihan kelas",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Adab Berbicara Lemah Lembut kepada Kakek Nenek",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang tidak meninggikan suara saat berbicara kepada orang yang lebih tua",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghafal Bacaan Doa Kedua Orang Tua",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang arti doa 'Rabbighfirli waliwalidayya...' menyayangi orang tua sejak kecil",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mempraktikkan Sholat Berjamaah di Masjid",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang adab di dalam masjid: menjaga shaf lurus, tidak berlari-lari, dan tenang mendengarkan imam",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kisah Teladan Nabi Nuh AS dan Bahtera Besar",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang ketaatan Nabi Nuh AS membuat kapal besar menyelamatkan orang-orang beriman dan hewan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghargai Tetangga Dekat Rumah yang Berbeda Keyakinan",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang hidup rukun bertetangga saling mengantar makanan dan tidak mengganggu",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Bersikap Rendah Hati (Tawadhu) Tidak Sombong",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang tidak memamerkan mainan baru kepada teman yang kurang mampu",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Bersyukur atas Nikmat Sehat dan Anggota Tubuh Lengkap",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang rasa syukur kepada Allah dengan menjaga mata dari melihat hal buruk",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menepati Janji saat Berjanji pada Teman",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang menepati janji mengembalikan buku yang dipinjam tepat waktu",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Berani Jujur Berkata Benar Walaupun Sulit",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang berani mengaku terus terang saat tidak sengaja memecahkan piring di dapur",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengucapkan Salam Assalamualaikum saat Masuk Rumah",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang mendoakan keselamatan bagi penghuni rumah dengan ucapan salam yang baik",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Menganalisis Hikmah Bersedekah Sembunyi-Sembunyi",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang keikhlasan berinfak di kotak amal masjid tanpa mengharapkan pujian orang lain",
        "difficulty": "HARD"
      },
      {
        "label": "Menyimpulkan Nilai Keteladanan Nabi Ibrahim AS",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang keteguhan iman Nabi Ibrahim AS mencari Tuhan pencipta langit dan bumi",
        "difficulty": "HARD"
      },
      {
        "label": "Evaluasi Perilaku Suka Memaafkan Sahabat",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang mengapa Allah sangat mencintai anak yang mudah memaafkan kesalahan teman",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Manfaat Berkata Baik atau Lebih Baik Diam",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang sabda Nabi bahwa menjaga lisan dari mengejek orang lain adalah tanda orang beriman",
        "difficulty": "HARD"
      },
      {
        "label": "Studi Kasus Amanah Membawa Uang Kembalian Ibu",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang kejujuran menyerahkan seluruh sisa uang belanja kepada ibu tanpa mengambilnya diam-diam",
        "difficulty": "HARD"
      },
      {
        "label": "Menghubungkan Kasih Sayang Allah dengan Menyayangi Kucing",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang memberi makan dan minum hewan terlantar sebagai bentuk kasih sayang makhluk ciptaan Allah",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Mengapa Tidak Boleh Mengolok-Olok Teman",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang larangan memanggil teman dengan nama julukan buruk yang membuat teman bersedih",
        "difficulty": "HARD"
      },
      {
        "label": "Memecahkan Masalah Mengatasi Rasa Malas Bangun Sholat",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang niat dan tekad segera bangun saat mendengar adzan Subuh berkumandang",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Perbuatan Syirik Menyekutukan Allah",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang meyakini hanya Allah tempat kita memohon pertolongan dan bukan pada pohon besar/batu keramat",
        "difficulty": "HARD"
      },
      {
        "label": "Meneladani Kesabaran Nabi Ayub AS saat Diuji Sakit",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang sikap sabar dan selalu berdzikir tanpa mengeluh saat sedang sakit",
        "difficulty": "HARD"
      },
      {
        "label": "Menyimpulkan Mengapa Kita Harus Bersyukur Ketika Sehat",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1 SD tentang memanfaatkan badan sehat untuk belajar rajin dan membantu sesama",
        "difficulty": "HARD"
      },
      {
        "label": "Menerapkan Nasihat Guru untuk Berbuat Kebaikan di Sekolah",
        "prompt": "Buatkan soal Pendidikan Agama Kelas 1-2 SD tentang menghormati ilmu dan nasihat guru agar berkah dalam menuntut ilmu",
        "difficulty": "HARD"
      }
    ]
  }
};

export const SD_FASE_B_SUBJECT_TOPICS: Record<string, SubjectDifficultyMap> = {
  "matematika": {
    "EASY": [
      {
        "label": "Bilangan Cacah s.d. 10.000 & Nilai Tempat",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang membaca, menulis, dan menentukan nilai tempat ribuan, ratusan, puluhan, dan satuan",
        "difficulty": "EASY"
      },
      {
        "label": "Penjumlahan & Pengurangan Bilangan Ribuan",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang operasi penjumlahan dan pengurangan bilangan cacah ribuan tanpa/dengan teknik menyimpan",
        "difficulty": "EASY"
      },
      {
        "label": "Perkalian Dasar Bilangan Puluhan dengan Satuan",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang perkalian dasar bilangan dua angka dengan satu angka secara bersusun pendek",
        "difficulty": "EASY"
      },
      {
        "label": "Pembagian Dasar Bersusun (Porogapit Sederhana)",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang pembagian dasar bilangan puluhan atau ratusan dengan angka satu digit tanpa sisa",
        "difficulty": "EASY"
      },
      {
        "label": "Pecahan Senilai Sederhana (1/2, 1/4, 2/4)",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang mengenal gambar pecahan biasa dan pecahan senilai menggunakan ilustrasi potongan pizza/kue",
        "difficulty": "EASY"
      },
      {
        "label": "Keliling Bangun Datar Persegi & Persegi Panjang",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang menghitung keliling persegi dan persegi panjang dengan menjumlahkan semua sisi",
        "difficulty": "EASY"
      },
      {
        "label": "Luas Bangun Datar Menggunakan Petak Satuan",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang menghitung luas bangun datar dengan menghitung jumlah petak persegi satuan",
        "difficulty": "EASY"
      },
      {
        "label": "Konversi Satuan Panjang: Meter ke Sentimeter",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang konversi satuan panjang baku (1 meter = 100 cm) pada pengukuran benda sekitar",
        "difficulty": "EASY"
      },
      {
        "label": "Konversi Satuan Berat: Kilogram ke Gram",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang membaca timbangan duduk dan mengubah satuan 1 kg = 1.000 gram",
        "difficulty": "EASY"
      },
      {
        "label": "Membaca Jam Analog (Menit Kelipatan 5)",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang membaca waktu jam analog jarum panjang (misal pukul 07.15, 08.30, 09.45)",
        "difficulty": "EASY"
      },
      {
        "label": "Membaca Data Tabel & Diagram Batang Tunggal",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang membaca data hasil panen atau tinggi badan siswa dari diagram batang sederhana",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Jenis Sudut: Siku-siku, Lancip, Tumpul",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang membedakan sudut siku-siku (90 derajat), sudut lancip, dan sudut tumpul pada benda",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Operasi Hitung Campuran Penjumlahan & Perkalian",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang aturan pengerjaan operasi hitung perkalian didahulukan daripada penjumlahan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menjumlahkan & Mengurangkan Pecahan Berpenyebut Sama",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang operasi penjumlahan pecahan berpenyebut sama (contoh: 2/5 + 1/5 = 3/5) soal cerita",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Luas Persegi & Persegi Panjang Rumus Baku",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang menghitung luas persegi (sisi x sisi) dan luas persegi panjang (panjang x lebar)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pembulatan Bilangan ke Puluhan & Ratusan Terdekat",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang menaksir hasil perhitungan belanjaan dengan pembulatan ke ratusan terdekat",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Soal Cerita Perkalian & Pembagian Sehari-hari",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang membagikan sejumlah bibit tanaman ke beberapa baris bedengan kebun secara merata",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghitung Durasi Waktu Mulai sampai Selesai",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang menghitung lama waktu perjalanan atau kegiatan belajar (jam dan menit)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengubah Satuan Waktu (Jam, Menit, Detik)",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang konversi waktu 2 jam = 120 menit pada kegiatan ekstrakurikuler",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sifat-Sifat Bangun Datar Segitiga Sama Sisi & Siku",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang sifat segitiga sama sisi (3 sisi sama panjang) dan segitiga siku-siku",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghitung Keliling Segitiga Sembarang & Sama Kaki",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang menghitung panjang pagar pembatas taman berbentuk segitiga",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menyajikan Data Frekuensi ke Diagram Gambar (Piktogram)",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang mengubah tabel daftar peminjam buku perpustakaan menjadi piktogram (1 simbol = 5 buku)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Hubungan Antara Garis Sejajar dan Garis Berpotongan",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang mengidentifikasi rel kereta api sebagai garis sejajar dan perempatan jalan sebagai garis berpotongan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengukur Sudut dengan Busur Derajat Sederhana",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang membaca besar sudut pada gambar busur derajat (sudut 45°, 90°, 120°)",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Soal Cerita Penalaran Bertingkat Belanja & Diskon",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang cerita belanja: menghitung total biaya beberapa jenis barang dan sisa kembalian uang pecahan besar",
        "difficulty": "HARD"
      },
      {
        "label": "Analisis Pola Bilangan Bertingkat & Angka Rahasia",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang memecahkan teka-teki bilangan 4 digit berdasarkan petunjuk nilai tempat dan sifat genap/ganjil",
        "difficulty": "HARD"
      },
      {
        "label": "Menghitung Luas Area Gabungan Dua Persegi Panjang",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang membagi denah lantai berbentuk huruf L menjadi dua bangun datar lalu menjumlahkan luasnya",
        "difficulty": "HARD"
      },
      {
        "label": "Memecahkan Masalah Pecahan Bagian Kue Sisa",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang Ani memakan 2/8 kue dan Budi memakan 3/8 kue, menghitung bagian sisa kue yang belum dimakan",
        "difficulty": "HARD"
      },
      {
        "label": "Analisis Diagram Batang untuk Menarik Kesimpulan Bisnis",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang membandingkan tren penjualan buku selama 5 bulan dan menentukan bulan dengan lonjakan tertinggi",
        "difficulty": "HARD"
      },
      {
        "label": "Menghitung Selisih Keliling Dua Kebun Berbeda Bentuk",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang membandingkan keliling taman persegi dan taman persegi panjang yang memiliki luas berbeda",
        "difficulty": "HARD"
      },
      {
        "label": "Penalaran Durasi Kegiatan Melintasi Tengah Hari",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang menghitung waktu tiba bus jika berangkat pukul 09.45 dan menempuh perjalanan selama 3 jam 30 menit",
        "difficulty": "HARD"
      },
      {
        "label": "Logika Pembagian Berbaki pada Soal Pengemasan Buah",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang mengemas 85 buah mangga ke dalam kotak berisi 6 buah, menentukan jumlah kotak penuh dan sisa buah",
        "difficulty": "HARD"
      },
      {
        "label": "Evaluasi Perkiraan Taksiran Pembulatan Terbaik",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang menilai strategi taksiran harga agar uang yang dibawa ke toko tidak kurang saat membayar di kasir",
        "difficulty": "HARD"
      },
      {
        "label": "Analisis Simetri Lipat dan Simetri Putar Bangun Datar",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang membuktikan jumlah sumbu simetri lipat pada persegi, persegi panjang, dan segitiga sama sisi",
        "difficulty": "HARD"
      },
      {
        "label": "Menentukan Hubungan Antarsatuan Berat (Kg, Ons, Gram)",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang resep kue yang mencampurkan bahan dalam satuan kg, ons, dan gram lalu menghitung berat total",
        "difficulty": "HARD"
      },
      {
        "label": "Memecahkan Masalah Pengubinan Lantai Kamar Tidur",
        "prompt": "Buatkan soal Matematika Kelas 3-4 SD tentang menghitung berapa buah ubin keramik ukuran 20x20 cm yang dibutuhkan untuk menutup lantai seluas 12 m²",
        "difficulty": "HARD"
      }
    ]
  },
  "indonesia": {
    "EASY": [
      {
        "label": "Menemukan Ide Pokok dalam Paragraf Pendek",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang menemukan gagasan utama / ide pokok dari paragraf 3-4 kalimat tentang lingkungan",
        "difficulty": "EASY"
      },
      {
        "label": "Ciri-Ciri Teks Deskripsi Tempat & Benda",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang ciri teks yang menggambarkan keindahan pantai atau suasana pasar tradisional",
        "difficulty": "EASY"
      },
      {
        "label": "Memahami Teks Petunjuk Arah & Denah Lokasi",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang membaca simbol mata angin (Utara, Selatan, Timur, Barat) pada denah sekolah",
        "difficulty": "EASY"
      },
      {
        "label": "Penggunaan Awalan me- pada Kata Kerja",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang penulisan kata berimbuhan me- (contoh: me + sapu = menyapu, me + tulis = menulis)",
        "difficulty": "EASY"
      },
      {
        "label": "Penggunaan Awalan di- dan Kata Depan di",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang membedakan awalan di- yang disambung (dimakan) dan kata depan di yang dipisah (di rumah)",
        "difficulty": "EASY"
      },
      {
        "label": "Unsur Intrinsik Cerita Fabel: Tokoh & Latar",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang menyebutkan tokoh hewan, watak, dan latar tempat cerita fabel hutan rimba",
        "difficulty": "EASY"
      },
      {
        "label": "Kosakata Antonim dan Sinonim Populer",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang menemukan persamaan kata (sinonim) dan lawan kata (antonim) dalam teks bacaan",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Bait dan Rima pada Puisi Anak",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang menghitung jumlah baris dalam satu bait puisi anak dan rima akhir bunyi",
        "difficulty": "EASY"
      },
      {
        "label": "Mengisi Formulir Pendaftaran Perpustakaan",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang menuliskan data identitas diri (nama lengkap, tanggal lahir, kelas) pada formulir",
        "difficulty": "EASY"
      },
      {
        "label": "Menulis Surat Pribadi untuk Sahabat Pena",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang bagian kepala surat, salam pembuka, dan kalimat penutup surat pribadi",
        "difficulty": "EASY"
      },
      {
        "label": "Kalimat Transitif dan Intransitif Sederhana",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang membedakan kalimat yang memerlukan objek (transitif) dan tidak berobjek (intransitif)",
        "difficulty": "EASY"
      },
      {
        "label": "Tanda Koma (,) dalam Rincian Benda",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang penggunaan tanda koma yang benar saat merinci barang belanjaan",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Menentukan Gagasan Pendukung dalam Paragraf",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang membedakan kalimat utama dan kalimat penjelas (pendukung) dalam teks narasi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menyusun Teks Petunjuk Cara Membuat Jus Buah",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang mengurutkan kalimat langkah-langkah petunjuk membuat minuman sehat secara logis",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menulis Kalimat Wawancara Sederhana kepada Petani",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang menyusun daftar pertanyaan wawancara 5W+1H yang santun untuk narasumber",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menentukan Makna Majas Personifikasi pada Puisi",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang mengartikan majas yang mengumpamakan benda mati bersikap seperti manusia (ombak berbisik)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menyimpulkan Watak Tokoh dari Dialog Cerita",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang menganalisis sifat tokoh (sombong, rendah hati, dermawan) dari perkataannya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menggunakan Kata Hubung Antarkalimat (Tetapi, Sedangkan)",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang memilih konjungsi pertentangan atau penambahan yang tepat dalam paragraf",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengubah Kalimat Langsung Menjadi Tak Langsung",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang mengubah ujaran bertanda petik dua menjadi kalimat berita tidak langsung",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menemukan Informasi Tersirat dalam Cerita Anak",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang menarik kesimpulan mengapa tokoh merasa kecewa meskipun tidak tertulis langsung",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menyunting Ejaan Tanda Titik Dua (:) dan Tanda Petik",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang memperbaiki penulisan tanda baca pada teks percakapan drama pendek anak",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Melengkapi Pantun Nasihat dengan Baris Isi yang Rima",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang melengkapi baris ketiga dan keempat pantun dengan sajak a-b-a-b yang bermakna",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menyusun Paragraf Laporan Pengamatan Tanaman",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang menuliskan hasil pengamatan pertumbuhan biji kacang hijau selama seminggu",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membedakan Fakta dan Pendapat (Opini) dalam Teks",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang membedakan kalimat fakta yang dapat dibuktikan dan opini perasaan seseorang",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Menganalisis Amanat & Nilai Moral Cerita Faktual",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang mengevaluasi nilai kejujuran dan tanggung jawab dari cerita anak korban kejujuran",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Kredibilitas Informasi dari Dua Sumber Cerita",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang membandingkan dua kutipan pendek mengenai asal-usul danau dan menemukan kesamaannya",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Hubungan Sebab-Akibat Peristiwa Cerita",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang menjelaskan rantai peristiwa: akibat kelalaian membuang sampah sembarangan menimbulkan banjir",
        "difficulty": "HARD"
      },
      {
        "label": "Mengkritisi Tindakan Tokoh dalam Cerita Fabel",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang memberikan alasan mengapa perbuatan serigala menipu domba merugikan dirinya sendiri di akhir",
        "difficulty": "HARD"
      },
      {
        "label": "Menyimpulkan Tema Besar Paragraf Eksposisi Lingkungan",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang merumuskan kesimpulan umum dari teks tentang manfaat hutan bakau mencegah abrasi pantai",
        "difficulty": "HARD"
      },
      {
        "label": "Memperbaiki Struktur Kalimat Rancu Menjadi Kalimat Efektif",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang mengubah kalimat bertele-tele dan boros kata menjadi kalimat efektif yang lugas",
        "difficulty": "HARD"
      },
      {
        "label": "Menginterpretasikan Makna Ungkapan / Peribahasa Tersembunyi",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang menganalisis peribahasa 'Besar pasak daripada tiang' dikaitkan dengan perilaku boros anak",
        "difficulty": "HARD"
      },
      {
        "label": "Menentukan Sudut Pandang Penulis dalam Cerita",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang mengidentifikasi sudut pandang orang pertama (Aku/Saya) atau orang ketiga (Dia/Mereka)",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Keberhasilan Tujuan Teks Iklan Layanan Masyarakat",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang menganalisis poster ajakan mencuci tangan: mengapa slogan singkat lebih mudah diingat masyarakat",
        "difficulty": "HARD"
      },
      {
        "label": "Mengembangkan Kerangka Karangan Menjadi Cerita Utuh",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang menentukan kalimat pengembang yang paling padu untuk melanjutkan ide cerita yang rumpang",
        "difficulty": "HARD"
      },
      {
        "label": "Mengevaluasi Kesantunan Bahasa dalam Surat Izin Sekolah",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang memilih pilihan kalimat yang paling sopan dan resmi saat orang tua menulis surat izin sakit",
        "difficulty": "HARD"
      },
      {
        "label": "Membedakan Latar Waktu, Tempat, dan Suasana Cerita",
        "prompt": "Buatkan soal Bahasa Indonesia Kelas 3-4 SD tentang menganalisis kutipan cerpen: membuktikan suasana mencekam saat badai melanda desa di malam hari",
        "difficulty": "HARD"
      }
    ]
  },
  "ipas": {
    "EASY": [
      {
        "label": "Bagian Tumbuhan & Fungsinya (Akar, Batang, Daun)",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang fungsi akar menyerap air, batang mengalirkan zat makanan, dan daun tempat fotosintesis",
        "difficulty": "EASY"
      },
      {
        "label": "Proses Fotosintesis pada Daun Hijau",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang bahan fotosintesis (cahaya matahari, air, klorofil, karbon dioksida) dan hasilnya (oksigen & glukosa)",
        "difficulty": "EASY"
      },
      {
        "label": "Daur Hidup Kupu-kupu & Katak (Metamorfosis)",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang tahapan metamorfosis sempurna kupu-kupu (telur - ulat - kepompong - kupu-kupu)",
        "difficulty": "EASY"
      },
      {
        "label": "Wujud Benda: Padat, Cair, Gas & Sifat-Sifatnya",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang sifat benda padat tetap, cair mengikuti wadah, dan gas mengisi seluruh ruangan",
        "difficulty": "EASY"
      },
      {
        "label": "Perubahan Wujud Zat (Mencair, Membeku, Menguap)",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang contoh mencair es, membeku air di freezer, dan mengembun titik air pada tutup gelas",
        "difficulty": "EASY"
      },
      {
        "label": "Gaya Tarik & Gaya Dorong pada Gerak Benda",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang contoh gaya dorong saat mendorong gerobak dan gaya tarik saat membuka laci meja",
        "difficulty": "EASY"
      },
      {
        "label": "Sifat-Sifat Magnet (Kutub Senama & Berlawanan)",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang kutub utara dan selatan magnet: tolak-menolak jika senama dan tarik-menarik jika berbeda",
        "difficulty": "EASY"
      },
      {
        "label": "Sumber Energi & Perubahannya (Listrik Jadi Panas)",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang contoh perubahan energi listrik menjadi panas pada setrika dan rice cooker",
        "difficulty": "EASY"
      },
      {
        "label": "Kenampakan Alam: Gunung, Sungai, Pantai, Dataran",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang membedakan dataran tinggi berhawa sejuk dan dataran rendah cocok untuk pertanian padi",
        "difficulty": "EASY"
      },
      {
        "label": "Kebutuhan Pokok Manusia (Pangan, Sandang, Papan)",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang contoh kebutuhan primer manusia dan membedakannya dari keinginan hiburan",
        "difficulty": "EASY"
      },
      {
        "label": "Peta Lingkungan Tempat Tinggal & Simbol Peta",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang membaca legenda simbol gunung segitiga dan garis biru untuk aliran sungai",
        "difficulty": "EASY"
      },
      {
        "label": "Keberagaman Budaya Daerah: Rumah Adat & Tarian",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang mengenal nama rumah adat Tongkonan, Joglo, Gadang dan pakaian adat daerah",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Pengaruh Gaya Gesek pada Ban Kendaraan & Sepatu",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang alur pada ban motor dibuat kasar untuk memperbesar gaya gesek agar tidak tergelincir di jalan basah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Proses Terjadinya Hujan & Siklus Air Sederhana",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang penguapan air laut oleh matahari, pembentukan awan mendung, hingga turun hujan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pemanfaatan Energi Alternatif Angin dan Matahari",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang kincir angin pembangkit listrik dan panel surya penyerap sinar matahari ramah lingkungan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Perkembangbiakan Hewan: Bertelur (Ovipar) & Beranak",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang mengelompokkan hewan ovipar (ayam, bebek) dan vivipar yang menyusui (kucing, sapi)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengidentifikasi Ekosistem Kolam dan Rantai Makanan",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang lumut dimakan ikan kecil, ikan kecil dimakan ikan besar, dan peran pengurai jamur",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kegiatan Ekonomi Masyarakat Pantai vs Pegunungan",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang mata pencaharian nelayan di pesisir pantai dan petani kebun teh di dataran tinggi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menjaga Kelestarian Sumber Daya Alam Air Bersih",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang dampak positif menanam pohon reboisasi untuk menjaga cadangan air tanah sumur",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pemuaian dan Penyusutan Benda Akibat Suhu",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang alasan rel kereta api diberi celah sambungan agar tidak bengkok saat memuai di siang hari",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pemanfaatan Norma dan Tradisi Kearifan Lokal",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang tradisi bersih desa dan sedekah bumi sebagai wujud syukur hasil pertanian",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menjaga Kesehatan Organ Pernapasan dari Polusi Asap",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang fungsi memakai masker di jalan raya dan bahaya asap rokok bagi paru-paru anak",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Peran Pasar Tradisional dalam Rantai Distribusi Barang",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang hubungan antara produsen petani sayur, pedagang pasar, dan konsumen ibu rumah tangga",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membedakan Perpindahan Panas Konduksi dan Konveksi",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang gagang sendok logam ikut terasa panas saat mengaduk teh manis hangat (konduksi)",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Analisis Dampak Penebangan Hutan terhadap Banjir",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang mengevaluasi hilangnya akar pohon penyerap air hujan yang memicu tanah longsor di lereng bukit",
        "difficulty": "HARD"
      },
      {
        "label": "Menguji Faktor yang Mempengaruhi Kecepatan Pelarutan Gula",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang percobaan ilmiah: membandingkan gula yang diaduk dalam air panas vs air dingin",
        "difficulty": "HARD"
      },
      {
        "label": "Memecahkan Masalah Pengurangan Sampah Plastik Sekolah",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang merancang program 3R (Reduce, Reuse, Recycle): membawa tumbler dan kotak makan sendiri",
        "difficulty": "HARD"
      },
      {
        "label": "Analisis Dampak Putusnya Rantai Makanan Sawah",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang memprediksi ledakan populasi hama tikus jika burung hantu dan ular sawah diburu manusia",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Pilihan Konsumsi: Skala Prioritas Uang Saku",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang studi kasus: mendahulukan membeli buku tulis yang habis daripada membeli mainan robotik",
        "difficulty": "HARD"
      },
      {
        "label": "Menyimpulkan Prinsip Kerja Pembuatan Garam Tradisional",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang menganalisis proses penguapan air laut oleh sinar matahari meninggalkan kristal garam putih",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Hubungan Letak Geografis & Budaya Masyarakat",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang mengapa rumah adat suku di pesisir berbentuk panggung untuk mengantisipasi air pasang laut",
        "difficulty": "HARD"
      },
      {
        "label": "Evaluasi Dampak Penggunaan Pupuk Kimia Berlebihan",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang menganalisis pencemaran air sungai akibat sisa pupuk kimia yang memicu pertumbuhan eceng gondok liar",
        "difficulty": "HARD"
      },
      {
        "label": "Menentukan Arah Berdasarkan Bayangan Matahari Pagi",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang jika bayangan tubuh berada di sebelah barat pada pagi hari, menentukan letak matahari di timur",
        "difficulty": "HARD"
      },
      {
        "label": "Menganalisis Kebutuhan Adaptasi Kaktus di Gurun Pasir",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang daun kaktus yang bermodifikasi menjadi duri tajam untuk mengurangi penguapan air di udara panas",
        "difficulty": "HARD"
      },
      {
        "label": "Memecahkan Masalah Penghematan Energi Listrik Rumah",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang tindakan nyata mematikan lampu kamar dan mencabut steker TV saat tidak digunakan",
        "difficulty": "HARD"
      },
      {
        "label": "Menilai Keberlanjutan Perekonomian Koperasi Sekolah",
        "prompt": "Buatkan soal IPAS Kelas 3-4 SD tentang manfaat koperasi sekolah dalam menumbuhkan jiwa mandiri, kejujuran, dan kesejahteraan anggota",
        "difficulty": "HARD"
      }
    ]
  }
};

export const SD_SUBJECT_TOPICS: Record<string, SubjectDifficultyMap> = {
  "inggris": {
    "EASY": [
      {
        "label": "Alphabet, Phonics, & Simple Words",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang pengenalan huruf abjad (Alphabet), fonik dasar, dan mengeja kata benda sederhana",
        "difficulty": "EASY"
      },
      {
        "label": "Numbers (1-100) & Counting Objects",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang berhitung angka 1 sampai 100 dengan ilustrasi benda sehari-hari",
        "difficulty": "EASY"
      },
      {
        "label": "Colors, Shapes, & Describing Objects",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang warna (colors), bentuk geometri dasar (shapes), dan mendeskripsikan benda",
        "difficulty": "EASY"
      },
      {
        "label": "Greetings, Farewells, & Self Introduction",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang ungkapan salam (greetings), perpisahan, dan perkenalan diri sederhana",
        "difficulty": "EASY"
      },
      {
        "label": "Family Members & Relationships",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang anggota keluarga (father, mother, brother, sister, grandparents)",
        "difficulty": "EASY"
      },
      {
        "label": "Parts of the Body & Face",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang bagian-bagian tubuh dan wajah manusia serta fungsinya secara sederhana",
        "difficulty": "EASY"
      },
      {
        "label": "Animals, Pets, & Their Habitats",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang nama hewan peliharaan, hewan liar, dan tempat hidupnya",
        "difficulty": "EASY"
      },
      {
        "label": "Fruits, Vegetables, & Favorite Foods",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang nama buah-buahan, sayuran, dan makanan-minuman kesukaan",
        "difficulty": "EASY"
      },
      {
        "label": "Days of the Week, Months, & Seasons",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang nama-nama hari, bulan dalam setahun, dan musim/cuaca",
        "difficulty": "EASY"
      },
      {
        "label": "My School & Classroom Objects",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang benda-benda di dalam kelas dan instruksi guru (stand up, sit down)",
        "difficulty": "EASY"
      },
      {
        "label": "Telling Time: O'clock & Half Past",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang membaca jam analog sederhana (o'clock, half past, quarter past)",
        "difficulty": "EASY"
      },
      {
        "label": "Simple Daily Routines & Action Verbs",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang kegiatan sehari-hari dengan kata kerja sederhana (eat, drink, study, sleep)",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Alphabet, Phonics, & Simple Words",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang pengenalan huruf abjad (Alphabet), fonik dasar, dan mengeja kata benda sederhana",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Numbers (1-100) & Counting Objects",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang berhitung angka 1 sampai 100 dengan ilustrasi benda sehari-hari",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Colors, Shapes, & Describing Objects",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang warna (colors), bentuk geometri dasar (shapes), dan mendeskripsikan benda",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Greetings, Farewells, & Self Introduction",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang ungkapan salam (greetings), perpisahan, dan perkenalan diri sederhana",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Family Members & Relationships",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang anggota keluarga (father, mother, brother, sister, grandparents)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Parts of the Body & Face",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang bagian-bagian tubuh dan wajah manusia serta fungsinya secara sederhana",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Animals, Pets, & Their Habitats",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang nama hewan peliharaan, hewan liar, dan tempat hidupnya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Fruits, Vegetables, & Favorite Foods",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang nama buah-buahan, sayuran, dan makanan-minuman kesukaan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Days of the Week, Months, & Seasons",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang nama-nama hari, bulan dalam setahun, dan musim/cuaca",
        "difficulty": "MEDIUM"
      },
      {
        "label": "My School & Classroom Objects",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang benda-benda di dalam kelas dan instruksi guru (stand up, sit down)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Telling Time: O'clock & Half Past",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang membaca jam analog sederhana (o'clock, half past, quarter past)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Simple Daily Routines & Action Verbs",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang kegiatan sehari-hari dengan kata kerja sederhana (eat, drink, study, sleep)",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Alphabet, Phonics, & Simple Words",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang pengenalan huruf abjad (Alphabet), fonik dasar, dan mengeja kata benda sederhana",
        "difficulty": "HARD"
      },
      {
        "label": "Numbers (1-100) & Counting Objects",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang berhitung angka 1 sampai 100 dengan ilustrasi benda sehari-hari",
        "difficulty": "HARD"
      },
      {
        "label": "Colors, Shapes, & Describing Objects",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang warna (colors), bentuk geometri dasar (shapes), dan mendeskripsikan benda",
        "difficulty": "HARD"
      },
      {
        "label": "Greetings, Farewells, & Self Introduction",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang ungkapan salam (greetings), perpisahan, dan perkenalan diri sederhana",
        "difficulty": "HARD"
      },
      {
        "label": "Family Members & Relationships",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang anggota keluarga (father, mother, brother, sister, grandparents)",
        "difficulty": "HARD"
      },
      {
        "label": "Parts of the Body & Face",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang bagian-bagian tubuh dan wajah manusia serta fungsinya secara sederhana",
        "difficulty": "HARD"
      },
      {
        "label": "Animals, Pets, & Their Habitats",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang nama hewan peliharaan, hewan liar, dan tempat hidupnya",
        "difficulty": "HARD"
      },
      {
        "label": "Fruits, Vegetables, & Favorite Foods",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang nama buah-buahan, sayuran, dan makanan-minuman kesukaan",
        "difficulty": "HARD"
      },
      {
        "label": "Days of the Week, Months, & Seasons",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang nama-nama hari, bulan dalam setahun, dan musim/cuaca",
        "difficulty": "HARD"
      },
      {
        "label": "My School & Classroom Objects",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang benda-benda di dalam kelas dan instruksi guru (stand up, sit down)",
        "difficulty": "HARD"
      },
      {
        "label": "Telling Time: O'clock & Half Past",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang membaca jam analog sederhana (o'clock, half past, quarter past)",
        "difficulty": "HARD"
      },
      {
        "label": "Simple Daily Routines & Action Verbs",
        "prompt": "Buatkan soal Bahasa Inggris SD tentang kegiatan sehari-hari dengan kata kerja sederhana (eat, drink, study, sleep)",
        "difficulty": "HARD"
      }
    ]
  },
  "matematika": {
    "EASY": [
      {
        "label": "Penjumlahan & Pengurangan Bilangan Cacah",
        "prompt": "Buatkan soal matematika SD tentang operasi hitung penjumlahan dan pengurangan bilangan cacah pada soal cerita sehari-hari",
        "difficulty": "EASY"
      },
      {
        "label": "Perkalian & Pembagian Dasar Sehari-Hari",
        "prompt": "Buatkan soal matematika SD tentang perkalian dan pembagian dasar dengan konteks benda di sekitar siswa",
        "difficulty": "EASY"
      },
      {
        "label": "Operasi Hitung Campuran Bilangan Bulat",
        "prompt": "Buatkan soal matematika SD tentang aturan urutan operasi hitung campuran (kurung, kali-bagi, tambah-kurang)",
        "difficulty": "EASY"
      },
      {
        "label": "Pecahan Sederhana, Senilai, & Desimal",
        "prompt": "Buatkan soal matematika SD tentang mengenal pecahan biasa, pecahan senilai, desimal, dan persen",
        "difficulty": "EASY"
      },
      {
        "label": "KPK & FPB pada Soal Cerita Nyata",
        "prompt": "Buatkan soal matematika SD tentang kelipatan persekutuan terkecil (KPK) dan faktor persekutuan terbesar (FPB)",
        "difficulty": "EASY"
      },
      {
        "label": "Keliling & Luas Persegi serta Segitiga",
        "prompt": "Buatkan soal matematika SD tentang menghitung keliling dan luas bangun datar persegi, persegi panjang, dan segitiga",
        "difficulty": "EASY"
      },
      {
        "label": "Volume Kubus & Balok Sederhana",
        "prompt": "Buatkan soal matematika SD tentang menghitung volume kubus dan balok dengan kubus satuan dan rumus",
        "difficulty": "EASY"
      },
      {
        "label": "Satuan Panjang, Berat, & Waktu",
        "prompt": "Buatkan soal matematika SD tentang konversi satuan meter-cm, kilogram-gram, serta jam-menit-detik",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Sudut & Sifat Bangun Datar",
        "prompt": "Buatkan soal matematika SD tentang sudut siku-siku, lancip, tumpul, dan sifat simetri lipat/putar",
        "difficulty": "EASY"
      },
      {
        "label": "Pengolahan Data: Diagram Batang & Gambar",
        "prompt": "Buatkan soal matematika SD tentang membaca dan menyajikan data dalam bentuk tabel frekuensi dan diagram batang",
        "difficulty": "EASY"
      },
      {
        "label": "Perbandingan & Skala Denah Rumah/Peta",
        "prompt": "Buatkan soal matematika SD tentang menghitung jarak sebenarnya dan jarak pada peta menggunakan skala",
        "difficulty": "EASY"
      },
      {
        "label": "Aritmetika Sosial: Uang Kembalian & Belanja",
        "prompt": "Buatkan soal matematika SD tentang menghitung nilai mata uang rupiah, total belanjaan, dan kembalian",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Penjumlahan & Pengurangan Bilangan Cacah",
        "prompt": "Buatkan soal matematika SD tentang operasi hitung penjumlahan dan pengurangan bilangan cacah pada soal cerita sehari-hari",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Perkalian & Pembagian Dasar Sehari-Hari",
        "prompt": "Buatkan soal matematika SD tentang perkalian dan pembagian dasar dengan konteks benda di sekitar siswa",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Operasi Hitung Campuran Bilangan Bulat",
        "prompt": "Buatkan soal matematika SD tentang aturan urutan operasi hitung campuran (kurung, kali-bagi, tambah-kurang)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pecahan Sederhana, Senilai, & Desimal",
        "prompt": "Buatkan soal matematika SD tentang mengenal pecahan biasa, pecahan senilai, desimal, dan persen",
        "difficulty": "MEDIUM"
      },
      {
        "label": "KPK & FPB pada Soal Cerita Nyata",
        "prompt": "Buatkan soal matematika SD tentang kelipatan persekutuan terkecil (KPK) dan faktor persekutuan terbesar (FPB)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Keliling & Luas Persegi serta Segitiga",
        "prompt": "Buatkan soal matematika SD tentang menghitung keliling dan luas bangun datar persegi, persegi panjang, dan segitiga",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Volume Kubus & Balok Sederhana",
        "prompt": "Buatkan soal matematika SD tentang menghitung volume kubus dan balok dengan kubus satuan dan rumus",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Satuan Panjang, Berat, & Waktu",
        "prompt": "Buatkan soal matematika SD tentang konversi satuan meter-cm, kilogram-gram, serta jam-menit-detik",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengenal Sudut & Sifat Bangun Datar",
        "prompt": "Buatkan soal matematika SD tentang sudut siku-siku, lancip, tumpul, dan sifat simetri lipat/putar",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pengolahan Data: Diagram Batang & Gambar",
        "prompt": "Buatkan soal matematika SD tentang membaca dan menyajikan data dalam bentuk tabel frekuensi dan diagram batang",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Perbandingan & Skala Denah Rumah/Peta",
        "prompt": "Buatkan soal matematika SD tentang menghitung jarak sebenarnya dan jarak pada peta menggunakan skala",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Aritmetika Sosial: Uang Kembalian & Belanja",
        "prompt": "Buatkan soal matematika SD tentang menghitung nilai mata uang rupiah, total belanjaan, dan kembalian",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Penjumlahan & Pengurangan Bilangan Cacah",
        "prompt": "Buatkan soal matematika SD tentang operasi hitung penjumlahan dan pengurangan bilangan cacah pada soal cerita sehari-hari",
        "difficulty": "HARD"
      },
      {
        "label": "Perkalian & Pembagian Dasar Sehari-Hari",
        "prompt": "Buatkan soal matematika SD tentang perkalian dan pembagian dasar dengan konteks benda di sekitar siswa",
        "difficulty": "HARD"
      },
      {
        "label": "Operasi Hitung Campuran Bilangan Bulat",
        "prompt": "Buatkan soal matematika SD tentang aturan urutan operasi hitung campuran (kurung, kali-bagi, tambah-kurang)",
        "difficulty": "HARD"
      },
      {
        "label": "Pecahan Sederhana, Senilai, & Desimal",
        "prompt": "Buatkan soal matematika SD tentang mengenal pecahan biasa, pecahan senilai, desimal, dan persen",
        "difficulty": "HARD"
      },
      {
        "label": "KPK & FPB pada Soal Cerita Nyata",
        "prompt": "Buatkan soal matematika SD tentang kelipatan persekutuan terkecil (KPK) dan faktor persekutuan terbesar (FPB)",
        "difficulty": "HARD"
      },
      {
        "label": "Keliling & Luas Persegi serta Segitiga",
        "prompt": "Buatkan soal matematika SD tentang menghitung keliling dan luas bangun datar persegi, persegi panjang, dan segitiga",
        "difficulty": "HARD"
      },
      {
        "label": "Volume Kubus & Balok Sederhana",
        "prompt": "Buatkan soal matematika SD tentang menghitung volume kubus dan balok dengan kubus satuan dan rumus",
        "difficulty": "HARD"
      },
      {
        "label": "Satuan Panjang, Berat, & Waktu",
        "prompt": "Buatkan soal matematika SD tentang konversi satuan meter-cm, kilogram-gram, serta jam-menit-detik",
        "difficulty": "HARD"
      },
      {
        "label": "Mengenal Sudut & Sifat Bangun Datar",
        "prompt": "Buatkan soal matematika SD tentang sudut siku-siku, lancip, tumpul, dan sifat simetri lipat/putar",
        "difficulty": "HARD"
      },
      {
        "label": "Pengolahan Data: Diagram Batang & Gambar",
        "prompt": "Buatkan soal matematika SD tentang membaca dan menyajikan data dalam bentuk tabel frekuensi dan diagram batang",
        "difficulty": "HARD"
      },
      {
        "label": "Perbandingan & Skala Denah Rumah/Peta",
        "prompt": "Buatkan soal matematika SD tentang menghitung jarak sebenarnya dan jarak pada peta menggunakan skala",
        "difficulty": "HARD"
      },
      {
        "label": "Aritmetika Sosial: Uang Kembalian & Belanja",
        "prompt": "Buatkan soal matematika SD tentang menghitung nilai mata uang rupiah, total belanjaan, dan kembalian",
        "difficulty": "HARD"
      }
    ]
  },
  "indonesia": {
    "EASY": [
      {
        "label": "Ide Pokok Cerita Anak & Dongeng",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang menentukan ide pokok, kalimat utama, dan kesimpulan dari dongeng anak",
        "difficulty": "EASY"
      },
      {
        "label": "Huruf Kapital & Penggunaan Tanda Baca",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang penulisan huruf kapital nama orang/tempat dan tanda titik/koma/tanya",
        "difficulty": "EASY"
      },
      {
        "label": "Fabel & Pesan Moral Tokoh Hewan",
        "prompt": "Buatkan soal Kurikulum Standar tentang Fabel & Pesan Moral Tokoh Hewan",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Petunjuk Penggunaan Sederhana",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang memahami petunjuk langkah-langkah membuat kerajinan atau menyalakan alat",
        "difficulty": "EASY"
      },
      {
        "label": "Kosakata Antonim, Sinonim, & Imbuhan",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang lawan kata, persamaan kata, serta awalan ber-, me-, di-",
        "difficulty": "EASY"
      },
      {
        "label": "Puisi Anak & Pantun Nasihat",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang makna bait puisi anak, rima pantun, dan pesan nasihat kebaikan",
        "difficulty": "EASY"
      },
      {
        "label": "Kalimat Ajakan, Perintah, & Penolakan Santun",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang membedakan kalimat ajakan (ayo/mari), perintah, dan penolakan sopan",
        "difficulty": "EASY"
      },
      {
        "label": "Menyusun Paragraf dari Gambar Berseri",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang mengurutkan cerita dari gambar berseri dan menuliskan urutan kronologis",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Narasi Pengalaman Liburan Sekolah",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang memahami unsur cerita pengalaman pribadi (siapa, di mana, kapan, apa)",
        "difficulty": "EASY"
      },
      {
        "label": "Formulir Pendaftaran & Data Diri Siswa",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang cara mengisi formulir pendaftaran anggota perpustakaan/ekskul",
        "difficulty": "EASY"
      },
      {
        "label": "Surat Pribadi Sederhana untuk Sahabat",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang bagian-bagian surat pribadi: tanggal, salam pembuka, isi, penutup",
        "difficulty": "EASY"
      },
      {
        "label": "Kosakata Baku & Peribahasa Populer",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang kata baku sehari-hari dan arti peribahasa sederhana",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Ide Pokok Cerita Anak & Dongeng",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang menentukan ide pokok, kalimat utama, dan kesimpulan dari dongeng anak",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Huruf Kapital & Penggunaan Tanda Baca",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang penulisan huruf kapital nama orang/tempat dan tanda titik/koma/tanya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Fabel & Pesan Moral Tokoh Hewan",
        "prompt": "Buatkan soal Kurikulum Standar tentang Fabel & Pesan Moral Tokoh Hewan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Petunjuk Penggunaan Sederhana",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang memahami petunjuk langkah-langkah membuat kerajinan atau menyalakan alat",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kosakata Antonim, Sinonim, & Imbuhan",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang lawan kata, persamaan kata, serta awalan ber-, me-, di-",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Puisi Anak & Pantun Nasihat",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang makna bait puisi anak, rima pantun, dan pesan nasihat kebaikan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kalimat Ajakan, Perintah, & Penolakan Santun",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang membedakan kalimat ajakan (ayo/mari), perintah, dan penolakan sopan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menyusun Paragraf dari Gambar Berseri",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang mengurutkan cerita dari gambar berseri dan menuliskan urutan kronologis",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Narasi Pengalaman Liburan Sekolah",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang memahami unsur cerita pengalaman pribadi (siapa, di mana, kapan, apa)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Formulir Pendaftaran & Data Diri Siswa",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang cara mengisi formulir pendaftaran anggota perpustakaan/ekskul",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Surat Pribadi Sederhana untuk Sahabat",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang bagian-bagian surat pribadi: tanggal, salam pembuka, isi, penutup",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kosakata Baku & Peribahasa Populer",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang kata baku sehari-hari dan arti peribahasa sederhana",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Ide Pokok Cerita Anak & Dongeng",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang menentukan ide pokok, kalimat utama, dan kesimpulan dari dongeng anak",
        "difficulty": "HARD"
      },
      {
        "label": "Huruf Kapital & Penggunaan Tanda Baca",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang penulisan huruf kapital nama orang/tempat dan tanda titik/koma/tanya",
        "difficulty": "HARD"
      },
      {
        "label": "Fabel & Pesan Moral Tokoh Hewan",
        "prompt": "Buatkan soal Kurikulum Standar tentang Fabel & Pesan Moral Tokoh Hewan",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Petunjuk Penggunaan Sederhana",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang memahami petunjuk langkah-langkah membuat kerajinan atau menyalakan alat",
        "difficulty": "HARD"
      },
      {
        "label": "Kosakata Antonim, Sinonim, & Imbuhan",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang lawan kata, persamaan kata, serta awalan ber-, me-, di-",
        "difficulty": "HARD"
      },
      {
        "label": "Puisi Anak & Pantun Nasihat",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang makna bait puisi anak, rima pantun, dan pesan nasihat kebaikan",
        "difficulty": "HARD"
      },
      {
        "label": "Kalimat Ajakan, Perintah, & Penolakan Santun",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang membedakan kalimat ajakan (ayo/mari), perintah, dan penolakan sopan",
        "difficulty": "HARD"
      },
      {
        "label": "Menyusun Paragraf dari Gambar Berseri",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang mengurutkan cerita dari gambar berseri dan menuliskan urutan kronologis",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Narasi Pengalaman Liburan Sekolah",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang memahami unsur cerita pengalaman pribadi (siapa, di mana, kapan, apa)",
        "difficulty": "HARD"
      },
      {
        "label": "Formulir Pendaftaran & Data Diri Siswa",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang cara mengisi formulir pendaftaran anggota perpustakaan/ekskul",
        "difficulty": "HARD"
      },
      {
        "label": "Surat Pribadi Sederhana untuk Sahabat",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang bagian-bagian surat pribadi: tanggal, salam pembuka, isi, penutup",
        "difficulty": "HARD"
      },
      {
        "label": "Kosakata Baku & Peribahasa Populer",
        "prompt": "Buatkan soal Bahasa Indonesia SD tentang kata baku sehari-hari dan arti peribahasa sederhana",
        "difficulty": "HARD"
      }
    ]
  },
  "ipas": {
    "EASY": [
      {
        "label": "Bagian Tubuh Tumbuhan & Fungsinya",
        "prompt": "Buatkan soal IPAS SD tentang fungsi akar, batang, daun, bunga, buah, dan biji pada tumbuhan",
        "difficulty": "EASY"
      },
      {
        "label": "Daur Hidup Hewan & Metamorfosis",
        "prompt": "Buatkan soal IPAS SD tentang metamorfosis sempurna (kupu-kupu, katak) dan tidak sempurna (belalang, kecoa)",
        "difficulty": "EASY"
      },
      {
        "label": "Rantai Makanan Ekosistem Sawah & Hutan",
        "prompt": "Buatkan soal IPAS SD tentang produsen, konsumen tingkat 1/2, pengurai, dan peran makhluk hidup",
        "difficulty": "EASY"
      },
      {
        "label": "Perubahan Wujud Benda (Mencair, Menguap)",
        "prompt": "Buatkan soal IPAS SD tentang sifat padat, cair, gas, serta peristiwa mencair, membeku, menguap, mengembun",
        "difficulty": "EASY"
      },
      {
        "label": "Sumber Energi & Perubahan Bentuk Energi",
        "prompt": "Buatkan soal IPAS SD tentang energi matahari, angin, air, listrik, dan perubahannya menjadi gerak/panas/cahaya",
        "difficulty": "EASY"
      },
      {
        "label": "Gaya Gesek, Magnet, & Gravitasi Bumi",
        "prompt": "Buatkan soal IPAS SD tentang pengaruh gaya dorong/tarik, sifat kutub magnet, dan jatuhnya benda karena gravitasi",
        "difficulty": "EASY"
      },
      {
        "label": "Siklus Air & Kelestarian Lingkungan Hidup",
        "prompt": "Buatkan soal IPAS SD tentang penguapan (evaporasi), pembentukan awan, hujan, dan cara menghemat air bersih",
        "difficulty": "EASY"
      },
      {
        "label": "Panca Indera Manusia & Cara Merawatnya",
        "prompt": "Buatkan soal IPAS SD tentang fungsi mata, telinga, hidung, lidah, kulit, serta cara menjaga kebersihannya",
        "difficulty": "EASY"
      },
      {
        "label": "Kenampakan Alam & Peta Lingkungan Rumah",
        "prompt": "Buatkan soal IPAS SD tentang gunung, sungai, dataran tinggi, pantai, dan membaca arah mata angin di denah",
        "difficulty": "EASY"
      },
      {
        "label": "Keragaman Budaya & Suku Bangsa Indonesia",
        "prompt": "Buatkan soal IPAS SD tentang rumah adat, pakaian adat, alat musik tradisional, dan semboyan Bhinneka Tunggal Ika",
        "difficulty": "EASY"
      },
      {
        "label": "Kegiatan Ekonomi: Produksi, Konsumsi, Distribusi",
        "prompt": "Buatkan soal IPAS SD tentang pekerjaan petani, nelayan, pedagang, dan perputaran barang kebutuhan sehari-hari",
        "difficulty": "EASY"
      },
      {
        "label": "Sejarah Pahlawan & Peninggalan Kerajaan",
        "prompt": "Buatkan soal IPAS SD tentang pahlawan nasional pembela tanah air dan candi/prasasti peninggalan bersejarah",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Bagian Tubuh Tumbuhan & Fungsinya",
        "prompt": "Buatkan soal IPAS SD tentang fungsi akar, batang, daun, bunga, buah, dan biji pada tumbuhan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Daur Hidup Hewan & Metamorfosis",
        "prompt": "Buatkan soal IPAS SD tentang metamorfosis sempurna (kupu-kupu, katak) dan tidak sempurna (belalang, kecoa)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Rantai Makanan Ekosistem Sawah & Hutan",
        "prompt": "Buatkan soal IPAS SD tentang produsen, konsumen tingkat 1/2, pengurai, dan peran makhluk hidup",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Perubahan Wujud Benda (Mencair, Menguap)",
        "prompt": "Buatkan soal IPAS SD tentang sifat padat, cair, gas, serta peristiwa mencair, membeku, menguap, mengembun",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sumber Energi & Perubahan Bentuk Energi",
        "prompt": "Buatkan soal IPAS SD tentang energi matahari, angin, air, listrik, dan perubahannya menjadi gerak/panas/cahaya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Gaya Gesek, Magnet, & Gravitasi Bumi",
        "prompt": "Buatkan soal IPAS SD tentang pengaruh gaya dorong/tarik, sifat kutub magnet, dan jatuhnya benda karena gravitasi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Siklus Air & Kelestarian Lingkungan Hidup",
        "prompt": "Buatkan soal IPAS SD tentang penguapan (evaporasi), pembentukan awan, hujan, dan cara menghemat air bersih",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Panca Indera Manusia & Cara Merawatnya",
        "prompt": "Buatkan soal IPAS SD tentang fungsi mata, telinga, hidung, lidah, kulit, serta cara menjaga kebersihannya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kenampakan Alam & Peta Lingkungan Rumah",
        "prompt": "Buatkan soal IPAS SD tentang gunung, sungai, dataran tinggi, pantai, dan membaca arah mata angin di denah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Keragaman Budaya & Suku Bangsa Indonesia",
        "prompt": "Buatkan soal IPAS SD tentang rumah adat, pakaian adat, alat musik tradisional, dan semboyan Bhinneka Tunggal Ika",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kegiatan Ekonomi: Produksi, Konsumsi, Distribusi",
        "prompt": "Buatkan soal IPAS SD tentang pekerjaan petani, nelayan, pedagang, dan perputaran barang kebutuhan sehari-hari",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sejarah Pahlawan & Peninggalan Kerajaan",
        "prompt": "Buatkan soal IPAS SD tentang pahlawan nasional pembela tanah air dan candi/prasasti peninggalan bersejarah",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Bagian Tubuh Tumbuhan & Fungsinya",
        "prompt": "Buatkan soal IPAS SD tentang fungsi akar, batang, daun, bunga, buah, dan biji pada tumbuhan",
        "difficulty": "HARD"
      },
      {
        "label": "Daur Hidup Hewan & Metamorfosis",
        "prompt": "Buatkan soal IPAS SD tentang metamorfosis sempurna (kupu-kupu, katak) dan tidak sempurna (belalang, kecoa)",
        "difficulty": "HARD"
      },
      {
        "label": "Rantai Makanan Ekosistem Sawah & Hutan",
        "prompt": "Buatkan soal IPAS SD tentang produsen, konsumen tingkat 1/2, pengurai, dan peran makhluk hidup",
        "difficulty": "HARD"
      },
      {
        "label": "Perubahan Wujud Benda (Mencair, Menguap)",
        "prompt": "Buatkan soal IPAS SD tentang sifat padat, cair, gas, serta peristiwa mencair, membeku, menguap, mengembun",
        "difficulty": "HARD"
      },
      {
        "label": "Sumber Energi & Perubahan Bentuk Energi",
        "prompt": "Buatkan soal IPAS SD tentang energi matahari, angin, air, listrik, dan perubahannya menjadi gerak/panas/cahaya",
        "difficulty": "HARD"
      },
      {
        "label": "Gaya Gesek, Magnet, & Gravitasi Bumi",
        "prompt": "Buatkan soal IPAS SD tentang pengaruh gaya dorong/tarik, sifat kutub magnet, dan jatuhnya benda karena gravitasi",
        "difficulty": "HARD"
      },
      {
        "label": "Siklus Air & Kelestarian Lingkungan Hidup",
        "prompt": "Buatkan soal IPAS SD tentang penguapan (evaporasi), pembentukan awan, hujan, dan cara menghemat air bersih",
        "difficulty": "HARD"
      },
      {
        "label": "Panca Indera Manusia & Cara Merawatnya",
        "prompt": "Buatkan soal IPAS SD tentang fungsi mata, telinga, hidung, lidah, kulit, serta cara menjaga kebersihannya",
        "difficulty": "HARD"
      },
      {
        "label": "Kenampakan Alam & Peta Lingkungan Rumah",
        "prompt": "Buatkan soal IPAS SD tentang gunung, sungai, dataran tinggi, pantai, dan membaca arah mata angin di denah",
        "difficulty": "HARD"
      },
      {
        "label": "Keragaman Budaya & Suku Bangsa Indonesia",
        "prompt": "Buatkan soal IPAS SD tentang rumah adat, pakaian adat, alat musik tradisional, dan semboyan Bhinneka Tunggal Ika",
        "difficulty": "HARD"
      },
      {
        "label": "Kegiatan Ekonomi: Produksi, Konsumsi, Distribusi",
        "prompt": "Buatkan soal IPAS SD tentang pekerjaan petani, nelayan, pedagang, dan perputaran barang kebutuhan sehari-hari",
        "difficulty": "HARD"
      },
      {
        "label": "Sejarah Pahlawan & Peninggalan Kerajaan",
        "prompt": "Buatkan soal IPAS SD tentang pahlawan nasional pembela tanah air dan candi/prasasti peninggalan bersejarah",
        "difficulty": "HARD"
      }
    ]
  },
  "pancasila": {
    "EASY": [
      {
        "label": "Simbol 5 Sila Garuda Pancasila",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang lambang Bintang, Rantai, Pohon Beringin, Kepala Banteng, Padi Kapas",
        "difficulty": "EASY"
      },
      {
        "label": "Pengamalan Sila Pancasila di Rumah & Sekolah",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang contoh perbuatan baik sesuai nilai Ketuhanan hingga Keadilan Sosial",
        "difficulty": "EASY"
      },
      {
        "label": "Aturan & Tata Tertib di Keluarga serta Sekolah",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang manfaat mematuhi aturan dan akibat melanggar jadwal belajar/piket",
        "difficulty": "EASY"
      },
      {
        "label": "Hak dan Kewajiban Anak di Rumah & Kelas",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang hak mendapat kasih sayang/belajar dan kewajiban membantu orang tua",
        "difficulty": "EASY"
      },
      {
        "label": "Gotong Royong & Tolong Menolong Antar Teman",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang kerja bakti, membersihkan ruang kelas, dan berbagi dengan teman",
        "difficulty": "EASY"
      },
      {
        "label": "Menghargai Perbedaan Suku & Agama Teman",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang sikap toleransi berteman tanpa membeda-bedakan latar belakang",
        "difficulty": "EASY"
      },
      {
        "label": "Musyawarah Pemilihan Ketua Kelas",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang cara mengambil keputusan bersama dan menerima hasil keputusan",
        "difficulty": "EASY"
      },
      {
        "label": "Cinta Tanah Air & Bangga Produk Lokal",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang mencintai budaya nusantara dan memakai batik atau kerajinan dalam negeri",
        "difficulty": "EASY"
      },
      {
        "label": "Bendera Merah Putih & Lagu Indonesia Raya",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang etika saat upacara bendera dan makna warna Merah Putih",
        "difficulty": "EASY"
      },
      {
        "label": "Sikap Jujur, Disiplin, dan Tanggung Jawab",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang tidak menyontek, datang tepat waktu, dan mengakui kesalahan",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Pakaian & Rumah Adat Daerah",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang keberagaman adat istiadat dari Sabang sampai Merauke",
        "difficulty": "EASY"
      },
      {
        "label": "Menjaga Fasilitas Umum & Lingkungan Bersih",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang merawat tanaman sekolah, membuang sampah, dan hemat listrik",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Simbol 5 Sila Garuda Pancasila",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang lambang Bintang, Rantai, Pohon Beringin, Kepala Banteng, Padi Kapas",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pengamalan Sila Pancasila di Rumah & Sekolah",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang contoh perbuatan baik sesuai nilai Ketuhanan hingga Keadilan Sosial",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Aturan & Tata Tertib di Keluarga serta Sekolah",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang manfaat mematuhi aturan dan akibat melanggar jadwal belajar/piket",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Hak dan Kewajiban Anak di Rumah & Kelas",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang hak mendapat kasih sayang/belajar dan kewajiban membantu orang tua",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Gotong Royong & Tolong Menolong Antar Teman",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang kerja bakti, membersihkan ruang kelas, dan berbagi dengan teman",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghargai Perbedaan Suku & Agama Teman",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang sikap toleransi berteman tanpa membeda-bedakan latar belakang",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Musyawarah Pemilihan Ketua Kelas",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang cara mengambil keputusan bersama dan menerima hasil keputusan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Cinta Tanah Air & Bangga Produk Lokal",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang mencintai budaya nusantara dan memakai batik atau kerajinan dalam negeri",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Bendera Merah Putih & Lagu Indonesia Raya",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang etika saat upacara bendera dan makna warna Merah Putih",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sikap Jujur, Disiplin, dan Tanggung Jawab",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang tidak menyontek, datang tepat waktu, dan mengakui kesalahan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengenal Pakaian & Rumah Adat Daerah",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang keberagaman adat istiadat dari Sabang sampai Merauke",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menjaga Fasilitas Umum & Lingkungan Bersih",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang merawat tanaman sekolah, membuang sampah, dan hemat listrik",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Simbol 5 Sila Garuda Pancasila",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang lambang Bintang, Rantai, Pohon Beringin, Kepala Banteng, Padi Kapas",
        "difficulty": "HARD"
      },
      {
        "label": "Pengamalan Sila Pancasila di Rumah & Sekolah",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang contoh perbuatan baik sesuai nilai Ketuhanan hingga Keadilan Sosial",
        "difficulty": "HARD"
      },
      {
        "label": "Aturan & Tata Tertib di Keluarga serta Sekolah",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang manfaat mematuhi aturan dan akibat melanggar jadwal belajar/piket",
        "difficulty": "HARD"
      },
      {
        "label": "Hak dan Kewajiban Anak di Rumah & Kelas",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang hak mendapat kasih sayang/belajar dan kewajiban membantu orang tua",
        "difficulty": "HARD"
      },
      {
        "label": "Gotong Royong & Tolong Menolong Antar Teman",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang kerja bakti, membersihkan ruang kelas, dan berbagi dengan teman",
        "difficulty": "HARD"
      },
      {
        "label": "Menghargai Perbedaan Suku & Agama Teman",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang sikap toleransi berteman tanpa membeda-bedakan latar belakang",
        "difficulty": "HARD"
      },
      {
        "label": "Musyawarah Pemilihan Ketua Kelas",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang cara mengambil keputusan bersama dan menerima hasil keputusan",
        "difficulty": "HARD"
      },
      {
        "label": "Cinta Tanah Air & Bangga Produk Lokal",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang mencintai budaya nusantara dan memakai batik atau kerajinan dalam negeri",
        "difficulty": "HARD"
      },
      {
        "label": "Bendera Merah Putih & Lagu Indonesia Raya",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang etika saat upacara bendera dan makna warna Merah Putih",
        "difficulty": "HARD"
      },
      {
        "label": "Sikap Jujur, Disiplin, dan Tanggung Jawab",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang tidak menyontek, datang tepat waktu, dan mengakui kesalahan",
        "difficulty": "HARD"
      },
      {
        "label": "Mengenal Pakaian & Rumah Adat Daerah",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang keberagaman adat istiadat dari Sabang sampai Merauke",
        "difficulty": "HARD"
      },
      {
        "label": "Menjaga Fasilitas Umum & Lingkungan Bersih",
        "prompt": "Buatkan soal Pendidikan Pancasila SD tentang merawat tanaman sekolah, membuang sampah, dan hemat listrik",
        "difficulty": "HARD"
      }
    ]
  },
  "seni": {
    "EASY": [
      {
        "label": "Menggambar Dekoratif & Pola Motif Hias",
        "prompt": "Buatkan soal Seni Budaya SD tentang menggambar motif hias daun, bunga, hewan, dan pola geometris",
        "difficulty": "EASY"
      },
      {
        "label": "Kolase & Mozaik dari Kertas serta Biji",
        "prompt": "Buatkan soal Seni Budaya SD tentang teknik menempel potongan kertas, daun kering, atau biji-bijian",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Warna Primer & Sekunder",
        "prompt": "Buatkan soal Seni Budaya SD tentang warna merah, kuning, biru, dan hasil percampurannya menjadi hijau/oranye/ungu",
        "difficulty": "EASY"
      },
      {
        "label": "Menyanyikan Lagu Anak & Lagu Nasional",
        "prompt": "Buatkan soal Seni Budaya SD tentang tempo lagu (cepat/lambat), tinggi rendah nada, dan lirik lagu anak Indonesia",
        "difficulty": "EASY"
      },
      {
        "label": "Alat Musik Ritmis Tradisional (Rebana/Kendang)",
        "prompt": "Buatkan soal Seni Budaya SD tentang alat musik yang tidak bernada, cara memukul, dan menjaga ketukan tempo",
        "difficulty": "EASY"
      },
      {
        "label": "Gerak Tari Tiruan Gerakan Hewan/Tumbuhan",
        "prompt": "Buatkan soal Seni Budaya SD tentang gerak meniru burung terbang, kupu-kupu, kelinci melompat, atau pohon tertiup angin",
        "difficulty": "EASY"
      },
      {
        "label": "Properti Tari Sederhana: Kipas & Selendang",
        "prompt": "Buatkan soal Seni Budaya SD tentang penggunaan selendang, kipas, dan topeng dalam pementasan tari",
        "difficulty": "EASY"
      },
      {
        "label": "Kerajinan Anyaman Kertas & Origami Lipat",
        "prompt": "Buatkan soal Seni Budaya SD tentang teknik melipat kertas origami menjadi hewan dan menganyam pola selang-seling",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Boneka Jari & Wayang Cerita",
        "prompt": "Buatkan soal Seni Budaya SD tentang mendongeng dengan boneka jari/tangan dan ekspresi suara tokoh",
        "difficulty": "EASY"
      },
      {
        "label": "Pantomim & Gerak Tubuh Tanpa Kata",
        "prompt": "Buatkan soal Seni Budaya SD tentang berekspresi wajah gembira/sedih dan gerakan teatrikal sederhana",
        "difficulty": "EASY"
      },
      {
        "label": "Mencetak Gambar dengan Pelepah Pisang & Buah",
        "prompt": "Buatkan soal Seni Budaya SD tentang teknik cap sederhana menggunakan pelepah pisang atau buah belimbing",
        "difficulty": "EASY"
      },
      {
        "label": "Membuat Miniatur Hewan dari Plastisin/Tanah Liat",
        "prompt": "Buatkan soal Seni Budaya SD tentang teknik memilin, meremas, dan membentuk plastisin mainan",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Menggambar Dekoratif & Pola Motif Hias",
        "prompt": "Buatkan soal Seni Budaya SD tentang menggambar motif hias daun, bunga, hewan, dan pola geometris",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kolase & Mozaik dari Kertas serta Biji",
        "prompt": "Buatkan soal Seni Budaya SD tentang teknik menempel potongan kertas, daun kering, atau biji-bijian",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengenal Warna Primer & Sekunder",
        "prompt": "Buatkan soal Seni Budaya SD tentang warna merah, kuning, biru, dan hasil percampurannya menjadi hijau/oranye/ungu",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menyanyikan Lagu Anak & Lagu Nasional",
        "prompt": "Buatkan soal Seni Budaya SD tentang tempo lagu (cepat/lambat), tinggi rendah nada, dan lirik lagu anak Indonesia",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Alat Musik Ritmis Tradisional (Rebana/Kendang)",
        "prompt": "Buatkan soal Seni Budaya SD tentang alat musik yang tidak bernada, cara memukul, dan menjaga ketukan tempo",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Gerak Tari Tiruan Gerakan Hewan/Tumbuhan",
        "prompt": "Buatkan soal Seni Budaya SD tentang gerak meniru burung terbang, kupu-kupu, kelinci melompat, atau pohon tertiup angin",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Properti Tari Sederhana: Kipas & Selendang",
        "prompt": "Buatkan soal Seni Budaya SD tentang penggunaan selendang, kipas, dan topeng dalam pementasan tari",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kerajinan Anyaman Kertas & Origami Lipat",
        "prompt": "Buatkan soal Seni Budaya SD tentang teknik melipat kertas origami menjadi hewan dan menganyam pola selang-seling",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengenal Boneka Jari & Wayang Cerita",
        "prompt": "Buatkan soal Seni Budaya SD tentang mendongeng dengan boneka jari/tangan dan ekspresi suara tokoh",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pantomim & Gerak Tubuh Tanpa Kata",
        "prompt": "Buatkan soal Seni Budaya SD tentang berekspresi wajah gembira/sedih dan gerakan teatrikal sederhana",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mencetak Gambar dengan Pelepah Pisang & Buah",
        "prompt": "Buatkan soal Seni Budaya SD tentang teknik cap sederhana menggunakan pelepah pisang atau buah belimbing",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membuat Miniatur Hewan dari Plastisin/Tanah Liat",
        "prompt": "Buatkan soal Seni Budaya SD tentang teknik memilin, meremas, dan membentuk plastisin mainan",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Menggambar Dekoratif & Pola Motif Hias",
        "prompt": "Buatkan soal Seni Budaya SD tentang menggambar motif hias daun, bunga, hewan, dan pola geometris",
        "difficulty": "HARD"
      },
      {
        "label": "Kolase & Mozaik dari Kertas serta Biji",
        "prompt": "Buatkan soal Seni Budaya SD tentang teknik menempel potongan kertas, daun kering, atau biji-bijian",
        "difficulty": "HARD"
      },
      {
        "label": "Mengenal Warna Primer & Sekunder",
        "prompt": "Buatkan soal Seni Budaya SD tentang warna merah, kuning, biru, dan hasil percampurannya menjadi hijau/oranye/ungu",
        "difficulty": "HARD"
      },
      {
        "label": "Menyanyikan Lagu Anak & Lagu Nasional",
        "prompt": "Buatkan soal Seni Budaya SD tentang tempo lagu (cepat/lambat), tinggi rendah nada, dan lirik lagu anak Indonesia",
        "difficulty": "HARD"
      },
      {
        "label": "Alat Musik Ritmis Tradisional (Rebana/Kendang)",
        "prompt": "Buatkan soal Seni Budaya SD tentang alat musik yang tidak bernada, cara memukul, dan menjaga ketukan tempo",
        "difficulty": "HARD"
      },
      {
        "label": "Gerak Tari Tiruan Gerakan Hewan/Tumbuhan",
        "prompt": "Buatkan soal Seni Budaya SD tentang gerak meniru burung terbang, kupu-kupu, kelinci melompat, atau pohon tertiup angin",
        "difficulty": "HARD"
      },
      {
        "label": "Properti Tari Sederhana: Kipas & Selendang",
        "prompt": "Buatkan soal Seni Budaya SD tentang penggunaan selendang, kipas, dan topeng dalam pementasan tari",
        "difficulty": "HARD"
      },
      {
        "label": "Kerajinan Anyaman Kertas & Origami Lipat",
        "prompt": "Buatkan soal Seni Budaya SD tentang teknik melipat kertas origami menjadi hewan dan menganyam pola selang-seling",
        "difficulty": "HARD"
      },
      {
        "label": "Mengenal Boneka Jari & Wayang Cerita",
        "prompt": "Buatkan soal Seni Budaya SD tentang mendongeng dengan boneka jari/tangan dan ekspresi suara tokoh",
        "difficulty": "HARD"
      },
      {
        "label": "Pantomim & Gerak Tubuh Tanpa Kata",
        "prompt": "Buatkan soal Seni Budaya SD tentang berekspresi wajah gembira/sedih dan gerakan teatrikal sederhana",
        "difficulty": "HARD"
      },
      {
        "label": "Mencetak Gambar dengan Pelepah Pisang & Buah",
        "prompt": "Buatkan soal Seni Budaya SD tentang teknik cap sederhana menggunakan pelepah pisang atau buah belimbing",
        "difficulty": "HARD"
      },
      {
        "label": "Membuat Miniatur Hewan dari Plastisin/Tanah Liat",
        "prompt": "Buatkan soal Seni Budaya SD tentang teknik memilin, meremas, dan membentuk plastisin mainan",
        "difficulty": "HARD"
      }
    ]
  },
  "pjok": {
    "EASY": [
      {
        "label": "Gerak Lokomotor: Jalan, Lari, & Lompat",
        "prompt": "Buatkan soal PJOK SD tentang variasi berjalan lurus/zig-zag, berlari cepat, dan melompat rintangan",
        "difficulty": "EASY"
      },
      {
        "label": "Gerak Non-Lokomotor: Memutar & Menekuk Tubuh",
        "prompt": "Buatkan soal PJOK SD tentang peregangan statis, menekuk lutut, mengayun lengan, dan memutar pinggang",
        "difficulty": "EASY"
      },
      {
        "label": "Gerak Manipulatif: Melempar & Menangkap Bola",
        "prompt": "Buatkan soal PJOK SD tentang teknik melempar bola kasti melambung/mendatar dan menangkap bola dengan dua tangan",
        "difficulty": "EASY"
      },
      {
        "label": "Latihan Keseimbangan & Kelincahan Anak",
        "prompt": "Buatkan soal PJOK SD tentang berjalan di atas balok titian, berdiri satu kaki seperti bangau, dan lari bolak-balik",
        "difficulty": "EASY"
      },
      {
        "label": "Sikap Tubuh yang Benar: Duduk, Berdiri, Berjalan",
        "prompt": "Buatkan soal PJOK SD tentang menjaga postur tulang belakang tegak saat menulis dan membawa tas sekolah",
        "difficulty": "EASY"
      },
      {
        "label": "Senam Lantai Sederhana: Roll Depan & Sikap Lilin",
        "prompt": "Buatkan soal PJOK SD tentang posisi dagu menempel dada saat guling depan di atas matras senam",
        "difficulty": "EASY"
      },
      {
        "label": "Senam Irama (SKJ) Anak Berkelompok",
        "prompt": "Buatkan soal PJOK SD tentang gerakan langkah kaki dan ayunan tangan mengikuti irama musik senam",
        "difficulty": "EASY"
      },
      {
        "label": "Pengenalan Air & Keselamatan di Kolam Renang",
        "prompt": "Buatkan soal PJOK SD tentang latihan pernapasan memasukkan wajah ke air dan mematuhi tata tertib kolam",
        "difficulty": "EASY"
      },
      {
        "label": "Kebersihan Diri: Gigi, Kuku, Kulit, & Pakaian",
        "prompt": "Buatkan soal PJOK SD tentang cara menyikat gigi yang benar dan mencuci tangan dengan sabun",
        "difficulty": "EASY"
      },
      {
        "label": "Pola Makan Bergizi & Jajanan Sehat di Sekolah",
        "prompt": "Buatkan soal PJOK SD tentang makanan pokok, lauk pauk, sayur, buah, serta menghindari makanan berpemanis buatan",
        "difficulty": "EASY"
      },
      {
        "label": "P3K Dasar: Menangani Luka Lecet & Tergores",
        "prompt": "Buatkan soal PJOK SD tentang membersihkan luka dengan air bersih dan membalut luka dengan plester",
        "difficulty": "EASY"
      },
      {
        "label": "Permainan Tradisional: Gobak Sodor & Engklek",
        "prompt": "Buatkan soal PJOK SD tentang aturan sportif dalam permainan tradisional anak nusantara",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Gerak Lokomotor: Jalan, Lari, & Lompat",
        "prompt": "Buatkan soal PJOK SD tentang variasi berjalan lurus/zig-zag, berlari cepat, dan melompat rintangan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Gerak Non-Lokomotor: Memutar & Menekuk Tubuh",
        "prompt": "Buatkan soal PJOK SD tentang peregangan statis, menekuk lutut, mengayun lengan, dan memutar pinggang",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Gerak Manipulatif: Melempar & Menangkap Bola",
        "prompt": "Buatkan soal PJOK SD tentang teknik melempar bola kasti melambung/mendatar dan menangkap bola dengan dua tangan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Latihan Keseimbangan & Kelincahan Anak",
        "prompt": "Buatkan soal PJOK SD tentang berjalan di atas balok titian, berdiri satu kaki seperti bangau, dan lari bolak-balik",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sikap Tubuh yang Benar: Duduk, Berdiri, Berjalan",
        "prompt": "Buatkan soal PJOK SD tentang menjaga postur tulang belakang tegak saat menulis dan membawa tas sekolah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Senam Lantai Sederhana: Roll Depan & Sikap Lilin",
        "prompt": "Buatkan soal PJOK SD tentang posisi dagu menempel dada saat guling depan di atas matras senam",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Senam Irama (SKJ) Anak Berkelompok",
        "prompt": "Buatkan soal PJOK SD tentang gerakan langkah kaki dan ayunan tangan mengikuti irama musik senam",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pengenalan Air & Keselamatan di Kolam Renang",
        "prompt": "Buatkan soal PJOK SD tentang latihan pernapasan memasukkan wajah ke air dan mematuhi tata tertib kolam",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kebersihan Diri: Gigi, Kuku, Kulit, & Pakaian",
        "prompt": "Buatkan soal PJOK SD tentang cara menyikat gigi yang benar dan mencuci tangan dengan sabun",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pola Makan Bergizi & Jajanan Sehat di Sekolah",
        "prompt": "Buatkan soal PJOK SD tentang makanan pokok, lauk pauk, sayur, buah, serta menghindari makanan berpemanis buatan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "P3K Dasar: Menangani Luka Lecet & Tergores",
        "prompt": "Buatkan soal PJOK SD tentang membersihkan luka dengan air bersih dan membalut luka dengan plester",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Permainan Tradisional: Gobak Sodor & Engklek",
        "prompt": "Buatkan soal PJOK SD tentang aturan sportif dalam permainan tradisional anak nusantara",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Gerak Lokomotor: Jalan, Lari, & Lompat",
        "prompt": "Buatkan soal PJOK SD tentang variasi berjalan lurus/zig-zag, berlari cepat, dan melompat rintangan",
        "difficulty": "HARD"
      },
      {
        "label": "Gerak Non-Lokomotor: Memutar & Menekuk Tubuh",
        "prompt": "Buatkan soal PJOK SD tentang peregangan statis, menekuk lutut, mengayun lengan, dan memutar pinggang",
        "difficulty": "HARD"
      },
      {
        "label": "Gerak Manipulatif: Melempar & Menangkap Bola",
        "prompt": "Buatkan soal PJOK SD tentang teknik melempar bola kasti melambung/mendatar dan menangkap bola dengan dua tangan",
        "difficulty": "HARD"
      },
      {
        "label": "Latihan Keseimbangan & Kelincahan Anak",
        "prompt": "Buatkan soal PJOK SD tentang berjalan di atas balok titian, berdiri satu kaki seperti bangau, dan lari bolak-balik",
        "difficulty": "HARD"
      },
      {
        "label": "Sikap Tubuh yang Benar: Duduk, Berdiri, Berjalan",
        "prompt": "Buatkan soal PJOK SD tentang menjaga postur tulang belakang tegak saat menulis dan membawa tas sekolah",
        "difficulty": "HARD"
      },
      {
        "label": "Senam Lantai Sederhana: Roll Depan & Sikap Lilin",
        "prompt": "Buatkan soal PJOK SD tentang posisi dagu menempel dada saat guling depan di atas matras senam",
        "difficulty": "HARD"
      },
      {
        "label": "Senam Irama (SKJ) Anak Berkelompok",
        "prompt": "Buatkan soal PJOK SD tentang gerakan langkah kaki dan ayunan tangan mengikuti irama musik senam",
        "difficulty": "HARD"
      },
      {
        "label": "Pengenalan Air & Keselamatan di Kolam Renang",
        "prompt": "Buatkan soal PJOK SD tentang latihan pernapasan memasukkan wajah ke air dan mematuhi tata tertib kolam",
        "difficulty": "HARD"
      },
      {
        "label": "Kebersihan Diri: Gigi, Kuku, Kulit, & Pakaian",
        "prompt": "Buatkan soal PJOK SD tentang cara menyikat gigi yang benar dan mencuci tangan dengan sabun",
        "difficulty": "HARD"
      },
      {
        "label": "Pola Makan Bergizi & Jajanan Sehat di Sekolah",
        "prompt": "Buatkan soal PJOK SD tentang makanan pokok, lauk pauk, sayur, buah, serta menghindari makanan berpemanis buatan",
        "difficulty": "HARD"
      },
      {
        "label": "P3K Dasar: Menangani Luka Lecet & Tergores",
        "prompt": "Buatkan soal PJOK SD tentang membersihkan luka dengan air bersih dan membalut luka dengan plester",
        "difficulty": "HARD"
      },
      {
        "label": "Permainan Tradisional: Gobak Sodor & Engklek",
        "prompt": "Buatkan soal PJOK SD tentang aturan sportif dalam permainan tradisional anak nusantara",
        "difficulty": "HARD"
      }
    ]
  },
  "agama": {
    "EASY": [
      {
        "label": "Rukun Iman & Rukun Islam / Kasih Tuhan",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang rukun iman, rukun Islam, atau ajaran dasar kasih dan ciptaan Tuhan",
        "difficulty": "EASY"
      },
      {
        "label": "Doa-Doa Harian Anak Sebelum Beraktivitas",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang doa sebelum makan, tidur, belajar, dan adab berdoa",
        "difficulty": "EASY"
      },
      {
        "label": "Kisah Keteladanan Tokoh Nabi & Kitab Suci",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang sifat sabar, kasih sayang, dan kejujuran tokoh-tokoh teladan",
        "difficulty": "EASY"
      },
      {
        "label": "Berbakti kepada Orang Tua & Menghormati Guru",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang berbuat baik kepada ayah-ibu dan mendengarkan nasihat guru di sekolah",
        "difficulty": "EASY"
      },
      {
        "label": "Perilaku Terpuji: Jujur, Rendah Hati, & Suka Menolong",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang berkata jujur, tidak sombong, dan senang berbagi bekal dengan kawan",
        "difficulty": "EASY"
      },
      {
        "label": "Tata Cara Bersuci (Wudhu) & Gerakan Ibadah",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang urutan wudhu yang tertib dan gerakan serta bacaan sholat/ibadah harian",
        "difficulty": "EASY"
      },
      {
        "label": "Adab Membaca & Menjaga Kitab Suci",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang menjaga kesucian kitab suci dan membaca dengan tenang",
        "difficulty": "EASY"
      },
      {
        "label": "Menyayangi Hewan & Tumbuhan Ciptaan Tuhan",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang merawat binatang peliharaan dan menyirami tanaman sekitar rumah",
        "difficulty": "EASY"
      },
      {
        "label": "Sikap Santun & Menghindari Pertengkaran",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang memaafkan kesalahan teman, berbicara santun, dan hidup rukun",
        "difficulty": "EASY"
      },
      {
        "label": "Mengenal Hari-Hari Besar Keagamaan",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang perayaan Idul Fitri/Natal/Nyepi/Waisak dan makna berbagi",
        "difficulty": "EASY"
      },
      {
        "label": "Rasa Syukur atas Karunia Kesehatan & Keluarga",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang bersyukur melalui perbuatan baik dan menjaga nikmat Tuhan",
        "difficulty": "EASY"
      },
      {
        "label": "Menjaga Kebersihan Lingkungan Sekolah",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang kebersihan sebagai bagian penting dari ajaran iman",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Rukun Iman & Rukun Islam / Kasih Tuhan",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang rukun iman, rukun Islam, atau ajaran dasar kasih dan ciptaan Tuhan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Doa-Doa Harian Anak Sebelum Beraktivitas",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang doa sebelum makan, tidur, belajar, dan adab berdoa",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kisah Keteladanan Tokoh Nabi & Kitab Suci",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang sifat sabar, kasih sayang, dan kejujuran tokoh-tokoh teladan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Berbakti kepada Orang Tua & Menghormati Guru",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang berbuat baik kepada ayah-ibu dan mendengarkan nasihat guru di sekolah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Perilaku Terpuji: Jujur, Rendah Hati, & Suka Menolong",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang berkata jujur, tidak sombong, dan senang berbagi bekal dengan kawan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Tata Cara Bersuci (Wudhu) & Gerakan Ibadah",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang urutan wudhu yang tertib dan gerakan serta bacaan sholat/ibadah harian",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Adab Membaca & Menjaga Kitab Suci",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang menjaga kesucian kitab suci dan membaca dengan tenang",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menyayangi Hewan & Tumbuhan Ciptaan Tuhan",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang merawat binatang peliharaan dan menyirami tanaman sekitar rumah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sikap Santun & Menghindari Pertengkaran",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang memaafkan kesalahan teman, berbicara santun, dan hidup rukun",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mengenal Hari-Hari Besar Keagamaan",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang perayaan Idul Fitri/Natal/Nyepi/Waisak dan makna berbagi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Rasa Syukur atas Karunia Kesehatan & Keluarga",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang bersyukur melalui perbuatan baik dan menjaga nikmat Tuhan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menjaga Kebersihan Lingkungan Sekolah",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang kebersihan sebagai bagian penting dari ajaran iman",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Rukun Iman & Rukun Islam / Kasih Tuhan",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang rukun iman, rukun Islam, atau ajaran dasar kasih dan ciptaan Tuhan",
        "difficulty": "HARD"
      },
      {
        "label": "Doa-Doa Harian Anak Sebelum Beraktivitas",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang doa sebelum makan, tidur, belajar, dan adab berdoa",
        "difficulty": "HARD"
      },
      {
        "label": "Kisah Keteladanan Tokoh Nabi & Kitab Suci",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang sifat sabar, kasih sayang, dan kejujuran tokoh-tokoh teladan",
        "difficulty": "HARD"
      },
      {
        "label": "Berbakti kepada Orang Tua & Menghormati Guru",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang berbuat baik kepada ayah-ibu dan mendengarkan nasihat guru di sekolah",
        "difficulty": "HARD"
      },
      {
        "label": "Perilaku Terpuji: Jujur, Rendah Hati, & Suka Menolong",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang berkata jujur, tidak sombong, dan senang berbagi bekal dengan kawan",
        "difficulty": "HARD"
      },
      {
        "label": "Tata Cara Bersuci (Wudhu) & Gerakan Ibadah",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang urutan wudhu yang tertib dan gerakan serta bacaan sholat/ibadah harian",
        "difficulty": "HARD"
      },
      {
        "label": "Adab Membaca & Menjaga Kitab Suci",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang menjaga kesucian kitab suci dan membaca dengan tenang",
        "difficulty": "HARD"
      },
      {
        "label": "Menyayangi Hewan & Tumbuhan Ciptaan Tuhan",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang merawat binatang peliharaan dan menyirami tanaman sekitar rumah",
        "difficulty": "HARD"
      },
      {
        "label": "Sikap Santun & Menghindari Pertengkaran",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang memaafkan kesalahan teman, berbicara santun, dan hidup rukun",
        "difficulty": "HARD"
      },
      {
        "label": "Mengenal Hari-Hari Besar Keagamaan",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang perayaan Idul Fitri/Natal/Nyepi/Waisak dan makna berbagi",
        "difficulty": "HARD"
      },
      {
        "label": "Rasa Syukur atas Karunia Kesehatan & Keluarga",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang bersyukur melalui perbuatan baik dan menjaga nikmat Tuhan",
        "difficulty": "HARD"
      },
      {
        "label": "Menjaga Kebersihan Lingkungan Sekolah",
        "prompt": "Buatkan soal Pendidikan Agama SD tentang kebersihan sebagai bagian penting dari ajaran iman",
        "difficulty": "HARD"
      }
    ]
  }
};

export const SMP_SUBJECT_TOPICS: Record<string, SubjectDifficultyMap> = {
  "inggris": {
    "EASY": [
      {
        "label": "Greetings, Farewells, & Parting Expressions",
        "prompt": "Buatkan soal Kurikulum Standar tentang Greetings, Farewells, & Parting Expressions",
        "difficulty": "EASY"
      },
      {
        "label": "Self & Family Introduction (SMP)",
        "prompt": "Buatkan soal Kurikulum Standar tentang Self & Family Introduction (SMP)",
        "difficulty": "EASY"
      },
      {
        "label": "Telling Time, Days, Dates, & Months",
        "prompt": "Buatkan soal Kurikulum Standar tentang Telling Time, Days, Dates, & Months",
        "difficulty": "EASY"
      },
      {
        "label": "Descriptive Text: Tourism Spots & Famous People",
        "prompt": "Buatkan soal Kurikulum Standar tentang Descriptive Text: Tourism Spots & Famous People",
        "difficulty": "EASY"
      },
      {
        "label": "Procedure Text: Recipes & How-To Manuals",
        "prompt": "Buatkan soal Kurikulum Standar tentang Procedure Text: Recipes & How-To Manuals",
        "difficulty": "EASY"
      },
      {
        "label": "Recount Text: Personal Experiences & Holidays",
        "prompt": "Buatkan soal Kurikulum Standar tentang Recount Text: Personal Experiences & Holidays",
        "difficulty": "EASY"
      },
      {
        "label": "Narrative Text: Local Folklores, Fables, & Legends",
        "prompt": "Buatkan soal Kurikulum Standar tentang Narrative Text: Local Folklores, Fables, & Legends",
        "difficulty": "EASY"
      },
      {
        "label": "Notice, Caution, & Warning Signs in Public Places",
        "prompt": "Buatkan soal Kurikulum Standar tentang Notice, Caution, & Warning Signs in Public Places",
        "difficulty": "EASY"
      },
      {
        "label": "Greeting Cards, Short Messages, & Invitations",
        "prompt": "Buatkan soal Kurikulum Standar tentang Greeting Cards, Short Messages, & Invitations",
        "difficulty": "EASY"
      },
      {
        "label": "Simple Present Tense: Daily Habits & Facts",
        "prompt": "Buatkan soal Kurikulum Standar tentang Simple Present Tense: Daily Habits & Facts",
        "difficulty": "EASY"
      },
      {
        "label": "Simple Past Tense: Regular & Irregular Verbs",
        "prompt": "Buatkan soal Kurikulum Standar tentang Simple Past Tense: Regular & Irregular Verbs",
        "difficulty": "EASY"
      },
      {
        "label": "Degrees of Comparison: Positive, Comparative, Superlative",
        "prompt": "Buatkan soal Kurikulum Standar tentang Degrees of Comparison: Positive, Comparative, Superlative",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Greetings, Farewells, & Parting Expressions",
        "prompt": "Buatkan soal Kurikulum Standar tentang Greetings, Farewells, & Parting Expressions",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Self & Family Introduction (SMP)",
        "prompt": "Buatkan soal Kurikulum Standar tentang Self & Family Introduction (SMP)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Telling Time, Days, Dates, & Months",
        "prompt": "Buatkan soal Kurikulum Standar tentang Telling Time, Days, Dates, & Months",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Descriptive Text: Tourism Spots & Famous People",
        "prompt": "Buatkan soal Kurikulum Standar tentang Descriptive Text: Tourism Spots & Famous People",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Procedure Text: Recipes & How-To Manuals",
        "prompt": "Buatkan soal Kurikulum Standar tentang Procedure Text: Recipes & How-To Manuals",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Recount Text: Personal Experiences & Holidays",
        "prompt": "Buatkan soal Kurikulum Standar tentang Recount Text: Personal Experiences & Holidays",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Narrative Text: Local Folklores, Fables, & Legends",
        "prompt": "Buatkan soal Kurikulum Standar tentang Narrative Text: Local Folklores, Fables, & Legends",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Notice, Caution, & Warning Signs in Public Places",
        "prompt": "Buatkan soal Kurikulum Standar tentang Notice, Caution, & Warning Signs in Public Places",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Greeting Cards, Short Messages, & Invitations",
        "prompt": "Buatkan soal Kurikulum Standar tentang Greeting Cards, Short Messages, & Invitations",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Simple Present Tense: Daily Habits & Facts",
        "prompt": "Buatkan soal Kurikulum Standar tentang Simple Present Tense: Daily Habits & Facts",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Simple Past Tense: Regular & Irregular Verbs",
        "prompt": "Buatkan soal Kurikulum Standar tentang Simple Past Tense: Regular & Irregular Verbs",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Degrees of Comparison: Positive, Comparative, Superlative",
        "prompt": "Buatkan soal Kurikulum Standar tentang Degrees of Comparison: Positive, Comparative, Superlative",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Greetings, Farewells, & Parting Expressions",
        "prompt": "Buatkan soal Kurikulum Standar tentang Greetings, Farewells, & Parting Expressions",
        "difficulty": "HARD"
      },
      {
        "label": "Self & Family Introduction (SMP)",
        "prompt": "Buatkan soal Kurikulum Standar tentang Self & Family Introduction (SMP)",
        "difficulty": "HARD"
      },
      {
        "label": "Telling Time, Days, Dates, & Months",
        "prompt": "Buatkan soal Kurikulum Standar tentang Telling Time, Days, Dates, & Months",
        "difficulty": "HARD"
      },
      {
        "label": "Descriptive Text: Tourism Spots & Famous People",
        "prompt": "Buatkan soal Kurikulum Standar tentang Descriptive Text: Tourism Spots & Famous People",
        "difficulty": "HARD"
      },
      {
        "label": "Procedure Text: Recipes & How-To Manuals",
        "prompt": "Buatkan soal Kurikulum Standar tentang Procedure Text: Recipes & How-To Manuals",
        "difficulty": "HARD"
      },
      {
        "label": "Recount Text: Personal Experiences & Holidays",
        "prompt": "Buatkan soal Kurikulum Standar tentang Recount Text: Personal Experiences & Holidays",
        "difficulty": "HARD"
      },
      {
        "label": "Narrative Text: Local Folklores, Fables, & Legends",
        "prompt": "Buatkan soal Kurikulum Standar tentang Narrative Text: Local Folklores, Fables, & Legends",
        "difficulty": "HARD"
      },
      {
        "label": "Notice, Caution, & Warning Signs in Public Places",
        "prompt": "Buatkan soal Kurikulum Standar tentang Notice, Caution, & Warning Signs in Public Places",
        "difficulty": "HARD"
      },
      {
        "label": "Greeting Cards, Short Messages, & Invitations",
        "prompt": "Buatkan soal Kurikulum Standar tentang Greeting Cards, Short Messages, & Invitations",
        "difficulty": "HARD"
      },
      {
        "label": "Simple Present Tense: Daily Habits & Facts",
        "prompt": "Buatkan soal Kurikulum Standar tentang Simple Present Tense: Daily Habits & Facts",
        "difficulty": "HARD"
      },
      {
        "label": "Simple Past Tense: Regular & Irregular Verbs",
        "prompt": "Buatkan soal Kurikulum Standar tentang Simple Past Tense: Regular & Irregular Verbs",
        "difficulty": "HARD"
      },
      {
        "label": "Degrees of Comparison: Positive, Comparative, Superlative",
        "prompt": "Buatkan soal Kurikulum Standar tentang Degrees of Comparison: Positive, Comparative, Superlative",
        "difficulty": "HARD"
      }
    ]
  },
  "matematika": {
    "EASY": [
      {
        "label": "Operasi Bilangan Bulat, Pecahan, & Pola Bilangan",
        "prompt": "Buatkan soal matematika SMP tentang operasi hitung bilangan bulat, pecahan bertingkat, dan pola barisan bilangan",
        "difficulty": "EASY"
      },
      {
        "label": "Bentuk Aljabar: Suku, Koefisien, & Faktorisasi",
        "prompt": "Buatkan soal matematika SMP tentang penjumlahan, pengurangan, perkalian suku aljabar, dan faktorisasi bentuk kuadrat",
        "difficulty": "EASY"
      },
      {
        "label": "Persamaan & Pertidaksamaan Linear Satu Variabel (PLSV)",
        "prompt": "Buatkan soal matematika SMP tentang mencari nilai variabel penyelesaian PLSV dan soal cerita penerapannya",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Persamaan Linear Dua Variabel (SPLDV)",
        "prompt": "Buatkan soal matematika SMP tentang menyelesaikan SPLDV metode eliminasi dan substitusi pada studi kasus kontekstual",
        "difficulty": "EASY"
      },
      {
        "label": "Teorema Pythagoras & Segitiga Siku-Siku",
        "prompt": "Buatkan soal matematika SMP tentang tripel Pythagoras, menghitung panjang sisi miring segitiga, dan penerapannya",
        "difficulty": "EASY"
      },
      {
        "label": "Lingkaran: Keliling, Luas, Busur, & Juring",
        "prompt": "Buatkan soal matematika SMP tentang menghitung sudut pusat, sudut keliling, panjang busur lingkaran, dan luas juring",
        "difficulty": "EASY"
      },
      {
        "label": "Bangun Ruang Sisi Datar (Kubus, Balok, Prisma, Limas)",
        "prompt": "Buatkan soal matematika SMP tentang luas permukaan dan volume bangun ruang sisi datar serta jaring-jaringnya",
        "difficulty": "EASY"
      },
      {
        "label": "Bangun Ruang Sisi Lengkung (Tabung, Kerucut, Bola)",
        "prompt": "Buatkan soal matematika SMP tentang volume dan luas selimut tabung, kerucut, serta bola pada soal cerita",
        "difficulty": "EASY"
      },
      {
        "label": "Relasi & Fungsi: Domain, Kodomain, & Range",
        "prompt": "Buatkan soal matematika SMP tentang diagram panah relasi, himpunan pasangan berurutan, dan rumus nilai fungsi f(x)",
        "difficulty": "EASY"
      },
      {
        "label": "Persamaan Garis Lurus: Gradien & Titik Potong",
        "prompt": "Buatkan soal matematika SMP tentang menentukan gradien garis (m), garis sejajar/tegak lurus, dan grafik persamaan",
        "difficulty": "EASY"
      },
      {
        "label": "Statistika SMP: Mean, Median, Modus, & Diagram",
        "prompt": "Buatkan soal matematika SMP tentang ukuran pemusatan data tunggal/kelompok dan interpretasi diagram lingkaran",
        "difficulty": "EASY"
      },
      {
        "label": "Peluang Teoretik & Peluang Empirik Sederhana",
        "prompt": "Buatkan soal matematika SMP tentang ruang sampel pelemparan koin/dadu dan peluang kejadian tunggal",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Operasi Bilangan Bulat, Pecahan, & Pola Bilangan",
        "prompt": "Buatkan soal matematika SMP tentang operasi hitung bilangan bulat, pecahan bertingkat, dan pola barisan bilangan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Bentuk Aljabar: Suku, Koefisien, & Faktorisasi",
        "prompt": "Buatkan soal matematika SMP tentang penjumlahan, pengurangan, perkalian suku aljabar, dan faktorisasi bentuk kuadrat",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Persamaan & Pertidaksamaan Linear Satu Variabel (PLSV)",
        "prompt": "Buatkan soal matematika SMP tentang mencari nilai variabel penyelesaian PLSV dan soal cerita penerapannya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Persamaan Linear Dua Variabel (SPLDV)",
        "prompt": "Buatkan soal matematika SMP tentang menyelesaikan SPLDV metode eliminasi dan substitusi pada studi kasus kontekstual",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teorema Pythagoras & Segitiga Siku-Siku",
        "prompt": "Buatkan soal matematika SMP tentang tripel Pythagoras, menghitung panjang sisi miring segitiga, dan penerapannya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Lingkaran: Keliling, Luas, Busur, & Juring",
        "prompt": "Buatkan soal matematika SMP tentang menghitung sudut pusat, sudut keliling, panjang busur lingkaran, dan luas juring",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Bangun Ruang Sisi Datar (Kubus, Balok, Prisma, Limas)",
        "prompt": "Buatkan soal matematika SMP tentang luas permukaan dan volume bangun ruang sisi datar serta jaring-jaringnya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Bangun Ruang Sisi Lengkung (Tabung, Kerucut, Bola)",
        "prompt": "Buatkan soal matematika SMP tentang volume dan luas selimut tabung, kerucut, serta bola pada soal cerita",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Relasi & Fungsi: Domain, Kodomain, & Range",
        "prompt": "Buatkan soal matematika SMP tentang diagram panah relasi, himpunan pasangan berurutan, dan rumus nilai fungsi f(x)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Persamaan Garis Lurus: Gradien & Titik Potong",
        "prompt": "Buatkan soal matematika SMP tentang menentukan gradien garis (m), garis sejajar/tegak lurus, dan grafik persamaan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Statistika SMP: Mean, Median, Modus, & Diagram",
        "prompt": "Buatkan soal matematika SMP tentang ukuran pemusatan data tunggal/kelompok dan interpretasi diagram lingkaran",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Peluang Teoretik & Peluang Empirik Sederhana",
        "prompt": "Buatkan soal matematika SMP tentang ruang sampel pelemparan koin/dadu dan peluang kejadian tunggal",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Operasi Bilangan Bulat, Pecahan, & Pola Bilangan",
        "prompt": "Buatkan soal matematika SMP tentang operasi hitung bilangan bulat, pecahan bertingkat, dan pola barisan bilangan",
        "difficulty": "HARD"
      },
      {
        "label": "Bentuk Aljabar: Suku, Koefisien, & Faktorisasi",
        "prompt": "Buatkan soal matematika SMP tentang penjumlahan, pengurangan, perkalian suku aljabar, dan faktorisasi bentuk kuadrat",
        "difficulty": "HARD"
      },
      {
        "label": "Persamaan & Pertidaksamaan Linear Satu Variabel (PLSV)",
        "prompt": "Buatkan soal matematika SMP tentang mencari nilai variabel penyelesaian PLSV dan soal cerita penerapannya",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Persamaan Linear Dua Variabel (SPLDV)",
        "prompt": "Buatkan soal matematika SMP tentang menyelesaikan SPLDV metode eliminasi dan substitusi pada studi kasus kontekstual",
        "difficulty": "HARD"
      },
      {
        "label": "Teorema Pythagoras & Segitiga Siku-Siku",
        "prompt": "Buatkan soal matematika SMP tentang tripel Pythagoras, menghitung panjang sisi miring segitiga, dan penerapannya",
        "difficulty": "HARD"
      },
      {
        "label": "Lingkaran: Keliling, Luas, Busur, & Juring",
        "prompt": "Buatkan soal matematika SMP tentang menghitung sudut pusat, sudut keliling, panjang busur lingkaran, dan luas juring",
        "difficulty": "HARD"
      },
      {
        "label": "Bangun Ruang Sisi Datar (Kubus, Balok, Prisma, Limas)",
        "prompt": "Buatkan soal matematika SMP tentang luas permukaan dan volume bangun ruang sisi datar serta jaring-jaringnya",
        "difficulty": "HARD"
      },
      {
        "label": "Bangun Ruang Sisi Lengkung (Tabung, Kerucut, Bola)",
        "prompt": "Buatkan soal matematika SMP tentang volume dan luas selimut tabung, kerucut, serta bola pada soal cerita",
        "difficulty": "HARD"
      },
      {
        "label": "Relasi & Fungsi: Domain, Kodomain, & Range",
        "prompt": "Buatkan soal matematika SMP tentang diagram panah relasi, himpunan pasangan berurutan, dan rumus nilai fungsi f(x)",
        "difficulty": "HARD"
      },
      {
        "label": "Persamaan Garis Lurus: Gradien & Titik Potong",
        "prompt": "Buatkan soal matematika SMP tentang menentukan gradien garis (m), garis sejajar/tegak lurus, dan grafik persamaan",
        "difficulty": "HARD"
      },
      {
        "label": "Statistika SMP: Mean, Median, Modus, & Diagram",
        "prompt": "Buatkan soal matematika SMP tentang ukuran pemusatan data tunggal/kelompok dan interpretasi diagram lingkaran",
        "difficulty": "HARD"
      },
      {
        "label": "Peluang Teoretik & Peluang Empirik Sederhana",
        "prompt": "Buatkan soal matematika SMP tentang ruang sampel pelemparan koin/dadu dan peluang kejadian tunggal",
        "difficulty": "HARD"
      }
    ]
  },
  "indonesia": {
    "EASY": [
      {
        "label": "Teks Laporan Hasil Observasi (LHO)",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang struktur definisi umum, deskripsi bagian, fakta objektif, dan istilah teknis LHO",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Prosedur: Struktur Langkah & Bahasa Imperatif",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang kalimat perintah, konjungsi urutan, dan kelengkapan langkah teks prosedur",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Cerita Fantasi: Orientasi, Konflik, Resolusi",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang unsur magis/keajaiban, latar lintas waktu, dan alur cerita fantasi",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Cerpen: Unsur Intrinsik & Sudut Pandang",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang tema, perwatakan tokoh, latar, sudut pandang orang pertama/ketiga, dan amanat cerpen",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Puisi: Diksi, Majas, & Rima",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang makna denotatif/konotatif diksi puisi, pencitraan, dan gaya bahasa",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Eksplanasi: Fenomena Alam & Sosial",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang pola kausalitas sebab-akibat dan urutan kronologis terjadinya fenomena",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Berita: Unsur Adiksimba (5W+1H) & Kaidah Bahasa",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang kepala berita, tubuh berita, kalimat langsung/tidak langsung, dan verba mental",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Iklan, Slogan, dan Poster",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang kalimat persuasif, pesan tersurat/tersirat, dan efektivitas slogan/poster",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Pidato Persuasif: Gagasan, Argumen, & Ajakan",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang struktur pidato persuasif, etika berargumen, dan kalimat ajakan membujuk",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Tanggapan Kritis terhadap Karya & Fenomena",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang struktur konteks, deskripsi, penilaian, dan bahasa santun mengkritik",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Diskusi: Sudut Pandang Pro dan Kontra",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang isu kontroversial, argumen pendukung, argumen penentang, dan simpulan jalan tengah",
        "difficulty": "EASY"
      },
      {
        "label": "Resensi Buku Fiksi & Nonfiksi (Ulasan)",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang kelebihan, kekurangan, identitas buku, dan rekomendasi pembaca",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Teks Laporan Hasil Observasi (LHO)",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang struktur definisi umum, deskripsi bagian, fakta objektif, dan istilah teknis LHO",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Prosedur: Struktur Langkah & Bahasa Imperatif",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang kalimat perintah, konjungsi urutan, dan kelengkapan langkah teks prosedur",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Cerita Fantasi: Orientasi, Konflik, Resolusi",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang unsur magis/keajaiban, latar lintas waktu, dan alur cerita fantasi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Cerpen: Unsur Intrinsik & Sudut Pandang",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang tema, perwatakan tokoh, latar, sudut pandang orang pertama/ketiga, dan amanat cerpen",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Puisi: Diksi, Majas, & Rima",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang makna denotatif/konotatif diksi puisi, pencitraan, dan gaya bahasa",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Eksplanasi: Fenomena Alam & Sosial",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang pola kausalitas sebab-akibat dan urutan kronologis terjadinya fenomena",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Berita: Unsur Adiksimba (5W+1H) & Kaidah Bahasa",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang kepala berita, tubuh berita, kalimat langsung/tidak langsung, dan verba mental",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Iklan, Slogan, dan Poster",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang kalimat persuasif, pesan tersurat/tersirat, dan efektivitas slogan/poster",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Pidato Persuasif: Gagasan, Argumen, & Ajakan",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang struktur pidato persuasif, etika berargumen, dan kalimat ajakan membujuk",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Tanggapan Kritis terhadap Karya & Fenomena",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang struktur konteks, deskripsi, penilaian, dan bahasa santun mengkritik",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Diskusi: Sudut Pandang Pro dan Kontra",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang isu kontroversial, argumen pendukung, argumen penentang, dan simpulan jalan tengah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Resensi Buku Fiksi & Nonfiksi (Ulasan)",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang kelebihan, kekurangan, identitas buku, dan rekomendasi pembaca",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Teks Laporan Hasil Observasi (LHO)",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang struktur definisi umum, deskripsi bagian, fakta objektif, dan istilah teknis LHO",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Prosedur: Struktur Langkah & Bahasa Imperatif",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang kalimat perintah, konjungsi urutan, dan kelengkapan langkah teks prosedur",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Cerita Fantasi: Orientasi, Konflik, Resolusi",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang unsur magis/keajaiban, latar lintas waktu, dan alur cerita fantasi",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Cerpen: Unsur Intrinsik & Sudut Pandang",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang tema, perwatakan tokoh, latar, sudut pandang orang pertama/ketiga, dan amanat cerpen",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Puisi: Diksi, Majas, & Rima",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang makna denotatif/konotatif diksi puisi, pencitraan, dan gaya bahasa",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Eksplanasi: Fenomena Alam & Sosial",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang pola kausalitas sebab-akibat dan urutan kronologis terjadinya fenomena",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Berita: Unsur Adiksimba (5W+1H) & Kaidah Bahasa",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang kepala berita, tubuh berita, kalimat langsung/tidak langsung, dan verba mental",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Iklan, Slogan, dan Poster",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang kalimat persuasif, pesan tersurat/tersirat, dan efektivitas slogan/poster",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Pidato Persuasif: Gagasan, Argumen, & Ajakan",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang struktur pidato persuasif, etika berargumen, dan kalimat ajakan membujuk",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Tanggapan Kritis terhadap Karya & Fenomena",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang struktur konteks, deskripsi, penilaian, dan bahasa santun mengkritik",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Diskusi: Sudut Pandang Pro dan Kontra",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang isu kontroversial, argumen pendukung, argumen penentang, dan simpulan jalan tengah",
        "difficulty": "HARD"
      },
      {
        "label": "Resensi Buku Fiksi & Nonfiksi (Ulasan)",
        "prompt": "Buatkan soal Bahasa Indonesia SMP tentang kelebihan, kekurangan, identitas buku, dan rekomendasi pembaca",
        "difficulty": "HARD"
      }
    ]
  },
  "ipa": {
    "EASY": [
      {
        "label": "Besaran, Satuan, & Pengukuran Jangka Sorong/Mikrometer",
        "prompt": "Buatkan soal IPA SMP tentang besaran pokok vs turunan, membaca skala jangka sorong, dan mikrometer sekrup",
        "difficulty": "EASY"
      },
      {
        "label": "Klasifikasi Makhluk Hidup & Kunci Determinasi",
        "prompt": "Buatkan soal IPA SMP tentang taksonomi 5 kingdom, ciri vertebrata/invertebrata, dan penggunaan kunci dikotom",
        "difficulty": "EASY"
      },
      {
        "label": "Organisasi Kehidupan: Sel, Jaringan, Organ, Sistem Organ",
        "prompt": "Buatkan soal IPA SMP tentang bagian mikroskop, struktur sel tumbuhan vs hewan, dan fungsi jaringan",
        "difficulty": "EASY"
      },
      {
        "label": "Gerak Lurus (GLB & GLBB) serta Hukum Newton",
        "prompt": "Buatkan soal IPA SMP tentang kecepatan, percepatan, grafik v-t, serta penerapan Hukum Newton I, II, dan III",
        "difficulty": "EASY"
      },
      {
        "label": "Usaha, Energi, & Pesawat Sederhana (Tuas, Katrol)",
        "prompt": "Buatkan soal IPA SMP tentang rumus W=F.s, energi potensial/kinetik, dan keuntungan mekanik tuas/bidang miring",
        "difficulty": "EASY"
      },
      {
        "label": "Tekanan Zat: Hidrostatis, Hukum Pascal, & Archimedes",
        "prompt": "Buatkan soal IPA SMP tentang bejana berhubungan, pompa hidrolik, dan gaya apung benda terapung/melayang/tenggelam",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Pencernaan & Uji Nutrisi Makanan Manusia",
        "prompt": "Buatkan soal IPA SMP tentang fungsi lambung, usus, enzim pencernaan, dan reagen uji amilum/glukosa/protein",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Peredaran Darah & Jantung Manusia",
        "prompt": "Buatkan soal IPA SMP tentang peredaran darah ganda, pembuluh arteri vs vena, golongan darah ABO, dan hipertensi",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Pernapasan & Mekanisme Pertukaran Gas",
        "prompt": "Buatkan soal IPA SMP tentang inspirasi-ekspirasi dada/perut, difusi di alveolus, dan gangguan asma/TBC",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Ekskresi: Ginjal, Kulit, Hati, & Paru-Paru",
        "prompt": "Buatkan soal IPA SMP tentang tahapan pembentukan urine (filtrasi, reabsorpsi, augmentasi) pada nefron ginjal",
        "difficulty": "EASY"
      },
      {
        "label": "Getaran, Gelombang, & Cepat Rambat Bunyi",
        "prompt": "Buatkan soal IPA SMP tentang periode, frekuensi, gelombang transversal/longitudinal, dan resonansi bunyi",
        "difficulty": "EASY"
      },
      {
        "label": "Cahaya, Optik, & Pembentukan Bayangan Cermin/Lensa",
        "prompt": "Buatkan soal IPA SMP tentang hukum pemantulan, cermin cekung/cembung, kekuatan lensa kacamata miopi",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Besaran, Satuan, & Pengukuran Jangka Sorong/Mikrometer",
        "prompt": "Buatkan soal IPA SMP tentang besaran pokok vs turunan, membaca skala jangka sorong, dan mikrometer sekrup",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Klasifikasi Makhluk Hidup & Kunci Determinasi",
        "prompt": "Buatkan soal IPA SMP tentang taksonomi 5 kingdom, ciri vertebrata/invertebrata, dan penggunaan kunci dikotom",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Organisasi Kehidupan: Sel, Jaringan, Organ, Sistem Organ",
        "prompt": "Buatkan soal IPA SMP tentang bagian mikroskop, struktur sel tumbuhan vs hewan, dan fungsi jaringan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Gerak Lurus (GLB & GLBB) serta Hukum Newton",
        "prompt": "Buatkan soal IPA SMP tentang kecepatan, percepatan, grafik v-t, serta penerapan Hukum Newton I, II, dan III",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Usaha, Energi, & Pesawat Sederhana (Tuas, Katrol)",
        "prompt": "Buatkan soal IPA SMP tentang rumus W=F.s, energi potensial/kinetik, dan keuntungan mekanik tuas/bidang miring",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Tekanan Zat: Hidrostatis, Hukum Pascal, & Archimedes",
        "prompt": "Buatkan soal IPA SMP tentang bejana berhubungan, pompa hidrolik, dan gaya apung benda terapung/melayang/tenggelam",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Pencernaan & Uji Nutrisi Makanan Manusia",
        "prompt": "Buatkan soal IPA SMP tentang fungsi lambung, usus, enzim pencernaan, dan reagen uji amilum/glukosa/protein",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Peredaran Darah & Jantung Manusia",
        "prompt": "Buatkan soal IPA SMP tentang peredaran darah ganda, pembuluh arteri vs vena, golongan darah ABO, dan hipertensi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Pernapasan & Mekanisme Pertukaran Gas",
        "prompt": "Buatkan soal IPA SMP tentang inspirasi-ekspirasi dada/perut, difusi di alveolus, dan gangguan asma/TBC",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Ekskresi: Ginjal, Kulit, Hati, & Paru-Paru",
        "prompt": "Buatkan soal IPA SMP tentang tahapan pembentukan urine (filtrasi, reabsorpsi, augmentasi) pada nefron ginjal",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Getaran, Gelombang, & Cepat Rambat Bunyi",
        "prompt": "Buatkan soal IPA SMP tentang periode, frekuensi, gelombang transversal/longitudinal, dan resonansi bunyi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Cahaya, Optik, & Pembentukan Bayangan Cermin/Lensa",
        "prompt": "Buatkan soal IPA SMP tentang hukum pemantulan, cermin cekung/cembung, kekuatan lensa kacamata miopi",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Besaran, Satuan, & Pengukuran Jangka Sorong/Mikrometer",
        "prompt": "Buatkan soal IPA SMP tentang besaran pokok vs turunan, membaca skala jangka sorong, dan mikrometer sekrup",
        "difficulty": "HARD"
      },
      {
        "label": "Klasifikasi Makhluk Hidup & Kunci Determinasi",
        "prompt": "Buatkan soal IPA SMP tentang taksonomi 5 kingdom, ciri vertebrata/invertebrata, dan penggunaan kunci dikotom",
        "difficulty": "HARD"
      },
      {
        "label": "Organisasi Kehidupan: Sel, Jaringan, Organ, Sistem Organ",
        "prompt": "Buatkan soal IPA SMP tentang bagian mikroskop, struktur sel tumbuhan vs hewan, dan fungsi jaringan",
        "difficulty": "HARD"
      },
      {
        "label": "Gerak Lurus (GLB & GLBB) serta Hukum Newton",
        "prompt": "Buatkan soal IPA SMP tentang kecepatan, percepatan, grafik v-t, serta penerapan Hukum Newton I, II, dan III",
        "difficulty": "HARD"
      },
      {
        "label": "Usaha, Energi, & Pesawat Sederhana (Tuas, Katrol)",
        "prompt": "Buatkan soal IPA SMP tentang rumus W=F.s, energi potensial/kinetik, dan keuntungan mekanik tuas/bidang miring",
        "difficulty": "HARD"
      },
      {
        "label": "Tekanan Zat: Hidrostatis, Hukum Pascal, & Archimedes",
        "prompt": "Buatkan soal IPA SMP tentang bejana berhubungan, pompa hidrolik, dan gaya apung benda terapung/melayang/tenggelam",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Pencernaan & Uji Nutrisi Makanan Manusia",
        "prompt": "Buatkan soal IPA SMP tentang fungsi lambung, usus, enzim pencernaan, dan reagen uji amilum/glukosa/protein",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Peredaran Darah & Jantung Manusia",
        "prompt": "Buatkan soal IPA SMP tentang peredaran darah ganda, pembuluh arteri vs vena, golongan darah ABO, dan hipertensi",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Pernapasan & Mekanisme Pertukaran Gas",
        "prompt": "Buatkan soal IPA SMP tentang inspirasi-ekspirasi dada/perut, difusi di alveolus, dan gangguan asma/TBC",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Ekskresi: Ginjal, Kulit, Hati, & Paru-Paru",
        "prompt": "Buatkan soal IPA SMP tentang tahapan pembentukan urine (filtrasi, reabsorpsi, augmentasi) pada nefron ginjal",
        "difficulty": "HARD"
      },
      {
        "label": "Getaran, Gelombang, & Cepat Rambat Bunyi",
        "prompt": "Buatkan soal IPA SMP tentang periode, frekuensi, gelombang transversal/longitudinal, dan resonansi bunyi",
        "difficulty": "HARD"
      },
      {
        "label": "Cahaya, Optik, & Pembentukan Bayangan Cermin/Lensa",
        "prompt": "Buatkan soal IPA SMP tentang hukum pemantulan, cermin cekung/cembung, kekuatan lensa kacamata miopi",
        "difficulty": "HARD"
      }
    ]
  },
  "ips": {
    "EASY": [
      {
        "label": "Letak Geografis & Astronomis Wilayah Indonesia",
        "prompt": "Buatkan soal IPS SMP tentang letak garis lintang-bujur RI, 3 zona waktu (WIB/WITA/WIT), dan iklim tropis",
        "difficulty": "EASY"
      },
      {
        "label": "Potensi Kemaritiman & Sumber Daya Alam Indonesia",
        "prompt": "Buatkan soal IPS SMP tentang kekayaan laut, terumbu karang, hutan mangrove, tambang migas, dan batubara",
        "difficulty": "EASY"
      },
      {
        "label": "Dinamika Kependudukan Indonesia & Bonus Demografi",
        "prompt": "Buatkan soal IPS SMP tentang angka kelahiran/kematian, piramida penduduk, migrasi, dan persebaran pulau Jawa",
        "difficulty": "EASY"
      },
      {
        "label": "Interaksi Antarruang Negara-Negara ASEAN",
        "prompt": "Buatkan soal IPS SMP tentang latar belakang deklarasi Bangkok, batas geografis anggota ASEAN, dan kerjasama ekonomi",
        "difficulty": "EASY"
      },
      {
        "label": "Masa Praaksara di Indonesia: Peninggalan & Fosil",
        "prompt": "Buatkan soal IPS SMP tentang zaman batu (Paleolitikum s.d. Megalitikum), kapak lonjong, dolmen, dan menhir",
        "difficulty": "EASY"
      },
      {
        "label": "Kerajaan Hindu-Buddha di Nusantara",
        "prompt": "Buatkan soal IPS SMP tentang kerajaan Kutai, Tarumanegara, Sriwijaya, Majapahit, dan peninggalan candi Borobudur/Prambanan",
        "difficulty": "EASY"
      },
      {
        "label": "Masuk & Berkembangnya Kerajaan Islam di Indonesia",
        "prompt": "Buatkan soal IPS SMP tentang teori masuknya Islam (Gujarat, Mekkah, Persia), Walisongo, dan kerajaan Demak/Samudera Pasai",
        "difficulty": "EASY"
      },
      {
        "label": "Masa Kolonialisme Bangsa Barat & Perlawanan Rakyat",
        "prompt": "Buatkan soal IPS SMP tentang monopoli rempah-rempah VOC, sistem tanam paksa (Cultuurstelsel), dan perang Diponegoro",
        "difficulty": "EASY"
      },
      {
        "label": "Permintaan, Penawaran, & Terbentuknya Harga Pasar",
        "prompt": "Buatkan soal IPS SMP tentang kurva permintaan-penawaran, faktor yang memengaruhi harga, dan fungsi pasar",
        "difficulty": "EASY"
      },
      {
        "label": "Pelaku Ekonomi: RTK, RTP, Pemerintah, & Luar Negeri",
        "prompt": "Buatkan soal IPS SMP tentang diagram circular flow sederhana dan peran BUMN serta Koperasi",
        "difficulty": "EASY"
      },
      {
        "label": "Masalah Sosial: Kemiskinan & Kesenjangan Sosial",
        "prompt": "Buatkan soal IPS SMP tentang faktor penyebab masalah sosial masyarakat dan upaya penanggulangannya",
        "difficulty": "EASY"
      },
      {
        "label": "Globalisasi & Dampaknya terhadap Kebudayaan Lokal",
        "prompt": "Buatkan soal IPS SMP tentang westernisasi, kemajuan teknologi komunikasi, dan upaya mempertahankan kearifan lokal",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Letak Geografis & Astronomis Wilayah Indonesia",
        "prompt": "Buatkan soal IPS SMP tentang letak garis lintang-bujur RI, 3 zona waktu (WIB/WITA/WIT), dan iklim tropis",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Potensi Kemaritiman & Sumber Daya Alam Indonesia",
        "prompt": "Buatkan soal IPS SMP tentang kekayaan laut, terumbu karang, hutan mangrove, tambang migas, dan batubara",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Dinamika Kependudukan Indonesia & Bonus Demografi",
        "prompt": "Buatkan soal IPS SMP tentang angka kelahiran/kematian, piramida penduduk, migrasi, dan persebaran pulau Jawa",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Interaksi Antarruang Negara-Negara ASEAN",
        "prompt": "Buatkan soal IPS SMP tentang latar belakang deklarasi Bangkok, batas geografis anggota ASEAN, dan kerjasama ekonomi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Masa Praaksara di Indonesia: Peninggalan & Fosil",
        "prompt": "Buatkan soal IPS SMP tentang zaman batu (Paleolitikum s.d. Megalitikum), kapak lonjong, dolmen, dan menhir",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kerajaan Hindu-Buddha di Nusantara",
        "prompt": "Buatkan soal IPS SMP tentang kerajaan Kutai, Tarumanegara, Sriwijaya, Majapahit, dan peninggalan candi Borobudur/Prambanan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Masuk & Berkembangnya Kerajaan Islam di Indonesia",
        "prompt": "Buatkan soal IPS SMP tentang teori masuknya Islam (Gujarat, Mekkah, Persia), Walisongo, dan kerajaan Demak/Samudera Pasai",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Masa Kolonialisme Bangsa Barat & Perlawanan Rakyat",
        "prompt": "Buatkan soal IPS SMP tentang monopoli rempah-rempah VOC, sistem tanam paksa (Cultuurstelsel), dan perang Diponegoro",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Permintaan, Penawaran, & Terbentuknya Harga Pasar",
        "prompt": "Buatkan soal IPS SMP tentang kurva permintaan-penawaran, faktor yang memengaruhi harga, dan fungsi pasar",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pelaku Ekonomi: RTK, RTP, Pemerintah, & Luar Negeri",
        "prompt": "Buatkan soal IPS SMP tentang diagram circular flow sederhana dan peran BUMN serta Koperasi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Masalah Sosial: Kemiskinan & Kesenjangan Sosial",
        "prompt": "Buatkan soal IPS SMP tentang faktor penyebab masalah sosial masyarakat dan upaya penanggulangannya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Globalisasi & Dampaknya terhadap Kebudayaan Lokal",
        "prompt": "Buatkan soal IPS SMP tentang westernisasi, kemajuan teknologi komunikasi, dan upaya mempertahankan kearifan lokal",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Letak Geografis & Astronomis Wilayah Indonesia",
        "prompt": "Buatkan soal IPS SMP tentang letak garis lintang-bujur RI, 3 zona waktu (WIB/WITA/WIT), dan iklim tropis",
        "difficulty": "HARD"
      },
      {
        "label": "Potensi Kemaritiman & Sumber Daya Alam Indonesia",
        "prompt": "Buatkan soal IPS SMP tentang kekayaan laut, terumbu karang, hutan mangrove, tambang migas, dan batubara",
        "difficulty": "HARD"
      },
      {
        "label": "Dinamika Kependudukan Indonesia & Bonus Demografi",
        "prompt": "Buatkan soal IPS SMP tentang angka kelahiran/kematian, piramida penduduk, migrasi, dan persebaran pulau Jawa",
        "difficulty": "HARD"
      },
      {
        "label": "Interaksi Antarruang Negara-Negara ASEAN",
        "prompt": "Buatkan soal IPS SMP tentang latar belakang deklarasi Bangkok, batas geografis anggota ASEAN, dan kerjasama ekonomi",
        "difficulty": "HARD"
      },
      {
        "label": "Masa Praaksara di Indonesia: Peninggalan & Fosil",
        "prompt": "Buatkan soal IPS SMP tentang zaman batu (Paleolitikum s.d. Megalitikum), kapak lonjong, dolmen, dan menhir",
        "difficulty": "HARD"
      },
      {
        "label": "Kerajaan Hindu-Buddha di Nusantara",
        "prompt": "Buatkan soal IPS SMP tentang kerajaan Kutai, Tarumanegara, Sriwijaya, Majapahit, dan peninggalan candi Borobudur/Prambanan",
        "difficulty": "HARD"
      },
      {
        "label": "Masuk & Berkembangnya Kerajaan Islam di Indonesia",
        "prompt": "Buatkan soal IPS SMP tentang teori masuknya Islam (Gujarat, Mekkah, Persia), Walisongo, dan kerajaan Demak/Samudera Pasai",
        "difficulty": "HARD"
      },
      {
        "label": "Masa Kolonialisme Bangsa Barat & Perlawanan Rakyat",
        "prompt": "Buatkan soal IPS SMP tentang monopoli rempah-rempah VOC, sistem tanam paksa (Cultuurstelsel), dan perang Diponegoro",
        "difficulty": "HARD"
      },
      {
        "label": "Permintaan, Penawaran, & Terbentuknya Harga Pasar",
        "prompt": "Buatkan soal IPS SMP tentang kurva permintaan-penawaran, faktor yang memengaruhi harga, dan fungsi pasar",
        "difficulty": "HARD"
      },
      {
        "label": "Pelaku Ekonomi: RTK, RTP, Pemerintah, & Luar Negeri",
        "prompt": "Buatkan soal IPS SMP tentang diagram circular flow sederhana dan peran BUMN serta Koperasi",
        "difficulty": "HARD"
      },
      {
        "label": "Masalah Sosial: Kemiskinan & Kesenjangan Sosial",
        "prompt": "Buatkan soal IPS SMP tentang faktor penyebab masalah sosial masyarakat dan upaya penanggulangannya",
        "difficulty": "HARD"
      },
      {
        "label": "Globalisasi & Dampaknya terhadap Kebudayaan Lokal",
        "prompt": "Buatkan soal IPS SMP tentang westernisasi, kemajuan teknologi komunikasi, dan upaya mempertahankan kearifan lokal",
        "difficulty": "HARD"
      }
    ]
  },
  "pancasila": {
    "EASY": [
      {
        "label": "Sejarah Lahirnya Pancasila & Sidang BPUPKI/PPKI",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang usulan dasar negara oleh Ir. Soekarno, Piagam Jakarta, dan penetapan 18 Agustus 1945",
        "difficulty": "EASY"
      },
      {
        "label": "Kedudukan Pancasila sebagai Dasar & Ideologi Negara",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang fungsi Pancasila sebagai pandangan hidup bangsa dan sumber segala hukum",
        "difficulty": "EASY"
      },
      {
        "label": "Pembukaan UUD 1945 & Makna 4 Alinea",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang pokok pikiran Pembukaan UUD NRI 1945 dan tujuan nasional Indonesia",
        "difficulty": "EASY"
      },
      {
        "label": "Tata Urutan Peraturan Perundang-Undangan di Indonesia",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang hierarki UU No. 12 Tahun 2011 dari UUD 1945 sampai Peraturan Daerah",
        "difficulty": "EASY"
      },
      {
        "label": "Norma Hukum, Kesusilaan, Kesopanan, & Agama",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang perbedaan sanksi hukum vs sanksi sosial norma kesopanan di masyarakat",
        "difficulty": "EASY"
      },
      {
        "label": "Kedaulatan Rakyat & Lembaga Negara (MPR/DPR/Presiden)",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang pemisahan wewenang legislatif, eksekutif, dan yudikatif",
        "difficulty": "EASY"
      },
      {
        "label": "Keberagaman SARA dalam Bingkai Bhinneka Tunggal Ika",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang merawat persatuan antar suku, ras, agama, dan antargolongan",
        "difficulty": "EASY"
      },
      {
        "label": "Hak Asasi Manusia (HAM) & Perlindungan Hukum Siswa",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang hak hidup, kebebasan berpendapat santun, dan pencegahan kekerasan",
        "difficulty": "EASY"
      },
      {
        "label": "Semangat Sumpah Pemuda 1928 & Wawasan Kebangsaan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang makna satu tumpah darah, satu bangsa, dan satu bahasa persatuan",
        "difficulty": "EASY"
      },
      {
        "label": "Otonomi Daerah & Sistem Pemerintahan NKRI",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang pembagian wewenang pemerintah pusat dan daerah otonom",
        "difficulty": "EASY"
      },
      {
        "label": "Upaya Bela Negara & Menjaga Kedaulatan Wilayah",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang bentuk partisipasi pelajar dalam bela negara dan patriotisme",
        "difficulty": "EASY"
      },
      {
        "label": "Pencegahan Perundungan (Bullying) & Intoleransi Sekolah",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang menciptakan lingkungan belajar yang aman, ramah, dan inklusif",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Sejarah Lahirnya Pancasila & Sidang BPUPKI/PPKI",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang usulan dasar negara oleh Ir. Soekarno, Piagam Jakarta, dan penetapan 18 Agustus 1945",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kedudukan Pancasila sebagai Dasar & Ideologi Negara",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang fungsi Pancasila sebagai pandangan hidup bangsa dan sumber segala hukum",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pembukaan UUD 1945 & Makna 4 Alinea",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang pokok pikiran Pembukaan UUD NRI 1945 dan tujuan nasional Indonesia",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Tata Urutan Peraturan Perundang-Undangan di Indonesia",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang hierarki UU No. 12 Tahun 2011 dari UUD 1945 sampai Peraturan Daerah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Norma Hukum, Kesusilaan, Kesopanan, & Agama",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang perbedaan sanksi hukum vs sanksi sosial norma kesopanan di masyarakat",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kedaulatan Rakyat & Lembaga Negara (MPR/DPR/Presiden)",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang pemisahan wewenang legislatif, eksekutif, dan yudikatif",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Keberagaman SARA dalam Bingkai Bhinneka Tunggal Ika",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang merawat persatuan antar suku, ras, agama, dan antargolongan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Hak Asasi Manusia (HAM) & Perlindungan Hukum Siswa",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang hak hidup, kebebasan berpendapat santun, dan pencegahan kekerasan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Semangat Sumpah Pemuda 1928 & Wawasan Kebangsaan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang makna satu tumpah darah, satu bangsa, dan satu bahasa persatuan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Otonomi Daerah & Sistem Pemerintahan NKRI",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang pembagian wewenang pemerintah pusat dan daerah otonom",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Upaya Bela Negara & Menjaga Kedaulatan Wilayah",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang bentuk partisipasi pelajar dalam bela negara dan patriotisme",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pencegahan Perundungan (Bullying) & Intoleransi Sekolah",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang menciptakan lingkungan belajar yang aman, ramah, dan inklusif",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Sejarah Lahirnya Pancasila & Sidang BPUPKI/PPKI",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang usulan dasar negara oleh Ir. Soekarno, Piagam Jakarta, dan penetapan 18 Agustus 1945",
        "difficulty": "HARD"
      },
      {
        "label": "Kedudukan Pancasila sebagai Dasar & Ideologi Negara",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang fungsi Pancasila sebagai pandangan hidup bangsa dan sumber segala hukum",
        "difficulty": "HARD"
      },
      {
        "label": "Pembukaan UUD 1945 & Makna 4 Alinea",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang pokok pikiran Pembukaan UUD NRI 1945 dan tujuan nasional Indonesia",
        "difficulty": "HARD"
      },
      {
        "label": "Tata Urutan Peraturan Perundang-Undangan di Indonesia",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang hierarki UU No. 12 Tahun 2011 dari UUD 1945 sampai Peraturan Daerah",
        "difficulty": "HARD"
      },
      {
        "label": "Norma Hukum, Kesusilaan, Kesopanan, & Agama",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang perbedaan sanksi hukum vs sanksi sosial norma kesopanan di masyarakat",
        "difficulty": "HARD"
      },
      {
        "label": "Kedaulatan Rakyat & Lembaga Negara (MPR/DPR/Presiden)",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang pemisahan wewenang legislatif, eksekutif, dan yudikatif",
        "difficulty": "HARD"
      },
      {
        "label": "Keberagaman SARA dalam Bingkai Bhinneka Tunggal Ika",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang merawat persatuan antar suku, ras, agama, dan antargolongan",
        "difficulty": "HARD"
      },
      {
        "label": "Hak Asasi Manusia (HAM) & Perlindungan Hukum Siswa",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang hak hidup, kebebasan berpendapat santun, dan pencegahan kekerasan",
        "difficulty": "HARD"
      },
      {
        "label": "Semangat Sumpah Pemuda 1928 & Wawasan Kebangsaan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang makna satu tumpah darah, satu bangsa, dan satu bahasa persatuan",
        "difficulty": "HARD"
      },
      {
        "label": "Otonomi Daerah & Sistem Pemerintahan NKRI",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang pembagian wewenang pemerintah pusat dan daerah otonom",
        "difficulty": "HARD"
      },
      {
        "label": "Upaya Bela Negara & Menjaga Kedaulatan Wilayah",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang bentuk partisipasi pelajar dalam bela negara dan patriotisme",
        "difficulty": "HARD"
      },
      {
        "label": "Pencegahan Perundungan (Bullying) & Intoleransi Sekolah",
        "prompt": "Buatkan soal Pendidikan Pancasila SMP tentang menciptakan lingkungan belajar yang aman, ramah, dan inklusif",
        "difficulty": "HARD"
      }
    ]
  },
  "informatika": {
    "EASY": [
      {
        "label": "Berpikir Komputasional: Dekomposisi & Algoritma",
        "prompt": "Buatkan soal Informatika SMP tentang 4 pilar computational thinking: dekomposisi, pengenalan pola, abstraksi, dan algoritma",
        "difficulty": "EASY"
      },
      {
        "label": "Perangkat Keras (Hardware): Input, Proses, Output",
        "prompt": "Buatkan soal Informatika SMP tentang fungsi processor (CPU), RAM, SSD, kartu grafis, monitor, dan keyboard",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Operasi & Pengelolaan File di Komputer",
        "prompt": "Buatkan soal Informatika SMP tentang fungsi Windows/Linux, struktur direktori folder, dan ekstensi file",
        "difficulty": "EASY"
      },
      {
        "label": "Jaringan Komputer: LAN, WiFi, & Koneksi Internet",
        "prompt": "Buatkan soal Informatika SMP tentang perbedaan jaringan lokal vs internet, fungsi router, modem, dan topologi star",
        "difficulty": "EASY"
      },
      {
        "label": "Keamanan Data: Kata Sandi Kuat & Anti-Phishing",
        "prompt": "Buatkan soal Informatika SMP tentang proteksi akun digital, enkripsi sederhana, dan mengenali tautan palsu",
        "difficulty": "EASY"
      },
      {
        "label": "Analisis Data Spreadsheet: Formula SUM, AVERAGE, IF",
        "prompt": "Buatkan soal Informatika SMP tentang pengolahan lembar kerja Excel/Sheets: rumus aritmetika, COUNT, dan logika IF",
        "difficulty": "EASY"
      },
      {
        "label": "Pemrograman Visual Berbasis Blok (Scratch)",
        "prompt": "Buatkan soal Informatika SMP tentang sprite, koordinat x-y, blok loop (repeat/forever), dan kondisi if-then pada Scratch",
        "difficulty": "EASY"
      },
      {
        "label": "Penyusunan Algoritma Flowchart & Pseudocode",
        "prompt": "Buatkan soal Informatika SMP tentang simbol terminator, decision, process, input/output pada diagram alir flowchart",
        "difficulty": "EASY"
      },
      {
        "label": "Etika Berinternet (Netiket) & Jejak Digital",
        "prompt": "Buatkan soal Informatika SMP tentang sopan santun bermedia sosial, bahaya cyberbullying, dan menjaga jejak digital",
        "difficulty": "EASY"
      },
      {
        "label": "Dampak Sosial Informatika & Hak Cipta Perangkat Lunak",
        "prompt": "Buatkan soal Informatika SMP tentang lisensi open-source vs proprietary software dan pembajakan konten digital",
        "difficulty": "EASY"
      },
      {
        "label": "Pencarian Informasi Efektif di Search Engine",
        "prompt": "Buatkan soal Informatika SMP tentang penggunaan kata kunci, tanda kutip, dan mengevaluasi kredibilitas sumber web",
        "difficulty": "EASY"
      },
      {
        "label": "Representasi Data: Sistem Bilangan Biner & Desimal",
        "prompt": "Buatkan soal Informatika SMP tentang konversi bilangan biner (basis 2) ke desimal (basis 10) dan sebaliknya",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Berpikir Komputasional: Dekomposisi & Algoritma",
        "prompt": "Buatkan soal Informatika SMP tentang 4 pilar computational thinking: dekomposisi, pengenalan pola, abstraksi, dan algoritma",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Perangkat Keras (Hardware): Input, Proses, Output",
        "prompt": "Buatkan soal Informatika SMP tentang fungsi processor (CPU), RAM, SSD, kartu grafis, monitor, dan keyboard",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Operasi & Pengelolaan File di Komputer",
        "prompt": "Buatkan soal Informatika SMP tentang fungsi Windows/Linux, struktur direktori folder, dan ekstensi file",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Jaringan Komputer: LAN, WiFi, & Koneksi Internet",
        "prompt": "Buatkan soal Informatika SMP tentang perbedaan jaringan lokal vs internet, fungsi router, modem, dan topologi star",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Keamanan Data: Kata Sandi Kuat & Anti-Phishing",
        "prompt": "Buatkan soal Informatika SMP tentang proteksi akun digital, enkripsi sederhana, dan mengenali tautan palsu",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Analisis Data Spreadsheet: Formula SUM, AVERAGE, IF",
        "prompt": "Buatkan soal Informatika SMP tentang pengolahan lembar kerja Excel/Sheets: rumus aritmetika, COUNT, dan logika IF",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pemrograman Visual Berbasis Blok (Scratch)",
        "prompt": "Buatkan soal Informatika SMP tentang sprite, koordinat x-y, blok loop (repeat/forever), dan kondisi if-then pada Scratch",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penyusunan Algoritma Flowchart & Pseudocode",
        "prompt": "Buatkan soal Informatika SMP tentang simbol terminator, decision, process, input/output pada diagram alir flowchart",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Etika Berinternet (Netiket) & Jejak Digital",
        "prompt": "Buatkan soal Informatika SMP tentang sopan santun bermedia sosial, bahaya cyberbullying, dan menjaga jejak digital",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Dampak Sosial Informatika & Hak Cipta Perangkat Lunak",
        "prompt": "Buatkan soal Informatika SMP tentang lisensi open-source vs proprietary software dan pembajakan konten digital",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pencarian Informasi Efektif di Search Engine",
        "prompt": "Buatkan soal Informatika SMP tentang penggunaan kata kunci, tanda kutip, dan mengevaluasi kredibilitas sumber web",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Representasi Data: Sistem Bilangan Biner & Desimal",
        "prompt": "Buatkan soal Informatika SMP tentang konversi bilangan biner (basis 2) ke desimal (basis 10) dan sebaliknya",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Berpikir Komputasional: Dekomposisi & Algoritma",
        "prompt": "Buatkan soal Informatika SMP tentang 4 pilar computational thinking: dekomposisi, pengenalan pola, abstraksi, dan algoritma",
        "difficulty": "HARD"
      },
      {
        "label": "Perangkat Keras (Hardware): Input, Proses, Output",
        "prompt": "Buatkan soal Informatika SMP tentang fungsi processor (CPU), RAM, SSD, kartu grafis, monitor, dan keyboard",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Operasi & Pengelolaan File di Komputer",
        "prompt": "Buatkan soal Informatika SMP tentang fungsi Windows/Linux, struktur direktori folder, dan ekstensi file",
        "difficulty": "HARD"
      },
      {
        "label": "Jaringan Komputer: LAN, WiFi, & Koneksi Internet",
        "prompt": "Buatkan soal Informatika SMP tentang perbedaan jaringan lokal vs internet, fungsi router, modem, dan topologi star",
        "difficulty": "HARD"
      },
      {
        "label": "Keamanan Data: Kata Sandi Kuat & Anti-Phishing",
        "prompt": "Buatkan soal Informatika SMP tentang proteksi akun digital, enkripsi sederhana, dan mengenali tautan palsu",
        "difficulty": "HARD"
      },
      {
        "label": "Analisis Data Spreadsheet: Formula SUM, AVERAGE, IF",
        "prompt": "Buatkan soal Informatika SMP tentang pengolahan lembar kerja Excel/Sheets: rumus aritmetika, COUNT, dan logika IF",
        "difficulty": "HARD"
      },
      {
        "label": "Pemrograman Visual Berbasis Blok (Scratch)",
        "prompt": "Buatkan soal Informatika SMP tentang sprite, koordinat x-y, blok loop (repeat/forever), dan kondisi if-then pada Scratch",
        "difficulty": "HARD"
      },
      {
        "label": "Penyusunan Algoritma Flowchart & Pseudocode",
        "prompt": "Buatkan soal Informatika SMP tentang simbol terminator, decision, process, input/output pada diagram alir flowchart",
        "difficulty": "HARD"
      },
      {
        "label": "Etika Berinternet (Netiket) & Jejak Digital",
        "prompt": "Buatkan soal Informatika SMP tentang sopan santun bermedia sosial, bahaya cyberbullying, dan menjaga jejak digital",
        "difficulty": "HARD"
      },
      {
        "label": "Dampak Sosial Informatika & Hak Cipta Perangkat Lunak",
        "prompt": "Buatkan soal Informatika SMP tentang lisensi open-source vs proprietary software dan pembajakan konten digital",
        "difficulty": "HARD"
      },
      {
        "label": "Pencarian Informasi Efektif di Search Engine",
        "prompt": "Buatkan soal Informatika SMP tentang penggunaan kata kunci, tanda kutip, dan mengevaluasi kredibilitas sumber web",
        "difficulty": "HARD"
      },
      {
        "label": "Representasi Data: Sistem Bilangan Biner & Desimal",
        "prompt": "Buatkan soal Informatika SMP tentang konversi bilangan biner (basis 2) ke desimal (basis 10) dan sebaliknya",
        "difficulty": "HARD"
      }
    ]
  },
  "seni": {
    "EASY": [
      {
        "label": "Menggambar Model Alam Benda & Figuratif",
        "prompt": "Buatkan soal Seni Budaya SMP tentang teknik arsir, proporsi, pencahayaan gelap-terang, dan perspektif benda",
        "difficulty": "EASY"
      },
      {
        "label": "Ragam Hias Nusantara pada Tekstil & Kayu",
        "prompt": "Buatkan soal Seni Budaya SMP tentang pola motif flora/fauna/figuratif, teknik batik cap/tulis, dan ukiran kayu daerah",
        "difficulty": "EASY"
      },
      {
        "label": "Menyanyi Unisono & Vokal Grup Lagu Daerah",
        "prompt": "Buatkan soal Seni Budaya SMP tentang teknik pernapasan diafragma, artikulasi, intonasi vokal, dan aransemen vokal grup",
        "difficulty": "EASY"
      },
      {
        "label": "Alat Musik Ansambel Campuran Nusantara",
        "prompt": "Buatkan soal Seni Budaya SMP tentang perpaduan alat musik melodis (pianika/suling), harmonis (gitar), dan ritmis (kendang)",
        "difficulty": "EASY"
      },
      {
        "label": "Gerak Tari Tradisional: Pola Lantai & Dinamika",
        "prompt": "Buatkan soal Seni Budaya SMP tentang formasi garis lurus/lingkar pola lantai dan tempo lambat/cepat gerak tari",
        "difficulty": "EASY"
      },
      {
        "label": "Tata Rias & Busana Tari Tradisional Daerah",
        "prompt": "Buatkan soal Seni Budaya SMP tentang keselarasan kostum, tata rias karakter penari, dan fungsi iringan musik tari",
        "difficulty": "EASY"
      },
      {
        "label": "Pementasan Teater Tradisional & Pantomim",
        "prompt": "Buatkan soal Seni Budaya SMP tentang olah tubuh, olah vokal, blocking panggung, dan karakterisasi naskah teater",
        "difficulty": "EASY"
      },
      {
        "label": "Kerajinan Bahan Lunak: Clay, Lilin, Sabun, Gips",
        "prompt": "Buatkan soal Seni Budaya SMP tentang karakteristik bahan lunak alami vs buatan dan teknik cetak/ukir sabun",
        "difficulty": "EASY"
      },
      {
        "label": "Kerajinan Bahan Keras: Bambu, Rotan, & Kayu",
        "prompt": "Buatkan soal Seni Budaya SMP tentang teknik menganyam bambu, membubut kayu, dan finishing pernis kerajinan",
        "difficulty": "EASY"
      },
      {
        "label": "Pengolahan Bahan Pangan Sayur & Buah Lokal",
        "prompt": "Buatkan soal Seni Budaya/Prakarya SMP tentang metode merebus (boiling), mengukus (steaming), dan penyajian higienis",
        "difficulty": "EASY"
      },
      {
        "label": "Seni Grafis Cukil & Cetak Saring (Sablon)",
        "prompt": "Buatkan soal Seni Budaya SMP tentang pembuatan klise cetak tinggi dengan lino/kayu dan teknik sablon kain",
        "difficulty": "EASY"
      },
      {
        "label": "Penyelenggaraan Pameran Seni Rupa di Sekolah",
        "prompt": "Buatkan soal Seni Budaya SMP tentang susunan kepanitiaan pameran, penataan display karya, dan buku pesan/kesan",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Menggambar Model Alam Benda & Figuratif",
        "prompt": "Buatkan soal Seni Budaya SMP tentang teknik arsir, proporsi, pencahayaan gelap-terang, dan perspektif benda",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Ragam Hias Nusantara pada Tekstil & Kayu",
        "prompt": "Buatkan soal Seni Budaya SMP tentang pola motif flora/fauna/figuratif, teknik batik cap/tulis, dan ukiran kayu daerah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menyanyi Unisono & Vokal Grup Lagu Daerah",
        "prompt": "Buatkan soal Seni Budaya SMP tentang teknik pernapasan diafragma, artikulasi, intonasi vokal, dan aransemen vokal grup",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Alat Musik Ansambel Campuran Nusantara",
        "prompt": "Buatkan soal Seni Budaya SMP tentang perpaduan alat musik melodis (pianika/suling), harmonis (gitar), dan ritmis (kendang)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Gerak Tari Tradisional: Pola Lantai & Dinamika",
        "prompt": "Buatkan soal Seni Budaya SMP tentang formasi garis lurus/lingkar pola lantai dan tempo lambat/cepat gerak tari",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Tata Rias & Busana Tari Tradisional Daerah",
        "prompt": "Buatkan soal Seni Budaya SMP tentang keselarasan kostum, tata rias karakter penari, dan fungsi iringan musik tari",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pementasan Teater Tradisional & Pantomim",
        "prompt": "Buatkan soal Seni Budaya SMP tentang olah tubuh, olah vokal, blocking panggung, dan karakterisasi naskah teater",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kerajinan Bahan Lunak: Clay, Lilin, Sabun, Gips",
        "prompt": "Buatkan soal Seni Budaya SMP tentang karakteristik bahan lunak alami vs buatan dan teknik cetak/ukir sabun",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kerajinan Bahan Keras: Bambu, Rotan, & Kayu",
        "prompt": "Buatkan soal Seni Budaya SMP tentang teknik menganyam bambu, membubut kayu, dan finishing pernis kerajinan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pengolahan Bahan Pangan Sayur & Buah Lokal",
        "prompt": "Buatkan soal Seni Budaya/Prakarya SMP tentang metode merebus (boiling), mengukus (steaming), dan penyajian higienis",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Seni Grafis Cukil & Cetak Saring (Sablon)",
        "prompt": "Buatkan soal Seni Budaya SMP tentang pembuatan klise cetak tinggi dengan lino/kayu dan teknik sablon kain",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penyelenggaraan Pameran Seni Rupa di Sekolah",
        "prompt": "Buatkan soal Seni Budaya SMP tentang susunan kepanitiaan pameran, penataan display karya, dan buku pesan/kesan",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Menggambar Model Alam Benda & Figuratif",
        "prompt": "Buatkan soal Seni Budaya SMP tentang teknik arsir, proporsi, pencahayaan gelap-terang, dan perspektif benda",
        "difficulty": "HARD"
      },
      {
        "label": "Ragam Hias Nusantara pada Tekstil & Kayu",
        "prompt": "Buatkan soal Seni Budaya SMP tentang pola motif flora/fauna/figuratif, teknik batik cap/tulis, dan ukiran kayu daerah",
        "difficulty": "HARD"
      },
      {
        "label": "Menyanyi Unisono & Vokal Grup Lagu Daerah",
        "prompt": "Buatkan soal Seni Budaya SMP tentang teknik pernapasan diafragma, artikulasi, intonasi vokal, dan aransemen vokal grup",
        "difficulty": "HARD"
      },
      {
        "label": "Alat Musik Ansambel Campuran Nusantara",
        "prompt": "Buatkan soal Seni Budaya SMP tentang perpaduan alat musik melodis (pianika/suling), harmonis (gitar), dan ritmis (kendang)",
        "difficulty": "HARD"
      },
      {
        "label": "Gerak Tari Tradisional: Pola Lantai & Dinamika",
        "prompt": "Buatkan soal Seni Budaya SMP tentang formasi garis lurus/lingkar pola lantai dan tempo lambat/cepat gerak tari",
        "difficulty": "HARD"
      },
      {
        "label": "Tata Rias & Busana Tari Tradisional Daerah",
        "prompt": "Buatkan soal Seni Budaya SMP tentang keselarasan kostum, tata rias karakter penari, dan fungsi iringan musik tari",
        "difficulty": "HARD"
      },
      {
        "label": "Pementasan Teater Tradisional & Pantomim",
        "prompt": "Buatkan soal Seni Budaya SMP tentang olah tubuh, olah vokal, blocking panggung, dan karakterisasi naskah teater",
        "difficulty": "HARD"
      },
      {
        "label": "Kerajinan Bahan Lunak: Clay, Lilin, Sabun, Gips",
        "prompt": "Buatkan soal Seni Budaya SMP tentang karakteristik bahan lunak alami vs buatan dan teknik cetak/ukir sabun",
        "difficulty": "HARD"
      },
      {
        "label": "Kerajinan Bahan Keras: Bambu, Rotan, & Kayu",
        "prompt": "Buatkan soal Seni Budaya SMP tentang teknik menganyam bambu, membubut kayu, dan finishing pernis kerajinan",
        "difficulty": "HARD"
      },
      {
        "label": "Pengolahan Bahan Pangan Sayur & Buah Lokal",
        "prompt": "Buatkan soal Seni Budaya/Prakarya SMP tentang metode merebus (boiling), mengukus (steaming), dan penyajian higienis",
        "difficulty": "HARD"
      },
      {
        "label": "Seni Grafis Cukil & Cetak Saring (Sablon)",
        "prompt": "Buatkan soal Seni Budaya SMP tentang pembuatan klise cetak tinggi dengan lino/kayu dan teknik sablon kain",
        "difficulty": "HARD"
      },
      {
        "label": "Penyelenggaraan Pameran Seni Rupa di Sekolah",
        "prompt": "Buatkan soal Seni Budaya SMP tentang susunan kepanitiaan pameran, penataan display karya, dan buku pesan/kesan",
        "difficulty": "HARD"
      }
    ]
  },
  "pjok": {
    "EASY": [
      {
        "label": "Sepak Bola: Passing Kaki Bagian Dalam, Dribble, & Shooting",
        "prompt": "Buatkan soal PJOK SMP tentang teknik mengumpan bola akurat, menggiring zig-zag, dan mengontrol bola lambung",
        "difficulty": "EASY"
      },
      {
        "label": "Bola Voli: Servis Atas/Bawah, Passing, & Smash",
        "prompt": "Buatkan soal PJOK SMP tentang teknik passing bawah bola voli, posisi lutut mengeper, dan servis atas",
        "difficulty": "EASY"
      },
      {
        "label": "Bola Basket: Chest Pass, Bounce Pass, & Lay-Up Shoot",
        "prompt": "Buatkan soal PJOK SMP tentang teknik operan dada, operan pantul, pivot kaki tumpu, dan langkah lay-up",
        "difficulty": "EASY"
      },
      {
        "label": "Bulu Tangkis: Servis Pendek, Lob, & Smash Tajam",
        "prompt": "Buatkan soal PJOK SMP tentang pegangan raket forehand/backhand, footwork langkah kaki, dan pukulan lob",
        "difficulty": "EASY"
      },
      {
        "label": "Tenis Meja: Pegangan Bet (Shakehand/Penhold) & Spin",
        "prompt": "Buatkan soal PJOK SMP tentang teknik drive, push, dan servis meja tenis",
        "difficulty": "EASY"
      },
      {
        "label": "Atletik: Lari Jarak Pendek (Sprint 100m) & Start Jongkok",
        "prompt": "Buatkan soal PJOK SMP tentang posisi aba-aba bersedia-siap-ya, sudut tolakan kaki, dan kecondongan tubuh",
        "difficulty": "EASY"
      },
      {
        "label": "Tolak Peluru: Gaya Menyamping & Gaya O'Brien",
        "prompt": "Buatkan soal PJOK SMP tentang cara memegang peluru di pangkal leher dan dorongan lengan saat menolak peluru",
        "difficulty": "EASY"
      },
      {
        "label": "Senam Lantai: Roll Depan, Roll Belakang, & Meroda",
        "prompt": "Buatkan soal PJOK SMP tentang rangkaian gerak guling lentur di atas matras dan pendaratan meroda yang seimbang",
        "difficulty": "EASY"
      },
      {
        "label": "Senam Irama (Aerobik) Berirama Ceria Beregu",
        "prompt": "Buatkan soal PJOK SMP tentang koordinasi langkah kaki marching, v-step, dan ayunan lengan mengikuti tempo lagu",
        "difficulty": "EASY"
      },
      {
        "label": "Renang Gaya Dada & Gaya Bebas (SMP)",
        "prompt": "Buatkan soal PJOK SMP tentang gerakan kaki mendayung, tarikan lengan, dan rotasi pernapasan samping",
        "difficulty": "EASY"
      },
      {
        "label": "Kebugaran: Shuttle Run, Push Up, & Pengukuran VO2Max",
        "prompt": "Buatkan soal PJOK SMP tentang komponen daya tahan jantung-paru dan latihan kekuatan otot perut/lengan",
        "difficulty": "EASY"
      },
      {
        "label": "Bahaya Merokok, Minuman Keras, & Narkoba Remaja",
        "prompt": "Buatkan soal PJOK SMP tentang zat adiktif perusak sel saraf, gangguan pernapasan, dan cara menolak ajakan negatif",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Sepak Bola: Passing Kaki Bagian Dalam, Dribble, & Shooting",
        "prompt": "Buatkan soal PJOK SMP tentang teknik mengumpan bola akurat, menggiring zig-zag, dan mengontrol bola lambung",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Bola Voli: Servis Atas/Bawah, Passing, & Smash",
        "prompt": "Buatkan soal PJOK SMP tentang teknik passing bawah bola voli, posisi lutut mengeper, dan servis atas",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Bola Basket: Chest Pass, Bounce Pass, & Lay-Up Shoot",
        "prompt": "Buatkan soal PJOK SMP tentang teknik operan dada, operan pantul, pivot kaki tumpu, dan langkah lay-up",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Bulu Tangkis: Servis Pendek, Lob, & Smash Tajam",
        "prompt": "Buatkan soal PJOK SMP tentang pegangan raket forehand/backhand, footwork langkah kaki, dan pukulan lob",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Tenis Meja: Pegangan Bet (Shakehand/Penhold) & Spin",
        "prompt": "Buatkan soal PJOK SMP tentang teknik drive, push, dan servis meja tenis",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Atletik: Lari Jarak Pendek (Sprint 100m) & Start Jongkok",
        "prompt": "Buatkan soal PJOK SMP tentang posisi aba-aba bersedia-siap-ya, sudut tolakan kaki, dan kecondongan tubuh",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Tolak Peluru: Gaya Menyamping & Gaya O'Brien",
        "prompt": "Buatkan soal PJOK SMP tentang cara memegang peluru di pangkal leher dan dorongan lengan saat menolak peluru",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Senam Lantai: Roll Depan, Roll Belakang, & Meroda",
        "prompt": "Buatkan soal PJOK SMP tentang rangkaian gerak guling lentur di atas matras dan pendaratan meroda yang seimbang",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Senam Irama (Aerobik) Berirama Ceria Beregu",
        "prompt": "Buatkan soal PJOK SMP tentang koordinasi langkah kaki marching, v-step, dan ayunan lengan mengikuti tempo lagu",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Renang Gaya Dada & Gaya Bebas (SMP)",
        "prompt": "Buatkan soal PJOK SMP tentang gerakan kaki mendayung, tarikan lengan, dan rotasi pernapasan samping",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kebugaran: Shuttle Run, Push Up, & Pengukuran VO2Max",
        "prompt": "Buatkan soal PJOK SMP tentang komponen daya tahan jantung-paru dan latihan kekuatan otot perut/lengan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Bahaya Merokok, Minuman Keras, & Narkoba Remaja",
        "prompt": "Buatkan soal PJOK SMP tentang zat adiktif perusak sel saraf, gangguan pernapasan, dan cara menolak ajakan negatif",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Sepak Bola: Passing Kaki Bagian Dalam, Dribble, & Shooting",
        "prompt": "Buatkan soal PJOK SMP tentang teknik mengumpan bola akurat, menggiring zig-zag, dan mengontrol bola lambung",
        "difficulty": "HARD"
      },
      {
        "label": "Bola Voli: Servis Atas/Bawah, Passing, & Smash",
        "prompt": "Buatkan soal PJOK SMP tentang teknik passing bawah bola voli, posisi lutut mengeper, dan servis atas",
        "difficulty": "HARD"
      },
      {
        "label": "Bola Basket: Chest Pass, Bounce Pass, & Lay-Up Shoot",
        "prompt": "Buatkan soal PJOK SMP tentang teknik operan dada, operan pantul, pivot kaki tumpu, dan langkah lay-up",
        "difficulty": "HARD"
      },
      {
        "label": "Bulu Tangkis: Servis Pendek, Lob, & Smash Tajam",
        "prompt": "Buatkan soal PJOK SMP tentang pegangan raket forehand/backhand, footwork langkah kaki, dan pukulan lob",
        "difficulty": "HARD"
      },
      {
        "label": "Tenis Meja: Pegangan Bet (Shakehand/Penhold) & Spin",
        "prompt": "Buatkan soal PJOK SMP tentang teknik drive, push, dan servis meja tenis",
        "difficulty": "HARD"
      },
      {
        "label": "Atletik: Lari Jarak Pendek (Sprint 100m) & Start Jongkok",
        "prompt": "Buatkan soal PJOK SMP tentang posisi aba-aba bersedia-siap-ya, sudut tolakan kaki, dan kecondongan tubuh",
        "difficulty": "HARD"
      },
      {
        "label": "Tolak Peluru: Gaya Menyamping & Gaya O'Brien",
        "prompt": "Buatkan soal PJOK SMP tentang cara memegang peluru di pangkal leher dan dorongan lengan saat menolak peluru",
        "difficulty": "HARD"
      },
      {
        "label": "Senam Lantai: Roll Depan, Roll Belakang, & Meroda",
        "prompt": "Buatkan soal PJOK SMP tentang rangkaian gerak guling lentur di atas matras dan pendaratan meroda yang seimbang",
        "difficulty": "HARD"
      },
      {
        "label": "Senam Irama (Aerobik) Berirama Ceria Beregu",
        "prompt": "Buatkan soal PJOK SMP tentang koordinasi langkah kaki marching, v-step, dan ayunan lengan mengikuti tempo lagu",
        "difficulty": "HARD"
      },
      {
        "label": "Renang Gaya Dada & Gaya Bebas (SMP)",
        "prompt": "Buatkan soal PJOK SMP tentang gerakan kaki mendayung, tarikan lengan, dan rotasi pernapasan samping",
        "difficulty": "HARD"
      },
      {
        "label": "Kebugaran: Shuttle Run, Push Up, & Pengukuran VO2Max",
        "prompt": "Buatkan soal PJOK SMP tentang komponen daya tahan jantung-paru dan latihan kekuatan otot perut/lengan",
        "difficulty": "HARD"
      },
      {
        "label": "Bahaya Merokok, Minuman Keras, & Narkoba Remaja",
        "prompt": "Buatkan soal PJOK SMP tentang zat adiktif perusak sel saraf, gangguan pernapasan, dan cara menolak ajakan negatif",
        "difficulty": "HARD"
      }
    ]
  },
  "agama": {
    "EASY": [
      {
        "label": "Iman kepada Kitab-Kitab Allah & Wahyu Suci",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang nama-nama kitab suci, rasul penerima wahyu, dan fungsinya sebagai pedoman hidup",
        "difficulty": "EASY"
      },
      {
        "label": "Sikap Jujur, Amanah, & Menepati Janji dalam Bergaul",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang integritas kejujuran saat ujian dan tanggung jawab menepati janji",
        "difficulty": "EASY"
      },
      {
        "label": "Berbakti kepada Orang Tua & Menghormati Guru",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang adab berbicara santun kepada orang tua dan memuliakan ilmu para guru",
        "difficulty": "EASY"
      },
      {
        "label": "Shalat Jamak & Qashar dalam Perjalanan Musafir",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang syarat diperbolehkannya shalat jamak taqdim/takhir dan meringkas rakaat",
        "difficulty": "EASY"
      },
      {
        "label": "Zakat Fitrah & Zakat Mal serta Manfaat Sosialnya",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang nisab zakat, waktu pembayaran zakat fitrah, dan 8 golongan asnaf penerima",
        "difficulty": "EASY"
      },
      {
        "label": "Sejarah Peradaban Islam Daulah Umayyah & Abbasiyah",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang kemajuan ilmu pengetahuan di Damaskus/Baghdad dan tokoh cendekiawan muslim",
        "difficulty": "EASY"
      },
      {
        "label": "Makanan & Minuman Halal vs Haram Menurut Kaidah",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang kriteria kehalalan zat dan cara memperolehnya serta bahaya makanan haram",
        "difficulty": "EASY"
      },
      {
        "label": "Menghindari Perilaku Ghibah, Fitnah, & Dengki",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang bahaya menggunjing orang lain, adu domba (namimah), dan menjaga lisan",
        "difficulty": "EASY"
      },
      {
        "label": "Toleransi Beragama dalam Masyarakat Majemuk",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang prinsip kebebasan berkeyakinan dan hidup rukun berdampingan antarumat beragama",
        "difficulty": "EASY"
      },
      {
        "label": "Syukur Nikmat & Sabar Menghadapi Ujian Hidup",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang menyikapi kegagalan dengan tabah dan tidak putus asa",
        "difficulty": "EASY"
      },
      {
        "label": "Shalat Sunnah Berjamaah (Tarawih, Istisqa, Khusuf)",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang ketentuan shalat gerhana, meminta hujan, dan shalat malam",
        "difficulty": "EASY"
      },
      {
        "label": "Peran Pemuda Muslim dalam Menjaga Moral Bangsa",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang keteladanan pemuda Ashabul Kahfi dan menjaga kehormatan diri",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Iman kepada Kitab-Kitab Allah & Wahyu Suci",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang nama-nama kitab suci, rasul penerima wahyu, dan fungsinya sebagai pedoman hidup",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sikap Jujur, Amanah, & Menepati Janji dalam Bergaul",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang integritas kejujuran saat ujian dan tanggung jawab menepati janji",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Berbakti kepada Orang Tua & Menghormati Guru",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang adab berbicara santun kepada orang tua dan memuliakan ilmu para guru",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Shalat Jamak & Qashar dalam Perjalanan Musafir",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang syarat diperbolehkannya shalat jamak taqdim/takhir dan meringkas rakaat",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Zakat Fitrah & Zakat Mal serta Manfaat Sosialnya",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang nisab zakat, waktu pembayaran zakat fitrah, dan 8 golongan asnaf penerima",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sejarah Peradaban Islam Daulah Umayyah & Abbasiyah",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang kemajuan ilmu pengetahuan di Damaskus/Baghdad dan tokoh cendekiawan muslim",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Makanan & Minuman Halal vs Haram Menurut Kaidah",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang kriteria kehalalan zat dan cara memperolehnya serta bahaya makanan haram",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghindari Perilaku Ghibah, Fitnah, & Dengki",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang bahaya menggunjing orang lain, adu domba (namimah), dan menjaga lisan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Toleransi Beragama dalam Masyarakat Majemuk",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang prinsip kebebasan berkeyakinan dan hidup rukun berdampingan antarumat beragama",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Syukur Nikmat & Sabar Menghadapi Ujian Hidup",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang menyikapi kegagalan dengan tabah dan tidak putus asa",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Shalat Sunnah Berjamaah (Tarawih, Istisqa, Khusuf)",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang ketentuan shalat gerhana, meminta hujan, dan shalat malam",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Peran Pemuda Muslim dalam Menjaga Moral Bangsa",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang keteladanan pemuda Ashabul Kahfi dan menjaga kehormatan diri",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Iman kepada Kitab-Kitab Allah & Wahyu Suci",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang nama-nama kitab suci, rasul penerima wahyu, dan fungsinya sebagai pedoman hidup",
        "difficulty": "HARD"
      },
      {
        "label": "Sikap Jujur, Amanah, & Menepati Janji dalam Bergaul",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang integritas kejujuran saat ujian dan tanggung jawab menepati janji",
        "difficulty": "HARD"
      },
      {
        "label": "Berbakti kepada Orang Tua & Menghormati Guru",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang adab berbicara santun kepada orang tua dan memuliakan ilmu para guru",
        "difficulty": "HARD"
      },
      {
        "label": "Shalat Jamak & Qashar dalam Perjalanan Musafir",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang syarat diperbolehkannya shalat jamak taqdim/takhir dan meringkas rakaat",
        "difficulty": "HARD"
      },
      {
        "label": "Zakat Fitrah & Zakat Mal serta Manfaat Sosialnya",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang nisab zakat, waktu pembayaran zakat fitrah, dan 8 golongan asnaf penerima",
        "difficulty": "HARD"
      },
      {
        "label": "Sejarah Peradaban Islam Daulah Umayyah & Abbasiyah",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang kemajuan ilmu pengetahuan di Damaskus/Baghdad dan tokoh cendekiawan muslim",
        "difficulty": "HARD"
      },
      {
        "label": "Makanan & Minuman Halal vs Haram Menurut Kaidah",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang kriteria kehalalan zat dan cara memperolehnya serta bahaya makanan haram",
        "difficulty": "HARD"
      },
      {
        "label": "Menghindari Perilaku Ghibah, Fitnah, & Dengki",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang bahaya menggunjing orang lain, adu domba (namimah), dan menjaga lisan",
        "difficulty": "HARD"
      },
      {
        "label": "Toleransi Beragama dalam Masyarakat Majemuk",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang prinsip kebebasan berkeyakinan dan hidup rukun berdampingan antarumat beragama",
        "difficulty": "HARD"
      },
      {
        "label": "Syukur Nikmat & Sabar Menghadapi Ujian Hidup",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang menyikapi kegagalan dengan tabah dan tidak putus asa",
        "difficulty": "HARD"
      },
      {
        "label": "Shalat Sunnah Berjamaah (Tarawih, Istisqa, Khusuf)",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang ketentuan shalat gerhana, meminta hujan, dan shalat malam",
        "difficulty": "HARD"
      },
      {
        "label": "Peran Pemuda Muslim dalam Menjaga Moral Bangsa",
        "prompt": "Buatkan soal Pendidikan Agama SMP tentang keteladanan pemuda Ashabul Kahfi dan menjaga kehormatan diri",
        "difficulty": "HARD"
      }
    ]
  }
};

export const SMA_SUBJECT_TOPICS: Record<string, SubjectDifficultyMap> = {
  "inggris": {
    "EASY": [
      {
        "label": "Analytical Exposition Text: Arguments & Thesis",
        "prompt": "Buatkan soal Kurikulum Standar tentang Analytical Exposition Text: Arguments & Thesis",
        "difficulty": "EASY"
      },
      {
        "label": "Hortatory Exposition Text: Recommendations",
        "prompt": "Buatkan soal Kurikulum Standar tentang Hortatory Exposition Text: Recommendations",
        "difficulty": "EASY"
      },
      {
        "label": "News Item Text: Headlines, Events, & Sources",
        "prompt": "Buatkan soal Kurikulum Standar tentang News Item Text: Headlines, Events, & Sources",
        "difficulty": "EASY"
      },
      {
        "label": "Explanation Text: Natural & Technological Processes",
        "prompt": "Buatkan soal Kurikulum Standar tentang Explanation Text: Natural & Technological Processes",
        "difficulty": "EASY"
      },
      {
        "label": "Discussion Text: Pro and Contra Perspectives",
        "prompt": "Buatkan soal Kurikulum Standar tentang Discussion Text: Pro and Contra Perspectives",
        "difficulty": "EASY"
      },
      {
        "label": "Narrative Text: Complex Plots & Character Arcs",
        "prompt": "Buatkan soal Kurikulum Standar tentang Narrative Text: Complex Plots & Character Arcs",
        "difficulty": "EASY"
      },
      {
        "label": "Passive Voice in Academic & Formal Contexts",
        "prompt": "Buatkan soal Kurikulum Standar tentang Passive Voice in Academic & Formal Contexts",
        "difficulty": "EASY"
      },
      {
        "label": "Conditional Sentences (Type 1, 2, 3, & Mixed)",
        "prompt": "Buatkan soal Kurikulum Standar tentang Conditional Sentences (Type 1, 2, 3, & Mixed)",
        "difficulty": "EASY"
      },
      {
        "label": "Cause & Effect Connectors (Due to, Consequently)",
        "prompt": "Buatkan soal Kurikulum Standar tentang Cause & Effect Connectors (Due to, Consequently)",
        "difficulty": "EASY"
      },
      {
        "label": "Offering Help, Accepting, & Declining Politely",
        "prompt": "Buatkan soal Kurikulum Standar tentang Offering Help, Accepting, & Declining Politely",
        "difficulty": "EASY"
      },
      {
        "label": "Expressing Opinions, Stating Stances, & Rebuttals",
        "prompt": "Buatkan soal Kurikulum Standar tentang Expressing Opinions, Stating Stances, & Rebuttals",
        "difficulty": "EASY"
      },
      {
        "label": "Formal Letters, Applications, & RSVP Invitations",
        "prompt": "Buatkan soal Kurikulum Standar tentang Formal Letters, Applications, & RSVP Invitations",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Analytical Exposition Text: Arguments & Thesis",
        "prompt": "Buatkan soal Kurikulum Standar tentang Analytical Exposition Text: Arguments & Thesis",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Hortatory Exposition Text: Recommendations",
        "prompt": "Buatkan soal Kurikulum Standar tentang Hortatory Exposition Text: Recommendations",
        "difficulty": "MEDIUM"
      },
      {
        "label": "News Item Text: Headlines, Events, & Sources",
        "prompt": "Buatkan soal Kurikulum Standar tentang News Item Text: Headlines, Events, & Sources",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Explanation Text: Natural & Technological Processes",
        "prompt": "Buatkan soal Kurikulum Standar tentang Explanation Text: Natural & Technological Processes",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Discussion Text: Pro and Contra Perspectives",
        "prompt": "Buatkan soal Kurikulum Standar tentang Discussion Text: Pro and Contra Perspectives",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Narrative Text: Complex Plots & Character Arcs",
        "prompt": "Buatkan soal Kurikulum Standar tentang Narrative Text: Complex Plots & Character Arcs",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Passive Voice in Academic & Formal Contexts",
        "prompt": "Buatkan soal Kurikulum Standar tentang Passive Voice in Academic & Formal Contexts",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Conditional Sentences (Type 1, 2, 3, & Mixed)",
        "prompt": "Buatkan soal Kurikulum Standar tentang Conditional Sentences (Type 1, 2, 3, & Mixed)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Cause & Effect Connectors (Due to, Consequently)",
        "prompt": "Buatkan soal Kurikulum Standar tentang Cause & Effect Connectors (Due to, Consequently)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Offering Help, Accepting, & Declining Politely",
        "prompt": "Buatkan soal Kurikulum Standar tentang Offering Help, Accepting, & Declining Politely",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Expressing Opinions, Stating Stances, & Rebuttals",
        "prompt": "Buatkan soal Kurikulum Standar tentang Expressing Opinions, Stating Stances, & Rebuttals",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Formal Letters, Applications, & RSVP Invitations",
        "prompt": "Buatkan soal Kurikulum Standar tentang Formal Letters, Applications, & RSVP Invitations",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Analytical Exposition Text: Arguments & Thesis",
        "prompt": "Buatkan soal Kurikulum Standar tentang Analytical Exposition Text: Arguments & Thesis",
        "difficulty": "HARD"
      },
      {
        "label": "Hortatory Exposition Text: Recommendations",
        "prompt": "Buatkan soal Kurikulum Standar tentang Hortatory Exposition Text: Recommendations",
        "difficulty": "HARD"
      },
      {
        "label": "News Item Text: Headlines, Events, & Sources",
        "prompt": "Buatkan soal Kurikulum Standar tentang News Item Text: Headlines, Events, & Sources",
        "difficulty": "HARD"
      },
      {
        "label": "Explanation Text: Natural & Technological Processes",
        "prompt": "Buatkan soal Kurikulum Standar tentang Explanation Text: Natural & Technological Processes",
        "difficulty": "HARD"
      },
      {
        "label": "Discussion Text: Pro and Contra Perspectives",
        "prompt": "Buatkan soal Kurikulum Standar tentang Discussion Text: Pro and Contra Perspectives",
        "difficulty": "HARD"
      },
      {
        "label": "Narrative Text: Complex Plots & Character Arcs",
        "prompt": "Buatkan soal Kurikulum Standar tentang Narrative Text: Complex Plots & Character Arcs",
        "difficulty": "HARD"
      },
      {
        "label": "Passive Voice in Academic & Formal Contexts",
        "prompt": "Buatkan soal Kurikulum Standar tentang Passive Voice in Academic & Formal Contexts",
        "difficulty": "HARD"
      },
      {
        "label": "Conditional Sentences (Type 1, 2, 3, & Mixed)",
        "prompt": "Buatkan soal Kurikulum Standar tentang Conditional Sentences (Type 1, 2, 3, & Mixed)",
        "difficulty": "HARD"
      },
      {
        "label": "Cause & Effect Connectors (Due to, Consequently)",
        "prompt": "Buatkan soal Kurikulum Standar tentang Cause & Effect Connectors (Due to, Consequently)",
        "difficulty": "HARD"
      },
      {
        "label": "Offering Help, Accepting, & Declining Politely",
        "prompt": "Buatkan soal Kurikulum Standar tentang Offering Help, Accepting, & Declining Politely",
        "difficulty": "HARD"
      },
      {
        "label": "Expressing Opinions, Stating Stances, & Rebuttals",
        "prompt": "Buatkan soal Kurikulum Standar tentang Expressing Opinions, Stating Stances, & Rebuttals",
        "difficulty": "HARD"
      },
      {
        "label": "Formal Letters, Applications, & RSVP Invitations",
        "prompt": "Buatkan soal Kurikulum Standar tentang Formal Letters, Applications, & RSVP Invitations",
        "difficulty": "HARD"
      }
    ]
  },
  "matematika": {
    "EASY": [
      {
        "label": "Fungsi Komposisi & Fungsi Invers",
        "prompt": "Buatkan soal matematika SMA tentang aljabar fungsi, komposisi (f o g)(x), mencari invers fungsi f-1(x), dan daerah asal/hasil",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Persamaan Linear Tiga Variabel (SPLTV)",
        "prompt": "Buatkan soal matematika SMA tentang penyelesaian SPLTV dengan metode gabungan eliminasi-substitusi pada soal cerita",
        "difficulty": "EASY"
      },
      {
        "label": "Program Linear & Nilai Optimum Fungsi Objektif",
        "prompt": "Buatkan soal matematika SMA tentang daerah himpunan penyelesaian sistem pertidaksamaan linear dan titik pojok maksimum/minimum",
        "difficulty": "EASY"
      },
      {
        "label": "Matriks: Perkalian, Determinan, & Invers Matriks",
        "prompt": "Buatkan soal matematika SMA tentang operasi aljabar matriks 2x2 dan 3x3, determinan, matriks singular, dan persamaan AX=B",
        "difficulty": "EASY"
      },
      {
        "label": "Barisan & Deret: Aritmetika, Geometri, & Tak Hingga",
        "prompt": "Buatkan soal matematika SMA tentang suku ke-n, jumlah deret hingga dan tak hingga, serta aplikasi pertumbuhan/peluruhan",
        "difficulty": "EASY"
      },
      {
        "label": "Trigonometri: Identitas, Sudut Rangkap, & Grafik Sin/Cos",
        "prompt": "Buatkan soal matematika SMA tentang pembuktian rumus identitas trigonometri, sudut ganda sin 2A, dan amplitudo grafik fungsi",
        "difficulty": "EASY"
      },
      {
        "label": "Limit Fungsi Aljabar & Trigonometri",
        "prompt": "Buatkan soal matematika SMA tentang pemfaktoran limit, merasionalkan bentuk akar, dalil L'Hopital, dan limit trigonometri",
        "difficulty": "EASY"
      },
      {
        "label": "Turunan Fungsi Aljabar & Garis Singgung Kurva",
        "prompt": "Buatkan soal matematika SMA tentang aturan rantai turunan f(x), titik stasioner, interval fungsi naik/turun, dan nilai maksimum",
        "difficulty": "EASY"
      },
      {
        "label": "Integral Tak Tentu & Integral Tentu Luas Daerah",
        "prompt": "Buatkan soal matematika SMA tentang teknik substitusi integral aljabar, integral tentu, dan menghitung luas daerah dibatasi kurva",
        "difficulty": "EASY"
      },
      {
        "label": "Geometri Tiga Dimensi: Jarak Titik, Garis, & Bidang",
        "prompt": "Buatkan soal matematika SMA tentang proyeksi jarak antar titik ke garis atau bidang pada bangun ruang kubus dan limas beraturan",
        "difficulty": "EASY"
      },
      {
        "label": "Statistika Data Kelompok: Kuartil, Desil, & Simpangan Baku",
        "prompt": "Buatkan soal matematika SMA tentang menghitung rataan sementara, kuartil bawah/atas, varians, dan simpangan baku tabel frekuensi",
        "difficulty": "EASY"
      },
      {
        "label": "Kaidah Pencacahan, Permutasi, Kombinasi, & Peluang",
        "prompt": "Buatkan soal matematika SMA tentang aturan perkalian, permutasi unsur berbeda/siklis, kombinasi pemilihan panitia, dan peluang bersyarat",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Fungsi Komposisi & Fungsi Invers",
        "prompt": "Buatkan soal matematika SMA tentang aljabar fungsi, komposisi (f o g)(x), mencari invers fungsi f-1(x), dan daerah asal/hasil",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Persamaan Linear Tiga Variabel (SPLTV)",
        "prompt": "Buatkan soal matematika SMA tentang penyelesaian SPLTV dengan metode gabungan eliminasi-substitusi pada soal cerita",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Program Linear & Nilai Optimum Fungsi Objektif",
        "prompt": "Buatkan soal matematika SMA tentang daerah himpunan penyelesaian sistem pertidaksamaan linear dan titik pojok maksimum/minimum",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Matriks: Perkalian, Determinan, & Invers Matriks",
        "prompt": "Buatkan soal matematika SMA tentang operasi aljabar matriks 2x2 dan 3x3, determinan, matriks singular, dan persamaan AX=B",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Barisan & Deret: Aritmetika, Geometri, & Tak Hingga",
        "prompt": "Buatkan soal matematika SMA tentang suku ke-n, jumlah deret hingga dan tak hingga, serta aplikasi pertumbuhan/peluruhan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Trigonometri: Identitas, Sudut Rangkap, & Grafik Sin/Cos",
        "prompt": "Buatkan soal matematika SMA tentang pembuktian rumus identitas trigonometri, sudut ganda sin 2A, dan amplitudo grafik fungsi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Limit Fungsi Aljabar & Trigonometri",
        "prompt": "Buatkan soal matematika SMA tentang pemfaktoran limit, merasionalkan bentuk akar, dalil L'Hopital, dan limit trigonometri",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Turunan Fungsi Aljabar & Garis Singgung Kurva",
        "prompt": "Buatkan soal matematika SMA tentang aturan rantai turunan f(x), titik stasioner, interval fungsi naik/turun, dan nilai maksimum",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Integral Tak Tentu & Integral Tentu Luas Daerah",
        "prompt": "Buatkan soal matematika SMA tentang teknik substitusi integral aljabar, integral tentu, dan menghitung luas daerah dibatasi kurva",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Geometri Tiga Dimensi: Jarak Titik, Garis, & Bidang",
        "prompt": "Buatkan soal matematika SMA tentang proyeksi jarak antar titik ke garis atau bidang pada bangun ruang kubus dan limas beraturan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Statistika Data Kelompok: Kuartil, Desil, & Simpangan Baku",
        "prompt": "Buatkan soal matematika SMA tentang menghitung rataan sementara, kuartil bawah/atas, varians, dan simpangan baku tabel frekuensi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kaidah Pencacahan, Permutasi, Kombinasi, & Peluang",
        "prompt": "Buatkan soal matematika SMA tentang aturan perkalian, permutasi unsur berbeda/siklis, kombinasi pemilihan panitia, dan peluang bersyarat",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Fungsi Komposisi & Fungsi Invers",
        "prompt": "Buatkan soal matematika SMA tentang aljabar fungsi, komposisi (f o g)(x), mencari invers fungsi f-1(x), dan daerah asal/hasil",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Persamaan Linear Tiga Variabel (SPLTV)",
        "prompt": "Buatkan soal matematika SMA tentang penyelesaian SPLTV dengan metode gabungan eliminasi-substitusi pada soal cerita",
        "difficulty": "HARD"
      },
      {
        "label": "Program Linear & Nilai Optimum Fungsi Objektif",
        "prompt": "Buatkan soal matematika SMA tentang daerah himpunan penyelesaian sistem pertidaksamaan linear dan titik pojok maksimum/minimum",
        "difficulty": "HARD"
      },
      {
        "label": "Matriks: Perkalian, Determinan, & Invers Matriks",
        "prompt": "Buatkan soal matematika SMA tentang operasi aljabar matriks 2x2 dan 3x3, determinan, matriks singular, dan persamaan AX=B",
        "difficulty": "HARD"
      },
      {
        "label": "Barisan & Deret: Aritmetika, Geometri, & Tak Hingga",
        "prompt": "Buatkan soal matematika SMA tentang suku ke-n, jumlah deret hingga dan tak hingga, serta aplikasi pertumbuhan/peluruhan",
        "difficulty": "HARD"
      },
      {
        "label": "Trigonometri: Identitas, Sudut Rangkap, & Grafik Sin/Cos",
        "prompt": "Buatkan soal matematika SMA tentang pembuktian rumus identitas trigonometri, sudut ganda sin 2A, dan amplitudo grafik fungsi",
        "difficulty": "HARD"
      },
      {
        "label": "Limit Fungsi Aljabar & Trigonometri",
        "prompt": "Buatkan soal matematika SMA tentang pemfaktoran limit, merasionalkan bentuk akar, dalil L'Hopital, dan limit trigonometri",
        "difficulty": "HARD"
      },
      {
        "label": "Turunan Fungsi Aljabar & Garis Singgung Kurva",
        "prompt": "Buatkan soal matematika SMA tentang aturan rantai turunan f(x), titik stasioner, interval fungsi naik/turun, dan nilai maksimum",
        "difficulty": "HARD"
      },
      {
        "label": "Integral Tak Tentu & Integral Tentu Luas Daerah",
        "prompt": "Buatkan soal matematika SMA tentang teknik substitusi integral aljabar, integral tentu, dan menghitung luas daerah dibatasi kurva",
        "difficulty": "HARD"
      },
      {
        "label": "Geometri Tiga Dimensi: Jarak Titik, Garis, & Bidang",
        "prompt": "Buatkan soal matematika SMA tentang proyeksi jarak antar titik ke garis atau bidang pada bangun ruang kubus dan limas beraturan",
        "difficulty": "HARD"
      },
      {
        "label": "Statistika Data Kelompok: Kuartil, Desil, & Simpangan Baku",
        "prompt": "Buatkan soal matematika SMA tentang menghitung rataan sementara, kuartil bawah/atas, varians, dan simpangan baku tabel frekuensi",
        "difficulty": "HARD"
      },
      {
        "label": "Kaidah Pencacahan, Permutasi, Kombinasi, & Peluang",
        "prompt": "Buatkan soal matematika SMA tentang aturan perkalian, permutasi unsur berbeda/siklis, kombinasi pemilihan panitia, dan peluang bersyarat",
        "difficulty": "HARD"
      }
    ]
  },
  "indonesia": {
    "EASY": [
      {
        "label": "Teks Laporan Hasil Observasi Ilmiah & Fakta Obyektif",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur ilmiah LHO, verba relasional, kalimat definisi, dan verba klasifikasi",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Eksposisi: Tesis, Argumentasi, & Rekomendasi Kritis",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang kekuatan argumen berbasis data, kohesi-koherensi paragraf, dan bahasa persuasif eksposisi",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Anekdot: Sindiran Sosial & Struktur Humor",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur abstraksi, orientasi, krisis, reaksi, koda, dan kritik tersirat dalam anekdot",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Cerita Sejarah: Fakta Sejarah & Rekonstruksi Narasi",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang fakta sejarah vs fiksi, konjungsi temporal kronologis, dan nilai edukatif novel sejarah",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Editorial: Tajuk Rencana, Opini, & Sikap Redaksi",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang mengidentifikasi isu aktual, opini kritis redaksi, fakta pendukung, dan kalimat retoris editorial",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Negosiasi: Taktik Tawar-Menawar & Kesepakatan",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur orientasi, pengajuan, penawaran, persetujuan, dan penggunaan bahasa santun persuasif",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Debat: Mosi, Argumen Konstruktif, & Bidasan Logis",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang pembagian peran tim afirmasi, oposisi, netral, perumusan mosi, dan sanggahan logis",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Resensi Buku & Kritik Sastra Komparatif",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang resensi fiksi/nonfiksi, analisis kelemahan-keunggulan karya, dan gaya kritik sastra",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Artikel Ilmiah Populer & Kaidah Kebahasaan",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur artikel ilmiah populer, fakta empiris, analogi, dan ragam bahasa komunikatif",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Cerpen Modern: Sudut Pandang & Konflik Batin",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang konflik psikologis tokoh, ironi dramatis, gaya bahasa alegori, dan pesan moral cerpen modern",
        "difficulty": "EASY"
      },
      {
        "label": "Teks Surat Lamaran Pekerjaan & Sistematika Resmi",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur surat lamaran kerja, perincian lampiran, kaidah PUEBI/EYD, dan kalimat efektif",
        "difficulty": "EASY"
      },
      {
        "label": "Kaidah EYD Edisi V & Kalimat Efektif Akademis",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang penulisan kata serapan baku, huruf kapital miring, tanda baca titik koma, dan kalimat efektif",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Teks Laporan Hasil Observasi Ilmiah & Fakta Obyektif",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur ilmiah LHO, verba relasional, kalimat definisi, dan verba klasifikasi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Eksposisi: Tesis, Argumentasi, & Rekomendasi Kritis",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang kekuatan argumen berbasis data, kohesi-koherensi paragraf, dan bahasa persuasif eksposisi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Anekdot: Sindiran Sosial & Struktur Humor",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur abstraksi, orientasi, krisis, reaksi, koda, dan kritik tersirat dalam anekdot",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Cerita Sejarah: Fakta Sejarah & Rekonstruksi Narasi",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang fakta sejarah vs fiksi, konjungsi temporal kronologis, dan nilai edukatif novel sejarah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Editorial: Tajuk Rencana, Opini, & Sikap Redaksi",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang mengidentifikasi isu aktual, opini kritis redaksi, fakta pendukung, dan kalimat retoris editorial",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Negosiasi: Taktik Tawar-Menawar & Kesepakatan",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur orientasi, pengajuan, penawaran, persetujuan, dan penggunaan bahasa santun persuasif",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Debat: Mosi, Argumen Konstruktif, & Bidasan Logis",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang pembagian peran tim afirmasi, oposisi, netral, perumusan mosi, dan sanggahan logis",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Resensi Buku & Kritik Sastra Komparatif",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang resensi fiksi/nonfiksi, analisis kelemahan-keunggulan karya, dan gaya kritik sastra",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Artikel Ilmiah Populer & Kaidah Kebahasaan",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur artikel ilmiah populer, fakta empiris, analogi, dan ragam bahasa komunikatif",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Cerpen Modern: Sudut Pandang & Konflik Batin",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang konflik psikologis tokoh, ironi dramatis, gaya bahasa alegori, dan pesan moral cerpen modern",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teks Surat Lamaran Pekerjaan & Sistematika Resmi",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur surat lamaran kerja, perincian lampiran, kaidah PUEBI/EYD, dan kalimat efektif",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kaidah EYD Edisi V & Kalimat Efektif Akademis",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang penulisan kata serapan baku, huruf kapital miring, tanda baca titik koma, dan kalimat efektif",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Teks Laporan Hasil Observasi Ilmiah & Fakta Obyektif",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur ilmiah LHO, verba relasional, kalimat definisi, dan verba klasifikasi",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Eksposisi: Tesis, Argumentasi, & Rekomendasi Kritis",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang kekuatan argumen berbasis data, kohesi-koherensi paragraf, dan bahasa persuasif eksposisi",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Anekdot: Sindiran Sosial & Struktur Humor",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur abstraksi, orientasi, krisis, reaksi, koda, dan kritik tersirat dalam anekdot",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Cerita Sejarah: Fakta Sejarah & Rekonstruksi Narasi",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang fakta sejarah vs fiksi, konjungsi temporal kronologis, dan nilai edukatif novel sejarah",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Editorial: Tajuk Rencana, Opini, & Sikap Redaksi",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang mengidentifikasi isu aktual, opini kritis redaksi, fakta pendukung, dan kalimat retoris editorial",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Negosiasi: Taktik Tawar-Menawar & Kesepakatan",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur orientasi, pengajuan, penawaran, persetujuan, dan penggunaan bahasa santun persuasif",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Debat: Mosi, Argumen Konstruktif, & Bidasan Logis",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang pembagian peran tim afirmasi, oposisi, netral, perumusan mosi, dan sanggahan logis",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Resensi Buku & Kritik Sastra Komparatif",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang resensi fiksi/nonfiksi, analisis kelemahan-keunggulan karya, dan gaya kritik sastra",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Artikel Ilmiah Populer & Kaidah Kebahasaan",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur artikel ilmiah populer, fakta empiris, analogi, dan ragam bahasa komunikatif",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Cerpen Modern: Sudut Pandang & Konflik Batin",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang konflik psikologis tokoh, ironi dramatis, gaya bahasa alegori, dan pesan moral cerpen modern",
        "difficulty": "HARD"
      },
      {
        "label": "Teks Surat Lamaran Pekerjaan & Sistematika Resmi",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang struktur surat lamaran kerja, perincian lampiran, kaidah PUEBI/EYD, dan kalimat efektif",
        "difficulty": "HARD"
      },
      {
        "label": "Kaidah EYD Edisi V & Kalimat Efektif Akademis",
        "prompt": "Buatkan soal Bahasa Indonesia SMA tentang penulisan kata serapan baku, huruf kapital miring, tanda baca titik koma, dan kalimat efektif",
        "difficulty": "HARD"
      }
    ]
  },
  "fisika": {
    "EASY": [
      {
        "label": "Vektor & Kinematika Gerak Lurus Dua Dimensi",
        "prompt": "Buatkan soal Fisika SMA tentang resultan vektor komponen x-y, gerak parabola proyektil, dan percepatan sentripetal gerak melingkar",
        "difficulty": "EASY"
      },
      {
        "label": "Dinamika Partikel & Hukum Newton tentang Gerak",
        "prompt": "Buatkan soal Fisika SMA tentang gaya gesek statis/kinetis, diagram benda bebas bidang miring, dan tegangan tali sistem katrol",
        "difficulty": "EASY"
      },
      {
        "label": "Usaha, Energi Mekanik, & Hukum Kekekalan Energi",
        "prompt": "Buatkan soal Fisika SMA tentang teorema usaha-energi kinetik, energi potensial gravitasi/pegas, dan kekekalan energi mekanik",
        "difficulty": "EASY"
      },
      {
        "label": "Momentum, Impuls, & Hukum Kekekalan Momentum",
        "prompt": "Buatkan soal Fisika SMA tentang hubungan impuls dan perubahan momentum, tumbukan lenting sempurna/sebagian/tidak lenting sama sekali",
        "difficulty": "EASY"
      },
      {
        "label": "Dinamika Rotasi & Kesetimbangan Benda Tegar",
        "prompt": "Buatkan soal Fisika SMA tentang momen inersia, torsi/momen gaya, titik berat benda homogen, dan hukum kekekalan momentum sudut",
        "difficulty": "EASY"
      },
      {
        "label": "Elastisitas Bahan & Hukum Hooke pada Susunan Pegas",
        "prompt": "Buatkan soal Fisika SMA tentang modulus elastisitas Young, tegangan, regangan, dan konstanta pegas pengganti seri/paralel",
        "difficulty": "EASY"
      },
      {
        "label": "Fluida Statis: Hukum Pascal, Hidrostatis, & Archimedes",
        "prompt": "Buatkan soal Fisika SMA tentang tekanan hidrostatis kedalaman air, pipa U dua fluida, gaya apung, dan tegangan permukaan",
        "difficulty": "EASY"
      },
      {
        "label": "Fluida Dinamis: Asas Kontinuitas & Hukum Bernoulli",
        "prompt": "Buatkan soal Fisika SMA tentang debit aliran fluida pipa menyempit, venturimeter dengan/tanpa manometer, dan gaya angkat sayap pesawat",
        "difficulty": "EASY"
      },
      {
        "label": "Suhu, Kalor, & Azas Black Perpindahan Kalor",
        "prompt": "Buatkan soal Fisika SMA tentang pemuaian panjang/volum, kalor jenis, kalor lebur, keseimbangan termal azas Black, dan konduksi-radiasi",
        "difficulty": "EASY"
      },
      {
        "label": "Teori Kinetik Gas Ideal & Mesin Carnot",
        "prompt": "Buatkan soal Fisika SMA tentang persamaan gas ideal PV=nRT, energi kinetik molekul gas, kerja isobarik/isotermal, dan efisiensi mesin Carnot",
        "difficulty": "EASY"
      },
      {
        "label": "Gelombang Bunyi: Efek Doppler & Taraf Intensitas",
        "prompt": "Buatkan soal Fisika SMA tentang pipa organa terbuka/tertutup, pergeseran frekuensi efek Doppler, dan taraf intensitas desibel n sumber",
        "difficulty": "EASY"
      },
      {
        "label": "Listrik Dinamis & Listrik Statis: Hukum Ohm & Kirchhoff",
        "prompt": "Buatkan soal Fisika SMA tentang hukum Coulomb muatan listrik, kuat medan listrik, hukum Ohm, dan analisis loop hukum Kirchhoff",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Vektor & Kinematika Gerak Lurus Dua Dimensi",
        "prompt": "Buatkan soal Fisika SMA tentang resultan vektor komponen x-y, gerak parabola proyektil, dan percepatan sentripetal gerak melingkar",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Dinamika Partikel & Hukum Newton tentang Gerak",
        "prompt": "Buatkan soal Fisika SMA tentang gaya gesek statis/kinetis, diagram benda bebas bidang miring, dan tegangan tali sistem katrol",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Usaha, Energi Mekanik, & Hukum Kekekalan Energi",
        "prompt": "Buatkan soal Fisika SMA tentang teorema usaha-energi kinetik, energi potensial gravitasi/pegas, dan kekekalan energi mekanik",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Momentum, Impuls, & Hukum Kekekalan Momentum",
        "prompt": "Buatkan soal Fisika SMA tentang hubungan impuls dan perubahan momentum, tumbukan lenting sempurna/sebagian/tidak lenting sama sekali",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Dinamika Rotasi & Kesetimbangan Benda Tegar",
        "prompt": "Buatkan soal Fisika SMA tentang momen inersia, torsi/momen gaya, titik berat benda homogen, dan hukum kekekalan momentum sudut",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Elastisitas Bahan & Hukum Hooke pada Susunan Pegas",
        "prompt": "Buatkan soal Fisika SMA tentang modulus elastisitas Young, tegangan, regangan, dan konstanta pegas pengganti seri/paralel",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Fluida Statis: Hukum Pascal, Hidrostatis, & Archimedes",
        "prompt": "Buatkan soal Fisika SMA tentang tekanan hidrostatis kedalaman air, pipa U dua fluida, gaya apung, dan tegangan permukaan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Fluida Dinamis: Asas Kontinuitas & Hukum Bernoulli",
        "prompt": "Buatkan soal Fisika SMA tentang debit aliran fluida pipa menyempit, venturimeter dengan/tanpa manometer, dan gaya angkat sayap pesawat",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Suhu, Kalor, & Azas Black Perpindahan Kalor",
        "prompt": "Buatkan soal Fisika SMA tentang pemuaian panjang/volum, kalor jenis, kalor lebur, keseimbangan termal azas Black, dan konduksi-radiasi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teori Kinetik Gas Ideal & Mesin Carnot",
        "prompt": "Buatkan soal Fisika SMA tentang persamaan gas ideal PV=nRT, energi kinetik molekul gas, kerja isobarik/isotermal, dan efisiensi mesin Carnot",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Gelombang Bunyi: Efek Doppler & Taraf Intensitas",
        "prompt": "Buatkan soal Fisika SMA tentang pipa organa terbuka/tertutup, pergeseran frekuensi efek Doppler, dan taraf intensitas desibel n sumber",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Listrik Dinamis & Listrik Statis: Hukum Ohm & Kirchhoff",
        "prompt": "Buatkan soal Fisika SMA tentang hukum Coulomb muatan listrik, kuat medan listrik, hukum Ohm, dan analisis loop hukum Kirchhoff",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Vektor & Kinematika Gerak Lurus Dua Dimensi",
        "prompt": "Buatkan soal Fisika SMA tentang resultan vektor komponen x-y, gerak parabola proyektil, dan percepatan sentripetal gerak melingkar",
        "difficulty": "HARD"
      },
      {
        "label": "Dinamika Partikel & Hukum Newton tentang Gerak",
        "prompt": "Buatkan soal Fisika SMA tentang gaya gesek statis/kinetis, diagram benda bebas bidang miring, dan tegangan tali sistem katrol",
        "difficulty": "HARD"
      },
      {
        "label": "Usaha, Energi Mekanik, & Hukum Kekekalan Energi",
        "prompt": "Buatkan soal Fisika SMA tentang teorema usaha-energi kinetik, energi potensial gravitasi/pegas, dan kekekalan energi mekanik",
        "difficulty": "HARD"
      },
      {
        "label": "Momentum, Impuls, & Hukum Kekekalan Momentum",
        "prompt": "Buatkan soal Fisika SMA tentang hubungan impuls dan perubahan momentum, tumbukan lenting sempurna/sebagian/tidak lenting sama sekali",
        "difficulty": "HARD"
      },
      {
        "label": "Dinamika Rotasi & Kesetimbangan Benda Tegar",
        "prompt": "Buatkan soal Fisika SMA tentang momen inersia, torsi/momen gaya, titik berat benda homogen, dan hukum kekekalan momentum sudut",
        "difficulty": "HARD"
      },
      {
        "label": "Elastisitas Bahan & Hukum Hooke pada Susunan Pegas",
        "prompt": "Buatkan soal Fisika SMA tentang modulus elastisitas Young, tegangan, regangan, dan konstanta pegas pengganti seri/paralel",
        "difficulty": "HARD"
      },
      {
        "label": "Fluida Statis: Hukum Pascal, Hidrostatis, & Archimedes",
        "prompt": "Buatkan soal Fisika SMA tentang tekanan hidrostatis kedalaman air, pipa U dua fluida, gaya apung, dan tegangan permukaan",
        "difficulty": "HARD"
      },
      {
        "label": "Fluida Dinamis: Asas Kontinuitas & Hukum Bernoulli",
        "prompt": "Buatkan soal Fisika SMA tentang debit aliran fluida pipa menyempit, venturimeter dengan/tanpa manometer, dan gaya angkat sayap pesawat",
        "difficulty": "HARD"
      },
      {
        "label": "Suhu, Kalor, & Azas Black Perpindahan Kalor",
        "prompt": "Buatkan soal Fisika SMA tentang pemuaian panjang/volum, kalor jenis, kalor lebur, keseimbangan termal azas Black, dan konduksi-radiasi",
        "difficulty": "HARD"
      },
      {
        "label": "Teori Kinetik Gas Ideal & Mesin Carnot",
        "prompt": "Buatkan soal Fisika SMA tentang persamaan gas ideal PV=nRT, energi kinetik molekul gas, kerja isobarik/isotermal, dan efisiensi mesin Carnot",
        "difficulty": "HARD"
      },
      {
        "label": "Gelombang Bunyi: Efek Doppler & Taraf Intensitas",
        "prompt": "Buatkan soal Fisika SMA tentang pipa organa terbuka/tertutup, pergeseran frekuensi efek Doppler, dan taraf intensitas desibel n sumber",
        "difficulty": "HARD"
      },
      {
        "label": "Listrik Dinamis & Listrik Statis: Hukum Ohm & Kirchhoff",
        "prompt": "Buatkan soal Fisika SMA tentang hukum Coulomb muatan listrik, kuat medan listrik, hukum Ohm, dan analisis loop hukum Kirchhoff",
        "difficulty": "HARD"
      }
    ]
  },
  "kimia": {
    "EASY": [
      {
        "label": "Struktur Atom Modern & Konfigurasi Elektron spdf",
        "prompt": "Buatkan soal Kimia SMA tentang bilangan kuantum (utama, azimut, magnetik, spin), aturan Aufbau/Hund, dan letak golongan/periode",
        "difficulty": "EASY"
      },
      {
        "label": "Sifat Keperiodikan Unsur: Jari-Jari & Keelektronegatifan",
        "prompt": "Buatkan soal Kimia SMA tentang tren jari-jari atom, energi ionisasi pertama, afinitas elektron, dan keelektronegatifan satu periode",
        "difficulty": "EASY"
      },
      {
        "label": "Ikatan Kimia: Ionik, Kovalen Polar/Nonpolar, & Logam",
        "prompt": "Buatkan soal Kimia SMA tentang struktur Lewis, gaya antarmolekul (London, Van der Waals, ikatan hidrogen), dan bentuk molekul VSEPR",
        "difficulty": "EASY"
      },
      {
        "label": "Tata Nama Senyawa & Persamaan Reaksi Kimia",
        "prompt": "Buatkan soal Kimia SMA tentang penamaan senyawa poliatom, asam-basa, dan penyetaraan reaksi redoks metode setengah reaksi",
        "difficulty": "EASY"
      },
      {
        "label": "Hukum Dasar Kimia & Konsep Mol (Stoikiometri)",
        "prompt": "Buatkan soal Kimia SMA tentang hukum Lavoisier, Proust, Gay-Lussac, Avogadro, pereaksi pembatas, dan persentase massa unsur",
        "difficulty": "EASY"
      },
      {
        "label": "Larutan Elektrolit, Asam-Basa, & Perhitungan pH",
        "prompt": "Buatkan soal Kimia SMA tentang teori Arrhenius, Bronsted-Lowry, Lewis, ionisasi asam kuat/lemah, dan penentuan pH indikator",
        "difficulty": "EASY"
      },
      {
        "label": "Larutan Penyangga (Buffer) & Kapasitas Penyangga",
        "prompt": "Buatkan soal Kimia SMA tentang komposisi asam lemah + basa konjugasinya, mekanisme mempertahankan pH, dan rumus pH buffer",
        "difficulty": "EASY"
      },
      {
        "label": "Hidrolisis Garam & Titrasi Asam-Basa",
        "prompt": "Buatkan soal Kimia SMA tentang garam asam/basa/netral, tetapan hidrolisis Kh, kurva titrasi, dan titik ekivalen reaksi",
        "difficulty": "EASY"
      },
      {
        "label": "Termokimia: Entalpi Reaksi, Hukum Hess, & Kalorimetri",
        "prompt": "Buatkan soal Kimia SMA tentang perubahan entalpi standar, perhitungan hukum Hess diagram siklus, dan data energi ikatan",
        "difficulty": "EASY"
      },
      {
        "label": "Laju Reaksi, Teori Tumbukan, & Orde Reaksi",
        "prompt": "Buatkan soal Kimia SMA tentang grafik laju reaksi, penentuan orde reaksi dari tabel eksperimen, dan pengaruh suhu/katalis",
        "difficulty": "EASY"
      },
      {
        "label": "Kesetimbangan Kimia & Azas Le Chatelier",
        "prompt": "Buatkan soal Kimia SMA tentang tetapan kesetimbangan Kc dan Kp, hubungan Kc-Kp, serta pergeseran kesetimbangan volume/tekanan/suhu",
        "difficulty": "EASY"
      },
      {
        "label": "Elektrokimia: Sel Volta, Potensial Sel E0, & Elektrolisis",
        "prompt": "Buatkan soal Kimia SMA tentang deret Volta, notasi sel galvani, reaksi katoda-anoda sel elektrolisis, dan hukum Faraday",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Struktur Atom Modern & Konfigurasi Elektron spdf",
        "prompt": "Buatkan soal Kimia SMA tentang bilangan kuantum (utama, azimut, magnetik, spin), aturan Aufbau/Hund, dan letak golongan/periode",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sifat Keperiodikan Unsur: Jari-Jari & Keelektronegatifan",
        "prompt": "Buatkan soal Kimia SMA tentang tren jari-jari atom, energi ionisasi pertama, afinitas elektron, dan keelektronegatifan satu periode",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Ikatan Kimia: Ionik, Kovalen Polar/Nonpolar, & Logam",
        "prompt": "Buatkan soal Kimia SMA tentang struktur Lewis, gaya antarmolekul (London, Van der Waals, ikatan hidrogen), dan bentuk molekul VSEPR",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Tata Nama Senyawa & Persamaan Reaksi Kimia",
        "prompt": "Buatkan soal Kimia SMA tentang penamaan senyawa poliatom, asam-basa, dan penyetaraan reaksi redoks metode setengah reaksi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Hukum Dasar Kimia & Konsep Mol (Stoikiometri)",
        "prompt": "Buatkan soal Kimia SMA tentang hukum Lavoisier, Proust, Gay-Lussac, Avogadro, pereaksi pembatas, dan persentase massa unsur",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Larutan Elektrolit, Asam-Basa, & Perhitungan pH",
        "prompt": "Buatkan soal Kimia SMA tentang teori Arrhenius, Bronsted-Lowry, Lewis, ionisasi asam kuat/lemah, dan penentuan pH indikator",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Larutan Penyangga (Buffer) & Kapasitas Penyangga",
        "prompt": "Buatkan soal Kimia SMA tentang komposisi asam lemah + basa konjugasinya, mekanisme mempertahankan pH, dan rumus pH buffer",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Hidrolisis Garam & Titrasi Asam-Basa",
        "prompt": "Buatkan soal Kimia SMA tentang garam asam/basa/netral, tetapan hidrolisis Kh, kurva titrasi, dan titik ekivalen reaksi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Termokimia: Entalpi Reaksi, Hukum Hess, & Kalorimetri",
        "prompt": "Buatkan soal Kimia SMA tentang perubahan entalpi standar, perhitungan hukum Hess diagram siklus, dan data energi ikatan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Laju Reaksi, Teori Tumbukan, & Orde Reaksi",
        "prompt": "Buatkan soal Kimia SMA tentang grafik laju reaksi, penentuan orde reaksi dari tabel eksperimen, dan pengaruh suhu/katalis",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kesetimbangan Kimia & Azas Le Chatelier",
        "prompt": "Buatkan soal Kimia SMA tentang tetapan kesetimbangan Kc dan Kp, hubungan Kc-Kp, serta pergeseran kesetimbangan volume/tekanan/suhu",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Elektrokimia: Sel Volta, Potensial Sel E0, & Elektrolisis",
        "prompt": "Buatkan soal Kimia SMA tentang deret Volta, notasi sel galvani, reaksi katoda-anoda sel elektrolisis, dan hukum Faraday",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Struktur Atom Modern & Konfigurasi Elektron spdf",
        "prompt": "Buatkan soal Kimia SMA tentang bilangan kuantum (utama, azimut, magnetik, spin), aturan Aufbau/Hund, dan letak golongan/periode",
        "difficulty": "HARD"
      },
      {
        "label": "Sifat Keperiodikan Unsur: Jari-Jari & Keelektronegatifan",
        "prompt": "Buatkan soal Kimia SMA tentang tren jari-jari atom, energi ionisasi pertama, afinitas elektron, dan keelektronegatifan satu periode",
        "difficulty": "HARD"
      },
      {
        "label": "Ikatan Kimia: Ionik, Kovalen Polar/Nonpolar, & Logam",
        "prompt": "Buatkan soal Kimia SMA tentang struktur Lewis, gaya antarmolekul (London, Van der Waals, ikatan hidrogen), dan bentuk molekul VSEPR",
        "difficulty": "HARD"
      },
      {
        "label": "Tata Nama Senyawa & Persamaan Reaksi Kimia",
        "prompt": "Buatkan soal Kimia SMA tentang penamaan senyawa poliatom, asam-basa, dan penyetaraan reaksi redoks metode setengah reaksi",
        "difficulty": "HARD"
      },
      {
        "label": "Hukum Dasar Kimia & Konsep Mol (Stoikiometri)",
        "prompt": "Buatkan soal Kimia SMA tentang hukum Lavoisier, Proust, Gay-Lussac, Avogadro, pereaksi pembatas, dan persentase massa unsur",
        "difficulty": "HARD"
      },
      {
        "label": "Larutan Elektrolit, Asam-Basa, & Perhitungan pH",
        "prompt": "Buatkan soal Kimia SMA tentang teori Arrhenius, Bronsted-Lowry, Lewis, ionisasi asam kuat/lemah, dan penentuan pH indikator",
        "difficulty": "HARD"
      },
      {
        "label": "Larutan Penyangga (Buffer) & Kapasitas Penyangga",
        "prompt": "Buatkan soal Kimia SMA tentang komposisi asam lemah + basa konjugasinya, mekanisme mempertahankan pH, dan rumus pH buffer",
        "difficulty": "HARD"
      },
      {
        "label": "Hidrolisis Garam & Titrasi Asam-Basa",
        "prompt": "Buatkan soal Kimia SMA tentang garam asam/basa/netral, tetapan hidrolisis Kh, kurva titrasi, dan titik ekivalen reaksi",
        "difficulty": "HARD"
      },
      {
        "label": "Termokimia: Entalpi Reaksi, Hukum Hess, & Kalorimetri",
        "prompt": "Buatkan soal Kimia SMA tentang perubahan entalpi standar, perhitungan hukum Hess diagram siklus, dan data energi ikatan",
        "difficulty": "HARD"
      },
      {
        "label": "Laju Reaksi, Teori Tumbukan, & Orde Reaksi",
        "prompt": "Buatkan soal Kimia SMA tentang grafik laju reaksi, penentuan orde reaksi dari tabel eksperimen, dan pengaruh suhu/katalis",
        "difficulty": "HARD"
      },
      {
        "label": "Kesetimbangan Kimia & Azas Le Chatelier",
        "prompt": "Buatkan soal Kimia SMA tentang tetapan kesetimbangan Kc dan Kp, hubungan Kc-Kp, serta pergeseran kesetimbangan volume/tekanan/suhu",
        "difficulty": "HARD"
      },
      {
        "label": "Elektrokimia: Sel Volta, Potensial Sel E0, & Elektrolisis",
        "prompt": "Buatkan soal Kimia SMA tentang deret Volta, notasi sel galvani, reaksi katoda-anoda sel elektrolisis, dan hukum Faraday",
        "difficulty": "HARD"
      }
    ]
  },
  "biologi": {
    "EASY": [
      {
        "label": "Struktur Sel Eukariotik & Organel Sel",
        "prompt": "Buatkan soal Biologi SMA tentang membran fosfolipid ganda, retikulum endoplasma, badan golgi, lisosom, mitokondria, dan dinding sel",
        "difficulty": "EASY"
      },
      {
        "label": "Transpor Membran: Difusi, Osmosis, & Transpor Aktif",
        "prompt": "Buatkan soal Biologi SMA tentang plasmolisis pada sel tumbuhan, lisis sel darah merah, pompa natrium-kalium, dan endositosis",
        "difficulty": "EASY"
      },
      {
        "label": "Struktur Jaringan Tumbuhan: Meristem, Xilem, & Floem",
        "prompt": "Buatkan soal Biologi SMA tentang anatomi akar, batang, daun dikotil vs monokotil, dan transportasi air kapiler",
        "difficulty": "EASY"
      },
      {
        "label": "Histologi Jaringan Hewan & Fisiologi Otot/Saraf",
        "prompt": "Buatkan soal Biologi SMA tentang jenis jaringan epitel, jaringan ikat longgar/padat, mekanisme sliding filament kontraksi otot",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Gerak & Persendian Rangka Tubuh Manusia",
        "prompt": "Buatkan soal Biologi SMA tentang osifikasi tulang, sendi peluru/engsel/pelana, dan kelainan osteoporosis/skoliosis",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Peredaran Darah & Mekanisme Hemostasis",
        "prompt": "Buatkan soal Biologi SMA tentang tahapan pembekuan darah (trombosit, protrombin, fibrin), rhesus darah ibu-janin, dan arteriosklerosis",
        "difficulty": "EASY"
      },
      {
        "label": "Metabolisme Seluler: Enzim, Glikolisis, & Siklus Krebs",
        "prompt": "Buatkan soal Biologi SMA tentang cara kerja enzim lock and key vs induced fit, glikolisis, siklus asam sitrat, dan fosforilasi oksidatif",
        "difficulty": "EASY"
      },
      {
        "label": "Fotosintesis: Reaksi Terang & Siklus Calvin",
        "prompt": "Buatkan soal Biologi SMA tentang fotolisis air fotosistem II/I, sintesis ATP-NADPH di tilakoid, dan fiksasi RuBP oleh enzim Rubisco",
        "difficulty": "EASY"
      },
      {
        "label": "Pola Hereditas Mendel & Penyimpangan Semu",
        "prompt": "Buatkan soal Biologi SMA tentang hukum segregasi, asortasi bebas, epistasis-hipostasis, polimeri, kriptomeri, dan gen komplementer",
        "difficulty": "EASY"
      },
      {
        "label": "Struktur DNA, RNA, & Sintesis Protein",
        "prompt": "Buatkan soal Biologi SMA tentang heliks ganda Watson-Crick, transkripsi mRNA di nukleus, kodon asam amino, dan translasi di ribosom",
        "difficulty": "EASY"
      },
      {
        "label": "Bioteknologi Konvensional vs Rekayasa Genetika",
        "prompt": "Buatkan soal Biologi SMA tentang fermentasi pangan, kultur jaringan totipotensi, teknik plasmid rekombinan, dan antibodi monoklonal",
        "difficulty": "EASY"
      },
      {
        "label": "Teori Evolusi & Genetika Populasi Hardy-Weinberg",
        "prompt": "Buatkan soal Biologi SMA tentang bukti evolusi homolog/analog, seleksi alam, spesiasi, dan perhitungan frekuensi alel",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Struktur Sel Eukariotik & Organel Sel",
        "prompt": "Buatkan soal Biologi SMA tentang membran fosfolipid ganda, retikulum endoplasma, badan golgi, lisosom, mitokondria, dan dinding sel",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Transpor Membran: Difusi, Osmosis, & Transpor Aktif",
        "prompt": "Buatkan soal Biologi SMA tentang plasmolisis pada sel tumbuhan, lisis sel darah merah, pompa natrium-kalium, dan endositosis",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Struktur Jaringan Tumbuhan: Meristem, Xilem, & Floem",
        "prompt": "Buatkan soal Biologi SMA tentang anatomi akar, batang, daun dikotil vs monokotil, dan transportasi air kapiler",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Histologi Jaringan Hewan & Fisiologi Otot/Saraf",
        "prompt": "Buatkan soal Biologi SMA tentang jenis jaringan epitel, jaringan ikat longgar/padat, mekanisme sliding filament kontraksi otot",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Gerak & Persendian Rangka Tubuh Manusia",
        "prompt": "Buatkan soal Biologi SMA tentang osifikasi tulang, sendi peluru/engsel/pelana, dan kelainan osteoporosis/skoliosis",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Peredaran Darah & Mekanisme Hemostasis",
        "prompt": "Buatkan soal Biologi SMA tentang tahapan pembekuan darah (trombosit, protrombin, fibrin), rhesus darah ibu-janin, dan arteriosklerosis",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Metabolisme Seluler: Enzim, Glikolisis, & Siklus Krebs",
        "prompt": "Buatkan soal Biologi SMA tentang cara kerja enzim lock and key vs induced fit, glikolisis, siklus asam sitrat, dan fosforilasi oksidatif",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Fotosintesis: Reaksi Terang & Siklus Calvin",
        "prompt": "Buatkan soal Biologi SMA tentang fotolisis air fotosistem II/I, sintesis ATP-NADPH di tilakoid, dan fiksasi RuBP oleh enzim Rubisco",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pola Hereditas Mendel & Penyimpangan Semu",
        "prompt": "Buatkan soal Biologi SMA tentang hukum segregasi, asortasi bebas, epistasis-hipostasis, polimeri, kriptomeri, dan gen komplementer",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Struktur DNA, RNA, & Sintesis Protein",
        "prompt": "Buatkan soal Biologi SMA tentang heliks ganda Watson-Crick, transkripsi mRNA di nukleus, kodon asam amino, dan translasi di ribosom",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Bioteknologi Konvensional vs Rekayasa Genetika",
        "prompt": "Buatkan soal Biologi SMA tentang fermentasi pangan, kultur jaringan totipotensi, teknik plasmid rekombinan, dan antibodi monoklonal",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teori Evolusi & Genetika Populasi Hardy-Weinberg",
        "prompt": "Buatkan soal Biologi SMA tentang bukti evolusi homolog/analog, seleksi alam, spesiasi, dan perhitungan frekuensi alel",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Struktur Sel Eukariotik & Organel Sel",
        "prompt": "Buatkan soal Biologi SMA tentang membran fosfolipid ganda, retikulum endoplasma, badan golgi, lisosom, mitokondria, dan dinding sel",
        "difficulty": "HARD"
      },
      {
        "label": "Transpor Membran: Difusi, Osmosis, & Transpor Aktif",
        "prompt": "Buatkan soal Biologi SMA tentang plasmolisis pada sel tumbuhan, lisis sel darah merah, pompa natrium-kalium, dan endositosis",
        "difficulty": "HARD"
      },
      {
        "label": "Struktur Jaringan Tumbuhan: Meristem, Xilem, & Floem",
        "prompt": "Buatkan soal Biologi SMA tentang anatomi akar, batang, daun dikotil vs monokotil, dan transportasi air kapiler",
        "difficulty": "HARD"
      },
      {
        "label": "Histologi Jaringan Hewan & Fisiologi Otot/Saraf",
        "prompt": "Buatkan soal Biologi SMA tentang jenis jaringan epitel, jaringan ikat longgar/padat, mekanisme sliding filament kontraksi otot",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Gerak & Persendian Rangka Tubuh Manusia",
        "prompt": "Buatkan soal Biologi SMA tentang osifikasi tulang, sendi peluru/engsel/pelana, dan kelainan osteoporosis/skoliosis",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Peredaran Darah & Mekanisme Hemostasis",
        "prompt": "Buatkan soal Biologi SMA tentang tahapan pembekuan darah (trombosit, protrombin, fibrin), rhesus darah ibu-janin, dan arteriosklerosis",
        "difficulty": "HARD"
      },
      {
        "label": "Metabolisme Seluler: Enzim, Glikolisis, & Siklus Krebs",
        "prompt": "Buatkan soal Biologi SMA tentang cara kerja enzim lock and key vs induced fit, glikolisis, siklus asam sitrat, dan fosforilasi oksidatif",
        "difficulty": "HARD"
      },
      {
        "label": "Fotosintesis: Reaksi Terang & Siklus Calvin",
        "prompt": "Buatkan soal Biologi SMA tentang fotolisis air fotosistem II/I, sintesis ATP-NADPH di tilakoid, dan fiksasi RuBP oleh enzim Rubisco",
        "difficulty": "HARD"
      },
      {
        "label": "Pola Hereditas Mendel & Penyimpangan Semu",
        "prompt": "Buatkan soal Biologi SMA tentang hukum segregasi, asortasi bebas, epistasis-hipostasis, polimeri, kriptomeri, dan gen komplementer",
        "difficulty": "HARD"
      },
      {
        "label": "Struktur DNA, RNA, & Sintesis Protein",
        "prompt": "Buatkan soal Biologi SMA tentang heliks ganda Watson-Crick, transkripsi mRNA di nukleus, kodon asam amino, dan translasi di ribosom",
        "difficulty": "HARD"
      },
      {
        "label": "Bioteknologi Konvensional vs Rekayasa Genetika",
        "prompt": "Buatkan soal Biologi SMA tentang fermentasi pangan, kultur jaringan totipotensi, teknik plasmid rekombinan, dan antibodi monoklonal",
        "difficulty": "HARD"
      },
      {
        "label": "Teori Evolusi & Genetika Populasi Hardy-Weinberg",
        "prompt": "Buatkan soal Biologi SMA tentang bukti evolusi homolog/analog, seleksi alam, spesiasi, dan perhitungan frekuensi alel",
        "difficulty": "HARD"
      }
    ]
  },
  "sosiologi": {
    "EASY": [
      {
        "label": "Fungsi Sosiologi dalam Mengkaji Gejala Sosial",
        "prompt": "Buatkan soal Sosiologi SMA tentang ciri sosiologi sebagai ilmu (empiris, teoritis, kumulatif, non-etis) dan objek kajian sosiologi",
        "difficulty": "EASY"
      },
      {
        "label": "Interaksi Sosial, Kontak, & Komunikasi Masyarakat",
        "prompt": "Buatkan soal Sosiologi SMA tentang proses interaksi asosiatif (akomodasi, asimilasi, akulturasi) vs disosiatif (konflik, persaingan)",
        "difficulty": "EASY"
      },
      {
        "label": "Nilai dan Norma Sosial serta Keteraturan Sosial",
        "prompt": "Buatkan soal Sosiologi SMA tentang nilai vital/material/kerohanian, norma folkways, mores, customs, hukum, dan sanksinya",
        "difficulty": "EASY"
      },
      {
        "label": "Sosialisasi & Pembentukan Kepribadian Individu",
        "prompt": "Buatkan soal Sosiologi SMA tentang tahapan sosialisasi (preparatory, play, game, generalized other) dan peran keluarga/teman sebaya",
        "difficulty": "EASY"
      },
      {
        "label": "Penyimpangan Sosial & Teori Labelling / Anomi",
        "prompt": "Buatkan soal Sosiologi SMA tentang penyimpangan primer/sekunder, teori asosiasi diferensial Edwin Sutherland, dan pengendalian sosial",
        "difficulty": "EASY"
      },
      {
        "label": "Diferensiasi Sosial & Stratifikasi Sosial Terbuka/Tertutup",
        "prompt": "Buatkan soal Sosiologi SMA tentang stratifikasi berdasarkan kekayaan/kekuasaan/pendidikan dan diferensiasi suku/ras/agama",
        "difficulty": "EASY"
      },
      {
        "label": "Konflik Sosial, Kekerasan, & Resolusi Perdamaian",
        "prompt": "Buatkan soal Sosiologi SMA tentang penyebab konflik sosial, bentuk mediasi/arbitrase/konsiliasi, dan integrasi pasca konflik",
        "difficulty": "EASY"
      },
      {
        "label": "Kelompok Sosial: Paguyuban & Patembayan",
        "prompt": "Buatkan soal Sosiologi SMA tentang kelompok primer/sekunder, in-group vs out-group, serta solidaritas mekanik vs organik Emile Durkheim",
        "difficulty": "EASY"
      },
      {
        "label": "Mobilitas Sosial: Vertikal Naik/Turun & Saluran Mobilitas",
        "prompt": "Buatkan soal Sosiologi SMA tentang mobilitas antargenerasi/intragenerasi, saluran lembaga pendidikan/politik, dan konsekuensi mobilitas",
        "difficulty": "EASY"
      },
      {
        "label": "Perubahan Sosial Budaya & Modernisasi Global",
        "prompt": "Buatkan soal Sosiologi SMA tentang faktor internal/eksternal perubahan sosial, teori siklus vs linier, dan dampak culture lag/culture shock",
        "difficulty": "EASY"
      },
      {
        "label": "Ketimpangan Sosial di Era Digital & Kemiskinan",
        "prompt": "Buatkan soal Sosiologi SMA tentang kesenjangan ekonomi desa-kota, bias gender, diskriminasi sosial, dan upaya pemberdayaan komunitas",
        "difficulty": "EASY"
      },
      {
        "label": "Metodologi Penelitian Sosial: Kualitatif vs Kuantitatif",
        "prompt": "Buatkan soal Sosiologi SMA tentang teknik observasi, wawancara mendalam, angket kuesioner, sampling acak, dan etika riset",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Fungsi Sosiologi dalam Mengkaji Gejala Sosial",
        "prompt": "Buatkan soal Sosiologi SMA tentang ciri sosiologi sebagai ilmu (empiris, teoritis, kumulatif, non-etis) dan objek kajian sosiologi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Interaksi Sosial, Kontak, & Komunikasi Masyarakat",
        "prompt": "Buatkan soal Sosiologi SMA tentang proses interaksi asosiatif (akomodasi, asimilasi, akulturasi) vs disosiatif (konflik, persaingan)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Nilai dan Norma Sosial serta Keteraturan Sosial",
        "prompt": "Buatkan soal Sosiologi SMA tentang nilai vital/material/kerohanian, norma folkways, mores, customs, hukum, dan sanksinya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sosialisasi & Pembentukan Kepribadian Individu",
        "prompt": "Buatkan soal Sosiologi SMA tentang tahapan sosialisasi (preparatory, play, game, generalized other) dan peran keluarga/teman sebaya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penyimpangan Sosial & Teori Labelling / Anomi",
        "prompt": "Buatkan soal Sosiologi SMA tentang penyimpangan primer/sekunder, teori asosiasi diferensial Edwin Sutherland, dan pengendalian sosial",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Diferensiasi Sosial & Stratifikasi Sosial Terbuka/Tertutup",
        "prompt": "Buatkan soal Sosiologi SMA tentang stratifikasi berdasarkan kekayaan/kekuasaan/pendidikan dan diferensiasi suku/ras/agama",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Konflik Sosial, Kekerasan, & Resolusi Perdamaian",
        "prompt": "Buatkan soal Sosiologi SMA tentang penyebab konflik sosial, bentuk mediasi/arbitrase/konsiliasi, dan integrasi pasca konflik",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kelompok Sosial: Paguyuban & Patembayan",
        "prompt": "Buatkan soal Sosiologi SMA tentang kelompok primer/sekunder, in-group vs out-group, serta solidaritas mekanik vs organik Emile Durkheim",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mobilitas Sosial: Vertikal Naik/Turun & Saluran Mobilitas",
        "prompt": "Buatkan soal Sosiologi SMA tentang mobilitas antargenerasi/intragenerasi, saluran lembaga pendidikan/politik, dan konsekuensi mobilitas",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Perubahan Sosial Budaya & Modernisasi Global",
        "prompt": "Buatkan soal Sosiologi SMA tentang faktor internal/eksternal perubahan sosial, teori siklus vs linier, dan dampak culture lag/culture shock",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Ketimpangan Sosial di Era Digital & Kemiskinan",
        "prompt": "Buatkan soal Sosiologi SMA tentang kesenjangan ekonomi desa-kota, bias gender, diskriminasi sosial, dan upaya pemberdayaan komunitas",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Metodologi Penelitian Sosial: Kualitatif vs Kuantitatif",
        "prompt": "Buatkan soal Sosiologi SMA tentang teknik observasi, wawancara mendalam, angket kuesioner, sampling acak, dan etika riset",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Fungsi Sosiologi dalam Mengkaji Gejala Sosial",
        "prompt": "Buatkan soal Sosiologi SMA tentang ciri sosiologi sebagai ilmu (empiris, teoritis, kumulatif, non-etis) dan objek kajian sosiologi",
        "difficulty": "HARD"
      },
      {
        "label": "Interaksi Sosial, Kontak, & Komunikasi Masyarakat",
        "prompt": "Buatkan soal Sosiologi SMA tentang proses interaksi asosiatif (akomodasi, asimilasi, akulturasi) vs disosiatif (konflik, persaingan)",
        "difficulty": "HARD"
      },
      {
        "label": "Nilai dan Norma Sosial serta Keteraturan Sosial",
        "prompt": "Buatkan soal Sosiologi SMA tentang nilai vital/material/kerohanian, norma folkways, mores, customs, hukum, dan sanksinya",
        "difficulty": "HARD"
      },
      {
        "label": "Sosialisasi & Pembentukan Kepribadian Individu",
        "prompt": "Buatkan soal Sosiologi SMA tentang tahapan sosialisasi (preparatory, play, game, generalized other) dan peran keluarga/teman sebaya",
        "difficulty": "HARD"
      },
      {
        "label": "Penyimpangan Sosial & Teori Labelling / Anomi",
        "prompt": "Buatkan soal Sosiologi SMA tentang penyimpangan primer/sekunder, teori asosiasi diferensial Edwin Sutherland, dan pengendalian sosial",
        "difficulty": "HARD"
      },
      {
        "label": "Diferensiasi Sosial & Stratifikasi Sosial Terbuka/Tertutup",
        "prompt": "Buatkan soal Sosiologi SMA tentang stratifikasi berdasarkan kekayaan/kekuasaan/pendidikan dan diferensiasi suku/ras/agama",
        "difficulty": "HARD"
      },
      {
        "label": "Konflik Sosial, Kekerasan, & Resolusi Perdamaian",
        "prompt": "Buatkan soal Sosiologi SMA tentang penyebab konflik sosial, bentuk mediasi/arbitrase/konsiliasi, dan integrasi pasca konflik",
        "difficulty": "HARD"
      },
      {
        "label": "Kelompok Sosial: Paguyuban & Patembayan",
        "prompt": "Buatkan soal Sosiologi SMA tentang kelompok primer/sekunder, in-group vs out-group, serta solidaritas mekanik vs organik Emile Durkheim",
        "difficulty": "HARD"
      },
      {
        "label": "Mobilitas Sosial: Vertikal Naik/Turun & Saluran Mobilitas",
        "prompt": "Buatkan soal Sosiologi SMA tentang mobilitas antargenerasi/intragenerasi, saluran lembaga pendidikan/politik, dan konsekuensi mobilitas",
        "difficulty": "HARD"
      },
      {
        "label": "Perubahan Sosial Budaya & Modernisasi Global",
        "prompt": "Buatkan soal Sosiologi SMA tentang faktor internal/eksternal perubahan sosial, teori siklus vs linier, dan dampak culture lag/culture shock",
        "difficulty": "HARD"
      },
      {
        "label": "Ketimpangan Sosial di Era Digital & Kemiskinan",
        "prompt": "Buatkan soal Sosiologi SMA tentang kesenjangan ekonomi desa-kota, bias gender, diskriminasi sosial, dan upaya pemberdayaan komunitas",
        "difficulty": "HARD"
      },
      {
        "label": "Metodologi Penelitian Sosial: Kualitatif vs Kuantitatif",
        "prompt": "Buatkan soal Sosiologi SMA tentang teknik observasi, wawancara mendalam, angket kuesioner, sampling acak, dan etika riset",
        "difficulty": "HARD"
      }
    ]
  },
  "ekonomi": {
    "EASY": [
      {
        "label": "Konsep Kelangkaan Sumber Daya & Biaya Peluang",
        "prompt": "Buatkan soal Ekonomi SMA tentang masalah pokok kelangkaan, opportunity cost pemilihan alternatif, dan skala prioritas kebutuhan",
        "difficulty": "EASY"
      },
      {
        "label": "Masalah Pokok Ekonomi & Sistem Ekonomi Dunia",
        "prompt": "Buatkan soal Ekonomi SMA tentang masalah what, how, for whom, serta kelebihan/kelemahan sistem pasar, komando, dan campuran",
        "difficulty": "EASY"
      },
      {
        "label": "Pelaku Ekonomi & Diagram Circular Flow",
        "prompt": "Buatkan soal Ekonomi SMA tentang interaksi 2, 3, dan 4 sektor (RTK, RTP, RTN, RTLN) di pasar input dan pasar output",
        "difficulty": "EASY"
      },
      {
        "label": "Keseimbangan Harga: Permintaan & Penawaran",
        "prompt": "Buatkan soal Ekonomi SMA tentang hukum permintaan/penawaran, fungsi Qd=Qs, pergeseran kurva, dan elastisitas harga (Ed/Es)",
        "difficulty": "EASY"
      },
      {
        "label": "Struktur Pasar: Persaingan Sempurna & Monopoli",
        "prompt": "Buatkan soal Ekonomi SMA tentang karakteristik pasar persaingan sempurna, monopolistik, ciri monopoli alamiah, dan kartel oligopoli",
        "difficulty": "EASY"
      },
      {
        "label": "OJK, Bank Sentral, & Lembaga Perbankan",
        "prompt": "Buatkan soal Ekonomi SMA tentang tugas pengawasan OJK, fungsi independen Bank Indonesia, kebijakan moneter, dan bank umum",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Pembayaran & Pengelolaan Uang Rupiah",
        "prompt": "Buatkan soal Ekonomi SMA tentang uang kartal vs giral, alat pembayaran nontunai (QRIS/Kliring), dan unsur pengaman uang rupiah",
        "difficulty": "EASY"
      },
      {
        "label": "Badan Usaha: BUMN, BUMS, & Koperasi",
        "prompt": "Buatkan soal Ekonomi SMA tentang peran strategis BUMN, bentuk CV/PT/Firma, asas kekeluargaan koperasi, dan pembagian SHU",
        "difficulty": "EASY"
      },
      {
        "label": "Manajemen Perusahaan: Fungsi POAC",
        "prompt": "Buatkan soal Ekonomi SMA tentang Planning, Organizing, Actuating, Controlling, serta bidang pemasaran, operasional, dan keuangan",
        "difficulty": "EASY"
      },
      {
        "label": "Pendapatan Nasional: PDB, PNB, Pendapatan Per Kapita",
        "prompt": "Buatkan soal Ekonomi SMA tentang perhitungan pendekatan produksi, pendapatan, pengeluaran, serta koefisien Gini kesenjangan",
        "difficulty": "EASY"
      },
      {
        "label": "Pertumbuhan Ekonomi, Pembangunan, & Indeks HDI",
        "prompt": "Buatkan soal Ekonomi SMA tentang teori pertumbuhan Schumpeter/Rostow/Solow, indikator IPM (kesehatan, pendidikan, pengeluaran)",
        "difficulty": "EASY"
      },
      {
        "label": "Kebijakan Fiskal, Moneter, APBN, & Pengendalian Inflasi",
        "prompt": "Buatkan soal Ekonomi SMA tentang operasi pasar terbuka, diskonto, giro wajib minimum, pajak belanja negara, dan jenis-jenis inflasi",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Konsep Kelangkaan Sumber Daya & Biaya Peluang",
        "prompt": "Buatkan soal Ekonomi SMA tentang masalah pokok kelangkaan, opportunity cost pemilihan alternatif, dan skala prioritas kebutuhan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Masalah Pokok Ekonomi & Sistem Ekonomi Dunia",
        "prompt": "Buatkan soal Ekonomi SMA tentang masalah what, how, for whom, serta kelebihan/kelemahan sistem pasar, komando, dan campuran",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pelaku Ekonomi & Diagram Circular Flow",
        "prompt": "Buatkan soal Ekonomi SMA tentang interaksi 2, 3, dan 4 sektor (RTK, RTP, RTN, RTLN) di pasar input dan pasar output",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Keseimbangan Harga: Permintaan & Penawaran",
        "prompt": "Buatkan soal Ekonomi SMA tentang hukum permintaan/penawaran, fungsi Qd=Qs, pergeseran kurva, dan elastisitas harga (Ed/Es)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Struktur Pasar: Persaingan Sempurna & Monopoli",
        "prompt": "Buatkan soal Ekonomi SMA tentang karakteristik pasar persaingan sempurna, monopolistik, ciri monopoli alamiah, dan kartel oligopoli",
        "difficulty": "MEDIUM"
      },
      {
        "label": "OJK, Bank Sentral, & Lembaga Perbankan",
        "prompt": "Buatkan soal Ekonomi SMA tentang tugas pengawasan OJK, fungsi independen Bank Indonesia, kebijakan moneter, dan bank umum",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Pembayaran & Pengelolaan Uang Rupiah",
        "prompt": "Buatkan soal Ekonomi SMA tentang uang kartal vs giral, alat pembayaran nontunai (QRIS/Kliring), dan unsur pengaman uang rupiah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Badan Usaha: BUMN, BUMS, & Koperasi",
        "prompt": "Buatkan soal Ekonomi SMA tentang peran strategis BUMN, bentuk CV/PT/Firma, asas kekeluargaan koperasi, dan pembagian SHU",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Manajemen Perusahaan: Fungsi POAC",
        "prompt": "Buatkan soal Ekonomi SMA tentang Planning, Organizing, Actuating, Controlling, serta bidang pemasaran, operasional, dan keuangan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pendapatan Nasional: PDB, PNB, Pendapatan Per Kapita",
        "prompt": "Buatkan soal Ekonomi SMA tentang perhitungan pendekatan produksi, pendapatan, pengeluaran, serta koefisien Gini kesenjangan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pertumbuhan Ekonomi, Pembangunan, & Indeks HDI",
        "prompt": "Buatkan soal Ekonomi SMA tentang teori pertumbuhan Schumpeter/Rostow/Solow, indikator IPM (kesehatan, pendidikan, pengeluaran)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kebijakan Fiskal, Moneter, APBN, & Pengendalian Inflasi",
        "prompt": "Buatkan soal Ekonomi SMA tentang operasi pasar terbuka, diskonto, giro wajib minimum, pajak belanja negara, dan jenis-jenis inflasi",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Konsep Kelangkaan Sumber Daya & Biaya Peluang",
        "prompt": "Buatkan soal Ekonomi SMA tentang masalah pokok kelangkaan, opportunity cost pemilihan alternatif, dan skala prioritas kebutuhan",
        "difficulty": "HARD"
      },
      {
        "label": "Masalah Pokok Ekonomi & Sistem Ekonomi Dunia",
        "prompt": "Buatkan soal Ekonomi SMA tentang masalah what, how, for whom, serta kelebihan/kelemahan sistem pasar, komando, dan campuran",
        "difficulty": "HARD"
      },
      {
        "label": "Pelaku Ekonomi & Diagram Circular Flow",
        "prompt": "Buatkan soal Ekonomi SMA tentang interaksi 2, 3, dan 4 sektor (RTK, RTP, RTN, RTLN) di pasar input dan pasar output",
        "difficulty": "HARD"
      },
      {
        "label": "Keseimbangan Harga: Permintaan & Penawaran",
        "prompt": "Buatkan soal Ekonomi SMA tentang hukum permintaan/penawaran, fungsi Qd=Qs, pergeseran kurva, dan elastisitas harga (Ed/Es)",
        "difficulty": "HARD"
      },
      {
        "label": "Struktur Pasar: Persaingan Sempurna & Monopoli",
        "prompt": "Buatkan soal Ekonomi SMA tentang karakteristik pasar persaingan sempurna, monopolistik, ciri monopoli alamiah, dan kartel oligopoli",
        "difficulty": "HARD"
      },
      {
        "label": "OJK, Bank Sentral, & Lembaga Perbankan",
        "prompt": "Buatkan soal Ekonomi SMA tentang tugas pengawasan OJK, fungsi independen Bank Indonesia, kebijakan moneter, dan bank umum",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Pembayaran & Pengelolaan Uang Rupiah",
        "prompt": "Buatkan soal Ekonomi SMA tentang uang kartal vs giral, alat pembayaran nontunai (QRIS/Kliring), dan unsur pengaman uang rupiah",
        "difficulty": "HARD"
      },
      {
        "label": "Badan Usaha: BUMN, BUMS, & Koperasi",
        "prompt": "Buatkan soal Ekonomi SMA tentang peran strategis BUMN, bentuk CV/PT/Firma, asas kekeluargaan koperasi, dan pembagian SHU",
        "difficulty": "HARD"
      },
      {
        "label": "Manajemen Perusahaan: Fungsi POAC",
        "prompt": "Buatkan soal Ekonomi SMA tentang Planning, Organizing, Actuating, Controlling, serta bidang pemasaran, operasional, dan keuangan",
        "difficulty": "HARD"
      },
      {
        "label": "Pendapatan Nasional: PDB, PNB, Pendapatan Per Kapita",
        "prompt": "Buatkan soal Ekonomi SMA tentang perhitungan pendekatan produksi, pendapatan, pengeluaran, serta koefisien Gini kesenjangan",
        "difficulty": "HARD"
      },
      {
        "label": "Pertumbuhan Ekonomi, Pembangunan, & Indeks HDI",
        "prompt": "Buatkan soal Ekonomi SMA tentang teori pertumbuhan Schumpeter/Rostow/Solow, indikator IPM (kesehatan, pendidikan, pengeluaran)",
        "difficulty": "HARD"
      },
      {
        "label": "Kebijakan Fiskal, Moneter, APBN, & Pengendalian Inflasi",
        "prompt": "Buatkan soal Ekonomi SMA tentang operasi pasar terbuka, diskonto, giro wajib minimum, pajak belanja negara, dan jenis-jenis inflasi",
        "difficulty": "HARD"
      }
    ]
  },
  "geografi": {
    "EASY": [
      {
        "label": "Konsep Esensial, Prinsip, & Pendekatan Geografi",
        "prompt": "Buatkan soal Geografi SMA tentang 10 konsep esensial (lokasi, jarak, morfologi, aglomerasi), 4 prinsip geografi, dan pendekatan keruangan",
        "difficulty": "EASY"
      },
      {
        "label": "Dasar Pemetaan, Penginderaan Jauh, & Analisis SIG",
        "prompt": "Buatkan soal Geografi SMA tentang proyeksi peta, interpretasi citra foto udara (rona, bentuk, bayangan), dan overlay layer SIG",
        "difficulty": "EASY"
      },
      {
        "label": "Dinamika Litosfer: Tektonisme, Vulkanisme, & Seisme",
        "prompt": "Buatkan soal Geografi SMA tentang gerak lempeng tektonik konvergen/divergen, jenis erupsi gunung api, episentrum gempa, dan mitigasi gempa",
        "difficulty": "EASY"
      },
      {
        "label": "Dinamika Atmosfer: Cuaca, Iklim, & Klasifikasi Koppen",
        "prompt": "Buatkan soal Geografi SMA tentang unsur cuaca (suhu, kelembapan, tekanan), angin muson barat/timur, dan penentuan tipe iklim",
        "difficulty": "EASY"
      },
      {
        "label": "Dinamika Hidrosfer: Siklus Air, DAS, & Konservasi Air",
        "prompt": "Buatkan soal Geografi SMA tentang morfologi Daerah Aliran Sungai (hulu, tengah, hilir), zona laut teritorial/ZEE, dan intrusi air laut",
        "difficulty": "EASY"
      },
      {
        "label": "Sebaran Flora dan Fauna di Indonesia & Dunia",
        "prompt": "Buatkan soal Geografi SMA tentang garis Wallace & Weber (fauna Asiatis, Peralihan, Australis) serta karakteristik bioma taiga, tundra, savana",
        "difficulty": "EASY"
      },
      {
        "label": "Pengelolaan Sumber Daya Alam Berkelanjutan",
        "prompt": "Buatkan soal Geografi SMA tentang prinsip pembangunan berkelanjutan (ekofisiensi), AMDAL, dan potensi energi terbarukan Indonesia",
        "difficulty": "EASY"
      },
      {
        "label": "Dinamika Kependudukan & Proyeksi Demografi",
        "prompt": "Buatkan soal Geografi SMA tentang sensus penduduk, angka dependency ratio beban ketergantungan, bonus demografi, dan urbanisasi",
        "difficulty": "EASY"
      },
      {
        "label": "Mitigasi & Adaptasi Kebencanaan di Wilayah Indonesia",
        "prompt": "Buatkan soal Geografi SMA tentang siklus mitigasi pra-bencana, tanggap darurat, dan pasca-bencana gempa, tsunami, banjir, longsor",
        "difficulty": "EASY"
      },
      {
        "label": "Pola Keruangan Desa dan Kota serta Struktur Ruang",
        "prompt": "Buatkan soal Geografi SMA tentang ciri masyarakat desa agraris, teori konsentris/sektoral Burgess-Hoyt, dan zona interaksi desa-kota",
        "difficulty": "EASY"
      },
      {
        "label": "Interaksi Spasial Desa-Kota & Teori Gravitasi",
        "prompt": "Buatkan soal Geografi SMA tentang perhitungan kekuatan interaksi antar kota rumus gravitasi Carey dan titik henti Breaking Point",
        "difficulty": "EASY"
      },
      {
        "label": "Pusat Pertumbuhan Wilayah & Kerjasama Regional",
        "prompt": "Buatkan soal Geografi SMA tentang teori tempat sentral Christaller, teori kutub pertumbuhan Perroux, dan indikator negara maju vs berkembang",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Konsep Esensial, Prinsip, & Pendekatan Geografi",
        "prompt": "Buatkan soal Geografi SMA tentang 10 konsep esensial (lokasi, jarak, morfologi, aglomerasi), 4 prinsip geografi, dan pendekatan keruangan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Dasar Pemetaan, Penginderaan Jauh, & Analisis SIG",
        "prompt": "Buatkan soal Geografi SMA tentang proyeksi peta, interpretasi citra foto udara (rona, bentuk, bayangan), dan overlay layer SIG",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Dinamika Litosfer: Tektonisme, Vulkanisme, & Seisme",
        "prompt": "Buatkan soal Geografi SMA tentang gerak lempeng tektonik konvergen/divergen, jenis erupsi gunung api, episentrum gempa, dan mitigasi gempa",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Dinamika Atmosfer: Cuaca, Iklim, & Klasifikasi Koppen",
        "prompt": "Buatkan soal Geografi SMA tentang unsur cuaca (suhu, kelembapan, tekanan), angin muson barat/timur, dan penentuan tipe iklim",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Dinamika Hidrosfer: Siklus Air, DAS, & Konservasi Air",
        "prompt": "Buatkan soal Geografi SMA tentang morfologi Daerah Aliran Sungai (hulu, tengah, hilir), zona laut teritorial/ZEE, dan intrusi air laut",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sebaran Flora dan Fauna di Indonesia & Dunia",
        "prompt": "Buatkan soal Geografi SMA tentang garis Wallace & Weber (fauna Asiatis, Peralihan, Australis) serta karakteristik bioma taiga, tundra, savana",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pengelolaan Sumber Daya Alam Berkelanjutan",
        "prompt": "Buatkan soal Geografi SMA tentang prinsip pembangunan berkelanjutan (ekofisiensi), AMDAL, dan potensi energi terbarukan Indonesia",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Dinamika Kependudukan & Proyeksi Demografi",
        "prompt": "Buatkan soal Geografi SMA tentang sensus penduduk, angka dependency ratio beban ketergantungan, bonus demografi, dan urbanisasi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Mitigasi & Adaptasi Kebencanaan di Wilayah Indonesia",
        "prompt": "Buatkan soal Geografi SMA tentang siklus mitigasi pra-bencana, tanggap darurat, dan pasca-bencana gempa, tsunami, banjir, longsor",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pola Keruangan Desa dan Kota serta Struktur Ruang",
        "prompt": "Buatkan soal Geografi SMA tentang ciri masyarakat desa agraris, teori konsentris/sektoral Burgess-Hoyt, dan zona interaksi desa-kota",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Interaksi Spasial Desa-Kota & Teori Gravitasi",
        "prompt": "Buatkan soal Geografi SMA tentang perhitungan kekuatan interaksi antar kota rumus gravitasi Carey dan titik henti Breaking Point",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pusat Pertumbuhan Wilayah & Kerjasama Regional",
        "prompt": "Buatkan soal Geografi SMA tentang teori tempat sentral Christaller, teori kutub pertumbuhan Perroux, dan indikator negara maju vs berkembang",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Konsep Esensial, Prinsip, & Pendekatan Geografi",
        "prompt": "Buatkan soal Geografi SMA tentang 10 konsep esensial (lokasi, jarak, morfologi, aglomerasi), 4 prinsip geografi, dan pendekatan keruangan",
        "difficulty": "HARD"
      },
      {
        "label": "Dasar Pemetaan, Penginderaan Jauh, & Analisis SIG",
        "prompt": "Buatkan soal Geografi SMA tentang proyeksi peta, interpretasi citra foto udara (rona, bentuk, bayangan), dan overlay layer SIG",
        "difficulty": "HARD"
      },
      {
        "label": "Dinamika Litosfer: Tektonisme, Vulkanisme, & Seisme",
        "prompt": "Buatkan soal Geografi SMA tentang gerak lempeng tektonik konvergen/divergen, jenis erupsi gunung api, episentrum gempa, dan mitigasi gempa",
        "difficulty": "HARD"
      },
      {
        "label": "Dinamika Atmosfer: Cuaca, Iklim, & Klasifikasi Koppen",
        "prompt": "Buatkan soal Geografi SMA tentang unsur cuaca (suhu, kelembapan, tekanan), angin muson barat/timur, dan penentuan tipe iklim",
        "difficulty": "HARD"
      },
      {
        "label": "Dinamika Hidrosfer: Siklus Air, DAS, & Konservasi Air",
        "prompt": "Buatkan soal Geografi SMA tentang morfologi Daerah Aliran Sungai (hulu, tengah, hilir), zona laut teritorial/ZEE, dan intrusi air laut",
        "difficulty": "HARD"
      },
      {
        "label": "Sebaran Flora dan Fauna di Indonesia & Dunia",
        "prompt": "Buatkan soal Geografi SMA tentang garis Wallace & Weber (fauna Asiatis, Peralihan, Australis) serta karakteristik bioma taiga, tundra, savana",
        "difficulty": "HARD"
      },
      {
        "label": "Pengelolaan Sumber Daya Alam Berkelanjutan",
        "prompt": "Buatkan soal Geografi SMA tentang prinsip pembangunan berkelanjutan (ekofisiensi), AMDAL, dan potensi energi terbarukan Indonesia",
        "difficulty": "HARD"
      },
      {
        "label": "Dinamika Kependudukan & Proyeksi Demografi",
        "prompt": "Buatkan soal Geografi SMA tentang sensus penduduk, angka dependency ratio beban ketergantungan, bonus demografi, dan urbanisasi",
        "difficulty": "HARD"
      },
      {
        "label": "Mitigasi & Adaptasi Kebencanaan di Wilayah Indonesia",
        "prompt": "Buatkan soal Geografi SMA tentang siklus mitigasi pra-bencana, tanggap darurat, dan pasca-bencana gempa, tsunami, banjir, longsor",
        "difficulty": "HARD"
      },
      {
        "label": "Pola Keruangan Desa dan Kota serta Struktur Ruang",
        "prompt": "Buatkan soal Geografi SMA tentang ciri masyarakat desa agraris, teori konsentris/sektoral Burgess-Hoyt, dan zona interaksi desa-kota",
        "difficulty": "HARD"
      },
      {
        "label": "Interaksi Spasial Desa-Kota & Teori Gravitasi",
        "prompt": "Buatkan soal Geografi SMA tentang perhitungan kekuatan interaksi antar kota rumus gravitasi Carey dan titik henti Breaking Point",
        "difficulty": "HARD"
      },
      {
        "label": "Pusat Pertumbuhan Wilayah & Kerjasama Regional",
        "prompt": "Buatkan soal Geografi SMA tentang teori tempat sentral Christaller, teori kutub pertumbuhan Perroux, dan indikator negara maju vs berkembang",
        "difficulty": "HARD"
      }
    ]
  },
  "sejarah": {
    "EASY": [
      {
        "label": "Konsep Berpikir Diakronik, Sinkronik, & Periodisasi",
        "prompt": "Buatkan soal Sejarah SMA tentang berpikir kronologis memanjang dalam waktu, sinkronik meluas dalam ruang, dan kausalitas sejarah",
        "difficulty": "EASY"
      },
      {
        "label": "Sumber Sejarah Primer, Sekunder, & Kritik Historiografi",
        "prompt": "Buatkan soal Sejarah SMA tentang kritik eksternal (keaslian arsip) vs kritik internal (kredibilitas isi), dan tahapan penelitian sejarah",
        "difficulty": "EASY"
      },
      {
        "label": "Kerajaan Maritim Hindu-Buddha di Nusantara",
        "prompt": "Buatkan soal Sejarah SMA tentang jalur perdagangan maritim Sriwijaya, agraris Mataram Kuno, ekspedisi Pamalayu, dan sumpah Palapa Majapahit",
        "difficulty": "EASY"
      },
      {
        "label": "Jalur Rempah & Kejayaan Kerajaan-Kerajaan Islam",
        "prompt": "Buatkan soal Sejarah SMA tentang Samudera Pasai, Kesultanan Malaka, Demak, Banten, Ternate-Tidore, dan akulturasi budaya Islam-lokal",
        "difficulty": "EASY"
      },
      {
        "label": "Kebijakan Kolonialisme: VOC hingga Hindia Belanda",
        "prompt": "Buatkan soal Sejarah SMA tentang hak Octrooi VOC, sistem sewa tanah Raffles, tanam paksa van den Bosch, dan politik etis",
        "difficulty": "EASY"
      },
      {
        "label": "Perang Melawan Kolonialisme & Tokoh Pahlawan Daerah",
        "prompt": "Buatkan soal Sejarah SMA tentang perlawanan Pattimura, Perang Padri Tuanku Imam Bonjol, Perang Jawa Pangeran Diponegoro, dan Perang Aceh",
        "difficulty": "EASY"
      },
      {
        "label": "Pergerakan Nasional 1908 & Sumpah Pemuda 1928",
        "prompt": "Buatkan soal Sejarah SMA tentang berdirinya Budi Utomo, radikalisasi pergerakan nasional, Kongres Pemuda II, dan peran media cetak",
        "difficulty": "EASY"
      },
      {
        "label": "Pendudukan Militer Jepang & Sidang BPUPKI/PPKI",
        "prompt": "Buatkan soal Sejarah SMA tentang organisasi bentukan Jepang (Putera, Peta, Heiho), eksploitasi romusha, dan sidang perumusan dasar negara",
        "difficulty": "EASY"
      },
      {
        "label": "Peristiwa Rengasdengklok & Proklamasi 17 Agustus 1945",
        "prompt": "Buatkan soal Sejarah SMA tentang perbedaan pendapat golongan muda vs tua, perumusan naskah di rumah Tadashi Maeda, dan maknanya",
        "difficulty": "EASY"
      },
      {
        "label": "Perjuangan Mempertahankan Kemerdekaan Fisik & Diplomasi",
        "prompt": "Buatkan soal Sejarah SMA tentang pertempuran Surabaya 10 November, Bandung Lautan Api, perundingan Linggarjati, Renville, dan KMB 1949",
        "difficulty": "EASY"
      },
      {
        "label": "Demokrasi Parlementer (Liberal) & Demokrasi Terpimpin",
        "prompt": "Buatkan soal Sejarah SMA tentang sistem kabinet jatuh-bangun, Konferensi Asia Afrika 1955, Pemilu 1955, dan Dekrit Presiden 5 Juli 1959",
        "difficulty": "EASY"
      },
      {
        "label": "Masa Orde Baru, Krisis Moneter, & Era Reformasi 1998",
        "prompt": "Buatkan soal Sejarah SMA tentang program pembangunan Repelita, dwifungsi ABRI, gerakan mahasiswa 1998, dan agenda reformasi",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Konsep Berpikir Diakronik, Sinkronik, & Periodisasi",
        "prompt": "Buatkan soal Sejarah SMA tentang berpikir kronologis memanjang dalam waktu, sinkronik meluas dalam ruang, dan kausalitas sejarah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sumber Sejarah Primer, Sekunder, & Kritik Historiografi",
        "prompt": "Buatkan soal Sejarah SMA tentang kritik eksternal (keaslian arsip) vs kritik internal (kredibilitas isi), dan tahapan penelitian sejarah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kerajaan Maritim Hindu-Buddha di Nusantara",
        "prompt": "Buatkan soal Sejarah SMA tentang jalur perdagangan maritim Sriwijaya, agraris Mataram Kuno, ekspedisi Pamalayu, dan sumpah Palapa Majapahit",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Jalur Rempah & Kejayaan Kerajaan-Kerajaan Islam",
        "prompt": "Buatkan soal Sejarah SMA tentang Samudera Pasai, Kesultanan Malaka, Demak, Banten, Ternate-Tidore, dan akulturasi budaya Islam-lokal",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kebijakan Kolonialisme: VOC hingga Hindia Belanda",
        "prompt": "Buatkan soal Sejarah SMA tentang hak Octrooi VOC, sistem sewa tanah Raffles, tanam paksa van den Bosch, dan politik etis",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Perang Melawan Kolonialisme & Tokoh Pahlawan Daerah",
        "prompt": "Buatkan soal Sejarah SMA tentang perlawanan Pattimura, Perang Padri Tuanku Imam Bonjol, Perang Jawa Pangeran Diponegoro, dan Perang Aceh",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pergerakan Nasional 1908 & Sumpah Pemuda 1928",
        "prompt": "Buatkan soal Sejarah SMA tentang berdirinya Budi Utomo, radikalisasi pergerakan nasional, Kongres Pemuda II, dan peran media cetak",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pendudukan Militer Jepang & Sidang BPUPKI/PPKI",
        "prompt": "Buatkan soal Sejarah SMA tentang organisasi bentukan Jepang (Putera, Peta, Heiho), eksploitasi romusha, dan sidang perumusan dasar negara",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Peristiwa Rengasdengklok & Proklamasi 17 Agustus 1945",
        "prompt": "Buatkan soal Sejarah SMA tentang perbedaan pendapat golongan muda vs tua, perumusan naskah di rumah Tadashi Maeda, dan maknanya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Perjuangan Mempertahankan Kemerdekaan Fisik & Diplomasi",
        "prompt": "Buatkan soal Sejarah SMA tentang pertempuran Surabaya 10 November, Bandung Lautan Api, perundingan Linggarjati, Renville, dan KMB 1949",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Demokrasi Parlementer (Liberal) & Demokrasi Terpimpin",
        "prompt": "Buatkan soal Sejarah SMA tentang sistem kabinet jatuh-bangun, Konferensi Asia Afrika 1955, Pemilu 1955, dan Dekrit Presiden 5 Juli 1959",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Masa Orde Baru, Krisis Moneter, & Era Reformasi 1998",
        "prompt": "Buatkan soal Sejarah SMA tentang program pembangunan Repelita, dwifungsi ABRI, gerakan mahasiswa 1998, dan agenda reformasi",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Konsep Berpikir Diakronik, Sinkronik, & Periodisasi",
        "prompt": "Buatkan soal Sejarah SMA tentang berpikir kronologis memanjang dalam waktu, sinkronik meluas dalam ruang, dan kausalitas sejarah",
        "difficulty": "HARD"
      },
      {
        "label": "Sumber Sejarah Primer, Sekunder, & Kritik Historiografi",
        "prompt": "Buatkan soal Sejarah SMA tentang kritik eksternal (keaslian arsip) vs kritik internal (kredibilitas isi), dan tahapan penelitian sejarah",
        "difficulty": "HARD"
      },
      {
        "label": "Kerajaan Maritim Hindu-Buddha di Nusantara",
        "prompt": "Buatkan soal Sejarah SMA tentang jalur perdagangan maritim Sriwijaya, agraris Mataram Kuno, ekspedisi Pamalayu, dan sumpah Palapa Majapahit",
        "difficulty": "HARD"
      },
      {
        "label": "Jalur Rempah & Kejayaan Kerajaan-Kerajaan Islam",
        "prompt": "Buatkan soal Sejarah SMA tentang Samudera Pasai, Kesultanan Malaka, Demak, Banten, Ternate-Tidore, dan akulturasi budaya Islam-lokal",
        "difficulty": "HARD"
      },
      {
        "label": "Kebijakan Kolonialisme: VOC hingga Hindia Belanda",
        "prompt": "Buatkan soal Sejarah SMA tentang hak Octrooi VOC, sistem sewa tanah Raffles, tanam paksa van den Bosch, dan politik etis",
        "difficulty": "HARD"
      },
      {
        "label": "Perang Melawan Kolonialisme & Tokoh Pahlawan Daerah",
        "prompt": "Buatkan soal Sejarah SMA tentang perlawanan Pattimura, Perang Padri Tuanku Imam Bonjol, Perang Jawa Pangeran Diponegoro, dan Perang Aceh",
        "difficulty": "HARD"
      },
      {
        "label": "Pergerakan Nasional 1908 & Sumpah Pemuda 1928",
        "prompt": "Buatkan soal Sejarah SMA tentang berdirinya Budi Utomo, radikalisasi pergerakan nasional, Kongres Pemuda II, dan peran media cetak",
        "difficulty": "HARD"
      },
      {
        "label": "Pendudukan Militer Jepang & Sidang BPUPKI/PPKI",
        "prompt": "Buatkan soal Sejarah SMA tentang organisasi bentukan Jepang (Putera, Peta, Heiho), eksploitasi romusha, dan sidang perumusan dasar negara",
        "difficulty": "HARD"
      },
      {
        "label": "Peristiwa Rengasdengklok & Proklamasi 17 Agustus 1945",
        "prompt": "Buatkan soal Sejarah SMA tentang perbedaan pendapat golongan muda vs tua, perumusan naskah di rumah Tadashi Maeda, dan maknanya",
        "difficulty": "HARD"
      },
      {
        "label": "Perjuangan Mempertahankan Kemerdekaan Fisik & Diplomasi",
        "prompt": "Buatkan soal Sejarah SMA tentang pertempuran Surabaya 10 November, Bandung Lautan Api, perundingan Linggarjati, Renville, dan KMB 1949",
        "difficulty": "HARD"
      },
      {
        "label": "Demokrasi Parlementer (Liberal) & Demokrasi Terpimpin",
        "prompt": "Buatkan soal Sejarah SMA tentang sistem kabinet jatuh-bangun, Konferensi Asia Afrika 1955, Pemilu 1955, dan Dekrit Presiden 5 Juli 1959",
        "difficulty": "HARD"
      },
      {
        "label": "Masa Orde Baru, Krisis Moneter, & Era Reformasi 1998",
        "prompt": "Buatkan soal Sejarah SMA tentang program pembangunan Repelita, dwifungsi ABRI, gerakan mahasiswa 1998, dan agenda reformasi",
        "difficulty": "HARD"
      }
    ]
  },
  "pancasila": {
    "EASY": [
      {
        "label": "Pancasila sebagai Ideologi Terbuka dalam Arus Globalisasi",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang dimensi idealitas, normatif, realitas ideologi terbuka, dan penyaringan nilai asing",
        "difficulty": "EASY"
      },
      {
        "label": "Pelanggaran HAM Berat & Mekanisme Pengadilan HAM",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang kejahatan genosida, kejahatan terhadap kemanusiaan menurut UU No. 26 Tahun 2000",
        "difficulty": "EASY"
      },
      {
        "label": "Pembagian Kekuasaan Lembaga Negara UUD 1945",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang sistem checks and balances antar MPR, DPR, DPD, Presiden, MA, MK, dan BPK",
        "difficulty": "EASY"
      },
      {
        "label": "Kewenangan Mahkamah Konstitusi & Komisi Yudisial",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang judicial review pengujian UU terhadap UUD, sengketa kewenangan lembaga negara, dan kode etik hakim",
        "difficulty": "EASY"
      },
      {
        "label": "Hubungan Pemerintah Pusat & Daerah dalam Otonomi Daerah",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang asas desentralisasi, dekonsentrasi, tugas pembantuan, dan wewenang fiskal daerah",
        "difficulty": "EASY"
      },
      {
        "label": "Perlindungan & Penegakan Hukum dalam Menjamin Keadilan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang asas praduga tak bersalah, peran advokat/polisi/jaksa/hakim dalam peradilan adil",
        "difficulty": "EASY"
      },
      {
        "label": "Wawasan Nusantara sebagai Geopolitik Bangsa Indonesia",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang asas kesatuan wilayah darat, laut, udara, dan perwujudan kepulauan nusantara",
        "difficulty": "EASY"
      },
      {
        "label": "Ketahanan Nasional: Analisis Panca Gatra & Tri Gatra",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang aspek geografi, demografi, SDA serta ideologi, politik, ekonomi, sosial budaya, hankam",
        "difficulty": "EASY"
      },
      {
        "label": "Ancaman terhadap Integrasi Nasional (Militer & Non-Militer)",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang spionase, sabotase, cyber war, separatisme, politik identitas, dan radikalisme",
        "difficulty": "EASY"
      },
      {
        "label": "Peran Indonesia dalam Hubungan Internasional & Perdamaian",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang politik luar negeri bebas aktif, pengiriman Kontingen Garuda PBB, dan kepemimpinan ASEAN",
        "difficulty": "EASY"
      },
      {
        "label": "Etika Digital, Demokrasi Sehat, & Pencegahan Hoaks",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang kebebasan berekspresi bertanggung jawab UU ITE dan literasi politik pemilih pemula",
        "difficulty": "EASY"
      },
      {
        "label": "Penguatan Karakter Profil Pelajar Pancasila",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang 6 dimensi profil pelajar pancasila: bernalar kritis, kreatif, mandiri, gotong royong",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Pancasila sebagai Ideologi Terbuka dalam Arus Globalisasi",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang dimensi idealitas, normatif, realitas ideologi terbuka, dan penyaringan nilai asing",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pelanggaran HAM Berat & Mekanisme Pengadilan HAM",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang kejahatan genosida, kejahatan terhadap kemanusiaan menurut UU No. 26 Tahun 2000",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pembagian Kekuasaan Lembaga Negara UUD 1945",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang sistem checks and balances antar MPR, DPR, DPD, Presiden, MA, MK, dan BPK",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kewenangan Mahkamah Konstitusi & Komisi Yudisial",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang judicial review pengujian UU terhadap UUD, sengketa kewenangan lembaga negara, dan kode etik hakim",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Hubungan Pemerintah Pusat & Daerah dalam Otonomi Daerah",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang asas desentralisasi, dekonsentrasi, tugas pembantuan, dan wewenang fiskal daerah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Perlindungan & Penegakan Hukum dalam Menjamin Keadilan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang asas praduga tak bersalah, peran advokat/polisi/jaksa/hakim dalam peradilan adil",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Wawasan Nusantara sebagai Geopolitik Bangsa Indonesia",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang asas kesatuan wilayah darat, laut, udara, dan perwujudan kepulauan nusantara",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Ketahanan Nasional: Analisis Panca Gatra & Tri Gatra",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang aspek geografi, demografi, SDA serta ideologi, politik, ekonomi, sosial budaya, hankam",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Ancaman terhadap Integrasi Nasional (Militer & Non-Militer)",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang spionase, sabotase, cyber war, separatisme, politik identitas, dan radikalisme",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Peran Indonesia dalam Hubungan Internasional & Perdamaian",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang politik luar negeri bebas aktif, pengiriman Kontingen Garuda PBB, dan kepemimpinan ASEAN",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Etika Digital, Demokrasi Sehat, & Pencegahan Hoaks",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang kebebasan berekspresi bertanggung jawab UU ITE dan literasi politik pemilih pemula",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penguatan Karakter Profil Pelajar Pancasila",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang 6 dimensi profil pelajar pancasila: bernalar kritis, kreatif, mandiri, gotong royong",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Pancasila sebagai Ideologi Terbuka dalam Arus Globalisasi",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang dimensi idealitas, normatif, realitas ideologi terbuka, dan penyaringan nilai asing",
        "difficulty": "HARD"
      },
      {
        "label": "Pelanggaran HAM Berat & Mekanisme Pengadilan HAM",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang kejahatan genosida, kejahatan terhadap kemanusiaan menurut UU No. 26 Tahun 2000",
        "difficulty": "HARD"
      },
      {
        "label": "Pembagian Kekuasaan Lembaga Negara UUD 1945",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang sistem checks and balances antar MPR, DPR, DPD, Presiden, MA, MK, dan BPK",
        "difficulty": "HARD"
      },
      {
        "label": "Kewenangan Mahkamah Konstitusi & Komisi Yudisial",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang judicial review pengujian UU terhadap UUD, sengketa kewenangan lembaga negara, dan kode etik hakim",
        "difficulty": "HARD"
      },
      {
        "label": "Hubungan Pemerintah Pusat & Daerah dalam Otonomi Daerah",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang asas desentralisasi, dekonsentrasi, tugas pembantuan, dan wewenang fiskal daerah",
        "difficulty": "HARD"
      },
      {
        "label": "Perlindungan & Penegakan Hukum dalam Menjamin Keadilan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang asas praduga tak bersalah, peran advokat/polisi/jaksa/hakim dalam peradilan adil",
        "difficulty": "HARD"
      },
      {
        "label": "Wawasan Nusantara sebagai Geopolitik Bangsa Indonesia",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang asas kesatuan wilayah darat, laut, udara, dan perwujudan kepulauan nusantara",
        "difficulty": "HARD"
      },
      {
        "label": "Ketahanan Nasional: Analisis Panca Gatra & Tri Gatra",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang aspek geografi, demografi, SDA serta ideologi, politik, ekonomi, sosial budaya, hankam",
        "difficulty": "HARD"
      },
      {
        "label": "Ancaman terhadap Integrasi Nasional (Militer & Non-Militer)",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang spionase, sabotase, cyber war, separatisme, politik identitas, dan radikalisme",
        "difficulty": "HARD"
      },
      {
        "label": "Peran Indonesia dalam Hubungan Internasional & Perdamaian",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang politik luar negeri bebas aktif, pengiriman Kontingen Garuda PBB, dan kepemimpinan ASEAN",
        "difficulty": "HARD"
      },
      {
        "label": "Etika Digital, Demokrasi Sehat, & Pencegahan Hoaks",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang kebebasan berekspresi bertanggung jawab UU ITE dan literasi politik pemilih pemula",
        "difficulty": "HARD"
      },
      {
        "label": "Penguatan Karakter Profil Pelajar Pancasila",
        "prompt": "Buatkan soal Pendidikan Pancasila SMA tentang 6 dimensi profil pelajar pancasila: bernalar kritis, kreatif, mandiri, gotong royong",
        "difficulty": "HARD"
      }
    ]
  },
  "seni": {
    "EASY": [
      {
        "label": "Apresiasi & Kritik Seni Rupa Kontemporer",
        "prompt": "Buatkan soal Seni Budaya SMA tentang 4 tahapan kritik seni Feldman (deskripsi, analisis formal, interpretasi, evaluasi)",
        "difficulty": "EASY"
      },
      {
        "label": "Teknik Seni Lukis Modern: Realisme & Surealisme",
        "prompt": "Buatkan soal Seni Budaya SMA tentang karakteristik gaya lukis impresionisme, ekspresionisme, surealisme, dan karya maestro Affandi",
        "difficulty": "EASY"
      },
      {
        "label": "Konsep & Manajemen Pameran Seni Rupa Sekolah",
        "prompt": "Buatkan soal Seni Budaya SMA tentang kurasi karya seni rupa, perancangan proposal pameran, katalog pameran, dan tata letak display",
        "difficulty": "EASY"
      },
      {
        "label": "Eksplorasi Musik Kontemporer & Kolaborasi Etnik",
        "prompt": "Buatkan soal Seni Budaya SMA tentang teknik poliritmik, instrumen musik non-konvensional, dan harmonisasi tangga nada modal",
        "difficulty": "EASY"
      },
      {
        "label": "Tangga Nada Kromatik, Modus Musik, & Partitur Not Balok",
        "prompt": "Buatkan soal Seni Budaya SMA tentang membaca tanda sukat (time signature), interval nada, tanda kromatis kres/mol, dan akord",
        "difficulty": "EASY"
      },
      {
        "label": "Analisis Koreografi Tari Kreasi Berbasis Tradisi",
        "prompt": "Buatkan soal Seni Budaya SMA tentang eksplorasi gerak ruang, tenaga, waktu, desain dramatik, dan simbol makna tari kreasi baru",
        "difficulty": "EASY"
      },
      {
        "label": "Desain Tata Artistik Panggung, Busana, & Lighting Tari",
        "prompt": "Buatkan soal Seni Budaya SMA tentang fungsi lighting general/spotlight, pemilihan bahan kostum tradisional modern, dan tata pentas",
        "difficulty": "EASY"
      },
      {
        "label": "Pementasan Teater Kontemporer & Naskah Drama",
        "prompt": "Buatkan soal Seni Budaya SMA tentang olah vokal diafragma, blocking dinamis, motivasi batin karakter tokoh, dan dramatisasi konflik",
        "difficulty": "EASY"
      },
      {
        "label": "Tata Artistik Panggung Teater & Efek Suara Foley",
        "prompt": "Buatkan soal Seni Budaya SMA tentang perancangan setting latar panggung, tata rias karakter penuaan/luka, dan sinkronisasi audio",
        "difficulty": "EASY"
      },
      {
        "label": "Desain Produk Kriya Nusantara Berdaya Saing Global",
        "prompt": "Buatkan soal Seni Budaya SMA tentang inovasi kerajinan kriya kayu/logam/tekstil berwawasan lingkungan dan bernilai estetis tinggi",
        "difficulty": "EASY"
      },
      {
        "label": "Hak Kekayaan Intelektual (HAKI) Karya Seni & Hak Cipta",
        "prompt": "Buatkan soal Seni Budaya SMA tentang perlindungan hak moral, hak ekonomi pencipta, lisensi karya seni, dan pencegahan plagiarisme",
        "difficulty": "EASY"
      },
      {
        "label": "Kurasi Karya Seni Rupa & Penulisan Esai Apresiasi",
        "prompt": "Buatkan soal Seni Budaya SMA tentang kriteria kuratorial kualitas karya seni rupa dan penulisan ulasan apresiasi estetika",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Apresiasi & Kritik Seni Rupa Kontemporer",
        "prompt": "Buatkan soal Seni Budaya SMA tentang 4 tahapan kritik seni Feldman (deskripsi, analisis formal, interpretasi, evaluasi)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teknik Seni Lukis Modern: Realisme & Surealisme",
        "prompt": "Buatkan soal Seni Budaya SMA tentang karakteristik gaya lukis impresionisme, ekspresionisme, surealisme, dan karya maestro Affandi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Konsep & Manajemen Pameran Seni Rupa Sekolah",
        "prompt": "Buatkan soal Seni Budaya SMA tentang kurasi karya seni rupa, perancangan proposal pameran, katalog pameran, dan tata letak display",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Eksplorasi Musik Kontemporer & Kolaborasi Etnik",
        "prompt": "Buatkan soal Seni Budaya SMA tentang teknik poliritmik, instrumen musik non-konvensional, dan harmonisasi tangga nada modal",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Tangga Nada Kromatik, Modus Musik, & Partitur Not Balok",
        "prompt": "Buatkan soal Seni Budaya SMA tentang membaca tanda sukat (time signature), interval nada, tanda kromatis kres/mol, dan akord",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Analisis Koreografi Tari Kreasi Berbasis Tradisi",
        "prompt": "Buatkan soal Seni Budaya SMA tentang eksplorasi gerak ruang, tenaga, waktu, desain dramatik, dan simbol makna tari kreasi baru",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Desain Tata Artistik Panggung, Busana, & Lighting Tari",
        "prompt": "Buatkan soal Seni Budaya SMA tentang fungsi lighting general/spotlight, pemilihan bahan kostum tradisional modern, dan tata pentas",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pementasan Teater Kontemporer & Naskah Drama",
        "prompt": "Buatkan soal Seni Budaya SMA tentang olah vokal diafragma, blocking dinamis, motivasi batin karakter tokoh, dan dramatisasi konflik",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Tata Artistik Panggung Teater & Efek Suara Foley",
        "prompt": "Buatkan soal Seni Budaya SMA tentang perancangan setting latar panggung, tata rias karakter penuaan/luka, dan sinkronisasi audio",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Desain Produk Kriya Nusantara Berdaya Saing Global",
        "prompt": "Buatkan soal Seni Budaya SMA tentang inovasi kerajinan kriya kayu/logam/tekstil berwawasan lingkungan dan bernilai estetis tinggi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Hak Kekayaan Intelektual (HAKI) Karya Seni & Hak Cipta",
        "prompt": "Buatkan soal Seni Budaya SMA tentang perlindungan hak moral, hak ekonomi pencipta, lisensi karya seni, dan pencegahan plagiarisme",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kurasi Karya Seni Rupa & Penulisan Esai Apresiasi",
        "prompt": "Buatkan soal Seni Budaya SMA tentang kriteria kuratorial kualitas karya seni rupa dan penulisan ulasan apresiasi estetika",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Apresiasi & Kritik Seni Rupa Kontemporer",
        "prompt": "Buatkan soal Seni Budaya SMA tentang 4 tahapan kritik seni Feldman (deskripsi, analisis formal, interpretasi, evaluasi)",
        "difficulty": "HARD"
      },
      {
        "label": "Teknik Seni Lukis Modern: Realisme & Surealisme",
        "prompt": "Buatkan soal Seni Budaya SMA tentang karakteristik gaya lukis impresionisme, ekspresionisme, surealisme, dan karya maestro Affandi",
        "difficulty": "HARD"
      },
      {
        "label": "Konsep & Manajemen Pameran Seni Rupa Sekolah",
        "prompt": "Buatkan soal Seni Budaya SMA tentang kurasi karya seni rupa, perancangan proposal pameran, katalog pameran, dan tata letak display",
        "difficulty": "HARD"
      },
      {
        "label": "Eksplorasi Musik Kontemporer & Kolaborasi Etnik",
        "prompt": "Buatkan soal Seni Budaya SMA tentang teknik poliritmik, instrumen musik non-konvensional, dan harmonisasi tangga nada modal",
        "difficulty": "HARD"
      },
      {
        "label": "Tangga Nada Kromatik, Modus Musik, & Partitur Not Balok",
        "prompt": "Buatkan soal Seni Budaya SMA tentang membaca tanda sukat (time signature), interval nada, tanda kromatis kres/mol, dan akord",
        "difficulty": "HARD"
      },
      {
        "label": "Analisis Koreografi Tari Kreasi Berbasis Tradisi",
        "prompt": "Buatkan soal Seni Budaya SMA tentang eksplorasi gerak ruang, tenaga, waktu, desain dramatik, dan simbol makna tari kreasi baru",
        "difficulty": "HARD"
      },
      {
        "label": "Desain Tata Artistik Panggung, Busana, & Lighting Tari",
        "prompt": "Buatkan soal Seni Budaya SMA tentang fungsi lighting general/spotlight, pemilihan bahan kostum tradisional modern, dan tata pentas",
        "difficulty": "HARD"
      },
      {
        "label": "Pementasan Teater Kontemporer & Naskah Drama",
        "prompt": "Buatkan soal Seni Budaya SMA tentang olah vokal diafragma, blocking dinamis, motivasi batin karakter tokoh, dan dramatisasi konflik",
        "difficulty": "HARD"
      },
      {
        "label": "Tata Artistik Panggung Teater & Efek Suara Foley",
        "prompt": "Buatkan soal Seni Budaya SMA tentang perancangan setting latar panggung, tata rias karakter penuaan/luka, dan sinkronisasi audio",
        "difficulty": "HARD"
      },
      {
        "label": "Desain Produk Kriya Nusantara Berdaya Saing Global",
        "prompt": "Buatkan soal Seni Budaya SMA tentang inovasi kerajinan kriya kayu/logam/tekstil berwawasan lingkungan dan bernilai estetis tinggi",
        "difficulty": "HARD"
      },
      {
        "label": "Hak Kekayaan Intelektual (HAKI) Karya Seni & Hak Cipta",
        "prompt": "Buatkan soal Seni Budaya SMA tentang perlindungan hak moral, hak ekonomi pencipta, lisensi karya seni, dan pencegahan plagiarisme",
        "difficulty": "HARD"
      },
      {
        "label": "Kurasi Karya Seni Rupa & Penulisan Esai Apresiasi",
        "prompt": "Buatkan soal Seni Budaya SMA tentang kriteria kuratorial kualitas karya seni rupa dan penulisan ulasan apresiasi estetika",
        "difficulty": "HARD"
      }
    ]
  },
  "pjok": {
    "EASY": [
      {
        "label": "Taktik & Pola Penyerangan/Pertahanan Sepak Bola",
        "prompt": "Buatkan soal PJOK SMA tentang formasi 4-3-3 vs 3-5-2, pressing tinggi, transisi serangan balik, dan pertahanan zonal marking",
        "difficulty": "EASY"
      },
      {
        "label": "Pola Penyerangan & Pertahanan Bola Voli (4-2 / 5-1)",
        "prompt": "Buatkan soal PJOK SMA tentang peran tosser/setter, quick spiker, libero bertahan, rotasi pemain, dan bendungan ganda",
        "difficulty": "EASY"
      },
      {
        "label": "Pola Penyerangan Fast Break & Zone Defense Basket",
        "prompt": "Buatkan soal PJOK SMA tentang pola penyerangan kilat, pertahanan daerah 2-3 vs man-to-man defense, dan screen/pick and roll",
        "difficulty": "EASY"
      },
      {
        "label": "Taktik Permainan Ganda Bulu Tangkis",
        "prompt": "Buatkan soal PJOK SMA tentang formasi berdampingan (side-by-side) vs depan-belakang dan antisipasi pukulan netting/drive",
        "difficulty": "EASY"
      },
      {
        "label": "Analisis Biomekanika Start & Lari Cepat 100m",
        "prompt": "Buatkan soal PJOK SMA tentang sudut tolakan balok start, fase drive percepatan, frekuensi vs panjang langkah lari, dan finish",
        "difficulty": "EASY"
      },
      {
        "label": "Lompat Jauh: Analisis Gaya Menggantung & Berjalan di Udara",
        "prompt": "Buatkan soal PJOK SMA tentang kecepatan awalan (run-up), daya ledak tumpuan (take-off), sikap melayang, dan pendaratan",
        "difficulty": "EASY"
      },
      {
        "label": "Senam Lantai Rangkaian: Handstand & Round-Off",
        "prompt": "Buatkan soal PJOK SMA tentang kekuatan tumpuan telapak tangan handstand, kelenturan punggung, dan rangkaian gerak senam artistik",
        "difficulty": "EASY"
      },
      {
        "label": "Penyusunan Program Latihan Kebugaran Mandiri (FITT)",
        "prompt": "Buatkan soal PJOK SMA tentang prinsip Frequency, Intensity, Time, Type, penghitungan Target Heart Rate, dan periodisasi latihan",
        "difficulty": "EASY"
      },
      {
        "label": "Teknik Renang Gaya Kupu-Kupu & Pembalikan Salto",
        "prompt": "Buatkan soal PJOK SMA tentang gerakan tarikan lengan keyhole, ayunan kaki dolphin kick berirama ganda, dan teknik pembalikan",
        "difficulty": "EASY"
      },
      {
        "label": "Pertolongan Pertama Gawat Darurat (RICE & CPR Dasar)",
        "prompt": "Buatkan soal PJOK SMA tentang penanganan dislokasi/terkilir metode RICE, posisi kompresi dada resusitasi jantung paru (CPR)",
        "difficulty": "EASY"
      },
      {
        "label": "Pola Hidup Sehat: Metabolisme Basal (BMR) & Gizi",
        "prompt": "Buatkan soal PJOK SMA tentang penghitungan Body Mass Index (BMI), asupan makronutrien karbohidrat-protein-lemak, dan kalori harian",
        "difficulty": "EASY"
      },
      {
        "label": "Pencegahan Bahaya Pergaulan Bebas & Penyakit Menular",
        "prompt": "Buatkan soal PJOK SMA tentang dampak psikologis-fisik seks bebas, pencegahan penularan HIV/AIDS, dan menjaga kesehatan reproduksi",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Taktik & Pola Penyerangan/Pertahanan Sepak Bola",
        "prompt": "Buatkan soal PJOK SMA tentang formasi 4-3-3 vs 3-5-2, pressing tinggi, transisi serangan balik, dan pertahanan zonal marking",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pola Penyerangan & Pertahanan Bola Voli (4-2 / 5-1)",
        "prompt": "Buatkan soal PJOK SMA tentang peran tosser/setter, quick spiker, libero bertahan, rotasi pemain, dan bendungan ganda",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pola Penyerangan Fast Break & Zone Defense Basket",
        "prompt": "Buatkan soal PJOK SMA tentang pola penyerangan kilat, pertahanan daerah 2-3 vs man-to-man defense, dan screen/pick and roll",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Taktik Permainan Ganda Bulu Tangkis",
        "prompt": "Buatkan soal PJOK SMA tentang formasi berdampingan (side-by-side) vs depan-belakang dan antisipasi pukulan netting/drive",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Analisis Biomekanika Start & Lari Cepat 100m",
        "prompt": "Buatkan soal PJOK SMA tentang sudut tolakan balok start, fase drive percepatan, frekuensi vs panjang langkah lari, dan finish",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Lompat Jauh: Analisis Gaya Menggantung & Berjalan di Udara",
        "prompt": "Buatkan soal PJOK SMA tentang kecepatan awalan (run-up), daya ledak tumpuan (take-off), sikap melayang, dan pendaratan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Senam Lantai Rangkaian: Handstand & Round-Off",
        "prompt": "Buatkan soal PJOK SMA tentang kekuatan tumpuan telapak tangan handstand, kelenturan punggung, dan rangkaian gerak senam artistik",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penyusunan Program Latihan Kebugaran Mandiri (FITT)",
        "prompt": "Buatkan soal PJOK SMA tentang prinsip Frequency, Intensity, Time, Type, penghitungan Target Heart Rate, dan periodisasi latihan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teknik Renang Gaya Kupu-Kupu & Pembalikan Salto",
        "prompt": "Buatkan soal PJOK SMA tentang gerakan tarikan lengan keyhole, ayunan kaki dolphin kick berirama ganda, dan teknik pembalikan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pertolongan Pertama Gawat Darurat (RICE & CPR Dasar)",
        "prompt": "Buatkan soal PJOK SMA tentang penanganan dislokasi/terkilir metode RICE, posisi kompresi dada resusitasi jantung paru (CPR)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pola Hidup Sehat: Metabolisme Basal (BMR) & Gizi",
        "prompt": "Buatkan soal PJOK SMA tentang penghitungan Body Mass Index (BMI), asupan makronutrien karbohidrat-protein-lemak, dan kalori harian",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pencegahan Bahaya Pergaulan Bebas & Penyakit Menular",
        "prompt": "Buatkan soal PJOK SMA tentang dampak psikologis-fisik seks bebas, pencegahan penularan HIV/AIDS, dan menjaga kesehatan reproduksi",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Taktik & Pola Penyerangan/Pertahanan Sepak Bola",
        "prompt": "Buatkan soal PJOK SMA tentang formasi 4-3-3 vs 3-5-2, pressing tinggi, transisi serangan balik, dan pertahanan zonal marking",
        "difficulty": "HARD"
      },
      {
        "label": "Pola Penyerangan & Pertahanan Bola Voli (4-2 / 5-1)",
        "prompt": "Buatkan soal PJOK SMA tentang peran tosser/setter, quick spiker, libero bertahan, rotasi pemain, dan bendungan ganda",
        "difficulty": "HARD"
      },
      {
        "label": "Pola Penyerangan Fast Break & Zone Defense Basket",
        "prompt": "Buatkan soal PJOK SMA tentang pola penyerangan kilat, pertahanan daerah 2-3 vs man-to-man defense, dan screen/pick and roll",
        "difficulty": "HARD"
      },
      {
        "label": "Taktik Permainan Ganda Bulu Tangkis",
        "prompt": "Buatkan soal PJOK SMA tentang formasi berdampingan (side-by-side) vs depan-belakang dan antisipasi pukulan netting/drive",
        "difficulty": "HARD"
      },
      {
        "label": "Analisis Biomekanika Start & Lari Cepat 100m",
        "prompt": "Buatkan soal PJOK SMA tentang sudut tolakan balok start, fase drive percepatan, frekuensi vs panjang langkah lari, dan finish",
        "difficulty": "HARD"
      },
      {
        "label": "Lompat Jauh: Analisis Gaya Menggantung & Berjalan di Udara",
        "prompt": "Buatkan soal PJOK SMA tentang kecepatan awalan (run-up), daya ledak tumpuan (take-off), sikap melayang, dan pendaratan",
        "difficulty": "HARD"
      },
      {
        "label": "Senam Lantai Rangkaian: Handstand & Round-Off",
        "prompt": "Buatkan soal PJOK SMA tentang kekuatan tumpuan telapak tangan handstand, kelenturan punggung, dan rangkaian gerak senam artistik",
        "difficulty": "HARD"
      },
      {
        "label": "Penyusunan Program Latihan Kebugaran Mandiri (FITT)",
        "prompt": "Buatkan soal PJOK SMA tentang prinsip Frequency, Intensity, Time, Type, penghitungan Target Heart Rate, dan periodisasi latihan",
        "difficulty": "HARD"
      },
      {
        "label": "Teknik Renang Gaya Kupu-Kupu & Pembalikan Salto",
        "prompt": "Buatkan soal PJOK SMA tentang gerakan tarikan lengan keyhole, ayunan kaki dolphin kick berirama ganda, dan teknik pembalikan",
        "difficulty": "HARD"
      },
      {
        "label": "Pertolongan Pertama Gawat Darurat (RICE & CPR Dasar)",
        "prompt": "Buatkan soal PJOK SMA tentang penanganan dislokasi/terkilir metode RICE, posisi kompresi dada resusitasi jantung paru (CPR)",
        "difficulty": "HARD"
      },
      {
        "label": "Pola Hidup Sehat: Metabolisme Basal (BMR) & Gizi",
        "prompt": "Buatkan soal PJOK SMA tentang penghitungan Body Mass Index (BMI), asupan makronutrien karbohidrat-protein-lemak, dan kalori harian",
        "difficulty": "HARD"
      },
      {
        "label": "Pencegahan Bahaya Pergaulan Bebas & Penyakit Menular",
        "prompt": "Buatkan soal PJOK SMA tentang dampak psikologis-fisik seks bebas, pencegahan penularan HIV/AIDS, dan menjaga kesehatan reproduksi",
        "difficulty": "HARD"
      }
    ]
  },
  "agama": {
    "EASY": [
      {
        "label": "Berpikir Kritis & Memahami Tanda Kebesaran Tuhan",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang kajian ayat-ayat suci tentang alam semesta, dorongan menuntut ilmu, dan integrasi sains-iman",
        "difficulty": "EASY"
      },
      {
        "label": "Prinsip Demokrasi, Musyawarah, & Moderasi Beragama",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang musyawarah mufakat dalam kepemimpinan, menolak ekstremisme, dan merawat kerukunan bangsa",
        "difficulty": "EASY"
      },
      {
        "label": "Hukum Pernikahan dalam Perspektif Syariat & UU No. 1/1974",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang rukun/syarat sah pernikahan, batasan usia menikah, hak-kewajiban suami-istri, dan talak/rujuk",
        "difficulty": "EASY"
      },
      {
        "label": "Hukum Waris (Faraidh) & Keadilan Distribusi Harta",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang sebab-sebab menerima warisan, ahli waris dzawil furud (ashabah), dan pencegah hak waris",
        "difficulty": "EASY"
      },
      {
        "label": "Sejarah Dakwah Islam Nusantara: Walisongo & Akulturasi",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang strategi dakwah Sunan Kalijaga lewat wayang, Sunan Kudus, dan akulturasi kearifan lokal",
        "difficulty": "EASY"
      },
      {
        "label": "Etika Bekerja, Integritas Anti-Korupsi, & Bisnis Syariah",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang mencari nafkah halal, menjauhi suap (risywah), penipuan timbangan, dan etika bisnis syariah",
        "difficulty": "EASY"
      },
      {
        "label": "Tanggung Jawab Menjaga Kelestarian Lingkungan Hidup",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang larangan membuat kerusakan di bumi (fasad fil ardh) dan kewajiban konservasi alam",
        "difficulty": "EASY"
      },
      {
        "label": "Menjaga Kehormatan Diri & Menjauhi Zina serta Narkoba",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang perintah menundukkan pandangan (ghaddul bashar), menjaga pergaulan, dan bahaya miras/khamr",
        "difficulty": "EASY"
      },
      {
        "label": "Kewajiban Amar Ma'ruf Nahi Munkar dengan Hikmah",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang metode dakwah bil hikmah, mau'izhah hasanah, dan dialog santun tanpa kekerasan",
        "difficulty": "EASY"
      },
      {
        "label": "Filantropi Keagamaan: Pengelolaan Wakaf Produktif & Baznas",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang perbedaan zakat, infak, sedekah, dan potensi wakaf uang/tanah untuk kesejahteraan umat",
        "difficulty": "EASY"
      },
      {
        "label": "Menghindari Perilaku Hedonisme, Materialisme, & Riya",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang bahaya pamer kekayaan di media sosial, sikap qana'ah, dan hidup sederhana penuh berkah",
        "difficulty": "EASY"
      },
      {
        "label": "Membangun Keluarga Bahagia (Sakinah, Mawaddah, Warahmah)",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang pilar keluarga harmonis, komunikasi positif pasangan, dan pengasuhan anak yang bertanggung jawab",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Berpikir Kritis & Memahami Tanda Kebesaran Tuhan",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang kajian ayat-ayat suci tentang alam semesta, dorongan menuntut ilmu, dan integrasi sains-iman",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Prinsip Demokrasi, Musyawarah, & Moderasi Beragama",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang musyawarah mufakat dalam kepemimpinan, menolak ekstremisme, dan merawat kerukunan bangsa",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Hukum Pernikahan dalam Perspektif Syariat & UU No. 1/1974",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang rukun/syarat sah pernikahan, batasan usia menikah, hak-kewajiban suami-istri, dan talak/rujuk",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Hukum Waris (Faraidh) & Keadilan Distribusi Harta",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang sebab-sebab menerima warisan, ahli waris dzawil furud (ashabah), dan pencegah hak waris",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sejarah Dakwah Islam Nusantara: Walisongo & Akulturasi",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang strategi dakwah Sunan Kalijaga lewat wayang, Sunan Kudus, dan akulturasi kearifan lokal",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Etika Bekerja, Integritas Anti-Korupsi, & Bisnis Syariah",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang mencari nafkah halal, menjauhi suap (risywah), penipuan timbangan, dan etika bisnis syariah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Tanggung Jawab Menjaga Kelestarian Lingkungan Hidup",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang larangan membuat kerusakan di bumi (fasad fil ardh) dan kewajiban konservasi alam",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menjaga Kehormatan Diri & Menjauhi Zina serta Narkoba",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang perintah menundukkan pandangan (ghaddul bashar), menjaga pergaulan, dan bahaya miras/khamr",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kewajiban Amar Ma'ruf Nahi Munkar dengan Hikmah",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang metode dakwah bil hikmah, mau'izhah hasanah, dan dialog santun tanpa kekerasan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Filantropi Keagamaan: Pengelolaan Wakaf Produktif & Baznas",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang perbedaan zakat, infak, sedekah, dan potensi wakaf uang/tanah untuk kesejahteraan umat",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Menghindari Perilaku Hedonisme, Materialisme, & Riya",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang bahaya pamer kekayaan di media sosial, sikap qana'ah, dan hidup sederhana penuh berkah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Membangun Keluarga Bahagia (Sakinah, Mawaddah, Warahmah)",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang pilar keluarga harmonis, komunikasi positif pasangan, dan pengasuhan anak yang bertanggung jawab",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Berpikir Kritis & Memahami Tanda Kebesaran Tuhan",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang kajian ayat-ayat suci tentang alam semesta, dorongan menuntut ilmu, dan integrasi sains-iman",
        "difficulty": "HARD"
      },
      {
        "label": "Prinsip Demokrasi, Musyawarah, & Moderasi Beragama",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang musyawarah mufakat dalam kepemimpinan, menolak ekstremisme, dan merawat kerukunan bangsa",
        "difficulty": "HARD"
      },
      {
        "label": "Hukum Pernikahan dalam Perspektif Syariat & UU No. 1/1974",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang rukun/syarat sah pernikahan, batasan usia menikah, hak-kewajiban suami-istri, dan talak/rujuk",
        "difficulty": "HARD"
      },
      {
        "label": "Hukum Waris (Faraidh) & Keadilan Distribusi Harta",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang sebab-sebab menerima warisan, ahli waris dzawil furud (ashabah), dan pencegah hak waris",
        "difficulty": "HARD"
      },
      {
        "label": "Sejarah Dakwah Islam Nusantara: Walisongo & Akulturasi",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang strategi dakwah Sunan Kalijaga lewat wayang, Sunan Kudus, dan akulturasi kearifan lokal",
        "difficulty": "HARD"
      },
      {
        "label": "Etika Bekerja, Integritas Anti-Korupsi, & Bisnis Syariah",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang mencari nafkah halal, menjauhi suap (risywah), penipuan timbangan, dan etika bisnis syariah",
        "difficulty": "HARD"
      },
      {
        "label": "Tanggung Jawab Menjaga Kelestarian Lingkungan Hidup",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang larangan membuat kerusakan di bumi (fasad fil ardh) dan kewajiban konservasi alam",
        "difficulty": "HARD"
      },
      {
        "label": "Menjaga Kehormatan Diri & Menjauhi Zina serta Narkoba",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang perintah menundukkan pandangan (ghaddul bashar), menjaga pergaulan, dan bahaya miras/khamr",
        "difficulty": "HARD"
      },
      {
        "label": "Kewajiban Amar Ma'ruf Nahi Munkar dengan Hikmah",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang metode dakwah bil hikmah, mau'izhah hasanah, dan dialog santun tanpa kekerasan",
        "difficulty": "HARD"
      },
      {
        "label": "Filantropi Keagamaan: Pengelolaan Wakaf Produktif & Baznas",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang perbedaan zakat, infak, sedekah, dan potensi wakaf uang/tanah untuk kesejahteraan umat",
        "difficulty": "HARD"
      },
      {
        "label": "Menghindari Perilaku Hedonisme, Materialisme, & Riya",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang bahaya pamer kekayaan di media sosial, sikap qana'ah, dan hidup sederhana penuh berkah",
        "difficulty": "HARD"
      },
      {
        "label": "Membangun Keluarga Bahagia (Sakinah, Mawaddah, Warahmah)",
        "prompt": "Buatkan soal Pendidikan Agama SMA tentang pilar keluarga harmonis, komunikasi positif pasangan, dan pengasuhan anak yang bertanggung jawab",
        "difficulty": "HARD"
      }
    ]
  }
};

export const SMK_SUBJECT_TOPICS: Record<string, SubjectDifficultyMap> = {
  "ipas": {
    "EASY": [
      {
        "label": "Mitigasi Bencana Gempa & Evakuasi Bengkel Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang jalur evakuasi darurat, assembly point, simulasi gempa, dan standar keselamatan bengkel",
        "difficulty": "EASY"
      },
      {
        "label": "Sains Terapan K3: Bahaya Fisik, Kimia, & Ergonomi",
        "prompt": "Buatkan soal Projek IPAS SMK tentang Hazard Identification Risk Assessment (HIRA), APD wajib, dan posisi ergonomis pekerja",
        "difficulty": "EASY"
      },
      {
        "label": "Pengelolaan Limbah Industri B3 & Netralisasi",
        "prompt": "Buatkan soal Projek IPAS SMK tentang klasifikasi limbah B3, simbol label bahaya, tempat penyimpanan sementara (TPS), dan reduksi polutan",
        "difficulty": "EASY"
      },
      {
        "label": "Efisiensi Energi & Konversi Energi Terbarukan Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang panel surya fotovoltaik, turbin angin mini industri, audit energi listrik, dan konservasi daya",
        "difficulty": "EASY"
      },
      {
        "label": "Pencemaran Udara & Teknologi Filter Gas Buang Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang baku mutu emisi gas cerobong pabrik, karbon monoksida, partikulat PM2.5, dan teknologi filter",
        "difficulty": "EASY"
      },
      {
        "label": "Pengukuran Presisi: Jangka Sorong & Mikrometer Sekrup",
        "prompt": "Buatkan soal Projek IPAS SMK tentang ketelitian 0.05mm jangka sorong, kalibrasi nol mikrometer, dan toleransi pengukuran benda kerja",
        "difficulty": "EASY"
      },
      {
        "label": "Reaksi Asam Basa, Derajat pH, & Korosi Logam Pabrik",
        "prompt": "Buatkan soal Projek IPAS SMK tentang uji pH air limbah industri, faktor pemicu oksidasi karat logam, dan proteksi katodik",
        "difficulty": "EASY"
      },
      {
        "label": "Prosedur Analisis Dampak Lingkungan (AMDAL) Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang dokumen UKL-UPL, izin lingkungan pabrik, baku mutu air buangan, dan audit lingkungan hidup",
        "difficulty": "EASY"
      },
      {
        "label": "Kelistrikan Terapan: Arus Kuat, Grounding, & Korsleting",
        "prompt": "Buatkan soal Projek IPAS SMK tentang tahanan pembumian (grounding rod), Miniature Circuit Breaker (MCB), dan pencegahan kebakaran listrik",
        "difficulty": "EASY"
      },
      {
        "label": "Penggunaan APAR & Klasifikasi Kebakaran Bengkel",
        "prompt": "Buatkan soal Projek IPAS SMK tentang tipe kebakaran kelas A, B, C, D, prosedur PASS pemadaman api, dan inspeksi tabung APAR",
        "difficulty": "EASY"
      },
      {
        "label": "Sanitasi Ruang Kerja & Vektor Kontaminan Pabrik",
        "prompt": "Buatkan soal Projek IPAS SMK tentang Good Manufacturing Practice (GMP), sanitasi lantai/peralatan, dan ventilasi exhaust fan",
        "difficulty": "EASY"
      },
      {
        "label": "Penanganan Bahan Kimia Berbahaya Sesuai Dokumen MSDS",
        "prompt": "Buatkan soal Projek IPAS SMK tentang membaca lembar data keselamatan bahan kimia (MSDS), piktogram bahaya GHS, dan P3K tumpahan asam",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Mitigasi Bencana Gempa & Evakuasi Bengkel Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang jalur evakuasi darurat, assembly point, simulasi gempa, dan standar keselamatan bengkel",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sains Terapan K3: Bahaya Fisik, Kimia, & Ergonomi",
        "prompt": "Buatkan soal Projek IPAS SMK tentang Hazard Identification Risk Assessment (HIRA), APD wajib, dan posisi ergonomis pekerja",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pengelolaan Limbah Industri B3 & Netralisasi",
        "prompt": "Buatkan soal Projek IPAS SMK tentang klasifikasi limbah B3, simbol label bahaya, tempat penyimpanan sementara (TPS), dan reduksi polutan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Efisiensi Energi & Konversi Energi Terbarukan Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang panel surya fotovoltaik, turbin angin mini industri, audit energi listrik, dan konservasi daya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pencemaran Udara & Teknologi Filter Gas Buang Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang baku mutu emisi gas cerobong pabrik, karbon monoksida, partikulat PM2.5, dan teknologi filter",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pengukuran Presisi: Jangka Sorong & Mikrometer Sekrup",
        "prompt": "Buatkan soal Projek IPAS SMK tentang ketelitian 0.05mm jangka sorong, kalibrasi nol mikrometer, dan toleransi pengukuran benda kerja",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Reaksi Asam Basa, Derajat pH, & Korosi Logam Pabrik",
        "prompt": "Buatkan soal Projek IPAS SMK tentang uji pH air limbah industri, faktor pemicu oksidasi karat logam, dan proteksi katodik",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Prosedur Analisis Dampak Lingkungan (AMDAL) Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang dokumen UKL-UPL, izin lingkungan pabrik, baku mutu air buangan, dan audit lingkungan hidup",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kelistrikan Terapan: Arus Kuat, Grounding, & Korsleting",
        "prompt": "Buatkan soal Projek IPAS SMK tentang tahanan pembumian (grounding rod), Miniature Circuit Breaker (MCB), dan pencegahan kebakaran listrik",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penggunaan APAR & Klasifikasi Kebakaran Bengkel",
        "prompt": "Buatkan soal Projek IPAS SMK tentang tipe kebakaran kelas A, B, C, D, prosedur PASS pemadaman api, dan inspeksi tabung APAR",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sanitasi Ruang Kerja & Vektor Kontaminan Pabrik",
        "prompt": "Buatkan soal Projek IPAS SMK tentang Good Manufacturing Practice (GMP), sanitasi lantai/peralatan, dan ventilasi exhaust fan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penanganan Bahan Kimia Berbahaya Sesuai Dokumen MSDS",
        "prompt": "Buatkan soal Projek IPAS SMK tentang membaca lembar data keselamatan bahan kimia (MSDS), piktogram bahaya GHS, dan P3K tumpahan asam",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Mitigasi Bencana Gempa & Evakuasi Bengkel Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang jalur evakuasi darurat, assembly point, simulasi gempa, dan standar keselamatan bengkel",
        "difficulty": "HARD"
      },
      {
        "label": "Sains Terapan K3: Bahaya Fisik, Kimia, & Ergonomi",
        "prompt": "Buatkan soal Projek IPAS SMK tentang Hazard Identification Risk Assessment (HIRA), APD wajib, dan posisi ergonomis pekerja",
        "difficulty": "HARD"
      },
      {
        "label": "Pengelolaan Limbah Industri B3 & Netralisasi",
        "prompt": "Buatkan soal Projek IPAS SMK tentang klasifikasi limbah B3, simbol label bahaya, tempat penyimpanan sementara (TPS), dan reduksi polutan",
        "difficulty": "HARD"
      },
      {
        "label": "Efisiensi Energi & Konversi Energi Terbarukan Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang panel surya fotovoltaik, turbin angin mini industri, audit energi listrik, dan konservasi daya",
        "difficulty": "HARD"
      },
      {
        "label": "Pencemaran Udara & Teknologi Filter Gas Buang Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang baku mutu emisi gas cerobong pabrik, karbon monoksida, partikulat PM2.5, dan teknologi filter",
        "difficulty": "HARD"
      },
      {
        "label": "Pengukuran Presisi: Jangka Sorong & Mikrometer Sekrup",
        "prompt": "Buatkan soal Projek IPAS SMK tentang ketelitian 0.05mm jangka sorong, kalibrasi nol mikrometer, dan toleransi pengukuran benda kerja",
        "difficulty": "HARD"
      },
      {
        "label": "Reaksi Asam Basa, Derajat pH, & Korosi Logam Pabrik",
        "prompt": "Buatkan soal Projek IPAS SMK tentang uji pH air limbah industri, faktor pemicu oksidasi karat logam, dan proteksi katodik",
        "difficulty": "HARD"
      },
      {
        "label": "Prosedur Analisis Dampak Lingkungan (AMDAL) Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang dokumen UKL-UPL, izin lingkungan pabrik, baku mutu air buangan, dan audit lingkungan hidup",
        "difficulty": "HARD"
      },
      {
        "label": "Kelistrikan Terapan: Arus Kuat, Grounding, & Korsleting",
        "prompt": "Buatkan soal Projek IPAS SMK tentang tahanan pembumian (grounding rod), Miniature Circuit Breaker (MCB), dan pencegahan kebakaran listrik",
        "difficulty": "HARD"
      },
      {
        "label": "Penggunaan APAR & Klasifikasi Kebakaran Bengkel",
        "prompt": "Buatkan soal Projek IPAS SMK tentang tipe kebakaran kelas A, B, C, D, prosedur PASS pemadaman api, dan inspeksi tabung APAR",
        "difficulty": "HARD"
      },
      {
        "label": "Sanitasi Ruang Kerja & Vektor Kontaminan Pabrik",
        "prompt": "Buatkan soal Projek IPAS SMK tentang Good Manufacturing Practice (GMP), sanitasi lantai/peralatan, dan ventilasi exhaust fan",
        "difficulty": "HARD"
      },
      {
        "label": "Penanganan Bahan Kimia Berbahaya Sesuai Dokumen MSDS",
        "prompt": "Buatkan soal Projek IPAS SMK tentang membaca lembar data keselamatan bahan kimia (MSDS), piktogram bahaya GHS, dan P3K tumpahan asam",
        "difficulty": "HARD"
      }
    ]
  },
  "inggris": {
    "EASY": [
      {
        "label": "Vocational English in the Workplace: Daily Interactions",
        "prompt": "Buatkan soal Kurikulum Standar tentang Vocational English in the Workplace: Daily Interactions",
        "difficulty": "EASY"
      },
      {
        "label": "Writing Professional Job Application Letters & CV / Resume",
        "prompt": "Buatkan soal Kurikulum Standar tentang Writing Professional Job Application Letters & CV / Resume",
        "difficulty": "EASY"
      },
      {
        "label": "Job Interview Simulation: Common Questions & STAR Technique",
        "prompt": "Buatkan soal Kurikulum Standar tentang Job Interview Simulation: Common Questions & STAR Technique",
        "difficulty": "EASY"
      },
      {
        "label": "Technical Manuals & Equipment Operating Instructions",
        "prompt": "Buatkan soal Kurikulum Standar tentang Technical Manuals & Equipment Operating Instructions",
        "difficulty": "EASY"
      },
      {
        "label": "Customer Service & Handling Professional Client Complaints",
        "prompt": "Buatkan soal Kurikulum Standar tentang Customer Service & Handling Professional Client Complaints",
        "difficulty": "EASY"
      },
      {
        "label": "Formal Business Emails & Inquiry Invoices",
        "prompt": "Buatkan soal Kurikulum Standar tentang Formal Business Emails & Inquiry Invoices",
        "difficulty": "EASY"
      },
      {
        "label": "Business Telephone Protocols & Taking Accurate Messages",
        "prompt": "Buatkan soal Kurikulum Standar tentang Business Telephone Protocols & Taking Accurate Messages",
        "difficulty": "EASY"
      },
      {
        "label": "Workplace Safety Signs & Warning Announcements",
        "prompt": "Buatkan soal Kurikulum Standar tentang Workplace Safety Signs & Warning Announcements",
        "difficulty": "EASY"
      },
      {
        "label": "Describing Technical Specifications & Workshop Tools",
        "prompt": "Buatkan soal Kurikulum Standar tentang Describing Technical Specifications & Workshop Tools",
        "difficulty": "EASY"
      },
      {
        "label": "Presenting Project Pitches & Technical Demonstrations",
        "prompt": "Buatkan soal Kurikulum Standar tentang Presenting Project Pitches & Technical Demonstrations",
        "difficulty": "EASY"
      },
      {
        "label": "Negotiating Pricing, Service Terms, & Delivery Schedules",
        "prompt": "Buatkan soal Kurikulum Standar tentang Negotiating Pricing, Service Terms, & Delivery Schedules",
        "difficulty": "EASY"
      },
      {
        "label": "Cause and Effect in Industrial Engineering & Fault Diagnosis",
        "prompt": "Buatkan soal Kurikulum Standar tentang Cause and Effect in Industrial Engineering & Fault Diagnosis",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Vocational English in the Workplace: Daily Interactions",
        "prompt": "Buatkan soal Kurikulum Standar tentang Vocational English in the Workplace: Daily Interactions",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Writing Professional Job Application Letters & CV / Resume",
        "prompt": "Buatkan soal Kurikulum Standar tentang Writing Professional Job Application Letters & CV / Resume",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Job Interview Simulation: Common Questions & STAR Technique",
        "prompt": "Buatkan soal Kurikulum Standar tentang Job Interview Simulation: Common Questions & STAR Technique",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Technical Manuals & Equipment Operating Instructions",
        "prompt": "Buatkan soal Kurikulum Standar tentang Technical Manuals & Equipment Operating Instructions",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Customer Service & Handling Professional Client Complaints",
        "prompt": "Buatkan soal Kurikulum Standar tentang Customer Service & Handling Professional Client Complaints",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Formal Business Emails & Inquiry Invoices",
        "prompt": "Buatkan soal Kurikulum Standar tentang Formal Business Emails & Inquiry Invoices",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Business Telephone Protocols & Taking Accurate Messages",
        "prompt": "Buatkan soal Kurikulum Standar tentang Business Telephone Protocols & Taking Accurate Messages",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Workplace Safety Signs & Warning Announcements",
        "prompt": "Buatkan soal Kurikulum Standar tentang Workplace Safety Signs & Warning Announcements",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Describing Technical Specifications & Workshop Tools",
        "prompt": "Buatkan soal Kurikulum Standar tentang Describing Technical Specifications & Workshop Tools",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Presenting Project Pitches & Technical Demonstrations",
        "prompt": "Buatkan soal Kurikulum Standar tentang Presenting Project Pitches & Technical Demonstrations",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Negotiating Pricing, Service Terms, & Delivery Schedules",
        "prompt": "Buatkan soal Kurikulum Standar tentang Negotiating Pricing, Service Terms, & Delivery Schedules",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Cause and Effect in Industrial Engineering & Fault Diagnosis",
        "prompt": "Buatkan soal Kurikulum Standar tentang Cause and Effect in Industrial Engineering & Fault Diagnosis",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Vocational English in the Workplace: Daily Interactions",
        "prompt": "Buatkan soal Kurikulum Standar tentang Vocational English in the Workplace: Daily Interactions",
        "difficulty": "HARD"
      },
      {
        "label": "Writing Professional Job Application Letters & CV / Resume",
        "prompt": "Buatkan soal Kurikulum Standar tentang Writing Professional Job Application Letters & CV / Resume",
        "difficulty": "HARD"
      },
      {
        "label": "Job Interview Simulation: Common Questions & STAR Technique",
        "prompt": "Buatkan soal Kurikulum Standar tentang Job Interview Simulation: Common Questions & STAR Technique",
        "difficulty": "HARD"
      },
      {
        "label": "Technical Manuals & Equipment Operating Instructions",
        "prompt": "Buatkan soal Kurikulum Standar tentang Technical Manuals & Equipment Operating Instructions",
        "difficulty": "HARD"
      },
      {
        "label": "Customer Service & Handling Professional Client Complaints",
        "prompt": "Buatkan soal Kurikulum Standar tentang Customer Service & Handling Professional Client Complaints",
        "difficulty": "HARD"
      },
      {
        "label": "Formal Business Emails & Inquiry Invoices",
        "prompt": "Buatkan soal Kurikulum Standar tentang Formal Business Emails & Inquiry Invoices",
        "difficulty": "HARD"
      },
      {
        "label": "Business Telephone Protocols & Taking Accurate Messages",
        "prompt": "Buatkan soal Kurikulum Standar tentang Business Telephone Protocols & Taking Accurate Messages",
        "difficulty": "HARD"
      },
      {
        "label": "Workplace Safety Signs & Warning Announcements",
        "prompt": "Buatkan soal Kurikulum Standar tentang Workplace Safety Signs & Warning Announcements",
        "difficulty": "HARD"
      },
      {
        "label": "Describing Technical Specifications & Workshop Tools",
        "prompt": "Buatkan soal Kurikulum Standar tentang Describing Technical Specifications & Workshop Tools",
        "difficulty": "HARD"
      },
      {
        "label": "Presenting Project Pitches & Technical Demonstrations",
        "prompt": "Buatkan soal Kurikulum Standar tentang Presenting Project Pitches & Technical Demonstrations",
        "difficulty": "HARD"
      },
      {
        "label": "Negotiating Pricing, Service Terms, & Delivery Schedules",
        "prompt": "Buatkan soal Kurikulum Standar tentang Negotiating Pricing, Service Terms, & Delivery Schedules",
        "difficulty": "HARD"
      },
      {
        "label": "Cause and Effect in Industrial Engineering & Fault Diagnosis",
        "prompt": "Buatkan soal Kurikulum Standar tentang Cause and Effect in Industrial Engineering & Fault Diagnosis",
        "difficulty": "HARD"
      }
    ]
  },
  "matematika": {
    "EASY": [
      {
        "label": "Aritmetika Terapan: Perhitungan Diskon, Bunga, & Angsuran",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang perhitungan bunga tunggal/majemuk bank, diskon bertingkat, dan angsuran pinjaman modal usaha",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Persamaan Linear untuk Analisis Biaya Produksi",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang memodelkan dan menyelesaikan SPLDV/SPLTV untuk menghitung biaya bahan baku dan tenaga kerja",
        "difficulty": "EASY"
      },
      {
        "label": "Matriks & Transformasi Geometri dalam Desain/Mesin",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang operasi perkalian matriks, invers ordo 2x2, serta translasi/rotasi objek grafis dan part mesin",
        "difficulty": "EASY"
      },
      {
        "label": "Trigonometri Terapan: Sudut Elevasi & Kemiringan Atap",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang perbandingan sudut sinus/cosinus/tangen pada konstruksi atap, sudut potong mesin bubut, dan klinometer",
        "difficulty": "EASY"
      },
      {
        "label": "Barisan & Deret untuk Analisis Penyusutan Aset Pabrik",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang penyusutan nilai mesin pabrik metode garis lurus dan saldo menurun serta deret geometri bunga",
        "difficulty": "EASY"
      },
      {
        "label": "Perhitungan Luas Permukaan & Volume Material Benda Kerja",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang menghitung luas pelat seng, volume silinder padat berongga, dan massa jenis bahan industri",
        "difficulty": "EASY"
      },
      {
        "label": "Statistika Pengendalian Mutu Industri (Quality Control)",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang tabel distribusi frekuensi, mean, median, simpangan baku, dan diagram kendali toleransi ukuran produk",
        "difficulty": "EASY"
      },
      {
        "label": "Analisis Regresi Linear Sederhana pada Data Hasil Uji",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang menentukan persamaan garis regresi y=a+bx dan korelasi antara waktu pengerjaan vs output",
        "difficulty": "EASY"
      },
      {
        "label": "Program Linear untuk Optimasi Keuntungan Pabrik Bengkel",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang fungsi tujuan memaksimalkan laba dengan kendala keterbatasan bahan baku dan jam kerja mesin",
        "difficulty": "EASY"
      },
      {
        "label": "Logika Matematika: Tabel Kebenaran & Gerbang Logika Digital",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang konjungsi, disjungsi, implikasi, biimplikasi, dan ekuivalensi rangkaian saklar digital",
        "difficulty": "EASY"
      },
      {
        "label": "Limit & Turunan untuk Laju Perubahan Biaya Marjinal",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang menentukan biaya marjinal minimum dari fungsi biaya total C(x) dan kecepatan potong mesin",
        "difficulty": "EASY"
      },
      {
        "label": "Teori Peluang untuk Estimasi Risiko Cacat Komponen",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang peluang kejadian komponen rusak dalam batch produksi dan uji sampling acak",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Aritmetika Terapan: Perhitungan Diskon, Bunga, & Angsuran",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang perhitungan bunga tunggal/majemuk bank, diskon bertingkat, dan angsuran pinjaman modal usaha",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Persamaan Linear untuk Analisis Biaya Produksi",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang memodelkan dan menyelesaikan SPLDV/SPLTV untuk menghitung biaya bahan baku dan tenaga kerja",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Matriks & Transformasi Geometri dalam Desain/Mesin",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang operasi perkalian matriks, invers ordo 2x2, serta translasi/rotasi objek grafis dan part mesin",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Trigonometri Terapan: Sudut Elevasi & Kemiringan Atap",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang perbandingan sudut sinus/cosinus/tangen pada konstruksi atap, sudut potong mesin bubut, dan klinometer",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Barisan & Deret untuk Analisis Penyusutan Aset Pabrik",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang penyusutan nilai mesin pabrik metode garis lurus dan saldo menurun serta deret geometri bunga",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Perhitungan Luas Permukaan & Volume Material Benda Kerja",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang menghitung luas pelat seng, volume silinder padat berongga, dan massa jenis bahan industri",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Statistika Pengendalian Mutu Industri (Quality Control)",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang tabel distribusi frekuensi, mean, median, simpangan baku, dan diagram kendali toleransi ukuran produk",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Analisis Regresi Linear Sederhana pada Data Hasil Uji",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang menentukan persamaan garis regresi y=a+bx dan korelasi antara waktu pengerjaan vs output",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Program Linear untuk Optimasi Keuntungan Pabrik Bengkel",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang fungsi tujuan memaksimalkan laba dengan kendala keterbatasan bahan baku dan jam kerja mesin",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Logika Matematika: Tabel Kebenaran & Gerbang Logika Digital",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang konjungsi, disjungsi, implikasi, biimplikasi, dan ekuivalensi rangkaian saklar digital",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Limit & Turunan untuk Laju Perubahan Biaya Marjinal",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang menentukan biaya marjinal minimum dari fungsi biaya total C(x) dan kecepatan potong mesin",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teori Peluang untuk Estimasi Risiko Cacat Komponen",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang peluang kejadian komponen rusak dalam batch produksi dan uji sampling acak",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Aritmetika Terapan: Perhitungan Diskon, Bunga, & Angsuran",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang perhitungan bunga tunggal/majemuk bank, diskon bertingkat, dan angsuran pinjaman modal usaha",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Persamaan Linear untuk Analisis Biaya Produksi",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang memodelkan dan menyelesaikan SPLDV/SPLTV untuk menghitung biaya bahan baku dan tenaga kerja",
        "difficulty": "HARD"
      },
      {
        "label": "Matriks & Transformasi Geometri dalam Desain/Mesin",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang operasi perkalian matriks, invers ordo 2x2, serta translasi/rotasi objek grafis dan part mesin",
        "difficulty": "HARD"
      },
      {
        "label": "Trigonometri Terapan: Sudut Elevasi & Kemiringan Atap",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang perbandingan sudut sinus/cosinus/tangen pada konstruksi atap, sudut potong mesin bubut, dan klinometer",
        "difficulty": "HARD"
      },
      {
        "label": "Barisan & Deret untuk Analisis Penyusutan Aset Pabrik",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang penyusutan nilai mesin pabrik metode garis lurus dan saldo menurun serta deret geometri bunga",
        "difficulty": "HARD"
      },
      {
        "label": "Perhitungan Luas Permukaan & Volume Material Benda Kerja",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang menghitung luas pelat seng, volume silinder padat berongga, dan massa jenis bahan industri",
        "difficulty": "HARD"
      },
      {
        "label": "Statistika Pengendalian Mutu Industri (Quality Control)",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang tabel distribusi frekuensi, mean, median, simpangan baku, dan diagram kendali toleransi ukuran produk",
        "difficulty": "HARD"
      },
      {
        "label": "Analisis Regresi Linear Sederhana pada Data Hasil Uji",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang menentukan persamaan garis regresi y=a+bx dan korelasi antara waktu pengerjaan vs output",
        "difficulty": "HARD"
      },
      {
        "label": "Program Linear untuk Optimasi Keuntungan Pabrik Bengkel",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang fungsi tujuan memaksimalkan laba dengan kendala keterbatasan bahan baku dan jam kerja mesin",
        "difficulty": "HARD"
      },
      {
        "label": "Logika Matematika: Tabel Kebenaran & Gerbang Logika Digital",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang konjungsi, disjungsi, implikasi, biimplikasi, dan ekuivalensi rangkaian saklar digital",
        "difficulty": "HARD"
      },
      {
        "label": "Limit & Turunan untuk Laju Perubahan Biaya Marjinal",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang menentukan biaya marjinal minimum dari fungsi biaya total C(x) dan kecepatan potong mesin",
        "difficulty": "HARD"
      },
      {
        "label": "Teori Peluang untuk Estimasi Risiko Cacat Komponen",
        "prompt": "Buatkan soal Matematika Kejuruan SMK tentang peluang kejadian komponen rusak dalam batch produksi dan uji sampling acak",
        "difficulty": "HARD"
      }
    ]
  },
  "rpl": {
    "EASY": [
      {
        "label": "Prinsip OOP: Enkapsulasi, Pewarisan, & Polimorfisme",
        "prompt": "Buatkan soal RPL SMK tentang class, object, access modifier (private, protected, public), inheritance, override, dan abstract class",
        "difficulty": "EASY"
      },
      {
        "label": "Basis Data Relasional & Normalisasi 1NF, 2NF, 3NF",
        "prompt": "Buatkan soal RPL SMK tentang dekomposisi anomali data (insert, update, delete), foreign key constraint, dan normalisasi database hingga 3NF",
        "difficulty": "EASY"
      },
      {
        "label": "Query SQL Lanjutan: JOIN, Agregasi, & Subquery",
        "prompt": "Buatkan soal RPL SMK tentang penulisan query INNER/LEFT JOIN, GROUP BY, HAVING, subquery nested, dan optimasi indexing",
        "difficulty": "EASY"
      },
      {
        "label": "Pemrograman Web Frontend: HTML5, CSS Flexbox/Grid, & DOM",
        "prompt": "Buatkan soal RPL SMK tentang tata letak responsif Flexbox/Grid, event listener JavaScript modern, dan manipulasi elemen DOM",
        "difficulty": "EASY"
      },
      {
        "label": "RESTful API: HTTP Methods, Status Codes, & JSON",
        "prompt": "Buatkan soal RPL SMK tentang endpoint CRUD (GET, POST, PUT, DELETE), response status 200/201/400/404/500, dan struktur payload JSON",
        "difficulty": "EASY"
      },
      {
        "label": "Git & Version Control: Branching, Merge, & Resolve Conflicts",
        "prompt": "Buatkan soal RPL SMK tentang alur kerja git commit, push, pull request, merge branch feature ke main, dan penanganan conflict code",
        "difficulty": "EASY"
      },
      {
        "label": "Pola Arsitektur Perangkat Lunak MVC",
        "prompt": "Buatkan soal RPL SMK tentang pemisahan layer Model (database), View (antarmuka), Controller (logika bisnis), dan routing URL",
        "difficulty": "EASY"
      },
      {
        "label": "Keamanan Web: Pencegahan SQL Injection & XSS",
        "prompt": "Buatkan soal RPL SMK tentang prepared statements PDO, sanitasi input HTML, validasi token CSRF, dan enkripsi kata sandi hashing bcrypt",
        "difficulty": "EASY"
      },
      {
        "label": "Algoritma & Struktur Data: Array, Stack, Queue, & Searching",
        "prompt": "Buatkan soal RPL SMK tentang implementasi LIFO stack, FIFO queue, binary search, dan analisis efisiensi perulangan algoritma",
        "difficulty": "EASY"
      },
      {
        "label": "Testing Perangkat Lunak: Unit Test & Black-Box Testing",
        "prompt": "Buatkan soal RPL SMK tentang membuat test case pengujian batas (boundary value analysis), equivalence partitioning, dan assert function",
        "difficulty": "EASY"
      },
      {
        "label": "Desain UI/UX: Wireframe, Heuristic Evaluation, & Usability",
        "prompt": "Buatkan soal RPL SMK tentang prinsip usabilitas Nielsen, hierarki visual antarmuka, navigasi mobile, dan micro-interaction",
        "difficulty": "EASY"
      },
      {
        "label": "SDLC: Metodologi Agile Scrum, Sprint Planning, & Backlog",
        "prompt": "Buatkan soal RPL SMK tentang siklus sprint 2 mingguan, peran Product Owner, Scrum Master, backlog refinement, dan retrospective",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Prinsip OOP: Enkapsulasi, Pewarisan, & Polimorfisme",
        "prompt": "Buatkan soal RPL SMK tentang class, object, access modifier (private, protected, public), inheritance, override, dan abstract class",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Basis Data Relasional & Normalisasi 1NF, 2NF, 3NF",
        "prompt": "Buatkan soal RPL SMK tentang dekomposisi anomali data (insert, update, delete), foreign key constraint, dan normalisasi database hingga 3NF",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Query SQL Lanjutan: JOIN, Agregasi, & Subquery",
        "prompt": "Buatkan soal RPL SMK tentang penulisan query INNER/LEFT JOIN, GROUP BY, HAVING, subquery nested, dan optimasi indexing",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pemrograman Web Frontend: HTML5, CSS Flexbox/Grid, & DOM",
        "prompt": "Buatkan soal RPL SMK tentang tata letak responsif Flexbox/Grid, event listener JavaScript modern, dan manipulasi elemen DOM",
        "difficulty": "MEDIUM"
      },
      {
        "label": "RESTful API: HTTP Methods, Status Codes, & JSON",
        "prompt": "Buatkan soal RPL SMK tentang endpoint CRUD (GET, POST, PUT, DELETE), response status 200/201/400/404/500, dan struktur payload JSON",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Git & Version Control: Branching, Merge, & Resolve Conflicts",
        "prompt": "Buatkan soal RPL SMK tentang alur kerja git commit, push, pull request, merge branch feature ke main, dan penanganan conflict code",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pola Arsitektur Perangkat Lunak MVC",
        "prompt": "Buatkan soal RPL SMK tentang pemisahan layer Model (database), View (antarmuka), Controller (logika bisnis), dan routing URL",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Keamanan Web: Pencegahan SQL Injection & XSS",
        "prompt": "Buatkan soal RPL SMK tentang prepared statements PDO, sanitasi input HTML, validasi token CSRF, dan enkripsi kata sandi hashing bcrypt",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Algoritma & Struktur Data: Array, Stack, Queue, & Searching",
        "prompt": "Buatkan soal RPL SMK tentang implementasi LIFO stack, FIFO queue, binary search, dan analisis efisiensi perulangan algoritma",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Testing Perangkat Lunak: Unit Test & Black-Box Testing",
        "prompt": "Buatkan soal RPL SMK tentang membuat test case pengujian batas (boundary value analysis), equivalence partitioning, dan assert function",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Desain UI/UX: Wireframe, Heuristic Evaluation, & Usability",
        "prompt": "Buatkan soal RPL SMK tentang prinsip usabilitas Nielsen, hierarki visual antarmuka, navigasi mobile, dan micro-interaction",
        "difficulty": "MEDIUM"
      },
      {
        "label": "SDLC: Metodologi Agile Scrum, Sprint Planning, & Backlog",
        "prompt": "Buatkan soal RPL SMK tentang siklus sprint 2 mingguan, peran Product Owner, Scrum Master, backlog refinement, dan retrospective",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Prinsip OOP: Enkapsulasi, Pewarisan, & Polimorfisme",
        "prompt": "Buatkan soal RPL SMK tentang class, object, access modifier (private, protected, public), inheritance, override, dan abstract class",
        "difficulty": "HARD"
      },
      {
        "label": "Basis Data Relasional & Normalisasi 1NF, 2NF, 3NF",
        "prompt": "Buatkan soal RPL SMK tentang dekomposisi anomali data (insert, update, delete), foreign key constraint, dan normalisasi database hingga 3NF",
        "difficulty": "HARD"
      },
      {
        "label": "Query SQL Lanjutan: JOIN, Agregasi, & Subquery",
        "prompt": "Buatkan soal RPL SMK tentang penulisan query INNER/LEFT JOIN, GROUP BY, HAVING, subquery nested, dan optimasi indexing",
        "difficulty": "HARD"
      },
      {
        "label": "Pemrograman Web Frontend: HTML5, CSS Flexbox/Grid, & DOM",
        "prompt": "Buatkan soal RPL SMK tentang tata letak responsif Flexbox/Grid, event listener JavaScript modern, dan manipulasi elemen DOM",
        "difficulty": "HARD"
      },
      {
        "label": "RESTful API: HTTP Methods, Status Codes, & JSON",
        "prompt": "Buatkan soal RPL SMK tentang endpoint CRUD (GET, POST, PUT, DELETE), response status 200/201/400/404/500, dan struktur payload JSON",
        "difficulty": "HARD"
      },
      {
        "label": "Git & Version Control: Branching, Merge, & Resolve Conflicts",
        "prompt": "Buatkan soal RPL SMK tentang alur kerja git commit, push, pull request, merge branch feature ke main, dan penanganan conflict code",
        "difficulty": "HARD"
      },
      {
        "label": "Pola Arsitektur Perangkat Lunak MVC",
        "prompt": "Buatkan soal RPL SMK tentang pemisahan layer Model (database), View (antarmuka), Controller (logika bisnis), dan routing URL",
        "difficulty": "HARD"
      },
      {
        "label": "Keamanan Web: Pencegahan SQL Injection & XSS",
        "prompt": "Buatkan soal RPL SMK tentang prepared statements PDO, sanitasi input HTML, validasi token CSRF, dan enkripsi kata sandi hashing bcrypt",
        "difficulty": "HARD"
      },
      {
        "label": "Algoritma & Struktur Data: Array, Stack, Queue, & Searching",
        "prompt": "Buatkan soal RPL SMK tentang implementasi LIFO stack, FIFO queue, binary search, dan analisis efisiensi perulangan algoritma",
        "difficulty": "HARD"
      },
      {
        "label": "Testing Perangkat Lunak: Unit Test & Black-Box Testing",
        "prompt": "Buatkan soal RPL SMK tentang membuat test case pengujian batas (boundary value analysis), equivalence partitioning, dan assert function",
        "difficulty": "HARD"
      },
      {
        "label": "Desain UI/UX: Wireframe, Heuristic Evaluation, & Usability",
        "prompt": "Buatkan soal RPL SMK tentang prinsip usabilitas Nielsen, hierarki visual antarmuka, navigasi mobile, dan micro-interaction",
        "difficulty": "HARD"
      },
      {
        "label": "SDLC: Metodologi Agile Scrum, Sprint Planning, & Backlog",
        "prompt": "Buatkan soal RPL SMK tentang siklus sprint 2 mingguan, peran Product Owner, Scrum Master, backlog refinement, dan retrospective",
        "difficulty": "HARD"
      }
    ]
  },
  "tkj": {
    "EASY": [
      {
        "label": "Perhitungan Subnetting IPv4 Notasi CIDR & VLSM",
        "prompt": "Buatkan soal TKJ SMK tentang menentukan network address, broadcast, netmask /24 s.d. /30, dan range host usable pada topologi VLSM",
        "difficulty": "EASY"
      },
      {
        "label": "Konfigurasi Routing Statis & Dynamic Routing OSPF Mikrotik",
        "prompt": "Buatkan soal TKJ SMK tentang parameter distance, gateway, area OSPF, pemilihan Designated Router (DR), dan convergence jaringan",
        "difficulty": "EASY"
      },
      {
        "label": "Layanan Server Jaringan: DHCP Server, Lease Time, & DNS",
        "prompt": "Buatkan soal TKJ SMK tentang proses DORA DHCP, konfigurasi DNS resolver, A record, dan forwarding cache domain name",
        "difficulty": "EASY"
      },
      {
        "label": "Krimping Kabel UTP T568A/B & Pengujian Cable Tester",
        "prompt": "Buatkan soal TKJ SMK tentang urutan pin kabel straight vs crossover, standar kategori Cat5e/Cat6, dan penanganan kabel putus pin",
        "difficulty": "EASY"
      },
      {
        "label": "Konfigurasi VLAN (Virtual LAN) & Trunking 802.1Q Switch",
        "prompt": "Buatkan soal TKJ SMK tentang isolasi broadcast domain, port mode access vs trunk, dan inter-VLAN routing menggunakan router on a stick",
        "difficulty": "EASY"
      },
      {
        "label": "Keamanan Jaringan: Firewall Filter Rules & NAT Masquerade",
        "prompt": "Buatkan soal TKJ SMK tentang chain input/forward/output Mikrotik, blokir port berbahaya, dan konfigurasi src-nat masquerade akses internet",
        "difficulty": "EASY"
      },
      {
        "label": "Manajemen Bandwidth: Simple Queue & Queue Tree Mikrotik",
        "prompt": "Buatkan soal TKJ SMK tentang alokasi target upload/download, limit-at vs max-limit, burst rate, dan pembagian bandwidth merata",
        "difficulty": "EASY"
      },
      {
        "label": "Jaringan Nirkabel (WLAN): Frekuensi 2.4/5GHz & WPA2/3",
        "prompt": "Buatkan soal TKJ SMK tentang non-overlapping channel (1, 6, 11), interferensi sinyal, keamanan WPA-Personal/Enterprise, dan Access Point",
        "difficulty": "EASY"
      },
      {
        "label": "Konfigurasi Server Linux: Web Server Apache & SSH Remote",
        "prompt": "Buatkan soal TKJ SMK tentang konfigurasi virtual host, hak akses chmod/chown, instalasi paket apt, dan pengamanan port remote SSH",
        "difficulty": "EASY"
      },
      {
        "label": "Model Referensi OSI 7 Layer & Protokol Jaringan",
        "prompt": "Buatkan soal TKJ SMK tentang fungsi tiap layer OSI dari Physical sampai Application, proses enkapsulasi data, dan protokol TCP vs UDP",
        "difficulty": "EASY"
      },
      {
        "label": "Troubleshooting Jaringan: Perintah Ping, Traceroute, & Netstat",
        "prompt": "Buatkan soal TKJ SMK tentang menganalisis error Request Timed Out, Destination Host Unreachable, TTL expired, dan port listening",
        "difficulty": "EASY"
      },
      {
        "label": "Monitoring Jaringan Komputer dengan Tools Wireshark",
        "prompt": "Buatkan soal TKJ SMK tentang menangkap paket data traffic sniffing, menganalisis handshake 3-arah TCP, dan utilisasi bandwidth port",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Perhitungan Subnetting IPv4 Notasi CIDR & VLSM",
        "prompt": "Buatkan soal TKJ SMK tentang menentukan network address, broadcast, netmask /24 s.d. /30, dan range host usable pada topologi VLSM",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Konfigurasi Routing Statis & Dynamic Routing OSPF Mikrotik",
        "prompt": "Buatkan soal TKJ SMK tentang parameter distance, gateway, area OSPF, pemilihan Designated Router (DR), dan convergence jaringan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Layanan Server Jaringan: DHCP Server, Lease Time, & DNS",
        "prompt": "Buatkan soal TKJ SMK tentang proses DORA DHCP, konfigurasi DNS resolver, A record, dan forwarding cache domain name",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Krimping Kabel UTP T568A/B & Pengujian Cable Tester",
        "prompt": "Buatkan soal TKJ SMK tentang urutan pin kabel straight vs crossover, standar kategori Cat5e/Cat6, dan penanganan kabel putus pin",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Konfigurasi VLAN (Virtual LAN) & Trunking 802.1Q Switch",
        "prompt": "Buatkan soal TKJ SMK tentang isolasi broadcast domain, port mode access vs trunk, dan inter-VLAN routing menggunakan router on a stick",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Keamanan Jaringan: Firewall Filter Rules & NAT Masquerade",
        "prompt": "Buatkan soal TKJ SMK tentang chain input/forward/output Mikrotik, blokir port berbahaya, dan konfigurasi src-nat masquerade akses internet",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Manajemen Bandwidth: Simple Queue & Queue Tree Mikrotik",
        "prompt": "Buatkan soal TKJ SMK tentang alokasi target upload/download, limit-at vs max-limit, burst rate, dan pembagian bandwidth merata",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Jaringan Nirkabel (WLAN): Frekuensi 2.4/5GHz & WPA2/3",
        "prompt": "Buatkan soal TKJ SMK tentang non-overlapping channel (1, 6, 11), interferensi sinyal, keamanan WPA-Personal/Enterprise, dan Access Point",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Konfigurasi Server Linux: Web Server Apache & SSH Remote",
        "prompt": "Buatkan soal TKJ SMK tentang konfigurasi virtual host, hak akses chmod/chown, instalasi paket apt, dan pengamanan port remote SSH",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Model Referensi OSI 7 Layer & Protokol Jaringan",
        "prompt": "Buatkan soal TKJ SMK tentang fungsi tiap layer OSI dari Physical sampai Application, proses enkapsulasi data, dan protokol TCP vs UDP",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Troubleshooting Jaringan: Perintah Ping, Traceroute, & Netstat",
        "prompt": "Buatkan soal TKJ SMK tentang menganalisis error Request Timed Out, Destination Host Unreachable, TTL expired, dan port listening",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Monitoring Jaringan Komputer dengan Tools Wireshark",
        "prompt": "Buatkan soal TKJ SMK tentang menangkap paket data traffic sniffing, menganalisis handshake 3-arah TCP, dan utilisasi bandwidth port",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Perhitungan Subnetting IPv4 Notasi CIDR & VLSM",
        "prompt": "Buatkan soal TKJ SMK tentang menentukan network address, broadcast, netmask /24 s.d. /30, dan range host usable pada topologi VLSM",
        "difficulty": "HARD"
      },
      {
        "label": "Konfigurasi Routing Statis & Dynamic Routing OSPF Mikrotik",
        "prompt": "Buatkan soal TKJ SMK tentang parameter distance, gateway, area OSPF, pemilihan Designated Router (DR), dan convergence jaringan",
        "difficulty": "HARD"
      },
      {
        "label": "Layanan Server Jaringan: DHCP Server, Lease Time, & DNS",
        "prompt": "Buatkan soal TKJ SMK tentang proses DORA DHCP, konfigurasi DNS resolver, A record, dan forwarding cache domain name",
        "difficulty": "HARD"
      },
      {
        "label": "Krimping Kabel UTP T568A/B & Pengujian Cable Tester",
        "prompt": "Buatkan soal TKJ SMK tentang urutan pin kabel straight vs crossover, standar kategori Cat5e/Cat6, dan penanganan kabel putus pin",
        "difficulty": "HARD"
      },
      {
        "label": "Konfigurasi VLAN (Virtual LAN) & Trunking 802.1Q Switch",
        "prompt": "Buatkan soal TKJ SMK tentang isolasi broadcast domain, port mode access vs trunk, dan inter-VLAN routing menggunakan router on a stick",
        "difficulty": "HARD"
      },
      {
        "label": "Keamanan Jaringan: Firewall Filter Rules & NAT Masquerade",
        "prompt": "Buatkan soal TKJ SMK tentang chain input/forward/output Mikrotik, blokir port berbahaya, dan konfigurasi src-nat masquerade akses internet",
        "difficulty": "HARD"
      },
      {
        "label": "Manajemen Bandwidth: Simple Queue & Queue Tree Mikrotik",
        "prompt": "Buatkan soal TKJ SMK tentang alokasi target upload/download, limit-at vs max-limit, burst rate, dan pembagian bandwidth merata",
        "difficulty": "HARD"
      },
      {
        "label": "Jaringan Nirkabel (WLAN): Frekuensi 2.4/5GHz & WPA2/3",
        "prompt": "Buatkan soal TKJ SMK tentang non-overlapping channel (1, 6, 11), interferensi sinyal, keamanan WPA-Personal/Enterprise, dan Access Point",
        "difficulty": "HARD"
      },
      {
        "label": "Konfigurasi Server Linux: Web Server Apache & SSH Remote",
        "prompt": "Buatkan soal TKJ SMK tentang konfigurasi virtual host, hak akses chmod/chown, instalasi paket apt, dan pengamanan port remote SSH",
        "difficulty": "HARD"
      },
      {
        "label": "Model Referensi OSI 7 Layer & Protokol Jaringan",
        "prompt": "Buatkan soal TKJ SMK tentang fungsi tiap layer OSI dari Physical sampai Application, proses enkapsulasi data, dan protokol TCP vs UDP",
        "difficulty": "HARD"
      },
      {
        "label": "Troubleshooting Jaringan: Perintah Ping, Traceroute, & Netstat",
        "prompt": "Buatkan soal TKJ SMK tentang menganalisis error Request Timed Out, Destination Host Unreachable, TTL expired, dan port listening",
        "difficulty": "HARD"
      },
      {
        "label": "Monitoring Jaringan Komputer dengan Tools Wireshark",
        "prompt": "Buatkan soal TKJ SMK tentang menangkap paket data traffic sniffing, menganalisis handshake 3-arah TCP, dan utilisasi bandwidth port",
        "difficulty": "HARD"
      }
    ]
  },
  "akl": {
    "EASY": [
      {
        "label": "Persamaan Dasar Akuntansi: Analisis Pengaruh Transaksi",
        "prompt": "Buatkan soal Akuntansi (AKL) SMK tentang pengaruh transaksi pembelian kredit, pendapatan tunai, dan prive terhadap aset, liabilitas, ekuitas",
        "difficulty": "EASY"
      },
      {
        "label": "Penyusunan Jurnal Umum, Buku Besar, & Neraca Saldo",
        "prompt": "Buatkan soal AKL SMK tentang pencatatan debit-kredit transaksi perusahaan jasa/dagang, posting buku besar T/4 kolom, dan saldo normal",
        "difficulty": "EASY"
      },
      {
        "label": "Jurnal Penyesuaian (AJP) Beban Dibayar Dimuka & Akrual",
        "prompt": "Buatkan soal AKL SMK tentang penyesuaian sewa dibayar dimuka (pendekatan neraca/laba rugi), pendapatan masih harus diterima, dan perlengkapan",
        "difficulty": "EASY"
      },
      {
        "label": "Penyusunan Kertas Kerja (Neraca Lajur 10 Kolom)",
        "prompt": "Buatkan soal AKL SMK tentang pengisian kolom neraca saldo, penyesuaian, neraca disesuaikan, laba-rugi, dan neraca akhir perusahaan",
        "difficulty": "EASY"
      },
      {
        "label": "Laporan Keuangan: Laba Rugi, Perubahan Ekuitas, & Neraca",
        "prompt": "Buatkan soal AKL SMK tentang menghitung laba bersih operasional, penyusunan laporan posisi keuangan bentuk staffel/skontro",
        "difficulty": "EASY"
      },
      {
        "label": "Jurnal Penutup & Neraca Saldo Setelah Penutupan",
        "prompt": "Buatkan soal AKL SMK tentang menutup akun pendapatan, beban, ikhtisar laba-rugi, akun prive, dan memverifikasi saldo akhir akun riil",
        "difficulty": "EASY"
      },
      {
        "label": "Akuntansi Kas Kecil: Metode Imprest Fund vs Fluktuasi",
        "prompt": "Buatkan soal AKL SMK tentang pembentukan kas kecil, pencatatan bukti pengeluaran kuitansi, dan pengisian kembali dana kas kecil",
        "difficulty": "EASY"
      },
      {
        "label": "Rekonsiliasi Bank: Mengatasi Selisih Kas Bank & Perusahaan",
        "prompt": "Buatkan soal AKL SMK tentang deposit in transit, outstanding check, biaya administrasi bank, jasa giro, dan pembuatan jurnal penyesuaian",
        "difficulty": "EASY"
      },
      {
        "label": "Metode Penilaian Persediaan Barang Dagang: FIFO, Average",
        "prompt": "Buatkan soal AKL SMK tentang kartu persediaan sistem perpetual vs periodik, menghitung nilai persediaan akhir dan harga pokok penjualan",
        "difficulty": "EASY"
      },
      {
        "label": "Akuntansi Piutang Dagang & Cadangan Kerugian Piutang",
        "prompt": "Buatkan soal AKL SMK tentang penaksiran kerugian piutang tak tertagih metode persentase penjualan/analisis umur piutang dan penghapusan",
        "difficulty": "EASY"
      },
      {
        "label": "Harga Pokok Produksi Perusahaan Manufaktur",
        "prompt": "Buatkan soal AKL SMK tentang komponen biaya bahan baku langsung, tenaga kerja langsung, Biaya Overhead Pabrik (BOP), dan kartu harga pokok",
        "difficulty": "EASY"
      },
      {
        "label": "Komputer Akuntansi: Pengoperasian Software MYOB / Accurate",
        "prompt": "Buatkan soal AKL SMK tentang setup bagan akun (chart of accounts), data pelanggan/pemasok, entry saldo awal, dan input transaksi pembelian/penjualan",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Persamaan Dasar Akuntansi: Analisis Pengaruh Transaksi",
        "prompt": "Buatkan soal Akuntansi (AKL) SMK tentang pengaruh transaksi pembelian kredit, pendapatan tunai, dan prive terhadap aset, liabilitas, ekuitas",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penyusunan Jurnal Umum, Buku Besar, & Neraca Saldo",
        "prompt": "Buatkan soal AKL SMK tentang pencatatan debit-kredit transaksi perusahaan jasa/dagang, posting buku besar T/4 kolom, dan saldo normal",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Jurnal Penyesuaian (AJP) Beban Dibayar Dimuka & Akrual",
        "prompt": "Buatkan soal AKL SMK tentang penyesuaian sewa dibayar dimuka (pendekatan neraca/laba rugi), pendapatan masih harus diterima, dan perlengkapan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penyusunan Kertas Kerja (Neraca Lajur 10 Kolom)",
        "prompt": "Buatkan soal AKL SMK tentang pengisian kolom neraca saldo, penyesuaian, neraca disesuaikan, laba-rugi, dan neraca akhir perusahaan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Laporan Keuangan: Laba Rugi, Perubahan Ekuitas, & Neraca",
        "prompt": "Buatkan soal AKL SMK tentang menghitung laba bersih operasional, penyusunan laporan posisi keuangan bentuk staffel/skontro",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Jurnal Penutup & Neraca Saldo Setelah Penutupan",
        "prompt": "Buatkan soal AKL SMK tentang menutup akun pendapatan, beban, ikhtisar laba-rugi, akun prive, dan memverifikasi saldo akhir akun riil",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Akuntansi Kas Kecil: Metode Imprest Fund vs Fluktuasi",
        "prompt": "Buatkan soal AKL SMK tentang pembentukan kas kecil, pencatatan bukti pengeluaran kuitansi, dan pengisian kembali dana kas kecil",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Rekonsiliasi Bank: Mengatasi Selisih Kas Bank & Perusahaan",
        "prompt": "Buatkan soal AKL SMK tentang deposit in transit, outstanding check, biaya administrasi bank, jasa giro, dan pembuatan jurnal penyesuaian",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Metode Penilaian Persediaan Barang Dagang: FIFO, Average",
        "prompt": "Buatkan soal AKL SMK tentang kartu persediaan sistem perpetual vs periodik, menghitung nilai persediaan akhir dan harga pokok penjualan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Akuntansi Piutang Dagang & Cadangan Kerugian Piutang",
        "prompt": "Buatkan soal AKL SMK tentang penaksiran kerugian piutang tak tertagih metode persentase penjualan/analisis umur piutang dan penghapusan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Harga Pokok Produksi Perusahaan Manufaktur",
        "prompt": "Buatkan soal AKL SMK tentang komponen biaya bahan baku langsung, tenaga kerja langsung, Biaya Overhead Pabrik (BOP), dan kartu harga pokok",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Komputer Akuntansi: Pengoperasian Software MYOB / Accurate",
        "prompt": "Buatkan soal AKL SMK tentang setup bagan akun (chart of accounts), data pelanggan/pemasok, entry saldo awal, dan input transaksi pembelian/penjualan",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Persamaan Dasar Akuntansi: Analisis Pengaruh Transaksi",
        "prompt": "Buatkan soal Akuntansi (AKL) SMK tentang pengaruh transaksi pembelian kredit, pendapatan tunai, dan prive terhadap aset, liabilitas, ekuitas",
        "difficulty": "HARD"
      },
      {
        "label": "Penyusunan Jurnal Umum, Buku Besar, & Neraca Saldo",
        "prompt": "Buatkan soal AKL SMK tentang pencatatan debit-kredit transaksi perusahaan jasa/dagang, posting buku besar T/4 kolom, dan saldo normal",
        "difficulty": "HARD"
      },
      {
        "label": "Jurnal Penyesuaian (AJP) Beban Dibayar Dimuka & Akrual",
        "prompt": "Buatkan soal AKL SMK tentang penyesuaian sewa dibayar dimuka (pendekatan neraca/laba rugi), pendapatan masih harus diterima, dan perlengkapan",
        "difficulty": "HARD"
      },
      {
        "label": "Penyusunan Kertas Kerja (Neraca Lajur 10 Kolom)",
        "prompt": "Buatkan soal AKL SMK tentang pengisian kolom neraca saldo, penyesuaian, neraca disesuaikan, laba-rugi, dan neraca akhir perusahaan",
        "difficulty": "HARD"
      },
      {
        "label": "Laporan Keuangan: Laba Rugi, Perubahan Ekuitas, & Neraca",
        "prompt": "Buatkan soal AKL SMK tentang menghitung laba bersih operasional, penyusunan laporan posisi keuangan bentuk staffel/skontro",
        "difficulty": "HARD"
      },
      {
        "label": "Jurnal Penutup & Neraca Saldo Setelah Penutupan",
        "prompt": "Buatkan soal AKL SMK tentang menutup akun pendapatan, beban, ikhtisar laba-rugi, akun prive, dan memverifikasi saldo akhir akun riil",
        "difficulty": "HARD"
      },
      {
        "label": "Akuntansi Kas Kecil: Metode Imprest Fund vs Fluktuasi",
        "prompt": "Buatkan soal AKL SMK tentang pembentukan kas kecil, pencatatan bukti pengeluaran kuitansi, dan pengisian kembali dana kas kecil",
        "difficulty": "HARD"
      },
      {
        "label": "Rekonsiliasi Bank: Mengatasi Selisih Kas Bank & Perusahaan",
        "prompt": "Buatkan soal AKL SMK tentang deposit in transit, outstanding check, biaya administrasi bank, jasa giro, dan pembuatan jurnal penyesuaian",
        "difficulty": "HARD"
      },
      {
        "label": "Metode Penilaian Persediaan Barang Dagang: FIFO, Average",
        "prompt": "Buatkan soal AKL SMK tentang kartu persediaan sistem perpetual vs periodik, menghitung nilai persediaan akhir dan harga pokok penjualan",
        "difficulty": "HARD"
      },
      {
        "label": "Akuntansi Piutang Dagang & Cadangan Kerugian Piutang",
        "prompt": "Buatkan soal AKL SMK tentang penaksiran kerugian piutang tak tertagih metode persentase penjualan/analisis umur piutang dan penghapusan",
        "difficulty": "HARD"
      },
      {
        "label": "Harga Pokok Produksi Perusahaan Manufaktur",
        "prompt": "Buatkan soal AKL SMK tentang komponen biaya bahan baku langsung, tenaga kerja langsung, Biaya Overhead Pabrik (BOP), dan kartu harga pokok",
        "difficulty": "HARD"
      },
      {
        "label": "Komputer Akuntansi: Pengoperasian Software MYOB / Accurate",
        "prompt": "Buatkan soal AKL SMK tentang setup bagan akun (chart of accounts), data pelanggan/pemasok, entry saldo awal, dan input transaksi pembelian/penjualan",
        "difficulty": "HARD"
      }
    ]
  },
  "pkk": {
    "EASY": [
      {
        "label": "Analisis Peluang Usaha & Identifikasi Ide Bisnis Kreatif",
        "prompt": "Buatkan soal PKK SMK tentang menggali peluang bisnis dari kebutuhan pasar lokal, inovasi produk kejuruan, dan analisis resiko usaha",
        "difficulty": "EASY"
      },
      {
        "label": "Analisis SWOT: Strengths, Weaknesses, Opportunities, Threats",
        "prompt": "Buatkan soal PKK SMK tentang memetakan faktor internal kekuatan-kelemahan dan eksternal peluang-ancaman dalam strategi produk",
        "difficulty": "EASY"
      },
      {
        "label": "Perhitungan Break Even Point (BEP) Unit & Nominal Rupiah",
        "prompt": "Buatkan soal PKK SMK tentang rumus BEP berdasarkan Biaya Tetap (Fixed Cost), Biaya Variabel per unit, dan Harga Jual produk",
        "difficulty": "EASY"
      },
      {
        "label": "Penyusunan Rencana Anggaran Biaya (RAB) Produksi Massal",
        "prompt": "Buatkan soal PKK SMK tentang menghitung kebutuhan modal kerja, biaya operasional, biaya penyusutan alat, dan estimasi keuntungan bersih",
        "difficulty": "EASY"
      },
      {
        "label": "Strategi Penetapan Harga Jual Berdasarkan Cost-Plus Markup",
        "prompt": "Buatkan soal PKK SMK tentang menghitung HPP per unit produk dan menentukan persentase markup margin keuntungan pasar kompetitif",
        "difficulty": "EASY"
      },
      {
        "label": "Desain Kemasan Produk (Packaging) Menarik & Standar BPOM",
        "prompt": "Buatkan soal PKK SMK tentang fungsi kemasan primer/sekunder/tersier, informasi label gizi, barcode, dan daya tarik display etalase",
        "difficulty": "EASY"
      },
      {
        "label": "Pemasaran Digital: Social Media Ads & Marketplace",
        "prompt": "Buatkan soal PKK SMK tentang strategi copywriting iklan digital, targeting audiens, optimasi kata kunci toko online, dan conversion rate",
        "difficulty": "EASY"
      },
      {
        "label": "Penyusunan Dokumen Proposal Usaha (Business Plan Pitch Deck)",
        "prompt": "Buatkan soal PKK SMK tentang struktur proposal bisnis: executive summary, analisis pasar, rencana operasional, dan proyeksi keuangan",
        "difficulty": "EASY"
      },
      {
        "label": "Hak Atas Kekayaan Intelektual (HAKI): Merek, Paten, Hak Cipta",
        "prompt": "Buatkan soal PKK SMK tentang tata cara pendaftaran hak merek dagang ke Kemenkumham, perlindungan rahasia dagang, dan sanksi plagiasi",
        "difficulty": "EASY"
      },
      {
        "label": "Standar Pengendalian Mutu Produk (Quality Assurance QC)",
        "prompt": "Buatkan soal PKK SMK tentang inspeksi bahan baku masuk, pengujian fungsi prototipe produk, dan standarisasi mutu ISO/SNI",
        "difficulty": "EASY"
      },
      {
        "label": "Manajemen Arus Kas (Cash Flow) Usaha Mikro Kecil Menengah",
        "prompt": "Buatkan soal PKK SMK tentang menjaga likuiditas kas usaha, menyeimbangkan piutang vs utang dagang, dan penyisihan dana darurat",
        "difficulty": "EASY"
      },
      {
        "label": "Evaluasi Kinerja Penjualan & Strategi Diversifikasi Produk",
        "prompt": "Buatkan soal PKK SMK tentang evaluasi laporan omzet bulanan, analisis kepuasan pelanggan, dan pengembangan varian produk baru",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Analisis Peluang Usaha & Identifikasi Ide Bisnis Kreatif",
        "prompt": "Buatkan soal PKK SMK tentang menggali peluang bisnis dari kebutuhan pasar lokal, inovasi produk kejuruan, dan analisis resiko usaha",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Analisis SWOT: Strengths, Weaknesses, Opportunities, Threats",
        "prompt": "Buatkan soal PKK SMK tentang memetakan faktor internal kekuatan-kelemahan dan eksternal peluang-ancaman dalam strategi produk",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Perhitungan Break Even Point (BEP) Unit & Nominal Rupiah",
        "prompt": "Buatkan soal PKK SMK tentang rumus BEP berdasarkan Biaya Tetap (Fixed Cost), Biaya Variabel per unit, dan Harga Jual produk",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penyusunan Rencana Anggaran Biaya (RAB) Produksi Massal",
        "prompt": "Buatkan soal PKK SMK tentang menghitung kebutuhan modal kerja, biaya operasional, biaya penyusutan alat, dan estimasi keuntungan bersih",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Strategi Penetapan Harga Jual Berdasarkan Cost-Plus Markup",
        "prompt": "Buatkan soal PKK SMK tentang menghitung HPP per unit produk dan menentukan persentase markup margin keuntungan pasar kompetitif",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Desain Kemasan Produk (Packaging) Menarik & Standar BPOM",
        "prompt": "Buatkan soal PKK SMK tentang fungsi kemasan primer/sekunder/tersier, informasi label gizi, barcode, dan daya tarik display etalase",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pemasaran Digital: Social Media Ads & Marketplace",
        "prompt": "Buatkan soal PKK SMK tentang strategi copywriting iklan digital, targeting audiens, optimasi kata kunci toko online, dan conversion rate",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penyusunan Dokumen Proposal Usaha (Business Plan Pitch Deck)",
        "prompt": "Buatkan soal PKK SMK tentang struktur proposal bisnis: executive summary, analisis pasar, rencana operasional, dan proyeksi keuangan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Hak Atas Kekayaan Intelektual (HAKI): Merek, Paten, Hak Cipta",
        "prompt": "Buatkan soal PKK SMK tentang tata cara pendaftaran hak merek dagang ke Kemenkumham, perlindungan rahasia dagang, dan sanksi plagiasi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Standar Pengendalian Mutu Produk (Quality Assurance QC)",
        "prompt": "Buatkan soal PKK SMK tentang inspeksi bahan baku masuk, pengujian fungsi prototipe produk, dan standarisasi mutu ISO/SNI",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Manajemen Arus Kas (Cash Flow) Usaha Mikro Kecil Menengah",
        "prompt": "Buatkan soal PKK SMK tentang menjaga likuiditas kas usaha, menyeimbangkan piutang vs utang dagang, dan penyisihan dana darurat",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Evaluasi Kinerja Penjualan & Strategi Diversifikasi Produk",
        "prompt": "Buatkan soal PKK SMK tentang evaluasi laporan omzet bulanan, analisis kepuasan pelanggan, dan pengembangan varian produk baru",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Analisis Peluang Usaha & Identifikasi Ide Bisnis Kreatif",
        "prompt": "Buatkan soal PKK SMK tentang menggali peluang bisnis dari kebutuhan pasar lokal, inovasi produk kejuruan, dan analisis resiko usaha",
        "difficulty": "HARD"
      },
      {
        "label": "Analisis SWOT: Strengths, Weaknesses, Opportunities, Threats",
        "prompt": "Buatkan soal PKK SMK tentang memetakan faktor internal kekuatan-kelemahan dan eksternal peluang-ancaman dalam strategi produk",
        "difficulty": "HARD"
      },
      {
        "label": "Perhitungan Break Even Point (BEP) Unit & Nominal Rupiah",
        "prompt": "Buatkan soal PKK SMK tentang rumus BEP berdasarkan Biaya Tetap (Fixed Cost), Biaya Variabel per unit, dan Harga Jual produk",
        "difficulty": "HARD"
      },
      {
        "label": "Penyusunan Rencana Anggaran Biaya (RAB) Produksi Massal",
        "prompt": "Buatkan soal PKK SMK tentang menghitung kebutuhan modal kerja, biaya operasional, biaya penyusutan alat, dan estimasi keuntungan bersih",
        "difficulty": "HARD"
      },
      {
        "label": "Strategi Penetapan Harga Jual Berdasarkan Cost-Plus Markup",
        "prompt": "Buatkan soal PKK SMK tentang menghitung HPP per unit produk dan menentukan persentase markup margin keuntungan pasar kompetitif",
        "difficulty": "HARD"
      },
      {
        "label": "Desain Kemasan Produk (Packaging) Menarik & Standar BPOM",
        "prompt": "Buatkan soal PKK SMK tentang fungsi kemasan primer/sekunder/tersier, informasi label gizi, barcode, dan daya tarik display etalase",
        "difficulty": "HARD"
      },
      {
        "label": "Pemasaran Digital: Social Media Ads & Marketplace",
        "prompt": "Buatkan soal PKK SMK tentang strategi copywriting iklan digital, targeting audiens, optimasi kata kunci toko online, dan conversion rate",
        "difficulty": "HARD"
      },
      {
        "label": "Penyusunan Dokumen Proposal Usaha (Business Plan Pitch Deck)",
        "prompt": "Buatkan soal PKK SMK tentang struktur proposal bisnis: executive summary, analisis pasar, rencana operasional, dan proyeksi keuangan",
        "difficulty": "HARD"
      },
      {
        "label": "Hak Atas Kekayaan Intelektual (HAKI): Merek, Paten, Hak Cipta",
        "prompt": "Buatkan soal PKK SMK tentang tata cara pendaftaran hak merek dagang ke Kemenkumham, perlindungan rahasia dagang, dan sanksi plagiasi",
        "difficulty": "HARD"
      },
      {
        "label": "Standar Pengendalian Mutu Produk (Quality Assurance QC)",
        "prompt": "Buatkan soal PKK SMK tentang inspeksi bahan baku masuk, pengujian fungsi prototipe produk, dan standarisasi mutu ISO/SNI",
        "difficulty": "HARD"
      },
      {
        "label": "Manajemen Arus Kas (Cash Flow) Usaha Mikro Kecil Menengah",
        "prompt": "Buatkan soal PKK SMK tentang menjaga likuiditas kas usaha, menyeimbangkan piutang vs utang dagang, dan penyisihan dana darurat",
        "difficulty": "HARD"
      },
      {
        "label": "Evaluasi Kinerja Penjualan & Strategi Diversifikasi Produk",
        "prompt": "Buatkan soal PKK SMK tentang evaluasi laporan omzet bulanan, analisis kepuasan pelanggan, dan pengembangan varian produk baru",
        "difficulty": "HARD"
      }
    ]
  },
  "otomotif": {
    "EASY": [
      {
        "label": "Prinsip Kerja Mesin 4 Langkah (4-Stroke) Bensin & Diesel",
        "prompt": "Buatkan soal Otomotif SMK tentang langkah hisap, kompresi, usaha/kerja, dan buang pada siklus motor bakar serta perbedaan rasio kompresi",
        "difficulty": "EASY"
      },
      {
        "label": "Prosedur K3 Bengkel Otomotif & Penggunaan APD Wajib",
        "prompt": "Buatkan soal Otomotif SMK tentang sepatu safety, kacamata pelindung, penanganan tumpahan oli pelumas, dan bahaya gas karbon monoksida",
        "difficulty": "EASY"
      },
      {
        "label": "Penggunaan Alat Ukur Presisi: Vernier Caliper & Dial Gauge",
        "prompt": "Buatkan soal Otomotif SMK tentang mengukur ketebalan kanvas rem, keolengan piringan cakram (run-out), dan keovalan diameter silinder mesin",
        "difficulty": "EASY"
      },
      {
        "label": "Pemeriksaan & Penyetelan Celah Katup Mesin (Valve Clearance)",
        "prompt": "Buatkan soal Otomotif SMK tentang posisi top kompresi silinder 1, penggunaan fuller gauge, dan dampak celah katup terlalu rapat/renggang",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Pelumasan Mesin: Viskositas SAE, Pompa, & Filter Oli",
        "prompt": "Buatkan soal Otomotif SMK tentang kode SAE oli mesin, relief valve sirkulasi oli, fungsi saringan oli, dan interval penggantian berkala",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Pendingin Mesin: Radiator, Thermostat, & Water Pump",
        "prompt": "Buatkan soal Otomotif SMK tentang sirkulasi coolant pendingin, temperatur kerja pembukaan thermostat, radiator cap valve, dan overheat mesin",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Bahan Bakar Injeksi (EFI): Sensor & OBD-II Scanner",
        "prompt": "Buatkan soal Otomotif SMK tentang fungsi sensor MAP/MAF, TPS, ECT, CKP, kerja injektor bahan bakar, dan pembacaan kode DTC scanner OBD-II",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Pengapian Elektronik: Koil Pengapian, Busi, & Timing",
        "prompt": "Buatkan soal Otomotif SMK tentang loncatan bunga api busi, celah elektroda busi, ignition coil induksi tegangan tinggi, dan sudut pengapian",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Pengisian (Alternator) & Pengujian Aki Baterai",
        "prompt": "Buatkan soal Otomotif SMK tentang fungsi regulator rectifier tegangan, pengujian berat jenis elektrolit aki dengan hydrometer, dan drop voltage",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Rem Hidrolik: Rem Cakram, Tromol, & Bleeding Rem",
        "prompt": "Buatkan soal Otomotif SMK tentang master silinder hidrolik rem, piston kaliper, pengereman tromol self-energizing, dan membuang angin palsu",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Transmisi Manual: Sinkronmes & Kopling (Clutch)",
        "prompt": "Buatkan soal Otomotif SMK tentang mekanisme pegas diafragma kopling, release bearing, perpindahan gigi sinkronmes, dan rasio roda gigi",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Kemudi, Suspensi, & Wheel Alignment (Spooring)",
        "prompt": "Buatkan soal Otomotif SMK tentang sudut camber, caster, toe-in/toe-out, kingpin inclination, dan perawatan shock absorber suspensi",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Prinsip Kerja Mesin 4 Langkah (4-Stroke) Bensin & Diesel",
        "prompt": "Buatkan soal Otomotif SMK tentang langkah hisap, kompresi, usaha/kerja, dan buang pada siklus motor bakar serta perbedaan rasio kompresi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Prosedur K3 Bengkel Otomotif & Penggunaan APD Wajib",
        "prompt": "Buatkan soal Otomotif SMK tentang sepatu safety, kacamata pelindung, penanganan tumpahan oli pelumas, dan bahaya gas karbon monoksida",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penggunaan Alat Ukur Presisi: Vernier Caliper & Dial Gauge",
        "prompt": "Buatkan soal Otomotif SMK tentang mengukur ketebalan kanvas rem, keolengan piringan cakram (run-out), dan keovalan diameter silinder mesin",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pemeriksaan & Penyetelan Celah Katup Mesin (Valve Clearance)",
        "prompt": "Buatkan soal Otomotif SMK tentang posisi top kompresi silinder 1, penggunaan fuller gauge, dan dampak celah katup terlalu rapat/renggang",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Pelumasan Mesin: Viskositas SAE, Pompa, & Filter Oli",
        "prompt": "Buatkan soal Otomotif SMK tentang kode SAE oli mesin, relief valve sirkulasi oli, fungsi saringan oli, dan interval penggantian berkala",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Pendingin Mesin: Radiator, Thermostat, & Water Pump",
        "prompt": "Buatkan soal Otomotif SMK tentang sirkulasi coolant pendingin, temperatur kerja pembukaan thermostat, radiator cap valve, dan overheat mesin",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Bahan Bakar Injeksi (EFI): Sensor & OBD-II Scanner",
        "prompt": "Buatkan soal Otomotif SMK tentang fungsi sensor MAP/MAF, TPS, ECT, CKP, kerja injektor bahan bakar, dan pembacaan kode DTC scanner OBD-II",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Pengapian Elektronik: Koil Pengapian, Busi, & Timing",
        "prompt": "Buatkan soal Otomotif SMK tentang loncatan bunga api busi, celah elektroda busi, ignition coil induksi tegangan tinggi, dan sudut pengapian",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Pengisian (Alternator) & Pengujian Aki Baterai",
        "prompt": "Buatkan soal Otomotif SMK tentang fungsi regulator rectifier tegangan, pengujian berat jenis elektrolit aki dengan hydrometer, dan drop voltage",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Rem Hidrolik: Rem Cakram, Tromol, & Bleeding Rem",
        "prompt": "Buatkan soal Otomotif SMK tentang master silinder hidrolik rem, piston kaliper, pengereman tromol self-energizing, dan membuang angin palsu",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Transmisi Manual: Sinkronmes & Kopling (Clutch)",
        "prompt": "Buatkan soal Otomotif SMK tentang mekanisme pegas diafragma kopling, release bearing, perpindahan gigi sinkronmes, dan rasio roda gigi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Kemudi, Suspensi, & Wheel Alignment (Spooring)",
        "prompt": "Buatkan soal Otomotif SMK tentang sudut camber, caster, toe-in/toe-out, kingpin inclination, dan perawatan shock absorber suspensi",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Prinsip Kerja Mesin 4 Langkah (4-Stroke) Bensin & Diesel",
        "prompt": "Buatkan soal Otomotif SMK tentang langkah hisap, kompresi, usaha/kerja, dan buang pada siklus motor bakar serta perbedaan rasio kompresi",
        "difficulty": "HARD"
      },
      {
        "label": "Prosedur K3 Bengkel Otomotif & Penggunaan APD Wajib",
        "prompt": "Buatkan soal Otomotif SMK tentang sepatu safety, kacamata pelindung, penanganan tumpahan oli pelumas, dan bahaya gas karbon monoksida",
        "difficulty": "HARD"
      },
      {
        "label": "Penggunaan Alat Ukur Presisi: Vernier Caliper & Dial Gauge",
        "prompt": "Buatkan soal Otomotif SMK tentang mengukur ketebalan kanvas rem, keolengan piringan cakram (run-out), dan keovalan diameter silinder mesin",
        "difficulty": "HARD"
      },
      {
        "label": "Pemeriksaan & Penyetelan Celah Katup Mesin (Valve Clearance)",
        "prompt": "Buatkan soal Otomotif SMK tentang posisi top kompresi silinder 1, penggunaan fuller gauge, dan dampak celah katup terlalu rapat/renggang",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Pelumasan Mesin: Viskositas SAE, Pompa, & Filter Oli",
        "prompt": "Buatkan soal Otomotif SMK tentang kode SAE oli mesin, relief valve sirkulasi oli, fungsi saringan oli, dan interval penggantian berkala",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Pendingin Mesin: Radiator, Thermostat, & Water Pump",
        "prompt": "Buatkan soal Otomotif SMK tentang sirkulasi coolant pendingin, temperatur kerja pembukaan thermostat, radiator cap valve, dan overheat mesin",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Bahan Bakar Injeksi (EFI): Sensor & OBD-II Scanner",
        "prompt": "Buatkan soal Otomotif SMK tentang fungsi sensor MAP/MAF, TPS, ECT, CKP, kerja injektor bahan bakar, dan pembacaan kode DTC scanner OBD-II",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Pengapian Elektronik: Koil Pengapian, Busi, & Timing",
        "prompt": "Buatkan soal Otomotif SMK tentang loncatan bunga api busi, celah elektroda busi, ignition coil induksi tegangan tinggi, dan sudut pengapian",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Pengisian (Alternator) & Pengujian Aki Baterai",
        "prompt": "Buatkan soal Otomotif SMK tentang fungsi regulator rectifier tegangan, pengujian berat jenis elektrolit aki dengan hydrometer, dan drop voltage",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Rem Hidrolik: Rem Cakram, Tromol, & Bleeding Rem",
        "prompt": "Buatkan soal Otomotif SMK tentang master silinder hidrolik rem, piston kaliper, pengereman tromol self-energizing, dan membuang angin palsu",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Transmisi Manual: Sinkronmes & Kopling (Clutch)",
        "prompt": "Buatkan soal Otomotif SMK tentang mekanisme pegas diafragma kopling, release bearing, perpindahan gigi sinkronmes, dan rasio roda gigi",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Kemudi, Suspensi, & Wheel Alignment (Spooring)",
        "prompt": "Buatkan soal Otomotif SMK tentang sudut camber, caster, toe-in/toe-out, kingpin inclination, dan perawatan shock absorber suspensi",
        "difficulty": "HARD"
      }
    ]
  },
  "kuliner": {
    "EASY": [
      {
        "label": "Sanitasi & Higiene Dapur Komersial Standar HACCP",
        "prompt": "Buatkan soal Kuliner/Tata Boga SMK tentang pencegahan kontaminasi silang, zona bahaya suhu (danger zone 5-60°C), dan prinsip HACCP",
        "difficulty": "EASY"
      },
      {
        "label": "Teknik Dasar Memasak: Moist Heat & Dry Heat Cooking",
        "prompt": "Buatkan soal Kuliner SMK tentang teknik blanching, simmering, poaching, roasting, baking, sauteing, dan braising bahan pangan",
        "difficulty": "EASY"
      },
      {
        "label": "Ragam Bumbu Dasar Tradisional Nusantara & Rempah",
        "prompt": "Buatkan soal Kuliner SMK tentang komposisi bumbu dasar putih, merah, kuning, oranye, dan perpaduannya pada masakan khas daerah",
        "difficulty": "EASY"
      },
      {
        "label": "Manajemen Penyimpanan Bahan Segar & Sistem FIFO/LIFO",
        "prompt": "Buatkan soal Kuliner SMK tentang pengaturan suhu chiller/freezer, penyimpanan daging mentah vs sayur matang, dan rotasi First-In First-Out",
        "difficulty": "EASY"
      },
      {
        "label": "Pastry & Bakery: Fermentasi Ragi Roti, Gluten, & Pastry",
        "prompt": "Buatkan soal Kuliner SMK tentang peran gluten tepung terigu protein tinggi, suhu proofing adonan roti, dan teknik laminasi mentega pastry",
        "difficulty": "EASY"
      },
      {
        "label": "Food Costing & Perhitungan Harga Jual Menu Porsi",
        "prompt": "Buatkan soal Kuliner SMK tentang menghitung standar resep, persentase food cost 30-35%, biaya overhead dapur, dan margin keuntungan hidangan",
        "difficulty": "EASY"
      },
      {
        "label": "Teknik Plating Modern: Keseimbangan Warna & Harmoni",
        "prompt": "Buatkan soal Kuliner SMK tentang komposisi main item, karbohidrat side dish, sayuran, saus pendamping, dan pemilihan garnish edible",
        "difficulty": "EASY"
      },
      {
        "label": "Pengolahan Daging: Potongan Daging Sapi & Kematangan Steak",
        "prompt": "Buatkan soal Kuliner SMK tentang potongan tenderloin, sirloin, ribeye, pengujian kematangan steak (rare s.d. well-done), dan resting daging",
        "difficulty": "EASY"
      },
      {
        "label": "Teknik Pemotongan Unggas (8-10 Bagian) & Fillet Ikan",
        "prompt": "Buatkan soal Kuliner SMK tentang sanitasi penanganan ayam mentah bebas salmonella, teknik boning pisau fillet, dan descaling sisik ikan",
        "difficulty": "EASY"
      },
      {
        "label": "Table Manner & Pelayanan Restoran (Food & Beverage)",
        "prompt": "Buatkan soal Kuliner SMK tentang penataan sendok-garpu meja makan banquet, urutan appetizer s.d. dessert, dan etika pelayanan tamu",
        "difficulty": "EASY"
      },
      {
        "label": "Teknik Seduh Kopi Manual Brew & Ekstraksi Espresso",
        "prompt": "Buatkan soal Kuliner SMK tentang ukuran gilingan kopi (grind size), rasio air-kopi, suhu air 90-96°C, dan crema ekstraksi mesin espresso",
        "difficulty": "EASY"
      },
      {
        "label": "K3 Dapur Komersial: Tumpahan Minyak & APAR Dapur",
        "prompt": "Buatkan soal Kuliner SMK tentang penanganan kebakaran minyak panas kelas K (wet chemical), ventilasi cooker hood, dan P3K luka bakar",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Sanitasi & Higiene Dapur Komersial Standar HACCP",
        "prompt": "Buatkan soal Kuliner/Tata Boga SMK tentang pencegahan kontaminasi silang, zona bahaya suhu (danger zone 5-60°C), dan prinsip HACCP",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teknik Dasar Memasak: Moist Heat & Dry Heat Cooking",
        "prompt": "Buatkan soal Kuliner SMK tentang teknik blanching, simmering, poaching, roasting, baking, sauteing, dan braising bahan pangan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Ragam Bumbu Dasar Tradisional Nusantara & Rempah",
        "prompt": "Buatkan soal Kuliner SMK tentang komposisi bumbu dasar putih, merah, kuning, oranye, dan perpaduannya pada masakan khas daerah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Manajemen Penyimpanan Bahan Segar & Sistem FIFO/LIFO",
        "prompt": "Buatkan soal Kuliner SMK tentang pengaturan suhu chiller/freezer, penyimpanan daging mentah vs sayur matang, dan rotasi First-In First-Out",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pastry & Bakery: Fermentasi Ragi Roti, Gluten, & Pastry",
        "prompt": "Buatkan soal Kuliner SMK tentang peran gluten tepung terigu protein tinggi, suhu proofing adonan roti, dan teknik laminasi mentega pastry",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Food Costing & Perhitungan Harga Jual Menu Porsi",
        "prompt": "Buatkan soal Kuliner SMK tentang menghitung standar resep, persentase food cost 30-35%, biaya overhead dapur, dan margin keuntungan hidangan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teknik Plating Modern: Keseimbangan Warna & Harmoni",
        "prompt": "Buatkan soal Kuliner SMK tentang komposisi main item, karbohidrat side dish, sayuran, saus pendamping, dan pemilihan garnish edible",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pengolahan Daging: Potongan Daging Sapi & Kematangan Steak",
        "prompt": "Buatkan soal Kuliner SMK tentang potongan tenderloin, sirloin, ribeye, pengujian kematangan steak (rare s.d. well-done), dan resting daging",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teknik Pemotongan Unggas (8-10 Bagian) & Fillet Ikan",
        "prompt": "Buatkan soal Kuliner SMK tentang sanitasi penanganan ayam mentah bebas salmonella, teknik boning pisau fillet, dan descaling sisik ikan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Table Manner & Pelayanan Restoran (Food & Beverage)",
        "prompt": "Buatkan soal Kuliner SMK tentang penataan sendok-garpu meja makan banquet, urutan appetizer s.d. dessert, dan etika pelayanan tamu",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teknik Seduh Kopi Manual Brew & Ekstraksi Espresso",
        "prompt": "Buatkan soal Kuliner SMK tentang ukuran gilingan kopi (grind size), rasio air-kopi, suhu air 90-96°C, dan crema ekstraksi mesin espresso",
        "difficulty": "MEDIUM"
      },
      {
        "label": "K3 Dapur Komersial: Tumpahan Minyak & APAR Dapur",
        "prompt": "Buatkan soal Kuliner SMK tentang penanganan kebakaran minyak panas kelas K (wet chemical), ventilasi cooker hood, dan P3K luka bakar",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Sanitasi & Higiene Dapur Komersial Standar HACCP",
        "prompt": "Buatkan soal Kuliner/Tata Boga SMK tentang pencegahan kontaminasi silang, zona bahaya suhu (danger zone 5-60°C), dan prinsip HACCP",
        "difficulty": "HARD"
      },
      {
        "label": "Teknik Dasar Memasak: Moist Heat & Dry Heat Cooking",
        "prompt": "Buatkan soal Kuliner SMK tentang teknik blanching, simmering, poaching, roasting, baking, sauteing, dan braising bahan pangan",
        "difficulty": "HARD"
      },
      {
        "label": "Ragam Bumbu Dasar Tradisional Nusantara & Rempah",
        "prompt": "Buatkan soal Kuliner SMK tentang komposisi bumbu dasar putih, merah, kuning, oranye, dan perpaduannya pada masakan khas daerah",
        "difficulty": "HARD"
      },
      {
        "label": "Manajemen Penyimpanan Bahan Segar & Sistem FIFO/LIFO",
        "prompt": "Buatkan soal Kuliner SMK tentang pengaturan suhu chiller/freezer, penyimpanan daging mentah vs sayur matang, dan rotasi First-In First-Out",
        "difficulty": "HARD"
      },
      {
        "label": "Pastry & Bakery: Fermentasi Ragi Roti, Gluten, & Pastry",
        "prompt": "Buatkan soal Kuliner SMK tentang peran gluten tepung terigu protein tinggi, suhu proofing adonan roti, dan teknik laminasi mentega pastry",
        "difficulty": "HARD"
      },
      {
        "label": "Food Costing & Perhitungan Harga Jual Menu Porsi",
        "prompt": "Buatkan soal Kuliner SMK tentang menghitung standar resep, persentase food cost 30-35%, biaya overhead dapur, dan margin keuntungan hidangan",
        "difficulty": "HARD"
      },
      {
        "label": "Teknik Plating Modern: Keseimbangan Warna & Harmoni",
        "prompt": "Buatkan soal Kuliner SMK tentang komposisi main item, karbohidrat side dish, sayuran, saus pendamping, dan pemilihan garnish edible",
        "difficulty": "HARD"
      },
      {
        "label": "Pengolahan Daging: Potongan Daging Sapi & Kematangan Steak",
        "prompt": "Buatkan soal Kuliner SMK tentang potongan tenderloin, sirloin, ribeye, pengujian kematangan steak (rare s.d. well-done), dan resting daging",
        "difficulty": "HARD"
      },
      {
        "label": "Teknik Pemotongan Unggas (8-10 Bagian) & Fillet Ikan",
        "prompt": "Buatkan soal Kuliner SMK tentang sanitasi penanganan ayam mentah bebas salmonella, teknik boning pisau fillet, dan descaling sisik ikan",
        "difficulty": "HARD"
      },
      {
        "label": "Table Manner & Pelayanan Restoran (Food & Beverage)",
        "prompt": "Buatkan soal Kuliner SMK tentang penataan sendok-garpu meja makan banquet, urutan appetizer s.d. dessert, dan etika pelayanan tamu",
        "difficulty": "HARD"
      },
      {
        "label": "Teknik Seduh Kopi Manual Brew & Ekstraksi Espresso",
        "prompt": "Buatkan soal Kuliner SMK tentang ukuran gilingan kopi (grind size), rasio air-kopi, suhu air 90-96°C, dan crema ekstraksi mesin espresso",
        "difficulty": "HARD"
      },
      {
        "label": "K3 Dapur Komersial: Tumpahan Minyak & APAR Dapur",
        "prompt": "Buatkan soal Kuliner SMK tentang penanganan kebakaran minyak panas kelas K (wet chemical), ventilasi cooker hood, dan P3K luka bakar",
        "difficulty": "HARD"
      }
    ]
  },
  "dkv": {
    "EASY": [
      {
        "label": "Prinsip Desain Grafis: Kontras, Hierarki, & Keseimbangan",
        "prompt": "Buatkan soal DKV SMK tentang penerapan kontras warna/ukuran, hierarki keterbacaan pesan utama, dan keseimbangan asimetris visual",
        "difficulty": "EASY"
      },
      {
        "label": "Tipografi Profesional: Klasifikasi Font Serif & Kerning",
        "prompt": "Buatkan soal DKV SMK tentang anatomi huruf (ascender, descender, baseline), leading, kerning, tracking, dan pemilihan font sesuai pesan",
        "difficulty": "EASY"
      },
      {
        "label": "Teori Warna & Manajemen Warna: RGB vs CMYK Cetak",
        "prompt": "Buatkan soal DKV SMK tentang lingkaran warna harmoni komplementer, analog, triadik, profil warna cetak 300 DPI, dan warna monitor RGB",
        "difficulty": "EASY"
      },
      {
        "label": "Grafis Vektor vs Bitmap & Format File Digital",
        "prompt": "Buatkan soal DKV SMK tentang perbedaan gambar berbasis garis matematis kurva bezier vs matriks piksel resolusi cetak",
        "difficulty": "EASY"
      },
      {
        "label": "Fotografi Studio: Segitiga Exposure (ISO, Shutter, Aperture)",
        "prompt": "Buatkan soal DKV SMK tentang efek kedalaman ruang (depth of field) diafragma lebar, membekukan gerakan cepat, dan noise sensor ISO tinggi",
        "difficulty": "EASY"
      },
      {
        "label": "12 Prinsip Animasi Klasik: Squash & Stretch, Timing",
        "prompt": "Buatkan soal DKV SMK tentang prinsip kelenturan objek animasi, gerakan ancang-ancang sebelum aksi, dan interval frame rate per detik",
        "difficulty": "EASY"
      },
      {
        "label": "Branding & Identitas Visual: Desain Logo & Brand Guidelines",
        "prompt": "Buatkan soal DKV SMK tentang jenis logo monogram, pictorial mark, abstrak, penerapan palet warna resmi, dan aturan clear space logo",
        "difficulty": "EASY"
      },
      {
        "label": "Tata Letak Publikasi: Grid System, Bleed Area, & Margin",
        "prompt": "Buatkan soal DKV SMK tentang modular grid majalah/buku, bleed 3mm untuk pisau potong percetakan, dan penataan kolom teks koran",
        "difficulty": "EASY"
      },
      {
        "label": "Video Editing: Teknik Cutting, Audio Mixing, & Color Grading",
        "prompt": "Buatkan soal DKV SMK tentang transisi J-cut/L-cut, match cut, frame rate 24/30/60 fps, sinkronisasi audio track, dan kurva tone color grading",
        "difficulty": "EASY"
      },
      {
        "label": "Desain UI/UX: User Flow, Wireframing, & Figma Prototype",
        "prompt": "Buatkan soal DKV SMK tentang pemetaan perjalanan pengguna (user journey), rancangan low-fidelity wireframe, dan usability testing aplikasi",
        "difficulty": "EASY"
      },
      {
        "label": "Hak Cipta Karya Visual, Lisensi Royalty-Free, & Etika Desain",
        "prompt": "Buatkan soal DKV SMK tentang penggunaan aset Creative Commons, atribusi hak cipta pencipta asli, dan batasan modifikasi karya orang lain",
        "difficulty": "EASY"
      },
      {
        "label": "Desain Kemasan Produk (Packaging): Jaring-Jaring & Mockup",
        "prompt": "Buatkan soal DKV SMK tentang rancangan garis lipat/lem die-cut dus kemasan, barcode scanning, dan daya tarik visual kemasan produk retail",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Prinsip Desain Grafis: Kontras, Hierarki, & Keseimbangan",
        "prompt": "Buatkan soal DKV SMK tentang penerapan kontras warna/ukuran, hierarki keterbacaan pesan utama, dan keseimbangan asimetris visual",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Tipografi Profesional: Klasifikasi Font Serif & Kerning",
        "prompt": "Buatkan soal DKV SMK tentang anatomi huruf (ascender, descender, baseline), leading, kerning, tracking, dan pemilihan font sesuai pesan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Teori Warna & Manajemen Warna: RGB vs CMYK Cetak",
        "prompt": "Buatkan soal DKV SMK tentang lingkaran warna harmoni komplementer, analog, triadik, profil warna cetak 300 DPI, dan warna monitor RGB",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Grafis Vektor vs Bitmap & Format File Digital",
        "prompt": "Buatkan soal DKV SMK tentang perbedaan gambar berbasis garis matematis kurva bezier vs matriks piksel resolusi cetak",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Fotografi Studio: Segitiga Exposure (ISO, Shutter, Aperture)",
        "prompt": "Buatkan soal DKV SMK tentang efek kedalaman ruang (depth of field) diafragma lebar, membekukan gerakan cepat, dan noise sensor ISO tinggi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "12 Prinsip Animasi Klasik: Squash & Stretch, Timing",
        "prompt": "Buatkan soal DKV SMK tentang prinsip kelenturan objek animasi, gerakan ancang-ancang sebelum aksi, dan interval frame rate per detik",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Branding & Identitas Visual: Desain Logo & Brand Guidelines",
        "prompt": "Buatkan soal DKV SMK tentang jenis logo monogram, pictorial mark, abstrak, penerapan palet warna resmi, dan aturan clear space logo",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Tata Letak Publikasi: Grid System, Bleed Area, & Margin",
        "prompt": "Buatkan soal DKV SMK tentang modular grid majalah/buku, bleed 3mm untuk pisau potong percetakan, dan penataan kolom teks koran",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Video Editing: Teknik Cutting, Audio Mixing, & Color Grading",
        "prompt": "Buatkan soal DKV SMK tentang transisi J-cut/L-cut, match cut, frame rate 24/30/60 fps, sinkronisasi audio track, dan kurva tone color grading",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Desain UI/UX: User Flow, Wireframing, & Figma Prototype",
        "prompt": "Buatkan soal DKV SMK tentang pemetaan perjalanan pengguna (user journey), rancangan low-fidelity wireframe, dan usability testing aplikasi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Hak Cipta Karya Visual, Lisensi Royalty-Free, & Etika Desain",
        "prompt": "Buatkan soal DKV SMK tentang penggunaan aset Creative Commons, atribusi hak cipta pencipta asli, dan batasan modifikasi karya orang lain",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Desain Kemasan Produk (Packaging): Jaring-Jaring & Mockup",
        "prompt": "Buatkan soal DKV SMK tentang rancangan garis lipat/lem die-cut dus kemasan, barcode scanning, dan daya tarik visual kemasan produk retail",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Prinsip Desain Grafis: Kontras, Hierarki, & Keseimbangan",
        "prompt": "Buatkan soal DKV SMK tentang penerapan kontras warna/ukuran, hierarki keterbacaan pesan utama, dan keseimbangan asimetris visual",
        "difficulty": "HARD"
      },
      {
        "label": "Tipografi Profesional: Klasifikasi Font Serif & Kerning",
        "prompt": "Buatkan soal DKV SMK tentang anatomi huruf (ascender, descender, baseline), leading, kerning, tracking, dan pemilihan font sesuai pesan",
        "difficulty": "HARD"
      },
      {
        "label": "Teori Warna & Manajemen Warna: RGB vs CMYK Cetak",
        "prompt": "Buatkan soal DKV SMK tentang lingkaran warna harmoni komplementer, analog, triadik, profil warna cetak 300 DPI, dan warna monitor RGB",
        "difficulty": "HARD"
      },
      {
        "label": "Grafis Vektor vs Bitmap & Format File Digital",
        "prompt": "Buatkan soal DKV SMK tentang perbedaan gambar berbasis garis matematis kurva bezier vs matriks piksel resolusi cetak",
        "difficulty": "HARD"
      },
      {
        "label": "Fotografi Studio: Segitiga Exposure (ISO, Shutter, Aperture)",
        "prompt": "Buatkan soal DKV SMK tentang efek kedalaman ruang (depth of field) diafragma lebar, membekukan gerakan cepat, dan noise sensor ISO tinggi",
        "difficulty": "HARD"
      },
      {
        "label": "12 Prinsip Animasi Klasik: Squash & Stretch, Timing",
        "prompt": "Buatkan soal DKV SMK tentang prinsip kelenturan objek animasi, gerakan ancang-ancang sebelum aksi, dan interval frame rate per detik",
        "difficulty": "HARD"
      },
      {
        "label": "Branding & Identitas Visual: Desain Logo & Brand Guidelines",
        "prompt": "Buatkan soal DKV SMK tentang jenis logo monogram, pictorial mark, abstrak, penerapan palet warna resmi, dan aturan clear space logo",
        "difficulty": "HARD"
      },
      {
        "label": "Tata Letak Publikasi: Grid System, Bleed Area, & Margin",
        "prompt": "Buatkan soal DKV SMK tentang modular grid majalah/buku, bleed 3mm untuk pisau potong percetakan, dan penataan kolom teks koran",
        "difficulty": "HARD"
      },
      {
        "label": "Video Editing: Teknik Cutting, Audio Mixing, & Color Grading",
        "prompt": "Buatkan soal DKV SMK tentang transisi J-cut/L-cut, match cut, frame rate 24/30/60 fps, sinkronisasi audio track, dan kurva tone color grading",
        "difficulty": "HARD"
      },
      {
        "label": "Desain UI/UX: User Flow, Wireframing, & Figma Prototype",
        "prompt": "Buatkan soal DKV SMK tentang pemetaan perjalanan pengguna (user journey), rancangan low-fidelity wireframe, dan usability testing aplikasi",
        "difficulty": "HARD"
      },
      {
        "label": "Hak Cipta Karya Visual, Lisensi Royalty-Free, & Etika Desain",
        "prompt": "Buatkan soal DKV SMK tentang penggunaan aset Creative Commons, atribusi hak cipta pencipta asli, dan batasan modifikasi karya orang lain",
        "difficulty": "HARD"
      },
      {
        "label": "Desain Kemasan Produk (Packaging): Jaring-Jaring & Mockup",
        "prompt": "Buatkan soal DKV SMK tentang rancangan garis lipat/lem die-cut dus kemasan, barcode scanning, dan daya tarik visual kemasan produk retail",
        "difficulty": "HARD"
      }
    ]
  },
  "pancasila": {
    "EASY": [
      {
        "label": "Etos Kerja & Integritas Profesional Berlandaskan Pancasila",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang penerapan nilai kejujuran, disiplin kerja bengkel/kantor, dan tanggung jawab profesi kejuruan",
        "difficulty": "EASY"
      },
      {
        "label": "Budaya K3 & Hak Tenaga Kerja Menurut Hukum RI",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang hak keselamatan kerja, jaminan BPJS Ketenagakerjaan, dan perlindungan hukum buruh",
        "difficulty": "EASY"
      },
      {
        "label": "Sikap Toleransi & Kolaborasi Tim Kerja Multikultural",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang kerjasama lintas suku, agama, dan budaya di lingkungan tempat kerja dan industri",
        "difficulty": "EASY"
      },
      {
        "label": "Peran SMK dalam Kemandirian Ekonomi & Industri Nasional",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang pemanfaatan potensi lokal nusantara, bangga produk dalam negeri, dan kemandirian vokasi",
        "difficulty": "EASY"
      },
      {
        "label": "Kepatuhan Hukum Terhadap SOP Perusahaan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang keterkaitan norma hukum nasional dengan ketaatan SOP perusahaan dan etika kerja",
        "difficulty": "EASY"
      },
      {
        "label": "Wawasan Kebangsaan Melalui Prestasi Keahlian Kejuruan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang kontribusi tenaga terampil lulusan kejuruan dalam memajukan kedaulatan industri nasional",
        "difficulty": "EASY"
      },
      {
        "label": "Hak Kekayaan Intelektual (HAKI) Inovasi Produk Siswa",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang perlindungan karya cipta inovasi produk siswa kejuruan dan etika anti-pembajakan",
        "difficulty": "EASY"
      },
      {
        "label": "Pemberantasan Budaya Suap & Gratifikasi di Dunia Usaha",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang integritas pengadaan barang (procurement), menolak suap, dan transparansi keuangan bisnis",
        "difficulty": "EASY"
      },
      {
        "label": "Kepedulian Lingkungan Industri Berkelanjutan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang tanggung jawab etis perusahaan mencegah pencemaran limbah dan merawat kelestarian alam",
        "difficulty": "EASY"
      },
      {
        "label": "Etika Digital & Kerahasiaan Data Perusahaan (NDA)",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang menjaga rahasia dagang, keamanan data pelanggan, dan etika bermedia sosial karyawan",
        "difficulty": "EASY"
      },
      {
        "label": "Musyawarah Mufakat dalam Perselisihan Hubungan Kerja",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang mediasi bipartit, dialog serikat pekerja dengan manajemen secara damai dan berkeadilan",
        "difficulty": "EASY"
      },
      {
        "label": "Penguatan Karakter Pelajar Pancasila Vokasi Industri",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang 6 dimensi profil pelajar pancasila yang diterapkan dalam etos kerja bengkel dan industri",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Etos Kerja & Integritas Profesional Berlandaskan Pancasila",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang penerapan nilai kejujuran, disiplin kerja bengkel/kantor, dan tanggung jawab profesi kejuruan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Budaya K3 & Hak Tenaga Kerja Menurut Hukum RI",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang hak keselamatan kerja, jaminan BPJS Ketenagakerjaan, dan perlindungan hukum buruh",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sikap Toleransi & Kolaborasi Tim Kerja Multikultural",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang kerjasama lintas suku, agama, dan budaya di lingkungan tempat kerja dan industri",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Peran SMK dalam Kemandirian Ekonomi & Industri Nasional",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang pemanfaatan potensi lokal nusantara, bangga produk dalam negeri, dan kemandirian vokasi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kepatuhan Hukum Terhadap SOP Perusahaan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang keterkaitan norma hukum nasional dengan ketaatan SOP perusahaan dan etika kerja",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Wawasan Kebangsaan Melalui Prestasi Keahlian Kejuruan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang kontribusi tenaga terampil lulusan kejuruan dalam memajukan kedaulatan industri nasional",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Hak Kekayaan Intelektual (HAKI) Inovasi Produk Siswa",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang perlindungan karya cipta inovasi produk siswa kejuruan dan etika anti-pembajakan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pemberantasan Budaya Suap & Gratifikasi di Dunia Usaha",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang integritas pengadaan barang (procurement), menolak suap, dan transparansi keuangan bisnis",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kepedulian Lingkungan Industri Berkelanjutan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang tanggung jawab etis perusahaan mencegah pencemaran limbah dan merawat kelestarian alam",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Etika Digital & Kerahasiaan Data Perusahaan (NDA)",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang menjaga rahasia dagang, keamanan data pelanggan, dan etika bermedia sosial karyawan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Musyawarah Mufakat dalam Perselisihan Hubungan Kerja",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang mediasi bipartit, dialog serikat pekerja dengan manajemen secara damai dan berkeadilan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penguatan Karakter Pelajar Pancasila Vokasi Industri",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang 6 dimensi profil pelajar pancasila yang diterapkan dalam etos kerja bengkel dan industri",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Etos Kerja & Integritas Profesional Berlandaskan Pancasila",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang penerapan nilai kejujuran, disiplin kerja bengkel/kantor, dan tanggung jawab profesi kejuruan",
        "difficulty": "HARD"
      },
      {
        "label": "Budaya K3 & Hak Tenaga Kerja Menurut Hukum RI",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang hak keselamatan kerja, jaminan BPJS Ketenagakerjaan, dan perlindungan hukum buruh",
        "difficulty": "HARD"
      },
      {
        "label": "Sikap Toleransi & Kolaborasi Tim Kerja Multikultural",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang kerjasama lintas suku, agama, dan budaya di lingkungan tempat kerja dan industri",
        "difficulty": "HARD"
      },
      {
        "label": "Peran SMK dalam Kemandirian Ekonomi & Industri Nasional",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang pemanfaatan potensi lokal nusantara, bangga produk dalam negeri, dan kemandirian vokasi",
        "difficulty": "HARD"
      },
      {
        "label": "Kepatuhan Hukum Terhadap SOP Perusahaan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang keterkaitan norma hukum nasional dengan ketaatan SOP perusahaan dan etika kerja",
        "difficulty": "HARD"
      },
      {
        "label": "Wawasan Kebangsaan Melalui Prestasi Keahlian Kejuruan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang kontribusi tenaga terampil lulusan kejuruan dalam memajukan kedaulatan industri nasional",
        "difficulty": "HARD"
      },
      {
        "label": "Hak Kekayaan Intelektual (HAKI) Inovasi Produk Siswa",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang perlindungan karya cipta inovasi produk siswa kejuruan dan etika anti-pembajakan",
        "difficulty": "HARD"
      },
      {
        "label": "Pemberantasan Budaya Suap & Gratifikasi di Dunia Usaha",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang integritas pengadaan barang (procurement), menolak suap, dan transparansi keuangan bisnis",
        "difficulty": "HARD"
      },
      {
        "label": "Kepedulian Lingkungan Industri Berkelanjutan",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang tanggung jawab etis perusahaan mencegah pencemaran limbah dan merawat kelestarian alam",
        "difficulty": "HARD"
      },
      {
        "label": "Etika Digital & Kerahasiaan Data Perusahaan (NDA)",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang menjaga rahasia dagang, keamanan data pelanggan, dan etika bermedia sosial karyawan",
        "difficulty": "HARD"
      },
      {
        "label": "Musyawarah Mufakat dalam Perselisihan Hubungan Kerja",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang mediasi bipartit, dialog serikat pekerja dengan manajemen secara damai dan berkeadilan",
        "difficulty": "HARD"
      },
      {
        "label": "Penguatan Karakter Pelajar Pancasila Vokasi Industri",
        "prompt": "Buatkan soal Pendidikan Pancasila SMK tentang 6 dimensi profil pelajar pancasila yang diterapkan dalam etos kerja bengkel dan industri",
        "difficulty": "HARD"
      }
    ]
  }
};

export const DEFAULT_JENJANG_TOPICS: Record<JenjangType, SubjectDifficultyMap> = {
  "SD": {
    "EASY": [
      {
        "label": "Bagian Tubuh Tumbuhan & Fungsinya",
        "prompt": "Buatkan soal IPAS SD tentang fungsi akar, batang, daun, bunga, buah, dan biji pada tumbuhan",
        "difficulty": "EASY"
      },
      {
        "label": "Daur Hidup Hewan & Metamorfosis",
        "prompt": "Buatkan soal IPAS SD tentang metamorfosis sempurna (kupu-kupu, katak) dan tidak sempurna (belalang, kecoa)",
        "difficulty": "EASY"
      },
      {
        "label": "Rantai Makanan Ekosistem Sawah & Hutan",
        "prompt": "Buatkan soal IPAS SD tentang produsen, konsumen tingkat 1/2, pengurai, dan peran makhluk hidup",
        "difficulty": "EASY"
      },
      {
        "label": "Perubahan Wujud Benda (Mencair, Menguap)",
        "prompt": "Buatkan soal IPAS SD tentang sifat padat, cair, gas, serta peristiwa mencair, membeku, menguap, mengembun",
        "difficulty": "EASY"
      },
      {
        "label": "Sumber Energi & Perubahan Bentuk Energi",
        "prompt": "Buatkan soal IPAS SD tentang energi matahari, angin, air, listrik, dan perubahannya menjadi gerak/panas/cahaya",
        "difficulty": "EASY"
      },
      {
        "label": "Gaya Gesek, Magnet, & Gravitasi Bumi",
        "prompt": "Buatkan soal IPAS SD tentang pengaruh gaya dorong/tarik, sifat kutub magnet, dan jatuhnya benda karena gravitasi",
        "difficulty": "EASY"
      },
      {
        "label": "Siklus Air & Kelestarian Lingkungan Hidup",
        "prompt": "Buatkan soal IPAS SD tentang penguapan (evaporasi), pembentukan awan, hujan, dan cara menghemat air bersih",
        "difficulty": "EASY"
      },
      {
        "label": "Panca Indera Manusia & Cara Merawatnya",
        "prompt": "Buatkan soal IPAS SD tentang fungsi mata, telinga, hidung, lidah, kulit, serta cara menjaga kebersihannya",
        "difficulty": "EASY"
      },
      {
        "label": "Kenampakan Alam & Peta Lingkungan Rumah",
        "prompt": "Buatkan soal IPAS SD tentang gunung, sungai, dataran tinggi, pantai, dan membaca arah mata angin di denah",
        "difficulty": "EASY"
      },
      {
        "label": "Keragaman Budaya & Suku Bangsa Indonesia",
        "prompt": "Buatkan soal IPAS SD tentang rumah adat, pakaian adat, alat musik tradisional, dan semboyan Bhinneka Tunggal Ika",
        "difficulty": "EASY"
      },
      {
        "label": "Kegiatan Ekonomi: Produksi, Konsumsi, Distribusi",
        "prompt": "Buatkan soal IPAS SD tentang pekerjaan petani, nelayan, pedagang, dan perputaran barang kebutuhan sehari-hari",
        "difficulty": "EASY"
      },
      {
        "label": "Sejarah Pahlawan & Peninggalan Kerajaan",
        "prompt": "Buatkan soal IPAS SD tentang pahlawan nasional pembela tanah air dan candi/prasasti peninggalan bersejarah",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Bagian Tubuh Tumbuhan & Fungsinya",
        "prompt": "Buatkan soal IPAS SD tentang fungsi akar, batang, daun, bunga, buah, dan biji pada tumbuhan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Daur Hidup Hewan & Metamorfosis",
        "prompt": "Buatkan soal IPAS SD tentang metamorfosis sempurna (kupu-kupu, katak) dan tidak sempurna (belalang, kecoa)",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Rantai Makanan Ekosistem Sawah & Hutan",
        "prompt": "Buatkan soal IPAS SD tentang produsen, konsumen tingkat 1/2, pengurai, dan peran makhluk hidup",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Perubahan Wujud Benda (Mencair, Menguap)",
        "prompt": "Buatkan soal IPAS SD tentang sifat padat, cair, gas, serta peristiwa mencair, membeku, menguap, mengembun",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sumber Energi & Perubahan Bentuk Energi",
        "prompt": "Buatkan soal IPAS SD tentang energi matahari, angin, air, listrik, dan perubahannya menjadi gerak/panas/cahaya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Gaya Gesek, Magnet, & Gravitasi Bumi",
        "prompt": "Buatkan soal IPAS SD tentang pengaruh gaya dorong/tarik, sifat kutub magnet, dan jatuhnya benda karena gravitasi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Siklus Air & Kelestarian Lingkungan Hidup",
        "prompt": "Buatkan soal IPAS SD tentang penguapan (evaporasi), pembentukan awan, hujan, dan cara menghemat air bersih",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Panca Indera Manusia & Cara Merawatnya",
        "prompt": "Buatkan soal IPAS SD tentang fungsi mata, telinga, hidung, lidah, kulit, serta cara menjaga kebersihannya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kenampakan Alam & Peta Lingkungan Rumah",
        "prompt": "Buatkan soal IPAS SD tentang gunung, sungai, dataran tinggi, pantai, dan membaca arah mata angin di denah",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Keragaman Budaya & Suku Bangsa Indonesia",
        "prompt": "Buatkan soal IPAS SD tentang rumah adat, pakaian adat, alat musik tradisional, dan semboyan Bhinneka Tunggal Ika",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kegiatan Ekonomi: Produksi, Konsumsi, Distribusi",
        "prompt": "Buatkan soal IPAS SD tentang pekerjaan petani, nelayan, pedagang, dan perputaran barang kebutuhan sehari-hari",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sejarah Pahlawan & Peninggalan Kerajaan",
        "prompt": "Buatkan soal IPAS SD tentang pahlawan nasional pembela tanah air dan candi/prasasti peninggalan bersejarah",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Bagian Tubuh Tumbuhan & Fungsinya",
        "prompt": "Buatkan soal IPAS SD tentang fungsi akar, batang, daun, bunga, buah, dan biji pada tumbuhan",
        "difficulty": "HARD"
      },
      {
        "label": "Daur Hidup Hewan & Metamorfosis",
        "prompt": "Buatkan soal IPAS SD tentang metamorfosis sempurna (kupu-kupu, katak) dan tidak sempurna (belalang, kecoa)",
        "difficulty": "HARD"
      },
      {
        "label": "Rantai Makanan Ekosistem Sawah & Hutan",
        "prompt": "Buatkan soal IPAS SD tentang produsen, konsumen tingkat 1/2, pengurai, dan peran makhluk hidup",
        "difficulty": "HARD"
      },
      {
        "label": "Perubahan Wujud Benda (Mencair, Menguap)",
        "prompt": "Buatkan soal IPAS SD tentang sifat padat, cair, gas, serta peristiwa mencair, membeku, menguap, mengembun",
        "difficulty": "HARD"
      },
      {
        "label": "Sumber Energi & Perubahan Bentuk Energi",
        "prompt": "Buatkan soal IPAS SD tentang energi matahari, angin, air, listrik, dan perubahannya menjadi gerak/panas/cahaya",
        "difficulty": "HARD"
      },
      {
        "label": "Gaya Gesek, Magnet, & Gravitasi Bumi",
        "prompt": "Buatkan soal IPAS SD tentang pengaruh gaya dorong/tarik, sifat kutub magnet, dan jatuhnya benda karena gravitasi",
        "difficulty": "HARD"
      },
      {
        "label": "Siklus Air & Kelestarian Lingkungan Hidup",
        "prompt": "Buatkan soal IPAS SD tentang penguapan (evaporasi), pembentukan awan, hujan, dan cara menghemat air bersih",
        "difficulty": "HARD"
      },
      {
        "label": "Panca Indera Manusia & Cara Merawatnya",
        "prompt": "Buatkan soal IPAS SD tentang fungsi mata, telinga, hidung, lidah, kulit, serta cara menjaga kebersihannya",
        "difficulty": "HARD"
      },
      {
        "label": "Kenampakan Alam & Peta Lingkungan Rumah",
        "prompt": "Buatkan soal IPAS SD tentang gunung, sungai, dataran tinggi, pantai, dan membaca arah mata angin di denah",
        "difficulty": "HARD"
      },
      {
        "label": "Keragaman Budaya & Suku Bangsa Indonesia",
        "prompt": "Buatkan soal IPAS SD tentang rumah adat, pakaian adat, alat musik tradisional, dan semboyan Bhinneka Tunggal Ika",
        "difficulty": "HARD"
      },
      {
        "label": "Kegiatan Ekonomi: Produksi, Konsumsi, Distribusi",
        "prompt": "Buatkan soal IPAS SD tentang pekerjaan petani, nelayan, pedagang, dan perputaran barang kebutuhan sehari-hari",
        "difficulty": "HARD"
      },
      {
        "label": "Sejarah Pahlawan & Peninggalan Kerajaan",
        "prompt": "Buatkan soal IPAS SD tentang pahlawan nasional pembela tanah air dan candi/prasasti peninggalan bersejarah",
        "difficulty": "HARD"
      }
    ]
  },
  "SMP": {
    "EASY": [
      {
        "label": "Besaran, Satuan, & Pengukuran Jangka Sorong/Mikrometer",
        "prompt": "Buatkan soal IPA SMP tentang besaran pokok vs turunan, membaca skala jangka sorong, dan mikrometer sekrup",
        "difficulty": "EASY"
      },
      {
        "label": "Klasifikasi Makhluk Hidup & Kunci Determinasi",
        "prompt": "Buatkan soal IPA SMP tentang taksonomi 5 kingdom, ciri vertebrata/invertebrata, dan penggunaan kunci dikotom",
        "difficulty": "EASY"
      },
      {
        "label": "Organisasi Kehidupan: Sel, Jaringan, Organ, Sistem Organ",
        "prompt": "Buatkan soal IPA SMP tentang bagian mikroskop, struktur sel tumbuhan vs hewan, dan fungsi jaringan",
        "difficulty": "EASY"
      },
      {
        "label": "Gerak Lurus (GLB & GLBB) serta Hukum Newton",
        "prompt": "Buatkan soal IPA SMP tentang kecepatan, percepatan, grafik v-t, serta penerapan Hukum Newton I, II, dan III",
        "difficulty": "EASY"
      },
      {
        "label": "Usaha, Energi, & Pesawat Sederhana (Tuas, Katrol)",
        "prompt": "Buatkan soal IPA SMP tentang rumus W=F.s, energi potensial/kinetik, dan keuntungan mekanik tuas/bidang miring",
        "difficulty": "EASY"
      },
      {
        "label": "Tekanan Zat: Hidrostatis, Hukum Pascal, & Archimedes",
        "prompt": "Buatkan soal IPA SMP tentang bejana berhubungan, pompa hidrolik, dan gaya apung benda terapung/melayang/tenggelam",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Pencernaan & Uji Nutrisi Makanan Manusia",
        "prompt": "Buatkan soal IPA SMP tentang fungsi lambung, usus, enzim pencernaan, dan reagen uji amilum/glukosa/protein",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Peredaran Darah & Jantung Manusia",
        "prompt": "Buatkan soal IPA SMP tentang peredaran darah ganda, pembuluh arteri vs vena, golongan darah ABO, dan hipertensi",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Pernapasan & Mekanisme Pertukaran Gas",
        "prompt": "Buatkan soal IPA SMP tentang inspirasi-ekspirasi dada/perut, difusi di alveolus, dan gangguan asma/TBC",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Ekskresi: Ginjal, Kulit, Hati, & Paru-Paru",
        "prompt": "Buatkan soal IPA SMP tentang tahapan pembentukan urine (filtrasi, reabsorpsi, augmentasi) pada nefron ginjal",
        "difficulty": "EASY"
      },
      {
        "label": "Getaran, Gelombang, & Cepat Rambat Bunyi",
        "prompt": "Buatkan soal IPA SMP tentang periode, frekuensi, gelombang transversal/longitudinal, dan resonansi bunyi",
        "difficulty": "EASY"
      },
      {
        "label": "Cahaya, Optik, & Pembentukan Bayangan Cermin/Lensa",
        "prompt": "Buatkan soal IPA SMP tentang hukum pemantulan, cermin cekung/cembung, kekuatan lensa kacamata miopi",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Besaran, Satuan, & Pengukuran Jangka Sorong/Mikrometer",
        "prompt": "Buatkan soal IPA SMP tentang besaran pokok vs turunan, membaca skala jangka sorong, dan mikrometer sekrup",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Klasifikasi Makhluk Hidup & Kunci Determinasi",
        "prompt": "Buatkan soal IPA SMP tentang taksonomi 5 kingdom, ciri vertebrata/invertebrata, dan penggunaan kunci dikotom",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Organisasi Kehidupan: Sel, Jaringan, Organ, Sistem Organ",
        "prompt": "Buatkan soal IPA SMP tentang bagian mikroskop, struktur sel tumbuhan vs hewan, dan fungsi jaringan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Gerak Lurus (GLB & GLBB) serta Hukum Newton",
        "prompt": "Buatkan soal IPA SMP tentang kecepatan, percepatan, grafik v-t, serta penerapan Hukum Newton I, II, dan III",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Usaha, Energi, & Pesawat Sederhana (Tuas, Katrol)",
        "prompt": "Buatkan soal IPA SMP tentang rumus W=F.s, energi potensial/kinetik, dan keuntungan mekanik tuas/bidang miring",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Tekanan Zat: Hidrostatis, Hukum Pascal, & Archimedes",
        "prompt": "Buatkan soal IPA SMP tentang bejana berhubungan, pompa hidrolik, dan gaya apung benda terapung/melayang/tenggelam",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Pencernaan & Uji Nutrisi Makanan Manusia",
        "prompt": "Buatkan soal IPA SMP tentang fungsi lambung, usus, enzim pencernaan, dan reagen uji amilum/glukosa/protein",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Peredaran Darah & Jantung Manusia",
        "prompt": "Buatkan soal IPA SMP tentang peredaran darah ganda, pembuluh arteri vs vena, golongan darah ABO, dan hipertensi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Pernapasan & Mekanisme Pertukaran Gas",
        "prompt": "Buatkan soal IPA SMP tentang inspirasi-ekspirasi dada/perut, difusi di alveolus, dan gangguan asma/TBC",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Ekskresi: Ginjal, Kulit, Hati, & Paru-Paru",
        "prompt": "Buatkan soal IPA SMP tentang tahapan pembentukan urine (filtrasi, reabsorpsi, augmentasi) pada nefron ginjal",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Getaran, Gelombang, & Cepat Rambat Bunyi",
        "prompt": "Buatkan soal IPA SMP tentang periode, frekuensi, gelombang transversal/longitudinal, dan resonansi bunyi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Cahaya, Optik, & Pembentukan Bayangan Cermin/Lensa",
        "prompt": "Buatkan soal IPA SMP tentang hukum pemantulan, cermin cekung/cembung, kekuatan lensa kacamata miopi",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Besaran, Satuan, & Pengukuran Jangka Sorong/Mikrometer",
        "prompt": "Buatkan soal IPA SMP tentang besaran pokok vs turunan, membaca skala jangka sorong, dan mikrometer sekrup",
        "difficulty": "HARD"
      },
      {
        "label": "Klasifikasi Makhluk Hidup & Kunci Determinasi",
        "prompt": "Buatkan soal IPA SMP tentang taksonomi 5 kingdom, ciri vertebrata/invertebrata, dan penggunaan kunci dikotom",
        "difficulty": "HARD"
      },
      {
        "label": "Organisasi Kehidupan: Sel, Jaringan, Organ, Sistem Organ",
        "prompt": "Buatkan soal IPA SMP tentang bagian mikroskop, struktur sel tumbuhan vs hewan, dan fungsi jaringan",
        "difficulty": "HARD"
      },
      {
        "label": "Gerak Lurus (GLB & GLBB) serta Hukum Newton",
        "prompt": "Buatkan soal IPA SMP tentang kecepatan, percepatan, grafik v-t, serta penerapan Hukum Newton I, II, dan III",
        "difficulty": "HARD"
      },
      {
        "label": "Usaha, Energi, & Pesawat Sederhana (Tuas, Katrol)",
        "prompt": "Buatkan soal IPA SMP tentang rumus W=F.s, energi potensial/kinetik, dan keuntungan mekanik tuas/bidang miring",
        "difficulty": "HARD"
      },
      {
        "label": "Tekanan Zat: Hidrostatis, Hukum Pascal, & Archimedes",
        "prompt": "Buatkan soal IPA SMP tentang bejana berhubungan, pompa hidrolik, dan gaya apung benda terapung/melayang/tenggelam",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Pencernaan & Uji Nutrisi Makanan Manusia",
        "prompt": "Buatkan soal IPA SMP tentang fungsi lambung, usus, enzim pencernaan, dan reagen uji amilum/glukosa/protein",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Peredaran Darah & Jantung Manusia",
        "prompt": "Buatkan soal IPA SMP tentang peredaran darah ganda, pembuluh arteri vs vena, golongan darah ABO, dan hipertensi",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Pernapasan & Mekanisme Pertukaran Gas",
        "prompt": "Buatkan soal IPA SMP tentang inspirasi-ekspirasi dada/perut, difusi di alveolus, dan gangguan asma/TBC",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Ekskresi: Ginjal, Kulit, Hati, & Paru-Paru",
        "prompt": "Buatkan soal IPA SMP tentang tahapan pembentukan urine (filtrasi, reabsorpsi, augmentasi) pada nefron ginjal",
        "difficulty": "HARD"
      },
      {
        "label": "Getaran, Gelombang, & Cepat Rambat Bunyi",
        "prompt": "Buatkan soal IPA SMP tentang periode, frekuensi, gelombang transversal/longitudinal, dan resonansi bunyi",
        "difficulty": "HARD"
      },
      {
        "label": "Cahaya, Optik, & Pembentukan Bayangan Cermin/Lensa",
        "prompt": "Buatkan soal IPA SMP tentang hukum pemantulan, cermin cekung/cembung, kekuatan lensa kacamata miopi",
        "difficulty": "HARD"
      }
    ]
  },
  "SMA": {
    "EASY": [
      {
        "label": "Fungsi Komposisi & Fungsi Invers",
        "prompt": "Buatkan soal matematika SMA tentang aljabar fungsi, komposisi (f o g)(x), mencari invers fungsi f-1(x), dan daerah asal/hasil",
        "difficulty": "EASY"
      },
      {
        "label": "Sistem Persamaan Linear Tiga Variabel (SPLTV)",
        "prompt": "Buatkan soal matematika SMA tentang penyelesaian SPLTV dengan metode gabungan eliminasi-substitusi pada soal cerita",
        "difficulty": "EASY"
      },
      {
        "label": "Program Linear & Nilai Optimum Fungsi Objektif",
        "prompt": "Buatkan soal matematika SMA tentang daerah himpunan penyelesaian sistem pertidaksamaan linear dan titik pojok maksimum/minimum",
        "difficulty": "EASY"
      },
      {
        "label": "Matriks: Perkalian, Determinan, & Invers Matriks",
        "prompt": "Buatkan soal matematika SMA tentang operasi aljabar matriks 2x2 dan 3x3, determinan, matriks singular, dan persamaan AX=B",
        "difficulty": "EASY"
      },
      {
        "label": "Barisan & Deret: Aritmetika, Geometri, & Tak Hingga",
        "prompt": "Buatkan soal matematika SMA tentang suku ke-n, jumlah deret hingga dan tak hingga, serta aplikasi pertumbuhan/peluruhan",
        "difficulty": "EASY"
      },
      {
        "label": "Trigonometri: Identitas, Sudut Rangkap, & Grafik Sin/Cos",
        "prompt": "Buatkan soal matematika SMA tentang pembuktian rumus identitas trigonometri, sudut ganda sin 2A, dan amplitudo grafik fungsi",
        "difficulty": "EASY"
      },
      {
        "label": "Limit Fungsi Aljabar & Trigonometri",
        "prompt": "Buatkan soal matematika SMA tentang pemfaktoran limit, merasionalkan bentuk akar, dalil L'Hopital, dan limit trigonometri",
        "difficulty": "EASY"
      },
      {
        "label": "Turunan Fungsi Aljabar & Garis Singgung Kurva",
        "prompt": "Buatkan soal matematika SMA tentang aturan rantai turunan f(x), titik stasioner, interval fungsi naik/turun, dan nilai maksimum",
        "difficulty": "EASY"
      },
      {
        "label": "Integral Tak Tentu & Integral Tentu Luas Daerah",
        "prompt": "Buatkan soal matematika SMA tentang teknik substitusi integral aljabar, integral tentu, dan menghitung luas daerah dibatasi kurva",
        "difficulty": "EASY"
      },
      {
        "label": "Geometri Tiga Dimensi: Jarak Titik, Garis, & Bidang",
        "prompt": "Buatkan soal matematika SMA tentang proyeksi jarak antar titik ke garis atau bidang pada bangun ruang kubus dan limas beraturan",
        "difficulty": "EASY"
      },
      {
        "label": "Statistika Data Kelompok: Kuartil, Desil, & Simpangan Baku",
        "prompt": "Buatkan soal matematika SMA tentang menghitung rataan sementara, kuartil bawah/atas, varians, dan simpangan baku tabel frekuensi",
        "difficulty": "EASY"
      },
      {
        "label": "Kaidah Pencacahan, Permutasi, Kombinasi, & Peluang",
        "prompt": "Buatkan soal matematika SMA tentang aturan perkalian, permutasi unsur berbeda/siklis, kombinasi pemilihan panitia, dan peluang bersyarat",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Fungsi Komposisi & Fungsi Invers",
        "prompt": "Buatkan soal matematika SMA tentang aljabar fungsi, komposisi (f o g)(x), mencari invers fungsi f-1(x), dan daerah asal/hasil",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sistem Persamaan Linear Tiga Variabel (SPLTV)",
        "prompt": "Buatkan soal matematika SMA tentang penyelesaian SPLTV dengan metode gabungan eliminasi-substitusi pada soal cerita",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Program Linear & Nilai Optimum Fungsi Objektif",
        "prompt": "Buatkan soal matematika SMA tentang daerah himpunan penyelesaian sistem pertidaksamaan linear dan titik pojok maksimum/minimum",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Matriks: Perkalian, Determinan, & Invers Matriks",
        "prompt": "Buatkan soal matematika SMA tentang operasi aljabar matriks 2x2 dan 3x3, determinan, matriks singular, dan persamaan AX=B",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Barisan & Deret: Aritmetika, Geometri, & Tak Hingga",
        "prompt": "Buatkan soal matematika SMA tentang suku ke-n, jumlah deret hingga dan tak hingga, serta aplikasi pertumbuhan/peluruhan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Trigonometri: Identitas, Sudut Rangkap, & Grafik Sin/Cos",
        "prompt": "Buatkan soal matematika SMA tentang pembuktian rumus identitas trigonometri, sudut ganda sin 2A, dan amplitudo grafik fungsi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Limit Fungsi Aljabar & Trigonometri",
        "prompt": "Buatkan soal matematika SMA tentang pemfaktoran limit, merasionalkan bentuk akar, dalil L'Hopital, dan limit trigonometri",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Turunan Fungsi Aljabar & Garis Singgung Kurva",
        "prompt": "Buatkan soal matematika SMA tentang aturan rantai turunan f(x), titik stasioner, interval fungsi naik/turun, dan nilai maksimum",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Integral Tak Tentu & Integral Tentu Luas Daerah",
        "prompt": "Buatkan soal matematika SMA tentang teknik substitusi integral aljabar, integral tentu, dan menghitung luas daerah dibatasi kurva",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Geometri Tiga Dimensi: Jarak Titik, Garis, & Bidang",
        "prompt": "Buatkan soal matematika SMA tentang proyeksi jarak antar titik ke garis atau bidang pada bangun ruang kubus dan limas beraturan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Statistika Data Kelompok: Kuartil, Desil, & Simpangan Baku",
        "prompt": "Buatkan soal matematika SMA tentang menghitung rataan sementara, kuartil bawah/atas, varians, dan simpangan baku tabel frekuensi",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kaidah Pencacahan, Permutasi, Kombinasi, & Peluang",
        "prompt": "Buatkan soal matematika SMA tentang aturan perkalian, permutasi unsur berbeda/siklis, kombinasi pemilihan panitia, dan peluang bersyarat",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Fungsi Komposisi & Fungsi Invers",
        "prompt": "Buatkan soal matematika SMA tentang aljabar fungsi, komposisi (f o g)(x), mencari invers fungsi f-1(x), dan daerah asal/hasil",
        "difficulty": "HARD"
      },
      {
        "label": "Sistem Persamaan Linear Tiga Variabel (SPLTV)",
        "prompt": "Buatkan soal matematika SMA tentang penyelesaian SPLTV dengan metode gabungan eliminasi-substitusi pada soal cerita",
        "difficulty": "HARD"
      },
      {
        "label": "Program Linear & Nilai Optimum Fungsi Objektif",
        "prompt": "Buatkan soal matematika SMA tentang daerah himpunan penyelesaian sistem pertidaksamaan linear dan titik pojok maksimum/minimum",
        "difficulty": "HARD"
      },
      {
        "label": "Matriks: Perkalian, Determinan, & Invers Matriks",
        "prompt": "Buatkan soal matematika SMA tentang operasi aljabar matriks 2x2 dan 3x3, determinan, matriks singular, dan persamaan AX=B",
        "difficulty": "HARD"
      },
      {
        "label": "Barisan & Deret: Aritmetika, Geometri, & Tak Hingga",
        "prompt": "Buatkan soal matematika SMA tentang suku ke-n, jumlah deret hingga dan tak hingga, serta aplikasi pertumbuhan/peluruhan",
        "difficulty": "HARD"
      },
      {
        "label": "Trigonometri: Identitas, Sudut Rangkap, & Grafik Sin/Cos",
        "prompt": "Buatkan soal matematika SMA tentang pembuktian rumus identitas trigonometri, sudut ganda sin 2A, dan amplitudo grafik fungsi",
        "difficulty": "HARD"
      },
      {
        "label": "Limit Fungsi Aljabar & Trigonometri",
        "prompt": "Buatkan soal matematika SMA tentang pemfaktoran limit, merasionalkan bentuk akar, dalil L'Hopital, dan limit trigonometri",
        "difficulty": "HARD"
      },
      {
        "label": "Turunan Fungsi Aljabar & Garis Singgung Kurva",
        "prompt": "Buatkan soal matematika SMA tentang aturan rantai turunan f(x), titik stasioner, interval fungsi naik/turun, dan nilai maksimum",
        "difficulty": "HARD"
      },
      {
        "label": "Integral Tak Tentu & Integral Tentu Luas Daerah",
        "prompt": "Buatkan soal matematika SMA tentang teknik substitusi integral aljabar, integral tentu, dan menghitung luas daerah dibatasi kurva",
        "difficulty": "HARD"
      },
      {
        "label": "Geometri Tiga Dimensi: Jarak Titik, Garis, & Bidang",
        "prompt": "Buatkan soal matematika SMA tentang proyeksi jarak antar titik ke garis atau bidang pada bangun ruang kubus dan limas beraturan",
        "difficulty": "HARD"
      },
      {
        "label": "Statistika Data Kelompok: Kuartil, Desil, & Simpangan Baku",
        "prompt": "Buatkan soal matematika SMA tentang menghitung rataan sementara, kuartil bawah/atas, varians, dan simpangan baku tabel frekuensi",
        "difficulty": "HARD"
      },
      {
        "label": "Kaidah Pencacahan, Permutasi, Kombinasi, & Peluang",
        "prompt": "Buatkan soal matematika SMA tentang aturan perkalian, permutasi unsur berbeda/siklis, kombinasi pemilihan panitia, dan peluang bersyarat",
        "difficulty": "HARD"
      }
    ]
  },
  "SMK": {
    "EASY": [
      {
        "label": "Mitigasi Bencana Gempa & Evakuasi Bengkel Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang jalur evakuasi darurat, assembly point, simulasi gempa, dan standar keselamatan bengkel",
        "difficulty": "EASY"
      },
      {
        "label": "Sains Terapan K3: Bahaya Fisik, Kimia, & Ergonomi",
        "prompt": "Buatkan soal Projek IPAS SMK tentang Hazard Identification Risk Assessment (HIRA), APD wajib, dan posisi ergonomis pekerja",
        "difficulty": "EASY"
      },
      {
        "label": "Pengelolaan Limbah Industri B3 & Netralisasi",
        "prompt": "Buatkan soal Projek IPAS SMK tentang klasifikasi limbah B3, simbol label bahaya, tempat penyimpanan sementara (TPS), dan reduksi polutan",
        "difficulty": "EASY"
      },
      {
        "label": "Efisiensi Energi & Konversi Energi Terbarukan Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang panel surya fotovoltaik, turbin angin mini industri, audit energi listrik, dan konservasi daya",
        "difficulty": "EASY"
      },
      {
        "label": "Pencemaran Udara & Teknologi Filter Gas Buang Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang baku mutu emisi gas cerobong pabrik, karbon monoksida, partikulat PM2.5, dan teknologi filter",
        "difficulty": "EASY"
      },
      {
        "label": "Pengukuran Presisi: Jangka Sorong & Mikrometer Sekrup",
        "prompt": "Buatkan soal Projek IPAS SMK tentang ketelitian 0.05mm jangka sorong, kalibrasi nol mikrometer, dan toleransi pengukuran benda kerja",
        "difficulty": "EASY"
      },
      {
        "label": "Reaksi Asam Basa, Derajat pH, & Korosi Logam Pabrik",
        "prompt": "Buatkan soal Projek IPAS SMK tentang uji pH air limbah industri, faktor pemicu oksidasi karat logam, dan proteksi katodik",
        "difficulty": "EASY"
      },
      {
        "label": "Prosedur Analisis Dampak Lingkungan (AMDAL) Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang dokumen UKL-UPL, izin lingkungan pabrik, baku mutu air buangan, dan audit lingkungan hidup",
        "difficulty": "EASY"
      },
      {
        "label": "Kelistrikan Terapan: Arus Kuat, Grounding, & Korsleting",
        "prompt": "Buatkan soal Projek IPAS SMK tentang tahanan pembumian (grounding rod), Miniature Circuit Breaker (MCB), dan pencegahan kebakaran listrik",
        "difficulty": "EASY"
      },
      {
        "label": "Penggunaan APAR & Klasifikasi Kebakaran Bengkel",
        "prompt": "Buatkan soal Projek IPAS SMK tentang tipe kebakaran kelas A, B, C, D, prosedur PASS pemadaman api, dan inspeksi tabung APAR",
        "difficulty": "EASY"
      },
      {
        "label": "Sanitasi Ruang Kerja & Vektor Kontaminan Pabrik",
        "prompt": "Buatkan soal Projek IPAS SMK tentang Good Manufacturing Practice (GMP), sanitasi lantai/peralatan, dan ventilasi exhaust fan",
        "difficulty": "EASY"
      },
      {
        "label": "Penanganan Bahan Kimia Berbahaya Sesuai Dokumen MSDS",
        "prompt": "Buatkan soal Projek IPAS SMK tentang membaca lembar data keselamatan bahan kimia (MSDS), piktogram bahaya GHS, dan P3K tumpahan asam",
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "label": "Mitigasi Bencana Gempa & Evakuasi Bengkel Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang jalur evakuasi darurat, assembly point, simulasi gempa, dan standar keselamatan bengkel",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sains Terapan K3: Bahaya Fisik, Kimia, & Ergonomi",
        "prompt": "Buatkan soal Projek IPAS SMK tentang Hazard Identification Risk Assessment (HIRA), APD wajib, dan posisi ergonomis pekerja",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pengelolaan Limbah Industri B3 & Netralisasi",
        "prompt": "Buatkan soal Projek IPAS SMK tentang klasifikasi limbah B3, simbol label bahaya, tempat penyimpanan sementara (TPS), dan reduksi polutan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Efisiensi Energi & Konversi Energi Terbarukan Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang panel surya fotovoltaik, turbin angin mini industri, audit energi listrik, dan konservasi daya",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pencemaran Udara & Teknologi Filter Gas Buang Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang baku mutu emisi gas cerobong pabrik, karbon monoksida, partikulat PM2.5, dan teknologi filter",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Pengukuran Presisi: Jangka Sorong & Mikrometer Sekrup",
        "prompt": "Buatkan soal Projek IPAS SMK tentang ketelitian 0.05mm jangka sorong, kalibrasi nol mikrometer, dan toleransi pengukuran benda kerja",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Reaksi Asam Basa, Derajat pH, & Korosi Logam Pabrik",
        "prompt": "Buatkan soal Projek IPAS SMK tentang uji pH air limbah industri, faktor pemicu oksidasi karat logam, dan proteksi katodik",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Prosedur Analisis Dampak Lingkungan (AMDAL) Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang dokumen UKL-UPL, izin lingkungan pabrik, baku mutu air buangan, dan audit lingkungan hidup",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Kelistrikan Terapan: Arus Kuat, Grounding, & Korsleting",
        "prompt": "Buatkan soal Projek IPAS SMK tentang tahanan pembumian (grounding rod), Miniature Circuit Breaker (MCB), dan pencegahan kebakaran listrik",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penggunaan APAR & Klasifikasi Kebakaran Bengkel",
        "prompt": "Buatkan soal Projek IPAS SMK tentang tipe kebakaran kelas A, B, C, D, prosedur PASS pemadaman api, dan inspeksi tabung APAR",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Sanitasi Ruang Kerja & Vektor Kontaminan Pabrik",
        "prompt": "Buatkan soal Projek IPAS SMK tentang Good Manufacturing Practice (GMP), sanitasi lantai/peralatan, dan ventilasi exhaust fan",
        "difficulty": "MEDIUM"
      },
      {
        "label": "Penanganan Bahan Kimia Berbahaya Sesuai Dokumen MSDS",
        "prompt": "Buatkan soal Projek IPAS SMK tentang membaca lembar data keselamatan bahan kimia (MSDS), piktogram bahaya GHS, dan P3K tumpahan asam",
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "label": "Mitigasi Bencana Gempa & Evakuasi Bengkel Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang jalur evakuasi darurat, assembly point, simulasi gempa, dan standar keselamatan bengkel",
        "difficulty": "HARD"
      },
      {
        "label": "Sains Terapan K3: Bahaya Fisik, Kimia, & Ergonomi",
        "prompt": "Buatkan soal Projek IPAS SMK tentang Hazard Identification Risk Assessment (HIRA), APD wajib, dan posisi ergonomis pekerja",
        "difficulty": "HARD"
      },
      {
        "label": "Pengelolaan Limbah Industri B3 & Netralisasi",
        "prompt": "Buatkan soal Projek IPAS SMK tentang klasifikasi limbah B3, simbol label bahaya, tempat penyimpanan sementara (TPS), dan reduksi polutan",
        "difficulty": "HARD"
      },
      {
        "label": "Efisiensi Energi & Konversi Energi Terbarukan Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang panel surya fotovoltaik, turbin angin mini industri, audit energi listrik, dan konservasi daya",
        "difficulty": "HARD"
      },
      {
        "label": "Pencemaran Udara & Teknologi Filter Gas Buang Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang baku mutu emisi gas cerobong pabrik, karbon monoksida, partikulat PM2.5, dan teknologi filter",
        "difficulty": "HARD"
      },
      {
        "label": "Pengukuran Presisi: Jangka Sorong & Mikrometer Sekrup",
        "prompt": "Buatkan soal Projek IPAS SMK tentang ketelitian 0.05mm jangka sorong, kalibrasi nol mikrometer, dan toleransi pengukuran benda kerja",
        "difficulty": "HARD"
      },
      {
        "label": "Reaksi Asam Basa, Derajat pH, & Korosi Logam Pabrik",
        "prompt": "Buatkan soal Projek IPAS SMK tentang uji pH air limbah industri, faktor pemicu oksidasi karat logam, dan proteksi katodik",
        "difficulty": "HARD"
      },
      {
        "label": "Prosedur Analisis Dampak Lingkungan (AMDAL) Industri",
        "prompt": "Buatkan soal Projek IPAS SMK tentang dokumen UKL-UPL, izin lingkungan pabrik, baku mutu air buangan, dan audit lingkungan hidup",
        "difficulty": "HARD"
      },
      {
        "label": "Kelistrikan Terapan: Arus Kuat, Grounding, & Korsleting",
        "prompt": "Buatkan soal Projek IPAS SMK tentang tahanan pembumian (grounding rod), Miniature Circuit Breaker (MCB), dan pencegahan kebakaran listrik",
        "difficulty": "HARD"
      },
      {
        "label": "Penggunaan APAR & Klasifikasi Kebakaran Bengkel",
        "prompt": "Buatkan soal Projek IPAS SMK tentang tipe kebakaran kelas A, B, C, D, prosedur PASS pemadaman api, dan inspeksi tabung APAR",
        "difficulty": "HARD"
      },
      {
        "label": "Sanitasi Ruang Kerja & Vektor Kontaminan Pabrik",
        "prompt": "Buatkan soal Projek IPAS SMK tentang Good Manufacturing Practice (GMP), sanitasi lantai/peralatan, dan ventilasi exhaust fan",
        "difficulty": "HARD"
      },
      {
        "label": "Penanganan Bahan Kimia Berbahaya Sesuai Dokumen MSDS",
        "prompt": "Buatkan soal Projek IPAS SMK tentang membaca lembar data keselamatan bahan kimia (MSDS), piktogram bahaya GHS, dan P3K tumpahan asam",
        "difficulty": "HARD"
      }
    ]
  }
};


export const SUNDA_SUBJECT_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    {
      "label": "Pupuh Sunda (Kinanti & Asmarandana)",
      "prompt": "Buatkan soal Bahasa Sunda tentang mengenal watak, guru lagu, dan guru wilangan Pupuh Kinanti dan Asmarandana"
    },
    {
      "label": "Paguneman (Percakapan Sehari-hari)",
      "prompt": "Buatkan soal Bahasa Sunda tentang tata cara paguneman resmi dan akrab di lingkungan sakola"
    },
    {
      "label": "Undak Usuk Basa (Basa Loma & Lemes)",
      "prompt": "Buatkan soal Bahasa Sunda tentang ngalarapkeun ragam basa loma jeung basa lemes ka diri sorangan jeung ka batur"
    },
    {
      "label": "Aksara Sunda Dasar (Ngalagena & Vokal)",
      "prompt": "Buatkan soal Bahasa Sunda tentang maca jeung nulis aksara Sunda ngalagena, aksara swara, jeung rarangken"
    },
    {
      "label": "Dongeng Sasakala & Fabel Sunda",
      "prompt": "Buatkan soal Bahasa Sunda tentang unsur carita dongeng sasakala Situ Bagendit atawa dongeng Kuya jeung Monyet"
    },
    {
      "label": "Babasan jeung Paribasa Sunda",
      "prompt": "Buatkan soal Bahasa Sunda tentang harti babasan jeung paribasa Sunda populer dina kahirupan sapopoe"
    },
    {
      "label": "Kaulinan Barudak Lembur",
      "prompt": "Buatkan soal Bahasa Sunda tentang rupa-rupa kaulinan barudak Sunda saperti oray-orayan, egrang, jeung gasing"
    },
    {
      "label": "Wawacan jeung Carita Pondok (Carpon)",
      "prompt": "Buatkan soal Bahasa Sunda tentang mikawanoh tema, palaku, galur, jeung amanat dina carpon Sunda"
    },
    {
      "label": "Pakakas Tradisional & Kadaharan Sunda",
      "prompt": "Buatkan soal Bahasa Sunda tentang ngaran pakakas dapur tradisional jeung kadaharan has Sunda"
    },
    {
      "label": "Sisindiran (Paparikan & Rarakitan)",
      "prompt": "Buatkan soal Bahasa Sunda tentang wangun sisindiran: cangkang, eusi, paparikan, rarakitan, jeung wawangsalan"
    },
    {
      "label": "Tatakrama Paripolah Urang Sunda",
      "prompt": "Buatkan soal Bahasa Sunda tentang tatakrama sopan santun nyarita jeung rengkuh kasopanan urang Sunda"
    },
    {
      "label": "Sajak Sunda & Kawih Kaulinan",
      "prompt": "Buatkan soal Bahasa Sunda tentang ngaapresiasi sajak Sunda jeung ngawihkeun kawih Sunda"
    }
  ],
  "MEDIUM": [
    {
      "label": "Pupuh Sunda (Kinanti & Asmarandana)",
      "prompt": "Buatkan soal Bahasa Sunda tentang ngitung guru wilangan jeung nangtukeun guru lagu dina sapada pupuh"
    },
    {
      "label": "Paguneman (Percakapan Sehari-hari)",
      "prompt": "Buatkan soal Bahasa Sunda tentang nyusun paguneman ngagunakeun lentong jeung kabeungharan kecap nu bener"
    },
    {
      "label": "Undak Usuk Basa (Basa Loma & Lemes)",
      "prompt": "Buatkan soal Bahasa Sunda tentang ngarobah kalimah basa loma jadi kalimah basa lemes keur batur"
    },
    {
      "label": "Aksara Sunda Dasar (Ngalagena & Vokal)",
      "prompt": "Buatkan soal Bahasa Sunda tentang nransliterasi kecap tina aksara laten kana aksara Sunda"
    },
    {
      "label": "Dongeng Sasakala & Fabel Sunda",
      "prompt": "Buatkan soal Bahasa Sunda tentang nganalisis pesan moral jeung ajen atikan dina dongeng Sunda"
    },
    {
      "label": "Babasan jeung Paribasa Sunda",
      "prompt": "Buatkan soal Bahasa Sunda tentang ngalarapkeun babasan Sunda dina kalimah anu merenah"
    },
    {
      "label": "Kaulinan Barudak Lembur",
      "prompt": "Buatkan soal Bahasa Sunda tentang aturan maen jeung kawih pangiring kaulinan oray-orayan"
    },
    {
      "label": "Wawacan jeung Carita Pondok (Carpon)",
      "prompt": "Buatkan soal Bahasa Sunda tentang nangtukeun pasipatan palaku jeung puseur sawangan dina carpon"
    },
    {
      "label": "Pakakas Tradisional & Kadaharan Sunda",
      "prompt": "Buatkan soal Bahasa Sunda tentang kagunaan parabot tatanen jeung cara ngolah kadaharan tradisional"
    },
    {
      "label": "Sisindiran (Paparikan & Rarakitan)",
      "prompt": "Buatkan soal Bahasa Sunda tentang nyusun rarakitan jeung paparikan piwuruk anu murwakanti"
    },
    {
      "label": "Tatakrama Paripolah Urang Sunda",
      "prompt": "Buatkan soal Bahasa Sunda tentang studi kasus ngabedakeun kalimah lemes jeung kasar dina situasi pasamoan"
    },
    {
      "label": "Sajak Sunda & Kawih Kaulinan",
      "prompt": "Buatkan soal Bahasa Sunda tentang nyaritakeun deui eusi sajak Sunda ngagunakeun basa sorangan"
    }
  ],
  "HARD": [
    {
      "label": "Pupuh Sunda (Kinanti & Asmarandana)",
      "prompt": "Buatkan soal Bahasa Sunda tentang ngaanalisis amanat jero jeung ngabandingkeun watek rupa-rupa pupuh Sunda"
    },
    {
      "label": "Paguneman (Percakapan Sehari-hari)",
      "prompt": "Buatkan soal Bahasa Sunda tentang ngaevaluasi kasopanan paguneman dina situasi resmi jeung debat basa Sunda"
    },
    {
      "label": "Undak Usuk Basa (Basa Loma & Lemes)",
      "prompt": "Buatkan soal Bahasa Sunda tentang ngaanalisis kasalahan ngalarapkeun kecap lemes ka diri sorangan"
    },
    {
      "label": "Aksara Sunda Dasar (Ngalagena & Vokal)",
      "prompt": "Buatkan soal Bahasa Sunda tentang maca alinea naskah aksara Sunda heubeul kalayan taliti"
    },
    {
      "label": "Dongeng Sasakala & Fabel Sunda",
      "prompt": "Buatkan soal Bahasa Sunda tentang ngabandingkeun dongeng sasakala jeung carita sajarah saenyana"
    },
    {
      "label": "Babasan jeung Paribasa Sunda",
      "prompt": "Buatkan soal Bahasa Sunda tentang ngaevaluasi relevansi paribasa Sunda dina ngajawab tantangan jaman modern"
    },
    {
      "label": "Kaulinan Barudak Lembur",
      "prompt": "Buatkan soal Bahasa Sunda tentang ngabedakeun ajen gotong royong dina kaulinan barudak baheula jeung game modern"
    },
    {
      "label": "Wawacan jeung Carita Pondok (Carpon)",
      "prompt": "Buatkan soal Bahasa Sunda tentang ngaanalisis gaya basa, majas, jeung konflik batin dina carpon Sunda"
    },
    {
      "label": "Pakakas Tradisional & Kadaharan Sunda",
      "prompt": "Buatkan soal Bahasa Sunda tentang filosofi hirup urang Sunda anu kagambar tina arsitektur imah panggung"
    },
    {
      "label": "Sisindiran (Paparikan & Rarakitan)",
      "prompt": "Buatkan soal Bahasa Sunda tentang nyieun sisindiran wawangsalan anu ngandung tatarucingan hese"
    },
    {
      "label": "Tatakrama Paripolah Urang Sunda",
      "prompt": "Buatkan soal Bahasa Sunda tentang studi kasus etika diplomasi kabudayaan dumasar kana ajen Soméah Hade ka Sémah"
    },
    {
      "label": "Sajak Sunda & Kawih Kaulinan",
      "prompt": "Buatkan soal Bahasa Sunda tentang ngaanalisis diksi jeung suasana batin dina sajak panyajak Sunda kasohor"
    }
  ]
};

export const JAWA_SUBJECT_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    {
      "label": "Unggah-Ungguh Basa Jawa (Ngoko & Krama)",
      "prompt": "Buatkan soal Bahasa Jawa tentang membedakan penggunaan basa ngoko lugu, ngoko alus, dan krama inggil"
    },
    {
      "label": "Aksara Jawa & Sandhangan Dasar",
      "prompt": "Buatkan soal Bahasa Jawa tentang mengenal 20 aksara Jawa (Ha-Na-Ca-Ra-Ka) dan sandhangan swara"
    },
    {
      "label": "Tembang Macapat (Pocung & Gambuh)",
      "prompt": "Buatkan soal Bahasa Jawa tentang guru gatra, guru wilangan, dan guru lagu tembang Pocung dan Gambuh"
    },
    {
      "label": "Cerita Wayang & Tokoh Pandhawa Lima",
      "prompt": "Buatkan soal Bahasa Jawa tentang nama watak tokoh Pandhawa Lima (Puntadewa, Werkudara, Janaka, Nakula, Sadewa)"
    },
    {
      "label": "Paribasan, Bebasan, lan Saloka",
      "prompt": "Buatkan soal Bahasa Jawa tentang tegese paribasan Jawa populer dalam kehidupan sehari-hari"
    },
    {
      "label": "Dolanan Tradisional & Tembang Dolanan",
      "prompt": "Buatkan soal Bahasa Jawa tentang tembang dolanan anak seperti Gundhul-Gundhul Pacul, Padhang Bulan, Jamuran"
    },
    {
      "label": "Geguritan (Puisi Basa Jawa)",
      "prompt": "Buatkan soal Bahasa Jawa tentang tema, isi, dan amanat geguritan sederhana"
    },
    {
      "label": "Cangkriman (Teka-Teki Basa Jawa)",
      "prompt": "Buatkan soal Bahasa Jawa tentang bedhekan cangkriman wancahan, pepindhan, dan blenderan"
    },
    {
      "label": "Panganan Tradisional Jawa",
      "prompt": "Buatkan soal Bahasa Jawa tentang mengenal panganan tradisional dari ketan, singkong, dan kelapa"
    },
    {
      "label": "Pacelathon (Percakapan Basa Jawa)",
      "prompt": "Buatkan soal Bahasa Jawa tentang tata krama bertamu dan berdialog dengan orang yang lebih tua"
    },
    {
      "label": "Busana Adat & Gamelan Jawa",
      "prompt": "Buatkan soal Bahasa Jawa tentang nama busana adat Jawa (kebaya, beskap, jarik) dan ricikan gamelan"
    },
    {
      "label": "Pranata Adicara (Pambyawara Sederhana)",
      "prompt": "Buatkan soal Bahasa Jawa tentang urutan perangan sesorah / pidhato basa Jawa (pambuka, isi, panutup)"
    }
  ],
  "MEDIUM": [
    {
      "label": "Unggah-Ungguh Basa Jawa (Ngoko & Krama)",
      "prompt": "Buatkan soal Bahasa Jawa tentang mengubah kalimat ngoko menjadi krama alus yang santun kepada orang tua"
    },
    {
      "label": "Aksara Jawa & Sandhangan Dasar",
      "prompt": "Buatkan soal Bahasa Jawa tentang menulis kata menggunakan pasangan dan sandhangan panyigeg wanda"
    },
    {
      "label": "Tembang Macapat (Pocung & Gambuh)",
      "prompt": "Buatkan soal Bahasa Jawa tentang menganalisis paugeran tembang macapat Sinom, Kinanthi, dan Dhandhanggula"
    },
    {
      "label": "Cerita Wayang & Tokoh Pandhawa Lima",
      "prompt": "Buatkan soal Bahasa Jawa tentang alur cerita perang Baratayuda dan senjata pusaka para ksatria wayang"
    },
    {
      "label": "Paribasan, Bebasan, lan Saloka",
      "prompt": "Buatkan soal Bahasa Jawa tentang menerapkan paribasan Jawa dalam situasi sosial kemasyarakatan"
    },
    {
      "label": "Dolanan Tradisional & Tembang Dolanan",
      "prompt": "Buatkan soal Bahasa Jawa tentang makna filosofis dalam tembang dolanan Ilir-Ilir dan Menthok-Menthok"
    },
    {
      "label": "Geguritan (Puisi Basa Jawa)",
      "prompt": "Buatkan soal Bahasa Jawa tentang menganalisis purwakanthi guru swara, guru sastra, dan guru basa pada geguritan"
    },
    {
      "label": "Cangkriman (Teka-Teki Basa Jawa)",
      "prompt": "Buatkan soal Bahasa Jawa tentang menebak makna cangkriman sinawung tembang Pocung"
    },
    {
      "label": "Panganan Tradisional Jawa",
      "prompt": "Buatkan soal Bahasa Jawa tentang makna filosofis gunungan dan tumpeng pada upacara adat Jawa"
    },
    {
      "label": "Pacelathon (Percakapan Basa Jawa)",
      "prompt": "Buatkan soal Bahasa Jawa tentang menyusun naskah pacelathon musyawarah warga RT menggunakan krama alus"
    },
    {
      "label": "Busana Adat & Gamelan Jawa",
      "prompt": "Buatkan soal Bahasa Jawa tentang fungsi kendhang, gong, dan saron dalam mengiringi tari tradisional"
    },
    {
      "label": "Pranata Adicara (Pambyawara Sederhana)",
      "prompt": "Buatkan soal Bahasa Jawa tentang menyusun teks pidato perpisahan sekolah menggunakan ragam krama inggil"
    }
  ],
  "HARD": [
    {
      "label": "Unggah-Ungguh Basa Jawa (Ngoko & Krama)",
      "prompt": "Buatkan soal Bahasa Jawa tentang menganalisis kesalahan pemilihan undha-usuk basa dalam forum rembug desa"
    },
    {
      "label": "Aksara Jawa & Sandhangan Dasar",
      "prompt": "Buatkan soal Bahasa Jawa tentang membaca dan mengalihaksarakan teks paragraf aksara Jawa berpasangan majemuk"
    },
    {
      "label": "Tembang Macapat (Pocung & Gambuh)",
      "prompt": "Buatkan soal Bahasa Jawa tentang menciptakan tembang macapat Dhandhanggula yang taat paugeran dan puitis"
    },
    {
      "label": "Cerita Wayang & Tokoh Pandhawa Lima",
      "prompt": "Buatkan soal Bahasa Jawa tentang mengevaluasi konflik moral dan etika ksatria Adipati Karna dalam Mahabharata"
    },
    {
      "label": "Paribasan, Bebasan, lan Saloka",
      "prompt": "Buatkan soal Bahasa Jawa tentang mengkritisi fenomena sosial modern menggunakan perumpamaan saloka Jawa kuno"
    },
    {
      "label": "Dolanan Tradisional & Tembang Dolanan",
      "prompt": "Buatkan soal Bahasa Jawa tentang membedah nilai kepemimpinan dan budi pekerti luhur dalam tembang macapat"
    },
    {
      "label": "Geguritan (Puisi Basa Jawa)",
      "prompt": "Buatkan soal Bahasa Jawa tentang membedah gaya bahasa metafora dan simbolisme dalam karya penyair Jawa modern"
    },
    {
      "label": "Cangkriman (Teka-Teki Basa Jawa)",
      "prompt": "Buatkan soal Bahasa Jawa tentang menganalisis logika berpikir dan kecerdasan bahasa dalam cangkriman tembang"
    },
    {
      "label": "Panganan Tradisional Jawa",
      "prompt": "Buatkan soal Bahasa Jawa tentang pelestarian kuliner tradisional Jawa sebagai warisan budaya adiluhung"
    },
    {
      "label": "Pacelathon (Percakapan Basa Jawa)",
      "prompt": "Buatkan soal Bahasa Jawa tentang studi kasus etika negosiasi tradisi Jawa (ngajeni, tepa slira, empan papan)"
    },
    {
      "label": "Busana Adat & Gamelan Jawa",
      "prompt": "Buatkan soal Bahasa Jawa tentang makna filosofis blangkon, keris gayaman, dan stagen dalam ajaran moral Jawa"
    },
    {
      "label": "Pranata Adicara (Pambyawara Sederhana)",
      "prompt": "Buatkan soal Bahasa Jawa tentang menganalisis gaya intonasi dan diksi pambyawara pada upacara panggih penganten"
    }
  ]
};

export const BALI_SUBJECT_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    {
      "label": "Anggah-Ungguhing Basa Bali Dasar",
      "prompt": "Buatkan soal Bahasa Bali tentang mengenal tingkatan basa Bali: Alus Singgih, Alus Sor, Alus Mider, dan Basa Kepara"
    },
    {
      "label": "Aksara Bali & Pasang Aksara",
      "prompt": "Buatkan soal Bahasa Bali tentang mengenal aksara Wianjana (Ha-Na-Ca-Ra-Ka), aksara Suara, dan sandhangan tengenan"
    },
    {
      "label": "Pupuh Ginada & Ginanti",
      "prompt": "Buatkan soal Bahasa Bali tentang padalingsa dan guru lagu pada tembang Pupuh Ginada dan Pupuh Ginanti"
    },
    {
      "label": "Satua Bali (Tantri & Fabel)",
      "prompt": "Buatkan soal Bahasa Bali tentang tokoh fabel dan amanat dalam satua Si Siap Selem atau I Lutung Teken I Kekua"
    },
    {
      "label": "Paribasa Bali (Cecimpedan & Bladbadan)",
      "prompt": "Buatkan soal Bahasa Bali tentang teka-teki cecimpedan dan arti ungkapan paribasa Bali sederhana"
    },
    {
      "label": "Kosa Basa Upacara Adat Bali",
      "prompt": "Buatkan soal Bahasa Bali tentang istilah sarana upakara (banten, canang sari, kelapa, janur) dan maknanya"
    },
    {
      "label": "Mebasa Bali dina Sadina-dina",
      "prompt": "Buatkan soal Bahasa Bali tentang percakapan santun di lingkungan keluarga dan sekolah"
    },
    {
      "label": "Gending Rare & Gending Janger",
      "prompt": "Buatkan soal Bahasa Bali tentang lirik dan makna gending rare anak Bali (Curik-curik, Meong-meong)"
    },
    {
      "label": "Busana Adat Bali",
      "prompt": "Buatkan soal Bahasa Bali tentang nama perlengkapan busana adat sembahyang (kamen, saput, udeng, selendang)"
    },
    {
      "label": "Seni Tari & Gamelan Gong Kebyar",
      "prompt": "Buatkan soal Bahasa Bali tentang nama tari tradisional Bali (Pendet, Baris, Kecak) dan instrumen gong kebyar"
    },
    {
      "label": "Tri Hita Karana dalam Kehidupan",
      "prompt": "Buatkan soal Bahasa Bali tentang penerapan konsep Parahyangan, Pawongan, dan Palemahan di lingkungan desa"
    },
    {
      "label": "Pidarta Basa Bali (Pidato Bahasa Bali)",
      "prompt": "Buatkan soal Bahasa Bali tentang bagian pamahbah, daging, dan pamuput dalam pidarta basa Bali"
    }
  ],
  "MEDIUM": [
    {
      "label": "Anggah-Ungguhing Basa Bali Dasar",
      "prompt": "Buatkan soal Bahasa Bali tentang mengubah kalimat basa kepara menjadi basa alus singgih untuk para guru/tetua"
    },
    {
      "label": "Aksara Bali & Pasang Aksara",
      "prompt": "Buatkan soal Bahasa Bali tentang menulis kata menggunakan gantungan dan gempelan aksara Bali"
    },
    {
      "label": "Pupuh Ginada & Ginanti",
      "prompt": "Buatkan soal Bahasa Bali tentang menganalisis padalingsa pupuh Sinom dan Semarandana"
    },
    {
      "label": "Satua Bali (Tantri & Fabel)",
      "prompt": "Buatkan soal Bahasa Bali tentang menganalisis watak tokoh antagonis dan protagonis dalam satua Ni Bawang lan Ni Kesuna"
    },
    {
      "label": "Paribasa Bali (Cecimpedan & Bladbadan)",
      "prompt": "Buatkan soal Bahasa Bali tentang mengartikan bladbadan (makna tersirat) dalam percakapan sehari-hari"
    },
    {
      "label": "Kosa Basa Upacara Adat Bali",
      "prompt": "Buatkan soal Bahasa Bali tentang makna filosofis perayaan Hari Raya Galungan, Kuningan, dan Nyepi"
    },
    {
      "label": "Mebasa Bali dina Sadina-dina",
      "prompt": "Buatkan soal Bahasa Bali tentang menyusun dialog pasangkepan (rapat adat) menggunakan basa alus mider"
    },
    {
      "label": "Gending Rare & Gending Janger",
      "prompt": "Buatkan soal Bahasa Bali tentang menganalisis nilai kesetiakawanan dalam lirik gending dolanan Bali"
    },
    {
      "label": "Busana Adat Bali",
      "prompt": "Buatkan soal Bahasa Bali tentang etika dan aturan pemakaian busana adat madya dan agung di pura"
    },
    {
      "label": "Seni Tari & Gamelan Gong Kebyar",
      "prompt": "Buatkan soal Bahasa Bali tentang gerak agem, tandang, dan tangkep pada tarian dasar Bali"
    },
    {
      "label": "Tri Hita Karana dalam Kehidupan",
      "prompt": "Buatkan soal Bahasa Bali tentang aksi nyata gotong royong menjaga kebersihan palemahan (sumber air/sungai)"
    },
    {
      "label": "Pidarta Basa Bali (Pidato Bahasa Bali)",
      "prompt": "Buatkan soal Bahasa Bali tentang menyusun teks pidarta tentang bahaya sampah plastik menggunakan basa alus"
    }
  ],
  "HARD": [
    {
      "label": "Anggah-Ungguhing Basa Bali Dasar",
      "prompt": "Buatkan soal Bahasa Bali tentang menganalisis kekeliruan penerapan basa alus sor kepada orang yang dihormati"
    },
    {
      "label": "Aksara Bali & Pasang Aksara",
      "prompt": "Buatkan soal Bahasa Bali tentang membaca dan mentransliterasi teks lontar aksara Bali kuno"
    },
    {
      "label": "Pupuh Ginada & Ginanti",
      "prompt": "Buatkan soal Bahasa Bali tentang menggubah tembang pupuh Durma dan Maskumambang berbobot nilai filsafat"
    },
    {
      "label": "Satua Bali (Tantri & Fabel)",
      "prompt": "Buatkan soal Bahasa Bali tentang membedah nilai kepemimpinan dan diplomasi dalam wiracarita Tantri Kamandaka"
    },
    {
      "label": "Paribasa Bali (Cecimpedan & Bladbadan)",
      "prompt": "Buatkan soal Bahasa Bali tentang menganalisis metafora pepindan dan sesonggan dalam konteks kearifan lokal"
    },
    {
      "label": "Kosa Basa Upacara Adat Bali",
      "prompt": "Buatkan soal Bahasa Bali tentang membedah nilai teologis dan spiritual Panca Yadnya dalam kehidupan masyarakat"
    },
    {
      "label": "Mebasa Bali dina Sadina-dina",
      "prompt": "Buatkan soal Bahasa Bali tentang studi kasus etika komunikasi santun pada upacara parum desa pakraman"
    },
    {
      "label": "Gending Rare & Gending Janger",
      "prompt": "Buatkan soal Bahasa Bali tentang menganalisis makna simbolis dan sejarah perkembangan seni janger"
    },
    {
      "label": "Busana Adat Bali",
      "prompt": "Buatkan soal Bahasa Bali tentang filosofi warna dan simpul kain kancut dalam simbol pengikatan hawa nafsu"
    },
    {
      "label": "Seni Tari & Gamelan Gong Kebyar",
      "prompt": "Buatkan soal Bahasa Bali tentang menganalisis hubungan ritme tabuh gamelan dengan ekspresi mata (seledet) penari"
    },
    {
      "label": "Tri Hita Karana dalam Kehidupan",
      "prompt": "Buatkan soal Bahasa Bali tentang merumuskan solusi pelestarian lingkungan desa adat berdasarkan hukum adat Awig-awig"
    },
    {
      "label": "Pidarta Basa Bali (Pidato Bahasa Bali)",
      "prompt": "Buatkan soal Bahasa Bali tentang mengevaluasi retorika dan ketepatan intonasi pidarta dalam ajang wimbakara resmi"
    }
  ]
};

export const MULOK_KESENIAN_BUDAYA_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    { label: "Seni Tari Tradisional Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang gerak dasar tari daerah, wiraga, dan busana tari tradisional" },
    { label: "Alat Musik Tradisional Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang mengenal nama dan cara memainkan alat musik tradisional (gamelan, angklung, kolintang, sasando, tifa)" },
    { label: "Motif Batik & Wastra Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang mengenal motif dasar batik daerah dan ragam hias ornamen nusantara" },
    { label: "Lagu Daerah & Makna Lirik", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang lirik, tangga nada, dan amanat lagu daerah nusantara populer" },
    { label: "Rumah Adat Tradisional", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang nama, bentuk arsitektur, dan fungsi rumah adat nusantara" },
    { label: "Seni Pertunjukan & Teater Rakyat", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang wayang, ketoprak, lenong, dan teater rakyat nusantara" },
    { label: "Senjata Tradisional Nusantara", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang nama, asal daerah, dan ciri senjata tradisional daerah" },
    { label: "Upacara Adat Tradisional", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang perayaan upacara adat panen dan penyambutan tamu daerah" },
    { label: "Permainan & Dolanan Tradisional", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang aturan dan nilai kebersamaan permainan tradisional anak" },
    { label: "Pakaian & Busana Adat Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang nama kelengkapan busana adat tradisional daerah" },
    { label: "Cerita Rakyat & Legenda Lokal", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang tokoh, pesan moral, dan amanat cerita rakyat nusantara" },
    { label: "Pelestarian Seni Budaya Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang cara menghargai dan melestarikan warisan budaya lokal di sekolah" }
  ],
  "MEDIUM": [
    { label: "Seni Tari Tradisional Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang membedah keselarasan wiraga, wirama, dan wirasa dalam ekspresi tari tradisional" },
    { label: "Alat Musik Tradisional Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang klasifikasi instrumen musik tradisional (idiophone, membranophone, chordophone, aerophone) dan fungsinya" },
    { label: "Motif Batik & Wastra Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang teknik pembuatan batik tulis vs cap dan filosofi simbolik motif kain tradisional" },
    { label: "Lagu Daerah & Makna Lirik", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang menganalisis gaya melodi, cengkok, dan nilai budaya dalam lirik lagu daerah" },
    { label: "Rumah Adat Tradisional", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang kearifan lokal arsitektur vernakular rumah adat dalam merespon iklim dan gempa bumi" },
    { label: "Seni Pertunjukan & Teater Rakyat", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang struktur dramaturgi pertunjukan teater tradisi dan perannya sebagai media kritik sosial" },
    { label: "Senjata Tradisional Nusantara", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang nilai filosofis, fungsi spiritual, dan etika pelestarian senjata pusaka tradisional" },
    { label: "Upacara Adat Tradisional", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang tata urutan prosesi upacara adat dan fungsi integrasi sosial bagi masyarakat" },
    { label: "Permainan & Dolanan Tradisional", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang menganalisis aspek kebugaran fisik dan kecerdasan sosial dalam permainan tradisional" },
    { label: "Pakaian & Busana Adat Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang makna simbolis warna, bahan kain, dan ornamen hias busana adat pernikahan" },
    { label: "Cerita Rakyat & Legenda Lokal", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang membandingkan struktur naratif dongeng lokal dan fungsinya dalam transmisi nilai moral" },
    { label: "Pelestarian Seni Budaya Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang strategi pemanfaatan media digital dan festival seni untuk merevitalisasi budaya lokal" }
  ],
  "HARD": [
    { label: "Seni Tari Tradisional Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang membedah koreografi kontemporer berbasis gerak tradisi serta kritik estetikanya" },
    { label: "Alat Musik Tradisional Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang analisis akustik instrumen etnis, sistem laras nada tradisional, dan harmonisasi ansambel nusantara" },
    { label: "Motif Batik & Wastra Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang semiotika ragam hias sakral wastra nusantara dan perlindungan hak cipta motif Indikasi Geografis" },
    { label: "Lagu Daerah & Makna Lirik", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang rekonstruksi tangga nada pentatonik lagu daerah dan adaptasi aransemen ke kancah global" },
    { label: "Rumah Adat Tradisional", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang kajian etno-arsitektur rumah adat nusantara sebagai prototipe bangunan tahan bencana dan ramah lingkungan" },
    { label: "Seni Pertunjukan & Teater Rakyat", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang komparasi teater tradisi nusantara dan strategi adaptasinya menghadapi hegemoni hiburan modern" },
    { label: "Senjata Tradisional Nusantara", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang analisis metalurgi kuno bilah senjata pusaka nusantara dan tinjauan simbolisme kekuasaan" },
    { label: "Upacara Adat Tradisional", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang mengevaluasi fenomena komodifikasi ritual adat dalam industri pariwisata vs pelestarian kesakralan" },
    { label: "Permainan & Dolanan Tradisional", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang rancang bangun kurikulum revitalisasi permainan tradisional sebagai terapi psikomotorik anak" },
    { label: "Pakaian & Busana Adat Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang gastro-etnografi dan diplomasi kebudayaan melalui diplomasi wastra di forum internasional" },
    { label: "Cerita Rakyat & Legenda Lokal", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang kritik sastra hermeneutika terhadap mitologi lokal dalam pembentukan jati diri kebangsaan" },
    { label: "Pelestarian Seni Budaya Daerah", prompt: "Buatkan soal Kesenian & Budaya Daerah tentang evaluasi kebijakan pendaftaran Warisan Budaya Takbenda (WBTb) UNESCO dan mitigasi klaim budaya" }
  ]
};

export const MULOK_KETERAMPILAN_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    { label: "Kerajinan Anyaman Bahan Alami", prompt: "Buatkan soal Keterampilan Daerah tentang mengenal bahan alam (bambu, pandan, rotan) dan teknik anyaman dasar" },
    { label: "Batik Tulis & Batik Celup Ikat", prompt: "Buatkan soal Keterampilan Daerah tentang alat membatik (canting, malam, kompor) dan teknik jumputan sederhana" },
    { label: "Seni Pahat & Ukir Kayu Sederhana", prompt: "Buatkan soal Keterampilan Daerah tentang jenis pahat kayu dasar dan pengenalan ragam ornamen ukir" },
    { label: "Kerajinan Tanah Liat & Gerabah", prompt: "Buatkan soal Keterampilan Daerah tentang sifat tanah liat dan teknik pembuatan wadah gerabah lempeng pilin" },
    { label: "Kuliner Tradisional & Olahan Pangan", prompt: "Buatkan soal Keterampilan Daerah tentang bahan rempah lokal dan kebersihan proses pengolahan makanan daerah" },
    { label: "Kerajinan Manik & Kain Perca", prompt: "Buatkan soal Keterampilan Daerah tentang merangkai aksesori gelang manik-manik dan kreasi kain perca" },
    { label: "Minuman Herbal & Jamu Tradisional", prompt: "Buatkan soal Keterampilan Daerah tentang rimpang kunyit, jahe, temulawak dan cara perebusan higienis" },
    { label: "Keterampilan Tenun Tradisional", prompt: "Buatkan soal Keterampilan Daerah tentang bagian alat tenun dan konsep benang lungsin serta pakan" },
    { label: "Pembuatan Suvenir Khas Daerah", prompt: "Buatkan soal Keterampilan Daerah tentang memanfaatkan bahan alam sekitar menjadi cinderamata khas" },
    { label: "Budidaya Tanaman Obat Lokal", prompt: "Buatkan soal Keterampilan Daerah tentang media tanam dan cara merawat tanaman obat keluarga (TOGA)" },
    { label: "Pengawetan Makanan Alami", prompt: "Buatkan soal Keterampilan Daerah tentang teknik pengeringan, pengasinan, dan pemanisan makanan khas" },
    { label: "Pengemasan & Penjualan Produk Kriya", prompt: "Buatkan soal Keterampilan Daerah tentang membuat label produk dan kemasan menarik untuk cinderamata" }
  ],
  "MEDIUM": [
    { label: "Kerajinan Anyaman Bahan Alami", prompt: "Buatkan soal Keterampilan Daerah tentang teknik iratan bambu halus, pengawetan anti jamur bubuk, dan pola anyam kepang terawang" },
    { label: "Batik Tulis & Batik Celup Ikat", prompt: "Buatkan soal Keterampilan Daerah tentang pewarnaan alami (naphtol, indigosol, jolawe) dan teknik nglorod malam teratur" },
    { label: "Seni Pahat & Ukir Kayu Sederhana", prompt: "Buatkan soal Keterampilan Daerah tentang teknik dasaran, bukaan, cawen ukir kayu dan finishing ramah lingkungan" },
    { label: "Kerajinan Tanah Liat & Gerabah", prompt: "Buatkan soal Keterampilan Daerah tentang teknik putar centring tanah liat dan pembakaran gerabah tanpa retak" },
    { label: "Kuliner Tradisional & Olahan Pangan", prompt: "Buatkan soal Keterampilan Daerah tentang standarisasi resep kuliner daerah dan penerapan sanitasi higienis standar BPOM" },
    { label: "Kerajinan Manik & Kain Perca", prompt: "Buatkan soal Keterampilan Daerah tentang teknik jahit tindas (quilting) perca motif daerah dan perhitungan ongkos kerja" },
    { label: "Minuman Herbal & Jamu Tradisional", prompt: "Buatkan soal Keterampilan Daerah tentang formulasi takaran simplisia jamu tradisional dan teknik pasteurisasi kemasan botol" },
    { label: "Keterampilan Tenun Tradisional", prompt: "Buatkan soal Keterampilan Daerah tentang teknik mengikat pola motif lungsin ikat dan penyusunan kerapatan sisir tenun" },
    { label: "Pembuatan Suvenir Khas Daerah", prompt: "Buatkan soal Keterampilan Daerah tentang inovasi desain cinderamata etnik fungsional berdaya jual tinggi bagi wisatawan" },
    { label: "Budidaya Tanaman Obat Lokal", prompt: "Buatkan soal Keterampilan Daerah tentang perbanyakan bibit vegetatif stek dan cangkok tanaman obat endemik unggul" },
    { label: "Pengawetan Makanan Alami", prompt: "Buatkan soal Keterampilan Daerah tentang kontrol kadar air, sanitasi kedap udara, dan masa simpan olahan pangan tradisional" },
    { label: "Pengemasan & Penjualan Produk Kriya", prompt: "Buatkan soal Keterampilan Daerah tentang menghitung Harga Pokok Produksi (HPP) dan strategi pemasaran digital produk kerajinan" }
  ],
  "HARD": [
    { label: "Kerajinan Anyaman Bahan Alami", prompt: "Buatkan soal Keterampilan Daerah tentang rekayasa laminasi bambu untuk mebel kriya ekspor dan uji kelayakan struktur beban" },
    { label: "Batik Tulis & Batik Celup Ikat", prompt: "Buatkan soal Keterampilan Daerah tentang instalasi pengolahan air limbah (IPAL) batik dan sertifikasi Batikmark Indonesia" },
    { label: "Seni Pahat & Ukir Kayu Sederhana", prompt: "Buatkan soal Keterampilan Daerah tentang konservasi ukiran kayu cagar budaya dan teknik restorasi patahan ornamen kuno" },
    { label: "Kerajinan Tanah Liat & Gerabah", prompt: "Buatkan soal Keterampilan Daerah tentang formulasi glasir oksida mineral lokal dan pengaturan atmosfer reduksi tungku keramik" },
    { label: "Kuliner Tradisional & Olahan Pangan", prompt: "Buatkan soal Keterampilan Daerah tentang teknologi retort pouch kemasan steril kuliner warisan untuk ketahanan ekspor global" },
    { label: "Kerajinan Manik & Kain Perca", prompt: "Buatkan soal Keterampilan Daerah tentang integrasi circular fashion limbah garmen etnik menjadi produk adibusana bernilai ekspor" },
    { label: "Minuman Herbal & Jamu Tradisional", prompt: "Buatkan soal Keterampilan Daerah tentang standarisasi fitofarmaka simplisia jamu herbal daerah dan pengujian kestabilan senyawa aktif" },
    { label: "Keterampilan Tenun Tradisional", prompt: "Buatkan soal Keterampilan Daerah tentang rekayasa ekstraksi zat warna alami dari akar/daun endemik dan proteksi motif Indikasi Geografis" },
    { label: "Pembuatan Suvenir Khas Daerah", prompt: "Buatkan soal Keterampilan Daerah tentang audit rantai pasok keberlanjutan bahan baku kriya lokal bersertifikasi fair trade" },
    { label: "Budidaya Tanaman Obat Lokal", prompt: "Buatkan soal Keterampilan Daerah tentang bioteknologi kultur jaringan mikropropagasi tanaman obat langka berorientasi industri farmasi" },
    { label: "Pengawetan Makanan Alami", prompt: "Buatkan soal Keterampilan Daerah tentang biopreservasi mikrobiologi pangan fermentasi tradisional (bakteri asam laktat) dan sertifikasi HACCP" },
    { label: "Pengemasan & Penjualan Produk Kriya", prompt: "Buatkan soal Keterampilan Daerah tentang penyusunan business plan inkubasi bisnis kerajinan rakyat berbasis ekspor dan pembiayaan ventura" }
  ]
};

export const MULOK_PLH_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    { label: "Pemilahan Sampah & Prinsip 3R", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang membedakan sampah organik, anorganik, dan B3 serta cara memilahnya" },
    { label: "Konservasi Air & Lubang Biopori", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang perilaku hemat air bersih, fungsi resapan air, dan lubang biopori" },
    { label: "Penghijauan Sekolah & Adiwiyata", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang menanam tanaman perindang, taman sekolah, dan menjaga kebersihan lingkungan" },
    { label: "Pencegahan Pencemaran Lingkungan", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang bahaya membuang sampah ke sungai dan larangan membakar sampah" },
    { label: "Konservasi Satwa & Flora Langka", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang satwa dan tumbuhan endemik yang dilindungi serta habitat aslinya" },
    { label: "Hemat Energi Listrik", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang perilaku mematikan lampu dan mencabut alat elektronik saat tidak digunakan" },
    { label: "Pembuatan Kompos Daun Sederhana", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang langkah mengolah daun kering dan sisa sayur menjadi kompos" },
    { label: "Pola Hidup Bersih & Sehat (PHBS)", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang mencuci tangan dengan sabun, toilet bersih, dan kantin sekolah sehat" },
    { label: "Kesiapsiagaan Bencana Banjir & Longsor", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang langkah penyelamatan diri saat banjir dan membersihkan saluran air" },
    { label: "Pemanfaatan Barang Bekas", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang membuat pot tanaman dari botol bekas dan kreasi barang daur ulang" },
    { label: "Hutan Mangrove & Perlindungan Pantai", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang fungsi hutan bakau menahan gelombang dan abrasi pantai" },
    { label: "Etika Peduli Alam Sekitar", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang larangan merusak tanaman di taman dan menjaga keasrian lingkungan" }
  ],
  "MEDIUM": [
    { label: "Pemilahan Sampah & Prinsip 3R", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang manajemen bank sampah sekolah, kalkulasi reduksi timbulan sampah, dan daur ulang plastik" },
    { label: "Konservasi Air & Lubang Biopori", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang siklus hidrologi perkotaan, sumur resapan, dan penanganan krisis air tanah" },
    { label: "Penghijauan Sekolah & Adiwiyata", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang pemenuhan 4 komponen Adiwiyata (kebijakan, kurikulum, partisipatif, sarana ramah lingkungan)" },
    { label: "Pencegahan Pencemaran Lingkungan", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang analisis parameter pencemaran air (BOD, COD, pH, kekeruhan) dan dampaknya pada biota" },
    { label: "Konservasi Satwa & Flora Langka", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang dampak deforestasi terhadap fragmentasi habitat satwa dan kepunahan spesies endemik" },
    { label: "Hemat Energi Listrik", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang audit energi mandiri gedung sekolah dan pemanfaatan panel surya ramah lingkungan" },
    { label: "Pembuatan Kompos Daun Sederhana", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang formulasi rasio C/N kompos, aerasi tumpukan, dan cairan aktivator EM4" },
    { label: "Pola Hidup Bersih & Sehat (PHBS)", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang pencegahan penyakit berbasis lingkungan (DBD, diare, ISPA) dan sanitasi total" },
    { label: "Kesiapsiagaan Bencana Banjir & Longsor", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang pembuatan peta jalur evakuasi bencana dan sistem peringatan dini berbasis warga" },
    { label: "Pemanfaatan Barang Bekas", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang analisis siklus hidup produk (LCA) dan bahaya mikroplastik bagi tanah dan air" },
    { label: "Hutan Mangrove & Perlindungan Pantai", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang zonasi jenis mangrove dan perannya dalam penyimpanan cadangan karbon biru (blue carbon)" },
    { label: "Etika Peduli Alam Sekitar", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang kearifan lokal konservasi nusantara (Subak, Sasi, Hutan Adat Larangan)" }
  ],
  "HARD": [
    { label: "Pemilahan Sampah & Prinsip 3R", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang pemodelan ekonomi sirkular persampahan terpadu (Waste-to-Energy, RDF) dan emisi gas metana TPA" },
    { label: "Konservasi Air & Lubang Biopori", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang mitigasi intrusi air laut ke akuifer air tanah dan rekayasa Water Sensitive Urban Design" },
    { label: "Penghijauan Sekolah & Adiwiyata", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang audit jejak karbon (carbon footprint) institusi pendidikan dan strategi net-zero emission" },
    { label: "Pencegahan Pencemaran Lingkungan", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang bioakumulasi logam berat (merkuri, timbal) serta bioremediasi limbah cair industri" },
    { label: "Konservasi Satwa & Flora Langka", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang perancangan koridor ekologis satwa liar di tengah ekspansi perkebunan dan permukiman" },
    { label: "Hemat Energi Listrik", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang transisi energi terbarukan daerah (mikrohidro, biomassa, solar PV) dan keekonomian tarif hijau" },
    { label: "Pembuatan Kompos Daun Sederhana", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang bioteknologi vermikompos dan pengujian kandungan hara makro (NPK) terstandar SNI" },
    { label: "Pola Hidup Bersih & Sehat (PHBS)", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang epidemiologi penyakit zoonosis akibat degradasi ekologis dan penurunan daya dukung lingkungan" },
    { label: "Kesiapsiagaan Bencana Banjir & Longsor", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang evaluasi tata ruang berbasis daya dukung lingkungan dan analisis zonasi kerentanan bencana" },
    { label: "Pemanfaatan Barang Bekas", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang regulasi extended producer responsibility (EPR) dan pengelolaan limbah elektronik (e-waste) beracun" },
    { label: "Hutan Mangrove & Perlindungan Pantai", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang valuasi ekonomi ekosistem mangrove dan mekanisme perdagangan kredit karbon internasional" },
    { label: "Etika Peduli Alam Sekitar", prompt: "Buatkan soal Pendidikan Lingkungan Hidup tentang integrasi hukum adat konservasi alam ke dalam regulasi formal perda perlindungan lingkungan hidup" }
  ]
};

export const MULOK_INDUSTRI_KREATIF_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    { label: "Subsektor Ekonomi Kreatif Lokal", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang mengenal subsektor ekonomi kreatif dan potensi unggulan di daerah sendiri" },
    { label: "Desain Produk Berbahan Lokal", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang memanfaatkan bahan alam sekitar menjadi produk cinderamata menarik" },
    { label: "Kuliner Kreatif Khas Daerah", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang kreasi kemasan dan variasi rasa makanan tradisional daerah" },
    { label: "Promosi di Media Sosial", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang membuat foto produk yang menarik dan teks promosi di media sosial" },
    { label: "Kerajinan Tangan Etnik Daerah", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang bahan baku dan keunikan produk kerajinan etnik nusantara" },
    { label: "Kemasan Ramah Lingkungan", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang fungsi kemasan pelindung, keindahan, dan bahan kemasan daur ulang" },
    { label: "Potensi Wisata Budaya & Desa Wisata", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang daya tarik wisata budaya, kuliner khas, dan atraksi desa wisata" },
    { label: "Pelayanan Pelanggan yang Ramah", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang etika melayani pembeli dan menerapkan prinsip senyum sapa salam" },
    { label: "Menghitung Harga Jual Sederhana", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang menghitung biaya bahan baku dan menentukan laba penjualan" },
    { label: "Inovasi Motif Tradisional pada Busana", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang aplikasi motif batik atau tenun pada kaos, tas, dan topi modern" },
    { label: "Kerjasama Tim Usaha Kreatif", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang pembagian peran kerja produksi, pemasaran, dan keuangan dalam kelompok" },
    { label: "Mengenal Merek & Logo Produk", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang membuat nama merek yang mudah diingat dan logo sederhana" }
  ],
  "MEDIUM": [
    { label: "Subsektor Ekonomi Kreatif Lokal", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang analisis rantai nilai (value chain) dari bahan baku lokal hingga produk jadi dipasarkan" },
    { label: "Desain Produk Berbahan Lokal", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang penerapan metode Design Thinking dalam mengembangkan prototipe produk kriya lokal" },
    { label: "Kuliner Kreatif Khas Daerah", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang inovasi food styling, sertifikasi halal, dan pengurusan izin edar PIRT olahan pangan daerah" },
    { label: "Promosi di Media Sosial", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang strategi storytelling copywriting, content calendar, dan optimasi reels/tiktok marketing" },
    { label: "Kerajinan Tangan Etnik Daerah", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang standarisasi mutu produk kerajinan etnik dan efisiensi waktu siklus produksi" },
    { label: "Kemasan Ramah Lingkungan", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang anatomi label kemasan (komposisi, barcode, kedaluwarsa) dan psikologi warna desain" },
    { label: "Potensi Wisata Budaya & Desa Wisata", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang penyusunan paket wisata tematik berbasis kearifan lokal dan keterlibatan komunitas warga" },
    { label: "Pelayanan Pelanggan yang Ramah", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang penanganan komplain pelanggan (handling complaints) dan program loyalitas konsumen" },
    { label: "Menghitung Harga Jual Sederhana", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang perhitungan Break Even Point (BEP), margin keuntungan, dan manajemen arus kas" },
    { label: "Inovasi Motif Tradisional pada Busana", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang modifikasi tren fashion ready-to-wear berbasis kain tradisional wastra nusantara" },
    { label: "Kerjasama Tim Usaha Kreatif", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang kolaborasi pentahelix lintas sektor (akademisi, bisnis, komunitas, pemerintah, media)" },
    { label: "Mengenal Merek & Logo Produk", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang prosedur pendaftaran Hak Merek di Ditjen KI dan perlindungan hak cipta desain industri" }
  ],
  "HARD": [
    { label: "Subsektor Ekonomi Kreatif Lokal", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang pemetaan klaster industri kreatif regional dan integrasinya dalam supply chain pasar global" },
    { label: "Desain Produk Berbahan Lokal", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang rekayasa material komposit berbasis serat alam lokal untuk produk kriya ekspor bersertifikasi FSC" },
    { label: "Kuliner Kreatif Khas Daerah", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang teknologi sterilisasi retort dan pemenuhan standar ekspor US FDA / Codex Alimentarius pangan daerah" },
    { label: "Promosi di Media Sosial", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang analisis konversi iklan digital (ROAS, CAC, LTV) dan kampanye omni-channel e-commerce" },
    { label: "Kerajinan Tangan Etnik Daerah", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang sertifikasi Fair Trade internasional dan kurasi produk kerajinan di pameran dagang dunia" },
    { label: "Kemasan Ramah Lingkungan", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang pengembangan bioplastik berbasis singkong/rumput laut untuk kemasan biodegradable komersial" },
    { label: "Potensi Wisata Budaya & Desa Wisata", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang perancangan masterplan Community-Based Tourism (CBT) berstandar sertifikasi UN Tourism" },
    { label: "Pelayanan Pelanggan yang Ramah", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang implementasi Customer Relationship Management (CRM) terotomasi dan audit kepuasan pelanggan" },
    { label: "Menghitung Harga Jual Sederhana", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang analisis kelayakan investasi (NPV, IRR, Payback Period) untuk ekspansi pabrik kreatif lokal" },
    { label: "Inovasi Motif Tradisional pada Busana", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang strategi branding fesyen etnik mewah (luxury ethnic wear) menembus Paris/Milan Fashion Week" },
    { label: "Kerjasama Tim Usaha Kreatif", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang pendirian entitas koperasi produsen kreatif atau perseroan perorangan dan tata kelola GCG" },
    { label: "Mengenal Merek & Logo Produk", prompt: "Buatkan soal Potensi Industri Kreatif Daerah tentang valuasi aset tak berwujud (brand equity) dan litigasi sengketa pelanggaran hak paten desain" }
  ]
};

export const MULOK_BAHASA_DAERAH_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    { label: "Tata Krama & Tingkat Tutur Bahasa", prompt: "Buatkan soal Bahasa Daerah tentang membedakan ragam bahasa santun kepada orang tua dan bahasa akrab kepada teman" },
    { label: "Aksara Tradisional Daerah", prompt: "Buatkan soal Bahasa Daerah tentang mengenal bentuk huruf aksara tradisional daerah dan tanda baca vokalnya" },
    { label: "Sastra Lisan, Pantun & Tembang", prompt: "Buatkan soal Bahasa Daerah tentang bait pantun nasihat, sajak tradisional, dan tembang rakyat daerah" },
    { label: "Ungkapan, Pepatah & Peribahasa Daerah", prompt: "Buatkan soal Bahasa Daerah tentang arti ungkapan kiasan dan peribahasa bijak warisan leluhur daerah" },
    { label: "Cerita Dongeng & Fabel Daerah", prompt: "Buatkan soal Bahasa Daerah tentang tokoh binatang dan pesan moral dalam dongeng fabel daerah" },
    { label: "Kosakata Kekerabatan & Silsilah", prompt: "Buatkan soal Bahasa Daerah tentang sebutan anggota keluarga besar dan garis kekerabatan adat daerah" },
    { label: "Percakapan Santun Sehari-hari", prompt: "Buatkan soal Bahasa Daerah tentang dialog perkenalan diri, meminta maaf, dan berpamitan dengan sopan" },
    { label: "Teka-teki & Permainan Kata Daerah", prompt: "Buatkan soal Bahasa Daerah tentang teka-teki kata tradisional dan permainan bahasa anak daerah" },
    { label: "Peralatan Tradisional & Istilah Budaya", prompt: "Buatkan soal Bahasa Daerah tentang nama alat dapur tradisional, perkakas pertanian, dan perlengkapan adat" },
    { label: "Busana & Perlengkapan Adat Daerah", prompt: "Buatkan soal Bahasa Daerah tentang kosakata nama kain tradisional, ikat kepala, dan aksesoris adat" },
    { label: "Lirik Lagu & Tembang Dolanan Daerah", prompt: "Buatkan soal Bahasa Daerah tentang makna lirik lagu dolanan anak dan tembang tradisional daerah" },
    { label: "Pidato Sederhana Berbahasa Daerah", prompt: "Buatkan soal Bahasa Daerah tentang kata pembuka dan penutup pidato santun dalam bahasa daerah" }
  ],
  "MEDIUM": [
    { label: "Tata Krama & Tingkat Tutur Bahasa", prompt: "Buatkan soal Bahasa Daerah tentang mengubah kalimat percakapan loma/kasar menjadi ragam bahasa halus dan terhormat" },
    { label: "Aksara Tradisional Daerah", prompt: "Buatkan soal Bahasa Daerah tentang membaca dan menyalin kata berpasangan serta bersandhangan dalam aksara daerah" },
    { label: "Sastra Lisan, Pantun & Tembang", prompt: "Buatkan soal Bahasa Daerah tentang aturan rima persajakan, pola guru lagu, dan makna puitis tembang daerah" },
    { label: "Ungkapan, Pepatah & Peribahasa Daerah", prompt: "Buatkan soal Bahasa Daerah tentang mengaitkan makna filosofi peribahasa daerah dengan pemecahan masalah kehidupan sehari-hari" },
    { label: "Cerita Dongeng & Fabel Daerah", prompt: "Buatkan soal Bahasa Daerah tentang menganalisis penokohan, latar budaya, dan konflik moral dalam cerita rakyat daerah" },
    { label: "Kosakata Kekerabatan & Silsilah", prompt: "Buatkan soal Bahasa Daerah tentang sistem kekerabatan adat (patrilineal/matrilineal/bilateral) dan terminologi resminya" },
    { label: "Percakapan Santun Sehari-hari", prompt: "Buatkan soal Bahasa Daerah tentang studi kasus etika dialog bertamu dan musyawarah keluarga berbahasa santun" },
    { label: "Teka-teki & Permainan Kata Daerah", prompt: "Buatkan soal Bahasa Daerah tentang membedah kecerdasan logika dan permainan bunyi metafora dalam teka-teki bahasa daerah" },
    { label: "Peralatan Tradisional & Istilah Budaya", prompt: "Buatkan soal Bahasa Daerah tentang fungsi kerja dan makna simbolik peralatan tradisional warisan nenek moyang" },
    { label: "Busana & Perlengkapan Adat Daerah", prompt: "Buatkan soal Bahasa Daerah tentang tata busana adat upacara resmi dan nilai simbolis pengikatan kain wastra" },
    { label: "Lirik Lagu & Tembang Dolanan Daerah", prompt: "Buatkan soal Bahasa Daerah tentang menganalisis kritik sosial dan ajaran budi pekerti yang tersirat dalam tembang daerah" },
    { label: "Pidato Sederhana Berbahasa Daerah", prompt: "Buatkan soal Bahasa Daerah tentang struktur retorika pidato adat (pembuka, puji syukur, isi, permohonan maaf, penutup)" }
  ],
  "HARD": [
    { label: "Tata Krama & Tingkat Tutur Bahasa", prompt: "Buatkan soal Bahasa Daerah tentang menganalisis dinamika pergeseran sosiolinguistik tingkat tutur bahasa daerah di era modern" },
    { label: "Aksara Tradisional Daerah", prompt: "Buatkan soal Bahasa Daerah tentang filologi transliterasi teks naskah kuno beraksara daerah dan kritik teks filologis" },
    { label: "Sastra Lisan, Pantun & Tembang", prompt: "Buatkan soal Bahasa Daerah tentang membedah struktur estetika metrum tembang klasik daerah dan filosofi mistik sufistik di dalamnya" },
    { label: "Ungkapan, Pepatah & Peribahasa Daerah", prompt: "Buatkan soal Bahasa Daerah tentang kajian etnolinguistik peribahasa daerah sebagai cerminan pandangan dunia (worldview) leluhur" },
    { label: "Cerita Dongeng & Fabel Daerah", prompt: "Buatkan soal Bahasa Daerah tentang analisis strukturalisme Lévi-Strauss terhadap mitos dan legenda cerita rakyat daerah nusantara" },
    { label: "Kosakata Kekerabatan & Silsilah", prompt: "Buatkan soal Bahasa Daerah tentang hukum adat waris dan hierarki silsilah kekerabatan marga/trah adat daerah" },
    { label: "Percakapan Santun Sehari-hari", prompt: "Buatkan soal Bahasa Daerah tentang analisis wacana kritis diplomasi adat dan resolusi konflik berbasis musyawarah mufakat bahasa daerah" },
    { label: "Teka-teki & Permainan Kata Daerah", prompt: "Buatkan soal Bahasa Daerah tentang semiotika linguistik dan dekonstruksi makna ganda dalam sastra lisan teka-teki daerah" },
    { label: "Peralatan Tradisional & Istilah Budaya", prompt: "Buatkan soal Bahasa Daerah tentang etnoarkeologi artefak peralatan tradisional dan kesinambungan fungsi budayanya" },
    { label: "Busana & Perlengkapan Adat Daerah", prompt: "Buatkan soal Bahasa Daerah tentang kode semiotika stratifikasi sosial dalam tata kelola busana adat keraton/istana daerah" },
    { label: "Lirik Lagu & Tembang Dolanan Daerah", prompt: "Buatkan soal Bahasa Daerah tentang hermeneutika teks sastra lisan tembang kuno dalam mengungkap peristiwa sejarah masa lampau" },
    { label: "Pidato Sederhana Berbahasa Daerah", prompt: "Buatkan soal Bahasa Daerah tentang menganalisis gaya oratori pranata adicara/pasambahan adat tingkat tinggi dalam upacara sakral" }
  ]
};

export const MULOK_GENERIC_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    { label: "Kesenian & Budaya Daerah", prompt: "Buatkan soal Muatan Lokal tentang mengenal kesenian tari, musik tradisional, dan rumah adat daerah nusantara" },
    { label: "Kearifan Lokal & Adat Istiadat", prompt: "Buatkan soal Muatan Lokal tentang tradisi gotong royong dan upacara adat penyambutan tamu daerah" },
    { label: "Kuliner & Panganan Tradisional", prompt: "Buatkan soal Muatan Lokal tentang makanan khas daerah, bahan baku lokal, dan cara pembuatannya" },
    { label: "Keterampilan Kerajinan Tangan Daerah", prompt: "Buatkan soal Muatan Lokal tentang membuat kerajinan anyaman bambu, batik, dan gerabah sederhana" },
    { label: "Bahasa & Sastra Daerah", prompt: "Buatkan soal Muatan Lokal tentang tata krama bahasa daerah santun dan cerita dongeng rakyat lokal" },
    { label: "Kelestarian Lingkungan Hidup Daerah", prompt: "Buatkan soal Muatan Lokal tentang memilah sampah, menanam pohon, dan menjaga kebersihan sungai daerah" },
    { label: "Potensi Wisata & Cinderamata Daerah", prompt: "Buatkan soal Muatan Lokal tentang tempat wisata alam lokal dan suvenir khas daerah" },
    { label: "Permainan Tradisional Anak", prompt: "Buatkan soal Muatan Lokal tentang aturan permainan tradisional dan nilai sportivitas bermain bersama" },
    { label: "Pakaian & Busana Adat Daerah", prompt: "Buatkan soal Muatan Lokal tentang nama kelengkapan baju adat dan kain tradisional nusantara" },
    { label: "Tanaman Obat Keluarga (TOGA) Lokal", prompt: "Buatkan soal Muatan Lokal tentang tanaman herbal khas daerah (jahe, kunyit) dan manfaat kesehatannya" },
    { label: "Etika & Budi Pekerti Masyarakat Daerah", prompt: "Buatkan soal Muatan Lokal tentang sikap hormat kepada orang tua dan sopan santun bertetangga" },
    { label: "Sejarah Asal-Usul Nama Daerah", prompt: "Buatkan soal Muatan Lokal tentang cerita sejarah berdirinya kota/daerah dan tokoh pejuang lokal" }
  ],
  "MEDIUM": [
    { label: "Kesenian & Budaya Daerah", prompt: "Buatkan soal Muatan Lokal tentang keterpaduan unsur estetika tari tradisional dan klasifikasi instrumen musik daerah" },
    { label: "Kearifan Lokal & Adat Istiadat", prompt: "Buatkan soal Muatan Lokal tentang nilai luhur kearifan lokal dalam menjaga ketahanan sosial dan kerukunan warga" },
    { label: "Kuliner & Panganan Tradisional", prompt: "Buatkan soal Muatan Lokal tentang standarisasi higienitas olahan kuliner warisan lokal dan kemasan modern" },
    { label: "Keterampilan Kerajinan Tangan Daerah", prompt: "Buatkan soal Muatan Lokal tentang teknik pengolahan bahan serat alam dan kalkulasi biaya produksi cinderamata" },
    { label: "Bahasa & Sastra Daerah", prompt: "Buatkan soal Muatan Lokal tentang analisis pesan moral cerita legenda daerah dan penerapan bahasa santun resmi" },
    { label: "Kelestarian Lingkungan Hidup Daerah", prompt: "Buatkan soal Muatan Lokal tentang konservasi sumber daya air, lubang biopori, dan pengelolaan bank sampah terpadu" },
    { label: "Potensi Wisata & Cinderamata Daerah", prompt: "Buatkan soal Muatan Lokal tentang pengembangan desa wisata berbasis komunitas lokal dan promosi digital" },
    { label: "Permainan Tradisional Anak", prompt: "Buatkan soal Muatan Lokal tentang menganalisis nilai karakter gotong royong dan ketangkasan fisik permainan tradisional" },
    { label: "Pakaian & Busana Adat Daerah", prompt: "Buatkan soal Muatan Lokal tentang makna simbolik corak motif wastra adat dan kelengkapan tata rias pengantin" },
    { label: "Tanaman Obat Keluarga (TOGA) Lokal", prompt: "Buatkan soal Muatan Lokal tentang budidaya pembibitan tanaman herbal lokal dan pengolahan minuman kesehatan higienis" },
    { label: "Etika & Budi Pekerti Masyarakat Daerah", prompt: "Buatkan soal Muatan Lokal tentang studi kasus penerapan etika musyawarah mufakat menghadapi konflik sosial" },
    { label: "Sejarah Asal-Usul Nama Daerah", prompt: "Buatkan soal Muatan Lokal tentang menganalisis peninggalan prasasti/cagar budaya lokal dalam pembentukan identitas daerah" }
  ],
  "HARD": [
    { label: "Kesenian & Budaya Daerah", prompt: "Buatkan soal Muatan Lokal tentang transformasi seni tradisi di era globalisasi dan strategi perlindungan Warisan Budaya Takbenda" },
    { label: "Kearifan Lokal & Adat Istiadat", prompt: "Buatkan soal Muatan Lokal tentang integrasi hukum adat kelestarian alam (seperti Subak/Sasi) ke dalam regulasi formal daerah" },
    { label: "Kuliner & Panganan Tradisional", prompt: "Buatkan soal Muatan Lokal tentang gastro-diplomasi pangan khas daerah dan standarisasi retort kemasan ekspor internasional" },
    { label: "Keterampilan Kerajinan Tangan Daerah", prompt: "Buatkan soal Muatan Lokal tentang rekayasa material kriya ramah lingkungan bersertifikasi ekspor dan hak paten desain" },
    { label: "Bahasa & Sastra Daerah", prompt: "Buatkan soal Muatan Lokal tentang revitalisasi bahasa daerah yang terancam punah melalui korpus digital dan kurikulum lokal" },
    { label: "Kelestarian Lingkungan Hidup Daerah", prompt: "Buatkan soal Muatan Lokal tentang pemodelan ekonomi sirkular pengolahan limbah daerah dan audit jejak karbon institusi" },
    { label: "Potensi Wisata & Cinderamata Daerah", prompt: "Buatkan soal Muatan Lokal tentang masterplan Community-Based Tourism berkelanjutan berstandar sertifikasi UN Tourism" },
    { label: "Permainan Tradisional Anak", prompt: "Buatkan soal Muatan Lokal tentang penyusunan kurikulum pelestarian permainan tradisional sebagai media penguatan profil pelajar Pancasila" },
    { label: "Pakaian & Busana Adat Daerah", prompt: "Buatkan soal Muatan Lokal tentang kajian semiotika busana adat kebesaran dan perlindungan motif kain tradisional dari klaim sepihak" },
    { label: "Tanaman Obat Keluarga (TOGA) Lokal", prompt: "Buatkan soal Muatan Lokal tentang bioteknologi kultur jaringan tanaman obat langka endemik berorientasi industri fitofarmaka" },
    { label: "Etika & Budi Pekerti Masyarakat Daerah", prompt: "Buatkan soal Muatan Lokal tentang rekonstruksi nilai filosofis kearifan lokal nusantara sebagai filter terhadap dampak negatif disrupsi budaya asing" },
    { label: "Sejarah Asal-Usul Nama Daerah", prompt: "Buatkan soal Muatan Lokal tentang kritik sumber historis terhadap historiografi lokal dan kontribusinya bagi narasi sejarah nasional" }
  ]
};


export const PRANCIS_SUBJECT_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    { label: "Alfabet Prancis & Aksen (L'Alphabet & Accents)", prompt: "Buatkan soal Bahasa Prancis tentang alfabet Prancis A-Z, pelafalan fonetik, dan tanda aksen (accent aigu é, grave è/à/ù, circonflexe ê/â/î/ô/û, tréma ë/ï/ü, cédille ç)" },
    { label: "Salam & Sapaan (Salutations & Politesse)", prompt: "Buatkan soal Bahasa Prancis tentang ungkapan salam, menyapa, dan berpamitan (Bonjour, Bonsoir, Bonne nuit, Salut, Au revoir, À bientôt, Merci, S'il vous plaît)" },
    { label: "Perkenalan Diri (Se Présenter)", prompt: "Buatkan soal Bahasa Prancis tentang memperkenalkan identitas diri (Je m'appelle, J'ai ... ans, Je suis indonésien/indonésienne, J'habite à...)" },
    { label: "Angka & Bilangan 0-100 (Les Nombres)", prompt: "Buatkan soal Bahasa Prancis tentang angka dan berhitung dari 0 sampai 100 (zéro, un, deux, dix, vingt, soixante-dix, quatre-vingts, cent)" },
    { label: "Hari, Bulan, dan Musim (Jours & Mois)", prompt: "Buatkan soal Bahasa Prancis tentang nama-nama hari dalam seminggu (lundi, mardi...), bulan dalam setahun (janvier, février...), dan empat musim" },
    { label: "Kata Sandang Définis & Indéfinis", prompt: "Buatkan soal Bahasa Prancis tentang penggunaan kata sandang tentu (le, la, les, l') dan tidak tentu (un, une, des) berdasarkan gender nomina" },
    { label: "Kata Ganti Orang Subjek (Pronoms Sujets)", prompt: "Buatkan soal Bahasa Prancis tentang subjek pronominal (Je, Tu, Il, Elle, On, Nous, Vous, Ils, Elles) dalam kalimat sederhana" },
    { label: "Verba Dasar: Être dan Avoir", prompt: "Buatkan soal Bahasa Prancis tentang konjugasi kata kerja fondamentale 'être' (ada/adalah) dan 'avoir' (mempunyai) pada bentuk waktu sekarang (Présent de l'indicatif)" },
    { label: "Benda di Kelas & Sekolah (Dans la classe)", prompt: "Buatkan soal Bahasa Prancis tentang kosakata peralatan sekolah dan ruang kelas (le livre, le stylo, le cahier, la table, le tableau)" },
    { label: "Anggota Keluarga (La Famille)", prompt: "Buatkan soal Bahasa Prancis tentang sebutan anggota keluarga inti (le père, la mère, le frère, la sœur, les parents) dan hubungan kekerabatan" },
    { label: "Warna & Pakaian (Couleurs & Vêtements)", prompt: "Buatkan soal Bahasa Prancis tentang kosakata warna (rouge, bleu, vert, blanc...) dan penyesuaian bentuk feminin/maskulin pada nama pakaian" },
    { label: "Menanyakan Waktu & Jam (Quelle heure est-il?)", prompt: "Buatkan soal Bahasa Prancis tentang menanyakan dan menyatakan waktu serta jam dalam format formal maupun sehari-hari (Il est huit heures...)" }
  ],
  "MEDIUM": [
    { label: "Verba Beraturan Kelompok 1 (-ER)", prompt: "Buatkan soal Bahasa Prancis tentang konjugasi kata kerja berakhiran -er pada Présent de l'indicatif (Parler, Habiter, Regarder, Aimer) beserta pengecualian ejaan" },
    { label: "Bentuk Kalimat Negasi (Ne... Pas)", prompt: "Buatkan soal Bahasa Prancis tentang membentuk kalimat ingkar menggunakan pola 'ne + verbe + pas' serta perubahan un/une/des menjadi 'de'" },
    { label: "Kata Sifat Kepemilikan (Adjectifs Possessifs)", prompt: "Buatkan soal Bahasa Prancis tentang pemilihan kata sifat kepemilikan (mon/ma/mes, ton/ta/tes, son/sa/ses, notre/nos, votre/vos, leur/leurs) sesuai gender dan jumlah" },
    { label: "Menyusun Kalimat Tanya (L'Interrogation)", prompt: "Buatkan soal Bahasa Prancis tentang 3 cara bertanya (intonasi naik, est-ce que, inversi subjek-kata kerja) dan kata tanya (Où, Quand, Comment, Pourquoi, Qui, Que)" },
    { label: "Verba Kelompok 2 (-IR) & Kelompok 3", prompt: "Buatkan soal Bahasa Prancis tentang konjugasi kata kerja kelompok 2 (Finir, Choisir) dan verba tak beraturan esensial kelompok 3 (Aller, Faire, Venir, Prendre)" },
    { label: "Kata Sifat Kualitatif & Kesesuaian (Accord)", prompt: "Buatkan soal Bahasa Prancis tentang penyesuaian kata sifat (accord des adjectifs) dalam gender (maskulin/feminin) dan jumlah (tunggal/jamak)" },
    { label: "Preposisi Tempat & Negara (En, Au, À)", prompt: "Buatkan soal Bahasa Prancis tentang penggunaan preposisi tempat untuk kota (à) dan negara berdasarkan gender gramatikal (en France, au Japon, aux États-Unis)" },
    { label: "Masa Depan Dekat (Le Futur Proche)", prompt: "Buatkan soal Bahasa Prancis tentang pola kalimat masa depan dekat menggunakan konstruksi 'aller (présent) + verbe infinitif' dalam situasi rencana harian" },
    { label: "Kata Kerja Refleksif / Pronominal", prompt: "Buatkan soal Bahasa Prancis tentang verba pronominal untuk rutinitas sehari-hari (se réveiller, se lever, se doucher, s'habiller) dengan pronom réfléchi (me, te, se, nous, vous, se)" },
    { label: "Kosakata Makanan & Kafe (Au Restaurant)", prompt: "Buatkan soal Bahasa Prancis tentang dialog memesan makanan/minuman di kafe atau restoran (Commander au restaurant: Je voudrais, l'addition s'il vous plaît)" },
    { label: "Kata Sandang Partitif (Du, De la, Des)", prompt: "Buatkan soal Bahasa Prancis tentang penggunaan kata sandang partitif (du, de la, de l', des) untuk benda tak terhitung atau porsi makanan" },
    { label: "Deskripsi Fisik & Karakter Seseorang", prompt: "Buatkan soal Bahasa Prancis tentang mendeskripsikan ciri fisik (grand, petit, cheveux bruns...) dan kepribadian (gentil, intelligent, timide...)" }
  ],
  "HARD": [
    { label: "Le Passé Composé dengan Avoir & Être", prompt: "Buatkan soal HOTS Bahasa Prancis tentang pembentukan waktu lampau Passé Composé, pemilihan kata kerja bantu (avoir vs être), dan kesesuaian participe passé" },
    { label: "L'Imparfait vs Passé Composé", prompt: "Buatkan soal HOTS Bahasa Prancis tentang analisis perbedaan penggunaan L'Imparfait (latar belakang, kebiasaan masa lalu) dan Passé Composé (peristiwa spesifik selesai)" },
    { label: "Pronom Objek COD dan COI (Le, La, Lui...)", prompt: "Buatkan soal HOTS Bahasa Prancis tentang penggantian objek langsung (COD: me, te, le, la, nous, vous, les) dan objek tidak langsung (COI: lui, leur) dalam kalimat" },
    { label: "Kata Ganti Adverbial Y dan EN", prompt: "Buatkan soal HOTS Bahasa Prancis tentang fungsi kata ganti adverbial 'y' (tempat / preposisi à) dan 'en' (kuantitas / preposisi de) serta posisinya dalam kalimat" },
    { label: "Le Futur Simple (Bentuk Waktu Mendatang)", prompt: "Buatkan soal HOTS Bahasa Prancis tentang pembentukan kalimat Futur Simple untuk prediksi masa depan, janji formal, serta akar kata verba tak beraturan" },
    { label: "Le Conditionnel Présent & Kesopanan", prompt: "Buatkan soal HOTS Bahasa Prancis tentang penggunaan Conditionnel Présent untuk ungkapan kesopanan tinggi, permohonan halus, saran (devoir/pouvoir), dan pengandaian 'si'" },
    { label: "Le Subjonctif Présent (Emosi & Keharusan)", prompt: "Buatkan soal HOTS Bahasa Prancis tentang pemicu konjungtif (il faut que, vouloir que, bien que) dan konjugasi Subjonctif Présent" },
    { label: "Kalimat Pasif (La Voix Passive)", prompt: "Buatkan soal HOTS Bahasa Prancis tentang transformasi kalimat aktif menjadi pasif (être + participe passé + par) dalam teks berita atau laporan formal" },
    { label: "Kalimat Pengandaian 'Si' (Hypothèse)", prompt: "Buatkan soal HOTS Bahasa Prancis tentang 3 tingkatan kalimat pengandaian: Si + Présent -> Futur, Si + Imparfait -> Conditionnel Présent, Si + Plus-que-parfait -> Conditionnel Passé" },
    { label: "Pemahaman Membaca Teks Otentik", prompt: "Buatkan soal HOTS Bahasa Prancis berbasis teks artikel berita, ulasan buku, atau surat formal dengan pertanyaan penalaran implisit dan analisis gagasan utama" },
    { label: "Diskursus Argumentatif & Konjungtor Logis", prompt: "Buatkan soal HOTS Bahasa Prancis tentang penggunaan kata penghubung wacana (en revanche, par conséquent, néanmoins, d'ailleurs) dalam paragraf argumentasi" },
    { label: "Sastra & Peradaban Frankofoni", prompt: "Buatkan soal HOTS Bahasa Prancis tentang apresiasi sastra Prancis, sejarah singkat peradaban Prancis, dan persebaran budaya Frankofoni di dunia" }
  ]
};

export const MANDARIN_SUBJECT_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    { label: "Sistem Ejaan Pinyin & 4 Nada (拼音与声调)", prompt: "Buatkan soal Bahasa Mandarin tentang sistem ejaan fonetik Hanyu Pinyin, inisial (shengmu), final (yunmu), dan pelafalan 4 nada utama serta nada netral" },
    { label: "Goresan Dasar Aksara Hanzi (基本笔画)", prompt: "Buatkan soal Bahasa Mandarin tentang pengenalan nama goresan dasar aksara Hanzi (横 héng, 竖 shù, 撇 piě, 捺 nà, 点 diǎn, 折 zhé) dan urutan goresan yang benar" },
    { label: "Radikal Aksara Hanzi Populer (部首)", prompt: "Buatkan soal Bahasa Mandarin tentang mengenali makna radikal aksara Hanzi umum seperti 亻(manusia), 氵(air), 木 (kayu), 口 (mulut), 女 (wanita), dan 忄 (hati)" },
    { label: "Salam & Ungkapan Sehari-hari (问候语)", prompt: "Buatkan soal Bahasa Mandarin tentang ungkapan menyapa dan kesopanan (你好 nǐ hǎo, 早上好 zǎoshang hǎo, 谢谢 xièxie, 不客气 bú kèqi, 对不起 duìbuqǐ, 再见 zàijiàn)" },
    { label: "Angka Mandarin 1-100 (数字)", prompt: "Buatkan soal Bahasa Mandarin tentang penulisan aksara Hanzi dan pelafalan angka 1 sampai 100 (一 到 百), nomor telepon, dan nomor kamar" },
    { label: "Perkenalan Diri Dasar (自我介绍)", prompt: "Buatkan soal Bahasa Mandarin tentang pola kalimat perkenalan diri: nama (我叫...), kewarganegaraan (我是印尼人), dan usia (我...岁)" },
    { label: "Anggota Keluarga (家庭成员)", prompt: "Buatkan soal Bahasa Mandarin tentang sebutan anggota keluarga (爸爸 bàba, 妈妈 māma, 哥哥 gēge, 姐姐 jiějie, 弟弟 dìdi, 妹妹 mèimei, 家 jiā)" },
    { label: "Hari, Bulan, dan Tanggal (日期与星期)", prompt: "Buatkan soal Bahasa Mandarin tentang penyebutan nama hari (星期一 sampai 星期日/天), nama bulan (一月 sampai 十二月), dan tanggal (几月几号)" },
    { label: "Menyatakan Waktu & Jam (时间与几点)", prompt: "Buatkan soal Bahasa Mandarin tentang membaca jam dan menit (点 diǎn, 分 fēn, 半 bàn, 刻 kè) serta keterangan waktu pagi/siang/malam" },
    { label: "Kata Penunjuk: 这 (zhè) & 那 (nà)", prompt: "Buatkan soal Bahasa Mandarin tentang penggunaan kata penunjuk 'ini' (这 zhè) dan 'itu' (那 nà) serta kata tanya 'mana' (哪 nǎ)" },
    { label: "Benda di Kelas & Sekolah (学校用品)", prompt: "Buatkan soal Bahasa Mandarin tentang kosakata perlengkapan sekolah (书 shū, 笔 bǐ, 本子 běnzi, 桌子 zhuōzi, 椅子 yǐzi, 电脑 diànnǎo)" },
    { label: "Warna & Makanan Dasar (颜色与水果)", prompt: "Buatkan soal Bahasa Mandarin tentang kosakata warna dasar (红色, 蓝色, 绿色, 白色, 黑色) dan buah-buahan (苹果, 香蕉, 西瓜)" }
  ],
  "MEDIUM": [
    { label: "Kopula 是 (shì) & Partikel 吗 (ma)", prompt: "Buatkan soal Bahasa Mandarin tentang penggunaan kata kerja kopula 是 (shì - adalah) dan pembentukan kalimat tanya 'ya/tidak' dengan partikel 吗 (ma)" },
    { label: "Kepemilikan dengan Partikel 的 (de)", prompt: "Buatkan soal Bahasa Mandarin tentang fungsi partikel atributif 的 (de) untuk menunjukkan hubungan kepemilikan dan modifikasi kata sifat" },
    { label: "Keberadaan & Kepemilikan: 有 & 没有", prompt: "Buatkan soal Bahasa Mandarin tentang penggunaan 有 (yǒu - mempunyai/ada) dan bentuk ingkarnya 没有 (méiyǒu) dalam kalimat pernyataan dan tanya" },
    { label: "Kata Satuan / Penggolong (量词: 个, 本, 张...)", prompt: "Buatkan soal Bahasa Mandarin tentang pasangan kata bilangan / penggolong yang tepat untuk benda: 个 (gè), 本 (běn - buku), 张 (zhāng - kertas/meja), 支 (zhī - pena), 只 (zhī - hewan kecil)" },
    { label: "Preposisi Tempat 在 (zài - di/berada)", prompt: "Buatkan soal Bahasa Mandarin tentang fungsi 在 (zài) sebagai kata kerja (berada di) dan sebagai preposisi penunjuk lokasi sebelum kata kerja utama" },
    { label: "Struktur Kalimat: Waktu & Tempat", prompt: "Buatkan soal Bahasa Mandarin tentang urutan kata baku dalam kalimat Mandarin: Subjek + Keterangan Waktu + Keterangan Tempat + Kata Kerja + Objek" },
    { label: "Kata Kerja Bantu: 想, 要, 会, 能", prompt: "Buatkan soal Bahasa Mandarin tentang perbedaan nuansa makna kata kerja bantu: 想 (xiǎng - ingin/berpikir), 要 (yào - mau/harus), 会 (huì - bisa/mampu karena belajar), 能 (néng - sanggup)" },
    { label: "Partikel Perubahan Aspek 了 (le)", prompt: "Buatkan soal Bahasa Mandarin tentang fungsi partikel 了 (le) untuk menyatakan penyelesaian tindakan (aspek perfektif) dan perubahan situasi/keadaan baru" },
    { label: "Sedang Berlangsung: 正在 (zhèngzài)", prompt: "Buatkan soal Bahasa Mandarin tentang menyatakan tindakan yang sedang dilakukan menggunakan pola 正在 / 正 / 在 (zhèngzài) di depan kata kerja" },
    { label: "Arah & Petunjuk Lokasi (方位词)", prompt: "Buatkan soal Bahasa Mandarin tentang penunjuk arah dan posisi (前边, 后边, 左边, 右边, 上边, 下边, 里面, 外边) dan menanyakan jalan (怎么走)" },
    { label: "Transaksi & Belanja (买东西与多少钱)", prompt: "Buatkan soal Bahasa Mandarin tentang percakapan transaksi jual-beli, tawar-menawar, dan mata uang (块 kuài, 毛 máo, 多少钱 duōshao qián)" },
    { label: "Hobi dan Waktu Luang (爱好与活动)", prompt: "Buatkan soal Bahasa Mandarin tentang kosakata hobi (看书, 听音乐, 踢足球, 游泳, 画画) dan membuat janji bertemu" }
  ],
  "HARD": [
    { label: "Kalimat Perbandingan dengan 比 (bǐ)", prompt: "Buatkan soal HOTS Bahasa Mandarin tentang struktur perbandingan 比 (bǐ: A 比 B + Adjektiva + Derajat/Selisih) serta perbandingan kesetaraan 跟...一样 (gēn... yíyàng)" },
    { label: "Struktur Kalimat Disposisi 把 (bǎ)", prompt: "Buatkan soal HOTS Bahasa Mandarin tentang pola kalimat 把 (bǎ zì jù): Subjek + 把 + Objek + Kata Kerja + Hasil/Arah/Pelengkap untuk menunjukkan manipulasi benda" },
    { label: "Struktur Kalimat Pasif 被 (bèi)", prompt: "Buatkan soal HOTS Bahasa Mandarin tentang pola kalimat pasif 被 (bèi zì jù: Penerima + 被/叫/让 + Pelaku + Kata Kerja + Pelengkap) dan konteks penggunaannya" },
    { label: "Komplemen Hasil, Arah & Potensial (补语)", prompt: "Buatkan soal HOTS Bahasa Mandarin tentang pelengkap kata kerja: 结果补语 (完, 懂, 见), 趋向补语 (来/去, 上来, 出来), dan 可能补语 (看得懂, 做不完)" },
    { label: "Kalimat Konjungtor Logis (关联词)", prompt: "Buatkan soal HOTS Bahasa Mandarin tentang konjungtor majemuk: 虽然...但是... (meskipun... tapi...), 因为...所以... (karena... maka...), 不但...而且... (bukan hanya... tetapi juga...)" },
    { label: "Perbedaan Sinonim Esensial (辨析近义词)", prompt: "Buatkan soal HOTS Bahasa Mandarin tentang analisis pembeda kata bersinonim seperti 二 (èr) vs 两 (liǎng), 刚才 (gāngcái) vs 刚 (gāng), 常常 (chángcháng) vs 往往 (wǎngwǎng)" },
    { label: "Membaca Teks Aksara Hanzi HSK 3-4 (阅读)", prompt: "Buatkan soal HOTS Bahasa Mandarin berbasis teks narasi atau wacana pendek aksara Hanzi (tanpa Pinyin) dengan pertanyaan analisis isi, penarikan kesimpulan, dan pemaknaan idiom" },
    { label: "Struktur Penekanan 是...的 (shì...de)", prompt: "Buatkan soal HOTS Bahasa Mandarin tentang struktur penekanan waktu, tempat, atau cara dari tindakan masa lalu menggunakan pola 是...的 (shì... de)" },
    { label: "Morfologi & Pembentukan Kata Bahasa Mandarin", prompt: "Buatkan soal HOTS Bahasa Mandarin tentang morfologi pembentukan kata ganda Mandarin, afiksasi, dan penerapan kosakata standar HSK level menengah" },
    { label: "Peribahasa & Idiom 4 Karakter (成语 Chéngyǔ)", prompt: "Buatkan soal HOTS Bahasa Mandarin tentang pemahaman makna filosofis dan konteks penerapan peribahasa 4 karakter populer (马到成功, 一心一意, 入乡随俗...)" },
    { label: "Surat Resmi & Komunikasi Bisnis Dasar", prompt: "Buatkan soal HOTS Bahasa Mandarin tentang format etika korespondensi, undangan resmi, dan salam penutup formal dalam konteks profesional" },
    { label: "Kultur, Filosofi & Festival Tionghoa", prompt: "Buatkan soal HOTS Bahasa Mandarin tentang wawasan budaya Tiongkok (Festival Musim Semi/Imlek, Festival Perahu Naga, Festival Pertengahan Musim Gugur, etika teh)" }
  ]
};

export const ARAB_SUBJECT_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    { label: "Huruf Hijaiyah Tunggal & Makharijul Huruf", prompt: "Buatkan soal Bahasa Arab tentang mengenal 28 Huruf Hijaiyah tunggal (ا sampai ي), bentuk dasar, dan tempat keluarnya bunyi huruf (makharijul huruf)" },
    { label: "Huruf Sambung Hijaiyah (Awal, Tengah, Akhir)", prompt: "Buatkan soal Bahasa Arab tentang kaidah penulisan huruf hijaiyah saat berada di awal, tengah, dan akhir kata serta huruf yang tidak bisa disambung ke depan" },
    { label: "Tanda Harakat, Tanwin & Tasydid", prompt: "Buatkan soal Bahasa Arab tentang fungsi harakat dasar (Fathah, Kasrah, Dhommah, Sukun), harakat ganda Tanwin (an, in, un), dan tanda penekanan Tasydid/Syaddah" },
    { label: "Huruf Syamsiyah & Qamariyah pada Alif Lam (ال)", prompt: "Buatkan soal Bahasa Arab tentang perbedaan hukum bacaan Alif Lam Syamsiyah (lebur/idgham) dan Alif Lam Qamariyah (jelas/izhar) pada kosakata harian" },
    { label: "Sapaan & Ucapan Kesopanan (التحيات)", prompt: "Buatkan soal Bahasa Arab tentang ungkapan salam dan jawaban sapaan resmi maupun santun (السلام عليكم, أهلا وسهلا, صباح الخير, مساء الخير, مع السلامة)" },
    { label: "Perkenalan Diri (التعارف: Ismi & Min Aina)", prompt: "Buatkan soal Bahasa Arab tentang dialog perkenalan diri (اسمِي..., مِنْ أَيْنَ أَنْتَ؟, أَنَا مِنْ..., كَيْفَ حَالُكَ؟, بِخَيْرٍ وَالْحَمْدُ لِلَّهِ)" },
    { label: "Angka Arab 1-100 (الأرقام العربية)", prompt: "Buatkan soal Bahasa Arab tentang lambang angka Arab (١ sampai ١٠٠), pelafalan bilangan 1 sampai 100 (واحد, اثنان... مائة), dan menghitung benda sederhana" },
    { label: "Peralatan Sekolah & Kelas (أدوات المدرسة)", prompt: "Buatkan soal Bahasa Arab tentang mufrodat benda di kelas (قَلَمٌ, كِتَابٌ, دَفْتَرٌ, مِمْسَحَةٌ, مَكْتَبٌ, كُرْسِيٌّ, سَبُّوْرَةٌ, فَصْلٌ)" },
    { label: "Anggota Tubuh Manusia (أعضاء الجسم)", prompt: "Buatkan soal Bahasa Arab tentang mufrodat bagian tubuh (رَأْسٌ, عَيْنٌ, أُذُنٌ, أَنْفٌ, فَمٌ, يَدٌ, رِجْلٌ) dan penggunaan kata ganti kepemilikannya" },
    { label: "Anggota Keluarga (أفراد الأسرة)", prompt: "Buatkan soal Bahasa Arab tentang sebutan anggota keluarga (أَبٌ, أُمٌّ, أَخٌ, أُخْتٌ, جَدٌّ, جَدَّةٌ, عَمٌّ, عَمَّةٌ) dalam struktur kalimat sederhana" },
    { label: "Warna-Warna dalam Bahasa Arab (الألوان)", prompt: "Buatkan soal Bahasa Arab tentang kosakata warna dalam bentuk mudzakkar dan muannats (أَبْيَض/بَيْضَاء, أَسْوَد/سَوْدَاء, أَحْمَر/حَمْرَاء, أَخْضَر/خَضْرَاء)" },
    { label: "Nama-Nama Hari Sepekan (أيام الأسبوع)", prompt: "Buatkan soal Bahasa Arab tentang nama-nama hari dalam sepekan (يوم الأحد, الإثنين, الثلاثاء, الأربعاء, الخميس, الجمعة, السبت)" }
  ],
  "MEDIUM": [
    { label: "Pembagian Kata: Isim, Fi'il, dan Huruf", prompt: "Buatkan soal Bahasa Arab tentang klasifikasi unsur kata (أقسام الكلمة: الاسم, الفعل, الحرف), ciri-ciri khusus isim (tanwin, alif lam, huruf jer) dan ciri fi'il" },
    { label: "Isim Mudzakkar & Muannats (Gender)", prompt: "Buatkan soal Bahasa Arab tentang membedakan kata benda maskulin (Mudzakkar) dan feminin (Muannats) melalui tanda Ta Marbuthah (ة), Alif Maqshurah, atau sifat hakiki" },
    { label: "Bentuk Jumlah: Mufrad, Mutsanna, Jamak", prompt: "Buatkan soal Bahasa Arab tentang perubahan bentuk kata benda tunggal (مفرد), dua (مثنى dengan akhiran انِ/يْنِ), dan jamak (جمع مذكر سالم, جمع مؤنث سالم, جمع تكسير)" },
    { label: "Kata Tunjuk Dekat & Jauh (أسماء الإشارة)", prompt: "Buatkan soal Bahasa Arab tentang penggunaan kata tunjuk dekat (هَذَا, هَذِهِ, هَؤُلَاءِ) dan kata tunjuk jauh (ذَلِكَ, تِلْكَ, أُولَئِكَ) sesuai gender dan bilangan nomina" },
    { label: "Kata Ganti / Isim Dhomir (الضمائر)", prompt: "Buatkan soal Bahasa Arab tentang kata ganti orang terpisah (Dhomir Munfashil: هُوَ, هُمَا, هُمْ, هِيَ... أَنَا, نَحْنُ) dan kata ganti bersambung (Dhomir Muttashil kepemilikan: ـهُ, ـهَا, ـكَ, ـي)" },
    { label: "Huruf Jer dan Tanda I'rab Majrur (حروف الجر)", prompt: "Buatkan soal Bahasa Arab tentang fungsi huruf jer (مِنْ, إِلَى, عَنْ, عَلَى, فِي, رُبَّ, الْبَاء, الْكَاف, اللام) dan harakat akhir kasrah pada isim sesudahnya" },
    { label: "Fi'il Madhi: Waktu Lampau (الفعل الماضي)", prompt: "Buatkan soal Bahasa Arab tentang kata kerja bentuk lampau (Fi'il Madhi: كَتَبَ, ذَهَبَ, قَرَأَ) dan perubahan akhiran sesuai tashrif lughawi 14 dhomir" },
    { label: "Fi'il Mudhari': Sekarang & Akan Datang", prompt: "Buatkan soal Bahasa Arab tentang kata kerja sekarang/akan datang (Fi'il Mudhari': يَكْتُبُ, يَذْهَبُ) serta identifikasi 4 huruf mudhara'ah (أَنَيْتَ)" },
    { label: "Fi'il Amr: Kata Kerja Perintah (فعل الأمر)", prompt: "Buatkan soal Bahasa Arab tentang pembentukan dan penerapan kata kerja perintah (Fi'il Amr: اِقْرَأْ, اُكْتُبْ, اِذْهَبْ) untuk mukhatab laki-laki dan perempuan" },
    { label: "Jumlah Ismiyyah (Mubtada' dan Khabar)", prompt: "Buatkan soal Bahasa Arab tentang susunan kalimat berawalan isim (Jumlah Ismiyyah), kedudukan Mubtada' dan Khabar, serta kesesuaian gender dan jumlah" },
    { label: "Jumlah Fi'liyyah (Fi'il, Fa'il, Ma'ful)", prompt: "Buatkan soal Bahasa Arab tentang susunan kalimat berawalan kata kerja (Jumlah Fi'liyyah), penentuan subjek (Fa'il marfu') dan objek penderita (Ma'ful bih manshub)" },
    { label: "Susunan Idhafah (Mudhaf & Mudhaf Ilaih)", prompt: "Buatkan soal Bahasa Arab tentang susunan frase kepemilikan Idhafah (مضاف ومضاف إليه), aturan hilangnya tanwin/nun pada mudhaf, dan i'rab majrur mudhaf ilaih" }
  ],
  "HARD": [
    { label: "Analisis I'rab: Marfu', Manshub, Majrur, Majzum", prompt: "Buatkan soal HOTS Bahasa Arab tentang analisis i'rab lengkap pada isim dan fi'il: tanda asli (Dhammah, Fathah, Kasrah, Sukun) vs tanda cabang (Wawu, Alif, Ya, Tsubutun Nun)" },
    { label: "Kaidah Kana wa Akhawatuha (كَانَ وَأَخَوَاتُهَا)", prompt: "Buatkan soal HOTS Bahasa Arab tentang pengaruh gramatikal masuknya كَانَ dan saudara-saudaranya (أَصْبَحَ, أَمْسَى, لَيْسَ...) terhadap Mubtada' (menjadi isim kana marfu') dan Khabar (khabar kana manshub)" },
    { label: "Kaidah Inna wa Akhawatuha (إِنَّ وَأَخَوَاتُهَا)", prompt: "Buatkan soal HOTS Bahasa Arab tentang kaidah penegasan إِنَّ dan saudara-saudaranya (أَنَّ, كَأَنَّ, لَكِنَّ, لَيْتَ, لَعَلَّ), isim inna manshub, dan khabar inna marfu'" },
    { label: "Na'at Man'ut: Frasa Sifat dan Kesesuaian", prompt: "Buatkan soal HOTS Bahasa Arab tentang persyaratan kesesuaian antara kata sifat (Na'at) dan kata yang disifati (Man'ut) dalam 4 perkara: i'rab, gender, jumlah, dan ma'rifah/nakirah" },
    { label: "Huruf Nawashib & Jawazim pada Fi'il", prompt: "Buatkan soal HOTS Bahasa Arab tentang kata kerja mudhari' yang didahului amil nawashib (أَنْ, لَنْ, إِذَنْ, كَيْ) menjadi manshub, dan amil jawazim (لَمْ, لَمَّا, لا الناهية, لام الأمر) menjadi majzum" },
    { label: "Zhorof Zaman & Zhorof Makan (Keterangan)", prompt: "Buatkan soal HOTS Bahasa Arab tentang maf'ul fih berupa zhorof zaman (يَوْمًا, لَيْلًا, صَبَاحًا) dan zhorof makan (أَمَامَ, خَلْفَ, فَوْقَ, تَحْتَ) serta kedudukan i'rabnya" },
    { label: "Tashrif Isthilahi Shorof (Wazan Mazid)", prompt: "Buatkan soal HOTS Bahasa Arab tentang ilmu shorof, wazan-wazan tsulatsi mujarrad dan tsulatsi mazid (فَعَّلَ, فَاعَلَ, أَفْعَلَ, تَفَعَّلَ, اِفْتَعَلَ, اِسْتَفْعَلَ) beserta makna tambahannya" },
    { label: "Derivasi Isim Fa'il, Maf'ul & Makan/Zaman", prompt: "Buatkan soal HOTS Bahasa Arab tentang derivasi kata turunan (Isim Musytaq): rumus pembentukan Isim Fa'il (pelaku), Isim Maf'ul (yang dikenai tindakan), serta Isim Tempat dan Waktu" },
    { label: "Kaidah 'Adad Ma'dud (Bilangan & Benda)", prompt: "Buatkan soal HOTS Bahasa Arab tentang aturan kompleks hukum bilangan ('Adad) dan benda yang dihitung (Ma'dud): bilangan 1-2, 3-10, 11-12, 13-19, dan puluhan/ratusan" },
    { label: "Qira'ah & Fahmul Maqru' Teks Arab Gundul", prompt: "Buatkan soal HOTS Bahasa Arab berbasis pemahaman teks wacana sejarah Islam atau artikel berbahasa Arab tanpa harakat (Gundul) dengan pertanyaan eksplisit dan inferensial" },
    { label: "Pengantar Balaghah: Tasybih dan Majaz", prompt: "Buatkan soal HOTS Bahasa Arab tentang pengantar ilmu Balaghah, gaya bahasa perumpamaan (Tasybih: rukun tasybih musyabbah dan musyabbah bih) dalam teks sastra Arab" },
    { label: "Maharah Kitabah: Paragraf & Surat Resmi", prompt: "Buatkan soal HOTS Bahasa Arab tentang keterampilan menulis insya' muwajjah, rekonstruksi kalimat acak menjadi paragraf koheren, dan etika penulisan surat resmi" }
  ]
};

export const JEPANG_SUBJECT_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    { label: "Huruf Hiragana Dasar (A-I-U-E-O sampai N)", prompt: "Buatkan soal Bahasa Jepang tentang mengenali dan membaca 46 huruf Hiragana dasar (tabel Gojuuon: baris A, KA, SA, TA, NA, HA, MA, YA, RA, WA, N)" },
    { label: "Huruf Hiragana: Dakuon & Handakuon", prompt: "Buatkan soal Bahasa Jepang tentang huruf Hiragana dengan tanda tenten (Dakuon: GA, ZA, DA, BA) dan tanda maru (Handakuon: PA)" },
    { label: "Huruf Hiragana Yoon (Gabungan) & Sokuon", prompt: "Buatkan soal Bahasa Jepang tentang huruf gabungan Yoon (kya, kyu, kyo, sha, shu, sho...) dan konsonan ganda sokuon (tsu kecil)" },
    { label: "Huruf Katakana Dasar (Gairaigo Serapan)", prompt: "Buatkan soal Bahasa Jepang tentang membaca dan menulis huruf Katakana dasar untuk kosakata serapan asing (Kamera, Terebi, Pan, Aisukuriimu)" },
    { label: "Pengenalan Huruf Kanji Dasar (Angka & Alam)", prompt: "Buatkan soal Bahasa Jepang tentang mengenali bentuk, coretan, dan makna huruf Kanji dasar (一, 二, 三, 四, 五, 六, 七, 八, 九, 十, 日, 月, 木, 山, 川, 人)" },
    { label: "Salam & Ungkapan Sehari-hari (Aisatsu)", prompt: "Buatkan soal Bahasa Jepang tentang ungkapan salam sehari-hari (Ohayou gozaimasu, Konnichiwa, Konbanwa, Arigatou gozaimasu, Sumimasen, Sayounara)" },
    { label: "Perkenalan Diri (Jikoshoukai)", prompt: "Buatkan soal Bahasa Jepang tentang pola perkenalan diri formal (Hajimemashite, Watashi wa [Nama/Profesi] desu, Douzo yoroshiku onegaishimasu)" },
    { label: "Bilangan & Satuan Jam (~Ji, ~Fun)", prompt: "Buatkan soal Bahasa Jepang tentang angka 1-100 (Ichi, Ni, San...), menyatakan jam (~ji) dan menit (~fun/pun), serta waktu setengah jam (han)" },
    { label: "Hari, Bulan, dan Tanggal (Youbi & Gatsu)", prompt: "Buatkan soal Bahasa Jepang tentang nama-nama hari (Getsuyoubi, Kayoubi...), nama bulan (Ichigatsu...), dan tanggal istimewa (Tsuitachi, Futsuka...)" },
    { label: "Benda di Kelas (Gakkou no Mono)", prompt: "Buatkan soal Bahasa Jepang tentang kosakata peralatan sekolah (Hon, Nooto, Enpitsu, Keshigomu, Tsukue, Isu, Tokei) dalam kalimat tunjuk sederhana" },
    { label: "Kata Tunjuk Benda: Kore, Sore, Are, Dore", prompt: "Buatkan soal Bahasa Jepang tentang penggunaan kata tunjuk benda berdasarkan jarak dari pembicara dan lawan bicara (Kore wa nan desu ka? Sore wa...)" },
    { label: "Anggota Keluarga (Kazoku: Uchi vs Soto)", prompt: "Buatkan soal Bahasa Jepang tentang sebutan keluarga sendiri (Chichi, Haha, Ani, Ane) versus menyebut keluarga orang lain secara hormat (Otousan, Okaasan...)" }
  ],
  "MEDIUM": [
    { label: "Partikel Penanda Subjek & Topik: WA dan GA", prompt: "Buatkan soal Bahasa Jepang tentang fungsi partikel WA (penanda topik utama kalimat) dan partikel GA (penanda subjek spesifik/keberadaan benda)" },
    { label: "Partikel Kepemilikan & Modifikasi: NO", prompt: "Buatkan soal Bahasa Jepang tentang penggunaan partikel NO untuk menunjukkan kepemilikan, hubungan keterangan, dan asal sekolah/negara" },
    { label: "Partikel Objek O (を) dan Arah E (へ)", prompt: "Buatkan soal Bahasa Jepang tentang fungsi partikel O untuk menandai objek kata kerja transitif, dan partikel E untuk menandai arah tujuan perjalanan" },
    { label: "Partikel Tempat & Alat: DE dan NI", prompt: "Buatkan soal Bahasa Jepang tentang perbedaan partikel DE (tempat melakukan aktivitas / alat transportasi) dan partikel NI (tempat keberadaan benda / waktu spesifik)" },
    { label: "Kata Penunjuk Lokasi: Koko, Soko, Asoko, Doko", prompt: "Buatkan soal Bahasa Jepang tentang menanyakan dan menunjukkan lokasi ruangan/tempat (Koko wa kyoushitsu desu, Toire wa doko desu ka?)" },
    { label: "Konjugasi Bentuk Sopan: ~masu / ~mashita", prompt: "Buatkan soal Bahasa Jepang tentang perubahan bentuk kata kerja sopan waktu sekarang positif (~masu), negatif (~masen), lampau (~mashita, ~masendeshita)" },
    { label: "Klasifikasi Kata Kerja: Golongan 1, 2, 3", prompt: "Buatkan soal Bahasa Jepang tentang mengelompokkan kata kerja ke dalam Golongan 1 (Godan doushi), Golongan 2 (Ichidan doushi), dan Golongan 3 (Suru & Kuru)" },
    { label: "Perubahan Kata Kerja Bentuk ~TE (Te-kei)", prompt: "Buatkan soal Bahasa Jepang tentang rumus konjugasi bentuk ~TE untuk kata kerja golongan 1, 2, 3 dan penggunaannya untuk permohonan (~te kudasai)" },
    { label: "Sedang Berlangsung: Pola ~TE IMASU", prompt: "Buatkan soal Bahasa Jepang tentang menyatakan aktivitas yang sedang berlangsung atau keadaan berkelanjutan menggunakan pola ~te imasu" },
    { label: "Kata Sifat I-keiyoushi dan NA-keiyoushi", prompt: "Buatkan soal Bahasa Jepang tentang perubahan kata sifat I (-kunai, -katta) dan NA (-dewa arimasen, -deshita) serta fungsinya menerangkan nomina" },
    { label: "Menyatakan Keinginan: ~TAI DESU & ~HOSHII", prompt: "Buatkan soal Bahasa Jepang tentang pola kalimat menyatakan keinginan melakukan aktivitas (~tai desu) dan menginginkan suatu barang (ga hoshii desu)" },
    { label: "Kata Bantu Bilangan Penggolong (Josuushi)", prompt: "Buatkan soal Bahasa Jepang tentang satuan penghitung benda: ~mai (lembar tipis), ~hon (batang panjang), ~satsu (jilid buku), ~dai (mesin/kendaraan), ~ko (buah kecil)" }
  ],
  "HARD": [
    { label: "Kata Kerja Bentuk Biasa (Futsuukei / Casual)", prompt: "Buatkan soal HOTS Bahasa Jepang tentang konjugasi bentuk biasa/kamus (Jishokei, Nai-kei, Ta-kei, Nakatta-kei) dan penggunaannya dalam percakapan informal" },
    { label: "Bentuk Potensial Kemampuan (Kanoukei)", prompt: "Buatkan soal HOTS Bahasa Jepang tentang rumus pembentukan kata kerja potensial (bisa/mampu: Hanaseru, Taberareru, Dekiru) dan perubahan partikel O menjadi GA" },
    { label: "Bentuk Pasif (Ukemi) dan Kausatif (Shieki)", prompt: "Buatkan soal HOTS Bahasa Jepang tentang pembentukan kalimat pasif (Ukemi) penderitaan/kehormatan dan kausatif (Shieki - menyuruh/mengizinkan) serta analisis maknanya" },
    { label: "Kalimat Bersyarat: ~TARA, ~BA, ~TO, ~NARA", prompt: "Buatkan soal HOTS Bahasa Jepang tentang analisis perbedaan nuansa 4 bentuk pengandaian/kondisional: ~tara (kondisi lampau/waktu), ~ba (syarat logis), ~to (keniscayaan alam), ~nara (topik)" },
    { label: "Bentuk Kehormatan: Sonkeigo dan Kenjougo", prompt: "Buatkan soal HOTS Bahasa Jepang tentang penerapan ragam bahasa hormat Sonkeigo (menghormati lawan bicara) dan bahasa rendah hati Kenjougo (merendahkan diri) dalam konteks bisnis" },
    { label: "Pola Komparatif & Superlatif (Kurabeta)", prompt: "Buatkan soal HOTS Bahasa Jepang tentang perbandingan dua benda (A no hou ga B yori... desu) dan memilih yang paling unggul di antara kelompok (no naka de ... ga ichiban)" },
    { label: "Memberi & Menerima (Ageru, Morau, Kureru)", prompt: "Buatkan soal HOTS Bahasa Jepang tentang kaidah pemberian barang dan jasa (~te ageru, ~te morau, ~te kureru) berdasarkan sudut pandang pembicara dan hierarki sosial" },
    { label: "Dugaan: ~Sou, ~Rashii, ~You, ~Kamoshiremasen", prompt: "Buatkan soal HOTS Bahasa Jepang tentang membedakan nuansa kata penunjuk dugaan berdasarkan panca indra (~sou desu), kabar angin (~rashii), atau probabilitas logis" },
    { label: "Dokkai Membaca Teks JLPT N4/N5", prompt: "Buatkan soal HOTS Bahasa Jepang berbasis wacana cerita pendek atau pengumuman berbahasa Jepang beraksara Kanji dengan pertanyaan pemahaman rinci dan kesimpulan" },
    { label: "Kanji Tingkat Lanjutan & Onyomi/Kunyomi", prompt: "Buatkan soal HOTS Bahasa Jepang tentang kanji gabungan dua/tiga aksara (Jukugo), variasi bacaan Onyomi vs Kunyomi, dan penulisan furigana yang tepat" },
    { label: "Format Surat, Email, dan Etika Bisnis Jepang", prompt: "Buatkan soal HOTS Bahasa Jepang tentang struktur penulisan email formal kepada guru/atasan (Otsukaresama desu, Osewa ni natte orimasu, Yoroshiku onegaiitashimasu)" },
    { label: "Budaya, Etika Kerja & Tradisi Jepang", prompt: "Buatkan soal HOTS Bahasa Jepang tentang pemahaman konsep budaya Jepang (Omotenashi, Hourensou, Honne vs Tatemae, Matsuri, etika membungkuk Ojigi)" }
  ]
};

export const JERMAN_SUBJECT_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    { label: "Das Deutsche Alphabet & Pelafalan Bunyi Khas", prompt: "Buatkan soal Bahasa Jerman tentang mengenali alfabet Jerman (A sampai Z), pelafalan vokal dan konsonan khusus, serta kombinasi diftong (ei, ie, eu, au, äu)" },
    { label: "Huruf Khusus: Vokal Umlaut (Ä, Ö, Ü) & Eszett (ß)", prompt: "Buatkan soal Bahasa Jerman tentang cara membaca, menulis, dan melafalkan vokal bertanda Umlaut (ä, ö, ü) serta huruf khusus Eszett / Scharfes S (ß)" },
    { label: "Begrüßung und Verabschiedung (Salam & Pamit)", prompt: "Buatkan soal Bahasa Jerman tentang ungkapan menyapa dan berpamitan dalam situasi formal dan informal (Hallo, Guten Morgen, Guten Tag, Auf Wiedersehen, Tschüss, Bis bald)" },
    { label: "Sich Vorstellen (Perkenalan Diri)", prompt: "Buatkan soal Bahasa Jerman tentang pola kalimat memperkenalkan diri (Ich heiße..., Mein Name ist..., Ich komme aus..., Ich wohne in..., Ich bin ... Jahre alt)" },
    { label: "Zahlen von 0 bis 100 (Angka & Bilangan)", prompt: "Buatkan soal Bahasa Jerman tentang pengucapan dan penulisan angka 0 sampai 100, termasuk aturan membaca angka satuan sebelum puluhan (zweiundzwanzig)" },
    { label: "Wochentage, Monate und Jahreszeiten", prompt: "Buatkan soal Bahasa Jerman tentang nama hari dalam sepekan (Montag, Dienstag...), bulan (Januar, Februar...), dan empat musim (Frühling, Sommer, Herbst, Winter)" },
    { label: "Personalpronomen im Nominativ (Kata Ganti)", prompt: "Buatkan soal Bahasa Jerman tentang kata ganti orang sebagai subjek (ich, du, er, sie, es, wir, ihr, sie, formal Sie) dalam kalimat berita sederhana" },
    { label: "Verben: Sein und Haben im Präsens", prompt: "Buatkan soal Bahasa Jerman tentang konjugasi kata kerja esensial 'sein' (ada/adalah) dan 'haben' (mempunyai) pada bentuk waktu sekarang (Präsens)" },
    { label: "Schulsachen im Klassenzimmer (Benda di Kelas)", prompt: "Buatkan soal Bahasa Jerman tentang kosakata perlengkapan sekolah beserta artikel gendernya (der Bleistift, das Buch, die Tasche, das Lineal, die Tafel)" },
    { label: "Die Familie (Keluarga & Kekerabatan)", prompt: "Buatkan soal Bahasa Jerman tentang kosakata anggota keluarga inti dan besar (der Vater, die Mutter, die Eltern, der Bruder, die Schwester, die Großeltern)" },
    { label: "Farben und Adjektive (Warna & Sifat Dasar)", prompt: "Buatkan soal Bahasa Jerman tentang nama-nama warna (rot, blau, gelb, grün, schwarz, weiß) dan kata sifat sederhana (groß, klein, schön, alt, neu)" },
    { label: "Die Uhrzeit (Waktu & Jam Formal/Informal)", prompt: "Buatkan soal Bahasa Jerman tentang menanyakan dan menyatakan jam dalam bahasa resmi (z.B. 14:30 Uhr) dan percakapan santai (Viertel, Halb, Vor, Nach)" }
  ],
  "MEDIUM": [
    { label: "Bestimmte & Unbestimmte Artikel (der, die, das)", prompt: "Buatkan soal Bahasa Jerman tentang penentuan gender gramatikal benda maskulin (der), feminin (die), netral (das), serta artikel tak tentu (ein, eine) dan jamak" },
    { label: "Regelmäßige Verben im Präsens (Konjugasi)", prompt: "Buatkan soal Bahasa Jerman tentang rumus akhiran konjugasi kata kerja teratur pada waktu sekarang (Präsens: -e, -st, -t, -en, -t, -en) seperti lernen, kommen, wohnen" },
    { label: "Der Akkusativ (Kasus Objek Langsung)", prompt: "Buatkan soal Bahasa Jerman tentang perubahan artikel pada kasus Akkusativ (der menjadi den, ein menjadi einen, sedangkan die dan das tetap)" },
    { label: "Negation: Nicht vs. Kein/Keine", prompt: "Buatkan soal Bahasa Jerman tentang perbedaan aturan pemakaian kata ingkar 'nicht' (untuk kata kerja/sifat/nama) dan 'kein/keine' (meniadakan kata benda berartikel ein/tanpa artikel)" },
    { label: "Unregelmäßige Verben mit Vokalwechsel", prompt: "Buatkan soal Bahasa Jerman tentang kata kerja tidak beraturan yang mengalami perubahan vokal pada subjek du dan er/sie/es (sprechen -> sprichst, fahren -> fährst, lesen -> liest)" },
    { label: "Trennbare Verben (Awalan Terpisah)", prompt: "Buatkan soal Bahasa Jerman tentang pola kalimat dengan kata kerja awalan terpisah (aufstehen, einkaufen, anrufen, mitkommen) pada klausa utama Präsens" },
    { label: "Modalverben im Präsens (können, müssen...)", prompt: "Buatkan soal Bahasa Jerman tentang konjugasi dan posisi kata kerja bantu modal (können, müssen, dürfen, wollen, sollen, möchten) dengan verba utama di akhir kalimat" },
    { label: "Possessivartikel im Nominativ & Akkusativ", prompt: "Buatkan soal Bahasa Jerman tentang kata sandang kepemilikan (mein/meine, dein/deine, sein/seine, ihr/ihre) dan penyesuaian akhirannya pada kasus Nominativ dan Akkusativ" },
    { label: "Präpositionen mit Akkusativ (für, ohne...)", prompt: "Buatkan soal Bahasa Jerman tentang preposisi yang selalu menuntut kasus Akkusativ (bis, durch, für, gegen, ohne, um) dalam kalimat" },
    { label: "W-Fragen und Ja/Nein-Fragen (Kalimat Tanya)", prompt: "Buatkan soal Bahasa Jerman tentang menyusun pertanyaan dengan kata tanya W (Wer, Was, Wo, Woher, Wohin, Wann, Wie) dan kalimat tanya inversi ya/tidak" },
    { label: "Essen und Trinken im Restaurant (Pemesanan)", prompt: "Buatkan soal Bahasa Jerman tentang kosakata makanan khas, memesan hidangan di restoran (Ich möchte..., Was kostet...?), dan tata cara pembayaran" },
    { label: "Wohnen und Möbel (Rumah & Perabot)", prompt: "Buatkan soal Bahasa Jerman tentang mendeskripsikan tipe tempat tinggal (Wohnung, Haus) dan nama-nama perabot kamar (das Bett, der Schrank, der Tisch)" }
  ],
  "HARD": [
    { label: "Der Dativ (Kasus Objek Tak Langsung)", prompt: "Buatkan soal HOTS Bahasa Jerman tentang perubahan artikel pada kasus Dativ (dem, der, dem, den + n) serta kata kerja khusus yang selalu diikuti Dativ (helfen, danken, gefallen)" },
    { label: "Wechselpräpositionen (Akkusativ vs Dativ)", prompt: "Buatkan soal HOTS Bahasa Jerman tentang 9 preposisi dua arah (an, auf, hinter, in, neben, über, unter, vor, zwischen) berdasarkan konsep perpindahan tempat (Wohin + Akkusativ) vs lokasi diam (Wo + Dativ)" },
    { label: "Das Perfekt mit 'haben' und 'sein'", prompt: "Buatkan soal HOTS Bahasa Jerman tentang pembentukan waktu lampau percakapan (Perfekt), rumus Partizip II (ge-...-t / ge-...-en), dan aturan pemilihan kata kerja bantu sein vs haben" },
    { label: "Das Präteritum der Hilfs- und Modalverben", prompt: "Buatkan soal HOTS Bahasa Jerman tentang pembentukan waktu lampau tertulis Präteritum untuk verba sein (war), haben (hatte), dan modalverben (konnte, musste, wollte)" },
    { label: "Adjektivdeklination (Deklinasi Kata Sifat)", prompt: "Buatkan soal HOTS Bahasa Jerman tentang akhiran kata sifat setelah bestimmter Artikel (Schwache Deklination), unbestimmter Artikel (Gemischte Deklination), dan Nullartikel (Starke Deklination)" },
    { label: "Komparativ und Superlativ (Tingkat Perbandingan)", prompt: "Buatkan soal HOTS Bahasa Jerman tentang pembentukan kata sifat tingkat perbandingan (-er als), superlatif (am ...-sten / der ...-ste), dan bentuk tak teratur (gut, viel, gern)" },
    { label: "Nebensätze mit 'weil', 'dass', 'ob', 'wenn'", prompt: "Buatkan soal HOTS Bahasa Jerman tentang sintaksis anak kalimat (Nebensatz) di mana kata kerja terkonjugasi terdorong ke posisi paling akhir kalimat" },
    { label: "Reflexive Verben im Dativ und Akkusativ", prompt: "Buatkan soal HOTS Bahasa Jerman tentang penggunaan kata kerja refleksif dengan pronomina refleksif (mich/dich vs mir/dir) seperti sich waschen, sich freuen, sich interessieren" },
    { label: "Passiv im Präsens und Präteritum", prompt: "Buatkan soal HOTS Bahasa Jerman tentang transformasi kalimat pasif (werden + Partizip II) dan penentuan pelaku dengan preposisi 'von' atau 'durch'" },
    { label: "Leseverstehen Teks Otentik Goethe A2/B1", prompt: "Buatkan soal HOTS Bahasa Jerman berbasis teks artikel surat kabar, ulasan perjalanan, atau email bisnis pendek dengan pertanyaan penalaran konteks dan kosa kata kontekstual" },
    { label: "Konjunktiv II: Harapan & Kesopanan", prompt: "Buatkan soal HOTS Bahasa Jerman tentang penggunaan Konjunktiv II (hätte, wäre, würde + Infinitiv) untuk menyatakan harapan yang tidak nyata dan permohonan yang sangat sopan" },
    { label: "Landeskunde Kebudayaan Negara DACHL", prompt: "Buatkan soal HOTS Bahasa Jerman tentang geografi, sistem politik, hari libur nasional, dan keragaman dialek negara-negara berbahasa Jerman (DACH)" }
  ]
};

export const KOREA_SUBJECT_TOPICS: SubjectDifficultyMap = {
  "EASY": [
    { label: "Huruf Hangeul (한글): Konsonan Dasar & Ganda", prompt: "Buatkan soal Bahasa Korea tentang pengenalan dan cara membaca 14 konsonan dasar Hangeul (ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅅ, ㅇ, ㅈ, ㅊ, ㅋ, ㅌ, ㅍ, ㅎ) serta 5 konsonan ganda (ㄲ, ㄸ, ㅃ, ㅆ, ㅉ)" },
    { label: "Huruf Hangeul: Vokal Tunggal & Gabungan", prompt: "Buatkan soal Bahasa Korea tentang mengenal 10 vokal tunggal Hangeul (ㅏ, ㅑ, ㅓ, ㅕ, ㅗ, ㅛ, ㅜ, ㅠ, ㅡ, ㅣ) dan 11 vokal diftong/rangkap (ㅐ, ㅒ, ㅔ, ㅖ, ㅘ, ㅙ, ㅚ, ㅝ, ㅞ, ㅟ, ㅢ)" },
    { label: "Struktur Penulisan Suku Kata Blok Hangeul", prompt: "Buatkan soal Bahasa Korea tentang aturan penggabungan huruf konsonan dan vokal menjadi satu suku kata (blok vertikal, horizontal, dan bersusun konsonan akhir)" },
    { label: "Konsonan Akhir / Batchim Dasar (받침)", prompt: "Buatkan soal Bahasa Korea tentang pelafalan 7 bunyi representasi konsonan penutup suku kata (Batchim: ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅇ) pada kata sederhana" },
    { label: "Aturan Pelafalan & Hukum Perubahan Bunyi", prompt: "Buatkan soal Bahasa Korea tentang hukum pelafalan fonetik dasar Hangeul seperti hukum peluluhan / penghubung bunyi (연음 법칙 Yeon-eum) ke vokal berikutnya" },
    { label: "Salam & Ungkapan Dasar (인사말)", prompt: "Buatkan soal Bahasa Korea tentang ungkapan salam sehari-hari (안녕하세요, 안녕히 계세요, 안녕히 가세요, 감사합니다, 죄송합니다, 괜찮아요)" },
    { label: "Perkenalan Diri (자기소개: 저는...입니다)", prompt: "Buatkan soal Bahasa Korea tentang pola perkenalan identitas dasar: nama (저는 ...입니다), kebangsaan (인도네시아 사람입니다), dan pekerjaan/status (학생입니다)" },
    { label: "Sistem Angka Korea Asli & Sino-Korea", prompt: "Buatkan soal Bahasa Korea tentang membedakan angka Sino-Korea (일, 이, 삼... untuk tanggal, menit, harga) dan angka Korea Asli (하나, 둘, 셋... untuk menghitung jumlah dan jam)" },
    { label: "Hari, Bulan, dan Tanggal (요일과 날짜)", prompt: "Buatkan soal Bahasa Korea tentang nama hari (월요일, 화요일, 수요일...), bulan (1월 sampai 12월), dan menyatakan tanggal (몇 월 며칠)" },
    { label: "Menyatakan Waktu & Jam (시간과 몇 시)", prompt: "Buatkan soal Bahasa Korea tentang penggabungan angka Korea asli untuk jam (시) dan angka Sino-Korea untuk menit (분) serta konsep setengah jam (반)" },
    { label: "Benda di Kelas & Sekolah (교실 물건)", prompt: "Buatkan soal Bahasa Korea tentang kosakata perlengkapan sekolah (책, 공책, 연필, 지우개, 책상, 의자, 시계) dalam kalimat penunjuk sederhana" },
    { label: "Anggota Keluarga (가족 호칭)", prompt: "Buatkan soal Bahasa Korea tentang sebutan anggota keluarga (아버지, 어머니, 부모님, 형, 오빠, 누na, 언니, 남동생, 여동생) berdasarkan gender pembicara" }
  ],
  "MEDIUM": [
    { label: "Partikel Subjek: 이/가 (i/ga)", prompt: "Buatkan soal Bahasa Korea tentang fungsi partikel penanda subjek 이 (setelah konsonan) dan 가 (setelah vokal) serta penggunaannya dengan kata sifat/keberadaan" },
    { label: "Partikel Topik: 은/는 (eun/neun)", prompt: "Buatkan soal Bahasa Korea tentang fungsi partikel topik/perbandingan 은 (setelah konsonan) dan 는 (setelah vokal) serta pembedaannya dengan partikel 이/가" },
    { label: "Partikel Objek Penderita: 을/를 (eul/reul)", prompt: "Buatkan soal Bahasa Korea tentang penanda objek kalimat verbal 을 (setelah konsonan) dan 를 (setelah vokal) pada aktivitas sehari-hari" },
    { label: "Akhiran Formal: ~입니다 / ~입니까?", prompt: "Buatkan soal Bahasa Korea tentang pembentukan kalimat formal sopan untuk pernyataan (~입니다) dan pertanyaan (~입니까?)" },
    { label: "Akhiran Informal Sopan: ~아요 / ~어요 / ~여요", prompt: "Buatkan soal Bahasa Korea tentang rumus konjugasi bentuk waktu sekarang informal sopan berdasarkan vokal terang (ㅏ, ㅗ -> ~아요), vokal gelap (~어요), dan kata kerja 하다 (-> ~해요)" },
    { label: "Partikel Tempat & Waktu: ~에 dan ~에서", prompt: "Buatkan soal Bahasa Korea tentang membedakan partikel ~에 (waktu, lokasi keberadaan benda / tujuan pergi) dan ~에서 (lokasi tempat dilakukannya aktivitas)" },
    { label: "Keberadaan Benda: 있다 & 없다", prompt: "Buatkan soal Bahasa Korea tentang menyatakan keberadaan atau kepemilikan benda menggunakan pola [Nomina] + 이/가 있어요/없어요" },
    { label: "Kata Tunjuk Benda & Tempat (이것, 그것, 저것)", prompt: "Buatkan soal Bahasa Korea tentang penunjuk benda dekat pembicara (이것), dekat lawan bicara (그것), dan jauh dari keduanya (저것) serta lokasi (여기, 거기, 저기)" },
    { label: "Bentuk Kalimat Negasi: 안... dan ~지 않아요", prompt: "Buatkan soal Bahasa Korea tentang membuat kalimat ingkar menggunakan kata keterangan negatif pendek 안 (an) dan akhiran negatif panjang ~지 않아요 (~ji anh-ayo)" },
    { label: "Sedang Berlangsung: ~고 있어요", prompt: "Buatkan soal Bahasa Korea tentang menyatakan tindakan yang sedang dilakukan sekarang menggunakan pola kata kerja + ~고 있어요 (~go isseoyo)" },
    { label: "Menyatakan Keinginan: ~고 싶어요", prompt: "Buatkan soal Bahasa Korea tentang pola menyatakan keinginan subjek pertama/kedua (~고 싶어요) dan orang ketiga (~고 싶어해요)" },
    { label: "Satuan Penggolong Benda (단위 명사)", prompt: "Buatkan soal Bahasa Korea tentang kata satuan penggolong untuk menghitung: 개 (buah umum), 명/분 (orang), 마리 (hewan), 권 (buku), 병 (botol), 잔 (cangkir)" }
  ],
  "HARD": [
    { label: "Bentuk Lampau: ~았/었어요", prompt: "Buatkan soal HOTS Bahasa Korea tentang konjugasi kalimat bentuk waktu lampau (~았/었어요) dan lampau sempurna (~었/였었어요) dalam teks cerita" },
    { label: "Bentuk Masa Depan & Rencana: ~(으)ㄹ 거예요", prompt: "Buatkan soal HOTS Bahasa Korea tentang pembentukan kalimat rencana masa depan ~(으)ㄹ 거예요 dan kehendak tekad kuat ~(으)ㄹ게요 / ~겠어요" },
    { label: "Sebab-Akibat: ~아서/어서 vs ~(으)니까", prompt: "Buatkan soal HOTS Bahasa Korea tentang membedakan konjungsi sebab-akibat ~아서/어서 (alasan umum, tidak boleh kalimat ajakan/perintah) dan ~(으)니까 (alasan subjektif, boleh ajakan)" },
    { label: "Urutan Waktu & Kontras: ~고 vs ~(으)ㄴ/는데", prompt: "Buatkan soal HOTS Bahasa Korea tentang penggunaan konjungsi ~고 (penggabungan berurutan) dan ~(으)ㄴ/는데 (latar belakang informasi / pertentangan)" },
    { label: "Permohonan & Larangan: ~(으)세요 & ~지 마세요", prompt: "Buatkan soal HOTS Bahasa Korea tentang pola kalimat instruksi/permohonan sopan ~(으)세요 dan larangan bertindak ~지 마세요 (~ji maseyo)" },
    { label: "Menyatakan Kemampuan: ~(으)ㄹ 수 있다/없다", prompt: "Buatkan soal HOTS Bahasa Korea tentang pola menyatakan kesanggupan atau ketidaksanggupan melakukan perbuatan: ~(으)ㄹ 수 있어요/없어요" },
    { label: "Keharusan & Izin: ~아/어야 하다 & ~아/어도 되다", prompt: "Buatkan soal HOTS Bahasa Korea tentang pola menyatakan kewajiban (~아/어야 해요 - harus) dan meminta/memberikan izin (~아/어도 돼요 - boleh) serta larangannya (~(으)면 안 돼요)" },
    { label: "Honorifik 존댓말 (Jondaetmal) vs 반말 (Banmal)", prompt: "Buatkan soal HOTS Bahasa Korea tentang penggunaan partikel hormat (께, 께서), akhiran kata kerja kehormatan ~(으)시-, dan kosakata khusus honorifik (드시다, 주무시다, 말씀하시다, 진지, 댁)" },
    { label: "Perubahan Konsonan Tak Beraturan (불규칙)", prompt: "Buatkan soal HOTS Bahasa Korea tentang kaidah konjugasi kata kerja tak beraturan: ㅂ 불규칙 (돕다/춥다), ㄷ 불규칙 (듣다), 르 불규칙 (빠르다), ㅎ 불규칙, dan ㅅ 불규칙" },
    { label: "Pengandaian / Syarat: ~(으)면", prompt: "Buatkan soal HOTS Bahasa Korea tentang menyusun kalimat pengandaian jika/apabila ~(으)면 serta bentuk harapan tinggi ~(으)면 좋겠다" },
    { label: "Pemahaman Membaca TOPIK I (읽기)", prompt: "Buatkan soal HOTS Bahasa Korea berbasis teks iklan pengumuman, pesan memo, atau narasi pendek berformat ujian TOPIK dengan pertanyaan analisis inferensial" },
    { label: "Etika Sosial & Budaya Kontemporer Korea", prompt: "Buatkan soal HOTS Bahasa Korea tentang pemahaman etika sosial Korea (budaya membungkuk, etika makan bersama orang tua, Chuseok, Seollal, dan Hallyu)" }
  ]
};

export function getTopicRecommendations(
  subjectName?: string,
  jenjang?: JenjangType,
  grade?: string,
  difficulty: DifficultyType = 'MEDIUM'
): TopicRecommendation[] {
  const effectiveJenjang: JenjangType = grade ? getJenjangFromGrade(grade) : (jenjang || 'SMA');
  const validDiff: DifficultyType = (difficulty === 'EASY' || difficulty === 'HARD') ? difficulty : 'MEDIUM';
  const gradeNum = getGradeNumber(grade);

  // Foreign Languages & Muatan Lokal checks across all grades
  if (subjectName) {
    const s = subjectName.toLowerCase();
    
    // Bahasa Asing & Huruf/Aksara Spesifik
    if (/prancis|perancis|french|francais/i.test(s)) return PRANCIS_SUBJECT_TOPICS[validDiff];
    if (/mandarin|chinese|tionghoa|tiongkok/i.test(s)) return MANDARIN_SUBJECT_TOPICS[validDiff];
    if (/arab|arabic/i.test(s)) return ARAB_SUBJECT_TOPICS[validDiff];
    if (/jepang|japanese|nihongo/i.test(s)) return JEPANG_SUBJECT_TOPICS[validDiff];
    if (/jerman|german|deutsch/i.test(s)) return JERMAN_SUBJECT_TOPICS[validDiff];
    if (/korea|korean|hangul|hangeul/i.test(s)) return KOREA_SUBJECT_TOPICS[validDiff];
    if (/inggris|english/i.test(s)) {
      if (effectiveJenjang === 'SD') return SD_SUBJECT_TOPICS.inggris[validDiff];
      if (effectiveJenjang === 'SMP') return SMP_SUBJECT_TOPICS.inggris[validDiff];
      if (effectiveJenjang === 'SMK') return SMK_SUBJECT_TOPICS.inggris[validDiff];
      return SMA_SUBJECT_TOPICS.inggris[validDiff];
    }

    // Muatan Lokal & Bahasa Daerah
    if (/sunda/i.test(s)) return SUNDA_SUBJECT_TOPICS[validDiff];
    if (/jawa/i.test(s)) return JAWA_SUBJECT_TOPICS[validDiff];
    if (/bali/i.test(s)) return BALI_SUBJECT_TOPICS[validDiff];
    if (/madura|banjar|minang|melayu|bugis|batak|dayak|papua/i.test(s)) return MULOK_BAHASA_DAERAH_TOPICS[validDiff];
    if (/keterampilan\s*daerah|kerajinan\s*daerah/i.test(s)) return MULOK_KETERAMPILAN_TOPICS[validDiff];
    if (/lingkungan\s*hidup|\bplh\b/i.test(s)) return MULOK_PLH_TOPICS[validDiff];
    if (/industri\s*kreatif|kreatif\s*daerah/i.test(s)) return MULOK_INDUSTRI_KREATIF_TOPICS[validDiff];
    if (/kesenian|budaya\s*daerah/i.test(s)) return MULOK_KESENIAN_BUDAYA_TOPICS[validDiff];
    if (/bahasa\s*daerah/i.test(s)) return JAWA_SUBJECT_TOPICS[validDiff];
    if (/muatan\s*lokal|\bmulok\b/i.test(s)) return MULOK_GENERIC_TOPICS[validDiff];
  }

  // 1. Grade-Specific Recommendation Engine (Kelas 1 s.d. Kelas 12)
  if (gradeNum && GRADE_TOPICS_DB[gradeNum]) {
    const gradeDb = GRADE_TOPICS_DB[gradeNum];

    // Jika mapel tidak dipilih / Semua Mapel -> tampilkan 12 topik kurikulum spesifik kelas ini
    if (!subjectName || subjectName === 'all' || subjectName.trim() === '') {
      return gradeDb['default'] || DEFAULT_JENJANG_TOPICS[effectiveJenjang][validDiff];
    }

    const s = subjectName.toLowerCase();

    // Mapel Matematika Kelas 1-12
    if (/matematika/i.test(s) && gradeDb['matematika']) {
      return gradeDb['matematika'];
    }

    // Mapel Bahasa Indonesia Kelas 1-12
    if (/indonesia/i.test(s) && gradeDb['indonesia']) {
      return gradeDb['indonesia'];
    }

    // Mapel IPAS (SD 1-6), IPA (SMP 7-9), Fisika (SMA/SMK 10-12)
    if (/ipas|alam dan sosial|\bipa\b|alam\b|sains|fisika/i.test(s)) {
      if (gradeDb['fisika']) return gradeDb['fisika'];
      if (gradeDb['ipa']) return gradeDb['ipa'];
      if (gradeDb['ipas']) return gradeDb['ipas'];
    }

    // Mapel RPL (SMK 10-12)
    if (/rpl|rekayasa perangkat|pplg|coding/i.test(s) && gradeDb['rpl']) {
      return gradeDb['rpl'];
    }

    // Mapel TKJ (SMK 10-12)
    if (/tkj|teknik komputer|tjkt|jaringan/i.test(s) && gradeDb['tkj']) {
      return gradeDb['tkj'];
    }

    // Mapel lainnya: cek database mata pelajaran per jenjang
    if (effectiveJenjang === 'SD') {
      if (/inggris|english/i.test(s)) return SD_SUBJECT_TOPICS.inggris[validDiff];
      if (/pancasila|pkn/i.test(s)) return SD_SUBJECT_TOPICS.pancasila[validDiff];
      if (/seni|budaya|rupa|musik|tari|teater|prakarya|kriya/i.test(s)) return SD_SUBJECT_TOPICS.seni[validDiff];
      if (/pjok|jasmani|olahraga|kesehatan/i.test(s)) return SD_SUBJECT_TOPICS.pjok[validDiff];
      if (/agama|budi pekerti/i.test(s)) return SD_SUBJECT_TOPICS.agama[validDiff];
      if (/muatan lokal|daerah/i.test(s)) return SUNDA_SUBJECT_TOPICS[validDiff];
    } else if (effectiveJenjang === 'SMP') {
      if (/inggris|english/i.test(s)) return SMP_SUBJECT_TOPICS.inggris[validDiff];
      if (/ips|sosial/i.test(s)) return SMP_SUBJECT_TOPICS.ips[validDiff];
      if (/pancasila|pkn/i.test(s)) return SMP_SUBJECT_TOPICS.pancasila[validDiff];
      if (/informatika|komputer/i.test(s)) return SMP_SUBJECT_TOPICS.informatika[validDiff];
      if (/seni|budaya|rupa|musik|tari|teater|prakarya/i.test(s)) return SMP_SUBJECT_TOPICS.seni[validDiff];
      if (/pjok|jasmani|olahraga/i.test(s)) return SMP_SUBJECT_TOPICS.pjok[validDiff];
      if (/agama|budi pekerti/i.test(s)) return SMP_SUBJECT_TOPICS.agama[validDiff];
      if (/muatan lokal|daerah/i.test(s)) return SUNDA_SUBJECT_TOPICS[validDiff];
    } else if (effectiveJenjang === 'SMK') {
      if (/inggris|english/i.test(s)) return SMK_SUBJECT_TOPICS.inggris[validDiff];
      if (/akl|akuntansi|keuangan/i.test(s)) return SMK_SUBJECT_TOPICS.akl[validDiff];
      if (/pkk|kewirausahaan|kreatif/i.test(s)) return SMK_SUBJECT_TOPICS.pkk[validDiff];
      if (/otomotif|tkro|tbsm|kendaraan|motor/i.test(s)) return SMK_SUBJECT_TOPICS.otomotif[validDiff];
      if (/kuliner|tata boga|pastry|bakery/i.test(s)) return SMK_SUBJECT_TOPICS.kuliner[validDiff];
      if (/dkv|desain komunikasi visual|multimedia|animasi/i.test(s)) return SMK_SUBJECT_TOPICS.dkv[validDiff];
      if (/pancasila|pkn/i.test(s)) return SMK_SUBJECT_TOPICS.pancasila[validDiff];
      if (/seni|budaya|kriya/i.test(s)) return SMA_SUBJECT_TOPICS.seni[validDiff];
      if (/indonesia/i.test(s)) return SMA_SUBJECT_TOPICS.indonesia[validDiff];
      if (/pjok|jasmani/i.test(s)) return SMA_SUBJECT_TOPICS.pjok[validDiff];
      if (/agama/i.test(s)) return SMA_SUBJECT_TOPICS.agama[validDiff];
      if (/muatan lokal|daerah/i.test(s)) return SUNDA_SUBJECT_TOPICS[validDiff];
    } else {
      // SMA
      if (/inggris|english/i.test(s)) return SMA_SUBJECT_TOPICS.inggris[validDiff];
      if (/kimia/i.test(s)) return SMA_SUBJECT_TOPICS.kimia[validDiff];
      if (/biologi/i.test(s)) return SMA_SUBJECT_TOPICS.biologi[validDiff];
      if (/sosiologi/i.test(s)) return SMA_SUBJECT_TOPICS.sosiologi[validDiff];
      if (/ekonomi/i.test(s)) return SMA_SUBJECT_TOPICS.ekonomi[validDiff];
      if (/geografi/i.test(s)) return SMA_SUBJECT_TOPICS.geografi[validDiff];
      if (/sejarah/i.test(s)) return SMA_SUBJECT_TOPICS.sejarah[validDiff];
      if (/pancasila|pkn/i.test(s)) return SMA_SUBJECT_TOPICS.pancasila[validDiff];
      if (/seni|budaya|rupa|musik|tari|teater/i.test(s)) return SMA_SUBJECT_TOPICS.seni[validDiff];
      if (/pjok|jasmani|olahraga/i.test(s)) return SMA_SUBJECT_TOPICS.pjok[validDiff];
      if (/agama|budi pekerti/i.test(s)) return SMA_SUBJECT_TOPICS.agama[validDiff];
      if (/informatika|komputer/i.test(s)) return SMP_SUBJECT_TOPICS.informatika[validDiff];
      if (/muatan lokal|daerah/i.test(s)) return SUNDA_SUBJECT_TOPICS[validDiff];
    }

    // Default fallback untuk kelas yang dipilih: 12 topik kurikulum spesifik kelas
    return gradeDb['default'] || DEFAULT_JENJANG_TOPICS[effectiveJenjang][validDiff];
  }

  // 2. Fallback jika jenjang umum tanpa tingkatan kelas spesifik
  if (!subjectName || subjectName === 'all' || subjectName.trim() === '') {
    const def = DEFAULT_JENJANG_TOPICS[effectiveJenjang] || DEFAULT_JENJANG_TOPICS.SMA;
    return def[validDiff] || def['MEDIUM'];
  }

  const s = subjectName.toLowerCase();

  // Jenjang SMP
  if (effectiveJenjang === 'SMP') {
    if (/inggris|english/i.test(s)) return SMP_SUBJECT_TOPICS.inggris[validDiff];
    if (/matematika/i.test(s)) return SMP_SUBJECT_TOPICS.matematika[validDiff];
    if (/indonesia/i.test(s)) return SMP_SUBJECT_TOPICS.indonesia[validDiff];
    if (/ipa|alam|sains/i.test(s)) return SMP_SUBJECT_TOPICS.ipa[validDiff];
    if (/ips|sosial/i.test(s)) return SMP_SUBJECT_TOPICS.ips[validDiff];
    if (/pancasila|pkn/i.test(s)) return SMP_SUBJECT_TOPICS.pancasila[validDiff];
    if (/informatika|komputer/i.test(s)) return SMP_SUBJECT_TOPICS.informatika[validDiff];
    if (/seni|budaya|rupa|musik|tari|teater|prakarya/i.test(s)) return SMP_SUBJECT_TOPICS.seni[validDiff];
    if (/pjok|jasmani|olahraga/i.test(s)) return SMP_SUBJECT_TOPICS.pjok[validDiff];
    if (/agama|budi pekerti/i.test(s)) return SMP_SUBJECT_TOPICS.agama[validDiff];
    if (/muatan lokal|daerah/i.test(s)) return SUNDA_SUBJECT_TOPICS[validDiff];
    return DEFAULT_JENJANG_TOPICS.SMP[validDiff];
  }

  // Jenjang SMK
  if (effectiveJenjang === 'SMK') {
    if (/ipas|alam dan sosial/i.test(s)) return SMK_SUBJECT_TOPICS.ipas[validDiff];
    if (/inggris|english/i.test(s)) return SMK_SUBJECT_TOPICS.inggris[validDiff];
    if (/matematika/i.test(s)) return SMK_SUBJECT_TOPICS.matematika[validDiff];
    if (/rpl|rekayasa perangkat|pplg|coding/i.test(s)) return SMK_SUBJECT_TOPICS.rpl[validDiff];
    if (/tkj|teknik komputer|tjkt|jaringan/i.test(s)) return SMK_SUBJECT_TOPICS.tkj[validDiff];
    if (/akl|akuntansi|keuangan/i.test(s)) return SMK_SUBJECT_TOPICS.akl[validDiff];
    if (/pkk|kewirausahaan|kreatif/i.test(s)) return SMK_SUBJECT_TOPICS.pkk[validDiff];
    if (/otomotif|tkro|tbsm|kendaraan|motor/i.test(s)) return SMK_SUBJECT_TOPICS.otomotif[validDiff];
    if (/kuliner|tata boga|pastry|bakery/i.test(s)) return SMK_SUBJECT_TOPICS.kuliner[validDiff];
    if (/dkv|desain komunikasi visual|multimedia|animasi/i.test(s)) return SMK_SUBJECT_TOPICS.dkv[validDiff];
    if (/pancasila|pkn/i.test(s)) return SMK_SUBJECT_TOPICS.pancasila[validDiff];
    if (/seni|budaya|kriya/i.test(s)) return SMA_SUBJECT_TOPICS.seni[validDiff];
    if (/indonesia/i.test(s)) return SMA_SUBJECT_TOPICS.indonesia[validDiff];
    if (/pjok|jasmani/i.test(s)) return SMA_SUBJECT_TOPICS.pjok[validDiff];
    if (/agama/i.test(s)) return SMA_SUBJECT_TOPICS.agama[validDiff];
    if (/muatan lokal|daerah/i.test(s)) return SUNDA_SUBJECT_TOPICS[validDiff];
    return DEFAULT_JENJANG_TOPICS.SMK[validDiff];
  }

  // Jenjang SD
  if (effectiveJenjang === 'SD') {
    if (/inggris|english/i.test(s)) return SD_SUBJECT_TOPICS.inggris[validDiff];
    if (/matematika/i.test(s)) return SD_SUBJECT_TOPICS.matematika[validDiff];
    if (/indonesia/i.test(s)) return SD_SUBJECT_TOPICS.indonesia[validDiff];
    if (/ipas|alam dan sosial|sains/i.test(s)) return SD_SUBJECT_TOPICS.ipas[validDiff];
    if (/pancasila|pkn/i.test(s)) return SD_SUBJECT_TOPICS.pancasila[validDiff];
    if (/seni|budaya|rupa|musik|tari|teater|prakarya|kriya/i.test(s)) return SD_SUBJECT_TOPICS.seni[validDiff];
    if (/pjok|jasmani|olahraga|kesehatan/i.test(s)) return SD_SUBJECT_TOPICS.pjok[validDiff];
    if (/agama|budi pekerti/i.test(s)) return SD_SUBJECT_TOPICS.agama[validDiff];
    if (/muatan lokal|daerah/i.test(s)) return SUNDA_SUBJECT_TOPICS[validDiff];
    return DEFAULT_JENJANG_TOPICS.SD[validDiff];
  }

  // Jenjang SMA (default)
  if (/inggris|english/i.test(s)) return SMA_SUBJECT_TOPICS.inggris[validDiff];
  if (/matematika/i.test(s)) return SMA_SUBJECT_TOPICS.matematika[validDiff];
  if (/indonesia/i.test(s)) return SMA_SUBJECT_TOPICS.indonesia[validDiff];
  if (/fisika/i.test(s)) return SMA_SUBJECT_TOPICS.fisika[validDiff];
  if (/kimia/i.test(s)) return SMA_SUBJECT_TOPICS.kimia[validDiff];
  if (/biologi/i.test(s)) return SMA_SUBJECT_TOPICS.biologi[validDiff];
  if (/sosiologi/i.test(s)) return SMA_SUBJECT_TOPICS.sosiologi[validDiff];
  if (/ekonomi/i.test(s)) return SMA_SUBJECT_TOPICS.ekonomi[validDiff];
  if (/geografi/i.test(s)) return SMA_SUBJECT_TOPICS.geografi[validDiff];
  if (/sejarah/i.test(s)) return SMA_SUBJECT_TOPICS.sejarah[validDiff];
  if (/pancasila|pkn/i.test(s)) return SMA_SUBJECT_TOPICS.pancasila[validDiff];
  if (/seni|budaya|rupa|musik|tari|teater/i.test(s)) return SMA_SUBJECT_TOPICS.seni[validDiff];
  if (/pjok|jasmani|olahraga/i.test(s)) return SMA_SUBJECT_TOPICS.pjok[validDiff];
  if (/agama|budi pekerti/i.test(s)) return SMA_SUBJECT_TOPICS.agama[validDiff];
  if (/informatika|komputer/i.test(s)) return SMP_SUBJECT_TOPICS.informatika[validDiff];
  if (/muatan lokal|daerah/i.test(s)) return SUNDA_SUBJECT_TOPICS[validDiff];

  return DEFAULT_JENJANG_TOPICS.SMA[validDiff];
}
