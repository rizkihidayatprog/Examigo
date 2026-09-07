import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, LogOut, ShieldAlert, Tag, Layout, MessageSquare } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [maintenanceActive, setMaintenanceActive] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/public/landing-config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.maintenance?.enabled) {
          setMaintenanceActive(true);
        }
      })
      .catch(() => {});
  }, [location.pathname]);

  const navItems = [
    { path: '/@', label: 'Overview', icon: LayoutDashboard },
    { path: '/@/users', label: 'Users', icon: Users },
    { path: '/@/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/@/coupons', label: 'Kupon & Promo', icon: Tag },
    { path: '/@/feedback', label: 'Kritik & Ulasan', icon: MessageSquare },
    { path: '/@/cms', label: 'Landing Page & CMS', icon: Layout, hasBadge: maintenanceActive },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col md:flex-row font-sans">
      {/* Admin Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800 p-5 min-h-screen sticky top-0">
        <Link to="/@" className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white shadow-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white leading-none">Super Admin</h1>
            <span className="text-[10px] text-slate-400 font-medium">Examigo Control Panel</span>
          </div>
        </Link>

        <nav className="flex-1 space-y-2">
          <div className="px-2 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-edu-navyLight'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
                {item.hasBadge && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" title="Mode Pemeliharaan Aktif" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-800 mt-auto">
          <div className="p-3 bg-slate-900 rounded-xl mb-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-red-950/50 hover:text-red-400 text-sm font-semibold text-slate-400 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Mobile */}
          <div className="md:hidden flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-slate-500" />
              <h1 className="font-bold text-lg">Admin Panel</h1>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="p-2 text-slate-400">
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Maintenance Active Alert Banner */}
          {maintenanceActive && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-amber-500/5">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <div>
                  <p className="text-xs font-bold text-amber-300">
                    Mode Pemeliharaan (Maintenance Mode) Sedang AKTIF
                  </p>
                  <p className="text-[11px] text-amber-300/80">
                    Akses publik dan pengguna non-admin saat ini dialihkan ke layar pemeliharaan.
                  </p>
                </div>
              </div>
              <Link
                to="/@/cms"
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 flex-shrink-0 shadow-sm"
              >
                Kelola / Matikan
              </Link>
            </div>
          )}

          {/* Children View */}
          {children}
        </div>
      </main>
    </div>
  );
}
