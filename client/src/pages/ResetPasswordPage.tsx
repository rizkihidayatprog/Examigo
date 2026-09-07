import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, KeyRound, CheckCircle2, Loader2, Eye, EyeOff, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import ExamigoLogo from '../components/common/ExamigoLogo';
import SEO from '../components/common/SEO';
import styles from '../styles/AuthLayout.module.css';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Gagal mengatur ulang kata sandi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authScreen}>
      <SEO title="Atur Ulang Kata Sandi" noindex={true} />
      {/* 1. Showcase Panel */}
      <div className={styles.showcasePanel}>
        <img
          src="/images/auth/login-showcase.jpg"
          alt="Examigo Security Showcase"
          className={styles.showcaseBg}
        />
        <div className={styles.showcaseGradientOverlay} />
        <div className={styles.showcaseGlowSphere} />

        <div className={styles.showcaseTopContent}>
          <Link to="/" className="inline-block no-underline">
            <ExamigoLogo size="md" variant="light" showBadge={true} />
          </Link>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md text-white text-xs font-bold transition-all shadow-sm group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-300 group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <div className={styles.showcaseContentFade}>
          <div className="space-y-3.5 max-w-lg">
            <h1 className={styles.showcaseHeadline}>
              Atur Ulang Kata Sandi Akun Anda
            </h1>

            <p className={styles.showcaseSubtitle}>
              Pastikan kata sandi baru Anda unik, kuat, dan mudah Anda ingat untuk menjaga keamanan bank soal & data ujian siswa.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Form Panel */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <Link to="/" className="inline-block no-underline mb-3">
              <ExamigoLogo size="lg" showBadge={true} />
            </Link>
            <h2 className={styles.formTitle}>Kata Sandi Baru</h2>
            <p className={styles.formSubtitle}>
              Buat kata sandi baru yang aman untuk akun Examigo Anda
            </p>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="p-5 rounded-2xl bg-[var(--theme-mint-light,#ECFDF5)] border border-[var(--theme-border,#A7F3D0)] text-center space-y-2.5">
              <CheckCircle2 className="w-10 h-10 text-[var(--theme-primary,#059669)] mx-auto" />
              <h3 className="text-sm font-black text-[var(--theme-primary-dark,#064E3B)] m-0">Kata Sandi Berhasil Diubah!</h3>
              <p className="text-xs text-[var(--theme-text-body,#065F46)] font-semibold leading-relaxed m-0">
                Kata sandi Anda telah berhasil diperbarui. Mengalihkan ke halaman masuk...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Kata Sandi Baru (Minimal 6 Karakter)</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={styles.inputField}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.passwordToggleBtn}
                  >
                    {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Ulangi Konfirmasi Kata Sandi Baru</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={styles.inputField}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <KeyRound style={{ width: '16px', height: '16px' }} /> Simpan Kata Sandi Baru
                  </>
                )}
              </button>
            </form>
          )}

          <div className={styles.formFooter}>
            <p className="text-xs text-[var(--theme-primary-dark,#064E3B)] font-semibold m-0">
              <Link to="/login" className={styles.switchLink}>
                Kembali ke Halaman Masuk
              </Link>
            </p>
          </div>
        </div>

        <Link to="/" className={styles.backHomeLink}>
          <ArrowLeft style={{ width: '13px', height: '13px' }} />
          <span>Kembali ke Halaman Depan</span>
        </Link>
      </div>
    </div>
  );
}
