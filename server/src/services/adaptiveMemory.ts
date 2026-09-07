import prisma from '../lib/prisma';
import { QuestionType, Difficulty } from '@prisma/client';

export interface AdaptiveExemplar {
  text: string;
  type: 'MULTIPLE_CHOICE' | 'ESSAY' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic?: string;
  explanation?: string;
  choices?: { text: string; isCorrect: boolean }[];
  isCuratedByTeacher?: boolean;
}

export interface TeacherStyleProfile {
  totalQuestions: number;
  prefersStimulus: boolean;
  prefersDetailedExplanation: boolean;
  dominantTopics: string[];
}

export interface AdaptiveLearningContext {
  referenceExemplars: AdaptiveExemplar[];
  teacherStyleProfile?: TeacherStyleProfile;
  existingQuestionTexts: string[];
}

/**
 * Mengambil konteks pembelajaran adaptif dari database guru:
 * 1. Menghimpun soal-soal kurasi terbaik sebagai acuan Few-Shot In-Context Learning.
 * 2. Menganalisis profil gaya mengajar dan preferensi penyusunan soal sang guru.
 * 3. Mengumpulkan daftar soal yang sudah ada agar AI tidak membuat duplikasi.
 */
export async function getAdaptiveLearningContext(
  teacherId: string,
  params: {
    subjectId?: string;
    grade?: string;
    topic?: string;
    difficulty?: string;
    questionTypes?: string[];
  }
): Promise<AdaptiveLearningContext> {
  try {
    // 1. Ambil riwayat soal guru (khusus subject ini + seluruh bank soal guru) guna pencegahan duplikasi mutlak
    const questionsBySubject = params.subjectId
      ? await prisma.question.findMany({
          where: { teacherId, subjectId: params.subjectId },
          select: { text: true, topic: true, explanation: true, createdAt: true, updatedAt: true },
          take: 300,
        })
      : [];

    const generalTeacherQuestions = await prisma.question.findMany({
      where: { teacherId },
      select: { text: true, topic: true, explanation: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const allTeacherQuestions = [...questionsBySubject, ...generalTeacherQuestions];
    const seenTexts = new Set<string>();
    const uniqueTeacherQuestions = [];
    for (const q of allTeacherQuestions) {
      const t = (q.text || '').trim();
      if (t && !seenTexts.has(t)) {
        seenTexts.add(t);
        uniqueTeacherQuestions.push(q);
      }
    }

    const existingQuestionTexts = Array.from(seenTexts);

    // 2. Profil Gaya Guru (Teacher Pedagogical Style Profile)
    const totalQuestions = allTeacherQuestions.length;
    let stimulusCount = 0;
    let explanationCount = 0;
    const topicFrequency: Record<string, number> = {};

    for (const q of allTeacherQuestions) {
      const lower = q.text.toLowerCase();
      // Indikator stimulus / studi kasus / teks bacaan
      if (
        lower.includes('berdasarkan') ||
        lower.includes('bacaan') ||
        lower.includes('teks') ||
        lower.includes('kutipan') ||
        lower.includes('"') ||
        lower.includes('skenario') ||
        lower.includes('studi kasus') ||
        lower.includes('tabel') ||
        q.text.length > 120
      ) {
        stimulusCount++;
      }
      if (q.explanation && q.explanation.trim().length > 20) {
        explanationCount++;
      }
      if (q.topic && q.topic.trim() && q.topic !== 'Umum') {
        topicFrequency[q.topic] = (topicFrequency[q.topic] || 0) + 1;
      }
    }

    const topTopics = Object.entries(topicFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t]) => t);

    const teacherStyleProfile: TeacherStyleProfile = {
      totalQuestions,
      prefersStimulus: totalQuestions > 0 ? stimulusCount / totalQuestions >= 0.35 : false,
      prefersDetailedExplanation: totalQuestions > 0 ? explanationCount / totalQuestions >= 0.3 : false,
      dominantTopics: topTopics,
    };

    // 3. Pencarian Contoh Soal Acuan Mutu Tinggi (Few-Shot Exemplars)
    // Prioritas 1: Soal milik guru ini dengan choices & pembahasan
    const candidateWhere: any = {
      teacherId,
      choices: { some: {} },
    };
    if (params.subjectId) candidateWhere.subjectId = params.subjectId;

    let candidateQuestions = await prisma.question.findMany({
      where: candidateWhere,
      include: {
        choices: true,
      },
      orderBy: [{ updatedAt: 'desc' }],
      take: 25,
    });

    // Jika soal untuk mata pelajaran ini masih kurang dari 3, perluas ke soal-soal guru lain mata pelajaran
    if (candidateQuestions.length < 3) {
      const otherQuestions = await prisma.question.findMany({
        where: {
          teacherId,
          choices: { some: {} },
        },
        include: { choices: true },
        orderBy: [{ updatedAt: 'desc' }],
        take: 15,
      });

      const seenIds = new Set(candidateQuestions.map((q) => q.id));
      for (const oq of otherQuestions) {
        if (!seenIds.has(oq.id)) {
          candidateQuestions.push(oq);
          seenIds.add(oq.id);
        }
      }
    }

    // Jika guru baru belum punya soal, ambil soal-soal terverifikasi di sistem (jika ada)
    if (candidateQuestions.length < 2 && params.subjectId) {
      const systemQuestions = await prisma.question.findMany({
        where: {
          subjectId: params.subjectId,
          choices: { some: {} },
          explanation: { not: null },
        },
        include: { choices: true },
        orderBy: [{ createdAt: 'desc' }],
        take: 5,
      });
      const seenIds = new Set(candidateQuestions.map((q) => q.id));
      for (const sq of systemQuestions) {
        if (!seenIds.has(sq.id)) {
          candidateQuestions.push(sq);
          seenIds.add(sq.id);
        }
      }
    }

    // Skoring kualitas soal acuan
    const scoredCandidates = candidateQuestions.map((q) => {
      let score = 0;
      const isCurated = q.updatedAt.getTime() - q.createdAt.getTime() > 10000;
      
      // Soal yang pernah diedit/disesuaikan guru bernilai sangat tinggi
      if (isCurated) score += 6;
      
      // Kelengkapan pembahasan edukatif
      if (q.explanation && q.explanation.length > 30) score += 4;
      
      // Kelengkapan pilihan ganda yang valid
      const hasCorrect = q.choices.some((c) => c.isCorrect);
      if (hasCorrect && q.choices.length >= 4) score += 3;
      
      // Relevansi dengan permintaan saat ini
      if (params.grade && q.grade === params.grade) score += 2;
      if (params.topic && q.topic?.toLowerCase().includes(params.topic.toLowerCase())) score += 3;
      if (params.difficulty && q.difficulty === params.difficulty) score += 2;

      return {
        question: q,
        score,
        isCurated,
      };
    });

    scoredCandidates.sort((a, b) => b.score - a.score);

    // Ambil 3-4 butir soal terbaik sebagai Exemplar
    const referenceExemplars: AdaptiveExemplar[] = scoredCandidates.slice(0, 4).map(({ question, isCurated }) => ({
      text: question.text,
      type: question.type as any,
      difficulty: question.difficulty as any,
      topic: question.topic || undefined,
      explanation: question.explanation || undefined,
      choices: question.choices.map((c) => ({
        text: c.text,
        isCorrect: c.isCorrect,
      })),
      isCuratedByTeacher: isCurated,
    }));

    return {
      referenceExemplars,
      teacherStyleProfile,
      existingQuestionTexts,
    };
  } catch (error) {
    console.error('Error fetching adaptive learning context:', error);
    return {
      referenceExemplars: [],
      existingQuestionTexts: [],
    };
  }
}
