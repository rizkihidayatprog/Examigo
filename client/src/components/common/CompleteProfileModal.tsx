import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  User, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  LogOut,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth, api, safeJson } from '../../lib/auth';
import ExamigoLogo from './ExamigoLogo';

export default function CompleteProfileModal() {
  const { user, updateUser, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [position, setPosition] = useState(user?.position || 'Guru Mata Pelajaran');
  const [bio, setBio] = useState(user?.bio || '');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const POSITION_OPTIONS = [
    'Guru Mata Pelajaran',
    'Wali Kelas',
    'Koordinator Ujian',
    'Wakil Kepala Sekolah / Kurikulum',
    'Kepala Sekolah',
    'Dosen / Tenaga Pendidik',
    'Tentor / Tutor Bimbel',
    'Admin Lembaga Kursus'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama lengkap tidak boleh kosong.');
      return;
    }

    if (!institution.trim()) {
      setErrorMsg('Nama sekolah / institusi wajib diisi.');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('Nomor WhatsApp / HP aktif wajib diisi.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 9) {
      setErrorMsg('Nomor telepon / WhatsApp tidak valid (minimal 9 digit).');
      return;
    }

    setLoading(true);
    try {
      const res = await api('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: name.trim(),
          institution: institution.trim(),
          phone: cleanPhone,
          position: position.trim() || 'Guru Mata Pelajaran',
          bio: bio.trim(),
        }),
      });

      const data = await safeJson(res);
      if (data.success && data.data) {
        setSuccessMsg('Profil Anda berhasil dilengkapi! Mengalihkan ke dashboard...');
        updateUser(data.data);
      } else {
        setErrorMsg(data.message || 'Gagal menyimpan profil.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan data profil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bersih & Ramah */}
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="mb-3">
            <ExamigoLogo size="sm" showBadge={false} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Lengkapi Data Profil Pengajar
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Selamat datang di Examigo. Mohon lengkapi identitas sekolah dan kontak Anda untuk keperluan kop ujian resmi dan sertifikat peserta.
          </p>
        </div>

        {/* Formulir Pengisian */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-800">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap & Gelar <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Drs. Ahmad Fauzi, M.Pd"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
            />
          </div>

          {/* Asal Sekolah / Instansi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Asal Sekolah / Madrasah / Instansi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Misal: SMA Negeri 1 Bandung"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Nama instansi akan tercantum pada kop lembar soal dan sertifikat ujian siswa.
            </p>
          </div>

          {/* Nomor WhatsApp / HP */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor WhatsApp / HP Aktif <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Misal: 081234567890"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Untuk keamanan akun dan koordinasi informasi pelaksanaan ujian.
            </p>
          </div>

          {/* Peran / Jabatan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Peran / Jabatan <span className="text-rose-500">*</span>
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
            >
              {POSITION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Bio / Mapel yang diampu */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mata Pelajaran yang Diampu (Opsional)
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Misal: Matematika Wajib Kelas X & XI"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="pt-3 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan & Lanjutkan</span>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-xs transition-colors bg-transparent border-none cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Bukan akun Anda? Keluar Akun</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
