import React, { useEffect, useState, useRef } from 'react';
import { HelpCircle, Search, Filter, Plus, CheckCircle, Tag, Trash2, Edit, BookOpen, GraduationCap, Sparkles, FileText, ChevronDown, ChevronUp, Upload, Image as ImageIcon, Download, FileSpreadsheet, Eye, X, RefreshCw, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';
import { api, useAuth } from '../lib/auth';
import { useToast } from '../components/Toast';
import { GRADE_LEVELS, CURRICULUM_SUBJECTS, getJenjangFromGrade } from '../lib/constants';
import { formatRichText } from '../lib/formatters';
export { formatRichText } from '../lib/formatters';
import * as XLSX from 'xlsx';
import Pagination from '../components/common/Pagination';

const MATH_SYMBOLS = [
  '√', 'π', '²', '³', '⁴', '½', '¼', '¾', '±', '×', '÷', '≠', '≈', '≤', '≥', '∞', '∑', '∫', 'α', 'β', 'γ', 'θ', 'Δ', 'Ω', 'λ', 'μ', 'σ', '°', '∠', '⊥', '△'
];

export default function QuestionBankPage() {
  const { user } = useAuth();
  const userPlan = user?.plan || 'FREE';
  const isFreePlan = userPlan === 'FREE';
  const { showToast, dismissToast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [previewQuestion, setPreviewQuestion] = useState<any | null>(null);
  const [expandedMaterials, setExpandedMaterials] = useState<Record<string, boolean>>({});

  // Form Ref & Multi-Question Session State
  const questionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [sessionSavedCount, setSessionSavedCount] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form State
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState('MULTIPLE_CHOICE');
  const [newGrade, setNewGrade] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [focusedInput, setFocusedInput] = useState<{ type: 'question' | 'choice'; index?: number } | null>(null);

  const insertSymbol = (symbol: string) => {
    if (!focusedInput) {
      setNewText((prev) => prev + symbol);
      return;
    }
    if (focusedInput.type === 'question') {
      setNewText((prev) => prev + symbol);
    } else if (focusedInput.type === 'choice' && typeof focusedInput.index === 'number') {
      const updated = [...choices];
      if (updated[focusedInput.index]) {
        updated[focusedInput.index].text += symbol;
        setChoices(updated);
      }
    }
  };
  const [newDifficulty, setNewDifficulty] = useState('MEDIUM');
  const [newTopic, setNewTopic] = useState('');
  const [newSubjectId, setNewSubjectId] = useState('');
  const [choices, setChoices] = useState([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);

  // Material Form State
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialText, setNewMaterialText] = useState('');
  const [newMaterialSubjectId, setNewMaterialSubjectId] = useState('');

  const loadSubjects = () => {
    api('/subjects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubjects(data.data);
        }
      })
      .catch((err) => console.error(err));
  };

  const loadMaterials = () => {
    api('/materials')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMaterials(data.data);
        }
      })
      .catch((err) => console.error(err));
  };

  const loadQuestions = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
    if (selectedSubjectId) params.append('subjectId', selectedSubjectId);
    if (selectedGrade) params.append('grade', selectedGrade);

    api(`/questions?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setQuestions(data.data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadSubjects();
    loadMaterials();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    loadQuestions();
  }, [search, selectedDifficulty, selectedSubjectId, selectedGrade]);

  const paginatedQuestions = questions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Bulk Selection State & Actions
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState<boolean>(false);

  const areAllPageSelected = paginatedQuestions.length > 0 && paginatedQuestions.every(q => selectedQuestionIds.includes(q.id));

  const toggleSelectQuestion = (id: string) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const toggleSelectAllPage = () => {
    if (areAllPageSelected) {
      const pageIds = new Set(paginatedQuestions.map(q => q.id));
      setSelectedQuestionIds(prev => prev.filter(id => !pageIds.has(id)));
    } else {
      const newIds = new Set([...selectedQuestionIds, ...paginatedQuestions.map(q => q.id)]);
      setSelectedQuestionIds(Array.from(newIds));
    }
  };

  const selectAllFiltered = () => {
    setSelectedQuestionIds(questions.map(q => q.id));
  };

  const clearSelection = () => {
    setSelectedQuestionIds([]);
  };

  const handleBulkDelete = async () => {
    if (selectedQuestionIds.length === 0) return;
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedQuestionIds.length} butir soal terpilih? Tindakan ini tidak dapat dibatalkan.`)) return;

    setIsBulkDeleting(true);
    try {
      const res = await api('/questions/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids: selectedQuestionIds }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || `Berhasil menghapus ${selectedQuestionIds.length} butir soal!`, 'success');
        setSelectedQuestionIds([]);
        loadQuestions();
      } else {
        showToast(data.message || 'Gagal menghapus soal terpilih.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan koneksi saat menghapus soal.', 'error');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const resetForm = () => {
    setNewText('');
    setNewType('MULTIPLE_CHOICE');
    setNewDifficulty('MEDIUM');
    setNewTopic('');
    setNewSubjectId(selectedSubjectId && selectedSubjectId !== 'all' ? selectedSubjectId : '');
    setNewGrade(selectedGrade && selectedGrade !== 'all' ? selectedGrade : '');
    setNewImageUrl('');
    setChoices([
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]);
    setEditingQuestionId(null);
    setSessionSavedCount(0);
  };

  const handleSelectNewSubject = async (val: string) => {
    setNewSubjectId(val);
    if (val.startsWith('standard:')) {
      const subjName = val.replace('standard:', '');
      const existing = subjects.find((s) => s.name.toLowerCase() === subjName.toLowerCase());
      if (existing) {
        setNewSubjectId(existing.id);
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
            setNewSubjectId(d.data.id);
          }
        } catch (e) {
          console.error('Error ensuring subject in QuestionBank:', e);
        }
      }
    }
  };

  const handleDeleteSubject = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (!confirm(`Hapus mata pelajaran "${name}"? Soal-soal yang ada di bank soal tidak akan dihapus, namun label mapel ini akan dilepas.`)) {
      return;
    }
    try {
      const res = await api(`/subjects/${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (d.success) {
        showToast(`Mata pelajaran "${name}" berhasil dihapus.`, 'success');
        if (selectedSubjectId === id) setSelectedSubjectId('');
        loadSubjects();
        loadQuestions();
      } else {
        showToast(d.message || 'Gagal menghapus mata pelajaran.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan saat menghapus mata pelajaran.', 'error');
    }
  };

  const handleEditClick = (q: any) => {
    setEditingQuestionId(q.id);
    setNewText(q.text);
    setNewType(q.type);
    setNewDifficulty(q.difficulty);
    setNewTopic(q.topic || '');
    setNewSubjectId(q.subjectId || '');
    setNewGrade(q.grade || '');
    setNewImageUrl(q.imageUrl || '');
    if (q.choices && q.choices.length > 0) {
      setChoices(q.choices.map((c: any) => ({ text: c.text, isCorrect: c.isCorrect })));
    } else {
      setChoices([
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ]);
    }
    setSessionSavedCount(0);
    setShowAddModal(true);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus soal ini?')) return;
    try {
      const res = await api(`/questions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadQuestions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    if (!newSubjectId) {
      showToast('Silakan pilih Mata Pelajaran.', 'error');
      return;
    }
    if (!newGrade) {
      showToast('Silakan pilih Tingkatan Sekolah.', 'error');
      return;
    }

    const payload = {
      text: newText,
      type: newType,
      difficulty: newDifficulty,
      topic: newTopic || 'Umum',
      points: 1,
      subjectId: newSubjectId || undefined,
      grade: newGrade || undefined,
      imageUrl: newImageUrl || undefined,
      choices: (newType === 'MULTIPLE_CHOICE' || newType === 'TRUE_FALSE') ? choices : [],
    };

    setIsSaving(true);
    try {
      const url = editingQuestionId ? `/questions/${editingQuestionId}` : '/questions';
      const method = editingQuestionId ? 'PUT' : 'POST';

      const res = await api(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        loadQuestions();
        if (editingQuestionId) {
          setShowAddModal(false);
          resetForm();
          showToast('Soal berhasil diperbarui!', 'success');
        } else {
          // Tetap berada di form agar mempermudah pembuatan soal manual berikutnya
          const nextCount = sessionSavedCount + 1;
          setSessionSavedCount(nextCount);
          setNewText('');
          setNewImageUrl('');
          if (newType === 'MULTIPLE_CHOICE') {
            setChoices([
              { text: '', isCorrect: true },
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
            ]);
          } else if (newType === 'TRUE_FALSE') {
            setChoices([
              { text: 'Benar', isCorrect: true },
              { text: 'Salah', isCorrect: false },
            ]);
          }
          showToast(`Soal ke-${nextCount} berhasil disimpan! Silakan lanjutkan membuat soal berikutnya.`, 'success');
          setTimeout(() => {
            questionTextareaRef.current?.focus();
          }, 100);
        }
      } else {
        showToast(data.message || 'Gagal menyimpan soal.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan saat menyimpan soal.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportBankSoalExcel = () => {
    if (questions.length === 0) {
      showToast('Tidak ada soal untuk diekspor', 'error');
      return;
    }

    try {
      const subjObj = subjects.find((s) => s.id === selectedSubjectId);
      const filterLabel = [
        subjObj ? `Mata Pelajaran: ${subjObj.name}` : 'Mata Pelajaran: Semua',
        selectedGrade ? `Tingkatan / Kelas: ${selectedGrade}` : 'Tingkatan: Semua',
      ].join(' | ');

      const aoa: any[][] = [
        ['EXAMIGO - BANK SOAL & KOLEKSI EVALUASI PEMBELAJARAN'],
        [`Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, '', `Penyelenggara: ${user?.name || '-'}`],
        [`Filter: ${filterLabel}`, '', `Total Koleksi: ${questions.length} Butir Soal`],
        [],
        // Headers
        [
          'No',
          'Butir Soal / Pertanyaan',
          'Tipe Soal',
          'Tingkat Kesulitan',
          'Mata Pelajaran',
          'Tingkatan / Kelas',
          'Topik / Kompetensi',
          'Kunci / Pilihan Jawaban',
          'Pembahasan / Penjelasan Soal',
        ],
      ];

      questions.forEach((q, idx) => {
        let choicesText = '-';
        if (q.choices && q.choices.length > 0) {
          choicesText = q.choices
            .map((c: any, cIdx: number) => {
              const letter = String.fromCharCode(65 + cIdx);
              return `${letter}. ${c.text}${c.isCorrect ? ' [KUNCI]' : ''}`;
            })
            .join(' | ');
        } else if (q.type === 'TRUE_FALSE') {
          choicesText = 'Benar / Salah';
        }

        aoa.push([
          idx + 1,
          (q.text || '').replace(/<[^>]*>?/gm, '').trim(),
          q.type === 'MULTIPLE_CHOICE'
            ? 'Pilihan Ganda'
            : q.type === 'ESSAY'
            ? 'Esai'
            : q.type === 'TRUE_FALSE'
            ? 'Benar/Salah'
            : q.type,
          q.difficulty === 'EASY'
            ? 'Mudah'
            : q.difficulty === 'HARD'
            ? 'Sulit'
            : 'Sedang',
          q.subject ? q.subject.name : 'Umum',
          q.grade || 'Umum',
          q.topic || '-',
          choicesText,
          (q.explanation || '-').replace(/<[^>]*>?/gm, '').trim(),
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(aoa);

      // Set clean column widths
      ws['!cols'] = [
        { wch: 6 },  // No
        { wch: 45 }, // Pertanyaan
        { wch: 18 }, // Tipe Soal
        { wch: 18 }, // Kesulitan
        { wch: 20 }, // Mapel
        { wch: 16 }, // Kelas
        { wch: 22 }, // Topik
        { wch: 40 }, // Pilihan Jawaban
        { wch: 35 }, // Pembahasan
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bank Soal');

      const subjPart = subjObj ? `_${subjObj.name.replace(/\s+/g, '_')}` : '';
      const gradePart = selectedGrade ? `_${selectedGrade.replace(/\s+/g, '_')}` : '';

      XLSX.writeFile(wb, `Bank_Soal_Examigo${subjPart}${gradePart}_${new Date().toISOString().slice(0, 10)}.xlsx`);
      showToast('Bank Soal Excel berhasil diekspor!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengekspor Bank Soal ke Excel.', 'error');
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const toastId = showToast('Memproses import soal...', 'loading');
          const questionsToImport = results.data.map((row: any) => {
            const type = row['Tipe Soal']?.trim() || 'MULTIPLE_CHOICE';
            const difficulty = row['Kesulitan']?.trim() || 'MEDIUM';
            
            const rawChoices = [
              { text: row['Pilihan A'] || '', isCorrect: row['Kunci']?.trim().toUpperCase() === 'A' },
              { text: row['Pilihan B'] || '', isCorrect: row['Kunci']?.trim().toUpperCase() === 'B' },
              { text: row['Pilihan C'] || '', isCorrect: row['Kunci']?.trim().toUpperCase() === 'C' },
              { text: row['Pilihan D'] || '', isCorrect: row['Kunci']?.trim().toUpperCase() === 'D' },
            ].filter(c => c.text);

            return {
              text: row['Soal'] || '',
              type,
              difficulty,
              topic: row['Topik'] || 'Umum',
              points: parseInt(row['Poin']) || 1,
              subjectId: selectedSubjectId || undefined,
              grade: selectedGrade || undefined,
              explanation: row['Pembahasan'] || undefined,
              choices: (type === 'MULTIPLE_CHOICE' || type === 'TRUE_FALSE') ? rawChoices : [],
            };
          }).filter(q => q.text);

          if (questionsToImport.length === 0) {
            dismissToast(toastId);
            showToast('Tidak ada data soal valid yang ditemukan', 'error');
            return;
          }

          const res = await api('/questions/import', {
            method: 'POST',
            body: JSON.stringify({ questions: questionsToImport }),
          });
          const data = await res.json();
          dismissToast(toastId);
          if (data.success) {
            showToast(`Berhasil mengimpor ${data.count} soal!`, 'success');
            loadQuestions();
          } else {
            showToast(data.message || 'Gagal mengimpor soal', 'error');
          }
        } catch (err) {
          console.error(err);
          showToast('Terjadi kesalahan saat import', 'error');
        } finally {
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      },
      error: (error) => {
        showToast('Gagal membaca file CSV', 'error');
        console.error(error);
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in-fast">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-edu-butterLight text-edu-navy font-extrabold text-[11px] border border-edu-butter/40 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Koleksi Soal Terpusat
            </span>
            {isFreePlan && (
              <span className={`px-3 py-1 rounded-full font-black text-[11px] border ${
                questions.length >= 15
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
              }`}>
                Kapasitas: {questions.length} / 15 Soal {questions.length >= 15 ? '(Penuh)' : ''}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-edu-navy flex items-center gap-2.5">
            <HelpCircle className="w-8 h-8 text-edu-electric fill-edu-electricLight" /> Bank Soal & Materi
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
            Kelola seluruh koleksi butir soal ujian, kategori mata pelajaran, serta kunci & pembahasan.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportBankSoalExcel}
            className="saas-button-secondary px-4 py-2.5 text-xs font-black gap-2 shadow-sm cursor-pointer"
            title="Export Bank Soal Terfilter ke Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Excel
          </button>
          <button
            onClick={() => {
              if (isFreePlan && questions.length >= 15) {
                showToast('Kapasitas Bank Soal Paket Free (maksimal 15 butir soal) telah penuh. Silakan hapus beberapa butir soal lama atau Upgrade ke Personal/Pro untuk menambah kapasitas penyimpanan!', 'error');
                return;
              }
              resetForm();
              setShowAddModal(true);
            }}
            className="saas-button-primary px-5 py-2.5 text-xs font-black gap-2 shadow-edu-button"
          >
            <Plus className="w-4 h-4" /> Tambah Soal Manual
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="saas-card p-5 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kata kunci soal..."
            className="saas-input pl-10 font-bold"
          />
        </div>

        <div>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="saas-input font-bold"
          >
            <option value="">-- Semua Mata Pelajaran --</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s._count?.questions !== undefined ? `(${s._count.questions} soal)` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="saas-input font-bold"
          >
            <option value="">-- Semua Tingkatan --</option>
            {GRADE_LEVELS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="saas-input font-bold"
          >
            <option value="">Semua Tingkat Kesulitan</option>
            <option value="EASY">Mudah (Easy)</option>
            <option value="MEDIUM">Sedang (Medium)</option>
            <option value="HARD">Sulit (Hard)</option>
          </select>
        </div>
      </div>

      {/* Active Filter Bar Summary */}
      {(selectedSubjectId || selectedGrade || selectedDifficulty || search) && (
        <div className="flex items-center justify-between px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-slate-500 text-[11px]">Filter Aktif:</span>
            {selectedSubjectId && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-bold text-edu-navy text-[11px] shadow-2xs">
                <span>Mapel: {subjects.find(s => s.id === selectedSubjectId)?.name || selectedSubjectId}</span>
                {(() => {
                  const s = subjects.find(x => x.id === selectedSubjectId);
                  return s ? (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSubject(e, s.id, s.name)}
                      title={`Hapus mata pelajaran ${s.name}`}
                      className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer ml-0.5"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  ) : null;
                })()}
                <button type="button" onClick={() => setSelectedSubjectId('')} className="text-slate-400 hover:text-red-600 font-black ml-0.5">×</button>
              </span>
            )}
            {selectedGrade && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-bold text-edu-navy text-[11px] shadow-2xs">
                Tingkatan: {selectedGrade}
                <button type="button" onClick={() => setSelectedGrade('')} className="text-slate-400 hover:text-red-600 font-black">×</button>
              </span>
            )}
            {selectedDifficulty && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-bold text-edu-navy text-[11px] shadow-2xs">
                Kesulitan: {selectedDifficulty}
                <button type="button" onClick={() => setSelectedDifficulty('')} className="text-slate-400 hover:text-red-600 font-black">×</button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-bold text-edu-navy text-[11px] shadow-2xs">
                Cari: "{search}"
                <button type="button" onClick={() => setSearch('')} className="text-slate-400 hover:text-red-600 font-black">×</button>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedSubjectId('');
              setSelectedGrade('');
              setSelectedDifficulty('');
              setSearch('');
            }}
            className="text-xs font-black text-red-600 hover:text-red-700 cursor-pointer ml-3 shrink-0"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* Sub-toolbar: Seleksi Soal */}
      {paginatedQuestions.length > 0 && (
        <div className="flex items-center justify-between px-1 text-xs text-slate-600 font-medium">
          <label className="flex items-center gap-2 cursor-pointer font-bold select-none hover:text-slate-900">
            <input
              type="checkbox"
              id="select-all-page"
              checked={areAllPageSelected}
              onChange={toggleSelectAllPage}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
            />
            <span>Pilih Semua di Halaman Ini ({paginatedQuestions.length} soal)</span>
          </label>

          {selectedQuestionIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span>
                <strong className="text-emerald-700 font-black">{selectedQuestionIds.length}</strong> dari {questions.length} soal dipilih
              </span>
              <button
                type="button"
                onClick={clearSelection}
                className="text-slate-400 hover:text-slate-700 font-bold underline cursor-pointer text-[11px]"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Bulk Action Bar (Bottom Center) */}
      {selectedQuestionIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-fade-in-fast max-w-[95vw]">
          <div className="flex items-center gap-2.5 pr-3 border-r border-slate-800">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">
              {selectedQuestionIds.length}
            </span>
            <span className="text-xs font-bold text-slate-200 hidden sm:inline">Soal Terpilih</span>
          </div>

          <div className="flex items-center gap-2">
            {selectedQuestionIds.length < questions.length && (
              <button
                type="button"
                onClick={selectAllFiltered}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                Pilih Semua ({questions.length})
              </button>
            )}
            <button
              type="button"
              onClick={clearSelection}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="px-4 py-1.5 text-xs font-black rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isBulkDeleting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" /> Hapus ({selectedQuestionIds.length})
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-3">
        {questions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Tidak ada soal ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter mata pelajaran dan tingkatan kelas.</p>
            </div>
          </div>
        ) : (
          paginatedQuestions.map((q, idx) => (
            <div 
              key={q.id || idx} 
              className={`saas-card p-5 bg-white border transition-all space-y-3 relative group ${
                selectedQuestionIds.includes(q.id)
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <input
                    type="checkbox"
                    checked={selectedQuestionIds.includes(q.id)}
                    onChange={() => toggleSelectQuestion(q.id)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer shrink-0"
                    title="Pilih soal ini untuk aksi massal"
                  />
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                    {q.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {q.difficulty}
                  </span>
                  {q.topic && (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-700 text-[10px] font-bold flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {q.topic}
                    </span>
                  )}
                  {q.subjectId && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {subjects.find((s) => s.id === q.subjectId)?.name || 'Mapel'}
                    </span>
                  )}
                  {q.grade && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" /> {q.grade}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewQuestion(q)}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-600 border border-slate-200 hover:border-slate-200 transition-colors shadow-sm"
                    title="Lihat Detail & Pratinjau Soal"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditClick(q)}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors shadow-sm"
                    title="Edit Soal"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors shadow-sm"
                    title="Hapus Soal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs font-bold text-slate-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatRichText(q.text) }} />

              {q.material && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px]">
                    <BookOpen className="w-3.5 h-3.5" /> Materi: {q.material.title || 'Dokumen Rujukan'}
                  </div>
                  {q.material.extractedText && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 italic">{q.material.extractedText}</p>
                  )}
                </div>
              )}

              {q.imageUrl && (
                <div className="pt-2">
                  <img src={q.imageUrl} alt="Gambar Rujukan Soal" className="max-h-56 rounded-xl border border-slate-200 object-contain bg-slate-50 p-1" />
                </div>
              )}

              {q.choices && q.choices.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {q.choices.map((c: any, cIdx: number) => (
                    <div
                      key={cIdx}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between font-medium ${
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
            </div>
          ))
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalItems={questions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(p) => {
            setCurrentPage(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onItemsPerPageChange={setItemsPerPage}
          itemsPerPageOptions={[10, 20, 50, 100]}
          itemName="soal"
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs"
        />
      </div>

      {/* Modal Add/Edit Question */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Main Form Box */}
            <div className="flex-1 rounded-2xl border border-slate-200 p-6 space-y-4 overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {editingQuestionId ? 'Edit Soal' : 'Tambah Soal Baru'}
                  </h3>
                  {!editingQuestionId && sessionSavedCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 animate-fade-in-fast">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {sessionSavedCount} Soal Berhasil Disimpan
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Tutup Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveQuestion} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 block">Pertanyaan</label>
                    {newText.trim().length > 3 && newType === 'MULTIPLE_CHOICE' && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            showToast('Membuat pilihan jawaban otomatis...', 'info');
                            const res = await api('/ai/generate', {
                              method: 'POST',
                              body: JSON.stringify({
                                materialText: newText,
                                count: 1,
                                questionTypes: ['MULTIPLE_CHOICE'],
                                difficulty: newDifficulty,
                              }),
                            });
                            const data = await res.json();
                            if (data.success && data.data && data.data[0]?.choices) {
                              setChoices(data.data[0].choices);
                              showToast('Pilihan jawaban berhasil di-generate otomatis!', 'success');
                            } else {
                              showToast('Gagal membuat pilihan otomatis.', 'error');
                            }
                          } catch (err) {
                            console.error(err);
                            showToast('Gagal terhubung ke server generator.', 'error');
                          }
                        }}
                        className="text-[10px] font-bold text-slate-700 hover:text-slate-800 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100"
                      >
                        <Sparkles className="w-3 h-3 text-slate-600" /> Auto-Generate Pilihan
                      </button>
                    )}
                  </div>
                  <textarea
                    ref={questionTextareaRef}
                    rows={4}
                    required
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    onFocus={() => setFocusedInput({ type: 'question' })}
                    className="saas-input leading-relaxed"
                    placeholder="Tuliskan isi soal..."
                  />
                </div>

                {/* Gambar / Diagram Soal */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Gambar / Diagram Soal (Opsional)</label>
                  {newImageUrl ? (
                    <div className="relative inline-block border border-slate-200 rounded-xl overflow-hidden group">
                      <img src={newImageUrl} alt="Pratinjau Gambar Soal" className="max-h-36 rounded-xl object-contain bg-slate-50 p-1" />
                      <button
                        type="button"
                        onClick={() => setNewImageUrl('')}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
                        title="Hapus Gambar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        id="question-img-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              showToast('Ukuran gambar maksimal 5MB', 'error');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setNewImageUrl(ev.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="question-img-upload"
                        className="saas-button-secondary px-3.5 py-2 text-xs cursor-pointer flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4 text-slate-600" /> Unggah Gambar Soal (PNG/JPG/WebP)
                      </label>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Tipe Soal</label>
                    <select
                      value={newType}
                      onChange={(e) => {
                        const t = e.target.value;
                        setNewType(t);
                        if (t === 'TRUE_FALSE') {
                          setChoices([
                            { text: 'Benar', isCorrect: true },
                            { text: 'Salah', isCorrect: false },
                          ]);
                        }
                      }}
                      className="saas-input"
                    >
                      <option value="MULTIPLE_CHOICE">Pilihan Ganda</option>
                      <option value="ESSAY">Essay</option>
                      <option value="TRUE_FALSE">Benar / Salah</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Tingkat Kesulitan</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value)}
                      className="saas-input"
                    >
                      <option value="EASY">Mudah</option>
                      <option value="MEDIUM">Sedang</option>
                      <option value="HARD">Sulit</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Mata Pelajaran (Subject) <span className="text-red-500 font-bold">*</span>
                      </label>
                      <select
                        value={newSubjectId}
                        required
                        onChange={(e) => handleSelectNewSubject(e.target.value)}
                        className="saas-input"
                      >
                        <option value="">-- Pilih Mata Pelajaran --</option>
                        {getJenjangFromGrade(newGrade) ? (
                          <optgroup label={`Kurikulum Resmi ${getJenjangFromGrade(newGrade)}`}>
                            {CURRICULUM_SUBJECTS[getJenjangFromGrade(newGrade)!]?.map((subjName) => {
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
                        value={newGrade}
                        required
                        onChange={(e) => setNewGrade(e.target.value)}
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
                    <label className="text-xs font-bold text-slate-700 block mb-1">Topik / Tag</label>
                    <input
                      type="text"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      className="saas-input"
                      placeholder="Contoh: Trigonometri, Aljabar Linear"
                    />
                  </div>
                </div>

                {newType === 'MULTIPLE_CHOICE' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Pilihan Jawaban</label>
                    {choices.map((c, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct-choice"
                          checked={c.isCorrect}
                          onChange={() => {
                            const updated = choices.map((item, idx) => ({
                              ...item,
                              isCorrect: idx === i,
                            }));
                            setChoices(updated);
                          }}
                          className="accent-indigo-600 h-4 w-4"
                        />
                        <input
                          type="text"
                          placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                          value={c.text}
                          onFocus={() => setFocusedInput({ type: 'choice', index: i })}
                          onChange={(e) => {
                            const updated = [...choices];
                            updated[i].text = e.target.value;
                            setChoices(updated);
                          }}
                          className="saas-input flex-1"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {newType === 'TRUE_FALSE' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Jawaban Benar</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                        <input
                          type="radio"
                          name="tf-correct"
                          checked={choices[0]?.isCorrect}
                          onChange={() => setChoices([{ text: 'Benar', isCorrect: true }, { text: 'Salah', isCorrect: false }])}
                          className="accent-indigo-600 h-4 w-4"
                        />
                        Benar
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                        <input
                          type="radio"
                          name="tf-correct"
                          checked={choices[1]?.isCorrect}
                          onChange={() => setChoices([{ text: 'Benar', isCorrect: false }, { text: 'Salah', isCorrect: true }])}
                          className="accent-indigo-600 h-4 w-4"
                        />
                        Salah
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <div>
                    {!editingQuestionId && sessionSavedCount > 0 && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-fade-in-fast">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {sessionSavedCount} soal tersimpan
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => { setShowAddModal(false); resetForm(); }}
                      className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {sessionSavedCount > 0 ? 'Selesai' : 'Batal'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
                      className="px-5 py-2 text-xs font-bold rounded-xl text-white hover:opacity-90 shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          Menyimpan...
                        </>
                      ) : editingQuestionId ? (
                        'Simpan Perubahan'
                      ) : (
                        'Simpan Soal'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Sidebar Tools Panel */}
            <div className="w-full md:w-72 rounded-2xl border border-slate-200 p-5 flex flex-col space-y-4 bg-white shadow-xl shrink-0 overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">Tools Pendukung</h4>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600 block">Pintasan Format:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => insertSymbol('**')}
                    className="py-2 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-center"
                    title="Format Tebal (Bold)"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSymbol('*')}
                    className="py-2 text-xs font-bold italic rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-center"
                    title="Format Miring (Italic)"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSymbol('<u>')}
                    className="py-2 text-xs font-bold underline rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-center"
                    title="Format Garis Bawah (Underline)"
                  >
                    U
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col space-y-2 min-w-0">
                <label className="text-[11px] font-bold text-slate-600 block">Simbol MTK / Sains:</label>
                <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 overflow-y-auto max-h-[250px] md:max-h-[none]">
                  {MATH_SYMBOLS.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => insertSymbol(sym)}
                      className="py-2 text-center text-xs font-bold rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 transition-all shrink-0"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Material */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Tambah Materi Pendukung Baru</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Judul Materi</label>
                <input
                  type="text"
                  required
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  className="saas-input"
                  placeholder="Contoh: Teks Bacaan: Cerita Kancil dan Buaya"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mata Pelajaran (Opsional)</label>
                <select
                  value={newMaterialSubjectId}
                  onChange={(e) => setNewMaterialSubjectId(e.target.value)}
                  className="saas-input"
                >
                  <option value="">-- Tanpa Mapel --</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Isi Teks / Konten Materi</label>
                <textarea
                  rows={8}
                  required
                  value={newMaterialText}
                  onChange={(e) => setNewMaterialText(e.target.value)}
                  className="saas-input leading-relaxed"
                  placeholder="Tuliskan teks bacaan atau rangkuman materi lengkap di sini..."
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddMaterialModal(false);
                  setNewMaterialTitle('');
                  setNewMaterialText('');
                  setNewMaterialSubjectId('');
                }}
                className="saas-button-secondary px-4 py-2 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!newMaterialTitle.trim() || !newMaterialText.trim()) {
                    showToast('Judul dan isi materi wajib diisi.', 'error');
                    return;
                  }
                  try {
                    const res = await api('/materials', {
                      method: 'POST',
                      body: JSON.stringify({
                        title: newMaterialTitle,
                        extractedText: newMaterialText,
                        subjectId: newMaterialSubjectId || undefined
                      }),
                    });
                    const data = await res.json();
                    if (data.success && data.data) {
                      showToast('Materi pendukung berhasil disimpan!', 'success');
                      setNewMaterialTitle('');
                      setNewMaterialText('');
                      setNewMaterialSubjectId('');
                      setShowAddMaterialModal(false);
                    } else {
                      showToast(data.message || 'Gagal menyimpan materi.', 'error');
                    }
                  } catch (err) {
                    console.error(err);
                    showToast('Gagal terhubung ke server.', 'error');
                  }
                }}
                className="saas-button-primary px-4 py-2 text-xs font-bold"
              >
                Simpan Materi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Soal (Eye Icon Preview) */}
      {previewQuestion && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-slate-600" /> Detail & Pratinjau Soal
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Tampilan lengkap soal beserta kunci jawaban dan referensi.</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewQuestion(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badges Info */}
            <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-700 uppercase">
                {previewQuestion.type}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {previewQuestion.difficulty}
              </span>
              {previewQuestion.topic && (
                <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> {previewQuestion.topic}
                </span>
              )}
              {previewQuestion.subjectId && (
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> {subjects.find((s) => s.id === previewQuestion.subjectId)?.name || 'Mapel'}
                </span>
              )}
              {previewQuestion.grade && (
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> {previewQuestion.grade}
                </span>
              )}
            </div>

            {/* Content Text */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Teks Soal:</span>
              <p
                className="text-sm font-bold text-slate-900 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatRichText(previewQuestion.text) }}
              />
            </div>

            {/* Material Reference */}
            {previewQuestion.material && (
              <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                  <BookOpen className="w-4 h-4 text-slate-600" /> Materi Referensi: {previewQuestion.material.title}
                </div>
                {previewQuestion.material.extractedText && (
                  <p className="text-xs text-slate-600 italic bg-white p-3 rounded-lg border border-slate-100/60 leading-relaxed">
                    {previewQuestion.material.extractedText}
                  </p>
                )}
              </div>
            )}

            {/* Question Image */}
            {previewQuestion.imageUrl && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Gambar Soal:</span>
                <img
                  src={previewQuestion.imageUrl}
                  alt="Gambar Soal"
                  className="max-h-72 rounded-xl border border-slate-200 object-contain bg-slate-50 p-2 mx-auto"
                />
              </div>
            )}

            {/* Choices */}
            {previewQuestion.choices && previewQuestion.choices.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Pilihan Jawaban:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {previewQuestion.choices.map((c: any, cIdx: number) => (
                    <div
                      key={cIdx}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between font-medium ${
                        c.isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span dangerouslySetInnerHTML={{ __html: formatRichText(c.text) }} />
                      {c.isCorrect && <CheckCircle className="w-4 h-4 text-edu-sage shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation */}
            {previewQuestion.explanation && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium space-y-1">
                <span className="font-bold block text-amber-950">Penjelasan / Kunci Jawaban:</span>
                <p>{previewQuestion.explanation}</p>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const qToEdit = previewQuestion;
                  setPreviewQuestion(null);
                  handleEditClick(qToEdit);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Soal Ini
              </button>
              <button
                type="button"
                onClick={() => setPreviewQuestion(null)}
                className="saas-button-primary px-5 py-2 text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
