import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/auth';

import ExamigoLogo from '../components/common/ExamigoLogo';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTarget = searchParams.get('redirect');
  const planTarget = searchParams.get('plan') || 'personal';
  const billingTarget = searchParams.get('billing') || 'monthly';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);

      if (redirectTarget === 'checkout') {
        navigate(`/checkout?plan=${planTarget}&billing=${billingTarget}`);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <Link to="/" className="inline-block mb-3">
            <ExamigoLogo size="lg" showText={true} />
          </Link>
          <p className="text-xs text-slate-500 font-medium">
            Buat akun gratis dan mulai membuat ujian dengan AI
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-2xl bg-white border border-slate-200 shadow-md space-y-5"
        >
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Pengajar"
              className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-colors font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@examigo.com"
              className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-colors font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pr-10 text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-colors font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Konfirmasi Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
              className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-colors font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Daftar Sekarang
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-600 font-medium">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold">
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
