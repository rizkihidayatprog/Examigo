import React, { useEffect, useState } from 'react';
import { 
  Edit2, 
  Trash2, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  X, 
  Users,
  Building2,
  Phone,
  Award,
  BookOpen,
  GraduationCap,
  CreditCard,
  Calendar,
  Zap,
  Eye,
  ExternalLink,
  ShieldAlert,
  FileText,
  Clock
} from 'lucide-react';
import { api, useAuth } from '../../lib/auth';
import Pagination from '../../components/common/Pagination';

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Selection State for Bulk Action
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Detail Modal State (When clicking a user)
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'exams' | 'students' | 'transactions'>('exams');

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ role: '', plan: '', aiQuotaLimit: 0, aiQuotaUsed: 0, planValidUntil: '' });
  const [saving, setSaving] = useState(false);

  // Delete Modals State
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    api('/admin/users')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.data);
        }
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        showToast('Gagal memuat daftar pengguna.', 'error');
      })
      .finally(() => setLoading(false));
  };

  // Open User Detail
  const handleOpenUserDetail = (userId: string) => {
    setDetailUserId(userId);
    setLoadingDetail(true);
    setActiveDetailTab('exams');
    api(`/admin/users/${userId}/details`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDetailData(data.data);
        } else {
          showToast(data.message || 'Gagal memuat rincian pengguna.', 'error');
          setDetailUserId(null);
        }
      })
      .catch(err => {
        console.error('Error fetching user details:', err);
        showToast('Terjadi kesalahan koneksi saat memuat rincian pengguna.', 'error');
        setDetailUserId(null);
      })
      .finally(() => setLoadingDetail(false));
  };

  const closeUserDetail = () => {
    setDetailUserId(null);
    setDetailData(null);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.institution && u.institution.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Selection handlers
  const toggleSelectUser = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (id === currentAdmin?.id) return; // Prevent selecting self
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectableUsersOnPage = paginatedUsers.filter(u => u.id !== currentAdmin?.id);
  const isAllSelectedOnPage = selectableUsersOnPage.length > 0 && selectableUsersOnPage.every(u => selectedUserIds.includes(u.id));

  const toggleSelectAllOnPage = () => {
    if (isAllSelectedOnPage) {
      const pageIds = selectableUsersOnPage.map(u => u.id);
      setSelectedUserIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      const pageIds = selectableUsersOnPage.map(u => u.id);
      setSelectedUserIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const clearSelection = () => {
    setSelectedUserIds([]);
  };

  // Edit Handlers
  const openEditModal = (user: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingUser(user);

    let formattedDate = '';
    if (user.planValidUntil) {
      const d = new Date(user.planValidUntil);
      if (!isNaN(d.getTime())) {
        const pad = (n: number) => n.toString().padStart(2, '0');
        // Format to YYYY-MM-DDTHH:mm for datetime-local input
        formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }
    }

    setEditForm({
      role: user.role,
      plan: user.plan,
      aiQuotaLimit: user.aiQuotaLimit,
      aiQuotaUsed: user.aiQuotaUsed,
      planValidUntil: formattedDate,
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        planValidUntil: editForm.planValidUntil ? new Date(editForm.planValidUntil).toISOString() : null,
      };

      const res = await api(`/admin/users/${editingUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...data.data } : u));
        if (detailData && detailData.user.id === editingUser.id) {
          setDetailData({
            ...detailData,
            user: { ...detailData.user, ...data.data }
          });
        }
        setEditingUser(null);
        showToast('Data pengguna & masa aktif berhasil diperbarui!', 'success');
      } else {
        showToast(data.message || 'Gagal menyimpan data pengguna.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan jaringan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Single Delete Handler
  const handleDeleteSingleUser = async () => {
    if (!userToDelete) return;

    if (userToDelete.id === currentAdmin?.id) {
      showToast('Anda tidak dapat menghapus akun admin yang sedang aktif digunakan.', 'error');
      setUserToDelete(null);
      return;
    }

    setDeleting(true);
    try {
      const res = await api(`/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        setSelectedUserIds(prev => prev.filter(id => id !== userToDelete.id));
        if (detailUserId === userToDelete.id) {
          closeUserDetail();
        }
        showToast(data.message || 'Pengguna berhasil dihapus!', 'success');
        setUserToDelete(null);
      } else {
        showToast(data.message || 'Gagal menghapus pengguna.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan saat menghapus pengguna.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Bulk Delete Handler
  const handleBulkDeleteUsers = async () => {
    if (selectedUserIds.length === 0) return;

    setDeleting(true);
    try {
      const res = await api('/admin/users/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids: selectedUserIds }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => !selectedUserIds.includes(u.id)));
        showToast(data.message || `Berhasil menghapus ${selectedUserIds.length} pengguna.`, 'success');
        setSelectedUserIds([]);
        setIsBulkDeleteModalOpen(false);
      } else {
        showToast(data.message || 'Gagal menghapus pengguna terpilih.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan saat menghapus pengguna secara massal.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Quick statistics counts
  const totalPaidUsers = users.filter(u => u.plan !== 'FREE').length;
  const totalTeachers = users.filter(u => u.role === 'TEACHER').length;
  const totalAllExams = users.reduce((acc, curr) => acc + (curr._count?.exams || 0), 0);

  return (
    <div className="space-y-6 pb-24 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-black transition-all border animate-in slide-in-from-top-4 ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-950 text-emerald-100 border-emerald-700 shadow-emerald-900/30' 
            : 'bg-rose-950 text-rose-100 border-rose-700 shadow-rose-900/30'
        }`}>
          {toastMessage.type === 'success' ? (
            <div className="w-7 h-7 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-rose-800 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-rose-300" />
            </div>
          )}
          <span className="leading-snug">{toastMessage.text}</span>
        </div>
      )}

      {/* Header & Page Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-emerald-400" />
            Manajemen Pengguna
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Klik baris pengguna untuk melihat rincian instansi sekolah, daftar ujian, dan seluruh murid peserta evaluasi.
          </p>
        </div>
      </div>

      {/* Top 4 Stats Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Total Pengguna</span>
          </div>
          <div className="text-2xl font-black text-white">{users.length}</div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Terdaftar di platform</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>Guru / Pengajar</span>
          </div>
          <div className="text-2xl font-black text-white">{totalTeachers}</div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Pembuat ujian CBT</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Paket Berbayar</span>
          </div>
          <div className="text-2xl font-black text-white">{totalPaidUsers}</div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Personal & Pro</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Total Ujian Dibuat</span>
          </div>
          <div className="text-2xl font-black text-white">{totalAllExams}</div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Seluruh sesi ujian</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari nama, email, atau asal sekolah..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs"
            />
          </div>

          {/* Quick Select indicator */}
          {selectableUsersOnPage.length > 0 && (
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 cursor-pointer hover:text-white transition-colors self-start sm:self-auto select-none">
              <input 
                type="checkbox"
                checked={isAllSelectedOnPage}
                onChange={toggleSelectAllOnPage}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
              />
              <span>Pilih Semua di Halaman Ini</span>
            </label>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/60 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox"
                    checked={isAllSelectedOnPage}
                    onChange={toggleSelectAllOnPage}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                    title="Pilih Semua di Halaman Ini"
                  />
                </th>
                <th className="px-5 py-4">Pengguna</th>
                <th className="px-5 py-4">Instansi & Posisi</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Paket & Masa Aktif</th>
                <th className="px-5 py-4">Kuota Soal</th>
                <th className="px-5 py-4 text-center">Ujian</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                      <span className="text-xs font-medium">Memuat data pengguna...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <p className="text-sm font-semibold">Tidak ada pengguna yang cocok dengan pencarian.</p>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const isCurrentAdmin = user.id === currentAdmin?.id;
                  const isSelected = selectedUserIds.includes(user.id);

                  return (
                    <tr 
                      key={user.id} 
                      onClick={() => handleOpenUserDetail(user.id)}
                      className={`transition-colors cursor-pointer group ${
                        isSelected 
                          ? 'bg-emerald-950/20 hover:bg-emerald-950/30' 
                          : 'hover:bg-slate-900/60'
                      }`}
                      title="Klik untuk melihat profil, sekolah, ujian, dan data murid"
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox"
                          disabled={isCurrentAdmin}
                          checked={isSelected}
                          onChange={(e) => toggleSelectUser(user.id)}
                          className={`w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 accent-emerald-500 ${
                            isCurrentAdmin ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          title={isCurrentAdmin ? 'Akun Anda sendiri (dilindungi)' : 'Pilih pengguna'}
                        />
                      </td>

                      {/* User Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden shadow-inner group-hover:border-emerald-500/50 transition-colors">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user.name?.charAt(0).toUpperCase() || 'U'
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-100 flex items-center gap-1.5 text-xs sm:text-sm group-hover:text-emerald-400 transition-colors">
                              <span>{user.name}</span>
                              {isCurrentAdmin && (
                                <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                  Anda
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Daftar: {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* School & Position */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5 max-w-[200px]">
                          <span className="text-xs font-bold text-slate-200 truncate" title={user.institution || 'Belum diisi'}>
                            {user.institution || <span className="text-slate-500 italic font-normal">Belum diisi</span>}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-400/90 flex items-center gap-1">
                            <Award className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{user.position || 'Koordinator Ujian'}</span>
                          </span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Plan & Masa Aktif */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase ${
                            user.plan === 'FREE' ? 'bg-slate-800 text-slate-400 border border-slate-700' : 
                            user.plan === 'PERSONAL' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                            user.plan === 'PRO_AI' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {user.plan}
                          </span>
                          {user.plan !== 'FREE' ? (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                              {user.planValidUntil ? (
                                <div className="text-[10px]">
                                  <span className="text-slate-300 font-semibold">
                                    {new Date(user.planValidUntil).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </span>
                                  {' '}
                                  <span className="font-mono text-emerald-400 font-bold">
                                    {new Date(user.planValidUntil).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                  </span>
                                  {new Date(user.planValidUntil) < new Date() && (
                                    <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold">
                                      Expired
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-500 italic">Belum diatur</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-medium">Selamanya</span>
                          )}
                        </div>
                      </td>

                      {/* Quota */}
                      <td className="px-5 py-4">
                        <div className="text-slate-300 text-xs font-bold">
                          {user.aiQuotaUsed} <span className="text-slate-500 text-[11px]">/ {user.aiQuotaLimit}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 max-w-[90px] overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-1.5 rounded-full" 
                            style={{ width: `${Math.min(100, (user.aiQuotaUsed / (user.aiQuotaLimit || 1)) * 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Exams Count */}
                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 font-bold text-xs">
                          {user._count?.exams || 0}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Detail Eye Button */}
                          <button 
                            onClick={() => handleOpenUserDetail(user.id)}
                            className="p-2 rounded-xl bg-slate-800/80 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 transition-colors inline-flex items-center justify-center cursor-pointer shadow-2xs border border-slate-700/50"
                            title="Buka Detail Lengkap (Ujian & Siswa)"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Button */}
                          <button 
                            onClick={(e) => openEditModal(user, e)}
                            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors inline-flex items-center justify-center cursor-pointer shadow-2xs border border-slate-700/50"
                            title="Edit Akses & Kuota Pengguna"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button 
                            disabled={isCurrentAdmin}
                            onClick={() => setUserToDelete(user)}
                            className={`p-2 rounded-xl transition-colors inline-flex items-center justify-center shadow-2xs border ${
                              isCurrentAdmin 
                                ? 'bg-slate-900 text-slate-600 border-slate-800 opacity-40 cursor-not-allowed' 
                                : 'bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border-rose-500/20 cursor-pointer'
                            }`}
                            title={isCurrentAdmin ? 'Tidak dapat menghapus akun Anda sendiri' : 'Hapus Pengguna Secara Permanen'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newPerPage) => {
              setItemsPerPage(newPerPage);
              setCurrentPage(1);
            }}
            itemsPerPageOptions={[10, 20, 50, 100]}
            itemName="pengguna"
            variant="dark"
          />
        </div>
      </div>

      {/* FLOATING BULK DELETE BAR (BOTTOM CENTER) */}
      {selectedUserIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl rounded-full px-5 py-2.5 flex items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black">
                {selectedUserIds.length} Pengguna Dipilih
              </span>
            </div>

            <div className="h-4 w-px bg-slate-700" />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearSelection}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="px-4 py-1.5 rounded-full text-xs font-black bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-lg shadow-rose-900/40 transition-all cursor-pointer active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus {selectedUserIds.length} Pengguna</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL / DRAWER DETAIL USER LENGKAP (SEKOLAH, UJIAN, MURID)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {detailUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs" onClick={closeUserDetail} />
          
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl z-10 animate-in zoom-in-95 duration-150 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-black text-lg overflow-hidden shrink-0 shadow-md">
                  {detailData?.user.avatarUrl ? (
                    <img src={detailData.user.avatarUrl} alt={detailData.user.name} className="w-full h-full object-cover" />
                  ) : (
                    detailData?.user.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-white">{detailData?.user.name || 'Memuat...'}</h3>
                    {detailData?.user && (
                      <>
                        <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase">
                          {detailData.user.position || 'Koordinator Ujian'}
                        </span>
                        <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                          PAKET {detailData.user.plan}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{detailData?.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {detailData?.user && (
                  <button
                    onClick={() => openEditModal(detailData.user)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Akun</span>
                  </button>
                )}
                <button 
                  onClick={closeUserDetail}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {loadingDetail ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
                  <p className="text-xs font-semibold">Memuat rincian informasi pengguna, ujian, dan data murid...</p>
                </div>
              ) : !detailData ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm">Data pengguna tidak ditemukan.</p>
                </div>
              ) : (
                <>
                  {/* Grid Info Sekolah & Profil */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold mb-1">
                        <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Asal Sekolah / Instansi</span>
                      </div>
                      <p className="text-xs font-black text-slate-200 truncate" title={detailData.user.institution || 'Belum diatur'}>
                        {detailData.user.institution || 'Belum diatur'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold mb-1">
                        <Phone className="w-3.5 h-3.5 text-blue-400" />
                        <span>WhatsApp / Telepon</span>
                      </div>
                      <p className="text-xs font-black text-slate-200">
                        {detailData.user.phone ? (
                          <a 
                            href={`https://wa.me/${detailData.user.phone.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="hover:text-emerald-400 flex items-center gap-1"
                          >
                            <span>{detailData.user.phone}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          'Belum diatur'
                        )}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold mb-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Masa Aktif Paket</span>
                      </div>
                      <div className="text-xs font-black text-slate-200">
                        {detailData.user.plan === 'FREE' ? (
                          <span className="text-slate-400">Gratis Selamanya</span>
                        ) : detailData.user.planValidUntil ? (
                          <div>
                            <div>{new Date(detailData.user.planValidUntil).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            <div className="font-mono text-emerald-400 text-[11px] font-bold mt-0.5">
                              Pukul {new Date(detailData.user.planValidUntil).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                            </div>
                            {new Date(detailData.user.planValidUntil) < new Date() && (
                              <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold">
                                Sudah Berakhir
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Belum diatur</span>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold mb-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Kuota Soal Pengajar</span>
                      </div>
                      <p className="text-xs font-black text-slate-200">
                        {detailData.user.aiQuotaUsed} / {detailData.user.aiQuotaLimit} butir
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold mb-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>Terdaftar Sejak</span>
                      </div>
                      <p className="text-xs font-black text-slate-200">
                        {new Date(detailData.user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Bio Singkat jika ada */}
                  {detailData.user.bio && (
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                      <span className="font-bold text-slate-400 block mb-1">Catatan / Bio Pengajar:</span>
                      <p className="text-slate-300 italic font-medium">{detailData.user.bio}</p>
                    </div>
                  )}

                  {/* 4 Counter Summary Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xl font-black text-white">{detailData.user.counts.exams}</div>
                        <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Ujian Dibuat</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-900/40 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xl font-black text-white">{detailData.user.counts.students}</div>
                        <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Murid Mengikuti</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-900/40 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xl font-black text-white">{detailData.user.counts.questions}</div>
                        <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Bank Soal</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-900/40 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xl font-black text-white">{detailData.user.counts.transactions}</div>
                        <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Transaksi</div>
                      </div>
                    </div>
                  </div>

                  {/* Tab Content Header */}
                  <div className="border-b border-slate-800 flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setActiveDetailTab('exams')}
                      className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                        activeDetailTab === 'exams'
                          ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                          : 'border-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Daftar Ujian ({detailData.exams?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => setActiveDetailTab('students')}
                      className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                        activeDetailTab === 'students'
                          ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                          : 'border-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Murid & Peserta Ujian ({detailData.participants?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => setActiveDetailTab('transactions')}
                      className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                        activeDetailTab === 'transactions'
                          ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                          : 'border-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Riwayat Transaksi ({detailData.transactions?.length || 0})</span>
                    </button>
                  </div>

                  {/* TAB 1: DAFTAR UJIAN */}
                  {activeDetailTab === 'exams' && (
                    <div className="space-y-3">
                      {detailData.exams.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 text-xs">
                          Pengajar ini belum membuat sesi ujian apapun.
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                          <table className="w-full text-left text-xs text-slate-400">
                            <thead className="bg-slate-900 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                              <tr>
                                <th className="px-4 py-3">Judul Ujian</th>
                                <th className="px-4 py-3">Kode Akses</th>
                                <th className="px-4 py-3">Mapel</th>
                                <th className="px-4 py-3 text-center">Soal</th>
                                <th className="px-4 py-3 text-center">Peserta</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Tanggal Dibuat</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                              {detailData.exams.map((exam: any) => (
                                <tr key={exam.id} className="hover:bg-slate-900/40 transition-colors">
                                  <td className="px-4 py-3 font-bold text-slate-200 max-w-[220px] truncate" title={exam.title}>
                                    {exam.title}
                                  </td>
                                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                                    {exam.code}
                                  </td>
                                  <td className="px-4 py-3 text-slate-300">
                                    {exam.subject?.name || '-'}
                                  </td>
                                  <td className="px-4 py-3 text-center font-bold text-slate-200">
                                    {exam._count?.examQuestions || 0}
                                  </td>
                                  <td className="px-4 py-3 text-center font-bold text-blue-400">
                                    {exam._count?.participants || 0}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                      exam.isPublished ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                      {exam.isPublished ? 'PUBLISHED' : 'DRAFT'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-slate-500 text-[11px]">
                                    {new Date(exam.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: MURID & PESERTA UJIAN */}
                  {activeDetailTab === 'students' && (
                    <div className="space-y-3">
                      {detailData.participants.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 text-xs">
                          Belum ada siswa / murid yang mengikuti ujian dari pengajar ini.
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                          <table className="w-full text-left text-xs text-slate-400">
                            <thead className="bg-slate-900 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                              <tr>
                                <th className="px-4 py-3">Nama Siswa</th>
                                <th className="px-4 py-3">Ujian yang Diikuti</th>
                                <th className="px-4 py-3 text-center">Skor / Nilai</th>
                                <th className="px-4 py-3 text-center">Hasil</th>
                                <th className="px-4 py-3">Waktu Pengerjaan</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                              {detailData.participants.map((p: any) => (
                                <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                                  <td className="px-4 py-3">
                                    <div className="font-bold text-slate-200">{p.studentName}</div>
                                    {p.studentEmail && !p.studentEmail.includes('@student.examigo.id') && (
                                      <div className="text-[10px] text-slate-500">{p.studentEmail}</div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="font-bold text-slate-300 max-w-[200px] truncate" title={p.exam?.title}>
                                      {p.exam?.title || '-'}
                                    </div>
                                    <div className="text-[10px] font-mono text-emerald-400">{p.exam?.code}</div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {p.result ? (
                                      <span className="font-black text-slate-100 text-xs">
                                        {Math.round(p.result.totalScore)} / {p.result.maxScore} ({Math.round(p.result.percentage)}%)
                                      </span>
                                    ) : (
                                      <span className="text-slate-500 italic text-[11px]">Sedang Berjalan</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {p.result ? (
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                        p.result.isPassed 
                                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                      }`}>
                                        {p.result.isPassed ? 'LULUS' : 'REMIDI'}
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                        MENGERJAKAN
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-slate-500 text-[11px]">
                                    {new Date(p.startedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: RIWAYAT TRANSAKSI */}
                  {activeDetailTab === 'transactions' && (
                    <div className="space-y-3">
                      {detailData.transactions.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 text-xs">
                          Belum ada riwayat transaksi pembayaran pada akun ini.
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                          <table className="w-full text-left text-xs text-slate-400">
                            <thead className="bg-slate-900 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                              <tr>
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">Jenis / Paket</th>
                                <th className="px-4 py-3 text-right">Nominal</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3">Tanggal Transaksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                              {detailData.transactions.map((tx: any) => (
                                <tr key={tx.id} className="hover:bg-slate-900/40 transition-colors">
                                  <td className="px-4 py-3 font-mono font-bold text-slate-200">
                                    {tx.orderId}
                                  </td>
                                  <td className="px-4 py-3 font-bold text-slate-300">
                                    {tx.plan} ({tx.transactionType === 'ADDON' ? 'Top-Up Kuota' : 'Langganan'})
                                  </td>
                                  <td className="px-4 py-3 text-right font-black text-emerald-400">
                                    Rp {tx.amount.toLocaleString('id-ID')}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                      tx.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                      tx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                    }`}>
                                      {tx.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-slate-500 text-[11px]">
                                    {new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-500">
                ID Pengguna: <span className="font-mono text-slate-400">{detailUserId}</span>
              </span>

              <div className="flex items-center gap-2">
                {detailData?.user && detailData.user.id !== currentAdmin?.id && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserToDelete(detailData.user);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white font-bold text-xs transition-all border border-rose-500/20 cursor-pointer"
                  >
                    Hapus Pengguna Ini
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeUserDetail}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: EDIT USER                                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setEditingUser(null)} />
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-lg font-black text-white">Edit Pengguna</h3>
                <p className="text-xs text-slate-400">{editingUser.name} ({editingUser.email})</p>
              </div>
              <button 
                onClick={() => setEditingUser(null)} 
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Role (Hak Akses)</label>
                <select 
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="TEACHER">TEACHER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Paket Langganan</label>
                <select 
                  value={editForm.plan}
                  onChange={(e) => setEditForm({...editForm, plan: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="FREE">FREE</option>
                  <option value="PERSONAL">PERSONAL</option>
                  <option value="PRO_AI">PRO_AI</option>
                  <option value="ENTERPRISE">ENTERPRISE</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Batas Kuota Soal</label>
                  <input 
                    type="number"
                    value={editForm.aiQuotaLimit}
                    onChange={(e) => setEditForm({...editForm, aiQuotaLimit: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Kuota Terpakai</label>
                  <input 
                    type="number"
                    value={editForm.aiQuotaUsed}
                    onChange={(e) => setEditForm({...editForm, aiQuotaUsed: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Masa Aktif Paket (Tanggal & Batas Jam)</span>
                  </label>
                  {editForm.planValidUntil && (
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, planValidUntil: '' })}
                      className="text-[10px] text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                    >
                      Hapus / Kosongkan
                    </button>
                  )}
                </div>
                <input 
                  type="datetime-local"
                  value={editForm.planValidUntil}
                  onChange={(e) => setEditForm({...editForm, planValidUntil: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
                
                {/* Presets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-500 font-semibold mr-0.5">Preset Batas Jam:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setMonth(d.getMonth() + 1);
                      d.setHours(23, 59, 0, 0);
                      const pad = (n: number) => n.toString().padStart(2, '0');
                      setEditForm({ ...editForm, planValidUntil: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}` });
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-emerald-400 cursor-pointer border border-slate-800"
                  >
                    +1 Bulan (23:59)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setFullYear(d.getFullYear() + 1);
                      d.setHours(23, 59, 0, 0);
                      const pad = (n: number) => n.toString().padStart(2, '0');
                      setEditForm({ ...editForm, planValidUntil: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}` });
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-blue-400 cursor-pointer border border-slate-800"
                  >
                    +1 Tahun (23:59)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 7);
                      d.setHours(23, 59, 0, 0);
                      const pad = (n: number) => n.toString().padStart(2, '0');
                      setEditForm({ ...editForm, planValidUntil: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}` });
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-amber-400 cursor-pointer border border-slate-800"
                  >
                    +7 Hari (23:59)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                disabled={saving}
              >
                Batal
              </button>
              <button
                onClick={handleSaveUser}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: CONFIRM SINGLE USER DELETE                              */}
      {/* ───────────────────────────────────────────────────────────── */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs" onClick={() => !deleting && setUserToDelete(null)} />
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-rose-900/50 shadow-2xl z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Hapus Pengguna?</h3>
                <p className="text-xs text-rose-400 font-semibold">Tindakan ini permanen dan tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 mb-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Nama:</span>
                <span className="font-bold text-slate-200">{userToDelete.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Email:</span>
                <span className="font-bold text-slate-200">{userToDelete.email}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Total Ujian Dibuat:</span>
                <span className="font-bold text-slate-200">{userToDelete._count?.exams || 0} ujian</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Akun pengguna ini beserta seluruh bank soal, bahan materi, dan ujian yang pernah dibuat akan <strong className="text-white">dihapus secara permanen</strong> dari basis data.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDeleteSingleUser}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-900/40 active:scale-95 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus Pengguna</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: CONFIRM BULK DELETE                                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs" onClick={() => !deleting && setIsBulkDeleteModalOpen(false)} />
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-rose-900/50 shadow-2xl z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Hapus {selectedUserIds.length} Pengguna?</h3>
                <p className="text-xs text-rose-400 font-semibold">Tindakan massal tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Anda akan menghapus <strong className="text-white font-bold">{selectedUserIds.length} akun pengguna terpilih</strong> sekaligus. Seluruh data ujian, bank soal, dan riwayat yang terkait akan dihapus secara permanen.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleBulkDeleteUsers}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-900/40 active:scale-95 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus Massal...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus {selectedUserIds.length} Pengguna</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
