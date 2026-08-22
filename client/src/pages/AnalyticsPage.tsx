import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart2, Download, TrendingUp, Users, Award, FileSpreadsheet, FileText, Filter, Eye, X, CheckCircle, XCircle, AlertTriangle, ShieldAlert, Search, Lock, Sparkles } from 'lucide-react';
import { api, useAuth } from '../lib/auth';
import { useToast } from '../components/Toast';
import { GRADE_LEVELS } from '../lib/constants';
import { formatRichText } from './QuestionBankPage';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const userPlan = user?.plan || 'FREE';
  const { showToast, dismissToast } = useToast();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [data, setData] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Participant Detail Modal State
  const [selectedParticipantDetail, setSelectedParticipantDetail] = useState<any | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const handleViewParticipantDetails = async (id: string) => {
    if (!id) return;
    setIsLoadingDetail(true);
    const toastId = showToast('Memuat lembar jawaban peserta...', 'loading');
    try {
      const res = await api(`/analytics/participant/${id}`);
      const result = await res.json();
      if (result.success) {
        setSelectedParticipantDetail(result.data);
      } else {
        showToast(result.message || 'Gagal memuat detail jawaban.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal terhubung ke server.', 'error');
    } finally {
      setIsLoadingDetail(false);
      dismissToast(toastId);
    }
  };

  useEffect(() => {
    api('/subjects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubjects(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const loadAnalytics = () => {
    const query = new URLSearchParams();
    if (selectedSubjectId) query.append('subjectId', selectedSubjectId);
    if (selectedGrade) query.append('grade', selectedGrade);

    const url = `/analytics?${query.toString()}`;
    api(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
        } else {
          showToast('Gagal memuat analitik.', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        showToast('Koneksi server gagal.', 'error');
      });
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedSubjectId, selectedGrade]);

  const filteredResults = (data?.recentResults || []).filter((r: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = (r.studentName || '').toLowerCase().includes(q);
    const emailMatch = (r.studentEmail || '').toLowerCase().includes(q);
    const examMatch = (r.examTitle || '').toLowerCase().includes(q);
    return nameMatch || emailMatch || examMatch;
  });

  const getExportFilename = (extension: string) => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const selectedSubjObj = subjects.find((s) => s.id === selectedSubjectId);
    const subjPart = selectedSubjObj ? `_${selectedSubjObj.name.replace(/\s+/g, '_')}` : '';
    const gradePart = selectedGrade ? `_${selectedGrade.replace(/\s+/g, '_')}` : '';
    const searchPart = searchQuery.trim() ? `_Cari-${searchQuery.trim().replace(/\s+/g, '_')}` : '';
    return `Hasil_Ujian_Examigo${subjPart}${gradePart}${searchPart}_${dateStr}.${extension}`;
  };

  const handleExportCSV = () => {
    if (filteredResults.length === 0) {
      showToast('Tidak ada data untuk diekspor', 'error');
      return;
    }

    try {
      const headers = ['Nama Peserta', 'Email', 'Ujian', 'Mata Pelajaran', 'Tingkatan / Kelas', 'Nilai', 'Status', 'Tanggal'];
      const rows = filteredResults.map((r: any) => [
        `"${(r.studentName || '').replace(/"/g, '""')}"`,
        `"${(r.studentEmail || '').replace(/"/g, '""')}"`,
        `"${(r.examTitle || '').replace(/"/g, '""')}"`,
        `"${(r.subjectName || 'Umum').replace(/"/g, '""')}"`,
        `"${(r.grade || 'Umum').replace(/"/g, '""')}"`,
        r.score,
        r.status,
        `"${r.submittedAt || '-'}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((e: any) => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', getExportFilename('csv'));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Berhasil mengekspor ke CSV!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengekspor ke CSV.', 'error');
    }
  };

  const handleExportExcel = () => {
    if (filteredResults.length === 0) {
      showToast('Tidak ada data untuk diekspor', 'error');
      return;
    }

    try {
      const wsData = filteredResults.map((r: any) => ({
        'Nama Peserta': r.studentName,
        'Email': r.studentEmail || '-',
        'Ujian': r.examTitle,
        'Mata Pelajaran': r.subjectName || 'Umum',
        'Tingkatan / Kelas': r.grade || 'Umum',
        'Nilai': r.score,
        'Status': r.status,
        'Tanggal Selesai': r.submittedAt || '-',
      }));

      const ws = XLSX.utils.json_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Hasil Ujian');
      
      XLSX.writeFile(wb, getExportFilename('xlsx'));
      showToast('Berhasil mengekspor ke Excel!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengekspor data ke Excel.', 'error');
    }
  };

  const handleExportPDF = () => {
    if (userPlan !== 'PRO_AI') {
      showToast('🔒 Ekspor Laporan PDF hanya tersedia untuk pengguna Paket Pro AI. Silakan upgrade paket Anda.', 'error');
      setShowUpgradeModal(true);
      return;
    }

    if (filteredResults.length === 0) {
      showToast('Tidak ada data untuk diekspor', 'error');
      return;
    }

    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text('Laporan Hasil Ujian - Examigo', 14, 15);
      
      const selectedSubjObj = subjects.find((s) => s.id === selectedSubjectId);
      const filterLabel = [
        selectedSubjObj ? `Mapel: ${selectedSubjObj.name}` : null,
        selectedGrade ? `Kelas: ${selectedGrade}` : null,
        searchQuery.trim() ? `Pencarian: "${searchQuery}"` : null,
      ].filter(Boolean).join(' | ') || 'Semua Mapel & Kelas';

      doc.setFontSize(10);
      doc.text(`Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID')}`, 14, 22);
      doc.text(`Filter: ${filterLabel}`, 14, 27);
      doc.text(`Rata-Rata Nilai: ${data.averageScore}`, 14, 32);
      
      const tableBody = filteredResults.map((r: any) => [
        r.studentName,
        r.examTitle,
        r.subjectName || 'Umum',
        r.grade || 'Umum',
        r.score,
        r.status
      ]);

      autoTable(doc, {
        startY: 38,
        head: [['Nama Peserta', 'Ujian', 'Mapel', 'Kelas', 'Nilai', 'Status']],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: [79, 107, 246] },
      });

      doc.save(getExportFilename('pdf'));
      showToast('Berhasil mengekspor ke PDF!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengekspor data ke PDF.', 'error');
    }
  };

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-400 flex items-center justify-center min-h-[300px]">
        <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full mr-2" />
        Memuat Analitik...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-fast">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-7 h-7 text-indigo-600" /> Dashboard Analitik & Export
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Evaluasi hasil belajar peserta, rata-rata nilai, persentase kelulusan, serta ekspor data ke CSV, Excel, & PDF.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="saas-button-secondary px-3.5 py-2 text-xs font-bold flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>
          <button
            onClick={handleExportExcel}
            className="saas-button-secondary px-3.5 py-2 text-xs font-bold flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="saas-button-secondary px-3.5 py-2 text-xs font-bold flex items-center gap-2 relative border-indigo-200 bg-indigo-50/40 text-indigo-700"
          >
            <FileText className="w-4 h-4 text-indigo-600" /> Export PDF 🔒 <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-black">PRO AI</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="saas-card p-4 bg-white border border-slate-200/80 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-wrap">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0">
            <Filter className="w-4 h-4 text-indigo-600" /> Filter & Cari Data:
          </span>

          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama peserta atau email..."
              className="saas-input pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="saas-input sm:w-52"
          >
            <option value="">-- Semua Mata Pelajaran --</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="saas-input sm:w-52"
          >
            <option value="">-- Semua Tingkatan / Kelas --</option>
            {GRADE_LEVELS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {(selectedSubjectId || selectedGrade || searchQuery) && (
          <button
            onClick={() => {
              setSelectedSubjectId('');
              setSelectedGrade('');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 shrink-0"
          >
            Reset Filter & Cari
          </button>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="saas-card p-5 bg-white border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Rata-Rata Nilai Ujian</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{data.averageScore}</p>
        </div>

        <div className="saas-card p-5 bg-white border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Tingkat Kelulusan (Passing Rate)</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{data.passingRatePercentage}%</p>
        </div>

        <div className="saas-card p-5 bg-white border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Total Peserta Mengerjakan</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{data.totalParticipants} Peserta</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Chart */}
        <div className="saas-card p-6 bg-white border border-slate-200/80 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Distribusi Kesulitan Soal</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.difficultyDistribution}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', color: '#0f172a' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rasio Kelulusan Chart */}
        <div className="saas-card p-6 bg-white border border-slate-200/80 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Rasio Kelulusan Peserta</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Lulus', value: filteredResults.filter((r: any) => r.status === 'LULUS').length, color: '#16a34a' },
                    { name: 'Tidak Lulus', value: filteredResults.filter((r: any) => r.status !== 'LULUS').length, color: '#dc2626' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Lulus', color: '#16a34a' },
                    { name: 'Tidak Lulus', color: '#dc2626' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }}
                />
                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-xs text-slate-700 font-semibold">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Results Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Hasil Peserta Terbaru</h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
              {filteredResults.length} Peserta
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">💡 Klik nama peserta untuk melihat rincian lembar jawaban</span>
        </div>

        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 italic">
              {searchQuery ? (
                <>Tidak ada peserta yang cocok dengan pencarian kata kunci "<strong className="text-slate-700">{searchQuery}</strong>".</>
              ) : (
                <>Belum ada ujian yang dikerjakan oleh peserta.</>
              )}
            </div>
          ) : (
            filteredResults.map((r: any, idx: number) => (
              <div
                key={r.id || idx}
                onClick={() => r.id && handleViewParticipantDetails(r.id)}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-100/60 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                      {r.studentName} <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                    </p>
                    {r.subjectName && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-semibold">
                        {r.subjectName}
                      </span>
                    )}
                    {r.grade && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold">
                        {r.grade}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{r.examTitle} • <span className="font-mono text-slate-600">{r.studentEmail}</span></p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{r.score}</p>
                    <span className={`text-[10px] font-extrabold ${r.status === 'LULUS' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {r.status}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (r.id) handleViewParticipantDetails(r.id);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold transition-colors hidden sm:flex items-center gap-1 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" /> Detail Jawaban
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Item Analysis Table */}
      {data?.itemAnalysis && data.itemAnalysis.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Analisis Tingkat Kesulitan Soal (Item Analysis)</h2>
              <p className="text-xs text-slate-500 mt-1">Daftar soal yang paling sering salah dijawab (Tingkat kesulitan berdasarkan akurasi peserta)</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {data.itemAnalysis.map((item: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200">
                      #{idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.accuracy < 40 ? 'bg-red-100 text-red-700' : 
                      item.accuracy < 75 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      Akurasi: {item.accuracy}%
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-2" dangerouslySetInnerHTML={{ __html: formatRichText(item.questionText) }} />
                </div>

                <div className="flex gap-2 sm:gap-4 shrink-0 text-xs font-bold bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-center">
                    <span className="text-slate-500 block text-[10px] mb-0.5">Benar</span>
                    <span className="text-emerald-600">{item.correctCount}</span>
                  </div>
                  <div className="w-px bg-slate-200"></div>
                  <div className="text-center">
                    <span className="text-slate-500 block text-[10px] mb-0.5">Salah</span>
                    <span className="text-red-600">{item.incorrectCount}</span>
                  </div>
                  <div className="w-px bg-slate-200"></div>
                  <div className="text-center">
                    <span className="text-slate-500 block text-[10px] mb-0.5">Total</span>
                    <span className="text-slate-800">{item.totalAnswers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participant Answer Review Modal */}
      {selectedParticipantDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-3xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{selectedParticipantDetail.studentName}</h3>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-extrabold ${selectedParticipantDetail.result?.isPassed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {selectedParticipantDetail.result?.isPassed ? 'LULUS' : 'TIDAK LULUS'}
                  </span>
                  {selectedParticipantDetail.cheatingCount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> {selectedParticipantDetail.cheatingCount} Pelanggaran
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Email: <span className="text-slate-700 font-mono font-medium">{selectedParticipantDetail.studentEmail}</span> • Ujian: <span className="text-slate-900 font-bold">{selectedParticipantDetail.examTitle}</span> ({selectedParticipantDetail.subjectName} - {selectedParticipantDetail.grade})
                </p>
              </div>
              <button
                onClick={() => setSelectedParticipantDetail(null)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Summary Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Skor Diperoleh</p>
                <p className="text-2xl font-black text-blue-600">
                  {selectedParticipantDetail.result?.totalScore || 0} <span className="text-xs font-semibold text-slate-500">/ {selectedParticipantDetail.result?.maxScore || 0} Poin</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-500">Nilai Akhir Murni</p>
                <p className="text-3xl font-black text-slate-900">{selectedParticipantDetail.result?.percentage || 0}</p>
              </div>
            </div>

            {/* Questions Answer Review */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Rincian Jawaban per Soal ({selectedParticipantDetail.questions?.length || 0} Soal)</h4>
              
              {selectedParticipantDetail.questions?.map((q: any, qIdx: number) => {
                const ans = q.studentAnswer;
                const isCorrect = ans.isCorrect === true && ans.score === q.pointsPossible;
                const isHalfCorrect = ans.isCorrect === true && ans.score > 0 && ans.score < q.pointsPossible;

                return (
                  <div key={qIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 text-[11px] font-bold shadow-sm">
                          Soal #{qIdx + 1} ({q.type})
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[11px] font-semibold">
                          {q.difficulty}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {ans.score} / {q.pointsPossible} Poin
                        </span>
                      </div>

                      {/* Status Badge */}
                      {isCorrect ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1 shrink-0">
                          <CheckCircle className="w-3.5 h-3.5" /> Benar (100%)
                        </span>
                      ) : isHalfCorrect ? (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1 shrink-0">
                          <AlertTriangle className="w-3.5 h-3.5" /> Setengah Benar (50%)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1 shrink-0">
                          <XCircle className="w-3.5 h-3.5" /> Salah (0%)
                        </span>
                      )}
                    </div>

                    {/* Question Text */}
                    <p className="text-xs sm:text-sm font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: formatRichText(q.questionText) }} />

                    {/* Question Image if present */}
                    {q.imageUrl && (
                      <div className="pt-1">
                        <img src={q.imageUrl} alt="Gambar Soal" className="max-h-48 rounded-xl border border-slate-200 object-contain bg-white p-1" />
                      </div>
                    )}

                    {/* Multiple Choice / True False choices list */}
                    {q.choices && q.choices.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.choices.map((c: any, cIdx: number) => {
                          const isSelectedByStudent = ans.selectedChoiceId === c.id;
                          const isTargetCorrect = c.isCorrect;

                          let choiceStyle = 'bg-white border-slate-200 text-slate-700';
                          if (isTargetCorrect) {
                            choiceStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold';
                          } else if (isSelectedByStudent && !isTargetCorrect) {
                            choiceStyle = 'bg-red-50 border-red-300 text-red-800 font-bold';
                          }

                          return (
                            <div key={cIdx} className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${choiceStyle}`}>
                              <span dangerouslySetInnerHTML={{ __html: formatRichText(c.text) }} />
                              <div className="flex items-center gap-1 shrink-0">
                                {isTargetCorrect && <span className="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800 font-extrabold">Kunci</span>}
                                {isSelectedByStudent && <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-800 font-extrabold">Dipilih Siswa</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Essay / Short Answer Written Response */
                      <div className="space-y-2 pt-1">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Jawaban Siswa:</label>
                          <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-mono whitespace-pre-wrap">
                            {ans.textAnswer || <span className="text-slate-400 italic">Siswa tidak mengisi jawaban.</span>}
                          </div>
                        </div>

                        {q.explanation && (
                          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 italic font-medium">
                            💡 Kunci / Acuan Jawaban: {q.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedParticipantDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal Popup */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center relative overflow-hidden animate-fade-in-fast">
            <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900">🔒 Ekspor PDF Khusus Paket Pro AI</h3>
              <p className="text-xs text-slate-600 font-medium">
                Fitur cetak laporan & ekspor dokumen PDF merupakan benefit eksklusif untuk pengguna <strong>Paket Pro AI (Rp 149K)</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-left space-y-2">
              <p className="font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Benefit Paket Pro AI:
              </p>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                <li>• 📄 Cetak & Ekspor PDF Laporan Hasil Ujian</li>
                <li>• 🚀 300 Soal AI per Bulan + AI Vision Gambar</li>
                <li>• 🔒 Advanced Fullscreen Lock Anti-Cheat</li>
                <li>• 👥 Multi-Teacher Access (3 Pengajar)</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Tutup
              </button>
              <Link
                to="/checkout?plan=pro_ai&billing=monthly"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Upgrade ke Pro AI
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
