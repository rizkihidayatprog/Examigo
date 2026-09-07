import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';
import Footer from '../components/Footer';
import SEO from '../components/common/SEO';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <SEO
        title="Kebijakan Privasi"
        description="Kebijakan privasi Examigo mengenai pengumpulan, penyimpanan, keamanan data pengguna, dan perlindungan privasi peserta ujian."
        canonical="https://examigo.id/privacy"
      />
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in-fast">
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-700 transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Kebijakan Privasi</h1>
              <p className="text-xs text-slate-500 font-medium">Terakhir diperbarui: 12 Agustus 2026</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed font-medium">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">1. Informasi yang Kami Kumpulkan</h2>
            <p>
              Kami mengumpulkan informasi pendaftaran seperti Nama Lengkap, Alamat Email, serta Data Transaksi Langganan. Selama pengisian ujian, kami mengumpulkan data teknis pengerjaan peserta (seperti durasi waktu, jawaban yang dipilih, dan logs keamanan anti-cheat).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">2. Pengolahan Data oleh Smart Engine</h2>
            <p>
              Materi dokumen (PDF/DOCX/PPT) yang diunggah ke fitur **Generator Soal** diproses secara aman menggunakan Google Gemini API via enkripsi HTTPS end-to-end. Teks dokumen Anda digunakan secara *transient* hanya untuk meracik butir soal dan tidak digunakan untuk melatih model publik secara eksternal.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">3. Keamanan Data & Penyimpanan</h2>
            <p>
              Seluruh basis data disimpan pada basis infrastruktur terenkripsi Supabase PostgreSQL dengan standar keamanan SSL/TLS. Kata sandi pengguna disimpan dalam bentuk *hash* yang tidak dapat dibaca kembali (*bcrypt* dengan salt round 10).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900">4. Pembagian Data Pihak Ketiga</h2>
            <p>
              Examigo **tidak menjual** data pribadi Anda kepada pihak mana pun. Data hanya dibagikan kepada penyedia layanan terintegrasi yang tepercaya untuk operasional langsung: *Midtrans Payment Gateway* (untuk pemrosesan transaksi pembayaran resmi) dan penyedia SMTP email transaksional.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
