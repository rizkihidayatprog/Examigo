import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check } from 'lucide-react';
import { useToast } from '../Toast';

interface DynamicQRCodeProps {
  value: string;
  size?: number;
  title?: string;
  subtitle?: string;
  showActions?: boolean;
  color?: string;
}

export default function DynamicQRCode({
  value,
  size = 200,
  title,
  subtitle,
  showActions = true,
  color,
}: DynamicQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [dataUrl, setDataUrl] = useState<string>('');
  const { showToast } = useToast();

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    // Use current theme color or provided color
    const darkColor = color || getComputedStyle(document.documentElement).getPropertyValue('--theme-primary-dark').trim() || '#064E3B';

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 2,
        color: {
          dark: darkColor,
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      },
      (error) => {
        if (error) {
          console.error('QR Code Generation Error:', error);
        } else if (canvasRef.current) {
          setDataUrl(canvasRef.current.toDataURL('image/png'));
        }
      }
    );
  }, [value, size, color]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    showToast('Link ujian berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = async () => {
    try {
      // Create high-res offscreen canvas (800 x 1000)
      const width = 800;
      const height = 1000;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Extract Exam Code if present in value
      const examCodeMatch = value.match(/EXAM-[A-Z0-9]+/i);
      const examCode = examCodeMatch ? examCodeMatch[0].toUpperCase() : '';

      // Generate high-resolution QR matrix (440px)
      const qrCanvas = document.createElement('canvas');
      await QRCode.toCanvas(qrCanvas, value, {
        width: 440,
        margin: 1,
        color: {
          dark: '#0F172A', // Slate-900 for ultra-sharp contrast
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      });

      // Background - Crisp Clean Card
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Top Header Bars (Institutional Navy + Emerald Accent)
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, width, 18);
      ctx.fillStyle = '#10B981';
      ctx.fillRect(0, 18, width, 6);

      // Outer border
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, width - 4, height - 4);

      // Brand Logo & System Text
      ctx.textAlign = 'center';

      // Brand Pill
      ctx.fillStyle = '#059669';
      ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('EXAMIGO', width / 2, 68);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('RUANG UJIAN ONLINE & EVALUASI DIGITAL', width / 2, 92);

      // Thin divider
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(80, 114);
      ctx.lineTo(width - 80, 114);
      ctx.stroke();

      // Exam Title / Heading
      const displayTitle = title || 'Pindai QR untuk Mulai Ujian';
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(displayTitle, width / 2, 155);

      ctx.fillStyle = '#475569';
      ctx.font = 'normal 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(subtitle || 'Arahkan kamera HP Anda ke kode QR di bawah ini', width / 2, 182);

      // QR Code Container Box with Subtle Frame
      const boxSize = 480;
      const boxX = (width - boxSize) / 2;
      const boxY = 210;

      ctx.fillStyle = '#F8FAFC';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;

      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxSize, boxSize, 20);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(boxX, boxY, boxSize, boxSize);
        ctx.strokeRect(boxX, boxY, boxSize, boxSize);
      }

      // Draw QR Canvas inside container
      const qrOffset = (boxSize - 440) / 2;
      ctx.drawImage(qrCanvas, boxX + qrOffset, boxY + qrOffset, 440, 440);

      // Token / Kode Akses Box
      if (examCode) {
        const codeBoxW = 460;
        const codeBoxH = 80;
        const codeBoxX = (width - codeBoxW) / 2;
        const codeBoxY = 720;

        ctx.fillStyle = '#0F172A';
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(codeBoxX, codeBoxY, codeBoxW, codeBoxH, 16);
          ctx.fill();
        } else {
          ctx.fillRect(codeBoxX, codeBoxY, codeBoxW, codeBoxH);
        }

        ctx.fillStyle = '#94A3B8';
        ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('KODE AKSES UJIAN', width / 2, codeBoxY + 28);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 30px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
        ctx.fillText(examCode, width / 2, codeBoxY + 62);
      } else {
        ctx.fillStyle = '#0F172A';
        ctx.font = '600 15px ui-monospace, monospace';
        ctx.fillText(value, width / 2, 750);
      }

      // Quick Step Guidance
      ctx.fillStyle = '#64748B';
      ctx.font = 'normal 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('Buka kamera HP atau browser → Scan QR Code → Masukkan data diri Anda', width / 2, 840);

      // Footer divider
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 880);
      ctx.lineTo(width - 80, 880);
      ctx.stroke();

      // Footer Brand
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'normal 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('Platform Ujian & Asesmen Digital Examigo • Dilengkapi Proteksi Anti-Kecurangan', width / 2, 915);
      ctx.fillText('examigo.id', width / 2, 938);

      // Download
      const cardDataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = cardDataUrl;
      a.download = `Examigo-QR-${examCode || Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Kartu QR Code resmi berhasil diunduh!', 'success');
    } catch (err) {
      console.error('Failed to generate high-res QR card:', err);
      if (dataUrl) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `Examigo-QR-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {title && (
        <div className="text-center">
          <h4 className="text-sm font-black text-slate-900">{title}</h4>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      )}

      {/* QR Code Container */}
      <div 
        style={{ 
          borderColor: 'var(--theme-border, #A7F3D0)',
          backgroundColor: '#FFFFFF',
        }}
        className="p-3 rounded-2xl border-2 shadow-sm flex items-center justify-center relative overflow-hidden"
      >
        <canvas ref={canvasRef} className="rounded-lg max-w-full h-auto block" />
      </div>

      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-1">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 min-w-[120px] py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadQR}
            style={{ 
              backgroundColor: 'var(--theme-mint-light, #ECFDF5)',
              color: 'var(--theme-primary, #059669)',
              borderColor: 'var(--theme-border, #A7F3D0)'
            }}
            className="flex-1 min-w-[120px] py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:opacity-90 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh QR</span>
          </button>
        </div>
      )}
    </div>
  );
}
