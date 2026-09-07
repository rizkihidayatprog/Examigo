import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart2, Download, TrendingUp, Users, Award, FileSpreadsheet, FileText, Filter, Eye, X, CheckCircle, XCircle, AlertTriangle, ShieldAlert, Search, Lock, Sparkles, Lightbulb, Zap } from 'lucide-react';
import { api, useAuth } from '../lib/auth';
import { useToast } from '../components/Toast';
import { GRADE_LEVELS } from '../lib/constants';
import { formatRichText } from './QuestionBankPage';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generateCertificatePdf } from '../lib/certificateGenerator';
import Pagination from '../components/common/Pagination';

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
  const [cmsConfig, setCmsConfig] = useState<any>(null);

  // Pagination State for Recent Student Results
  const [resultsPage, setResultsPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  // Search & Pagination State for Item Analysis
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [itemPage, setItemPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

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
    fetch('/api/public/landing-config')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) {
          setCmsConfig(d.data);
        }
      })
      .catch(() => {});

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

  useEffect(() => {
    setResultsPage(1);
  }, [searchQuery, selectedSubjectId, selectedGrade]);

  const filteredResults = (data?.recentResults || []).filter((r: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = (r.studentName || '').toLowerCase().includes(q);
    const emailMatch = (r.studentEmail && !r.studentEmail.includes('@student.examigo.id'))
      ? r.studentEmail.toLowerCase().includes(q)
      : false;
    const examMatch = (r.examTitle || '').toLowerCase().includes(q);
    return nameMatch || emailMatch || examMatch;
  });

  const paginatedResults = filteredResults.slice(
    (resultsPage - 1) * resultsPerPage,
    resultsPage * resultsPerPage
  );

  const filteredItemAnalysis = (data?.itemAnalysis || []).filter((item: any) => {
    if (!itemSearchQuery.trim()) return true;
    return (item.questionText || '').toLowerCase().includes(itemSearchQuery.toLowerCase().trim());
  });

  const paginatedItemAnalysis = filteredItemAnalysis.slice(
    (itemPage - 1) * itemPerPage,
    itemPage * itemPerPage
  );

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
        `"${((r.studentEmail && !r.studentEmail.includes('@student.examigo.id')) ? r.studentEmail : '-').replace(/"/g, '""')}"`,
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
      const selectedSubjObj = subjects.find((s) => s.id === selectedSubjectId);
      const filterLabel = [
        selectedSubjObj ? `Mapel: ${selectedSubjObj.name}` : 'Mapel: Semua',
        selectedGrade ? `Kelas: ${selectedGrade}` : 'Kelas: Semua',
        searchQuery.trim() ? `Pencarian: "${searchQuery.trim()}"` : null,
      ].filter(Boolean).join(' | ');

      const totalStudents = filteredResults.length;
      const passedCount = filteredResults.filter((r: any) => r.status === 'LULUS').length;
      const passRate = totalStudents > 0 ? Math.round((passedCount / totalStudents) * 100) : 0;
      const scores = filteredResults.map((r: any) => Number(r.score) || 0);
      const avgScore = totalStudents > 0 ? (scores.reduce((a: number, b: number) => a + b, 0) / totalStudents).toFixed(1) : '0';
      const maxScore = totalStudents > 0 ? Math.max(...scores) : 0;
      const minScore = totalStudents > 0 ? Math.min(...scores) : 0;

      // Construct beautifully structured Array of Arrays for SheetJS
      const aoa: any[][] = [
        ['EXAMIGO - LAPORAN REKAPITULASI HASIL UJIAN'],
        [`Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, '', `Penyelenggara / Pengajar: ${user?.name || '-'}`],
        [`Filter: ${filterLabel}`, '', `Total Baris: ${totalStudents} Peserta`],
        [],
        // Metric summary row
        ['RINGKASAN EKSEKUTIF:'],
        ['Total Peserta', 'Rata-Rata Nilai', 'Kelulusan', 'Nilai Tertinggi', 'Nilai Terendah'],
        [`${totalStudents} Siswa`, Number(avgScore), `${passRate}% (${passedCount} Lulus)`, maxScore, minScore],
        [],
        // Main Table Headers
        ['No', 'Nama Lengkap Siswa', 'NIS / Identitas', 'Email Siswa', 'Judul Ujian', 'Mata Pelajaran', 'Tingkat / Kelas', 'Nilai', 'Status', 'Tanggal Selesai'],
      ];

      // Table data rows
      filteredResults.forEach((r: any, idx: number) => {
        const nis = r.customFields?.nis || '-';
        const email = (r.studentEmail && !r.studentEmail.includes('@student.examigo.id')) ? r.studentEmail : '-';
        aoa.push([
          idx + 1,
          r.studentName,
          nis,
          email,
          r.examTitle || '-',
          r.subjectName || 'Umum',
          r.grade || 'Umum',
          r.score !== null && r.score !== undefined ? Number(r.score) : 0,
          r.status || (r.score >= 70 ? 'LULUS' : 'TIDAK LULUS'),
          r.submittedAt || '-',
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(aoa);

      // Set explicit professional column widths
      ws['!cols'] = [
        { wch: 6 },  // No
        { wch: 28 }, // Nama
        { wch: 16 }, // NIS
        { wch: 26 }, // Email
        { wch: 26 }, // Ujian
        { wch: 20 }, // Mapel
        { wch: 16 }, // Kelas
        { wch: 10 }, // Nilai
        { wch: 16 }, // Status
        { wch: 18 }, // Tanggal
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Hasil Ujian');

      XLSX.writeFile(wb, getExportFilename('xlsx'));
      showToast('Laporan Excel resmi berhasil diekspor!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengekspor data ke Excel.', 'error');
    }
  };

  const handleExportPDF = () => {
    if (userPlan !== 'PRO_AI') {
      showToast('Ekspor Laporan PDF hanya tersedia untuk pengguna Paket Pro. Silakan upgrade paket Anda.', 'error');
      setShowUpgradeModal(true);
      return;
    }

    if (filteredResults.length === 0) {
      showToast('Tidak ada data untuk diekspor', 'error');
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginLeft = 14;
      const marginRight = 14;
      const contentWidth = pageWidth - marginLeft - marginRight;

      // 1. Top Decorative Brand Bar
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 4.5, 'F');
      doc.setFillColor(16, 185, 129); // emerald-500 accent stripe
      doc.rect(0, 4.5, pageWidth, 1, 'F');

      // 2. Official Header (Kop Dokumen)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(5, 150, 105); // emerald-600
      doc.text('EXAMIGO', marginLeft, 13.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text('|  SISTEM EVALUASI & PENILAIAN AKADEMIK', marginLeft + 18, 13.5);

      // Main Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('LAPORAN REKAPITULASI HASIL UJIAN', marginLeft, 21.5);

      // Filters & Metadata Subtitle
      const selectedSubjObj = subjects.find((s) => s.id === selectedSubjectId);
      const filterItems = [
        selectedSubjObj ? `Mata Pelajaran: ${selectedSubjObj.name}` : 'Mata Pelajaran: Semua',
        selectedGrade ? `Tingkat: ${selectedGrade}` : 'Tingkat: Semua',
        searchQuery.trim() ? `Pencarian: "${searchQuery.trim()}"` : null,
      ].filter(Boolean).join('   •   ');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text(filterItems, marginLeft, 27);

      // Right metadata info box
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      const teacherText = user?.name ? `Pengajar: ${user.name}` : 'Penyelenggara: Sekolah';
      doc.text(teacherText, pageWidth - marginRight, 13.5, { align: 'right' });
      doc.text(
        `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        pageWidth - marginRight,
        18,
        { align: 'right' }
      );
      doc.text('Status: Dokumen Sah Terverifikasi', pageWidth - marginRight, 22.5, { align: 'right' });

      // Fine hairline divider
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.4);
      doc.line(marginLeft, 31, pageWidth - marginRight, 31);

      // 3. KPI / Summary Cards Row
      const totalStudents = filteredResults.length;
      const passedList = filteredResults.filter((r: any) => r.status === 'LULUS');
      const passRate = totalStudents > 0 ? Math.round((passedList.length / totalStudents) * 100) : 0;
      const scores = filteredResults.map((r: any) => Number(r.score) || 0);
      const avgScore = totalStudents > 0 ? (scores.reduce((a: number, b: number) => a + b, 0) / totalStudents).toFixed(1) : '0';
      const maxScore = totalStudents > 0 ? Math.max(...scores) : 0;
      const minScore = totalStudents > 0 ? Math.min(...scores) : 0;

      const cardCount = 4;
      const cardGap = 3.5;
      const cardWidth = (contentWidth - (cardCount - 1) * cardGap) / cardCount;
      const cardHeight = 15;
      const cardY = 34.5;

      const summaryCards = [
        { label: 'TOTAL PESERTA', val: `${totalStudents} Siswa`, highlight: false },
        { label: 'RATA-RATA NILAI', val: `${avgScore}`, highlight: false },
        { label: 'KELULUSAN', val: `${passRate}% (${passedList.length} Lulus)`, highlight: true },
        { label: 'TERTINGGI / TERENDAH', val: `${maxScore} / ${minScore}`, highlight: false },
      ];

      summaryCards.forEach((card, idx) => {
        const x = marginLeft + idx * (cardWidth + cardGap);

        // Box background
        doc.setFillColor(248, 250, 252); // slate-50
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.setLineWidth(0.35);
        doc.roundedRect(x, cardY, cardWidth, cardHeight, 1.5, 1.5, 'FD');

        // Card Label
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text(card.label, x + 3.5, cardY + 5);

        // Card Value
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        if (card.highlight) {
          doc.setTextColor(5, 150, 105); // emerald-600
        } else {
          doc.setTextColor(15, 23, 42); // slate-900
        }
        doc.text(card.val, x + 3.5, cardY + 11.5);
      });

      // 4. Table Body Generation
      const tableBody = filteredResults.map((r: any, idx: number) => {
        const studentDetails = [
          r.customFields?.nis ? `NIS: ${r.customFields.nis}` : null,
          r.customFields?.absentNo ? `Absen: ${r.customFields.absentNo}` : null,
          r.studentEmail && !r.studentEmail.includes('@student.examigo.id') ? r.studentEmail : null,
        ].filter(Boolean).join(' • ');

        const studentText = studentDetails ? `${r.studentName}\n${studentDetails}` : r.studentName;

        return [
          idx + 1,
          studentText,
          r.examTitle || '-',
          r.subjectName || 'Umum',
          r.grade || 'Umum',
          r.score !== null && r.score !== undefined ? Number(r.score) : 0,
          r.status || (r.score >= 70 ? 'LULUS' : 'TIDAK LULUS'),
        ];
      });

      // 5. Render autoTable
      autoTable(doc, {
        startY: 53.5,
        head: [['NO', 'NAMA SISWA', 'UJIAN', 'MAPEL', 'KELAS', 'NILAI', 'STATUS']],
        body: tableBody,
        theme: 'plain',
        headStyles: {
          fillColor: [15, 23, 42], // slate-900
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 7.5,
          halign: 'left',
          cellPadding: { top: 3.2, bottom: 3.2, left: 3, right: 3 },
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [30, 41, 59], // slate-800
          cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // slate-50
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10, textColor: [100, 116, 139] },
          1: { halign: 'left', fontStyle: 'bold' },
          2: { halign: 'left' },
          3: { halign: 'left' },
          4: { halign: 'center', cellWidth: 20 },
          5: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
          6: { halign: 'center', cellWidth: 26, fontStyle: 'bold' },
        },
        didParseCell: (hookData) => {
          if (hookData.section === 'body') {
            // Highlight row borders
            hookData.cell.styles.lineWidth = { bottom: 0.2 };
            hookData.cell.styles.lineColor = [226, 232, 240];

            // Badge styling for Status
            if (hookData.column.index === 6) {
              const val = String(hookData.cell.raw).trim();
              if (val === 'LULUS') {
                hookData.cell.styles.fillColor = [236, 253, 245]; // emerald-50
                hookData.cell.styles.textColor = [5, 150, 105]; // emerald-600
              } else {
                hookData.cell.styles.fillColor = [254, 242, 242]; // red-50
                hookData.cell.styles.textColor = [220, 38, 38]; // red-600
              }
            }
          }
        },
        margin: { left: marginLeft, right: marginRight, top: 18, bottom: 20 },
      });

      // 6. Sign-off / Signature section on final page
      const finalY = (doc as any).lastAutoTable?.finalY || 100;
      const needNewPage = finalY + 42 > pageHeight - 20;
      if (needNewPage) {
        doc.addPage();
      }
      const signY = needNewPage ? 25 : finalY + 12;
      const signX = pageWidth - marginRight - 65;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        signX,
        signY
      );
      doc.text('Guru Pengampu / Penyelenggara,', signX, signY + 4.5);

      // Space for signature line
      doc.setDrawColor(148, 163, 184); // slate-400
      doc.setLineWidth(0.4);
      doc.line(signX, signY + 24, signX + 55, signY + 24);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(user?.name || '...........................................', signX, signY + 28.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Pendidik / Administrator Ujian', signX, signY + 32.5);

      // 7. Running Page Numbers & Footers across all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Footer hairline
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.35);
        doc.line(marginLeft, pageHeight - 11, pageWidth - marginRight, pageHeight - 11);

        // Footer left info
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Laporan Resmi Evaluasi Siswa • Platform Ujian & Asesmen Examigo • Sah dan Terverifikasi', marginLeft, pageHeight - 6.5);

        // Footer right page number
        doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginRight, pageHeight - 6.5, { align: 'right' });
      }

      doc.save(getExportFilename('pdf'));
      showToast('Laporan PDF resmi berhasil diekspor!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengekspor data ke PDF.', 'error');
    }
  };

  const handlePrintStudentCertificate = async (participant: any) => {
    try {
      showToast('Menyiapkan sertifikat kelulusan...', 'info');
      const res = await api('/certificates/settings');
      const json = await res.json();
      const certConfig = json.success && json.data ? json.data : {};

      await generateCertificatePdf(certConfig, {
        studentName: participant.studentName,
        examTitle: participant.examTitle || 'Ujian Evaluasi',
        examCode: participant.examCode || 'EXAM',
        score: participant.score,
        completionDate: participant.submittedAt ? new Date(participant.submittedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      }, true);
      showToast(`Sertifikat ${participant.studentName} berhasil diunduh!`, 'success');
    } catch (err: any) {
      console.error('Failed to print certificate:', err);
      showToast('Gagal mencetak sertifikat: ' + err.message, 'error');
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
            <BarChart2 className="w-7 h-7 text-slate-600" /> Dashboard Analitik & Export
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Evaluasi hasil belajar peserta, rata-rata nilai, persentase kelulusan, serta ekspor data ke Excel & PDF.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="saas-button-secondary px-4 py-2.5 text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="saas-button-secondary px-4 py-2.5 text-xs font-bold flex items-center gap-2 relative border-slate-200 bg-slate-50/40 text-slate-700 shadow-xs cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[var(--theme-primary, #059669)]" /> Export PDF
            {userPlan !== 'PRO_AI' && (
              <span className="text-[9px] bg-slate-800 text-white px-1.5 py-0.5 rounded-full font-black ml-1 inline-flex items-center gap-0.5">
                PRO <Lock className="w-2.5 h-2.5" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="saas-card p-4 bg-white border border-slate-200/80 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-wrap">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0">
            <Filter className="w-4 h-4 text-[var(--theme-primary, #059669)]" /> Filter & Cari Data:
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
            className="text-xs font-bold text-slate-600 hover:text-slate-700 shrink-0"
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
            <TrendingUp className="w-4 h-4 text-edu-sage" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{data.averageScore}</p>
        </div>

        <div className="saas-card p-5 bg-white border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Tingkat Kelulusan (Passing Rate)</span>
            <Award className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{data.passingRatePercentage}%</p>
        </div>

        <div className="saas-card p-5 bg-white border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Total Peserta Mengerjakan</span>
            <Users className="w-4 h-4 text-slate-600" />
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
                <Bar dataKey="count" fill="#0f172a" radius={[6, 6, 0, 0]} />
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
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Klik nama peserta untuk melihat rincian lembar jawaban
          </span>
        </div>

        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 italic">
              {searchQuery ? (
                <>Tidak ada peserta yang cocok dengan pencarian kata kunci "<strong className="text-slate-700">{searchQuery}</strong>".</>
              ) : (
                <>Belum ada ujian yang dikerjakan oleh peserta.</>
              )}
            </div>
          ) : (
            paginatedResults.map((r: any, idx: number) => (
              <div
                key={r.id || idx}
                onClick={() => r.id && handleViewParticipantDetails(r.id)}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-100/60 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-edu-electric transition-colors flex items-center gap-1.5">
                      {r.studentName} <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-edu-electric" />
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
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {r.examTitle}
                    {r.studentEmail && !r.studentEmail.includes('@student.examigo.id') && (
                      <> • <span className="font-mono text-slate-600">{r.studentEmail}</span></>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{r.score}</p>
                    <span className={`text-[10px] font-extrabold ${r.status === 'LULUS' ? 'text-edu-sage' : 'text-red-600'}`}>
                      {r.status}
                    </span>
                  </div>
                  {r.status === 'LULUS' && r.hasCertificate !== false && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrintStudentCertificate(r);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-colors hidden sm:flex items-center gap-1 shadow-xs cursor-pointer"
                      title="Cetak Sertifikat Kelulusan Peserta"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-600" /> Cetak Sertifikat
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (r.id) handleViewParticipantDetails(r.id);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold transition-colors hidden sm:flex items-center gap-1 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5 text-edu-electric" /> Detail Jawaban
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Participant Results Pagination */}
        <Pagination
          currentPage={resultsPage}
          totalItems={filteredResults.length}
          itemsPerPage={resultsPerPage}
          onPageChange={setResultsPage}
          onItemsPerPageChange={setResultsPerPage}
          itemsPerPageOptions={[10, 25, 50]}
          itemName="peserta"
        />
      </div>

      {/* Item Analysis Table */}
      {data?.itemAnalysis && data.itemAnalysis.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Analisis Tingkat Kesulitan Soal (Item Analysis)</h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
                  {filteredItemAnalysis.length} Butir Soal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Daftar butir soal berdasarkan persentase akurasi jawaban peserta</p>
            </div>

            {/* Search Bar for Item Analysis */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={itemSearchQuery}
                onChange={(e) => {
                  setItemSearchQuery(e.target.value);
                  setItemPage(1);
                }}
                placeholder="Cari teks butir soal..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {filteredItemAnalysis.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 italic">
                Tidak ada butir soal yang cocok dengan pencarian kata kunci "<strong className="text-slate-700">{itemSearchQuery}</strong>".
              </div>
            ) : (
              paginatedItemAnalysis.map((item: any, idx: number) => {
                const globalIdx = (itemPage - 1) * itemPerPage + idx;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200">
                          #{globalIdx + 1}
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
                        <span className="text-edu-sage">{item.correctCount}</span>
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
                );
              })
            )}
          </div>

          {/* Item Analysis Pagination */}
          <Pagination
            currentPage={itemPage}
            totalItems={filteredItemAnalysis.length}
            itemsPerPage={itemPerPage}
            onPageChange={setItemPage}
            onItemsPerPageChange={setItemPerPage}
            itemsPerPageOptions={[10, 25, 50]}
            itemName="butir soal"
          />
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
                  <span className={`px-2 py-0.5 rounded-md text-xs font-extrabold ${selectedParticipantDetail.result?.isPassed ? 'bg-edu-sageLight text-edu-sage border border-edu-sage/30' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {selectedParticipantDetail.result?.isPassed ? 'LULUS' : 'TIDAK LULUS'}
                  </span>
                  {selectedParticipantDetail.cheatingCount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-edu-butterLight text-edu-navy border border-edu-butter/40 text-xs font-semibold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> {selectedParticipantDetail.cheatingCount} Pelanggaran
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedParticipantDetail.studentEmail && !selectedParticipantDetail.studentEmail.includes('@student.examigo.id') && (
                    <>Email: <span className="text-slate-700 font-mono font-medium">{selectedParticipantDetail.studentEmail}</span> • </>
                  )}
                  Ujian: <span className="text-slate-900 font-bold">{selectedParticipantDetail.examTitle}</span> ({selectedParticipantDetail.subjectName} - {selectedParticipantDetail.grade})
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
                <p className="text-2xl font-black text-edu-electric">
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
                          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 italic font-medium flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Kunci / Acuan Jawaban: {q.explanation}
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 text-center relative overflow-hidden animate-fade-in-fast border border-slate-100">
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
                Benefit Eksklusif Pro
              </span>
              <h3 className="text-xl font-black text-slate-900">Ekspor PDF Khusus Paket Pro</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Fitur cetak laporan & ekspor dokumen PDF merupakan benefit eksklusif untuk pengguna <strong>Paket Pro (Rp {((cmsConfig?.pricing?.pro_ai?.monthlyPrice || 149000) / 1000).toLocaleString('id-ID')}K)</strong>.
              </p>
            </div>

            <div 
              className="p-4 rounded-2xl border text-xs text-left space-y-2.5 shadow-xs"
              style={{
                backgroundColor: 'var(--theme-mint-light, #ECFDF5)',
                borderColor: 'var(--theme-border, #A7F3D0)',
                color: 'var(--theme-primary-dark, #064E3B)'
              }}
            >
              <p className="font-black text-xs flex items-center gap-1.5" style={{ color: 'var(--theme-primary-dark, #064E3B)' }}>
                <Sparkles className="w-4 h-4" style={{ color: 'var(--theme-primary, #059669)' }} /> Benefit Paket Pro:
              </p>
              <ul className="space-y-2 font-semibold text-[11px]" style={{ color: 'var(--theme-text-muted, #047857)' }}>
                <li className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--theme-primary, #10B981)' }} />
                  <span>Cetak & Ekspor PDF Laporan Hasil Ujian Lengkap</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--theme-primary, #10B981)' }} />
                  <span><strong>{cmsConfig?.pricing?.pro_ai?.maxAiQuestions || 300} Soal Otomatis</strong> per Bulan + Smart Vision Gambar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--theme-primary, #10B981)' }} />
                  <span>Advanced Fullscreen Lock & Anti-Cheat Protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--theme-primary, #10B981)' }} />
                  <span>Multi-Teacher Access (Hingga {cmsConfig?.pricing?.pro_ai?.maxClasses || 3} Pengajar)</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <Link
                to="/checkout?plan=pro_ai&billing=monthly"
                className="px-6 py-3 rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-white"
                style={{
                  backgroundColor: 'var(--theme-primary, #059669)',
                  boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--theme-primary-hover, #047857)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--theme-primary, #059669)';
                }}
              >
                <Sparkles className="w-4 h-4 fill-current" /> Upgrade ke Pro (Rp {((cmsConfig?.pricing?.pro_ai?.monthlyPrice || 149000) / 1000).toLocaleString('id-ID')}K)
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
