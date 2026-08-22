import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, Save, ArrowLeft, ArrowRight, ShieldCheck, User, Mail, Sparkles, Loader2, AlertTriangle, Download, FileText, ChevronDown, ChevronUp, BookOpen, Settings, Type, Moon, Sun } from 'lucide-react';
import { api } from '../lib/auth';
import { useToast } from '../components/Toast';
import { jsPDF } from 'jspdf';
import { formatRichText } from '../lib/formatters';

export default function ExamRoomPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(3600);
  const [isAutoSaved, setIsAutoSaved] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isMaterialExpanded, setIsMaterialExpanded] = useState(true);

  const shouldShowMaterial = (_question: any) => false;

  // Expand material by default when switching question
  useEffect(() => {
    setIsMaterialExpanded(true);
  }, [currentIndex]);

  // Student registration states
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});

  // Anti-cheat states
  const [localCheatingCount, setLocalCheatingCount] = useState(0);
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(true);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);

  // Appearance Settings
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [showSettings, setShowSettings] = useState(false);

  // Derived Theme Classes
  const themeCard = isDarkMode ? 'bg-slate-900 border-slate-700 shadow-none' : 'bg-white border-slate-200/80 shadow-sm';
  const themeText = isDarkMode ? 'text-slate-100' : 'text-slate-900';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const themeOptionBox = isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-indigo-500' : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/60';
  const themeOptionLabel = isDarkMode ? 'bg-slate-950 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-600 border border-slate-200';
  const textSizeClass = textSize === 'normal' ? 'text-base sm:text-lg' : textSize === 'large' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl';

  // Apply dark mode to root html
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    if (!document.documentElement.requestFullscreen) {
      setIsFullscreenSupported(false);
    }
  }, []);

  const requestFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen()
        .then(() => setIsFullscreenActive(true))
        .catch(() => {});
    }
  };

  const triggerCheatingWarning = async (reason: string) => {
    if (!participantId || isSubmitted) return;
    setLocalCheatingCount((prev) => {
      const nextCount = prev + 1;
      showToast(`Peringatan kecurangan (${reason})! Pelanggaran: ${nextCount}/3`, 'error');

      // Sync warning count to database
      api(`/exams/participant/${participantId}/cheating`, { method: 'POST' })
        .catch((err) => console.error('Error reporting cheating:', err));

      if (nextCount >= 3) {
        showToast('Batas maksimum pelanggaran tercapai. Ujian dikumpulkan otomatis.', 'error');
        setTimeout(() => {
          confirmSubmitExamDirect();
        }, 1000);
      }
      return nextCount;
    });
  };

  const confirmSubmitExamDirect = async () => {
    if (!participantId) return;
    setLoading(true);
    try {
      const res = await api(`/exams/code/${code || 'EXAM-WEB101'}/submit`, {
        method: 'POST',
        body: JSON.stringify({ participantId }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        setIsSubmitted(true);
        showToast('Ujian berhasil dikumpulkan!', 'success');
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!participantId || isSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerCheatingWarning('Beralih aplikasi / tab');
      }
    };

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreenActive(isCurrentlyFullscreen);
      if (!isCurrentlyFullscreen && isFullscreenSupported) {
        triggerCheatingWarning('Keluar dari mode layar penuh');
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerCheatingWarning('Klik kanan / Context Menu diblokir');
    };

    const handleCopyCutPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCheatingWarning('Tindakan Copy / Cut / Paste diblokir');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // Block F12, Ctrl+Shift+I/J/C, Ctrl+U/S/P/C/V/X
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
        (e.ctrlKey && (key === 'u' || key === 's' || key === 'p' || key === 'c' || key === 'v' || key === 'x')) ||
        (e.metaKey && (key === 'c' || key === 'v' || key === 'x')) // For Mac
      ) {
        e.preventDefault();
        triggerCheatingWarning('Kombinasi tombol keyboard dilarang');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyCutPaste);
    document.addEventListener('cut', handleCopyCutPaste);
    document.addEventListener('paste', handleCopyCutPaste);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyCutPaste);
      document.removeEventListener('cut', handleCopyCutPaste);
      document.removeEventListener('paste', handleCopyCutPaste);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [participantId, isSubmitted, isFullscreenSupported]);

  useEffect(() => {
    api(`/exams/code/${code || 'EXAM-WEB101'}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExam(data.data);
          setTimeLeftSeconds(data.data.durationMinutes * 60);
        } else {
          showToast('Ujian tidak ditemukan.', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        showToast('Koneksi server gagal memuat ujian.', 'error');
      })
      .finally(() => setLoading(false));
  }, [code]);

  // Timer Countdown
  useEffect(() => {
    if (!participantId || isSubmitted || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [participantId, isSubmitted, timeLeftSeconds]);

  const handleJoinExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) return;

    setIsJoining(true);
    try {
      const res = await api(`/exams/code/${code || 'EXAM-WEB101'}/join`, {
        method: 'POST',
        body: JSON.stringify({ studentName, studentEmail, password: joinPassword || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setParticipantId(data.data.participantId);
        
        // Auto request fullscreen when starting
        if (isFullscreenSupported) {
          requestFullscreen();
        }
        
        // Restore answers if any
        if (data.data.answers && data.data.answers.length > 0) {
          const loadedAnswers: Record<string, any> = {};
          data.data.answers.forEach((ans: any) => {
            loadedAnswers[ans.questionId] = ans.selectedChoiceId || ans.textAnswer || '';
          });
          setAnswers(loadedAnswers);
          showToast('Melanjutkan progres ujian Anda sebelumnya.', 'info');
        } else {
          showToast('Selamat mengerjakan ujian!', 'success');
        }
      } else {
        showToast(data.message || 'Gagal masuk ruang ujian', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan koneksi.', 'error');
    } finally {
      setIsJoining(false);
    }
  };

  const handleSaveAnswer = async (questionId: string, choiceId?: string, text?: string) => {
    if (!participantId) return;

    setIsAutoSaved(false);
    try {
      const res = await api('/exams/answers/save', {
        method: 'POST',
        body: JSON.stringify({
          participantId,
          questionId,
          selectedChoiceId: choiceId,
          textAnswer: text,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAutoSaved(true);
      }
    } catch (err) {
      console.error('Auto-save error:', err);
    }
  };

  const handleSelectChoice = (questionId: string, choiceId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
    handleSaveAnswer(questionId, choiceId, undefined);
  };

  const handleEssayAnswer = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }));
    handleSaveAnswer(questionId, undefined, text);
  };

  const handleSubmitExam = () => {
    if (!exam || !participantId) return;
    setShowConfirmModal(true);
  };

  const confirmSubmitExam = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const res = await api(`/exams/code/${code || 'EXAM-WEB101'}/submit`, {
        method: 'POST',
        body: JSON.stringify({ participantId }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        setIsSubmitted(true);
        showToast('Ujian berhasil dikumpulkan!', 'success');
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      } else {
        showToast(data.message || 'Gagal mengumpulkan ujian', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan koneksi saat mengumpulkan ujian.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
        <Clock className="w-8 h-8 animate-spin text-brand-400 mb-3" />
        <p className="text-sm font-semibold">Memuat Ruang Ujian...</p>
      </div>
    );
  }

  if (!exam) {
    return <div className="p-8 text-center text-red-400">Ujian tidak ditemukan.</div>;
  }

  // Join Screen
  if (!participantId) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xl relative z-10 animate-fade-in-fast">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black text-slate-900">{exam.title}</h1>
          <p className="text-xs text-slate-500 font-medium">Kode Akses: <code className="text-indigo-600 font-mono font-bold">{exam.code}</code></p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5 font-medium">
          {exam.subject?.name && <p><strong>Mata Pelajaran</strong>: {exam.subject.name}</p>}
          {exam.grade && <p><strong>Tingkatan/Kelas</strong>: {exam.grade}</p>}
          <p><strong>Durasi Ujian</strong>: {exam.durationMinutes} Menit</p>
          <p><strong>Total Soal</strong>: {exam.questions?.length || 0} Pertanyaan</p>
          <p><strong>Nilai Minimum Lulus</strong>: {exam.minPassingScore}</p>
          {exam.description && <p className="text-[11px] text-slate-500 mt-2 italic border-t border-slate-200 pt-2">Petunjuk: {exam.description}</p>}
        </div>

        <form onSubmit={handleJoinExam} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Nama Lengkap</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition-colors font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition-colors font-medium"
              />
            </div>
          </div>

          {exam.hasPassword && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Password Akses Ujian</label>
              <input
                type="password"
                required
                value={joinPassword}
                onChange={(e) => setJoinPassword(e.target.value)}
                placeholder="Masukkan password ujian"
                className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition-colors font-medium"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isJoining}
            className="saas-button-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
          >
            {isJoining ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Menghubungkan...
              </>
            ) : (
              <>
                Mulai Kerjakan Ujian <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  const currentQuestion = exam.questions?.[currentIndex];
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleDownloadCertificate = () => {
    if (!exam || !result) return;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Premium Palette Background
    doc.setFillColor(15, 23, 42); // slate-950
    doc.rect(0, 0, 297, 210, 'F');

    // Outer Slate Border
    doc.setDrawColor(30, 41, 59); // slate-800
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    // Inner Gold/Amber Accent Border
    doc.setDrawColor(245, 158, 11); // amber-500
    doc.setLineWidth(1);
    doc.rect(12, 12, 273, 186);

    // Decorative Accent Lines
    doc.setDrawColor(245, 158, 11);
    doc.line(40, 45, 257, 45);
    doc.line(40, 165, 257, 165);

    // Header Text
    doc.setTextColor(79, 70, 229); // indigo primary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('EXAMIGO AI CERTIFICATE', 148, 25, { align: 'center' });

    // Main Certificate Header
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('SERTIFIKAT KELULUSAN', 148, 38, { align: 'center' });

    // Body Subtitle
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('Dengan ini menerangkan bahwa peserta ujian:', 148, 65, { align: 'center' });

    // Student Name
    doc.setTextColor(245, 158, 11); // Gold/Amber
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.text(studentName.toUpperCase(), 148, 82, { align: 'center' });

    // Middle description
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('Telah dinyatakan lulus dalam ujian:', 148, 100, { align: 'center' });

    // Exam Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(exam.title, 148, 112, { align: 'center' });

    // Exam Metadata/Scores
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Kode Akses: ${exam.code}   |   Nilai Akhir: ${result.percentage}   |   Passing Score: ${exam.minPassingScore}`, 148, 125, { align: 'center' });
    doc.text(`Tanggal Kelulusan: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`, 148, 133, { align: 'center' });

    // Signatures
    doc.text('Direktur Examigo', 60, 160, { align: 'center' });
    doc.line(35, 153, 85, 153);

    doc.text('Sistem Kelulusan AI', 237, 160, { align: 'center' });
    doc.line(212, 153, 262, 153);

    doc.save(`Sertifikat_${studentName.replace(/\s+/g, '_')}_${exam.code}.pdf`);
  };

  // Calculate statistics for result screen
  const totalQuestionsCount = exam?.questions?.length || 0;
  const answeredQuestionsCount = Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== '').length;
  const unansweredQuestionsCount = totalQuestionsCount - answeredQuestionsCount;

  if (isSubmitted && result) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-white border border-slate-200/80 shadow-md text-center space-y-6 animate-fade-in-fast">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            UJIAN SELESAI
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 pt-2">Hasil Pengerjaan Ujian</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Hasil pengerjaan Anda telah tersimpan secara resmi ke dalam sistem.</p>
        </div>

        {/* Big Score Display */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nilai Akhir Murni</p>
          <div className="text-5xl sm:text-6xl font-black text-slate-900 flex items-baseline justify-center gap-1">
            <span className="text-indigo-600">{result.percentage}</span>
            <span className="text-xl font-semibold text-slate-400">/ 100</span>
          </div>
          <div className="pt-2">
            <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wide ${
              result.isPassed
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {result.isPassed ? '✓ LULUS (Memenuhi Passing Score)' : '✕ TIDAK LULUS'}
            </span>
          </div>
        </div>

        {/* Summary Metric Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-[11px] font-bold text-emerald-700">Jawaban Diisi</p>
            <p className="text-lg font-bold text-emerald-900 mt-0.5">✓ {answeredQuestionsCount}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-[11px] font-bold text-slate-500">Total Soal</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{totalQuestionsCount}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <p className="text-[11px] font-bold text-amber-700">Belum Dijawab</p>
            <p className="text-lg font-bold text-amber-900 mt-0.5">○ {unansweredQuestionsCount}</p>
          </div>
        </div>



        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {result.isPassed && (
            <button
              onClick={handleDownloadCertificate}
              className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all min-h-[48px]"
            >
              <Download className="w-4 h-4" /> Unduh Sertifikat Kelulusan
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold min-h-[48px]"
          >
            Kembali ke Beranda
          </button>
        </div>


      </div>
    );
  }

  const isTimerWarning = timeLeftSeconds <= 600 && timeLeftSeconds > 300;
  const isTimerDanger = timeLeftSeconds <= 300;
  const progressPercentage = totalQuestionsCount > 0 ? Math.round(((currentIndex + 1) / totalQuestionsCount) * 100) : 0;

  return (
    <div className="space-y-5 max-w-6xl mx-auto relative z-10 animate-fade-in-fast select-none">
      {/* Fullscreen Overlay Lock */}
      {!isSubmitted && participantId && isFullscreenSupported && !isFullscreenActive && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="max-w-md p-8 rounded-2xl bg-white border border-amber-300 shadow-xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-amber-600 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Mode Layar Penuh Diperlukan</h2>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Untuk menjaga integritas pengerjaan ujian, Anda wajib berada dalam mode layar penuh. Peringatan kecurangan akan dicatat apabila Anda keluar dari mode ini.
              </p>
            </div>
            <button
              onClick={requestFullscreen}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-sm min-h-[48px]"
            >
              Aktifkan Layar Penuh
            </button>
          </div>
        </div>
      )}

      {/* Top Header Bar - Focus Mode */}
      <div className={`p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200/80'}`}>
        <div>
          <h1 className={`text-base font-bold flex items-center gap-2 ${themeText}`}>
            <ShieldCheck className="w-5 h-5 text-indigo-600" /> {exam.title}
          </h1>
          <div className={`text-[11px] font-medium flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 ${themeTextMuted}`}>
            <span className="font-mono">Kode: {exam.code}</span>
            {exam.subject?.name && (
              <>
                <span className="opacity-50">•</span>
                <span>{exam.subject.name}</span>
              </>
            )}
            {exam.grade && (
              <>
                <span className="opacity-50">•</span>
                <span>Kelas {exam.grade}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          <div className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold ${themeTextMuted}`}>
            <Save className={`w-3.5 h-3.5 ${isAutoSaved ? 'text-emerald-600' : 'text-indigo-600 animate-pulse'}`} />
            {isAutoSaved ? 'Tersimpan' : 'Menyimpan...'}
          </div>

          {/* Settings Button */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
            >
              <Settings className="w-4 h-4" />
            </button>
            
            {showSettings && (
              <div className={`absolute right-0 mt-2 w-56 p-3 rounded-xl border shadow-xl z-50 animate-fade-in-fast ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="space-y-4">
                  <div>
                    <label className={`text-[10px] font-bold uppercase tracking-wider mb-2 block ${themeTextMuted}`}>Ukuran Teks</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                      <button onClick={() => setTextSize('normal')} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${textSize === 'normal' ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}>A</button>
                      <button onClick={() => setTextSize('large')} className={`flex-1 py-1.5 rounded-md text-sm font-bold transition-all ${textSize === 'large' ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}>A</button>
                      <button onClick={() => setTextSize('xlarge')} className={`flex-1 py-1.5 rounded-md text-base font-bold transition-all ${textSize === 'xlarge' ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}>A</button>
                    </div>
                  </div>
                  <div>
                    <label className={`text-[10px] font-bold uppercase tracking-wider mb-2 block ${themeTextMuted}`}>Tema Tampilan</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                      <button onClick={() => setIsDarkMode(false)} className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-all ${!isDarkMode ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}>
                        <Sun className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setIsDarkMode(true)} className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-all ${isDarkMode ? 'bg-slate-700 text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}>
                        <Moon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progressive Timer Badge */}
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono text-sm font-bold transition-colors ${
            isTimerDanger
              ? isDarkMode ? 'bg-red-900/30 border-red-800 text-red-400 animate-pulse' : 'bg-red-50 border-red-200 text-red-700 animate-pulse'
              : isTimerWarning
              ? isDarkMode ? 'bg-amber-900/30 border-amber-800 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'
              : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>{isTimerDanger || isTimerWarning ? '⚠ ' : ''}{formatTime(timeLeftSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Main Exam Workspace */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${isDarkMode ? 'dark' : ''}`}>
        {/* Left 8 Cols: Question Area */}
        <div className="lg:col-span-8 space-y-5">
          <div className={`p-6 rounded-2xl border space-y-6 transition-colors ${themeCard}`}>
            {/* Question Progress Header & Bar */}
            <div className={`space-y-2 border-b pb-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-extrabold text-sm ${themeText}`}>
                  Soal {currentIndex + 1} dari {totalQuestionsCount}
                </span>
                <span className={`font-semibold ${themeTextMuted}`}>
                  {progressPercentage}% Selesai • Bobot: {currentQuestion?.points || 1} Poin
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              {!currentQuestion ? (
                <div className="p-8 text-center text-slate-500 font-medium bg-slate-50 rounded-xl border border-slate-200">
                  Tidak ada soal yang tersedia pada paket ujian ini.
                </div>
              ) : (
                <>
                  <p
                    className={`${textSizeClass} font-bold leading-relaxed transition-all ${themeText}`}
                    dangerouslySetInnerHTML={{ __html: formatRichText(currentQuestion?.text) }}
                  />

                  {/* Question Reference / Material Text if present */}
                  {currentQuestion?.material && (
                    <div className={`p-4 rounded-xl border space-y-2 text-xs ${isDarkMode ? 'bg-indigo-950/20 border-indigo-900/50 text-slate-300' : 'bg-slate-50 border-indigo-100 text-slate-800'}`}>
                      <div className={`flex items-center gap-2 font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>
                        <BookOpen className={`w-4 h-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        <span>Materi Rujukan: {currentQuestion.material.title || 'Dokumen Pembelajaran'}</span>
                      </div>
                      {currentQuestion.material.extractedText && (
                        <div className={`text-[11px] font-medium leading-relaxed max-h-40 overflow-y-auto p-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                          <p dangerouslySetInnerHTML={{ __html: formatRichText(currentQuestion.material.extractedText) }} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Question Image if present */}
                  {currentQuestion?.imageUrl && (
                    <div className="pt-2 flex justify-center">
                      <img
                        src={currentQuestion.imageUrl}
                        alt="Gambar Rujukan Soal Ujian"
                        className={`max-h-72 sm:max-h-80 w-auto rounded-xl border object-contain p-1.5 shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Multiple Choice Options */}
            {currentQuestion && currentQuestion?.choices && currentQuestion.choices.length > 0 ? (
              <div className="space-y-3 pt-2">
                {currentQuestion.choices.map((c: any, idx: number) => {
                  const isSelected = answers[currentQuestion.id] === c.id;
                  const optionLabel = String.fromCharCode(65 + idx);

                  return (
                    <div
                      key={c.id || idx}
                      onClick={() => handleSelectChoice(currentQuestion.id, c.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between min-h-[52px] select-none ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold shadow-sm'
                          : `${themeOptionBox} font-medium`
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-indigo-600 text-white' : themeOptionLabel
                        }`}>
                          [{optionLabel}]
                        </span>
                        <span className={`${textSize === 'normal' ? 'text-sm sm:text-base' : textSize === 'large' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'} font-semibold`} dangerouslySetInnerHTML={{ __html: formatRichText(c.text) }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : currentQuestion ? (
              /* Essay / Short Answer Input */
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 block">Ketik Jawaban Anda:</label>
                <textarea
                  rows={5}
                  value={answers[currentQuestion?.id] || ''}
                  onChange={(e) => currentQuestion?.id && handleEssayAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Tuliskan jawaban lengkap Anda di sini..."
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 transition-colors leading-relaxed font-medium select-text"
                />
              </div>
            ) : null}

            {/* Action Navigation Bar - 48px Touch Target Buttons */}
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="saas-button-secondary px-4 py-3 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-40 min-h-[48px] w-full"
              >
                <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Soal</span> Sebelumnya
              </button>

              <button
                type="button"
                disabled={!currentQuestion}
                onClick={() => currentQuestion?.id && toggleFlagQuestion(currentQuestion.id)}
                className={`px-4 py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all min-h-[48px] w-full ${
                  currentQuestion?.id && flaggedQuestions[currentQuestion.id]
                    ? isDarkMode ? 'bg-amber-900/30 border-amber-700 text-amber-500' : 'bg-amber-50 border-amber-300 text-amber-800'
                    : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                ⚑ {currentQuestion?.id && flaggedQuestions[currentQuestion.id] ? 'Ragu' : 'Tandai Ragu'}
              </button>

              {currentIndex === totalQuestionsCount - 1 ? (
                <button
                  onClick={handleSubmitExam}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center justify-center transition-all min-h-[48px] w-full"
                >
                  Selesaikan Ujian ✓
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="saas-button-primary px-5 py-3 text-xs font-bold flex items-center justify-center gap-2 min-h-[48px] w-full"
                >
                  <span className="hidden sm:inline">Soal</span> Berikutnya <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Accessible Question Grid Navigator */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 rounded-2xl border space-y-4 transition-colors ${themeCard}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${themeTextMuted}`}>Navigasi Nomor Soal</h3>
              <span className={`text-[11px] font-semibold ${themeTextMuted}`}>{answeredQuestionsCount} / {totalQuestionsCount} Dijawab</span>
            </div>

            {/* Accessible Status Legend */}
            <div className={`p-3 rounded-xl border grid grid-cols-3 gap-2 text-[11px] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                <span>✓</span> Sudah
              </div>
              <div className={`flex items-center gap-1.5 font-semibold ${themeTextMuted}`}>
                <span>○</span> Belum
              </div>
              <div className="flex items-center gap-1.5 font-bold text-amber-600">
                <span>⚑</span> Ragu
              </div>
            </div>

            {/* Question Buttons Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {exam.questions?.map((q: any, i: number) => {
                const isAnswered = Boolean(answers[q.id]);
                const isFlagged = Boolean(flaggedQuestions[q.id]);
                const isCurrent = currentIndex === i;

                let btnStyle = isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50';
                let iconSymbol = '○';

                if (isCurrent) {
                  btnStyle = 'border-2 border-indigo-600 bg-indigo-50 text-indigo-700 font-black shadow-sm';
                } else if (isFlagged) {
                  btnStyle = isDarkMode ? 'bg-amber-900/30 border border-amber-700 text-amber-500 font-bold' : 'bg-amber-50 border border-amber-300 text-amber-800 font-bold';
                  iconSymbol = '⚑';
                } else if (isAnswered) {
                  btnStyle = isDarkMode ? 'bg-emerald-900/30 border border-emerald-700 text-emerald-500 font-bold' : 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold';
                  iconSymbol = '✓';
                }

                return (
                  <button
                    key={q.id || i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-11 rounded-xl text-xs flex items-center justify-center gap-1 transition-all ${btnStyle}`}
                  >
                    <span className="text-[10px] opacity-80">{iconSymbol}</span>
                    <span>{i + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Submit Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-fast">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-5">
            <div className="flex flex-col items-center text-center space-y-3">
              <h3 className="text-xl font-extrabold text-slate-900">Selesaikan Ujian Sekarang?</h3>
              
              <div className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs text-slate-700 font-medium">
                <p className="flex items-center justify-between">
                  <span>✓ Soal Dijawab:</span>
                  <strong className="text-emerald-700 text-sm font-bold">{answeredQuestionsCount} Soal</strong>
                </p>
                <p className="flex items-center justify-between">
                  <span>○ Soal Kosong/Belum Dijawab:</span>
                  <strong className={unansweredQuestionsCount > 0 ? 'text-amber-700 text-sm font-bold' : 'text-slate-500 text-sm'}>
                    {unansweredQuestionsCount} Soal
                  </strong>
                </p>
              </div>

              {unansweredQuestionsCount > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold text-left flex items-start gap-2 w-full">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>Anda masih memiliki {unansweredQuestionsCount} soal yang belum dijawab. Jawaban tidak dapat diubah setelah diselesaikan.</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="saas-button-secondary flex-1 py-3 text-xs font-bold min-h-[48px]"
              >
                Kembali ke Ujian
              </button>
              <button
                onClick={confirmSubmitExam}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors min-h-[48px]"
              >
                Selesaikan Ujian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
