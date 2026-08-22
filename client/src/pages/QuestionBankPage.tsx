import React, { useEffect, useState, useRef } from 'react';
import { HelpCircle, Search, Filter, Plus, CheckCircle, Tag, Trash2, Edit, BookOpen, GraduationCap, Sparkles, FileText, ChevronDown, ChevronUp, Upload, Image as ImageIcon, Download, FileSpreadsheet, Eye } from 'lucide-react';
import Papa from 'papaparse';
import { api } from '../lib/auth';
import { useToast } from '../components/Toast';
import { GRADE_LEVELS } from '../lib/constants';
import { formatRichText } from '../lib/formatters';
export { formatRichText } from '../lib/formatters';
import * as XLSX from 'xlsx';

const MATH_SYMBOLS = [
  '√', 'π', '²', '³', '⁴', '½', '¼', '¾', '±', '×', '÷', '≠', '≈', '≤', '≥', '∞', '∑', '∫', 'α', 'β', 'γ', 'θ', 'Δ', 'Ω', 'λ', 'μ', 'σ', '°', '∠', '⊥', '△'
];

export default function QuestionBankPage() {
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

  // Subject Form State
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDesc, setNewSubjectDesc] = useState('');

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
    loadQuestions();
  }, [search, selectedDifficulty, selectedSubjectId, selectedGrade]);

  const resetForm = () => {
    setNewText('');
    setNewType('MULTIPLE_CHOICE');
    setNewDifficulty('MEDIUM');
    setNewTopic('');
    setNewSubjectId('');
    setNewGrade('');
    setNewImageUrl('');
    setChoices([
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]);
    setEditingQuestionId(null);
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

    try {
      const url = editingQuestionId ? `/questions/${editingQuestionId}` : '/questions';
      const method = editingQuestionId ? 'PUT' : 'POST';

      const res = await api(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        resetForm();
        loadQuestions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportBankSoalExcel = () => {
    if (questions.length === 0) {
      showToast('Tidak ada soal untuk diekspor', 'error');
      return;
    }

    try {
      const wsData = questions.map((q, idx) => ({
        'No': idx + 1,
        'Pertanyaan': (q.text || '').replace(/<[^>]*>?/gm, ''),
        'Tipe Soal': q.type,
        'Tingkat Kesulitan': q.difficulty,
        'Mata Pelajaran': q.subject ? q.subject.name : 'Umum',
        'Tingkatan / Kelas': q.grade || 'Umum',
        'Topik': q.topic || '-',
        'Kunci / Pilihan Jawaban': (q.choices && q.choices.length > 0)
          ? q.choices.map((c: any) => `${c.text}${c.isCorrect ? ' (Kunci)' : ''}`).join(' | ')
          : q.explanation || '-',
      }));

      const ws = XLSX.utils.json_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bank Soal');

      const subjObj = subjects.find(s => s.id === selectedSubjectId);
      const subjPart = subjObj ? `_${subjObj.name.replace(/\s+/g, '_')}` : '';
      const gradePart = selectedGrade ? `_${selectedGrade.replace(/\s+/g, '_')}` : '';

      XLSX.writeFile(wb, `Bank_Soal_Examigo${subjPart}${gradePart}_${new Date().toISOString().slice(0, 10)}.xlsx`);
      showToast('Berhasil mengekspor Bank Soal ke Excel!', 'success');
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-indigo-600" /> Bank Soal
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Kelola seluruh koleksi soal ujian, kategori mata pelajaran, dan pilihan jawaban.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleImportCSV}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="saas-button-secondary px-3.5 py-2.5 text-xs font-bold flex items-center gap-2"
            title="Import Soal dari CSV"
          >
            <Download className="w-4 h-4 text-blue-600" /> Import CSV
          </button>
          <button
            onClick={handleExportBankSoalExcel}
            className="saas-button-secondary px-3.5 py-2.5 text-xs font-bold flex items-center gap-2"
            title="Export Bank Soal Terfilter ke Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Excel
          </button>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="saas-button-primary px-4 py-2.5 text-xs font-bold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah Soal Manual
          </button>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200/80">
        <button
          onClick={() => setSelectedSubjectId('')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedSubjectId === ''
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Semua Mapel
        </button>

        {subjects.map((subj) => (
          <div key={subj.id} className="relative group/subject flex items-center">
            <button
              onClick={() => setSelectedSubjectId(subj.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedSubjectId === subj.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {subj.name}
            </button>
          </div>
        ))}

        <button
          onClick={() => setShowAddSubjectModal(true)}
          className="px-3.5 py-2 rounded-xl bg-white border border-dashed border-slate-300 text-indigo-600 hover:bg-indigo-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Mapel
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="saas-card p-4 bg-white border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pertanyaan atau topik..."
            className="saas-input pl-10"
          />
        </div>

        <div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="saas-input"
          >
            <option value="">-- Semua Tingkatan Sekolah --</option>
            {GRADE_LEVELS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="saas-input"
          >
            <option value="">Semua Tingkat Kesulitan</option>
            <option value="EASY">Mudah (Easy)</option>
            <option value="MEDIUM">Sedang (Medium)</option>
            <option value="HARD">Sulit (Hard)</option>
          </select>
        </div>

        <div className="flex items-center justify-end text-xs text-slate-500 font-medium">
          Total: <strong className="text-slate-900 ml-1 font-extrabold">{questions.length} Soal Tersedia</strong>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div key={q.id || idx} className="saas-card p-5 bg-white border border-slate-200/80 space-y-3 relative group">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">
                  {q.type}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                  {q.difficulty}
                </span>
                {q.topic && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {q.topic}
                  </span>
                )}
                {q.subjectId && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {subjects.find((s) => s.id === q.subjectId)?.name || 'Mapel'}
                  </span>
                )}
                {q.grade && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" /> {q.grade}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPreviewQuestion(q)}
                  className="p-1.5 rounded-lg bg-white hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 transition-colors shadow-sm"
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
                <div className="flex items-center gap-1.5 font-bold text-indigo-700 text-[11px]">
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
                    {c.isCorrect && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Add/Edit Question */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Main Form Box */}
            <div className="flex-1 rounded-2xl border border-slate-200 p-6 space-y-4 overflow-y-auto bg-white shadow-xl">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                {editingQuestionId ? 'Edit Soal' : 'Tambah Soal Baru'}
              </h3>

              <form onSubmit={handleSaveQuestion} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 block">Pertanyaan</label>
                    {newText.trim().length > 3 && newType === 'MULTIPLE_CHOICE' && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            showToast('Membuat pilihan jawaban otomatis dengan AI...', 'info');
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
                              showToast('Pilihan jawaban berhasil di-generate AI!', 'success');
                            } else {
                              showToast('Gagal membuat pilihan otomatis.', 'error');
                            }
                          } catch (err) {
                            console.error(err);
                            showToast('Gagal terhubung ke AI server.', 'error');
                          }
                        }}
                        className="text-[10px] font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-600" /> Auto-Generate Pilihan (AI)
                      </button>
                    )}
                  </div>
                  <textarea
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
                        <Upload className="w-4 h-4 text-indigo-600" /> Unggah Gambar Soal (PNG/JPG/WebP)
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
                        onChange={(e) => setNewSubjectId(e.target.value)}
                        className="saas-input"
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

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    className="saas-button-secondary px-4 py-2 text-xs font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="saas-button-primary px-4 py-2 text-xs font-bold"
                  >
                    Simpan Soal
                  </button>
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

      {/* Modal Add Subject */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Tambah Mata Pelajaran Baru</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  required
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="saas-input"
                  placeholder="Contoh: Matematika, Fisika, dll."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi (Opsional)</label>
                <input
                  type="text"
                  value={newSubjectDesc}
                  onChange={(e) => setNewSubjectDesc(e.target.value)}
                  className="saas-input"
                  placeholder="Deskripsi singkat kelas..."
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
                Simpan
              </button>
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
                  <Eye className="w-5 h-5 text-indigo-600" /> Detail & Pratinjau Soal
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Tampilan lengkap soal beserta kunci jawaban dan referensi.</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewQuestion(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Badges Info */}
            <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 uppercase">
                {previewQuestion.type}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {previewQuestion.difficulty}
              </span>
              {previewQuestion.topic && (
                <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 flex items-center gap-1">
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
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-indigo-800 text-xs">
                  <BookOpen className="w-4 h-4 text-indigo-600" /> Materi Referensi: {previewQuestion.material.title}
                </div>
                {previewQuestion.material.extractedText && (
                  <p className="text-xs text-slate-600 italic bg-white p-3 rounded-lg border border-indigo-100/60 leading-relaxed">
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
                      {c.isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
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
