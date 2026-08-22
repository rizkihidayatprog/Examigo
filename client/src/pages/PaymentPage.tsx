import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { CreditCard, CheckCircle2, RefreshCw, ArrowLeft, ShieldCheck, QrCode, Building, Wallet } from 'lucide-react';
import ExamigoLogo from '../components/common/ExamigoLogo';
import { checkPakasirPaymentStatus } from '../lib/payment';

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const checkoutData = location.state?.checkoutData;
  const [status, setStatus] = useState<string>('PENDING');
  const [checking, setChecking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>(checkoutData?.paymentUrl || '');
  const [amount, setAmount] = useState<number>(checkoutData?.amount || 49000);
  const [plan, setPlan] = useState<string>(checkoutData?.plan || 'PERSONAL');

  // Verify status on load & periodic check
  const verifyStatus = async () => {
    if (!orderId) return;
    try {
      setChecking(true);
      setStatusMessage('Memeriksa konfirmasi pembayaran di server Pakasir...');
      const res = await checkPakasirPaymentStatus(orderId);
      
      if (res.amount) setAmount(res.amount);
      if (res.plan) setPlan(res.plan);
      if (res.paymentUrl) setPaymentUrl(res.paymentUrl);

      if (res.status === 'PAID') {
        setStatus('PAID');
        setStatusMessage('🎉 Pembayaran Lunas! Mengalihkan ke halaman sukses...');
        setTimeout(() => {
          navigate('/payment/success', { state: { orderId, plan: res.plan || plan, amount: res.amount || amount } });
        }, 1500);
      } else {
        setStatus('PENDING');
        setStatusMessage('Status: Menunggu Pembayaran. Silakan selesaikan transaksi di portal Pakasir.');
      }
    } catch (err: any) {
      setStatusMessage('Gagal mengecek status pembayaran. Pastikan koneksi internet stabil.');
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    verifyStatus();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/landing">
            <ExamigoLogo size="md" />
          </Link>
          <Link to="/checkout" className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Checkout
          </Link>
        </div>

        {/* 3-Step Wizard */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>01. Pilihan Paket</span>
          </div>
          <div className="h-0.5 bg-indigo-600 flex-1 mx-4 hidden sm:block" />
          <div className="flex items-center gap-2 text-indigo-600">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
            <span>02. Pembayaran</span>
          </div>
          <div className="h-0.5 bg-slate-200 flex-1 mx-4 hidden sm:block" />
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">3</span>
            <span>03. Selesai</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
          
          <div className="text-center space-y-2 border-b border-slate-100 pb-5">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold border border-indigo-100 uppercase tracking-wider">
              Pakasir Payment Gateway
            </span>
            <h2 className="text-2xl font-black text-slate-900">Pembayaran Sesi Ujian</h2>
            <p className="text-xs text-slate-500 font-medium">Order ID: <span className="font-mono font-bold text-slate-800">{orderId}</span></p>
          </div>

          {/* Order Details */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Paket Terpilih</span>
              <span className="font-bold text-slate-900">{plan === 'PRO_AI' ? '⭐ Pro AI' : '👤 Personal'}</span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <span>Total Pembayaran</span>
              <span className="font-black text-indigo-700 text-lg">
                Rp {amount.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-500 text-[11px] border-t border-slate-200/80 pt-2">
              <span>Status Transaksi</span>
              <span className={`font-extrabold uppercase ${status === 'PAID' ? 'text-emerald-600' : 'text-amber-600 animate-pulse'}`}>
                ● {status === 'PAID' ? 'LUNAS (PAID)' : 'MENUNGGU PEMBAYARAN'}
              </span>
            </div>
          </div>

          {/* Supported Methods */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">Pilihan Metode Pembayaran Terintegrasi:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-2.5">
                <QrCode className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">QRIS All Payment</p>
                  <p className="text-[10px] text-slate-400">GoPay, OVO, DANA, ShopeePay</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-2.5">
                <Building className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Virtual Account</p>
                  <p className="text-[10px] text-slate-400">BCA, BNI, BRI, Mandiri</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-2.5">
                <Wallet className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">E-Wallet Instan</p>
                  <p className="text-[10px] text-slate-400">Verifikasi Otomatis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Alert Banner */}
          {statusMessage && (
            <div className={`p-4 rounded-2xl text-xs font-bold text-center ${
              status === 'PAID' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}>
              {statusMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {paymentUrl && (
              <a
                href={paymentUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs text-center block shadow-md transition-all cursor-pointer"
              >
                💳 Lanjutkan Bayar di Pakasir (QRIS / Bank)
              </a>
            )}

            <button
              onClick={verifyStatus}
              disabled={checking}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Memeriksa Server...' : 'Cek Status Pembayaran Terkini'}
            </button>
          </div>

          {/* Security Notice */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-2 text-[10px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Verifikasi pembayaran diproses secara aman oleh server Pakasir.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
