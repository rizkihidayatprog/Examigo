import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, HelpCircle, Users, ArrowRight, Clock, PlusCircle, CheckCircle2, BarChart2, Trash2, X, Activity, QrCode, Copy } from 'lucide-react';
import { useAuth, api } from '../lib/auth';
import { useToast } from '../components/Toast';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({
    totalExams: 0,
    totalQuestions: 0,
    totalParticipants: 0,
    averageScore: 0,
  });
  const { showToast } = useToast();
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [activeMonitoringExam, setActiveMonitoringExam] = useState<any>(null);
  const [qrModalExam, setQrModalExam] = useState<any>(null);
  const [monitoringParticipants, setMonitoringParticipants] = useState<any[]>([]);

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

  const loadStatsAndExams = () => {
    // Stats
    api('/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .catch((err) => console.log('Analytics fetch error:', err));

    // Exams
    api('/exams')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExams(data.data);
        }
      })
      .catch((err) => console.log('Exams fetch error:', err));
  };

  useEffect(() => {
    loadStatsAndExams();
  }, []);

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
    <div className="space-y-8 animate-fade-in-fast">
      {/* Hero Welcome Banner */}
      <div className="saas-card p-6 md:p-8 bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Examigo Workspace SaaS
            </span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-extrabold ${
              user?.plan === 'PRO_AI' 
                ? 'bg-amber-50 border-amber-200 text-amber-700' 
                : user?.plan === 'PERSONAL'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              ● Paket Aktif: {user?.plan || 'FREE (Dasar)'}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Selamat Datang di Workspace <span className="text-indigo-600">Examigo</span>
          </h1>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed max-w-2xl font-normal">
            Platform SaaS cerdas untuk menghasilkan soal dari dokumen materi, mengelola bank soal terpadu, serta meluncurkan ujian online secara otomatis.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/ai-generator"
              className="saas-button-primary inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              Generate Soal via AI
            </Link>
            <Link
              to="/exam-builder"
              className="saas-button-secondary inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold"
            >
              <PlusCircle className="w-4 h-4 text-slate-500" />
              Buat Ujian Baru
            </Link>
            <Link
              to="/subscription"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 fill-current text-amber-200" />
              Upgrade ke Pro AI
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Onboarding Guide for New Teachers */}
      {stats.totalQuestions === 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl space-y-4 animate-fade-in-fast border border-indigo-700/50 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-[11px] font-bold border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Panduan Selamat Datang Examigo
              </div>
              <h2 className="text-xl font-black tracking-tight text-white">Mulai Buat Ujian Pertama Anda dalam 3 Langkah!</h2>
              <p className="text-xs text-indigo-200 font-medium leading-relaxed max-w-xl">
                Selamat datang di Examigo. Ikuti alur ringkas di bawah ini untuk meracik soal otomatis dengan AI dan mempublikasikannya ke siswa Anda.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link to="/ai-generator" className="p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all space-y-2 group">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-black text-xs flex items-center justify-center">1</span>
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xs font-bold text-white">1. Generasi Soal AI</h4>
              <p className="text-[11px] text-indigo-200 font-medium">Unggah materi PDF/DOCX untuk dibuatkan soal otomatis.</p>
            </Link>

            <Link to="/exam-builder" className="p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all space-y-2 group">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-black text-xs flex items-center justify-center">2</span>
                <FileText className="w-4 h-4 text-blue-300 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xs font-bold text-white">2. Racik & Dapatkan Kode</h4>
              <p className="text-[11px] text-indigo-200 font-medium">Atur durasi, acak pilihan, lalu terbitkan Kode Ujian.</p>
            </Link>

            <Link to="/analytics" className="p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all space-y-2 group">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-black text-xs flex items-center justify-center">3</span>
                <BarChart2 className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xs font-bold text-white">3. Pantau Nilai Real-Time</h4>
              <p className="text-[11px] text-indigo-200 font-medium">Terima skor otomatis & ekspor laporan PDF/Excel.</p>
            </Link>
          </div>
        </div>
      )}

      {/* Metrics Overview Cards with Tier Quota Limits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="saas-card p-5 bg-white border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Paket Ujian</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {stats.totalExams} 
              <span className="text-xs font-semibold text-slate-400">
                {user?.plan === 'FREE' ? ' / 1 Ujian (Free)' : user?.plan === 'PERSONAL' ? ' / 5 Ujian' : ' / ∞ (Pro)'}
              </span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="saas-card p-5 bg-white border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bank Soal Tersimpan</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {stats.totalQuestions} 
              <span className="text-xs font-semibold text-slate-400">
                {user?.plan === 'FREE' ? ' / 15 Soal (Free)' : user?.plan === 'PERSONAL' ? ' / 100 Soal' : ' / ∞ (Pro)'}
              </span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="saas-card p-5 bg-white border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Peserta Ujian</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalParticipants}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="saas-card p-5 bg-white border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nilai Rata-rata Murni</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.averageScore}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
            <BarChart2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Ujian & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="saas-card p-6 bg-white border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" /> Ujian Aktif & Dipublikasikan
              </h2>
              <Link to="/exam-builder" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-bold">
                Lihat Semua Ujian <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {exams.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
                  Belum ada ujian yang dibuat. Klik tombol <strong>Buat Ujian Baru</strong> di atas untuk memulai.
                </div>
              ) : (
                exams.map((e) => (
                  <div key={e.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{e.title}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                          DIPUBLIKASI
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Kode Akses: <code className="text-indigo-700 font-mono font-bold">{e.code}</code> • Durasi: {e.durationMinutes} Menit • {e.questionsCount} Soal
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/live-monitor/${e.id}`}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 transition-colors"
                        title="Monitor Live Peserta"
                      >
                        <Activity className="w-3.5 h-3.5 animate-pulse" /> Monitor Live
                      </Link>
                      <button
                        onClick={() => setQrModalExam(e)}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-sm"
                        title="Tampilkan QR Code Ujian"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/exam-room/${e.code}`);
                          showToast('Link ujian berhasil disalin ke clipboard!', 'success');
                        }}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-indigo-600 border border-slate-200 transition-colors shadow-sm"
                        title="Salin Link Ujian"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/exam-room/${e.code}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        Buka Ujian
                      </Link>
                      <button
                        onClick={() => handleDeleteExam(e.id)}
                        className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors shadow-sm"
                        title="Hapus Ujian"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Capabilities */}
        <div className="saas-card p-6 bg-white border border-slate-200/80 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Fitur AI Examigo
          </h2>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Upload Dokumen Materi</p>
                <p className="text-slate-500 font-medium">Mendukung format PDF, DOCX, PPTX, & TXT.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Kustomisasi Tipe & Kesulitan</p>
                <p className="text-slate-500 font-medium">Generate Pilihan Ganda, Essay, Benar/Salah, & Isian.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Auto Grading & Analitik</p>
                <p className="text-slate-500 font-medium">Koreksi otomatis soal objektif dan analisis grafik nilai murni.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Monitoring Modal */}
      {activeMonitoringExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setActiveMonitoringExam(null)} />
          <div className="relative w-full max-w-4xl p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto z-10 animate-fade-in-fast">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Live Monitoring: {activeMonitoringExam.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Kode Akses: {activeMonitoringExam.code} • Refresh otomatis tiap 5 detik</p>
              </div>
              <button
                onClick={() => setActiveMonitoringExam(null)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider bg-slate-50 text-[10px]">
                    <th className="py-2.5 px-3">Nama Peserta</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Progres</th>
                    <th className="py-2.5 px-3">Kecurangan</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Nilai Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monitoringParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                        Belum ada peserta yang bergabung di ujian ini.
                      </td>
                    </tr>
                  ) : (
                    monitoringParticipants.map((p) => (
                      <tr key={p.id} className="text-slate-700 hover:bg-slate-50/70">
                        <td className="py-3 px-3 font-bold text-slate-900">{p.studentName}</td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{p.studentEmail}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${p.progress}%` }}></div>
                            </div>
                            <span className="font-semibold text-slate-700">{p.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {p.cheatingCount > 0 ? (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.cheatingCount >= 3 ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse' : 'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}>
                              {p.cheatingCount} Pelanggaran
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {p.status === 'COMPLETED' ? 'Selesai' : 'Mengerjakan'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                          {p.status === 'COMPLETED' ? (
                            <span className={p.isPassed ? 'text-emerald-600' : 'text-red-600'}>
                              {p.score} ({p.isPassed ? 'Lulus' : 'Gagal'})
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
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

      {/* QR Code Modal */}
      {qrModalExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setQrModalExam(null)} />
          <div className="relative w-full max-w-sm p-6 rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col items-center gap-4 z-10 animate-fade-in-fast text-center">
            <div className="w-full flex items-center justify-between border-b border-slate-100 pb-2.5 text-left">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-indigo-600" /> QR Code Akses Ujian
              </h3>
              <button
                onClick={() => setQrModalExam(null)}
                className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900">{qrModalExam.title}</p>
              <p className="text-[11px] text-slate-500">Kode Akses: <code className="text-indigo-700 font-mono font-bold">{qrModalExam.code}</code></p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${window.location.origin}/exam-room/${qrModalExam.code}`)}`}
                alt="QR Code Ujian"
                className="w-[180px] h-[180px]"
              />
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/exam-room/${qrModalExam.code}`);
                showToast('Link ujian berhasil disalin ke clipboard!', 'success');
              }}
              className="saas-button-primary w-full py-2.5 text-xs font-bold"
            >
              Salin Link Ujian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
