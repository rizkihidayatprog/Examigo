import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Check, ArrowLeft, ShieldCheck, Tag, CreditCard, User, Star } from 'lucide-react';
import ExamigoLogo from '../components/common/ExamigoLogo';
import { useAuth } from '../lib/auth';
import { processPakasirCheckout } from '../lib/payment';

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

  // Base Prices
  const basePrices = {
    PERSONAL: { MONTHLY: 49000, YEARLY: 490000 },
    PRO_AI: { MONTHLY: 149000, YEARLY: 1490000 },
  };

  const rawPrice = basePrices[selectedPlan][billingCycle];
  const finalPrice = Math.max(0, rawPrice - discountAmount);

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
        // Redirect to register with return checkout link
        navigate(`/register?redirect=checkout&plan=${selectedPlan.toLowerCase()}&billing=${billingCycle.toLowerCase()}`);
        return;
      }

      // Create transaction via backend Pakasir endpoint
      // We pass couponCode so backend validates it again and sets correct amount
      const result = await processPakasirCheckout(
        selectedPlan, 
        billingCycle,
        user || { id: '', email: 'pengajar@examigo.com', name: 'Pengajar Examigo' },
        appliedCouponCode || undefined
      );

      if (result.autoPaid) {
        navigate('/payment/success', { state: { orderId: result.orderId, plan: selectedPlan, amount: 0 } });
      } else {
        // Navigate to /payment/:orderId
        navigate(`/payment/${result.orderId}`, { state: { checkoutData: result } });
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memproses checkout. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header & Logo */}
        <div className="flex items-center justify-between">
          <Link to="/landing">
            <ExamigoLogo size="md" />
          </Link>
          <Link to="/landing#harga" className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Landing Page
          </Link>
        </div>

        {/* 3-Step Progress Bar Wizard */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2 text-indigo-600">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
            <span>01. Pilihan Paket</span>
          </div>
          <div className="h-0.5 bg-slate-200 flex-1 mx-4 hidden sm:block" />
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">2</span>
            <span>02. Pembayaran</span>
          </div>
          <div className="h-0.5 bg-slate-200 flex-1 mx-4 hidden sm:block" />
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">3</span>
            <span>03. Selesai</span>
          </div>
        </div>

        {/* Main Grid: Left Options, Right Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Plan & Billing Selector */}
          <div className="md:col-span-7 space-y-5">
            
            {/* 1. Select Plan Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm">1. Pilih Paket Langganan</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Personal Option */}
                <div 
                  onClick={() => setSelectedPlan('PERSONAL')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan === 'PERSONAL'
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-600" /> Personal
                    </span>
                    {selectedPlan === 'PERSONAL' && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <p className="text-xs font-black text-slate-900">
                    Rp 49.000 <span className="text-[10px] font-normal text-slate-500">/ bln</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">100 AI Questions, 50 Peserta</p>
                </div>

                {/* Pro AI Option */}
                <div 
                  onClick={() => setSelectedPlan('PRO_AI')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                    selectedPlan === 'PRO_AI'
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full">POPULER</span>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-indigo-600 fill-current" /> Pro AI
                    </span>
                    {selectedPlan === 'PRO_AI' && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <p className="text-xs font-black text-indigo-600">
                    Rp 149.000 <span className="text-[10px] font-normal text-slate-500">/ bln</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">300 AI Questions, AI Vision & Essay</p>
                </div>
              </div>
            </div>

            {/* 2. Select Billing Cycle */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm">2. Periode Penagihan</h3>
              
              <div className="space-y-2.5">
                {/* Monthly */}
                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  billingCycle === 'MONTHLY' ? 'border-indigo-600 bg-indigo-50/30 font-bold' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="billingCycle" 
                      checked={billingCycle === 'MONTHLY'} 
                      onChange={() => setBillingCycle('MONTHLY')} 
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-slate-800">Penagihan Bulanan</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    Rp {selectedPlan === 'PRO_AI' ? '149.000' : '49.000'} / bln
                  </span>
                </label>

                {/* Yearly */}
                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  billingCycle === 'YEARLY' ? 'border-indigo-600 bg-indigo-50/30 font-bold' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="billingCycle" 
                      checked={billingCycle === 'YEARLY'} 
                      onChange={() => setBillingCycle('YEARLY')} 
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs text-slate-800 block">Penagihan Tahunan</span>
                      <span className="text-[10px] text-emerald-600 font-extrabold">
                        Hemat Rp {selectedPlan === 'PRO_AI' ? '298.000' : '98.000'} (2 Bulan Gratis)
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-indigo-600">
                    Rp {selectedPlan === 'PRO_AI' ? '1.490.000' : '490.000'} / thn
                  </span>
                </label>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-indigo-600" /> Punya Kode Promo / Kupon?
              </h3>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input 
                  type="text" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Contoh: EXAMIGO10" 
                  className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-indigo-600"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Gunakan
                </button>
              </form>

              {couponSuccess && (
                <p className="text-[11px] font-bold text-emerald-600">{couponSuccess}</p>
              )}
              {couponError && (
                <p className="text-[11px] font-bold text-red-600">{couponError}</p>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="md:col-span-5">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5 sticky top-6">
              <h3 className="font-black text-slate-900 text-sm border-b border-slate-100 pb-3">Ringkasan Pesanan</h3>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Paket</span>
                  <span className="font-bold text-slate-900">{selectedPlan === 'PRO_AI' ? '⭐ Pro AI' : '👤 Personal'}</span>
                </div>

                <div className="flex justify-between">
                  <span>Periode Billing</span>
                  <span className="font-bold text-slate-900">{billingCycle === 'YEARLY' ? 'Tahunan' : 'Bulanan'}</span>
                </div>

                <div className="flex justify-between">
                  <span>Harga Normal</span>
                  <span className="font-mono text-slate-900">Rp {rawPrice.toLocaleString('id-ID')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Diskon Promo</span>
                    <span className="font-mono">- Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>Biaya Layanan Pakasir</span>
                  <span className="font-mono">Rp 0 (Gratis)</span>
                </div>

                <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                  <span className="font-extrabold text-slate-900 text-sm">Total Bayar</span>
                  <span className="font-black text-indigo-700 text-lg">
                    Rp {finalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>Memproses Checkout...</>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> Lanjut Pembayaran (Pakasir)
                  </>
                )}
              </button>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-[10px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pembayaran aman dengan enkripsi SSL via Pakasir Payment Gateway.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
