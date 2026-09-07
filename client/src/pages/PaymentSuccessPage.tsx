import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles, ShieldCheck, User } from 'lucide-react';
import ExamigoLogo from '../components/common/ExamigoLogo';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const state = location.state || {};
  const plan = state.plan || 'PERSONAL';
  const amount = state.amount || 49000;
  const orderId = state.orderId || 'EXM-PAY-SUCCESS';

  // Calculate valid until 1 month from now
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const formattedDate = nextMonth.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased py-10 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6 text-center">
        
        {/* Logo */}
        <div className="flex justify-center">
          <ExamigoLogo size="lg" />
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
        <div className="p-8 md:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 relative overflow-hidden animate-fade-in-fast">
          
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[var(--theme-primary, #059669)] flex items-center justify-center mx-auto shadow-xs border border-[var(--theme-border, #A7F3D0)]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-slate-900">Pembayaran Berhasil!</h2>
            <p className="text-xs text-slate-500 font-medium">Transaksi telah diverifikasi resmi oleh Midtrans Payment Gateway.</p>
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

          {/* Direct CTA */}
          <Link
            to="/"
            style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
            className="w-full py-4 rounded-2xl text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:opacity-90"
          >
            <span>Masuk ke Dashboard Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="p-3 rounded-xl bg-slate-50 text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--theme-primary, #059669)]" /> Transaksi Terverifikasi Aman • Order ID: {orderId}
          </div>

        </div>

      </div>
    </div>
  );
}
