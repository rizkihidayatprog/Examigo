import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Footer from '../components/Footer';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in-fast">
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Kebijakan Pengembalian Dana (Refund)</h1>
              <p className="text-xs text-slate-500 font-medium">Terakhir diperbarui: 12 Agustus 2026</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed font-medium">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">1. Ketentuan Garansi 7-Hari</h2>
            <p>
              Kami ingin Anda merasa yakin dengan investasi pendidikan Anda di Examigo. Oleh karena itu, kami memberikan **Garansi Uang Kembali 100% (7-Day Money-Back Guarantee)** untuk pembelian pertama paket langganan berbayar (Personal maupun Pro AI).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">2. Syarat Pengajuan Refund</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Pengajuan refund dilakukan maksimal **7 hari kalender** setelah tanggal transaksi sukses.</li>
              <li>Akun tidak terbukti melakukan pelanggaran berat terhadap Syarat & Ketentuan Layanan (seperti aktivitas peretasan atau penyalahgunaan kuota berlebihan secara tidak wajar).</li>
              <li>Pengajuan disampaikan secara resmi melalui halaman **Hubungi Kami** atau email ke `support@examigo.id` menyertakan Kode Transaksi/Order ID.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">3. Proses Pencairan Dana</h2>
            <p>
              Setelah pengajuan disetujui, dana akan dikembalikan ke rekening atau dompet digital (*E-Wallet*) asal dalam waktu **3 hingga 5 hari kerja** sesuai ketentuan bank atau gerbang pembayaran Pakasir.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
