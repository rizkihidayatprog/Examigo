import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import Footer from '../components/Footer';
import SEO from '../components/common/SEO';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <SEO
        title="Syarat dan Ketentuan Layanan"
        description="Pelajari syarat dan ketentuan penggunaan platform Examigo, kebijakan lisensi akun, hak cipta materi ujian, dan tanggung jawab pengguna."
        canonical="https://examigo.id/terms"
      />
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in-fast">
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-700 transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Syarat dan Ketentuan Layanan</h1>
              <p className="text-xs text-slate-500 font-medium">Terakhir diperbarui: 12 Agustus 2026</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed font-medium">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">1. Ketentuan Umum</h2>
            <p>
              Dengan mendaftar, mengakses, atau menggunakan layanan <strong>Examigo</strong>, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Layanan ini dirancang untuk memfasilitasi pembuatan soal otomatis, manajemen bank soal, serta pelaksanaan ujian online bagi pengajar dan lembaga pendidikan.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">2. Akun dan Keamanan</h2>
            <p>
              Pengguna bertanggung jawab penuh atas kerahasiaan informasi akun, termasuk kata sandi dan token akses. Setiap aktivitas yang terjadi di bawah akun Anda menjadi tanggung jawab Anda secara hukum.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">3. Langganan dan Pembayaran</h2>
            <p>
              Examigo menawarkan paket langganan bertingkat (Free, Personal, Pro). Pembayaran diproses secara aman melalui penyedia gerbang pembayaran terverifikasi (*Midtrans Payment Gateway*). Seluruh biaya langganan yang tercantum adalah dalam mata uang Rupiah (IDR).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">4. Hak Kekayaan Intelektual & Konten</h2>
            <p>
              Seluruh materi pembelajaran, dokumen, dan bank soal yang diunggah oleh pengajar tetap menjadi hak milik penuh pengajar/lembaga bersangkutan. Examigo tidak akan pernah menjual atau membagikan dokumen internal Anda ke pihak ketiga tanpa izin tertulis.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">5. Penggunaan Layanan Secara Sah</h2>
            <p>
              Pengguna dilarang memanfaatkan platform untuk menyebarkan materi yang melanggar hukum, ujaran kebencian, atau melakukan peretasan sistem (DDoS/Reverse Engineering).
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
