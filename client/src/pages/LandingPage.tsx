import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Upload, 
  HelpCircle, 
  Layers, 
  BarChart2, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Zap, 
  FileText, 
  Award, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Users, 
  ChevronDown, 
  Download, 
  Play,
  Pause,
  RefreshCw,
  Sliders,
  Check,
  X,
  Bot,
  Building2,
  User,
  Star,
  Share2,
  MonitorSmartphone,
  Trophy
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import ExamigoLogo from '../components/common/ExamigoLogo';
import { processPakasirCheckout, checkPakasirPaymentStatus } from '../lib/payment';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [examCodeInput, setExamCodeInput] = useState('');
  
  // Interactive State
  const [activeDemoTab, setActiveDemoTab] = useState<'generator' | 'builder' | 'exam' | 'analytics'>('generator');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [selectedDemoOption, setSelectedDemoOption] = useState<number>(0); // 0 = A, 1 = B, 2 = C, 3 = D
  const [activeNavQuestionDemo, setActiveNavQuestionDemo] = useState<number>(12);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Pakasir Payment Gateway Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<'PERSONAL' | 'PRO_AI' | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [paymentError, setPaymentError] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<string>('');

  const handleInitiatePakasirPayment = async (plan: 'PERSONAL' | 'PRO_AI') => {
    try {
      setSelectedPlan(plan);
      setPaymentError('');
      setVerificationStatus('');
      setIsProcessingPayment(true);
      setPaymentModalOpen(true);

      const result = await processPakasirCheckout(plan, 'MONTHLY', user || { id: '', email: 'pengajar@examigo.com', name: 'Pengajar Examigo' });
      setActiveOrder(result);
    } catch (err: any) {
      setPaymentError(err.message || 'Gagal memproses sesi pembayaran Pakasir');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleVerifyPakasirStatus = async () => {
    if (!activeOrder?.orderId) return;
    try {
      setVerificationStatus('Memeriksa status pembayaran di Pakasir...');
      const res = await checkPakasirPaymentStatus(activeOrder.orderId);
      if (res.status === 'PAID') {
        setVerificationStatus('🎉 Pembayaran Lunas! Akun berhasil di-upgrade.');
      } else {
        setVerificationStatus('Status saat ini: Belum dibayar (Pending). Silakan selesaikan pembayaran.');
      }
    } catch (err: any) {
      setVerificationStatus('Gagal mengecek status pembayaran.');
    }
  };

  // Auto-play slideshow timer for demo tabs (changes every 4 seconds)
  useEffect(() => {
    if (!isAutoPlaying) return;

    const tabs: Array<'generator' | 'builder' | 'exam' | 'analytics'> = ['generator', 'builder', 'exam', 'analytics'];
    const timer = setInterval(() => {
      setActiveDemoTab((prev) => {
        const currIndex = tabs.indexOf(prev);
        const nextIndex = (currIndex + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleManualTabClick = (tab: 'generator' | 'builder' | 'exam' | 'analytics') => {
    setActiveDemoTab(tab);
    setIsAutoPlaying(false); // Pause auto play when user clicks manually
  };

  const handleJoinExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examCodeInput.trim()) return;
    const cleanCode = examCodeInput.trim().toUpperCase();
    navigate(`/exam-room/${cleanCode}`);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'Apakah butuh instalasi aplikasi?',
      a: 'Tidak. Langsung diakses dari browser HP, Tablet, atau Laptop.'
    },
    {
      q: 'Format file apa yang didukung AI?',
      a: 'PDF, DOCX (Word), PPT (PowerPoint), TXT, dan Foto/Gambar materi.'
    },
    {
      q: 'Bagaimana pencegahan kecurangan?',
      a: 'Acak urutan soal, acak pilihan A/B/C/D, Fullscreen Mode, & deteksi pindah tab.'
    },
    {
      q: 'Apakah hasil ujian bisa di-export ke Excel?',
      a: 'Bisa. Tersedia format Excel (.xlsx), CSV, dan PDF siap cetak.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. Navbar Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/">
            <ExamigoLogo size="md" showText={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-600">
            <a href="#fitur" className="hover:text-indigo-600 transition-colors">Fitur Utama</a>
            <a href="#demo" className="hover:text-indigo-600 transition-colors">Simulasi Demo</a>
            <a href="#cara-kerja" className="hover:text-indigo-600 transition-colors">Cara Kerja</a>
            <a href="#harga" className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-100 hover:bg-indigo-100 transition-all">Paket Harga</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/"
                className="saas-button-primary px-4 py-2 text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 transition-all"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="saas-button-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span>Daftar Gratis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section - Vector Icons Only */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-100/60 to-transparent pointer-events-none -z-10 rounded-full blur-3xl opacity-70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Online Exam Builder Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Buat Soal & Ujian Online <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">10x Lebih Cepat</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 font-semibold max-w-xl mx-auto">
              Upload materi (PDF/Word/PPT/Foto). AI membaca materi, membuatkan soal, mengacak pilihan, dan menilai otomatis.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={isAuthenticated ? '/ai-generator' : '/register'}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
                <span>Coba AI Generator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Form Ikut Ujian */}
              <form onSubmit={handleJoinExam} className="w-full sm:w-auto flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-300 shadow-xs">
                <input
                  type="text"
                  value={examCodeInput}
                  onChange={(e) => setExamCodeInput(e.target.value)}
                  placeholder="Kode Ujian..."
                  className="px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none uppercase w-32 tracking-wider"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                >
                  <span>Ikut Ujian</span>
                  <Play className="w-3 h-3 fill-current" />
                </button>
              </form>
            </div>

            {/* Concise Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tanpa Instalasi
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tanpa Kartu Kredit
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Support HP & Laptop
              </div>
            </div>
          </div>

          {/* 3. Interactive Demo Preview Card with Auto-Play & Live Click Events */}
          <div id="demo" className="mt-10 lg:mt-12 max-w-4xl mx-auto">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-3 relative group">
              
              {/* Tab Selector Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 ml-1 hidden sm:inline">examigo.app/demo</span>
                  
                  {/* Auto-Play Toggle Indicator */}
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] flex items-center gap-1 transition-all"
                  >
                    {isAutoPlaying ? (
                      <>
                        <Pause className="w-3 h-3 text-indigo-600" />
                        <span className="text-indigo-700">Auto-Slide ON</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-slate-500" />
                        <span>Manual</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
                  <button
                    onClick={() => handleManualTabClick('generator')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeDemoTab === 'generator' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>1. AI Generator</span>
                  </button>

                  <button
                    onClick={() => handleManualTabClick('builder')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeDemoTab === 'builder' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>2. Exam Builder</span>
                  </button>

                  <button
                    onClick={() => handleManualTabClick('exam')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeDemoTab === 'exam' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>3. Ruang Ujian</span>
                  </button>

                  <button
                    onClick={() => handleManualTabClick('analytics')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeDemoTab === 'analytics' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BarChart2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>4. Analitik</span>
                  </button>
                </div>
              </div>

              {/* Tab Display Screen */}
              <div className="p-4 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 min-h-[310px] text-xs font-sans">
                
                {/* TAB 1: AI GENERATOR */}
                {activeDemoTab === 'generator' && (
                  <div className="space-y-4 animate-fade-in-fast">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">Modul_Fisika_SMA_Bab3.pdf</span>
                          <span className="text-[11px] text-slate-500 font-medium">Ukuran: 2.4 MB • 15 Halaman • 10 Soal Ter-generate</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> AI Vision Active
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Soal #1 (Pilihan Ganda)
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">Tingkat SEDANG</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">5 Poin</span>
                        </div>
                      </div>

                      <p className="font-bold text-slate-900 text-xs sm:text-sm leading-relaxed">
                        Berdasarkan Hukum II Newton (F = m × a), jika gaya net total F yang bekerja pada benda bermassa m dilipatgandakan menjadi 2F, maka percepatan a benda akan menjadi...
                      </p>

                      {/* Interactive Clickable Options */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-semibold block">Klik opsi di bawah untuk mencoba simulasi jawaban:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {[
                            { code: 'A', text: '2 kali percepatan semula (Jawaban Kunci AI)', isCorrect: true },
                            { code: 'B', text: '1/2 kali percepatan semula', isCorrect: false },
                            { code: 'C', text: 'Tetap tidak berubah', isCorrect: false },
                            { code: 'D', text: '4 kali percepatan semula', isCorrect: false },
                          ].map((opt, idx) => {
                            const isSelected = selectedDemoOption === idx;
                            return (
                              <button
                                key={opt.code}
                                onClick={() => setSelectedDemoOption(idx)}
                                className={`p-2.5 rounded-lg border text-left font-bold transition-all flex items-center justify-between cursor-pointer ${
                                  isSelected
                                    ? opt.isCorrect
                                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-2xs'
                                      : 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-2xs'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span>{opt.code}. {opt.text}</span>
                                {opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 font-medium flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">Penjelasan Kunci Jawaban AI:</strong> Menurut persamaan a = F / m, percepatan a berbanding lurus secara linier dengan gaya total F. Sehingga jika F menjadi 2F, percepatan a ikut naik 2x lipat.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: EXAM BUILDER */}
                {activeDemoTab === 'builder' && (
                  <div className="space-y-4 animate-fade-in-fast">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">Ujian Akhir Semester Fisika X</span>
                        <span className="text-[11px] text-slate-500 font-medium">Kode Akses Ujian: <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono font-bold text-slate-900">EXAM-FIS2026</code></span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-xs">
                        30 Soal Terpilih (Total 100 Poin)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="text-slate-400 font-medium block text-[10px]">Durasi Ujian</span>
                        <span className="font-bold text-slate-900">60 Menit</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="text-slate-400 font-medium block text-[10px]">Batas Nilai KKM</span>
                        <span className="font-bold text-slate-900">75 / 100</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="text-slate-400 font-medium block text-[10px]">Acak Urutan Soal</span>
                        <span className="font-extrabold text-emerald-600">✓ AKTIF</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="text-slate-400 font-medium block text-[10px]">Acak Opsi A,B,C,D</span>
                        <span className="font-extrabold text-emerald-600">✓ AKTIF</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Daftar Soal Dalam Ujian Ini:</span>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>1. Hukum II Newton (Pilihan Ganda - 5 Poin)</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">Pilihan Ganda</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>2. Analisis Grafik Usaha dan Energi (Essay - 15 Poin)</span>
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px]">AI Essay</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: RUANG UJIAN */}
                {activeDemoTab === 'exam' && (
                  <div className="space-y-4 animate-fade-in-fast">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <div>
                          <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">Ruang Ujian Online (Student Mode)</span>
                          <span className="text-[11px] text-slate-500 font-medium">Status: Fullscreen Lock Active • Auto Save On</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> 45:12 Sisa Waktu
                      </span>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-700">Soal {activeNavQuestionDemo} dari 30</span>
                        <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Jawaban Tersimpan Otomatis
                        </span>
                      </div>

                      <p className="font-bold text-slate-900 text-xs sm:text-sm">
                        {activeNavQuestionDemo === 12 
                          ? 'Berapakah usaha total yang dilakukan pada benda bermassa 2 kg yang berpindah sejauh 5 meter dengan percepatan 3 m/s²?'
                          : `Pertanyaan simulasi nomor ${activeNavQuestionDemo}: Manakah berikut yang merupakan besaran turunan dalam Satuan Internasional (SI)?`}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        <span className="text-[11px] font-bold text-slate-500 mr-2">Klik Navigasi Soal:</span>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                          <button
                            key={num}
                            onClick={() => setActiveNavQuestionDemo(num)}
                            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] transition-all cursor-pointer ${
                              activeNavQuestionDemo === num
                                ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 scale-110'
                                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                        <span className="text-slate-400 text-[10px] ml-1">... 30</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: ANALITIK */}
                {activeDemoTab === 'analytics' && (
                  <div className="space-y-4 animate-fade-in-fast">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-slate-400 font-bold block text-[10px]">Total Peserta</span>
                        <span className="text-xl font-black text-slate-900">142</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-slate-400 font-bold block text-[10px]">Rata-Rata Nilai</span>
                        <span className="text-xl font-black text-indigo-600">86.4</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-slate-400 font-bold block text-[10px]">Tingkat Kelulusan</span>
                        <span className="text-xl font-black text-emerald-600">94.2%</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-slate-400 font-bold block text-[10px]">Kecepatan Grading</span>
                        <span className="text-xl font-black text-purple-600">Instan</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>Distribusi Skor Nilai Peserta</span>
                        <span className="text-indigo-600">Laporan Rekap XLS / CSV Ready</span>
                      </div>

                      <div className="space-y-2 pt-1">
                        <div>
                          <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                            <span>Sangat Baik (Nilai 85 - 100)</span>
                            <span>65% Peserta (92 Siswa)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full w-[65%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                            <span>Baik / Lulus KKM (Nilai 75 - 84)</span>
                            <span>29% Peserta (41 Siswa)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full w-[29%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. Stat Ringkas */}
      <section className="py-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-slate-600">
          <div><span className="text-2xl font-black text-slate-900 block">10,000+</span> Soal AI Di-generate</div>
          <div><span className="text-2xl font-black text-indigo-600 block">99.8%</span> Akurasi Auto-Grading</div>
          <div><span className="text-2xl font-black text-slate-900 block">&lt; 2 Menit</span> Bikin Ujian</div>
          <div><span className="text-2xl font-black text-emerald-600 block">100%</span> Sesuai Kurikulum</div>
        </div>
      </section>

      {/* 5. Poin Perbandingan Ringkas Vector Icons */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase">Mengapa Examigo?</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Perbandingan Cara Kerja</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
            {/* Cara Manual */}
            <div className="p-6 rounded-2xl bg-white border border-red-200 space-y-3 shadow-2xs">
              <h3 className="font-extrabold text-red-600 text-sm border-b pb-2 flex items-center gap-2">
                <X className="w-4 h-4 text-red-600" /> Cara Manual Tradisional
              </h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-red-500 shrink-0" /> Ketik soal satu per satu (butuh berjam-jam)</li>
                <li className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-red-500 shrink-0" /> Sulit bikin variasi (rawan menyontek)</li>
                <li className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-red-500 shrink-0" /> Koreksi lembar jawaban manual per siswa</li>
                <li className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-red-500 shrink-0" /> File bank soal tercecer & berantakan</li>
              </ul>
            </div>

            {/* Solusi Examigo */}
            <div className="p-6 rounded-2xl bg-white border border-indigo-200 space-y-3 shadow-2xs">
              <h3 className="font-extrabold text-emerald-600 text-sm border-b pb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Solusi Cerdas Examigo (AI)
              </h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-center gap-2 text-indigo-900 font-bold"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> AI buat soal dari PDF/Word/Foto dalam 10 detik</li>
                <li className="flex items-center gap-2 text-indigo-900 font-bold"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Acak Otomatis urutan soal & pilihan A,B,C,D</li>
                <li className="flex items-center gap-2 text-indigo-900 font-bold"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Auto-Grading instan untuk PG & Essay</li>
                <li className="flex items-center gap-2 text-indigo-900 font-bold"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Bank Soal terpusat rapi & mudah dicari</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Fitur Poin Vector Icons */}
      <section id="fitur" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase">Fitur Ringkas</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Segala Fitur Ujian Dalam 1 Tempat</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">AI Question Generator</h4>
              <ul className="space-y-1 text-slate-600 font-medium">
                <li>• Generasi PG, Essay, & Isian</li>
                <li>• Ekstraksi Teks PDF, Word, PPT</li>
                <li>• AI Vision (Baca foto/diagram)</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Bank Soal Terorganisir</h4>
              <ul className="space-y-1 text-slate-600 font-medium">
                <li>• Filter Mapel, Kelas, & Kesulitan</li>
                <li>• Simbol Matematika & Sains</li>
                <li>• Pratinjau Detail Soal (Eye Icon)</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Exam Builder</h4>
              <ul className="space-y-1 text-slate-600 font-medium">
                <li>• Acak Otomatis Soal & Jawaban</li>
                <li>• Buat Kode Akses Ujian Unik</li>
                <li>• Atur Durasi & Nilai KKM</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Anti-Kecurangan (Anti-Cheat)</h4>
              <ul className="space-y-1 text-slate-600 font-medium">
                <li>• Mode Layar Penuh (Fullscreen)</li>
                <li>• Deteksi Pindah Tab / Aplikasi</li>
                <li>• Auto Save Jawaban Peserta</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Auto-Grading & Analitik</h4>
              <ul className="space-y-1 text-slate-600 font-medium">
                <li>• Penilaian PG & Essay Otomatis</li>
                <li>• Grafik Distribusi Skor & Rata-rata</li>
                <li>• Reviewer Jawaban Siswa</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                <Download className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Export Data Rekap</h4>
              <ul className="space-y-1 text-slate-600 font-medium">
                <li>• Unduh Nilai ke Format Excel</li>
                <li>• Ekspor CSV murni tanpa %</li>
                <li>• Cetak Laporan PDF</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Alur 4 Langkah Ringkas */}
      <section id="cara-kerja" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase">Alur Kerja</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">4 Langkah Mudah</h2>
          </div>

          <div className="relative mt-8">
            {/* Background connecting line for desktop */}
            <div className="hidden lg:block absolute top-24 left-16 right-16 h-0.5 bg-gradient-to-r from-blue-100 via-indigo-200 to-emerald-100 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
              {/* Step 1 */}
              <div className="group relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-5 -right-5 w-14 h-14 bg-white text-indigo-600 font-black text-2xl rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all z-20">
                  1
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-colors duration-300">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Upload Materi</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Unggah file PDF, PPT, Word, atau ketik langsung materi pengajaran Anda.
                </p>
              </div>

              {/* Step 2 */}
              <div className="group relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-5 -right-5 w-14 h-14 bg-white text-indigo-600 font-black text-2xl rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all z-20">
                  2
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 text-fuchsia-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:from-fuchsia-600 group-hover:to-fuchsia-700 group-hover:text-white transition-colors duration-300">
                  <Bot className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">AI Generate Soal</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Sistem AI kami membaca konteks materi dan otomatis membuat soal berkualitas dalam hitungan detik.
                </p>
              </div>

              {/* Step 3 */}
              <div className="group relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-5 -right-5 w-14 h-14 bg-white text-indigo-600 font-black text-2xl rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all z-20">
                  3
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:from-amber-600 group-hover:to-amber-700 group-hover:text-white transition-colors duration-300">
                  <Share2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Publikasi Ujian</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Dapatkan <strong className="text-slate-700">Kode Akses Ujian</strong> dan bagikan langsung ke kelas atau murid Anda secara instan.
                </p>
              </div>

              {/* Step 4 */}
              <div className="group relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-5 -right-5 w-14 h-14 bg-white text-indigo-600 font-black text-2xl rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all z-20">
                  4
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:from-emerald-600 group-hover:to-emerald-700 group-hover:text-white transition-colors duration-300">
                  <BarChart2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Auto-Grading</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Skor akhir dan laporan analisis tingkat kesulitan soal keluar secara *real-time*.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Target Pengguna Vector Icons */}
      <section id="target" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase">Pengguna</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Cocok Untuk Siapa Saja?</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-slate-800 text-center">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col items-center justify-center">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
              <p>Guru & Dosen</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <p>Sekolah & Kampus</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
              <p>Bimbel & Kursus</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col items-center justify-center">
              <Building2 className="w-6 h-6 text-emerald-600" />
              <p>HRD & Perusahaan</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Pricing Section Vector Icons */}
      <section id="harga" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase">Paket Harga</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Pilihan Paket Transparan</h2>
          </div>

          {/* 4 Cards Vector Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            
            {/* Free */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 flex flex-col justify-between shadow-2xs">
              <div className="space-y-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                  <Zap className="w-3 h-3 text-slate-500" /> Paket Dasar
                </span>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-slate-600" /> Free
                </h3>
                <div className="text-2xl font-black text-slate-900">Rp 0 <span className="text-xs font-normal text-slate-400">/bln</span></div>
                <hr className="border-slate-100" />
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <li>• Maks. <strong>5 Peserta</strong></li>
                  <li>• Maks. <strong>1 Ujian</strong></li>
                  <li>• Maks. <strong>15 Soal</strong> Bank Soal</li>
                  <li>• Buat Soal Manual</li>
                  <li>• Auto-Grading PG</li>
                  <li className="text-slate-400 line-through">• Tanpa Anti-Cheat & AI</li>
                </ul>
              </div>
              <Link to="/register" className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center block">Mulai Gratis</Link>
            </div>

            {/* Personal */}
            <div className="p-5 rounded-2xl bg-white border border-indigo-200 space-y-4 flex flex-col justify-between shadow-2xs">
              <div className="space-y-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                  <User className="w-3 h-3 text-blue-600" /> Pengajar Mandiri
                </span>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" /> Personal
                </h3>
                <div className="text-2xl font-black text-slate-900">Rp 49K <span className="text-xs font-normal text-slate-400">/bln</span></div>
                <hr className="border-slate-100" />
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <li>• <strong>100 AI Questions</strong> /bln</li>
                  <li>• Maks. <strong>50 Peserta</strong></li>
                  <li>• Maks. <strong>5 Ujian</strong></li>
                  <li>• Upload PDF/Word/PPT</li>
                  <li>• Random Soal & Jawaban</li>
                  <li className="text-indigo-700 font-bold">• Basic Anti-Cheat</li>
                  <li>• Export Excel & CSV</li>
                </ul>
              </div>
              <Link
                to={isAuthenticated ? "/checkout?plan=personal&billing=monthly" : "/register?redirect=checkout&plan=personal&billing=monthly"}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold text-center block transition-all shadow-xs"
              >
                Mulai Personal (Rp 49K)
              </Link>
            </div>

            {/* Pro AI */}
            <div className="p-5 rounded-2xl bg-white border-2 border-indigo-600 space-y-4 flex flex-col justify-between shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-black px-3 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-300 fill-current" /> POPULER
              </div>
              <div className="space-y-2.5 pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                  <Star className="w-3 h-3 text-indigo-600" /> Sekolah & Bimbel
                </span>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-indigo-600 fill-current" /> Pro AI
                </h3>
                <div className="text-2xl font-black text-indigo-600">Rp 149K <span className="text-xs font-normal text-slate-400">/bln</span></div>
                <hr className="border-slate-100" />
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <li>• <strong>300 AI Questions</strong> /bln</li>
                  <li>• Maks. <strong>200 Peserta</strong></li>
                  <li>• Maks. <strong>15 Ujian</strong></li>
                  <li className="text-purple-700 font-bold">• AI Essay & AI Vision</li>
                  <li className="text-indigo-700 font-bold">• Advanced Anti-Cheat</li>
                  <li>• Export PDF & 3 Teacher</li>
                </ul>
              </div>
              <Link
                to={isAuthenticated ? "/checkout?plan=pro_ai&billing=monthly" : "/register?redirect=checkout&plan=pro_ai&billing=monthly"}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold text-center block transition-all shadow-md"
              >
                Pilih Paket Pro AI (Rp 149K)
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 flex flex-col justify-between shadow-2xs">
              <div className="space-y-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-emerald-600" /> Kampus & Institusi
                </span>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" /> Enterprise
                </h3>
                <div className="text-xl font-black text-slate-900">Custom <span className="text-xs font-normal text-slate-400">Plan</span></div>
                <hr className="border-slate-100" />
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <li>• Semua Fitur Pro AI</li>
                  <li>• Custom AI & Unlimited Bank</li>
                  <li>• Custom Domain & SSO</li>
                  <li>• Dedicated Server & SLA</li>
                </ul>
              </div>
              <a href="https://wa.me/6281234567890?text=Halo%20Tim%20Examigo,%20saya%20tertarik%20dengan%20Paket%20Enterprise" target="_blank" rel="noreferrer" className="w-full py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 text-xs font-bold text-center block">Konsultasi Enterprise</a>
            </div>

          </div>

          {/* Matriks Ringkas Vector Icons */}
          <div className="pt-4 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 text-center">Matriks Perbandingan Fitur</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-900">
                    <th className="p-3 font-bold">Fitur Platform</th>
                    <th className="p-3 font-bold text-center">Free</th>
                    <th className="p-3 font-bold text-center">Personal</th>
                    <th className="p-3 font-bold text-center text-indigo-700 bg-indigo-50/50">Pro AI</th>
                    <th className="p-3 font-bold text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Harga / Bulan</td>
                    <td className="p-3 text-center font-bold">Rp 0</td>
                    <td className="p-3 text-center font-bold">Rp 49K</td>
                    <td className="p-3 text-center font-bold text-indigo-600 bg-indigo-50/30">Rp 149K</td>
                    <td className="p-3 text-center font-bold">Custom</td>
                  </tr>
                  <tr>
                    <td className="p-3">AI Question Generator</td>
                    <td className="p-3 text-center"><X className="w-3.5 h-3.5 text-red-500 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold">100 / bln</td>
                    <td className="p-3 text-center text-emerald-600 font-bold bg-indigo-50/30">300 / bln</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">Custom</td>
                  </tr>
                  <tr>
                    <td className="p-3">Kapasitas Peserta Ujian</td>
                    <td className="p-3 text-center">5</td>
                    <td className="p-3 text-center font-bold">50</td>
                    <td className="p-3 text-center font-bold text-indigo-700 bg-indigo-50/30">200</td>
                    <td className="p-3 text-center font-bold">Custom</td>
                  </tr>
                  <tr>
                    <td className="p-3">Sistem Anti-Cheat</td>
                    <td className="p-3 text-center"><X className="w-3.5 h-3.5 text-red-500 mx-auto" /></td>
                    <td className="p-3 text-center text-indigo-600 font-bold">Basic</td>
                    <td className="p-3 text-center text-indigo-600 font-bold bg-indigo-50/30">Advanced</td>
                    <td className="p-3 text-center text-indigo-600 font-bold">Full</td>
                  </tr>
                  <tr>
                    <td className="p-3">Acak Soal & Pilihan A,B,C,D</td>
                    <td className="p-3 text-center"><X className="w-3.5 h-3.5 text-red-500 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold"><Check className="w-3.5 h-3.5 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold bg-indigo-50/30"><Check className="w-3.5 h-3.5 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold"><Check className="w-3.5 h-3.5 text-emerald-600 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* 10. FAQ Accordion Vector Icons */}
      <section id="faq" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase">FAQ</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Tanya Jawab Ringkas</h2>
          </div>

          <div className="space-y-3 text-xs">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => toggleFaq(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isOpen ? 'bg-indigo-50/60 border-indigo-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-indigo-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isOpen && (
                    <p className="mt-2 text-slate-600 font-medium border-t border-indigo-100 pt-2 animate-fade-in-fast">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. Banner CTA Final */}
      <section className="py-14 bg-slate-900 text-white text-center space-y-4">
        <div className="max-w-3xl mx-auto px-4 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black">Siap Gelar Ujian Online Lebih Cepat?</h2>
          <p className="text-slate-400 text-xs font-semibold">Daftar akun gratis sekarang dan rasakan kemudahannya.</p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/register" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md">
              Daftar Akun Gratis
            </Link>
            <Link to="/login" className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700">
              Masuk
            </Link>
          </div>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="py-6 bg-slate-950 text-slate-400 border-t border-slate-800 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ExamigoLogo size="sm" showText={true} />
            <span className="text-slate-500 ml-2">© 2026 AI Online Exam Builder.</span>
          </div>

          <div className="flex items-center gap-5">
            <Link to="/login" className="hover:text-white">Masuk</Link>
            <Link to="/register" className="hover:text-white">Daftar</Link>
            <a href="#fitur" className="hover:text-white">Fitur</a>
            <a href="#harga" className="hover:text-white">Harga</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </div>
        </div>
      </footer>

      {/* 13. Pakasir Payment Gateway Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 relative animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  P
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Pakasir Payment Gateway</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Sistem Pembayaran Instan QRIS & Bank Transfer</p>
                </div>
              </div>
              <button 
                onClick={() => setPaymentModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            {isProcessingPayment ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700">Menghubungkan ke Pakasir Payment Gateway...</p>
                <p className="text-[10px] text-slate-400">Memproses checkout aman terenkripsi</p>
              </div>
            ) : paymentError ? (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold space-y-2 text-center">
                <p>{paymentError}</p>
                <button 
                  onClick={() => handleInitiatePakasirPayment(selectedPlan || 'PERSONAL')}
                  className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                
                {/* Order Summary */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Paket Dipilih</span>
                    <span className="font-bold text-slate-900">{selectedPlan === 'PRO_AI' ? '⭐ Pro AI' : '👤 Personal'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Total Tagihan</span>
                    <span className="font-black text-indigo-700 text-base">
                      {selectedPlan === 'PRO_AI' ? 'Rp 149.000' : 'Rp 49.000'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-indigo-100/60 pt-2">
                    <span>Order ID</span>
                    <span className="font-mono text-slate-600 font-bold">{activeOrder?.orderId}</span>
                  </div>
                </div>

                {/* Integration Info Badge */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-600 font-bold">Metode Pembayaran Resmi:</span>
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase tracking-wider">Terverifikasi</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Mendukung pembayaran otomatis melalui <strong>QRIS (GoPay, OVO, ShopeePay, DANA)</strong> & <strong>Virtual Account Bank</strong>.
                  </p>
                </div>

                {/* Status Message */}
                {verificationStatus && (
                  <div className={`p-3 rounded-xl text-xs font-bold text-center ${verificationStatus.includes('Lunas') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                    {verificationStatus}
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  {activeOrder?.paymentUrl && (
                    <a
                      href={activeOrder.paymentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs text-center block shadow-md transition-all"
                    >
                      💳 Bayar Seketika di Pakasir (QRIS / Bank)
                    </a>
                  )}

                  <button
                    onClick={handleVerifyPakasirStatus}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition-colors"
                  >
                    🔄 Cek Status Pembayaran
                  </button>
                </div>

              </div>
            )}

            {/* Modal Footer */}
            <div className="text-center pt-1 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
              Powered by Pakasir Payment Gateway • Transaksi Aman & Terenkripsi
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
