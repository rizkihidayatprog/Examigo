const API_BASE = '/api';

export interface CheckoutResult {
  success: boolean;
  orderId: string;
  amount: number;
  plan: 'PERSONAL' | 'PRO_AI';
  paymentUrl: string;
  snapToken?: string;
  isProduction?: boolean;
  clientKey?: string;
  message?: string;
  autoPaid?: boolean;
}

export const loadMidtransSnap = (isProduction: boolean = false, clientKey?: string): Promise<void> => {
  return new Promise((resolve) => {
    const cKey = clientKey || import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'Mid-client-DXxW43_G0huL7fSm';
    const targetSrc = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';

    const existingScript = document.getElementById('midtrans-snap-js') as HTMLScriptElement | null;
    if (existingScript) {
      if (existingScript.src === targetSrc && (window as any).snap) {
        return resolve();
      }
      existingScript.remove();
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

export const processMidtransCheckout = async (
  plan: 'PERSONAL' | 'PRO_AI',
  billingCycle: 'MONTHLY' | 'YEARLY',
  user: { id?: string; email: string; name: string },
  couponCode?: string
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
        couponCode
      })
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Gagal memproses pembayaran Midtrans');
    }

    return data;
  } catch (err: any) {
    throw err;
  }
};

// Aliased for backward compatibility
export const processPakasirCheckout = processMidtransCheckout;

export async function checkMidtransPaymentStatus(orderId: string) {
  const response = await fetch(`${API_BASE}/payments/status/${orderId}`);
  return await response.json();
}

// Aliased for backward compatibility
export const checkPakasirPaymentStatus = checkMidtransPaymentStatus;
