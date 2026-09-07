export type JenjangType = 'SD' | 'SMP' | 'SMA' | 'SMK';

export const CURRICULUM_SUBJECTS: Record<JenjangType, string[]> = {
  SMA: [
    'Pendidikan Agama dan Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Bahasa Inggris',
    'Matematika Umum',
    'Matematika Tingkat Lanjut',
    'Sejarah',
    'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    'Seni dan Budaya / Prakarya',
    'Informatika',
    'Biologi',
    'Kimia',
    'Fisika',
    'Sosiologi',
    'Ekonomi',
    'Geografi',
    'Antropologi',
    'Bahasa Arab',
    'Bahasa Jepang',
    'Bahasa Jerman',
    'Bahasa Mandarin',
    'Bahasa Prancis',
    'Bahasa Korea',
    'Muatan Lokal (Bahasa Daerah / Jawa)',
    'Muatan Lokal (Bahasa Sunda)',
    'Muatan Lokal (Bahasa Bali)',
    'Muatan Lokal (Kesenian & Budaya Daerah)',
    'Muatan Lokal (Keterampilan Daerah)',
  ],
  SMK: [
    // Mata Pelajaran Umum & Wajib Kejuruan
    'Pendidikan Agama dan Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Sejarah',
    'Seni Budaya',
    'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    'Matematika Kejuruan',
    'Bahasa Inggris Kejuruan',
    'Informatika',
    'Projek IPAS (Ilmu Pengetahuan Alam dan Sosial Terapan)',
    'Projek Kreatif dan Kewirausahaan (PKK)',
    'Praktik Kerja Lapangan (PKL)',
    'Mata Pelajaran Pilihan Kejuruan',

    // Dasar-Dasar Program Keahlian (Kelas 10)
    'Dasar-Dasar Pengembangan Perangkat Lunak dan Gim (PPLG)',
    'Dasar-Dasar Teknik Jaringan Komputer dan Telekomunikasi (TJKT)',
    'Dasar-Dasar Desain Komunikasi Visual (DKV)',
    'Dasar-Dasar Akuntansi dan Keuangan Lembaga (AKL)',
    'Dasar-Dasar Manajemen Perkantoran dan Layanan Bisnis (MPLB)',
    'Dasar-Dasar Pemasaran dan Bisnis Digital',
    'Dasar-Dasar Teknik Otomotif',
    'Dasar-Dasar Teknik Mesin',
    'Dasar-Dasar Teknik Ketenagalistrikan',
    'Dasar-Dasar Teknik Elektronika',
    'Dasar-Dasar Perhotelan',
    'Dasar-Dasar Kuliner / Tata Boga',
    'Dasar-Dasar Desain dan Produksi Busana',
    'Dasar-Dasar Layanan Kesehatan dan Keperawatan',
    'Dasar-Dasar Farmasi Klinis dan Komunitas',

    // Konsentrasi Keahlian (Spesifik Jurusan SMK Kelas 11 & 12)
    'Rekayasa Perangkat Lunak (RPL)',
    'Teknik Komputer dan Jaringan (TKJ)',
    'Pengembangan Gim (Game Development)',
    'Desain Komunikasi Visual (DKV / Multimedia)',
    'Animasi 2D & 3D',
    'Akuntansi dan Keuangan Lembaga (AKL)',
    'Manajemen Perkantoran / Otomatisasi Perkantoran (OTKP)',
    'Bisnis Digital dan Retail Pemasaran',
    'Teknik Kendaraan Ringan Otomotif (TKRO)',
    'Teknik dan Bisnis Sepeda Motor (TBSM)',
    'Teknik Pemesinan (Mesin Bubut/Fraiss/CNC)',
    'Teknik Pengelasan (Welding / SMAW / GMAW)',
    'Teknik Instalasi Tenaga Listrik (TITL)',
    'Teknik Audio Video (TAV)',
    'Teknik Mekatronika',
    'Perhotelan dan Akomodasi',
    'Kuliner (Tata Boga / Pastry & Bakery)',
    'Tata Busana / Desain Mode Fashion',
    'Tata Kecantikan Kulit dan Rambut',
    'Farmasi Klinis dan Komunitas',
    'Asisten Keperawatan dan Caregiver',
    'Agribisnis Tanaman dan Pengolahan Hasil Pertanian',

    // Bahasa Asing Pilihan Kejuruan
    'Bahasa Jepang Kejuruan',
    'Bahasa Mandarin Kejuruan',
    'Bahasa Jerman Kejuruan',
    'Bahasa Arab Kejuruan',
    'Bahasa Korea Kejuruan',
    'Bahasa Prancis Kejuruan',

    // Muatan Lokal SMK
    'Muatan Lokal (Bahasa Daerah / Jawa)',
    'Muatan Lokal (Bahasa Sunda)',
    'Muatan Lokal (Bahasa Bali)',
    'Muatan Lokal (Kesenian & Budaya Daerah)',
    'Muatan Lokal (Potensi Industri Kreatif Daerah)',
  ],
  SD: [
    'Pendidikan Agama dan Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    'Seni dan Budaya (Seni Rupa, Musik, Tari, Teater)',
    'Bahasa Inggris',
    'Muatan Lokal (Bahasa Daerah / Jawa)',
    'Muatan Lokal (Bahasa Sunda)',
    'Muatan Lokal (Bahasa Bali)',
    'Muatan Lokal (Kesenian Daerah)',
    'Muatan Lokal (Pendidikan Lingkungan Hidup)',
  ],
  SMP: [
    'Pendidikan Agama dan Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Ilmu Pengetahuan Alam (IPA)',
    'Ilmu Pengetahuan Sosial (IPS)',
    'Bahasa Inggris',
    'Informatika',
    'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    'Seni dan Prakarya (Seni Rupa, Musik, Tari, Teater)',
    'Muatan Lokal (Bahasa Daerah / Jawa)',
    'Muatan Lokal (Bahasa Sunda)',
    'Muatan Lokal (Bahasa Bali)',
    'Muatan Lokal (Kesenian Daerah)',
    'Muatan Lokal (Pendidikan Lingkungan Hidup)',
  ],
};

export function getGradeNumber(grade?: string): number | null {
  if (!grade) return null;
  const match = grade.match(/\b([1-9]|1[0-2])\b/);
  return match ? parseInt(match[1], 10) : null;
}

export function getJenjangFromGrade(grade?: string): JenjangType {
  if (!grade) return 'SMA';
  const clean = grade.trim().toUpperCase();
  if (clean.includes('SMK')) return 'SMK';
  if (clean.includes('SMP')) return 'SMP';
  if (clean.includes('SD') || clean.includes('DASAR') || clean.includes('MI')) return 'SD';
  if (clean.includes('SMA') || clean.includes('MA')) return 'SMA';

  const num = getGradeNumber(grade);
  if (num !== null) {
    if (num >= 1 && num <= 6) return 'SD';
    if (num >= 7 && num <= 9) return 'SMP';
    if (num >= 10 && num <= 12) return 'SMA';
  }
  return 'SMA';
}

export function formatGradeLabel(grade: string): string {
  if (!grade) return '';
  const g = grade.trim().toUpperCase();
  if (g === 'SD 1' || g === '1' || g === 'KELAS 1' || g === 'KELAS 1 SD') return 'Kelas 1 SD';
  if (g === 'SD 2' || g === '2' || g === 'KELAS 2' || g === 'KELAS 2 SD') return 'Kelas 2 SD';
  if (g === 'SD 3' || g === '3' || g === 'KELAS 3' || g === 'KELAS 3 SD') return 'Kelas 3 SD';
  if (g === 'SD 4' || g === '4' || g === 'KELAS 4' || g === 'KELAS 4 SD') return 'Kelas 4 SD';
  if (g === 'SD 5' || g === '5' || g === 'KELAS 5' || g === 'KELAS 5 SD') return 'Kelas 5 SD';
  if (g === 'SD 6' || g === '6' || g === 'KELAS 6' || g === 'KELAS 6 SD') return 'Kelas 6 SD';
  if (g === 'SMP 7' || g === '7' || g === 'KELAS 7' || g === 'KELAS 7 SMP') return 'Kelas 7 SMP';
  if (g === 'SMP 8' || g === '8' || g === 'KELAS 8' || g === 'KELAS 8 SMP') return 'Kelas 8 SMP';
  if (g === 'SMP 9' || g === '9' || g === 'KELAS 9' || g === 'KELAS 9 SMP') return 'Kelas 9 SMP';
  if (g === 'SMA 10' || g === 'SMA/K 10' || g === '10' || g === 'KELAS 10' || g === 'KELAS 10 SMA') return 'Kelas 10 SMA';
  if (g === 'SMA 11' || g === 'SMA/K 11' || g === '11' || g === 'KELAS 11' || g === 'KELAS 11 SMA') return 'Kelas 11 SMA';
  if (g === 'SMA 12' || g === 'SMA/K 12' || g === '12' || g === 'KELAS 12' || g === 'KELAS 12 SMA') return 'Kelas 12 SMA';
  if (g === 'SMK 10' || g === 'KELAS 10 SMK') return 'Kelas 10 SMK';
  if (g === 'SMK 11' || g === 'KELAS 11 SMK') return 'Kelas 11 SMK';
  if (g === 'SMK 12' || g === 'KELAS 12 SMK') return 'Kelas 12 SMK';
  return grade;
}
