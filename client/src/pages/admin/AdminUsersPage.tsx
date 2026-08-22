import React, { useEffect, useState } from 'react';
import { Edit2, Shield, Search, CheckCircle } from 'lucide-react';
import { api } from '../../lib/auth';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ role: '', plan: '', aiQuotaLimit: 0, aiQuotaUsed: 0, planValidUntil: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    api('/admin/users')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.data);
        }
      })
      .finally(() => setLoading(false));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditForm({
      role: user.role,
      plan: user.plan,
      aiQuotaLimit: user.aiQuotaLimit,
      aiQuotaUsed: user.aiQuotaUsed,
      planValidUntil: user.planValidUntil ? new Date(user.planValidUntil).toISOString().split('T')[0] : '',
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const res = await api(`/admin/users/${editingUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...data.data } : u));
        setEditingUser(null);
      } else {
        alert(data.message || 'Gagal menyimpan');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Manajemen Pengguna</h2>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Paket</th>
                <th className="px-6 py-4">Masa Aktif</th>
                <th className="px-6 py-4">AI Quota</th>
                <th className="px-6 py-4 text-center">Ujian</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Memuat data...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Tidak ada pengguna ditemukan</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">Daftar: {new Date(user.createdAt).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.plan === 'FREE' ? 'bg-slate-800 text-slate-400' : 
                        user.plan === 'PERSONAL' ? 'bg-blue-500/10 text-blue-400' : 
                        user.plan === 'PRO_AI' ? 'bg-indigo-500/10 text-indigo-400' : 
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.plan === 'FREE' ? (
                        <span className="text-xs text-slate-500 font-medium">Selamanya</span>
                      ) : user.planValidUntil ? (
                        new Date(user.planValidUntil) < new Date() ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">
                            Kedaluwarsa
                          </span>
                        ) : (
                          <div className="text-xs font-medium text-slate-300">
                            {new Date(user.planValidUntil).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        )
                      ) : (
                        <span className="text-xs text-slate-500 italic">Belum diatur</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300 font-medium">
                        {user.aiQuotaUsed} <span className="text-slate-500">/ {user.aiQuotaLimit}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1 max-w-[100px]">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (user.aiQuotaUsed / (user.aiQuotaLimit || 1)) * 100)}%` }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs">
                        {user._count?.exams || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors inline-flex items-center justify-center"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setEditingUser(null)} />
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl z-10">
            <h3 className="text-xl font-bold text-white mb-1">Edit Pengguna</h3>
            <p className="text-sm text-slate-400 mb-5">{editingUser.email}</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Role (Hak Akses)</label>
                <select 
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="TEACHER">TEACHER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Paket Langganan</label>
                <select 
                  value={editForm.plan}
                  onChange={(e) => setEditForm({...editForm, plan: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="FREE">FREE</option>
                  <option value="PERSONAL">PERSONAL</option>
                  <option value="PRO_AI">PRO_AI</option>
                  <option value="ENTERPRISE">ENTERPRISE</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Batas Kuota AI</label>
                  <input 
                    type="number"
                    value={editForm.aiQuotaLimit}
                    onChange={(e) => setEditForm({...editForm, aiQuotaLimit: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Kuota Terpakai</label>
                  <input 
                    type="number"
                    value={editForm.aiQuotaUsed}
                    onChange={(e) => setEditForm({...editForm, aiQuotaUsed: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Masa Aktif (Hingga)</label>
                <input 
                  type="date"
                  value={editForm.planValidUntil}
                  onChange={(e) => setEditForm({...editForm, planValidUntil: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors"
                disabled={saving}
              >
                Batal
              </button>
              <button
                onClick={handleSaveUser}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                disabled={saving}
              >
                {saving ? 'Menyimpan...' : <><CheckCircle className="w-4 h-4" /> Simpan</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
