import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { api } from '../../lib/auth';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Riwayat Transaksi</h2>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">ID Transaksi / Tanggal</th>
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Paket</th>
                <th className="px-6 py-4 text-right">Jumlah (Rp)</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Memuat transaksi...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Tidak ada riwayat transaksi</td>
                </tr>
              ) : (
                transactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-slate-300 truncate w-32" title={trx.id}>{trx.id}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{new Date(trx.createdAt).toLocaleString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{trx.user?.name || 'Unknown User'}</div>
                      <div className="text-xs text-slate-500">{trx.user?.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-indigo-400">{trx.plan}</span>
                      <div className="text-[10px] text-slate-500">{trx.billingCycle === 'ANNUAL' ? 'Tahunan' : 'Bulanan'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-200">{formatCurrency(trx.amount)}</div>
                      <div className="text-[10px] text-slate-500">{trx.paymentMethod || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {trx.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                        </span>
                      ) : trx.status === 'PENDING' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-bold text-xs">
                          <Clock className="w-3.5 h-3.5" /> PENDING
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 text-red-400 font-bold text-xs">
                          <XCircle className="w-3.5 h-3.5" /> {trx.status}
                        </span>
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
