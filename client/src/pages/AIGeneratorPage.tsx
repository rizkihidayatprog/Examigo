import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Upload, FileText, CheckCircle, Loader2, Save, Trash2, Edit2, AlertCircle, Plus, Image as ImageIcon, Lock, ShieldAlert, Wrench, AlertTriangle, Zap, School, BookOpen, PenTool, Search } from 'lucide-react';
import { api, safeJson, useAuth } from '../lib/auth';
import { useToast } from '../components/Toast';
import { formatRichText } from './QuestionBankPage';
import { 
  GRADE_LEVELS, 
  JENJANG_LIST, 
  CURRICULUM_SUBJECTS, 
  JenjangType, 
  getJenjangFromGrade,
  formatGradeLabel,
  getGradeNumber
} from '../lib/constants';
import { getTopicRecommendations } from '../lib/topicRecommendations';

export default function AIGeneratorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast, dismissToast } = useToast();
  const userPlan = user?.plan || 'FREE';
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [creationMethod, setCreationMethod] = useState<'PROMPT' | 'UPLOAD' | 'PASTE'>('PROMPT');
  const [promptInput, setPromptInput] = useState('');
  const [inputText, setInputText] = useState('');
  const [topic, setTopic] = useState('');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedJenjang, setSelectedJenjang] = useState<JenjangType>('SMA');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['MULTIPLE_CHOICE']);

  const [isCustomPrompt, setIsCustomPrompt] = useState(false);

  const currentSubjectName = React.useMemo(() => {
    if (!selectedSubjectId) return '';
    if (selectedSubjectId.startsWith('standard:')) {
      return selectedSubjectId.replace('standard:', '');
    }
    const found = subjects.find((s) => s.id === selectedSubjectId);
    return found ? found.name : '';
  }, [selectedSubjectId, subjects]);

  const activeTopicRecommendations = React.useMemo(() => {
    return getTopicRecommendations(currentSubjectName, selectedJenjang, selectedGrade, difficulty);
  }, [currentSubjectName, selectedJenjang, selectedGrade, difficulty]);

  // Auto-sync prompt and topic when subject, grade, jenjang, or difficulty changes
  React.useEffect(() => {
    if (activeTopicRecommendations && activeTopicRecommendations.length > 0) {
      const topRec = activeTopicRecommendations[0];
      if (!isCustomPrompt || !promptInput.trim()) {
        setPromptInput(topRec.prompt);
        setTopic(topRec.label.replace(/^[🟢🟡🔴]\s*/, '').replace(/\s*\([^)]*\)$/, ''));
      }
    }
  }, [currentSubjectName, selectedGrade, selectedJenjang, difficulty, activeTopicRecommendations, isCustomPrompt]);

  const handleJenjangChange = (jenjang: JenjangType) => {
    setSelectedJenjang(jenjang);
    setIsCustomPrompt(false);
    if (generatedQuestions.length > 0) setGeneratedQuestions([]);
    const jenjangGrades = JENJANG_LIST.find((j) => j.id === jenjang)?.grades || [];
    if (!jenjangGrades.includes(selectedGrade)) {
      setSelectedGrade(jenjangGrades[0] || '');
    }
  };

  const handleGradeChange = (gradeVal: string) => {
    setSelectedGrade(gradeVal);
    setIsCustomPrompt(false);
    if (generatedQuestions.length > 0) setGeneratedQuestions([]);
    const inferred = getJenjangFromGrade(gradeVal);
    if (inferred !== selectedJenjang) {
      setSelectedJenjang(inferred);
    }
  };

  const handleDifficultyChange = (diffVal: 'EASY' | 'MEDIUM' | 'HARD') => {
    setDifficulty(diffVal);
    setIsCustomPrompt(false);
  };

  const handleSubjectSelect = async (val: string) => {
    setSelectedSubjectId(val);
    setIsCustomPrompt(false);
    if (generatedQuestions.length > 0) setGeneratedQuestions([]);
    if (val.startsWith('standard:')) {
      const subjName = val.replace('standard:', '');
      const existing = subjects.find((s) => s.name.toLowerCase() === subjName.toLowerCase());
      if (existing) {
        setSelectedSubjectId(existing.id);
      } else {
        try {
          const res = await api('/subjects/ensure', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: subjName, description: `Kurikulum Standar ${selectedJenjang}` }),
          });
          const d = await safeJson(res);
          if (d.success && d.data) {
            setSubjects((prev) => [d.data, ...prev.filter((x) => x.id !== d.data.id)]);
            setSelectedSubjectId(d.data.id);
          }
        } catch (e) {
          console.error('Error ensuring standard subject:', e);
        }
      }
    }
  };
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  // ── AI Progress Bar ───────────────────────────────────────────────────────────
  const [genProgress, setGenProgress] = useState(0);
  const [genPhase, setGenPhase] = useState('');
  const [genElapsed, setGenElapsed] = useState(0);
  const genStartRef = useRef<number | null>(null);
  const genIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Vision AI Image Input State
  const [imageInputBase64, setImageInputBase64] = useState('');
  const [imageInputMimeType, setImageInputMimeType] = useState('');

  // Original Document File Tracking (e.g. PDF/DOCX)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<string | null>(null);

  const [aiQuotaUsed, setAiQuotaUsed] = useState(0);
  const [aiQuotaLimit, setAiQuotaLimit] = useState(15);
  const [cmsConfig, setCmsConfig] = useState<any>(null);

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

    // Fetch CMS pricing and quotas
    fetch('/api/public/landing-config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCmsConfig(data.data);
        }
      })
      .catch((err) => console.error('Failed to load CMS config in AIGeneratorPage:', err));

    const token = localStorage.getItem('examigo_token');
    if (token) {
      fetch('/api/payments/my-subscription', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.subscription) {
            setAiQuotaUsed(data.subscription.aiQuotaUsed || 0);
            if (data.subscription.aiQuotaLimit) {
              setAiQuotaLimit((data.subscription.aiQuotaLimit || 15) + (data.subscription.extraAiQuota || 0));
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const handleTypeToggle = (type: string) => {
    if (['ESSAY', 'SHORT_ANSWER'].includes(type) && userPlan !== 'PRO_AI') {
      showToast('Tipe soal Essay & Isian Singkat hanya tersedia untuk Paket Pro. Silakan upgrade paket Anda.', 'error');
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
      showToast('Upload dokumen materi tidak tersedia untuk Paket Free. Silakan Upgrade Paket!', 'error');
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
        showToast('Gambar materi berhasil dimuat untuk Smart Vision!', 'success');
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
        if (result.fileUrl) setUploadedFileUrl(result.fileUrl);
        if (result.fileName) setUploadedFileName(result.fileName);
        if (result.fileType) setUploadedFileType(result.fileType);
        showToast(`Dokumen ${result.fileName || ''} (${result.fileType || 'PDF'}) berhasil diekstrak!`, 'success');
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

  const getFallbackQuotaLimit = (plan: string) => {
    if (plan === 'PERSONAL') return 100;
    if (plan === 'PRO_AI') return 300;
    return 15; // FREE tier gets 15 questions
  };

  const currentLimit = aiQuotaLimit > 0 ? aiQuotaLimit : getFallbackQuotaLimit(userPlan);
  const remainingQuota = Math.max(0, currentLimit - aiQuotaUsed);
  const isQuotaExceeded = remainingQuota <= 0;
  const isAiMaintenance = Boolean(cmsConfig?.maintenance?.features?.aiGeneration);

  const handleGenerate = async () => {
    if (isAiMaintenance) {
      showToast('Fitur Generator Soal sedang dalam pemeliharaan sementara. Silakan coba beberapa saat lagi.', 'error');
      return;
    }

    if (isQuotaExceeded) {
      showToast(`Batas kuota pembuatan soal Anda (${currentLimit} butir soal) telah tercapai. Silakan beli kuota tambahan atau upgrade paket!`, 'error');
      setShowUpgradeModal(true);
      return;
    }

    if (questionCount > remainingQuota) {
      showToast(`Sisa kuota pembuatan soal Anda tinggal ${remainingQuota} butir soal. Menyesuaikan jumlah soal menjadi ${remainingQuota} butir.`, 'error');
      setQuestionCount(remainingQuota);
      return;
    }

    const effectiveMaterialText = 
      creationMethod === 'PROMPT' ? promptInput.trim() : inputText.trim();

    if (!effectiveMaterialText && !imageInputBase64) {
      if (creationMethod === 'PROMPT') {
        showToast('Silakan masukkan topik atau instruksi prompt pembuatan soal terlebih dahulu.', 'error');
      } else if (creationMethod === 'UPLOAD') {
        showToast('Silakan pilih dan unggah dokumen atau foto materi terlebih dahulu.', 'error');
      } else {
        showToast('Silakan tempelkan naskah teks materi pembelajaran terlebih dahulu.', 'error');
      }
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
    // Start progress simulation
    setGenProgress(0);
    setGenElapsed(0);
    genStartRef.current = Date.now();
    const PHASES = creationMethod === 'PROMPT' ? [
      { until: 8,  label: 'Menyiapkan sistem pembuatan soal...' },
      { until: 25, label: 'Mengkaji instruksi prompt & topik...' },
      { until: 50, label: 'Mengembangkan materi & konsep kurikulum...' },
      { until: 78, label: 'Meracik pertanyaan & pilihan jawaban...' },
      { until: 92, label: 'Memvalidasi opsi pengecoh & kunci...' },
      { until: 99, label: 'Menuntaskan format butir soal...' },
    ] : [
      { until: 8,  label: 'Menginisialisasi sistem...' },
      { until: 25, label: 'Membaca & Memahami Dokumen...' },
      { until: 50, label: 'Menganalisis Konten & Konteks...' },
      { until: 78, label: 'Meracik & Menyusun Soal...' },
      { until: 92, label: 'Memvalidasi Kualitas Soal...' },
      { until: 99, label: 'Finalisasi & Pemformatan...' },
    ];
    if (genIntervalRef.current) clearInterval(genIntervalRef.current);
    genIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - (genStartRef.current ?? Date.now())) / 1000;
      setGenElapsed(Math.round(elapsed));
      // Smooth easing: fast at start, slows near 99%
      setGenProgress(prev => {
        const remaining = 99 - prev;
        const increment = Math.max(0.15, remaining * 0.04);
        const next = Math.min(99, prev + increment);
        const phase = PHASES.find(p => next <= p.until);
        if (phase) setGenPhase(phase.label);
        return next;
      });
    }, 300);

    try {
      let chosenSubjectName = '';
      let finalSubjectId = selectedSubjectId;

      if (selectedSubjectId.startsWith('standard:')) {
        chosenSubjectName = selectedSubjectId.replace('standard:', '');
        const existing = subjects.find((s) => s.name.toLowerCase() === chosenSubjectName.toLowerCase());
        if (existing) {
          finalSubjectId = existing.id;
        } else {
          try {
            const res = await api('/subjects/ensure', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: chosenSubjectName, description: `Kurikulum Standar ${selectedJenjang}` }),
            });
            const d = await safeJson(res);
            if (d.success && d.data) {
              finalSubjectId = d.data.id;
              setSubjects((prev) => [d.data, ...prev.filter((x) => x.id !== d.data.id)]);
              setSelectedSubjectId(finalSubjectId);
            }
          } catch (e) {
            console.error('Error ensuring standard subject on generate:', e);
          }
        }
      } else {
        const chosenSubjectObj = subjects.find((s) => s.id === selectedSubjectId);
        chosenSubjectName = chosenSubjectObj ? chosenSubjectObj.name : 'Umum';
      }

      const response = await api('/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialText: effectiveMaterialText,
          topic: topic.trim() || (creationMethod === 'PROMPT' ? promptInput.trim().slice(0, 60) : undefined),
          subject: chosenSubjectName,
          questionTypes: selectedTypes,
          count: questionCount,
          difficulty,
          subjectId: finalSubjectId,
          grade: selectedGrade || undefined,
          imageBase64: imageInputBase64 || undefined,
          imageMimeType: imageInputMimeType || undefined,
        }),
      });

      const result = await safeJson(response);
      if (result.success) {
        setGeneratedQuestions(result.data);
        if (user?.id) {
          localStorage.setItem(`examigo_feature_used_${user.id}`, 'true');
        }
        if (typeof result.aiQuotaUsed === 'number') {
          setAiQuotaUsed(result.aiQuotaUsed);
        } else {
          setAiQuotaUsed((prev) => prev + result.data.length);
        }
        if (typeof result.aiQuotaLimit === 'number') {
          setAiQuotaLimit(result.aiQuotaLimit);
        }
        showToast(`Berhasil menghasilkan ${result.data.length} butir soal!`, 'success');
      } else {
        showToast(result.message || 'Gagal menghasilkan soal.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan koneksi ke server.', 'error');
    } finally {
      // Complete and stop progress bar
      if (genIntervalRef.current) clearInterval(genIntervalRef.current);
      setGenProgress(100);
      setGenPhase('Soal Berhasil Dibuat!');
      setTimeout(() => {
        setGenProgress(0);
        setGenPhase('');
        setGenElapsed(0);
        setIsGenerating(false);
      }, 800);
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
      // If there was input text or uploaded material, save as Material record first
      let savedMaterialId: string | undefined = undefined;
      const isFileUploaded = Boolean(uploadedFileUrl || uploadedFileName);
      const isLongPastedText = inputText && inputText.trim().length >= 350;

      // Hanya jadikan Material jika berkas file fisik diunggah (PDF/DOCX) ATAU teks yang ditempel sangat banyak (bacaan komprehensif >= 350 karakter).
      // Jika hanya prompt instruksi pendek (beberapa kata atau 1 paragraf), jangan dibuatkan entitas materi pop-up.
      if (isFileUploaded || isLongPastedText) {
        try {
          const matRes = await api('/materials', {
            method: 'POST',
            body: JSON.stringify({
              title: uploadedFileName || (topic ? `Materi: ${topic}` : `Materi Bacaan (${new Date().toLocaleDateString('id-ID')})`),
              extractedText: inputText.trim(),
              fileUrl: uploadedFileUrl || undefined,
              fileType: uploadedFileType || undefined,
              subjectId: selectedSubjectId || undefined,
            }),
          });
          const matData = await safeJson(matRes);
          if (matData.success && matData.data?.id) {
            savedMaterialId = matData.data.id;
          }
        } catch (mErr) {
          console.warn('Could not create material record, continuing with question save:', mErr);
        }
      }

      for (const q of generatedQuestions) {
        const qRes = await api('/questions', {
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
            materialId: savedMaterialId,
            imageUrl: q.imageUrl || imageInputBase64 || undefined,
          }),
        });
        const qData = await safeJson(qRes);
        if (!qData.success) {
          throw new Error(qData.message || 'Gagal menyimpan soal ke Bank Soal.');
        }
      }
      setSaveSuccess(true);
      setGeneratedQuestions([]);
      if (user?.id) {
        localStorage.setItem(`examigo_feature_used_${user.id}`, 'true');
      }
      showToast('Semua soal beserta materi rujukan berhasil disimpan ke Bank Soal!', 'success');
    } catch (err: any) {
      console.error('Save error:', err);
      showToast(err.message || 'Gagal menyimpan soal ke Bank Soal.', 'error');
    } finally {
      dismissToast(toastId);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-fast">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full bg-edu-butterLight text-edu-navy font-extrabold text-[11px] border border-edu-butter/40 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Smart Studio
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-edu-navy flex items-center gap-2.5">
          <Sparkles className="w-8 h-8 text-edu-electric fill-edu-electricLight" /> Question Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
          Unggah dokumen materi atau ketik topik, lalu biarkan sistem meracik soal pilihan ganda, essay, dan pembahasannya.
        </p>
      </div>

      {/* Universal Per-Question Quota Status Banner */}
      <div className={`p-5 rounded-3xl border-2 text-edu-navy text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-edu-sm ${
        isQuotaExceeded ? 'bg-amber-50/80 border-amber-200' : 'bg-edu-sageLight/70 border-edu-sage/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm font-black text-lg ${
            isQuotaExceeded ? 'bg-amber-500 text-white' : 'bg-edu-sage text-white'
          }`}>
            {isQuotaExceeded ? <Lock className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
          </div>
          <div>
            <p className="font-black text-edu-navy text-sm">
              Kuota Pembuatan Soal: {aiQuotaUsed} / {currentLimit} Butir Soal Terpakai
            </p>
            <p className="text-[11px] font-medium text-slate-600">
              {isQuotaExceeded
                ? `Seluruh kuota (${currentLimit} butir soal) telah digunakan. Beli kuota tambahan atau upgrade paket untuk menambah kuota!`
                : `Tersisa ${remainingQuota} butir soal dari total kuota ${currentLimit} butir soal paket ${userPlan}. Setiap soal yang di-generate akan mengurangi sisa kuota.`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-4 py-1.5 rounded-full font-black text-xs text-center shadow-sm ${
            isQuotaExceeded ? 'bg-amber-600 text-white' : 'bg-edu-sage text-white'
          }`}>
            Sisa: {remainingQuota} Soal
          </span>
          {isQuotaExceeded && (
            <Link
              to="/checkout?plan=personal&billing=monthly"
              className="saas-button-butter px-4 py-1.5 rounded-full text-xs font-black shadow-edu-butter text-center flex items-center gap-1"
            >
              <span>Upgrade Paket</span>
              <Zap className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Main Grid: Upload & Generator Controls + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Material Upload */}
        <div className="lg:col-span-7 space-y-6">
          <div className="saas-card p-6 md:p-8 bg-white space-y-6">
            {/* Section 1: Sasaran Kurikulum & Mata Pelajaran */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-edu-navy flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-edu-butter fill-edu-butter" /> 1. Sasaran Kurikulum & Mata Pelajaran
              </h2>
              <span className="text-[11px] font-bold text-slate-500">
                Pilih jenjang, mapel, kelas, dan tingkat kesulitan
              </span>
            </div>

            <div className="space-y-4">
              {/* Pilihan Jenjang Pendidikan */}
              <div>
                <label className="text-xs font-black text-edu-navy block mb-1.5">
                  Jenjang Pendidikan <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {JENJANG_LIST.map((j) => {
                    const isSelected = selectedJenjang === j.id;
                    return (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => handleJenjangChange(j.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-black transition-all border text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'text-white shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                        style={isSelected ? {
                          backgroundColor: 'var(--theme-primary-dark, #064E3B)',
                          borderColor: 'var(--theme-primary-dark, #064E3B)',
                          color: '#FFFFFF'
                        } : undefined}
                      >
                        <span className="flex items-center justify-center">
                          {j.id === 'SMA' ? <School className="w-4 h-4" /> : j.id === 'SMK' ? <Wrench className="w-4 h-4" /> : j.id === 'SMP' ? <BookOpen className="w-4 h-4" /> : <PenTool className="w-4 h-4" />}
                        </span>
                        <span>{j.name.split(' (')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-edu-navy block mb-1.5">
                    Mata Pelajaran ({selectedJenjang}) <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => handleSubjectSelect(e.target.value)}
                    required
                    className="saas-input font-bold"
                  >
                    <option value="">-- Pilih Mata Pelajaran ({selectedJenjang}) --</option>
                    
                    {/* Kurikulum Standar Sesuai Jenjang */}
                    <optgroup label={`Kurikulum Resmi ${selectedJenjang}`}>
                      {CURRICULUM_SUBJECTS[selectedJenjang]?.map((subjName) => {
                        const existing = subjects.find((s) => s.name.toLowerCase() === subjName.toLowerCase());
                        const optValue = existing ? existing.id : `standard:${subjName}`;
                        return (
                          <option key={subjName} value={optValue}>
                            {subjName}
                          </option>
                        );
                      })}
                    </optgroup>

                    {/* Mapel Kustom Guru */}
                    {subjects.filter((s) => !CURRICULUM_SUBJECTS[selectedJenjang]?.some((cs) => cs.toLowerCase() === s.name.toLowerCase())).length > 0 && (
                      <optgroup label="Mapel Tambahan / Kustom Saya">
                        {subjects
                          .filter((s) => !CURRICULUM_SUBJECTS[selectedJenjang]?.some((cs) => cs.toLowerCase() === s.name.toLowerCase()))
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
                  <label className="text-xs font-black text-edu-navy block mb-1.5">
                    Tingkatan Sekolah <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => handleGradeChange(e.target.value)}
                    required
                    className="saas-input font-bold"
                  >
                    <option value="">-- Pilih Kelas / Tingkatan --</option>
                    <optgroup label={`Tingkatan ${selectedJenjang}`}>
                      {(JENJANG_LIST.find((j) => j.id === selectedJenjang)?.grades || []).map((g) => (
                        <option key={g} value={g}>{formatGradeLabel(g)}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Semua Jenjang Lainnya">
                      {GRADE_LEVELS.filter(g => !(JENJANG_LIST.find((j) => j.id === selectedJenjang)?.grades || []).includes(g)).map((g) => (
                        <option key={g} value={g}>{formatGradeLabel(g)}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-edu-navy block mb-1.5">Tingkat Kesulitan</label>
                  <select
                    value={difficulty}
                    onChange={(e) => handleDifficultyChange(e.target.value as any)}
                    className="saas-input font-bold"
                  >
                    <option value="EASY">Mudah (Easy)</option>
                    <option value="MEDIUM">Sedang (Medium)</option>
                    <option value="HARD">Sulit (Hard)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-edu-navy block mb-1.5">Jumlah Soal (Maks 15)</label>
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
                    className="saas-input font-bold"
                  />
                </div>
              </div>

              {/* Tipe Soal */}
              <div className="space-y-3">
                <label className="text-xs font-black block" style={{ color: 'var(--theme-primary-dark, #064E3B)' }}>
                  Tipe Soal (Pilih 1 atau lebih)
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { id: 'MULTIPLE_CHOICE', label: 'Pilihan Ganda', isPro: false },
                    { id: 'TRUE_FALSE', label: 'Benar / Salah', isPro: false },
                    { id: 'ESSAY', label: 'Essay (Pro)', isPro: true },
                    { id: 'SHORT_ANSWER', label: 'Isian Singkat (Pro)', isPro: true },
                  ].map((t) => {
                    const isLocked = t.isPro && userPlan !== 'PRO_AI';
                    const isSelected = selectedTypes.includes(t.id) && !isLocked;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleTypeToggle(t.id)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all border cursor-pointer flex items-center gap-1.5 ${
                          isLocked
                            ? 'bg-slate-100 border-slate-200 text-slate-500 opacity-80 cursor-not-allowed'
                            : isSelected
                            ? 'text-white shadow-md'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                        style={isSelected ? {
                          backgroundColor: 'var(--theme-primary, #10B981)',
                          borderColor: 'var(--theme-primary, #10B981)'
                        } : undefined}
                      >
                        <span>{t.label}</span>
                        {isLocked && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Section 2: Metode & Instruksi Soal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-edu-navy flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-edu-electric" /> 2. Sumber Materi & Instruksi Soal
              </h2>
              <span className="text-[11px] font-bold text-slate-500">
                Pilih salah satu dari 3 opsi di bawah
              </span>
            </div>

            {/* 3 Tabs Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setCreationMethod('PROMPT')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  creationMethod === 'PROMPT'
                    ? 'bg-white text-edu-electric shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-edu-butter fill-edu-butter" />
                <span>Tulis Instruksi Soal</span>
              </button>

              <button
                type="button"
                onClick={() => setCreationMethod('UPLOAD')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  creationMethod === 'UPLOAD'
                    ? 'bg-white text-edu-electric shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Upload className="w-4 h-4 text-edu-electric" />
                <span>Unggah Materi</span>
              </button>

              <button
                type="button"
                onClick={() => setCreationMethod('PASTE')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  creationMethod === 'PASTE'
                    ? 'bg-white text-edu-electric shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Tempel Materi</span>
              </button>
            </div>

            {/* Opsi 1: Prompting AI */}
            {creationMethod === 'PROMPT' && (
              <div className="space-y-4 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black text-edu-navy flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-edu-butter fill-edu-butter" />
                      Ketik Prompt / Tema Instruksi Soal <span className="text-red-500 font-bold">*</span>
                    </label>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {promptInput.length} karakter
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={promptInput}
                    onChange={(e) => {
                      setPromptInput(e.target.value);
                      setIsCustomPrompt(true);
                      if (!topic) setTopic(e.target.value.slice(0, 50));
                    }}
                    placeholder={
                      activeTopicRecommendations[0]?.prompt ||
                      `Contoh: Buatkan ${questionCount} butir soal ${currentSubjectName || 'Mata Pelajaran'} untuk ${formatGradeLabel(selectedGrade) || selectedJenjang}...`
                    }
                    className="saas-input leading-relaxed font-medium"
                  />
                </div>

                {/* Quick Recommendation Chips */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Rekomendasi Topik Cepat ({currentSubjectName || 'Umum'} - {formatGradeLabel(selectedGrade) || selectedJenjang}):
                    </label>
                    <span className="text-[10px] font-bold text-slate-400">
                      {activeTopicRecommendations.length} Ide Topik Kurikulum
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto pr-1">
                    {activeTopicRecommendations.map((p) => {
                      const isCurrent = promptInput === p.prompt;
                      return (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => {
                            setPromptInput(p.prompt);
                            setTopic(p.label.replace(/^[🟢🟡🔴]\s*/, '').replace(/\s*\([^)]*\)$/, ''));
                            setIsCustomPrompt(false);
                          }}
                          className={`text-[11px] font-bold py-1.5 px-3 rounded-xl border transition-all cursor-pointer shadow-2xs text-left ${
                            isCurrent
                              ? 'bg-edu-electric text-white border-edu-electric shadow-sm font-black'
                              : 'bg-slate-50 hover:bg-edu-electricLight hover:text-edu-electric border-slate-200 text-slate-700'
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-edu-navy block mb-1.5">Topik Spesifik (Opsional)</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ketik topik materi khusus jika ingin membatasi sub-bahasan"
                    className="saas-input"
                  />
                </div>
              </div>
            )}

            {/* Opsi 2: Unggah Dokumen / Gambar */}
            {creationMethod === 'UPLOAD' && (
              <div className="space-y-4 pt-1">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`p-8 border-2 border-dashed rounded-3xl text-center transition-all cursor-pointer ${
                    isDragOver
                      ? 'border-edu-electric bg-edu-electricLight/40 scale-[0.99]'
                      : 'border-slate-200 hover:border-edu-electric/50 bg-[#F8FAFC]'
                  }`}
                >
                  {isExtracting ? (
                    <div className="space-y-3 py-4">
                      <Loader2 className="w-10 h-10 mx-auto text-edu-electric animate-spin" />
                      <p className="text-xs font-extrabold text-edu-navy">Membaca & Mengekstrak Dokumen...</p>
                      <p className="text-[11px] text-slate-400">Mohon tunggu, sistem sedang memproses materi dari file Anda.</p>
                    </div>
                  ) : (
                    <label className="cursor-pointer block space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-edu-electricLight flex items-center justify-center mx-auto text-edu-electric shadow-sm">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-edu-navy">
                          Klik untuk upload atau seret file ke sini
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Mendukung PDF, DOCX, TXT, dan Gambar (JPG/PNG)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt,image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Upload Status Card */}
                {uploadedFileName && (
                  <div className="p-3 bg-edu-electricLight/40 border border-edu-electric/20 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-edu-electric shrink-0" />
                      <span className="text-xs font-bold text-edu-navy truncate max-w-[200px] sm:max-w-xs">
                        {uploadedFileName}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded text-edu-electric font-semibold shrink-0">
                        {uploadedFileType === 'IMAGE' ? 'Gambar' : 'Dokumen'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedFileName(null);
                        setUploadedFileUrl(null);
                        setUploadedFileType(null);
                        setImageInputBase64('');
                        setImageInputMimeType('');
                        setInputText('');
                      }}
                      className="text-xs text-red-600 hover:text-red-700 font-bold p-1 cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Opsi 3: Tempel Teks Materi */}
            {creationMethod === 'PASTE' && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-edu-navy flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    Tempel Teks Modul / Materi Pembelajaran <span className="text-red-500 font-bold">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {inputText.trim().split(/\s+/).filter(Boolean).length} kata • {inputText.length} karakter
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Tempelkan naskah teks modul pelajaran, ringkasan materi, artikel ilmiah, atau kisi-kisi naskah di sini..."
                  className="saas-input leading-relaxed font-normal"
                />
                {inputText && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setInputText('')}
                      className="text-xs text-slate-500 hover:text-red-600 font-semibold cursor-pointer"
                    >
                      Hapus Teks
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              disabled={isGenerating || isAiMaintenance}
              onClick={() => {
                if (isAiMaintenance) {
                  showToast('Fitur Generator Soal sedang dalam pemeliharaan sementara.', 'error');
                  return;
                }
                if (isQuotaExceeded) {
                  showToast(`Batas kuota ${currentLimit} butir soal telah tercapai. Silakan beli kuota tambahan atau upgrade paket!`, 'error');
                  setShowUpgradeModal(true);
                  return;
                }
                handleGenerate();
              }}
              className={`w-full py-4 text-xs font-black flex items-center justify-center gap-2 rounded-2xl transition-all ${
                isAiMaintenance
                  ? 'bg-amber-600 text-white opacity-90 cursor-not-allowed shadow-md'
                  : isQuotaExceeded
                  ? 'bg-edu-butterLight text-edu-navy border-2 border-edu-butter hover:bg-edu-butter cursor-pointer shadow-edu-butter'
                  : 'saas-button-primary disabled:opacity-50 shadow-edu-button'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Sedang Membaca & Meracik Soal...
                </>
              ) : isAiMaintenance ? (
                <>
                  <Wrench className="w-5 h-5 text-amber-200" />
                  Fitur Sedang Dalam Pemeliharaan
                </>
              ) : isQuotaExceeded ? (
                <>
                  <Lock className="w-5 h-5 text-edu-navy shrink-0" />
                  Kuota {currentLimit} Butir Soal Habis (Klik Upgrade / Beli Kuota)
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-edu-butter fill-current" /> Racik Soal Otomatis Sekarang ({questionCount} Soal)
                </>
              )}
            </button>

            {/* ── Real-time AI Progress Bar ──────────────────────────────── */}
            {isGenerating && (
              <div className="mt-4 rounded-2xl bg-edu-purple/5 border border-edu-purple/20 p-4 space-y-2.5 animate-fade-in">
                {/* Phase label + elapsed */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-edu-purple truncate max-w-[65%]">
                    {genPhase || 'Menginisialisasi...'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {genElapsed}s
                  </span>
                </div>

                {/* Progress bar track */}
                <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  {/* Animated shimmer layer */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.4s infinite linear',
                      width: `${genProgress}%`,
                    }}
                  />
                  {/* Fill bar */}
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${genProgress}%`,
                      background: genProgress >= 100
                        ? 'linear-gradient(90deg, #10b981, #34d399)'
                        : 'linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed)',
                      backgroundSize: '200% 100%',
                      animation: genProgress < 100 ? 'gradientShift 2s ease infinite' : 'none',
                    }}
                  />
                </div>

                {/* Percentage + ETA */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {[8, 25, 50, 78, 92, 99].map((checkpoint, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          genProgress >= checkpoint ? 'bg-edu-purple scale-125' : 'bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-black text-edu-purple">
                    {Math.round(genProgress)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Preview & Edit Generated Questions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="saas-card p-6 md:p-8 bg-white space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-edu-navy flex items-center gap-2">
                  Hasil Soal ({generatedQuestions.length} Soal)
                </h2>
                <p className="text-xs text-slate-500 font-medium">Tinjau, edit, dan simpan soal ke Bank Soal Anda.</p>
              </div>

              {generatedQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={handleSaveToBank}
                  className="px-4 py-2.5 rounded-2xl bg-edu-sage hover:bg-edu-sage/90 text-white font-black text-xs flex items-center gap-2 shadow-edu-sage transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" /> Simpan ke Bank Soal
                </button>
              )}
            </div>

            {saveSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-edu-sage shrink-0" />
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
                            <span className="px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-700 text-[11px] font-bold">
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
                          <img src={q.imageUrl} alt="Gambar Soal" className="max-h-48 rounded-xl border border-slate-200 object-contain bg-white p-1" />
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
                              {c.isCorrect && <CheckCircle className="w-3.5 h-3.5 text-edu-sage shrink-0" />}
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

      {/* Upgrade Modal Popup - Modern Bespoke UI with Dynamic CMS Theme & Pricing */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in-fast">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl space-y-5 text-center relative overflow-hidden border border-slate-100">
            {/* Ambient Background Accent */}
            <div 
              className="w-32 h-32 rounded-full absolute -top-12 -right-12 blur-2xl opacity-20 pointer-events-none"
              style={{ backgroundColor: 'var(--theme-mint, #10B981)' }}
            />

            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-md border"
              style={{
                backgroundColor: 'var(--theme-mint-light, #ECFDF5)',
                color: 'var(--theme-primary, #059669)',
                borderColor: 'var(--theme-border, #A7F3D0)'
              }}
            >
              <Sparkles className="w-8 h-8 fill-current" />
            </div>

            <div className="space-y-2">
              <span 
                className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border"
                style={{
                  backgroundColor: 'var(--theme-mint-light, #ECFDF5)',
                  color: 'var(--theme-primary-dark, #064E3B)',
                  borderColor: 'var(--theme-border, #A7F3D0)'
                }}
              >
                Fitur Eksklusif Paket Guru
              </span>
              <h3 className="text-xl font-black text-slate-900">Fitur Dikunci untuk Paket Anda</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Fitur ini memerlukan lisensi <strong>Personal (Rp {((cmsConfig?.pricing?.personal?.monthlyPrice || 49000) / 1000).toLocaleString('id-ID')}K)</strong> atau <strong>Pro (Rp {((cmsConfig?.pricing?.pro_ai?.monthlyPrice || 149000) / 1000).toLocaleString('id-ID')}K)</strong>. Upgrade sekarang untuk mendapatkan akses instan!
              </p>
            </div>

            {/* Benefits List Card */}
            <div 
              className="p-4 rounded-2xl border text-xs text-left space-y-2.5 shadow-xs"
              style={{
                backgroundColor: 'var(--theme-mint-light, #ECFDF5)',
                borderColor: 'var(--theme-border, #A7F3D0)',
                color: 'var(--theme-primary-dark, #064E3B)'
              }}
            >
              <p className="font-black text-xs flex items-center gap-1.5" style={{ color: 'var(--theme-primary-dark, #064E3B)' }}>
                <Sparkles className="w-4 h-4" style={{ color: 'var(--theme-primary, #059669)' }} /> Keuntungan Upgrade Paket:
              </p>
              <ul className="space-y-1.5 font-semibold text-[11px]" style={{ color: 'var(--theme-text-muted, #047857)' }}>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--theme-primary, #10B981)' }} />
                  <span><strong>{cmsConfig?.pricing?.personal?.maxAiQuestions || 100} hingga {cmsConfig?.pricing?.pro_ai?.maxAiQuestions || 300} Soal Otomatis</strong> per Bulan</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--theme-primary, #10B981)' }} />
                  <span>Upload Modul Lengkap (PDF, DOCX, PPT, & Foto Soal)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--theme-primary, #10B981)' }} />
                  <span>Koreksi Essay Otomatis & Proteksi Fullscreen Anti-Cheat</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--theme-primary, #10B981)' }} />
                  <span>Ekspor Rapih ke Excel, CSV & Cetak PDF Soal</span>
                </li>
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Nanti Saja
              </button>
              <Link
                to="/checkout?plan=personal&billing=monthly"
                className="px-5 py-3 rounded-xl text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-90"
                style={{ backgroundColor: 'var(--theme-primary, #10B981)' }}
              >
                <Sparkles className="w-4 h-4 fill-current text-amber-200" />
                <span>Upgrade Sekarang</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
