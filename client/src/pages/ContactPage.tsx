import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, MessageSquare, PhoneCall, HelpCircle } from 'lucide-react';
import Footer from '../components/Footer';
import SEO from '../components/common/SEO';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <SEO
        title="Hubungi Kami"
        description="Hubungi tim Examigo untuk pertanyaan seputar platform ujian CBT, kendala teknis, konsultasi kerjasama sekolah, atau paket institusi."
        canonical="https://examigo.id/contact"
      />
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in-fast w-full">
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-700 transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Hubungi Tim Examigo</h1>
              <p className="text-xs text-slate-500 font-medium">Kami siap membantu pertanyaan, kendala pembayaran, atau kerjasama sekolah.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Cards */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Email Dukungan</h3>
              <p className="text-xs text-edu-electric font-bold font-mono">support@examigo.id</p>
              <p className="text-[11px] text-slate-500 font-medium">Respons dalam 1x24 jam kerja.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-edu-sage flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">WhatsApp Center</h3>
              <p className="text-xs text-edu-sage font-bold font-mono">+62 812-3456-7890</p>
              <p className="text-[11px] text-slate-500 font-medium">Senin - Jumat (08.00 - 17.00 WIB)</p>
            </div>

            <div className="p-5 rounded-2xl bg-edu-navy text-white shadow-md space-y-2">
              <HelpCircle className="w-6 h-6 text-slate-300" />
              <h3 className="text-sm font-bold">Layanan Enterprise?</h3>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                Ingin integrasi Examigo untuk seluruh sekolah/kampus Anda? Kontak kami untuk penawaran khusus.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            {submitted ? (
              <div className="p-8 text-center space-y-4 animate-fade-in-fast">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Pesan Berhasil Terkirim!</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Terima kasih telah menghubungi kami. Tim Support Examigo akan segera menghubungi Anda melalui email dalam kurun waktu 1x24 jam.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage(''); }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 mb-2">Kirimkan Pesan Langsung</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Nama Anda</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-slate-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Alamat Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@domain.com"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-slate-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Subjek / Topik</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Contoh: Pertanyaan Paket Pro / Kendala Bayar"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-slate-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Isi Pesan / Kendala</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan pesan Anda secara detail..."
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-slate-600 transition-colors leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-slate-600 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md min-h-[48px] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Kirim Pesan Sekarang'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
