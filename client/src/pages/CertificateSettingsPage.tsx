import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, useAuth } from '../lib/auth';
import { useToast } from '../components/Toast';
import { 
  CertificateConfig, 
  defaultCertificateConfig, 
  generateCertificatePdf,
  CERTIFICATE_THEMES,
  CERTIFICATE_FONTS,
  CERTIFICATE_BORDERS,
  ThemeDefinition,
  CertificateFontDefinition,
  CertificateBorderDefinition,
} from '../lib/certificateGenerator';
import { 
  Award, 
  Check, 
  RotateCcw, 
  Download, 
  Upload, 
  FileText, 
  Palette, 
  PenTool, 
  ShieldCheck, 
  Eye, 
  Building2, 
  Trash2,
  Sparkles,
  ExternalLink,
  QrCode,
  Lock,
  Stamp,
  Layers,
  Search,
  User,
  CheckCircle2,
  Edit3,
  Sliders,
  Wand2,
  ZoomIn,
  ZoomOut,
  Move,
  X,
  RefreshCw,
  Type,
  Maximize2,
} from 'lucide-react';

export default function CertificateSettingsPage() {
  const { user } = useAuth();
  const isPaidUser = user?.plan && user.plan !== 'FREE';
  const { showToast } = useToast();
  const [config, setConfig] = useState<CertificateConfig>(defaultCertificateConfig);
  const [activeTab, setActiveTab] = useState<'info' | 'signers' | 'theme' | 'security'>('theme');
  const [themeFilter, setThemeFilter] = useState<'all' | 'dark' | 'light' | 'academic' | 'modern'>('all');
  const [themeSearch, setThemeSearch] = useState('');
  const [fontFilter, setFontFilter] = useState<'all' | 'serif' | 'sans' | 'mono' | 'script'>('all');
  const [borderFilter, setBorderFilter] = useState<'all' | 'classic' | 'modern' | 'ornate' | 'minimal'>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloadingSample, setDownloadingSample] = useState(false);

  // Digital signature drawing modal & canvas state
  const [drawingSignerKey, setDrawingSignerKey] = useState<'signer1' | 'signer2' | null>(null);
  const [inkColor, setInkColor] = useState<string>('#0f172a');
  const signatureCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Sample student name for live preview
  const [previewStudentName, setPreviewStudentName] = useState('AHMAD FADHILAH, S.T.');
  const [previewExamTitle, setPreviewExamTitle] = useState('Evaluasi Akhir Semester - Simulasi');

  // Load existing settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api('/certificates/settings');
      const json = await res.json();
      if (json.success && json.data) {
        setConfig({ ...defaultCertificateConfig, ...json.data });
      }
    } catch (err) {
      console.error('Failed to load certificate settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api('/certificates/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Desain sertifikat berhasil disimpan!', 'success');
      } else {
        showToast(json.message || 'Gagal menyimpan pengaturan', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan saat menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Kembalikan seluruh desain sertifikat ke pengaturan default?')) {
      setConfig(defaultCertificateConfig);
      showToast('Desain dikembalikan ke default. Klik Simpan untuk memperbarui server.', 'info');
    }
  };

  const handleTestDownload = async () => {
    try {
      setDownloadingSample(true);
      await generateCertificatePdf(config, {
        studentName: previewStudentName,
        examTitle: previewExamTitle,
        examCode: 'EXM-DEMO-01',
        score: 95,
        passingScore: 75,
        completionDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        certificateId: `EXM-DEMO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      }, true);
      showToast('Sertifikat contoh berhasil diunduh!', 'success');
    } catch (err: any) {
      showToast('Gagal mengunduh contoh sertifikat: ' + err.message, 'error');
    } finally {
      setDownloadingSample(false);
    }
  };

  // Image Upload helper (converts file to base64)
  const handleImageUpload = (file: File, callback: (base64: string) => void) => {
    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drawing Canvas Handlers
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearDrawing = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const saveDrawing = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas || !drawingSignerKey) return;
    const dataUrl = canvas.toDataURL('image/png');
    setConfig(prev => ({
      ...prev,
      [drawingSignerKey]: {
        ...prev[drawingSignerKey],
        signatureUrl: dataUrl,
      }
    }));
    setDrawingSignerKey(null);
    showToast('Tanda tangan digital berhasil diterapkan!', 'success');
  };

  // Background transparency cleaner for uploaded paper signatures
  const makeSignatureTransparent = (signerKey: 'signer1' | 'signer2') => {
    const b64 = config[signerKey].signatureUrl;
    if (!b64) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i+1];
        const b = d[i+2];
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        if (luminance > 205) {
          d[i+3] = 0;
        } else if (luminance > 165) {
          d[i+3] = Math.round((205 - luminance) * 6.375);
        }
      }
      ctx.putImageData(imgData, 0, 0);
      const transparentB64 = canvas.toDataURL('image/png');
      setConfig(prev => ({
        ...prev,
        [signerKey]: {
          ...prev[signerKey],
          signatureUrl: transparentB64,
        }
      }));
      showToast('Latar belakang putih tanda tangan berhasil dibersihkan!', 'success');
    };
    img.src = b64;
  };

  const updateSignerProp = (signerKey: 'signer1' | 'signer2', key: 'scale' | 'yOffset' | 'xOffset' | 'colorMode', value: any) => {
    setConfig(prev => ({
      ...prev,
      [signerKey]: {
        ...prev[signerKey],
        [key]: value,
      }
    }));
  };

  const resetSignerAdjustment = (signerKey: 'signer1' | 'signer2') => {
    setConfig(prev => ({
      ...prev,
      [signerKey]: {
        ...prev[signerKey],
        scale: 1.0,
        yOffset: 0,
        xOffset: 0,
        colorMode: 'match_text',
      }
    }));
    showToast('Posisi, ukuran, dan warna tanda tangan telah direset!', 'info');
  };

  // Active theme, font, and border definitions
  const activeTheme: ThemeDefinition = CERTIFICATE_THEMES[config.theme] || CERTIFICATE_THEMES.emerald_gold;
  const activeFont: CertificateFontDefinition = CERTIFICATE_FONTS[config.fontFamily] || CERTIFICATE_FONTS.times;
  const activeBorder: CertificateBorderDefinition = CERTIFICATE_BORDERS[config.borderStyle] || CERTIFICATE_BORDERS.double_gold;

  const toRgb = (c: [number, number, number]) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

  // Font family css class helper
  const getFontFamilyClass = () => activeFont.cssFamily || 'font-serif';

  // Filtered themes list
  const themeList = Object.values(CERTIFICATE_THEMES);
  const filteredThemes = themeList.filter(t => {
    const matchesCategory = themeFilter === 'all' || t.category === themeFilter;
    const matchesSearch = !themeSearch || 
      t.name.toLowerCase().includes(themeSearch.toLowerCase()) || 
      t.desc.toLowerCase().includes(themeSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered fonts list (20 styles)
  const fontList = Object.values(CERTIFICATE_FONTS);
  const filteredFonts = fontList.filter(f => fontFilter === 'all' || f.category === fontFilter);

  // Filtered borders list (20 styles)
  const borderList = Object.values(CERTIFICATE_BORDERS);
  const filteredBorders = borderList.filter(b => borderFilter === 'all' || b.category === borderFilter);

  // Border frame container class generator for preview canvas
  const getBorderContainerClasses = () => {
    switch (config.borderStyle) {
      case 'diploma_traditional':
      case 'bold_executive':
        return 'border-4 p-1.5 sm:p-2';
      case 'classic_dashed':
        return 'border-2 border-dashed p-1 sm:p-1.5';
      case 'minimal_hairline':
        return 'border p-2 sm:p-3';
      case 'floating_border':
        return 'border-0 p-1.5 sm:p-2';
      default:
        return 'border-2 p-1 sm:p-1.5';
    }
  };

  const getInnerFrameClasses = () => {
    switch (config.borderStyle) {
      case 'minimal_hairline':
        return 'border-0 p-3 sm:p-5';
      case 'classic_dashed':
        return 'border border-solid p-3 sm:p-5';
      default:
        return 'border p-3 sm:p-5';
    }
  };

  // Border accents renderer for live preview
  const renderBorderAccents = () => {
    const borderInnerRgb = toRgb(activeTheme.borderInner);
    const borderOuterRgb = toRgb(activeTheme.borderOuter);

    switch (config.borderStyle) {
      case 'double_gold':
        return (
          <>
            <span className="absolute top-1 left-1 w-2 h-2" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute top-1 right-1 w-2 h-2" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute bottom-1 left-1 w-2 h-2" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute bottom-1 right-1 w-2 h-2" style={{ backgroundColor: borderInnerRgb }} />
          </>
        );

      case 'modern_clean':
        return (
          <>
            <span className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2" style={{ borderColor: borderInnerRgb }} />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2" style={{ borderColor: borderInnerRgb }} />
            <span className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2" style={{ borderColor: borderInnerRgb }} />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2" style={{ borderColor: borderInnerRgb }} />
          </>
        );

      case 'diamond_corners':
        return (
          <>
            <span className="absolute top-1 left-1 w-2.5 h-2.5 rotate-45" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rotate-45" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute bottom-1 left-1 w-2.5 h-2.5 rotate-45" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rotate-45" style={{ backgroundColor: borderInnerRgb }} />
          </>
        );

      case 'corner_dots':
        return (
          <>
            <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: borderInnerRgb }} />
          </>
        );

      case 'tech_bracket':
        return (
          <>
            <div className="absolute top-0.5 left-0.5 w-5 h-5 border-t-2 border-l-2 flex flex-col justify-between" style={{ borderColor: borderInnerRgb }}>
              <span className="w-1.5 h-1.5 block" style={{ backgroundColor: borderInnerRgb }} />
            </div>
            <div className="absolute top-0.5 right-0.5 w-5 h-5 border-t-2 border-r-2 flex flex-col justify-between items-end" style={{ borderColor: borderInnerRgb }}>
              <span className="w-1.5 h-1.5 block" style={{ backgroundColor: borderInnerRgb }} />
            </div>
            <div className="absolute bottom-0.5 left-0.5 w-5 h-5 border-b-2 border-l-2 flex flex-col justify-end" style={{ borderColor: borderInnerRgb }}>
              <span className="w-1.5 h-1.5 block" style={{ backgroundColor: borderInnerRgb }} />
            </div>
            <div className="absolute bottom-0.5 right-0.5 w-5 h-5 border-b-2 border-r-2 flex flex-col justify-end items-end" style={{ borderColor: borderInnerRgb }}>
              <span className="w-1.5 h-1.5 block" style={{ backgroundColor: borderInnerRgb }} />
            </div>
          </>
        );

      case 'ornate':
        return (
          <>
            <svg className="absolute top-1 left-1 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={borderInnerRgb} strokeWidth="1.5">
              <path d="M3 3h8a4 4 0 0 1 4 4v8M3 3v8a4 4 0 0 0 4 4h8" />
              <circle cx="6" cy="6" r="1.5" fill={borderInnerRgb} />
            </svg>
            <svg className="absolute top-1 right-1 w-6 h-6 transform scale-x-[-1]" viewBox="0 0 24 24" fill="none" stroke={borderInnerRgb} strokeWidth="1.5">
              <path d="M3 3h8a4 4 0 0 1 4 4v8M3 3v8a4 4 0 0 0 4 4h8" />
              <circle cx="6" cy="6" r="1.5" fill={borderInnerRgb} />
            </svg>
            <svg className="absolute bottom-1 left-1 w-6 h-6 transform scale-y-[-1]" viewBox="0 0 24 24" fill="none" stroke={borderInnerRgb} strokeWidth="1.5">
              <path d="M3 3h8a4 4 0 0 1 4 4v8M3 3v8a4 4 0 0 0 4 4h8" />
              <circle cx="6" cy="6" r="1.5" fill={borderInnerRgb} />
            </svg>
            <svg className="absolute bottom-1 right-1 w-6 h-6 transform scale-[-1]" viewBox="0 0 24 24" fill="none" stroke={borderInnerRgb} strokeWidth="1.5">
              <path d="M3 3h8a4 4 0 0 1 4 4v8M3 3v8a4 4 0 0 0 4 4h8" />
              <circle cx="6" cy="6" r="1.5" fill={borderInnerRgb} />
            </svg>
          </>
        );

      case 'royal_crest':
        return (
          <>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 bg-inherit flex items-center justify-center">
              <Award className="w-5 h-5" style={{ color: borderInnerRgb }} />
            </div>
            <span className="absolute top-1 left-1 w-2 h-2 rotate-45" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute top-1 right-1 w-2 h-2 rotate-45" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute bottom-1 left-1 w-2 h-2 rotate-45" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute bottom-1 right-1 w-2 h-2 rotate-45" style={{ backgroundColor: borderInnerRgb }} />
          </>
        );

      case 'geometric_art_deco':
        return (
          <>
            <svg className="absolute top-0 left-0 w-7 h-7" viewBox="0 0 30 30" fill="none" stroke={borderInnerRgb} strokeWidth="1.2">
              <polygon points="2,2 26,2 2,26" strokeDasharray="2,2" />
              <line x1="2" y1="10" x2="10" y2="2" strokeWidth="1.5" />
              <line x1="2" y1="18" x2="18" y2="2" strokeWidth="1.5" />
            </svg>
            <svg className="absolute top-0 right-0 w-7 h-7 transform scale-x-[-1]" viewBox="0 0 30 30" fill="none" stroke={borderInnerRgb} strokeWidth="1.2">
              <polygon points="2,2 26,2 2,26" strokeDasharray="2,2" />
              <line x1="2" y1="10" x2="10" y2="2" strokeWidth="1.5" />
              <line x1="2" y1="18" x2="18" y2="2" strokeWidth="1.5" />
            </svg>
            <svg className="absolute bottom-0 left-0 w-7 h-7 transform scale-y-[-1]" viewBox="0 0 30 30" fill="none" stroke={borderInnerRgb} strokeWidth="1.2">
              <polygon points="2,2 26,2 2,26" strokeDasharray="2,2" />
              <line x1="2" y1="10" x2="10" y2="2" strokeWidth="1.5" />
              <line x1="2" y1="18" x2="18" y2="2" strokeWidth="1.5" />
            </svg>
            <svg className="absolute bottom-0 right-0 w-7 h-7 transform scale-[-1]" viewBox="0 0 30 30" fill="none" stroke={borderInnerRgb} strokeWidth="1.2">
              <polygon points="2,2 26,2 2,26" strokeDasharray="2,2" />
              <line x1="2" y1="10" x2="10" y2="2" strokeWidth="1.5" />
              <line x1="2" y1="18" x2="18" y2="2" strokeWidth="1.5" />
            </svg>
          </>
        );

      case 'islamic_geometric':
        return (
          <>
            {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map((pos, i) => (
              <svg key={i} className={`absolute ${pos} w-4 h-4`} viewBox="0 0 24 24" fill={borderInnerRgb}>
                <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" opacity="0.9" />
              </svg>
            ))}
          </>
        );

      case 'academic_laurel':
        return (
          <>
            <svg className="absolute top-1 left-1 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={borderInnerRgb} strokeWidth="1.3">
              <path d="M4 18c2-4 6-8 12-10M4 14c3-1 7-1 9 2M8 20c1-3 3-5 7-5" />
            </svg>
            <svg className="absolute top-1 right-1 w-6 h-6 transform scale-x-[-1]" viewBox="0 0 24 24" fill="none" stroke={borderInnerRgb} strokeWidth="1.3">
              <path d="M4 18c2-4 6-8 12-10M4 14c3-1 7-1 9 2M8 20c1-3 3-5 7-5" />
            </svg>
            <svg className="absolute bottom-1 left-1 w-6 h-6 transform scale-y-[-1]" viewBox="0 0 24 24" fill="none" stroke={borderInnerRgb} strokeWidth="1.3">
              <path d="M4 18c2-4 6-8 12-10M4 14c3-1 7-1 9 2M8 20c1-3 3-5 7-5" />
            </svg>
            <svg className="absolute bottom-1 right-1 w-6 h-6 transform scale-[-1]" viewBox="0 0 24 24" fill="none" stroke={borderInnerRgb} strokeWidth="1.3">
              <path d="M4 18c2-4 6-8 12-10M4 14c3-1 7-1 9 2M8 20c1-3 3-5 7-5" />
            </svg>
          </>
        );

      case 'triple_line':
        return (
          <div className="absolute inset-1 border pointer-events-none" style={{ borderColor: borderInnerRgb, opacity: 0.4 }} />
        );

      case 'arch_header':
        return (
          <div className="absolute top-0 left-1/4 right-1/4 h-2 border-b-2 rounded-b-full pointer-events-none" style={{ borderColor: borderInnerRgb }} />
        );

      case 'modern_gradient':
        return (
          <>
            <span className="absolute top-0 left-0 w-8 h-1" style={{ backgroundColor: borderOuterRgb }} />
            <span className="absolute top-0 left-0 w-1 h-8" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute top-0 right-0 w-8 h-1" style={{ backgroundColor: borderOuterRgb }} />
            <span className="absolute top-0 right-0 w-1 h-8" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute bottom-0 left-0 w-8 h-1" style={{ backgroundColor: borderOuterRgb }} />
            <span className="absolute bottom-0 left-0 w-1 h-8" style={{ backgroundColor: borderInnerRgb }} />
            <span className="absolute bottom-0 right-0 w-8 h-1" style={{ backgroundColor: borderOuterRgb }} />
            <span className="absolute bottom-0 right-0 w-1 h-8" style={{ backgroundColor: borderInnerRgb }} />
          </>
        );

      default:
        return null;
    }
  };

  // Wireframe preview helper for Border Card catalog
  const renderBorderCardWireframe = (borderId: string) => {
    switch (borderId) {
      case 'double_gold':
        return (
          <div className="w-full h-8 border-2 border-slate-700 p-0.5 relative rounded-xs bg-slate-900/5">
            <div className="w-full h-full border border-amber-600" />
            <span className="absolute top-0.5 left-0.5 w-1 h-1 bg-amber-600" />
            <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-amber-600" />
            <span className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-amber-600" />
            <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-amber-600" />
          </div>
        );
      case 'modern_clean':
        return (
          <div className="w-full h-8 border border-slate-700 p-0.5 relative rounded-xs bg-slate-900/5">
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-600" />
            <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-600" />
            <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-600" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-600" />
          </div>
        );
      case 'tech_bracket':
        return (
          <div className="w-full h-8 relative rounded-xs bg-slate-900/5 border border-slate-300">
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-600" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-600" />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-600" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-600" />
          </div>
        );
      case 'classic_dashed':
        return (
          <div className="w-full h-8 border-2 border-dashed border-slate-700 p-0.5 relative rounded-xs bg-slate-900/5">
            <div className="w-full h-full border border-solid border-slate-400" />
          </div>
        );
      case 'diamond_corners':
        return (
          <div className="w-full h-8 border border-slate-700 p-0.5 relative rounded-xs bg-slate-900/5">
            <div className="w-full h-full border border-amber-600" />
            <span className="absolute top-0.5 left-0.5 w-1 h-1 bg-amber-600 rotate-45" />
            <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-amber-600 rotate-45" />
            <span className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-amber-600 rotate-45" />
            <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-amber-600 rotate-45" />
          </div>
        );
      case 'triple_line':
        return (
          <div className="w-full h-8 border-2 border-slate-700 p-[1px] relative rounded-xs bg-slate-900/5">
            <div className="w-full h-full border border-slate-400 p-[1px]">
              <div className="w-full h-full border border-amber-600" />
            </div>
          </div>
        );
      case 'diploma_traditional':
      case 'bold_executive':
        return (
          <div className="w-full h-8 border-4 border-slate-800 p-0.5 relative rounded-xs bg-slate-900/5">
            <div className="w-full h-full border border-slate-400" />
          </div>
        );
      case 'minimal_hairline':
        return (
          <div className="w-full h-8 border border-slate-400 p-1 relative rounded-xs bg-slate-900/5" />
        );
      default:
        return (
          <div className="w-full h-8 border-2 border-slate-700 p-0.5 relative rounded-xs bg-slate-900/5">
            <div className="w-full h-full border border-amber-500/80" />
            <span className="absolute top-0.5 left-0.5 w-1 h-1 bg-amber-500 rounded-full" />
            <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-amber-500 rounded-full" />
            <span className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-amber-500 rounded-full" />
            <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-amber-500 rounded-full" />
          </div>
        );
    }
  };

  // Dedicated preview wireframe for default Examigo certificate
  const renderLiveCertificateWireframe = () => {
    return (
      <div 
        className={`w-full aspect-[297/210] rounded-2xl shadow-xl overflow-hidden relative border select-none transition-all duration-300 ring-1 ring-slate-900/5 ${getFontFamilyClass()}`}
        style={{
          backgroundColor: toRgb(activeTheme.bg),
          borderColor: toRgb(activeTheme.borderOuter)
        }}
      >
        {/* Inner Padding & Dynamic Border Frame */}
        <div className="w-full h-full p-3 sm:p-5 lg:p-6 flex flex-col justify-between relative z-10">
          <div 
            className={`w-full h-full relative flex flex-col justify-between transition-all duration-300 ${getBorderContainerClasses()}`}
            style={{ borderColor: toRgb(activeTheme.borderOuter) }}
          >
            <div 
              className={`w-full h-full relative flex flex-col justify-between transition-all duration-300 ${getInnerFrameClasses()}`}
              style={{ borderColor: toRgb(activeTheme.borderInner) }}
            >
              {renderBorderAccents()}

              {/* Top Header */}
              <div className="text-center space-y-0.5 sm:space-y-1">
                <p 
                  className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest"
                  style={{ color: toRgb(activeTheme.brandText) }}
                >
                  EXAMIGO EXAMINATION SYSTEM
                </p>
                <h3 
                  className="text-base sm:text-2xl lg:text-3xl font-black uppercase tracking-wider"
                  style={{ color: toRgb(activeTheme.titleText) }}
                >
                  SERTIFIKAT KELULUSAN
                </h3>
                <p 
                  className="text-[8px] sm:text-xs font-medium"
                  style={{ color: toRgb(activeTheme.subtitleText) }}
                >
                  Dengan ini menerangkan bahwa peserta ujian:
                </p>
              </div>

              {/* Student Centerpiece */}
              <div className="text-center my-auto py-1">
                <h2 
                  className="text-sm sm:text-xl lg:text-2xl font-black uppercase tracking-wider"
                  style={{ color: toRgb(activeTheme.nameText) }}
                >
                  AHMAD FADHILAH, S.T.
                </h2>
                <div 
                  className="w-24 sm:w-48 h-[1.5px] mx-auto mt-1 opacity-70"
                  style={{ backgroundColor: toRgb(activeTheme.accentLine) }}
                />
                
                <p 
                  className="text-[8px] sm:text-xs font-medium mt-1.5"
                  style={{ color: toRgb(activeTheme.subtitleText) }}
                >
                  Telah menyelesaikan rangkaian evaluasi dan dinyatakan LULUS dalam ujian:
                </p>
                <p 
                  className="text-xs sm:text-base font-bold mt-0.5"
                  style={{ color: toRgb(activeTheme.examTitleText) }}
                >
                  Evaluasi Akhir Semester - Simulasi
                </p>

                {/* Metadata Badges */}
                <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                  <span 
                    className="text-[7px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold"
                    style={{
                      backgroundColor: activeTheme.badgeBgHex,
                      color: activeTheme.badgeTextHex,
                    }}
                  >
                    Kode: EXM-DEMO-01
                  </span>
                  <span 
                    className="text-[7px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold"
                    style={{
                      backgroundColor: activeTheme.badgeBgHex,
                      color: activeTheme.badgeTextHex,
                    }}
                  >
                    Nilai: 95
                  </span>
                  <span 
                    className="text-[7px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold"
                    style={{
                      backgroundColor: activeTheme.badgeBgHex,
                      color: activeTheme.badgeTextHex,
                    }}
                  >
                    KKM: 75
                  </span>
                  <span 
                    className="text-[7px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold"
                    style={{
                      backgroundColor: activeTheme.badgeBgHex,
                      color: activeTheme.badgeTextHex,
                    }}
                  >
                    {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Bottom Signers & Security Footers */}
              <div className="flex items-end justify-between px-2 sm:px-6 pt-2 pb-1 text-center">
                <div className="w-24 sm:w-36 space-y-0.5">
                  <div className="h-6 sm:h-9 flex items-center justify-center">
                    <span className="font-serif italic text-xs sm:text-sm" style={{ color: toRgb(activeTheme.metaText) }}>
                      Examigo Board
                    </span>
                  </div>
                  <div className="border-t border-slate-400/80 pt-0.5">
                    <p className="text-[8px] sm:text-[10px] font-black" style={{ color: toRgb(activeTheme.metaText) }}>
                      Direktur Akademik
                    </p>
                    <p className="text-[7px] sm:text-[8px]" style={{ color: toRgb(activeTheme.subtitleText) }}>
                      Examigo Certification Board
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <QrCode className="w-7 h-7 sm:w-9 sm:h-9 opacity-80" style={{ color: toRgb(activeTheme.accentLine) }} />
                  <span className="text-[6px] sm:text-[7px] font-mono tracking-tighter uppercase font-bold text-slate-500">
                    EXM-DEMO-01
                  </span>
                </div>

                <div className="w-24 sm:w-36 space-y-0.5">
                  <div className="h-6 sm:h-9 flex items-center justify-center">
                    <span className="font-serif italic text-xs sm:text-sm" style={{ color: toRgb(activeTheme.metaText) }}>
                      Penguji Ujian
                    </span>
                  </div>
                  <div className="border-t border-slate-400/80 pt-0.5">
                    <p className="text-[8px] sm:text-[10px] font-black" style={{ color: toRgb(activeTheme.metaText) }}>
                      Koordinator Ujian
                    </p>
                    <p className="text-[7px] sm:text-[8px]" style={{ color: toRgb(activeTheme.subtitleText) }}>
                      Penyelenggara Evaluasi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Memuat konfigurasi sertifikat...</p>
      </div>
    );
  }

  if (!isPaidUser) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in-fast pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Sertifikat Kelulusan Peserta
                </h1>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Paket Free (Sertifikat Default)
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pengguna paket Free mendapatkan template sertifikat resmi default dari Examigo secara otomatis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/subscription"
              style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
              className="px-4 py-2 rounded-xl text-white font-black text-xs shadow-sm hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300 fill-current" /> Upgrade ke Pro
            </Link>
          </div>
        </div>

        {/* Free Plan Information Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white border border-emerald-200/80 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Sertifikat Resmi Otomatis Aktif
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Siswa Anda Tetap Otomatis Menerima Sertifikat Kelulusan! 🎓
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Pada paket <strong>Free</strong>, seluruh siswa yang berhasil lulus ujian Anda otomatis berhak mengunduh <strong>Sertifikat Kelulusan Resmi Default Examigo</strong> dalam format PDF beresolusi tinggi, lengkap dengan skor nilai kelulusan dan QR Code verifikasi keaslian.
              </p>
              <p className="text-xs text-slate-500 font-semibold pt-1">
                ⭐ <em>Ingin menggunakan logo sekolah sendiri, nama lembaga kustom, 70+ tema eksklusif, dan tanda tangan digital pengajar? Beli atau upgrade ke paket Personal / Pro.</em>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={handleTestDownload}
                disabled={downloadingSample}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-extrabold text-xs shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>{downloadingSample ? 'Mengunduh...' : 'Unduh Contoh Sertifikat Default'}</span>
              </button>
              <Link
                to="/subscription"
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Beli Paket Personal / Pro</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Preview of Default Certificate */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" /> Tinjauan Sertifikat Default Examigo
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Format resmi ini yang akan diterima dan dicetak oleh siswa Anda saat lulus ujian.
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
              Examigo Emerald Gold Official Theme
            </span>
          </div>

          <div className="flex justify-center p-4 bg-slate-100/70 rounded-2xl border border-slate-200/60 overflow-hidden">
            <div className="w-full max-w-2xl transform scale-95 sm:scale-100 transition-transform">
              {renderLiveCertificateWireframe()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-fade-in-fast">
      {/* 1. Header & Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Desain & Kustomisasi Sertifikat
              </h1>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                70 Tema Premium
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Pilih dari 70 gaya tema warna, tipografi font, pola watermark logo sekolah, serta verifikasi keaslian digital.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0 whitespace-nowrap"
            title="Reset ke pengaturan awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={() => window.open('/verify/EXM-DEMO-01', '_blank')}
            className="h-9 px-3.5 rounded-xl bg-indigo-50/90 border border-indigo-200/80 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0 whitespace-nowrap"
            title="Buka halaman verifikasi keaslian publik"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Cek Keaslian</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </button>

          <button
            type="button"
            onClick={handleTestDownload}
            disabled={downloadingSample}
            className="h-9 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50 shrink-0 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>{downloadingSample ? 'Membuat...' : 'Uji Unduh PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 hover:shadow-md cursor-pointer disabled:opacity-50 shrink-0 whitespace-nowrap"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main 2-Column Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Settings Form & Tabs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-extrabold ${
                activeTab === 'theme'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">70 Tema</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-extrabold ${
                activeTab === 'security'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">Keamanan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-extrabold ${
                activeTab === 'info'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">Teks</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('signers')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-extrabold ${
                activeTab === 'signers'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">TTD & Logo</span>
            </button>
          </div>

          {/* Form Tab 1: 70 Tema & Tipografi */}
          {activeTab === 'theme' && (
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 animate-fade-in-fast">
              {/* Theme Category Filter & Search */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Katalog Gaya & Warna</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Pilih dari 70 preset palet resmi</p>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    {filteredThemes.length} / {themeList.length} Tema
                  </span>
                </div>

                {/* Quick Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={themeSearch}
                    onChange={(e) => setThemeSearch(e.target.value)}
                    placeholder="Cari tema... (misal: Emas, Rose, Sapphire, Navy, Mint)"
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  />
                  {themeSearch && (
                    <button
                      type="button"
                      onClick={() => setThemeSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl overflow-x-auto text-[11px] font-bold">
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'dark', label: 'Gelap Mewah' },
                    { id: 'light', label: 'Terang Elegan' },
                    { id: 'academic', label: 'Akademik' },
                    { id: 'modern', label: 'Modern' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setThemeFilter(cat.id as any)}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        themeFilter === cat.id
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* 70 Themes Grid with Scroll */}
                <div className="grid grid-cols-2 gap-2 max-h-[350px] overflow-y-auto pr-1">
                  {filteredThemes.map((t) => {
                    const isSelected = config.theme === t.id || 
                      (config.theme === 'emerald' && t.id === 'emerald_gold') ||
                      (config.theme === 'navy' && t.id === 'royal_navy') ||
                      (config.theme === 'classic' && t.id === 'academic_classic') ||
                      (config.theme === 'crimson' && t.id === 'crimson_luxury');

                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setConfig({ ...config, theme: t.id })}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 relative ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-lg border-2 shrink-0 shadow-2xs flex items-center justify-center"
                          style={{
                            backgroundColor: toRgb(t.bg),
                            borderColor: toRgb(t.borderInner)
                          }}
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full" 
                            style={{ backgroundColor: toRgb(t.nameText) }} 
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-black text-slate-900 truncate">{t.name}</p>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium truncate">{t.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Family Selection (20 Styles) */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-emerald-600" />
                      Tipografi & Font Sertifikat (20 Pilihan Gaya)
                    </label>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Pilih karakteristik tulisan yang sesuai dengan level piagam atau diploma
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
                    Aktif: {activeFont.name}
                  </span>
                </div>

                {/* Font Category Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
                  {[
                    { id: 'all', label: 'Semua (20)' },
                    { id: 'serif', label: 'Serif / Klasik (8)' },
                    { id: 'sans', label: 'Sans / Modern (7)' },
                    { id: 'mono', label: 'Monospace (2)' },
                    { id: 'script', label: 'Script / Kaligrafi (3)' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFontFilter(tab.id as any)}
                      className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                        fontFilter === tab.id
                          ? 'bg-slate-900 text-white shadow-2xs font-extrabold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Font Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto p-1 pr-1.5 scrollbar-thin">
                  {filteredFonts.map((f) => {
                    const isSelected = config.fontFamily === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setConfig({ ...config, fontFamily: f.id as any })}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 relative ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20 shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className={`text-xl font-bold leading-none ${f.cssFamily}`}>
                            {f.preview}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-[11px] font-black truncate">{f.name}</p>
                          </div>
                          <p className="text-[9px] text-slate-500 font-medium leading-tight truncate">{f.desc}</p>
                        </div>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase self-start">
                          {f.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Border Frame Style (20 Styles) */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                      Gaya Bingkai & Lis Sertifikat (20 Pilihan Gaya)
                    </label>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Pola border frame tepi dokumen dari klasik hingga cyber tech
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
                    Aktif: {activeBorder.name}
                  </span>
                </div>

                {/* Border Category Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
                  {[
                    { id: 'all', label: 'Semua (20)' },
                    { id: 'classic', label: 'Klasik (8)' },
                    { id: 'modern', label: 'Modern (4)' },
                    { id: 'ornate', label: 'Ornate / Mewah (5)' },
                    { id: 'minimal', label: 'Minimalis (3)' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setBorderFilter(tab.id as any)}
                      className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                        borderFilter === tab.id
                          ? 'bg-slate-900 text-white shadow-2xs font-extrabold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Border Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto p-1 pr-1.5 scrollbar-thin">
                  {filteredBorders.map((b) => {
                    const isSelected = config.borderStyle === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setConfig({ ...config, borderStyle: b.id as any })}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 relative ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20 shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        {renderBorderCardWireframe(b.id)}
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-[11px] font-black truncate">{b.name}</p>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-[9px] text-slate-500 font-medium leading-tight truncate">{b.desc}</p>
                        </div>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase self-start">
                          {b.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Form Tab 2: Keamanan, Watermark, & Cek Keaslian */}
          {activeTab === 'security' && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-fade-in-fast">
              {/* Background Watermark Selector */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 block">
                  Pola Watermark / Background Pengaman
                </label>
                <p className="text-[11px] text-slate-500">
                  Gunakan watermark logo sekolah di latar belakang sertifikat atau segel pengaman anti-pemalsuan.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { id: 'center_logo', label: 'Watermark Logo Sekolah', desc: 'Logo transparan di tengah' },
                    { id: 'security_seal', label: 'Segel Keamanan Emas', desc: 'Emblem seal resmi terverifikasi' },
                    { id: 'guilloche_frame', label: 'Pola Guilloche', desc: 'Gelombang halus anti-pemalsuan' },
                    { id: 'none', label: 'Tanpa Watermark', desc: 'Latar belakang bersih minimalis' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setConfig({ ...config, watermarkStyle: w.id as any })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        config.watermarkStyle === w.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-xs font-black">{w.label}</p>
                      <p className="text-[10px] text-slate-500 leading-tight">{w.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Master Toggle: Enable / Disable Certificate */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" /> Penerbitan Sertifikat Kelulusan
                    </p>
                    <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed font-medium">
                      {config.enableCertificate
                        ? 'Aktif: Siswa yang memenuhi KKM langsung mendapatkan tombol unduh sertifikat.'
                        : 'Nonaktif: Sertifikat tidak diterbitkan setelah ujian selesai.'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableCertificate}
                    onChange={(e) => setConfig({ ...config, enableCertificate: e.target.checked })}
                    className="w-5 h-5 text-emerald-600 rounded-md focus:ring-emerald-500 cursor-pointer shrink-0 ml-3"
                  />
                </label>
              </div>

              {/* Authenticity Verification Hub Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-2.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <p className="text-xs font-black">Cek Keaslian Sertifikat Publik</p>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Setiap sertifikat dilengkapi QR Code dan Nomor Seri unik terenkripsi. Siapa pun dapat memindai atau membuka portal verifikasi untuk membuktikan keasliannya.
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.open('/verify/EXM-DEMO-01', '_blank')}
                    className="px-3 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-[11px] font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>Uji Halaman Cek Keaslian</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] text-indigo-300 font-mono">Kode: EXM-DEMO-01</span>
                </div>
              </div>

              {/* Visibility Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-extrabold text-slate-700 block">
                  Elemen yang Ditampilkan di Sertifikat
                </label>

                {[
                  { key: 'showQrCode', label: 'QR Code Verifikasi Keaslian' },
                  { key: 'showCertificateId', label: 'Nomor Seri / ID Sertifikat' },
                  { key: 'showScore', label: 'Nilai Akhir Siswa' },
                  { key: 'showPassingScore', label: 'KKM / Nilai Kelulusan' },
                  { key: 'showDate', label: 'Tanggal Penyelesaian' },
                ].map((toggle) => (
                  <label key={toggle.key} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <span className="text-xs font-semibold text-slate-700">{toggle.label}</span>
                    <input
                      type="checkbox"
                      checked={(config as any)[toggle.key]}
                      onChange={(e) => setConfig({ ...config, [toggle.key]: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Form Tab 3: Institusi & Teks */}
          {activeTab === 'info' && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 animate-fade-in-fast">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                  Nama Institusi / Sekolah / Lembaga
                </label>
                <input
                  type="text"
                  value={config.institutionName}
                  onChange={(e) => setConfig({ ...config, institutionName: e.target.value })}
                  placeholder="Contoh: SMA Negeri 1 Jakarta / Examigo Academy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                  Judul Utama Sertifikat
                </label>
                <input
                  type="text"
                  value={config.certificateTitle}
                  onChange={(e) => setConfig({ ...config, certificateTitle: e.target.value })}
                  placeholder="Contoh: SERTIFIKAT KELULUSAN / CERTIFICATE OF EXCELLENCE"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                  Sub-judul Pengantar Peserta
                </label>
                <input
                  type="text"
                  value={config.subtitle}
                  onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                  placeholder="Contoh: Dengan ini menerangkan bahwa peserta ujian:"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                  Keterangan Kelulusan
                </label>
                <textarea
                  rows={2}
                  value={config.completionText}
                  onChange={(e) => setConfig({ ...config, completionText: e.target.value })}
                  placeholder="Contoh: Telah menyelesaikan rangkaian evaluasi dan dinyatakan LULUS dalam ujian:"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                  Catatan Kaki / Validasi Resmi
                </label>
                <input
                  type="text"
                  value={config.customNotes || ''}
                  onChange={(e) => setConfig({ ...config, customNotes: e.target.value })}
                  placeholder="Contoh: Sertifikat ini sah dan diterbitkan secara digital oleh sistem Examigo."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Form Tab 4: Tanda Tangan & Logo */}
          {activeTab === 'signers' && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-fade-in-fast">
              {/* Logo Upload */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <label className="text-xs font-extrabold text-slate-700 block">
                  Logo Lembaga / Sekolah (Header & Watermark)
                </label>
                <div className="flex items-center gap-3">
                  {config.logoUrl ? (
                    <div className="relative w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-1 group">
                      <img src={config.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setConfig({ ...config, logoUrl: null })}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] shadow-sm hover:bg-red-700 cursor-pointer"
                        title="Hapus logo"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                      <Building2 className="w-6 h-6" />
                    </div>
                  )}

                  <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{config.logoUrl ? 'Ganti Logo' : 'Unggah Logo PNG/JPG'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, (b64) => setConfig({ ...config, logoUrl: b64 }));
                      }}
                    />
                  </label>
                </div>
                <p className="text-[10px] text-slate-400">
                  Otomatis digunakan juga pada pola watermark background saat opsi Watermark Logo diaktifkan.
                </p>
              </div>

              {/* Signers 1 & 2 Config Cards with Scale, Offset, and Drawing Controls */}
              {[
                { key: 'signer1' as const, label: 'Penandatangan 1 (Sisi Kiri)', signer: config.signer1 },
                { key: 'signer2' as const, label: 'Penandatangan 2 (Sisi Kanan)', signer: config.signer2 },
              ].map(({ key, label, signer }) => (
                <div key={key} className="space-y-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      <PenTool className="w-3.5 h-3.5 text-emerald-600" /> {label}
                    </p>
                    {signer.signatureUrl && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        TTD Terpasang ({Math.round((signer.scale ?? 1.0) * 100)}%)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        value={signer.name}
                        onChange={(e) => setConfig({
                          ...config,
                          [key]: { ...signer, name: e.target.value }
                        })}
                        placeholder="Contoh: Dr. H. Mulyono, M.Pd"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Jabatan / Posisi</label>
                      <input
                        type="text"
                        value={signer.title}
                        onChange={(e) => setConfig({
                          ...config,
                          [key]: { ...signer, title: e.target.value }
                        })}
                        placeholder="Contoh: Kepala Sekolah / Direktur"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Signature Media & Actions */}
                  <div className="pt-1 space-y-2.5 border-t border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">Berkas Tanda Tangan:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setDrawingSignerKey(key);
                            setHasDrawn(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{signer.signatureUrl ? 'Gambar Ulang' : 'Gambar TTD'}</span>
                        </button>

                        <label className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs">
                          <Upload className="w-3 h-3" />
                          <span>{signer.signatureUrl ? 'Ganti File' : 'Upload File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, (b64) => setConfig({
                                ...config,
                                [key]: { ...signer, signatureUrl: b64 }
                              }));
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {signer.signatureUrl ? (
                      <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                        {/* Preview Box with Mask Tint Support */}
                        <div className="h-20 rounded-xl bg-slate-50/90 border border-dashed border-slate-300 relative flex items-center justify-center p-2 overflow-hidden">
                          {signer.colorMode === 'original' ? (
                            <img
                              src={signer.signatureUrl}
                              alt="Preview TTD"
                              className="max-h-full object-contain transition-all origin-center"
                              style={{
                                transform: `scale(${signer.scale ?? 1.0}) translate(${signer.xOffset ?? 0}px, ${signer.yOffset ?? 0}px)`
                              }}
                            />
                          ) : (
                            <div
                              className="h-16 w-32 max-h-full transition-all origin-center pointer-events-none"
                              style={{
                                transform: `scale(${signer.scale ?? 1.0}) translate(${signer.xOffset ?? 0}px, ${signer.yOffset ?? 0}px)`,
                                backgroundColor: signer.colorMode === 'theme_accent' ? toRgb(activeTheme.borderInner) : toRgb(activeTheme.titleText),
                                WebkitMaskImage: `url(${signer.signatureUrl})`,
                                maskImage: `url(${signer.signatureUrl})`,
                                WebkitMaskSize: 'contain',
                                maskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center',
                                maskPosition: 'center',
                              }}
                            />
                          )}
                          <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-lg border border-slate-200 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => makeSignatureTransparent(key)}
                              title="Bersihkan latar belakang putih menjadi transparan murni"
                              className="p-1 rounded-md text-amber-600 hover:bg-amber-50 cursor-pointer transition-colors"
                            >
                              <Wand2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfig({
                                ...config,
                                [key]: { ...signer, signatureUrl: null }
                              })}
                              title="Hapus tanda tangan"
                              className="p-1 rounded-md text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Adjustments: Scale & Position */}
                        <div className="space-y-2.5 pt-1">
                          {/* 1. Scale Slider (Perbesar / Perkecil) */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                              <span className="flex items-center gap-1">
                                <ZoomIn className="w-3 h-3 text-slate-400" />
                                Ukuran / Skala TTD:
                              </span>
                              <span className="font-mono text-emerald-700 font-extrabold">
                                {Math.round((signer.scale ?? 1.0) * 100)}% ({signer.scale ?? 1.0}x)
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0.4"
                              max="2.0"
                              step="0.05"
                              value={signer.scale ?? 1.0}
                              onChange={(e) => updateSignerProp(key, 'scale', parseFloat(e.target.value))}
                              className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                            />
                            {/* Scale Preset Chips */}
                            <div className="flex items-center gap-1 pt-0.5">
                              {[
                                { val: 0.7, label: '0.7x Kecil' },
                                { val: 1.0, label: '1.0x Normal' },
                                { val: 1.3, label: '1.3x Besar' },
                                { val: 1.6, label: '1.6x Ekstra' },
                              ].map(chip => (
                                <button
                                  key={chip.val}
                                  type="button"
                                  onClick={() => updateSignerProp(key, 'scale', chip.val)}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                    Math.abs((signer.scale ?? 1.0) - chip.val) < 0.04
                                      ? 'bg-emerald-600 text-white shadow-2xs'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {chip.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 2. Vertical Position Slider (Y-Offset: Naik / Turun) */}
                          <div className="space-y-1 pt-1 border-t border-slate-100">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                              <span className="flex items-center gap-1">
                                <Move className="w-3 h-3 text-slate-400" />
                                Posisi Vertikal (Naik / Turun):
                              </span>
                              <span className="font-mono text-slate-700">
                                {(signer.yOffset ?? 0) > 0 ? `+${signer.yOffset}` : signer.yOffset ?? 0} px
                              </span>
                            </div>
                            <input
                              type="range"
                              min="-25"
                              max="25"
                              step="1"
                              value={signer.yOffset ?? 0}
                              onChange={(e) => updateSignerProp(key, 'yOffset', parseInt(e.target.value, 10))}
                              className="w-full accent-slate-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                            />
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>▲ Geser Ke Atas</span>
                              <span>Tengah</span>
                              <span>▼ Geser Ke Bawah</span>
                            </div>
                          </div>

                          {/* 3. Horizontal Position Slider (X-Offset: Kiri / Kanan) */}
                          <div className="space-y-1 pt-1 border-t border-slate-100">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                              <span className="flex items-center gap-1">
                                <Move className="w-3 h-3 text-slate-400" />
                                Posisi Horisontal (Kiri / Kanan):
                              </span>
                              <span className="font-mono text-slate-700">
                                {(signer.xOffset ?? 0) > 0 ? `+${signer.xOffset}` : signer.xOffset ?? 0} px
                              </span>
                            </div>
                            <input
                              type="range"
                              min="-30"
                              max="30"
                              step="1"
                              value={signer.xOffset ?? 0}
                              onChange={(e) => updateSignerProp(key, 'xOffset', parseInt(e.target.value, 10))}
                              className="w-full accent-slate-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                            />
                          </div>

                          {/* 4. Signature Color Tinting Mode (Menyesuaikan Warna Teks Tema) */}
                          <div className="space-y-1.5 pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                              <span className="flex items-center gap-1.5">
                                <Palette className="w-3.5 h-3.5 text-emerald-600" />
                                Warna Tinta Tanda Tangan:
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                Otomatis selaras dengan palet tema
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {/* Option 1: match_text (Default) */}
                              <button
                                type="button"
                                onClick={() => updateSignerProp(key, 'colorMode', 'match_text')}
                                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                                  (!signer.colorMode || signer.colorMode === 'match_text')
                                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20'
                                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span 
                                    className="w-4 h-4 rounded-full border border-black/15 shadow-2xs inline-block" 
                                    style={{ backgroundColor: toRgb(activeTheme.titleText) }}
                                  />
                                  {(!signer.colorMode || signer.colorMode === 'match_text') && (
                                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-[11px] font-black leading-tight">Ikuti Teks</p>
                                  <p className="text-[9px] text-slate-500">Warna teks tema</p>
                                </div>
                              </button>

                              {/* Option 2: theme_accent */}
                              <button
                                type="button"
                                onClick={() => updateSignerProp(key, 'colorMode', 'theme_accent')}
                                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                                  signer.colorMode === 'theme_accent'
                                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20'
                                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span 
                                    className="w-4 h-4 rounded-full border border-black/15 shadow-2xs inline-block" 
                                    style={{ backgroundColor: toRgb(activeTheme.borderInner) }}
                                  />
                                  {signer.colorMode === 'theme_accent' && (
                                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-[11px] font-black leading-tight">Aksen Tema</p>
                                  <p className="text-[9px] text-slate-500">Warna lis/emas</p>
                                </div>
                              </button>

                              {/* Option 3: original */}
                              <button
                                type="button"
                                onClick={() => updateSignerProp(key, 'colorMode', 'original')}
                                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                                  signer.colorMode === 'original'
                                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20'
                                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-blue-500 via-rose-500 to-amber-500 border border-black/15 shadow-2xs inline-block" />
                                  {signer.colorMode === 'original' && (
                                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-[11px] font-black leading-tight">Warna Asli</p>
                                  <p className="text-[9px] text-slate-500">File upload</p>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Reset Adjustment Button */}
                          <div className="pt-1 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => makeSignatureTransparent(key)}
                              className="text-[10px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <Wand2 className="w-3 h-3" />
                              <span>Hapus Latar Belakang Putih</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => resetSignerAdjustment(key)}
                              className="text-[10px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reset Ukuran & Posisi</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 font-medium">
                        Belum ada tanda tangan. Klik <strong>Gambar TTD</strong> untuk menggambar di layar atau <strong>Upload File</strong> untuk foto tanda tangan.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Certificate Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Header & Theme / Font Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 tracking-tight">
                  Live Preview Sertifikat (A4 Landscape)
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">
                  Resolusi cetak 300 DPI, rasio standar dokumen resmi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                <span 
                  className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" 
                  style={{ backgroundColor: toRgb(activeTheme.bg) }}
                />
                <span className="truncate max-w-[130px]">{activeTheme.name}</span>
              </span>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/80 shadow-2xs">
                {activeFont.name.toUpperCase()}
              </span>
              <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200/80 shadow-2xs">
                {activeBorder.name.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Interactive Mock Inputs with Studio Controls */}
          <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200/70 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-2xs">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-[11px] font-bold text-slate-400 shrink-0">Siswa:</span>
                <input
                  type="text"
                  value={previewStudentName}
                  onChange={(e) => setPreviewStudentName(e.target.value)}
                  placeholder="Nama Peserta..."
                  className="w-full bg-transparent border-0 p-0 text-xs font-bold text-slate-800 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-2xs">
                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-[11px] font-bold text-slate-400 shrink-0">Ujian:</span>
                <input
                  type="text"
                  value={previewExamTitle}
                  onChange={(e) => setPreviewExamTitle(e.target.value)}
                  placeholder="Judul Evaluasi..."
                  className="w-full bg-transparent border-0 p-0 text-xs font-bold text-slate-800 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {!config.enableCertificate && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2 animate-fade-in-fast">
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-bold">Penerbitan Sertifikat Dinonaktifkan: Tombol unduh tidak akan muncul untuk peserta ujian.</span>
            </div>
          )}

          {/* Certificate Preview Frame Canvas in Studio Container */}
          <div className="p-3 sm:p-5 rounded-3xl bg-slate-100/70 border border-slate-200/80 shadow-inner">
            <div 
              className={`w-full aspect-[297/210] rounded-2xl shadow-xl overflow-hidden relative border select-none transition-all duration-300 ring-1 ring-slate-900/5 ${getFontFamilyClass()}`}
              style={{
                backgroundColor: toRgb(activeTheme.bg),
                borderColor: toRgb(activeTheme.borderOuter)
              }}
            >
            {/* Watermark Background Layer */}
            {config.watermarkStyle === 'center_logo' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                {config.logoUrl ? (
                  <img
                    src={config.logoUrl}
                    alt="Watermark Logo"
                    className="w-48 h-48 sm:w-64 sm:h-64 object-contain opacity-[0.08] filter grayscale contrast-125"
                  />
                ) : (
                  <Building2 
                    className="w-48 h-48 sm:w-64 sm:h-64 opacity-[0.07]" 
                    style={{ color: toRgb(activeTheme.borderInner) }}
                  />
                )}
              </div>
            )}

            {config.watermarkStyle === 'security_seal' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div 
                  className="w-40 h-40 sm:w-56 sm:h-56 rounded-full border-4 border-dashed flex items-center justify-center opacity-[0.12] transform rotate-[-15deg]"
                  style={{ borderColor: toRgb(activeTheme.borderInner) }}
                >
                  <div className="text-center p-4">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-1" style={{ color: toRgb(activeTheme.borderInner) }} />
                    <p className="text-[10px] sm:text-xs font-black tracking-widest uppercase">
                      OFFICIAL SECURE EXAM
                    </p>
                    <p className="text-[8px] font-bold">VERIFIED AUTHENTIC</p>
                  </div>
                </div>
              </div>
            )}

            {config.watermarkStyle === 'guilloche_frame' && (
              <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.08] flex items-center justify-center">
                <svg viewBox="0 0 400 280" className="w-full h-full stroke-current" style={{ color: toRgb(activeTheme.borderInner) }}>
                  <circle cx="200" cy="140" r="130" fill="none" strokeWidth="0.8" strokeDasharray="2,2" />
                  <circle cx="200" cy="140" r="100" fill="none" strokeWidth="0.8" strokeDasharray="3,3" />
                  <circle cx="200" cy="140" r="70" fill="none" strokeWidth="0.5" />
                  <ellipse cx="200" cy="140" rx="150" ry="80" fill="none" strokeWidth="0.6" />
                  <ellipse cx="200" cy="140" rx="80" ry="150" fill="none" strokeWidth="0.6" />
                </svg>
              </div>
            )}

            {/* Inner Padding & Dynamic Border Frame */}
            <div className="w-full h-full p-3 sm:p-5 lg:p-6 flex flex-col justify-between relative z-10">
              <div 
                className={`w-full h-full relative flex flex-col justify-between transition-all duration-300 ${getBorderContainerClasses()}`}
                style={{ borderColor: toRgb(activeTheme.borderOuter) }}
              >
                <div 
                  className={`w-full h-full relative flex flex-col justify-between transition-all duration-300 ${getInnerFrameClasses()}`}
                  style={{ borderColor: toRgb(activeTheme.borderInner) }}
                >
                  {/* Distinct Accents & Ornaments for 20 Border Styles */}
                  {renderBorderAccents()}

                  {/* Top Header */}
                  <div className="text-center space-y-0.5 sm:space-y-1">
                    {config.logoUrl && (
                      <div className="mx-auto mb-1">
                        <img src={config.logoUrl} alt="Logo" className="h-6 sm:h-9 object-contain mx-auto" />
                      </div>
                    )}

                    <p 
                      className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest"
                      style={{ color: toRgb(activeTheme.brandText) }}
                    >
                      {config.institutionName || 'EXAMIGO ACADEMY'}
                    </p>
                    <h3 
                      className="text-base sm:text-2xl lg:text-3xl font-black uppercase tracking-wider"
                      style={{ color: toRgb(activeTheme.titleText) }}
                    >
                      {config.certificateTitle || 'SERTIFIKAT KELULUSAN'}
                    </h3>
                    <p 
                      className="text-[8px] sm:text-xs font-medium"
                      style={{ color: toRgb(activeTheme.subtitleText) }}
                    >
                      {config.subtitle || 'Dengan ini menerangkan bahwa peserta ujian:'}
                    </p>
                  </div>

                  {/* Student Centerpiece */}
                  <div className="text-center my-auto py-1">
                    <h2 
                      className="text-sm sm:text-xl lg:text-2xl font-black uppercase tracking-wider"
                      style={{ color: toRgb(activeTheme.nameText) }}
                    >
                      {previewStudentName || 'NAMA LENGKAP SISWA'}
                    </h2>
                    <div 
                      className="w-24 sm:w-48 h-[1.5px] mx-auto mt-1 opacity-70"
                      style={{ backgroundColor: toRgb(activeTheme.accentLine) }}
                    />
                    
                    <p 
                      className="text-[8px] sm:text-xs font-medium mt-1.5"
                      style={{ color: toRgb(activeTheme.subtitleText) }}
                    >
                      {config.completionText || 'Telah menyelesaikan rangkaian evaluasi dan dinyatakan LULUS dalam ujian:'}
                    </p>
                    <p 
                      className="text-xs sm:text-base font-bold mt-0.5"
                      style={{ color: toRgb(activeTheme.examTitleText) }}
                    >
                      {previewExamTitle}
                    </p>

                    {/* Metadata Badges */}
                    <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                      <span 
                        className="text-[7px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold"
                        style={{
                          backgroundColor: activeTheme.badgeBgHex,
                          color: activeTheme.badgeTextHex,
                        }}
                      >
                        Kode: EXM-DEMO-01
                      </span>
                      {config.showScore && (
                        <span 
                          className="text-[7px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold"
                          style={{
                            backgroundColor: activeTheme.badgeBgHex,
                            color: activeTheme.badgeTextHex,
                          }}
                        >
                          Nilai: 95
                        </span>
                      )}
                      {config.showPassingScore && (
                        <span 
                          className="text-[7px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold"
                          style={{
                            backgroundColor: activeTheme.badgeBgHex,
                            color: activeTheme.badgeTextHex,
                          }}
                        >
                          KKM: 75
                        </span>
                      )}
                      {config.showDate && (
                        <span 
                          className="text-[7px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold"
                          style={{
                            backgroundColor: activeTheme.badgeBgHex,
                            color: activeTheme.badgeTextHex,
                          }}
                        >
                          {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Signatures & Verification Hub Bottom */}
                  <div className="grid grid-cols-3 items-end pt-2 text-center">
                    {/* Signer 1 (Left) */}
                    <div className="space-y-0.5 relative">
                      <div className="h-8 sm:h-12 flex items-end justify-center relative overflow-visible">
                        {config.signer1.signatureUrl ? (
                          config.signer1.colorMode === 'original' ? (
                            <img 
                              src={config.signer1.signatureUrl} 
                              alt="TTD 1" 
                              className="max-h-full object-contain transition-transform origin-bottom pointer-events-none"
                              style={{
                                transform: `scale(${config.signer1.scale ?? 1.0}) translate(${config.signer1.xOffset ?? 0}px, ${config.signer1.yOffset ?? 0}px)`
                              }} 
                            />
                          ) : (
                            <div
                              className="h-8 sm:h-12 w-20 sm:w-32 transition-transform origin-bottom pointer-events-none"
                              style={{
                                transform: `scale(${config.signer1.scale ?? 1.0}) translate(${config.signer1.xOffset ?? 0}px, ${config.signer1.yOffset ?? 0}px)`,
                                backgroundColor: config.signer1.colorMode === 'theme_accent' ? toRgb(activeTheme.borderInner) : toRgb(activeTheme.titleText),
                                WebkitMaskImage: `url(${config.signer1.signatureUrl})`,
                                maskImage: `url(${config.signer1.signatureUrl})`,
                                WebkitMaskSize: 'contain',
                                maskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center bottom',
                                maskPosition: 'center bottom',
                              }}
                            />
                          )
                        ) : (
                          <div className="h-6 sm:h-8" />
                        )}
                      </div>
                      <div 
                        className="w-20 sm:w-32 h-[1px] mx-auto opacity-40 relative z-10" 
                        style={{ backgroundColor: toRgb(activeTheme.borderInner) }}
                      />
                      <p 
                        className="text-[8px] sm:text-xs font-bold relative z-10"
                        style={{ color: toRgb(activeTheme.titleText) }}
                      >
                        {config.signer1.name}
                      </p>
                      <p 
                        className="text-[7px] sm:text-[10px] relative z-10"
                        style={{ color: toRgb(activeTheme.metaText) }}
                      >
                        {config.signer1.title}
                      </p>
                    </div>

                    {/* QR Code Center with Authenticity link */}
                    <div className="space-y-0.5">
                      {config.showQrCode ? (
                        <div 
                          onClick={() => window.open('/verify/EXM-DEMO-01', '_blank')}
                          className="w-8 h-8 sm:w-12 sm:h-12 bg-white p-0.5 rounded-md mx-auto shadow-xs flex flex-col items-center justify-center cursor-pointer hover:ring-2 hover:ring-emerald-400 transition-all"
                          title="Klik untuk uji cek keaslian publik"
                        >
                          <QrCode className="w-full h-full text-slate-900" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 sm:w-12 sm:h-12" />
                      )}
                      {config.showCertificateId && (
                        <p 
                          className="text-[6px] sm:text-[8px] font-mono tracking-tight"
                          style={{ color: toRgb(activeTheme.metaText) }}
                        >
                          ID: EXM-VERIF-99A1
                        </p>
                      )}
                    </div>

                    {/* Signer 2 (Right) */}
                    <div className="space-y-0.5 relative">
                      <div className="h-8 sm:h-12 flex items-end justify-center relative overflow-visible">
                        {config.signer2.signatureUrl ? (
                          config.signer2.colorMode === 'original' ? (
                            <img 
                              src={config.signer2.signatureUrl} 
                              alt="TTD 2" 
                              className="max-h-full object-contain transition-transform origin-bottom pointer-events-none"
                              style={{
                                transform: `scale(${config.signer2.scale ?? 1.0}) translate(${config.signer2.xOffset ?? 0}px, ${config.signer2.yOffset ?? 0}px)`
                              }} 
                            />
                          ) : (
                            <div
                              className="h-8 sm:h-12 w-20 sm:w-32 transition-transform origin-bottom pointer-events-none"
                              style={{
                                transform: `scale(${config.signer2.scale ?? 1.0}) translate(${config.signer2.xOffset ?? 0}px, ${config.signer2.yOffset ?? 0}px)`,
                                backgroundColor: config.signer2.colorMode === 'theme_accent' ? toRgb(activeTheme.borderInner) : toRgb(activeTheme.titleText),
                                WebkitMaskImage: `url(${config.signer2.signatureUrl})`,
                                maskImage: `url(${config.signer2.signatureUrl})`,
                                WebkitMaskSize: 'contain',
                                maskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center bottom',
                                maskPosition: 'center bottom',
                              }}
                            />
                          )
                        ) : (
                          <div className="h-6 sm:h-8" />
                        )}
                      </div>
                      <div 
                        className="w-20 sm:w-32 h-[1px] mx-auto opacity-40 relative z-10" 
                        style={{ backgroundColor: toRgb(activeTheme.borderInner) }}
                      />
                      <p 
                        className="text-[8px] sm:text-xs font-bold relative z-10"
                        style={{ color: toRgb(activeTheme.titleText) }}
                      >
                        {config.signer2.name}
                      </p>
                      <p 
                        className="text-[7px] sm:text-[10px] relative z-10"
                        style={{ color: toRgb(activeTheme.metaText) }}
                      >
                        {config.signer2.title}
                      </p>
                    </div>
                  </div>

                  {/* Footer Notes */}
                  {config.customNotes && (
                    <p 
                      className="text-[6px] sm:text-[8px] text-center italic mt-1"
                      style={{ color: toRgb(activeTheme.metaText) }}
                    >
                      {config.customNotes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold">Otomatis Terhubung ke Ruang Ujian & QR Verifikasi Keaslian!</p>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                Format palet warna, tipografi font, logo sekolah, serta tanda tangan resmi yang Anda tentukan di sini akan langsung diaplikasikan ke sertifikat kelulusan yang diunduh siswa. QR Code di sertifikat juga dapat dipindai untuk langsung membuka sertifikat terverifikasi di portal publik.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Signature Drawing Canvas Modal */}
      {drawingSignerKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in-fast">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Gambar Tanda Tangan Digital
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {drawingSignerKey === 'signer1' ? 'Untuk Penandatangan 1 (Sisi Kiri)' : 'Untuk Penandatangan 2 (Sisi Kanan)'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawingSignerKey(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ink Color Picker */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-slate-600">Pilihan Tinta:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: '#0f172a', label: 'Hitam Resmi' },
                  { id: '#1e3a8a', label: 'Biru Dokumen' },
                  { id: '#0369a1', label: 'Biru Klasik' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setInkColor(c.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      inkColor === c.id ? 'ring-2 ring-emerald-500 bg-slate-100 text-slate-900 font-black' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.id }} />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Pad */}
            <div className="relative rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 overflow-hidden touch-none select-none">
              <canvas
                ref={signatureCanvasRef}
                width={500}
                height={220}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-[180px] sm:h-[220px] cursor-crosshair block"
              />
              {!hasDrawn && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium gap-1.5">
                  <Edit3 className="w-4 h-4 opacity-50" />
                  <span>Tanda tangan di sini menggunakan mouse, stylus, atau jari</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={clearDrawing}
                disabled={!hasDrawn}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Bersihkan</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDrawingSignerKey(null)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={saveDrawing}
                  disabled={!hasDrawn}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-600/30 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Terapkan TTD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
