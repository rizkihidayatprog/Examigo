import React, { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles, ShieldCheck, User } from 'lucide-react';
import ExamigoLogo from '../components/common/ExamigoLogo';
import { useAuth } from '../lib/auth';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, refreshUser } = useAuth();

  const state = location.state || {};
  const orderId = state.orderId || searchParams.get('order_id') || 'EXM-PAY-SUCCESS';
  const plan = state.plan || user?.plan || 'PRO_AI';
  const amount = state.amount || (plan === 'PRO_AI' ? 149000 : 49000);

  // Helper to remove any lingering third-party Snap iframes, backdrops, or overlays
  const cleanupOverlays = () => {
    try {
      const straySelectors = [
        '#snap-midtrans',
        '#snap-container',
        '[id*="snap-"]',
        'iframe[src*="midtrans"]',
        'iframe[name*="popup_"]',
        '.snap-container',
        '.snap-overlay',
        'div[style*="z-index: 999"]',
        'div[style*="z-index: 9999"]',
        'div[style*="z-index: 100000"]'
      ];
      straySelectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          if (!document.getElementById('root')?.contains(el)) {
            el.remove();
          }
        });
      });
      document.body.style.overflow = '';
      if ((window as any).snap?.hide) {
        (window as any).snap.hide();
      }
    } catch (e) {
      console.warn('Overlay cleanup warning:', e);
    }
  };

  // Clean overlays & refresh user auth immediately on mount
  useEffect(() => {
    cleanupOverlays();
    const t = setTimeout(cleanupOverlays, 300);

    // Refresh user context to ensure PRO_AI / latest plan is reflected
    refreshUser().catch((err) => console.error('Failed to refresh user:', err));

    return () => clearTimeout(t);
  }, [refreshUser]);

  const handleGoToWorkspace = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    cleanupOverlays();

    // Use window.location.href directly to /dashboard
    // This cleanly reloads auth and bypasses any router mismatch
    window.location.href = '/dashboard';
  };

  // Calculate valid until 1 month from now
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const formattedDate = nextMonth.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased py-10 px-4 sm:px-6 flex flex-col items-center justify-center relative z-10">
      <div className="max-w-md w-full space-y-6 text-center relative z-20">
        
        {/* Logo */}
        <div className="flex justify-center">
          <a href="/dashboard" onClick={handleGoToWorkspace} className="inline-block transition-transform active:scale-95 cursor-pointer">
            <ExamigoLogo size="lg" />
          </a>
        </div>

        {/* 3-Step Wizard Completed */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between text-xs font-bold text-[var(--theme-primary, #059669)]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary, #059669)]" />
            <span className="font-bold text-slate-900">01. Paket</span>
          </div>
          <div style={{ backgroundColor: 'var(--theme-primary, #059669)' }} className="h-0.5 flex-1 mx-2" />
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary, #059669)]" />
            <span className="font-bold text-slate-900">02. Pembayaran</span>
          </div>
          <div style={{ backgroundColor: 'var(--theme-primary, #059669)' }} className="h-0.5 flex-1 mx-2" />
          <div className="flex items-center gap-1.5 font-black text-[var(--theme-primary-dark, #064E3B)]">
            <span 
              style={{ backgroundColor: 'var(--theme-primary-dark, #064E3B)' }}
              className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px]"
            >
              3
            </span>
            <span className="font-black text-slate-900">03. Selesai</span>
          </div>
        </div>

        {/* Success Card */}
        <div className="p-8 md:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 relative z-30 overflow-hidden animate-fade-in-fast pointer-events-auto">
          
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[var(--theme-primary, #059669)] flex items-center justify-center mx-auto shadow-xs border border-[var(--theme-border, #A7F3D0)]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-slate-900">Pembayaran Berhasil!</h2>
            <p className="text-xs text-slate-500 font-medium">
              {orderId?.includes('QRIS') ? 'Transaksi dan kode unik telah terverifikasi otomatis via QRIS.' : 'Transaksi telah diverifikasi resmi oleh Payment Gateway.'}
            </p>
          </div>

          {/* Details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs text-left">
            <div className="flex justify-between items-center text-slate-600">
              <span>Paket Langganan Aktif</span>
              <span className="font-black text-slate-900 flex items-center gap-1">
                {plan === 'PRO_AI' ? <><Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Paket Pro</> : <><User className="w-3.5 h-3.5 text-slate-500" /> Personal</>}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <span>Total Bayar</span>
              <span className="font-black text-[var(--theme-primary-dark, #064E3B)]">Rp {amount.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between items-center text-slate-600 border-t border-slate-200/80 pt-2 text-[11px]">
              <span>Masa Berlaku Sampai</span>
              <span className="font-bold text-[var(--theme-primary, #059669)]">{formattedDate}</span>
            </div>
          </div>

          {/* Direct CTA Button & Fallback */}
          <div className="space-y-2 pt-1 relative z-40">
            <button
              type="button"
              id="btn-masuk-workspace"
              onClick={handleGoToWorkspace}
              style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
              className="w-full py-4 rounded-2xl text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:opacity-90 relative z-50 pointer-events-auto select-none"
            >
              <span>Masuk ke Dashboard Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <p className="text-[11px] text-slate-400">
              Atau <a href="/dashboard" onClick={handleGoToWorkspace} className="underline font-bold text-slate-600 hover:text-emerald-700 cursor-pointer">klik di sini</a> jika ingin langsung ke dashboard.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--theme-primary, #059669)]" /> Transaksi Terverifikasi Aman • Order ID: {orderId}
          </div>

        </div>

      </div>
    </div>
  );
}
