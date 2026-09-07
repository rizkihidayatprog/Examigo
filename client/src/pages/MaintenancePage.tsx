import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  RefreshCw, 
  ShieldCheck, 
  Mail, 
  Sparkles
} from 'lucide-react';
import ExamigoLogo from '../components/common/ExamigoLogo';

export interface MaintenanceInfo {
  enabled?: boolean;
  title?: string;
  message?: string;
  estimatedEndTime?: string;
  allowAdminLogin?: boolean;
}

interface MaintenancePageProps {
  maintenance?: MaintenanceInfo | null;
  onRefresh?: () => void;
  previewMode?: boolean;
}

export default function MaintenancePage({ maintenance: propMaintenance, onRefresh, previewMode = false }: MaintenancePageProps) {
  const [data, setData] = useState<MaintenanceInfo>(() => propMaintenance || {
    enabled: true,
    title: 'Sistem Sedang Dalam Pemeliharaan',
    message: 'Kami sedang melakukan pemeliharaan sistem rutin dan peningkatan performa server Examigo. Seluruh data ujian Anda tetap aman dan layanan akan segera kembali aktif.',
    estimatedEndTime: '',
    allowAdminLogin: true
  });

  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);

  useEffect(() => {
    if (propMaintenance) {
      setData(propMaintenance);
    } else if (!previewMode) {
      fetch('/api/public/maintenance-status')
        .then(res => res.json())
        .then(resData => {
          if (resData.success && resData.data) {
            setData(resData.data);
          }
        })
        .catch(err => console.error('Failed to load maintenance status:', err));
    }
  }, [propMaintenance, previewMode]);

  const handleRefresh = async () => {
    setChecking(true);
    setCheckResult(null);

    if (onRefresh) {
      onRefresh();
    }

    try {
      const res = await fetch('/api/public/maintenance-status');
      const resData = await res.json();
      if (resData.success) {
        if (!resData.data.enabled) {
          setCheckResult('Sistem sudah kembali online! Mengalihkan...');
          setTimeout(() => {
            window.location.href = '/';
          }, 1200);
          return;
        } else {
          setData(resData.data);
          setCheckResult('Sistem masih dalam proses pemeliharaan. Mohon tunggu sejenak.');
        }
      }
    } catch {
      setCheckResult('Koneksi belum terhubung kembali.');
    } finally {
      setTimeout(() => setChecking(false), 600);
      setTimeout(() => setCheckResult(null), 5000);
    }
  };

  const title = data.title?.trim() || 'Sistem Sedang Dalam Pemeliharaan';
  const message = data.message?.trim() || 'Kami sedang melakukan pemeliharaan sistem rutin dan peningkatan performa server Examigo. Seluruh data ujian Anda tetap aman dan layanan akan segera kembali aktif.';
  const estimatedEndTime = data.estimatedEndTime?.trim() || '';
  const allowAdminLogin = data.allowAdminLogin ?? true;

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans ${previewMode ? 'rounded-3xl border border-slate-200' : ''}`}>
      {/* Background Subtle Dot Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #CBD5E1 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header */}
      <header className="relative z-10 w-full max-w-4xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-200/80">
        <ExamigoLogo size="md" />
        
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-full shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="text-[11px] font-bold tracking-wide uppercase text-amber-800">
            Mode Pemeliharaan
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 text-center max-w-xl mx-auto">
        {/* Handcrafted Sad Mascot SVG */}
        <div className="relative w-44 h-44 mb-6 flex items-center justify-center">
          <style>{`
            @keyframes sadSigh {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(5px) scale(0.99, 1.01); }
            }
            @keyframes tearDrop {
              0% { transform: translateY(0) scale(0.4); opacity: 0; }
              20% { opacity: 0.9; }
              80% { transform: translateY(24px) scale(1); opacity: 0.85; }
              100% { transform: translateY(30px) scale(1.1); opacity: 0; }
            }
            @keyframes eyeBlink {
              0%, 90%, 100% { transform: scaleY(1); }
              95% { transform: scaleY(0.15); }
            }
            .mascot-sigh {
              animation: sadSigh 4s ease-in-out infinite;
              transform-origin: bottom center;
            }
            .tear-anim {
              animation: tearDrop 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            .mascot-eyes {
              animation: eyeBlink 4.5s ease-in-out infinite;
              transform-origin: center;
            }
          `}</style>
          
          <svg
            viewBox="0 0 160 160"
            className="w-40 h-40 mascot-sigh filter drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground shadow */}
            <ellipse cx="80" cy="148" rx="42" ry="6" fill="#E2E8F0" />

            {/* Mascot Body / Retro Server Screen */}
            <rect x="25" y="24" width="110" height="96" rx="22" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="3" />
            
            {/* Inner Screen */}
            <rect x="36" y="34" width="88" height="74" rx="14" fill="#F1F5F9" />

            {/* Cute Band-aid on top right */}
            <g transform="translate(108, 20) rotate(22)">
              <rect x="-6" y="-14" width="14" height="28" rx="4" fill="#FEF08A" stroke="#FACC15" strokeWidth="1.5" />
              <circle cx="1" cy="-6" r="0.8" fill="#CA8A04" />
              <circle cx="1" cy="0" r="0.8" fill="#CA8A04" />
              <circle cx="1" cy="6" r="0.8" fill="#CA8A04" />
            </g>

            {/* Sad downturned eyes */}
            <g className="mascot-eyes">
              {/* Left Eye: Sad downturned curve */}
              <path
                d="M 52 66 Q 59 60 66 67"
                stroke="#334155"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right Eye: Sad downturned curve */}
              <path
                d="M 94 67 Q 101 60 108 66"
                stroke="#334155"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Rosy Cheeks */}
            <circle cx="50" cy="74" r="5" fill="#FECDD3" opacity="0.8" />
            <circle cx="110" cy="74" r="5" fill="#FECDD3" opacity="0.8" />

            {/* Sad pout mouth */}
            <path
              d="M 74 81 Q 80 76 86 81"
              stroke="#475569"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Animated Teardrop falling from right eye */}
            <g className="tear-anim">
              <path
                d="M 104 74 C 104 71 106.5 68 106.5 68 C 106.5 68 109 71 109 74 C 109 75.38 107.88 76.5 106.5 76.5 C 105.12 76.5 104 75.38 104 74 Z"
                fill="#38BDF8"
              />
            </g>

            {/* Base stand */}
            <path d="M 68 120 L 64 136 L 96 136 L 92 120" fill="#E2E8F0" />
            <rect x="54" y="136" width="52" height="6" rx="3" fill="#CBD5E1" />

            {/* Small wrench icon badge */}
            <g transform="translate(112, 88)">
              <circle cx="12" cy="12" r="14" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="2" />
              <g transform="translate(6, 6) scale(0.55)">
                <path
                  d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                  fill="#D97706"
                />
              </g>
            </g>
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
          {title}
        </h1>

        {/* Message */}
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
          {message}
        </p>

        {/* Estimated Time Card (if provided) */}
        {estimatedEndTime && (
          <div className="w-full max-w-md bg-white border border-amber-200/70 rounded-2xl p-4 mb-6 flex items-center gap-3.5 shadow-sm text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                Estimasi Waktu Selesai
              </p>
              <p className="text-sm font-bold text-slate-800 truncate">
                {estimatedEndTime}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm justify-center mb-5">
          <button
            onClick={handleRefresh}
            disabled={checking}
            className="w-full sm:w-auto flex-1 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            {checking ? 'Memeriksa...' : 'Cek Status'}
          </button>

          <a
            href="mailto:support@examigo.id"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-200 transition-colors shadow-xs"
          >
            <Mail className="w-4 h-4 text-slate-500" /> Bantuan
          </a>
        </div>

        {/* Live check status feedback toast/alert */}
        {checkResult && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm mb-4 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {checkResult}
          </div>
        )}

        {/* Data Safety Assurance */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Seluruh basis data bank soal & akun Anda tetap tersimpan aman.</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-6 py-5 border-t border-slate-200/80 flex items-center justify-center text-xs text-slate-500">
        <p>© 2026 Examigo. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}

