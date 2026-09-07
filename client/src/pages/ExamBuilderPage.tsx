import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle2, Shuffle, ShieldCheck, Eye, Layers, GripVertical, GraduationCap, Image as ImageIcon, Lock, X, Award, Search, UserCheck, Plus, Trash2, Hash, ListOrdered, Phone, AlertTriangle, Check, User, Star } from 'lucide-react';
import { api, useAuth } from '../lib/auth';
import { useToast } from '../components/Toast';
import { formatRichText } from '../lib/formatters';
import { GRADE_LEVELS, CURRICULUM_SUBJECTS, getJenjangFromGrade } from '../lib/constants';
import DynamicQRCode from '../components/common/DynamicQRCode';
import Pagination from '../components/common/Pagination';

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

  // Search & Pagination states for Bank Soal selection
  const [questionSearchQuery, setQuestionSearchQuery] = useState('');
  const [questionPage, setQuestionPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(10);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [minPassingScore, setMinPassingScore] = useState(70);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [randomizeChoices, setRandomizeChoices] = useState(true);
  const [hasCertificate, setHasCertificate] = useState(true);
  const [antiCheatMode, setAntiCheatMode] = useState<'BASIC' | 'ADVANCED'>('BASIC');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Participant Entry Form Configuration (Custom fields: NIS, phone, absen, email, custom, etc.)
  const [participantFields, setParticipantFields] = useState<Array<{
    id: string;
    label: string;
    placeholder?: string;
    type: 'text' | 'email' | 'number' | 'tel';
    required: boolean;
    enabled: boolean;
    isLocked?: boolean;
  }>>([
    { id: 'name', label: 'Nama Lengkap Siswa', placeholder: 'Ketik nama lengkap Anda', type: 'text', required: true, enabled: true, isLocked: true },
    { id: 'email', label: 'Email Siswa', placeholder: 'nama@sekolah.sch.id', type: 'email', required: false, enabled: true },
    { id: 'nis', label: 'NIS / NISN', placeholder: 'Contoh: 12345678', type: 'text', required: false, enabled: false },
    { id: 'studentClass', label: 'Kelas / Rombel', placeholder: 'Contoh: XII MIPA 1', type: 'text', required: false, enabled: false },
    { id: 'absentNo', label: 'Nomor Absen', placeholder: 'Contoh: 12', type: 'number', required: false, enabled: false },
    { id: 'phone', label: 'No. WhatsApp / HP', placeholder: 'Contoh: 08123456789', type: 'tel', required: false, enabled: false },
  ]);

  const toggleParticipantFieldEnabled = (id: string) => {
    setParticipantFields((prev) =>
      prev.map((f) => (f.id === id && !f.isLocked ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const toggleParticipantFieldRequired = (id: string) => {
    setParticipantFields((prev) =>
      prev.map((f) => (f.id === id && !f.isLocked ? { ...f, required: !f.required } : f))
    );
  };

  const updateParticipantFieldLabel = (id: string, label: string) => {
    setParticipantFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, label } : f))
    );
  };

  const addCustomParticipantField = () => {
    const customId = `custom_${Date.now()}`;
    setParticipantFields((prev) => [
      ...prev,
      {
        id: customId,
        label: 'Bidang Baru',
        placeholder: 'Masukkan data...',
        type: 'text',
        required: false,
        enabled: true,
        isLocked: false,
      },
    ]);
  };

  const removeParticipantField = (id: string) => {
    setParticipantFields((prev) => prev.filter((f) => f.id !== id || f.isLocked));
  };

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
      showToast(`Paket ${userPlan} dibatasi maksimal ${maxQuestionsLimit} soal per ujian. Upgrade Paket untuk memilih lebih banyak!`, 'error');
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
  const [isExamMaintenance, setIsExamMaintenance] = useState(false);

  useEffect(() => {
    fetch('/api/public/landing-config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.maintenance?.features?.examCreation) {
          setIsExamMaintenance(true);
        }
      })
      .catch((err) => console.error(err));

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

  const handleSubjectSelect = async (subjId: string) => {
    setSelectedSubjectId(subjId);
    if (subjId.startsWith('standard:')) {
      const subjName = subjId.replace('standard:', '');
      const existing = subjects.find((s) => s.name.toLowerCase() === subjName.toLowerCase());
      if (existing) {
        setSelectedSubjectId(existing.id);
        const filtered = questions
          .filter((q) => (!existing.id || q.subjectId === existing.id) && (!selectedGrade || q.grade === selectedGrade))
          .map((q) => q.id);
        setSelectedQuestionIds(filtered);
      } else {
        try {
          const res = await api('/subjects/ensure', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: subjName, description: 'Kurikulum Standar' }),
          });
          const d = await res.json();
          if (d.success && d.data) {
            setSubjects((prev) => [d.data, ...prev.filter((x) => x.id !== d.data.id)]);
            setSelectedSubjectId(d.data.id);
            const filtered = questions
              .filter((q) => (!d.data.id || q.subjectId === d.data.id) && (!selectedGrade || q.grade === selectedGrade))
              .map((q) => q.id);
            setSelectedQuestionIds(filtered);
          }
        } catch (e) {
          console.error('Error ensuring subject in ExamBuilder:', e);
        }
      }
    } else {
      const filtered = questions
        .filter((q) => (!subjId || q.subjectId === subjId) && (!selectedGrade || q.grade === selectedGrade))
        .map((q) => q.id);
      setSelectedQuestionIds(filtered);
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
    if (isExamMaintenance) {
      showToast('Fitur pembuatan dan publikasi ujian baru sedang dalam pemeliharaan sementara.', 'error');
      return;
    }
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
          hasCertificate,
          participantFields,
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
        if (user?.id) {
          localStorage.setItem(`examigo_feature_used_${user.id}`, 'true');
        }
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
    const matchSearch = !questionSearchQuery || (q.text || '').toLowerCase().includes(questionSearchQuery.toLowerCase());
    return matchSubject && matchGrade && matchSearch;
  });

  const paginatedQuestions = filteredQuestions.slice(
    (questionPage - 1) * questionsPerPage,
    questionPage * questionsPerPage
  );

  return (
    <div className="space-y-8 animate-fade-in-fast">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Layers className="w-7 h-7 text-slate-600" /> Exam Builder & Anti-Cheat
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
              <p className="font-black text-amber-950">Batasan Paket Free (1 Ujian Aktif & Maks 5 Peserta)</p>
              <p className="text-[11px] font-normal text-amber-800">
                Upgrade ke <strong>Personal (5 Ujian & 50 Peserta)</strong> atau <strong>Pro (15 Ujian & 200 Peserta + Fullscreen Anti-Cheat)</strong>.
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

      {isExamMaintenance && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <p className="font-black text-amber-950">Fitur Pembuatan Ujian Sedang Dalam Pemeliharaan</p>
            <p className="text-[11px] font-normal text-amber-800">
              Sistem pembuatan dan publikasi ujian baru sedang dalam peningkatan performa server. Anda tetap dapat mengelola bank soal dan melihat ujian yang telah ada.
            </p>
          </div>
        </div>
      )}

      {publishedCode ? (
        <div className="p-8 rounded-2xl bg-white border border-emerald-200 text-center space-y-5 max-w-md mx-auto shadow-xl">
          <CheckCircle2 className="w-12 h-12 text-edu-sage mx-auto" />
          <h2 className="text-xl font-extrabold text-slate-900">Ujian Berhasil Dipublikasikan!</h2>
          
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Kode Akses Ujian</p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 font-mono text-2xl font-black text-slate-700 tracking-wider">
              {publishedCode}
            </div>
          </div>

          {/* Dynamic QR Code Container */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <DynamicQRCode
              value={`${window.location.origin}/exam-room/${publishedCode}`}
              size={180}
              title="Scan QR Code untuk Mengikuti Ujian"
              subtitle="Peserta dapat langsung scan menggunakan kamera HP"
              showActions={true}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate(`/exam-room/${publishedCode}`)}
              style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
              className="flex-1 py-2.5 rounded-xl text-white font-bold text-xs shadow-sm transition-all hover:opacity-90"
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
                <Clock className="w-5 h-5 text-edu-electric" /> Pengaturan Ujian
              </h2>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Judul Ujian</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ujian Tengah Semester - Pemrograman Web"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[var(--theme-primary, #10B981)] font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mata Pelajaran (Subject) <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={selectedSubjectId}
                  required
                  onChange={(e) => handleSubjectSelect(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[var(--theme-primary, #10B981)] font-medium"
                >
                  <option value="">-- Pilih Mata Pelajaran --</option>
                  
                  {getJenjangFromGrade(selectedGrade) ? (
                    <optgroup label={`Kurikulum Resmi ${getJenjangFromGrade(selectedGrade)}`}>
                      {CURRICULUM_SUBJECTS[getJenjangFromGrade(selectedGrade)!]?.map((subjName) => {
                        const existing = subjects.find((s) => s.name.toLowerCase() === subjName.toLowerCase());
                        const optVal = existing ? existing.id : `standard:${subjName}`;
                        return (
                          <option key={subjName} value={optVal}>
                            {subjName}
                          </option>
                        );
                      })}
                    </optgroup>
                  ) : (
                    Object.entries(CURRICULUM_SUBJECTS).map(([jenjang, list]) => (
                      <optgroup key={jenjang} label={`Kurikulum Resmi ${jenjang}`}>
                        {list.map((subjName) => {
                          const existing = subjects.find((s) => s.name.toLowerCase() === subjName.toLowerCase());
                          const optVal = existing ? existing.id : `standard:${subjName}`;
                          return (
                            <option key={`${jenjang}-${subjName}`} value={optVal}>
                              {subjName}
                            </option>
                          );
                        })}
                      </optgroup>
                    ))
                  )}

                  {subjects.filter((s) => !Object.values(CURRICULUM_SUBJECTS).flat().some((cs) => cs.toLowerCase() === s.name.toLowerCase())).length > 0 && (
                    <optgroup label="Mapel Tambahan / Kustom Saya">
                      {subjects
                        .filter((s) => !Object.values(CURRICULUM_SUBJECTS).flat().some((cs) => cs.toLowerCase() === s.name.toLowerCase()))
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                    </optgroup>
                  )}
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
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[var(--theme-primary, #10B981)] font-medium"
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
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[var(--theme-primary, #10B981)] font-medium"
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
                    className="flex-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[var(--theme-primary, #10B981)] font-medium"
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
                    className="px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                    title="Acak dan Pilih Soal Ujian Otomatis"
                  >
                    <Shuffle className="w-3.5 h-3.5" /> Acak Soal
                  </button>
                </div>
                {autoSelectCount && selectedQuestionIds.length > 0 && (
                  <p className="text-[10px] text-emerald-700 mt-1 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Terpilih {selectedQuestionIds.length} soal acak otomatis dari {filteredQuestions.length} soal tersedia.</span>
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
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[var(--theme-primary, #10B981)] font-medium"
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
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[var(--theme-primary, #10B981)] font-medium"
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
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[var(--theme-primary, #10B981)] font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Jadwal Selesai Ujian (Opsional)</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[var(--theme-primary, #10B981)] font-medium"
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
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[var(--theme-primary, #10B981)] font-medium"
                />
              </div>

              <hr className="border-slate-200" />

              {/* Anti-Cheat & Security Options */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-slate-600" /> Mode Proteksi Anti-Cheat
                </label>
                <div className="space-y-1.5 text-xs font-medium">
                  <label
                    onClick={() => setAntiCheatMode('BASIC')}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                      antiCheatMode === 'BASIC' ? 'bg-slate-50 border-slate-300 font-bold' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <input type="radio" name="antiCheat" checked={antiCheatMode === 'BASIC'} readOnly className="text-slate-600 focus:ring-0" />
                    <span>Basic Anti-Cheat (Deteksi Pindah Tab)</span>
                  </label>

                  <label
                    onClick={() => {
                      if (userPlan !== 'PRO_AI') {
                        showToast('Advanced Fullscreen Lock hanya tersedia untuk Paket Pro. Silakan Upgrade Paket!', 'error');
                        setShowUpgradeModal(true);
                        return;
                      }
                      setAntiCheatMode('ADVANCED');
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer ${
                      userPlan !== 'PRO_AI'
                        ? 'bg-slate-100 border-slate-200 opacity-80 cursor-not-allowed text-slate-500'
                        : antiCheatMode === 'ADVANCED'
                        ? 'bg-slate-50 border-slate-300 font-bold text-slate-950'
                        : 'bg-slate-50/50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input type="radio" name="antiCheat" checked={antiCheatMode === 'ADVANCED'} readOnly className="text-slate-600 focus:ring-0" />
                      <span className="font-bold">Advanced Fullscreen Lock & Block Copy</span>
                    </div>
                    <span className="text-[10px] bg-slate-600 text-white font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      Pro <Lock className="w-2.5 h-2.5" />
                    </span>
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
                    className="rounded bg-white border-slate-300 text-edu-electric focus:ring-0 w-4 h-4"
                  />
                  <span className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5 text-edu-electric" /> Acak Urutan Soal untuk Tiap Peserta
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomizeChoices}
                    onChange={(e) => setRandomizeChoices(e.target.checked)}
                    className="rounded bg-white border-slate-300 text-edu-electric focus:ring-0 w-4 h-4"
                  />
                  <span className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5 text-slate-600" /> Acak Pilihan Jawaban (A/B/C/D)
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCertificate}
                    onChange={(e) => setHasCertificate(e.target.checked)}
                    className="rounded bg-white border-slate-300 text-edu-electric focus:ring-0 w-4 h-4"
                  />
                  <span className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" /> Berikan Sertifikat Setelah Lulus
                  </span>
                </label>
              </div>

              <hr className="border-slate-200" />

              {/* Data Identitas Peserta Ujian */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    Data Identitas yang Diisi Siswa
                  </label>
                  <button
                    type="button"
                    onClick={addCustomParticipantField}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100/80 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Kolom
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Pilih data yang wajib / opsional diisi peserta saat memasuki ruang ujian (NIS, email, absen, kelas, dll).
                </p>

                <div className="space-y-2 bg-slate-50/80 p-3 rounded-xl border border-slate-200 max-h-64 overflow-y-auto">
                  {participantFields.map((field) => (
                    <div
                      key={field.id}
                      className={`p-2.5 rounded-lg border transition-all flex flex-col gap-1.5 ${
                        field.enabled
                          ? 'bg-white border-slate-200 shadow-xs'
                          : 'bg-slate-100/70 border-slate-200/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={field.enabled}
                            disabled={field.isLocked}
                            onChange={() => toggleParticipantFieldEnabled(field.id)}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer disabled:cursor-not-allowed"
                          />
                          {field.isLocked ? (
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {field.label}
                            </span>
                          ) : field.id.startsWith('custom_') ? (
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateParticipantFieldLabel(field.id, e.target.value)}
                              placeholder="Nama kolom kustom..."
                              className="text-xs font-bold text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:border-emerald-500 focus:outline-none w-full py-0.5"
                            />
                          ) : (
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {field.label}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {field.enabled && (
                            <button
                              type="button"
                              disabled={field.isLocked}
                              onClick={() => toggleParticipantFieldRequired(field.id)}
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md transition-colors ${
                                field.required
                                  ? 'bg-red-50 text-red-600 border border-red-200'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                              } ${field.isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                            >
                              {field.required ? 'Wajib' : 'Opsional'}
                            </button>
                          )}

                          {field.id.startsWith('custom_') && (
                            <button
                              type="button"
                              onClick={() => removeParticipantField(field.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                  disabled={isSubmitting || selectedQuestionIds.length === 0 || isExamMaintenance}
                  style={!isExamMaintenance ? { backgroundColor: 'var(--theme-primary, #059669)' } : undefined}
                  className={`w-full py-3 rounded-xl text-white font-bold text-sm shadow-sm transition-all ${
                    isExamMaintenance
                      ? 'bg-amber-600 opacity-85 cursor-not-allowed'
                      : 'hover:opacity-90 cursor-pointer disabled:opacity-50'
                  }`}
                >
                  {isSubmitting ? 'Memproses...' : isExamMaintenance ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Pembuatan Ujian Dipelihara
                    </span>
                  ) : 'Publikasikan Ujian'}
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
                        ? 'text-[var(--theme-primary, #059669)] border-b-2 border-[var(--theme-primary, #10B981)]'
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
                        ? 'text-[var(--theme-primary, #059669)] border-b-2 border-[var(--theme-primary, #10B981)]'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    2. Urutkan & Drag ({selectedQuestionIds.length})
                  </button>
                </div>
              </div>

              {activeTab === 'select' ? (
                <div className="space-y-4">
                  {/* Search and Action Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Cari teks soal di bank soal..."
                        value={questionSearchQuery}
                        onChange={(e) => {
                          setQuestionSearchQuery(e.target.value);
                          setQuestionPage(1);
                        }}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 placeholder-slate-400 font-medium"
                      />
                    </div>
                    {filteredQuestions.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const matchingIds = filteredQuestions.map((q: any) => q.id);
                          const allSelected = matchingIds.every((id: string) => selectedQuestionIds.includes(id));
                          if (allSelected) {
                            setSelectedQuestionIds(selectedQuestionIds.filter((id) => !matchingIds.includes(id)));
                          } else {
                            const newSet = new Set([...selectedQuestionIds, ...matchingIds]);
                            setSelectedQuestionIds(Array.from(newSet));
                          }
                        }}
                        className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors whitespace-nowrap"
                      >
                        Pilih/Batal Filter ({filteredQuestions.length})
                      </button>
                    )}
                  </div>

                  {/* Grade Filter Bar */}
                  <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => { setSelectedGrade(''); setQuestionPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                        selectedGrade === ''
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-white border-2 border-slate-300 text-slate-800 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-950 shadow-sm'
                      }`}
                    >
                      Semua Tingkat
                    </button>
                    {GRADE_LEVELS.map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => { setSelectedGrade(grade); setQuestionPage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                          selectedGrade === grade
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-white border-2 border-slate-300 text-slate-800 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-950 shadow-sm'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                    {filteredQuestions.length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl space-y-2">
                        <Layers className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="text-xs font-bold text-slate-600">
                          {questions.length === 0 
                            ? 'Belum ada soal untuk mata pelajaran atau tingkatan ini.' 
                            : 'Tidak ada soal yang cocok dengan pencarian / filter ini.'}
                        </p>
                        <p className="text-[11px] text-slate-400">Buat soal di menu Bank Soal terlebih dahulu.</p>
                      </div>
                    ) : (
                      paginatedQuestions.map((q, idx) => (
                        <div
                          key={q.id || idx}
                          onClick={() => toggleQuestionSelect(q.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedQuestionIds.includes(q.id)
                              ? 'bg-emerald-50 border-emerald-400 text-slate-900 shadow-sm'
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
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-800 font-semibold flex items-center gap-1">
                                  <ImageIcon className="w-3 h-3 text-slate-600" /> Ada Gambar
                                </span>
                              )}
                            </div>
                            <input
                              type="checkbox"
                              checked={selectedQuestionIds.includes(q.id)}
                              onChange={() => {}}
                              className="w-4 h-4 rounded text-[var(--theme-primary, #10B981)] focus:ring-0 cursor-pointer pointer-events-none"
                            />
                          </div>
                          <p className="text-xs font-semibold line-clamp-2" dangerouslySetInnerHTML={{ __html: formatRichText(q.text) }} />
                          {q.choices && q.choices.length > 0 && (
                            <p className="text-[10px] text-slate-500 mt-2 font-medium">
                              {q.choices.length} Pilihan Jawaban
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Question Pagination */}
                  <Pagination
                    currentPage={questionPage}
                    totalItems={filteredQuestions.length}
                    itemsPerPage={questionsPerPage}
                    onPageChange={setQuestionPage}
                    onItemsPerPageChange={(newPerPage) => {
                      setQuestionsPerPage(newPerPage);
                      setQuestionPage(1);
                    }}
                    itemsPerPageOptions={[5, 10, 20, 50]}
                    itemName="soal"
                  />
                </div>
              ) : (
                /* Reorder Tab */
                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                  {selectedQuestionIds.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl space-y-2">
                      <Layers className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs font-bold text-slate-600">Belum ada soal yang dipilih.</p>
                      <p className="text-[11px] text-slate-400">Pilih soal terlebih dahulu pada tab "Pilih Soal".</p>
                    </div>
                  ) : (
                    selectedQuestionIds.map((id, idx) => {
                      const q = questions.find((item) => item.id === id);
                      if (!q) return null;
                      return (
                        <div
                          key={id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, idx)}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDragEnd={handleDragEnd}
                          className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 cursor-move hover:border-[var(--theme-primary, #10B981)] hover:shadow-sm transition-all"
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

            <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 text-xs text-left space-y-2">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-600" /> Benefit Batasan Paket:
              </p>
              <ul className="space-y-1.5 text-slate-700 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span><strong>Free</strong>: Maks 15 Soal, 5 Peserta, 1 Ujian Aktif</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span><strong>Personal</strong>: Maks 100 Soal, 50 Peserta, 5 Ujian Aktif</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                  <span><strong>Pro</strong>: Maks 300 Soal, 200 Peserta, 15 Ujian Aktif + Fullscreen Lock</span>
                </li>
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
                style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
                className="px-5 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 hover:opacity-90"
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
                <Eye className="w-5 h-5 text-[var(--theme-primary,#059669)]" /> Preview Ujian
              </h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="text-2xl font-black text-slate-900">{title || 'Judul Ujian Belum Diisi'}</h1>
                <p className="text-sm text-slate-500 mt-1">{description || 'Tidak ada deskripsi.'}</p>
                <div className="flex items-center gap-4 mt-3 text-xs font-semibold text-slate-600 flex-wrap">
                  <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> Durasi: {durationMinutes} Menit
                  </span>
                  <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Nilai Lulus: {minPassingScore}%
                  </span>
                  <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> Mode Proteksi: {antiCheatMode}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                    <Layers className="w-3.5 h-3.5 text-[var(--theme-primary,#059669)]" /> {selectedQuestionIds.length} Soal Terpilih
                  </span>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {selectedQuestionIds.map((id, index) => {
                  const q = questions.find((item) => item.id === id);
                  if (!q) return null;
                  return (
                    <div key={id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span 
                            style={{ backgroundColor: 'var(--theme-primary-dark, #064E3B)' }}
                            className="w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-black"
                          >
                            {index + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold uppercase">
                            {q.type}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-400">1 Poin</span>
                      </div>

                      {q.imageUrl && (
                        <div className="rounded-xl overflow-hidden border border-slate-200 max-h-60 max-w-sm">
                          <img src={q.imageUrl} alt="Lampiran Soal" className="w-full h-auto object-cover" />
                        </div>
                      )}

                      <div className="text-sm font-semibold text-slate-900" dangerouslySetInnerHTML={{ __html: formatRichText(q.text) }} />

                      {q.type === 'MULTIPLE_CHOICE' && q.choices && (
                        <div className="space-y-2 pt-2">
                          {q.choices.map((c: any, cIdx: number) => {
                            const optionLabel = ['A', 'B', 'C', 'D', 'E'][cIdx] || `Pilihan ${cIdx + 1}`;
                            return (
                              <div
                                key={c.id || cIdx}
                                className={`p-3 rounded-xl border flex items-center gap-3 text-xs font-medium transition-all ${
                                  c.isCorrect
                                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
                                    : 'bg-white border-slate-200 text-slate-700'
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                                  c.isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {optionLabel}
                                </span>
                                <span className="flex-1">{c.text}</span>
                                {c.isCorrect && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                                    Kunci Jawaban
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-edu-butter flex items-center justify-center mb-2">
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
                style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
                className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-colors hover:opacity-90"
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
