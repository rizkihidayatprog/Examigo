import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  Clock, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import ExamigoLogo from '../components/common/ExamigoLogo';
import { 
  checkPaymentStatus, 
  PaymentDetails 
} from '../lib/payment';
import SEO from '../components/common/SEO';

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const checkoutData = location.state?.checkoutData;
  const initialMethod = checkoutData?.paymentMethod || (orderId?.includes('QRIS') ? 'QRIS' : 'QRIS');

  const [paymentMethod, setPaymentMethod] = useState<string>(initialMethod);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(checkoutData?.paymentDetails || null);
  const [status, setStatus] = useState<string>('PENDING');
  
  // Payment info states
  const [amount, setAmount] = useState<number>(checkoutData?.amount ?? 0);
  const [uniqueCode, setUniqueCode] = useState<number>(checkoutData?.uniqueCode || 0);
  const [plan, setPlan] = useState<string>(checkoutData?.plan || 'PERSONAL');
  const [billingCycle, setBillingCycle] = useState<string>(checkoutData?.billingCycle || 'MONTHLY');
  const [qrDataUrl, setQrDataUrl] = useState<string>(checkoutData?.qrDataUrl || checkoutData?.paymentDetails?.qrCodeUrl || '');

  // UI helpers
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);
  const [copiedVa, setCopiedVa] = useState<boolean>(false);
  const [copiedBillKey, setCopiedBillKey] = useState<boolean>(false);
  const [copiedBillerCode, setCopiedBillerCode] = useState<boolean>(false);
  const [instructionTab, setInstructionTab] = useState<'mbanking' | 'ibanking' | 'atm'>('mbanking');
  const [timeLeft, setTimeLeft] = useState<string>('23:59:59');

  // Format numbers with space grouping (e.g. 6602 5197 4817 8046)
  const formatAccountNumber = (num?: string) => {
    if (!num) return '';
    return num.replace(/(.{4})/g, '$1 ').trim();
  };

  // Live 24-hour countdown timer
  useEffect(() => {
    let targetDate = new Date();
    if (paymentDetails?.expiryTime) {
      targetDate = new Date(paymentDetails.expiryTime.replace(' ', 'T'));
    } else {
      targetDate.setHours(targetDate.getHours() + 24);
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [paymentDetails?.expiryTime]);

  // Silent status check & automatic redirection on payment success
  const checkStatusSilently = async () => {
    if (!orderId) return;
    try {
      const res = await checkPaymentStatus(orderId);

      if (res.amount) setAmount(res.amount);
      if (res.plan) setPlan(res.plan);
      if (res.paymentMethod) setPaymentMethod(res.paymentMethod);
      if (res.paymentDetails) setPaymentDetails(res.paymentDetails);
      if (res.qrDataUrl) setQrDataUrl(res.qrDataUrl);

      if (res.status === 'PAID') {
        setStatus('PAID');
        setTimeout(() => {
          navigate('/payment/success', { 
            state: { 
              orderId, 
              plan: res.plan || plan, 
              amount: res.amount || amount 
            } 
          });
        }, 800);
      } else {
        setStatus(res.status || 'PENDING');
      }
    } catch (err) {
      // Silent catch for background polling
    }
  };

  // Auto-poll status periodically every 3 seconds (completely automatic, no manual action required)
  useEffect(() => {
    if (!orderId) return;

    checkStatusSilently();

    const interval = setInterval(() => {
      if (status !== 'PAID') {
        checkStatusSilently();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, status]);

  // Copy helpers
  const handleCopyAmount = () => {
    navigator.clipboard.writeText(String(amount));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleCopyOrderId = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleCopyVa = () => {
    const va = paymentDetails?.vaNumber;
    if (!va) return;
    navigator.clipboard.writeText(va);
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 2000);
  };

  const handleCopyBillKey = () => {
    const key = paymentDetails?.billKey;
    if (!key) return;
    navigator.clipboard.writeText(key);
    setCopiedBillKey(true);
    setTimeout(() => setCopiedBillKey(false), 2000);
  };

  const handleCopyBillerCode = () => {
    const code = paymentDetails?.billerCode;
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedBillerCode(true);
    setTimeout(() => setCopiedBillerCode(false), 2000);
  };

  // Download QR Code Image
  const handleDownloadQr = () => {
    const src = qrDataUrl || paymentDetails?.qrCodeUrl;
    if (!src) return;
    const link = document.createElement('a');
    link.href = src;
    link.download = `QRIS-Examigo-${orderId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Determine Channel Mode
  const isVirtualAccount = ['BCA_VA', 'BNI_VA', 'BRI_VA', 'PERMATA_VA'].includes(paymentMethod) || Boolean(paymentDetails?.vaNumber);
  const isMandiri = paymentMethod === 'MANDIRI_VA' || Boolean(paymentDetails?.billKey);
  const isQris = paymentMethod === 'QRIS' || paymentMethod === 'QRIS_BITS' || (!isVirtualAccount && !isMandiri);

  // Bank display info
  const getBankBadge = () => {
    switch (paymentMethod) {
      case 'BCA_VA':
        return { name: 'Bank Central Asia', code: 'BCA', bg: 'bg-blue-700 text-white' };
      case 'MANDIRI_VA':
        return { name: 'Bank Mandiri', code: 'MANDIRI', bg: 'bg-blue-950 text-amber-400' };
      case 'BNI_VA':
        return { name: 'Bank Negara Indonesia', code: 'BNI', bg: 'bg-teal-800 text-orange-300' };
      case 'BRI_VA':
        return { name: 'Bank Rakyat Indonesia', code: 'BRI', bg: 'bg-blue-600 text-white' };
      case 'PERMATA_VA':
        return { name: 'Bank Permata', code: 'PERMATA', bg: 'bg-emerald-800 text-white' };
      default:
        return { name: 'Virtual Account Bank', code: 'VA', bg: 'bg-slate-800 text-white' };
    }
  };

  const bankInfo = getBankBadge();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased py-10 px-4 sm:px-6">
      <SEO title="Pembayaran Langganan" noindex={true} />
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Header & Navigation */}
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

        {/* Main Payment Container Card */}
        <div className="p-6 md:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          
          {/* Header & Status Indicator */}
          <div className="text-center space-y-3 border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black border uppercase tracking-wider bg-emerald-50 text-emerald-800 border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Menunggu Pembayaran</span>
            </div>

            <h2 className="text-2xl font-black text-slate-900">Selesaikan Pembayaran Anda</h2>
            
            {/* Order ID & Countdown */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <span>Order ID:</span>
                <span className="font-mono font-bold text-slate-900">{orderId}</span>
                <button 
                  type="button" 
                  onClick={handleCopyOrderId} 
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors"
                  title="Salin Order ID"
                >
                  {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Batas Waktu: {timeLeft}</span>
              </div>
            </div>
          </div>

          {/* Amount Summary Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block font-medium">Total Nominal Transfer</span>
                <span className="text-2xl font-black" style={{ color: 'var(--theme-primary-dark, #064E3B)' }}>
                  Rp {amount.toLocaleString('id-ID')}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyAmount}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                {copiedAmount ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 text-xs font-bold">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin Nominal</span>
                  </>
                )}
              </button>
            </div>

            {uniqueCode > 0 && (
              <div className="text-[11px] text-amber-800 bg-amber-100/70 p-2.5 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Termasuk kode unik verifikasi: <strong>+Rp {uniqueCode}</strong>. Mohon transfer tepat hingga 3 digit terakhir.</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 text-slate-600">
              <span>Paket Terpilih:</span>
              <span className="font-extrabold text-slate-900">
                {plan === 'PRO_AI' ? '⭐ Paket Pro' : '👤 Paket Personal'} ({billingCycle === 'YEARLY' ? 'Tahunan' : 'Bulanan'})
              </span>
            </div>
          </div>

          {/* ========================================================== */}
          {/* VIEW 1: VIRTUAL ACCOUNT (BCA, BNI, BRI, PERMATA)           */}
          {/* ========================================================== */}
          {isVirtualAccount && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-1 rounded-md font-black text-xs tracking-wider ${bankInfo.bg}`}>
                      {bankInfo.code}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{bankInfo.name}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Virtual Account</span>
                </div>

                <div className="space-y-1.5 relative z-10 pt-2">
                  <span className="text-[11px] text-slate-400 block font-medium">Nomor Virtual Account:</span>
                  <div className="flex items-center justify-between gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                    <span className="font-mono text-lg sm:text-xl font-black text-white tracking-widest">
                      {formatAccountNumber(paymentDetails?.vaNumber) || 'Menyiapkan nomor VA...'}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyVa}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      {copiedVa ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin No. VA</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 relative z-10">
                  <span>Nama Rekening / Merchant:</span>
                  <span className="text-slate-200 font-bold">Examigo Edu Platform</span>
                </div>
              </div>

              {/* Tabbed Step-by-Step Payment Instructions */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <button
                    type="button"
                    onClick={() => setInstructionTab('mbanking')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      instructionTab === 'mbanking' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    m-Banking (Aplikasi HP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstructionTab('ibanking')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      instructionTab === 'ibanking' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Internet Banking
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstructionTab('atm')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      instructionTab === 'atm' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    ATM
                  </button>
                </div>

                {instructionTab === 'mbanking' && (
                  <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 font-medium leading-relaxed">
                    <li>Buka dan masuk ke aplikasi mobile banking ({bankInfo.name}).</li>
                    <li>Pilih menu <strong>Transfer</strong> &gt; <strong>Virtual Account</strong>.</li>
                    <li>Masukkan Nomor Virtual Account: <strong className="font-mono text-slate-900">{paymentDetails?.vaNumber}</strong>.</li>
                    <li>Periksa rincian tagihan (<strong>Rp {amount.toLocaleString('id-ID')}</strong>) dan nama merchant (<strong>Examigo</strong>).</li>
                    <li>Masukkan PIN Anda untuk menyelesaikan pembayaran. Transaksi akan terverifikasi otomatis.</li>
                  </ol>
                )}

                {instructionTab === 'ibanking' && (
                  <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 font-medium leading-relaxed">
                    <li>Buka browser dan login ke portal Internet Banking ({bankInfo.name}).</li>
                    <li>Pilih menu <strong>Transfer Dana</strong> &gt; <strong>Transfer ke Virtual Account</strong>.</li>
                    <li>Masukkan Nomor Virtual Account: <strong className="font-mono text-slate-900">{paymentDetails?.vaNumber}</strong>.</li>
                    <li>Pastikan nominal pembayaran adalah <strong>Rp {amount.toLocaleString('id-ID')}</strong>.</li>
                    <li>Konfirmasi dengan Token / Pengaman transaksi Anda.</li>
                  </ol>
                )}

                {instructionTab === 'atm' && (
                  <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 font-medium leading-relaxed">
                    <li>Masukkan kartu ATM dan 6 digit PIN Anda.</li>
                    <li>Pilih menu <strong>Transaksi Lainnya</strong> &gt; <strong>Pembayaran / Transfer</strong> &gt; <strong>Ke Rek Virtual Account</strong>.</li>
                    <li>Masukkan Nomor Virtual Account: <strong className="font-mono text-slate-900">{paymentDetails?.vaNumber}</strong>.</li>
                    <li>Periksa data tagihan, lalu pilih <strong>Ya / Benar</strong> untuk memproses pembayaran.</li>
                  </ol>
                )}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* VIEW 2: MANDIRI BILL PAYMENT                               */}
          {/* ========================================================== */}
          {isMandiri && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-md font-black text-xs tracking-wider bg-blue-950 text-amber-400">
                      MANDIRI
                    </span>
                    <span className="text-xs font-bold text-slate-200">Bank Mandiri (Bill Payment)</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">E-Channel</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 relative z-10">
                  {/* Biller Code */}
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Kode Perusahaan (Biller):</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg font-black text-amber-400 tracking-wider">
                        {paymentDetails?.billerCode || '70012'}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyBillerCode}
                        className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                        title="Salin Kode Perusahaan"
                      >
                        {copiedBillerCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Bill Key */}
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Nomor Pembayaran (Bill Key):</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-black text-white tracking-wider">
                        {paymentDetails?.billKey || 'Menyiapkan bill key...'}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyBillKey}
                        className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                        title="Salin Bill Key"
                      >
                        {copiedBillKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 relative z-10">
                  <span>Nama Merchant:</span>
                  <span className="text-slate-200 font-bold">Examigo / Midtrans</span>
                </div>
              </div>

              {/* Mandiri Step Instructions */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 text-xs block">Cara Bayar via Livin' by Mandiri:</span>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 font-medium">
                  <li>Buka aplikasi <strong>Livin' by Mandiri</strong> dan login.</li>
                  <li>Pilih menu <strong>Bayar</strong> &gt; ketik kode penyedia jasa <strong>{paymentDetails?.billerCode || '70012'}</strong> (Midtrans / Examigo).</li>
                  <li>Masukkan Nomor Pembayaran (Bill Key): <strong className="font-mono text-slate-900">{paymentDetails?.billKey}</strong>.</li>
                  <li>Periksa detail tagihan (<strong>Rp {amount.toLocaleString('id-ID')}</strong>) lalu selesaikan dengan PIN Livin'.</li>
                </ol>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* VIEW 3: QRIS DINAMIS (MIDTRANS / BITS-QRIS)                */}
          {/* ========================================================== */}
          {isQris && (
            <div className="space-y-6">
              <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
                
                {/* Official QRIS Header */}
                <div className="flex items-center justify-between max-w-xs mx-auto border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded bg-red-600 text-white font-black text-[9px] flex items-center justify-center">
                      QRIS
                    </div>
                    <span className="text-xs font-black text-slate-800 tracking-wider">QRIS STANDAR NASIONAL</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">GPN</span>
                </div>

                {/* QR Image Box */}
                <div className="inline-block p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-sm">
                  {qrDataUrl || paymentDetails?.qrCodeUrl ? (
                    <img 
                      src={qrDataUrl || paymentDetails?.qrCodeUrl} 
                      alt="QRIS Examigo" 
                      className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl mx-auto"
                    />
                  ) : (
                    <div className="w-56 h-56 sm:w-64 sm:h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
                      <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                      <span className="text-xs font-bold">Membuat QRIS Dinamis...</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Unduh Gambar QR</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 font-medium">
                  Scan dari BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay, LinkAja, atau aplikasi perbankan apa saja.
                </p>
              </div>
            </div>
          )}

          {/* Automatic Payment Detection Bar */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-center gap-2.5 text-xs text-emerald-800 font-semibold text-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span>Menunggu pembayaran. Halaman ini akan otomatis diperbarui dan beralih begitu transfer Anda terkonfirmasi.</span>
          </div>

          {/* Security Guarantee Footer */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-[10px] text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Enkripsi 256-bit SSL aktif. Transaksi diproses secara otomatis, aman, dan resmi oleh Examigo.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
