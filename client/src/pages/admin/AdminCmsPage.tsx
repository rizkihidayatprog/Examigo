import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  DollarSign, 
  FileText, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  RotateCcw,
  Sparkles, 
  Plus, 
  Trash2, 
  Eye, 
  Layout, 
  ShieldCheck, 
  HelpCircle,
  Zap,
  Globe,
  RefreshCw,
  Users,
  Layers,
  Upload,
  Image as ImageIcon,
  Info,
  ExternalLink,
  LogIn,
  UserPlus,
  Loader2,
  Wrench,
  CreditCard,
  GraduationCap,
  ShieldAlert
} from 'lucide-react';
import { api } from '../../lib/auth';
import { applyDynamicTheme, THEME_PRESETS } from '../../lib/theme';

// Formatter for Indonesian currency / thousands separator with dots (e.g. 50000 -> "50.000")
const formatNumberWithDots = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '';
  const num = typeof val === 'number' ? val : Number(String(val).replace(/\D/g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString('id-ID');
};

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState<'pricing' | 'hero' | 'theme' | 'faqs' | 'ai_config' | 'auth_pages' | 'maintenance'>('pricing');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [testingKey, setTestingKey] = useState(false);
  const [testStatus, setTestStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auth Pages Config (Login, Register, Forgot Password)
  const [authPages, setAuthPages] = useState({
    login: {
      imageUrl: '/images/auth/login-showcase.jpg',
      images: ['/images/auth/login-showcase.jpg'],
      badge: 'Platform Ujian Online Terpadu',
      headline: 'Platform Pembuat Ujian & Soal Otomatis No. 1',
      subtitle: 'Masuk ke akun Examigo Anda untuk mengelola bank soal terpadu, ujian anti-contek, dan penilaian otomatis instan.',
      formPosition: 'right' as 'left' | 'right'
    },
    register: {
      imageUrl: '/images/auth/register-showcase.jpg',
      images: ['/images/auth/register-showcase.jpg'],
      badge: 'Bergabung Bersama 10.000+ Guru & Lembaga',
      headline: 'Mulai Transformasi Ujian Digital Cerdas',
      subtitle: 'Daftar gratis sekarang. Bikin soal dari materi pelajaran hanya dalam hitungan detik dan terbitkan ujian secara instan.',
      formPosition: 'left' as 'left' | 'right'
    },
    forgotPassword: {
      imageUrl: '/images/auth/login-showcase.jpg',
      images: ['/images/auth/login-showcase.jpg'],
      badge: 'Keamanan Akun Terjamin',
      headline: 'Pemulihan Akses Akun Examigo',
      subtitle: 'Jangan khawatir, kami akan membantu memulihkan akses akun Anda dengan tautan verifikasi aman ke email terdaftar.',
      formPosition: 'right' as 'left' | 'right'
    }
  });

  // Auth multi-image upload & management states
  const [uploadingLoginImg, setUploadingLoginImg] = useState(false);
  const [uploadingRegisterImg, setUploadingRegisterImg] = useState(false);
  const [newLoginImgUrl, setNewLoginImgUrl] = useState('');
  const [newRegisterImgUrl, setNewRegisterImgUrl] = useState('');

  // CMS Config State
  const [theme, setTheme] = useState({
    preset: 'emerald',
    primaryColor: 'var(--theme-primary-dark, #064E3B)',
    accentColor: 'var(--theme-primary, #10B981)',
    highlightColor: 'var(--theme-primary-light, #34D399)',
  });

  const [hero, setHero] = useState({
    pillText: '',
    headlineMain: '',
    headlineHighlight: '',
    subtitle: '',
    primaryCtaText: '',
  });

  const [pricing, setPricing] = useState({
    free: {
      name: 'Free',
      badge: 'Paket Dasar',
      monthlyPrice: 0,
      yearlyPrice: 0,
      maxAiQuestions: 15,
      maxParticipants: 5,
      maxActiveExams: 1,
      features: [] as string[]
    },
    personal: {
      name: 'Personal',
      badge: 'Guru Mandiri',
      monthlyPrice: 49000,
      yearlyPrice: 490000,
      maxAiQuestions: 100,
      maxParticipants: 50,
      maxActiveExams: 5,
      features: [] as string[]
    },
    pro_ai: {
      name: 'Pro',
      badge: 'Sekolah & Bimbel',
      isPopular: true,
      monthlyPrice: 149000,
      yearlyPrice: 1490000,
      maxAiQuestions: 300,
      maxParticipants: 200,
      maxActiveExams: 15,
      features: [] as string[]
    },
    serviceFee: 0,
  });

  // Add-on Top-up Quota Pricing
  const [addonPricing, setAddonPricing] = useState({
    enabled: true,
    pricePerAiQuestion: 500,
    pricePerStudent: 200,
    pricePerActiveExam: 5000,
    minAiQuestions: 10,
    minStudents: 10,
    minActiveExams: 1,
  });

  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);

  const [maintenance, setMaintenance] = useState({
    enabled: false,
    title: 'Sistem Sedang Dalam Pemeliharaan',
    message: 'Kami sedang melakukan pemeliharaan sistem rutin dan peningkatan performa server Examigo. Layanan akan segera kembali normal.',
    estimatedEndTime: '',
    allowAdminLogin: true,
    features: {
      payments: false,
      aiGeneration: false,
      examCreation: false,
      studentExams: false,
    },
  });
  const [togglingMaintenance, setTogglingMaintenance] = useState(false);

  // Saved Snapshot for tracking unsaved modifications
  const [savedSnapshot, setSavedSnapshot] = useState<string>('');

  const currentSnapshot = JSON.stringify({
    theme,
    hero,
    pricing,
    addonPricing,
    authPages,
    faqs,
    geminiApiKey,
    maintenance,
  });

  const parsedSaved = React.useMemo(() => {
    if (!savedSnapshot) return null;
    try {
      return JSON.parse(savedSnapshot);
    } catch {
      return null;
    }
  }, [savedSnapshot]);

  const isPricingDirty = Boolean(parsedSaved && (
    JSON.stringify(pricing) !== JSON.stringify(parsedSaved.pricing) ||
    JSON.stringify(addonPricing) !== JSON.stringify(parsedSaved.addonPricing)
  ));
  const isHeroDirty = Boolean(parsedSaved && JSON.stringify(hero) !== JSON.stringify(parsedSaved.hero));
  const isThemeDirty = Boolean(parsedSaved && JSON.stringify(theme) !== JSON.stringify(parsedSaved.theme));
  const isAuthPagesDirty = Boolean(parsedSaved && JSON.stringify(authPages) !== JSON.stringify(parsedSaved.authPages));
  const isFaqsDirty = Boolean(parsedSaved && JSON.stringify(faqs) !== JSON.stringify(parsedSaved.faqs));
  const isAiConfigDirty = Boolean(parsedSaved && geminiApiKey !== parsedSaved.geminiApiKey);
  const isMaintenanceDirty = Boolean(parsedSaved && JSON.stringify(maintenance) !== JSON.stringify(parsedSaved.maintenance));

  const isDirty = Boolean(savedSnapshot && savedSnapshot !== currentSnapshot);

  const handleDiscardChanges = () => {
    if (!parsedSaved) return;
    setTheme(parsedSaved.theme);
    setHero(parsedSaved.hero);
    setPricing(parsedSaved.pricing);
    setAddonPricing(parsedSaved.addonPricing);
    setAuthPages(parsedSaved.authPages);
    setFaqs(parsedSaved.faqs);
    setGeminiApiKey(parsedSaved.geminiApiKey);
    setMaintenance(parsedSaved.maintenance);
    applyDynamicTheme(parsedSaved.theme);
    showToast('Perubahan dibatalkan. Mengembalikan ke setelan tersimpan.', 'success');
  };

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch CMS config
  const loadConfig = async () => {
    try {
      setLoading(true);
      const res = await api('/admin/cms');
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;

        const finalTheme = d.theme || theme;
        const finalHero = d.hero || hero;
        const finalPricing = d.pricing ? { ...pricing, ...d.pricing, serviceFee: d.pricing.serviceFee ?? 0 } : pricing;
        const finalAddonPricing = d.addonPricing ? { ...addonPricing, ...d.addonPricing } : addonPricing;
        const finalFaqs = d.faqs || faqs;
        const finalGeminiApiKey = d.geminiApiKey || '';
        const finalMaintenance = d.maintenance ? {
          ...maintenance,
          ...d.maintenance,
          features: {
            ...maintenance.features,
            ...(d.maintenance.features || {}),
          }
        } : maintenance;
        const finalAuthPages = d.authPages ? {
          login: {
            ...authPages.login,
            ...(d.authPages.login || {}),
            images: d.authPages.login?.images && d.authPages.login.images.length > 0
              ? d.authPages.login.images
              : [d.authPages.login?.imageUrl || authPages.login.imageUrl],
          },
          register: {
            ...authPages.register,
            ...(d.authPages.register || {}),
            images: d.authPages.register?.images && d.authPages.register.images.length > 0
              ? d.authPages.register.images
              : [d.authPages.register?.imageUrl || authPages.register.imageUrl],
          },
          forgotPassword: {
            ...authPages.forgotPassword,
            ...(d.authPages.forgotPassword || {}),
            images: d.authPages.forgotPassword?.images && d.authPages.forgotPassword.images.length > 0
              ? d.authPages.forgotPassword.images
              : [d.authPages.forgotPassword?.imageUrl || authPages.forgotPassword.imageUrl],
          },
        } : authPages;

        if (d.theme) {
          setTheme(finalTheme);
          applyDynamicTheme(finalTheme);
        }
        if (d.hero) setHero(finalHero);
        if (d.pricing) setPricing(finalPricing);
        if (d.addonPricing) setAddonPricing(finalAddonPricing);
        if (d.faqs) setFaqs(finalFaqs);
        if (d.geminiApiKey) setGeminiApiKey(finalGeminiApiKey);
        if (d.maintenance) setMaintenance(finalMaintenance);
        if (d.authPages) setAuthPages(finalAuthPages);

        setSavedSnapshot(JSON.stringify({
          theme: finalTheme,
          hero: finalHero,
          pricing: finalPricing,
          addonPricing: finalAddonPricing,
          authPages: finalAuthPages,
          faqs: finalFaqs,
          geminiApiKey: finalGeminiApiKey,
          maintenance: finalMaintenance,
        }));
      }
    } catch (err: any) {
      showToast('Gagal memuat konfigurasi CMS', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Auth Showcase Image Handlers
  const handleUploadAuthImage = async (e: React.ChangeEvent<HTMLInputElement>, pageKey: 'login' | 'register') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Hanya file gambar (JPG, PNG, WebP) yang diperbolehkan!', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 5 MB!', 'error');
      return;
    }

    const setUploading = pageKey === 'login' ? setUploadingLoginImg : setUploadingRegisterImg;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await api('/admin/cms/upload-auth-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.imageUrl) {
        setAuthPages(prev => {
          const page = prev[pageKey];
          const existingImages = page.images || (page.imageUrl ? [page.imageUrl] : []);
          const updatedImages = [...existingImages, data.imageUrl];
          return {
            ...prev,
            [pageKey]: {
              ...page,
              images: updatedImages,
              imageUrl: page.imageUrl || data.imageUrl,
            }
          };
        });
        showToast('Gambar berhasil diunggah dari lokal!', 'success');
      } else {
        showToast(data.message || 'Gagal mengunggah gambar.', 'error');
      }
    } catch (err: any) {
      showToast('Terjadi kesalahan saat mengunggah gambar.', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = (pageKey: 'login' | 'register') => {
    const url = (pageKey === 'login' ? newLoginImgUrl : newRegisterImgUrl).trim();
    if (!url) return;

    setAuthPages(prev => {
      const page = prev[pageKey];
      const existingImages = page.images || (page.imageUrl ? [page.imageUrl] : []);
      if (existingImages.includes(url)) {
        showToast('URL gambar ini sudah ada di daftar!', 'error');
        return prev;
      }
      return {
        ...prev,
        [pageKey]: {
          ...page,
          images: [...existingImages, url],
          imageUrl: page.imageUrl || url,
        }
      };
    });

    if (pageKey === 'login') setNewLoginImgUrl('');
    else setNewRegisterImgUrl('');
    showToast('Gambar berhasil ditambahkan ke daftar!', 'success');
  };

  const handleSetPrimaryImage = (pageKey: 'login' | 'register', imgUrl: string) => {
    setAuthPages(prev => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        imageUrl: imgUrl
      }
    }));
    showToast('Gambar utama showcase berhasil disetel!', 'success');
  };

  const handleDeleteImage = (pageKey: 'login' | 'register', imgUrl: string) => {
    const defaultImg = pageKey === 'login' ? '/images/auth/login-showcase.jpg' : '/images/auth/register-showcase.jpg';

    setAuthPages(prev => {
      const page = prev[pageKey];
      const existingImages = (page.images && page.images.length > 0 ? page.images : [page.imageUrl || defaultImg])
        .filter(img => Boolean(img && img.trim()));

      const filtered = existingImages.filter(img => img !== imgUrl);
      const finalImages = filtered.length > 0 ? filtered : [defaultImg];
      const newPrimary = page.imageUrl === imgUrl || !filtered.includes(page.imageUrl) 
        ? finalImages[0] 
        : page.imageUrl;

      return {
        ...prev,
        [pageKey]: {
          ...page,
          images: finalImages,
          imageUrl: newPrimary,
        }
      };
    });
    showToast('Gambar berhasil dihapus. Jika kosong, sistem otomatis memakai gambar default!', 'success');
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // Update dynamic CSS variables whenever theme selection changes
  const handleSelectTheme = (newTheme: typeof theme) => {
    setTheme(newTheme);
    applyDynamicTheme(newTheme);
  };

  // Save CMS Config
  const handleSaveConfig = async () => {
    if (!geminiApiKey || !geminiApiKey.trim()) {
      setActiveTab('ai_config');
      showToast('⚠️ Kunci API Gemini TIDAK BOLEH KOSONG! Harap isi API Key sebelum menyimpan.', 'error');
      return;
    }
    try {
      setSaving(true);
      const DEFAULT_LOGIN_IMG = '/images/auth/login-showcase.jpg';
      const DEFAULT_REGISTER_IMG = '/images/auth/register-showcase.jpg';

      const sanitizedAuthPages = {
        ...authPages,
        login: {
          ...authPages.login,
          images: (authPages.login.images || []).filter(img => Boolean(img && img.trim())).length > 0
            ? (authPages.login.images || []).filter(img => Boolean(img && img.trim()))
            : [DEFAULT_LOGIN_IMG],
          imageUrl: authPages.login.imageUrl?.trim() || DEFAULT_LOGIN_IMG
        },
        register: {
          ...authPages.register,
          images: (authPages.register.images || []).filter(img => Boolean(img && img.trim())).length > 0
            ? (authPages.register.images || []).filter(img => Boolean(img && img.trim()))
            : [DEFAULT_REGISTER_IMG],
          imageUrl: authPages.register.imageUrl?.trim() || DEFAULT_REGISTER_IMG
        },
        forgotPassword: {
          ...authPages.forgotPassword,
          images: (authPages.forgotPassword.images || []).filter(img => Boolean(img && img.trim())).length > 0
            ? (authPages.forgotPassword.images || []).filter(img => Boolean(img && img.trim()))
            : [DEFAULT_LOGIN_IMG],
          imageUrl: authPages.forgotPassword.imageUrl?.trim() || DEFAULT_LOGIN_IMG
        }
      };

      const res = await api('/admin/cms', {
        method: 'PUT',
        body: JSON.stringify({
          theme,
          hero,
          pricing,
          addonPricing,
          authPages: sanitizedAuthPages,
          faqs,
          geminiApiKey,
          maintenance,
        }),
      });
      const data = await res.json();
      if (data.success) {
        applyDynamicTheme(theme);
        setSavedSnapshot(JSON.stringify({
          theme,
          hero,
          pricing,
          addonPricing,
          authPages: sanitizedAuthPages,
          faqs,
          geminiApiKey,
          maintenance,
        }));
        showToast('✓ Konfigurasi CMS berhasil disimpan!', 'success');
      } else {
        showToast(data.message || 'Gagal menyimpan konfigurasi CMS.', 'error');
      }
    } catch (err: any) {
      showToast('Terjadi kesalahan koneksi.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Keyboard shortcut Ctrl+S / Cmd+S to quickly save from anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!saving) {
          handleSaveConfig();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, hero, pricing, addonPricing, authPages, faqs, geminiApiKey, maintenance, saving]);

  // Warning when leaving or refreshing page if there are unsaved modifications
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Preset themes (14 diverse modern palettes)
  const colorPresets = THEME_PRESETS;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 text-xs font-bold transition-all ${
          toastMessage.type === 'success' ? 'bg-[var(--theme-primary, #10B981)] text-white' : 'bg-red-600 text-white'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Layout className="w-8 h-8 text-[var(--theme-primary, #10B981)]" />
            Landing Page & Pricing CMS
          </h2>
          <p className="text-slate-400 font-medium text-sm mt-1">
            Kustomisasi harga paket SaaS, teks headline hero, dan tema warna website secara dinamis & real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Tersimpan / Belum Disimpan */}
          {isDirty ? (
            <div className="hidden sm:flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Ada perubahan belum disimpan</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Semua tersimpan</span>
            </div>
          )}

          <a
            href="/landing"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Globe className="w-4 h-4 text-[var(--theme-primary, #10B981)]" /> Lihat Landing Page
          </a>

          <button
            onClick={handleSaveConfig}
            disabled={saving || !isDirty}
            style={isDirty ? { backgroundColor: 'var(--theme-primary, #059669)' } : {}}
            className={`px-5 py-2.5 rounded-xl text-white font-black text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
              isDirty
                ? 'shadow-emerald-900/40 ring-2 ring-emerald-400/40 hover:opacity-95 active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-70 shadow-none'
            }`}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan...' : isDirty ? 'Simpan Perubahan (Ctrl+S)' : 'Tersimpan'}
          </button>
        </div>
      </div>

      {/* CMS Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('pricing')}
          style={activeTab === 'pricing' ? { backgroundColor: 'var(--theme-primary, #059669)' } : {}}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 relative ${
            activeTab === 'pricing'
              ? 'text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" /> 1. Harga & Kuota Paket
          {isPricingDirty && (
            <span className="flex h-2 w-2 relative ml-1" title="Perubahan belum disimpan">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          style={activeTab === 'hero' ? { backgroundColor: 'var(--theme-primary, #059669)' } : {}}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 relative ${
            activeTab === 'hero'
              ? 'text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> 2. Teks Hero & Headline
          {isHeroDirty && (
            <span className="flex h-2 w-2 relative ml-1" title="Perubahan belum disimpan">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          style={activeTab === 'theme' ? { backgroundColor: 'var(--theme-primary, #059669)' } : {}}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 relative ${
            activeTab === 'theme'
              ? 'text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" /> 3. Tema & Warna Website
          {isThemeDirty && (
            <span className="flex h-2 w-2 relative ml-1" title="Perubahan belum disimpan">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('auth_pages')}
          style={activeTab === 'auth_pages' ? { backgroundColor: 'var(--theme-primary, #059669)' } : {}}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 relative ${
            activeTab === 'auth_pages'
              ? 'text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> 4. Halaman Auth (Login & Register)
          {isAuthPagesDirty && (
            <span className="flex h-2 w-2 relative ml-1" title="Perubahan belum disimpan">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          style={activeTab === 'faqs' ? { backgroundColor: 'var(--theme-primary, #059669)' } : {}}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 relative ${
            activeTab === 'faqs'
              ? 'text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> 5. Tanya Jawab (FAQ)
          {isFaqsDirty && (
            <span className="flex h-2 w-2 relative ml-1" title="Perubahan belum disimpan">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ai_config')}
          style={activeTab === 'ai_config' ? { backgroundColor: 'var(--theme-primary, #059669)' } : {}}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 relative ${
            activeTab === 'ai_config'
              ? 'text-white shadow-md'
              : !geminiApiKey.trim()
              ? 'bg-red-950/40 text-red-300 border border-red-800/60 hover:bg-red-900/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Zap className={`w-4 h-4 ${!geminiApiKey.trim() ? 'text-red-400' : 'text-amber-400'}`} /> 6. Kunci API Generator (Gemini)
          {!geminiApiKey.trim() ? (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-red-600 text-white uppercase tracking-wider animate-pulse">
              Wajib
            </span>
          ) : isAiConfigDirty ? (
            <span className="flex h-2 w-2 relative ml-1" title="Perubahan belum disimpan">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
          ) : null}
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          style={activeTab === 'maintenance' ? { backgroundColor: '#D97706' } : {}}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 relative ${
            activeTab === 'maintenance'
              ? 'text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4 text-amber-400" /> 7. Mode Pemeliharaan
          {maintenance.enabled && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />}
          {isMaintenanceDirty && (
            <span className="flex h-2 w-2 relative ml-1" title="Perubahan belum disimpan">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: PRICING & BENEFIT MANAGER */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Free Plan Settings */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-black uppercase">
                  {pricing.free.badge}
                </span>
                <span className="text-xs font-bold text-slate-500">Tier Gratis</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nama Paket</label>
                <input
                  type="text"
                  value={pricing.free.name}
                  onChange={(e) => setPricing({ ...pricing, free: { ...pricing.free, name: e.target.value } })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white font-bold focus:outline-none focus:border-[var(--theme-primary, #10B981)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Badge / Label</label>
                <input
                  type="text"
                  value={pricing.free.badge}
                  onChange={(e) => setPricing({ ...pricing, free: { ...pricing.free, badge: e.target.value } })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white font-bold focus:outline-none focus:border-[var(--theme-primary, #10B981)]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Maks Soal</label>
                  <input
                    type="number"
                    value={pricing.free.maxAiQuestions}
                    onChange={(e) => setPricing({ ...pricing, free: { ...pricing.free, maxAiQuestions: Number(e.target.value) } })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Maks Peserta</label>
                  <input
                    type="number"
                    value={pricing.free.maxParticipants}
                    onChange={(e) => setPricing({ ...pricing, free: { ...pricing.free, maxParticipants: Number(e.target.value) } })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Maks Ujian</label>
                  <input
                    type="number"
                    value={pricing.free.maxActiveExams}
                    onChange={(e) => setPricing({ ...pricing, free: { ...pricing.free, maxActiveExams: Number(e.target.value) } })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Personal Plan Settings */}
            <div className="p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 space-y-4 relative">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-[var(--theme-primary, #10B981)] text-[10px] font-black uppercase">
                  {pricing.personal.badge}
                </span>
                <span className="text-xs font-bold text-[var(--theme-primary, #10B981)]">Guru Mandiri</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nama Paket</label>
                <input
                  type="text"
                  value={pricing.personal.name}
                  onChange={(e) => setPricing({ ...pricing, personal: { ...pricing.personal, name: e.target.value } })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white font-bold focus:outline-none focus:border-[var(--theme-primary, #10B981)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Harga Bulanan</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={pricing.personal.monthlyPrice === 0 ? '' : formatNumberWithDots(pricing.personal.monthlyPrice)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setPricing({ ...pricing, personal: { ...pricing.personal, monthlyPrice: raw ? Number(raw) : 0 } });
                      }}
                      placeholder="0"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2.5 text-xs text-white font-black focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Harga Tahunan</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={pricing.personal.yearlyPrice === 0 ? '' : formatNumberWithDots(pricing.personal.yearlyPrice)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setPricing({ ...pricing, personal: { ...pricing.personal, yearlyPrice: raw ? Number(raw) : 0 } });
                      }}
                      placeholder="0"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2.5 text-xs text-white font-black focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Soal /bln</label>
                  <input
                    type="number"
                    value={pricing.personal.maxAiQuestions}
                    onChange={(e) => setPricing({ ...pricing, personal: { ...pricing.personal, maxAiQuestions: Number(e.target.value) } })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Maks Peserta</label>
                  <input
                    type="number"
                    value={pricing.personal.maxParticipants}
                    onChange={(e) => setPricing({ ...pricing, personal: { ...pricing.personal, maxParticipants: Number(e.target.value) } })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Maks Ujian</label>
                  <input
                    type="number"
                    value={pricing.personal.maxActiveExams}
                    onChange={(e) => setPricing({ ...pricing, personal: { ...pricing.personal, maxActiveExams: Number(e.target.value) } })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Pro AI Plan Settings */}
            <div className="p-6 rounded-3xl bg-slate-900 border-2 border-amber-500/40 space-y-4 relative">
              <span className="absolute -top-3 right-4 bg-amber-500 text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase">
                ✦ POPULER
              </span>

              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase">
                  {pricing.pro_ai.badge}
                </span>
                <span className="text-xs font-bold text-amber-400">Paling Laris</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nama Paket</label>
                <input
                  type="text"
                  value={pricing.pro_ai.name}
                  onChange={(e) => setPricing({ ...pricing, pro_ai: { ...pricing.pro_ai, name: e.target.value } })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white font-bold focus:outline-none focus:border-[var(--theme-primary, #10B981)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Harga Bulanan</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={pricing.pro_ai.monthlyPrice === 0 ? '' : formatNumberWithDots(pricing.pro_ai.monthlyPrice)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setPricing({ ...pricing, pro_ai: { ...pricing.pro_ai, monthlyPrice: raw ? Number(raw) : 0 } });
                      }}
                      placeholder="0"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2.5 text-xs text-white font-black focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Harga Tahunan</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={pricing.pro_ai.yearlyPrice === 0 ? '' : formatNumberWithDots(pricing.pro_ai.yearlyPrice)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setPricing({ ...pricing, pro_ai: { ...pricing.pro_ai, yearlyPrice: raw ? Number(raw) : 0 } });
                      }}
                      placeholder="0"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2.5 text-xs text-white font-black focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Soal /bln</label>
                  <input
                    type="number"
                    value={pricing.pro_ai.maxAiQuestions}
                    onChange={(e) => setPricing({ ...pricing, pro_ai: { ...pricing.pro_ai, maxAiQuestions: Number(e.target.value) } })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Maks Peserta</label>
                  <input
                    type="number"
                    value={pricing.pro_ai.maxParticipants}
                    onChange={(e) => setPricing({ ...pricing, pro_ai: { ...pricing.pro_ai, maxParticipants: Number(e.target.value) } })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Maks Ujian</label>
                  <input
                    type="number"
                    value={pricing.pro_ai.maxActiveExams}
                    onChange={(e) => setPricing({ ...pricing, pro_ai: { ...pricing.pro_ai, maxActiveExams: Number(e.target.value) } })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white font-bold"
                  />
                </div>
              </div>
            </div>

            {/* ADD-ON TOP-UP QUOTA PRICING SETTINGS */}
            <div className="lg:col-span-3 p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    Pengaturan Harga Kuota Tambahan (Add-on Top-Up Satuan)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Atur harga per biji / eceran jika pengajar ingin menambah kuota pembuatan soal, kapasitas siswa, atau slot ujian aktif. <strong className="text-amber-300">Hanya berlaku untuk semua paket berbayar (Personal & Pro) dan tidak berlaku untuk paket Free.</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-300">Status Pembelian Satuan:</span>
                  <button
                    type="button"
                    onClick={() => setAddonPricing({ ...addonPricing, enabled: !addonPricing.enabled })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      addonPricing.enabled 
                        ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {addonPricing.enabled ? '● AKTIF' : '○ NONAKTIF'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Harga Kuota Soal Otomatis */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-black">
                    <Sparkles className="w-4 h-4" /> 1. Kuota Generate Soal Otomatis
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Harga per 1 Butir Soal
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rp</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={addonPricing.pricePerAiQuestion === 0 ? '' : formatNumberWithDots(addonPricing.pricePerAiQuestion)}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          setAddonPricing({ ...addonPricing, pricePerAiQuestion: raw ? Number(raw) : 0 });
                        }}
                        placeholder="0"
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white font-black focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      Min. Pembelian (Butir Soal)
                    </label>
                    <input
                      type="number"
                      value={addonPricing.minAiQuestions}
                      onChange={(e) => setAddonPricing({ ...addonPricing, minAiQuestions: Number(e.target.value) })}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs text-white font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Contoh: Beli 50 Soal = Rp {(50 * (addonPricing.pricePerAiQuestion || 0)).toLocaleString('id-ID')}
                  </p>
                </div>

                {/* 2. Harga Kuota Siswa / Peserta */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-black">
                    <Users className="w-4 h-4" /> 2. Kuota Kapasitas Siswa
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Harga per 1 Kuota Siswa
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rp</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={addonPricing.pricePerStudent === 0 ? '' : formatNumberWithDots(addonPricing.pricePerStudent)}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          setAddonPricing({ ...addonPricing, pricePerStudent: raw ? Number(raw) : 0 });
                        }}
                        placeholder="0"
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white font-black focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      Min. Pembelian (Siswa)
                    </label>
                    <input
                      type="number"
                      value={addonPricing.minStudents}
                      onChange={(e) => setAddonPricing({ ...addonPricing, minStudents: Number(e.target.value) })}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs text-white font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Contoh: Beli 100 Siswa = Rp {(100 * (addonPricing.pricePerStudent || 0)).toLocaleString('id-ID')}
                  </p>
                </div>

                {/* 3. Harga Kuota Ujian Aktif */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-black">
                    <Layers className="w-4 h-4" /> 3. Kuota Slot Ujian Aktif
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Harga per 1 Ujian Aktif
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rp</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={addonPricing.pricePerActiveExam === 0 ? '' : formatNumberWithDots(addonPricing.pricePerActiveExam)}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          setAddonPricing({ ...addonPricing, pricePerActiveExam: raw ? Number(raw) : 0 });
                        }}
                        placeholder="0"
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white font-black focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      Min. Pembelian (Ujian)
                    </label>
                    <input
                      type="number"
                      value={addonPricing.minActiveExams}
                      onChange={(e) => setAddonPricing({ ...addonPricing, minActiveExams: Number(e.target.value) })}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs text-white font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Contoh: Beli 2 Ujian = Rp {(2 * (addonPricing.pricePerActiveExam || 0)).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>

            {/* Biaya Layanan / Admin Fee Transaksi */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    Biaya Layanan Pembayaran (Admin Fee)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Biaya administrasi checkout per transaksi. Jika diisi 0, maka di halaman checkout otomatis berstatus <strong className="text-emerald-400">Gratis (Rp 0)</strong>. Di halaman pengguna hanya akan tertulis <strong className="text-white">"Biaya Layanan"</strong> tanpa embel-embel nama gateway.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    (pricing.serviceFee || 0) === 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {(pricing.serviceFee || 0) === 0 ? '● Gratis (Rp 0)' : `● Berbayar (+Rp ${formatNumberWithDots(pricing.serviceFee)})`}
                  </span>
                </div>
              </div>

              <div className="max-w-xs">
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Nominal Biaya Layanan (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={pricing.serviceFee === 0 ? '' : formatNumberWithDots(pricing.serviceFee)}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      setPricing({ ...pricing, serviceFee: raw ? Number(raw) : 0 });
                    }}
                    placeholder="0"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2.5 text-xs text-white font-black focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: HERO & HEADLINE TEXT */}
      {activeTab === 'hero' && (
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 max-w-4xl">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Pill Badge Header</label>
            <input
              type="text"
              value={hero.pillText}
              onChange={(e) => setHero({ ...hero, pillText: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white font-medium focus:outline-none focus:border-[var(--theme-primary, #10B981)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Judul Utama (Headline)</label>
              <input
                type="text"
                value={hero.headlineMain}
                onChange={(e) => setHero({ ...hero, headlineMain: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white font-bold focus:outline-none focus:border-[var(--theme-primary, #10B981)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Kata Highlight (Gradient / Emas)</label>
              <input
                type="text"
                value={hero.headlineHighlight}
                onChange={(e) => setHero({ ...hero, headlineHighlight: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-amber-400 font-black focus:outline-none focus:border-[var(--theme-primary, #10B981)]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Subjudul / Deskripsi Hero</label>
            <textarea
              rows={3}
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white font-medium focus:outline-none focus:border-[var(--theme-primary, #10B981)]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Teks Tombol CTA Utama</label>
            <input
              type="text"
              value={hero.primaryCtaText}
              onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white font-bold focus:outline-none focus:border-[var(--theme-primary, #10B981)]"
            />
          </div>
        </div>
      )}

      {/* TAB 3: THEME & COLOR PRESETS */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-[var(--theme-primary, #10B981)]" />
                Pilihan Palet Tema Preset ({colorPresets.length} Tema Tersedia)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Klik kartu tema di bawah untuk menerapkan skema warna ke seluruh antarmuka aplikasi dan landing page secara instan.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 w-fit">
              Aktif: <strong className="text-white ml-1">{colorPresets.find(p => p.id === theme.preset)?.name || 'Kustom'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {colorPresets.map((preset) => {
              const isSelected = theme.preset === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    handleSelectTheme({
                      preset: preset.id,
                      primaryColor: preset.primaryColor,
                      accentColor: preset.accentColor,
                      highlightColor: preset.highlightColor,
                    });
                  }}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'bg-slate-850 border-[var(--theme-primary, #10B981)] shadow-lg shadow-emerald-950/40 ring-2 ring-[var(--theme-primary, #10B981)]/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-full h-24 rounded-2xl bg-gradient-to-br ${preset.bgPreview} flex items-center justify-center text-white font-black text-xs shadow-inner`}>
                    Preview Theme
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white">{preset.name}</h4>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-[var(--theme-primary, #10B981)]" />}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.primaryColor }} title="Primary" />
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.accentColor }} title="Accent" />
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.highlightColor }} title="Highlight" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 max-w-xl">
            <h4 className="font-bold text-sm text-white">Kustom Warna Hex (Lanjutan)</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Warna Primer</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => handleSelectTheme({ ...theme, preset: 'custom', primaryColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-300">{theme.primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Warna Aksen</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => handleSelectTheme({ ...theme, preset: 'custom', accentColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-300">{theme.accentColor}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Warna Highlight</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.highlightColor}
                    onChange={(e) => handleSelectTheme({ ...theme, preset: 'custom', highlightColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-300">{theme.highlightColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FAQ MANAGER */}
      {activeTab === 'faqs' && (
        <div className="space-y-4 max-w-4xl">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Daftar Pertanyaan & Jawaban (FAQ)</h3>
            <button
              onClick={() => setFaqs([...faqs, { q: 'Pertanyaan Baru?', a: 'Jawaban penjelasan detail.' }])}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 text-[var(--theme-primary, #10B981)]" /> Tambah FAQ
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={faq.q}
                      onChange={(e) => {
                        const updated = [...faqs];
                        updated[idx].q = e.target.value;
                        setFaqs(updated);
                      }}
                      placeholder="Tuliskan Pertanyaan..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white font-bold focus:outline-none focus:border-[var(--theme-primary, #10B981)]"
                    />
                    <textarea
                      rows={2}
                      value={faq.a}
                      onChange={(e) => {
                        const updated = [...faqs];
                        updated[idx].a = e.target.value;
                        setFaqs(updated);
                      }}
                      placeholder="Tuliskan Jawaban..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-300 font-medium focus:outline-none focus:border-[var(--theme-primary, #10B981)]"
                    />
                  </div>
                  <button
                    onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    title="Hapus FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AI API KEY CONFIGURATION */}
      {activeTab === 'ai_config' && (
        <div className="space-y-6 max-w-3xl animate-fade-in">
          {/* CRITICAL WARNING BANNER WHEN EMPTY */}
          {!geminiApiKey.trim() && (
            <div className="p-5 rounded-3xl bg-red-950/70 border-2 border-red-500 flex items-start gap-4 text-xs text-red-200 shadow-xl shadow-red-950/50 animate-pulse">
              <AlertTriangle className="w-6 h-6 shrink-0 text-red-400 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-white tracking-wide uppercase">
                    ⚠️ Peringatan Wajib: Kunci API Gemini Tidak Boleh Kosong!
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px]">
                    WAJIB DIISI
                  </span>
                </div>
                <p className="text-red-100 text-xs leading-relaxed">
                  Kolom <strong>Google Gemini API Key</strong> tidak boleh dibiarkan kosong. Generator Soal AI membutuhkan kunci API aktif untuk menganalisis dokumen dan menghasilkan butir soal otomatis berkualitas tinggi. Masukkan API Key Anda di bawah ini dan klik Simpan.
                </p>
              </div>
            </div>
          )}

          <div className={`p-6 rounded-3xl bg-slate-900 border space-y-5 transition-all ${
            !geminiApiKey.trim() ? 'border-red-500/80 shadow-lg shadow-red-950/30' : 'border-slate-800'
          }`}>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className={`p-3 rounded-2xl ${!geminiApiKey.trim() ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-white">Google Gemini API Key (Generator Soal)</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/50 uppercase tracking-wider">
                    * Wajib Diisi (Tidak Boleh Kosong)
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Kunci API ini digunakan oleh sistem Generator Soal untuk memproses dokumen dan menyusun soal ujian otomatis berakurasi tinggi.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <span>Gemini API Key</span>
                  <span className="text-red-400 font-bold">*</span>
                </label>
                {!geminiApiKey.trim() ? (
                  <span className="text-[11px] font-bold text-red-400 flex items-center gap-1 animate-bounce">
                    <AlertCircle className="w-3.5 h-3.5" /> Wajib diisi! Tidak boleh kosong
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Kunci API terpasang
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => {
                    setGeminiApiKey(e.target.value);
                    setTestStatus(null);
                  }}
                  placeholder="AIzaSy..."
                  className={`flex-1 rounded-xl bg-slate-950 border px-4 py-3 text-xs text-white font-mono focus:outline-none transition-colors ${
                    !geminiApiKey.trim()
                      ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-400 bg-red-950/10'
                      : 'border-slate-800 focus:border-[var(--theme-primary, #10B981)]'
                  }`}
                />
                <button
                  type="button"
                  disabled={testingKey || !geminiApiKey.trim()}
                  onClick={async () => {
                    try {
                      setTestingKey(true);
                      setTestStatus(null);
                      const res = await api('/admin/cms/test-ai-key', {
                        method: 'POST',
                        body: JSON.stringify({ apiKey: geminiApiKey.trim() }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setTestStatus({ type: 'success', text: data.message });
                      } else {
                        setTestStatus({ type: 'error', text: data.message });
                      }
                    } catch (err: any) {
                      setTestStatus({ type: 'error', text: 'Gagal terhubung ke server.' });
                    } finally {
                      setTestingKey(false);
                    }
                  }}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer"
                >
                  {testingKey ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-300" />}
                  {testingKey ? 'Memeriksa...' : 'Uji Koneksi API'}
                </button>
              </div>

              {testStatus && (
                <div className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2.5 ${
                  testStatus.type === 'success' 
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' 
                    : 'bg-red-950/40 border-red-800 text-red-300'
                }`}>
                  {testStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
                  <span>{testStatus.text}</span>
                </div>
              )}

              <p className="text-[11px] text-slate-500">
                💡 Belum memiliki API Key? Dapatkan secara gratis di{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 font-bold hover:underline"
                >
                  Google AI Studio ↗
                </a>
              </p>
            </div>

            {/* MANDATORY WARNING NOTICE */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 flex items-start gap-3 text-xs text-amber-200">
              <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-300 block">
                  Ketentuan Wajib: Kunci API Harus Selalu Terisi
                </span>
                <span className="text-amber-200/90 text-[11px] leading-relaxed block">
                  Kunci API Google Gemini diperlukan untuk memastikan pembuatan soal berlangsung cepat, berstandar tinggi, dan terhindar dari error. <strong>Dilarang mengosongkan kolom ini</strong> agar generator soal tidak mengalami penurunan mutu atau gagal memproses materi.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUTH PAGES (LOGIN, REGISTER & FORGOT PASSWORD) */}
      {activeTab === 'auth_pages' && (
        <div className="space-y-8 animate-fade-in">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Kustomisasi Halaman Autentikasi (Split Screen Layout)
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Ubah galeri gambar banner showcase 3D, teks headline, dan deskripsi hero autentikasi secara dinamis.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/login"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                Pratinjau Login ↗
              </a>
              <a
                href="/register"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                Pratinjau Register ↗
              </a>
            </div>
          </div>

          {/* CARD PANDUAN & REKOMENDASI UKURAN GAMBAR SHOWCASE */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/20 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white flex flex-wrap items-center gap-2">
                  <span>Panduan & Rekomendasi Format Gambar Showcase Auth</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Mendukung Multi-Gambar & Slideshow Otomatis
                  </span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Gambar showcase akan tampil pada separuh layar halaman Login & Register. Jika Anda menambahkan lebih dari 1 gambar, sistem Examigo akan otomatis menjalankan slideshow bergantian dengan animasi transisi yang halus dan indikator titik interaktif.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Layout className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Rasio & Resolusi Terbaik</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">1:1 (Square) atau 4:5 (Portrait)</div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Disarankan <strong>1200 x 1200 px</strong> (Standar HD) atau <strong>1080 x 1350 px</strong> (Format Modern Vertikal).
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Format & Bobot Berkas</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">WebP, JPG, atau PNG</div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Maksimal <strong>2 MB</strong> (maks server 5 MB) per gambar agar halaman auth terbuka instan. Format WebP sangat disarankan.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Komposisi & Titik Fokus</div>
                  <div className="text-xs font-bold text-amber-300 mt-0.5">Fokus di Tengah (Center-Weighted)</div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Bagian atas memuat logo dan bagian bawah memuat teks hero, sehingga letakkan ilustrasi/mockup utama di tengah frame.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 1. LOGIN PAGE CUSTOMIZATION */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">1. Halaman Login</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Pengaturan gambar showcase dan form masuk</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthPages(prev => ({
                      ...prev,
                      login: {
                        ...prev.login,
                        imageUrl: '/images/auth/login-showcase.jpg',
                        images: ['/images/auth/login-showcase.jpg']
                      }
                    }));
                    showToast('Preset default showcase Login dipulihkan', 'success');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-emerald-400 font-bold transition-all flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Pakai Default
                </button>
              </div>

              {/* Multi-Image Showcase Management for Login */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Galeri Gambar Showcase Login ({authPages.login.images?.length || 1})</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {authPages.login.images && authPages.login.images.length > 1 ? 'Auto-Slideshow Aktif' : '1 Gambar Aktif'}
                  </span>
                </div>

                {/* Upload & Add Actions */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      uploadingLoginImg 
                        ? 'bg-slate-800 text-slate-400 cursor-not-allowed' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        disabled={uploadingLoginImg}
                        onChange={(e) => handleUploadAuthImage(e, 'login')}
                        className="hidden"
                      />
                      {uploadingLoginImg ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Mengunggah...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Ambil dari Komputer / HP</span>
                        </>
                      )}
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newLoginImgUrl}
                      onChange={(e) => setNewLoginImgUrl(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl('login'); } }}
                      placeholder="Atau tempel URL gambar (https://...)"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddImageUrl('login')}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah URL</span>
                    </button>
                  </div>
                </div>

                {/* Thumbnails Gallery */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {(authPages.login.images && authPages.login.images.length > 0 ? authPages.login.images : [authPages.login.imageUrl]).map((img, idx) => {
                    const isPrimary = authPages.login.imageUrl === img;
                    return (
                      <div
                        key={idx}
                        className={`relative group rounded-xl overflow-hidden border transition-all ${
                          isPrimary 
                            ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-950/20' 
                            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        }`}
                      >
                        <div className="aspect-square w-full relative overflow-hidden bg-slate-950">
                          <img
                            src={img}
                            alt={`Login Slide ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e: any) => { e.target.src = '/images/auth/login-showcase.jpg'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                          
                          {/* Primary Badge */}
                          {isPrimary && (
                            <span className="absolute top-2 left-2 text-[9px] font-black tracking-wide text-emerald-300 bg-emerald-950/90 border border-emerald-500/50 px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-xs">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Utama
                            </span>
                          )}

                          {/* Delete Button */}
                          <button
                            type="button"
                            title="Hapus gambar ini"
                            onClick={() => handleDeleteImage('login', img)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700/50 text-rose-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          {/* Bottom Action */}
                          <div className="absolute bottom-1.5 inset-x-1.5 flex justify-center">
                            {!isPrimary ? (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage('login', img)}
                                className="w-full text-center py-1 rounded-lg bg-slate-900/90 hover:bg-emerald-600 text-[10px] font-bold text-slate-200 hover:text-white transition-all backdrop-blur-xs"
                              >
                                Jadikan Utama
                              </button>
                            ) : (
                              <span className="text-[10px] font-semibold text-emerald-400">Slide Aktif Utama</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Judul Headline Showcase</label>
                <input
                  type="text"
                  value={authPages.login.headline}
                  onChange={(e) => setAuthPages(prev => ({
                    ...prev,
                    login: { ...prev.login, headline: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium outline-none focus:border-emerald-500"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Subtitle / Deskripsi</label>
                <textarea
                  rows={2}
                  value={authPages.login.subtitle}
                  onChange={(e) => setAuthPages(prev => ({
                    ...prev,
                    login: { ...prev.login, subtitle: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

            {/* 2. REGISTER PAGE CUSTOMIZATION */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">2. Halaman Register</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Pengaturan gambar showcase dan form pendaftaran</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthPages(prev => ({
                      ...prev,
                      register: {
                        ...prev.register,
                        imageUrl: '/images/auth/register-showcase.jpg',
                        images: ['/images/auth/register-showcase.jpg']
                      }
                    }));
                    showToast('Preset default showcase Register dipulihkan', 'success');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-indigo-400 font-bold transition-all flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Pakai Default
                </button>
              </div>

              {/* Multi-Image Showcase Management for Register */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Galeri Gambar Showcase Register ({authPages.register.images?.length || 1})</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {authPages.register.images && authPages.register.images.length > 1 ? 'Auto-Slideshow Aktif' : '1 Gambar Aktif'}
                  </span>
                </div>

                {/* Upload & Add Actions */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      uploadingRegisterImg 
                        ? 'bg-slate-800 text-slate-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        disabled={uploadingRegisterImg}
                        onChange={(e) => handleUploadAuthImage(e, 'register')}
                        className="hidden"
                      />
                      {uploadingRegisterImg ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Mengunggah...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Ambil dari Komputer / HP</span>
                        </>
                      )}
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newRegisterImgUrl}
                      onChange={(e) => setNewRegisterImgUrl(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl('register'); } }}
                      placeholder="Atau tempel URL gambar (https://...)"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddImageUrl('register')}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah URL</span>
                    </button>
                  </div>
                </div>

                {/* Thumbnails Gallery */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {(authPages.register.images && authPages.register.images.length > 0 ? authPages.register.images : [authPages.register.imageUrl]).map((img, idx) => {
                    const isPrimary = authPages.register.imageUrl === img;
                    return (
                      <div
                        key={idx}
                        className={`relative group rounded-xl overflow-hidden border transition-all ${
                          isPrimary 
                            ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-950/20' 
                            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        }`}
                      >
                        <div className="aspect-square w-full relative overflow-hidden bg-slate-950">
                          <img
                            src={img}
                            alt={`Register Slide ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e: any) => { e.target.src = '/images/auth/register-showcase.jpg'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                          
                          {/* Primary Badge */}
                          {isPrimary && (
                            <span className="absolute top-2 left-2 text-[9px] font-black tracking-wide text-indigo-300 bg-indigo-950/90 border border-indigo-500/50 px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-xs">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Utama
                            </span>
                          )}

                          {/* Delete Button */}
                          <button
                            type="button"
                            title="Hapus gambar ini"
                            onClick={() => handleDeleteImage('register', img)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700/50 text-rose-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          {/* Bottom Action */}
                          <div className="absolute bottom-1.5 inset-x-1.5 flex justify-center">
                            {!isPrimary ? (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage('register', img)}
                                className="w-full text-center py-1 rounded-lg bg-slate-900/90 hover:bg-indigo-600 text-[10px] font-bold text-slate-200 hover:text-white transition-all backdrop-blur-xs"
                              >
                                Jadikan Utama
                              </button>
                            ) : (
                              <span className="text-[10px] font-semibold text-indigo-400">Slide Aktif Utama</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Judul Headline Showcase</label>
                <input
                  type="text"
                  value={authPages.register.headline}
                  onChange={(e) => setAuthPages(prev => ({
                    ...prev,
                    register: { ...prev.register, headline: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium outline-none focus:border-indigo-500"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Subtitle / Deskripsi</label>
                <textarea
                  rows={2}
                  value={authPages.register.subtitle}
                  onChange={(e) => setAuthPages(prev => ({
                    ...prev,
                    register: { ...prev.register, subtitle: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* 3. FORGOT PASSWORD CONFIGURATION */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">3. Halaman Lupa Password</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Pengaturan teks pemulihan akun</p>
                </div>
              </div>
              <a
                href="/forgot-password"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>Pratinjau Lupa Password</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Judul Headline</label>
                <input
                  type="text"
                  value={authPages.forgotPassword.headline}
                  onChange={(e) => setAuthPages(prev => ({
                    ...prev,
                    forgotPassword: { ...prev.forgotPassword, headline: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Subtitle / Deskripsi</label>
                <input
                  type="text"
                  value={authPages.forgotPassword.subtitle}
                  onChange={(e) => setAuthPages(prev => ({
                    ...prev,
                    forgotPassword: { ...prev.forgotPassword, subtitle: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-400" />
                  Mode Pemeliharaan (Maintenance Mode)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Aktifkan untuk menampilkan halaman pemeliharaan kepada seluruh pengguna non-admin. Super Admin tetap dapat mengakses panel admin.
                </p>
              </div>

              <button
                type="button"
                disabled={togglingMaintenance}
                onClick={async () => {
                  setTogglingMaintenance(true);
                  try {
                    const res = await api('/admin/cms/maintenance', {
                      method: 'POST',
                      body: JSON.stringify({ enabled: !maintenance.enabled }),
                    });
                    const data = await res.json();
                    if (data.success && data.data) {
                      setMaintenance(prev => ({ ...prev, ...data.data }));
                      setSavedSnapshot(prev => {
                        if (!prev) return prev;
                        try {
                          const parsed = JSON.parse(prev);
                          parsed.maintenance = { ...parsed.maintenance, ...data.data };
                          return JSON.stringify(parsed);
                        } catch {
                          return prev;
                        }
                      });
                      showToast(`Mode pemeliharaan berhasil ${data.data.enabled ? 'DIAKTIFKAN' : 'DINONAKTIFKAN'}!`, 'success');
                    } else {
                      showToast(data.message || 'Gagal mengubah status.', 'error');
                    }
                  } catch {
                    showToast('Gagal menghubungi server.', 'error');
                  } finally {
                    setTogglingMaintenance(false);
                  }
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
                  maintenance.enabled
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-600 shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {togglingMaintenance ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : maintenance.enabled ? (
                  <><span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-900 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-700" /></span> AKTIF — Klik untuk Matikan</>
                ) : (
                  <><span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> NONAKTIF — Klik untuk Aktifkan</>
                )}
              </button>
            </div>

            {maintenance.enabled && (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 p-4 rounded-2xl flex items-center gap-3 text-xs font-medium">
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" /></span>
                Halaman pemeliharaan sedang ditampilkan kepada seluruh pengguna non-admin. Akses publik dan login guru dialihkan ke layar maintenance.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Judul Halaman Pemeliharaan</label>
                <input
                  type="text"
                  value={maintenance.title}
                  onChange={(e) => setMaintenance({ ...maintenance, title: e.target.value })}
                  placeholder="Sistem Sedang Dalam Pemeliharaan"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Estimasi Waktu Selesai (opsional)</label>
                <input
                  type="text"
                  value={maintenance.estimatedEndTime}
                  onChange={(e) => setMaintenance({ ...maintenance, estimatedEndTime: e.target.value })}
                  placeholder="Contoh: Sabtu, 6 September 2026, Pukul 10:00 WIB"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Pesan untuk Pengguna</label>
              <textarea
                rows={3}
                value={maintenance.message}
                onChange={(e) => setMaintenance({ ...maintenance, message: e.target.value })}
                placeholder="Kami sedang melakukan pemeliharaan..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Granular Feature-level Maintenance */}
            <div className="border-t border-slate-800 pt-6 space-y-4">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Pemeliharaan Parsial / Kontrol Tombol & Fitur Spesifik
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Nonaktifkan tombol atau fungsi tertentu tanpa harus mematikan seluruh situs web. Pengguna tetap dapat mengakses dashboard, namun aksi fitur yang dipelihara akan diblokir dengan peringatan ramah.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    key: 'payments' as const,
                    title: 'Layanan Pembayaran & Top-up',
                    desc: 'Menonaktifkan tombol checkout, pembayaran Midtrans, dan pembelian kuota addon.',
                    icon: CreditCard,
                  },
                  {
                    key: 'aiGeneration' as const,
                    title: 'Generator Soal Otomatis',
                    desc: 'Menonaktifkan peracikan soal otomatis dan ekstraksi dokumen materi.',
                    icon: Sparkles,
                  },
                  {
                    key: 'examCreation' as const,
                    title: 'Pembuatan Ujian Baru',
                    desc: 'Menonaktifkan tombol buat & publikasikan ujian baru di menu Exam Builder.',
                    icon: Layers,
                  },
                  {
                    key: 'studentExams' as const,
                    title: 'Pelaksanaan Ujian Siswa',
                    desc: 'Menonaktifkan siswa dari bergabung atau memulai sesi pengerjaan ujian baru.',
                    icon: GraduationCap,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isUnderMaintenance = Boolean(maintenance.features?.[item.key]);
                  return (
                    <div
                      key={item.key}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        isUnderMaintenance
                          ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl ${isUnderMaintenance ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-white">{item.title}</h5>
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5 ${
                              isUnderMaintenance ? 'bg-amber-500/30 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {isUnderMaintenance ? '⚠️ Sedang Pemeliharaan' : '● Berfungsi Normal'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={async () => {
                            const currentFeats = maintenance.features || { payments: false, aiGeneration: false, examCreation: false, studentExams: false };
                            const updatedFeats = {
                              ...currentFeats,
                              [item.key]: !currentFeats[item.key],
                            };
                            setMaintenance(prev => ({
                              ...prev,
                              features: updatedFeats,
                            }));
                            try {
                              const res = await api('/admin/cms/maintenance', {
                                method: 'POST',
                                body: JSON.stringify({
                                  ...maintenance,
                                  features: updatedFeats,
                                }),
                              });
                              const data = await res.json();
                              if (data.success) {
                                setSavedSnapshot(prev => {
                                  if (!prev) return prev;
                                  try {
                                    const parsed = JSON.parse(prev);
                                    parsed.maintenance = { ...parsed.maintenance, features: updatedFeats };
                                    return JSON.stringify(parsed);
                                  } catch {
                                    return prev;
                                  }
                                });
                                showToast(`${item.title}: ${updatedFeats[item.key] ? 'DINONAKTIFKAN (Pemeliharaan)' : 'DIAKTIFKAN (Normal)'}`, 'success');
                              }
                            } catch {
                              showToast('Gagal mengubah status fitur.', 'error');
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                            isUnderMaintenance
                              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {isUnderMaintenance ? 'Matikan Maint.' : 'Aktifkan Maint.'}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Floating Save Bar (Always reachable when dirty) */}
      {isDirty && (
        <div className="fixed bottom-6 inset-x-0 mx-auto w-fit max-w-[92vw] z-50 bg-slate-900/95 border border-amber-500/50 backdrop-blur-xl shadow-2xl shadow-black/80 px-5 py-3 rounded-2xl flex flex-wrap items-center gap-4 animate-fade-in ring-1 ring-amber-500/30">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
            <div className="text-left">
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Ada perubahan CMS yang belum disimpan!
              </p>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Simpan perubahan Anda atau gunakan tombol pintas <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px] text-amber-300 font-mono font-bold">Ctrl + S</kbd>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleDiscardChanges}
              disabled={saving}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Batalkan
            </button>
            <button
              type="button"
              onClick={handleSaveConfig}
              disabled={saving}
              style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
              className="px-5 py-2 rounded-xl text-white text-xs font-black shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition-all hover:opacity-95 active:scale-95 cursor-pointer disabled:opacity-50 ring-2 ring-emerald-400/40"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Simpan Sekarang
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
