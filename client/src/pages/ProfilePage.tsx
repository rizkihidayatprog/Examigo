import React, { useState, useEffect, useRef } from 'react';
import { useAuth, api, safeJson, isProfileComplete } from '../lib/auth';
import { 
  User, 
  Mail, 
  Lock, 
  KeyRound, 
  Save, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Building2, 
  Phone, 
  FileText, 
  Eye, 
  EyeOff, 
  UploadCloud, 
  Calendar, 
  BookOpen, 
  Zap,
  Award,
  Check,
  RefreshCw
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [position, setPosition] = useState(user?.position || 'Koordinator Ujian');
  const [bio, setBio] = useState(user?.bio || '');

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI status states
  const [loading, setLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync state if user changes or mounts
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatarUrl(user.avatarUrl || '');
      setInstitution(user.institution || '');
      setPhone(user.phone || '');
      setPosition(user.position || 'Koordinator Ujian');
      setBio(user.bio || '');
    }
  }, [user]);

  // Fetch latest /auth/me on mount
  useEffect(() => {
    api('/auth/me')
      .then((res) => safeJson(res))
      .then((data) => {
        if (data.success && data.data) {
          updateUser(data.data);
          setName(data.data.name || '');
          setEmail(data.data.email || '');
          setAvatarUrl(data.data.avatarUrl || '');
          setInstitution(data.data.institution || '');
          setPhone(data.data.phone || '');
          setPosition(data.data.position || 'Koordinator Ujian');
          setBio(data.data.bio || '');
        }
      })
      .catch((err) => console.error('Error fetching /auth/me:', err));
  }, []);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Berkas harus berupa gambar (JPG, PNG, WEBP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 5MB.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setIsUploadingAvatar(true);
    try {
      const res = await api('/auth/upload-avatar', {
        method: 'POST',
        body: formData,
      });
      const data = await safeJson(res);
      if (data.success && data.avatarUrl) {
        setAvatarUrl(data.avatarUrl);
        updateUser({ avatarUrl: data.avatarUrl });
        showToast('Foto profil berhasil diunggah & disimpan!', 'success');
      } else {
        showToast(data.message || 'Gagal mengunggah foto profil.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat mengunggah foto.', 'error');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Nama lengkap tidak boleh kosong.', 'error');
      return;
    }

    if (!email.trim()) {
      showToast('Alamat email tidak boleh kosong.', 'error');
      return;
    }

    if (user?.role !== 'ADMIN') {
      if (!institution.trim()) {
        showToast('Asal sekolah / madrasah / instansi wajib diisi.', 'error');
        return;
      }
      if (!phone.trim()) {
        showToast('Nomor WhatsApp / HP wajib diisi.', 'error');
        return;
      }
      const cleanPhone = phone.replace(/[^0-9+]/g, '');
      if (cleanPhone.length < 9) {
        showToast('Nomor WhatsApp tidak valid (minimal 9 digit).', 'error');
        return;
      }
    }

    if (newPassword) {
      if (!currentPassword) {
        showToast('Masukkan kata sandi saat ini untuk mengubah kata sandi.', 'error');
        return;
      }
      if (newPassword.length < 6) {
        showToast('Kata sandi baru minimal 6 karakter.', 'error');
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast('Konfirmasi kata sandi baru tidak cocok.', 'error');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await api('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          avatarUrl: avatarUrl.trim() || undefined,
          institution: institution.trim(),
          phone: phone.trim(),
          position: position.trim() || 'Koordinator Ujian',
          bio: bio.trim(),
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await safeJson(res);
      if (data.success) {
        showToast('Profil Anda berhasil diperbarui!', 'success');
        if (data.token) {
          localStorage.setItem('examigo_token', data.token);
        }
        if (data.data) {
          updateUser(data.data);
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(data.message || 'Gagal memperbarui profil.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan koneksi server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper date formatting
  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Baru bergabung';

  const aiQuotaPct = user ? Math.min(100, Math.round(((user.aiQuotaUsed || 0) / (user.aiQuotaLimit || 1)) * 100)) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in-fast pb-16">
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

      {/* Hidden File Input for Avatar Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarFileChange} 
        accept="image/png, image/jpeg, image/jpg, image/webp" 
        className="hidden" 
      />

      {/* Incomplete Profile Alert Banner */}
      {user && !isProfileComplete(user) && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 border border-amber-200 shadow-sm flex items-start gap-4 text-amber-900 animate-in fade-in">
          <div className="w-10 h-10 rounded-2xl bg-amber-200/80 flex items-center justify-center shrink-0 text-amber-800">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <h3 className="font-black text-amber-950 text-sm">Profil Belum Lengkap</h3>
            <p className="font-medium text-amber-800 mt-1 leading-relaxed">
              Mohon lengkapi <strong>Asal Sekolah / Madrasah / Instansi</strong> dan <strong>Nomor WhatsApp</strong> Anda di formulir bawah ini untuk mengaktifkan seluruh fitur ujian CBT Examigo.
            </p>
          </div>
        </div>
      )}

      {/* Top Hero Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div 
          className="w-72 h-72 rounded-full absolute -top-24 -right-24 blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: 'var(--theme-mint, #10B981)' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar with Camera Trigger */}
            <div className="relative group shrink-0">
              <div 
                onClick={() => fileInputRef.current?.click()}
                title="Klik untuk ganti foto profil"
                className="w-24 h-24 rounded-3xl text-white font-black text-3xl flex items-center justify-center shadow-lg overflow-hidden border-2 cursor-pointer transition-transform hover:scale-105 relative"
                style={{ 
                  backgroundColor: 'var(--theme-primary-dark, #064E3B)',
                  borderColor: 'var(--theme-border, #A7F3D0)'
                }}
              >
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={user?.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      // Fallback if image link broken
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}

                {/* Upload Overlay on Hover */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 mb-1 text-white" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Ubah Foto</span>
                </div>

                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Camera Trigger Pill */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl text-white shadow-md border-2 border-white cursor-pointer hover:scale-110 active:scale-95 transition-all"
                style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
                title="Unggah Foto dari Perangkat"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Intro */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name}</h1>
                <span 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs"
                  style={{
                    backgroundColor: '#EFF6FF',
                    color: '#1D4ED8',
                    borderColor: '#BFDBFE'
                  }}
                >
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  {user?.position || 'Koordinator Ujian'}
                </span>
                <span 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs"
                  style={{
                    backgroundColor: 'var(--theme-mint-light, #ECFDF5)',
                    color: 'var(--theme-primary-dark, #064E3B)',
                    borderColor: 'var(--theme-border, #A7F3D0)'
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary, #059669)' }} />
                  {user?.role === 'ADMIN' ? 'SUPER ADMIN' : `PAKET ${user?.plan || 'FREE'}`}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email}
              </p>

              {user?.institution && (
                <p className="text-xs text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {user.institution}
                </p>
              )}

              <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                Bergabung sejak {joinDate}
              </p>
            </div>
          </div>

          {/* Quick upload photo button */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 text-xs font-black flex items-center justify-center gap-2 hover:border-slate-300 shadow-2xs transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-slate-500" />
              <span>{isUploadingAvatar ? 'Mengunggah...' : 'Ganti Foto Avatar'}</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold mb-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ujian Aktif</span>
            </div>
            <div className="text-xl font-black text-slate-900">{user?.examsCount ?? 0}</div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Total ujian dibuat</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold mb-1">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Bank Soal</span>
            </div>
            <div className="text-xl font-black text-slate-900">{user?.questionsCount ?? 0}</div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Koleksi soal tersimpan</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Kuota Soal
              </span>
              <span className="text-[10px] font-black text-amber-600">{aiQuotaPct}%</span>
            </div>
            <div className="text-xl font-black text-slate-900">
              {user?.aiQuotaUsed ?? 0} <span className="text-xs text-slate-400 font-semibold">/ {user?.aiQuotaLimit ?? 0}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${aiQuotaPct}%`,
                  backgroundColor: aiQuotaPct > 85 ? '#EF4444' : aiQuotaPct > 60 ? '#F59E0B' : 'var(--theme-primary, #10B981)' 
                }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Status Akun</span>
            </div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Aktif & Terverifikasi
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Keamanan optimal</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {/* Section 1: Informasi Identitas & Kontak */}
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs"
              style={{
                backgroundColor: 'var(--theme-mint-light, #ECFDF5)',
                color: 'var(--theme-primary, #059669)',
                borderColor: 'var(--theme-border, #A7F3D0)'
              }}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Identitas & Informasi Pengajar</h2>
              <p className="text-xs text-slate-500 font-medium">Ubah nama, email, instansi sekolah, kontak WhatsApp, dan catatan profil Anda</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nama Lengkap */}
            <div>
              <label className="text-xs font-black text-slate-800 block mb-2">Nama Lengkap & Gelar</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-[var(--theme-primary,#10B981)] transition-colors shadow-2xs"
                  placeholder="Contoh: Budi Santoso, M.Pd"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Nama yang tercantum pada sertifikat dan laporan hasil ujian.</p>
            </div>

            {/* Email Pengajar */}
            <div>
              <label className="text-xs font-black text-slate-800 block mb-2">Alamat Email Akun</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-[var(--theme-primary,#10B981)] transition-colors shadow-2xs"
                  placeholder="nama@sekolah.sch.id"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Email login akun. Jika diubah, gunakan email baru ini saat masuk berikutnya.</p>
            </div>

            {/* Jabatan / Peran Pengajar */}
            <div>
              <label className="text-xs font-black text-slate-800 block mb-2">Jabatan / Peran Pengajar</label>
              <div className="relative">
                <Award className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-[var(--theme-primary,#10B981)] transition-colors shadow-2xs"
                  placeholder="Contoh: Koordinator Ujian / Guru Mapel"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Peran Anda (misal: Koordinator Ujian, Ketua Evaluasi, Guru Pengampu).</p>
            </div>

            {/* Asal Sekolah / Lembaga */}
            <div>
              <label className="text-xs font-black text-slate-800 block mb-2">
                Asal Sekolah / Madrasah / Instansi {user?.role !== 'ADMIN' && <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required={user?.role !== 'ADMIN'}
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-[var(--theme-primary,#10B981)] transition-colors shadow-2xs"
                  placeholder="Contoh: SMA Negeri 1 Surabaya / Bimbel Cerdas"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Ditampilkan pada kop ujian atau profil publik (Wajib diisi).</p>
            </div>

            {/* Nomor WhatsApp / HP */}
            <div>
              <label className="text-xs font-black text-slate-800 block mb-2">
                Nomor Telepon / WhatsApp {user?.role !== 'ADMIN' && <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="tel"
                  required={user?.role !== 'ADMIN'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-[var(--theme-primary,#10B981)] transition-colors shadow-2xs"
                  placeholder="Contoh: 081234567890"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Untuk notifikasi hasil ujian atau koordinasi sistem (Wajib diisi).</p>
            </div>

            {/* URL Foto Avatar Kustom */}
            <div className="md:col-span-2">
              <label className="text-xs font-black text-slate-800 block mb-2">
                URL Foto Profil Langsung (Atau gunakan tombol foto di atas)
              </label>
              <div className="relative">
                <Camera className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... atau /uploads/..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-[var(--theme-primary,#10B981)] transition-colors shadow-2xs"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                Anda dapat menempelkan tautan gambar web atau mengunggah langsung dari perangkat Anda menggunakan tombol kamera.
              </p>
            </div>

            {/* Bio Singkat / Catatan */}
            <div className="md:col-span-2">
              <label className="text-xs font-black text-slate-800 block mb-2">Bio Singkat / Catatan Pengajar</label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tuliskan mata pelajaran yang diampu atau ringkasan profil pengajar Anda..."
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-[var(--theme-primary,#10B981)] transition-colors shadow-2xs resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Keamanan Akun & Kata Sandi */}
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs"
              style={{
                backgroundColor: 'var(--theme-mint-light, #ECFDF5)',
                color: 'var(--theme-primary, #059669)',
                borderColor: 'var(--theme-border, #A7F3D0)'
              }}
            >
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Keamanan & Perubahan Kata Sandi</h2>
              <p className="text-xs text-slate-500 font-medium">Kosongkan bagian ini jika Anda tidak berniat mengganti password akun</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Password Saat Ini */}
            <div>
              <label className="text-xs font-black text-slate-800 block mb-2">Password Saat Ini</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Password saat ini"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 pr-10 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-[var(--theme-primary,#10B981)] transition-colors shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Baru */}
            <div>
              <label className="text-xs font-black text-slate-800 block mb-2">Password Baru</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 pr-10 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-[var(--theme-primary,#10B981)] transition-colors shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {newPassword && newPassword.length < 6 && (
                <p className="text-[10px] text-rose-500 font-bold mt-1">Minimal 6 karakter</p>
              )}
            </div>

            {/* Konfirmasi Password Baru */}
            <div>
              <label className="text-xs font-black text-slate-800 block mb-2">Konfirmasi Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 pr-10 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-[var(--theme-primary,#10B981)] transition-colors shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[10px] text-rose-500 font-bold mt-1">Password konfirmasi tidak sama</p>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Cocok
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500 font-medium">
            Pastikan seluruh data pengajar sudah benar sebelum menyimpan.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-white font-black text-xs flex items-center justify-center gap-2.5 transition-all shadow-md min-h-[48px] disabled:opacity-50 cursor-pointer active:scale-95"
            style={{
              backgroundColor: 'var(--theme-primary, #059669)',
              boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--theme-primary-hover, #047857)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--theme-primary, #059669)';
            }}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menyimpan Perubahan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Perubahan Profil</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
