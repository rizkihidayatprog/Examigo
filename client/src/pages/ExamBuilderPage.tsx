import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle2, Shuffle, ShieldCheck, Eye, Layers, GripVertical, GraduationCap, Image as ImageIcon, Lock, X } from 'lucide-react';
import { api, useAuth } from '../lib/auth';
import { useToast } from '../components/Toast';
import { formatRichText } from '../lib/formatters';
import { GRADE_LEVELS } from '../lib/constants';

export default function ExamBuilderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast, dismissToast } = useToast();
  const userPlan = user?.plan || 'FREE';
  const [questions, setQuestions] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [minPassingScore, setMinPassingScore] = useState(70);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [randomizeChoices, setRandomizeChoices] = useState(true);
  const [antiCheatMode, setAntiCheatMode] = useState<'BASIC' | 'ADVANCED'>('BASIC');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [autoSelectCount, setAutoSelectCount] = useState<string>('');

  const getMaxQuestionsLimit = (plan: string) => {
    if (plan === 'PERSONAL') return 100;
    if (plan === 'PRO_AI') return 300;
    return 15; // FREE tier max 15 questions
  };

  const maxQuestionsLimit = getMaxQuestionsLimit(userPlan);

  const handleAutoSelectRandom = (targetCountText: string) => {
    setAutoSelectCount(targetCountText);
    let count = parseInt(targetCountText, 10);
    if (isNaN(count) || count <= 0) {
      return;
    }

    if (count > maxQuestionsLimit) {
      showToast(`🔒 Paket ${userPlan} dibatasi maksimal ${maxQuestionsLimit} soal per ujian. Upgrade Paket untuk memilih lebih banyak!`, 'error');
      setShowUpgradeModal(true);
      count = maxQuestionsLimit;
      setAutoSelectCount(String(maxQuestionsLimit));
    }

    const matching = questions.filter((q) => {
      const matchSubject = !selectedSubjectId || q.subjectId === selectedSubjectId;
      const matchGrade = !selectedGrade || q.grade === selectedGrade;
      return matchSubject && matchGrade;
    });

    if (matching.length === 0) {
      showToast('Tidak ada soal yang sesuai dengan filter mata pelajaran / tingkatan.', 'error');
      setSelectedQuestionIds([]);
      return;
    }

    // Shuffle array
    const shuffled = [...matching].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, Math.min(count, matching.length)).map((q) => q.id);

    setSelectedQuestionIds(picked);
    showToast(`Berhasil mengacak dan memilih ${picked.length} soal secara otomatis!`, 'success');
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedCode, setPublishedCode] = useState<string | null>(null);
  const [password, setPassword] = useState('');

  const [activeTab, setActiveTab] = useState<'select' | 'reorder'>('select');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    // Load subjects
    api('/subjects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubjects(data.data);
        }
      })
      .catch((err) => console.error(err));

    // Load questions
    api('/questions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setQuestions(data.data);
          setSelectedQuestionIds(data.data.map((q: any) => q.id));
        } else {
          showToast('Gagal memuat soal dari bank soal.', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        showToast('Kesalahan koneksi memuat soal.', 'error');
      });
  }, []);

  const toggleQuestionSelect = (id: string) => {
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter((qId) => qId !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const reordered = [...selectedQuestionIds];
    const draggedItem = reordered[draggedIndex];
    reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setSelectedQuestionIds(reordered);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handlePublishExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Judul ujian tidak boleh kosong.', 'error');
      return;
    }
    if (!selectedSubjectId) {
      showToast('Silakan pilih Mata Pelajaran ujian terlebih dahulu.', 'error');
      return;
    }
    if (!selectedGrade) {
      showToast('Silakan pilih Tingkatan Sekolah ujian terlebih dahulu.', 'error');
      return;
    }
    if (selectedQuestionIds.length === 0) {
      showToast('Pilih setidaknya 1 soal untuk ujian.', 'error');
      return;
    }

    setIsSubmitting(true);
    const toastId = showToast('Mempublikasikan ujian...', 'loading');
    try {
      const res = await api('/exams', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          durationMinutes,
          minPassingScore,
          password: password || undefined,
          randomizeQuestions,
          randomizeChoices,
          questionIds: selectedQuestionIds,
          subjectId: selectedSubjectId || undefined,
          grade: selectedGrade || undefined,
          startTime: startTime ? new Date(startTime).toISOString() : undefined,
          endTime: endTime ? new Date(endTime).toISOString() : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPublishedCode(data.data.code);
        showToast('Ujian berhasil dipublikasikan!', 'success');
      } else {
        showToast(data.message || 'Gagal mempublikasikan ujian.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan koneksi.', 'error');
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchSubject = !selectedSubjectId || q.subjectId === selectedSubjectId;
    const matchGrade = !selectedGrade || q.grade === selectedGrade;
    return matchSubject && matchGrade;
  });

  return (
    <div className="space-y-8 animate-fade-in-fast">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Layers className="w-7 h-7 text-indigo-600" /> Exam Builder & Anti-Cheat
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Rakit paket ujian, atur urutan soal, pasang proteksi anti-kecurangan, dan publikasikan kode akses peserta.
        </p>
      </div>

      {userPlan === 'FREE' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-black text-amber-950">🔒 Batasan Paket Free (1 Ujian Aktif & Maks 5 Peserta)</p>
              <p className="text-[11px] font-normal text-amber-800">
                Upgrade ke <strong>Personal (5 Ujian & 50 Peserta)</strong> atau <strong>Pro AI (15 Ujian & 200 Peserta + Fullscreen Anti-Cheat)</strong>.
              </p>
            </div>
          </div>
          <Link
            to="/checkout?plan=personal&billing=monthly"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs text-center shrink-0 transition-colors"
          >
            Upgrade Paket
          </Link>
        </div>
      )}

      {publishedCode ? (
        <div className="p-8 rounded-2xl bg-white border border-emerald-200 text-center space-y-5 max-w-md mx-auto shadow-xl">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-xl font-extrabold text-slate-900">Ujian Berhasil Dipublikasikan!</h2>
          
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Kode Akses Ujian</p>
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 font-mono text-2xl font-black text-indigo-700 tracking-wider">
              {publishedCode}
            </div>
          </div>

          {/* QR Code Container */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-3">
            <p className="text-xs font-bold text-slate-700">Scan QR Code untuk Mengikuti Ujian</p>
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${window.location.origin}/exam-room/${publishedCode}`)}`}
                alt="QR Code Ujian"
                className="w-[150px] h-[150px]"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/exam-room/${publishedCode}`);
                showToast('Link ujian berhasil disalin ke clipboard!', 'success');
              }}
              className="text-[11px] text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4"
            >
              Salin Link Ujian
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate(`/exam-room/${publishedCode}`)}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
            >
              Simulasi Ujian
            </button>
            <button
              onClick={() => {
                setPublishedCode(null);
                setTitle('');
                setDescription('');
                setPassword('');
                setAutoSelectCount('');
              }}
              className="flex-1 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm"
            >
              Buat Ujian Lain
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePublishExam} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Settings */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" /> Pengaturan Ujian
              </h2>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Judul Ujian</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ujian Tengah Semester - Pemrograman Web"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mata Pelajaran (Subject) <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={selectedSubjectId}
                  required
                  onChange={(e) => {
                    const subjId = e.target.value;
                    setSelectedSubjectId(subjId);
                    // Filter logic for initial selection
                    const filtered = questions
                      .filter((q) => (!subjId || q.subjectId === subjId) && (!selectedGrade || q.grade === selectedGrade))
                      .map((q) => q.id);
                    setSelectedQuestionIds(filtered);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  <option value="">-- Pilih Mata Pelajaran --</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tingkatan Sekolah <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={selectedGrade}
                  required
                  onChange={(e) => {
                    const grade = e.target.value;
                    setSelectedGrade(grade);
                    // Filter logic for initial selection
                    const filtered = questions
                      .filter((q) => (!selectedSubjectId || q.subjectId === selectedSubjectId) && (!grade || q.grade === grade))
                      .map((q) => q.id);
                    setSelectedQuestionIds(filtered);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  <option value="">-- Pilih Tingkatan Sekolah --</option>
                  {GRADE_LEVELS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi / Petunjuk Ujian</label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan petunjuk pengerjaan atau deskripsi singkat ujian..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 block">Jumlah Soal Ujian (Pilih & Acak Otomatis)</label>
                  <span className="text-[10px] text-slate-500 font-semibold">Tersedia: {filteredQuestions.length} Soal</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    max={filteredQuestions.length || 100}
                    placeholder="Ketik jumlah soal (contoh: 10)"
                    value={autoSelectCount}
                    onChange={(e) => handleAutoSelectRandom(e.target.value)}
                    className="flex-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (autoSelectCount) {
                        handleAutoSelectRandom(autoSelectCount);
                      } else {
                        handleAutoSelectRandom(String(Math.min(10, filteredQuestions.length)));
                      }
                    }}
                    className="px-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                    title="Acak dan Pilih Soal Ujian Otomatis"
                  >
                    <Shuffle className="w-3.5 h-3.5" /> Acak Soal
                  </button>
                </div>
                {autoSelectCount && selectedQuestionIds.length > 0 && (
                  <p className="text-[10px] text-emerald-700 mt-1 font-bold">
                    ✓ Terpilih {selectedQuestionIds.length} soal acak otomatis dari {filteredQuestions.length} soal tersedia.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Durasi (Menit)</label>
                  <input
                    type="number"
                    min={5}
                    max={300}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nilai Min. Kelulusan (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={minPassingScore}
                    onChange={(e) => setMinPassingScore(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Jadwal Mulai Ujian (Opsional)</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Jadwal Selesai Ujian (Opsional)</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="text-xs font-bold text-slate-700 block mb-1">Password Ujian (Opsional)</label>
                <input
                  type="text"
                  placeholder="Kosongkan jika tanpa password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <hr className="border-slate-200" />

              {/* Anti-Cheat & Security Options */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" /> Mode Proteksi Anti-Cheat
                </label>
                <div className="space-y-1.5 text-xs font-medium">
                  <label
                    onClick={() => setAntiCheatMode('BASIC')}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                      antiCheatMode === 'BASIC' ? 'bg-indigo-50 border-indigo-300 font-bold' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <input type="radio" name="antiCheat" checked={antiCheatMode === 'BASIC'} readOnly className="text-indigo-600 focus:ring-0" />
                    <span>Basic Anti-Cheat (Deteksi Pindah Tab)</span>
                  </label>

                  <label
                    onClick={() => {
                      if (userPlan !== 'PRO_AI') {
                        showToast('🔒 Advanced Fullscreen Lock hanya tersedia untuk Paket Pro AI. Silakan Upgrade Paket!', 'error');
                        setShowUpgradeModal(true);
                        return;
                      }
                      setAntiCheatMode('ADVANCED');
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer ${
                      userPlan !== 'PRO_AI'
                        ? 'bg-slate-100 border-slate-200 opacity-80 cursor-not-allowed text-slate-500'
                        : antiCheatMode === 'ADVANCED'
                        ? 'bg-indigo-50 border-indigo-300 font-bold text-indigo-950'
                        : 'bg-indigo-50/50 border-indigo-200 text-indigo-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input type="radio" name="antiCheat" checked={antiCheatMode === 'ADVANCED'} readOnly className="text-indigo-600 focus:ring-0" />
                      <span className="font-bold">Advanced Fullscreen Lock & Block Copy</span>
                    </div>
                    <span className="text-[10px] bg-indigo-600 text-white font-extrabold px-2 py-0.5 rounded-full">Pro AI 🔒</span>
                  </label>
                </div>
              </div>

              {/* Acak Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomizeQuestions}
                    onChange={(e) => setRandomizeQuestions(e.target.checked)}
                    className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0 w-4 h-4"
                  />
                  <span className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5 text-blue-600" /> Acak Urutan Soal untuk Tiap Peserta
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomizeChoices}
                    onChange={(e) => setRandomizeChoices(e.target.checked)}
                    className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0 w-4 h-4"
                  />
                  <span className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5 text-purple-600" /> Acak Pilihan Jawaban (A/B/C/D)
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  disabled={selectedQuestionIds.length === 0}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /> Preview
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || selectedQuestionIds.length === 0}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Memproses...' : 'Publikasikan Ujian'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Question Selection & Ordering */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex border-b border-slate-200 pb-2 justify-between items-center">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('select')}
                    className={`text-xs font-extrabold pb-2 transition-all ${
                      activeTab === 'select'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    1. Pilih Soal ({selectedQuestionIds.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('reorder')}
                    className={`text-xs font-extrabold pb-2 transition-all ${
                      activeTab === 'reorder'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    2. Urutkan Soal
                  </button>
                </div>
              </div>

              {activeTab === 'select' ? (
                <div className="space-y-4">
                  {/* Grade Filter Bar */}
                  <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => setSelectedGrade('')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
                        selectedGrade === ''
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Semua Tingkat
                    </button>
                    {GRADE_LEVELS.map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setSelectedGrade(grade)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
                          selectedGrade === grade
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                    {questions.filter((q) => 
                    (!selectedSubjectId || q.subjectId === selectedSubjectId) && 
                    (!selectedGrade || q.grade === selectedGrade)
                  ).length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center italic">Tidak ada soal untuk filter ini.</p>
                  ) : (
                    questions
                      .filter((q) => 
                        (!selectedSubjectId || q.subjectId === selectedSubjectId) && 
                        (!selectedGrade || q.grade === selectedGrade)
                      )
                      .map((q, idx) => (
                        <div
                          key={q.id || idx}
                          onClick={() => toggleQuestionSelect(q.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedQuestionIds.includes(q.id)
                              ? 'bg-blue-50 border-blue-400 text-slate-900 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] text-slate-800 font-bold uppercase">
                                {q.type}
                              </span>
                              {q.grade && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-[10px] text-amber-800 font-semibold flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3 text-amber-600" /> {q.grade}
                                </span>
                              )}
                              {q.imageUrl && (
                                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-[10px] text-purple-800 font-semibold flex items-center gap-1">
                                  <ImageIcon className="w-3 h-3 text-purple-600" /> Ada Gambar
                                </span>
                              )}
                            </div>
                            <input
                              type="checkbox"
                              checked={selectedQuestionIds.includes(q.id)}
                              readOnly
                              className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0 w-4 h-4"
                            />
                          </div>
                          <p className="text-xs font-bold text-slate-900 line-clamp-2" dangerouslySetInnerHTML={{ __html: formatRichText(q.text) }} />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {selectedQuestionIds.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center italic">Silakan pilih soal di tab sebelah kiri terlebih dahulu.</p>
                  ) : (
                    selectedQuestionIds.map((qId, idx) => {
                      const q = questions.find((item) => item.id === qId);
                      if (!q) return null;
                      return (
                        <div
                          key={q.id || idx}
                          draggable
                          onDragStart={(e) => handleDragStart(e, idx)}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDragEnd={handleDragEnd}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 flex items-center gap-3 active:scale-[0.98] transition-transform cursor-grab active:cursor-grabbing text-slate-900 shadow-sm"
                        >
                          <GripVertical className="w-4 h-4 text-slate-400 shrink-0 cursor-grab" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate" dangerouslySetInnerHTML={{ __html: formatRichText(q.text) }} />
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold uppercase border border-slate-200">
                                {q.type === 'MULTIPLE_CHOICE' ? 'Pilihan Ganda' : 'Esai'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-semibold">Urutan: {idx + 1}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      )}

      {/* Upgrade Modal Popup */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center relative overflow-hidden animate-fade-in-fast">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900">Batas Paket Tercapai</h3>
              <p className="text-xs text-slate-600 font-medium">
                Fitur atau kapasitas ini melampaui batas benefit <strong>Paket {userPlan}</strong> Anda. Upgrade ke paket yang lebih tinggi untuk membuka batasan ini!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-left space-y-2">
              <p className="font-bold text-indigo-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" /> Benefit Batasan Paket:
              </p>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                <li>• 🆓 <strong>Free</strong>: Maks 15 Soal, 5 Peserta, 1 Ujian Aktif</li>
                <li>• 👤 <strong>Personal</strong>: Maks 100 Soal, 50 Peserta, 5 Ujian Aktif</li>
                <li>• ⭐ <strong>Pro AI</strong>: Maks 300 Soal, 200 Peserta, 15 Ujian Aktif + Fullscreen Lock</li>
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
                to="/checkout?plan=personal&billing=monthly"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                Upgrade Paket
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden animate-fade-in-fast">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" /> Preview Ujian
              </h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-1 mb-8">
                <h1 className="text-2xl font-black text-slate-900">{title || 'Judul Ujian Belum Diisi'}</h1>
                <p className="text-sm text-slate-600">{description || 'Tidak ada deskripsi.'}</p>
                <div className="flex gap-4 mt-2 text-xs font-semibold text-slate-500">
                  <span>Waktu: {durationMinutes} Menit</span>
                  <span>Passing Score: {minPassingScore}%</span>
                  <span>Jumlah Soal: {selectedQuestionIds.length}</span>
                </div>
              </div>

              {selectedQuestionIds.map((qId, idx) => {
                const q = questions.find((item) => item.id === qId);
                if (!q) return null;
                return (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                        {idx + 1}
                      </div>
                      <div className="text-sm font-medium text-slate-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatRichText(q.text) }} />
                    </div>

                    <div className="pl-11 space-y-2">
                      {q.type === 'MULTIPLE_CHOICE' || q.type === 'TRUE_FALSE' ? (
                        q.choices?.map((c: any, cIdx: number) => (
                          <div key={c.id} className={`p-3 rounded-xl border flex items-center gap-3 text-sm ${c.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                            <span className="w-6 h-6 shrink-0 rounded bg-white/50 border border-inherit flex items-center justify-center font-bold text-xs uppercase">
                              {String.fromCharCode(65 + cIdx)}
                            </span>
                            <span dangerouslySetInnerHTML={{ __html: formatRichText(c.text) }} />
                            {c.isCorrect && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                          </div>
                        ))
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-400 italic">
                          Kolom isian siswa (Esai / Singkat)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm transition-colors"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)} />
          <div className="relative w-full max-w-sm p-6 rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col items-center gap-4 z-10 animate-fade-in-fast text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Batas Kuota {userPlan} Tercapai</h3>
            <p className="text-sm text-slate-500">
              Paket {userPlan} Anda hanya dapat memilih maksimal {maxQuestionsLimit} soal per ujian. Silakan upgrade paket Anda untuk membuka lebih banyak soal.
            </p>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => navigate('/subscription')}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors"
              >
                Upgrade Paket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
