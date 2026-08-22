import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CreditCard, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, User, Star, Zap } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function SubscriptionSettingsPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [cancelledSuccess, setCancelledSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Fetch subscription details
    const fetchSub = async () => {
      try {
        const token = localStorage.getItem('examigo_token');
        const res = await fetch('/api/payments/my-subscription', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setSubscription(data.subscription);
        }
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSub();
  }, []);

  const currentPlan = subscription?.plan || user?.plan || 'FREE';
  const aiQuotaUsed = subscription?.aiQuotaUsed || 0;
  const aiQuotaLimit = subscription?.aiQuotaLimit || 15;
  const quotaPercent = Math.min(100, Math.round((aiQuotaUsed / aiQuotaLimit) * 100));

  const handleConfirmCancel = () => {
    setCancelledSuccess(true);
    setCancelModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-600" />
            Manajemen Langganan (Subscription)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Kelola paket langganan Examigo, kuota AI, dan penagihan Anda.
          </p>
        </div>

        <Link
          to="/checkout?plan=pro_ai&billing=monthly"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-current" /> Upgrade ke Pro AI
        </Link>
      </div>

      {cancelledSuccess && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold space-y-1">
          <p className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Langganan Berhasil Dibatalkan
          </p>
          <p className="text-[11px] font-normal text-amber-800">
            Paket Anda tetap aktif hingga akhir periode penagihan ini. Setelah itu, akun Anda akan kembali ke Paket Free secara otomatis tanpa menghapus data Anda.
          </p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Current Plan Card */}
        <div className="md:col-span-7 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Paket Aktif Saat Ini</span>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                {currentPlan === 'PRO_AI' ? (
                  <><Star className="w-5 h-5 text-indigo-600 fill-current" /> Paket Pro AI</>
                ) : currentPlan === 'PERSONAL' ? (
                  <><User className="w-5 h-5 text-blue-600" /> Paket Personal</>
                ) : (
                  <><Zap className="w-5 h-5 text-slate-600" /> Paket Free (Dasar)</>
                )}
              </h2>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
              currentPlan === 'PRO_AI' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
              currentPlan === 'PERSONAL' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              ● ACTIVE
            </span>
          </div>

          {/* AI Quota Usage */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Penggunaan Kuota Soal AI
              </span>
              <span>{aiQuotaUsed} / {aiQuotaLimit} Soal</span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">Kuota otomatis diperbarui setiap awal periode billing bulan berjalan.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/checkout?plan=pro_ai&billing=monthly"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              Upgrade Paket
            </Link>

            {currentPlan !== 'FREE' && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
              >
                Batalkan Langganan
              </button>
            )}
          </div>
        </div>

        {/* Security & Support Info */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Informasi Penagihan</h3>
          
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Metode Pembayaran Utama</span>
              <span className="font-bold text-slate-800">Pakasir (QRIS / Bank VA)</span>
            </div>
            <div className="flex justify-between">
              <span>Status Penagihan</span>
              <span className="font-bold text-emerald-600">Otomatis / Manual</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-slate-600 space-y-1.5">
            <p className="font-bold text-indigo-900 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Perlindungan Data Terjamin
            </p>
            <p className="text-[10px] text-slate-500">
              Jika paket Anda kedaluwarsa, seluruh data bank soal dan ujian Anda tetap tersimpan aman tanpa dihapus.
            </p>
          </div>
        </div>

      </div>

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">Batalkan Langganan?</h3>
            <p className="text-xs text-slate-600">
              Paket Anda akan tetap aktif hingga akhir periode berjalan. Setelah tanggal tersebut, akun Anda akan kembali ke Paket Free secara otomatis tanpa kehilangan data.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Tetap Berlangganan
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
              >
                Ya, Batalkan Langganan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
