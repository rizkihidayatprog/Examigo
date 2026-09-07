const API_BASE = '/api';

export interface PaymentDetails {
  channel: 'BCA_VA' | 'BNI_VA' | 'BRI_VA' | 'PERMATA_VA' | 'MANDIRI_VA' | 'QRIS' | string;
  bank?: string;
  bankName?: string;
  vaNumber?: string;
  billKey?: string;
  billerCode?: string;
  qrCodeUrl?: string;
  qrString?: string;
  expiryTime?: string;
  isProduction?: boolean;
}

export interface CheckoutResult {
  success: boolean;
  orderId: string;
  amount: number;
  baseAmount?: number;
  uniqueCode?: number;
  plan: 'PERSONAL' | 'PRO_AI';
  paymentUrl: string;
  gateway?: 'MIDTRANS' | 'BITS_QRIS';
  paymentMethod?: string;
  paymentDetails?: PaymentDetails;
  snapToken?: string;
  isProduction?: boolean;
  clientKey?: string;
  qrDataUrl?: string;
  dynamicQris?: string;
  merchantName?: string;
  merchantCity?: string;
  instructions?: string;
  expiryMinutes?: number;
  message?: string;
  autoPaid?: boolean;
}

export const loadMidtransSnap = (
  isProduction: boolean = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true',
  clientKey?: string
): Promise<void> => {
  return new Promise((resolve) => {
    const cKey = clientKey || import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'Mid-client-DXxW43_G0huL7fSm';
    const targetSrc = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';

    // Cari semua script Snap yang ada (baik dengan ID maupun querySelector URL)
    const existingScripts = document.querySelectorAll<HTMLScriptElement>('script[src*="midtrans.com/snap"]');
    let hasExactScript = false;

    existingScripts.forEach((s) => {
      if (s.src === targetSrc && (window as any).snap) {
        hasExactScript = true;
      } else {
        s.remove();
        delete (window as any).snap;
      }
    });

    if (hasExactScript && (window as any).snap) {
      return resolve();
    }

    const script = document.createElement('script');
    script.id = 'midtrans-snap-js';
    script.src = targetSrc;
    script.setAttribute('data-client-key', cKey);
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      console.error('Failed to load Midtrans snap.js');
      resolve();
    };
    document.head.appendChild(script);
  });
};

export const processCheckout = async (
  plan: 'PERSONAL' | 'PRO_AI',
  billingCycle: 'MONTHLY' | 'YEARLY',
  user: { id?: string; email: string; name: string },
  couponCode?: string,
  gateway?: 'MIDTRANS' | 'BITS_QRIS',
  paymentMethod?: string
): Promise<CheckoutResult> => {
  try {
    const token = localStorage.getItem('examigo_token');

    const response = await fetch('/api/payments/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        plan,
        billingCycle,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        couponCode,
        gateway,
        paymentMethod,
      })
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Gagal memproses pembayaran');
    }

    return data;
  } catch (err: any) {
    throw err;
  }
};

// Aliased for backward compatibility
export const processMidtransCheckout = (
  plan: 'PERSONAL' | 'PRO_AI',
  billingCycle: 'MONTHLY' | 'YEARLY',
  user: { id?: string; email: string; name: string },
  couponCode?: string,
  paymentMethod?: string
) => processCheckout(plan, billingCycle, user, couponCode, 'MIDTRANS', paymentMethod);

export const processPakasirCheckout = processMidtransCheckout;

export async function checkPaymentStatus(orderId: string, verify: boolean = false) {
  const url = verify 
    ? `${API_BASE}/payments/status/${orderId}?verify=true` 
    : `${API_BASE}/payments/status/${orderId}`;
  const response = await fetch(url);
  return await response.json();
}

export const checkMidtransPaymentStatus = checkPaymentStatus;
export const checkPakasirPaymentStatus = checkPaymentStatus;

export async function confirmQrisPayment(
  orderId: string, 
  details?: { senderName?: string; senderBank?: string; notes?: string }
) {
  const response = await fetch(`${API_BASE}/payments/confirm-qris/${orderId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify(details || {}),
  });
  return await response.json();
}

export async function simulateSandboxPayment(orderId: string) {
  const response = await fetch(`${API_BASE}/payments/simulate-sandbox/${orderId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
  return await response.json();
}
