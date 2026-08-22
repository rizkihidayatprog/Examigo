import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import ExamigoLogo from '../components/common/ExamigoLogo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSubmitted(true);
      setMessage(data.message || 'Instruksi pemulihan password telah dikirim ke email Anda.');
    } catch (err) {
      setMessage('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <ExamigoLogo size="lg" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Lupa Kata Sandi?</h1>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Masukkan alamat email yang terdaftar di akun Examigo Anda. Kami akan mengirimkan petunjuk pemulihan.
          </p>
        </div>

        {submitted ? (
          <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 text-center space-y-3 animate-fade-in-fast">
            <CheckCircle2 className="w-10 h-10 text-indigo-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Email Terkirim!</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {message}
            </p>
            <p className="text-[11px] text-slate-400 italic pt-2 border-t border-indigo-900/50">
              *Periksa juga folder Spam/Junk email Anda jika tautan tidak muncul dalam beberapa menit.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Alamat Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@domain.com"
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-700 p-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
                />
              </div>
            </div>

            {message && <p className="text-xs text-red-400 font-medium">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {loading ? (
                <span>Mengirim Email...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Kirim Tautan Pemulihan
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-700/60 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman Login
          </Link>
        </div>
      </div>
    </div>
  );
}
