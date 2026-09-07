import React, { useEffect, useState, useCallback } from 'react';
import { Users, Layers, Sparkles, CreditCard, Activity, TrendingUp, ShieldCheck, Database, Zap, Clock, RefreshCw } from 'lucide-react';
import { api } from '../../lib/auth';

interface HealthData {
  timestamp: string;
  apiGateway: { status: string; uptimePct: number; responseMs: number; uptimeSeconds: number };
  database: { status: string; latencyMs: number; loadPct: number; heapUsedMB: number; heapTotalMB: number; memLoadPct: number };
  geminiAI: { status: string; latencyMs: number | null };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthLastUpdated, setHealthLastUpdated] = useState<Date | null>(null);

  const fetchHealth = useCallback(() => {
    setHealthLoading(true);
    api('/admin/health')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHealth(data.data);
          setHealthLastUpdated(new Date());
        }
      })
      .catch(() => {})
      .finally(() => setHealthLoading(false));
  }, []);

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

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, [fetchHealth]);

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
          <div className="px-4 py-2 rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-400 text-sm font-bold flex items-center gap-2">
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
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800/60 shadow-lg relative overflow-hidden group hover:border-slate-500/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-slate-500/10 text-slate-400 flex items-center justify-center">
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
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800/60 shadow-lg relative overflow-hidden group hover:border-slate-500/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-slate-500/10 text-slate-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-bold bg-slate-800 px-2 py-1 rounded-lg">
              Bulan ini
            </span>
          </div>
          <div className="relative">
            <p className="text-sm font-semibold text-slate-400 mb-1">Total Kuota Soal Terpakai</p>
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
        {/* System Health / Status — REAL-TIME */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-slate-900 border border-slate-800/60 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg">System Health</h3>
            </div>
            <button
              onClick={fetchHealth}
              disabled={healthLoading}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-all disabled:opacity-40"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${healthLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {healthLoading && !health ? (
            <div className="space-y-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-slate-800 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-slate-800 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {/* API Gateway */}
              {(() => {
                const uptime = health?.apiGateway.uptimePct ?? 99.9;
                const respMs = health?.apiGateway.responseMs ?? 0;
                const color = uptime >= 99 ? 'emerald' : uptime >= 95 ? 'yellow' : 'red';
                return (
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-2">
                        <Activity className={`w-4 h-4 text-${color}-400`} />
                        <span className="text-sm font-semibold text-slate-300">API Gateway</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold text-${color}-400`}>{uptime.toFixed(1)}% Uptime</span>
                        <span className="text-[10px] text-slate-500 ml-1.5">{respMs}ms</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`bg-${color}-500 h-full rounded-full transition-all duration-700`}
                        style={{ width: `${uptime}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })()}

              {/* Database */}
              {(() => {
                const dbLatency = health?.database.latencyMs ?? 0;
                // Use latency-based load (bukan heap memory!)
                const dbLoad = health?.database.loadPct ?? 0;
                const dbStatus = health?.database.status ?? 'operational';
                const memPct = health?.database.memLoadPct ?? 0;
                const heapMB = health?.database.heapUsedMB ?? 0;
                // Color thresholds based on latency load
                const color = dbStatus !== 'operational' ? 'red'
                  : dbLoad < 40 ? 'blue'
                  : dbLoad < 70 ? 'yellow'
                  : 'red';
                const label = dbStatus !== 'operational'
                  ? (dbStatus === 'degraded' ? 'Lambat' : 'Down')
                  : dbLoad < 40 ? 'Normal'
                  : dbLoad < 70 ? 'Elevated'
                  : 'High';
                return (
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-2">
                        <Database className={`w-4 h-4 text-${color}-400`} />
                        <span className="text-sm font-semibold text-slate-300">Database (MySQL)</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold text-${color}-400`}>{label} ({dbLoad}%)</span>
                        <span className="text-[10px] text-slate-500 ml-1.5">{dbLatency}ms</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`bg-${color}-500 h-full rounded-full transition-all duration-700`}
                        style={{ width: `${Math.max(dbLoad, 4)}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1 text-right">
                      Server RAM: {heapMB}MB heap · {memPct}% terpakai
                    </p>
                  </div>
                );
              })()}

              {/* Gemini AI */}
              {(() => {
                const aiSt = health?.geminiAI.status ?? 'not_configured';
                const aiMs = health?.geminiAI.latencyMs;
                const color = aiSt === 'operational' ? 'emerald' : aiSt === 'degraded' ? 'yellow' : 'slate';
                const label = aiSt === 'operational' ? 'Operational' : aiSt === 'degraded' ? 'Degraded' : 'No API Key';
                const barWidth = aiSt === 'operational' ? 100 : aiSt === 'degraded' ? 55 : 10;
                return (
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className={`w-4 h-4 text-${color}-400`} />
                        <span className="text-sm font-semibold text-slate-300">Gemini</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold text-${color}-400`}>{label}</span>
                        {aiMs !== null && aiMs !== undefined && (
                          <span className="text-[10px] text-slate-500 ml-1.5">{aiMs}ms</span>
                        )}
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`bg-${color}-500 h-full rounded-full transition-all duration-700`}
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="mt-6 p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <Clock className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-300">
                {healthLastUpdated
                  ? `Diperbarui: ${healthLastUpdated.toLocaleTimeString('id-ID')}`
                  : 'Memuat data...'}
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">Auto-refresh setiap 30 detik</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                health?.database.status === 'operational' && health?.geminiAI.status === 'operational'
                  ? 'bg-emerald-500'
                  : health?.database.status === 'down'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
              }`}></span>
              <span className="text-[10px] font-bold text-slate-500">LIVE</span>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800/60 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-500/10 rounded-lg text-slate-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg">Demografi & Distribusi Pengguna</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">Teachers</span>
              <span className="text-2xl font-black text-slate-400 mb-1">{teacherCount}</span>
              <span className="text-[10px] font-medium text-slate-500">{((teacherCount/totalUsers)*100).toFixed(1)}% dari total</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">Siswa (Peserta)</span>
              <span className="text-2xl font-black text-emerald-400 mb-1">{studentCount}</span>
              <span className="text-[10px] font-medium text-slate-500">{((studentCount/totalUsers)*100).toFixed(1)}% dari interaksi</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">Admins</span>
              <span className="text-2xl font-black text-slate-400 mb-1">{adminCount}</span>
              <span className="text-[10px] font-medium text-slate-500">{((adminCount/totalUsers)*100).toFixed(1)}% dari total</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Komposisi Pengguna Sistem</h4>
            <div className="w-full flex h-4 rounded-full overflow-hidden bg-slate-800">
              <div className="bg-slate-500 h-full" style={{ width: `${(teacherCount / totalUsers) * 100}%` }}></div>
              <div className="bg-emerald-500 h-full border-l border-slate-900" style={{ width: `${(studentCount / totalUsers) * 100}%` }}></div>
              <div className="bg-slate-500 h-full border-l border-slate-900" style={{ width: `${(adminCount / totalUsers) * 100}%` }}></div>
            </div>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                <span className="text-xs text-slate-400">Guru (Pemilik Ujian)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-slate-400">Siswa (Peserta Ujian)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                <span className="text-xs text-slate-400">Admin Sistem</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
