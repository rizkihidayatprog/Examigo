import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  HelpCircle, 
  Users, 
  ArrowRight, 
  Clock, 
  PlusCircle, 
  CheckCircle2, 
  BarChart2, 
  Trash2, 
  X, 
  Activity, 
  QrCode, 
  Copy,
  Award,
  Star,
  MessageSquare,
  Send,
  ThumbsUp,
  Lightbulb,
  GraduationCap
} from 'lucide-react';
import { useAuth, api } from '../lib/auth';
import { useToast } from '../components/Toast';
import DynamicQRCode from '../components/common/DynamicQRCode';
import styles from '../styles/DashboardPage.module.css';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({
    totalExams: 0,
    totalQuestions: 0,
    totalParticipants: 0,
    averageScore: 0,
  });
  const { showToast } = useToast();
  const { user, refreshUser } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [activeMonitoringExam, setActiveMonitoringExam] = useState<any>(null);
  const [qrModalExam, setQrModalExam] = useState<any>(null);
  const [monitoringParticipants, setMonitoringParticipants] = useState<any[]>([]);
  const [maintenanceFeatures, setMaintenanceFeatures] = useState<{
    payments?: boolean;
    aiGeneration?: boolean;
    examCreation?: boolean;
    studentExams?: boolean;
  }>({});
  const [currentGreeting, setCurrentGreeting] = useState('Selamat Datang');
  const [currentFormattedDate, setCurrentFormattedDate] = useState('');

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      let greet = 'Selamat Datang';
      if (hour >= 4 && hour < 11) greet = 'Selamat Pagi';
      else if (hour >= 11 && hour < 15) greet = 'Selamat Siang';
      else if (hour >= 15 && hour < 18) greet = 'Selamat Sore';
      else greet = 'Selamat Malam';
      setCurrentGreeting(greet);

      setCurrentFormattedDate(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };

    updateTimeAndGreeting();
    const timer = setInterval(updateTimeAndGreeting, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/public/landing-config')
      .then(res => res.json())
      .then(d => {
        if (d.success && d.data?.maintenance?.features) {
          setMaintenanceFeatures(d.data.maintenance.features);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeMonitoringExam) return;
    const fetchMonitoring = () => {
      api(`/exams/${activeMonitoringExam.id}/monitoring`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setMonitoringParticipants(data.data);
          }
        })
        .catch((err) => console.error('Error fetching monitoring:', err));
    };
    fetchMonitoring();
    const interval = setInterval(fetchMonitoring, 5000);
    return () => clearInterval(interval);
  }, [activeMonitoringExam]);

  useEffect(() => {
    const handleOpenFeedback = () => setShowFeedbackModal(true);
    window.addEventListener('examigo:open_feedback', handleOpenFeedback);
    return () => window.removeEventListener('examigo:open_feedback', handleOpenFeedback);
  }, []);

  const loadStatsAndExams = () => {
    // Stats
    api('/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data);
          if (data.data && ((data.data.totalExams || 0) > 0 || (data.data.totalQuestions || 0) > 0)) {
            const targetId = user?.id || 'guest';
            localStorage.setItem(`examigo_feature_used_${targetId}`, 'true');
          }
        }
      })
      .catch((err) => console.log('Analytics fetch error:', err));

    // Exams
    api('/exams')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExams(data.data);
          if (Array.isArray(data.data) && data.data.length > 0) {
            const targetId = user?.id || 'guest';
            localStorage.setItem(`examigo_feature_used_${targetId}`, 'true');
          }
        }
      })
      .catch((err) => console.log('Exams fetch error:', err));
  };

  // Feedback & Rating State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackCategory, setFeedbackCategory] = useState<'REVIEW' | 'SUGGESTION' | 'CRITIQUE'>('REVIEW');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [myFeedbacks, setMyFeedbacks] = useState<any[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState<boolean>(false);

  const loadMyFeedbacks = (activeUser?: any) => {
    const currentUser = activeUser || user;
    api('/feedback/my')
      .then((res) => res.json())
      .then((d) => {
        if (d.success) {
          const list = Array.isArray(d.data) ? d.data : [];
          setMyFeedbacks(list);
          const submitted = list.length > 0;
          setHasSubmittedFeedback(submitted);

          if (currentUser?.id) {
            if (submitted) {
              localStorage.setItem(`examigo_feedback_submitted_${currentUser.id}`, 'true');
            } else {
              localStorage.removeItem(`examigo_feedback_submitted_${currentUser.id}`);
            }
          }

          // HANYA tampilkan modal jika akun ini SUDAH pernah menggunakan fitur untuk pertama kalinya dan belum pernah diminta
          const targetId = currentUser?.id || 'guest';
          const isDismissed = sessionStorage.getItem(`feedback_modal_dismissed_${targetId}`) === 'true';
          const hasPrompted = localStorage.getItem(`examigo_feedback_prompted_${targetId}`) === 'true';
          const hasFeatureBeenUsed = Boolean(
            localStorage.getItem(`examigo_feature_used_${targetId}`) === 'true' ||
            (currentUser?.examsCount && currentUser.examsCount > 0) ||
            (currentUser?.questionsCount && currentUser.questionsCount > 0)
          );

          if (hasFeatureBeenUsed && !submitted && !isDismissed && !hasPrompted) {
            setTimeout(() => {
              setShowFeedbackModal(true);
              localStorage.setItem(`examigo_feedback_prompted_${targetId}`, 'true');
            }, 1200);
          }
        }
      })
      .catch((err) => console.log('Feedback fetch error:', err));
  };

  useEffect(() => {
    // Bersihkan legacy global key yang memblokir semua akun
    localStorage.removeItem('examigo_feedback_submitted');

    loadStatsAndExams();
    refreshUser();
  }, []);

  useEffect(() => {
    if (user?.id) {
      const perUserSubmitted = localStorage.getItem(`examigo_feedback_submitted_${user.id}`) === 'true';
      setHasSubmittedFeedback(perUserSubmitted);
      loadMyFeedbacks(user);
    }
  }, [user?.id]);

  const handleDismissFeedbackModal = () => {
    setShowFeedbackModal(false);
    const targetId = user?.id || 'guest';
    sessionStorage.setItem(`feedback_modal_dismissed_${targetId}`, 'true');
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim() || feedbackMessage.trim().length < 3) {
      showToast('Pesan kritik, saran, atau ulasan minimal 3 karakter.', 'error');
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      const res = await api('/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: feedbackRating,
          category: feedbackCategory,
          message: feedbackMessage.trim(),
        }),
      });
      const d = await res.json();
      if (d.success) {
        showToast(d.message, 'success');
        setFeedbackMessage('');
        setShowFeedbackModal(false);
        setHasSubmittedFeedback(true);
        if (user?.id) {
          localStorage.setItem(`examigo_feedback_submitted_${user.id}`, 'true');
        }
        loadMyFeedbacks(user);
      } else {
        showToast(d.message || 'Gagal mengirim ulasan.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Terjadi gangguan koneksi.', 'error');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ujian ini? Semua data relasi ujian juga akan terhapus.')) return;
    try {
      const res = await api(`/exams/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadStatsAndExams();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* 1. Hero Welcome Banner (Modern, Clean & Dynamic) */}
      <div className={styles.heroBanner}>
        {/* Subtle grid pattern & ambient gentle light glow */}
        <div className={styles.heroGridPattern} />
        <div className={styles.heroMeshGlow} />

        <div className={styles.heroMainLayout}>
          {/* Left Column: Greeting, Description, Actions */}
          <div className={styles.heroContent}>
            <div className={styles.heroBadgesRow}>
              <span className={styles.pillTagStudio}>
                <Sparkles style={{ width: '13px', height: '13px', fill: 'currentColor' }} /> Examigo Studio
              </span>
              <span className={`${styles.pillTagPlan} ${
                user?.plan === 'PRO_AI' 
                  ? styles.planPro 
                  : user?.plan === 'PERSONAL'
                    ? styles.planPersonal
                    : styles.planFree
              }`}>
                <span className={styles.planDot} />
                <span>Paket: {user?.plan === 'PRO_AI' ? 'Pro AI' : user?.plan || 'Free'}</span>
              </span>
              {currentFormattedDate && (
                <span className={styles.heroDatePill}>
                  <Clock style={{ width: '12px', height: '12px' }} />
                  <span>{currentFormattedDate}</span>
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <h1 className={styles.heroTitle}>
                {currentGreeting}, <span className={styles.heroName}>{user?.name?.split(' ')[0] || 'Bapak/Ibu Guru'}</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Platform cerdas untuk meracik soal dari materi pelajaran, mengelola bank soal terpadu, dan meluncurkan ujian online secara akurat dan mudah.
              </p>
            </div>

            <div className={styles.heroActionGroup}>
              <Link 
                to="/ai-generator" 
                className={styles.btnPrimaryAction}
                style={maintenanceFeatures.aiGeneration ? { opacity: 0.85 } : undefined}
              >
                <Sparkles style={{ width: '15px', height: '15px', fill: 'currentColor', color: '#D97706' }} />
                <span>Generate Soal Otomatis</span>
                {maintenanceFeatures.aiGeneration && (
                  <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full ml-1">
                    Maint.
                  </span>
                )}
              </Link>
              <Link 
                to="/exam-builder" 
                className={styles.btnSecondaryAction}
                style={maintenanceFeatures.examCreation ? { opacity: 0.85 } : undefined}
              >
                <PlusCircle style={{ width: '15px', height: '15px' }} />
                <span>Buat Ujian Baru</span>
                {maintenanceFeatures.examCreation && (
                  <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full ml-1">
                    Maint.
                  </span>
                )}
              </Link>
              <Link 
                to="/question-bank" 
                className={styles.btnGhostAction}
              >
                <FileText style={{ width: '15px', height: '15px' }} />
                <span>Bank Soal</span>
              </Link>
              {user?.plan && user.plan !== 'FREE' ? (
                <Link to="/certificates" className={styles.btnGhostAction}>
                  <Award style={{ width: '15px', height: '15px', color: '#FDE047' }} />
                  <span>Sertifikat</span>
                </Link>
              ) : (
                <Link 
                  to="/subscription" 
                  className={styles.btnUpgradeAction}
                  style={maintenanceFeatures.payments ? { opacity: 0.85 } : undefined}
                >
                  <Sparkles style={{ width: '15px', height: '15px' }} />
                  <span>Upgrade Pro</span>
                  {maintenanceFeatures.payments && (
                    <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full ml-1">
                      Maint.
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Live Workspace Overview Card */}
          <div className={styles.heroWidgetCard}>
            <div className={styles.widgetHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={styles.pulseLiveDot} />
                <span className={styles.widgetLiveStatus}>Workspace Terhubung</span>
              </div>
              <span className={styles.widgetRoleBadge}>{user?.role || 'Guru'}</span>
            </div>

            <div className={styles.widgetMetricsGrid}>
              <div className={styles.widgetMetricItem}>
                <div className={styles.widgetMetricNumber}>
                  {stats.totalQuestions || 0}
                </div>
                <div className={styles.widgetMetricLabel}>
                  <HelpCircle style={{ width: '12px', height: '12px', color: '#34D399' }} />
                  <span>Soal</span>
                </div>
              </div>

              <div className={styles.widgetMetricItem}>
                <div className={styles.widgetMetricNumber}>
                  {stats.totalExams || 0}
                </div>
                <div className={styles.widgetMetricLabel}>
                  <FileText style={{ width: '12px', height: '12px', color: '#38BDF8' }} />
                  <span>Ujian</span>
                </div>
              </div>

              <div className={styles.widgetMetricItem}>
                <div className={styles.widgetMetricNumber}>
                  {stats.totalParticipants || 0}
                </div>
                <div className={styles.widgetMetricLabel}>
                  <Users style={{ width: '12px', height: '12px', color: '#C084FC' }} />
                  <span>Peserta</span>
                </div>
              </div>
            </div>

            <div className={styles.widgetFooter}>
              <span className={styles.widgetSchoolInfo} title={user?.institution || 'Institusi Pendidikan'}>
                <GraduationCap style={{ width: '13px', height: '13px', display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                <span>{user?.institution || 'Lembaga Pendidikan'}</span>
              </span>
              <Link to="/analytics" className={styles.widgetViewLink}>
                <span>Lihat Analitik</span>
                <ArrowRight style={{ width: '12px', height: '12px' }} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* System Partial Maintenance Notice */}
      {Object.values(maintenanceFeatures).some(Boolean) && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold flex items-center justify-between gap-3 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-base shrink-0">⚠️</span>
            <span>
              <strong>Pemberitahuan Sistem:</strong> Beberapa fitur sedang dalam pemeliharaan berkala ({[
                maintenanceFeatures.aiGeneration && 'Generator Soal',
                maintenanceFeatures.examCreation && 'Pembuatan Ujian',
                maintenanceFeatures.payments && 'Pembayaran',
                maintenanceFeatures.studentExams && 'Ujian Siswa',
              ].filter(Boolean).join(', ')}). Fitur lainnya tetap dapat Anda gunakan dengan normal.
            </span>
          </div>
        </div>
      )}

      {/* 2. Interactive Onboarding Guide for New Teachers */}
      {stats.totalQuestions === 0 && (
        <div className={styles.onboardingCard}>
          <div className={styles.onboardingHeader}>
            <div className={styles.onboardingPill}>
              <GraduationCap style={{ width: '13px', height: '13px' }} /> Panduan Alur Kerja Ujian
            </div>
            <h2 className={styles.onboardingTitle}>Panduan 3 Langkah Memulai Ujian Online</h2>
            <p className={styles.onboardingDesc}>
              Pelajari alur praktis dari penyusunan soal hingga pembagian link ujian dan rekap nilai otomatis siswa.
            </p>
          </div>

          <div className={styles.onboardingStepsGrid}>
            {/* Step 1 */}
            <Link to="/ai-generator" className={styles.stepItemCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.stepNumber}>1</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--theme-primary, #059669)', background: 'var(--theme-mint-light, #ECFDF5)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid var(--theme-border, #A7F3D0)' }}>
                  ± 1 Menit
                </span>
              </div>
              <div>
                <h4 className={styles.stepHeading}>Buat Soal dari Materi</h4>
                <p className={styles.stepBody}>Unggah modul / ketik topik materi untuk menyusun butir soal otomatis.</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '11px', color: 'var(--theme-text-body, #065F46)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 style={{ width: '13px', height: '13px', color: 'var(--theme-primary, #10B981)', flexShrink: 0 }} />
                  <span>Dukung dokumen Word, PDF, & foto teks</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 style={{ width: '13px', height: '13px', color: 'var(--theme-primary, #10B981)', flexShrink: 0 }} />
                  <span>Kunci jawaban & pembahasan instan</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 style={{ width: '13px', height: '13px', color: 'var(--theme-primary, #10B981)', flexShrink: 0 }} />
                  <span>Tersimpan aman ke Bank Soal Anda</span>
                </li>
              </ul>
              <div style={{ marginTop: 'auto', paddingTop: '0.625rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: 'var(--theme-primary, #059669)' }}>
                <span>Buka Generator Soal</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </div>
            </Link>

            {/* Step 2 */}
            <Link to="/exam-builder" className={styles.stepItemCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.stepNumber}>2</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--theme-primary, #059669)', background: 'var(--theme-mint-light, #ECFDF5)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid var(--theme-border, #A7F3D0)' }}>
                  ± 2 Menit
                </span>
              </div>
              <div>
                <h4 className={styles.stepHeading}>Atur Jadwal & Kode Ujian</h4>
                <p className={styles.stepBody}>Pilih butir soal dari bank, atur durasi, dan tentukan aturan CBT.</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '11px', color: 'var(--theme-text-body, #065F46)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 style={{ width: '13px', height: '13px', color: 'var(--theme-primary, #10B981)', flexShrink: 0 }} />
                  <span>Acak urutan soal & opsi jawaban</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 style={{ width: '13px', height: '13px', color: 'var(--theme-primary, #10B981)', flexShrink: 0 }} />
                  <span>Fitur anti-curang & proteksi keluar tab</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 style={{ width: '13px', height: '13px', color: 'var(--theme-primary, #10B981)', flexShrink: 0 }} />
                  <span>Dapatkan Kode Akses & QR Code ujian</span>
                </li>
              </ul>
              <div style={{ marginTop: 'auto', paddingTop: '0.625rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: 'var(--theme-primary, #059669)' }}>
                <span>Buka Exam Builder</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </div>
            </Link>

            {/* Step 3 */}
            <Link to="/analytics" className={styles.stepItemCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.stepNumber}>3</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--theme-primary, #059669)', background: 'var(--theme-mint-light, #ECFDF5)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid var(--theme-border, #A7F3D0)' }}>
                  Otomatis
                </span>
              </div>
              <div>
                <h4 className={styles.stepHeading}>Siswa Kerjakan & Rekap Nilai</h4>
                <p className={styles.stepBody}>Siswa masuk melalui kode ujian tanpa ribet login atau install aplikasi.</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '11px', color: 'var(--theme-text-body, #065F46)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 style={{ width: '13px', height: '13px', color: 'var(--theme-primary, #10B981)', flexShrink: 0 }} />
                  <span>Koreksi skor instan begitu siswa selesai</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 style={{ width: '13px', height: '13px', color: 'var(--theme-primary, #10B981)', flexShrink: 0 }} />
                  <span>Sertifikat digital otomatis bagi yang lulus</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 style={{ width: '13px', height: '13px', color: 'var(--theme-primary, #10B981)', flexShrink: 0 }} />
                  <span>Unduh rekap nilai & analisis ke Excel</span>
                </li>
              </ul>
              <div style={{ marginTop: 'auto', paddingTop: '0.625rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: 'var(--theme-primary, #059669)' }}>
                <span>Lihat Hasil & Analitik</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* 3. Metrics Overview Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div>
            <p className={styles.metricLabel}>Paket Ujian</p>
            <p className={styles.metricValue}>
              {stats.totalExams} 
              <span className={styles.metricLimit}>
                {user?.plan === 'FREE' ? '/ 1 (Free)' : user?.plan === 'PERSONAL' ? '/ 5' : '/ ∞ (Pro)'}
              </span>
            </p>
          </div>
          <div className={styles.metricIconBox}>
            <FileText style={{ width: '24px', height: '24px' }} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div>
            <p className={styles.metricLabel}>Bank Soal</p>
            <p className={styles.metricValue}>
              {stats.totalQuestions} 
              <span className={styles.metricLimit}>
                {user?.plan === 'FREE' ? '/ 15 (Free)' : user?.plan === 'PERSONAL' ? '/ 100' : '/ ∞ (Pro)'}
              </span>
            </p>
          </div>
          <div className={styles.metricIconBox}>
            <HelpCircle style={{ width: '24px', height: '24px' }} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div>
            <p className={styles.metricLabel}>Total Siswa</p>
            <p className={styles.metricValue}>{stats.totalParticipants}</p>
          </div>
          <div className={styles.metricIconBox}>
            <Users style={{ width: '24px', height: '24px' }} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div>
            <p className={styles.metricLabel}>Rata-Rata Nilai</p>
            <p className={styles.metricValue}>{stats.averageScore}</p>
          </div>
          <div className={styles.metricIconBox}>
            <BarChart2 style={{ width: '24px', height: '24px' }} />
          </div>
        </div>
      </div>

      {/* 4. Quick Access Grid & AI Sidebar */}
      <div className={styles.contentLayout}>
        
        {/* Left Column: Recent Exams */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Clock style={{ width: '16px', height: '16px', color: 'var(--theme-primary, #059669)' }} /> Ujian Aktif & Siap Diakses
            </h2>
            <Link to="/exam-builder" className={styles.sectionActionLink}>
              <span>Kelola Semua Ujian</span>
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>

          <div className={styles.examList}>
            {exams.length === 0 ? (
              <div className={styles.emptyExamsState}>
                <p style={{ margin: 0, fontWeight: 800, color: 'var(--theme-primary-dark, #064E3B)', fontSize: '13px' }}>Belum ada paket ujian yang diterbitkan.</p>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--theme-text-muted, #047857)' }}>Klik tombol <strong>Buat Ujian Baru</strong> atau gunakan Generator Soal untuk meracik soal.</p>
              </div>
            ) : (
              exams.map((e) => (
                <div key={e.id} className={styles.examRow}>
                  <div className={styles.examInfo}>
                    <div className={styles.examTitleRow}>
                      <span className={styles.examTitle}>{e.title}</span>
                      <span className={styles.badgeActive}>AKTIF</span>
                    </div>
                    <p className={styles.examMeta}>
                      Kode Akses: <code className={styles.examCodeSnippet}>{e.code}</code> • {e.durationMinutes} Menit • {e.questionsCount} Soal
                    </p>
                  </div>
                  
                  <div className={styles.examActions}>
                    <Link
                      to={`/live-monitor/${e.id}`}
                      className={styles.btnMonitor}
                      title="Monitor Live Peserta"
                    >
                      <Activity style={{ width: '14px', height: '14px' }} />
                      <span>Monitor Live</span>
                    </Link>

                    <button
                      onClick={() => setQrModalExam(e)}
                      className={styles.iconBtnAction}
                      title="Tampilkan QR Code Ujian"
                    >
                      <QrCode style={{ width: '16px', height: '16px' }} />
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/exam-room/${e.code}`);
                        showToast('Link ujian berhasil disalin ke clipboard!', 'success');
                      }}
                      className={styles.iconBtnAction}
                      title="Salin Link Ujian"
                    >
                      <Copy style={{ width: '16px', height: '16px' }} />
                    </button>

                    <Link
                      to={`/exam-room/${e.code}`}
                      className={styles.btnOpenExam}
                    >
                      Buka Ujian
                    </Link>

                    <button
                      onClick={() => handleDeleteExam(e.id)}
                      className={styles.btnDeleteExam}
                      title="Hapus Ujian"
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 5. Floating Kritik, Saran & Penilaian Modal (Only shown once if user hasn't submitted yet) */}
      {!hasSubmittedFeedback && myFeedbacks.length === 0 && (
        <>
          {/* Floating Action Button on the Right */}
          <button
            type="button"
            onClick={() => setShowFeedbackModal(true)}
            style={{
              position: 'fixed',
              bottom: '2.5rem',
              right: '2rem',
              zIndex: 40,
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.85rem 1.25rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, var(--theme-primary-dark, #064E3B), var(--theme-primary, #10B981))',
              color: '#FFFFFF',
              boxShadow: '0 10px 25px -4px rgba(16, 185, 129, 0.45), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '13px',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
            title="Beri Kritik, Saran & Penilaian"
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare style={{ width: '17px', height: '17px', fill: 'currentColor' }} />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            </div>
            <span>Kritik & Saran</span>
          </button>

          {/* Feedback Modal */}
          {showFeedbackModal && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 60,
                background: 'rgba(6, 78, 59, 0.55)',
                backdropFilter: 'blur(5px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                animation: 'fadeIn 0.15s ease'
              }}
            >
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  maxWidth: '540px',
                  width: '100%',
                  padding: '1.75rem',
                  boxShadow: '0 25px 50px -12px rgba(6, 78, 59, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  border: '1.5px solid var(--theme-border, #A7F3D0)',
                  maxHeight: '90vh',
                  overflowY: 'auto'
                }}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--theme-mint-light, #ECFDF5)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.2rem 0.6rem', borderRadius: '9999px', background: 'var(--theme-mint-light, #ECFDF5)', color: 'var(--theme-primary-dark, #064E3B)', fontSize: '10px', fontWeight: 800, border: '1px solid var(--theme-border, #A7F3D0)', alignSelf: 'flex-start' }}>
                      <MessageSquare style={{ width: '12px', height: '12px', color: 'var(--theme-primary, #059669)' }} />
                      Suara Pengguna
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--theme-primary-dark, #064E3B)' }}>
                      Kritik, Saran & Penilaian
                    </h3>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--theme-text-muted, #047857)', fontWeight: 500 }}>
                      Satu masukan dari Anda sangat berarti untuk penyempurnaan platform Examigo.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDismissFeedbackModal}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: 'var(--theme-mint-light, #ECFDF5)',
                      border: 'none',
                      color: 'var(--theme-primary-dark, #064E3B)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 800,
                      flexShrink: 0
                    }}
                  >
                    <X style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>

                {/* Feedback Form */}
                <form onSubmit={handleSubmitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                  
                  {/* Rating Stars Selector */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--theme-primary-dark, #064E3B)' }}>
                      Penilaian / Rating Anda:
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '0.2rem' }} onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map((starNum) => {
                          const isFilled = (hoverRating || feedbackRating) >= starNum;
                          return (
                            <button
                              key={starNum}
                              type="button"
                              onClick={() => setFeedbackRating(starNum)}
                              onMouseEnter={() => setHoverRating(starNum)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '3px',
                                transition: 'transform 0.15s ease'
                              }}
                              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                              title={`${starNum} Bintang`}
                            >
                              <Star
                                style={{
                                  width: '26px',
                                  height: '26px',
                                  fill: isFilled ? '#F59E0B' : 'transparent',
                                  color: isFilled ? '#F59E0B' : '#CBD5E1',
                                  transition: 'all 0.15s ease'
                                }}
                              />
                            </button>
                          );
                        })}
                      </div>

                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--theme-primary-dark, #064E3B)' }}>
                        {feedbackRating === 5 && 'Sempurna / Sangat Puas'}
                        {feedbackRating === 4 && 'Puas & Bermanfaat'}
                        {feedbackRating === 3 && 'Cukup Baik'}
                        {feedbackRating === 2 && 'Perlu Ditingkatkan'}
                        {feedbackRating === 1 && 'Kurang Memuaskan'}
                      </span>
                    </div>

                    {/* Notice for 5 Star Reviews */}
                    {feedbackRating === 5 && (
                      <div style={{
                        marginTop: '0.25rem',
                        padding: '0.625rem 0.875rem',
                        borderRadius: '12px',
                        background: 'var(--theme-mint-light, #ECFDF5)',
                        border: '1px solid var(--theme-border, #A7F3D0)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '11px',
                        color: 'var(--theme-primary-dark, #064E3B)',
                        fontWeight: 600
                      }}>
                        <Sparkles style={{ width: '15px', height: '15px', color: 'var(--theme-primary, #059669)', flexShrink: 0 }} />
                        <span>
                          <strong style={{ fontWeight: 800 }}>Kesempatan Tampil di Landing Page:</strong> Ulasan bintang 5 Anda berkesempatan tampil di halaman depan Examigo.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Category Selector */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--theme-primary-dark, #064E3B)' }}>
                      Kategori Masukan:
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {[
                        { id: 'REVIEW', label: 'Penilaian & Ulasan', icon: Star },
                        { id: 'SUGGESTION', label: 'Saran Fitur', icon: Lightbulb },
                        { id: 'CRITIQUE', label: 'Kritik & Masukan', icon: MessageSquare },
                      ].map((cat) => {
                        const IconComp = cat.icon;
                        const isSelected = feedbackCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setFeedbackCategory(cat.id as any)}
                            style={{
                              padding: '0.45rem 0.85rem',
                              borderRadius: '10px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.15s ease',
                              border: isSelected
                                ? '1.5px solid var(--theme-primary, #059669)'
                                : '1px solid var(--theme-border, #A7F3D0)',
                              background: isSelected
                                ? 'var(--theme-mint-light, #ECFDF5)'
                                : '#FFFFFF',
                              color: isSelected
                                ? 'var(--theme-primary-dark, #064E3B)'
                                : 'var(--theme-text-muted, #047857)',
                            }}
                          >
                            <IconComp style={{ width: '13px', height: '13px', color: isSelected ? 'var(--theme-primary, #059669)' : '#64748B', flexShrink: 0 }} />
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--theme-primary-dark, #064E3B)' }}>
                      Pesan Masukan / Kritik & Saran:
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder={
                        feedbackCategory === 'REVIEW'
                          ? 'Ceritakan pengalaman Anda menggunakan Examigo...'
                          : feedbackCategory === 'SUGGESTION'
                          ? 'Sampaikan ide fitur baru yang Anda harapkan ada...'
                          : 'Sampaikan kendala atau kritik konstruktif untuk kami...'
                      }
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: '1.5px solid var(--theme-border, #A7F3D0)',
                        fontSize: '12px',
                        color: 'var(--theme-primary-dark, #064E3B)',
                        outline: 'none',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        background: '#FFFFFF',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.25rem' }}>
                    <button
                      type="button"
                      onClick={handleDismissFeedbackModal}
                      style={{
                        padding: '0.625rem 1.25rem',
                        borderRadius: '12px',
                        background: '#F1F5F9',
                        color: '#475569',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingFeedback}
                      style={{
                        padding: '0.625rem 1.5rem',
                        borderRadius: '12px',
                        background: 'var(--theme-primary, #059669)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 900,
                        cursor: isSubmittingFeedback ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                        opacity: isSubmittingFeedback ? 0.7 : 1,
                      }}
                    >
                      <Send style={{ width: '13px', height: '13px' }} />
                      <span>{isSubmittingFeedback ? 'Mengirim...' : 'Kirim Masukan'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* 6. Live Monitoring Modal */}
      {activeMonitoringExam && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalWindow} style={{ maxWidth: '800px', width: '100%' }}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--theme-primary, #10B981)', display: 'inline-block' }} />
                  Live Monitoring: {activeMonitoringExam.title}
                </h3>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--theme-primary-dark, #065F46)', fontWeight: 600 }}>Kode Akses: {activeMonitoringExam.code} • Refresh otomatis tiap 5 detik</p>
              </div>
              <button
                onClick={() => setActiveMonitoringExam(null)}
                className={styles.closeModalBtn}
              >
                ✕
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--theme-border, #A7F3D0)', backgroundColor: 'var(--theme-mint-light, #ECFDF5)', color: 'var(--theme-primary-dark, #064E3B)', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem' }}>Nama Peserta</th>
                    <th style={{ padding: '0.75rem' }}>Email</th>
                    <th style={{ padding: '0.75rem' }}>Progres</th>
                    <th style={{ padding: '0.75rem' }}>Kecurangan</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Nilai Akhir</th>
                  </tr>
                </thead>
                <tbody>
                  {monitoringParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--theme-text-muted, #047857)', fontStyle: 'italic' }}>
                        Belum ada peserta yang bergabung di ujian ini.
                      </td>
                    </tr>
                  ) : (
                    monitoringParticipants.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--theme-mint-light, #ECFDF5)', color: 'var(--theme-primary-dark, #064E3B)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 800 }}>{p.studentName}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--theme-text-muted, #047857)', fontFamily: 'monospace' }}>
                          {p.studentEmail && !p.studentEmail.includes('@student.examigo.id') ? p.studentEmail : '-'}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '80px', height: '6px', borderRadius: '9999px', backgroundColor: 'var(--theme-mint-subtle, #D1FAE5)', overflow: 'hidden' }}>
                              <div style={{ width: `${p.progress}%`, height: '100%', backgroundColor: 'var(--theme-mint, #059669)' }} />
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '11px' }}>{p.progress}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {p.cheatingCount > 0 ? (
                            <span style={{ padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '10px', fontWeight: 800, backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                              {p.cheatingCount} Pelanggaran
                            </span>
                          ) : (
                            <span style={{ color: 'var(--theme-border, #A7F3D0)' }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '10px', fontWeight: 800, backgroundColor: p.status === 'COMPLETED' ? 'var(--theme-mint-light, #ECFDF5)' : 'var(--theme-bg, #F0FDF4)', color: p.status === 'COMPLETED' ? 'var(--theme-primary, #059669)' : 'var(--theme-primary-dark, #064E3B)', border: '1px solid var(--theme-border, #A7F3D0)' }}>
                            {p.status === 'COMPLETED' ? 'Selesai' : 'Mengerjakan'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 900 }}>
                          {p.status === 'COMPLETED' ? (
                            <span style={{ color: p.isPassed ? 'var(--theme-primary, #059669)' : '#DC2626' }}>
                              {p.score} ({p.isPassed ? 'Lulus' : 'Gagal'})
                            </span>
                          ) : (
                            <span style={{ color: 'var(--theme-border, #A7F3D0)' }}>-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. QR Code Modal */}
      {qrModalExam && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalWindow} style={{ maxWidth: '420px', width: '100%', textAlign: 'center', alignItems: 'center' }}>
            <div className={styles.modalHeader} style={{ width: '100%' }}>
              <h3 className={styles.modalTitle}>
                <QrCode style={{ width: '16px', height: '16px', color: 'var(--theme-primary, #059669)' }} /> QR Code Akses Ujian
              </h3>
              <button
                onClick={() => setQrModalExam(null)}
                className={styles.closeModalBtn}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '13px', color: 'var(--theme-primary-dark, #064E3B)' }}>{qrModalExam.title}</strong>
              <span style={{ fontSize: '11px', color: 'var(--theme-text-muted, #047857)' }}>Kode Akses: <code style={{ color: 'var(--theme-primary, #059669)', fontWeight: 900 }}>{qrModalExam.code}</code></span>
            </div>

            <DynamicQRCode
              value={`${window.location.origin}/exam-room/${qrModalExam.code}`}
              size={190}
              showActions={true}
            />
          </div>
        </div>
      )}

    </div>
  );
}
