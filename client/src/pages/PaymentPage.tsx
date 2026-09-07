import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, RefreshCw, ArrowLeft, ShieldCheck, ExternalLink, Sparkles, CreditCard } from 'lucide-react';
import ExamigoLogo from '../components/common/ExamigoLogo';
import { checkMidtransPaymentStatus, loadMidtransSnap } from '../lib/payment';

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const checkoutData = location.state?.checkoutData;
  const [status, setStatus] = useState<string>('PENDING');
  const [checking, setChecking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>(checkoutData?.paymentUrl || '');
  const [snapToken, setSnapToken] = useState<string>(checkoutData?.snapToken || '');
  const [amount, setAmount] = useState<number>(checkoutData?.amount || 49000);
  const [plan, setPlan] = useState<string>(checkoutData?.plan || 'PERSONAL');

  // Verify status on load & periodic check
  const verifyStatus = async () => {
    if (!orderId) return;
    try {
      setChecking(true);
      setStatusMessage('Memeriksa konfirmasi status di server Midtrans...');
      const res = await checkMidtransPaymentStatus(orderId);

      if (res.amount) setAmount(res.amount);
      if (res.plan) setPlan(res.plan);
      if (res.paymentUrl) setPaymentUrl(res.paymentUrl);
      if (res.snapToken) setSnapToken(res.snapToken);

      if (res.status === 'PAID') {
        setStatus('PAID');
        setStatusMessage('🎉 Pembayaran Lunas! Mengalihkan ke halaman sukses...');
        setTimeout(() => {
          navigate('/payment/success', { state: { orderId, plan: res.plan || plan, amount: res.amount || amount } });
        }, 1500);
      } else {
        setStatus('PENDING');
        setStatusMessage('Status: Menunggu Pembayaran. Silakan selesaikan transaksi melalui Midtrans.');
      }
    } catch (err: any) {
      setStatusMessage('Gagal mengecek status pembayaran. Pastikan koneksi internet stabil.');
    } finally {
      setChecking(false);
    }
  };

  // Trigger Midtrans Snap popup
  const handleOpenSnap = async () => {
    const tokenToUse = snapToken || checkoutData?.snapToken;
    const isProd = checkoutData?.isProduction ?? (import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true');
    await loadMidtransSnap(isProd, checkoutData?.clientKey);

    if (tokenToUse && window.snap) {
      window.snap.pay(tokenToUse, {
        onSuccess: (result: any) => {
          setStatus('PAID');
          setStatusMessage('🎉 Pembayaran berhasil dikonfirmasi oleh Midtrans!');
          setTimeout(() => {
            navigate('/payment/success', { state: { orderId, plan, amount } });
          }, 1200);
        },
        onPending: (result: any) => {
          setStatusMessage('Status: Menunggu pembayaran diselesaikan...');
          verifyStatus();
        },
        onError: (result: any) => {
          setStatusMessage('Terjadi kendala saat memproses transaksi di Midtrans.');
        },
        onClose: () => {
          verifyStatus();
        }
      });
    } else if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    } else {
      verifyStatus();
    }
  };

  useEffect(() => {
    verifyStatus();
  }, [orderId]);

  // Auto trigger snap popup once if available and not yet paid
  useEffect(() => {
    if (snapToken && status !== 'PAID' && window.snap) {
      // Small timeout to allow render
      const timer = setTimeout(() => {
        handleOpenSnap();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [snapToken]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <Link to="/landing">
            <ExamigoLogo size="md" />
          </Link>
          <Link to="/checkout" className="text-xs font-bold text-slate-500 hover:opacity-80 flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" style={{ color: 'var(--theme-primary, #059669)' }} /> Kembali ke Checkout
          </Link>
        </div>

        {/* 3-Step Wizard */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2" style={{ color: 'var(--theme-primary, #059669)' }}>
            <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--theme-primary, #059669)' }} />
            <span className="font-extrabold text-slate-900">01. Pilihan Paket</span>
          </div>
          <div className="h-0.5 flex-1 mx-4 hidden sm:block" style={{ backgroundColor: 'var(--theme-primary, #10B981)' }} />
          <div className="flex items-center gap-2.5" style={{ color: 'var(--theme-primary-dark, #064E3B)' }}>
            <span className="w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-black" style={{ backgroundColor: 'var(--theme-primary-dark, #064E3B)' }}>2</span>
            <span className="font-extrabold text-slate-900">02. Pembayaran</span>
          </div>
          <div className="h-0.5 bg-slate-200 flex-1 mx-4 hidden sm:block" />
          <div className="flex items-center gap-2.5 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">3</span>
            <span>03. Selesai</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="p-8 md:p-10 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
          
          <div className="text-center space-y-2 border-b border-slate-100 pb-5">
            <span 
              className="px-3.5 py-1 rounded-full text-xs font-black border uppercase tracking-wider inline-flex items-center gap-1.5"
              style={{
                backgroundColor: 'var(--theme-mint-light, #ECFDF5)',
                color: 'var(--theme-primary-dark, #064E3B)',
                borderColor: 'var(--theme-border, #A7F3D0)'
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Midtrans Payment Gateway
            </span>
            <h2 className="text-2xl font-black text-slate-900">Selesaikan Pembayaran</h2>
            <p className="text-xs text-slate-500 font-medium">Order ID: <span className="font-mono font-bold text-slate-900">{orderId}</span></p>
          </div>

          {/* Order Details */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Paket Terpilih</span>
              <span className="font-black text-slate-900">{plan === 'PRO_AI' ? '⭐ Paket Pro' : '👤 Personal'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Total Tagihan</span>
              <span className="text-base font-black" style={{ color: 'var(--theme-primary-dark, #064E3B)' }}>Rp {amount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Metode Pembayaran Tersedia</span>
              <span className="font-bold text-slate-800">QRIS, BCA / Mandiri / BNI / BRI VA, GoPay, ShopeePay</span>
            </div>
          </div>

          {/* Payment Actions */}
          <div className="space-y-3 text-center">
            {snapToken ? (
              <button
                type="button"
                onClick={handleOpenSnap}
                className="w-full py-4 rounded-2xl text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-90"
                style={{ backgroundColor: 'var(--theme-primary, #10B981)' }}
              >
                <CreditCard className="w-4 h-4" />
                <span>Buka Pop-up Pembayaran Midtrans</span>
              </button>
            ) : null}

            {paymentUrl ? (
              <a
                href={paymentUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buka Link Pembayaran Midtrans (Tab Baru)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : null}

            <p className="text-[11px] text-slate-500 font-medium">
              Setelah menyelesaikan pembayaran di Midtrans, sistem akan memverifikasi status Anda secara otomatis. Anda juga dapat menekan tombol di bawah.
            </p>
          </div>

          {/* Manual Status Check Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={verifyStatus}
              disabled={checking}
              className="flex-1 py-3.5 rounded-xl bg-white border-2 border-slate-200 hover:border-[var(--theme-primary)] text-slate-800 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} style={{ color: 'var(--theme-primary, #059669)' }} />
              {checking ? 'Memeriksa...' : 'Cek Status Pembayaran'}
            </button>
          </div>

          {statusMessage && (
            <p className="text-xs text-center font-bold" style={{ color: status === 'PAID' ? 'var(--theme-primary, #059669)' : '#64748B' }}>
              {statusMessage}
            </p>
          )}

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-[10px] text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: 'var(--theme-primary, #059669)' }} />
            <span>Enkripsi 256-bit SSL aktif. Transaksi diproses resmi dan aman via Midtrans Payment Gateway.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
