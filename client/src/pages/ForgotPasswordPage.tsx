import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, ShieldCheck, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import ExamigoLogo from '../components/common/ExamigoLogo';
import SEO from '../components/common/SEO';
import styles from '../styles/AuthLayout.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Dynamic CMS config
  const [cmsConfig, setCmsConfig] = useState({
    imageUrl: '/images/auth/login-showcase.jpg',
    badge: 'Keamanan Akun Terjamin',
    headline: 'Pemulihan Akses Akun Examigo',
    subtitle: 'Jangan khawatir, kami akan membantu memulihkan akses akun Anda dengan tautan verifikasi aman ke email terdaftar.',
    formPosition: 'right' as 'left' | 'right'
  });

  useEffect(() => {
    fetch('/api/public/landing-config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.authPages?.forgotPassword) {
          const f = data.data.authPages.forgotPassword;
          setCmsConfig({
            imageUrl: f.imageUrl || '/images/auth/login-showcase.jpg',
            badge: f.badge || 'Keamanan Akun Terjamin',
            headline: f.headline || 'Pemulihan Akses Akun Examigo',
            subtitle: f.subtitle || 'Jangan khawatir, kami akan membantu memulihkan akses akun Anda dengan tautan verifikasi aman ke email terdaftar.',
            formPosition: f.formPosition === 'left' ? 'left' : 'right'
          });
        }
      })
      .catch(err => console.error('Failed to load forgot-password CMS config:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage('');
    setError('');
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
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authScreen}>
      <SEO title="Lupa Kata Sandi" noindex={true} />
      {/* 1. Dynamic Showcase Panel */}
      <div className={styles.showcasePanel}>
        <img
          src={cmsConfig.imageUrl}
          alt="Examigo Forgot Password Showcase"
          className={styles.showcaseBg}
          onError={(e: any) => {
            e.target.src = '/images/auth/login-showcase.jpg';
          }}
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
              {cmsConfig.headline}
            </h1>
            <p className={styles.showcaseSubtitle}>
              {cmsConfig.subtitle}
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
            <h2 className={styles.formTitle}>Lupa Kata Sandi</h2>
            <p className={styles.formSubtitle}>
              Masukkan alamat email Anda untuk menerima tautan pemulihan kata sandi
            </p>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="p-4 rounded-2xl bg-[var(--theme-mint-light,#ECFDF5)] border border-[var(--theme-border,#A7F3D0)] text-center space-y-2.5">
              <CheckCircle2 className="w-10 h-10 text-[var(--theme-primary,#059669)] mx-auto" />
              <h3 className="text-sm font-black text-[var(--theme-primary-dark,#064E3B)] m-0">Email Pemulihan Terkirim!</h3>
              <p className="text-xs text-[var(--theme-text-body,#065F46)] font-semibold leading-relaxed m-0">
                {message}
              </p>
              <p className="text-[11px] text-slate-500 italic pt-2 border-t border-[var(--theme-border,#A7F3D0)] m-0">
                *Periksa juga folder Spam / Junk jika email belum masuk dalam beberapa menit.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Alamat Email Terdaftar</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@sekolah.sch.id"
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
                    <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" /> Mengirimkan...
                  </>
                ) : (
                  <>
                    <Send style={{ width: '16px', height: '16px' }} /> Kirim Tautan Pemulihan
                  </>
                )}
              </button>
            </form>
          )}

          <div className={styles.formFooter}>
            <p className="text-xs text-[var(--theme-primary-dark,#064E3B)] font-semibold m-0">
              Ingat kata sandi Anda?{' '}
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
