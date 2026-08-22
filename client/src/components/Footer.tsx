import React from 'react';
import { Link } from 'react-router-dom';
import ExamigoLogo from './common/ExamigoLogo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-12 px-4 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-1">
          <ExamigoLogo size="md" />
          <p className="text-[11px] leading-relaxed text-slate-400">
            Platform Pembuat Soal & Ujian Online Berbasis AI Terdepan di Indonesia. Ujian Aman, Otomatis, dan Terstruktur.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Produk</h4>
          <ul className="space-y-2 font-medium">
            <li><Link to="/#fitur" className="hover:text-white transition-colors">AI Generator Soal</Link></li>
            <li><Link to="/#harga" className="hover:text-white transition-colors">Paket & Harga</Link></li>
            <li><Link to="/#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</Link></li>
            <li><Link to="/exam/DEMO123" className="hover:text-white transition-colors">Demo Ruang Ujian</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Legal & Kepatuhan</h4>
          <ul className="space-y-2 font-medium">
            <li><Link to="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link></li>
            <li><Link to="/refund-policy" className="hover:text-white transition-colors">Kebijakan Refund</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Bantuan & Kontak</h4>
          <ul className="space-y-2 font-medium">
            <li><Link to="/contact" className="hover:text-white transition-colors">Hubungi Kami</Link></li>
            <li><a href="mailto:support@examigo.id" className="hover:text-white transition-colors font-mono">support@examigo.id</a></li>
            <li className="pt-2 text-[11px] text-slate-500">
              Gerbang Pembayaran Terverifikasi oleh <strong>Pakasir API</strong>.
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-800/80 text-center text-[11px] text-slate-500 font-medium">
        &copy; {new Date().getFullYear()} Examigo SaaS Platform. Hak Cipta Dilindungi Undang-Undang.
      </div>
    </footer>
  );
}
