import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Award, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  User, 
  FileText, 
  ArrowLeft,
  ExternalLink,
  Lock,
  Sparkles
} from 'lucide-react';
import ExamigoLogo from '../components/common/ExamigoLogo';
import SEO from '../components/common/SEO';

export default function CertificateVerifyPage() {
  const { code: routeCode } = useParams();
  const [searchCode, setSearchCode] = useState(routeCode || '');
  const [loading, setLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (routeCode) {
      handleVerify(routeCode);
    }
  }, [routeCode]);

  const handleVerify = async (codeToVerify: string) => {
    const clean = codeToVerify.trim();
    if (!clean) return;

    setLoading(true);
    setErrorMsg(null);
    setVerifyResult(null);

    try {
      const res = await fetch(`/api/certificates/verify/${encodeURIComponent(clean)}`);
      const json = await res.json();

      if (json.success && json.data) {
        setVerifyResult(json.data);
      } else {
        setErrorMsg(json.message || 'Sertifikat tidak ditemukan atau tidak valid.');
      }
    } catch (err: any) {
      console.error('Verify error:', err);
      setErrorMsg('Gagal terhubung ke server verifikasi. Silakan coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      handleVerify(searchCode);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/20 text-slate-800 flex flex-col justify-between">
      <SEO
        title="Verifikasi Keaslian Sertifikat Digital"
        description="Layanan resmi verifikasi keaslian dan validasi sertifikat kelulusan ujian CBT yang diterbitkan melalui platform Examigo."
        canonical="https://examigo.id/verify"
      />
      {/* 1. Public Top Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 py-3 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <ExamigoLogo size="md" showBadge={true} />
        </Link>
        <Link
          to="/"
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* 2. Main Verification Content */}
      <main className="max-w-3xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in-fast my-auto">
        {/* Banner Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black uppercase tracking-wider shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pusat Verifikasi Dokumen & Keaslian Sertifikat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Cek Keaslian Sertifikat Digital
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Verifikasi keabsahan sertifikat kelulusan yang diterbitkan secara resmi melalui sistem evaluasi terpadu Examigo.
          </p>
        </div>

        {/* Verification Input Form */}
        <form onSubmit={onSubmitSearch} className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Masukkan ID / Kode Sertifikat (contoh: EXM-DEMO-01)"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold uppercase tracking-wider focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchCode.trim()}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Memeriksa...' : 'Verifikasi'}</span>
          </button>
        </form>

        {/* 3. Result Display Card */}
        {loading && (
          <div className="p-12 text-center space-y-3 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto">
            <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600">
              Menghubungkan ke pangkalan data resmi Examigo...
            </p>
          </div>
        )}

        {errorMsg && !loading && (
          <div className="p-6 sm:p-8 rounded-3xl bg-red-50/90 border border-red-200 text-center space-y-3 max-w-xl mx-auto shadow-sm animate-fade-in-fast">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs border border-red-200">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-red-900">
              Sertifikat Tidak Terdaftar atau Tidak Valid
            </h3>
            <p className="text-xs text-red-700 font-medium leading-relaxed max-w-md mx-auto">
              {errorMsg} Pastikan Anda memasukkan kode verifikasi secara lengkap dan benar sesuai yang tercantum pada sertifikat.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleVerify('EXM-DEMO-01')}
                className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Coba Uji Sampel Demo (EXM-DEMO-01)
              </button>
            </div>
          </div>
        )}

        {verifyResult && !loading && (
          <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-xl overflow-hidden max-w-2xl mx-auto animate-fade-in-fast">
            {/* Authentic Badge Top Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 sm:p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-emerald-900/40 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    VERIFIED & AUTHENTIC
                  </span>
                  <h2 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                    Sertifikat Asli & Terverifikasi Resmi
                  </h2>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <p className="text-[10px] text-emerald-100 font-medium">Status Dokumen</p>
                <p className="text-xs font-mono font-black text-amber-300">SAH SECARA DIGITAL</p>
              </div>
            </div>

            {/* Certificate Details Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Student and Exam Highlight */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Diberikan dengan Bangga Kepada
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
                  {verifyResult.studentName}
                </h3>
                <p className="text-xs font-semibold text-emerald-800">
                  Telah dinyatakan LULUS dalam evaluasi resmi:
                </p>
                <p className="text-sm font-bold text-slate-800 pt-1">
                  {verifyResult.examTitle}
                </p>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center gap-2 text-slate-500 font-bold">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>Institusi / Lembaga Penerbit</span>
                  </div>
                  <p className="font-extrabold text-slate-900 text-sm pl-6">
                    {verifyResult.institutionName}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center gap-2 text-slate-500 font-bold">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Nilai & Kelulusan</span>
                  </div>
                  <p className="font-extrabold text-slate-900 text-sm pl-6 flex items-center gap-2">
                    <span>Nilai: {verifyResult.score}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      LULUS (KKM: {verifyResult.minPassingScore})
                    </span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center gap-2 text-slate-500 font-bold">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Tanggal Terbit</span>
                  </div>
                  <p className="font-extrabold text-slate-900 text-sm pl-6">
                    {verifyResult.completionDate}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center gap-2 text-slate-500 font-bold">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>ID Serial Verifikasi</span>
                  </div>
                  <p className="font-mono font-bold text-slate-900 text-xs pl-6">
                    {verifyResult.certificateId}
                  </p>
                </div>
              </div>

              {/* Signers Info */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 grid grid-cols-2 gap-4 text-center">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    {verifyResult.signer1?.title || 'Penandatangan 1'}
                  </p>
                  <p className="text-xs font-black text-slate-900">
                    {verifyResult.signer1?.name || 'Direktur'}
                  </p>
                  <span className="text-[9px] text-emerald-700 font-semibold block">✓ Tanda Tangan Digital Sah</span>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    {verifyResult.signer2?.title || 'Penandatangan 2'}
                  </p>
                  <p className="text-xs font-black text-slate-900">
                    {verifyResult.signer2?.name || 'Ketua Evaluasi'}
                  </p>
                  <span className="text-[9px] text-emerald-700 font-semibold block">✓ Tanda Tangan Digital Sah</span>
                </div>
              </div>

              {/* Digital Checksum Footer */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" /> Digital Checksum: {verifyResult.digitalSignature}
                </span>
                <span className="text-emerald-700 font-bold">Terproteksi Kriptografi Examigo</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. Public Footer */}
      <footer className="w-full border-t border-slate-200 py-4 text-center text-xs text-slate-500 bg-white">
        © {new Date().getFullYear()} Examigo Platform. Sistem Sertifikasi & Ujian Digital Berintegritas Tinggi.
      </footer>
    </div>
  );
}
