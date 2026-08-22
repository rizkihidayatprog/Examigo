import { GoogleGenAI } from '@google/genai';

export interface GenerateOptions {
  materialText: string;
  topic?: string;
  subject?: string;
  questionTypes: ('MULTIPLE_CHOICE' | 'ESSAY' | 'TRUE_FALSE' | 'SHORT_ANSWER')[];
  count: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  existingQuestions?: string[];
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

export async function generateQuestionsWithAI(options: GenerateOptions): Promise<GeneratedQuestion[]> {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();

  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment variables. Returning structured mock questions for demonstration.');
    return generateMockQuestions(options);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    let avoidSection = '';
    if (options.existingQuestions && options.existingQuestions.length > 0) {
      avoidSection = `\nPENTING: Hindari membuat pertanyaan yang sama atau sangat mirip dengan pertanyaan-pertanyaan berikut yang sudah ada:\n` + 
        options.existingQuestions.map((q, idx) => `${idx + 1}. ${q}`).join('\n') + '\n';
    }

    const gradeSection = options.grade ? `\n- Tingkatan Sekolah Target: ${options.grade}. Sesuaikan tingkat bahasa, kedalaman materi, tingkat kesulitan kognitif, dan kurikulum yang cocok untuk tingkatan tersebut.` : '';

    const imageInstruction = options.imageBase64
      ? `\n\nPENTING (ANALISIS GAMBAR): Gambar materi/diagram/grafik/lembar soal telah terlampir. Baca dan analisis isi visual gambar tersebut (teks, diagram, angka, grafik, rumus, atau tabel) secara teliti, lalu buatlah soal-soal ujian yang secara langsung menguji pemahaman terhadap gambar atau materi pada gambar tersebut.`
      : '';

    const prompt = `Anda adalah pakar pembuat soal ujian profesional.${imageInstruction}
Analisis materi pembelajaran ${options.imageBase64 ? 'dan gambar ' : ''}berikut secara menyeluruh dan buat ${options.count} soal ujian yang berkualitas tinggi, beraneka ragam (variatif), dan unik berdasarkan materi asli.
PENTING:
1. Jangan menggunakan awalan "[AI Generated]" atau awalan teknis apapun pada teks pertanyaan.
2. Setiap pertanyaan harus dibuat berdasarkan fakta/konsep asli dari materi yang diberikan.
3. Jangan membuat pertanyaan berulang atau hanya mengganti nomor paragraf. Setiap soal harus menguji topik/subbab yang berbeda.
4. Untuk mata pelajaran Matematika atau Sains, gunakan simbol matematika standar Unicode (seperti √, π, ², ³, ±, ×, ÷, ≠, ≤, ≥, dsb.) daripada format LaTeX mentah.
${avoidSection}

Detail Permintaan:
- Jumlah Soal: ${options.count}
- Tingkat Kesulitan: ${options.difficulty}${gradeSection}
- Tipe Soal yang Diminta: ${options.questionTypes.join(', ')}
- Topik/Mata Pelajaran: ${options.topic || options.subject || 'Umum'}

Materi Pembelajaran:
"""
${(options.materialText || '').slice(0, 8000)}
"""
PETUNJUK FORMAT OUTPUT:
Kembalikan HANYA JSON array murni tanpa markdown formatting (tanpa \`\`\`json). Format setiap elemen objek soal harus sesuai struktur berikut:
[
  {
    "text": "Pertanyaan soal...",
    "type": "MULTIPLE_CHOICE", // Pilihan dari: MULTIPLE_CHOICE, ESSAY, TRUE_FALSE, SHORT_ANSWER
    "difficulty": "${options.difficulty}",
    "topic": "${options.topic || 'Umum'}",
    "points": 1.0,
    "explanation": "Penjelasan singkat jawaban benar...",
    "choices": [
      { "text": "Pilihan A", "isCorrect": true },
      { "text": "Pilihan B", "isCorrect": false },
      { "text": "Pilihan C", "isCorrect": false },
      { "text": "Pilihan D", "isCorrect": false }
    ] // Pilihan wajib ada jika type adalah MULTIPLE_CHOICE atau TRUE_FALSE (2 pilihan: Benar, Salah).
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

    // Try model names in order of preference (gemini-flash-latest is verified working)
    const candidateModels = ['gemini-flash-latest', 'gemini-2.0-flash', 'gemini-1.5-flash-8b', 'gemini-pro'];
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
    const questions: GeneratedQuestion[] = JSON.parse(cleanJson);
    
    // Attach image URL if input had an image
    if (options.imageBase64) {
      const fullDataUrl = options.imageBase64.startsWith('data:')
        ? options.imageBase64
        : `data:${options.imageMimeType || 'image/png'};base64,${options.imageBase64}`;

      questions.forEach((q) => {
        q.imageUrl = fullDataUrl;
      });
    }

    return questions;
  } catch (error) {
    console.error('Error generating questions with Gemini API:', error);
    return generateMockQuestions(options);
  }
}

function generateMockQuestions(options: GenerateOptions): GeneratedQuestion[] {
  const result: GeneratedQuestion[] = [];
  const types = options.questionTypes.length > 0 ? options.questionTypes : ['MULTIPLE_CHOICE'];

  // Extract sentences or main topics from materialText if available
  const rawSentences = (options.materialText || '')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  for (let i = 1; i <= options.count; i++) {
    const qType = types[(i - 1) % types.length];
    const sentenceSnippet = rawSentences[i % rawSentences.length] || `prinsip utama materi ${options.topic || 'pembelajaran'}`;
    const cleanTopic = options.topic || 'Pemahaman Konsep';

    if (qType === 'MULTIPLE_CHOICE') {
      result.push({
        text: `Berdasarkan materi yang dipelajari, manakah pernyataan yang paling tepat mengenai "${sentenceSnippet.slice(0, 80)}..."?`,
        type: 'MULTIPLE_CHOICE',
        difficulty: options.difficulty,
        topic: cleanTopic,
        points: 1.0,
        explanation: 'Pernyataan ini secara langsung mencerminkan poin inti dari dokumen materi.',
        choices: [
          { text: 'Merupakan bagian dari konsep inti dan penerapan utama', isCorrect: true },
          { text: 'Merupakan langkah opsional yang tidak memerlukan evaluasi', isCorrect: false },
          { text: 'Hanya berlaku untuk prosedur sekunder tanpa analisis tambahan', isCorrect: false },
          { text: 'Diterapkan secara manual tanpa melibatkan sistem terintegrasi', isCorrect: false },
        ],
      });
    } else if (qType === 'TRUE_FALSE') {
      result.push({
        text: `Pernyataan: ${sentenceSnippet.slice(0, 100)} merupakan aspek yang benar sesuai dokumen rujukan.`,
        type: 'TRUE_FALSE',
        difficulty: options.difficulty,
        topic: cleanTopic,
        points: 1.0,
        explanation: 'Pernyataan bernilai BENAR sesuai rujukan materi pembelajaran.',
        choices: [
          { text: 'Benar', isCorrect: true },
          { text: 'Salah', isCorrect: false },
        ],
      });
    } else if (qType === 'ESSAY') {
      result.push({
        text: `Jelaskan secara komprehensif bagaimana keterkaitan antara pokok bahasan utama dengan penerapannya pada topik "${cleanTopic}"!`,
        type: 'ESSAY',
        difficulty: options.difficulty,
        topic: cleanTopic,
        points: 5.0,
        explanation: 'Kriteria Penilaian: Kelengkapan argumen, kejelasan struktur teks, dan referensi pada materi.',
      });
    } else {
      result.push({
        text: `Sebutkan nama istilah atau konsep utama yang digunakan dalam pembahasan "${cleanTopic}"!`,
        type: 'SHORT_ANSWER',
        difficulty: options.difficulty,
        topic: cleanTopic,
        points: 2.0,
        explanation: 'Istilah kunci sesuai dengan dokumen rujukan.',
      });
    }
  }

  return result;
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
