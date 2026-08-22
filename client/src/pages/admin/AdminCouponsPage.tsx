import React, { useEffect, useState } from 'react';
import { Tag, Plus, CheckCircle2, XCircle, Trash2, Edit2, Wand2 } from 'lucide-react';
import { api } from '../../lib/auth';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '',
    discountPercent: 10,
    maxUses: 0,
    validUntil: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = () => {
    setLoading(true);
    api('/coupons')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCoupons(data.data);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({ code: '', discountPercent: 10, maxUses: 0, validUntil: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (coupon: any) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      maxUses: coupon.maxUses || 0,
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 16) : ''
    });
    setShowModal(true);
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'PROMO-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm(prev => ({ ...prev, code: result }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        code: form.code,
        discountPercent: Number(form.discountPercent),
        maxUses: Number(form.maxUses) || null,
        validUntil: form.validUntil ? new Date(form.validUntil).toISOString() : null,
      };

      if (editingId) {
        // Only sending updatable fields, code can't be updated (we send it but backend ignores)
        const res = await api(`/coupons/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) fetchCoupons();
        else alert(data.message);
      } else {
        const res = await api('/coupons', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) fetchCoupons();
        else alert(data.message);
      }
      setShowModal(false);
    } catch (err) {
      alert('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Yakin ingin menonaktifkan kupon ini?`)) return;
    try {
      const res = await api(`/coupons/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await res.json();
      if (data.success) fetchCoupons();
    } catch (err) {
      alert('Error toggling status');
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Hapus kupon ini selamanya?')) return;
    try {
      const res = await api(`/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchCoupons();
    } catch (err) {
      alert('Error deleting');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Promo & Kupon</h2>
          <p className="text-slate-400 text-sm mt-1">Kelola kode diskon untuk pelanggan.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> Tambah Kupon
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Kode Kupon</th>
                <th className="px-6 py-4">Diskon</th>
                <th className="px-6 py-4">Penggunaan</th>
                <th className="px-6 py-4">Berlaku Sampai</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Memuat data...</td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Belum ada kupon yang dibuat.</td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg">
                        <Tag className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="font-mono font-bold text-slate-200 tracking-wider">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-400 font-bold text-lg">{coupon.discountPercent}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300 font-medium">
                        {coupon.usedCount} <span className="text-slate-500">/ {coupon.maxUses || '∞'}</span>
                      </div>
                      {coupon.maxUses && (
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1 max-w-[100px]">
                          <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (coupon.usedCount / coupon.maxUses) * 100)}%` }}></div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.validUntil ? (
                        <span className={new Date() > new Date(coupon.validUntil) ? 'text-red-400' : 'text-slate-300'}>
                          {new Date(coupon.validUntil).toLocaleString('id-ID')}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Selamanya</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-500/10 text-slate-400 font-bold text-xs">
                          <XCircle className="w-3.5 h-3.5" /> Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleStatus(coupon.id, coupon.isActive)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                        >
                          {coupon.isActive ? 'Matikan' : 'Aktifkan'}
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(coupon)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteCoupon(coupon.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl z-10 animate-fade-in-up">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingId ? 'Edit Kupon' : 'Buat Kupon Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-400">Kode Kupon</label>
                  {!editingId && (
                    <button
                      type="button"
                      onClick={generateRandomCode}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      <Wand2 className="w-3 h-3" /> Buat Otomatis
                    </button>
                  )}
                </div>
                <input 
                  type="text"
                  required
                  disabled={!!editingId} // Code cant be edited once created
                  value={form.code}
                  onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono tracking-wider disabled:opacity-50"
                  placeholder="MISAL: DISKON20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Potongan Harga (%)</label>
                <div className="relative">
                  <input 
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={form.discountPercent}
                    onChange={(e) => setForm({...form, discountPercent: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Batas Kuota Penggunaan (Kosongkan jika *unlimited*)</label>
                <input 
                  type="number"
                  min="0"
                  value={form.maxUses || ''}
                  onChange={(e) => setForm({...form, maxUses: Number(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Contoh: 100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Tanggal Berlaku (Kosongkan jika *selamanya*)</label>
                <input 
                  type="datetime-local"
                  value={form.validUntil}
                  onChange={(e) => setForm({...form, validUntil: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors"
                  disabled={saving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  disabled={saving}
                >
                  {saving ? 'Menyimpan...' : <><CheckCircle2 className="w-4 h-4" /> Simpan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
