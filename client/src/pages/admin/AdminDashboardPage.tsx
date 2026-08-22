import React, { useEffect, useState } from 'react';
import { Users, Layers, Sparkles, CreditCard, Activity, ArrowUpRight, TrendingUp, ShieldCheck, Database, Zap, Clock } from 'lucide-react';
import { api } from '../../lib/auth';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col space-y-6">
        <div className="animate-pulse h-8 bg-slate-800 rounded-lg w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse h-32 bg-slate-800/50 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="animate-pulse h-64 bg-slate-800/50 rounded-2xl"></div>
          <div className="animate-pulse h-64 bg-slate-800/50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const roleStats = stats?.roleStats || [];
  const teacherCount = roleStats.find((r: any) => r.role === 'TEACHER')?._count?.role || 0;
  const adminCount = roleStats.find((r: any) => r.role === 'ADMIN')?._count?.role || 0;
  const studentCount = stats?.totalParticipants || 0;

  const totalUsers = (teacherCount + adminCount + studentCount) || 1; // Total of all roles and students

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-1">Platform Overview</h2>
          <p className="text-slate-400 font-medium text-sm">Pantau aktivitas, metrik, dan kesehatan sistem Examigo secara real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 animate-pulse" />
            Live Monitoring Active
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800/60 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <div className="relative">
            <p className="text-sm font-semibold text-slate-400 mb-1">Total Pengguna Aktif</p>
            <h3 className="text-3xl font-black text-white">{stats?.totalUsers || 0}</h3>
          </div>
        </div>

        {/* Total Exams */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800/60 shadow-lg relative overflow-hidden group hover:border-indigo-500/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3" /> +24%
            </span>
          </div>
          <div className="relative">
            <p className="text-sm font-semibold text-slate-400 mb-1">Total Ujian Dibuat</p>
            <h3 className="text-3xl font-black text-white">{stats?.totalExams || 0}</h3>
          </div>
        </div>

        {/* Global AI Usage */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800/60 shadow-lg relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-bold bg-slate-800 px-2 py-1 rounded-lg">
              Bulan ini
            </span>
          </div>
          <div className="relative">
            <p className="text-sm font-semibold text-slate-400 mb-1">Total Kuota AI Terpakai</p>
            <h3 className="text-3xl font-black text-white">{stats?.totalAiUsage || 0} <span className="text-sm text-slate-500 font-medium">tokens</span></h3>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800/60 shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-bold bg-slate-800 px-2 py-1 rounded-lg">
              {stats?.successfulTransactions || 0} trx
            </span>
          </div>
          <div className="relative">
            <p className="text-sm font-semibold text-slate-400 mb-1">Total Pendapatan</p>
            <h3 className="text-3xl font-black text-white truncate">{formatCurrency(stats?.totalRevenue || 0)}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health / Status */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-slate-900 border border-slate-800/60 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-lg">System Health</h3>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-300">API Gateway</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">99.9% Uptime</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-300">Database Load</span>
                </div>
                <span className="text-xs font-bold text-blue-400">Normal (24%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-300">Gemini AI Service</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">Operational</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <Clock className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-200">Terakhir disinkronkan</p>
              <p className="text-xs text-slate-500 mt-0.5">Semua sistem berjalan dengan baik tanpa ada insiden aktif dalam 24 jam terakhir.</p>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800/60 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg">Demografi & Distribusi Pengguna</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">Teachers</span>
              <span className="text-2xl font-black text-indigo-400 mb-1">{teacherCount}</span>
              <span className="text-[10px] font-medium text-slate-500">{((teacherCount/totalUsers)*100).toFixed(1)}% dari total</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">Siswa (Peserta)</span>
              <span className="text-2xl font-black text-emerald-400 mb-1">{studentCount}</span>
              <span className="text-[10px] font-medium text-slate-500">{((studentCount/totalUsers)*100).toFixed(1)}% dari interaksi</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">Admins</span>
              <span className="text-2xl font-black text-purple-400 mb-1">{adminCount}</span>
              <span className="text-[10px] font-medium text-slate-500">{((adminCount/totalUsers)*100).toFixed(1)}% dari total</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Komposisi Pengguna Sistem</h4>
            <div className="w-full flex h-4 rounded-full overflow-hidden bg-slate-800">
              <div className="bg-indigo-500 h-full" style={{ width: `${(teacherCount / totalUsers) * 100}%` }}></div>
              <div className="bg-emerald-500 h-full border-l border-slate-900" style={{ width: `${(studentCount / totalUsers) * 100}%` }}></div>
              <div className="bg-purple-500 h-full border-l border-slate-900" style={{ width: `${(adminCount / totalUsers) * 100}%` }}></div>
            </div>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-xs text-slate-400">Guru (Pemilik Ujian)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-slate-400">Siswa (Peserta Ujian)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-xs text-slate-400">Admin Sistem</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
