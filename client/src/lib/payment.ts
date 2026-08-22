const API_BASE = '/api';

export interface CheckoutResult {
  success: boolean;
  orderId: string;
  amount: number;
  plan: 'PERSONAL' | 'PRO_AI';
  paymentUrl: string;
  message?: string;
  autoPaid?: boolean;
}

export const processPakasirCheckout = async (plan: 'PERSONAL' | 'PRO_AI', billingCycle: 'MONTHLY' | 'YEARLY', user: { id?: string, email: string, name: string }, couponCode?: string): Promise<CheckoutResult> => {
  try {
    const token = localStorage.getItem('examigo_token');
    
    const response = await fetch('/api/payments/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
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
    throw new Error(data.message || 'Gagal memproses pembayaran Pakasir');
  }

  return data;
  } catch (err: any) {
    throw err;
  }
}

export async function checkPakasirPaymentStatus(orderId: string) {
  const response = await fetch(`${API_BASE}/payments/status/${orderId}`);
  return await response.json();
}
