import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, Clock, QrCode, Check, Ban, Loader2 } from 'lucide-react';
import { api } from '../../lib/auth';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [approvingAll, setApprovingAll] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    setLoading(true);
    api('/admin/transactions')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTransactions(data.data);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleApprove = async (orderId: string) => {
    if (!confirm(`Konfirmasi persetujuan pembayaran untuk pesanan ${orderId}? Benefit paket pengguna akan langsung aktif.`)) {
      return;
    }
    try {
      setProcessingId(orderId);
      const res = await api(`/admin/transactions/${orderId}/approve`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        fetchTransactions();
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal menyetujui transaksi' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan koneksi' });
    } finally {
      setProcessingId(null);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleApproveAll = async () => {
    const pendingCount = transactions.filter(t => t.status === 'PENDING').length;
    if (pendingCount === 0) {
      alert('Tidak ada transaksi PENDING untuk disetujui.');
      return;
    }
    if (!confirm(`Setujui sekaligus seluruh (${pendingCount}) transaksi PENDING dan aktifkan paket pengguna sekarang?`)) {
      return;
    }
    try {
      setApprovingAll(true);
      const res = await api('/admin/transactions/approve-all', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        fetchTransactions();
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal menyetujui semua transaksi' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan koneksi' });
    } finally {
      setApprovingAll(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleReject = async (orderId: string) => {
    if (!confirm(`Tolak dan tandai transaksi ${orderId} sebagai GAGAL?`)) {
      return;
    }
    try {
      setProcessingId(orderId);
      const res = await api(`/admin/transactions/${orderId}/reject`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        fetchTransactions();
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal menolak transaksi' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan koneksi' });
    } finally {
      setProcessingId(null);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  const filteredTransactions = transactions.filter((trx) => {
    if (filterStatus === 'ALL') return true;
    return trx.status === filterStatus;
  });

  const pendingTransactionsCount = transactions.filter(t => t.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Riwayat Transaksi</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar seluruh transaksi langganan dan kuota tambahan pengguna Examigo.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {pendingTransactionsCount > 0 && (
            <button
              type="button"
              onClick={handleApproveAll}
              disabled={approvingAll}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              title="Setujui seluruh transaksi PENDING sekaligus"
            >
              {approvingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Setujui Semua Pending ({pendingTransactionsCount})</span>
            </button>
          )}

          {/* Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'PENDING', 'PAID', 'FAILED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  filterStatus === st
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'ALL' ? 'Semua' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">ID Transaksi / Tanggal</th>
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Paket & Tipe</th>
                <th className="px-6 py-4">Gateway</th>
                <th className="px-6 py-4 text-right">Jumlah (Rp)</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Memuat transaksi...</td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Tidak ada transaksi dengan status {filterStatus === 'ALL' ? '' : filterStatus}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-900/30 transition-colors">
                    {/* Order ID & Time */}
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-slate-200 font-bold truncate w-36" title={trx.orderId || trx.id}>
                        {trx.orderId || trx.id}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {new Date(trx.createdAt).toLocaleString('id-ID')}
                      </div>
                    </td>

                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{trx.user?.name || 'Unknown User'}</div>
                      <div className="text-xs text-slate-500">{trx.user?.email || '-'}</div>
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-300">
                        {trx.transactionType === 'ADDON' ? 'Top-Up Addon' : trx.plan}
                      </span>
                      <div className="text-[10px] text-slate-500">
                        {trx.transactionType === 'ADDON'
                          ? 'Kuota Satuan'
                          : trx.billingCycle === 'YEARLY'
                          ? 'Tahunan'
                          : 'Bulanan'}
                      </div>
                    </td>

                    {/* Payment Gateway Badge */}
                    <td className="px-6 py-4">
                      {trx.paymentMethod === 'QRIS_BITS' || (trx.orderId && trx.orderId.includes('QRIS')) ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 font-bold text-[11px] border border-rose-500/20">
                          <QrCode className="w-3.5 h-3.5 text-rose-400" />
                          QRIS (bits-qris)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold text-[11px] border border-blue-500/20">
                          <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                          Midtrans
                        </span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right">
                      <div className="font-extrabold text-slate-200">{formatCurrency(trx.amount)}</div>
                      {trx.discountAmt > 0 && (
                        <div className="text-[10px] text-emerald-400">Diskon: -{formatCurrency(trx.discountAmt)}</div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      {trx.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                        </span>
                      ) : trx.status === 'PENDING' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-bold text-xs border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" /> PENDING
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 font-bold text-xs border border-red-500/20">
                          <XCircle className="w-3.5 h-3.5" /> {trx.status}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      {trx.status === 'PENDING' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApprove(trx.orderId)}
                            disabled={processingId === trx.orderId}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            title="Setujui dan aktifkan paket sekarang"
                          >
                            {processingId === trx.orderId ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            <span>Setujui</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReject(trx.orderId)}
                            disabled={processingId === trx.orderId}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                            title="Tolak Transaksi"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-600">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
