import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import ExamigoLogo from '../components/common/ExamigoLogo';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const state = location.state || {};
  const plan = state.plan || 'PERSONAL';
  const amount = state.amount || 49000;
  const orderId = state.orderId || 'EXM-PAY-SUCCESS';

  // Calculate valid until 1 month or 1 year from now
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const formattedDate = nextMonth.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased py-8 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6 text-center">
        
        {/* Logo */}
        <div className="flex justify-center">
          <ExamigoLogo size="lg" />
        </div>

        {/* 3-Step Wizard Completed */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between text-xs font-bold text-emerald-600">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>01. Paket</span>
          </div>
          <div className="h-0.5 bg-emerald-500 flex-1 mx-2" />
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>02. Pembayaran</span>
          </div>
          <div className="h-0.5 bg-emerald-500 flex-1 mx-2" />
          <div className="flex items-center gap-1.5 font-extrabold text-indigo-600">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">3</span>
            <span>03. Selesai</span>
          </div>
        </div>

        {/* Success Card */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-slate-900">Pembayaran Berhasil!</h2>
            <p className="text-xs text-slate-500 font-medium">Transaksi telah diverifikasi oleh Pakasir Payment Gateway.</p>
          </div>

          {/* Details */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2.5 text-xs text-left">
            <div className="flex justify-between items-center text-slate-600">
              <span>Paket Langganan Aktif</span>
              <span className="font-extrabold text-slate-900 flex items-center gap-1">
                {plan === 'PRO_AI' ? <><Sparkles className="w-3.5 h-3.5 text-amber-500" /> Pro AI</> : '👤 Personal'}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <span>Total Bayar</span>
              <span className="font-black text-indigo-700">Rp {amount.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between items-center text-slate-600 border-t border-indigo-100/80 pt-2 text-[11px]">
              <span>Masa Berlaku Sampai</span>
              <span className="font-bold text-emerald-700">{formattedDate}</span>
            </div>
          </div>

          {/* Direct CTA */}
          <Link
            to="/"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="p-2.5 rounded-xl bg-slate-50 text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Transaksi Terverifikasi Aman • Order ID: {orderId}
          </div>

        </div>

      </div>
    </div>
  );
}
