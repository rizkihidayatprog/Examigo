import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogIn, 
  UserPlus, 
  Loader2, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  X,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import ExamigoLogo from '../components/common/ExamigoLogo';
import { applyDynamicTheme } from '../lib/theme';
import SEO from '../components/common/SEO';
import styles from '../styles/AuthLayout.module.css';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export default function AuthPage({ initialMode }: AuthPageProps) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Mode is strictly synchronized with current path:
  const isRegister = location.pathname === '/register' || (!location.pathname.startsWith('/login') && initialMode === 'register');

  // Google OAuth States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isGsiRendered, setIsGsiRendered] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const redirectTarget = searchParams.get('redirect');
  const planTarget = searchParams.get('plan') || 'personal';
  const billingTarget = searchParams.get('billing') || 'monthly';

  const DEFAULT_LOGIN_IMAGE = '/images/auth/login-showcase.jpg';
  const DEFAULT_REGISTER_IMAGE = '/images/auth/register-showcase.jpg';

  // Dynamic CMS Config with multi-image support and default fallbacks
  const [cmsConfig, setCmsConfig] = useState({
    login: {
      imageUrl: DEFAULT_LOGIN_IMAGE,
      images: [DEFAULT_LOGIN_IMAGE],
      headline: 'Platform Pembuat Ujian & Soal Otomatis No. 1',
      subtitle: 'Masuk ke akun Examigo Anda untuk mengelola bank soal terpadu, ujian anti-contek, dan penilaian otomatis instan.',
    },
    register: {
      imageUrl: DEFAULT_REGISTER_IMAGE,
      images: [DEFAULT_REGISTER_IMAGE],
      headline: 'Mulai Transformasi Ujian Digital Cerdas',
      subtitle: 'Daftar gratis sekarang. Bikin soal dari materi pelajaran hanya dalam hitungan detik dan terbitkan ujian secara instan.',
    }
  });

  // Active slide state for auto-slideshow
  const [activeLoginSlide, setActiveLoginSlide] = useState(0);
  const [activeRegSlide, setActiveRegSlide] = useState(0);

  // Strict fallback to default images if empty or whitespace
  const rawLoginImgs = (
    Array.isArray(cmsConfig.login.images) && cmsConfig.login.images.length > 0 
      ? cmsConfig.login.images 
      : [cmsConfig.login.imageUrl]
  ).filter(img => typeof img === 'string' && img.trim().length > 0);
  const loginImages = rawLoginImgs.length > 0 ? rawLoginImgs : [DEFAULT_LOGIN_IMAGE];

  const rawRegImgs = (
    Array.isArray(cmsConfig.register.images) && cmsConfig.register.images.length > 0 
      ? cmsConfig.register.images 
      : [cmsConfig.register.imageUrl]
  ).filter(img => typeof img === 'string' && img.trim().length > 0);
  const regImages = rawRegImgs.length > 0 ? rawRegImgs : [DEFAULT_REGISTER_IMAGE];

  // Auto-slideshow rotation for Login
  useEffect(() => {
    if (loginImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveLoginSlide(prev => (prev + 1) % loginImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [loginImages.length]);

  // Auto-slideshow rotation for Register
  useEffect(() => {
    if (regImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveRegSlide(prev => (prev + 1) % regImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [regImages.length]);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    fetch('/api/public/landing-config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          if (data.data.theme) {
            applyDynamicTheme(data.data.theme);
          }
          if (data.data.authPages) {
            const ap = data.data.authPages;
            const loginList = (Array.isArray(ap.login?.images) ? ap.login.images : [ap.login?.imageUrl])
              .filter((x: any) => typeof x === 'string' && x.trim().length > 0);
            const regList = (Array.isArray(ap.register?.images) ? ap.register.images : [ap.register?.imageUrl])
              .filter((x: any) => typeof x === 'string' && x.trim().length > 0);

            setCmsConfig({
              login: {
                imageUrl: ap.login?.imageUrl?.trim() || (loginList[0] || DEFAULT_LOGIN_IMAGE),
                images: loginList.length > 0 ? loginList : [DEFAULT_LOGIN_IMAGE],
                headline: ap.login?.headline || 'Platform Pembuat Ujian & Soal Otomatis No. 1',
                subtitle: ap.login?.subtitle || 'Masuk ke akun Examigo Anda untuk mengelola bank soal terpadu, ujian anti-contek, dan penilaian otomatis instan.',
              },
              register: {
                imageUrl: ap.register?.imageUrl?.trim() || (regList[0] || DEFAULT_REGISTER_IMAGE),
                images: regList.length > 0 ? regList : [DEFAULT_REGISTER_IMAGE],
                headline: ap.register?.headline || 'Mulai Transformasi Ujian Digital Cerdas',
                subtitle: ap.register?.subtitle || 'Daftar gratis sekarang. Bikin soal dari materi pelajaran hanya dalam hitungan detik dan terbitkan ujian secara instan.',
              }
            });
          }
        }
      })
      .catch(err => console.error('Failed to load auth CMS config:', err));
  }, []);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
      navigate('/');
    } catch (err: any) {
      setLoginError(err.message || 'Login gagal');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (regPassword !== regConfirmPassword) {
      setRegError('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password minimal harus 6 karakter');
      return;
    }

    setRegLoading(true);
    try {
      await register(regName, regEmail, regPassword);
      if (redirectTarget === 'checkout') {
        navigate(`/checkout?plan=${planTarget}&billing=${billingTarget}`);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setRegError(err.message || 'Registrasi gagal');
    } finally {
      setRegLoading(false);
    }
  };

  // Google Identity Services Credential Callback
  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response?.credential) return;
    setGoogleLoading(true);
    setLoginError('');
    setRegError('');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('examigo_token', data.data.token);
        window.location.href = '/';
      } else {
        const errMsg = data.message || 'Gagal masuk via Google SSO';
        if (isRegister) setRegError(errMsg);
        else setLoginError(errMsg);
      }
    } catch (e) {
      const errMsg = 'Terjadi kesalahan saat memverifikasi akun Google.';
      if (isRegister) setRegError(errMsg);
      else setLoginError(errMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Google SSO Click Trigger
  const handleGoogleLogin = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
        });
        (window as any).google.accounts.id.prompt();
      } catch (e) {
        console.error('Google GIS prompt error:', e);
        setShowGoogleModal(true);
      }
    } else {
      setShowGoogleModal(true);
    }
  };

  // Demo Google Login (Quick Testing & Fallback)
  const handleDemoGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const mockEmail = `guru.google${Date.now().toString().slice(-4)}@gmail.com`;
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: mockEmail,
          name: 'Bpk. Ahmad Fauzi, M.Pd (Google)',
          googleId: `google_demo_${Date.now()}`,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('examigo_token', data.data.token);
        window.location.href = '/';
      } else {
        setLoginError(data.message || 'Gagal masuk');
      }
    } catch (e) {
      setLoginError('Gagal masuk via Demo Google SSO');
    } finally {
      setGoogleLoading(false);
      setShowGoogleModal(false);
    }
  };

  // Setup Google Identity Services & Render Official Button
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) return;

    const setupGsi = () => {
      if ((window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
          });

          const loginBtn = document.getElementById('googleSignInBtnLogin');
          if (loginBtn) {
            loginBtn.innerHTML = '';
            (window as any).google.accounts.id.renderButton(loginBtn, {
              theme: 'outline',
              size: 'large',
              width: 340,
              text: 'continue_with',
              shape: 'pill',
              logo_alignment: 'left',
            });
            setIsGsiRendered(true);
          }

          const regBtn = document.getElementById('googleSignInBtnRegister');
          if (regBtn) {
            regBtn.innerHTML = '';
            (window as any).google.accounts.id.renderButton(regBtn, {
              theme: 'outline',
              size: 'large',
              width: 340,
              text: 'signup_with',
              shape: 'pill',
              logo_alignment: 'left',
            });
            setIsGsiRendered(true);
          }
        } catch (err) {
          console.error('GIS setup error:', err);
        }
      }
    };

    if ((window as any).google?.accounts?.id) {
      setupGsi();
    } else {
      const timer = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          clearInterval(timer);
          setupGsi();
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, [isRegister]);

  // Reusable Login Form Component (Strictly NO emojis, clean Lucide SVGs)
  const renderLoginForm = () => (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <Link to="/" className="inline-block no-underline mb-3">
          <ExamigoLogo size="lg" showBadge={true} />
        </Link>
        <h2 className={styles.formTitle}>Selamat Datang</h2>
        <p className={styles.formSubtitle}>
          Masuk ke akun Anda untuk mulai mengelola kuis dan ujian online
        </p>
      </div>

      {loginError && (
        <div className={styles.errorAlert}>
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{loginError}</span>
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Alamat Email</label>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="nama@sekolah.sch.id"
              className={styles.inputField}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className="flex items-center justify-between">
            <label className={styles.inputLabel}>Kata Sandi</label>
            <Link to="/forgot-password" className={styles.switchLink} style={{ fontSize: '11px' }}>
              Lupa Password?
            </Link>
          </div>
          <div className={styles.inputWrapper}>
            <input
              type={showLoginPassword ? 'text' : 'password'}
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.inputField}
              style={{ paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              className={styles.passwordToggleBtn}
              title={showLoginPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loginLoading}
          className={styles.submitBtn}
        >
          {loginLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Akun</span>
            </>
          )}
        </button>
      </form>

      {/* Social SSO Divider */}
      <div className="relative flex items-center justify-center my-1">
        <div className="border-t border-[var(--theme-border,#A7F3D0)] w-full" />
        <span className="bg-white px-3 text-[10px] text-[var(--theme-primary,#059669)] font-extrabold uppercase absolute">
          atau masuk dengan
        </span>
      </div>

      <div className="w-full flex justify-center py-1">
        <div id="googleSignInBtnLogin" className="flex justify-center min-h-[44px]"></div>
      </div>

      <div className={styles.formFooter}>
        <p className="text-xs text-[var(--theme-primary-dark,#064E3B)] font-semibold m-0 flex items-center justify-center gap-1">
          <span>Belum punya akun Examigo?</span>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-extrabold text-xs ml-1 cursor-pointer bg-transparent border-0 p-0"
          >
            <span>Daftar Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </p>
      </div>
    </div>
  );

  // Reusable Register Form Component (Strictly NO emojis, clean Lucide SVGs)
  const renderRegisterForm = () => (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <Link to="/" className="inline-block no-underline mb-3">
          <ExamigoLogo size="lg" showBadge={true} />
        </Link>
        <h2 className={styles.formTitle}>Daftar Akun Baru</h2>
        <p className={styles.formSubtitle}>
          Mulai buat ujian online interaktif dan otomatis secara gratis
        </p>
      </div>

      {regError && (
        <div className={styles.errorAlert}>
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{regError}</span>
        </div>
      )}

      <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Nama Lengkap / Nama Lembaga</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Misal: Bpk. Ahmad Dahlan, M.Pd"
              className={styles.inputField}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Alamat Email</label>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="guru@sekolah.sch.id"
              className={styles.inputField}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Kata Sandi (Minimal 6 Karakter)</label>
          <div className={styles.inputWrapper}>
            <input
              type={showRegPassword ? 'text' : 'password'}
              required
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.inputField}
              style={{ paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowRegPassword(!showRegPassword)}
              className={styles.passwordToggleBtn}
              title={showRegPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Ulangi Konfirmasi Kata Sandi</label>
          <div className={styles.inputWrapper}>
            <input
              type={showRegPassword ? 'text' : 'password'}
              required
              value={regConfirmPassword}
              onChange={(e) => setRegConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.inputField}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={regLoading}
          className={styles.submitBtn}
        >
          {regLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Mendaftarkan Akun...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Buat Akun Examigo</span>
            </>
          )}
        </button>
      </form>

      {/* Social SSO Divider */}
      <div className="relative flex items-center justify-center my-1">
        <div className="border-t border-[var(--theme-border,#A7F3D0)] w-full" />
        <span className="bg-white px-3 text-[10px] text-[var(--theme-primary,#059669)] font-extrabold uppercase absolute">
          atau daftar dengan
        </span>
      </div>

      <div className="w-full flex justify-center py-1">
        <div id="googleSignInBtnRegister" className="flex justify-center min-h-[44px]"></div>
      </div>

      <div className={styles.formFooter}>
        <p className="text-xs text-[var(--theme-primary-dark,#064E3B)] font-semibold m-0 flex items-center justify-center gap-1">
          <span>Sudah memiliki akun Examigo?</span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-extrabold text-xs ml-1 cursor-pointer bg-transparent border-0 p-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Masuk ke Akun Anda</span>
          </button>
        </p>
      </div>
    </div>
  );

  // Ultra-smooth easing curve for desktop split-screen sliding
  const SLIDE_TRANSITION = {
    duration: 0.75,
    ease: [0.65, 0, 0.35, 1] as const, // easeInOutCubic: gentle acceleration, fluid glide in center, gentle stop
  };

  const TEXT_FADE_TRANSITION = {
    duration: 0.45,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  return (
    <div className={styles.slidingScreen}>
      <SEO
        title={isRegister ? 'Daftar Akun Baru' : 'Masuk ke Akun'}
        description={
          isRegister
            ? 'Daftar akun Examigo gratis. Mulai buat soal ujian online dengan AI dan CBT anti-contek dalam hitungan detik.'
            : 'Masuk ke portal Examigo untuk mengakses bank soal, ruang ujian CBT, dan hasil penilaian otomatis siswa.'
        }
        canonical={isRegister ? 'https://examigo.id/register' : 'https://examigo.id/login'}
      />
      {/* =========================================================================
          A. DESKTOP VIEW: POWERED BY FRAMER MOTION HARDWARE ACCELERATED GLIDE
          ========================================================================= */}

      {/* 1. Desktop Panel Left (Slots the Register Form) */}
      <div 
        className={styles.desktopFormPanelLeft}
        style={{
          pointerEvents: isRegister ? 'auto' : 'none'
        }}
        aria-hidden={!isRegister}
      >
        {renderRegisterForm()}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 border border-emerald-200/60 transition-all shadow-xs group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* 2. Desktop Panel Right (Slots the Login Form) */}
      <div 
        className={styles.desktopFormPanelRight}
        style={{
          pointerEvents: !isRegister ? 'auto' : 'none'
        }}
        aria-hidden={isRegister}
      >
        {renderLoginForm()}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 border border-emerald-200/60 transition-all shadow-xs group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* 3. Physical Gliding Showcase Curtain Powered by Framer Motion */}
      <motion.div 
        className={styles.slidingShowcase}
        initial={false}
        animate={{
          x: isRegister ? "100%" : "0%"
        }}
        transition={SLIDE_TRANSITION}
      >
        {/* Background images with cross-fade across multi-image lists */}
        {loginImages.map((img, idx) => (
          <motion.img
            key={`login-bg-${idx}`}
            src={img}
            alt={`Login Showcase ${idx + 1}`}
            className={styles.showcaseBg}
            initial={{ opacity: !isRegister && activeLoginSlide === idx ? 1 : 0 }}
            animate={{
              opacity: !isRegister && activeLoginSlide === idx ? 1 : 0,
            }}
            transition={SLIDE_TRANSITION}
            onError={(e: any) => { e.target.src = '/images/auth/login-showcase.jpg'; }}
          />
        ))}

        {regImages.map((img, idx) => (
          <motion.img
            key={`reg-bg-${idx}`}
            src={img}
            alt={`Register Showcase ${idx + 1}`}
            className={styles.showcaseBg}
            initial={{ opacity: isRegister && activeRegSlide === idx ? 1 : 0 }}
            animate={{
              opacity: isRegister && activeRegSlide === idx ? 1 : 0,
            }}
            transition={SLIDE_TRANSITION}
            onError={(e: any) => { e.target.src = '/images/auth/register-showcase.jpg'; }}
          />
        ))}

        <div className={styles.showcaseGradientOverlay} />
        <div className={styles.showcaseGlowSphere} />

        {/* Interactive Dots for Multiple Images */}
        {((!isRegister && loginImages.length > 1) || (isRegister && regImages.length > 1)) && (
          <div className="absolute bottom-9 right-9 z-20 flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-xl">
            {(!isRegister ? loginImages : regImages).map((_, dotIdx) => {
              const isActive = !isRegister ? activeLoginSlide === dotIdx : activeRegSlide === dotIdx;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => {
                    if (!isRegister) setActiveLoginSlide(dotIdx);
                    else setActiveRegSlide(dotIdx);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'w-6 bg-emerald-400'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Slide ${dotIdx + 1}`}
                />
              );
            })}
          </div>
        )}

        {/* Persistent Header in Showcase: Logo & Styled Back Button with generous padding */}
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

        {/* Showcase Content: Login State - ONLY Clean Hero Text (No badges, no cards) */}
        <motion.div 
          className={styles.showcaseContentFade} 
          initial={{ opacity: isRegister ? 0 : 1, y: 0 }}
          animate={{
            opacity: isRegister ? 0 : 1,
            y: isRegister ? -14 : 0
          }}
          transition={TEXT_FADE_TRANSITION}
          style={{ 
            pointerEvents: isRegister ? 'none' : 'auto'
          }}
        >
          <div className="space-y-3.5 max-w-lg">
            <h1 className={styles.showcaseHeadline}>
              {cmsConfig.login.headline}
            </h1>

            <p className={styles.showcaseSubtitle}>
              {cmsConfig.login.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Showcase Content: Register State - ONLY Clean Hero Text (No badges, no cards) */}
        <motion.div 
          className={styles.showcaseContentFade} 
          initial={{ opacity: isRegister ? 1 : 0, y: 0 }}
          animate={{
            opacity: isRegister ? 1 : 0,
            y: isRegister ? 0 : 14
          }}
          transition={TEXT_FADE_TRANSITION}
          style={{ 
            pointerEvents: isRegister ? 'auto' : 'none'
          }}
        >
          <div className="space-y-3.5 max-w-lg">
            <h1 className={styles.showcaseHeadline}>
              {cmsConfig.register.headline}
            </h1>

            <p className={styles.showcaseSubtitle}>
              {cmsConfig.register.subtitle}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* =========================================================================
          B. MOBILE VIEW: SEGMENTED SWITCHER & SLIDING CAROUSEL TRACK
          ========================================================================= */}
      <div className={styles.mobileAuthWrapper}>
        <div className="flex justify-center mb-2">
          <Link to="/" className="inline-block no-underline">
            <ExamigoLogo size="lg" showBadge={true} />
          </Link>
        </div>

        {/* Sliding Segmented Nav Pill */}
        <div className={styles.mobileSegmentedNav}>
          <motion.div 
            className={styles.mobileSegmentPill} 
            initial={false}
            animate={{
              x: isRegister ? "100%" : "0%"
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30
            }}
          />
          <button
            type="button"
            onClick={() => navigate('/login')}
            className={`${styles.mobileSegmentBtn} ${
              !isRegister ? styles.mobileSegmentBtnActive : ''
            } inline-flex items-center justify-center gap-1.5`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk Akun</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className={`${styles.mobileSegmentBtn} ${
              isRegister ? styles.mobileSegmentBtnActive : ''
            } inline-flex items-center justify-center gap-1.5`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar Baru</span>
          </button>
        </div>

        {/* 200% Horizontal Sliding Track for Mobile */}
        <div className={styles.mobileTrackContainer}>
          <motion.div 
            className={styles.mobileSliderTrack}
            initial={false}
            animate={{
              x: isRegister ? "-50%" : "0%"
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 26
            }}
          >
            <div className={styles.mobileSlideItem}>
              {renderLoginForm()}
            </div>
            <div className={styles.mobileSlideItem}>
              {renderRegisterForm()}
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kembali ke Halaman Depan</span>
          </Link>
        </div>
      </div>

      {/* Google OAuth Guidance & Demo Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 max-w-md w-full p-6 text-slate-800 relative">
            <button 
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">Google Single Sign-On</h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Google Identity Services
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">
                Kunci <code className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-mono">VITE_GOOGLE_CLIENT_ID</code> belum diatur di file <code className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-mono">.env</code>.
              </p>
              <p>
                Untuk menghubungkan dengan akun Gmail asli Anda:
              </p>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                <li>Buka <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">Google Cloud Console</a>.</li>
                <li>Buat OAuth 2.0 Client ID (Web Application) dan tambahkan domain web Anda.</li>
                <li>Tempelkan Client ID ke file <code className="bg-white px-1 border border-slate-200 rounded font-mono">client/.env</code>.</li>
              </ol>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleDemoGoogleLogin}
                disabled={googleLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghubungkan Akun...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Coba Masuk Akun Guru (Demo Google SSO)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
