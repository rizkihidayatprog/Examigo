import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  Star, 
  Zap, 
  Check, 
  Lock, 
  Users, 
  Layers, 
  FileText, 
  Database, 
  Calendar, 
  Clock, 
  RefreshCw, 
  Award,
  HelpCircle,
  FileCheck,
  Plus,
  X,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { loadMidtransSnap } from '../lib/payment';

export default function SubscriptionSettingsPage() {
  const { user, updateUser, refreshUser } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [cancelledSuccess, setCancelledSuccess] = useState<boolean>(false);

  // Top-Up Quota Modal State
  const [topUpModalOpen, setTopUpModalOpen] = useState<boolean>(false);
  const [topUpAiCount, setTopUpAiCount] = useState<number>(50);
  const [topUpStudentCount, setTopUpStudentCount] = useState<number>(0);
  const [topUpExamCount, setTopUpExamCount] = useState<number>(0);
  const [topUpSubmitting, setTopUpSubmitting] = useState<boolean>(false);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('examigo_token');
      const res = await fetch('/api/payments/my-subscription', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.subscription) {
        setSubscription(data.subscription);
        setTransactions(data.transactions || []);
        updateUser({
          plan: data.subscription.plan,
          aiQuotaLimit: data.subscription.aiQuotaLimit,
          planValidUntil: data.subscription.planValidUntil,
        });
      }
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const currentPlan = subscription?.plan || user?.plan || 'FREE';
  const limits = subscription?.limits || {
    maxAiQuestions: currentPlan === 'PRO_AI' ? 300 : currentPlan === 'PERSONAL' ? 100 : 15,
    maxParticipants: currentPlan === 'PRO_AI' ? 200 : currentPlan === 'PERSONAL' ? 50 : 5,
    maxActiveExams: currentPlan === 'PRO_AI' ? 15 : currentPlan === 'PERSONAL' ? 5 : 1,
    name: currentPlan === 'PRO_AI' ? 'Pro' : currentPlan === 'PERSONAL' ? 'Personal' : 'Free',
    badge: currentPlan === 'PRO_AI' ? 'Sekolah & Bimbel' : currentPlan === 'PERSONAL' ? 'Guru Mandiri' : 'Paket Dasar',
    monthlyPrice: currentPlan === 'PRO_AI' ? 149000 : currentPlan === 'PERSONAL' ? 49000 : 0,
  };

  const addonPricing = subscription?.addonPricing || {
    enabled: true,
    pricePerAiQuestion: 500,
    pricePerStudent: 200,
    pricePerActiveExam: 5000,
    minAiQuestions: 10,
    minStudents: 10,
    minActiveExams: 1,
  };

  // Expiry / Active Duration Calculation
  const planValidUntil = subscription?.planValidUntil;
  let isExpired = subscription?.isExpired ?? false;
  let daysRemaining = 0;
  let formattedValidUntil = 'Selamanya';

  if (planValidUntil) {
    const validDate = new Date(planValidUntil);
    const now = new Date();
    const diffTime = validDate.getTime() - now.getTime();
    if (diffTime <= 0) {
      isExpired = true;
    }
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    formattedValidUntil = `${validDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })} pukul ${validDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
  }

  // If expired, benefits must immediately revert to FREE defaults!
  const effectivePlan = isExpired ? 'FREE' : currentPlan;
  const extraAiQuota = isExpired ? 0 : (subscription?.extraAiQuota ?? 0);
  const extraParticipantQuota = isExpired ? 0 : (subscription?.extraParticipantQuota ?? 0);
  const extraActiveExamQuota = isExpired ? 0 : (subscription?.extraActiveExamQuota ?? 0);

  // Usage Stats
  const aiQuotaUsed = subscription?.aiQuotaUsed ?? 0;
  const aiQuotaLimit = isExpired ? 15 : (limits.maxAiQuestions || (effectivePlan === 'PRO_AI' ? 300 : effectivePlan === 'PERSONAL' ? 100 : 15));
  const aiQuotaPercent = Math.min(100, Math.round((aiQuotaUsed / aiQuotaLimit) * 100));
  const aiQuotaRemaining = Math.max(0, aiQuotaLimit - aiQuotaUsed);
  const aiQuotaRemainingPercent = Math.max(0, 100 - aiQuotaPercent);

  const activeExamsCount = subscription?.activeExamsCount ?? 0;
  const maxActiveExams = isExpired ? 1 : (limits.maxActiveExams || (effectivePlan === 'PRO_AI' ? 15 : effectivePlan === 'PERSONAL' ? 5 : 1));
  const activeExamsPercent = Math.min(100, Math.round((activeExamsCount / maxActiveExams) * 100));
  const activeExamsRemaining = Math.max(0, maxActiveExams - activeExamsCount);

  const totalParticipantsCount = subscription?.totalParticipantsCount ?? 0;
  const maxParticipants = isExpired ? 5 : (limits.maxParticipants || (effectivePlan === 'PRO_AI' ? 200 : effectivePlan === 'PERSONAL' ? 50 : 5));
  const participantsPercent = Math.min(100, Math.round((totalParticipantsCount / maxParticipants) * 100));

  const realTimeQuestionCount = subscription?.realTimeQuestionCount ?? 0;
  const totalMaterialsCount = subscription?.totalMaterialsCount ?? 0;
  const totalExamsCount = subscription?.totalExamsCount ?? 0;

  const handleConfirmCancel = async () => {
    try {
      setCancelling(true);
      const token = localStorage.getItem('examigo_token');
      const res = await fetch('/api/payments/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setCancelledSuccess(true);
        setCancelModalOpen(false);
        // Refresh subscription & user context immediately
        await fetchSubscription();
        if (refreshUser) {
          await refreshUser();
        }
      } else {
        alert(data.message || 'Gagal membatalkan langganan');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat membatalkan langganan');
    } finally {
      setCancelling(false);
    }
  };

  // Helper for progress bar color
  const getProgressBarColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-amber-500';
    return 'bg-[var(--theme-primary,#059669)]';
  };

  // Top-Up Calculation
  const totalTopUpPrice = 
    (topUpAiCount * (addonPricing.pricePerAiQuestion || 500)) +
    (topUpStudentCount * (addonPricing.pricePerStudent || 200)) +
    (topUpExamCount * (addonPricing.pricePerActiveExam || 5000));

  const handleCheckoutAddon = async () => {
    if (currentPlan === 'FREE') {
      alert('Pembelian kuota satuan hanya berlaku untuk pengguna paket berbayar (Personal dan Pro). Silakan upgrade paket terlebih dahulu.');
      return;
    }
    if (totalTopUpPrice <= 0) return;
    setTopUpSubmitting(true);
    try {
      const token = localStorage.getItem('examigo_token');
      const res = await fetch('/api/payments/checkout-addon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          aiCount: topUpAiCount,
          studentCount: topUpStudentCount,
          examCount: topUpExamCount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.snapToken) {
          await loadMidtransSnap(data.isProduction, data.clientKey);
          if (window.snap) {
            window.snap.pay(data.snapToken, {
              onSuccess: () => {
                alert('Pembayaran kuota tambahan berhasil! Kuota akun Anda telah diperbarui.');
                window.location.reload();
              },
              onPending: () => {
                alert('Transaksi tercatat. Silakan selesaikan pembayaran Anda.');
              },
              onError: () => {
                alert('Pembayaran gagal diproses melalui Midtrans.');
              },
              onClose: () => {
                // User closed popup
              }
            });
            return;
          }
        }
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        }
      } else {
        alert(data.message || 'Gagal memproses pembelian kuota.');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setTopUpSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-fast max-w-6xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-center text-[var(--theme-primary,#059669)] shadow-xs shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Paket & Kuota Langganan
                </h1>
                <span className={`px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-2xs ${
                  effectivePlan === 'PRO_AI' 
                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                    : effectivePlan === 'PERSONAL' 
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {effectivePlan === 'PRO_AI' ? 'Pro' : effectivePlan === 'PERSONAL' ? 'Personal' : 'Free'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pantau persentase penggunaan kuota pembuatan soal, sisa batas ujian, kapasitas peserta, serta top-up kuota satuan kapan saja.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Clean, unified row, responsive */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap sm:flex-nowrap shrink-0">
          <button
            type="button"
            onClick={fetchSubscription}
            className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer shrink-0"
            title="Perbarui Data Langganan"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[var(--theme-primary,#059669)]' : ''}`} />
          </button>

          {/* Top Up Satuan Button */}
          {addonPricing.enabled && (
            <button
              type="button"
              onClick={() => setTopUpModalOpen(true)}
              className={`h-10 px-4 rounded-xl border text-xs font-black shadow-2xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                currentPlan === 'FREE'
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                  : 'bg-gradient-to-r from-amber-50 to-amber-100/70 hover:from-amber-100 hover:to-amber-200/70 border-amber-300/80 text-amber-900'
              }`}
            >
              {currentPlan === 'FREE' ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Beli Kuota Satuan</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">Personal & Pro</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>Beli Kuota Satuan</span>
                </>
              )}
            </button>
          )}

          {(effectivePlan !== 'PRO_AI') ? (
            <Link
              to="/checkout?plan=pro_ai&billing=monthly"
              style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
              className="h-10 px-5 rounded-xl text-white font-black text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 shrink-0 hover:opacity-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200 fill-current" />
              <span>{isExpired ? 'Perpanjang Langganan Pro' : 'Upgrade ke Pro'}</span>
            </Link>
          ) : (
            <Link
              to="/checkout?plan=pro_ai&billing=yearly"
              className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Perpanjang Langganan</span>
            </Link>
          )}
        </div>
      </div>

      {isExpired && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-rose-50/70 to-white border border-rose-200 text-rose-950 shadow-xs flex items-start justify-between gap-4 animate-fade-in-fast">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-rose-900 flex items-center gap-2">
                Masa Aktif Paket Telah Berakhir
              </h4>
              <p className="text-xs text-rose-800 leading-relaxed font-medium">
                Masa aktif paket Anda telah kedaluwarsa pada <strong>{formattedValidUntil}</strong>. Seluruh benefit Pro dan kuota tambahan otomatis beralih ke standar paket Free (15 Butir Soal, 1 Ujian Aktif). Silakan lakukan perpanjangan langganan untuk mengaktifkan kembali fitur Pro.
              </p>
            </div>
          </div>
          <Link
            to="/checkout?plan=pro_ai&billing=monthly"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs shrink-0 transition-colors hidden sm:inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Perpanjang
          </Link>
        </div>
      )}

      {cancelledSuccess && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200 text-emerald-950 shadow-xs flex items-start justify-between gap-4 animate-fade-in-fast">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-black text-emerald-900">
                  Langganan Berhasil Dibatalkan
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-200/70 text-emerald-800 border border-emerald-300">
                  Kembali ke Paket Free
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                Akun Anda kini telah langsung beralih ke <strong>Paket Free (Dasar)</strong>. Seluruh <strong>data bank soal, materi, dan riwayat ujian Anda tetap tersimpan 100% aman</strong> tanpa ada data yang terhapus.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCancelledSuccess(false)}
            className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100/60 transition-colors shrink-0 cursor-pointer"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Plan Status Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Paket Aktif Saat Ini
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                {isExpired ? 'Paket Dasar' : limits.badge}
              </span>
              {!isExpired && (extraAiQuota > 0 || extraParticipantQuota > 0 || extraActiveExamQuota > 0) && (
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-600 fill-amber-600" /> Top-Up Kuota Aktif
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs"
                style={{ 
                  backgroundColor: isExpired ? '#F1F5F9' : currentPlan === 'PRO_AI' ? '#FEF3C7' : currentPlan === 'PERSONAL' ? 'var(--theme-mint-light, #ECFDF5)' : '#F1F5F9' 
                }}
              >
                {isExpired ? (
                  <Zap className="w-7 h-7 text-slate-500" />
                ) : currentPlan === 'PRO_AI' ? (
                  <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
                ) : currentPlan === 'PERSONAL' ? (
                  <User className="w-7 h-7 text-[var(--theme-primary,#059669)]" />
                ) : (
                  <Zap className="w-7 h-7 text-slate-600" />
                )}
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Paket {isExpired ? 'Free' : limits.name}
                  {isExpired ? (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-extrabold">
                      KEDALUWARSA
                    </span>
                  ) : currentPlan === 'PRO_AI' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-extrabold">
                      TERLENGKAP
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {(currentPlan === 'FREE' || isExpired) 
                    ? 'Akses dasar pembuatan soal manual dan batas default Free.'
                    : `Biaya langganan Rp ${(limits.monthlyPrice || 0).toLocaleString('id-ID')} /bulan`}
                </p>
              </div>
            </div>
          </div>

          {/* Status & Validity Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white/90 p-4 rounded-2xl border border-slate-200/80 shadow-2xs backdrop-blur-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isExpired ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
                <span className={`text-xs font-black uppercase tracking-wider ${isExpired ? 'text-rose-700' : 'text-slate-800'}`}>
                  {isExpired ? 'Status: Kedaluwarsa' : 'Status: Aktif'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {currentPlan === 'FREE' && !planValidUntil 
                    ? 'Masa Berlaku: Selamanya' 
                    : isExpired 
                      ? `Habis Pada: ${formattedValidUntil}` 
                      : `Aktif Hingga: ${formattedValidUntil}`}
                </span>
              </div>
            </div>

            {(currentPlan !== 'FREE' || isExpired) && (
              <div className={`px-3 py-1.5 rounded-xl text-xs font-black self-start sm:self-auto border ${
                isExpired 
                  ? 'bg-rose-50 text-rose-700 border-rose-200' 
                  : daysRemaining <= 7 
                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {isExpired ? 'Perlu Diperpanjang' : `Sisa ${daysRemaining} Hari`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Usage Percentages & Quotas Grid (User Request) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--theme-primary,#059669)]" />
              Persentase Penggunaan & Kuota Paket
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Ringkasan real-time konsumsi fitur berdasarkan paket <strong>{limits.name}</strong> yang Anda gunakan.
            </p>
          </div>

          {addonPricing.enabled && (
            <button
              type="button"
              onClick={() => setTopUpModalOpen(true)}
              className="text-xs font-black px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs flex items-center gap-1.5 self-start sm:self-auto transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-500" /> Tambah Kuota Satuan
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* 1. AI Question Generator Usage Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black border ${
                    aiQuotaPercent >= 90 ? 'bg-red-50 text-red-700 border-red-200' :
                    aiQuotaPercent >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {aiQuotaPercent}% Terpakai
                  </span>
                  {extraAiQuota > 0 && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      +{extraAiQuota} Add-on
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900">Generate Soal Otomatis</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Pembuatan butir soal otomatis dari dokumen PDF/Word/PPT.
                </p>
              </div>

              {/* Progress Bar & Big Numbers */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {aiQuotaUsed} <span className="text-xs font-bold text-slate-400">/ {aiQuotaLimit} Soal</span>
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {aiQuotaRemainingPercent}% Sisa
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/70">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(aiQuotaPercent)}`}
                    style={{ width: `${aiQuotaPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span className="flex items-center gap-1 text-slate-700 font-bold">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Sisa {aiQuotaRemaining} Soal
              </span>
              <button
                type="button"
                onClick={() => {
                  setTopUpAiCount(50);
                  setTopUpStudentCount(0);
                  setTopUpExamCount(0);
                  setTopUpModalOpen(true);
                }}
                className="text-[11px] text-amber-700 font-bold hover:underline cursor-pointer"
              >
                + Beli Soal
              </button>
            </div>
          </div>

          {/* 2. Active Exams Limit Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black border ${
                    activeExamsPercent >= 90 ? 'bg-red-50 text-red-700 border-red-200' :
                    activeExamsPercent >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {activeExamsPercent}% Digunakan
                  </span>
                  {extraActiveExamQuota > 0 && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      +{extraActiveExamQuota} Add-on
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900">Batas Ujian Aktif</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Paket ujian yang sedang aktif dan bisa diakses siswa serentak.
                </p>
              </div>

              {/* Progress Bar & Big Numbers */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {activeExamsCount} <span className="text-xs font-bold text-slate-400">/ {maxActiveExams} Ujian</span>
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {Math.max(0, 100 - activeExamsPercent)}% Sisa
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/70">
                  <div 
                    className="h-full rounded-full transition-all duration-500 bg-blue-500"
                    style={{ width: `${activeExamsPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span className="flex items-center gap-1 text-slate-700 font-bold">
                <FileCheck className="w-3.5 h-3.5 text-slate-400" /> Sisa {activeExamsRemaining} Slot Ujian
              </span>
              <button
                type="button"
                onClick={() => {
                  setTopUpAiCount(0);
                  setTopUpStudentCount(0);
                  setTopUpExamCount(2);
                  setTopUpModalOpen(true);
                }}
                className="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer"
              >
                + Beli Slot Ujian
              </button>
            </div>
          </div>

          {/* 3. Participants Limit Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black border ${
                    participantsPercent >= 90 ? 'bg-red-50 text-red-700 border-red-200' :
                    participantsPercent >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {participantsPercent}% Terisi
                  </span>
                  {extraParticipantQuota > 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      +{extraParticipantQuota} Add-on
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900">Kapasitas Peserta Ujian</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Batas maksimum jumlah siswa/peserta per paket ujian.
                </p>
              </div>

              {/* Progress Bar & Big Numbers */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {totalParticipantsCount} <span className="text-xs font-bold text-slate-400">/ {maxParticipants} Siswa</span>
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    Maks. {maxParticipants}
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/70">
                  <div 
                    className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                    style={{ width: `${participantsPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span className="flex items-center gap-1 text-slate-700 font-bold">
                <Users className="w-3.5 h-3.5 text-slate-400" /> Sisa Kuota {Math.max(0, maxParticipants - totalParticipantsCount)} Siswa
              </span>
              <button
                type="button"
                onClick={() => {
                  setTopUpAiCount(0);
                  setTopUpStudentCount(50);
                  setTopUpExamCount(0);
                  setTopUpModalOpen(true);
                }}
                className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                + Beli Siswa
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Secondary Info: Storage, Anti-Cheat, & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Plan Capabilities & Bank Soal */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Storage & Assets Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <h4 className="text-sm font-black text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[var(--theme-primary,#059669)]" />
                Penyimpanan Data & Bank Soal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                100% UNLIMITED
              </span>
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-bold text-slate-500">Soal Tersimpan di Bank</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {realTimeQuestionCount} <span className="text-xs font-semibold text-slate-400">Butir Soal</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Siap digunakan kapan saja</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-bold text-slate-500">Materi Referensi Unggah</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {totalMaterialsCount} <span className="text-xs font-semibold text-slate-400">Dokumen</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1">PDF, Word, PPT & Teks</p>
              </div>
            </div>

            {/* Feature Table based on Plan */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-black text-slate-800">Spesifikasi Fitur Paket Anda:</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Anti-Cheat Mode</span>
                  <span className="font-bold flex items-center gap-1.5" style={{ color: 'var(--theme-primary, #059669)' }}>
                    {currentPlan === 'PRO_AI' ? (
                      <><Lock className="w-3.5 h-3.5" /> Fullscreen Lock & Advanced Anti-Cheat (Auto-Submit 2x)</>
                    ) : currentPlan === 'PERSONAL' ? (
                      <><ShieldCheck className="w-3.5 h-3.5" /> Basic Anti-Cheat (Deteksi Pindah Tab)</>
                    ) : (
                      <span className="text-slate-400 font-normal">Nonaktif</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Sertifikat Kelulusan Siswa</span>
                  <span className="font-bold flex items-center gap-1.5 text-slate-800">
                    {currentPlan === 'PRO_AI' ? (
                      <><Award className="w-3.5 h-3.5 text-amber-500" /> Sertifikat Digital Otomatis + 70 Tema + QR Verifikasi</>
                    ) : currentPlan === 'PERSONAL' ? (
                      <><Award className="w-3.5 h-3.5 text-blue-500" /> Sertifikat Digital Otomatis</>
                    ) : (
                      <span className="text-slate-400 font-normal">Belum Tersedia</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Ekspor Laporan & Analitik</span>
                  <span className="font-bold text-slate-800">
                    {currentPlan !== 'FREE' ? 'Excel (.xlsx), CSV, PDF Lengkap' : 'Hanya Layar Dasar'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2.5">
                {addonPricing.enabled && (
                  <button
                    type="button"
                    onClick={() => setTopUpModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" /> Beli Kuota Satuan
                  </button>
                )}

                {currentPlan !== 'PRO_AI' && (
                  <Link
                    to="/checkout?plan=pro_ai&billing=monthly"
                    className="px-5 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 hover:opacity-95"
                    style={{ backgroundColor: 'var(--theme-primary, #10B981)' }}
                  >
                    <Sparkles className="w-4 h-4 fill-current text-amber-200" /> Upgrade ke Pro (Rp 149K)
                  </Link>
                )}

                {currentPlan === 'FREE' && (
                  <Link
                    to="/checkout?plan=personal&billing=monthly"
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Pilih Personal (Rp 49K)
                  </Link>
                )}
              </div>

              {currentPlan !== 'FREE' && (
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-50/60 hover:bg-rose-100 border border-rose-200 text-rose-700 hover:text-rose-800 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Batalkan Langganan
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Billing & Security Info */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-black text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" style={{ color: 'var(--theme-primary, #059669)' }} /> 
              Informasi Penagihan & Keamanan
            </h3>
            
            <div className="space-y-3.5 text-xs text-slate-600 font-medium">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Metode Pembayaran</span>
                <span className="font-bold text-slate-900">QRIS / Virtual Account / E-Wallet (Midtrans)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Periode Tagihan</span>
                <span className="font-bold text-slate-900">
                  {currentPlan === 'FREE' ? 'Gratis Selamanya' : 'Bulanan / Tahunan'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Status Pembayaran</span>
                <span className="font-bold flex items-center gap-1" style={{ color: 'var(--theme-primary, #059669)' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi Aman (256-bit SSL)
                </span>
              </div>
            </div>

            <div 
              className="p-4 rounded-2xl border text-xs space-y-2"
              style={{ 
                backgroundColor: 'var(--theme-mint-light, #ECFDF5)',
                borderColor: 'var(--theme-border, #A7F3D0)',
                color: 'var(--theme-primary-dark, #064E3B)'
              }}
            >
              <p className="font-black flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" style={{ color: 'var(--theme-primary, #059669)' }} /> Jaminan Data Permanen
              </p>
              <p className="text-[11px] leading-relaxed font-semibold" style={{ color: 'var(--theme-text-muted, #065F46)' }}>
                Seluruh butir soal di Bank Soal, histori pengerjaan, dan nilai siswa Anda tetap aman tersimpan tanpa batas waktu, meskipun masa aktif paket langganan Anda telah berakhir.
              </p>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-500" /> Butuh bantuan paket atau faktur resmi?
            </p>
            <p className="text-[11px] text-slate-500">
              Tim support Examigo siap membantu pembuatan invoice sekolah atau faktur instansi. Hubungi kami melalui menu kontak atau email resmi.
            </p>
          </div>

        </div>

      </div>

      {/* Transaction History Section */}
      {transactions.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-600" /> Riwayat Pembayaran & Transaksi ({transactions.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Tipe Transaksi</th>
                  <th className="p-3">Paket / Rincian</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Jumlah</th>
                  <th className="p-3">Metode</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{tx.orderId}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        tx.transactionType === 'ADDON' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}>
                        {tx.transactionType === 'ADDON' ? 'Top-Up Kuota' : 'Langganan'}
                      </span>
                    </td>
                    <td className="p-3 font-bold">
                      {tx.transactionType === 'ADDON' ? (
                        <span className="text-slate-600 text-[11px]">
                          {(() => {
                            try {
                              const d = JSON.parse(tx.addonDetails || '{}');
                              const parts = [];
                              if (d.aiCount) parts.push(`+${d.aiCount} Soal`);
                              if (d.studentCount) parts.push(`+${d.studentCount} Siswa`);
                              if (d.examCount) parts.push(`+${d.examCount} Ujian`);
                              return parts.join(', ') || 'Add-on Kuota';
                            } catch {
                              return 'Add-on Kuota';
                            }
                          })()}
                        </span>
                      ) : (
                        tx.plan
                      )}
                    </td>
                    <td className="p-3 text-slate-500">{new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="p-3 font-bold text-slate-900">Rp {(tx.amount || 0).toLocaleString('id-ID')}</td>
                    <td className="p-3 text-slate-500">{tx.paymentMethod || 'QRIS / Bank'}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        tx.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                        tx.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOP-UP QUOTA MODAL */}
      {topUpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in-fast relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  Beli Kuota Tambahan (Top-Up)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tambah kuota satuan sesuai kebutuhan Anda tanpa perlu ganti paket langganan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTopUpModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {currentPlan === 'FREE' ? (
              <div className="py-6 px-2 sm:px-4 text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-8 h-8 text-amber-600" />
                </div>
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    Khusus Paket Berbayar (Personal & Pro)
                  </span>
                  <h4 className="text-lg font-black text-slate-900">
                    Fitur Tidak Tersedia untuk Paket Free
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                    Pembelian kuota satuan (add-on) hanya berlaku untuk pengguna aktif <strong>Paket Personal</strong> dan <strong>Paket Pro</strong>. Silakan upgrade paket Anda terlebih dahulu untuk menambah kuota eceran.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Buka batas ratusan butir pembuatan soal & kapasitas siswa
                  </div>
                  <div className="flex items-center gap-2.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Bebas beli kuota eceran kapan pun dibutuhkan
                  </div>
                  <div className="flex items-center gap-2.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Akses fitur anti-cheat pro dan sertifikat QR
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTopUpModalOpen(false)}
                    className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Tutup
                  </button>
                  <Link
                    to="/checkout?plan=personal&billing=monthly"
                    style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
                    className="flex-1 py-3 rounded-xl text-white font-black text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    Upgrade ke Personal (Rp 49K)
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-5">
              
              {/* 1. Tambah Soal */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Butir Soal Otomatis</h4>
                      <p className="text-[10px] text-slate-500">Rp {(addonPricing.pricePerAiQuestion || 500).toLocaleString('id-ID')} / butir soal</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-800">
                    Rp {((topUpAiCount || 0) * (addonPricing.pricePerAiQuestion || 500)).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={topUpAiCount}
                    onChange={(e) => setTopUpAiCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900 text-center"
                  />
                  <span className="text-xs text-slate-500 font-bold">Soal</span>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {[10, 50, 100, 200].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTopUpAiCount(prev => prev + num)}
                        className="px-2 py-1 bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-[11px] font-bold text-slate-700 rounded-lg transition-colors cursor-pointer"
                      >
                        +{num}
                      </button>
                    ))}
                    {topUpAiCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setTopUpAiCount(0)}
                        className="px-2 py-1 text-[10px] font-bold text-red-500 hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Tambah Kapasitas Siswa */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Kapasitas Peserta / Siswa</h4>
                      <p className="text-[10px] text-slate-500">Rp {(addonPricing.pricePerStudent || 200).toLocaleString('id-ID')} / peserta</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-800">
                    Rp {((topUpStudentCount || 0) * (addonPricing.pricePerStudent || 200)).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={topUpStudentCount}
                    onChange={(e) => setTopUpStudentCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900 text-center"
                  />
                  <span className="text-xs text-slate-500 font-bold">Siswa</span>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {[25, 50, 100, 200].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTopUpStudentCount(prev => prev + num)}
                        className="px-2 py-1 bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-[11px] font-bold text-slate-700 rounded-lg transition-colors cursor-pointer"
                      >
                        +{num}
                      </button>
                    ))}
                    {topUpStudentCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setTopUpStudentCount(0)}
                        className="px-2 py-1 text-[10px] font-bold text-red-500 hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Tambah Slot Ujian Aktif */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Slot Ujian Aktif</h4>
                      <p className="text-[10px] text-slate-500">Rp {(addonPricing.pricePerActiveExam || 5000).toLocaleString('id-ID')} / slot ujian</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-blue-800">
                    Rp {((topUpExamCount || 0) * (addonPricing.pricePerActiveExam || 5000)).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={topUpExamCount}
                    onChange={(e) => setTopUpExamCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900 text-center"
                  />
                  <span className="text-xs text-slate-500 font-bold">Ujian</span>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {[1, 2, 5, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTopUpExamCount(prev => prev + num)}
                        className="px-2 py-1 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-[11px] font-bold text-slate-700 rounded-lg transition-colors cursor-pointer"
                      >
                        +{num}
                      </button>
                    ))}
                    {topUpExamCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setTopUpExamCount(0)}
                        className="px-2 py-1 text-[10px] font-bold text-red-500 hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Total Price & Checkout Action */}
            <div className="pt-4 border-t border-slate-200/80 space-y-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Pembayaran Top-Up</span>
                  <span className="text-[11px] text-slate-400">Metode QRIS / Transfer Bank Otomatis</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">
                    Rp {totalTopUpPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTopUpModalOpen(false)}
                  className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleCheckoutAddon}
                  disabled={totalTopUpPrice <= 0 || topUpSubmitting}
                  style={{ backgroundColor: totalTopUpPrice > 0 ? 'var(--theme-primary, #10B981)' : undefined }}
                  className={`flex-1 py-3 rounded-xl text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                    totalTopUpPrice <= 0 
                      ? 'bg-slate-300 cursor-not-allowed opacity-60' 
                      : 'hover:opacity-90 cursor-pointer'
                  }`}
                >
                  {topUpSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Bayar Sekarang (Rp {totalTopUpPrice.toLocaleString('id-ID')})
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-scale-in border border-slate-100">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">Batalkan Langganan?</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Konfirmasi pengalihan akun ke Paket Dasar Free
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Seluruh bank soal & riwayat ujian Anda <strong>100% aman & tidak akan dihapus</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Akun langsung beralih ke Paket Free dengan kuota dasar 15 butir soal dan 1 ujian aktif.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Anda dapat berlangganan kembali kapan saja untuk membuka fitur Pro.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                Tetap Berlangganan
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {cancelling ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Membatalkan...</span>
                  </>
                ) : (
                  <span>Ya, Batalkan Sekarang</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
