import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Upload, FileText, CheckCircle, Loader2, Save, Trash2, Edit2, AlertCircle, Plus, Image as ImageIcon, Lock, ShieldAlert } from 'lucide-react';
import { api, safeJson, useAuth } from '../lib/auth';
import { useToast } from '../components/Toast';
import { formatRichText } from './QuestionBankPage';
import { GRADE_LEVELS } from '../lib/constants';

export default function AIGeneratorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast, dismissToast } = useToast();
  const userPlan = user?.plan || 'FREE';
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [inputText, setInputText] = useState('');
  const [topic, setTopic] = useState('');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['MULTIPLE_CHOICE']);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Vision AI Image Input State
  const [imageInputBase64, setImageInputBase64] = useState('');
  const [imageInputMimeType, setImageInputMimeType] = useState('');

  // Subject Form State
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDesc, setNewSubjectDesc] = useState('');

  const [aiQuotaUsed, setAiQuotaUsed] = useState(0);

  const loadSubjects = () => {
    api('/subjects')
      .then((res) => safeJson(res))
      .then((data) => {
        if (data.success) {
          setSubjects(data.data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadSubjects();
    const token = localStorage.getItem('examigo_token');
    if (token) {
      fetch('/api/payments/my-subscription', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.subscription) {
            setAiQuotaUsed(data.subscription.aiQuotaUsed || 0);
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const handleTypeToggle = (type: string) => {
    if (['ESSAY', 'SHORT_ANSWER'].includes(type) && userPlan !== 'PRO_AI') {
      showToast('🔒 Tipe soal Essay & Isian Singkat hanya tersedia untuk Paket Pro AI. Silakan upgrade paket Anda.', 'error');
      setShowUpgradeModal(true);
      return;
    }

    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const processFile = async (file: File) => {
    if (userPlan === 'FREE') {
      showToast('🔒 Upload dokumen materi tidak tersedia untuk Paket Free. Silakan Upgrade Paket!', 'error');
      setShowUpgradeModal(true);
      return;
    }
    if (file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file gambar melebihi batas 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setImageInputBase64(result);
        setImageInputMimeType(file.type);
        showToast('Gambar materi berhasil dimuat untuk AI Vision!', 'success');
      };
      reader.readAsDataURL(file);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Ukuran file dokumen melebihi batas 10MB.', 'error');
      return;
    }

    setIsExtracting(true);
    const toastId = showToast('Mengunggah dan mengekstrak dokumen...', 'loading');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api('/ai/upload-extract', {
        method: 'POST',
        body: formData,
      });

      const result = await safeJson(response);
      if (result.success) {
        setInputText(result.text);
        showToast('Dokumen berhasil diekstrak!', 'success');
      } else {
        showToast(result.message || 'Gagal mengekstrak materi.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal terhubung ke server untuk mengekstrak file.', 'error');
    } finally {
      setIsExtracting(false);
      dismissToast(toastId);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (isExtracting) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const getQuotaLimit = (plan: string) => {
    if (plan === 'PERSONAL') return 100;
    if (plan === 'PRO_AI') return 300;
    return 1; // FREE tier gets 1-time generate
  };

  const currentLimit = getQuotaLimit(userPlan);
  const isQuotaExceeded = aiQuotaUsed >= currentLimit;

  const handleGenerate = async () => {
    if (isQuotaExceeded) {
      if (userPlan === 'FREE') {
        showToast('🔒 Kuota 1x Generate AI Paket Free telah digunakan. Silakan Upgrade ke Personal atau Pro AI!', 'error');
      } else {
        showToast(`🔒 Batas kuota AI paket ${userPlan} (${currentLimit} Soal/bulan) telah tercapai. Silakan Upgrade Paket!`, 'error');
      }
      setShowUpgradeModal(true);
      return;
    }

    if (!inputText.trim() && !imageInputBase64) {
      showToast('Silakan masukkan materi teks atau unggah gambar materi terlebih dahulu.', 'error');
      return;
    }
    if (!selectedSubjectId) {
      showToast('Silakan pilih Mata Pelajaran terlebih dahulu.', 'error');
      return;
    }
    if (!selectedGrade) {
      showToast('Silakan pilih Tingkatan Sekolah terlebih dahulu.', 'error');
      return;
    }
    if (questionCount > 15) {
      showToast('Maksimal jumlah soal yang dapat di-generate sekaligus adalah 15 soal.', 'error');
      setQuestionCount(15);
      return;
    }

    setIsGenerating(true);
    setSaveSuccess(false);

    try {
      const chosenSubjectObj = subjects.find((s) => s.id === selectedSubjectId);
      const chosenSubjectName = chosenSubjectObj ? chosenSubjectObj.name : 'Umum';

      const response = await api('/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialText: inputText,
          topic,
          subject: chosenSubjectName,
          questionTypes: selectedTypes,
          count: questionCount,
          difficulty,
          subjectId: selectedSubjectId,
          grade: selectedGrade || undefined,
          imageBase64: imageInputBase64 || undefined,
          imageMimeType: imageInputMimeType || undefined,
        }),
      });

      const result = await safeJson(response);
      if (result.success) {
        setGeneratedQuestions(result.data);
        if (userPlan === 'FREE') {
          setAiQuotaUsed(1);
        }
        showToast(`Berhasil menghasilkan ${result.data.length} soal!`, 'success');
      } else {
        showToast(result.message || 'Gagal menghasilkan soal.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan koneksi ke server.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteGeneratedQuestion = (index: number) => {
    setGeneratedQuestions((prev) => prev.filter((_, i) => i !== index));
    showToast('Soal berhasil dihapus dari daftar.', 'info');
  };

  const handleSaveToBank = async () => {
    if (generatedQuestions.length === 0) return;

    const toastId = showToast('Menyimpan soal ke Bank Soal...', 'loading');
    try {
      for (const q of generatedQuestions) {
        await api('/questions', {
          method: 'POST',
          body: JSON.stringify({
            text: q.text,
            type: q.type,
            difficulty: q.difficulty,
            topic: q.topic || topic,
            points: q.points || 1,
            explanation: q.explanation,
            choices: q.choices || [],
            subjectId: selectedSubjectId || undefined,
            grade: selectedGrade || undefined,
            imageUrl: q.imageUrl || imageInputBase64 || undefined,
          }),
        });
      }
      setSaveSuccess(true);
      setGeneratedQuestions([]);
      showToast('Semua soal berhasil disimpan ke Bank Soal!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Gagal menyimpan soal ke Bank Soal.', 'error');
    } finally {
      dismissToast(toastId);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-fast">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-indigo-600" /> AI Question Generator
        </h1>
      {userPlan === 'FREE' && aiQuotaUsed === 0 && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-black text-emerald-950">⚡ Percobaan AI Generator Gratis (1x Generate)</p>
              <p className="text-[11px] font-normal text-emerald-800">
                Paket Free memiliki <strong>1x Kesempatan Percobaan AI Generator Gratis</strong>. Gunakan kesempatan ini untuk mencoba membuat soal otomatis!
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs shrink-0 text-center">
            Tersisa: 1x Generate
          </span>
        </div>
      )}

      {userPlan === 'FREE' && aiQuotaUsed >= 1 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-black text-amber-950">🔒 Kuota 1x Percobaan AI Paket Free Telah Digunakan</p>
              <p className="text-[11px] font-normal text-amber-800">
                Anda telah menggunakan 1x kesempatan generate AI gratis. Upgrade ke <strong>Personal (100 Soal AI)</strong> atau <strong>Pro AI (300 Soal AI)</strong> untuk generate tanpa batas.
              </p>
            </div>
          </div>
          <Link
            to="/checkout?plan=personal&billing=monthly"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs text-center shrink-0 transition-colors"
          >
            Upgrade Sekarang
          </Link>
        </div>
      )}
        {/* Left Column: Form & Material Upload */}
        <div className="lg:col-span-7 space-y-6">
          <div className="saas-card p-6 bg-white border border-slate-200/80 space-y-5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Upload className="w-4 h-4 text-indigo-600" /> 1. Unggah Materi Pembelajaran
            </h2>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-6 border-2 border-dashed rounded-xl text-center transition-all ${
                isDragOver
                  ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99]'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              {isExtracting ? (
                <div className="space-y-2 py-4">
                  <Loader2 className="w-8 h-8 mx-auto text-indigo-600 animate-spin" />
                  <p className="text-xs font-bold text-slate-800">Membaca & Mengekstrak Dokumen...</p>
                </div>
              ) : imageInputBase64 ? (
                <div className="space-y-2 py-2">
                  <div className="relative inline-block">
                    <img src={imageInputBase64} alt="Preview Materi" className="max-h-36 rounded-lg border border-slate-200 shadow-sm" />
                    <button
                      type="button"
                      onClick={() => { setImageInputBase64(''); setImageInputMimeType(''); }}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-900">Gambar Materi Terpilih</p>
                  <p className="text-[11px] text-slate-500 font-medium">AI Gemini Vision akan membaca gambar ini secara otomatis.</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-800">Pilih Dokumen / Gambar Materi</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Dokumen (Maks. 10MB) • Gambar (Maks. 5MB)</p>
                  <input
                    type="file"
                    accept=".txt,.pdf,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp"
                    disabled={isExtracting}
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="saas-button-secondary mt-3 inline-block px-4 py-2 text-xs cursor-pointer"
                  >
                    Pilih File Dokumen / Gambar
                  </label>
                </>
              )}
            </div>

            {/* Teks Materi Manual */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Tempel Teks Materi Pembelajaran</label>
              <textarea
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tempelkan paragraf materi pelajaran, rangkuman bab, atau materi kuliah di sini..."
                className="saas-input leading-relaxed"
              />
            </div>

            <hr className="border-slate-100" />

            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-indigo-600" /> 2. Pengaturan Generasi Soal
            </h2>

            {/* Topik / Subject */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mata Pelajaran <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      required
                      className="saas-input"
                    >
                      <option value="">-- Pilih Mata Pelajaran --</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddSubjectModal(true)}
                      className="px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition-colors flex items-center justify-center"
                      title="Tambah Mapel Baru"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tingkatan Sekolah <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    required
                    className="saas-input"
                  >
                    <option value="">-- Pilih Tingkatan Sekolah --</option>
                    {GRADE_LEVELS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Topik Spesifik (Opsional)</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Trigonometri, Aljabar Linear, Perang Dunia II"
                  className="saas-input"
                />
              </div>
            </div>

            {/* Tipe Soal & Tingkat Kesulitan */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Tipe Soal (Dapat Dipilih Lebih Dari 1)</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'MULTIPLE_CHOICE', label: 'Pilihan Ganda', isPro: false },
                  { id: 'TRUE_FALSE', label: 'Benar / Salah', isPro: false },
                  { id: 'ESSAY', label: 'Essay 🔒 (Pro AI)', isPro: true },
                  { id: 'SHORT_ANSWER', label: 'Isian Singkat 🔒 (Pro AI)', isPro: true },
                ].map((t) => {
                  const isLocked = t.isPro && userPlan !== 'PRO_AI';
                  const isSelected = selectedTypes.includes(t.id) && !isLocked;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTypeToggle(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        isLocked
                          ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-80 cursor-not-allowed'
                          : isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Jumlah Soal (Maksimal 15)</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={questionCount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > 15) {
                      setQuestionCount(15);
                      showToast('Maksimal jumlah soal yang dapat di-generate sekaligus adalah 15 soal.', 'error');
                    } else if (val < 1) {
                      setQuestionCount(1);
                    } else {
                      setQuestionCount(val);
                    }
                  }}
                  className="saas-input"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tingkat Kesulitan</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="saas-input"
                >
                  <option value="EASY">Mudah (Easy)</option>
                  <option value="MEDIUM">Sedang (Medium)</option>
                  <option value="HARD">Sulit (Hard)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={isGenerating}
              onClick={() => {
                if (isQuotaExceeded) {
                  if (userPlan === 'FREE') {
                    showToast('🔒 Kuota 1x Generate AI Paket Free telah digunakan. Silakan Upgrade ke Personal / Pro AI!', 'error');
                  } else {
                    showToast(`🔒 Batas kuota AI paket ${userPlan} (${currentLimit} Soal/bulan) telah tercapai.`, 'error');
                  }
                  setShowUpgradeModal(true);
                  return;
                }
                handleGenerate();
              }}
              className={`w-full py-3 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${
                isQuotaExceeded
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 cursor-pointer shadow-xs font-black'
                  : 'saas-button-primary disabled:opacity-50'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> AI Sedang Membaca & Menganalisis...
                </>
              ) : isQuotaExceeded ? (
                <>
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  {userPlan === 'FREE'
                    ? '🔒 Kuota 1x Generate Free Telah Digunakan (Klik untuk Upgrade)'
                    : `🔒 Batas Kuota ${currentLimit} Soal AI Tercapai (Klik untuk Upgrade)`}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Soal Sekarang
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Preview & Edit Generated Questions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  Hasil Soal AI ({generatedQuestions.length} Soal)
                </h2>
                <p className="text-xs text-slate-500">Tinjau, edit, dan simpan soal ke Bank Soal Anda.</p>
              </div>

              {generatedQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={handleSaveToBank}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" /> Simpan Semua ke Bank Soal
                </button>
              )}
            </div>

            {saveSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Semua soal berhasil disimpan ke Bank Soal!</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/question-bank')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shrink-0 shadow-sm"
                >
                  Buka Bank Soal
                </button>
              </div>
            )}

            {generatedQuestions.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                <Sparkles className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-700">Belum ada soal yang di-generate.</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  Isi materi di kolom sebelah kiri dan klik tombol <strong>Generate Soal Sekarang</strong> untuk melihat hasilnya.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {generatedQuestions.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">
                            #{idx + 1} {q.type}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[11px] font-bold">
                            {q.difficulty}
                          </span>
                          {q.topic && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 text-[11px] font-bold">
                              {q.topic}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteGeneratedQuestion(idx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus Soal Ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: formatRichText(q.text) }} />

                      {q.imageUrl && (
                        <div className="pt-1">
                          <img src={q.imageUrl} alt="Gambar Soal AI" className="max-h-48 rounded-xl border border-slate-200 object-contain bg-white p-1" />
                        </div>
                      )}

                      {/* Choices render if MULTIPLE_CHOICE or TRUE_FALSE */}
                      {q.choices && q.choices.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.choices.map((c: any, cIdx: number) => (
                            <div
                              key={cIdx}
                              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between font-medium ${
                                c.isCorrect
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <span dangerouslySetInnerHTML={{ __html: formatRichText(c.text) }} />
                              {c.isCorrect && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            </div>
                          ))}
                        </div>
                      )}

                      {q.explanation && (
                        <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200 font-medium">
                          Penjelasan: {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom Save Action Bar */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs text-slate-600 font-medium">
                    Total <span className="font-bold text-slate-900">{generatedQuestions.length} soal</span> siap disimpan.
                  </p>
                  <button
                    type="button"
                    onClick={handleSaveToBank}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
                  >
                    <Save className="w-4 h-4" /> Simpan Semua ke Bank Soal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-fast">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tambah Mata Pelajaran Baru</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Buat kategori mapel baru untuk mengelompokkan soal.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Mapel</label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Contoh: Matematika Peminatan"
                  className="saas-input"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi (Opsional)</label>
                <textarea
                  rows={2}
                  value={newSubjectDesc}
                  onChange={(e) => setNewSubjectDesc(e.target.value)}
                  placeholder="Deskripsi singkat..."
                  className="saas-input"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddSubjectModal(false);
                  setNewSubjectName('');
                  setNewSubjectDesc('');
                }}
                className="saas-button-secondary px-4 py-2 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!newSubjectName.trim()) return;
                  try {
                    const res = await api('/subjects', {
                      method: 'POST',
                      body: JSON.stringify({ name: newSubjectName, description: newSubjectDesc }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      loadSubjects();
                      setNewSubjectName('');
                      setNewSubjectDesc('');
                      setShowAddSubjectModal(false);
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="saas-button-primary px-4 py-2 text-xs font-bold"
              >
                Simpan Mata Pelajaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal Popup */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center relative overflow-hidden animate-fade-in-fast">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900">Fitur Dikunci untuk Paket Anda</h3>
              <p className="text-xs text-slate-600 font-medium">
                Fitur ini memerlukan lisensi <strong>Personal (Rp 49K)</strong> atau <strong>Pro AI (Rp 149K)</strong>. Upgrade sekarang untuk mendapatkan akses penuh!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-left space-y-2">
              <p className="font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Keuntungan Upgrade Paket:
              </p>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                <li>• ⚡ 100 hingga 300 Soal AI per Bulan</li>
                <li>• 📄 Upload Modul PDF, DOCX, PPT, & Gambar</li>
                <li>• 🔒 Proteksi Ujian Anti-Cheat Advanced</li>
                <li>• 📊 Ekspor Laporan Hasil Ujian ke PDF</li>
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
                <Sparkles className="w-3.5 h-3.5" /> Upgrade Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
