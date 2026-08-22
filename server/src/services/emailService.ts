import nodemailer from 'nodemailer';

interface SendResultEmailOptions {
  studentName: string;
  studentEmail: string;
  examTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  minPassingScore: number;
}

let transporterInstance: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporterInstance) return transporterInstance;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    console.log(`✉️ Using configured SMTP server: ${host}:${port}`);
    transporterInstance = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  } else {
    console.log('✉️ No SMTP configuration found. Creating temporary Ethereal test account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log(`✉️ Ethereal SMTP test account created. User: ${testAccount.user}`);
      transporterInstance = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (err) {
      console.error('❌ Failed to create Ethereal SMTP account, falling back to dummy console transport:', err);
      // Dummy console log transport
      transporterInstance = {
        sendMail: async (mailOptions: any) => {
          console.log('✉️ [DUMMY SMTP LOG]:\n', JSON.stringify(mailOptions, null, 2));
          return { messageId: 'dummy-id' };
        },
      } as any;
    }
  }

  return transporterInstance!;
}

export async function sendResultEmail(options: SendResultEmailOptions): Promise<boolean> {
  try {
    const transporter = await getTransporter();

    const fromName = 'Examigo Platform';
    const fromEmail = process.env.SMTP_USER || 'no-reply@examigo.com';

    const subject = `Hasil Ujian: ${options.examTitle} - Examigo`;

    const statusBadgeColor = options.isPassed ? '#10b981' : '#ef4444';
    const statusText = options.isPassed ? 'LULUS' : 'TIDAK LULUS';

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #4f6bf6; text-align: center; margin-bottom: 24px;">Hasil Ujian Online - Examigo</h2>
        <p>Halo <strong>${options.studentName}</strong>,</p>
        <p>Terima kasih telah mengikuti ujian di platform Examigo. Berikut adalah ringkasan hasil ujian Anda:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Nama Ujian</td>
              <td style="padding: 6px 0; font-weight: bold; font-size: 14px; text-align: right;">${options.examTitle}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Nilai Anda</td>
              <td style="padding: 6px 0; font-weight: bold; font-size: 14px; text-align: right; color: #4f6bf6;">${options.percentage}%</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Passing Grade</td>
              <td style="padding: 6px 0; font-weight: bold; font-size: 14px; text-align: right;">${options.minPassingScore}%</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Total Skor (Poin)</td>
              <td style="padding: 6px 0; font-weight: bold; font-size: 14px; text-align: right;">${options.score} / ${options.maxScore}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0 0 0; color: #64748b; font-size: 14px;">Status Ujian</td>
              <td style="padding: 10px 0 0 0; font-weight: bold; font-size: 14px; text-align: right;">
                <span style="background-color: ${statusBadgeColor}; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                  ${statusText}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <p style="font-size: 14px; color: #64748b; line-height: 1.5;">
          ${options.isPassed 
            ? 'Selamat atas kelulusan Anda! Tetap pertahankan prestasi belajar Anda.' 
            : 'Jangan berkecil hati. Anda dapat mempelajari kembali materi ujian dan mencoba lagi di kesempatan berikutnya.'}
        </p>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">
          Email ini dikirim secara otomatis oleh Examigo. Harap tidak membalas email ini.
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: options.studentEmail,
      subject,
      html: htmlContent,
    });

    console.log(`✉️ Email sent successfully! MessageId: ${info.messageId}`);
    
    // If it's an Ethereal SMTP account, log the preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`✉️ Ethereal Email Preview URL: ${previewUrl}`);
    }

    return true;
  } catch (err) {
    console.error('❌ Failed to send result email:', err);
    return false;
  }
}
