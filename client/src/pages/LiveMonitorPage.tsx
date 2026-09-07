import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/auth';
import { useToast } from '../components/Toast';
import { ArrowLeft, Clock, ShieldAlert, CheckCircle2, User, RefreshCw, Eye, Search } from 'lucide-react';
import Pagination from '../components/common/Pagination';

export default function LiveMonitorPage() {
  const { examId } = useParams();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Search, Filter & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED' | 'CHEATING'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const fetchLiveData = async () => {
    try {
      const res = await api(`/analytics/live/${examId}`);
      const data = await res.json();
      if (data.success) {
        setLiveData(data.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [examId]);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center">
        <Clock className="w-8 h-8 animate-spin text-slate-600 mb-4" />
        <p className="text-slate-500 font-medium">Memuat data live monitoring...</p>
      </div>
    );
  }

  const inProgressCount = liveData.filter(p => p.status === 'IN_PROGRESS').length;
  const completedCount = liveData.filter(p => p.status === 'COMPLETED').length;
  const cheatingCount = liveData.filter(p => p.cheatingCount > 0 && p.status === 'IN_PROGRESS').length;

  // Filtered & Paginated data
  const filteredLiveData = liveData.filter(p => {
    const customFieldsStr = p.customFields ? Object.values(p.customFields).join(' ') : '';
    const matchesSearch = 
      (p.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.studentEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      customFieldsStr.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'IN_PROGRESS') return p.status === 'IN_PROGRESS';
    if (statusFilter === 'COMPLETED') return p.status === 'COMPLETED';
    if (statusFilter === 'CHEATING') return p.cheatingCount > 0;
    return true;
  });

  const paginatedLiveData = filteredLiveData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-fast pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Live Monitor</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200 text-[10px] font-black uppercase flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> LIVE
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium ml-7">
            Pengawasan real-time peserta ujian. (Auto-refresh tiap 5 detik)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
          <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> 
          Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
            <User className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sedang Mengerjakan</p>
            <p className="text-2xl font-black text-slate-900">{inProgressCount} <span className="text-sm font-semibold text-slate-400">Peserta</span></p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-edu-sage" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sudah Selesai</p>
            <p className="text-2xl font-black text-slate-900">{completedCount} <span className="text-sm font-semibold text-slate-400">Peserta</span></p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Indikasi Pindah Tab</p>
            <p className="text-2xl font-black text-slate-900">{cheatingCount} <span className="text-sm font-semibold text-slate-400">Peserta</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-600" /> Aktivitas Peserta ({filteredLiveData.length})
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama atau email siswa..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-700 placeholder-slate-400"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto">
              <button
                type="button"
                onClick={() => { setStatusFilter('ALL'); setCurrentPage(1); }}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => { setStatusFilter('IN_PROGRESS'); setCurrentPage(1); }}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  statusFilter === 'IN_PROGRESS'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Mengerjakan
              </button>
              <button
                type="button"
                onClick={() => { setStatusFilter('COMPLETED'); setCurrentPage(1); }}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  statusFilter === 'COMPLETED'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Selesai
              </button>
              <button
                type="button"
                onClick={() => { setStatusFilter('CHEATING'); setCurrentPage(1); }}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  statusFilter === 'CHEATING'
                    ? 'bg-red-50 text-red-700 shadow-xs'
                    : 'text-slate-500 hover:text-red-700'
                }`}
              >
                Peringatan
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Peserta</th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Progress Terjawab</th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Nilai Sementara</th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Peringatan Anti-Cheat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLiveData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                    {liveData.length === 0 
                      ? 'Belum ada peserta yang masuk ke ujian ini.' 
                      : 'Tidak ada peserta yang cocok dengan kriteria pencarian/filter.'}
                  </td>
                </tr>
              ) : (
                paginatedLiveData.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{p.studentName}</p>
                      {p.studentEmail && !p.studentEmail.includes('@student.examigo.id') && (
                        <p className="text-[11px] text-slate-500 font-medium">{p.studentEmail}</p>
                      )}
                      {p.customFields && Object.keys(p.customFields).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(p.customFields).map(([key, val]) => {
                            if (!val) return null;
                            const label =
                              key === 'nis'
                                ? 'NIS'
                                : key === 'studentClass'
                                ? 'Kelas'
                                : key === 'absentNo'
                                ? 'Absen'
                                : key === 'phone'
                                ? 'WA/HP'
                                : key;
                            return (
                              <span
                                key={key}
                                className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
                              >
                                {label}: {String(val)}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {p.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200">
                          <Clock className="w-3 h-3" /> Mengerjakan
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${p.progress === 100 ? 'bg-emerald-500' : 'bg-slate-500'}`} 
                            style={{ width: `${p.progress}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{p.progress}% ({p.answersCount}/{p.totalQuestions})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {p.status === 'COMPLETED' ? (
                        <span className="font-black text-slate-900 text-base">{p.score}</span>
                      ) : (
                        <span className="text-slate-400 font-medium text-xs italic">Menunggu...</span>
                      )}
                    </td>
                    <td className="p-4">
                      {p.cheatingCount > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                          <ShieldAlert className="w-3.5 h-3.5" /> Pindah Tab {p.cheatingCount}x
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredLiveData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newPerPage) => {
            setItemsPerPage(newPerPage);
            setCurrentPage(1);
          }}
          itemName="peserta"
        />
      </div>
    </div>
  );
}
