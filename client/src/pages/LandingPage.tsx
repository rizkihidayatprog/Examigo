import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Upload, 
  Layers, 
  BarChart2, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Zap, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Users, 
  ChevronDown, 
  Download, 
  Play, 
  Pause, 
  Check, 
  X, 
  Bot, 
  Building2, 
  User, 
  Star, 
  Share2, 
  Cpu, 
  CheckCheck,
  FileText,
  CreditCard,
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import ExamigoLogo from '../components/common/ExamigoLogo';
import { processMidtransCheckout, checkMidtransPaymentStatus, loadMidtransSnap } from '../lib/payment';
import { applyDynamicTheme } from '../lib/theme';
import SEO from '../components/common/SEO';
import styles from '../styles/LandingPage.module.css';

const GoogleGIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

function GoogleReviewAvatar({ name, avatarUrl }: { name?: string; avatarUrl?: string }) {
  const [imgError, setImgError] = useState(false);
  const initial = (name?.charAt(0) || 'U').toUpperCase();
  const bgColors = ['#1A73E8', '#1E8E3E', '#F9AB00', '#D93025', '#9334E6', '#12B5CB'];
  const charCode = (name || 'U').charCodeAt(0);
  const bgColor = bgColors[charCode % bgColors.length];

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={name || 'Avatar'}
        onError={() => setImgError(true)}
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #FFFFFF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        backgroundColor: bgColor,
        color: '#FFFFFF',
        fontWeight: 800,
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}

function formatReviewDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return '';
  }
}

const TERMINAL_TELEMETRY_LOGS = [
  { code: 'OP-01', tag: 'SOAL', text: 'Ekstraksi modul ajar tuntas: 25 butir soal valid kunci jawaban', metric: '100% SIAP' },
  { code: 'OP-02', tag: 'PROKTOR', text: 'Ruang ujian aktif: 45 perangkat terkunci proteksi layar penuh', metric: '0 PELANGGARAN' },
  { code: 'OP-03', tag: 'KOREKSI', text: 'Koreksi instan selesai: distribusi nilai rapor terhitung seketika', metric: '0.4 DETIK' },
  { code: 'OP-04', tag: 'REKAP', text: 'Rekapitulasi kelas selesai: berkas nilai siap unduh ke Microsoft Excel', metric: 'EXPORT READY' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [examCodeInput, setExamCodeInput] = useState('');

  // Dynamic CTA Terminal Telemetry & Live Clock
  const [terminalLogIndex, setTerminalLogIndex] = useState<number>(0);
  const [terminalTime, setTerminalTime] = useState<string>('');
  const [terminalRoleTab, setTerminalRoleTab] = useState<'guru' | 'sekolah'>('guru');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTerminalTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const logTimer = setInterval(() => {
      setTerminalLogIndex((prev) => (prev + 1) % TERMINAL_TELEMETRY_LOGS.length);
    }, 3200);
    return () => clearInterval(logTimer);
  }, []);
  
  // Dynamic CMS Config State
  const [cmsConfig, setCmsConfig] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/public/landing-config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setCmsConfig(data.data);
          if (data.data.theme) {
            applyDynamicTheme(data.data.theme);
          }
        }
      })
      .catch(err => console.error('Failed to load CMS config, using defaults:', err));

    fetch('/api/public/testimonials')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setTestimonials(data.data);
        }
      })
      .catch(err => console.error('Failed to load testimonials:', err));
  }, []);

  // Interactive State
  const [activeDemoTab, setActiveDemoTab] = useState<'generator' | 'anticheat' | 'distribution' | 'grading'>('generator');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [selectedDemoOption, setSelectedDemoOption] = useState<number>(1); // Default to B (correct)
  const [activeNavQuestionDemo, setActiveNavQuestionDemo] = useState<number>(12);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Midtrans Payment Gateway Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<'PERSONAL' | 'PRO_AI' | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [paymentError, setPaymentError] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<string>('');

  const handleInitiateMidtransPayment = async (plan: 'PERSONAL' | 'PRO_AI') => {
    try {
      setSelectedPlan(plan);
      setPaymentError('');
      setVerificationStatus('');
      setIsProcessingPayment(true);
      setPaymentModalOpen(true);

      const result = await processMidtransCheckout(
        plan,
        'MONTHLY',
        {
          id: user?.id,
          email: user?.email || 'guest@examigo.com',
          name: user?.name || 'Guest User'
        }
      );

      setActiveOrder(result);

      if (result.snapToken) {
        await loadMidtransSnap(result.isProduction, result.clientKey);
        if (window.snap) {
          window.snap.pay(result.snapToken, {
            onSuccess: () => {
              setVerificationStatus('Pembayaran Lunas! Akun berhasil di-upgrade.');
              setTimeout(() => {
                setPaymentModalOpen(false);
                navigate('/dashboard');
              }, 1500);
            },
            onPending: () => {
              setVerificationStatus('Status: Menunggu Pembayaran. Silakan selesaikan transaksi.');
            },
            onError: () => {
              setPaymentError('Pembayaran gagal diproses melalui Midtrans.');
            },
            onClose: () => {
              handleVerifyMidtransStatus();
            }
          });
        }
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Gagal memulai transaksi Midtrans');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleVerifyMidtransStatus = async () => {
    if (!activeOrder?.orderId) return;
    try {
      setVerificationStatus('Memeriksa status pembayaran...');
      const statusRes = await checkMidtransPaymentStatus(activeOrder.orderId);
      if (statusRes.status === 'PAID') {
        setVerificationStatus('Pembayaran Lunas! Akun berhasil di-upgrade.');
        setTimeout(() => {
          setPaymentModalOpen(false);
          navigate('/dashboard');
        }, 1500);
      } else {
        setVerificationStatus('Status: Belum Terbayar (PENDING). Silakan selesaikan pembayaran.');
      }
    } catch (err) {
      setVerificationStatus('Gagal memeriksa status. Coba beberapa saat lagi.');
    }
  };

  // Auto-Slide Slideshow Timer (4.5 seconds per slide with dynamic loop)
  const [timerKey, setTimerKey] = useState<number>(0);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const tabList: ('generator' | 'anticheat' | 'distribution' | 'grading')[] = ['generator', 'anticheat', 'distribution', 'grading'];
    const timer = setInterval(() => {
      setActiveDemoTab((prev) => {
        const nextIdx = (tabList.indexOf(prev) + 1) % tabList.length;
        return tabList[nextIdx];
      });
      setTimerKey((k) => k + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, timerKey]);

  const handleManualTabClick = (tab: 'generator' | 'anticheat' | 'distribution' | 'grading') => {
    setActiveDemoTab(tab);
    setTimerKey((k) => k + 1);
  };

  const handleJoinExam = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = examCodeInput.trim().toUpperCase();
    if (!cleanCode) return;
    navigate(`/exam-room/${cleanCode}`);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'Bagaimana cara membuat butir soal dari materi saya?',
      a: 'Cukup unggah dokumen berupa PDF, Word, PowerPoint, atau foto lembar soal. Sistem membaca dan mengekstrak materi secara otomatis untuk menghasilkan variasi butir soal pilihan ganda, isian singkat, dan esai lengkap dengan kunci jawaban.',
    },
    {
      q: 'Apakah soal dan jawaban bisa diacak per peserta?',
      a: 'Ya! Fitur Exam Builder secara otomatis mengacak urutan butir soal serta urutan opsi A/B/C/D sehingga setiap siswa menerima susunan lembar ujian yang unik dan meminimalisir potensi contek.',
    },
    {
      q: 'Bagaimana cara kerja Anti-Cheat Mode?',
      a: 'Pada paket Pro, Ruang Ujian dilengkapi penguncian layar penuh (Fullscreen Lock) dan pendeteksi pindah tab. Jika siswa membuka aplikasi atau tab lain saat ujian berlangsung, sistem langsung mencatat peringatan dan mengunci lembar ujian.',
    },
    {
      q: 'Apakah bisa ekspor nilai langsung ke format Excel?',
      a: 'Tentu. Guru dapat mengunduh seluruh data rekapitulasi nilai peserta dalam format file Excel (.xlsx), CSV, maupun mencetak lembar rekapitulasi resmi dalam format PDF.',
    },
    {
      q: 'Apakah siswa perlu membuat akun untuk mengikuti ujian?',
      a: 'Tidak perlu. Siswa cukup memasukkan Kode Akses Ujian / memindai QR Code dari guru, lalu mengisi nama lengkap dan mulai mengerjakan ujian secara langsung.',
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      <SEO 
        title="Platform Pembuat Soal Ujian Online & CBT Anti-Contek"
        description="Examigo adalah platform pembuat soal ujian online dan CBT modern. Dilengkapi bank soal otomatis, sistem anti-contek, dan penilaian instan untuk guru dan sekolah."
        canonical="https://examigo.id/"
      />
      
      {/* 1. Navbar Header */}
      <header className={styles.navbar}>
        <div className={styles.navbarContainer}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <ExamigoLogo size="md" showText={true} showBadge={true} variant="light" />
          </Link>

          <nav className={styles.navLinks}>
            <a href="#fitur" className={styles.navLink}>Fitur</a>
            <a href="#cara-kerja" className={styles.navLink}>Alur Kerja</a>
            <a href="#target" className={styles.navLink}>Pengguna</a>
            {testimonials && testimonials.length > 0 && (
              <a href="#testimoni" className={styles.navLink}>Ulasan</a>
            )}
            <a href="#harga" className={styles.priceTagBadge}>Paket Harga</a>
            <a href="#faq" className={styles.navLink}>FAQ</a>
          </nav>

          <div className={styles.navActions}>
            {isAuthenticated ? (
              <Link to="/dashboard" className={styles.registerBtn}>
                <span>Buka Dashboard</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </Link>
            ) : (
              <>
                <Link to="/login" className={styles.loginBtn}>
                  Masuk
                </Link>
                <Link to="/register" className={styles.registerBtn}>
                  <span>Mulai Gratis</span>
                  <ArrowRight style={{ width: '14px', height: '14px' }} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className={styles.heroSection}>
        {/* Modern Architectural Grid Pattern & Ambient Glow (Zero GPU Glitch) */}
        <div className={styles.heroGridPattern} />
        <div className={styles.heroAmbientGlow} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
          <div className={styles.heroSplitGrid}>
            
            {/* Left Column: Headline, Copy, Actions */}
            <div className={styles.heroLeftCol}>
              {/* Headline */}
              <h1 className={styles.heroHeadlineSplit}>
                {cmsConfig?.hero?.headlineMain || 'Bikin Soal & Ujian Online'} <br />
                <span className={styles.heroHeadlineHighlight}>{cmsConfig?.hero?.headlineHighlight || '10x Lebih Cepat'}</span>
                <Sparkles className="inline w-6 h-6 ml-1.5 text-amber-400 align-middle" />
              </h1>

              {/* Subtitle */}
              <p className={styles.heroSubtitleSplit}>
                {cmsConfig?.hero?.subtitle || 'Unggah materi pelajaran (PDF, Word, PPTX, atau Foto). Otomatis meracik bank soal, mengacak nomor & opsi, mengunci layar anti-contek, serta menilai hasil siswa secara instan.'}
              </p>

              {/* Dual Conversion Engine */}
              <div className={styles.heroActionsSplit}>
                <Link to={isAuthenticated ? '/ai-generator' : '/register'} className={styles.primaryCtaBtn}>
                  <Sparkles style={{ width: '16px', height: '16px', color: 'var(--theme-mint-subtle, #D1FAE5)' }} />
                  <span>{cmsConfig?.hero?.primaryCtaText || 'Coba Generator Soal Gratis'}</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </Link>

                {/* Form Ikut Ujian Siswa */}
                <form onSubmit={handleJoinExam} className={styles.joinExamForm}>
                  <input
                    type="text"
                    value={examCodeInput}
                    onChange={(e) => setExamCodeInput(e.target.value)}
                    placeholder="KODE AKSES UJIAN..."
                    className={styles.joinExamInput}
                  />
                  <button type="submit" className={styles.joinExamSubmit}>
                    <span>Ikut Ujian</span>
                    <Play style={{ width: '14px', height: '14px', fill: 'currentColor' }} />
                  </button>
                </form>
              </div>

              {/* Trust Highlights */}
              <div className={styles.trustBadgeRowSplit}>
                <div className={styles.trustBadgeItem}>
                  <CheckCircle2 style={{ width: '15px', height: '15px', color: 'var(--theme-primary, #10B981)' }} /> Web & HP Friendly
                </div>
                <div className={styles.trustBadgeItem}>
                  <CheckCircle2 style={{ width: '15px', height: '15px', color: 'var(--theme-primary, #10B981)' }} /> Anti-Cheat Auto Save
                </div>
                <div className={styles.trustBadgeItem}>
                  <CheckCircle2 style={{ width: '15px', height: '15px', color: 'var(--theme-primary, #10B981)' }} /> Ekspor Rapih Excel & PDF
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live AI Mockup Card */}
            <div className={styles.heroRightCol}>
              <div className={styles.aiMockupCard}>
                
                {/* Mockup Header Bar */}
                <div className={styles.mockupHeader}>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-[11px] font-bold text-slate-400 ml-2">Examigo Smart Engine v2.4</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Ready
                  </div>
                </div>

                {/* File Upload Scanner Preview */}
                <div className={styles.mockupScannerBox}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">Modul_Fisika_Kelas_10.pdf</p>
                        <p className="text-[10px] text-slate-400 font-semibold">12 Halaman • 2.4 MB • Ekstraksi Otomatis</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                      100% Selesai
                    </span>
                  </div>

                  {/* Laser Scan Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden relative">
                    <div className={styles.scanProgressBar} />
                  </div>
                </div>

                {/* Generated Question Sample Preview */}
                <div className={styles.mockupQuestionCard}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black tracking-wider uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      Soal #1 • Pilihan Ganda
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Tingkat Kesulitan: Sedang</span>
                  </div>
                  
                  <p className="text-xs font-bold text-slate-100 leading-relaxed mb-3">
                    Sebuah mobil bermassa 1.200 kg melaju dengan kecepatan 20 m/s. Berapakah energi kinetik yang dimiliki mobil tersebut?
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-semibold">
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-700 text-white font-black flex items-center justify-center text-[10px]">A</span>
                      <span>120.000 Joule</span>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-black flex items-center justify-center text-[10px]">B</span>
                        <span className="font-bold">240.000 Joule</span>
                      </div>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-700 text-white font-black flex items-center justify-center text-[10px]">C</span>
                      <span>360.000 Joule</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-700 text-white font-black flex items-center justify-center text-[10px]">D</span>
                      <span>480.000 Joule</span>
                    </div>
                  </div>
                </div>

                {/* Live Floating Stat Mini Pills */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>20 Soal Teracik dalam 4.2 Detik</span>
                  </div>
                  <Link 
                    to={isAuthenticated ? '/ai-generator' : '/register'}
                    className="text-[11px] font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Coba Sekarang</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div>
            <span className={styles.statNumber}>10,000+</span>
            <span className={styles.statLabel}>Soal Berhasil Dibuat</span>
          </div>
          <div>
            <span className={styles.statNumber}>99.8%</span>
            <span className={styles.statLabel}>Akurasi Auto-Grading</span>
          </div>
          <div>
            <span className={styles.statNumber}>&lt; 2 Menit</span>
            <span className={styles.statLabel}>Bikin Ujian Lengkap</span>
          </div>
          <div>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statLabel}>Standar Kurikulum Nasional</span>
          </div>
        </div>
      </section>

      {/* 5. Comparison Section */}
      <section className={styles.comparisonSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Kenapa Pengajar Beralih ke Examigo?</h2>
          <p className={styles.sectionDesc}>Tinggalkan cara konvensional yang menyita waktu dan beralih ke otomatisasi cerdas.</p>
        </div>

        <div className={styles.comparisonGrid}>
          {/* Cara Manual */}
          <div className={styles.cardManual}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #FEE2E2', paddingBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                  <X style={{ width: '24px', height: '24px' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#DC2626' }}>Cara Manual Tradisional</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Proses lambat, rentan kesalahan, melelahkan</p>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '14px', color: '#334155', fontWeight: 600 }}>
                <li style={{ display: 'flex', gap: '10px' }}><X style={{ width: '16px', height: '16px', color: '#DC2626', flexShrink: 0, marginTop: '2px' }} /> <span><strong>Mengetik soal dari awal:</strong> Menghabiskan 3-4 jam hanya untuk menyusun 30 butir soal ulangan harian.</span></li>
                <li style={{ display: 'flex', gap: '10px' }}><X style={{ width: '16px', height: '16px', color: '#DC2626', flexShrink: 0, marginTop: '2px' }} /> <span><strong>Rawan kecurangan:</strong> Urutan soal sama untuk semua siswa, mudah saling contek.</span></li>
                <li style={{ display: 'flex', gap: '10px' }}><X style={{ width: '16px', height: '16px', color: '#DC2626', flexShrink: 0, marginTop: '2px' }} /> <span><strong>Koreksi lembar jawaban manual:</strong> Guru harus menghabiskan malam hari mengoreksi ratusan lembar jawaban.</span></li>
                <li style={{ display: 'flex', gap: '10px' }}><X style={{ width: '16px', height: '16px', color: '#DC2626', flexShrink: 0, marginTop: '2px' }} /> <span><strong>Bank soal berantakan:</strong> Arsip tercecer di berbagai flashdisk dan dokumen Word tanpa kategori.</span></li>
              </ul>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: '12px', background: '#FEF2F2', color: '#B91C1C', fontSize: '12px', fontWeight: 700, textAlign: 'center', border: '1px solid #FECACA' }}>
              Waktu terbuang rata-rata: <strong style={{ color: '#991B1B' }}>5-6 Jam per ujian</strong>
            </div>
          </div>

          {/* Solusi Examigo */}
          <div className={styles.cardExamigo}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--theme-mint-light, #ECFDF5)', paddingBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--theme-mint-subtle, #D1FAE5)', color: 'var(--theme-primary, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                  <CheckCircle2 style={{ width: '24px', height: '24px' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'var(--theme-primary-dark, #064E3B)' }}>Dengan Platform Examigo</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--theme-primary, #059669)', fontWeight: 700 }}>10x Lebih Cepat, Otomatis & Terstruktur</p>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '14px', color: 'var(--theme-primary-dark, #064E3B)', fontWeight: 700 }}>
                <li style={{ display: 'flex', gap: '10px' }}><Check style={{ width: '16px', height: '16px', color: 'var(--theme-primary, #059669)', flexShrink: 0, marginTop: '2px' }} /> <span><strong>Ekstraksi materi kilat:</strong> Cukup upload PDF/Word/Foto materi, sistem membuat soal komprehensif dalam hitungan detik.</span></li>
                <li style={{ display: 'flex', gap: '10px' }}><Check style={{ width: '16px', height: '16px', color: 'var(--theme-primary, #059669)', flexShrink: 0, marginTop: '2px' }} /> <span><strong>Anti-Cheat otomatis:</strong> Sistem otomatis mengacak nomor soal & opsi A/B/C/D per siswa serta mengunci layar.</span></li>
                <li style={{ display: 'flex', gap: '10px' }}><Check style={{ width: '16px', height: '16px', color: 'var(--theme-primary, #059669)', flexShrink: 0, marginTop: '2px' }} /> <span><strong>Auto-Grading instan:</strong> Nilai PG & koreksi esai langsung terbit begitu siswa selesai submit.</span></li>
                <li style={{ display: 'flex', gap: '10px' }}><Check style={{ width: '16px', height: '16px', color: 'var(--theme-primary, #059669)', flexShrink: 0, marginTop: '2px' }} /> <span><strong>Bank soal rapi & ekspor Excel:</strong> Tersimpan terpusat dengan filter mata pelajaran dan siap download ke Excel/PDF.</span></li>
              </ul>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--theme-mint-light, #ECFDF5)', color: 'var(--theme-primary-dark, #065F46)', fontSize: '12px', fontWeight: 700, textAlign: 'center', border: '1px solid var(--theme-border, #A7F3D0)' }}>
              Waktu pengerjaan efisien: <strong style={{ color: 'var(--theme-text-muted, #047857)', fontSize: '14px' }}>&lt; 2 Menit selesai</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 6 & 7. Split-Screen Interactive Product Showcase (No Grid Cards) */}
      <section id="fitur" className={styles.showcaseSection}>
        <span id="cara-kerja" style={{ display: 'block', position: 'relative', top: '-90px', visibility: 'hidden' }} />
        <div className={styles.sectionHeader} style={{ marginBottom: '3rem' }}>
          <h2 className={styles.sectionTitle}>Satu Sistem Utuh dari Soal Hingga Rapor</h2>
          <p className={styles.sectionDesc}>Tanpa ribet bikin kisi-kisi manual, tanpa repot mengoreksi satu per satu. Klik tahapan di bawah untuk melihat simulasinya secara nyata.</p>
        </div>

        <div 
          className={styles.splitShowcase}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Left: Minimalist Feature & Workflow Navigation */}
          <div className={styles.showcaseNavList}>
            {/* Nav 1: Generator */}
            <div 
              onClick={() => handleManualTabClick('generator')}
              className={`${styles.showcaseNavItem} ${activeDemoTab === 'generator' ? styles.showcaseNavItemActive : ''}`}
              role="button"
              tabIndex={0}
            >
              <span className={styles.navItemIndex}>01</span>
              <div className={styles.navItemContent}>
                <div className={styles.navItemTitleRow}>
                  <span className={styles.navItemTitle}>Generator Soal Silabus</span>
                </div>
                <p className={styles.navItemDesc}>
                  Unggah modul PDF, Word, PPT, atau foto soal fisik. Butir soal HOTS dan kunci jawaban tersusun instan.
                </p>
              </div>
              {activeDemoTab === 'generator' && (
                <div key={`generator-${timerKey}`} className={styles.navItemProgressBar} />
              )}
            </div>

            {/* Nav 2: Anti-Cheat Guard */}
            <div 
              onClick={() => handleManualTabClick('anticheat')}
              className={`${styles.showcaseNavItem} ${activeDemoTab === 'anticheat' ? styles.showcaseNavItemActive : ''}`}
              role="button"
              tabIndex={0}
            >
              <span className={styles.navItemIndex}>02</span>
              <div className={styles.navItemContent}>
                <div className={styles.navItemTitleRow}>
                  <span className={styles.navItemTitle}>Anti-Cheat Guard</span>
                </div>
                <p className={styles.navItemDesc}>
                  Kunci layar penuh otomatis, deteksi pindah tab & screenshot, serta auto-save berkala real-time.
                </p>
              </div>
              {activeDemoTab === 'anticheat' && (
                <div key={`anticheat-${timerKey}`} className={styles.navItemProgressBar} />
              )}
            </div>

            {/* Nav 3: Distribusi Kode Akses & QR */}
            <div 
              onClick={() => handleManualTabClick('distribution')}
              className={`${styles.showcaseNavItem} ${activeDemoTab === 'distribution' ? styles.showcaseNavItemActive : ''}`}
              role="button"
              tabIndex={0}
            >
              <span className={styles.navItemIndex}>03</span>
              <div className={styles.navItemContent}>
                <div className={styles.navItemTitleRow}>
                  <span className={styles.navItemTitle}>Distribusi Kode Akses & QR</span>
                </div>
                <p className={styles.navItemDesc}>
                  Siswa langsung bergabung lewat browser smartphone atau laptop tanpa perlu registrasi akun.
                </p>
              </div>
              {activeDemoTab === 'distribution' && (
                <div key={`distribution-${timerKey}`} className={styles.navItemProgressBar} />
              )}
            </div>

            {/* Nav 4: Koreksi Otomatis & Rekap */}
            <div 
              onClick={() => handleManualTabClick('grading')}
              className={`${styles.showcaseNavItem} ${activeDemoTab === 'grading' ? styles.showcaseNavItemActive : ''}`}
              role="button"
              tabIndex={0}
            >
              <span className={styles.navItemIndex}>04</span>
              <div className={styles.navItemContent}>
                <div className={styles.navItemTitleRow}>
                  <span className={styles.navItemTitle}>Koreksi Otomatis & Excel</span>
                </div>
                <p className={styles.navItemDesc}>
                  Koreksi seketika saat submit. Dapatkan analitik daya beda dan unduh berkas rekap nilai format .xlsx resmi.
                </p>
              </div>
              {activeDemoTab === 'grading' && (
                <div key={`grading-${timerKey}`} className={styles.navItemProgressBar} />
              )}
            </div>
          </div>

          {/* Right: Single Sleek Dynamic Monitor Frame */}
          <div className={styles.showcaseMonitorFrame}>
            {/* Window Bar */}
            <div className={styles.monitorWindowBar}>
              <div className={styles.windowDots}>
                <span className={styles.dotRed} />
                <span className={styles.dotYellow} />
                <span className={styles.dotGreen} />
              </div>
              <div className={styles.windowAddressBar}>
                {activeDemoTab === 'generator' && 'examigo.id/app/generator?doc=modul_biologi.pdf'}
                {activeDemoTab === 'anticheat' && 'examigo.id/exam/room?mode=proctor_secure'}
                {activeDemoTab === 'distribution' && 'examigo.id/exam/share?code=892410'}
                {activeDemoTab === 'grading' && 'examigo.id/reports/rekap_nilai_sma.xlsx'}
              </div>
              <div className={styles.windowLiveBadge}>
                <span className={styles.livePulseDot} />
                <span>
                  {activeDemoTab === 'generator' && 'Ekstraksi Selesai'}
                  {activeDemoTab === 'anticheat' && 'Ruang Terproteksi'}
                  {activeDemoTab === 'distribution' && '36 Siswa Masuk'}
                  {activeDemoTab === 'grading' && '100% Terkoreksi'}
                </span>
              </div>
            </div>

            {/* Monitor Content Area */}
            <div className={styles.monitorContent}>
              {/* Screen 1: Generator */}
              {activeDemoTab === 'generator' && (
                <div key="generator" className={styles.monitorScreenFade}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8125rem', color: '#E2E8F0', fontWeight: 600 }}>
                      <FileText style={{ width: '16px', height: '16px', color: '#10B981' }} />
                      <span>Modul_Biologi_Sel_SMA.pdf</span>
                      <span style={{ fontSize: '0.6875rem', color: '#64748B' }}>1.4 MB</span>
                    </div>
                    <span style={{ fontSize: '0.6875rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '0.25rem 0.625rem', borderRadius: '6px', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      20 Butir Soal Terkompilasi
                    </span>
                  </div>

                  <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Soal No. 1 • Pilihan Ganda (HOTS)</span>
                      <span style={{ fontSize: '0.6875rem', color: '#10B981', fontWeight: 700 }}>Tingkat: C4 Analisis</span>
                    </div>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', lineHeight: 1.6, color: '#F1F5F9', fontWeight: 500 }}>
                      Bagian nefron ginjal yang berfungsi utama untuk proses filtrasi darah sehingga menghasilkan filtrat glomerulus (urine primer) adalah...
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', padding: '0.625rem 0.875rem', borderRadius: '8px', background: '#1E293B', color: '#94A3B8' }}>
                        <span style={{ fontWeight: 700, width: '24px' }}>A.</span> Tubulus Kontortus Proksimal
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.875rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#FFFFFF', fontWeight: 600 }}>
                        <div><span style={{ fontWeight: 700, width: '24px', color: '#34D399' }}>B.</span> Glomerulus & Kapsula Bowman</div>
                        <span style={{ fontSize: '0.6875rem', color: '#34D399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check style={{ width: '12px', height: '12px' }} /> Kunci Valid
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', padding: '0.625rem 0.875rem', borderRadius: '8px', background: '#1E293B', color: '#94A3B8' }}>
                        <span style={{ fontWeight: 700, width: '24px' }}>C.</span> Lengkung Henle Asendens
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8' }}>
                    <span>Kompatibel: Dokumen, Slide PPT, & Foto Lembar Soal</span>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>Proses: ±15 Detik</span>
                  </div>
                </div>
              )}

              {/* Screen 2: Anti-Cheat */}
              {activeDemoTab === 'anticheat' && (
                <div key="anticheat" className={styles.monitorScreenFade}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8125rem', color: '#E2E8F0', fontWeight: 600 }}>
                      <ShieldCheck style={{ width: '18px', height: '18px', color: '#10B981' }} />
                      <span>Proctor Guardian Engine</span>
                    </div>
                    <span style={{ fontSize: '0.6875rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '0.25rem 0.625rem', borderRadius: '6px', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      Status: Terkunci & Diawasi
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '10px', padding: '0.875rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.6875rem', color: '#94A3B8', marginBottom: '4px' }}>Layar Penuh</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#34D399' }}>Terkunci 100%</div>
                    </div>
                    <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '10px', padding: '0.875rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.6875rem', color: '#94A3B8', marginBottom: '4px' }}>Pindah Tab</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#F1F5F9' }}>0 Terdeteksi</div>
                    </div>
                    <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '10px', padding: '0.875rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.6875rem', color: '#94A3B8', marginBottom: '4px' }}>Auto-Save</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#34D399' }}>Real-Time Sync</div>
                    </div>
                  </div>

                  <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#E2E8F0', fontWeight: 600 }}>Tampilan Lembar Peserta (Ujian Berlangsung)</span>
                      <span style={{ fontSize: '0.6875rem', fontFamily: 'monospace', background: '#1E293B', padding: '2px 8px', borderRadius: '4px', color: '#F59E0B' }}>
                        Sisa: 42:18
                      </span>
                    </div>
                    <div style={{ background: '#1E293B', borderRadius: '8px', padding: '0.875rem', fontSize: '0.75rem', color: '#94A3B8', borderLeft: '3px solid #F59E0B', lineHeight: 1.6 }}>
                      <strong style={{ color: '#F8FAFC' }}>Kebijakan Integritas:</strong> Siswa yang keluar dari mode layar penuh atau membuka tab/aplikasi lain otomatis menerima peringatan proktor dan tercatat pada berita acara pengawasan.
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8' }}>
                    <span>Anti-Inspect Element & Blokir Copy-Paste</span>
                    <span style={{ color: '#34D399', fontWeight: 700 }}>Standar Evaluasi Resmi</span>
                  </div>
                </div>
              )}

              {/* Screen 3: Distribution */}
              {activeDemoTab === 'distribution' && (
                <div key="distribution" className={styles.monitorScreenFade}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8125rem', color: '#E2E8F0', fontWeight: 600 }}>
                      <Share2 style={{ width: '16px', height: '16px', color: '#10B981' }} />
                      <span>Gerbang Masuk Peserta</span>
                    </div>
                    <span style={{ fontSize: '0.6875rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '0.25rem 0.625rem', borderRadius: '6px', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      Room ID: #BIO-SMA1
                    </span>
                  </div>

                  <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.6875rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Kode Akses 6-Digit Siswa</span>
                    <div style={{ fontSize: '2.25rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '0.25em', color: '#10B981', margin: '0.5rem 0 0.75rem 0' }}>
                      892 410
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                      Atau bagikan tautan langsung: <span style={{ color: '#38BDF8', fontFamily: 'monospace' }}>examigo.id/join/892410</span>
                    </p>
                  </div>

                  <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#E2E8F0', fontWeight: 600 }}>Peserta Tergabung di Ruang Tunggu</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34D399' }}>36 / 36 Siswa</span>
                    </div>
                    <div style={{ background: '#1E293B', height: '8px', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: '#10B981' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748B', marginTop: '0.5rem' }}>
                      <span>Siap Dimulai Bersama</span>
                      <span>Mendukung Android, iOS, Windows, Mac</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8' }}>
                    <span>Tanpa Registrasi Akun Bagi Siswa</span>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>Tinggal Masuk & Kerjakan</span>
                  </div>
                </div>
              )}

              {/* Screen 4: Grading & Reports */}
              {activeDemoTab === 'grading' && (
                <div key="grading" className={styles.monitorScreenFade}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8125rem', color: '#E2E8F0', fontWeight: 600 }}>
                      <BarChart2 style={{ width: '16px', height: '16px', color: '#10B981' }} />
                      <span>Hasil Rekapitulasi & Analitik</span>
                    </div>
                    <span style={{ fontSize: '0.6875rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '0.25rem 0.625rem', borderRadius: '6px', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      100% Selesai Dinilai
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                    <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', padding: '1.25rem' }}>
                      <span style={{ fontSize: '0.6875rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Rata-rata Nilai Kelas</span>
                      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10B981', lineHeight: 1.1, marginTop: '4px' }}>
                        88.5 <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>/ 100</span>
                      </div>
                      <span style={{ fontSize: '0.6875rem', color: '#34D399', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                        ✓ 35 dari 36 Siswa Lulus KKM (75.0)
                      </span>
                    </div>
                    <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: '#94A3B8' }}>Nilai Tertinggi</span>
                        <span style={{ fontWeight: 700, color: '#F8FAFC' }}>98.0</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: '#94A3B8' }}>Nilai Terendah</span>
                        <span style={{ fontWeight: 700, color: '#F8FAFC' }}>72.5</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: '#94A3B8' }}>Durasi Rerata</span>
                        <span style={{ fontWeight: 700, color: '#F8FAFC' }}>34 Menit</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <FileText style={{ width: '20px', height: '20px', color: '#10B981' }} />
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#F8FAFC' }}>Rekap_Nilai_Biologi_XI_IPA_1.xlsx</div>
                        <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Format resmi siap setor kurikulum sekolah</div>
                      </div>
                    </div>
                    <span style={{ background: '#10B981', color: '#064E3B', padding: '0.375rem 0.875rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Download style={{ width: '14px', height: '14px' }} /> 1-Klik Unduh
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8' }}>
                    <span>Koreksi Otomatis Pilihan Ganda & Analisis Butir</span>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>Format Excel & PDF</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Target Persona ("Untuk Siapa" - Direct & To the Point) */}
      <section id="target" className={styles.personaSection}>
        <div className={styles.sectionHeader} style={{ marginBottom: '3rem' }}>
          <h2 className={styles.sectionTitle}>Untuk Siapa Saja Examigo Dibuat?</h2>
          <p className={styles.sectionDesc}>Solusi praktis dan terpadu bagi setiap penyelenggara evaluasi belajar.</p>
        </div>

        <div className={styles.personaDirectGrid}>
          {/* 1. Guru & Dosen */}
          <div className={styles.personaDirectCard}>
            <div className={styles.personaDirectIconBox}>
              <GraduationCap style={{ width: '22px', height: '22px', color: '#059669' }} />
            </div>
            <h3 className={styles.personaDirectTitle}>Guru & Dosen</h3>
            <p className={styles.personaDirectDesc}>
              Ulangan harian, tugas mandiri, dan kuis kelas tanpa lembur ketik naskah soal.
            </p>
            <ul className={styles.personaDirectList}>
              <li className={styles.personaDirectItem}>
                <Check className={styles.personaDirectCheck} />
                <span>Buat soal otomatis dari modul & silabus</span>
              </li>
              <li className={styles.personaDirectItem}>
                <Check className={styles.personaDirectCheck} />
                <span>Siswa ujian langsung via browser HP / laptop</span>
              </li>
              <li className={styles.personaDirectItem}>
                <Check className={styles.personaDirectCheck} />
                <span>Nilai terkoreksi instan & siap ekspor ke rapor</span>
              </li>
            </ul>
          </div>

          {/* 2. Sekolah & Kampus */}
          <div className={styles.personaDirectCard}>
            <div className={styles.personaDirectIconBox}>
              <BookOpen style={{ width: '22px', height: '22px', color: '#059669' }} />
            </div>
            <h3 className={styles.personaDirectTitle}>Sekolah & Kampus</h3>
            <p className={styles.personaDirectDesc}>
              Standarisasi UTS, UAS, dan ujian kelulusan mandiri dengan proteksi proktor ketat.
            </p>
            <ul className={styles.personaDirectList}>
              <li className={styles.personaDirectItem}>
                <Check className={styles.personaDirectCheck} />
                <span>Bank soal institusi terpadu antarguru</span>
              </li>
              <li className={styles.personaDirectItem}>
                <Check className={styles.personaDirectCheck} />
                <span>Proteksi layar penuh & deteksi pindah tab</span>
              </li>
              <li className={styles.personaDirectItem}>
                <Check className={styles.personaDirectCheck} />
                <span>Hemat 100% anggaran fotokopi & lembar kertas</span>
              </li>
            </ul>
          </div>

          {/* 3. Bimbel & Kursus */}
          <div className={styles.personaDirectCard}>
            <div className={styles.personaDirectIconBox}>
              <Users style={{ width: '22px', height: '22px', color: '#059669' }} />
            </div>
            <h3 className={styles.personaDirectTitle}>Bimbel & Kursus</h3>
            <p className={styles.personaDirectDesc}>
              Simulasi tryout akbar skala ribuan siswa serentak dengan ranking otomatis.
            </p>
            <ul className={styles.personaDirectList}>
              <li className={styles.personaDirectItem}>
                <Check className={styles.personaDirectCheck} />
                <span>Kapasitas ribuan peserta pengerjaan serentak</span>
              </li>
              <li className={styles.personaDirectItem}>
                <Check className={styles.personaDirectCheck} />
                <span>Leaderboard skor langsung seketika submit</span>
              </li>
              <li className={styles.personaDirectItem}>
                <Check className={styles.personaDirectCheck} />
                <span>Analisis daya beda butir soal & topik remedial</span>
              </li>
            </ul>
          </div>

          {/* 4. HRD & Perusahaan */}
          <div className={styles.personaDirectCard}>
            <div className={styles.personaDirectIconBox}>
              <Building2 style={{ width: '22px', height: '22px', color: '#059669' }} />
            </div>
            <h3 className={styles.personaDirectTitle}>HRD & Perusahaan</h3>
            <p className={styles.personaDirectDesc}>
              Tes seleksi calon pegawai baru dan asesmen kompetensi pelatihan internal.
            </p>
            <ul className={styles.personaDirectList}>
              <li className={styles.personaDirectItem}>
                <Check className={styles.personaDirectCheck} />
                <span>Uji kompetensi objektif tanpa instalasi aplikasi</span>
              </li>
              <li className={styles.personaDirectItem}>
                <Check className={styles.personaDirectCheck} />
                <span>Audit log kecurangan & validasi integritas</span>
              </li>
              <li className={styles.personaDirectItem}>
                <Check className={styles.personaDirectCheck} />
                <span>Penerbitan rekap hasil & sertifikat otomatis</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8.5. Testimonials & 5-Star Reviews (Google / Verified Review Style) */}
      {testimonials && testimonials.length > 0 && (
        <section
          id="testimoni"
          style={{
            padding: '5.5rem 1.5rem',
            backgroundColor: 'var(--theme-bg, #F0FDF4)',
            borderTop: '1px solid var(--theme-border, #A7F3D0)',
          }}
        >
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Dipercaya Ribuan Guru & Institusi di Indonesia</h2>
            <p className={styles.sectionDesc}>
              Simak pengalaman langsung para pendidik yang telah merevolusi proses evaluasi belajar bersama Examigo.
            </p>
          </div>

          <div
            style={{
              maxWidth: testimonials.length === 1 ? '580px' : testimonials.length === 2 ? '880px' : '1140px',
              margin: '0 auto',
              display: testimonials.length === 1 ? 'block' : 'grid',
              gridTemplateColumns: testimonials.length === 1 ? undefined : 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {testimonials.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  border: '1.5px solid var(--theme-border, #A7F3D0)',
                  boxShadow: '0 10px 30px -5px rgba(6, 78, 59, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  position: 'relative',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Top: Profile Header with Avatar, Name, Role & Google Badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <GoogleReviewAvatar name={item.userName} avatarUrl={item.userAvatar} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--theme-primary-dark, #064E3B)' }}>
                          {item.userName}
                        </h4>
                        <span
                          title="Pendidik Terverifikasi"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: '#1D9BF0',
                            color: '#FFFFFF',
                            fontSize: '10px',
                            fontWeight: 900,
                            flexShrink: 0,
                          }}
                        >
                          <Check style={{ width: '10px', height: '10px', strokeWidth: 3 }} />
                        </span>
                      </div>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--theme-text-muted, #047857)', fontWeight: 600 }}>
                        {item.userRole || 'Pendidik'} {item.createdAt ? `• ${formatReviewDate(item.createdAt)}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Star Rating row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          style={{
                            width: '17px',
                            height: '17px',
                            fill: '#FBBC04',
                            color: '#FBBC04',
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B', marginLeft: '2px' }}>
                      5.0
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: 'var(--theme-primary, #059669)',
                      background: 'var(--theme-mint-light, #ECFDF5)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      border: '1px solid var(--theme-border, #A7F3D0)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCircle2 style={{ width: '13px', height: '13px', color: 'var(--theme-primary, #059669)' }} />
                    Terverifikasi
                  </span>
                </div>

                {/* Message quote */}
                <p
                  style={{
                    fontSize: '14.5px',
                    lineHeight: 1.7,
                    color: '#334155',
                    fontWeight: 500,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  "{item.message}"
                </p>

                {/* Footer note */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '0.75rem',
                    fontSize: '11px',
                    color: '#94A3B8',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCheck style={{ width: '14px', height: '14px', color: '#10B981' }} />
                    Ulasan Asli Guru di Examigo
                  </span>
                  <span style={{ color: '#64748B' }}>5/5 Bintang</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Pricing Section */}
      <section id="harga" className={styles.pricingSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Investasi Hemat, Transparan & Fleksibel</h2>
          <p className={styles.sectionDesc}>Pilih paket yang paling sesuai dengan kebutuhan kelas atau institusi Anda.</p>
        </div>

        <div className={styles.pricingGrid}>
          {/* Free */}
          <div className={styles.pricingCard}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ padding: '0.375rem 0.75rem', borderRadius: '9999px', background: 'var(--theme-mint-light, var(--theme-mint-light, #ECFDF5))', color: 'var(--theme-primary, var(--theme-primary-dark, #065F46))', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', alignSelf: 'flex-start' }}>
                {cmsConfig?.pricing?.free?.badge || 'Paket Dasar'}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--theme-primary-dark, var(--theme-primary-dark, #064E3B))', margin: 0 }}>
                {cmsConfig?.pricing?.free?.name || 'Free'}
              </h3>
              <div className={styles.priceAmount}>
                Rp {cmsConfig?.pricing?.free?.monthlyPrice !== undefined ? cmsConfig.pricing.free.monthlyPrice.toLocaleString('id-ID') : '0'}{' '}
                <span style={{ fontSize: '12px', color: 'var(--theme-text-muted, var(--theme-text-muted, #047857))' }}>/bln</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--theme-border, var(--theme-border, #A7F3D0))', margin: 0 }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '13px', color: 'var(--theme-text-body, var(--theme-primary-dark, #065F46))', fontWeight: 600 }}>
                <li>• Maks. <strong>{cmsConfig?.pricing?.free?.maxParticipants || 5} Peserta Ujian</strong></li>
                <li>• Maks. <strong>{cmsConfig?.pricing?.free?.maxActiveExams || 1} Ujian Aktif</strong></li>
                <li>• Maks. <strong>{cmsConfig?.pricing?.free?.maxAiQuestions || 15} Butir</strong> Bank Soal</li>
                <li>• Input Soal Manual</li>
                <li>• Auto-Grading PG</li>
                <li style={{ color: 'var(--theme-border, var(--theme-border, #A7F3D0))', textDecoration: 'line-through' }}>• Tanpa Anti-Cheat & Ekstraksi Dokumen</li>
              </ul>
            </div>
            <Link to="/register" style={{ padding: '0.875rem', borderRadius: '14px', background: 'var(--theme-primary-dark, var(--theme-primary-dark, #064E3B))', color: '#fff', fontSize: '13px', fontWeight: 900, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              Mulai Gratis
            </Link>
          </div>

          {/* Personal */}
          <div className={styles.pricingCard}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ padding: '0.375rem 0.75rem', borderRadius: '9999px', background: 'var(--theme-mint-light, var(--theme-mint-light, #ECFDF5))', color: 'var(--theme-primary, var(--theme-primary, #059669))', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', alignSelf: 'flex-start' }}>
                {cmsConfig?.pricing?.personal?.badge || 'Guru Mandiri'}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--theme-primary-dark, var(--theme-primary-dark, #064E3B))', margin: 0 }}>
                {cmsConfig?.pricing?.personal?.name || 'Personal'}
              </h3>
              <div className={styles.priceAmount}>
                Rp {cmsConfig?.pricing?.personal?.monthlyPrice ? (cmsConfig.pricing.personal.monthlyPrice / 1000) + 'K' : '49K'}{' '}
                <span style={{ fontSize: '12px', color: 'var(--theme-text-muted, var(--theme-text-muted, #047857))' }}>/bln</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--theme-border, var(--theme-border, #A7F3D0))', margin: 0 }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '13px', color: 'var(--theme-primary-dark, var(--theme-primary-dark, #064E3B))', fontWeight: 700 }}>
                <li>• <strong>{cmsConfig?.pricing?.personal?.maxAiQuestions || 100} Butir Soal</strong> /bln</li>
                <li>• Maks. <strong>{cmsConfig?.pricing?.personal?.maxParticipants || 50} Peserta Ujian</strong></li>
                <li>• Maks. <strong>{cmsConfig?.pricing?.personal?.maxActiveExams || 5} Ujian Aktif</strong></li>
                <li>• Upload PDF/Word/PPT</li>
                <li>• Acak Soal & Pilihan</li>
                <li>• Basic Anti-Cheat Mode</li>
                <li>• Export Excel & CSV</li>
              </ul>
            </div>
            <Link
              to={isAuthenticated ? "/checkout?plan=personal&billing=monthly" : "/register?redirect=checkout&plan=personal&billing=monthly"}
              style={{ padding: '0.875rem', borderRadius: '14px', background: 'var(--theme-primary, var(--theme-primary, #059669))', color: '#fff', fontSize: '13px', fontWeight: 900, textAlign: 'center', textDecoration: 'none', display: 'block' }}
            >
              Pilih Personal (Rp {cmsConfig?.pricing?.personal?.monthlyPrice ? (cmsConfig.pricing.personal.monthlyPrice / 1000) + 'K' : '49K'})
            </Link>
          </div>

          {/* Pro */}
          <div className={styles.pricingCardPro}>
            <div className={styles.popularBadge}>
              <Sparkles style={{ width: '14px', height: '14px', fill: 'currentColor' }} /> PALING POPULER
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>
              <span style={{ padding: '0.375rem 0.75rem', borderRadius: '9999px', background: 'var(--theme-mint-light, var(--theme-mint-light, #ECFDF5))', color: 'var(--theme-primary-dark, var(--theme-primary-dark, #064E3B))', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', border: '1px solid var(--theme-mint, var(--theme-primary, #10B981))', alignSelf: 'flex-start' }}>
                {cmsConfig?.pricing?.pro_ai?.badge || 'Sekolah & Bimbel'}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--theme-primary-dark, var(--theme-primary-dark, #064E3B))', margin: 0 }}>
                {cmsConfig?.pricing?.pro_ai?.name || 'Pro'}
              </h3>
              <div className={styles.priceAmount}>
                Rp {cmsConfig?.pricing?.pro_ai?.monthlyPrice ? (cmsConfig.pricing.pro_ai.monthlyPrice / 1000) + 'K' : '149K'}{' '}
                <span style={{ fontSize: '12px', color: 'var(--theme-text-muted, var(--theme-text-muted, #047857))' }}>/bln</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--theme-border, var(--theme-border, #A7F3D0))', margin: 0 }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '13px', color: 'var(--theme-primary-dark, var(--theme-primary-dark, #064E3B))', fontWeight: 800 }}>
                <li>• <strong>{cmsConfig?.pricing?.pro_ai?.maxAiQuestions || 300} Butir Soal</strong> /bln</li>
                <li>• Maks. <strong>{cmsConfig?.pricing?.pro_ai?.maxParticipants || 200} Peserta Ujian</strong></li>
                <li>• Maks. <strong>{cmsConfig?.pricing?.pro_ai?.maxActiveExams || 15} Ujian Aktif</strong></li>
                <li>• Koreksi Esai & Scan Foto Soal</li>
                <li>• Fullscreen Lock Anti-Cheat</li>
                <li>• Ekspor PDF & 3 Akses Guru</li>
              </ul>
            </div>
            <Link
              to={isAuthenticated ? "/checkout?plan=pro_ai&billing=monthly" : "/register?redirect=checkout&plan=pro_ai&billing=monthly"}
              style={{ padding: '0.875rem', borderRadius: '14px', background: 'var(--theme-mint, var(--theme-primary, #10B981))', color: '#FFFFFF', fontSize: '13px', fontWeight: 900, textAlign: 'center', textDecoration: 'none', display: 'block', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}
            >
              Pilih Paket Pro (Rp {cmsConfig?.pricing?.pro_ai?.monthlyPrice ? (cmsConfig.pricing.pro_ai.monthlyPrice / 1000) + 'K' : '149K'})
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FAQ Accordion */}
      <section id="faq" className={styles.faqSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Tanya Jawab Seputar Examigo</h2>
          <p className={styles.sectionDesc}>Semua hal yang perlu Anda ketahui tentang kemudahan penggunaan platform Examigo.</p>
        </div>

        <div className={styles.faqContainer}>
          {(cmsConfig?.faqs && cmsConfig.faqs.length > 0 ? cmsConfig.faqs : faqs).map((faq: any, idx: number) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => toggleFaq(idx)}
                className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
              >
                <div className={styles.faqQuestionRow}>
                  <span>{faq.q}</span>
                  <ChevronDown style={{ width: '20px', height: '20px', color: 'var(--theme-primary, #059669)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </div>
                {isOpen && (
                  <p className={styles.faqAnswer}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. Operational Action Terminal (Anti-Mainstream Command Strip) */}
      <section className={styles.ctaTerminalSection}>
        <div className={styles.ctaTerminalContainer}>
          <div className={styles.terminalLeftCol}>
            <div className={styles.terminalStatusRow}>
              <span className={styles.terminalLiveDot} />
              <span>SISTEM SIAP DIGUNAKAN • SERVER NORMAL</span>
              {terminalTime && <span className={styles.terminalClockBadge}>• {terminalTime}</span>}
            </div>
            <h2 className={styles.terminalTitle}>
              Mulai Evaluasi Digital Tanpa Kertas Hari Ini.
            </h2>
            <p className={styles.terminalDesc}>
              Unggah materi ajar, amankan ruang ujian dari kecurangan, dan unduh nilai format rapor resmi dalam satu alur kerja terpadu.
            </p>

            {/* Dynamic Real-time Telemetry Feed */}
            <div className={styles.terminalTelemetryFeed}>
              <div className={styles.terminalTelemetryBar}>
                <div className={styles.terminalTelemetryLeft}>
                  <span className={styles.terminalFeedDot} />
                  <span className={styles.terminalFeedLabel}>AKTIVITAS REAL-TIME:</span>
                  <span className={styles.terminalFeedTag}>[{TERMINAL_TELEMETRY_LOGS[terminalLogIndex].tag}]</span>
                  <span className={styles.terminalFeedText}>{TERMINAL_TELEMETRY_LOGS[terminalLogIndex].text}</span>
                </div>
                <span className={styles.terminalFeedMetric}>{TERMINAL_TELEMETRY_LOGS[terminalLogIndex].metric}</span>
              </div>
            </div>

            <div className={styles.terminalSpecsRow}>
              <div className={styles.terminalSpecItem}>
                <span className={styles.terminalSpecNumber}>01</span>
                <span>Tanpa Instalasi Aplikasi</span>
              </div>
              <div className={styles.terminalSpecItem}>
                <span className={styles.terminalSpecNumber}>02</span>
                <span>Proteksi Layar Penuh</span>
              </div>
              <div className={styles.terminalSpecItem}>
                <span className={styles.terminalSpecNumber}>03</span>
                <span>Rekap Excel Seketika</span>
              </div>
            </div>
          </div>

          <div className={styles.terminalRightCol}>
            <div className={styles.terminalActionBox}>
              <div className={styles.terminalActionHeader}>
                <span>Gerbang Akses Cepat</span>
                <span style={{ color: '#10B981', fontFamily: 'monospace' }}>● AKTIF</span>
              </div>

              {/* Interactive Role Switcher */}
              <div className={styles.terminalRoleTabs}>
                <button
                  type="button"
                  onClick={() => setTerminalRoleTab('guru')}
                  className={terminalRoleTab === 'guru' ? styles.terminalRoleTabActive : styles.terminalRoleTab}
                >
                  Untuk Guru
                </button>
                <button
                  type="button"
                  onClick={() => setTerminalRoleTab('sekolah')}
                  className={terminalRoleTab === 'sekolah' ? styles.terminalRoleTabActive : styles.terminalRoleTab}
                >
                  Untuk Sekolah
                </button>
              </div>

              {/* Dynamic Benefits Checklist */}
              <div className={styles.terminalBenefitList}>
                {terminalRoleTab === 'guru' ? (
                  <>
                    <div className={styles.terminalBenefitItem}>
                      <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10B981', flexShrink: 0 }} />
                      <span>Gratis 50 siswa per sesi evaluasi</span>
                    </div>
                    <div className={styles.terminalBenefitItem}>
                      <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10B981', flexShrink: 0 }} />
                      <span>Ekstraksi soal dari PDF / dokumen</span>
                    </div>
                    <div className={styles.terminalBenefitItem}>
                      <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10B981', flexShrink: 0 }} />
                      <span>Koreksi instan & rekap nilai Excel rapor</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.terminalBenefitItem}>
                      <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10B981', flexShrink: 0 }} />
                      <span>Skalabilitas 1.000+ siswa serentak tanpa drop</span>
                    </div>
                    <div className={styles.terminalBenefitItem}>
                      <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10B981', flexShrink: 0 }} />
                      <span>Bank soal institusi terenkripsi & aman</span>
                    </div>
                    <div className={styles.terminalBenefitItem}>
                      <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10B981', flexShrink: 0 }} />
                      <span>Pemantauan proktor lintas ruang ujian</span>
                    </div>
                  </>
                )}
              </div>

              <div className={styles.terminalButtonStack}>
                <Link to="/register" className={styles.terminalPrimaryBtn}>
                  <span>Daftar Akun Pengajar Gratis</span>
                  <ArrowRight style={{ width: '18px', height: '18px' }} />
                </Link>
                <Link to="/login" className={styles.terminalSecondaryBtn}>
                  <span>Masuk ke Dashboard Guru</span>
                </Link>
              </div>

              <div className={styles.terminalGuarantees}>
                <span>✓ Tanpa Kartu Kredit</span>
                <span>•</span>
                <span>✓ Akses Browser</span>
                <span>•</span>
                <span>✓ Siap 2 Menit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ExamigoLogo size="sm" showText={true} variant="dark" />
            <span style={{ color: 'var(--theme-text-muted, #047857)', fontWeight: 600 }}>© 2026 Examigo. All rights reserved. Platform Ujian Online Indonesia.</span>
          </div>

          <div className={styles.footerLinks}>
            <Link to="/login">Masuk</Link>
            <Link to="/register">Daftar</Link>
            <a href="#fitur">Fitur</a>
            <a href="#harga">Harga</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>
      </footer>

      {/* 13. Midtrans Payment Gateway Modal */}
      {paymentModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(6,78,59,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(6,78,59,0.3)', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid var(--theme-border, #A7F3D0)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--theme-mint-light, #ECFDF5)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--theme-primary-dark, #064E3B)', color: '#fff', fontWeight: 900, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  M
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 900, color: 'var(--theme-primary-dark, #064E3B)' }}>Midtrans Payment Gateway</h3>
                  <p style={{ margin: 0, fontSize: '10px', color: 'var(--theme-text-muted, #047857)', fontWeight: 600 }}>Sistem Pembayaran Instan QRIS, VA & E-Wallet</p>
                </div>
              </div>
              <button 
                onClick={() => setPaymentModalOpen(false)}
                style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--theme-mint-light, #ECFDF5)', border: 'none', color: 'var(--theme-primary-dark, #064E3B)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
              >
                <X style={{ width: '14px', height: '14px' }} />
              </button>
            </div>

            {/* Content Body */}
            {isProcessingPayment ? (
              <div style={{ padding: '2.5rem 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', border: '3px solid var(--theme-primary, #059669)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <p style={{ fontSize: '12px', fontWeight: 800, color: 'var(--theme-primary-dark, #064E3B)', margin: 0 }}>Menghubungkan ke Midtrans Gateway...</p>
              </div>
            ) : paymentError ? (
              <div style={{ padding: '1rem', borderRadius: '12px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.5rem 0' }}>{paymentError}</p>
                <button 
                  onClick={() => handleInitiateMidtransPayment(selectedPlan || 'PERSONAL')}
                  style={{ padding: '0.375rem 1rem', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Coba Lagi
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '12px' }}>
                
                {/* Order Summary */}
                <div style={{ padding: '1rem', borderRadius: '14px', background: 'var(--theme-bg, #F0FDF4)', border: '1px solid var(--theme-border, #A7F3D0)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--theme-text-muted, #047857)' }}>
                    <span>Paket Dipilih</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--theme-primary-dark, #064E3B)', fontWeight: 800 }}>
                      {selectedPlan === 'PRO_AI' ? (
                        <>
                          <Sparkles style={{ width: '13px', height: '13px', color: 'var(--theme-primary, #059669)' }} />
                          Paket Pro
                        </>
                      ) : (
                        <>
                          <User style={{ width: '13px', height: '13px', color: 'var(--theme-primary, #059669)' }} />
                          Personal
                        </>
                      )}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--theme-text-muted, #047857)' }}>
                    <span>Total Tagihan</span>
                    <strong style={{ color: 'var(--theme-primary-dark, #064E3B)', fontSize: '16px' }}>
                      {selectedPlan === 'PRO_AI' ? 'Rp 149.000' : 'Rp 49.000'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--theme-primary, #059669)', borderTop: '1px solid var(--theme-border, #A7F3D0)', paddingTop: '0.5rem' }}>
                    <span>Order ID</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--theme-primary-dark, #064E3B)', fontWeight: 700 }}>{activeOrder?.orderId}</span>
                  </div>
                </div>

                {/* Status Message */}
                {verificationStatus && (
                  <div style={{ padding: '0.75rem', borderRadius: '10px', fontSize: '12px', fontWeight: 700, textAlign: 'center', background: verificationStatus.includes('Lunas') ? 'var(--theme-mint-light, #ECFDF5)' : '#FFFBEB', color: verificationStatus.includes('Lunas') ? 'var(--theme-primary-dark, #065F46)' : '#92400E', border: verificationStatus.includes('Lunas') ? '1px solid var(--theme-border, #A7F3D0)' : '1px solid #FDE68A' }}>
                    {verificationStatus}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {activeOrder?.snapToken && (
                    <button
                      onClick={async () => {
                        await loadMidtransSnap(activeOrder?.isProduction, activeOrder?.clientKey);
                        if (window.snap) {
                          window.snap.pay(activeOrder.snapToken, {
                            onSuccess: () => {
                              setVerificationStatus('Pembayaran Lunas! Akun berhasil di-upgrade.');
                              setTimeout(() => {
                                setPaymentModalOpen(false);
                                navigate('/dashboard');
                              }, 1500);
                            },
                            onPending: () => {
                              setVerificationStatus('Status: Menunggu Pembayaran. Silakan selesaikan transaksi.');
                            },
                            onError: () => {
                              setPaymentError('Pembayaran gagal diproses melalui Midtrans.');
                            },
                            onClose: () => {
                              handleVerifyMidtransStatus();
                            }
                          });
                        } else if (activeOrder?.paymentUrl) {
                          window.open(activeOrder.paymentUrl, '_blank');
                        }
                      }}
                      style={{ padding: '0.875rem', borderRadius: '12px', background: 'linear-gradient(to right, var(--theme-primary-dark, #064E3B), var(--theme-primary, #10B981))', color: '#fff', fontWeight: 900, fontSize: '12px', textAlign: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <CreditCard style={{ width: '15px', height: '15px' }} />
                      <span>Buka Pop-up Pembayaran Midtrans</span>
                    </button>
                  )}

                  {activeOrder?.paymentUrl && (
                    <a
                      href={activeOrder.paymentUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: '0.625rem', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#334155', fontWeight: 800, fontSize: '11px', textAlign: 'center', textDecoration: 'none', display: 'block' }}
                    >
                      ↗ Buka Link Pembayaran di Tab Baru
                    </a>
                  )}

                  <button
                    onClick={handleVerifyMidtransStatus}
                    style={{ padding: '0.625rem', borderRadius: '12px', background: 'var(--theme-mint-light, #ECFDF5)', border: '1px solid var(--theme-border, #A7F3D0)', color: 'var(--theme-primary-dark, #064E3B)', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <RefreshCw style={{ width: '14px', height: '14px' }} />
                    <span>Cek Status Pembayaran</span>
                  </button>
                </div>

              </div>
            )}

            <div style={{ textAlign: 'center', borderTop: '1px solid var(--theme-mint-light, #ECFDF5)', paddingTop: '0.5rem', fontSize: '10px', color: 'var(--theme-text-muted, #047857)', fontWeight: 600 }}>
              Powered by Midtrans Payment Gateway • Transaksi Aman & Terenkripsi
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
