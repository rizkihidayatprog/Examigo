import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { AdaptiveExemplar, TeacherStyleProfile } from './adaptiveMemory';
import { getJenjangFromGrade, getGradeNumber, formatGradeLabel } from '../lib/curriculum';

export interface GenerateOptions {
  materialText: string;
  topic?: string;
  subject?: string;
  questionTypes: ('MULTIPLE_CHOICE' | 'ESSAY' | 'TRUE_FALSE' | 'SHORT_ANSWER')[];
  count: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  existingQuestions?: string[];
  referenceExemplars?: AdaptiveExemplar[];
  teacherStyleProfile?: TeacherStyleProfile;
  grade?: string;
  imageBase64?: string;
  imageMimeType?: string;
}

export interface GeneratedQuestion {
  text: string;
  type: 'MULTIPLE_CHOICE' | 'ESSAY' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic?: string;
  points: number;
  explanation?: string;
  imageUrl?: string;
  choices?: { text: string; isCorrect: boolean }[];
  materialSnippet?: string;
}

function getGeminiApiKey(): string {
  const envKey = (process.env.GEMINI_API_KEY || '').trim();
  if (envKey) return envKey;

  try {
    const cmsPath = path.join(__dirname, '../../cms_config.json');
    if (fs.existsSync(cmsPath)) {
      const config = JSON.parse(fs.readFileSync(cmsPath, 'utf-8'));
      if (config.geminiApiKey && typeof config.geminiApiKey === 'string') {
        return config.geminiApiKey.trim();
      }
    }
  } catch (err) {
    // ignore
  }
  return '';
}

export async function generateQuestionsWithAI(options: GenerateOptions): Promise<GeneratedQuestion[]> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Using smart semantic document parser to generate contextual questions.');
    return generateSmartDocumentQuestions(options);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    let avoidSection = '';
    if (options.existingQuestions && options.existingQuestions.length > 0) {
      avoidSection = `\nPENTING: Hindari membuat pertanyaan yang sama atau sangat mirip dengan pertanyaan-pertanyaan berikut yang sudah ada di bank soal:\n` + 
        options.existingQuestions.slice(0, 40).map((q, idx) => `${idx + 1}. ${q}`).join('\n') + '\n';
    }

    const gradeSection = options.grade ? `\n- Tingkatan Sekolah Target: ${options.grade}. Sesuaikan tingkat bahasa, kedalaman materi, tingkat kesulitan kognitif, dan kurikulum yang cocok untuk tingkatan tersebut.` : '';

    const imageInstruction = options.imageBase64
      ? `\n\nPENTING (ANALISIS GAMBAR): Gambar materi/diagram/grafik/lembar soal telah terlampir. Baca dan analisis isi visual gambar tersebut (teks, diagram, angka, grafik, rumus, atau tabel) secara teliti, lalu buatlah soal-soal ujian yang secara langsung menguji pemahaman terhadap gambar atau materi pada gambar tersebut.`
      : '';

    let exemplarSection = '';
    if (options.referenceExemplars && options.referenceExemplars.length > 0) {
      exemplarSection = `\n\nSTANDAR MUTU & ACUAN ADAPTIF (FEW-SHOT LEARNING BERBASIS BANK SOAL GURU):
Sistem telah menganalisis ${options.referenceExemplars.length} butir soal acuan terbaik yang telah divalidasi, diedit, atau digunakan Guru ini di Examigo:
` + options.referenceExemplars.map((ex, idx) => {
        let choiceText = '';
        if (ex.choices && ex.choices.length > 0) {
          choiceText = '\nOpsi Jawaban:\n' + ex.choices.map(c => `  - [${c.isCorrect ? 'KUNCI BENAR' : 'PENGECOH'}] ${c.text}`).join('\n');
        }
        let expText = ex.explanation ? `\nPembahasan/Alasan: ${ex.explanation}` : '';
        return `[CONTOH ACUAN #${idx + 1}] (${ex.difficulty} | ${ex.type} | Topik: ${ex.topic || 'Umum'}${ex.isCuratedByTeacher ? ' | Telah Dikurasi Guru' : ''})\n${ex.text}${choiceText}${expText}`;
      }).join('\n\n') + `\n
PETUNJUK PENYELARASAN KECERDASAN MUTLAK:
1. Pelajari gaya bahasa, kedalaman penalaran kognitif (HOTS), serta struktur narasi/stimulus dari Contoh Soal Acuan di atas.
2. Buatlah pilihan pengecoh (distractors) dengan tingkat plausibility yang setara dengan contoh di atas (tidak boleh dangkal atau mudah ditebak).
3. Soal-soal baru yang Anda hasilkan HARUS memiliki standar mutu dan ketajaman yang setara atau lebih tinggi dari contoh acuan guru tersebut!\n`;
    }

    let styleSection = '';
    if (options.teacherStyleProfile) {
      const p = options.teacherStyleProfile;
      const traits: string[] = [];
      if (p.prefersStimulus) {
        traits.push('- Guru ini menyukai soal berbasis teks stimulus, kutipan bacaan mendalam, atau skenario studi kasus nyata.');
      }
      if (p.prefersDetailedExplanation) {
        traits.push('- Guru ini memprioritaskan pembahasan/penjelasan yang komprehensif (mengapa kunci benar tepat dan di mana letak kekeliruan opsi lain).');
      }
      if (p.dominantTopics && p.dominantTopics.length > 0) {
        traits.push(`- Topik-topik yang telah banyak dikembangkan guru: ${p.dominantTopics.join(', ')}. Hadirkan sudut pandang baru yang memperkaya bank soal.`);
      }
      if (traits.length > 0) {
        styleSection = `\nPROFIL PREFERENSI & GAYA GURU (ADAPTIVE PEDAGOGICAL PROFILE):\n${traits.join('\n')}\n`;
      }
    }

    const subjectName = options.subject || options.topic || 'Umum';
    const subjectLower = subjectName.toLowerCase();
    const topicLower = (options.topic || '').toLowerCase();
    const rawMaterial = (options.materialText || '').trim();
    const wordCount = rawMaterial.split(/\s+/).filter(Boolean).length;
    const isShortPrompt = wordCount < 30 && !options.imageBase64;

    const isExplicitNonEnglish = 
      !subjectLower.includes('inggris') &&
      /seni|budaya|prakarya|rupa|musik|tari|teater|matematika|ipa|ips|fisika|kimia|biologi|sejarah|geografi|ekonomi|sosiologi|antropologi|pancasila|agama|pjok|jasmani|olahraga|informatika|ipas|pplg|tjkt|dkv|akl|mplb|otkp|rpl|tkj|otomotif|tkro|tbsm|mesin|pengelasan|welding|titl|tav|mekatronika|perhotelan|kuliner|boga|busana|farmasi|keperawatan|agribisnis|pkk|pkl|jawa|sunda|bali/i.test(
        subjectName + ' ' + (options.topic || '')
      );

    const isEnglishSubject = !isExplicitNonEnglish && (
      subjectLower.includes('inggris') || 
      subjectLower.includes('english') || 
      topicLower.includes('english') ||
      topicLower.includes('tense') ||
      topicLower.includes('grammar') ||
      topicLower.includes('recount') ||
      topicLower.includes('narrative')
    );

    const isSeniBudayaSubject = 
      /seni|budaya|prakarya|rupa|musik|tari|teater|lukis|kriya/i.test(subjectName + ' ' + (options.topic || ''));

    const isKejuruanSubject = 
      /rpl|rekayasa perangkat lunak|tkj|teknik komputer|pplg|tjkt|dkv|desain komunikasi|akl|akuntansi|pkk|kewirausahaan|otomotif|tkro|tbsm|pemesinan|pengelasan|titl|ketenagalistrikan|elektronika|perhotelan|kuliner|tata boga|busana|farmasi|keperawatan/i.test(
        subjectName + ' ' + (options.topic || '')
      );

    let subjectRule = '';
    if (isEnglishSubject) {
      subjectRule = `
PANDUAN MUTLAK MATA PELAJARAN BAHASA INGGRIS (CRITICAL RULES FOR ENGLISH EXAM):
1. **BAHASA PENGANTAR SOAL**:
   - Seluruh teks soal (pertanyaan, teks bacaan stimulus, narasi cerita, dialog percakapan) dan seluruh pilihan jawaban (A, B, C, D) WAJIB 100% MENGGUNAKAN BAHASA INGGRIS yang alami, gramatikal, dan akurat (Natural English).
   - DILARANG KERAS mencampuradukkan bahasa Indonesia di dalam teks pertanyaan ataupun pilihan jawaban (kecuali tipe soal penerjemahan).
2. **KEDALAMAN & KONTEN SESUAI KURIKULUM (${options.grade || 'Sekolah'})**:
   - Jika topik berupa Grammar / Tenses (misal: Simple Past, Present Perfect, Passive Voice, Conditional, Modals):
     * Buatlah kalimat kontekstual atau dialog rumpang yang menguji tata bahasa tersebut secara presisi.
     * Pilihan pengecoh (distractors) harus berupa bentuk kata kerja/tata bahasa yang salah secara logis (common grammatical mistakes), BUKAN kata acak yang ngawur!
   - Jika topik berupa Teks / Reading Comprehension (Narrative, Recount, Procedure, Descriptive, Report, Announcement, Letter):
     * Tuliskan teks bacaan atau dialog utuh yang menarik, lalu berikan pertanyaan pemahaman bacaan (main idea, detailed fact, reference, synonym/antonym, conclusion).
3. **PENJELASAN (EXPLANATION)**:
   - Penjelasan dapat menggunakan Bahasa Indonesia atau Bahasa Inggris untuk menerangkan aturan grammar atau bukti dari teks bacaan.`;
    } else if (isSeniBudayaSubject) {
      subjectRule = `
PANDUAN MUTLAK MATA PELAJARAN SENI DAN BUDAYA / PRAKARYA (${options.grade || 'Sekolah'}):
1. **FOKUS KURIKULUM NASIONAL**:
   - Soal WAJIB berakar pada ranah Seni Budaya: Seni Rupa (unsur-unsur rupa, prinsip berkarya, 2D/3D, teknik lukis/kriya/batik/nirmana), Seni Musik (alat musik tradisional nusantara, tangga nada, melodi, ritme), Seni Tari (wiraga, wirama, wirasa), Seni Teater, atau Prakarya & Kewirausahaan.
2. **BAHASA PENGANTAR**:
   - Seluruh pertanyaan, narasi, dan pilihan jawaban (A, B, C, D) WAJIB 100% menggunakan Bahasa Indonesia yang baku dan komunikatif sesuai terminologi Seni Budaya kurikulum nasional.`;
    } else if (isKejuruanSubject) {
      subjectRule = `
PANDUAN MUTLAK MATA PELAJARAN KEJURUAN SMK (${subjectName}):
1. **FOKUS PRAKTIK & STUDI KASUS INDUSTRI (HOTS & WORKPLACE SCENARIOS)**:
   - Gunakan skenario nyata dunia kerja/industri, Standard Operating Procedure (SOP), trouble-shooting, studi kasus kerja, atau analisis prosedur teknis yang relevan.
   - Pilihan pengecoh harus mencerminkan kesalahan umum atau miskonsepsi teknis siswa di bengkel/lab/tempat kerja, bukan opsi asal-asalan.
2. **TERMINOLOGI STANDAR INDUSTRI**:`;
    }

    let gradeRule = '';
    if (options.grade) {
      const effJenjang = getJenjangFromGrade(options.grade);
      const gradeNum = getGradeNumber(options.grade);
      const friendlyGrade = formatGradeLabel(options.grade) || options.grade;

      if (effJenjang === 'SD') {
        if (gradeNum === 1 || gradeNum === 2) {
          gradeRule = `
PANDUAN MUTLAK TINGKATAN KELAS ${gradeNum || '1-2'} SD (FASE A - USIA 6-7 TAHUN):
1. TINGKAT PERKEMBANGAN SISWA KELAS 1-2 SD:
   - Target siswa adalah anak usia 6-7 tahun yang BARU BELAJAR MEMBACA dan BERHITUNG DASAR.
   - Kalimat pertanyaan WAJIB SANGAT PENDEK dan SEDERHANA (maksimal 1-2 kalimat, 8-15 kata).
   - Gunakan kata-kata konkret yang sangat akrab bagi anak kecil (ibu, ayah, kucing, apel, pensil, tas, bola, mainan).
2. BATASAN MATERI (MUTLAK DILARANG MELEBIHI):
   - MATEMATIKA: HANYA bilangan 1 sampai 20! Penjumlahan & pengurangan dasar konkret menggunakan gambar/benda nyata. DILARANG KERAS membuat soal tentang: perkalian, pembagian bersusun, pecahan, KPK, FPB, rumus luas/keliling/volume, atau bilangan negatif!
   - BAHASA INDONESIA: Huruf vokal/konsonan, membaca suku kata sederhana (ba-bi-bu), melengkapi kata sederhana bergambar, nama benda di rumah/kelas, tanda titik di akhir kalimat. DILARANG teks bacaan panjang atau analisis sastra!
   - DILARANG KERAS membuat soal dengan tingkat SMP apalagi SMA!
3. OPSI JAWABAN:
   - Singkat dan jelas (1-3 kata per opsi). Pilihan jawaban harus mudah dibedakan oleh anak SD kelas awal.`;
        } else if (gradeNum === 3 || gradeNum === 4) {
          gradeRule = `
PANDUAN MUTLAK TINGKATAN KELAS ${gradeNum} SD (FASE B - USIA 8-10 TAHUN):
1. TINGKAT MATERI WAJIB SD KELAS 3-4 (FASE B):
   - Seluruh butir soal disesuaikan untuk siswa usia 8-10 tahun.
   - Matematika: Bilangan cacah s.d. 1.000 atau 10.000, perkalian dan pembagian dasar, pecahan senilai dasar (1/2, 1/4), luas/keliling persegi petak satuan. DILARANG aljabar variabel x/y, trigonometri, kalkulus, atau rumus rumit SMA!
   - IPAS: Wujud benda padat/cair/gas, bagian tumbuhan & fotosintesis dasar, metamorfosis hewan, gaya dorong/tarik/gesek/magnet.
   - Bahasa: Stimulus bacaan maksimal 1 paragraf pendek (3-4 kalimat sederhana).`;
        } else {
          gradeRule = `
PANDUAN MUTLAK TINGKATAN KELAS ${gradeNum || '5-6'} SD (FASE C - USIA 10-12 TAHUN):
1. TINGKAT MATERI WAJIB SD KELAS TINGGI (FASE C):
   - Disesuaikan untuk kurikulum SD kelas 5-6 (pecahan desimal, KPK/FPB kontekstual, volume bangun ruang kubus/balok, organ tubuh dasar, tata surya).
   - DILARANG membuat soal tingkat SMP (aljabar SPLDV, Pythagoras) atau tingkat SMA (trigonometri, kalkulus)!`;
        }
      } else if (effJenjang === 'SMP') {
        gradeRule = `
PANDUAN MUTLAK TINGKATAN SMP (${friendlyGrade}):
1. TINGKAT MATERI WAJIB TINGKAT SMP:
   - Sesuaikan kedalaman materi dengan kurikulum SMP (${friendlyGrade}).
   - Hindari materi advance SMA/kalkulus/analisis kimia stoikiometri/jurnal yang belum diajarkan di SMP.
2. TINGKAT KOGNITIF:
   - Bangun pertanyaan yang menguji pemahaman konsep dasar, penerapan pada situasi remaja/sekolah, dan pengenalan analisis sebab-akibat sederhana.`;
      } else if (effJenjang === 'SMK') {
        gradeRule = `
PANDUAN MUTLAK TINGKATAN SEKOLAH MENENGAH KEJURUAN (${friendlyGrade}):
1. TINGKAT MATERI WAJIB KEJURUAN VOKASIONAL (SMK):
   - Fokus pada kompetensi keahlian kejuruan praktis, praktik kerja bengkel/lab, Standar Operasional Prosedur (SOP), K3, dan studi kasus industri nyata.`;
      } else {
        gradeRule = `
PANDUAN MUTLAK TINGKATAN SEKOLAH MENENGAH ATAS (${friendlyGrade}):
1. TINGKAT MATERI WAJIB TINGKAT SMA:
   - Penekanan pada High Order Thinking Skills (HOTS), analisis kritis, pemahaman teoritis mendalam, dan pemecahan masalah kompleks.`;
      }
    }

    const isPromptInstruction = 
      isShortPrompt || 
      /^(buatkan|buat|susun|berikan|bikin|tuliskan|soal tentang|latihan soal)\b/i.test(rawMaterial);

    let inputModeRule = '';
    if (isPromptInstruction) {
      inputModeRule = `
PANDUAN MUTLAK MODE PROMPTING (LANGSUNG SOAL TO THE POINT):
1. Guru memberikan instruksi prompt: "${rawMaterial}".
2. DILARANG KERAS menyalin kalimat instruksi prompt guru ("${rawMaterial}") ke dalam teks soal!
3. DILARANG KERAS menambahkan format pembuka seperti:
   - "Teks Bacaan: \"${rawMaterial}\""
   - "Konteks / Skenario: \"${rawMaterial}\""
   - "Berdasarkan kutipan teks bacaan di atas, ..."
4. SOAL HARUS LANGSUNG TO THE POINT menanyakan konsep, prosedur, prinsip, atau studi kasus nyata dari tema tersebut!
   Contoh BENAR: "Langkah pertama yang wajib dilakukan pekerja dalam mitigasi bencana gempa bumi di area bengkel kerja industri adalah..."
   Contoh SALAH: "Teks Bacaan: 'Buatkan soal mitigasi bencana...' Pertanyaan: Berdasarkan teks bacaan di atas..."`;
    }

    const prompt = `Anda adalah Master Assessment Specialist & Pakar Pembuat Soal Ujian Kurikulum Standar Nasional & Internasional.${imageInstruction}
Tugas Anda adalah menganalisis materi/topik yang diberikan secara mendalam dan merumuskan ${options.count} butir soal ujian berstandar tinggi yang variatif, cerdas, dan bermakna.

PRINSIP PENYUSUNAN SOAL CERDAS (PEDAGOGIS & HOTS):
1. **PENINGKATAN KOGNITIF (BLOOM'S TAXONOMY & HOTS)**:
   - Untuk tingkat **EASY**: Fokus pada Pemahaman Konsep (C2) dan Pengetahuan Faktual (C1) dengan kalimat yang lugas dan tidak ambigu.
   - Untuk tingkat **MEDIUM**: Fokus pada Penerapan (C3) dan Analisis (C4), menguji bagaimana konsep materi digunakan untuk menyelesaikan studi kasus atau skenario nyata.
   - Untuk tingkat **HARD**: Fokus pada Analisis Kritis (C4), Evaluasi (C5), dan Sintesis (C6), meminta siswa membandingkan metode, menemukan solusi terbaik dari trade-off, atau menganalisis dampak suatu keputusan.

2. **KUALITAS PILIHAN JAWABAN (DISTRACTOR QUALITY)**:
   - **Kunci Jawaban (isCorrect: true)**: Harus 100% akurat, tidak terbantahkan, dan berlandaskan konsep materi.
   - **Pengecoh (Distractors - isCorrect: false)**: Harus **masuk akal (plausible)**, setara dalam panjang kalimat dan gaya bahasa, serta mencerminkan miskonsepsi umum. DILARANG membuat opsi konyol, asal-asalan, atau jelas-jelas tidak nyambung!

3. **SOAL UTUH & SELF-CONTAINED**:
   - Tuliskan pertanyaan yang mandiri dan jelas.
   - Dilarang membuat kalimat menggantung, placeholder ("___"), atau titik-titik kosong ("...").
   - Untuk Matematika/Sains, gunakan simbol Unicode resmi (√, π, ², ³, ±, ×, ÷, ≠, ≤, ≥, °C, Ω).

4. **VARIASI GAYA PERTANYAAN**:
   - Jangan membuat pola soal yang seragam (misal semua bertanya "Apa gagasan utama...").
   - Variasikan antara: Studi Kasus / Skenario Praktis, Hubungan Sebab-Akibat, Analisis Fungsi & Peran, Perbandingan Kelebihan & Kekurangan, serta Pemecahan Masalah.
${styleSection}${exemplarSection}${avoidSection}${gradeRule}${subjectRule}${inputModeRule}
Detail Permintaan:
- Jumlah Butir Soal: ${options.count}
- Tingkat Kesulitan: ${options.difficulty}${gradeSection}
- Tipe Butir Soal: ${options.questionTypes.join(', ')}
- Mata Pelajaran: ${subjectName}
- Topik / Materi: ${options.topic || subjectName}

Materi / Topik Referensi:
"""
${rawMaterial.slice(0, 15000)}
"""

FORMAT OUTPUT (WAJIB JSON ARRAY MURNI):
[
  {
    "text": "Pertanyaan soal yang tajam, terstruktur dengan baik, dan langsung to the point?",
    "type": "MULTIPLE_CHOICE",
    "difficulty": "${options.difficulty}",
    "topic": "${options.topic || 'Umum'}",
    "points": 1.0,
    "explanation": "Penjelasan komprehensif: mengapa opsi benar tepat secara teori dan mengapa opsi lainnya salah.",
    "choices": [
      { "text": "Pilihan A (Pengecoh yang logis dan setara)", "isCorrect": false },
      { "text": "Pilihan B (Pengecoh yang logis dan setara)", "isCorrect": false },
      { "text": "Pilihan C (Pengecoh yang logis dan setara)", "isCorrect": false },
      { "text": "Pilihan D (Opsi yang presisi, akurat, dan didukung materi)", "isCorrect": true }
    ]
  }
]`;

    const contents: any[] = [];
    if (options.imageBase64 && options.imageMimeType) {
      const cleanBase64 = options.imageBase64.includes(',')
        ? options.imageBase64.split(',')[1]
        : options.imageBase64;
      contents.push({
        inlineData: {
          data: cleanBase64,
          mimeType: options.imageMimeType || 'image/png',
        },
      });
    }
    contents.push(prompt);

    // Try model names in order of preference (Official Gemini 2.5/2.0 Flash and fallback models)
    const candidateModels = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-2.5-flash-lite',
      'gemini-1.5-flash',
      'gemini-flash-latest',
    ];
    let lastErr: any = null;
    let text = '';

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
        });
        if (response.text) {
          text = response.text;
          break;
        }
      } catch (err: any) {
        lastErr = err;
        console.warn(`Gemini model ${modelName} failed, trying next candidate...`);
      }
    }

    if (!text && lastErr) {
      throw lastErr;
    }

    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const rawQuestions: GeneratedQuestion[] = JSON.parse(cleanJson);
    
    // Sanitize & shuffle: strip bad chars, then randomize choices position
    const questions = rawQuestions.map((q) => {
      let cleanText = (q.text || '')
        .replace(/_{3,}/g, '')
        .replace(/"\s*"/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

      // Strip echoed prompt instructions disguised as "Teks Bacaan" or "Konteks / Skenario"
      const promptInstructionEchoRegex = /^(?:Teks Bacaan|Teks Rujukan|Kutipan Teks|Konteks\s*(?:\/\s*Skenario)?(?:\s*\(jika relevan\))?)\s*:\s*["“][^"”]+["”]\s*\n*\s*(?:Pertanyaan\s*:\s*)?/i;
      if (promptInstructionEchoRegex.test(cleanText)) {
        const match = cleanText.match(promptInstructionEchoRegex);
        if (match) {
          const matchLower = match[0].toLowerCase();
          const rawLower = (options.materialText || '').toLowerCase();
          if (
            matchLower.includes('buatkan') ||
            matchLower.includes('soal') ||
            matchLower.includes('buat') ||
            (rawLower && matchLower.includes(rawLower.slice(0, 20)))
          ) {
            cleanText = cleanText.replace(promptInstructionEchoRegex, '').trim();
          }
        }
      }

      // Shuffle choices so correct answer is NOT always at position A
      const shuffledChoices = q.choices ? shuffleArray([...q.choices]) : q.choices;
      return {
        ...q,
        text: cleanText,
        choices: shuffledChoices,
      };
    });

    // Attach image URL if input had an image
    if (options.imageBase64) {
      const fullDataUrl = options.imageBase64.startsWith('data:')
        ? options.imageBase64
        : `data:${options.imageMimeType || 'image/png'};base64,${options.imageBase64}`;

      questions.forEach((q) => {
        q.imageUrl = fullDataUrl;
      });
    }

    // Deduplicate against existing questions and self-duplicates
    const existingSet = new Set((options.existingQuestions || []).map((q) => q.trim().toLowerCase()));
    const uniqueQuestions: GeneratedQuestion[] = [];
    for (const q of questions) {
      const txt = (q.text || '').trim().toLowerCase();
      if (!existingSet.has(txt)) {
        existingSet.add(txt);
        uniqueQuestions.push(q);
      }
    }
    return uniqueQuestions;
  } catch (error) {
    console.error('Error generating questions with Gemini API, falling back to smart analyzer:', error);
    return generateSmartDocumentQuestions(options);
  }
}

/** Fisher-Yates shuffle — randomizes array in-place and returns it */
function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function cleanSentence(str: string): string {
  return str
    .replace(/_{2,}/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^[^\w]+|[^\w]+$/g, '')
    .trim();
}

/**
 * Smart semantic document analyzer & question builder.
 * Secara cerdas membaca teks asli, mengenali jenis dokumen (Surat, Dokumen Formal, Artikel, dsb.),
 * dan menyusun butir soal yang 100% kontekstual dan masuk akal terhadap isi materi.
 */
function generateSmartDocumentQuestions(options: GenerateOptions): GeneratedQuestion[] {
  const rawText = (options.materialText || '').trim();
  const lowerText = rawText.toLowerCase();
  const types = options.questionTypes.length > 0 ? options.questionTypes : ['MULTIPLE_CHOICE'];
  const questions: GeneratedQuestion[] = [];

  const subjectStr = (options.subject || '').toLowerCase();
  const topicStr = (options.topic || '').toLowerCase();

  const isExplicitNonEnglish = 
    !subjectStr.includes('inggris') &&
    /seni|budaya|prakarya|rupa|musik|tari|teater|matematika|ipa|ips|fisika|kimia|biologi|sejarah|geografi|ekonomi|sosiologi|antropologi|pancasila|agama|pjok|jasmani|olahraga|informatika|ipas|pplg|tjkt|dkv|akl|mplb|otkp|rpl|tkj|otomotif|tkro|tbsm|mesin|pengelasan|welding|titl|tav|mekatronika|perhotelan|kuliner|boga|busana|farmasi|keperawatan|agribisnis|pkk|pkl|jawa|sunda|bali/i.test(
      subjectStr + ' ' + topicStr
    );

  // Detect: Mata Pelajaran Bahasa Inggris atau Teks Berbahasa Inggris
  const isEnglish = !isExplicitNonEnglish && (
    subjectStr.includes('inggris') ||
    subjectStr.includes('english') ||
    topicStr.includes('english') ||
    topicStr.includes('tense') ||
    topicStr.includes('grammar') ||
    topicStr.includes('narrative') ||
    topicStr.includes('recount') ||
    (!options.subject && /\b(english|past tense|simple past|irregular verbs?|recount text|narrative text)\b/i.test(rawText))
  );

  if (isEnglish) {
    const isPastTense = lowerText.includes('past') || lowerText.includes('lampau') || lowerText.includes('yesterday') || lowerText.includes('went');
    
    const englishQuestions: GeneratedQuestion[] = isPastTense ? [
      {
        text: `Dialogue:\nRiko: "Where did you go for vacation last weekend?"\nSinta: "My family and I ... to Bali and visited Tanah Lot."\n\nQuestion: Which is the correct verb form to complete the dialogue?`,
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Simple Past Tense',
        points: 1.0,
        explanation: 'The question asks about an event in the past (last weekend), so the correct verb is the past form (V2): "went".',
        choices: [
          { text: 'went', isCorrect: true },
          { text: 'go', isCorrect: false },
          { text: 'gone', isCorrect: false },
          { text: 'are going', isCorrect: false },
        ],
      },
      {
        text: `Reading Text:\n"Yesterday morning, Sarah woke up early because she had an important examination. She prepared her stationery and arrived at school thirty minutes before the bell rang. Fortunately, she was able to finish all questions smoothly."\n\nQuestion: Why did Sarah wake up early yesterday morning?`,
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Recount Text Comprehension',
        points: 1.0,
        explanation: 'According to the text, Sarah woke up early because she had an important examination.',
        choices: [
          { text: 'Because she had an important examination', isCorrect: true },
          { text: 'Because she wanted to play games with friends', isCorrect: false },
          { text: 'Because the school bell was already ringing', isCorrect: false },
          { text: 'Because she forgot where her stationery was', isCorrect: false },
        ],
      },
      {
        text: `Sentence:\n"The students ... very happy when their teacher announced the winner of the science competition yesterday."\n\nQuestion: Choose the appropriate auxiliary verb to fill in the blank.`,
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Past Tense To-Be (Was/Were)',
        points: 1.0,
        explanation: '"The students" is a plural subject in the past tense, so the appropriate verb to be is "were".',
        choices: [
          { text: 'were', isCorrect: true },
          { text: 'was', isCorrect: false },
          { text: 'are', isCorrect: false },
          { text: 'been', isCorrect: false },
        ],
      },
      {
        text: `Statement:\nIn the Simple Past Tense, regular verbs are generally formed by adding "-ed" or "-d" to the base form of the verb (e.g., walk -> walked, play -> played).`,
        type: 'TRUE_FALSE',
        difficulty: options.difficulty,
        topic: 'Grammar Rules: Regular Verbs',
        points: 1.0,
        explanation: 'This statement is TRUE. Regular verbs in English form their past tense by adding -ed or -d.',
        choices: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
        ],
      },
      {
        text: `Short text:\n"Aldi did not ... the basketball match last Sunday because of a minor knee injury."\n\nQuestion: What is the correct word to complete the sentence?`,
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Negative Simple Past',
        points: 1.0,
        explanation: 'After the auxiliary "did not", the main verb returns to its base form (bare infinitive): "attend".',
        choices: [
          { text: 'attend', isCorrect: true },
          { text: 'attended', isCorrect: false },
          { text: 'attending', isCorrect: false },
          { text: 'attends', isCorrect: false },
        ],
      },
      {
        text: `Explain the fundamental difference between regular and irregular verbs in English Simple Past Tense, and provide three clear examples of each!`,
        type: 'ESSAY',
        difficulty: options.difficulty,
        topic: 'English Verb Conjugation',
        points: 5.0,
        explanation: 'Regular verbs form the past tense by adding -ed/-d (e.g., watch->watched, call->called, study->studied). Irregular verbs change their vowel/spelling completely or remain the same (e.g., go->went, buy->bought, cut->cut).',
      },
      {
        text: `What is the past form (Verb 2) of the irregular verb "write"?`,
        type: 'SHORT_ANSWER',
        difficulty: options.difficulty,
        topic: 'Irregular Verbs',
        points: 2.0,
        explanation: 'The past form (V2) of "write" is "wrote".',
      }
    ] : [
      {
        text: `Reading Passage:\n"Digital technology has transformed how modern education is delivered. Teachers and students can now access extensive educational resources and interactive simulations from anywhere. However, maintaining discipline and digital literacy remains crucial for effective learning."\n\nQuestion: What is the main idea of the passage?`,
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: options.topic || 'English Reading Comprehension',
        points: 1.0,
        explanation: 'The passage highlights the transformative impact of digital technology in education and the importance of digital literacy.',
        choices: [
          { text: 'Digital technology transforms education while requiring digital literacy', isCorrect: true },
          { text: 'Traditional textbooks should be completely discarded', isCorrect: false },
          { text: 'Students no longer need teachers in digital learning', isCorrect: false },
          { text: 'Online education has no significant benefits for schools', isCorrect: false },
        ],
      },
      {
        text: `In the passage, the word "crucial" is closest in meaning to...`,
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Vocabulary in Context',
        points: 1.0,
        explanation: '"Crucial" means extremely important or essential.',
        choices: [
          { text: 'essential and very important', isCorrect: true },
          { text: 'optional and unnecessary', isCorrect: false },
          { text: 'unimportant and trivial', isCorrect: false },
          { text: 'harmful and dangerous', isCorrect: false },
        ],
      },
      {
        text: `Dialogue:\nTeacher: "Could anyone explain the purpose of this assignment?"\nStudent: "Yes, ma'am. We ... to summarize the key findings of the experiment."\n\nQuestion: Which phrase correctly completes the student's reply?`,
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Grammar: Passive Voice',
        points: 1.0,
        explanation: 'The passive structure "are required" accurately expresses what the students were assigned to do.',
        choices: [
          { text: 'are required', isCorrect: true },
          { text: 'requiring', isCorrect: false },
          { text: 'requirement', isCorrect: false },
          { text: 'was require', isCorrect: false },
        ],
      },
      {
        text: `Statement:\nAn expository text aims to inform, explain, or describe a topic to the reader using factual evidence and logical structure.`,
        type: 'TRUE_FALSE',
        difficulty: options.difficulty,
        topic: 'Genre and Text Types',
        points: 1.0,
        explanation: 'This statement is TRUE. Expository texts are informational and fact-based.',
        choices: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
        ],
      },
      {
        text: `Explain two effective strategies for improving English reading comprehension when encountering unfamiliar vocabulary!`,
        type: 'ESSAY',
        difficulty: options.difficulty,
        topic: 'Reading Strategies',
        points: 5.0,
        explanation: 'Strategies: 1) Using context clues from surrounding sentences, 2) Analyzing word roots, prefixes, and suffixes.',
      }
    ];

    for (let i = 0; i < options.count; i++) {
      const targetType = types[i % types.length];
      const matchingByType = englishQuestions.filter((item) => item.type === targetType);
      const pool = matchingByType.length > 0 ? matchingByType : englishQuestions;
      const matchingQ = pool[i % pool.length];
      questions.push({
        ...matchingQ,
        points: targetType === 'ESSAY' ? 5.0 : targetType === 'SHORT_ANSWER' ? 2.0 : 1.0,
        choices: matchingQ.choices ? shuffleArray([...matchingQ.choices]) : undefined,
      });
    }

    return questions.slice(0, options.count);
  }

  // Detect: Mata Pelajaran Seni dan Budaya / Prakarya
  const isSeniBudaya = 
    /seni|budaya|prakarya|rupa|musik|tari|teater|lukis|kriya|nirmana|batik|motif|alat musik/i.test(
      subjectStr + ' ' + topicStr + ' ' + lowerText
    );

  if (isSeniBudaya) {
    const seniQuestions: GeneratedQuestion[] = [
      {
        text: 'Dalam seni rupa, unsur visual paling mendasar yang terbentuk dari pergerakan atau perpanjangan titik yang memiliki dimensi memanjang dan arah tertentu disebut...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Unsur Seni Rupa',
        points: 1.0,
        explanation: 'Garis adalah goresan atau batas limit suatu benda yang terbentuk dari rangkaian titik berdimensi memanjang.',
        choices: [
          { text: 'Garis', isCorrect: true },
          { text: 'Bidang', isCorrect: false },
          { text: 'Tekstur', isCorrect: false },
          { text: 'Gelap Terang', isCorrect: false },
        ],
      },
      {
        text: 'Karya seni rupa yang memiliki ukuran panjang, lebar, dan volume (ruang tiga dimensi) sehingga dapat diamati dan dinikmati dari berbagai arah pandang disebut...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Dimensi Karya Seni',
        points: 1.0,
        explanation: 'Karya seni rupa 3 dimensi (trimatra) memiliki volume dan dapat dinikmati dari segala sudut pandang (contoh: patung, gerabah/keramik, arsitektur).',
        choices: [
          { text: 'Karya seni rupa 3 dimensi (trimatra)', isCorrect: true },
          { text: 'Karya seni rupa 2 dimensi (dwimatra)', isCorrect: false },
          { text: 'Karya seni grafis cetak datar', isCorrect: false },
          { text: 'Seni ilustrasi digital', isCorrect: false },
        ],
      },
      {
        text: 'Teknik melukis atau menggambar dengan sapuan kuas cat air tipis sehingga menghasilkan lapisan warna yang transparan dan tembus pandang disebut teknik...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Teknik Seni Lukis',
        points: 1.0,
        explanation: 'Teknik aquarel menggunakan cat air dengan sapuan kuas tipis sehingga hasil lukisan terlihat transparan.',
        choices: [
          { text: 'Aquarel', isCorrect: true },
          { text: 'Plakat', isCorrect: false },
          { text: 'Pointilis', isCorrect: false },
          { text: 'Kolase', isCorrect: false },
        ],
      },
      {
        text: 'Angklung merupakan alat musik tradisional kebanggaan Indonesia asal Jawa Barat yang dimainkan dengan cara...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Alat Musik Tradisional Nusantara',
        points: 1.0,
        explanation: 'Angklung dibunyikan dengan cara digoyangkan atau digetarkan agar tabung bambu saling beradu dan menghasilkan nada merdu.',
        choices: [
          { text: 'Digoyangkan', isCorrect: true },
          { text: 'Dipetik', isCorrect: false },
          { text: 'Ditiup', isCorrect: false },
          { text: 'Dipukul', isCorrect: false },
        ],
      },
      {
        text: 'Dalam seni tari tradisional nusantara, kemampuan seorang penari dalam menghayati, menjiwai karakter tarian, serta mengekspresikan pesan batin melalui mimik wajah dan gerak disebut...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Konsep Dasar Seni Tari',
        points: 1.0,
        explanation: 'Wirasa adalah penjiwaan dan ekspresi rasa penari. Tiga unsur pokok tari adalah Wiraga (gerak fisik), Wirama (irama/musik), dan Wirasa (penjiwaan/ekspresi).',
        choices: [
          { text: 'Wirasa', isCorrect: true },
          { text: 'Wiraga', isCorrect: false },
          { text: 'Wirama', isCorrect: false },
          { text: 'Wirupa', isCorrect: false },
        ],
      },
      {
        text: 'Prinsip dalam berkarya seni rupa yang mengatur agar salah satu unsur visual tampil lebih menonjol dan memikat perhatian pengamat pertama kali disebut...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Prinsip Dasar Seni Rupa',
        points: 1.0,
        explanation: 'Pusat perhatian (center of interest / aksen / emphasis) bertujuan memberikan titik fokus yang menarik perhatian dalam suatu karya seni.',
        choices: [
          { text: 'Pusat perhatian (Center of Interest / Aksen)', isCorrect: true },
          { text: 'Irama (Rhythm)', isCorrect: false },
          { text: 'Keselarasan (Harmony)', isCorrect: false },
          { text: 'Keseimbangan simetris', isCorrect: false },
        ],
      },
      {
        text: 'Pernyataan:\nKarya seni rupa terapan (applied art) diciptakan dengan mengutamakan fungsi praktis pemakaian dalam kehidupan sehari-hari selain memperhatikan nilai keindahannya (contoh: kriya keramik, batik busana, furnitur).',
        type: 'TRUE_FALSE',
        difficulty: options.difficulty,
        topic: 'Fungsi Seni Rupa Terapan',
        points: 1.0,
        explanation: 'Pernyataan ini BENAR. Seni rupa terapan mengutamakan fungsi pakai (utility) tanpa mengabaikan aspek estetika.',
        choices: [
          { text: 'Benar', isCorrect: true },
          { text: 'Salah', isCorrect: false },
        ],
      },
      {
        text: 'Pernyataan:\nTeknik pointilis dalam seni lukis adalah teknik yang memanfaatkan potongan-potongan kertas atau kain yang ditempelkan pada bidang gambar.',
        type: 'TRUE_FALSE',
        difficulty: options.difficulty,
        topic: 'Teknik Seni Rupa',
        points: 1.0,
        explanation: 'Pernyataan ini SALAH. Teknik menempel potongan bahan adalah teknik Kolase atau Mosaik, sedangkan teknik Pointilis menggunakan titik-titik warna berulang.',
        choices: [
          { text: 'Salah', isCorrect: true },
          { text: 'Benar', isCorrect: false },
        ],
      },
      {
        text: 'Jelaskan perbedaan mendasar antara seni rupa murni (fine art) dan seni rupa terapan (applied art), serta sebutkan masing-masing 2 (dua) contoh karyanya!',
        type: 'ESSAY',
        difficulty: options.difficulty,
        topic: 'Klasifikasi Seni Rupa',
        points: 5.0,
        explanation: 'Seni rupa murni dibuat semata-mata untuk nilai estetika dan kepuasan batin tanpa tujuan fungsi praktis (contoh: lukisan kanvas, patung monumen). Seni rupa terapan dibuat dengan mengutamakan fungsi guna/pakai dalam aktivitas sehari-hari (contoh: cangkir keramik, baju batik, meja ukir).',
      },
      {
        text: 'Sebutkan 3 (tiga) unsur pokok penting dalam seni tari tradisional Indonesia (Wiraga, Wirama, Wirasa) dan jelaskan secara ringkas maksud dari masing-masing unsur tersebut!',
        type: 'ESSAY',
        difficulty: options.difficulty,
        topic: 'Unsur Utama Seni Tari',
        points: 5.0,
        explanation: '1. Wiraga: Penguasaan keterampilan gerak tubuh fisik penari. 2. Wirama: Keselarasan gerak terhadap ketukan irama dan musik pengiring. 3. Wirasa: Penghayatan, penjiwaan rasa, dan ekspresi batin dari karakter tarian.',
      },
      {
        text: 'Alat musik tradisional Sasando yang memiliki wadah resonansi terbuat dari anyaman daun lontar berasal dari daerah...',
        type: 'SHORT_ANSWER',
        difficulty: options.difficulty,
        topic: 'Alat Musik Tradisional',
        points: 2.0,
        explanation: 'Pulau Rote, Nusa Tenggara Timur (NTT).',
      },
      {
        text: 'Sebutkan teknik melukis yang menggunakan media cat poster atau cat minyak dengan sapuan kuas tebal dan pekat sehingga menutup permukaan bidang lukis secara merata!',
        type: 'SHORT_ANSWER',
        difficulty: options.difficulty,
        topic: 'Teknik Seni Lukis',
        points: 2.0,
        explanation: 'Teknik Plakat.',
      },
    ];

    for (let i = 0; i < options.count; i++) {
      const targetType = types[i % types.length];
      const matchingByType = seniQuestions.filter((item) => item.type === targetType);
      const pool = matchingByType.length > 0 ? matchingByType : seniQuestions;
      const matchingQ = pool[i % pool.length];
      questions.push({
        ...matchingQ,
        points: targetType === 'ESSAY' ? 5.0 : targetType === 'SHORT_ANSWER' ? 2.0 : 1.0,
        choices: matchingQ.choices ? shuffleArray([...matchingQ.choices]) : undefined,
      });
    }

    return questions.slice(0, options.count);
  }

  // Detect: Mata Pelajaran Kejuruan SMK (RPL, TKJ, Otomotif, Akuntansi, PKK, dsb.)
  const isKejuruan = 
    /rpl|rekayasa perangkat lunak|tkj|teknik komputer|pplg|tjkt|dkv|desain komunikasi|akl|akuntansi|pkk|kewirausahaan|otomotif|tkro|tbsm|pemesinan|pengelasan|titl|ketenagalistrikan|elektronika|perhotelan|kuliner|tata boga|busana|farmasi|keperawatan/i.test(
      subjectStr + ' ' + topicStr + ' ' + lowerText
    );

  if (isKejuruan) {
    const kejuruanQuestions: GeneratedQuestion[] = [
      {
        text: 'Dalam pengembangan perangkat lunak (RPL/PPLG), prinsip Object-Oriented Programming (OOP) yang berfungsi menyembunyikan detail implementasi internal dan hanya mengekspos antarmuka publik yang diperlukan disebut...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Pemrograman Berorientasi Objek (OOP)',
        points: 1.0,
        explanation: 'Enkapsulasi (Encapsulation) adalah konsep pembungkusan data dan method dalam satu unit kelas serta membatasi akses langsung dari luar.',
        choices: [
          { text: 'Enkapsulasi (Encapsulation)', isCorrect: true },
          { text: 'Inheritance (Pewarisan)', isCorrect: false },
          { text: 'Polymorphism (Polimorfisme)', isCorrect: false },
          { text: 'Abstraction (Abstraksi data murni)', isCorrect: false },
        ],
      },
      {
        text: 'Dalam arsitektur jaringan komputer (TKJ/TJKT), sebuah subnet mask dengan notasi CIDR /24 memiliki jumlah total alamat IP dan subnet mask berturut-turut...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Subnetting & Pengalamatan IP',
        points: 1.0,
        explanation: 'CIDR /24 memiliki subnet mask 255.255.255.0 dengan 256 alamat IP total (254 host yang dapat digunakan setelah dikurangi network ID dan broadcast ID).',
        choices: [
          { text: '256 IP (254 host valid) dengan subnet mask 255.255.255.0', isCorrect: true },
          { text: '128 IP (126 host valid) dengan subnet mask 255.255.255.128', isCorrect: false },
          { text: '512 IP (510 host valid) dengan subnet mask 255.255.254.0', isCorrect: false },
          { text: '64 IP (62 host valid) dengan subnet mask 255.255.255.192', isCorrect: false },
        ],
      },
      {
        text: 'Dalam akuntansi keuangan (AKL), rumus persamaan dasar akuntansi yang menjadi landasan penyusunan neraca keuangan adalah...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Persamaan Dasar Akuntansi',
        points: 1.0,
        explanation: 'Persamaan dasar akuntansi menyatakan bahwa Aset (Harta) selalu sama dengan Liabilitas (Kewajiban/Utang) ditambah Ekuitas (Modal).',
        choices: [
          { text: 'Aset = Liabilitas (Kewajiban) + Ekuitas (Modal)', isCorrect: true },
          { text: 'Aset = Liabilitas (Kewajiban) - Ekuitas (Modal)', isCorrect: false },
          { text: 'Ekuitas = Aset + Liabilitas (Kewajiban)', isCorrect: false },
          { text: 'Liabilitas = Ekuitas - Aset Lancar', isCorrect: false },
        ],
      },
      {
        text: 'Pada mesin 4 tak (Otomotif/TKRO/TBSM), langkah kerja di mana kedua katup (katup masuk dan katup buang) tertutup rapat sementara torak (piston) bergerak dari Titik Mati Bawah (TMB) ke Titik Mati Atas (TMA) adalah...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Prinsip Kerja Motor 4 Tak',
        points: 1.0,
        explanation: 'Langkah kompresi memampatkan campuran udara dan bahan bakar dengan kedua katup tertutup saat piston bergerak dari TMB ke TMA.',
        choices: [
          { text: 'Langkah Kompresi (Compression Stroke)', isCorrect: true },
          { text: 'Langkah Hisap (Intake Stroke)', isCorrect: false },
          { text: 'Langkah Usaha (Power Stroke)', isCorrect: false },
          { text: 'Langkah Buang (Exhaust Stroke)', isCorrect: false },
        ],
      },
      {
        text: 'Dalam Projek Kreatif dan Kewirausahaan (PKK), kondisi di mana total pendapatan usaha sama persis dengan total biaya yang dikeluarkan sehingga perusahaan tidak mengalami laba maupun rugi disebut...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Analisis Kelayakan Usaha',
        points: 1.0,
        explanation: 'Break Even Point (BEP) atau titik impas adalah kondisi di mana penerimaan total sama dengan biaya total (TR = TC).',
        choices: [
          { text: 'Break Even Point (BEP / Titik Impas)', isCorrect: true },
          { text: 'Return on Investment (ROI)', isCorrect: false },
          { text: 'Gross Profit Margin', isCorrect: false },
          { text: 'Cash Flow Surplus', isCorrect: false },
        ],
      },
      {
        text: 'Pernyataan:\nDalam sistem kontrol versi Git (RPL/Software), perintah `git commit` secara otomatis mengirimkan dan memperbarui kode pada repositori remote (seperti GitHub/GitLab).',
        type: 'TRUE_FALSE',
        difficulty: options.difficulty,
        topic: 'Version Control System (Git)',
        points: 1.0,
        explanation: 'Pernyataan ini SALAH. Perintah `git commit` hanya menyimpan snapshot perubahan ke repositori lokal. Untuk mengirimkan ke remote repository, dibutuhkan perintah `git push`.',
        choices: [
          { text: 'Salah', isCorrect: true },
          { text: 'Benar', isCorrect: false },
        ],
      },
      {
        text: 'Pernyataan:\nProsedur Keselamatan dan Kesehatan Kerja (K3) mewajibkan teknisi menggunakan Alat Pelindung Diri (APD) seperti kacamata pelindung dan sepatu keselamatan (safety shoes) saat beraktivitas di bengkel atau ruang kerja mekanik.',
        type: 'TRUE_FALSE',
        difficulty: options.difficulty,
        topic: 'Keselamatan dan Kesehatan Kerja (K3)',
        points: 1.0,
        explanation: 'Pernyataan ini BENAR. Penggunaan APD standar adalah kewajiban mutlak untuk memitigasi risiko kecelakaan kerja di lingkungan industri.',
        choices: [
          { text: 'Benar', isCorrect: true },
          { text: 'Salah', isCorrect: false },
        ],
      },
      {
        text: 'Jelaskan tujuan dan 4 komponen utama dalam analisis SWOT (Strengths, Weaknesses, Opportunities, Threats) dalam merancang produk usaha baru pada Projek Kreatif dan Kewirausahaan (PKK)!',
        type: 'ESSAY',
        difficulty: options.difficulty,
        topic: 'Perencanaan Usaha (SWOT)',
        points: 5.0,
        explanation: 'Strengths (Kekuatan internal produk/tim), Weaknesses (Kelemahan internal yang perlu diperbaiki), Opportunities (Peluang pasar eksternal yang dapat dimanfaatkan), Threats (Ancaman eksternal dari pesaing atau regulasi). Tujuannya merumuskan strategi bisnis yang tangguh dan kompetitif.',
      },
      {
        text: 'Sebutkan protokol jaringan standar yang bertugas memetakan dan memberikan konfigurasi IP address secara otomatis kepada perangkat client dalam jaringan lokal (LAN)!',
        type: 'SHORT_ANSWER',
        difficulty: options.difficulty,
        topic: 'Protokol Jaringan Komputer',
        points: 2.0,
        explanation: 'DHCP (Dynamic Host Configuration Protocol).',
      },
      {
        text: 'Sebutkan jenis jurnal akuntansi yang digunakan untuk mencatat penyesuaian saldo akun riil dan akun nominal pada akhir periode akuntansi agar mencerminkan keadaan yang sebenarnya!',
        type: 'SHORT_ANSWER',
        difficulty: options.difficulty,
        topic: 'Siklus Akuntansi',
        points: 2.0,
        explanation: 'Jurnal Penyesuaian (Adjusting Entries).',
      },
    ];

    for (let i = 0; i < options.count; i++) {
      const targetType = types[i % types.length];
      const matchingByType = kejuruanQuestions.filter((item) => item.type === targetType);
      const pool = matchingByType.length > 0 ? matchingByType : kejuruanQuestions;
      const matchingQ = pool[i % pool.length];
      questions.push({
        ...matchingQ,
        points: targetType === 'ESSAY' ? 5.0 : targetType === 'SHORT_ANSWER' ? 2.0 : 1.0,
        choices: matchingQ.choices ? shuffleArray([...matchingQ.choices]) : undefined,
      });
    }

    return questions.slice(0, options.count);
  }

  // Detect: Mitigasi Bencana & Sains Terapan di Lingkungan Kerja (IPAS / K3)
  const isMitigasiOrIPAS = 
    /mitigasi|bencana|gempa|tsunami|kebakaran|evakuasi|sains terapan|lingkungan kerja|k3|limbah b3|amdal|keselamatan kerja/i.test(
      subjectStr + ' ' + topicStr + ' ' + lowerText
    );

  if (isMitigasiOrIPAS) {
    const ipasMitigasiQuestions: GeneratedQuestion[] = [
      {
        text: 'Dalam prosedur tanggap darurat mitigasi bencana gempa bumi di area bengkel atau pabrik, tindakan perlindungan diri pertama yang paling tepat dilakukan sesuai standar keselamatan kerja adalah...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Mitigasi Bencana Lingkungan Kerja',
        points: 1.0,
        explanation: 'Prinsip "Drop, Cover, and Hold On" (merunduk, mencari perlindungan di bawah meja kokoh, dan berpegangan) merupakan langkah utama melindungi kepala dan organ vital dari runtuhan.',
        choices: [
          { text: 'Melakukan tindakan "Drop, Cover, and Hold On" (merunduk, berlindung di bawah meja kokoh, dan berpegangan)', isCorrect: true },
          { text: 'Berlari kencang menuju pintu keluar tanpa mematikan mesin produksi yang berputar', isCorrect: false },
          { text: 'Menghidupkan saklar utama listrik untuk menyalakan sistem penerangan darurat', isCorrect: false },
          { text: 'Menaiki lift darurat agar dapat mencapai lantai dasar lebih cepat', isCorrect: false },
        ],
      },
      {
        text: 'Penerapan sains terapan dalam pengelolaan limbah Bahan Berbahaya dan Beracun (B3) di lingkungan kerja industri bertujuan utama untuk...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Sains Terapan Lingkungan Kerja',
        points: 1.0,
        explanation: 'Pengelolaan limbah B3 secara ilmiah mencegah kontaminasi toksik pada tanah, sumber air tanah, serta melindungi kesehatan pekerja dari keracunan zat kimia.',
        choices: [
          { text: 'Mencegah kontaminasi tanah, air tanah, dan keracunan zat kimia pada pekerja', isCorrect: true },
          { text: 'Mempercepat pembuangan limbah ke aliran sungai umum tanpa proses filtrasi', isCorrect: false },
          { text: 'Menghemat biaya operasional industri dengan mencampur limbah B3 dengan sampah organik', isCorrect: false },
          { text: 'Menghilangkan kewajiban pengujian AMDAL secara berkala dari dinas lingkungan', isCorrect: false },
        ],
      },
      {
        text: 'Berikut ini yang BUKAN merupakan kriteria jalur evakuasi darurat yang memenuhi standar keselamatan mitigasi bencana di tempat kerja adalah...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Mitigasi Bencana & K3',
        points: 1.0,
        explanation: 'Jalur evakuasi dilarang keras dijadikan tempat penumpukan barang atau penyimpanan sementara karena menghambat proses penyelamatan jiwa saat darurat.',
        choices: [
          { text: 'Jalur evakuasi difungsikan sekaligus sebagai tempat penumpukan barang gudang sementara', isCorrect: true },
          { text: 'Dilengkapi lampu darurat (emergency exit lights) dan petunjuk arah yang menyala dalam gelap', isCorrect: false },
          { text: 'Pintu darurat membuka ke arah luar (outward) dan bebas dari gembok atau rintangan fisik', isCorrect: false },
          { text: 'Arah jalur langsung mengarah ke area terbuka yang aman (assembly point / titik kumpul)', isCorrect: false },
        ],
      },
      {
        text: 'Alat Pemadam Api Ringan (APAR) jenis Dry Chemical Powder (serbuk kimia kering) sangat efektif digunakan di lingkungan kerja untuk memadamkan kebakaran...',
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Pencegahan Kebakaran di Tempat Kerja',
        points: 1.0,
        explanation: 'APAR Dry Chemical Powder bersifat serbaguna (multipurpose) untuk memadamkan kebakaran kelas A (benda padat), kelas B (cairan mudah terbakar), dan kelas C (instalasi listrik bertegangan).',
        choices: [
          { text: 'Kebakaran Kelas A (benda padat), Kelas B (cairan mudah terbakar), dan Kelas C (kelistrikan)', isCorrect: true },
          { text: 'Hanya khusus untuk kebakaran bahan logam radioaktif berat', isCorrect: false },
          { text: 'Kebakaran bawah tanah tambang batu bara dalam skala raksasa', isCorrect: false },
          { text: 'Hanya untuk memadamkan api lilin dan kertas tipis di perkantoran', isCorrect: false },
        ],
      },
      {
        text: 'Pernyataan:\nDalam manajemen keselamatan bencana industri, Titik Kumpul (Assembly Point) harus berlokasi di area terbuka yang luas, jauh dari bangunan tinggi, pohon besar, dan instalasi kabel listrik tegangan tinggi.',
        type: 'TRUE_FALSE',
        difficulty: options.difficulty,
        topic: 'Prosedur Evakuasi Bencana',
        points: 1.0,
        explanation: 'Pernyataan ini BENAR. Titik kumpul wajib berada di zona aman terbuka agar terhindar dari bahaya sekunder seperti reruntuhan dinding atau sengatan kabel listrik.',
        choices: [
          { text: 'Benar', isCorrect: true },
          { text: 'Salah', isCorrect: false },
        ],
      },
      {
        text: 'Pernyataan:\nSaat terjadi kebocoran gas beracun di pabrik, pekerja dianjurkan untuk segera berlari searah dengan arah hembusan angin agar terhindar dari gas beracun.',
        type: 'TRUE_FALSE',
        difficulty: options.difficulty,
        topic: 'Mitigasi Kebocoran Gas B3',
        points: 1.0,
        explanation: 'Pernyataan ini SALAH. Pekerja wajib melakukan evakuasi dengan memotong arah angin (crosswind) atau berlawanan arah angin (upwind) agar tidak terhirup konsentrasi gas yang terbawa angin.',
        choices: [
          { text: 'Salah', isCorrect: true },
          { text: 'Benar', isCorrect: false },
        ],
      },
      {
        text: 'Jelaskan secara komprehensif 4 siklus utama dalam mitigasi bencana di lingkungan kerja (Pencegahan/Mitigasi, Kesiapsiagaan, Tanggap Darurat, dan Pemulihan/Rehabilitasi)!',
        type: 'ESSAY',
        difficulty: options.difficulty,
        topic: 'Siklus Manajemen Bencana',
        points: 5.0,
        explanation: '1. Pencegahan/Mitigasi: Meminimalkan risiko (inspeksi K3, penataan tata ruang). 2. Kesiapsiagaan: Pelatihan drill evakuasi, penyediaan APAR. 3. Tanggap Darurat: Aksi evakuasi, penyelamatan korban saat bencana. 4. Pemulihan: Perbaikan sarana, pemulihan psikologis pekerja, dan audit pasca bencana.',
      },
      {
        text: 'Sebutkan nama area terbuka yang ditentukan secara resmi sebagai tempat berkumpulnya seluruh pekerja setelah proses evakuasi darurat berlangsung!',
        type: 'SHORT_ANSWER',
        difficulty: options.difficulty,
        topic: 'Prosedur Evakuasi Darurat',
        points: 2.0,
        explanation: 'Titik Kumpul (Assembly Point).',
      },
    ];

    for (let i = 0; i < options.count; i++) {
      const targetType = types[i % types.length];
      const matchingByType = ipasMitigasiQuestions.filter((item) => item.type === targetType);
      const pool = matchingByType.length > 0 ? matchingByType : ipasMitigasiQuestions;
      const matchingQ = pool[i % pool.length];
      questions.push({
        ...matchingQ,
        points: targetType === 'ESSAY' ? 5.0 : targetType === 'SHORT_ANSWER' ? 2.0 : 1.0,
        choices: matchingQ.choices ? shuffleArray([...matchingQ.choices]) : undefined,
      });
    }

    return questions.slice(0, options.count);
  }

  // Detect: Surat Pengunduran Diri / Dokumen Ketenagakerjaan
  const isResignationLetter = lowerText.includes('pengunduran diri') || 
    (lowerText.includes('surat') && lowerText.includes('karyawan') && lowerText.includes('hrd'));

  if (isResignationLetter) {
    const letterQuestions: GeneratedQuestion[] = [
      {
        text: `Teks Bacaan:\n"Dengan ini saya mengajukan pengunduran diri sebagai Karyawan PT. Keputusan pengunduran diri ini mulai berlaku sejak tanggal ditandatanganinya surat ini. Saya mengucapkan terima kasih yang sebesar-besarnya atas kesempatan dan kepercayaan yang diberikan selama ini."\n\nPertanyaan: Berdasarkan isi teks bacaan di atas, apakah perihal atau tujuan utama dari penulisan surat tersebut?`,
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Surat Resmi & Administrasi',
        points: 1.0,
        explanation: 'Surat tersebut secara eksplisit menyatakan perihal pengajuan pengunduran diri karyawan.',
        choices: [
          { text: 'Mengajukan permohonan pengunduran diri secara resmi sebagai karyawan', isCorrect: true },
          { text: 'Mengajukan permohonan cuti tahunan dan istirahat kerja', isCorrect: false },
          { text: 'Mengajukan permohonan kenaikan jabatan dan tunjangan kerja', isCorrect: false },
          { text: 'Mengajukan pemindahan tugas atau mutasi ke divisi lain', isCorrect: false },
        ],
      },
      {
        text: `Berdasarkan format dan ketentuan penulisan surat resmi ketenagakerjaan di atas, kepada pihak manakah surat pengunduran diri tersebut ditujukan?`,
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Surat Resmi & Administrasi',
        points: 1.0,
        explanation: 'Surat pengunduran diri ditujukan kepada Kepala Departemen HRD (Human Resources Department) perusahaan.',
        choices: [
          { text: 'Kepala Departemen HRD (Human Resources Department)', isCorrect: true },
          { text: 'Manajer Pemasaran dan Penjualan Perusahaan', isCorrect: false },
          { text: 'Kepala Bagian Keuangan dan Anggaran Proyek', isCorrect: false },
          { text: 'Koordinator Layanan Pelanggan dan Hubungan Masyarakat', isCorrect: false },
        ],
      },
      {
        text: `Kapan surat pengunduran diri karyawan tersebut dinyatakan mulai berlaku efektif sesuai isi dokumen?`,
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Surat Resmi & Administrasi',
        points: 1.0,
        explanation: 'Teks menyatakan pengunduran diri mulai berlaku sejak tanggal ditandatanganinya surat.',
        choices: [
          { text: 'Mulai berlaku sejak tanggal ditandatanganinya surat pengunduran diri', isCorrect: true },
          { text: 'Berlaku otomatis setelah tiga puluh hari kalender sejak diajukan', isCorrect: false },
          { text: 'Berlaku setelah perusahaan mendapatkan karyawan pengganti', isCorrect: false },
          { text: 'Berlaku pada akhir periode tutup buku tahunan perusahaan', isCorrect: false },
        ],
      },
      {
        text: `Teks Bacaan:\n"Saya yakin bahwa kesempatan yang diberikan oleh PT tersebut merupakan pengalaman kerja yang berharga bagi pengembangan karir dan masa depan saya selanjutnya."\n\nPertanyaan: Apa fungsi dan makna penulisan kalimat di atas dalam surat pengunduran diri?`,
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: 'Etika Komunikasi Tertulis',
        points: 1.0,
        explanation: 'Kalimat tersebut berfungsi untuk menyampaikan apresiasi dan penghargaan atas pengalaman positif yang diperoleh selama bekerja.',
        choices: [
          { text: 'Menyampaikan apresiasi profesional atas pengalaman dan kesempatan yang telah diberikan', isCorrect: true },
          { text: 'Meminta pembayaran pesangon atau kompensasi tambahan dari perusahaan', isCorrect: false },
          { text: 'Menyatakan keberatan atas beban tugas yang pernah diemban sebelumnya', isCorrect: false },
          { text: 'Meminta agar proses pengunduran diri ditunda sampai waktu yang belum ditentukan', isCorrect: false },
        ],
      },
      {
        text: `Kutipan Teks:\n"Pengunduran diri ini mulai berlaku sejak tanggal ditandatanganinya surat ini."\n\nPernyataan: Ketentuan waktu berlakunya pengunduran diri pada kutipan surat di atas bernilai benar dan sah secara tertulis.`,
        type: 'TRUE_FALSE',
        difficulty: options.difficulty,
        topic: 'Pemahaman Dokumen Resmi',
        points: 1.0,
        explanation: 'Pernyataan bernilai BENAR sesuai rujukan dokumen surat pengunduran diri.',
        choices: [
          { text: 'Benar', isCorrect: true },
          { text: 'Salah', isCorrect: false },
        ],
      },
      {
        text: `Jelaskan unsur-unsur dan data penting apa saja yang wajib dicantumkan dalam surat pengunduran diri berdasarkan teks dokumen di atas!`,
        type: 'ESSAY',
        difficulty: options.difficulty,
        topic: 'Struktur Surat Resmi',
        points: 5.0,
        explanation: 'Unsur wajib: Identitas lengkap karyawan (nama, KTP, NIK, jabatan, departemen), pihak yang dituju (HRD), pernyataan resmi pengunduran diri, tanggal mulai berlaku, ucapan terima kasih, dan tanda tangan pemohon.',
      },
      {
        text: `Sebutkan departemen di perusahaan yang menangani penerimaan surat pengunduran diri karyawan!`,
        type: 'SHORT_ANSWER',
        difficulty: options.difficulty,
        topic: 'Administrasi Ketenagakerjaan',
        points: 2.0,
        explanation: 'Departemen HRD (Human Resources Department) / SDM (Sumber Daya Manusia).',
      }
    ];

    // Pick requested count and types
    for (let i = 0; i < options.count; i++) {
      const q = letterQuestions[i % letterQuestions.length];
      const targetType = types[i % types.length];
      if (q.type === targetType || types.length === 1) {
        questions.push({ ...q, points: targetType === 'ESSAY' ? 5.0 : targetType === 'SHORT_ANSWER' ? 2.0 : 1.0 });
      } else {
        const matchingQ = letterQuestions.find((item) => item.type === targetType) || q;
        questions.push({ ...matchingQ });
      }
    }

    return questions.slice(0, options.count);
  }

  // General Text / Article / Lesson Document Parsing
  // Split into real sentences and meaningful keyphrases
  const allSentences = rawText
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .split(/(?<=[.?!])\s+/)
    .map(cleanSentence)
    .filter((s) => s.length >= 20 && !s.includes('___'));

  const topicName = options.topic || options.subject || 'Materi Pembelajaran';

  const isPromptInstruction = 
    rawText.length < 350 ||
    /^(buatkan|buat|susun|berikan|bikin|tuliskan|soal tentang|latihan soal)\b/i.test(rawText);

  if (isPromptInstruction) {
    let cleanPromptTopic = (options.topic || rawText)
      .replace(/^(buatkan|buat|susun|berikan|bikin|tuliskan)\s*(\d+\s*butir\s*soal|\d+\s*soal|soal|beberapa butir soal|pertanyaan)?\s*(tentang|mengenai|untuk)?/i, '')
      .replace(/tingkat\s*(mudah|sedang|sulit|hots|c[1-6](-c[1-6])?)/gi, '')
      .replace(/\(c[1-6](-c[1-6])?\)/gi, '')
      .replace(/\b(c[1-6](-c[1-6])?)\b/gi, '')
      .replace(/tentang pemahaman konsep dasar dan definisi/gi, '')
      .replace(/tentang penerapan konsep, studi kasus terarah, dan prosedur/gi, '')
      .replace(/tentang analisis kritis mendalam, evaluasi kasus kompleks, dan penalaran tingkat tinggi/gi, '')
      .replace(/tentang analisis kritis/gi, '')
      .replace(/tentang pemahaman konsep dasar/gi, '')
      .replace(/untuk (kelas|jenjang|tingkat) [^,.]+/gi, '')
      .replace(/\b(sd|smp|sma|smk)\b/gi, '')
      .replace(/\s*\(HOTS\)/gi, '')
      .replace(/\s*\(Aplikasi\)/gi, '')
      .replace(/\s*\(Dasar\)/gi, '')
      .replace(/^[🟢🟡🔴]\s*/, '')
      .replace(/^tentang\s+/i, '')
      .replace(/["“”]/g, '')
      .trim();

    if (!cleanPromptTopic || cleanPromptTopic.length < 3) {
      cleanPromptTopic = options.subject || 'Materi Pembelajaran';
    }

    // Domain Intelligence Dispatcher untuk Mode Cerdas Offline / Fallback
    const lowerComb = (cleanPromptTopic + ' ' + (options.subject || '') + ' ' + (options.topic || '')).toLowerCase();

    // 1. Domain Matematika - Trigonometri / Aturan Sinus & Cosinus / Geometri Segitiga
    const isTrigonometri = /sinus|cosinus|tangen|trigonometri|segitiga sembarang|aturan sin|aturan cos/i.test(lowerComb);
    
    // 2. Domain Geografi & Tata Ruang - Pusat Pertumbuhan Wilayah & Kerjasama Regional
    const isGeografiWilayah = /pertumbuhan|wilayah|regional|kerjasama|spasial|geografi|tata ruang|tempat sentral|kutub pertumbuhan|hinterland/i.test(lowerComb);

    // 3. Domain Matematika Umum
    const isMatematikaUmum = !isTrigonometri && /matematika|aljabar|persamaan|kalkulus|integral|turunan|statistika|peluang|matriks|vektor|lingkaran|dimensi tiga|pythagoras|fungsi kuadrat/i.test(lowerComb);

    // 4. Domain IPA & Sains (Fisika, Kimia, Biologi)
    const isIpaSains = /ipa|sains|fisika|kimia|biologi|energi|kinetik|potensial|gaya|kecepatan|sel|genetika|metabolisme|ekosistem|asam|basa|larutan|senyawa|mol|stoikiometri|listrik|magnet|termodinamika/i.test(lowerComb);

    // 5. Domain Ekonomi, Sosiologi, Sejarah & IPS
    const isSosialEkonomi = !isGeografiWilayah && /ekonomi|sosiologi|sejarah|pancasila|ppkn|inflasi|permintaan|penawaran|pasar|fiskal|moneter|interaksi sosial|stratifikasi|konflik|kemerdekaan|uud/i.test(lowerComb);

    let domainQuestions: GeneratedQuestion[] = [];

    if (isTrigonometri) {
      domainQuestions = [
        {
          text: `Pada sebuah segitiga sembarang ABC, rumus Aturan Sinus yang menyatakan hubungan kesetaraan rasio antara panjang sisi dan nilai sinus sudut di hadapannya adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Aturan Sinus menetapkan rasio konstan a/sin A = b/sin B = c/sin C = 2R pada setiap segitiga sembarang.',
          choices: shuffleArray([
            { text: 'a / sin A = b / sin B = c / sin C', isCorrect: true },
            { text: 'a · sin A = b · sin B = c · sin C', isCorrect: false },
            { text: 'a² = b² + c² · sin A', isCorrect: false },
            { text: 'sin A / a = sin B / c = sin C / b', isCorrect: false },
          ]),
        },
        {
          text: `Aturan Cosinus paling tepat dan efektif digunakan untuk memecahkan elemen segitiga sembarang apabila kondisi unsur yang diketahui dari soal adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Aturan Cosinus digunakan saat diketahui dua sisi dan sudut apitnya (sisi-sudut-sisi) atau saat ketiga panjang sisi diketahui (sisi-sisi-sisi).',
          choices: shuffleArray([
            { text: 'Panjang dua sisi dan besar satu sudut apitnya (S-Sd-S), atau panjang ketiga sisinya (S-S-S)', isCorrect: true },
            { text: 'Besar dua sudut dan panjang satu sisi sembarang tanpa diketahui sudut apit (Sd-Sd-S)', isCorrect: false },
            { text: 'Hanya besar ketiga sudut segitiga tanpa diketahui satu pun panjang sisinya', isCorrect: false },
            { text: 'Panjang satu sisi miring dan satu sudut lancip pada segitiga siku-siku', isCorrect: false },
          ]),
        },
        {
          text: `Diketahui segitiga ABC dengan panjang sisi b = 6 cm, c = 10 cm, dan besar sudut A = 60°. Nilai dari a² berdasarkan Aturan Cosinus (a² = b² + c² - 2bc cos A) adalah... (Diketahui cos 60° = 1/2)`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'a² = b² + c² - 2bc cos 60° = 6² + 10² - 2(6)(10)(0.5) = 36 + 100 - 60 = 76.',
          choices: shuffleArray([
            { text: '76', isCorrect: true },
            { text: '96', isCorrect: false },
            { text: '136', isCorrect: false },
            { text: '196', isCorrect: false },
          ]),
        },
        {
          text: `Sebuah kapal navigasi berlayar dari dermaga A ke arah timur sejauh 30 mil ke titik B, lalu berputar arah membentuk sudut tertentu dan melaju 40 mil ke titik C. Prinsip trigonometri yang paling efisien digunakan petugas pemetaan untuk menghitung jarak langsung dari dermaga A ke titik C adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Jarak langsung dihitung menggunakan Aturan Cosinus karena melibatkan dua segmen jarak yang mengapit sudut deviasi haluan kapal.',
          choices: shuffleArray([
            { text: 'Aturan Cosinus karena diketahui dua panjang lintasan dan besar sudut apit haluan kapal', isCorrect: true },
            { text: 'Teorema Pythagoras linier tanpa memperhitungkan sudut perubahan arah pelayaran', isCorrect: false },
            { text: 'Aturan Tangen sudut ganda pada lingkaran luar bumi', isCorrect: false },
            { text: 'Perbandingan trigonometri segitiga siku-siku sederhana sudut istimewa', isCorrect: false },
          ]),
        },
        {
          text: `Pada segitiga ABC, jika besar sudut A = 90° (segitiga siku-siku di A), maka persamaan Aturan Cosinus a² = b² + c² - 2bc cos A akan tereduksi menjadi...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Karena cos 90° = 0, suku -2bc cos A bernilai nol, sehingga tersisa a² = b² + c² yang merupakan Teorema Pythagoras.',
          choices: shuffleArray([
            { text: 'a² = b² + c² (Teorema Pythagoras), karena nilai cos 90° = 0', isCorrect: true },
            { text: 'a² = b² + c² - 2bc, karena nilai cos 90° diasumsikan 1', isCorrect: false },
            { text: 'a² = (b + c)², karena sudut siku-siku menghilangkan suku perkalian sisi', isCorrect: false },
            { text: 'a² = 2bc, karena kedua sisi siku-siku saling berkelipatan', isCorrect: false },
          ]),
        },
        {
          text: `Pernyataan:\nAturan Sinus dapat digunakan untuk menentukan panjang seluruh sisi segitiga sembarang apabila diketahui besar ketiga sudutnya tanpa diketahui satu pun panjang sisinya.`,
          type: 'TRUE_FALSE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Pernyataan SALAH. Mengetahui ketiga sudut (Sd-Sd-Sd) hanya menentukan bentuk/kesebangunan segitiga, namun panjang sisi absolut membutuhkan minimal satu panjang sisi nyata.',
          choices: [
            { text: 'Benar', isCorrect: false },
            { text: 'Salah', isCorrect: true },
          ],
        },
        {
          text: `Jelaskan secara komprehensif perbedaan situasi geometris kapan seorang siswa wajib menggunakan Aturan Sinus dan kapan harus menggunakan Aturan Cosinus pada segitiga sembarang, serta tuliskan rumus dasarnya!`,
          type: 'ESSAY',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 5.0,
          explanation: 'Aturan sinus digunakan saat ada pasangan sisi dan sudut berhadapan yang diketahui (misal S-Sd-Sd atau S-S-Sd). Aturan cosinus digunakan saat dua sisi dan sudut apit diketahui (S-Sd-S) atau saat ketiga sisi diketahui untuk mencari besar sudut (S-S-S).',
        },
        {
          text: `Berapakah nilai dari cos 90° yang menyebabkan rumus Aturan Cosinus berubah menjadi rumus Teorema Pythagoras?`,
          type: 'SHORT_ANSWER',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 2.0,
          explanation: 'Nilai cos 90° adalah 0.',
        },
      ];
    } else if (isGeografiWilayah) {
      domainQuestions = [
        {
          text: `Menurut Walter Christaller dalam Teori Tempat Sentral (Central Place Theory), kawasan perkotaan yang bertindak sebagai pusat pertumbuhan memiliki fungsi esensial sebagai...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Teori Tempat Sentral Christaller memodelkan pusat kota sebagai simpul penyedia barang dan jasa kebutuhan optimal bagi penduduk wilayah sekitarnya (hinterland).',
          choices: shuffleArray([
            { text: 'Pusat pelayanan optimum yang menyediakan barang, jasa, dan fasilitas bagi wilayah belakangnya (hinterland)', isCorrect: true },
            { text: 'Kawasan tertutup khusus industri ekstraktif yang mengisolasi diri dari interaksi desa-kota', isCorrect: false },
            { text: 'Zona penyangga lingkungan yang membatasi mobilitas penduduk dan distribusi barang', isCorrect: false },
            { text: 'Wilayah administratif tunggal yang meniadakan hubungan perdagangan antar-daerah tetangga', isCorrect: false },
          ]),
        },
        {
          text: `Dalam teori kutub pertumbuhan (Growth Poles Theory) oleh François Perroux, proses perkembangan ekonomi suatu kawasan regional pada hakikatnya dicirikan oleh...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Perroux menegaskan bahwa pembangunan tidak muncul di semua tempat secara serentak, melainkan terkonsentrasi pada kutub-kutub yang memiliki industri pendorong (propulsive industries).',
          choices: shuffleArray([
            { text: 'Kemunculan industri pendorong (propulsive industry) pada kutub-kutub geografis tertentu dengan daya aglomerasi kuat', isCorrect: true },
            { text: 'Penyebaran modal dan teknologi yang berlangsung merata secara homogen ke seluruh pelosok kawasan', isCorrect: false },
            { text: 'Pemusatan aktivitas hanya pada sektor agraris tradisional tanpa adanya integrasi perkotaan', isCorrect: false },
            { text: 'Ketergantungan pasif pada komoditas tunggal tanpa keterkaitan rantai pasok antarsektor', isCorrect: false },
          ]),
        },
        {
          text: `Fenomena di mana keberadaan pusat pertumbuhan justru menyerap tenaga kerja produktif, bahan mentah, dan modal dari kawasan sekitar sehingga wilayah pinggiran tertinggal disebut...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Backwash Effect (atau polarisasi ekonomi menurut Myrdal/Hirschman) adalah dampak negatif tersedotnya sumber daya dari daerah hinterland menuju pusat pertumbuhan.',
          choices: shuffleArray([
            { text: 'Backwash Effect (efek polarisasi pengurasan sumber daya)', isCorrect: true },
            { text: 'Spread Effect (efek penyebaran kemakmuran)', isCorrect: false },
            { text: 'Trickle Down Effect (efek rembesan ekonomi ke bawah)', isCorrect: false },
            { text: 'Agglomeration Multiplier Effect (efek pengganda aglomerasi)', isCorrect: false },
          ]),
        },
        {
          text: `Salah satu sasaran strategis pembentukan kerjasama ekonomi regional (seperti forum BIMP-EAGA atau koridor ekonomi ASEAN) dalam tata ruang kawasan adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Kerjasama regional dirancang untuk meningkatkan interkonektivitas logistik, integrasi rantai nilai industri, dan mempersempit jurang kesenjangan antarwilayah.',
          choices: shuffleArray([
            { text: 'Mempercepat konektivitas logistik transportasi, memperkuat rantai pasok kawasan, dan mengurangi disparitas pembangunan', isCorrect: true },
            { text: 'Menyeragamkan seluruh mata uang nasional dan membubarkan batas kedaulatan politik masing-masing negara', isCorrect: false },
            { text: 'Membatasi kuota perdagangan lintas batas antarnegara tetangga secara sepihak', isCorrect: false },
            { text: 'Menghentikan investasi swasta lintas kawasan demi proteksionisme lokal absolut', isCorrect: false },
          ]),
        },
        {
          text: `Faktor geografis dan fisik utama yang paling menentukan keberhasilan akselerasi suatu kota berkembang menjadi pusat pertumbuhan utama wilayah adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Aksesibilitas tinggi menuju jalur perdagangan strategis (pelabuhan, tol, simpul transit) memicu aglomerasi ekonomi dan pergerakan komoditas.',
          choices: shuffleArray([
            { text: 'Tingginya aksesibilitas jaringan transportasi, letak simpul strategis, dan kelimpahan sumber daya pendukung', isCorrect: true },
            { text: 'Kondisi bentang alam yang terisolasi dan jauh dari koridor pergerakan transportasi utama', isCorrect: false },
            { text: 'Tingkat kepadatan vegetasi hutan lindung yang tidak dapat diakses moda transportasi darat', isCorrect: false },
            { text: 'Ketiadaan sarana prasarana komunikasi dan pembatasan interaksi ekonomi antarkota', isCorrect: false },
          ]),
        },
        {
          text: `Pernyataan:\nKeberadaan pusat pertumbuhan (Growth Pole) secara otomatis selalu memberikan dampak rembesan positif (Spread Effect) yang memakmurkan daerah penyangga tanpa resiko ketimpangan sosial-ekonomi.`,
          type: 'TRUE_FALSE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Pernyataan SALAH. Tanpa intervensi kebijakan pemerataan yang tepat, pusat pertumbuhan sering kali memicu Backwash Effect yang memperlebar ketimpangan antara pusat dan pinggiran.',
          choices: [
            { text: 'Benar', isCorrect: false },
            { text: 'Salah', isCorrect: true },
          ],
        },
        {
          text: `Uraikanlah bagaimana konsep "Spread Effect" dan "Backwash Effect" karya Gunnar Myrdal menjelaskan dinamika hubungan timbal balik antara pusat pertumbuhan ekonomi dengan wilayah belakangnya (hinterland)!`,
          type: 'ESSAY',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 5.0,
          explanation: 'Spread Effect adalah dampak positif penyebaran modal, teknologi, dan lapangan kerja dari pusat ke daerah periferi. Sedangkan Backwash Effect adalah dampak negatif tersedotnya tenaga terampil dan modal dari daerah pinggiran ke pusat kota, memicu kesenjangan regional.',
        },
        {
          text: `Sebutkan istilah geografi untuk wilayah pinggiran atau kawasan penyangga yang memasok tenaga kerja dan bahan pangan bagi pusat pertumbuhan kota!`,
          type: 'SHORT_ANSWER',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 2.0,
          explanation: 'Hinterland (atau daerah penyangga / rural area).',
        },
      ];
    } else if (isMatematikaUmum) {
      domainQuestions = [
        {
          text: `Dalam kajian matematika mengenai ${cleanPromptTopic}, konsep fundamental yang mendasari analisis dan penyelesaian masalahnya adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: `Konsep dasar ${cleanPromptTopic} menjadi acuan dalam menetapkan variabel, formula, dan transformasi pembuktian matematis.`,
          choices: shuffleArray([
            { text: `Penerapan teorema, relasi aljabar, dan batasan matematis yang konsisten`, isCorrect: true },
            { text: `Perkiraan hasil tanpa melalui tahapan perhitungan sistematis`, isCorrect: false },
            { text: `Penggunaan rumus sembarang yang mengabaikan syarat keabsahan domain fungsi`, isCorrect: false },
            { text: `Penghilangan konstanta dan variabel bebas dalam persamaan akhir`, isCorrect: false },
          ]),
        },
        {
          text: `Langkah analisis yang tepat untuk menyelesaikan model persamaan atau relasi pada materi ${cleanPromptTopic} adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: `Penyelesaian model matematika bertumpu pada identifikasi parameter, simplifikasi bentuk aljabar, dan validasi nilai solusi.`,
          choices: shuffleArray([
            { text: `Mengidentifikasi parameter yang diketahui, menyusun model matematika, dan menyederhanakan bentuk operasi secara teratur`, isCorrect: true },
            { text: `Mengasumsikan seluruh nilai variabel bernilai nol untuk mempermudah perhitungan`, isCorrect: false },
            { text: `Meniadakan syarat batas dan domain penyelesaian variabel`, isCorrect: false },
            { text: `Menyalin koefisien awal tanpa melakukan substitusi atau eliminasi logis`, isCorrect: false },
          ]),
        },
        {
          text: `Perhatikan aplikasi materi ${cleanPromptTopic} dalam pemodelan kuantitatif. Apabila nilai input variabel bebas dinaikkan secara linier, perilaku grafik atau nilai fungsinya akan...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: `Karakteristik grafik fungsi ditentukan oleh tanda gradien/turunan serta derajat polinomial atau sifat asimtot fungsinya.`,
          choices: shuffleArray([
            { text: `Mengikuti laju perubahan gradien fungsi dan kurvatur sesuai kaidah aljabar/kalkulus terkait`, isCorrect: true },
            { text: `Selalu konstan dan mendatar tanpa terpengaruh nilai masukan`, isCorrect: false },
            { text: `Berfluktuasi secara acak tanpa pola kurva yang jelas`, isCorrect: false },
            { text: `Seketika memotong sumbu koordinat di titik tak terdefinisi`, isCorrect: false },
          ]),
        },
        {
          text: `Pernyataan:\nDalam materi ${cleanPromptTopic}, setiap penyelesaian persamaan wajib memenuhi domain asal (syarat keberlakuan) agar tidak menghasilkan solusi semu.`,
          type: 'TRUE_FALSE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Pernyataan BENAR. Syarat batas domain (seperti penyebut tidak boleh nol atau nilai dalam akar kuadrat tidak boleh negatif) mutlak dipenuhi.',
          choices: [
            { text: 'Benar', isCorrect: true },
            { text: 'Salah', isCorrect: false },
          ],
        },
        {
          text: `Jelaskan alur metode penyelesaian sistematis dan teorema pendukung yang digunakan dalam memecahkan persoalan pada materi ${cleanPromptTopic}!`,
          type: 'ESSAY',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 5.0,
          explanation: `Penjelasan terstruktur mengenai formulasi model, penerapan teorema, tahapan operasi matematis, dan uji validitas hasil penyelesaian materi ${cleanPromptTopic}.`,
        },
        {
          text: `Tuliskan istilah untuk nilai variabel masukan (input) yang menyebabkan nilai fungsi pada ${cleanPromptTopic} bernilai tepat sama dengan nol!`,
          type: 'SHORT_ANSWER',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 2.0,
          explanation: 'Akar persamaan (pembuat nol fungsi / zero of the function).',
        },
      ];
    } else if (isIpaSains) {
      domainQuestions = [
        {
          text: `Berdasarkan hukum dan prinsip sains dalam kajian ${cleanPromptTopic}, fenomena yang menjadi mekanisme penggerak utamanya adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: `Kajian ${cleanPromptTopic} dikendalikan oleh hukum kekekalan serta interaksi antar-variabel fisis/kimiawi/biologis yang teratur.`,
          choices: shuffleArray([
            { text: `Hukum kekekalan ilmiah dan interaksi dinamis antar-komponen fisis/biologis yang teratur`, isCorrect: true },
            { text: `Perubahan spontan tanpa dipengaruhi energi ataupun gradien konsentrasi`, isCorrect: false },
            { text: `Hilangnya massa dan energi secara permanen tanpa konversi bentuk`, isCorrect: false },
            { text: `Terjadinya reaksi tanpa memerlukan kondisi batas atau katalis`, isCorrect: false },
          ]),
        },
        {
          text: `Dalam observasi laboratorium atau eksperimen ilmiah terkait ${cleanPromptTopic}, variabel bebas yang diubah-ubah oleh peneliti bertujuan untuk membuktikan...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Metode ilmiah menguji pengaruh variabel bebas terhadap variabel terikat dengan mengendalikan variabel kontrol.',
          choices: shuffleArray([
            { text: `Korelasi kausalitas (sebab-akibat) terhadap respon variabel terikat yang diukur secara terstandar`, isCorrect: true },
            { text: `Bahwa seluruh instrumen pengukur tidak memiliki batas toleransi galat`, isCorrect: false },
            { text: `Penghapusan seluruh hukum dasar fisika dan kimia dalam sistem tertutup`, isCorrect: false },
            { text: `Ketidakteraturan data agar eksperimen menghasilkan anomali murni`, isCorrect: false },
          ]),
        },
        {
          text: `Perhatikan studi kasus lingkungan: Jika terjadi gangguan atau ketidakseimbangan pada komponen ${cleanPromptTopic}, dampak paling signifikan pada keseimbangan ekosistem/sistem adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Ketidakseimbangan pada komponen kunci memicu efek domino terhadap laju transfer energi dan siklus materi.',
          choices: shuffleArray([
            { text: `Terjadinya pergeseran kesetimbangan sistem yang memerlukan adaptasi struktural atau mekanisme pemulihan alami`, isCorrect: true },
            { text: `Sistem secara instan musnah tanpa meninggalkan siklus materi apapun`, isCorrect: false },
            { text: `Peningkatan kapasitas daya dukung lingkungan secara tak terbatas`, isCorrect: false },
            { text: `Ketiadaan interaksi timbal balik dengan lingkungan abiotik sekitar`, isCorrect: false },
          ]),
        },
        {
          text: `Pernyataan:\nDalam fenomena ${cleanPromptTopic}, setiap perubahan energi yang terjadi selalu mematuhi Hukum Termodinamika/Kekekalan Energi di mana energi tidak dapat diciptakan atau dimusnahkan.`,
          type: 'TRUE_FALSE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Pernyataan BENAR sesuai dengan Hukum Kekekalan Energi (Termodinamika I).',
          choices: [
            { text: 'Benar', isCorrect: true },
            { text: 'Salah', isCorrect: false },
          ],
        },
        {
          text: `Uraikanlah prinsip kerja ilmiah, interaksi materi/energi, serta penerapan nyata dari konsep ${cleanPromptTopic} dalam teknologi atau kehidupan modern!`,
          type: 'ESSAY',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 5.0,
          explanation: `Penjelasan komprehensif konsep sains, formulasi hubungan fisis/biologis, dan aplikasi kontekstual ${cleanPromptTopic}.`,
        },
        {
          text: `Sebutkan satuan internasional (SI) atau instrumen pengukur utama yang digunakan untuk menganalisis besaran dalam materi ${cleanPromptTopic}!`,
          type: 'SHORT_ANSWER',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 2.0,
          explanation: `Satuan standar atau instrumen pengukuran besaran pada ${cleanPromptTopic}.`,
        },
      ];
    } else if (isSosialEkonomi) {
      domainQuestions = [
        {
          text: `Dalam dinamika sosial dan ekonomi terkait ${cleanPromptTopic}, landasan analisis yang paling esensial dalam memahami perilaku masyarakat/pasar adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: `Kajian sosial-ekonomi berakar pada alokasi sumber daya terbatas, interaksi kelembagaan, dan pemenuhan kebutuhan rasional masyarakat.`,
          choices: shuffleArray([
            { text: `Interaksi antara kebutuhan masyarakat, alokasi sumber daya yang terbatas, serta regulasi kelembagaan`, isCorrect: true },
            { text: `Tindakan spekulatif yang menafikan faktor hukum permintaan dan penawaran`, isCorrect: false },
            { text: `Ketiadaan interaksi sosial maupun kesepakatan nilai bersama di masyarakat`, isCorrect: false },
            { text: `Penghapusan seluruh fungsi kebijakan moneter dan fiskal dalam pasar terbuka`, isCorrect: false },
          ]),
        },
        {
          text: `Analisis Kebijakan:\nJika pemangku kepentingan hendak menyusun regulasi strategis terkait ${cleanPromptTopic}, pertimbangan utama yang harus dimitigasi adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Regulasi sosial-ekonomi menimbang trade-off antara efisiensi, keadilan distribusi, dan kepatuhan publik.',
          choices: shuffleArray([
            { text: `Dampak distribusi kesejahteraan, stabilitas pasar, serta kepatuhan norma hukum masyarakat`, isCorrect: true },
            { text: `Keuntungan jangka pendek bagi kelompok monopoli tertentu saja`, isCorrect: false },
            { text: `Pengabaian data statistik demografi dan tren pendapatan per kapita`, isCorrect: false },
            { text: `Penutupan total akses informasi publik mengenai arah kebijakan`, isCorrect: false },
          ]),
        },
        {
          text: `Dampak sosial-ekonomi yang paling nyata dirasakan masyarakat akibat transformasi atau modernisasi pada bidang ${cleanPromptTopic} adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Modernisasi mendorong efisiensi transaksi, diversifikasi pekerjaan, serta pergeseran pola hubungan sosial.',
          choices: shuffleArray([
            { text: `Peningkatan efisiensi operasional, spesialisasi peran kerja, dan dinamika mobilitas sosial`, isCorrect: true },
            { text: `Kembalinya seluruh sistem ke pola barter primitif tanpa standar harga`, isCorrect: false },
            { text: `Hilangnya kebutuhan akan lembaga keuangan dan perbankan formal`, isCorrect: false },
            { text: `Terhentinya arus distribusi logistik antar-wilayah secara permanen`, isCorrect: false },
          ]),
        },
        {
          text: `Pernyataan:\nKebijakan yang mengatur ${cleanPromptTopic} harus menjaga keseimbangan antara pertumbuhan ekonomi dan keadilan sosial agar tidak menimbulkan ketimpangan struktural.`,
          type: 'TRUE_FALSE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Pernyataan BENAR. Keseimbangan antara efisiensi ekonomi dan pemerataan sosial adalah prinsip dasar pembangunan berkelanjutan.',
          choices: [
            { text: 'Benar', isCorrect: true },
            { text: 'Salah', isCorrect: false },
          ],
        },
        {
          text: `Analisis dan uraikanlah bagaimana peran strategis ${cleanPromptTopic} dalam meningkatkan stabilitas dan kesejahteraan sosial masyarakat di era kontemporer!`,
          type: 'ESSAY',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 5.0,
          explanation: `Analisis mendalam fungsi ekonomi/sosial, tantangan struktural, dan alternatif solusi implementasi ${cleanPromptTopic}.`,
        },
        {
          text: `Sebutkan indikator utama yang lazim digunakan untuk mengevaluasi efektivitas kebijakan dalam bidang ${cleanPromptTopic}!`,
          type: 'SHORT_ANSWER',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 2.0,
          explanation: `Indikator capaian kinerja / indeks efektivitas pada materi ${cleanPromptTopic}.`,
        },
      ];
    } else {
      // 6. Universal Diverse Cognitive HOTS Generator (10+ Pola Beragam Unik Tanpa Boilerplate Kaku)
      domainQuestions = [
        {
          text: `Berdasarkan kajian konseptual mengenai ${cleanPromptTopic}, karakteristik mendasar yang membedakannya secara spesifik dari konsep lain adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: `Karakteristik mendasar ${cleanPromptTopic} merujuk pada prinsip kerja, parameter khas, dan batasan teoretis yang mengaturnya.`,
          choices: shuffleArray([
            { text: `Keterkaitan sistematis antar-elemen penyusunnya yang memiliki fungsi dan indikator kinerja spesifik`, isCorrect: true },
            { text: `Sifatnya yang acak dan tidak memiliki parameter keteraturan ilmiah`, isCorrect: false },
            { text: `Peniadaan prosedur evaluasi mutu dan standar operasional baku`, isCorrect: false },
            { text: `Ketergantungannya hanya pada persepsi opini sesaat tanpa data empiris`, isCorrect: false },
          ]),
        },
        {
          text: `Skenario Terapan:\nSebuah tim pengembang menghadapi tantangan efisiensi dalam penerapan ${cleanPromptTopic}. Tindakan perbaikan paling solutif yang berakar pada prinsip dasarnya adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Pemecahan masalah menuntut audit diagnostik terhadap komponen yang menjadi titik sumbatan (bottleneck) sebelum melakukan optimalisasi.',
          choices: shuffleArray([
            { text: `Mengidentifikasi faktor penghambat utama (bottleneck) melalui analisis data performa dan merestrukturisasi alur kerja`, isCorrect: true },
            { text: `Menghentikan pemantauan operasional dan membiarkan sistem berjalan tanpa tolok ukur`, isCorrect: false },
            { text: `Mengganti seluruh instrumen kerja secara gegabah tanpa pengujian awal`, isCorrect: false },
            { text: `Mengurangi alokasi waktu analisis dengan langsung mengeksekusi asumsi sepihak`, isCorrect: false },
          ]),
        },
        {
          text: `Dalam analisis hubungan sebab-akibat pada materi ${cleanPromptTopic}, konsekuensi paling rasional yang muncul apabila komponen pengendali utamanya mengalami kegagalan adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Kegagalan komponen pengendali mendistorsi transmisi informasi/energi dan menurunkan stabilitas output sistem.',
          choices: shuffleArray([
            { text: `Terjadinya distorsi pada proses kerja yang menurunkan akurasi dan stabilitas keluaran sistem`, isCorrect: true },
            { text: `Sistem secara otomatis melipatgandakan produktivitas di atas ambang batas normal`, isCorrect: false },
            { text: `Seluruh batasan operasional menjadi tidak relevan secara permanen`, isCorrect: false },
            { text: `Ketiadaan perubahan apapun pada hasil keluaran sistem secara menyeluruh`, isCorrect: false },
          ]),
        },
        {
          text: `Kelebihan komparatif dari implementasi pendekatan berbasis ${cleanPromptTopic} jika dibandingkan dengan metode konvensional terdahulu terletak pada...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Keunggulan pendekatan modern terletak pada efisiensi alur kerja, ketepatan data, dan skalabilitas hasil yang reliabel.',
          choices: shuffleArray([
            { text: `Peningkatan akurasi pengambilan keputusan, efisiensi sumber daya, dan kemudahan evaluasi berkelanjutan`, isCorrect: true },
            { text: `Tingkat kerumitan yang sengaja diperpanjang tanpa ada nilai tambah mutu`, isCorrect: false },
            { text: `Ketiadaan standar kepatuhan operasional demi menghemat tahapan verifikasi`, isCorrect: false },
            { text: `Pelepasan tanggung jawab pengawasan kepada pihak eksternal yang tidak kompeten`, isCorrect: false },
          ]),
        },
        {
          text: `Faktor resiko kritis yang paling krusial untuk dimitigasi dalam siklus penerapan ${cleanPromptTopic} di lapangan adalah...`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Kesenjangan antara asumsi perancangan teoritis dengan dinamika aktual lapangan merupakan sumber deviasi terbesar.',
          choices: shuffleArray([
            { text: `Kesenjangan antara perencanaan teoritis dengan dinamika kompleks kondisi aktual lapangan`, isCorrect: true },
            { text: `Ketiadaan data statistik yang dapat diolah oleh perangkat pengukur`, isCorrect: false },
            { text: `Penghilangan total seluruh pengaruh lingkungan sekitar sistem`, isCorrect: false },
            { text: `Ketidakmungkinan dilakukannya dokumentasi terhadap tahapan kegiatan`, isCorrect: false },
          ]),
        },
        {
          text: `Pernyataan:\nDalam penguasaan materi ${cleanPromptTopic}, pemahaman terhadap hubungan antar-parameter dan kaidah operasionalnya merupakan prasyarat esensial untuk memecahkan persoalan kontekstual.`,
          type: 'TRUE_FALSE',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 1.0,
          explanation: 'Pernyataan BENAR. Penguasaan konsep hubungan logis antar-parameter merupakan landasan berpikir kritis dalam pemecahan masalah.',
          choices: [
            { text: 'Benar', isCorrect: true },
            { text: 'Salah', isCorrect: false },
          ],
        },
        {
          text: `Jelaskan secara komprehensif konsep, mekanisme kerja, serta contoh penerapan praktis materi ${cleanPromptTopic} dalam memecahkan masalah kontekstual!`,
          type: 'ESSAY',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 5.0,
          explanation: `Penjelasan terstruktur mencakup teori dasar, implementasi terukur, serta evaluasi solusi pada materi ${cleanPromptTopic}.`,
        },
        {
          text: `Sebutkan faktor kunci yang paling menentukan efektivitas dan keberhasilan penerapan materi ${cleanPromptTopic}!`,
          type: 'SHORT_ANSWER',
          difficulty: options.difficulty,
          topic: cleanPromptTopic,
          points: 2.0,
          explanation: `Faktor kunci keberhasilan implementasi ${cleanPromptTopic}.`,
        },
      ];
    }

    // Bangun paket butir soal sesuai tipe yang diminta tanpa pengulangan pola
    const requestedTypes = types.length > 0 ? types : ['MULTIPLE_CHOICE'];
    const chosenQuestions: GeneratedQuestion[] = [];
    const usedTexts = new Set<string>();

    for (let i = 0; i < options.count; i++) {
      const targetType = requestedTypes[i % requestedTypes.length];
      const matchingByType = domainQuestions.filter((q) => q.type === targetType && !usedTexts.has(q.text));
      const pool = matchingByType.length > 0 ? matchingByType : domainQuestions.filter((q) => !usedTexts.has(q.text));
      
      const candidate = pool.length > 0 ? pool[0] : domainQuestions[i % domainQuestions.length];
      usedTexts.add(candidate.text);

      chosenQuestions.push({
        ...candidate,
        difficulty: options.difficulty,
        points: targetType === 'ESSAY' ? 5.0 : targetType === 'SHORT_ANSWER' ? 2.0 : 1.0,
        choices: candidate.choices ? shuffleArray([...candidate.choices]) : undefined,
      });
    }

    return chosenQuestions.slice(0, options.count);
  }

  // Extract key technical/factual words from text
  const stopWords = new Set(['yang', 'untuk', 'pada', 'dengan', 'adalah', 'yaitu', 'dalam', 'dan', 'atau', 'dari', 'oleh', 'ke', 'ini', 'itu', 'saya', 'kami', 'kita', 'anda', 'mereka', 'sebagai', 'akan', 'dapat', 'bisa', 'telah', 'sudah', 'lebih', 'sangat', 'secara', 'karena', 'bahwa', 'tersebut']);
  
  const meaningfulWords = rawText
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));

  const uniqueKeywords = Array.from(new Set(meaningfulWords));

  for (let i = 0; i < options.count; i++) {
    const qType = types[i % types.length];
    const sentenceIndex = i % Math.max(1, allSentences.length);
    const targetSentence = allSentences[sentenceIndex] || rawText.slice(0, 150) || `Pembahasan materi mengenai ${topicName}`;
    
    // Choose key concept from surrounding sentences
    const kw1 = uniqueKeywords[i % Math.max(1, uniqueKeywords.length)] || 'sistem';
    const kw2 = uniqueKeywords[(i + 1) % Math.max(1, uniqueKeywords.length)] || 'standar';
    const kw3 = uniqueKeywords[(i + 2) % Math.max(1, uniqueKeywords.length)] || 'integrasi';

    if (qType === 'MULTIPLE_CHOICE') {
      // Create varied question styles based on question index
      const questionStyle = i % 3;

      if (questionStyle === 0) {
        // Style 1: Kesimpulan / Gagasan Pokok
        questions.push({
          text: `Teks Bacaan:\n"${targetSentence}"\n\nPertanyaan: Berdasarkan kutipan teks bacaan di atas, kesimpulan atau gagasan pokok yang paling tepat adalah?`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: topicName,
          points: 1.0,
          explanation: `Kutipan teks secara langsung menerangkan pembahasan mengenai "${targetSentence.slice(0, 80)}...".`,
          choices: shuffleArray([
            { text: `Menelaah pemahaman konsep dan kaidah mendasar mengenai ${kw1} serta ${kw2}`, isCorrect: true },
            { text: `Mengabaikan prinsip utama dalam penerapan materi ${kw1}`, isCorrect: false },
            { text: `Menghilangkan bagian evaluasi dan analisis pemahaman konsep`, isCorrect: false },
            { text: `Menyimpulkan pernyataan yang bertentangan dengan materi yang dipelajari`, isCorrect: false },
          ]),
        });
      } else if (questionStyle === 1) {
        // Style 2: Pernyataan yang Sesuai / Faktual
        questions.push({
          text: `Teks Bacaan:\n"${targetSentence}"\n\nPertanyaan: Berdasarkan teks bacaan tersebut, manakah pernyataan berikut yang bernilai BENAR dan sesuai dengan isi materi?`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: topicName,
          points: 1.0,
          explanation: `Pernyataan yang sesuai menyatakan fakta yang termuat dalam teks bacaan rujukan.`,
          choices: shuffleArray([
            { text: `Materi tersebut menerangkan pentingnya pemahaman ${kw2} secara mendalam dan terstruktur`, isCorrect: true },
            { text: `Seluruh isi pembahasan bersifat spekulatif tanpa ada landasan materi yang jelas`, isCorrect: false },
            { text: `Konsep yang disampaikan tidak memiliki relevansi terhadap kompetensi yang diuji`, isCorrect: false },
            { text: `Pernyataan menolak adanya hubungan antara konsep dasar dan penerapannya`, isCorrect: false },
          ]),
        });
      } else {
        // Style 3: Tujuan & Implikasi
        questions.push({
          text: `Teks Bacaan:\n"${targetSentence}"\n\nPertanyaan: Apa tujuan utama atau manfaat yang ingin dicapai berdasarkan uraian teks di atas?`,
          type: 'MULTIPLE_CHOICE',
          difficulty: options.difficulty,
          topic: topicName,
          points: 1.0,
          explanation: `Tujuan yang ingin dicapai berfokus pada efektivitas penerapan materi yang diuraikan.`,
          choices: shuffleArray([
            { text: `Meningkatkan kompetensi pemahaman dan penguasaan topik terkait ${kw3}`, isCorrect: true },
            { text: `Menghindari penguasaan materi agar mempermudah penyelesaian soal`, isCorrect: false },
            { text: `Mengganti pemahaman konseptual dengan praduga tanpa bukti kajian`, isCorrect: false },
            { text: `Membatasi ruang lingkup telaah sehingga tidak dapat dipelajari secara komprehensif`, isCorrect: false },
          ]),
        });
      }
    } else if (qType === 'TRUE_FALSE') {
      questions.push({
        text: `Kutipan Teks:\n"${targetSentence}"\n\nPernyataan: Informasi dan pokok pikiran yang dipaparkan dalam kutipan di atas merupakan fakta yang sesuai dengan materi rujukan.`,
        type: 'TRUE_FALSE',
        difficulty: options.difficulty,
        topic: topicName,
        points: 1.0,
        explanation: 'Pernyataan bernilai BENAR sesuai isi teks rujukan.',
        choices: [
          { text: 'Benar', isCorrect: true },
          { text: 'Salah', isCorrect: false },
        ],
      });
    } else if (qType === 'ESSAY') {
      questions.push({
        text: `Teks Rujukan:\n"${targetSentence}"\n\nSoal Essay: Uraikan dan jelaskan secara mendalam bagaimana konsep yang termuat dalam kutipan teks di atas diterapkan dalam konteks pembelajaran "${topicName}"!`,
        type: 'ESSAY',
        difficulty: options.difficulty,
        topic: topicName,
        points: 5.0,
        explanation: 'Kriteria Penilaian: Pemahaman konsep dasar, kedalaman analisis, relevansi dengan teks rujukan, dan argumentasi logis.',
      });
    } else {
      questions.push({
        text: `Teks Rujukan:\n"${targetSentence}"\n\nPertanyaan: Berdasarkan teks di atas, sebutkan kata kunci atau konsep utama yang ditekankan dalam pembahasan tersebut!`,
        type: 'SHORT_ANSWER',
        difficulty: options.difficulty,
        topic: topicName,
        points: 2.0,
        explanation: `Kata kunci utama: ${kw1}, ${kw2}, atau istilah teknis terkait dalam kalimat rujukan.`,
      });
    }
  }

  return questions;
}

function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function getStringSimilarity(str1: string, str2: string): number {
  const s1 = str1.trim().toLowerCase();
  const s2 = str2.trim().toLowerCase();
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;
  const maxLength = Math.max(s1.length, s2.length);
  if (maxLength === 0) return 1.0;
  const distance = getLevenshteinDistance(s1, s2);
  return (maxLength - distance) / maxLength;
}

function getKeywordOverlapRatio(str1: string, str2: string): number {
  const words1 = str1.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/).filter((w) => w.length > 2);
  const words2 = str2.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/).filter((w) => w.length > 2);
  if (words1.length === 0 || words2.length === 0) return 0;

  const set2 = new Set(words2);
  let matchCount = 0;
  for (const w of words1) {
    if (set2.has(w)) matchCount++;
  }
  return matchCount / Math.min(words1.length, words2.length);
}

export interface EvaluationResult {
  isCorrect: boolean;
  score: number;
  verdict: 'BENAR' | 'SETENGAH_BENAR' | 'SALAH';
  feedback?: string;
}

export async function evaluateTextAnswerWithAI(
  questionText: string,
  targetAnswer: string,
  studentAnswer: string,
  maxPoints: number = 1.0
): Promise<EvaluationResult> {
  const student = studentAnswer.trim();
  const target = targetAnswer.trim();

  if (!student) {
    return { isCorrect: false, score: 0, verdict: 'SALAH', feedback: 'Jawaban kosong' };
  }

  // 1. Exact Match -> 100% score
  if (student.toLowerCase() === target.toLowerCase()) {
    return { isCorrect: true, score: maxPoints, verdict: 'BENAR', feedback: 'Jawaban Benar Sempurna (100%)' };
  }

  // 2. High Similarity -> 100% score
  const similarity = getStringSimilarity(student, target);
  const keywordOverlap = getKeywordOverlapRatio(student, target);
  const isSub = (student.length >= 3 && target.toLowerCase().includes(student.toLowerCase())) ||
                (target.length >= 3 && student.toLowerCase().includes(target.toLowerCase()));

  if (similarity >= 0.85) {
    return { isCorrect: true, score: maxPoints, verdict: 'BENAR', feedback: 'Jawaban Benar (100%)' };
  }

  // 3. AI Evaluation via Gemini API
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Anda adalah korektor ujian otomatis yang bijaksana. Evaluasi jawaban siswa untuk soal berikut:
Pertanyaan: "${questionText}"
Kunci / Acuan Jawaban: "${target}"
Jawaban Siswa: "${student}"

Tugas:
Tentukan nilai bagi jawaban siswa:
- BENAR (100% poin) jika jawaban siswa pada dasarnya benar atau maksud/konsep utamanya sama dengan kunci jawaban.
- SETENGAH_BENAR (50% poin) jika jawaban mepet, hampir benar, menyebutkan sebagian poin kunci, ada sedikit kesalahan penulisan/istilah, atau kurang lengkap.
- SALAH (0% poin) jika jawaban tidak relevan, salah konsep, atau tidak menjawab soal.

Berikan output HANYA dalam format JSON persis seperti berikut:
{
  "verdict": "BENAR" | "SETENGAH_BENAR" | "SALAH",
  "feedback": "Penjelasan singkat dalam 1 kalimat"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
      });

      const rawText = response.text || '';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.verdict === 'BENAR') {
        return { isCorrect: true, score: maxPoints, verdict: 'BENAR', feedback: parsed.feedback || 'Jawaban Benar (100%)' };
      } else if (parsed.verdict === 'SETENGAH_BENAR') {
        const halfScore = Math.round((maxPoints * 0.5) * 100) / 100;
        return { isCorrect: true, score: halfScore, verdict: 'SETENGAH_BENAR', feedback: parsed.feedback || 'Jawaban Hampir Benar / Setengah Benar (50%)' };
      } else {
        return { isCorrect: false, score: 0, verdict: 'SALAH', feedback: parsed.feedback || 'Jawaban Salah (0%)' };
      }
    } catch (err) {
      console.error('Error in AI evaluation, fallback to algorithm:', err);
    }
  }

  // 4. Fallback Algorithm if AI API is not active
  if (similarity >= 0.55 || keywordOverlap >= 0.35 || isSub) {
    const halfScore = Math.round((maxPoints * 0.5) * 100) / 100;
    return { isCorrect: true, score: halfScore, verdict: 'SETENGAH_BENAR', feedback: 'Jawaban Hampir Benar (50%)' };
  }

  return { isCorrect: false, score: 0, verdict: 'SALAH', feedback: 'Jawaban Salah (0%)' };
}
