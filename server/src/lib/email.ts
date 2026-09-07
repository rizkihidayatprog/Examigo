import nodemailer from 'nodemailer';

// Transporter instance
let transporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  } else {
    // Generate Ethereal test account dynamically for development
    try {
      console.log('✉️ No SMTP configuration found. Creating temporary Ethereal test account...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`✉️ Ethereal SMTP test account created. User: ${testAccount.user}`);
    } catch (err) {
      console.error('Failed to create Ethereal test account:', err);
      // Fallback dummy transporter
      transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  }

  return transporter;
}

export async function sendPasswordResetEmail(email: string, name: string, resetToken: string) {
  const mailer = await getTransporter();
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  const html = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 24px; font-weight: 800;">Examigo ⚡</h1>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Platform Pembuat Soal & Ujian Online Otomatis</p>
      </div>

      <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #f1f5f9; margin-bottom: 24px;">
        <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin-top: 0;">Permintaan Atur Ulang Kata Sandi</h2>
        <p style="color: #334155; font-size: 14px; leading-height: 1.6;">Halo <strong>${name}</strong>,</p>
        <p style="color: #334155; font-size: 14px; leading-height: 1.6;">Kami menerima permintaan untuk mengatur ulang kata sandi akun Examigo Anda. Klik tombol di bawah ini untuk membuat kata sandi baru:</p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">Atur Ulang Kata Sandi</a>
        </div>

        <p style="color: #64748b; font-size: 12px;">Tautan ini berlaku selama <strong>1 jam</strong>. Jika Anda tidak merasa meminta ini, silakan abaikan email ini.</p>
      </div>

      <div style="text-align: center; color: #94a3b8; font-size: 11px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Examigo Inc. Hak Cipta Dilindungi Undang-Undang.</p>
      </div>
    </div>
  `;

  const info = await mailer.sendMail({
    from: '"Examigo Support" <support@examigo.id>',
    to: email,
    subject: '🔑 Instruksi Atur Ulang Kata Sandi Akun Examigo',
    html,
  });

  console.log(`✉️ Email sent successfully! MessageId: ${info.messageId}`);
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`✉️ Ethereal Email Preview URL: ${previewUrl}`);
  }
}

export async function sendPaymentReceiptEmail(email: string, name: string, planName: string, amountFormatted: string, validUntilFormatted: string) {
  const mailer = await getTransporter();

  const html = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 24px; font-weight: 800;">Examigo ⚡</h1>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Bukti Pembayaran & Pembelian Paket</p>
      </div>

      <div style="background-color: #f0fdf4; padding: 24px; border-radius: 12px; border: 1px solid #bbf7d0; margin-bottom: 24px;">
        <h2 style="color: #166534; font-size: 18px; font-weight: 700; margin-top: 0;">Pembayaran Berhasil Dijurnal! 🎉</h2>
        <p style="color: #15803d; font-size: 14px;">Halo <strong>${name}</strong>, terima kasih telah berlangganan di Examigo.</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px;">
          <tr style="border-bottom: 1px solid #dcfce7;">
            <td style="padding: 8px 0; color: #166534; font-weight: 600;">Paket Langganan</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #15803d;">${planName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dcfce7;">
            <td style="padding: 8px 0; color: #166534; font-weight: 600;">Total Dibayar</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #15803d;">${amountFormatted}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #166534; font-weight: 600;">Aktif Sampai</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #15803d;">${validUntilFormatted}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">Masuk ke Dashboard</a>
      </div>
    </div>
  `;

  const info = await mailer.sendMail({
    from: '"Examigo Billing" <billing@examigo.id>',
    to: email,
    subject: `✅ Bukti Pembayaran Paket ${planName} - Examigo`,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`✉️ Ethereal Email Preview URL: ${previewUrl}`);
  }
}

export async function sendSubscriptionExpiryWarningEmail(email: string, name: string, planName: string, validUntilFormatted: string) {
  const mailer = await getTransporter();

  const html = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 24px; font-weight: 800;">Examigo ⚡</h1>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Pemberitahuan Masa Aktif Langganan</p>
      </div>

      <div style="background-color: #fffbeb; padding: 24px; border-radius: 12px; border: 1px solid #fef3c7; margin-bottom: 24px;">
        <h2 style="color: #92400e; font-size: 18px; font-weight: 700; margin-top: 0;">Masa Aktif Paket Berakhir Segera! ⚠️</h2>
        <p style="color: #78350f; font-size: 14px; leading-height: 1.6;">Halo <strong>${name}</strong>,</p>
        <p style="color: #78350f; font-size: 14px; leading-height: 1.6;">Paket langganan <strong>${planName}</strong> Anda akan kedaluwarsa pada <strong>${validUntilFormatted}</strong>. Lakukan perpanjangan untuk terus menikmati fitur Generator Soal dan Anti-Cheat tanpa hambatan.</p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout" style="background-color: #d97706; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">Perpanjang Paket Sekarang</a>
        </div>
      </div>
    </div>
  `;

  const info = await mailer.sendMail({
    from: '"Examigo Notification" <no-reply@examigo.id>',
    to: email,
    subject: `⚠️ Pengingat: Masa Aktif Paket ${planName} Hampir Habis`,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`✉️ Ethereal Email Preview URL: ${previewUrl}`);
  }
}
