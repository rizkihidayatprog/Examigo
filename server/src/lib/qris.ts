import { convertQris, validateQris, makeQrDataUrl, getMerchantInfo } from 'bits-qris';
import { getCmsConfig } from '../routes/cms';

export interface MerchantInfoResult {
  nmid?: string;
  merchantName?: string;
  merchantCity?: string;
  crcIsValid?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  merchantInfo?: MerchantInfoResult;
}

export interface DynamicQrisResult {
  dynamicQris: string;
  qrDataUrl: string;
  amount: number;
  merchantName?: string;
  merchantCity?: string;
  nmid?: string;
}

// Default fallback sample static QRIS if not yet set
export const DEFAULT_SAMPLE_STATIC_QRIS = 
  '00020101021126570011ID.DANA.WWW011893600915300729047402090072904740303UMI51440014ID.CO.QRIS.WWW0215ID10264948401700303UMI5204573253033605802ID5913RizkilluaTech6012Kab. Cirebon6105451526304874E';

/**
 * Mendapatkan konfigurasi QRIS aktif dari CMS atau Environment Variable
 */
export function getActiveQrisConfig() {
  const cmsConfig = getCmsConfig();
  const qrisConf = cmsConfig?.paymentGateway?.qris || {};

  const staticQris = (
    qrisConf.staticQris || 
    process.env.QRIS_STATIC_STRING || 
    DEFAULT_SAMPLE_STATIC_QRIS
  ).trim();

  return {
    enabled: qrisConf.enabled !== false,
    staticQris,
    merchantName: qrisConf.merchantName || 'RizkilluaTech',
    merchantCity: qrisConf.merchantCity || 'Kab. Cirebon',
    useUniqueCode: qrisConf.useUniqueCode !== false, // default true
    autoApprove: qrisConf.autoApprove !== false, // default true: otomatis setujui ketika user bayar & konfirmasi
    expiryMinutes: qrisConf.expiryMinutes || 30,
    instructions: qrisConf.instructions || 
      '1. Buka aplikasi m-Banking atau E-Wallet (BCA, Mandiri, GoPay, OVO, Dana, ShopeePay, dll).\n2. Scan QR Code dinamis di atas.\n3. Pastikan nominal transfer sesuai hingga 3 digit terakhir.\n4. Selesaikan pembayaran dan klik tombol "Saya Sudah Bayar".',
  };
}

/**
 * Memvalidasi string QRIS Statis dan mengambil metadata merchant
 */
export function validateStaticQrisString(qrisString: string): ValidationResult {
  const cleanQris = (qrisString || '').trim();
  if (!cleanQris) {
    return { valid: false, errors: ['String QRIS tidak boleh kosong'] };
  }

  try {
    const valResult = validateQris(cleanQris);
    if (!valResult.valid) {
      return {
        valid: false,
        errors: valResult.errors || ['Format QRIS tidak sesuai standar EMVCo / GPN'],
      };
    }

    const merchant = getMerchantInfo(cleanQris);
    return {
      valid: true,
      errors: [],
      merchantInfo: {
        nmid: merchant.nmid,
        merchantName: merchant.merchantName,
        merchantCity: merchant.merchantCity,
        crcIsValid: merchant.crcIsValid,
      },
    };
  } catch (err: any) {
    return {
      valid: false,
      errors: [err.message || 'Gagal memvalidasi string QRIS'],
    };
  }
}

/**
 * Mengonversi string QRIS statis menjadi string QRIS dinamis dengan nominal tertentu
 * serta menghasilkan gambar QR Code DataURL (base64) siap render
 */
export async function generateDynamicQris(
  staticQris: string,
  amount: number
): Promise<DynamicQrisResult> {
  const cleanQris = (staticQris || '').trim();
  if (!cleanQris) {
    throw new Error('String QRIS statis belum dikonfigurasikan');
  }

  // 1. Validasi QRIS dasar
  const validation = validateStaticQrisString(cleanQris);
  if (!validation.valid) {
    throw new Error(`String QRIS tidak valid: ${validation.errors.join(', ')}`);
  }

  // 2. Generate dynamic string dengan bits-qris
  const dynamicQris = convertQris(cleanQris, { amount });

  // 3. Generate base64 DataURL
  const qrDataUrl = await makeQrDataUrl(cleanQris, { amount });

  return {
    dynamicQris,
    qrDataUrl,
    amount,
    merchantName: validation.merchantInfo?.merchantName,
    merchantCity: validation.merchantInfo?.merchantCity,
    nmid: validation.merchantInfo?.nmid,
  };
}
