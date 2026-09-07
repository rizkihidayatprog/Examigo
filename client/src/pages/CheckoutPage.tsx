import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Check, ArrowLeft, ShieldCheck, Tag, CreditCard, User, Star, AlertTriangle } from 'lucide-react';
import ExamigoLogo from '../components/common/ExamigoLogo';
import { useAuth } from '../lib/auth';
import { processMidtransCheckout } from '../lib/payment';
import SEO from '../components/common/SEO';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  // Read URL Params or set defaults
  const initialPlan = (searchParams.get('plan') || 'personal').toLowerCase() === 'pro_ai' ? 'PRO_AI' : 'PERSONAL';
  const initialBilling = searchParams.get('billing') === 'yearly' ? 'YEARLY' : 'MONTHLY';

  const [selectedPlan, setSelectedPlan] = useState<'PERSONAL' | 'PRO_AI'>(initialPlan);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>(initialBilling);
  const [couponInput, setCouponInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cmsConfig, setCmsConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/api/public/landing-config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setCmsConfig(data.data);
        }
      })
      .catch(err => console.error('Failed to load CMS config for checkout:', err));
  }, []);

  // Base Prices from CMS or Defaults
  const basePrices = {
    PERSONAL: {
      MONTHLY: cmsConfig?.pricing?.personal?.monthlyPrice || 49000,
      YEARLY: cmsConfig?.pricing?.personal?.yearlyPrice || 490000,
    },
    PRO_AI: {
      MONTHLY: cmsConfig?.pricing?.pro_ai?.monthlyPrice || 149000,
      YEARLY: cmsConfig?.pricing?.pro_ai?.yearlyPrice || 1490000,
    },
  };

  const rawPrice = basePrices[selectedPlan][billingCycle];
  const serviceFee = typeof cmsConfig?.pricing?.serviceFee === 'number' ? Math.max(0, cmsConfig.pricing.serviceFee) : 0;
  const discountedPrice = Math.max(0, rawPrice - discountAmount);
  const finalPrice = discountedPrice > 0 ? discountedPrice + serviceFee : 0;

  // Apply Coupon Logic
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    setDiscountAmount(0);
    setDiscountPercent(0);
    setAppliedCouponCode(null);
    
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, planAmount: rawPrice })
      });
      const data = await res.json();
      
      if (data.success) {
        setDiscountAmount(data.data.discountAmount);
        setDiscountPercent(data.data.discountPercent);
        setAppliedCouponCode(data.data.code);
        setCouponSuccess(`Kupon ${data.data.code} berhasil digunakan! Diskon ${data.data.discountPercent}%`);
      } else {
        setCouponError(data.message || 'Kupon tidak valid.');
      }
    } catch (err) {
      setCouponError('Terjadi kesalahan saat memvalidasi kupon.');
    }
  };

  // Submit Checkout Session
  const handleProceedToPayment = async () => {
    try {
      setLoading(true);
      setError('');

      if (!isAuthenticated) {
        navigate(`/register?redirect=checkout&plan=${selectedPlan.toLowerCase()}&billing=${billingCycle.toLowerCase()}`);
        return;
      }

      const result = await processMidtransCheckout(
        selectedPlan, 
        billingCycle,
        user || { id: '', email: 'pengajar@examigo.com', name: 'Pengajar Examigo' },
        appliedCouponCode || undefined
      );

      if (result.autoPaid) {
        navigate('/payment/success', { state: { orderId: result.orderId, plan: selectedPlan, amount: 0 } });
      } else {
        navigate(`/payment/${result.orderId}`, { state: { checkoutData: result } });
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memproses checkout. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased py-10 px-4 sm:px-6">
      <SEO title="Checkout Langganan" noindex={true} />
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header & Logo */}
        <div className="flex items-center justify-between pb-2">
          <Link to="/landing">
            <ExamigoLogo size="md" />
          </Link>
          <Link to="/landing#harga" className="text-xs font-bold text-slate-500 hover:opacity-80 flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" style={{ color: 'var(--theme-primary, #059669)' }} /> Kembali ke Landing Page
          </Link>
        </div>

        {/* 3-Step Progress Bar Wizard */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2.5" style={{ color: 'var(--theme-primary-dark, #064E3B)' }}>
            <span className="w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-black" style={{ backgroundColor: 'var(--theme-primary-dark, #064E3B)' }}>1</span>
            <span className="font-extrabold text-slate-900">01. Pilihan Paket</span>
          </div>
          <div className="h-0.5 bg-slate-200 flex-1 mx-4 hidden sm:block" />
          <div className="flex items-center gap-2.5 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">2</span>
            <span>02. Pembayaran</span>
          </div>
          <div className="h-0.5 bg-slate-200 flex-1 mx-4 hidden sm:block" />
          <div className="flex items-center gap-2.5 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">3</span>
            <span>03. Selesai</span>
          </div>
        </div>

        {/* Main Grid: Left Options, Right Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Plan & Billing Selector */}
          <div className="md:col-span-7 space-y-5">
            
            {/* 1. Select Plan Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <span 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                  style={{ backgroundColor: 'var(--theme-mint-subtle, #D1FAE5)', color: 'var(--theme-primary-dark, #064E3B)' }}
                >
                  1
                </span>
                Pilih Paket Langganan
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Personal Option */}
                <div 
                  onClick={() => setSelectedPlan('PERSONAL')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPlan === 'PERSONAL'
                      ? 'shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                  style={selectedPlan === 'PERSONAL' ? {
                    borderColor: 'var(--theme-primary, #10B981)',
                    backgroundColor: 'var(--theme-mint-light, #ECFDF5)'
                  } : undefined}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                      <User className="w-4 h-4" style={{ color: 'var(--theme-primary, #059669)' }} /> Personal
                    </span>
                    {selectedPlan === 'PERSONAL' && <Check className="w-4 h-4" style={{ color: 'var(--theme-primary, #059669)' }} />}
                  </div>
                  <p className="text-sm font-black text-slate-900">
                    Rp {basePrices.PERSONAL.MONTHLY.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-500">/ bln</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">
                    {cmsConfig?.pricing?.personal?.maxAiQuestions || 100} Soal/bln, {cmsConfig?.pricing?.personal?.maxParticipants || 50} Peserta
                  </p>
                </div>

                {/* Pro AI Option */}
                <div 
                  onClick={() => setSelectedPlan('PRO_AI')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                    selectedPlan === 'PRO_AI'
                      ? 'shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                  style={selectedPlan === 'PRO_AI' ? {
                    borderColor: 'var(--theme-primary, #10B981)',
                    backgroundColor: 'var(--theme-mint-light, #ECFDF5)'
                  } : undefined}
                >
                  <span 
                    className="absolute -top-2.5 right-3 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1"
                    style={{ backgroundColor: 'var(--theme-primary, #10B981)' }}
                  >
                    <Sparkles className="w-2.5 h-2.5" /> POPULER
                  </span>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Pro
                    </span>
                    {selectedPlan === 'PRO_AI' && <Check className="w-4 h-4" style={{ color: 'var(--theme-primary, #059669)' }} />}
                  </div>
                  <p className="text-sm font-black" style={{ color: 'var(--theme-primary-dark, #064E3B)' }}>
                    Rp {basePrices.PRO_AI.MONTHLY.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-500">/ bln</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">
                    {cmsConfig?.pricing?.pro_ai?.maxAiQuestions || 300} Soal/bln, Fullscreen Lock
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Select Billing Cycle */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <span 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                  style={{ backgroundColor: 'var(--theme-mint-subtle, #D1FAE5)', color: 'var(--theme-primary-dark, #064E3B)' }}
                >
                  2
                </span>
                Periode Penagihan
              </h3>
              
              <div className="space-y-3">
                {/* Monthly */}
                <label 
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    billingCycle === 'MONTHLY' ? 'font-bold' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                  style={billingCycle === 'MONTHLY' ? {
                    borderColor: 'var(--theme-primary, #10B981)',
                    backgroundColor: 'var(--theme-mint-light, #ECFDF5)'
                  } : undefined}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="billingCycle" 
                      checked={billingCycle === 'MONTHLY'} 
                      onChange={() => setBillingCycle('MONTHLY')} 
                      className="cursor-pointer w-4 h-4"
                      style={{ accentColor: 'var(--theme-primary, #10B981)' }}
                    />
                    <span className="text-xs text-slate-800 font-bold">Penagihan Bulanan</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    Rp {basePrices[selectedPlan].MONTHLY.toLocaleString('id-ID')} / bln
                  </span>
                </label>

                {/* Yearly */}
                <label 
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    billingCycle === 'YEARLY' ? 'font-bold' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                  style={billingCycle === 'YEARLY' ? {
                    borderColor: 'var(--theme-primary, #10B981)',
                    backgroundColor: 'var(--theme-mint-light, #ECFDF5)'
                  } : undefined}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="billingCycle" 
                      checked={billingCycle === 'YEARLY'} 
                      onChange={() => setBillingCycle('YEARLY')} 
                      className="cursor-pointer w-4 h-4"
                      style={{ accentColor: 'var(--theme-primary, #10B981)' }}
                    />
                    <div>
                      <span className="text-xs text-slate-800 block font-bold">Penagihan Tahunan</span>
                      <span className="text-[10px] font-black" style={{ color: 'var(--theme-primary, #059669)' }}>
                        Hemat Rp {(basePrices[selectedPlan].MONTHLY * 12 - basePrices[selectedPlan].YEARLY).toLocaleString('id-ID')} (2 Bulan Gratis)
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black" style={{ color: 'var(--theme-primary-dark, #064E3B)' }}>
                    Rp {basePrices[selectedPlan].YEARLY.toLocaleString('id-ID')} / thn
                  </span>
                </label>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                <Tag className="w-4 h-4" style={{ color: 'var(--theme-primary, #059669)' }} /> Punya Kode Promo / Kupon?
              </h3>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input 
                  type="text" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Contoh: EXAMIGO10" 
                  className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-mono font-bold uppercase focus:outline-none focus:border-[var(--theme-primary)]"
                />
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-white font-bold text-xs transition-colors cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: 'var(--theme-primary-dark, #064E3B)' }}
                >
                  Gunakan
                </button>
              </form>

              {couponSuccess && (
                <p className="text-[11px] font-bold" style={{ color: 'var(--theme-primary, #059669)' }}>{couponSuccess}</p>
              )}
              {couponError && (
                <p className="text-[11px] font-bold text-red-600">{couponError}</p>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="md:col-span-5">
            <div className="p-6 md:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 sticky top-6">
              <h3 className="font-black text-slate-900 text-sm border-b border-slate-100 pb-3">Ringkasan Pesanan</h3>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-3 text-xs text-slate-600 font-medium">
                <div className="flex justify-between items-center">
                  <span>Paket</span>
                  <span className="font-black text-slate-900 flex items-center gap-1">
                    {selectedPlan === 'PRO_AI' ? (
                      <>
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Pro
                      </>
                    ) : (
                      <>
                        <User className="w-3.5 h-3.5 text-slate-500" /> Personal
                      </>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Periode Billing</span>
                  <span className="font-bold text-slate-900">{billingCycle === 'YEARLY' ? 'Tahunan' : 'Bulanan'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Harga Normal</span>
                  <span className="font-mono font-bold text-slate-900">Rp {rawPrice.toLocaleString('id-ID')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between font-bold" style={{ color: 'var(--theme-primary, #059669)' }}>
                    <span>Diskon Promo</span>
                    <span className="font-mono">- Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>Biaya Layanan</span>
                  <span className="font-mono font-bold" style={{ color: 'var(--theme-primary, #059669)' }}>
                    {serviceFee > 0 ? `Rp ${serviceFee.toLocaleString('id-ID')}` : 'Rp 0 (Gratis)'}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-3.5 flex justify-between items-center">
                  <span className="font-black text-slate-900 text-sm">Total Bayar</span>
                  <span className="font-black text-xl" style={{ color: 'var(--theme-primary-dark, #064E3B)' }}>
                    Rp {finalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {Boolean(cmsConfig?.maintenance?.features?.payments) && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-bold flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-amber-900">Layanan Pembayaran Sedang Dipelihara</p>
                    <p className="text-[11px] font-medium text-amber-800 mt-0.5">
                      Sistem transaksi dan checkout Midtrans sedang dalam pemeliharaan rutin. Silakan coba kembali beberapa saat lagi.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit CTA Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={loading || Boolean(cmsConfig?.maintenance?.features?.payments)}
                className={`w-full py-4 rounded-2xl text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                  cmsConfig?.maintenance?.features?.payments
                    ? 'bg-amber-600 opacity-80 cursor-not-allowed'
                    : 'cursor-pointer disabled:opacity-50 active:scale-95 hover:opacity-90'
                }`}
                style={!cmsConfig?.maintenance?.features?.payments ? { backgroundColor: 'var(--theme-primary, #10B981)' } : undefined}
              >
                {loading ? (
                  <>Memproses Checkout...</>
                ) : cmsConfig?.maintenance?.features?.payments ? (
                  <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Pembayaran Dalam Pemeliharaan</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> Lanjut Pembayaran (Midtrans)
                  </>
                )}
              </button>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-[10px] text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-[var(--theme-primary, #059669)] shrink-0" />
                <span>Pembayaran aman dengan enkripsi SSL via Midtrans Payment Gateway.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
