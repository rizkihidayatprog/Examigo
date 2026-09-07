import { TopicRecommendation } from './topicRecommendations';

export const GRADE_TOPICS_DB: Record<number, Record<string, TopicRecommendation[]>> = {
  "1": {
    "default": [
      {
        "label": "Mengenal Bilangan 1-10 & Benda Bergambar",
        "prompt": "Buatkan soal tentang mengenal lambang bilangan 1 sampai 10 dan menghitung banyak benda bergambar"
      },
      {
        "label": "Mengenal Huruf Abjad A-Z & Huruf Vokal",
        "prompt": "Buatkan soal tentang mengenal huruf abjad A-Z dan membedakan huruf vokal a, i, u, e, o"
      },
      {
        "label": "Bagian Tubuh & Fungsi 5 Panca Indera",
        "prompt": "Buatkan soal tentang mengenal anggota tubuh luar dan fungsi panca indera penglihatan, pendengaran, dan peraba"
      },
      {
        "label": "Simbol Garuda Pancasila & Doa Belajar",
        "prompt": "Buatkan soal tentang mengenal lambang negara burung Garuda dan kebiasaan berdoa sebelum belajar"
      },
      {
        "label": "Penjumlahan Bilangan 1-10 dengan Gambar Buah",
        "prompt": "Buatkan soal tentang penjumlahan sederhana 1 sampai 10 menggunakan ilustrasi buah konkret"
      },
      {
        "label": "Membaca Suku Kata Sederhana (ba, bi, bu)",
        "prompt": "Buatkan soal tentang membaca dan mengeja suku kata terbuka dua huruf"
      },
      {
        "label": "Benda Hidup dan Benda Tak Hidup di Rumah",
        "prompt": "Buatkan soal tentang membedakan makhluk hidup tanaman/hewan dan benda mati meja/batu"
      },
      {
        "label": "Aturan Rumah: Bangun Pagi & Merapikan Mainan",
        "prompt": "Buatkan soal tentang mematuhi aturan sehari-hari merapikan tempat tidur dan tempat bermain"
      },
      {
        "label": "Mengenal Warna Primer & Bentuk Garis",
        "prompt": "Buatkan soal tentang mengenal warna merah, kuning, biru dan membuat garis lurus atau lengkung"
      },
      {
        "label": "Gerak Dasar Jalan, Lari, dan Melompat",
        "prompt": "Buatkan soal tentang mempraktikkan gerak dasar lokomotor berjalan santai dan melompat"
      },
      {
        "label": "English Greetings & Numbers 1-10",
        "prompt": "Buatkan soal Bahasa Inggris tentang salam Good morning, Hello, dan menghitung angka 1 to 10"
      },
      {
        "label": "Mengucap Basmalah & Berbuat Baik Teman",
        "prompt": "Buatkan soal tentang membaca Bismillah sebelum beraktivitas dan menyayangi teman bermain"
      }
    ],
    "matematika": [
      {
        "label": "Mengenal Lambang Bilangan 1 sampai 10",
        "prompt": "Buatkan soal tentang menghitung jumlah buah dan menuliskan lambang angka 1 sampai 10"
      },
      {
        "label": "Mengenal Bilangan 11 sampai 20",
        "prompt": "Buatkan soal tentang membilang benda konkret 11 sampai 20 secara urut"
      },
      {
        "label": "Penjumlahan Bilangan 1-10 Konkret",
        "prompt": "Buatkan soal tentang penjumlahan dua kelompok benda konkret dengan hasil sampai 10"
      },
      {
        "label": "Pengurangan Bilangan 1-10 Sisa Benda",
        "prompt": "Buatkan soal tentang pengurangan sederhana 1 sampai 10 dari sisa benda yang diambil"
      },
      {
        "label": "Membandingkan Banyak Benda (Lebih / Kurang)",
        "prompt": "Buatkan soal tentang membandingkan kelompok benda memakai kata lebih banyak atau lebih sedikit"
      },
      {
        "label": "Bangun Segitiga, Segiempat, dan Lingkaran",
        "prompt": "Buatkan soal tentang mengelompokkan bentuk bangun datar segitiga, segiempat, dan lingkaran"
      },
      {
        "label": "Mengurutkan Bilangan 1-20 dari Terkecil",
        "prompt": "Buatkan soal tentang menyusun deret bilangan acak 1 sampai 20 dari yang paling kecil"
      },
      {
        "label": "Melanjutkan Pola Warna dan Bentuk",
        "prompt": "Buatkan soal tentang menentukan lanjutan pola warna berulang merah-kuning-merah"
      },
      {
        "label": "Mengukur Panjang dengan Jengkal Tangan",
        "prompt": "Buatkan soal tentang mengukur panjang pensil atau buku memakai satuan tidak baku jengkal"
      },
      {
        "label": "Mengenal Waktu Pagi, Siang, dan Malam",
        "prompt": "Buatkan soal tentang menghubungkan waktu pagi, siang, dan malam dengan aktivitas anak"
      },
      {
        "label": "Membedakan Ukuran Benda Besar dan Kecil",
        "prompt": "Buatkan soal tentang membedakan benda berukuran besar, sedang, dan kecil di kelas"
      },
      {
        "label": "Membaca Jam Analog Tepat Waktu (Pukul 07.00)",
        "prompt": "Buatkan soal tentang membaca posisi jarum jam dinding saat menunjukkan waktu tepat"
      }
    ],
    "indonesia": [
      {
        "label": "Mengenal Huruf Abjad A sampai Z",
        "prompt": "Buatkan soal tentang membedakan huruf besar kapital dan huruf kecil A sampai Z"
      },
      {
        "label": "Mengenal Huruf Vokal dan Huruf Konsonan",
        "prompt": "Buatkan soal tentang menemukan huruf vokal a, i, u, e, o pada kata benda sederhana"
      },
      {
        "label": "Mengeja Suku Kata (ba, ca, da, ma, na)",
        "prompt": "Buatkan soal tentang merangkai suku kata terbuka menjadi sebuah kata bermakna"
      },
      {
        "label": "Kosakata Benda di Dalam Ruang Kelas",
        "prompt": "Buatkan soal tentang menyebutkan nama benda meja, kursi, papan tulis, buku, dan pensil"
      },
      {
        "label": "Melengkapi Kata Bergambar (B_K_ -> BUKU)",
        "prompt": "Buatkan soal tentang melengkapi huruf rumpang nama benda sesuai gambar petunjuk"
      },
      {
        "label": "Membaca Kalimat Pendek 3-4 Kata",
        "prompt": "Buatkan soal tentang memahami arti kalimat sederhana seperti Ibu memasak nasi"
      },
      {
        "label": "Tanda Titik (.) dan Huruf Kapital Nama",
        "prompt": "Buatkan soal tentang membubuhkan tanda titik di akhir kalimat dan huruf besar pada nama teman"
      },
      {
        "label": "Kata Tanya Sederhana: Apa, Siapa, Di Mana",
        "prompt": "Buatkan soal tentang memilih kata tanya apa untuk benda, siapa untuk orang, di mana untuk tempat"
      },
      {
        "label": "Menyimak Cerita Pendek Bergambar",
        "prompt": "Buatkan soal tentang menyebutkan tokoh utama dan perbuatan baiknya dari cerita bergambar 2 kalimat"
      },
      {
        "label": "Kata Ajaib: Tolong, Maaf, Terima Kasih",
        "prompt": "Buatkan soal tentang menggunakan kata tolong saat minta bantuan dan maaf saat bersalah"
      },
      {
        "label": "Kosakata Bagian Tubuh Manusia",
        "prompt": "Buatkan soal tentang menuliskan nama mata, telinga, hidung, tangan, dan kaki"
      },
      {
        "label": "Lawan Kata Sederhana: Bersih - Kotor",
        "prompt": "Buatkan soal tentang menentukan lawan kata sederhana seperti besar-kecil, tinggi-pendek"
      }
    ],
    "ipas": [
      {
        "label": "Mengenal Bagian Luar Tubuh Manusia",
        "prompt": "Buatkan soal tentang menyebutkan nama kepala, tangan, kaki, mata, telinga, dan hidung"
      },
      {
        "label": "Fungsi 5 Panca Indera Sehari-hari",
        "prompt": "Buatkan soal tentang mata untuk melihat, telinga mendengar, hidung mencium, lidah mengecap"
      },
      {
        "label": "Kebiasaan Merawat Gigi & Mandi Bersih",
        "prompt": "Buatkan soal tentang cara menggosok gigi sebelum tidur dan mandi dua kali sehari"
      },
      {
        "label": "Membedakan Benda Hidup dan Benda Mati",
        "prompt": "Buatkan soal tentang ciri makhluk hidup yang butuh makan dan benda mati yang tidak bergerak"
      },
      {
        "label": "Hewan Peliharaan di Rumah dan Suaranya",
        "prompt": "Buatkan soal tentang nama kucing, ayam, kelinci serta tiruan bunyi suaranya"
      },
      {
        "label": "Bagian Luar Tumbuhan: Daun dan Batang",
        "prompt": "Buatkan soal tentang mengenal daun berwarna hijau, batang pohon, dan bunga mekar"
      },
      {
        "label": "Mengenal Cuaca Hari Cerah dan Hujan",
        "prompt": "Buatkan soal tentang ciri hari cerah matahari terik dan hari hujan memakai payung"
      },
      {
        "label": "Benda Langit di Siang dan Malam Hari",
        "prompt": "Buatkan soal tentang matahari di siang hari serta bulan dan bintang di malam hari"
      },
      {
        "label": "Mengenal Anggota Keluarga Inti di Rumah",
        "prompt": "Buatkan soal tentang sebutan ayah, ibu, kakak, dan adik serta sikap saling menyayangi"
      },
      {
        "label": "Menjaga Kebersihan Rumah & Tempat Sampah",
        "prompt": "Buatkan soal tentang membuang bungkus makanan ke tempat sampah dan merapikan mainan"
      },
      {
        "label": "Makanan Sehat Nasi, Sayur, dan Buah",
        "prompt": "Buatkan soal tentang memilih makanan bergizi untuk sarapan pagi agar tubuh bertenaga"
      },
      {
        "label": "Mengenal Rasa Manis, Asin, dan Asam",
        "prompt": "Buatkan soal tentang rasa gula manis, garam asin, dan jeruk nipis menggunakan lidah"
      }
    ]
  },
  "2": {
    "default": [
      {
        "label": "Penjumlahan & Pengurangan Bilangan s.d. 100",
        "prompt": "Buatkan soal tentang hitung penjumlahan dan pengurangan puluhan bersusun pendek"
      },
      {
        "label": "Nilai Tempat Ratusan, Puluhan, Satuan",
        "prompt": "Buatkan soal tentang menentukan nilai tempat angka pada bilangan ratusan"
      },
      {
        "label": "Menyusun Paragraf Cerita Bergambar Runtut",
        "prompt": "Buatkan soal tentang mengurutkan 3 gambar berseri dan menuliskan kalimat ceritanya"
      },
      {
        "label": "Daur Hidup Hewan Tanpa Metamorfosis (Kucing)",
        "prompt": "Buatkan soal tentang tahapan pertumbuhan anak kucing menjadi kucing dewasa"
      },
      {
        "label": "Konsep Perkalian sebagai Penjumlahan Berulang",
        "prompt": "Buatkan soal tentang mengubah bentuk penjumlahan berulang menjadi kalimat perkalian"
      },
      {
        "label": "Konsep Pembagian sebagai Pengurangan Berulang",
        "prompt": "Buatkan soal tentang membagikan sejumlah kelereng sama rata dengan pengurangan berulang"
      },
      {
        "label": "Menghitung Nilai Uang Logam & Kertas Kecil",
        "prompt": "Buatkan soal tentang menghitung total harga jajan dengan uang pecahan Rp 1.000 sampai Rp 5.000"
      },
      {
        "label": "Ciri Bangun Datar: Jumlah Sisi & Sudut",
        "prompt": "Buatkan soal tentang menghitung jumlah ruas garis dan titik sudut bangun datar"
      },
      {
        "label": "Mengukur Panjang Benda dengan Penggaris (cm)",
        "prompt": "Buatkan soal tentang membaca ukuran panjang pensil menggunakan penggaris dalam sentimeter"
      },
      {
        "label": "Teks Ajakan dan Kalimat Perintah Santun",
        "prompt": "Buatkan soal tentang membedakan kalimat ajakan memakai kata ayo dan mari"
      },
      {
        "label": "Membaca Jam Analog Kelipatan 15 Menit",
        "prompt": "Buatkan soal tentang membaca waktu pukul setengah delapan atau lewat lima belas menit"
      },
      {
        "label": "Penerapan Sila Pancasila di Lingkungan Sekolah",
        "prompt": "Buatkan soal tentang contoh kerja sama membersihkan kelas dan berteman tanpa membeda-bedakan"
      }
    ],
    "matematika": [
      {
        "label": "Penjumlahan Bilangan Bersusun sampai 50",
        "prompt": "Buatkan soal tentang penjumlahan dua angka tanpa teknik menyimpan"
      },
      {
        "label": "Pengurangan Bilangan Bersusun sampai 50",
        "prompt": "Buatkan soal tentang pengurangan dua angka pada soal cerita buah"
      },
      {
        "label": "Nilai Tempat Puluhan dan Satuan Bilangan",
        "prompt": "Buatkan soal tentang menguraikan bilangan dua digit menjadi puluhan dan satuan"
      },
      {
        "label": "Pola Bilangan Loncat 2, 5, dan 10",
        "prompt": "Buatkan soal tentang melanjutkan barisan bilangan loncat genap atau kelipatan lima"
      },
      {
        "label": "Mata Uang Pecahan Rp 1.000 sampai Rp 5.000",
        "prompt": "Buatkan soal tentang menghitung pecahan uang kertas untuk membayar makanan di kantin"
      },
      {
        "label": "Konsep Perkalian Dasar Penjumlahan Berulang",
        "prompt": "Buatkan soal tentang mengubah bentuk 3 + 3 + 3 + 3 menjadi bentuk perkalian 4 x 3"
      },
      {
        "label": "Konsep Pembagian Dasar Pengurangan Berulang",
        "prompt": "Buatkan soal tentang membagikan 12 permen kepada 3 anak sama banyak"
      },
      {
        "label": "Menghitung Banyak Ruas Garis Bangun Datar",
        "prompt": "Buatkan soal tentang menghitung jumlah sisi bangun persegi, segitiga, dan trapesium"
      },
      {
        "label": "Mengukur Panjang dengan Penggaris Sentimeter",
        "prompt": "Buatkan soal tentang membaca panjang penghapus dan pensil pada mistar ukur cm"
      },
      {
        "label": "Membaca Jam Analog Setengah dan Seperempat",
        "prompt": "Buatkan soal tentang posisi jarum panjang jam saat menunjukkan pukul 07.30 dan 07.15"
      },
      {
        "label": "Membaca Diagram Gambar Piktogram Sederhana",
        "prompt": "Buatkan soal tentang membaca data hewan peliharaan siswa dari tabel piktogram 1 gambar mewakili 1"
      },
      {
        "label": "Mengenal Pecahan Sederhana 1/2, 1/3, dan 1/4",
        "prompt": "Buatkan soal tentang menentukan gambar kue atau pizza yang dibagi sama besar"
      }
    ],
    "indonesia": [
      {
        "label": "Menyusun Kata Acak Menjadi Kalimat Bermakna",
        "prompt": "Buatkan soal tentang menyusun kata acak menjadi kalimat tanya atau kalimat berita"
      },
      {
        "label": "Mengurutkan 4 Gambar Berseri Peristiwa Harian",
        "prompt": "Buatkan soal tentang menentukan urutan kronologis cerita anak dari bangun tidur sampai sekolah"
      },
      {
        "label": "Kalimat Ajakan (Ayo, Mari) dan Kalimat Larangan",
        "prompt": "Buatkan soal tentang membedakan ungkapan ajakan ramah dan larangan santun"
      },
      {
        "label": "Menjawab Pertanyaan 5W+1H Bacaan Pendek",
        "prompt": "Buatkan soal tentang membaca teks narasi 3 kalimat lalu menjawab siapa, di mana, dan kapan"
      },
      {
        "label": "Kata Kerja Aktivitas Fisik Sehari-hari",
        "prompt": "Buatkan soal tentang mengenali kata kerja menyiram, menulis, berlari, dan membersihkan"
      },
      {
        "label": "Kalimat Pujian dan Respons Berterima Kasih",
        "prompt": "Buatkan soal tentang memberikan pujian gambar yang bagus kepada teman secara tulus"
      },
      {
        "label": "Penggunaan Tanda Tanya (?) dan Tanda Seru (!)",
        "prompt": "Buatkan soal tentang memilih tanda baca yang sesuai untuk kalimat tanya dan kalimat perintah"
      },
      {
        "label": "Melengkapi Percakapan Rumpang Teman Sekelas",
        "prompt": "Buatkan soal tentang mengisi dialog percakapan saat meminjam buku perpustakaan"
      },
      {
        "label": "Menulis Huruf Tegak Bersambung Sederhana",
        "prompt": "Buatkan soal tentang mengenal aturan bentuk huruf tegak bersambung dan kerapian tulisan"
      },
      {
        "label": "Menemukan Kata Berima Akhir pada Puisi Anak",
        "prompt": "Buatkan soal tentang mencari kata-kata yang bunyi akhirnya sama pada bait puisi"
      },
      {
        "label": "Membuat Pertanyaan dari Jawaban yang Tersedia",
        "prompt": "Buatkan soal tentang menyusun kalimat tanya yang tepat untuk kalimat jawaban tertentu"
      },
      {
        "label": "Menemukan Pesan Kebaikan Cerita Fabel",
        "prompt": "Buatkan soal tentang menyimpulkan sikap tolong-menolong dari dongeng semut dan merpati"
      }
    ],
    "ipas": [
      {
        "label": "Pertumbuhan Hewan Tanpa Metamorfosis",
        "prompt": "Buatkan soal tentang tahapan pertumbuhan ayam dari telur, anak ayam, hingga ayam dewasa"
      },
      {
        "label": "Kebutuhan Dasar Tumbuhan: Air dan Sinar Matahari",
        "prompt": "Buatkan soal tentang akibat jika tanaman hias tidak disiram dan tidak terkena sinar matahari"
      },
      {
        "label": "Membedakan Permukaan Benda Kasar dan Halus",
        "prompt": "Buatkan soal tentang mengelompokkan benda berpermukaan kasar dan halus memakai indera kulit"
      },
      {
        "label": "Memilih Pakaian Sesuai Suhu Udara & Cuaca",
        "prompt": "Buatkan soal tentang alasan memakai jaket saat hujan dingin dan kaos katun saat panas"
      },
      {
        "label": "Sumber Cahaya Alami dan Sumber Cahaya Buatan",
        "prompt": "Buatkan soal tentang membedakan cahaya matahari dan cahaya lampu senter/lilin"
      },
      {
        "label": "Membedakan Bunyi Keras dan Bunyi Lembut",
        "prompt": "Buatkan soal tentang mengelompokkan suara klakson mobil dan suara bisikan daun"
      },
      {
        "label": "Ciri Rumah Sehat dengan Ventilasi Udara",
        "prompt": "Buatkan soal tentang pentingnya jendela dan ventilasi agar sirkulasi udara rumah bersih"
      },
      {
        "label": "Perubahan Wujud Es Mencair Menjadi Air",
        "prompt": "Buatkan soal tentang peristiwa mencairnya es batu saat ditaruh di tempat terbuka"
      },
      {
        "label": "Sikap Merawat Tanaman dan Kebun Sekolah",
        "prompt": "Buatkan soal tentang kegiatan mencabuti rumput liar dan memberi pupuk tanaman"
      },
      {
        "label": "Memilah Sampah Organik Daun dan Plastik",
        "prompt": "Buatkan soal tentang membedakan sampah sisa makanan dan sampah botol plastik"
      },
      {
        "label": "Pentingnya Minum Air Putih dan Tidur Teratur",
        "prompt": "Buatkan soal tentang menjaga kebugaran tubuh dengan istirahat cukup dan minum air putih"
      },
      {
        "label": "Mengenal Lingkungan Alam dan Lingkungan Buatan",
        "prompt": "Buatkan soal tentang membedakan kenampakan alami bukit/sungai dan buatan jalan/jembatan"
      }
    ]
  },
  "3": {
    "default": [
      {
        "label": "Bilangan Cacah sampai 1.000 & Garis Bilangan",
        "prompt": "Buatkan soal tentang membaca, menulis lambang, dan meletakkan bilangan pada garis bilangan"
      },
      {
        "label": "Operasi Penjumlahan Ratusan dengan Teknik Menyimpan",
        "prompt": "Buatkan soal tentang penjumlahan bersusun ratusan pada soal cerita jual beli"
      },
      {
        "label": "Perkalian Dua Digit dengan Satu Digit Bersusun",
        "prompt": "Buatkan soal tentang perkalian ratusan kali satuan dengan langkah runtut"
      },
      {
        "label": "Wujud Benda Padat, Cair, Gas & Sifat Ruangnya",
        "prompt": "Buatkan soal tentang sifat bentuk dan volume pada benda padat, cair, dan gas"
      },
      {
        "label": "Perubahan Wujud: Mencair, Membeku, dan Menguap",
        "prompt": "Buatkan soal tentang contoh peristiwa mencairnya mentega dan membekunya air"
      },
      {
        "label": "Ide Pokok dan Kalimat Utama Paragraf Pendek",
        "prompt": "Buatkan soal tentang menemukan gagasan utama paragraf tentang lingkungan hidup"
      },
      {
        "label": "Simbol Arah Mata Angin dan Membaca Denah Lokasi",
        "prompt": "Buatkan soal tentang membaca denah ruang kelas menggunakan petunjuk arah utara"
      },
      {
        "label": "Kewajiban dan Hak Siswa di Rumah dan Sekolah",
        "prompt": "Buatkan soal tentang membedakan kewajiban belajar dan hak mendapatkan kasih sayang"
      },
      {
        "label": "Konversi Satuan Baku Panjang (Meter ke Sentimeter)",
        "prompt": "Buatkan soal tentang menghitung konversi panjang meja belajar dari meter ke cm"
      },
      {
        "label": "Konversi Satuan Baku Berat (Kilogram ke Gram)",
        "prompt": "Buatkan soal tentang menimbang buah dan mengubah satuan kg menjadi gram"
      },
      {
        "label": "Mengenal Pecahan Sederhana pada Garis Bilangan",
        "prompt": "Buatkan soal tentang membandingkan pecahan 1/2, 1/3, dan 1/4 menggunakan gambar"
      },
      {
        "label": "Keberagaman Suku dan Budaya Daerah Indonesia",
        "prompt": "Buatkan soal tentang menghargai teman yang memiliki pakaian adat dan bahasa daerah berbeda"
      }
    ],
    "matematika": [
      {
        "label": "Membaca dan Menulis Bilangan Cacah s.d. 1.000",
        "prompt": "Buatkan soal tentang menentukan nilai tempat ratusan, puluhan, dan satuan bilangan 3 angka"
      },
      {
        "label": "Penjumlahan Ratusan dengan Teknik Menyimpan",
        "prompt": "Buatkan soal tentang penjumlahan bersusun tiga digit pada soal cerita panen buah"
      },
      {
        "label": "Pengurangan Ratusan dengan Teknik Meminjam",
        "prompt": "Buatkan soal tentang pengurangan bersusun tiga digit sisa barang di toko"
      },
      {
        "label": "Perkalian Bilangan Puluhan dengan Satuan",
        "prompt": "Buatkan soal tentang perkalian bersusun pendek 2 angka kali 1 angka tanpa kalkulator"
      },
      {
        "label": "Pembagian Bilangan Puluhan dengan Satuan",
        "prompt": "Buatkan soal tentang pembagian bersusun pendek bilangan dua angka tanpa sisa"
      },
      {
        "label": "Mengenal Pecahan Senilai Menggunakan Gambar",
        "prompt": "Buatkan soal tentang mencocokkan gambar pecahan 1/2 yang senilai dengan 2/4"
      },
      {
        "label": "Keliling Persegi dan Persegi Panjang Satuan Petak",
        "prompt": "Buatkan soal tentang menghitung keliling bangun datar dengan menghitung kotak satuan tepi"
      },
      {
        "label": "Luas Persegi Menggunakan Petak Persegi Satuan",
        "prompt": "Buatkan soal tentang menghitung luas bangun datar dengan menjumlahkan kotak persegi di dalam"
      },
      {
        "label": "Konversi Satuan Panjang Baku (Meter ke cm)",
        "prompt": "Buatkan soal tentang menghitung panjang pita 2 meter lebih 30 sentimeter menjadi cm"
      },
      {
        "label": "Konversi Satuan Berat Baku (Kg ke Gram)",
        "prompt": "Buatkan soal tentang menghitung berat beras 3 kg sama dengan 3.000 gram"
      },
      {
        "label": "Membaca Waktu Jam dan Menit Kelipatan 5",
        "prompt": "Buatkan soal tentang membaca jam dinding pukul 08.20 atau 09.45"
      },
      {
        "label": "Mengenal Sudut Siku-siku, Lancip, dan Tumpul",
        "prompt": "Buatkan soal tentang mengelompokkan sudut yang besarnya kurang dari atau lebih dari 90 derajat"
      }
    ],
    "indonesia": [
      {
        "label": "Menentukan Gagasan Pokok Paragraf Deskripsi",
        "prompt": "Buatkan soal tentang menemukan gagasan utama paragraf tentang cara merawat hewan"
      },
      {
        "label": "Ciri-Ciri Teks Deskripsi Objek Wisata",
        "prompt": "Buatkan soal tentang menemukan kata-kata panca indera dalam teks penggambaran pantai"
      },
      {
        "label": "Membaca Denah Rumah Menggunakan Arah Mata Angin",
        "prompt": "Buatkan soal tentang menentukan letak pos ronda dan masjid pada denah desa"
      },
      {
        "label": "Penggunaan Imbuhan Awalan me- pada Kata Dasar",
        "prompt": "Buatkan soal tentang pembentukan kata berimbuhan me- seperti menyapu dan mencuci"
      },
      {
        "label": "Penulisan Awalan di- dan Kata Depan di yang Tepat",
        "prompt": "Buatkan soal tentang membedakan penulisan di rumah dipisah dan dimakan disambung"
      },
      {
        "label": "Menyebutkan Watak Tokoh Cerita Dongeng Fabel",
        "prompt": "Buatkan soal tentang menganalisis sifat jujur tokoh kancil atau kura-kura dalam fabel"
      },
      {
        "label": "Menemukan Sinonim dan Antonim Kata Bacaan",
        "prompt": "Buatkan soal tentang mencari persamaan kata gembira dan lawan kata hemat"
      },
      {
        "label": "Menghitung Bait dan Baris pada Puisi Anak",
        "prompt": "Buatkan soal tentang unsur fisik puisi anak jumlah baris dalam satu bait dan rima"
      },
      {
        "label": "Mengisi Formulir Pendaftaran Anggota Perpustakaan",
        "prompt": "Buatkan soal tentang menuliskan data diri lengkap nama, kelas, dan alamat rumah"
      },
      {
        "label": "Menulis Surat Pendek untuk Sahabat Pena",
        "prompt": "Buatkan soal tentang bagian pembuka, isi kabar, dan penutup surat pribadi"
      },
      {
        "label": "Kalimat Transitif Berobjek dan Intransitif",
        "prompt": "Buatkan soal tentang mengidentifikasi subjek, predikat, dan objek pada kalimat sederhana"
      },
      {
        "label": "Penggunaan Tanda Koma (,) untuk Merinci Benda",
        "prompt": "Buatkan soal tentang penulisan tanda koma saat menyebutkan nama buah belanjaan"
      }
    ],
    "ipas": [
      {
        "label": "Wujud Benda Padat, Cair, Gas dan Perubahannya",
        "prompt": "Buatkan soal tentang sifat bentuk benda padat tetap dan benda cair mengikuti wadahnya"
      },
      {
        "label": "Peristiwa Mencair, Membeku, dan Mengembun",
        "prompt": "Buatkan soal tentang contoh peristiwa mencair es, membeku air, dan mengembun tutup gelas"
      },
      {
        "label": "Bagian Tubuh Tumbuhan: Akar, Batang, dan Daun",
        "prompt": "Buatkan soal tentang fungsi akar menyerap air dan daun tempat mengolah makanan"
      },
      {
        "label": "Daur Hidup Kupu-kupu (Metamorfosis Sempurna)",
        "prompt": "Buatkan soal tentang urutan tahapan telur, ulat, kepompong, hingga kupu-kupu"
      },
      {
        "label": "Daur Hidup Belalang (Metamorfosis Tidak Sempurna)",
        "prompt": "Buatkan soal tentang tahapan telur, nimfa tanpa sayap, hingga belalang dewasa"
      },
      {
        "label": "Gaya Dorong dan Gaya Tarik pada Gerak Benda",
        "prompt": "Buatkan soal tentang pengaruh gaya tarikan dan dorongan terhadap gerak sepeda atau meja"
      },
      {
        "label": "Sifat Magnet Menarik Benda Logam Tertentu",
        "prompt": "Buatkan soal tentang benda yang dapat ditarik magnet seperti paku besi dan jarum"
      },
      {
        "label": "Perubahan Energi Listrik Menjadi Panas & Gerak",
        "prompt": "Buatkan soal tentang contoh setrika menghasilkan panas dan kipas angin menghasilkan gerak"
      },
      {
        "label": "Mengenal Kenampakan Alam Pegunungan dan Pantai",
        "prompt": "Buatkan soal tentang membedakan suhu udara dan hasil bumi dataran tinggi dan dataran rendah"
      },
      {
        "label": "Kebutuhan Primer Makanan, Pakaian, dan Rumah",
        "prompt": "Buatkan soal tentang membedakan kebutuhan pokok hidup dan keinginan barang mainan"
      },
      {
        "label": "Simbol-Simbol Peta dan Legenda Lingkungan",
        "prompt": "Buatkan soal tentang arti simbol segitiga merah gunung berapi dan garis biru sungai"
      },
      {
        "label": "Mengenal Rumah Adat dan Pakaian Adat Nusantara",
        "prompt": "Buatkan soal tentang nama rumah adat Joglo, Gadang, dan Tongkonan"
      }
    ]
  },
  "4": {
    "default": [
      {
        "label": "Pecahan Senilai & Bentuk Pecahan Desimal/Persen",
        "prompt": "Buatkan soal tentang menyederhanakan pecahan dan mengubah pecahan ke bentuk persen"
      },
      {
        "label": "Operasi Perkalian & Pembagian Porogapit Bersusun",
        "prompt": "Buatkan soal tentang pembagian ratusan dengan puluhan menggunakan cara bersusun panjang"
      },
      {
        "label": "Proses Fotosintesis pada Tumbuhan Hijau",
        "prompt": "Buatkan soal tentang bahan klorofil, cahaya matahari, CO2, air serta hasil oksigen"
      },
      {
        "label": "Gaya Gesek pada Ban dan Permukaan Jalan",
        "prompt": "Buatkan soal tentang fungsi alur ban kendaraan memperbesar gaya gesek agar tidak selip"
      },
      {
        "label": "Siklus Air: Evaporasi, Kondensasi, dan Presipitasi",
        "prompt": "Buatkan soal tentang tahapan penguapan air laut dan pembentukan awan hujan"
      },
      {
        "label": "Gagasan Pokok dan Gagasan Pendukung Paragraf",
        "prompt": "Buatkan soal tentang membedakan kalimat utama dan kalimat penjelas dalam teks narasi"
      },
      {
        "label": "Teks Prosedur Petunjuk Membuat Jus Buah",
        "prompt": "Buatkan soal tentang mengurutkan langkah-langkah petunjuk pembuatan makanan sehat"
      },
      {
        "label": "Menghitung Keliling & Luas Persegi/Persegi Panjang",
        "prompt": "Buatkan soal tentang menghitung keliling dan luas bangun datar memakai rumus baku"
      },
      {
        "label": "Pengukuran Sudut Menggunakan Busur Derajat",
        "prompt": "Buatkan soal tentang membaca besar sudut satu derajat pada gambar busur ukur"
      },
      {
        "label": "Hubungan Garis Sejajar dan Garis Berpotongan",
        "prompt": "Buatkan soal tentang mengenali contoh garis sejajar rel kereta dan garis tegak lurus"
      },
      {
        "label": "Kegiatan Ekonomi: Produksi, Distribusi, Konsumsi",
        "prompt": "Buatkan soal tentang peran petani sebagai produsen dan pedagang pasar sebagai distributor"
      },
      {
        "label": "Kearifan Lokal dan Gotong Royong Desa",
        "prompt": "Buatkan soal tentang tradisi gotong royong membersihkan saluran air dan kearifan lokal"
      }
    ],
    "matematika": [
      {
        "label": "Pecahan Senilai dan Menyederhanakan Pecahan",
        "prompt": "Buatkan soal tentang menentukan pecahan senilai dengan mengalikan atau membagi pembilang dan penyebut"
      },
      {
        "label": "Penjumlahan & Pengurangan Pecahan Berpenyebut Sama",
        "prompt": "Buatkan soal tentang operasi hitung pecahan biasa berpenyebut sama pada soal cerita kue"
      },
      {
        "label": "Mengubah Pecahan Biasa Menjadi Desimal & Persen",
        "prompt": "Buatkan soal tentang mengubah pecahan 1/4 menjadi 0,25 dan 25%"
      },
      {
        "label": "Pembagian Bersusun Porogapit Tiga Digit",
        "prompt": "Buatkan soal tentang pembagian bilangan ratusan dengan puluhan bersisa atau tanpa sisa"
      },
      {
        "label": "Keliling dan Luas Persegi Rumus Baku",
        "prompt": "Buatkan soal tentang menghitung keliling (4 x sisi) dan luas (sisi x sisi) lantai keramik"
      },
      {
        "label": "Keliling dan Luas Persegi Panjang Rumus Baku",
        "prompt": "Buatkan soal tentang menghitung keliling 2 x (p + l) dan luas p x l lapangan sekolah"
      },
      {
        "label": "Garis Sejajar, Garis Berpotongan, & Berhimpit",
        "prompt": "Buatkan soal tentang mengidentifikasi kedudukan dua garis lurus pada gambar bangun"
      },
      {
        "label": "Mengukur Besar Sudut dengan Busur Derajat",
        "prompt": "Buatkan soal tentang menentukan besar sudut 30, 60, 90, dan 120 derajat pada busur"
      },
      {
        "label": "Hubungan Satuan Panjang (Km, M, Dm, Cm)",
        "prompt": "Buatkan soal tentang menghitung jarak perjalanan dengan konversi kilometer ke meter"
      },
      {
        "label": "Hubungan Satuan Berat (Kg, Hektogram, Gram)",
        "prompt": "Buatkan soal tentang menghitung berat belanjaan dapur menggunakan tangga konversi"
      },
      {
        "label": "Membaca dan Membuat Diagram Batang Tunggal",
        "prompt": "Buatkan soal tentang menyajikan data tinggi badan siswa ke dalam diagram batang vertikal"
      },
      {
        "label": "Pembulatan dan Penaksiran Bilangan Cacah",
        "prompt": "Buatkan soal tentang menaksir hasil belanjaan ke puluhan atau ratusan terdekat"
      }
    ],
    "indonesia": [
      {
        "label": "Menemukan Gagasan Pokok dan Gagasan Pendukung",
        "prompt": "Buatkan soal tentang menentukan kalimat utama dan beberapa kalimat penjelas dalam paragraf"
      },
      {
        "label": "Menulis Teks Petunjuk Membuat Sesuatu",
        "prompt": "Buatkan soal tentang menyusun teks petunjuk langkah-langkah membuat layang-layang runtut"
      },
      {
        "label": "Daftar Pertanyaan Wawancara Narasumber Petani",
        "prompt": "Buatkan soal tentang menyusun 5 pertanyaan wawancara menggunakan kata tanya Adiksimba santun"
      },
      {
        "label": "Makna Majas Personifikasi pada Puisi Alam",
        "prompt": "Buatkan soal tentang mengartikan kalimat kiasan angin berbisik dan dedaunan menari"
      },
      {
        "label": "Menyimpulkan Karakter Watak Tokoh Cerita",
        "prompt": "Buatkan soal tentang menganalisis sifat tokoh utama melalui perkataan dan perbuatannya"
      },
      {
        "label": "Konjungsi Antarkalimat: Namun, Oleh Karena Itu",
        "prompt": "Buatkan soal tentang memilih kata penghubung antarkalimat yang tepat dalam teks narasi"
      },
      {
        "label": "Mengubah Kalimat Langsung Menjadi Tidak Langsung",
        "prompt": "Buatkan soal tentang mengubah dialog langsung bertanda petik menjadi kalimat berita"
      },
      {
        "label": "Menemukan Informasi Tersirat dalam Teks Fabel",
        "prompt": "Buatkan soal tentang menarik kesimpulan amanat cerita yang tidak tertulis langsung"
      },
      {
        "label": "Menyunting Ejaan Tanda Titik Dua dan Tanda Petik",
        "prompt": "Buatkan soal tentang memperbaiki kesalahan tanda baca pada naskah drama anak"
      },
      {
        "label": "Melengkapi Baris Isi Pantun Nasihat Rima a-b-a-b",
        "prompt": "Buatkan soal tentang melengkapi baris ketiga dan keempat pantun dengan nasihat bijak"
      },
      {
        "label": "Menulis Laporan Pengamatan Tanaman Sederhana",
        "prompt": "Buatkan soal tentang struktur laporan pengamatan waktu, tempat, objek, dan hasil"
      },
      {
        "label": "Membedakan Kalimat Fakta dan Kalimat Opini",
        "prompt": "Buatkan soal tentang membedakan fakta yang terbukti nyata dan opini pandangan subjektif"
      }
    ],
    "ipas": [
      {
        "label": "Bagian Bunga dan Proses Penyerbukan Tumbuhan",
        "prompt": "Buatkan soal tentang fungsi mahkota, benang sari, dan putik pada perkembangbiakan generatif"
      },
      {
        "label": "Proses Fotosintesis dan Aliran Energi Matahari",
        "prompt": "Buatkan soal tentang peran klorofil menyerap sinar matahari mengolah karbon dioksida dan air"
      },
      {
        "label": "Pengaruh Gaya Gesek, Gravitasi, dan Magnet",
        "prompt": "Buatkan soal tentang benda jatuh bebas ditarik gravitasi dan magnet menarik besi"
      },
      {
        "label": "Energi Kinetik, Energi Potensial, & Energi Terbarukan",
        "prompt": "Buatkan soal tentang contoh buah kelapa jatuh menyimpan energi potensial dan gerak"
      },
      {
        "label": "Siklus Air: Evaporasi, Kondensasi, Presipitasi",
        "prompt": "Buatkan soal tentang proses pembentukan awan dari uap air laut hingga turun hujan"
      },
      {
        "label": "Ekosistem Padang Rumput dan Rantai Makanan",
        "prompt": "Buatkan soal tentang hubungan produsen rumput, konsumen kelinci, dan predator serigala"
      },
      {
        "label": "Kegiatan Ekonomi: Produksi, Distribusi, Konsumsi",
        "prompt": "Buatkan soal tentang alur hasil tangkapan nelayan sampai dibeli ibu rumah tangga"
      },
      {
        "label": "Peta Lingkungan Rumah dan Skala Denah",
        "prompt": "Buatkan soal tentang membaca peta kabupaten dan menghitung perkiraan jarak tempuh"
      },
      {
        "label": "Kearifan Lokal Mengelola Sumber Daya Alam",
        "prompt": "Buatkan soal tentang tradisi subak di Bali dan lebung di Sumatera menjaga kelestarian air"
      },
      {
        "label": "Pemuaian Sambungan Rel Kereta Api di Siang Hari",
        "prompt": "Buatkan soal tentang alasan rel kereta diberi celah sambungan mengantisipasi pemuaian panjang"
      },
      {
        "label": "Menjaga Kesehatan Paru-paru dari Polusi Kendaraan",
        "prompt": "Buatkan soal tentang bahaya gas buang knalpot dan manfaat masker serta pohon peneduh"
      },
      {
        "label": "Peran Norma Sosial dan Aturan Adat di Masyarakat",
        "prompt": "Buatkan soal tentang mentaati norma kesopanan dan sanksi sosial jika melanggar adat"
      }
    ]
  },
  "5": {
    "default": [
      {
        "label": "Penjumlahan & Pengurangan Pecahan Berpenyebut Beda",
        "prompt": "Buatkan soal tentang menyamakan penyebut pecahan menggunakan KPK pada operasi hitung"
      },
      {
        "label": "Perkalian dan Pembagian Pecahan Biasa/Campuran",
        "prompt": "Buatkan soal tentang mengalikan pembilang dengan pembilang dan membagi pecahan kebalikan"
      },
      {
        "label": "Perbandingan Senilai dan Perhitungan Skala Peta",
        "prompt": "Buatkan soal tentang menghitung jarak sebenarnya kota memakai skala peta 1:100.000"
      },
      {
        "label": "Kecepatan, Jarak Tempuh, dan Waktu Perjalanan",
        "prompt": "Buatkan soal tentang rumus kecepatan jarak dibagi waktu pada soal cerita kendaraan"
      },
      {
        "label": "Volume Kubus dan Balok dengan Kubus Satuan",
        "prompt": "Buatkan soal tentang menghitung volume kubus s x s x s dan balok p x l x t"
      },
      {
        "label": "Jaring-Jaring Bangun Ruang Kubus dan Balok",
        "prompt": "Buatkan soal tentang menentukan pola jaring-jaring yang dapat membentuk bangun kubus"
      },
      {
        "label": "Sistem Organ Pernapasan Manusia (Paru-Paru, Alveolus)",
        "prompt": "Buatkan soal tentang alur jalannya udara hidung, tenggorokan, bronkus, dan alveolus"
      },
      {
        "label": "Sistem Organ Pencernaan Manusia (Lambung, Usus)",
        "prompt": "Buatkan soal tentang fungsi enzim lambung dan penyerapan sari makanan di usus halus"
      },
      {
        "label": "Rantai Makanan & Jaring-Jaring Ekosistem",
        "prompt": "Buatkan soal tentang hubungan produsen, konsumen primer, sekunder, dan pengurai"
      },
      {
        "label": "Rangkaian Listrik Seri dan Paralel Sederhana",
        "prompt": "Buatkan soal tentang kelebihan dan kelemahan lampu disusun secara seri atau paralel"
      },
      {
        "label": "Teks Eksplanasi Ilmiah Fenomena Alam",
        "prompt": "Buatkan soal tentang struktur teks eksplanasi pernyataan umum, deretan penjelas, kesimpulan"
      },
      {
        "label": "Nilai Persatuan dalam Peristiwa Sumpah Pemuda 1928",
        "prompt": "Buatkan soal tentang makna ikrar satu nusa, satu bangsa, dan satu bahasa persatuan"
      }
    ],
    "matematika": [
      {
        "label": "Penjumlahan Pecahan Beda Penyebut (KPK)",
        "prompt": "Buatkan soal tentang menjumlahkan dua pecahan dengan mencari KPK penyebut terlebih dahulu"
      },
      {
        "label": "Pengurangan Pecahan Campuran Beda Penyebut",
        "prompt": "Buatkan soal tentang pengurangan pecahan campuran dalam soal cerita takaran bahan kue"
      },
      {
        "label": "Perkalian Pecahan Biasa dan Pecahan Campuran",
        "prompt": "Buatkan soal tentang perkalian pecahan biasa dengan pecahan campuran langkah demi langkah"
      },
      {
        "label": "Pembagian Pecahan dengan Cara Mengalikan Kebalikan",
        "prompt": "Buatkan soal tentang operasi pembagian pecahan mengubah pembagian menjadi perkalian kebalikan"
      },
      {
        "label": "Operasi Perkalian dan Pembagian Desimal",
        "prompt": "Buatkan soal tentang menghitung perkalian bilangan berkoma dan pembagian desimal bersusun"
      },
      {
        "label": "Perbandingan Senilai pada Masalah Nyata",
        "prompt": "Buatkan soal tentang menghitung jumlah bahan bakar yang dibutuhkan untuk menempuh jarak tertentu"
      },
      {
        "label": "Menghitung Jarak Sebenarnya Menggunakan Skala Peta",
        "prompt": "Buatkan soal tentang rumus skala jarak pada peta berbanding jarak sebenarnya"
      },
      {
        "label": "Rumus Kecepatan Rata-Rata (Jarak : Waktu)",
        "prompt": "Buatkan soal tentang menghitung waktu tiba mobil jika kecepatan dan jarak diketahui"
      },
      {
        "label": "Volume Kubus Satuan dan Rumus Sisi Pangkat Tiga",
        "prompt": "Buatkan soal tentang menghitung volume bak mandi kubus dengan panjang rusuk diketahui"
      },
      {
        "label": "Volume Balok (Panjang x Lebar x Tinggi)",
        "prompt": "Buatkan soal tentang menghitung daya tampung air kolam berbentuk balok dalam liter"
      },
      {
        "label": "Mengenal Jaring-Jaring Kubus dan Balok",
        "prompt": "Buatkan soal tentang mengidentifikasi nomor bidang yang menjadi alas dan tutup kubus"
      },
      {
        "label": "Penyajian Data Diagram Garis dan Diagram Batang Ganda",
        "prompt": "Buatkan soal tentang membaca tren perubahan suhu badan pasien dari grafik garis"
      }
    ],
    "indonesia": [
      {
        "label": "Struktur Teks Eksplanasi Fenomena Pelangi",
        "prompt": "Buatkan soal tentang menentukan bagian pernyataan umum, deretan penjelas, dan simpulan teks eksplanasi"
      },
      {
        "label": "Ide Pokok Teks Narasi Sejarah Kemerdekaan",
        "prompt": "Buatkan soal tentang menggali informasi penting peristiwa proklamasi memakai kata tanya apa, siapa, di mana"
      },
      {
        "label": "Menulis Ringkasan Teks Nonfiksi yang Padat",
        "prompt": "Buatkan soal tentang langkah meringkas buku bacaan sains tanpa mengubah pokok pikiran asli"
      },
      {
        "label": "Ciri-Ciri Teks Iklan Elektronik dan Media Cetak",
        "prompt": "Buatkan soal tentang bahasa persuasif, kata kunci, dan gambar menarik pada iklan produk"
      },
      {
        "label": "Menganalisis Informasi Iklan Layanan Masyarakat",
        "prompt": "Buatkan soal tentang pesan sosial ajakan hemat listrik dan bahaya demam berdarah"
      },
      {
        "label": "Menulis Pantun Kanak-Kanak dan Pantun Nasihat",
        "prompt": "Buatkan soal tentang membuat dua bait pantun jenaka dan pantun budi pekerti"
      },
      {
        "label": "Unsur Cerita Pendek: Konflik dan Resolusi",
        "prompt": "Buatkan soal tentang menentukan puncak masalah (klimaks) dan penyelesaian cerita cerpen"
      },
      {
        "label": "Menulis Teks Pidato Persuasif Hari Pahlawan",
        "prompt": "Buatkan soal tentang menyusun bagian pembuka, isi argumen, dan ajakan penutup pidato"
      },
      {
        "label": "Makna Kosakata Baku Sesuai Kamus Besar (KBBI)",
        "prompt": "Buatkan soal tentang membedakan kata baku apotek dan tidak baku apotik dalam kalimat"
      },
      {
        "label": "Penggunaan Tanda Baca Titik Dua pada Teks Percakapan",
        "prompt": "Buatkan soal tentang kaidah penulisan dialog percakapan naskah sandiwara sekolah"
      },
      {
        "label": "Menyimpulkan Isi Surat Undangan Resmi Sekolah",
        "prompt": "Buatkan soal tentang mengidentifikasi kop surat, nomor surat, waktu, dan perihal rapat"
      },
      {
        "label": "Menulis Narasi Pengalaman Berlibur yang Kronologis",
        "prompt": "Buatkan soal tentang menyusun alur cerita pengalaman pribadi dengan konjungsi urutan waktu"
      }
    ],
    "ipas": [
      {
        "label": "Sistem Pernapasan Manusia dan Mekanisme Dada/Perut",
        "prompt": "Buatkan soal tentang kontraksi diafragma saat menarik nafas dan relaksasi saat hembusan nafas"
      },
      {
        "label": "Organ Pencernaan Manusia: Mulut sampai Usus Besar",
        "prompt": "Buatkan soal tentang pencernaan mekanik di mulut dan penyerapan sari makanan di usus halus"
      },
      {
        "label": "Sistem Peredaran Darah Besar dan Peredaran Darah Kecil",
        "prompt": "Buatkan soal tentang jalur darah bilik kiri ke seluruh tubuh dan bilik kanan ke paru-paru"
      },
      {
        "label": "Rantai Makanan & Jaring-Jaring Makanan Hutan",
        "prompt": "Buatkan soal tentang dampak punahnya elang terhadap populasi ular dan tikus di sawah"
      },
      {
        "label": "Ekosistem Alami Hutan dan Ekosistem Buatan Sawah",
        "prompt": "Buatkan soal tentang komponen biotik tanaman/hewan dan abiotik tanah/air/udara"
      },
      {
        "label": "Sifat Magnet Induksi, Gosokan, dan Aliran Listrik",
        "prompt": "Buatkan soal tentang cara membuat magnet sementara dengan melilitkan kawat berarus listrik"
      },
      {
        "label": "Rangkaian Listrik Seri dan Paralel di Rumah",
        "prompt": "Buatkan soal tentang alasan saklar lampu di rumah dipasang secara paralel"
      },
      {
        "label": "Siklus Air Tanah dan Masalah Daerah Resapan Air",
        "prompt": "Buatkan soal tentang akibat penutupan lahan hijau oleh semen terhadap cadangan air sumur"
      },
      {
        "label": "Sejarah Penjajahan Belanda & Perlawanan Rakyat",
        "prompt": "Buatkan soal tentang tokoh perlawanan Pangeran Diponegoro dan Sultan Hasanuddin"
      },
      {
        "label": "Peristiwa Sumpah Pemuda 1928 dan Persatuan Bangsa",
        "prompt": "Buatkan soal tentang makna ikrar pemuda memperkuat rasa persatuan melawan penjajah"
      },
      {
        "label": "Keragaman Budaya, Rumah Adat, dan Alat Musik Tradisional",
        "prompt": "Buatkan soal tentang alat musik angklung Jawa Barat, sasando NTT, dan kolintang Minahasa"
      },
      {
        "label": "Kegiatan Ekonomi Koperasi Sekolah dan Kesejahteraan",
        "prompt": "Buatkan soal tentang asas kekeluargaan koperasi dan manfaat pembagian sisa hasil usaha"
      }
    ]
  },
  "6": {
    "default": [
      {
        "label": "Operasi Campuran Bilangan Bulat Positif & Negatif",
        "prompt": "Buatkan soal tentang perkalian, pembagian, penjumlahan bilangan bulat dengan tanda minus"
      },
      {
        "label": "Menentukan FPB dan KPK dengan Faktorisasi Prima",
        "prompt": "Buatkan soal tentang FPB pembagian bingkisan dan KPK jadwal berenang bersama"
      },
      {
        "label": "Lingkaran: Jari-Jari, Diameter, Keliling, Luas",
        "prompt": "Buatkan soal tentang menghitung keliling 2 x pi x r dan luas pi x r² taman lingkaran"
      },
      {
        "label": "Luas Permukaan & Volume Bangun Ruang Campuran",
        "prompt": "Buatkan soal tentang menghitung volume gabungan kubus dan limas atau balok dan prisma"
      },
      {
        "label": "Mean (Rata-Rata), Median, dan Modus Data Statistik",
        "prompt": "Buatkan soal tentang menghitung nilai rata-rata ulangan, nilai tengah, dan modus"
      },
      {
        "label": "Membaca & Membuat Diagram Lingkaran Persentase",
        "prompt": "Buatkan soal tentang membaca sudut derajat dan persen diagram lingkaran hobi siswa"
      },
      {
        "label": "Pubertas pada Remaja Laki-Laki dan Perempuan",
        "prompt": "Buatkan soal tentang ciri primer dan sekunder masa pubertas serta cara menjaga kebersihan diri"
      },
      {
        "label": "Tata Surya: Urutan Planet Mengitari Matahari",
        "prompt": "Buatkan soal tentang karakteristik Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus"
      },
      {
        "label": "Rotasi & Revolusi Bumi serta Pengaruhnya",
        "prompt": "Buatkan soal tentang terjadinya siang malam akibat rotasi dan pergantian musim akibat revolusi"
      },
      {
        "label": "Teks Pidato Persuasif Perpisahan Kelas Enam",
        "prompt": "Buatkan soal tentang menyusun struktur teks pidato perpisahan sekolah ucapan terima kasih"
      },
      {
        "label": "Teks Formulir Ujian, Wesel Pos, dan Slip Tabungan",
        "prompt": "Buatkan soal tentang cara mengisi formulir LJK ujian dan slip setoran bank yang tepat"
      },
      {
        "label": "Sejarah Perjuangan Proklamasi Kemerdekaan 17 Agustus 1945",
        "prompt": "Buatkan soal tentang peran Ir. Soekarno, Moh. Hatta, Ahmad Soebardjo, dan Sayuti Melik"
      }
    ],
    "matematika": [
      {
        "label": "Operasi Hitung Campuran Bilangan Bulat Negatif",
        "prompt": "Buatkan soal tentang aturan tanda min dikali plus dan urutan kurung kali bagi tambah kurang"
      },
      {
        "label": "Operasi Hitung Campuran Pecahan dan Desimal",
        "prompt": "Buatkan soal tentang menyelesaikan soal cerita kombinasi pecahan biasa, desimal, dan persen"
      },
      {
        "label": "FPB pada Pembagian Paket Bantuan Sembako",
        "prompt": "Buatkan soal tentang menentukan jumlah kantong maksimal yang dapat dibagikan sama banyak"
      },
      {
        "label": "KPK pada Jadwal Pertemuan / Ronda Bersama",
        "prompt": "Buatkan soal tentang menentukan tanggal mereka akan bertemu kembali secara serentak"
      },
      {
        "label": "Menghitung Keliling Lingkaran (Pi x Diameter)",
        "prompt": "Buatkan soal tentang menghitung jarak putaran roda sepeda berdiameter 56 cm"
      },
      {
        "label": "Menghitung Luas Lingkaran (Pi x r x r)",
        "prompt": "Buatkan soal tentang menghitung luas taplak meja berbentuk lingkaran berdiameter 28 cm"
      },
      {
        "label": "Luas Permukaan Kubus dan Balok",
        "prompt": "Buatkan soal tentang menghitung luas kertas kado yang dibutuhkan untuk membungkus kardus"
      },
      {
        "label": "Volume Bangun Ruang Prisma Segitiga dan Tabung",
        "prompt": "Buatkan soal tentang menghitung daya tampung kaleng minyak silinder (luas alas x tinggi)"
      },
      {
        "label": "Volume Kerucut dan Bola",
        "prompt": "Buatkan soal tentang rumus 1/3 luas alas x tinggi kerucut dan 4/3 pi r³ bola"
      },
      {
        "label": "Menghitung Rata-Rata (Mean) Nilai Ulangan Siswa",
        "prompt": "Buatkan soal tentang jumlah seluruh data dibagi banyak data pada nilai rapor"
      },
      {
        "label": "Menentukan Median (Nilai Tengah) dan Modus",
        "prompt": "Buatkan soal tentang mengurutkan data genap ganjil untuk mencari nilai tengah dan frekuensi terbanyak"
      },
      {
        "label": "Membaca Diagram Lingkaran Derajat dan Persen",
        "prompt": "Buatkan soal tentang menghitung jumlah siswa yang menyukai sepak bola dari diagram lingkaran 90°"
      }
    ],
    "indonesia": [
      {
        "label": "Teks Pidato Persuasif Acara Perpisahan Sekolah",
        "prompt": "Buatkan soal tentang menyusun kalimat pembuka hormat dan pesan menyentuh perpisahan kelas 6"
      },
      {
        "label": "Mengisi Lembar Jawaban Formulir dan Data Diri",
        "prompt": "Buatkan soal tentang ketentuan mengisi formulir ujian dan slip transfer uang tunai"
      },
      {
        "label": "Menentukan Tema dan Makna Puisi Perjuangan",
        "prompt": "Buatkan soal tentang menganalisis semangat cinta tanah air pada puisi karya Chairil Anwar"
      },
      {
        "label": "Menulis Teks Eksplanasi Gerhana Bulan dan Matahari",
        "prompt": "Buatkan soal tentang menyusun deret penjelas ilmiah proses tertutupnya cahaya matahari oleh bulan"
      },
      {
        "label": "Analisis Unsur Intrinsik Cerpen: Sudut Pandang",
        "prompt": "Buatkan soal tentang mengidentifikasi sudut pandang orang pertama 'Aku' atau orang ketiga 'Dia'"
      },
      {
        "label": "Menentukan Peribahasa yang Sesuai dengan Cerita",
        "prompt": "Buatkan soal tentang mencocokkan peribahasa air tenang menghanyutkan dengan watak tokoh cerpen"
      },
      {
        "label": "Menyunting Teks Paragraf dari Kesalahan Ejaan",
        "prompt": "Buatkan soal tentang membetulkan kesalahan huruf kapital nama gelar dan pemakaian tanda titik"
      },
      {
        "label": "Kalimat Efektif dan Menghilangkan Pemborosan Kata",
        "prompt": "Buatkan soal tentang mengubah kalimat boros 'para hadirin semua' menjadi kalimat efektif"
      },
      {
        "label": "Menyusun Teks Narasi Sejarah Detik-Detik Proklamasi",
        "prompt": "Buatkan soal tentang merangkaikan kronologis peristiwa Rengasdengklok hingga pembacaan teks"
      },
      {
        "label": "Menemukan Simpulan Tersirat dari Dua Teks Berbeda",
        "prompt": "Buatkan soal tentang membandingkan isi berita koran dan menarik kesimpulan bersama"
      },
      {
        "label": "Menulis Ungkapan Makna Kiasan (Buah Tangan, Kutu Buku)",
        "prompt": "Buatkan soal tentang mengartikan ungkapan kiasan bahasa Indonesia dalam percakapan"
      },
      {
        "label": "Menyusun Teks Ulasan Buku Cerita Anak (Resensi)",
        "prompt": "Buatkan soal tentang menuliskan identitas buku, sinopsis cerita, kelebihan, dan kelemahan buku"
      }
    ],
    "ipas": [
      {
        "label": "Ciri Perkembangan Fisik Masa Pubertas Remaja",
        "prompt": "Buatkan soal tentang perubahan suara membesar, jakun, jerawat, dan menstruasi pada remaja"
      },
      {
        "label": "Perkembangbiakan Vegetatif Alami Tumbuhan (Tunas, Umbi)",
        "prompt": "Buatkan soal tentang contoh pisang bertunas, bawang umbi lapis, dan jahe akar tinggal"
      },
      {
        "label": "Perkembangbiakan Vegetatif Buatan (Cangkok, Stek, Okulasi)",
        "prompt": "Buatkan soal tentang langkah mencangkok dahan pohon mangga agar cepat berbuah manis"
      },
      {
        "label": "Perkembangbiakan Hewan: Ovipar, Vivipar, Ovovivipar",
        "prompt": "Buatkan soal tentang mengelompokkan platipus bertelur dan hiu/ular ovovivipar bertelur-melahirkan"
      },
      {
        "label": "Penyesuaian Diri Hewan: Mimikri, Kamuflase, Autotomi",
        "prompt": "Buatkan soal tentang bunglon mengubah warna kulit dan cicak memutuskan ekor saat terancam"
      },
      {
        "label": "Adaptasi Tumbuhan: Kaktus Gurun dan Teratai Air",
        "prompt": "Buatkan soal tentang daun teratai lebar mengapung dan duri kaktus mengurangi penguapan"
      },
      {
        "label": "Pembangkit Listrik Tenaga Air (PLTA) dan Turbin",
        "prompt": "Buatkan soal tentang perubahan energi kinetik aliran air terjun memutar generator turbin listrik"
      },
      {
        "label": "Tata Surya: Karakteristik 8 Planet & Sabuk Asteroid",
        "prompt": "Buatkan soal tentang planet dalam Merkurius-Bumi dan planet gas luar Jupiter-Neptunus"
      },
      {
        "label": "Gerhana Matahari Total dan Gerhana Bulan",
        "prompt": "Buatkan soal tentang posisi bulan berada di antara matahari dan bumi membentuk bayangan umbra"
      },
      {
        "label": "Pengaruh Rotasi Bumi dan Revolusi Bumi",
        "prompt": "Buatkan soal tentang perbedaan zona waktu WIB, WITA, WIT serta pergantian musim dunia"
      },
      {
        "label": "Peristiwa Penting Proklamasi Kemerdekaan Indonesia",
        "prompt": "Buatkan soal tentang perumusan teks proklamasi di rumah Laksamana Maeda dan pembacaan teks"
      },
      {
        "label": "Kerja Sama Negara-Negara ASEAN di Bidang Sosial Budaya",
        "prompt": "Buatkan soal tentang pertukaran pelajar ASEAN dan festival seni budaya Asia Tenggara"
      }
    ]
  },
  "7": {
    "default": [
      {
        "label": "Bilangan Bulat, Pecahan, dan Bilangan Berpangkat",
        "prompt": "Buatkan soal tentang operasi hitung campuran bilangan bulat dan pangkat positif"
      },
      {
        "label": "Bentuk Aljabar: Koefisien, Variabel, dan Konstanta",
        "prompt": "Buatkan soal tentang menyederhanakan bentuk aljabar suku sejenis penjumlahan dan pengurangan"
      },
      {
        "label": "Persamaan Linear Satu Variabel (PLSV)",
        "prompt": "Buatkan soal tentang menentukan himpunan penyelesaian persamaan linear satu variabel"
      },
      {
        "label": "Aritmetika Sosial: Untung, Rugi, Diskon, Pajak",
        "prompt": "Buatkan soal tentang menghitung persentase keuntungan pedagang dan potongan harga diskon toko"
      },
      {
        "label": "Perbandingan Senilai dan Berbalik Nilai",
        "prompt": "Buatkan soal tentang waktu penyelesaian proyek dengan penambahan pekerja bangunan"
      },
      {
        "label": "Garis dan Sudut: Sudut Sehadap & Berseberangan",
        "prompt": "Buatkan soal tentang menentukan besar sudut sehadap dan sudut dalam berseberangan dua garis sejajar"
      },
      {
        "label": "Keliling dan Luas Segitiga serta Segiempat",
        "prompt": "Buatkan soal tentang menghitung luas layang-layang, belah ketupat, dan trapesium"
      },
      {
        "label": "Sel sebagai Unit Terkecil Kehidupan (Organel Sel)",
        "prompt": "Buatkan soal tentang membedakan organel sel tumbuhan memiliki dinding sel dan sel hewan"
      },
      {
        "label": "Klasifikasi Makhluk Hidup 5 Kingdom",
        "prompt": "Buatkan soal tentang karakteristik kingdom Monera, Protista, Fungi, Plantae, Animalia"
      },
      {
        "label": "Ekosistem: Rantai Makanan dan Jaring-Jaring Kehidupan",
        "prompt": "Buatkan soal tentang piramida makanan dan aliran energi dari produsen ke konsumen puncak"
      },
      {
        "label": "Teks Deskripsi Objek Wisata Daerah",
        "prompt": "Buatkan soal tentang struktur identifikasi, deskripsi bagian, dan penutup teks deskripsi"
      },
      {
        "label": "Penerapan Norma Agama, Kesusilaan, Kesopanan, Hukum",
        "prompt": "Buatkan soal tentang sanksi pelanggaran norma kesopanan dan pentingnya norma hukum"
      }
    ],
    "matematika": [
      {
        "label": "Operasi Campuran Bilangan Bulat dan Pecahan Negatif",
        "prompt": "Buatkan soal tentang operasi hitung bilangan bulat bertanda negatif dan urutan operasi"
      },
      {
        "label": "Menyederhanakan Bentuk Aljabar Suku Sejenis",
        "prompt": "Buatkan soal tentang menjumlahkan dan mengurangkan koefisien dari suku-suku aljabar sejenis"
      },
      {
        "label": "Perkalian dan Pembagian Bentuk Aljabar",
        "prompt": "Buatkan soal tentang perkalian suku dua aljabar (a + b)(c + d) dan pemfaktoran sederhana"
      },
      {
        "label": "Penyelesaian Persamaan Linear Satu Variabel (PLSV)",
        "prompt": "Buatkan soal tentang mencari nilai x pada persamaan linear 3x + 5 = 20"
      },
      {
        "label": "Penyelesaian Pertidaksamaan Linear Satu Variabel",
        "prompt": "Buatkan soal tentang menentukan garis bilangan pertidaksamaan dengan membalik tanda saat dibagi negatif"
      },
      {
        "label": "Aritmetika Sosial: Harga Beli, Jual, Untung, Rugi",
        "prompt": "Buatkan soal tentang menghitung keuntungan kotor dan persentase keuntungan penjualan"
      },
      {
        "label": "Perhitungan Bruto, Netto, dan Tara pada Kemasan",
        "prompt": "Buatkan soal tentang menghitung berat bersih makanan kemasan setelah dikurangi tara bungkus"
      },
      {
        "label": "Perbandingan Senilai pada Kecepatan dan Bahan Bakar",
        "prompt": "Buatkan soal tentang menghitung kebutuhan bensin motor untuk menempuh jarak tertentu"
      },
      {
        "label": "Perbandingan Berbalik Nilai Waktu dan Pekerja",
        "prompt": "Buatkan soal tentang menghitung sisa waktu jika jumlah buruh bangunan ditambah"
      },
      {
        "label": "Hubungan Dua Garis Sejajar Dipotong Garis Lain",
        "prompt": "Buatkan soal tentang besar sudut sehadap, sudut dalam berseberangan, dan luar sepihak"
      },
      {
        "label": "Luas dan Keliling Layang-Layang dan Belah Ketupat",
        "prompt": "Buatkan soal tentang menghitung luas 1/2 x d1 x d2 dan keliling bangun datar segiempat"
      },
      {
        "label": "Penyajian Data Tabel Frekuensi dan Diagram Batang",
        "prompt": "Buatkan soal tentang menyajikan data nilai ulangan ke dalam tabel frekuensi dan diagram batang"
      }
    ],
    "indonesia": [
      {
        "label": "Struktur Teks Deskripsi Wisata dan Budaya",
        "prompt": "Buatkan soal tentang menentukan bagian deskripsi umum dan rincian sensorik panca indera"
      },
      {
        "label": "Gaya Bahasa Majas pada Teks Deskripsi",
        "prompt": "Buatkan soal tentang menemukan majas personifikasi dan metafora dalam lukisan alam"
      },
      {
        "label": "Struktur Teks Cerita Fantasi (Imajinasi)",
        "prompt": "Buatkan soal tentang orientasi pengenalan dunia sihir, komplikasi keanehan, dan resolusi"
      },
      {
        "label": "Unsur Intrinsik Cerita Fantasi: Latar Lintas Waktu",
        "prompt": "Buatkan soal tentang latar waktu sezaman dan lintas waktu masa depan pada novel fantasi"
      },
      {
        "label": "Struktur Teks Prosedur: Tujuan, Alat, Bahan, Langkah",
        "prompt": "Buatkan soal tentang menganalisis kelengkapan teks prosedur cara memainkan angklung"
      },
      {
        "label": "Ciri Kebahasaan Teks Prosedur: Kalimat Perintah",
        "prompt": "Buatkan soal tentang kalimat imperatif ajakan dan kata keterangan ukuran akurat"
      },
      {
        "label": "Struktur Teks Laporan Hasil Observasi (LHO)",
        "prompt": "Buatkan soal tentang definisi umum, deskripsi bagian sifat habitat, dan deskripsi manfaat"
      },
      {
        "label": "Ciri Bahasa Ilmiah dan Fakta pada Teks LHO",
        "prompt": "Buatkan soal tentang menemukan istilah biologi dan kalimat fakta objektif pada teks LHO"
      },
      {
        "label": "Puisi Rakyat: Ciri Pantun, Syair, dan Gurindam",
        "prompt": "Buatkan soal tentang syarat rima a-b-a-b pantun, sajak a-a-a-a syair, dan nasihat gurindam"
      },
      {
        "label": "Menulis Surat Pribadi dan Surat Dinas Resmi",
        "prompt": "Buatkan soal tentang membedakan kepala surat dinas sekolah dan salam pembuka surat pribadi"
      },
      {
        "label": "Menganalisis Unsur Buku Fiksi dan Nonfiksi",
        "prompt": "Buatkan soal tentang daftar isi, indeks, glosarium pada buku nonfiksi dan alur pada fiksi"
      },
      {
        "label": "Menyunting Kalimat Tidak Efektif pada Paragraf",
        "prompt": "Buatkan soal tentang memperbaiki kalimat ambigu dan rancu menjadi kalimat baku bahasa Indonesia"
      }
    ],
    "ipa": [
      {
        "label": "Pengukuran Besaran Pokok dan Besaran Turunan",
        "prompt": "Buatkan soal tentang alat ukur jangka sorong, mikrometer sekrup, dan satuan SI meter/kilogram"
      },
      {
        "label": "Klasifikasi Materi: Zat Tunggal, Unsur, Senyawa, Campuran",
        "prompt": "Buatkan soal tentang membedakan air senyawa H2O, besi unsur Fe, dan larutan sirup campuran"
      },
      {
        "label": "Pemisahan Campuran: Filtrasi, Sentrifugasi, Destilasi",
        "prompt": "Buatkan soal tentang metode penyaringan pasir air dan pemisahan minyak bumi suling"
      },
      {
        "label": "Suhu dan Termometer: Skala Celcius, Reamur, Fahrenheit",
        "prompt": "Buatkan soal tentang rumus konversi suhu Celcius ke Reamur dan Kelvin"
      },
      {
        "label": "Kalor dan Perubahan Wujud Zat (Q = m . c . delta T)",
        "prompt": "Buatkan soal tentang menghitung kalor yang diperlukan untuk memanaskan air"
      },
      {
        "label": "Perpindahan Kalor: Konduksi, Konveksi, Radiasi",
        "prompt": "Buatkan soal tentang pemanasan air konveksi dan panas api unggun secara radiasi"
      },
      {
        "label": "Ciri-Ciri Makhluk Hidup dan Klasifikasi 5 Kingdom",
        "prompt": "Buatkan soal tentang ciri respirasi, adaptasi, reproduksi, serta kingdom Monera dan Protista"
      },
      {
        "label": "Mikroskop Cahaya: Bagian Lensa dan Cara Fokus",
        "prompt": "Buatkan soal tentang fungsi lensa okuler, lensa objektif, dan cermin pemantul cahaya"
      },
      {
        "label": "Organel Sel Hewan dan Sel Tumbuhan",
        "prompt": "Buatkan soal tentang fungsi kloroplas fotosintesis, mitokondria respirasi, dan nukleus"
      },
      {
        "label": "Tingkat Organisasi Kehidupan: Sel, Jaringan, Organ",
        "prompt": "Buatkan soal tentang sel saraf, jaringan otot, organ jantung, dan sistem peredaran darah"
      },
      {
        "label": "Interaksi Makhluk Hidup: Simbiosis Mutualisme, Parasitisme",
        "prompt": "Buatkan soal tentang simbiosis lebah dan bunga vs benalu pada pohon inang"
      },
      {
        "label": "Pencemaran Lingkungan: Air, Tanah, dan Udara",
        "prompt": "Buatkan soal tentang dampak limbah deterjen eutrofikasi dan efek gas rumah kaca pemanasan global"
      }
    ]
  },
  "8": {
    "default": [
      {
        "label": "Pola Bilangan, Barisan, dan Deret Aritmetika",
        "prompt": "Buatkan soal tentang rumus suku ke-n barisan aritmetika Un = a + (n-1)b"
      },
      {
        "label": "Sistem Koordinat Kartesius: Posisi Titik Terhadap Sumbu",
        "prompt": "Buatkan soal tentang kuadran I-IV dan menentukan jarak titik ke sumbu X dan Y"
      },
      {
        "label": "Relasi dan Fungsi: Domain, Kodomain, dan Range",
        "prompt": "Buatkan soal tentang membedakan relasi biasa dan fungsi pemetaan himpunan"
      },
      {
        "label": "Persamaan Garis Lurus: Menentukan Gradien (m)",
        "prompt": "Buatkan soal tentang menghitung gradien garis yang melalui dua titik (y2 - y1) / (x2 - x1)"
      },
      {
        "label": "Sistem Persamaan Linear Dua Variabel (SPLDV)",
        "prompt": "Buatkan soal tentang metode eliminasi dan substitusi pada soal cerita pembelian barang"
      },
      {
        "label": "Teorema Pythagoras dan Tripel Pythagoras",
        "prompt": "Buatkan soal tentang rumus c² = a² + b² mencari panjang sisi miring segitiga siku-siku"
      },
      {
        "label": "Lingkaran: Sudut Pusat, Sudut Keliling, Juring",
        "prompt": "Buatkan soal tentang hubungan sudut keliling = 1/2 x sudut pusat menghadap busur sama"
      },
      {
        "label": "Bangun Ruang Sisi Datar: Kubus, Balok, Prisma, Limas",
        "prompt": "Buatkan soal tentang menghitung luas permukaan dan volume prisma dan limas tegak"
      },
      {
        "label": "Hukum Newton I, II, dan III tentang Gerak Benda",
        "prompt": "Buatkan soal tentang hukum inersia, rumus F = m.a, dan aksi-reaksi roket meluncur"
      },
      {
        "label": "Sistem Gerak Manusia: Sendi, Tulang, dan Otot",
        "prompt": "Buatkan soal tentang sendi engsel, peluru, putar dan kelainan tulang osteoporosis/skoliosis"
      },
      {
        "label": "Teks Eksplanasi Fenomena Sosial dan Bencana Alam",
        "prompt": "Buatkan soal tentang hubungan sebab-akibat kausalitas gempa bumi dan urbanisasi penduduk"
      },
      {
        "label": "Makna Kebangkitan Nasional 1908 & Budi Utomo",
        "prompt": "Buatkan soal tentang peran dr. Soetomo dan Wahidin Soedirohoesodo merintis pergerakan modern"
      }
    ],
    "matematika": [
      {
        "label": "Menentukan Suku ke-n Barisan Aritmetika",
        "prompt": "Buatkan soal tentang rumus Un = a + (n-1)b pada barisan bilangan bertingkat satu"
      },
      {
        "label": "Jumlah n Suku Pertama Deret Aritmetika (Sn)",
        "prompt": "Buatkan soal tentang rumus Sn = n/2 (2a + (n-1)b) pada tabungan bertingkat harian"
      },
      {
        "label": "Barisan Geometri dan Rasio Bilangan",
        "prompt": "Buatkan soal tentang menentukan rasio dan suku ke-n barisan pembelahan bakteri"
      },
      {
        "label": "Titik pada Koordinat Kartesius dan Kuadran",
        "prompt": "Buatkan soal tentang menentukan koordinat titik bangun datar yang belum diketahui"
      },
      {
        "label": "Relasi dan Fungsi: Rumus Nilai Fungsi f(x)",
        "prompt": "Buatkan soal tentang mencari nilai fungsi f(a) jika rumus fungsi f(x) = px + q diketahui"
      },
      {
        "label": "Gradien Persamaan Garis Lurus y = mx + c",
        "prompt": "Buatkan soal tentang menentukan gradien garis sejajar m1 = m2 dan tegak lurus m1 . m2 = -1"
      },
      {
        "label": "Persamaan Garis Melalui Titik dan Gradien",
        "prompt": "Buatkan soal tentang rumus y - y1 = m(x - x1) mencari persamaan garis lurus"
      },
      {
        "label": "Penyelesaian SPLDV Metode Eliminasi Substitusi",
        "prompt": "Buatkan soal tentang menentukan harga 1 buku dan 1 pensil dari dua persamaan pembelian"
      },
      {
        "label": "Penerapan Teorema Pythagoras pada Tiang Kapal",
        "prompt": "Buatkan soal tentang menghitung panjang kawat penopang tiang pemancar yang menancap tanah"
      },
      {
        "label": "Sudut Pusat, Sudut Keliling, & Luas Juring Lingkaran",
        "prompt": "Buatkan soal tentang menghitung luas juring alpha/360° x pi r² dan panjang busur"
      },
      {
        "label": "Luas Permukaan dan Volume Prisma Segitiga",
        "prompt": "Buatkan soal tentang rumus volume luas alas x tinggi prisma dan luas seluruh sisi tegak"
      },
      {
        "label": "Ukuran Pemusatan Data: Rata-Rata Gabungan",
        "prompt": "Buatkan soal tentang menghitung nilai rata-rata gabungan siswa pria dan siswa wanita"
      }
    ],
    "indonesia": [
      {
        "label": "Struktur Teks Berita: Kepala, Tubuh, Ekor Berita",
        "prompt": "Buatkan soal tentang kaidah 5W+1H dan piramida terbalik penyusunan teks berita"
      },
      {
        "label": "Unsur Bahasa Teks Berita: Kalimat Langsung dan Kata Kerja Mental",
        "prompt": "Buatkan soal tentang penggunaan kata kerja mental memikirkan dan kata keterangan waktu lampau"
      },
      {
        "label": "Struktur Teks Iklan, Slogan, dan Poster",
        "prompt": "Buatkan soal tentang membedakan ciri persuasi iklan komersial dan poster layanan masyarakat"
      },
      {
        "label": "Struktur Teks Eksposisi: Tesis, Rangkaian Argumen, Penegasan",
        "prompt": "Buatkan soal tentang argumen logis penulis dan rekomendasi solusi masalah lingkungan"
      },
      {
        "label": "Kaidah Kebahasaan Teks Eksposisi: Pronomina dan Kata Teknis",
        "prompt": "Buatkan soal tentang menemukan istilah polusi, ekosistem, dan kata rujukan pada teks eksposisi"
      },
      {
        "label": "Unsur Batin dan Fisik Puisi: Diksi, Tipografi, Citraan",
        "prompt": "Buatkan soal tentang mengidentifikasi citraan visual penglihatan dan auditif pendengaran puisi"
      },
      {
        "label": "Struktur Teks Eksplanasi: Pola Kausalitas dan Kronologis",
        "prompt": "Buatkan soal tentang konjungsi kausalitas sebab, karena, akibatnya pada teks tsunami"
      },
      {
        "label": "Struktur Teks Ulasan Cerpen/Film (Resensi)",
        "prompt": "Buatkan soal tentang bagian orientasi, tafsiran tema, evaluasi kelebihan/kekurangan, rangkuman"
      },
      {
        "label": "Teks Persuasi: Ajakan, Fakta, dan Pendapat Membujuk",
        "prompt": "Buatkan soal tentang kalimat ajakan persuasif jauhi narkoba demi masa depan gemilang"
      },
      {
        "label": "Struktur Naskah Drama: Dialog, Prolog, Epilog",
        "prompt": "Buatkan soal tentang membaca petunjuk lakuan kramagung tanda kurung pada naskah drama"
      },
      {
        "label": "Menyusun Resensi Buku Fiksi: Sinopsis dan Kelemahan",
        "prompt": "Buatkan soal tentang mengevaluasi kekurangan tata bahasa dan perwajahan sampul buku novel"
      },
      {
        "label": "Kebahasaan Teks Cerpen: Majas Ironi dan Sarkasme",
        "prompt": "Buatkan soal tentang memahami gaya bahasa sindiran halus ironi dalam ujaran tokoh cerpen"
      }
    ],
    "ipa": [
      {
        "label": "Hukum I, II, dan III Newton tentang Gerak",
        "prompt": "Buatkan soal tentang perhitungan percepatan balok ditarik gaya F = m.a dan gaya gesek"
      },
      {
        "label": "Usaha dan Pesawat Sederhana: Tuas, Katrol, Bidang Miring",
        "prompt": "Buatkan soal tentang keuntungan mekanis tuas pengungkit beban dan bidang miring"
      },
      {
        "label": "Tekanan Zat Padat, Cair (Hidrostatis), dan Hukum Pascal",
        "prompt": "Buatkan soal tentang rumus tekanan hidrostatis P = rho . g . h dan bejana dongkrak hidrolik"
      },
      {
        "label": "Hukum Archimedes: Terapung, Melayang, Tenggelam",
        "prompt": "Buatkan soal tentang gaya angkat fluida ke atas Fa = rho . g . V pada kapal laut"
      },
      {
        "label": "Sistem Pencernaan: Enzim Amilase, Pepsin, Tripsin, Lipase",
        "prompt": "Buatkan soal tentang fungsi enzim lambung pepsin mengubah protein menjadi pepton"
      },
      {
        "label": "Zat Aditif Makanan: Pewarna, Pengawet, Pemanis, Penyedap",
        "prompt": "Buatkan soal tentang membedakan pemanis alami gula dan buatan sakarin/aspartam"
      },
      {
        "label": "Zat Adiktif dan Psikotropika Narkotika Bahaya bagi Tubuh",
        "prompt": "Buatkan soal tentang pengaruh nikotin, tar rokok, dan alkohol terhadap susunan saraf"
      },
      {
        "label": "Sistem Peredaran Darah: Jantung, Pembuluh Nadi/Vena, Golongan Darah",
        "prompt": "Buatkan soal tentang fungsi katup jantung dan aglutinasi transfusi sistem ABO"
      },
      {
        "label": "Sistem Pernapasan: Kapasitas Vital dan Udara Residu",
        "prompt": "Buatkan soal tentang menghitung kapasitas total paru-paru udara pernapasan biasa dan cadangan"
      },
      {
        "label": "Sistem Ekskresi Manusia: Ginjal, Kulit, Paru-paru, Hati",
        "prompt": "Buatkan soal tentang tahapan pembentukan urine filtrasi glomerulus, reabsorpsi, augmentasi"
      },
      {
        "label": "Getaran, Gelombang Transversal & Longitudinal (v = lambda . f)",
        "prompt": "Buatkan soal tentang menghitung periode getaran, frekuensi, dan cepat rambat gelombang"
      },
      {
        "label": "Cahaya dan Alat Optik: Cermin Cekung, Cembung, Mata, Kacamata",
        "prompt": "Buatkan soal tentang rumus fokus 1/f = 1/s + 1/s' dan lensa minus miopi rabun jauh"
      }
    ]
  },
  "9": {
    "default": [
      {
        "label": "Perpangkatan dan Bentuk Akar: Menyederhanakan Akar",
        "prompt": "Buatkan soal tentang sifat eksponen a^m . a^n dan merasionalkan penyebut pecahan bentuk akar"
      },
      {
        "label": "Persamaan Kuadrat: Faktorisasi & Rumus ABC",
        "prompt": "Buatkan soal tentang mencari akar-akar persamaan kuadrat ax² + bx + c = 0"
      },
      {
        "label": "Fungsi Kuadrat: Titik Puncak dan Sumbu Simetri",
        "prompt": "Buatkan soal tentang menentukan koordinat titik balik parabola dan nilai optimum f(x)"
      },
      {
        "label": "Transformasi Geometri: Translasi, Refleksi, Rotasi, Dilatasi",
        "prompt": "Buatkan soal tentang bayangan titik segitiga setelah dicerminkan terhadap sumbu X atau Y"
      },
      {
        "label": "Kekongruenan dan Kesebangunan Bangun Datar",
        "prompt": "Buatkan soal tentang syarat dua segitiga sebangun sisi-sudut-sisi dan menghitung panjang sisi"
      },
      {
        "label": "Bangun Ruang Sisi Lengkung: Tabung, Kerucut, Bola",
        "prompt": "Buatkan soal tentang menghitung volume tabung pi r² t dan luas permukaan kerucut"
      },
      {
        "label": "Pewarisan Sifat: Hukum Mendel Monohibrid dan Dihibrid",
        "prompt": "Buatkan soal tentang persilangan kacang ercis bulat kuning genotipe BbKk dan fenotipe"
      },
      {
        "label": "Listrik Statis: Hukum Coulomb dan Medan Listrik",
        "prompt": "Buatkan soal tentang gaya tolak-menolak dua muatan F = k . q1 . q2 / r²"
      },
      {
        "label": "Rangkaian Listrik Dinamis: Hukum Ohm dan Hukum Kirchhoff",
        "prompt": "Buatkan soal tentang menghitung arus listrik rangkaian paralel V = I . R"
      },
      {
        "label": "Bioteknologi Konvensional dan Modern",
        "prompt": "Buatkan soal tentang mikroorganisme fermentasi ragi tempe Rhizopus dan rekayasa DNA"
      },
      {
        "label": "Teks Laporan Percobaan Ilmiah (Karya Tulis)",
        "prompt": "Buatkan soal tentang struktur tujuan, alat bahan, metode eksperimen, dan simpulan"
      },
      {
        "label": "Bela Negara dan Kedaulatan NKRI Pasca Kemerdekaan",
        "prompt": "Buatkan soal tentang bentuk partisipasi siswa dalam bela negara dan mempertahankan ideologi"
      }
    ],
    "matematika": [
      {
        "label": "Sifat-Sifat Perpangkatan Bilangan Bulat dan Nol",
        "prompt": "Buatkan soal tentang menghitung nilai eksponen perkalian dan pembagian basis sama"
      },
      {
        "label": "Merasionalkan Penyebut Bentuk Akar Pecahan",
        "prompt": "Buatkan soal tentang mengalikan pecahan akar dengan bentuk sekawan rasional"
      },
      {
        "label": "Menentukan Akar Persamaan Kuadrat dengan Pemfaktoran",
        "prompt": "Buatkan soal tentang faktorisasi persamaan kuadrat bentuk x² + bx + c = 0"
      },
      {
        "label": "Mencari Nilai Diskriminan (D = b² - 4ac)",
        "prompt": "Buatkan soal tentang menentukan jenis akar persamaan kuadrat real kembar atau berbeda"
      },
      {
        "label": "Sumbu Simetri dan Titik Puncak Parabola Kuadrat",
        "prompt": "Buatkan soal tentang rumus x = -b/(2a) dan y = -D/(4a) pada grafik fungsi kuadrat"
      },
      {
        "label": "Aplikasi Fungsi Kuadrat Masalah Nilai Maksimum",
        "prompt": "Buatkan soal tentang luas tanah persegi panjang maksimum dengan keliling kawat tertentu"
      },
      {
        "label": "Translasi (Pergeseran) Titik dan Garis Bidang Koordinat",
        "prompt": "Buatkan soal tentang menentukan koordinat baru titik A(x, y) setelah ditranslasi T(a, b)"
      },
      {
        "label": "Refleksi (Pencerminan) terhadap Garis y = x dan y = -x",
        "prompt": "Buatkan soal tentang menentukan matriks bayangan koordinat bangun segitiga"
      },
      {
        "label": "Kesebangunan Segitiga pada Soal Tiang dan Bayangan",
        "prompt": "Buatkan soal tentang menghitung tinggi pohon menggunakan bayangan tongkat pramuka"
      },
      {
        "label": "Luas Permukaan dan Volume Tabung Silinder",
        "prompt": "Buatkan soal tentang menghitung volume drum minyak tertutup pi r² t"
      },
      {
        "label": "Luas Permukaan Kerucut (Luas Alas + Selimut)",
        "prompt": "Buatkan soal tentang menghitung garis pelukis s² = r² + t² dan luas selimut pi r s"
      },
      {
        "label": "Luas Permukaan dan Volume Bola Sepak",
        "prompt": "Buatkan soal tentang rumus luas permukaan bola 4 pi r² dan volume 4/3 pi r³"
      }
    ],
    "indonesia": [
      {
        "label": "Struktur Teks Laporan Percobaan Sains",
        "prompt": "Buatkan soal tentang menguraikan langkah kerja ilmiah uji vitamin C dan simpulan hasil"
      },
      {
        "label": "Kebahasaan Teks Laporan Percobaan: Kata Baku Ilmiah",
        "prompt": "Buatkan soal tentang penggunaan kata teknis hidrolisis, endapan, dan kalimat pasif"
      },
      {
        "label": "Struktur Teks Pidato Persuasif Orasi Kebangsaan",
        "prompt": "Buatkan soal tentang etika menyusun orasi argumen logis, emosi, dan panggilan nurani"
      },
      {
        "label": "Menyunting Teks Pidato dari Kalimat Kontradiktif",
        "prompt": "Buatkan soal tentang memperbaiki struktur alinea pidato yang melompat-lompat"
      },
      {
        "label": "Struktur Teks Cerpen: Alur Sorot Balik (Flashback)",
        "prompt": "Buatkan soal tentang mengenali pola alur mundur pada kisah kehidupan masa kecil tokoh"
      },
      {
        "label": "Analisis Nilai Kehidupan Cerpen (Moral, Agama, Sosial)",
        "prompt": "Buatkan soal tentang menemukan amanat sosial peduli lansia dari kutipan cerpen"
      },
      {
        "label": "Struktur Teks Tanggapan Kritis: Konteks, Deskripsi, Penilaian",
        "prompt": "Buatkan soal tentang menyusun tanggapan santun terhadap fenomena game online remaja"
      },
      {
        "label": "Kebahasaan Teks Tanggapan: Kalimat Pujian dan Kritik Santun",
        "prompt": "Buatkan soal tentang memilih diksi kritik yang membangun tanpa menjatuhkan pribadi karya"
      },
      {
        "label": "Struktur Teks Diskusi: Isu, Argumen Mendukung, Argumen Menentang",
        "prompt": "Buatkan soal tentang menyusun argumen pro dan kontra larangan membawa gawai ke sekolah"
      },
      {
        "label": "Kohesi dan Koherensi Paragraf Teks Diskusi",
        "prompt": "Buatkan soal tentang kata sambung pertentangan sebaliknya, akan tetapi pada teks debat"
      },
      {
        "label": "Struktur Teks Cerita Inspiratif: Kisah Nyata Menggugah",
        "prompt": "Buatkan soal tentang perikop komplikasi perjuangan difabel mencapai cita-cita"
      },
      {
        "label": "Koda pada Teks Inspiratif: Renungan Akhir Cerita",
        "prompt": "Buatkan soal tentang merumuskan kesimpulan hikmah ketabahan dari kisah inspiratif"
      }
    ],
    "ipa": [
      {
        "label": "Sistem Reproduksi Manusia: Oogenesis dan Spermatogenesis",
        "prompt": "Buatkan soal tentang tahapan pembelahan mitosis dan meiosis pembentukan ovum dan sperma"
      },
      {
        "label": "Siklus Menstruasi dan Peran Hormon Estrogen Progesteron",
        "prompt": "Buatkan soal tentang grafik hormon LH, FSH, estrogen saat fase ovulasi pelepasan sel telur"
      },
      {
        "label": "Penyakit Kelamin Menular pada Sistem Reproduksi",
        "prompt": "Buatkan soal tentang bakteri penyebab sifilis, gonore, dan virus HIV AIDS serta pencegahannya"
      },
      {
        "label": "Perkembangbiakan Vegetatif dan Generatif Tumbuhan Spermatophyta",
        "prompt": "Buatkan soal tentang penyerbukan anemogami angin dan hidrogami air pada tanaman"
      },
      {
        "label": "Pewarisan Sifat: Monohibrid Dominan Penuh & Intermediet",
        "prompt": "Buatkan soal tentang persilangan bunga mawar merah dan putih menghasilkan bunga merah muda"
      },
      {
        "label": "Persilangan Dihibrid Dua Sifat Beda (Hukum Mendel II)",
        "prompt": "Buatkan soal tentang perbandingan fenotipe 9:3:3:1 pada keturunan F2 kacang kapri"
      },
      {
        "label": "Hukum Coulomb dan Interaksi Medan Listrik Dua Muatan",
        "prompt": "Buatkan soal tentang menghitung gaya elektrostatik jika jarak kedua muatan diperbesar 2 kali"
      },
      {
        "label": "Rangkaian Hambatan Seri, Paralel, dan Kuat Arus Kirchhoff",
        "prompt": "Buatkan soal tentang menghitung hambatan pengganti R total dan arus I pada tiap cabang"
      },
      {
        "label": "Daya Listrik dan Biaya Pemakaian Listrik PLN Rumah",
        "prompt": "Buatkan soal tentang rumus W = P . t menghitung tagihan rekening listrik bulanan dalam kWh"
      },
      {
        "label": "Kemagnetan: Kaidah Tangan Kanan Oersted dan Gaya Lorentz",
        "prompt": "Buatkan soal tentang arah gaya Lorentz F = B . I . L kawat berarus dalam medan magnet"
      },
      {
        "label": "Induksi Elektromagnetik: Generator dan Transformator (Trafo)",
        "prompt": "Buatkan soal tentang rumus trafo Vp/Vs = Np/Ns = Is/Ip trafo step-up dan step-down"
      },
      {
        "label": "Bioteknologi Pangan: Fermentasi Keju, Yoghurt, Nata de Coco",
        "prompt": "Buatkan soal tentang bakteri Acetobacter xylinum pembentuk nata dan Lactobacillus yoghurt"
      }
    ]
  },
  "10": {
    "default": [
      {
        "label": "Eksponen dan Logaritma: Sifat-Sifat dan Persamaan",
        "prompt": "Buatkan soal tentang menyederhanakan bentuk pangkat pecahan dan menyelesaikan persamaan logaritma"
      },
      {
        "label": "Persamaan dan Pertidaksamaan Nilai Mutlak Satu Variabel",
        "prompt": "Buatkan soal tentang mencari himpunan penyelesaian |ax + b| = c dan sifat pertidaksamaan"
      },
      {
        "label": "Sistem Persamaan Linear Tiga Variabel (SPLTV)",
        "prompt": "Buatkan soal tentang metode eliminasi Gauss menentukan nilai variabel x, y, z"
      },
      {
        "label": "Fungsi Kuadrat: Karakteristik Grafik dan Diskriminan",
        "prompt": "Buatkan soal tentang menentukan titik puncak dan arah parabola menghadap ke atas/bawah"
      },
      {
        "label": "Trigonometri Dasar: Sin, Cos, Tan Sudut Istimewa",
        "prompt": "Buatkan soal tentang nilai perbandingan trigonometri 0, 30, 45, 60, 90 derajat"
      },
      {
        "label": "Vektor pada Bidang Datar: Panjang Vektor dan Perkalian Dot",
        "prompt": "Buatkan soal tentang operasi vektor a . b = |a||b| cos theta dan vektor satuan"
      },
      {
        "label": "Gerak Lurus Beraturan (GLB) dan Berubah Beraturan (GLBB)",
        "prompt": "Buatkan soal tentang grafik v-t menghitung jarak tempuh dan perlambatan mobil direm"
      },
      {
        "label": "Hukum Gravitasi Newton dan Hukum Keppler Planet",
        "prompt": "Buatkan soal tentang gaya gravitasi bumi F = G M m / r² dan periode orbit planet"
      },
      {
        "label": "Struktur Atom dan Tabel Periodik Unsur (Konfigurasi Elektron)",
        "prompt": "Buatkan soal tentang konfigurasi elektron teori Bohr dan mekanika kuantum spdf"
      },
      {
        "label": "Ikatan Kimia: Ikatan Ion, Kovalen Polar dan Nonpolar",
        "prompt": "Buatkan soal tentang pembentukan ikatan ion NaCl dan pasangan elektron ikatan kovalen"
      },
      {
        "label": "Ruang Lingkup Biologi dan Keanekaragaman Hayati Indonesia",
        "prompt": "Buatkan soal tentang tingkat keanekaragaman gen, jenis, ekosistem dan garis Wallace-Weber"
      },
      {
        "label": "Teks Laporan Hasil Observasi Ilmiah Kritis",
        "prompt": "Buatkan soal tentang menyusun teks LHO objektif berbasis data empiris lingkungan hidup"
      }
    ],
    "matematika": [
      {
        "label": "Sifat-Sifat Bentuk Eksponen dan Persamaan Eksponen",
        "prompt": "Buatkan soal tentang persamaan a^f(x) = a^g(x) mencari nilai variabel x"
      },
      {
        "label": "Sifat Logaritma dan Menyelesaikan Persamaan Logaritma",
        "prompt": "Buatkan soal tentang rumus alog b + alog c = alog(bc) dan sifat kuadrat logaritma"
      },
      {
        "label": "Pertidaksamaan Nilai Mutlak Linear Satu Variabel",
        "prompt": "Buatkan soal tentang menyelesaikan bentuk |f(x)| < a dan |f(x)| > |g(x)|"
      },
      {
        "label": "Menyelesaikan SPLTV dengan Eliminasi-Substitusi",
        "prompt": "Buatkan soal tentang pemecahan masalah harga 3 jenis komoditas buah di pasar"
      },
      {
        "label": "Fungsi Komposisi f(g(x)) dan Invers Fungsi f⁻¹(x)",
        "prompt": "Buatkan soal tentang menentukan rumus komposisi fungsi dan mencari rumus fungsi invers"
      },
      {
        "label": "Grafik Fungsi Rasional dan Asimtot Garis",
        "prompt": "Buatkan soal tentang menentukan asimtot tegak dan asimtot datar fungsi f(x) = (ax+b)/(cx+d)"
      },
      {
        "label": "Perbandingan Trigonometri pada Segitiga Siku-Siku",
        "prompt": "Buatkan soal tentang sisi depan, samping, miring mencari nilai sinus dan kosinus"
      },
      {
        "label": "Sudut Berelasi di Berbagai Kuadran (I sampai IV)",
        "prompt": "Buatkan soal tentang menentukan nilai sin 150°, cos 240°, dan tan 315°"
      },
      {
        "label": "Aturan Sinus dan Aturan Cosinus pada Segitiga Sembarang",
        "prompt": "Buatkan soal tentang menghitung panjang sisi segitiga jika dua sisi dan satu sudut diketahui"
      },
      {
        "label": "Operasi Aljabar Vektor Dimensi Dua dan Panjang Vektor",
        "prompt": "Buatkan soal tentang resultan dua vektor u + v dan panjang vektor menggunakan akar kuadrat"
      },
      {
        "label": "Perkalian Skalar Dua Vektor (Dot Product)",
        "prompt": "Buatkan soal tentang menentukan besar sudut antara dua vektor menggunakan rumus kosinus"
      },
      {
        "label": "Barisan dan Deret Geometri Tak Hingga Konvergen",
        "prompt": "Buatkan soal tentang rumus S tak hingga = a / (1 - r) pada pantulan bola tenis jatuh"
      }
    ],
    "indonesia": [
      {
        "label": "Menganalisis Struktur Teks Laporan Hasil Observasi",
        "prompt": "Buatkan soal tentang membedakan pernyataan umum dan deskripsi bagian objektif"
      },
      {
        "label": "Kaidah Bahasa Teks LHO: Kalimat Definisi dan Kalimat Deskripsi",
        "prompt": "Buatkan soal tentang penggunaan kata kopula adalah, merupakan, dan kalimat verba material"
      },
      {
        "label": "Struktur Teks Eksposisi: Tesis, Rangkaian Argumen, Rekomendasi",
        "prompt": "Buatkan soal tentang menganalisis kekuatan data rujukan ilmiah dalam teks argumen"
      },
      {
        "label": "Struktur Teks Anekdot: Abstraksi, Orientasi, Krisis, Reaksi, Koda",
        "prompt": "Buatkan soal tentang menemukan makna sindiran sosial dan kritik politik pada teks anekdot"
      },
      {
        "label": "Kaidah Bahasa Teks Anekdot: Majas Sindiran dan Konjungsi Waktu",
        "prompt": "Buatkan soal tentang penggunaan majas sinisme, ironi, dan kata kerja material"
      },
      {
        "label": "Hikayat dan Cerpen: Membandingkan Nilai Budaya dan Edukasi",
        "prompt": "Buatkan soal tentang mengalihwahanakan bahasa Melayu klasik hikayat ke dalam cerpen modern"
      },
      {
        "label": "Struktur Teks Negosiasi: Orientasi, Pengajuan, Penawaran, Persetujuan",
        "prompt": "Buatkan soal tentang strategi tawar-menawar santun mencapai kesepakatan win-win solution"
      },
      {
        "label": "Kaidah Bahasa Teks Negosiasi: Kalimat Persuasif dan Pasangan Tuturan",
        "prompt": "Buatkan soal tentang menemukan tuturan meminta-memenuhi dan ungkapan santun bernegosiasi"
      },
      {
        "label": "Struktur Teks Debat: Mosi, Tim Afirmatif, Oposisi, Netral",
        "prompt": "Buatkan soal tentang menyusun argumen sanggahan berlandaskan fakta logis tanpa menyerang pribadi"
      },
      {
        "label": "Struktur Teks Biografi Tokoh Bangsa: Orientasi, Peristiwa, Reorientasi",
        "prompt": "Buatkan soal tentang menemukan keteladanan perjuangan tokoh BJ Habibie dalam biografi"
      },
      {
        "label": "Menganalisis Unsur Puisi: Diksi Konotatif, Nada, dan Suasana",
        "prompt": "Buatkan soal tentang membongkar makna simbolik kata kabut dan malam dalam puisi lirik"
      },
      {
        "label": "Menulis Puisi Berdasarkan Pengamatan Lingkungan Sosial",
        "prompt": "Buatkan soal tentang memilih diksi puitis yang padat makna menggambarkan ketimpangan sosial"
      }
    ],
    "fisika": [
      {
        "label": "Besaran, Satuan, dan Analisis Dimensi Besaran Turunan",
        "prompt": "Buatkan soal tentang membuktikan kebenaran rumus fisika menggunakan analisis dimensi M, L, T"
      },
      {
        "label": "Pengukuran Jangka Sorong dan Mikrometer Sekrup",
        "prompt": "Buatkan soal tentang membaca skala utama dan skala nonius mikrometer sekrup ketelitian 0,01 mm"
      },
      {
        "label": "Operasi Vektor Resultan Metode Analitis dan Grafis",
        "prompt": "Buatkan soal tentang menguraikan vektor gaya ke sumbu Fx = F cos theta dan Fy = F sin theta"
      },
      {
        "label": "Gerak Lurus Beraturan (GLB) dan GLBB Grafik v-t",
        "prompt": "Buatkan soal tentang menghitung jarak total dan percepatan mobil dari grafik kecepatan terhadap waktu"
      },
      {
        "label": "Gerak Vertikal ke Atas dan Gerak Jatuh Bebas",
        "prompt": "Buatkan soal tentang waktu mencapai ketinggian maksimum t = v0/g dan kecepatan saat menyentuh tanah"
      },
      {
        "label": "Gerak Parabola: Titik Tertinggi dan Jangkauan Maksimum",
        "prompt": "Buatkan soal tentang kecepatan sumbu X konstan dan sumbu Y GLBB menghitung jarak terjauh peluru"
      },
      {
        "label": "Gerak Melingkar Beraturan: Frekuensi, Periode, Percepatan Sentripetal",
        "prompt": "Buatkan soal tentang rumus percepatan sentripetal as = v²/r dan kecepatan sudut omega = 2 pi f"
      },
      {
        "label": "Hukum I, II, dan III Newton tentang Dinamika Gerak",
        "prompt": "Buatkan soal tentang balok pada bidang miring licin dan kasar gaya gesek kinetis"
      },
      {
        "label": "Hukum Gravitasi Universal Newton dan Kuat Medan Gravitasi",
        "prompt": "Buatkan soal tentang perbandingan percepatan gravitasi planet bermassa 2M dan jari-jari 2R"
      },
      {
        "label": "Usaha dan Energi: Teorema Usaha-Energi Kinetik (W = delta Ek)",
        "prompt": "Buatkan soal tentang menghitung usaha gaya rem menghentikan laju truk bermassa besar"
      },
      {
        "label": "Hukum Kekekalan Energi Mekanik (Em1 = Em2)",
        "prompt": "Buatkan soal tentang kecepatan benda meluncur dari puncak lintasan lengkung roller coaster"
      },
      {
        "label": "Momentum, Impuls, dan Hukum Kekekalan Momentum Tumbukan",
        "prompt": "Buatkan soal tentang tumbukan lenting sempurna, sebagian, dan tidak lenting sama sekali"
      }
    ],
    "rpl": [
      {
        "label": "Dasar Algoritma & Diagram Alir (Flowchart)",
        "prompt": "Buatkan soal RPL Kelas 10 tentang menyusun bagan alir logika percabangan if-else dan perulangan"
      },
      {
        "label": "Tipe Data, Variabel, dan Operator Logika",
        "prompt": "Buatkan soal RPL Kelas 10 tentang membedakan integer, float, boolean, dan operator aritmatika/logika"
      },
      {
        "label": "Struktur Kontrol Percabangan If, Else If, Switch",
        "prompt": "Buatkan soal RPL Kelas 10 tentang menentukan alur eksekusi program berdasarkan kondisi input"
      },
      {
        "label": "Struktur Perulangan For, While, dan Do-While",
        "prompt": "Buatkan soal RPL Kelas 10 tentang menganalisis jalannya iterasi loop dan kondisi terminasi"
      },
      {
        "label": "Konsep Array Satu Dimensi dan Indeks Elemen",
        "prompt": "Buatkan soal RPL Kelas 10 tentang mengakses, menyimpan, dan mencari nilai pada larik array"
      },
      {
        "label": "Fungsi dan Prosedur dengan Parameter Nilai/Acuan",
        "prompt": "Buatkan soal RPL Kelas 10 tentang membuat subrutin fungsi modular dan nilai return value"
      },
      {
        "label": "Dasar Pemrograman Web: Struktur HTML5 Semantik",
        "prompt": "Buatkan soal RPL Kelas 10 tentang elemen tag header, nav, main, section, dan form input HTML5"
      },
      {
        "label": "Styling Halaman Web dengan CSS3 Box Model",
        "prompt": "Buatkan soal RPL Kelas 10 tentang margin, padding, border, dan tata letak flexbox sederhana"
      },
      {
        "label": "Perintah Dasar Git: Init, Add, Commit, Log",
        "prompt": "Buatkan soal RPL Kelas 10 tentang version control lokal dan melacak histori perubahan kode"
      },
      {
        "label": "Perancangan Diagram Relasi Entitas (ERD)",
        "prompt": "Buatkan soal RPL Kelas 10 tentang entitas, atribut primary key, dan kardinalitas one-to-many"
      },
      {
        "label": "Perintah SQL DDL: CREATE, ALTER, DROP TABLE",
        "prompt": "Buatkan soal RPL Kelas 10 tentang mendefinisikan tipe kolom dan batasan integritas basis data"
      },
      {
        "label": "Etika Profesi IT dan Keselamatan Kerja K3LH",
        "prompt": "Buatkan soal RPL Kelas 10 tentang hak kekayaan intelektual (HAKI) dan ergonomi penggunaan komputer"
      }
    ],
    "tkj": [
      {
        "label": "Konsep Dasar Jaringan Komputer & Topologi LAN",
        "prompt": "Buatkan soal TKJ Kelas 10 tentang karakteristik topologi star, mesh, bus, dan kelebihan switch"
      },
      {
        "label": "Model OSI 7 Layer: Tugas dan Protokol Setiap Lapisan",
        "prompt": "Buatkan soal TKJ Kelas 10 tentang enkapsulasi data dari Physical hingga Application Layer"
      },
      {
        "label": "Standar Pengkabelan UTP Straight & Crossover T568B",
        "prompt": "Buatkan soal TKJ Kelas 10 tentang urutan 8 warna kabel twisted pair dan teknik crimping RJ-45"
      },
      {
        "label": "Pengalamatan IPv4: Konsep Kelas A, B, C dan Subnetting /24",
        "prompt": "Buatkan soal TKJ Kelas 10 tentang menentukan Network ID, Broadcast, Subnet Mask, dan Host Valid"
      },
      {
        "label": "Perangkat Keras Jaringan: NIC, Hub, Switch, Access Point",
        "prompt": "Buatkan soal TKJ Kelas 10 tentang fungsi perangkat lapisan layer 1 dan layer 2 di jaringan lokal"
      },
      {
        "label": "Instalasi Sistem Operasi Jaringan Linux Berbasis Server",
        "prompt": "Buatkan soal TKJ Kelas 10 tentang partisi root/swap dan instalasi sistem operasi tanpa GUI"
      },
      {
        "label": "Perintah Dasar Baris Perintah (CLI) Terminal Linux",
        "prompt": "Buatkan soal TKJ Kelas 10 tentang manajemen direktori file, permission chmod, dan user add"
      },
      {
        "label": "Troubleshooting Konektivitas Jaringan Dasar (Ping & Trace)",
        "prompt": "Buatkan soal TKJ Kelas 10 tentang menganalisis pesan Request Timed Out dan Destination Unreachable"
      },
      {
        "label": "Konsep Virtualisasi Perangkat Keras Komputer",
        "prompt": "Buatkan soal TKJ Kelas 10 tentang instalasi mesin virtual guest OS dan mode jaringan Host-Only/NAT"
      },
      {
        "label": "Konfigurasi IP Statis dan IP Dinamis Komputer Klien",
        "prompt": "Buatkan soal TKJ Kelas 10 tentang setting IP address, gateway, dan DNS pada Windows dan Linux"
      },
      {
        "label": "Perakitan Komputer dan Pengujian Komponen Hardware",
        "prompt": "Buatkan soal TKJ Kelas 10 tentang pemasangan motherboard, RAM, PSU, dan bunyi beep BIOS kode POST"
      },
      {
        "label": "Keselamatan & Kesehatan Kerja Lingkungan Hidup (K3LH)",
        "prompt": "Buatkan soal TKJ Kelas 10 tentang prosedur grounding listrik statis dan standar bengkel komputer"
      }
    ]
  },
  "11": {
    "default": [
      {
        "label": "Operasi Matriks: Penjumlahan, Perkalian, dan Invers Matriks 2x2",
        "prompt": "Buatkan soal tentang determinan matriks ad - bc dan rumus invers matriks ordo 2"
      },
      {
        "label": "Program Linear Dua Variabel: Menentukan Nilai Optimum",
        "prompt": "Buatkan soal tentang menggambar daerah himpunan penyelesaian dan uji titik pojok fungsi objektif"
      },
      {
        "label": "Barisan dan Deret Geometri: Bunga Majemuk dan Anuitas",
        "prompt": "Buatkan soal tentang perhitungan cicilan pinjaman anuitas bank dan bunga majemuk tabungan"
      },
      {
        "label": "Limit Fungsi Aljabar Mendekati Nilai Tertentu & Tak Hingga",
        "prompt": "Buatkan soal tentang menyelesaikan limit bentuk tak tentu 0/0 dengan pemfaktoran atau kali sekawan"
      },
      {
        "label": "Turunan Fungsi Aljabar (Diferensial) Aturan Rantai",
        "prompt": "Buatkan soal tentang rumus f'(x) = n . ax^(n-1) dan turunan bentuk perkalian u . v"
      },
      {
        "label": "Aplikasi Turunan: Garis Singgung dan Nilai Maksimum/Minimum",
        "prompt": "Buatkan soal tentang menentukan persamaan garis singgung kurva dan titik stasioner kurva"
      },
      {
        "label": "Integral Tak Tentu dan Integral Tentu Aljabar",
        "prompt": "Buatkan soal tentang rumus integral ax^n dx = a/(n+1) x^(n+1) + C dan luas di bawah kurva"
      },
      {
        "label": "Dinamika Rotasi dan Keseimbangan Benda Tegar (Torsi)",
        "prompt": "Buatkan soal tentang momen gaya tau = F . r sin theta dan momen inersia silinder pejal"
      },
      {
        "label": "Termodinamika: Hukum I Termodinamika dan Mesin Carnot",
        "prompt": "Buatkan soal tentang menghitung efisiensi mesin kalor Carnot eta = (1 - T2/T1) x 100%"
      },
      {
        "label": "Termokimia: Menghitung Entalpi Reaksi (Hukum Hess)",
        "prompt": "Buatkan soal tentang penentuan delta H reaksi menggunakan data energi ikatan rata-rata"
      },
      {
        "label": "Sistem Koordinasi Manusia: Sel Saraf, Otak, dan Hormon",
        "prompt": "Buatkan soal tentang penjalaran impuls sinapsis saraf dan hormon insulin pengendali gula"
      },
      {
        "label": "Teks Karya Ilmiah: Proposal Penelitian dan Skripsi",
        "prompt": "Buatkan soal tentang menyusun latar belakang masalah, rumusan masalah, dan metodologi"
      }
    ],
    "matematika": [
      {
        "label": "Operasi Perkalian Matriks Baris Kali Kolom",
        "prompt": "Buatkan soal tentang mengalikan matriks ordo 2x2 dan ordo 3x3 secara sistematis"
      },
      {
        "label": "Determinan dan Invers Matriks Ordo 2x2 dan 3x3",
        "prompt": "Buatkan soal tentang metode Sarrus determinan 3x3 dan penerapan matriks mencari solusi SPLDV"
      },
      {
        "label": "Model Matematika Program Linear pada Industri Konveksi",
        "prompt": "Buatkan soal tentang menyusun sistem pertidaksamaan linear kendala bahan baku dan tenaga kerja"
      },
      {
        "label": "Mencari Nilai Maksimum Fungsi Objektif Metode Titik Uji",
        "prompt": "Buatkan soal tentang keuntungan maksimum pedagang dari daerah arsiran feasible"
      },
      {
        "label": "Bunga Tunggal, Bunga Majemuk, dan Pertumbuhan Tabungan",
        "prompt": "Buatkan soal tentang menghitung total modal akhir setelah dibungakan majemuk selama 5 tahun"
      },
      {
        "label": "Menyelesaikan Limit Aljabar 0/0 dengan Pemfaktoran",
        "prompt": "Buatkan soal tentang limit x mendekati a fungsi rasional derajat dua dan tiga"
      },
      {
        "label": "Limit Fungsi Aljabar Mendekati Tak Hingga",
        "prompt": "Buatkan soal tentang membagi dengan pangkat tertinggi pada limit pecahan tak terhingga"
      },
      {
        "label": "Turunan Pertama Fungsi Hasil Kali dan Hasil Bagi (u/v)",
        "prompt": "Buatkan soal tentang rumus turunan f'(x) = (u'v - uv') / v²"
      },
      {
        "label": "Persamaan Garis Singgung Kurva Menggunakan Gradien Turunan",
        "prompt": "Buatkan soal tentang gradien m = f'(x1) menentukan garis singgung kurva parabola di titik (x1, y1)"
      },
      {
        "label": "Menentukan Interval Fungsi Naik dan Fungsi Turun",
        "prompt": "Buatkan soal tentang syarat f'(x) > 0 fungsi naik dan titik belok kurva"
      },
      {
        "label": "Integral Tentu untuk Menghitung Luas Bidang Datar",
        "prompt": "Buatkan soal tentang menghitung luas daerah yang dibatasi kurva y = x² dan garis y = 4"
      },
      {
        "label": "Rumus Jumlah dan Selisih Sudut Trigonometri (Sin & Cos)",
        "prompt": "Buatkan soal tentang rumus sin(A + B) = sin A cos B + cos A sin B mencari nilai sin 75°"
      }
    ],
    "indonesia": [
      {
        "label": "Menganalisis Teks Prosedur Kompleks Protokol Keselamatan",
        "prompt": "Buatkan soal tentang menelaah urutan langkah bersyarat pada instruksi keselamatan kerja pabrik"
      },
      {
        "label": "Kaidah Bahasa Teks Eksplanasi Fenomena Sosial Kemiskinan",
        "prompt": "Buatkan soal tentang penggunaan konjungsi kausalitas dan kronologis dalam teks ilmiah sosiologi"
      },
      {
        "label": "Struktur Teks Ceramah: Pembuka, Pengantar Materi, Penutup",
        "prompt": "Buatkan soal tentang menyusun ceramah bertema etika bermedia sosial yang santun dan persuasif"
      },
      {
        "label": "Kaidah Bahasa Teks Ceramah: Kata Sapaan dan Kata Ganti Jamak",
        "prompt": "Buatkan soal tentang penggunaan kata sapaan hadirin yang saya hormati dan kalimat persuasif"
      },
      {
        "label": "Menulis Cerpen Bertema Nilai Kemanusiaan dan Keadilan",
        "prompt": "Buatkan soal tentang membangun alur dramatik cerpen berlatar perjuangan masyarakat kecil"
      },
      {
        "label": "Struktur Proposal Kegiatan Sekolah dan Proposal Penelitian",
        "prompt": "Buatkan soal tentang menyusun latar belakang, dasar kegiatan, susunan kepanitiaan, dan anggaran dana"
      },
      {
        "label": "Menyusun Karya Ilmiah: Rumusan Masalah dan Tujuan Penelitian",
        "prompt": "Buatkan soal tentang merumuskan pertanyaan penelitian operasional yang terukur dan logis"
      },
      {
        "label": "Kaidah Sitasi Kutipan dan Penulisan Daftar Pustaka APA Style",
        "prompt": "Buatkan soal tentang menuliskan rujukan buku pengarang tahun judul kota penerbit secara baku"
      },
      {
        "label": "Struktur Teks Resensi Novel Sastra Pemenang Sayembara",
        "prompt": "Buatkan soal tentang mengulas gaya kepengarangan, kekuatan konflik psikologis, dan kekurangan buku"
      },
      {
        "label": "Struktur Naskah Drama: Babak, Adegan, dan Konflik Batin",
        "prompt": "Buatkan soal tentang menelaah dinamika konflik antarwatak protagonis dan antagonis naskah teater"
      },
      {
        "label": "Menyunting Makalah Ilmiah dari Kalimat Pleonastis dan Ambigu",
        "prompt": "Buatkan soal tentang membersihkan karya ilmiah dari kalimat mubazir dan tidak gramatikal"
      },
      {
        "label": "Menganalisis Nilai Moral dan Nilai Estetika Antologi Puisi",
        "prompt": "Buatkan soal tentang menelaah kedalaman tema kemanusiaan dari kumpulan puisi penyair modern"
      }
    ],
    "fisika": [
      {
        "label": "Momen Gaya (Torsi) dan Momen Inersia Berbagai Benda Tegar",
        "prompt": "Buatkan soal tentang menghitung torsi total pada batang homogen yang ditarik beberapa gaya berarah"
      },
      {
        "label": "Keseimbangan Benda Tegar pada Tangga Bersandar di Dinding",
        "prompt": "Buatkan soal tentang koefisien gesek lantai minimal agar tangga tidak tergelincir menopang orang"
      },
      {
        "label": "Hukum Kekekalan Momentum Sudut (L = I . omega)",
        "prompt": "Buatkan soal tentang penari es skating melipat tangan memperkecil inersia mempercepat putaran"
      },
      {
        "label": "Titik Berat Bangun Homogen Gabungan Dua Dimensi",
        "prompt": "Buatkan soal tentang koordinat titik berat bidang berbentuk huruf T atau bidang berlubang"
      },
      {
        "label": "Elastisitas Bahan dan Hukum Hooke Pegas (F = k . delta x)",
        "prompt": "Buatkan soal tentang menghitung konstanta pegas pengganti susunan seri-paralel dan energi potensial"
      },
      {
        "label": "Fluida Statis: Hukum Pascal dan Bejana Berhubungan",
        "prompt": "Buatkan soal tentang perbandingan luas penampang dongkrak hidrolik mengangkat beban mobil"
      },
      {
        "label": "Fluida Dinamis: Persamaan Kontinuitas dan Hukum Bernoulli",
        "prompt": "Buatkan soal tentang gaya angkat sayap pesawat terbang F = 1/2 rho A (v2² - v1²)"
      },
      {
        "label": "Teori Kinetik Gas: Persamaan Gas Ideal P.V = n.R.T",
        "prompt": "Buatkan soal tentang hubungan tekanan, volume, dan energi kinetik rata-rata partikel gas monoatomik"
      },
      {
        "label": "Hukum I dan II Termodinamika: Usaha pada Proses Isobarik/Isotermik",
        "prompt": "Buatkan soal tentang menghitung usaha gas W = P . delta V pada siklus mesin tertutup"
      },
      {
        "label": "Efisiensi Mesin Kalor Carnot dan Siklus Pendingin",
        "prompt": "Buatkan soal tentang perbandingan suhu reservoir tinggi dan reservoir rendah mencari efisiensi"
      },
      {
        "label": "Gelombang Mekanik: Cepat Rambat Gelombang Tali (Hukum Melde)",
        "prompt": "Buatkan soal tentang rumus v = akar(F / mu) menghitung tegangan senar gitar"
      },
      {
        "label": "Gelombang Bunyi: Efek Doppler dan Taraf Intensitas Bunyi (TI)",
        "prompt": "Buatkan soal tentang frekuensi pendengar mendekati sumber bunyi dan taraf intensitas n sumber sejenis"
      }
    ],
    "rpl": [
      {
        "label": "Pemrograman Berorientasi Objek: Class & Object",
        "prompt": "Buatkan soal RPL Kelas 11 tentang membuat blueprint class, instansiasi objek, dan constructor"
      },
      {
        "label": "Enkapsulasi: Hak Akses Private, Protected, Public",
        "prompt": "Buatkan soal RPL Kelas 11 tentang penyembunyian data melalui method getter dan setter"
      },
      {
        "label": "Pewarisan Sifat (Inheritance) dan Polimorfisme",
        "prompt": "Buatkan soal RPL Kelas 11 tentang superclass, subclass extends, dan method overriding"
      },
      {
        "label": "Relasi Tabel Kompleks dan Query SQL JOIN",
        "prompt": "Buatkan soal RPL Kelas 11 tentang klausa INNER JOIN, LEFT JOIN, dan pengelompokan GROUP BY"
      },
      {
        "label": "Arsitektur Pola Desain MVC (Model-View-Controller)",
        "prompt": "Buatkan soal RPL Kelas 11 tentang memisahkan logika data, tampilan antarmuka, dan kontrol alur"
      },
      {
        "label": "Pengembangan RESTful API dengan JSON Response",
        "prompt": "Buatkan soal RPL Kelas 11 tentang perancangan endpoint HTTP GET, POST, PUT, DELETE dan status code"
      },
      {
        "label": "Komponen Frontend Berbasis Komponen (Component State)",
        "prompt": "Buatkan soal RPL Kelas 11 tentang hierarki komponen UI, props data passing, dan event handling"
      },
      {
        "label": "Validasi Form Input dan Autentikasi Pengguna Session/JWT",
        "prompt": "Buatkan soal RPL Kelas 11 tentang sanitasi input data form dan verifikasi login pengguna"
      },
      {
        "label": "Aplikasi CRUD Web Lengkap Database Terhubung",
        "prompt": "Buatkan soal RPL Kelas 11 tentang alur simpan, baca, ubah, dan hapus rekaman data aplikasi"
      },
      {
        "label": "Pengujian Perangkat Lunak Unit Testing & Mocking",
        "prompt": "Buatkan soal RPL Kelas 11 tentang menulis skenario uji unit test assert untuk fungsi inti"
      },
      {
        "label": "Integrasi Layanan Pihak Ketiga (Third-Party API)",
        "prompt": "Buatkan soal RPL Kelas 11 tentang konsumsi endpoint eksternal memakai fetch/axios asynchronous"
      },
      {
        "label": "Kolaborasi Git Team: Branching, Pull Request, Merge",
        "prompt": "Buatkan soal RPL Kelas 11 tentang alur kerja feature branch dan penyelesaian konflik kode tim"
      }
    ],
    "tkj": [
      {
        "label": "Konfigurasi VLAN & Trunking 802.1Q Switch Manageable",
        "prompt": "Buatkan soal TKJ Kelas 11 tentang isolasi broadcast domain dan konfigurasi port access/trunk"
      },
      {
        "label": "Inter-VLAN Routing Router-on-a-Stick pada MikroTik",
        "prompt": "Buatkan soal TKJ Kelas 11 tentang pembuatan sub-antarmuka vlan dan gateway antardepartemen"
      },
      {
        "label": "Konfigurasi Routing Statis Multirouter Dua Hop",
        "prompt": "Buatkan soal TKJ Kelas 11 tentang pengisian routing table manual dst-address dan gateway next-hop"
      },
      {
        "label": "Dynamic Routing Protocol OSPF Single Area",
        "prompt": "Buatkan soal TKJ Kelas 11 tentang pertukaran packet hello, link-state advertisement (LSA), dan area backbone"
      },
      {
        "label": "Instalasi & Konfigurasi Layanan DHCP Server Linux",
        "prompt": "Buatkan soal TKJ Kelas 11 tentang parameter pool alamat, lease time, reservasi MAC static, dan relay"
      },
      {
        "label": "Konfigurasi DNS Server BIND9 (Forward & Reverse Zone)",
        "prompt": "Buatkan soal TKJ Kelas 11 tentang record A, CNAME, PTR, NS, dan pengujian nslookup domain lokal"
      },
      {
        "label": "Konfigurasi Web Server Apache/Nginx & Virtual Host",
        "prompt": "Buatkan soal TKJ Kelas 11 tentang direktori document root, listen port 80, dan hak akses file web"
      },
      {
        "label": "Manajemen Bandwidth Menggunakan Simple Queue & Queue Tree",
        "prompt": "Buatkan soal TKJ Kelas 11 tentang pengaturan target address, max-limit, limit-at, dan burst"
      },
      {
        "label": "Konfigurasi Keamanan Firewall: Filter Rules & NAT Masquerade",
        "prompt": "Buatkan soal TKJ Kelas 11 tentang proteksi port router, chain input/forward, dan source NAT internet"
      },
      {
        "label": "Konfigurasi Wireless Access Point & Hotspot Server",
        "prompt": "Buatkan soal TKJ Kelas 11 tentang captive portal login, pengaturan frekuensi, dan user profile"
      },
      {
        "label": "Penyambungan Kabel Fiber Optik (Fusion Splicing)",
        "prompt": "Buatkan soal TKJ Kelas 11 tentang teknik pengupasan buffer, pemotongan cleaver, dan peleburan core optik"
      },
      {
        "label": "Monitoring Jaringan Menggunakan Protokol SNMP",
        "prompt": "Buatkan soal TKJ Kelas 11 tentang OID, MIB, dan grafik pemantauan lalu lintas data antarmuka jaringan"
      }
    ]
  },
  "12": {
    "default": [
      {
        "label": "Dimensi Tiga: Jarak Titik ke Titik, Titik ke Garis Kubus",
        "prompt": "Buatkan soal tentang menghitung jarak titik sudut ke diagonal ruang kubus memakai segitiga siku-siku"
      },
      {
        "label": "Sudut Antargaris dan Sudut Garis ke Bidang Kubus/Limas",
        "prompt": "Buatkan soal tentang menghitung nilai kosinus sudut antara garis dan bidang alas limas segiempat"
      },
      {
        "label": "Statistika Data Berkelompok: Kuartil, Desil, Simpangan Baku",
        "prompt": "Buatkan soal tentang menghitung kuartil atas Q3 dan simpangan baku data tabel distribusi frekuensi"
      },
      {
        "label": "Kaidah Pencacahan: Permutasi dan Kombinasi Soal Kasus",
        "prompt": "Buatkan soal tentang memilih susunan pengurus inti organisasi dan kombinasi tim delegasi lomba"
      },
      {
        "label": "Peluang Kejadian Majemuk: Saling Lepas dan Kejadian Bersyarat",
        "prompt": "Buatkan soal tentang peluang terambil bola merah dan biru tanpa pengembalian dari dalam kotak"
      },
      {
        "label": "Limit Fungsi Trigonometri Mendekati Nol",
        "prompt": "Buatkan soal tentang rumus limit x mendekati 0 sin x / x = 1 dan tan ax / bx = a/b"
      },
      {
        "label": "Turunan Fungsi Trigonometri dan Aturan Rantai",
        "prompt": "Buatkan soal tentang turunan fungsi f(x) = sin³(2x + 5) dan titik stasioner kurva"
      },
      {
        "label": "Aplikasi Turunan: Kecepatan, Percepatan, Nilai Ekstrim",
        "prompt": "Buatkan soal tentang mencari titik belok dan selang kecekungan kurva fungsi"
      },
      {
        "label": "Integral Substitusi dan Integral Parsial Aljabar/Trigonometri",
        "prompt": "Buatkan soal tentang rumus integral u dv = uv - integral v du"
      },
      {
        "label": "Aplikasi Integral: Menghitung Volume Benda Putar",
        "prompt": "Buatkan soal tentang menghitung volume daerah diputar 360 derajat mengelilingi sumbu X metode cakram"
      },
      {
        "label": "Distribusi Peluang Binomial Variabel Acak Diskrit",
        "prompt": "Buatkan soal tentang rumus peluang binomial P(X = k) = nCk . p^k . q^(n-k)"
      },
      {
        "label": "Distribusi Normal Standar (Uji Z-Score dan Kurva Gauss)",
        "prompt": "Buatkan soal tentang menghitung probabilitas data berada di bawah kurva z-score pada seleksi masuk"
      }
    ],
    "matematika": [
      {
        "label": "Jarak Titik ke Garis pada Bangun Ruang Kubus",
        "prompt": "Buatkan soal tentang menentukan panjang proyeksi titik ke diagonal bidang kubus rusuk a cm"
      },
      {
        "label": "Jarak Titik ke Bidang pada Limas Segiempat Beraturan",
        "prompt": "Buatkan soal tentang menghitung jarak puncak limas T ke bidang alas ABCD"
      },
      {
        "label": "Menghitung Kuartil Tengah (Median) Data Berkelompok",
        "prompt": "Buatkan soal tentang rumus Me = Tb + (1/2 n - Fk)/f . c pada data tabel frekuensi"
      },
      {
        "label": "Menghitung Ragam (Varians) dan Simpangan Baku Data",
        "prompt": "Buatkan soal tentang menghitung akar kuadrat dari jumlah kuadrat selisih data terhadap rata-rata"
      },
      {
        "label": "Permutasi dengan Unsur Sama dan Permutasi Siklis",
        "prompt": "Buatkan soal tentang menyusun huruf dari kata MATEMATIKA dan posisi duduk melingkar rapat"
      },
      {
        "label": "Kombinasi Pemilihan Anggota Tim Delegasi Lomba",
        "prompt": "Buatkan soal tentang memilih 4 siswa putra dan 3 siswa putri dari kelompok kandidat"
      },
      {
        "label": "Peluang Pengambilan Bola Tanpa Pengembalian",
        "prompt": "Buatkan soal tentang peluang terambil 2 bola hitam berturut-turut dari wadah tertutup"
      },
      {
        "label": "Limit Fungsi Trigonometri Bentuk Tak Tentu 0/0",
        "prompt": "Buatkan soal tentang mengubah bentuk 1 - cos 2x menjadi 2 sin² x pada penyelesaian limit"
      },
      {
        "label": "Turunan Fungsi Trigonometri Menggunakan Aturan Rantai",
        "prompt": "Buatkan soal tentang turunan f(x) = cos(4x² - 3) mencari turunan pertama f'(x)"
      },
      {
        "label": "Aplikasi Turunan: Mencari Kecepatan dan Percepatan",
        "prompt": "Buatkan soal tentang turunan persamaan posisi s(t) terhadap waktu mencari laju sesaat"
      },
      {
        "label": "Integral Parsial Aljabar Kali Trigonometri",
        "prompt": "Buatkan soal tentang menyelesaikan bentuk integral x . sin x dx dengan permisalan u dan dv"
      },
      {
        "label": "Menghitung Volume Benda Putar Mengelilingi Sumbu X",
        "prompt": "Buatkan soal tentang rumus V = pi integral y² dx dari batas x = a sampai x = b"
      }
    ],
    "indonesia": [
      {
        "label": "Struktur Surat Lamaran Pekerjaan dan Riwayat Hidup (CV)",
        "prompt": "Buatkan soal tentang penulisan tanggal surat, lampiran, perihal, dan kualifikasi diri pelamar"
      },
      {
        "label": "Kaidah Ejaan Surat Lamaran: Penulisan Alamat dan Gelar",
        "prompt": "Buatkan soal tentang memperbaiki penulisan Yth. Direktur PT tanpa kata Kepada yang berlebihan"
      },
      {
        "label": "Struktur Teks Cerita Sejarah Novel Roman Sejarah",
        "prompt": "Buatkan soal tentang menelaah fakta sejarah proklamasi yang dipadukan dengan imajinasi sastrawan"
      },
      {
        "label": "Nilai-Nilai Luhur dalam Novel Sejarah Indonesia",
        "prompt": "Buatkan soal tentang menganalisis nilai kepahlawanan, nilai patriotisme, dan nilai moral tokoh"
      },
      {
        "label": "Struktur Teks Editorial (Tajuk Rencana) Surat Kabar",
        "prompt": "Buatkan soal tentang membedakan pernyataan fakta opini redaksi dan saran solusi isu nasional"
      },
      {
        "label": "Kaidah Kebahasaan Teks Editorial: Kata Keterangan Modalitas",
        "prompt": "Buatkan soal tentang penggunaan kata modalitas seharusnya, barangkali, dan konjungsi kausalitas"
      },
      {
        "label": "Menilai Argumen Pro-Kontra dalam Kolom Opini Publik",
        "prompt": "Buatkan soal tentang mengevaluasi ketajaman argumen penulis artikel terhadap kebijakan publik"
      },
      {
        "label": "Menganalisis Unsur Buku Pengayaan Nonfiksi Ilmiah Populer",
        "prompt": "Buatkan soal tentang mengkaji kekuatan data bibliografi dan sistematika penulisan bab buku"
      },
      {
        "label": "Struktur Artikel Ilmiah Populer Media Massa",
        "prompt": "Buatkan soal tentang menyusun artikel berbobot ilmiah dengan gaya bahasa komunikatif santai"
      },
      {
        "label": "Kaidah Penulisan Kritik Sastra dan Esai Sastra",
        "prompt": "Buatkan soal tentang membedakan kritik sastra yang objektif menghakimi teks dan esai sastra reflektif"
      },
      {
        "label": "Menulis Resensi Kritis Kumpulan Puisi Kontemporer",
        "prompt": "Buatkan soal tentang menelaah eksperimen tipografi dan kekuatan metafora penyair kontemporer"
      },
      {
        "label": "Menyunting Naskah Skripsi/Artikel dari Kesalahan Logika",
        "prompt": "Buatkan soal tentang memperbaiki argumen falasi sesat pikir dan inkonsistensi paragraf"
      }
    ],
    "fisika": [
      {
        "label": "Rangkaian Arus Searah (DC): Hukum I dan II Kirchhoff Loop",
        "prompt": "Buatkan soal tentang menghitung kuat arus pada rangkaian dua loop tertutup beda potensial ggl"
      },
      {
        "label": "Listrik Statis: Hukum Coulomb dan Energi Potensial Listrik",
        "prompt": "Buatkan soal tentang usaha memindahkan muatan q dari titik berpotensial V1 ke V2 (W = q delta V)"
      },
      {
        "label": "Kapasitor Keping Sejajar: Dielektrik dan Rangkaian Kapasitor",
        "prompt": "Buatkan soal tentang kapasitas C = epsilon0 A / d dan muatan kapasitor susunan seri paralel"
      },
      {
        "label": "Medan Magnet di Sekitar Kawat Lurus dan Kawat Melingkar",
        "prompt": "Buatkan soal tentang rumus Biot-Savart B = mu0 I / (2 pi r) kawat lurus panjang berarus"
      },
      {
        "label": "Gaya Lorentz pada Dua Kawat Sejajar Berarus Listrik",
        "prompt": "Buatkan soal tentang gaya tarik-menarik kawat berarus searah F/L = mu0 I1 I2 / (2 pi d)"
      },
      {
        "label": "Induksi Elektromagnetik: Hukum Faraday dan Hukum Lenz",
        "prompt": "Buatkan soal tentang ggl induksi epsilon = -N dphi/dt pada kumparan berputar dalam medan magnet"
      },
      {
        "label": "Rangkaian Arus Bolak-Balik (AC): R-L-C Seri dan Resonansi",
        "prompt": "Buatkan soal tentang impedansi Z = akar(R² + (XL - XC)²) dan frekuensi resonansi f0"
      },
      {
        "label": "Radiasi Elektromagnetik: Spektrum Gelombang dan Bahayanya",
        "prompt": "Buatkan soal tentang urutan energi frekuensi gelombang radio, gelombang mikro, sinar X, sinar gamma"
      },
      {
        "label": "Teori Relativitas Khusus Einstein: Dilatasi Waktu dan Kontraksi Panjang",
        "prompt": "Buatkan soal tentang waktu astronot bergerak relativistik t = gamma . t0 dan kontraksi panjang L"
      },
      {
        "label": "Fenomena Kuantum: Efek Fotolistrik dan Foton Cahaya",
        "prompt": "Buatkan soal tentang frekuensi ambang f0 dan energi kinetik elektron terlepas Ek = h.f - W0"
      },
      {
        "label": "Efek Compton dan Panjang Gelombang De Broglie Materi",
        "prompt": "Buatkan soal tentang hamburan foton menumbuk elektron bebas delta lambda = h/(m.c) (1 - cos theta)"
      },
      {
        "label": "Teknologi Radioaktivitas: Peluruhan Inti dan Waktu Paruh",
        "prompt": "Buatkan soal tentang rumus sisa massa zat radioaktif N(t) = N0 (1/2)^(t/T) dan reaktor fusi/fisi"
      }
    ],
    "rpl": [
      {
        "label": "Arsitektur Microservices vs Arsitektur Monolitik",
        "prompt": "Buatkan soal RPL Kelas 12 tentang decoupling layanan, service discovery, dan API gateway"
      },
      {
        "label": "Kontainerisasi Aplikasi Menggunakan Dockerfile",
        "prompt": "Buatkan soal RPL Kelas 12 tentang pembuatan image docker, container run, dan port forwarding"
      },
      {
        "label": "Automasi CI/CD Pipeline Menggunakan GitHub Actions",
        "prompt": "Buatkan soal RPL Kelas 12 tentang otomatisasi build, run test, dan deployment otomatis server"
      },
      {
        "label": "Keamanan Web Tingkat Lanjut: Mitigasi OWASP Top 10",
        "prompt": "Buatkan soal RPL Kelas 12 tentang pencegahan SQL Injection, XSS, CSRF, dan insecure deserialization"
      },
      {
        "label": "Optimasi Basis Data: Indexing dan Query Profiling",
        "prompt": "Buatkan soal RPL Kelas 12 tentang query plan EXPLAIN, indeks B-Tree, dan pencegahan N+1 problem"
      },
      {
        "label": "Pemrograman Aplikasi Mobile Lintas Platform",
        "prompt": "Buatkan soal RPL Kelas 12 tentang widget tree, navigasi halaman, dan pemanggilan API pada mobile"
      },
      {
        "label": "Manajemen State Aplikasi Mobile (Global State)",
        "prompt": "Buatkan soal RPL Kelas 12 tentang sinkronisasi data antarhalaman aplikasi tanpa prop drilling"
      },
      {
        "label": "Integrasi Sistem Pembayaran (Payment Gateway API)",
        "prompt": "Buatkan soal RPL Kelas 12 tentang alur webhook transaksi, signature hash verification, dan status order"
      },
      {
        "label": "Progressive Web App (PWA) dan Service Workers Caching",
        "prompt": "Buatkan soal RPL Kelas 12 tentang strategi cache offline, manifest json, dan background sync"
      },
      {
        "label": "Prinsip Clean Architecture & Clean Code Refactoring",
        "prompt": "Buatkan soal RPL Kelas 12 tentang pemisahan domain logic, dependency inversion, dan single responsibility"
      },
      {
        "label": "Pengujian Performa & Beban Sistem (Load Testing)",
        "prompt": "Buatkan soal RPL Kelas 12 tentang analisis throughput request per detik, latency, dan bottleneck server"
      },
      {
        "label": "Manajemen Log dan Monitoring Aplikasi Produksi",
        "prompt": "Buatkan soal RPL Kelas 12 tentang centralized logging, alerting error runtime, dan health check endpoint"
      }
    ],
    "tkj": [
      {
        "label": "Border Gateway Protocol (BGP) Routing Antar-Autonomous System",
        "prompt": "Buatkan soal TKJ Kelas 12 tentang peering eBGP, pertukaran AS number, dan path attributes"
      },
      {
        "label": "Virtual Private Network (VPN): IPsec, WireGuard, OpenVPN",
        "prompt": "Buatkan soal TKJ Kelas 12 tentang enkripsi tunnel, otentikasi kunci pre-shared, dan koneksi remote worker"
      },
      {
        "label": "Arsitektur Cloud Computing & Klaster Virtualisasi Server",
        "prompt": "Buatkan soal TKJ Kelas 12 tentang konfigurasi hypervisor bare-metal, storage cluster, dan live migration"
      },
      {
        "label": "Sistem Deteksi & Pencegahan Intrusi Jaringan (IDS/IPS)",
        "prompt": "Buatkan soal TKJ Kelas 12 tentang analisis pattern serangan port scanning, DDoS, dan rule Snort"
      },
      {
        "label": "Konfigurasi Server VoIP (Voice over IP) Berbasis SIP PBX",
        "prompt": "Buatkan soal TKJ Kelas 12 tentang dial plan extension, codec audio G.711, dan konfigurasi softphone SIP"
      },
      {
        "label": "Load Balancing & Failover Multi-WAN Router Enterprise",
        "prompt": "Buatkan soal TKJ Kelas 12 tentang metode PCC (Per Connection Classifier), bonding interface, dan check gateway"
      },
      {
        "label": "Analisis Paket Mendalam (Packet Sniffing) Wireshark",
        "prompt": "Buatkan soal TKJ Kelas 12 tentang filtering protokol TCP handshake SYN-ACK, HTTP request, dan DNS query"
      },
      {
        "label": "Automasi Konfigurasi Jaringan dengan Python & Ansible",
        "prompt": "Buatkan soal TKJ Kelas 12 tentang penulisan playbook declarative dan backup konfigurasi massal perangkat"
      },
      {
        "label": "Pengerasan Keamanan Perangkat Jaringan (Router Hardening)",
        "prompt": "Buatkan soal TKJ Kelas 12 tentang penutupan port default, SSH key authentication, dan disable Telnet/FTP"
      },
      {
        "label": "Arsitektur Software-Defined Wide Area Network (SD-WAN)",
        "prompt": "Buatkan soal TKJ Kelas 12 tentang pemisahan control plane dan data plane serta optimasi rute dinamis"
      },
      {
        "label": "Disaster Recovery & Redundansi Jaringan (VRRP Protocol)",
        "prompt": "Buatkan soal TKJ Kelas 12 tentang virtual router redundancy protocol, priority master, dan backup router"
      },
      {
        "label": "Audit Kinerja Jaringan: Analisis Jitter, Latensi, Packet Loss",
        "prompt": "Buatkan soal TKJ Kelas 12 tentang pengukuran Quality of Service (QoS) sesuai standar TIPHON"
      }
    ]
  }
};
