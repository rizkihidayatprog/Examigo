import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, CheckCircle2, Save, ArrowLeft, ArrowRight, ShieldCheck, ShieldAlert, User, Mail, Sparkles, Loader2, AlertTriangle, Download, FileText, BookOpen, Settings, Type, Moon, Sun, Maximize2, X, Search, Hash, ListOrdered, Phone, GraduationCap, Target, Flag, Check, Skull } from 'lucide-react';
import { api } from '../lib/auth';
import { useToast } from '../components/Toast';
import { jsPDF } from 'jspdf';
import { generateCertificatePdf } from '../lib/certificateGenerator';
import { formatRichText, sanitizeOrphanQuestionText } from '../lib/formatters';
import ExamigoLogo from '../components/common/ExamigoLogo';
import { useSEO } from '../components/common/SEO';

export default function ExamRoomPage() {
  const { code: routeCode } = useParams();
  const [searchParams] = useSearchParams();
  const code = (routeCode || searchParams.get('code') || '').trim().toUpperCase();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useSEO({
    title: code ? `Ujian ${code} - Ruang Ujian Online CBT` : 'Masuk Ruang Ujian Online CBT',
    description: 'Portal pengerjaan ujian online berbasis komputer (CBT) dengan sistem anti-contek dan penilaian instan.',
    noindex: !!code,
  });

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(3600);
  const [isAutoSaved, setIsAutoSaved] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  // Student registration states
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});
  const [joinPassword, setJoinPassword] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isStudentExamMaintenance, setIsStudentExamMaintenance] = useState(false);

  // Anti-cheat states
  const [localCheatingCount, setLocalCheatingCount] = useState(0);
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(true);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [lastWarningReason, setLastWarningReason] = useState<string>('');
  const [violationModalData, setViolationModalData] = useState<{
    count: number;
    reason: string;
    time: string;
  } | null>(null);
  const lastCheatingTimeRef = useRef<number>(0);

  // Appearance Settings
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [showSettings, setShowSettings] = useState(false);

  // Derived Theme Classes
  const themeCard = isDarkMode ? 'bg-slate-900 border-slate-700 shadow-none' : 'bg-white border-slate-200/80 shadow-sm';
  const themeText = isDarkMode ? 'text-slate-100' : 'text-slate-900';
  const themeTextMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const themeOptionBox = isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500' : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/60';
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

  // Synchronous DOM manipulation for Instant Snapshot Protection (iOS/Android Multitasking & App Switcher)
  const activatePrivacyLockdown = () => {
    const sheet = document.getElementById('exam-active-sheet');
    if (sheet) {
      sheet.style.filter = 'blur(60px)';
      sheet.style.opacity = '0.01';
      sheet.style.pointerEvents = 'none';
      sheet.style.userSelect = 'none';
    }
    const overlay = document.getElementById('sync-privacy-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
    }
  };

  const deactivatePrivacyLockdown = () => {
    const sheet = document.getElementById('exam-active-sheet');
    if (sheet) {
      sheet.style.filter = 'none';
      sheet.style.opacity = '1';
      sheet.style.pointerEvents = 'auto';
      sheet.style.userSelect = 'auto';
    }
    const overlay = document.getElementById('sync-privacy-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  };

  // High-Intensity Emergency Audio & Haptic Alarm
  const playIntenseAlarm = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([400, 150, 400, 150, 800]);
      }
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        
        // High Piercing Klaxon Alarm
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(960, now);
        osc1.frequency.linearRampToValueAtTime(320, now + 0.4);
        gain1.gain.setValueAtTime(0.5, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.42);

        // Low Ominous Threat Bass
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(140, now + 0.05);
        osc2.frequency.linearRampToValueAtTime(65, now + 0.5);
        gain2.gain.setValueAtTime(0.6, now + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.05);
        osc2.stop(now + 0.52);
      }
    } catch (e) {
      // Browser autoplay restriction fallback
    }
  };

  const triggerCheatingWarning = (reason: string) => {
    if (!participantId || isSubmitted) return;

    // Cooldown 2.5 detik untuk mencegah 1 kali perpindahan aplikasi (yang memicu blur + visibilitychange sekaligus) terhitung 2x
    const now = Date.now();
    if (now - lastCheatingTimeRef.current < 2500) return;
    lastCheatingTimeRef.current = now;

    playIntenseAlarm();
    setLastWarningReason(reason);

    setLocalCheatingCount((prev) => {
      const nextCount = prev + 1;
      showToast(`INDIKASI KECURANGAN: (${reason})! [${nextCount}/2]`, 'error');

      // Tampilkan Modal Peringatan Pelanggaran yang memblokir layar sampai disetujui
      setViolationModalData({
        count: nextCount,
        reason,
        time: new Date().toLocaleTimeString('id-ID'),
      });

      // Sync warning count to database
      api(`/exams/participant/${participantId}/cheating`, { method: 'POST' })
        .catch((err) => console.error('Error reporting cheating:', err));

      if (nextCount >= 2) {
        showToast('BATAS PELANGGARAN HABIS (2x)! Ujian dihentikan & dikumpulkan otomatis.', 'error');
        setTimeout(() => {
          confirmSubmitExamDirect();
        }, 1500);
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

  // Ultra-Strict Anti-Cheating Suite (Mobile & Desktop)
  useEffect(() => {
    if (!participantId || isSubmitted) return;

    // 1. Deteksi Beralih Tab / Aplikasi (Visibility Change)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        activatePrivacyLockdown();
        setIsWindowBlurred(true);
        triggerCheatingWarning('Beralih aplikasi / tab lain');
      } else {
        deactivatePrivacyLockdown();
        setIsWindowBlurred(false);
      }
    };

    // 2. Deteksi Fokus Layar Hilang (Tarik Notifikasi, Control Center, App Switcher, Multitasking di HP)
    const handleWindowBlur = () => {
      activatePrivacyLockdown();
      setIsWindowBlurred(true);
      triggerCheatingWarning('Fokus layar hilang (Beralih aplikasi / App Switcher / Tarik Notifikasi)');
    };

    const handleWindowFocus = () => {
      deactivatePrivacyLockdown();
      setIsWindowBlurred(false);
    };

    // 3. Deteksi Menutup / Meninggalkan Halaman (Page Hide untuk iOS & Android)
    const handlePageHide = () => {
      activatePrivacyLockdown();
      triggerCheatingWarning('Meninggalkan peramban ujian');
    };

    // 4. Deteksi Navigasi Keluar (Before Unload)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      activatePrivacyLockdown();
      e.preventDefault();
      e.returnValue = 'Ujian sedang berlangsung! Apakah Anda yakin ingin keluar?';
    };

    // 5. Deteksi Keluar Layar Penuh
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreenActive(isCurrentlyFullscreen);
      if (!isCurrentlyFullscreen && isFullscreenSupported) {
        triggerCheatingWarning('Keluar dari mode layar penuh');
      }
    };

    // 6. Blokir Gesture Screenshot 3 Jari di HP (Xiaomi, Oppo, Vivo, Samsung, Realme)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length >= 3) {
        e.preventDefault();
        triggerCheatingWarning('Gesture screenshot 3 jari diblokir');
      }
    };

    // 7. Nonaktifkan Menu Klik Kanan / Konteks (Didisable secara diam-diam tanpa dicatat sebagai pelanggaran kecurangan)
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    // 8. Blokir Seleksi Teks (Mencegah Google Lens / AI search pop-up)
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    // 9. Blokir Copy / Cut / Paste
    const handleCopyCutPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCheatingWarning('Tindakan Copy / Cut / Paste diblokir');
    };

    // 10. Blokir Tombol Keyboard & Shortcut Screenshot
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        e.key === 'F12' ||
        e.key === 'PrintScreen' ||
        (e.altKey && e.key === 'Tab') ||
        (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c' || key === 's')) ||
        (e.ctrlKey && (key === 'u' || key === 's' || key === 'p' || key === 'c' || key === 'v' || key === 'x' || key === 'a')) ||
        (e.metaKey && (key === 'c' || key === 'v' || key === 'x' || key === 'a' || key === 'p'))
      ) {
        e.preventDefault();
        triggerCheatingWarning(`Kombinasi tombol keyboard (${e.key}) dilarang`);
      }
    };

    // 11. Deteksi Mode Split-Screen di HP (Ukuran viewport anjlok drastis)
    let initialHeight = window.innerHeight;
    const handleResize = () => {
      if (window.innerHeight < initialHeight * 0.65 && !isSubmitted) {
        triggerCheatingWarning('Perubahan ukuran layar / Mode Split-Screen terdeteksi');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', handleCopyCutPaste);
    document.addEventListener('cut', handleCopyCutPaste);
    document.addEventListener('paste', handleCopyCutPaste);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopyCutPaste);
      document.removeEventListener('cut', handleCopyCutPaste);
      document.removeEventListener('paste', handleCopyCutPaste);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [participantId, isSubmitted, isFullscreenSupported]);

  useEffect(() => {
    if (!code) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api(`/exams/code/${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExam(data.data);
          setTimeLeftSeconds(data.data.durationMinutes * 60);
        } else {
          showToast(data.message || 'Ujian tidak ditemukan.', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        showToast('Koneksi server gagal memuat ujian.', 'error');
      })
      .finally(() => setLoading(false));

    fetch('/api/public/landing-config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.maintenance?.features?.studentExams) {
          setIsStudentExamMaintenance(true);
        }
      })
      .catch(() => {});
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

  const activeParticipantFields = React.useMemo(() => {
    if (exam?.participantFields && Array.isArray(exam.participantFields) && exam.participantFields.length > 0) {
      return exam.participantFields.filter((f: any) => f.enabled !== false);
    }
    return [
      { id: 'name', label: 'Nama Lengkap Siswa', placeholder: 'Ketik nama lengkap Anda', type: 'text', required: true },
      { id: 'email', label: 'Email Siswa', placeholder: 'nama@sekolah.sch.id', type: 'email', required: false },
    ];
  }, [exam?.participantFields]);

  const renderFieldIcon = (id: string, type?: string) => {
    if (id === 'name') return <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />;
    if (id === 'email' || type === 'email') return <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />;
    if (id === 'phone' || type === 'tel') return <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />;
    if (id === 'nis') return <Hash className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />;
    if (id === 'absentNo') return <ListOrdered className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />;
    if (id === 'studentClass') return <GraduationCap className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />;
    return <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />;
  };

  const handleJoinExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isStudentExamMaintenance) {
      showToast('Server pelaksanaan ujian sedang dalam pemeliharaan sementara. Mohon hubungi pengajar Anda.', 'error');
      return;
    }

    // Validate active fields
    for (const f of activeParticipantFields) {
      if (f.id === 'name') {
        if (!studentName.trim()) {
          showToast(`${f.label} wajib diisi!`, 'error');
          return;
        }
      } else if (f.id === 'email') {
        if (f.required && !studentEmail.trim()) {
          showToast(`${f.label} wajib diisi!`, 'error');
          return;
        }
      } else if (f.required) {
        const val = customFieldValues[f.id];
        if (!val || !String(val).trim()) {
          showToast(`${f.label} wajib diisi!`, 'error');
          return;
        }
      }
    }

    setIsJoining(true);
    try {
      const res = await api(`/exams/code/${code || 'EXAM-WEB101'}/join`, {
        method: 'POST',
        body: JSON.stringify({
          studentName: studentName.trim(),
          studentEmail: studentEmail.trim() || undefined,
          password: joinPassword || undefined,
          customFields: customFieldValues,
        }),
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
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="flex flex-col items-center justify-center space-y-3">
          <Clock className="w-8 h-8 animate-spin text-emerald-500" />
          <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Memuat Ruang Ujian...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className={`max-w-md w-full p-8 rounded-3xl border shadow-xl text-center space-y-6 animate-fade-in-fast ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-center">
            <ExamigoLogo size="md" showBadge={false} />
          </div>
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Ujian Tidak Ditemukan</h2>
            <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {code
                ? `Kode akses "${code}" tidak ditemukan atau belum dipublikasikan oleh guru.`
                : 'Silakan masukkan kode ujian resmi yang diberikan oleh guru Anda.'}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const target = (e.currentTarget.elements.namedItem('examCode') as HTMLInputElement)?.value.trim();
              if (target) navigate(`/exam-room/${target.toUpperCase()}`);
            }}
            className="space-y-3 pt-2"
          >
            <input
              name="examCode"
              type="text"
              defaultValue={code}
              placeholder="Contoh: EXAM-XXXXXX"
              className={`w-full px-4 py-3 rounded-xl border-2 text-center font-mono font-bold text-sm uppercase outline-none transition-all ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
              }`}
            />
            <button
              type="submit"
              style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
              className="w-full py-3 rounded-xl text-white font-black text-xs shadow-md hover:opacity-90 transition-all cursor-pointer"
            >
              Masuk ke Ruang Ujian
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Kembali ke Beranda
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Join Screen
  if (!participantId) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div 
          style={{ 
            backgroundColor: '#FFFFFF',
            borderColor: 'var(--theme-border, #A7F3D0)',
          }}
          className="max-w-lg w-full p-6 sm:p-8 rounded-3xl border-2 shadow-2xl space-y-6 relative z-10 animate-fade-in-fast"
        >
          {/* Header Brand */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-1">
              <ExamigoLogo size="md" showBadge={false} />
            </div>
            
            <div className="space-y-1">
              <span 
                style={{ 
                  backgroundColor: 'var(--theme-mint-light, #ECFDF5)',
                  color: 'var(--theme-primary, #059669)',
                  borderColor: 'var(--theme-border, #A7F3D0)'
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" /> Ruang Ujian Online
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">{exam.title}</h1>
              <p className="text-xs text-slate-500 font-bold">
                Kode Akses: <code style={{ color: 'var(--theme-primary, #059669)', backgroundColor: 'var(--theme-mint-light, #ECFDF5)' }} className="px-3 py-1 rounded-lg font-mono font-black text-xs border border-emerald-200">{exam.code}</code>
              </p>
            </div>
          </div>

          {/* Exam Specs Info Card */}
          <div 
            style={{ 
              backgroundColor: 'var(--theme-bg, #F0FDF4)',
              borderColor: 'var(--theme-border, #A7F3D0)'
            }}
            className="p-5 rounded-2xl border text-xs text-slate-800 space-y-2.5 font-semibold"
          >
            <div className="grid grid-cols-2 gap-2 text-xs">
              {exam.subject?.name && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Pelajaran:</span>
                  <strong className="text-slate-900 font-extrabold">{exam.subject.name}</strong>
                </div>
              )}
              {exam.grade && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Tingkat:</span>
                  <strong className="text-slate-900 font-extrabold">{exam.grade}</strong>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Durasi:</span>
                <strong className="text-slate-900 font-extrabold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-600" /> {exam.durationMinutes} Menit
                </strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Jumlah Soal:</span>
                <strong className="text-slate-900 font-extrabold flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-600" /> {exam.questions?.length || 0} Soal
                </strong>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <span className="text-slate-500">Standar Kelulusan:</span>
                <strong className="text-emerald-700 font-extrabold flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-emerald-600" /> Minimal {exam.minPassingScore} / 100
                </strong>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <span className="text-slate-500">Batas Pelanggaran:</span>
                <strong className="text-amber-700 font-extrabold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Maksimal 2x (Ujian Terkumpul Otomatis)
                </strong>
              </div>
            </div>

            {exam.description && (
              <div className="text-[11px] text-slate-600 italic border-t border-slate-200 pt-2 leading-relaxed flex items-start gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Petunjuk Pengerjaan:</strong> {exam.description}</span>
              </div>
            )}
          </div>

          {/* Student Form */}
          <form onSubmit={handleJoinExam} className="space-y-4">
            {activeParticipantFields.map((field: any) => {
              if (field.id === 'name') {
                return (
                  <div key="name">
                    <label className="text-xs font-black text-slate-800 block mb-1.5">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      {renderFieldIcon('name', 'text')}
                      <input
                        type="text"
                        required={field.required}
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder={field.placeholder || 'Ketik nama lengkap Anda'}
                        className="w-full bg-white border-2 border-slate-200 focus:border-emerald-500 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-slate-800 outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>
                );
              }

              if (field.id === 'email') {
                return (
                  <div key="email">
                    <label className="text-xs font-black text-slate-800 block mb-1.5">
                      {field.label} {field.required ? <span className="text-red-500">*</span> : <span className="text-slate-400 font-normal">(Opsional)</span>}
                    </label>
                    <div className="relative">
                      {renderFieldIcon('email', 'email')}
                      <input
                        type="email"
                        required={field.required}
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder={field.placeholder || 'nama@sekolah.sch.id'}
                        className="w-full bg-white border-2 border-slate-200 focus:border-emerald-500 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-slate-800 outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div key={field.id}>
                  <label className="text-xs font-black text-slate-800 block mb-1.5">
                    {field.label} {field.required ? <span className="text-red-500">*</span> : <span className="text-slate-400 font-normal">(Opsional)</span>}
                  </label>
                  <div className="relative">
                    {renderFieldIcon(field.id, field.type)}
                    <input
                      type={field.type || 'text'}
                      required={field.required}
                      value={customFieldValues[field.id] || ''}
                      onChange={(e) => setCustomFieldValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder || `Masukkan ${field.label}`}
                      className="w-full bg-white border-2 border-slate-200 focus:border-emerald-500 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-slate-800 outline-none transition-all shadow-xs"
                    />
                  </div>
                </div>
              );
            })}

            {exam.hasPassword && (
              <div>
                <label className="text-xs font-black text-slate-800 block mb-1.5">Password Ujian</label>
                <input
                  type="password"
                  required
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                  placeholder="Masukkan token password"
                  className="w-full bg-white border-2 border-slate-200 focus:border-emerald-500 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 outline-none transition-all shadow-xs"
                />
              </div>
            )}

            {isStudentExamMaintenance && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-amber-950">Pelaksanaan Ujian Sedang Dipelihara</p>
                  <p className="text-[11px] font-normal text-amber-800 mt-0.5">
                    Server ujian sedang dalam pemeliharaan berkala. Pengerjaan soal untuk sementara waktu tidak dapat dimulai.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isJoining || isStudentExamMaintenance}
              style={!isStudentExamMaintenance ? { backgroundColor: 'var(--theme-primary, #059669)' } : undefined}
              className={`w-full py-4 rounded-2xl text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all ${
                isStudentExamMaintenance
                  ? 'bg-amber-600 opacity-85 cursor-not-allowed'
                  : 'cursor-pointer hover:opacity-95 active:scale-98 disabled:opacity-50'
              }`}
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Menghubungkan Ruang Ujian...
                </>
              ) : isStudentExamMaintenance ? (
                <span className="flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Pelaksanaan Ujian Sedang Dipelihara
                </span>
              ) : (
                <>
                  Mulai Mengerjakan Ujian <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const currentQuestion = exam?.questions ? exam.questions[currentIndex] : null;
  const rawMaterial = currentQuestion?.material || exam?.questions?.find((q: any) => q?.material)?.material || null;

  // Bedakan antara materi rujukan sungguhan vs prompt instruksi pendek:
  // 1. Dokumen berkas fisik yang diimpor (PDF / Word / PPT dsb.) -> Tampilkan Pop-up
  // 2. Teks yang ditempel langsung -> Hanya tampilkan Pop-up jika teksnya sangat banyak (artikel/bacaan panjang >= 350 karakter).
  //    Jika hanya sedikit (beberapa kata atau 1 paragraf prompt), TIDAK perlu ditampilkan pop-up materi.
  const isSubstantialMaterial = Boolean(
    rawMaterial && (
      (rawMaterial.fileUrl && rawMaterial.fileUrl.trim().length > 0) ||
      (rawMaterial.extractedText && rawMaterial.extractedText.trim().length >= 350)
    )
  );
  const activeMaterial = isSubstantialMaterial ? rawMaterial : null;

  const isMaterialBased = Boolean(
    activeMaterial && (
      currentQuestion?.material ||
      /berdasarkan\s+(materi|teks|bacaan|dokumen|artikel|pembelajaran)/i.test(currentQuestion?.text || '') ||
      /menurut\s+(materi|teks|bacaan|dokumen)/i.test(currentQuestion?.text || '') ||
      /sesuai\s+(materi|teks|bacaan|dokumen)/i.test(currentQuestion?.text || '')
    )
  );

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

  const handleDownloadCertificate = async () => {
    if (!exam || !result) return;
    try {
      await generateCertificatePdf(
        exam.certificateSettings || {},
        {
          studentName: studentName || 'Peserta Ujian',
          examTitle: exam.title,
          examCode: exam.code,
          score: result.percentage,
          passingScore: exam.minPassingScore,
          completionDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        },
        true
      );
      showToast('Sertifikat kelulusan berhasil diunduh!', 'success');
    } catch (err: any) {
      console.error('Failed to download certificate:', err);
      showToast('Gagal mengunduh sertifikat: ' + err.message, 'error');
    }
  };

  // Calculate statistics for result screen
  const totalQuestionsCount = exam?.questions?.length || 0;
  const answeredQuestionsCount = Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== '').length;
  const unansweredQuestionsCount = totalQuestionsCount - answeredQuestionsCount;

  if (isSubmitted && result) {
    return (
      <div className={`min-h-screen p-4 transition-colors ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className={`max-w-2xl mx-auto mt-12 p-8 rounded-3xl border shadow-xl text-center space-y-6 animate-fade-in-fast ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'}`}>
          <div className="space-y-1">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isDarkMode ? 'bg-emerald-900/40 border border-emerald-800 text-emerald-400' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            }`}>
              UJIAN SELESAI
            </span>
            <h1 className={`text-2xl sm:text-3xl font-extrabold pt-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Hasil Pengerjaan Ujian</h1>
            <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Hasil pengerjaan Anda telah tersimpan secara resmi ke dalam sistem.</p>
          </div>

          {/* Big Score Display */}
          <div className={`p-6 rounded-2xl border space-y-3 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Nilai Akhir Murni</p>
            <div className={`text-5xl sm:text-6xl font-black flex items-baseline justify-center gap-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              <span className={isDarkMode ? 'text-emerald-400' : 'text-slate-600'}>{result.percentage}</span>
              <span className={`text-xl font-semibold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>/ 100</span>
            </div>
            <div className="pt-2">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wide ${
                result.isPassed
                  ? isDarkMode ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : isDarkMode ? 'bg-red-900/50 text-red-300 border border-red-800' : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {result.isPassed ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> LULUS (Memenuhi Passing Score)
                  </>
                ) : (
                  <>
                    <X className="w-3.5 h-3.5" /> TIDAK LULUS
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Summary Metric Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className={`p-3.5 rounded-xl border text-center ${isDarkMode ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-emerald-50 border-emerald-200'}`}>
              <p className={`text-[11px] font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Jawaban Diisi</p>
              <p className={`text-lg font-bold mt-0.5 flex items-center justify-center gap-1 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-900'}`}>
                <Check className="w-4 h-4 text-emerald-600" /> {answeredQuestionsCount}
              </p>
            </div>
            <div className={`p-3.5 rounded-xl border text-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <p className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Soal</p>
              <p className={`text-lg font-bold mt-0.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{totalQuestionsCount}</p>
            </div>
            <div className={`p-3.5 rounded-xl border text-center ${isDarkMode ? 'bg-amber-900/20 border-amber-800/50' : 'bg-amber-50 border-amber-200'}`}>
              <p className={`text-[11px] font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>Belum Dijawab</p>
              <p className={`text-lg font-bold mt-0.5 flex items-center justify-center gap-1.5 ${isDarkMode ? 'text-amber-300' : 'text-amber-900'}`}>
                <span className="w-2.5 h-2.5 rounded-full border border-current inline-block opacity-70" /> {unansweredQuestionsCount}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {result.isPassed && exam?.hasCertificate !== false && exam?.certificateSettings?.enableCertificate !== false && (
              <button
                onClick={handleDownloadCertificate}
                className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all min-h-[48px]"
              >
                <Download className="w-4 h-4" /> Unduh Sertifikat Kelulusan
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className={`flex-1 py-3.5 rounded-xl text-xs font-bold min-h-[48px] ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isTimerWarning = timeLeftSeconds <= 600 && timeLeftSeconds > 300;
  const isTimerDanger = timeLeftSeconds <= 300;
  const progressPercentage = totalQuestionsCount > 0 ? Math.round(((currentIndex + 1) / totalQuestionsCount) * 100) : 0;

  return (
    <div 
      style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
      className={`min-h-screen w-full transition-colors ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'} pb-32`}
    >
      <div className="space-y-5 max-w-6xl mx-auto relative z-10 animate-fade-in-fast select-none p-4 sm:p-6 lg:p-8">
        {/* Fullscreen Overlay Lock */}
        {!isSubmitted && participantId && isFullscreenSupported && !isFullscreenActive && (
          <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className={`max-w-md p-8 rounded-2xl border shadow-xl space-y-6 ${isDarkMode ? 'bg-slate-900 border-amber-500/50' : 'bg-white border-amber-300'}`}>
              <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto ${isDarkMode ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-50 border-amber-200'}`}>
                <AlertTriangle className={`w-8 h-8 animate-pulse ${isDarkMode ? 'text-amber-500' : 'text-amber-600'}`} />
              </div>
              <div className="space-y-2">
                <h2 className={`text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Mode Layar Penuh Diperlukan</h2>
                <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Untuk menjaga integritas pengerjaan ujian, Anda wajib berada dalam mode layar penuh. Peringatan kecurangan akan dicatat apabila Anda keluar dari mode ini.
                </p>
                <div className={`p-2.5 rounded-xl border text-xs font-bold ${
                  localCheatingCount > 0
                    ? 'bg-red-500/10 border-red-500/30 text-red-500'
                    : isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                  Status Pelanggaran: {localCheatingCount} / 2 kali (Batas Maksimal 2x)
                </div>
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

        {/* Synchronous Privacy Shield for instant Mobile Multitasking / App-Switcher snapshot blocking */}
        <div
          id="sync-privacy-overlay"
          style={{ display: 'none' }}
          className="fixed inset-0 z-[99998] bg-black flex flex-col items-center justify-center p-6 text-center text-white space-y-5 select-none pointer-events-auto shadow-[inset_0_0_120px_rgba(239,68,68,0.7)]"
        >
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-red-600/40 animate-ping" />
            <div className="w-20 h-20 rounded-2xl bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.8)]">
              <ShieldAlert className="w-12 h-12 animate-bounce" />
            </div>
          </div>
          <div className="space-y-2 max-w-sm">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white font-mono text-[10px] font-black uppercase tracking-widest animate-pulse">
              🔴 SECURITY LOCKDOWN ACTIVE
            </span>
            <h3 className="text-2xl font-black tracking-tight text-red-500">
              LAYAR TERKUNCI SENSOR KEAMANAN
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Anda terdeteksi meninggalkan halaman ujian atau membuka multitasking. Layar soal disembunyikan seketika untuk menjaga integritas.
            </p>
            <p className="text-xs font-black text-amber-400 bg-amber-950/60 border border-amber-500/40 p-2.5 rounded-xl">
              ⚠️ KEMBALILAH KE HALAMAN INI SEGERA SEBELUM WAKTU TOLERANSI HABIS!
            </p>
          </div>
        </div>

        {/* High-Impact Terrifying Blocking Violation Modal */}
        {violationModalData && !isSubmitted && participantId && (
          <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-6 text-center text-white select-none overflow-y-auto shadow-[inset_0_0_120px_rgba(239,68,68,0.75)]">
            <div className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border-2 space-y-6 shadow-2xl transition-all ${
              violationModalData.count >= 2 
                ? 'border-red-600 bg-gradient-to-b from-black via-red-950/80 to-black shadow-[0_0_80px_rgba(220,38,38,0.8)]' 
                : 'border-red-500 bg-gradient-to-b from-slate-950 via-red-950/50 to-black shadow-[0_0_60px_rgba(239,68,68,0.6)]'
            }`}>
              {/* Pulsing Emergency Beacon */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-red-600/40 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-red-500/20 animate-pulse" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-950 border-2 border-red-400 flex items-center justify-center text-white shadow-[0_0_40px_rgba(239,68,68,0.8)]">
                  <ShieldAlert className="w-11 h-11 animate-bounce" />
                </div>
              </div>

              {/* Title & Cyber Security Badge */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/60 text-red-300 text-[10px] font-mono font-black tracking-widest uppercase">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  PROCTORING SECURITY BREACH // #SEC-{Math.floor(1000 + Math.random() * 9000)}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  {violationModalData.count >= 2
                    ? '☠️ ANDA RESMI DIDISKUALIFIKASI!'
                    : '⚠️ AKTIVITAS TERLARANG TERDETEKSI!'}
                </h3>
                
                {/* Forensic Audit Log Box */}
                <div className="p-3.5 rounded-2xl bg-black/90 border border-red-500/40 text-left font-mono text-xs space-y-1.5 shadow-inner">
                  <div className="flex items-center justify-between text-[11px] text-red-400 font-bold border-b border-red-900/60 pb-1">
                    <span>BUKTI FORENSIK DIGITAL</span>
                    <span className="text-red-500 animate-pulse">● TERCATAT LIVE</span>
                  </div>
                  <div className="text-slate-300 text-[11px] pt-1">
                    <span className="text-slate-400">Tindakan Pelanggaran:</span>{' '}
                    <span className="text-white font-bold underline decoration-red-500">{violationModalData.reason}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between pt-0.5">
                    <span>Waktu: <strong className="text-slate-200">{violationModalData.time}</strong></span>
                    <span>Status: <strong className="text-red-400">TERKIRIM KE PENGAWAS</strong></span>
                  </div>
                </div>
              </div>

              {/* Terrifying Warning Statement */}
              <div className="text-xs leading-relaxed text-slate-300">
                {violationModalData.count >= 2 ? (
                  <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/60 text-red-200 font-bold text-xs space-y-2">
                    <p className="text-red-300 text-sm font-black uppercase">
                      AKSES UJIAN DIBEKUKAN SECARA PERMANEN
                    </p>
                    <p>
                      Anda telah melakukan pelanggaran batas maksimal (2 kali). Lembar jawaban dan catatan kecurangan Anda telah dikirimkan ke server pengawas untuk proses diskualifikasi.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-left bg-red-950/50 border-2 border-red-600/70 rounded-2xl p-4 shadow-[0_0_25px_rgba(220,38,38,0.25)]">
                    <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 animate-bounce" />
                      PERINGATAN TINGKAT TERTINGGI (SISA 1 KESEMPATAN):
                    </div>
                    <p className="text-slate-200 text-xs leading-relaxed">
                      Sistem Pengawas mendeteksi Anda **meninggalkan halaman ujian** (membuka aplikasi lain, beralih tab, atau membuka multitasking tray).
                    </p>
                    <div className="p-3 rounded-xl bg-red-900/60 border border-red-500/50 text-red-100 font-bold text-xs leading-snug">
                      ⚡ <strong>HUKUMAN MUTLAK:</strong> Jika Anda berpindah aplikasi, beralih tab, atau meminimalkan browser <strong>1 KALI LAGI</strong>, ujian akan <strong>SEKETIKA DIHENTIKAN, MENETAPKAN NILAI DISKUALIFIKASI (0), DAN AKUN ANDA DITANDAI SEBAGAI PELAKU KECURANGAN!</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Solemn Action Button */}
              {violationModalData.count < 2 ? (
                <button
                  type="button"
                  onClick={() => {
                    setViolationModalData(null);
                    deactivatePrivacyLockdown();
                    setIsWindowBlurred(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all transform active:scale-95 cursor-pointer min-h-[52px] border border-red-400"
                >
                  ⚔️ SAYA BERSUMPAH JUJUR & LANJUTKAN UJIAN (KESEMPATAN TERAKHIR)
                </button>
              ) : (
                <div className="w-full py-4 rounded-2xl bg-red-700 text-white font-black text-xs flex items-center justify-center gap-2 animate-pulse shadow-[0_0_30px_rgba(220,38,38,0.8)] border border-red-500">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  MEMPROSES DISKUALIFIKASI & MENGUMPULKAN JAWABAN...
                </div>
              )}
            </div>
          </div>
        )}

        {/* High-Alert Banner when 1 violation has already occurred */}
        {localCheatingCount === 1 && !isSubmitted && (
          <div className="p-4 rounded-2xl bg-red-500/15 border-2 border-red-500 text-red-600 dark:text-red-400 flex items-center gap-3 shadow-lg animate-pulse">
            <ShieldAlert className="w-6 h-6 shrink-0 text-red-500" />
            <div className="text-xs leading-tight">
              <span className="font-extrabold uppercase tracking-wide block text-red-600 dark:text-red-300">
                ⚠️ PERINGATAN KECURANGAN TERAKHIR (Pelanggaran: 1 / 2)
              </span>
              <span className="text-[11px] font-medium opacity-90">
                Alasan: {lastWarningReason || 'Fokus layar terputus'}. <strong>1 pelanggaran lagi</strong> (beralih aplikasi, tarik notifikasi, atau keluar layar penuh), ujian Anda akan <strong>otomatis dikumpulkan</strong>!
              </span>
            </div>
          </div>
        )}

        {/* Protected Active Exam Sheet Container */}
        <div id="exam-active-sheet" className="space-y-5 transition-all duration-200">
          {/* Top Header Bar - Focus Mode */}
          <div className={`p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200/80'}`}>
        <div>
          <h1 className={`text-base font-bold flex items-center gap-2 ${themeText}`}>
            <ShieldCheck className="w-5 h-5 text-slate-600" /> {exam.title}
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
          {localCheatingCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Pelanggaran: {localCheatingCount}/2</span>
            </div>
          )}

          <div className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold ${themeTextMuted}`}>
            <Save className={`w-3.5 h-3.5 ${isAutoSaved ? 'text-edu-sage' : 'text-slate-600 animate-pulse'}`} />
            {isAutoSaved ? 'Tersimpan' : 'Menyimpan...'}
          </div>

          {/* Material Quick Access Button in Top Bar if available */}
          {activeMaterial && (
            <button
              type="button"
              onClick={() => setShowMaterialModal(true)}
              style={{ backgroundColor: 'var(--theme-mint-light, #ECFDF5)', color: 'var(--theme-primary, #059669)', borderColor: 'var(--theme-border, #A7F3D0)' }}
              className="px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shadow-2xs"
              title="Buka Dokumen Materi Lengkap"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pop-up</span> Materi
            </button>
          )}

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
                      <button onClick={() => setTextSize('normal')} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${textSize === 'normal' ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}>A</button>
                      <button onClick={() => setTextSize('large')} className={`flex-1 py-1.5 rounded-md text-sm font-bold transition-all ${textSize === 'large' ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}>A</button>
                      <button onClick={() => setTextSize('xlarge')} className={`flex-1 py-1.5 rounded-md text-base font-bold transition-all ${textSize === 'xlarge' ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}>A</button>
                    </div>
                  </div>
                  <div>
                    <label className={`text-[10px] font-bold uppercase tracking-wider mb-2 block ${themeTextMuted}`}>Tema Tampilan</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                      <button onClick={() => setIsDarkMode(false)} className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-all ${!isDarkMode ? 'bg-white text-edu-butter shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}>
                        <Sun className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setIsDarkMode(true)} className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-all ${isDarkMode ? 'bg-slate-700 text-slate-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}>
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
            <Clock className="w-4 h-4 text-slate-600" />
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
                <div className="bg-slate-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
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
                  {/* Context banner for material-based questions */}
                  {isMaterialBased && activeMaterial && (
                    <div
                      style={{
                        backgroundColor: isDarkMode ? '#0F172A' : '#ECFDF5',
                        borderColor: isDarkMode ? '#334155' : 'var(--theme-border, #A7F3D0)'
                      }}
                      className="p-3.5 sm:p-4 rounded-2xl border-2 flex flex-wrap items-center justify-between gap-3 shadow-2xs"
                    >
                      {/* Left: icon + text */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-emerald-950 dark:text-emerald-300">
                            Soal ini Berdasarkan Materi: <span className="underline">{activeMaterial.title || 'Teks Pembelajaran'}</span>
                          </p>
                          <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400 font-medium">
                            Klik tombol pop-up untuk membaca materi rujukan secara utuh.
                          </p>
                        </div>
                      </div>
                      {/* Right: popup button only, no dropdown */}
                      <button
                        type="button"
                        onClick={() => setShowMaterialModal(true)}
                        style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
                        className="px-3.5 py-1.5 rounded-xl text-white text-xs font-black flex items-center gap-1.5 shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer shrink-0"
                        title="Buka Dokumen Materi Lengkap di Pop-up"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>📖 Buka Pop-up Materi</span>
                      </button>
                    </div>
                  )}



                  <p
                    className={`${textSizeClass} font-bold leading-relaxed transition-all ${themeText}`}
                    dangerouslySetInnerHTML={{ __html: formatRichText(sanitizeOrphanQuestionText(currentQuestion?.text, Boolean(activeMaterial))) }}
                  />

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
                          ? 'bg-slate-50 border-slate-500 text-slate-950 font-bold shadow-sm'
                          : `${themeOptionBox} font-medium`
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-slate-600 text-white' : themeOptionLabel
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
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-900 focus:outline-none focus:border-slate-600 transition-colors leading-relaxed font-medium select-text"
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
                    ? isDarkMode ? 'bg-amber-900/30 border-amber-700 text-edu-butter' : 'bg-amber-50 border-amber-300 text-amber-800'
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
              <div className="flex items-center gap-1.5 font-bold text-edu-sage">
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
                  btnStyle = 'border-2 border-slate-600 bg-slate-50 text-slate-700 font-black shadow-sm';
                } else if (isFlagged) {
                  btnStyle = isDarkMode ? 'bg-amber-900/30 border border-amber-700 text-edu-butter font-bold' : 'bg-amber-50 border border-amber-300 text-amber-800 font-bold';
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
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors min-h-[48px]"
              >
                Kembali ke Ujian
              </button>
              <button
                type="button"
                onClick={confirmSubmitExam}
                style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
                className="flex-1 py-3 rounded-xl text-white text-xs font-bold shadow-md transition-all hover:opacity-90 min-h-[48px]"
              >
                Selesaikan Ujian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Material Pop-up Modal (Supports Pure PDF Viewer & Extracted Text) */}
      {showMaterialModal && activeMaterial && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in-fast">
          <div className={`relative w-full max-w-5xl h-[88vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            {/* Modal Header */}
            <div className={`p-4 sm:p-5 border-b flex flex-wrap items-center justify-between gap-3 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base">Materi Rujukan Lengkap</h3>
                  <p className={`text-[11px] font-semibold ${themeTextMuted}`}>
                    {activeMaterial.title || 'Dokumen Pembelajaran'} {activeMaterial.fileType ? `(${activeMaterial.fileType})` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMaterialModal(false)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Pure PDF Iframe Viewer or Clean Extracted Text */}
            <div className="flex-1 overflow-hidden p-3 sm:p-5 flex flex-col bg-slate-100/50 dark:bg-slate-950/50">
              {(() => {
                const url = activeMaterial.fileUrl || '';
                const ftype = (activeMaterial.fileType || '').toLowerCase();
                // Detect PDF by fileType field OR by URL containing .pdf (before query params)
                const isPdf = ftype === 'pdf' || ftype.includes('pdf') ||
                  url.toLowerCase().split('?')[0].endsWith('.pdf');
                const hasUrl = url.startsWith('http') || url.startsWith('/');
                const hasText = (activeMaterial.extractedText || '').trim().length > 0;

                if (isPdf && hasUrl) {
                  return (
                    <iframe
                      src={url}
                      title="Dokumen Materi PDF Asli"
                      className="w-full h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white shadow-xs"
                      onError={() => {}}
                    />
                  );
                }

                if (hasText) {
                  return (
                    <div className={`p-6 sm:p-8 overflow-y-auto h-full rounded-2xl border shadow-xs leading-relaxed text-xs sm:text-sm ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
                      <div className="max-w-3xl mx-auto space-y-4">
                        <p className="whitespace-pre-line font-medium leading-loose" dangerouslySetInnerHTML={{ __html: formatRichText(activeMaterial.extractedText) }} />
                      </div>
                    </div>
                  );
                }

                // Fallback: no PDF, no text — but we have a URL for non-PDF file
                if (hasUrl) {
                  return (
                    <div className={`flex flex-col items-center justify-center h-full gap-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <BookOpen className="w-7 h-7" />
                      </div>
                      <div className="text-center">
                        <p className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          {activeMaterial.title || 'Dokumen Materi'}
                        </p>
                        <p className={`text-xs mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          File ini hanya bisa dibuka langsung di tab baru.
                        </p>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                        >
                          ↗ Buka Dokumen di Tab Baru
                        </a>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className={`flex items-center justify-center h-full rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <p className="text-sm font-semibold">Tidak ada konten materi yang tersedia.</p>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className={`p-3.5 sm:p-4 border-t flex items-center justify-between ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[11px] font-semibold ${themeTextMuted}`}>
                Gunakan scroll untuk membaca seluruh halaman materi
              </span>
              <button
                type="button"
                onClick={() => setShowMaterialModal(false)}
                style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
                className="px-6 py-2 rounded-xl text-white font-bold text-xs shadow-md transition-all hover:opacity-90 cursor-pointer"
              >
                Tutup & Lanjutkan Soal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
