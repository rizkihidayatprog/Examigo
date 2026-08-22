import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Sparkles, LayoutDashboard, HelpCircle, Layers, BarChart2, Menu, X, LogOut, Globe, CreditCard, User as UserIcon } from 'lucide-react';
import { useAuth } from './lib/auth';
import DashboardPage from './pages/DashboardPage';
import AIGeneratorPage from './pages/AIGeneratorPage';
import QuestionBankPage from './pages/QuestionBankPage';
import ExamBuilderPage from './pages/ExamBuilderPage';
import ExamRoomPage from './pages/ExamRoomPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import SubscriptionSettingsPage from './pages/SubscriptionSettingsPage';
import LiveMonitorPage from './pages/LiveMonitorPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import RefundPage from './pages/RefundPage';
import ContactPage from './pages/ContactPage';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminTransactionsPage from './pages/admin/AdminTransactionsPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage'; // TS Trigger
import AdminLoginPage from './pages/admin/AdminLoginPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/ai-generator', label: 'AI Generator', icon: Sparkles, badge: 'AI' },
    { path: '/question-bank', label: 'Bank Soal', icon: HelpCircle },
    { path: '/exam-builder', label: 'Exam Builder', icon: Layers },
    { path: '/analytics', label: 'Analitik', icon: BarChart2 },
    { path: '/subscription', label: 'Langganan', icon: CreditCard },
    { path: '/profile', label: 'Profil Saya', icon: UserIcon },
    { path: '/landing', label: 'Halaman Depan', icon: Globe },
  ];

  const isExamRoom = location.pathname.startsWith('/exam-room');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname === '/reset-password' || location.pathname === '/@/login';
  const isCheckoutPage = location.pathname === '/checkout' || location.pathname.startsWith('/payment');
  const isPublicLegalPage = location.pathname === '/terms' || location.pathname === '/privacy' || location.pathname === '/refund-policy' || location.pathname === '/contact';
  const isLandingPage = location.pathname === '/landing' || (!isAuthenticated && location.pathname === '/');
  // Only use layout shell if it's admin page but NOT admin login page
  const isAdminPage = location.pathname.startsWith('/@') && location.pathname !== '/@/login';

  // Full-width pages (Auth, Exam Room, Checkout, Payment, Legal Pages, Landing Page, Admin): render without sidebar shell
  if (isAuthPage || isExamRoom || isCheckoutPage || isPublicLegalPage || isLandingPage || isAdminPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund-policy" element={<RefundPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/exam-room/:code" element={<ExamRoomPage />} />
        <Route path="/exam-room" element={<ExamRoomPage />} />
        <Route path="/landing" element={<LandingPage />} />
        
        {/* Admin Routes */}
        <Route path="/@/login" element={<AdminLoginPage />} />
        <Route path="/@" element={<AdminRoute><AdminLayout><AdminDashboardPage /></AdminLayout></AdminRoute>} />
        <Route path="/@/users" element={<AdminRoute><AdminLayout><AdminUsersPage /></AdminLayout></AdminRoute>} />
        <Route path="/@/transactions" element={<AdminRoute><AdminLayout><AdminTransactionsPage /></AdminLayout></AdminRoute>} />
        <Route path="/@/coupons" element={<AdminRoute><AdminLayout><AdminCouponsPage /></AdminLayout></AdminRoute>} />

        <Route path="/" element={isAuthenticated ? <Navigate to="/landing" replace={false} /> : <LandingPage />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row antialiased">
      {/* Sidebar for Desktop */}
      {isAuthenticated && (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 p-5 min-h-screen sticky top-0 z-30 shadow-[1px_0_3px_0_rgba(15,23,42,0.03)]">
          {/* Logo & Brand Header */}
          <Link to="/" className="flex items-center gap-3 px-2 py-2 mb-6 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm group-hover:bg-indigo-700 transition-colors">
              E
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900">Examigo</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100">SAAS</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">AI Exam Builder</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1 flex-1">
            <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Navigasi Utama</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                    isActive
                      ? 'bg-indigo-50/80 text-indigo-700 font-bold border border-indigo-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="pt-4 border-t border-slate-200/80 space-y-2.5">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                {user?.name?.slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div className="text-xs overflow-hidden flex-1 leading-tight">
                <p className="font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || ''}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Keluar Akun
            </button>
          </div>
        </aside>
      )}

      {/* Mobile Header */}
      {isAuthenticated && (
        <header className="md:hidden bg-white border-b border-slate-200/80 p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <span className="text-base font-bold text-slate-900">Examigo</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && isAuthenticated && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 sticky top-[60px] z-30 shadow-md animate-fade-in-fast">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => { logout(); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 w-full"
          >
            <LogOut className="w-4 h-4" /> Keluar Akun
          </button>
        </div>
      )}

      {/* Main App Viewport */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/exam-room/:code" element={<ExamRoomPage />} />
          <Route path="/exam-room" element={<ExamRoomPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/ai-generator" element={<ProtectedRoute><AIGeneratorPage /></ProtectedRoute>} />
          <Route path="/question-bank" element={<ProtectedRoute><QuestionBankPage /></ProtectedRoute>} />
          <Route path="/exam-builder" element={<ProtectedRoute><ExamBuilderPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/live-monitor/:examId" element={<ProtectedRoute><LiveMonitorPage /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><SubscriptionSettingsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}
