import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Sparkles, 
  LayoutDashboard, 
  HelpCircle, 
  Layers, 
  BarChart2, 
  Menu, 
  X, 
  LogOut, 
  Globe, 
  CreditCard, 
  User as UserIcon,
  Award,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useAuth, isProfileComplete } from './lib/auth';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import styles from './styles/AppLayout.module.css';
import ExamigoLogo from './components/common/ExamigoLogo';
import CompleteProfileModal from './components/common/CompleteProfileModal';
import { applyDynamicTheme } from './lib/theme';
import SEO from './components/common/SEO';

// Lazy-loaded Pages for Optimal Code Splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AIGeneratorPage = lazy(() => import('./pages/AIGeneratorPage'));
const QuestionBankPage = lazy(() => import('./pages/QuestionBankPage'));
const ExamBuilderPage = lazy(() => import('./pages/ExamBuilderPage'));
const CertificateSettingsPage = lazy(() => import('./pages/CertificateSettingsPage'));
const CertificateVerifyPage = lazy(() => import('./pages/CertificateVerifyPage'));
const ExamRoomPage = lazy(() => import('./pages/ExamRoomPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
const SubscriptionSettingsPage = lazy(() => import('./pages/SubscriptionSettingsPage'));
const LiveMonitorPage = lazy(() => import('./pages/LiveMonitorPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const RefundPage = lazy(() => import('./pages/RefundPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const MaintenancePage = lazy(() => import('./pages/MaintenancePage'));

// Admin Pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminTransactionsPage = lazy(() => import('./pages/admin/AdminTransactionsPage'));
const AdminCouponsPage = lazy(() => import('./pages/admin/AdminCouponsPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminCmsPage = lazy(() => import('./pages/admin/AdminCmsPage'));
const AdminFeedbackPage = lazy(() => import('./pages/admin/AdminFeedbackPage'));

function PageLoadingFallback() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.875rem',
      color: 'var(--theme-primary, #10B981)',
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        border: '3px solid rgba(16, 185, 129, 0.2)',
        borderTopColor: 'var(--theme-primary, #10B981)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--theme-text-muted, #6B7280)' }}>
        Memuat halaman...
      </span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg, #F0FDF4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid var(--theme-primary, #059669)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <>
      <SEO noindex={true} />
      {children}
    </>
  );
}

export default function App() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    return localStorage.getItem('examigo_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('examigo_sidebar_collapsed', String(next));
      return next;
    });
  };

  const [maintenance, setMaintenance] = React.useState<{
    enabled: boolean;
    title?: string;
    message?: string;
    estimatedEndTime?: string;
    allowAdminLogin?: boolean;
  } | null>(null);

  // Global Theme & Maintenance Initialization
  React.useEffect(() => {
    fetch('/api/public/landing-config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          if (data.data.theme) {
            applyDynamicTheme(data.data.theme);
          }
          if (data.data.maintenance) {
            setMaintenance(data.data.maintenance);
          }
        }
      })
      .catch(err => console.error('Failed to load global config:', err));

    const handleMaintenanceEvent = (e: any) => {
      if (e.detail) {
        setMaintenance(e.detail);
      }
    };
    window.addEventListener('examigo:maintenance', handleMaintenanceEvent);
    return () => window.removeEventListener('examigo:maintenance', handleMaintenanceEvent);
  }, []);

  const isPaidUser = user?.plan && user.plan !== 'FREE';

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/ai-generator', label: 'Generator Soal', icon: Sparkles, badge: 'NEW' },
    { path: '/question-bank', label: 'Bank Soal', icon: HelpCircle },
    { path: '/exam-builder', label: 'Exam Builder', icon: Layers },
    ...(isPaidUser ? [{ path: '/certificates', label: 'Desain Sertifikat', icon: Award }] : []),
    { path: '/analytics', label: 'Hasil & Analitik', icon: BarChart2 },
    { path: '/subscription', label: 'Langganan', icon: CreditCard },
    { path: '/profile', label: 'Profil Saya', icon: UserIcon },
    { path: '/landing', label: 'Halaman Depan', icon: Globe },
  ];

  const isExamRoom = location.pathname.startsWith('/exam-room') || location.pathname === '/exam' || location.pathname.startsWith('/exam/');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname === '/reset-password' || location.pathname === '/@/login';
  const isCheckoutPage = location.pathname === '/checkout' || location.pathname.startsWith('/payment');
  const isPublicLegalPage = location.pathname === '/terms' || location.pathname === '/privacy' || location.pathname === '/refund-policy' || location.pathname === '/contact';
  const isLandingPage = location.pathname === '/landing' || (!isAuthenticated && location.pathname === '/');
  const isAdminPage = location.pathname.startsWith('/@') && location.pathname !== '/@/login';
  const isVerifyPage = location.pathname.startsWith('/verify');
  const isMaintenancePage = location.pathname === '/maintenance';

  const isAdminRoute = location.pathname.startsWith('/@');
  const isSuperAdmin = user?.role === 'ADMIN';
  const showProfileModal = Boolean(isAuthenticated && user && !isProfileComplete(user));

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path === '/ai-generator') return 'Generator Soal AI';
    if (path === '/question-bank') return 'Bank Soal';
    if (path === '/exam-builder') return 'Exam Builder';
    if (path === '/certificates') return 'Desain Sertifikat';
    if (path === '/analytics') return 'Hasil & Analitik';
    if (path.startsWith('/live-monitor')) return 'Live Monitor Ujian';
    if (path === '/subscription') return 'Langganan & Kuota';
    if (path === '/profile') return 'Profil Saya';
    if (path.startsWith('/@')) return 'Super Admin Panel';
    return 'Workspace';
  };

  // Global Maintenance Interceptor: Non-admin users are shown the maintenance page
  if (maintenance?.enabled && !isSuperAdmin && !isAdminRoute) {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <MaintenancePage 
          maintenance={maintenance} 
          onRefresh={() => {
            fetch('/api/public/landing-config')
              .then(res => res.json())
              .then(data => {
                if (data.success && data.data?.maintenance) {
                  setMaintenance(data.data.maintenance);
                }
              });
          }} 
        />
      </Suspense>
    );
  }

  const isFullWidthPage = isAuthPage || isExamRoom || isCheckoutPage || isPublicLegalPage || isLandingPage || isAdminPage || isVerifyPage || isMaintenancePage;

  if (isFullWidthPage) {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        {showProfileModal && !isExamRoom && !isAuthPage && !isAdminPage && <CompleteProfileModal />}
        <Routes>
          <Route path="/maintenance" element={<MaintenancePage maintenance={maintenance} />} />
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/register" element={<AuthPage initialMode="register" />} />
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
          <Route path="/exam/join" element={<ExamRoomPage />} />
          <Route path="/exam/:code" element={<ExamRoomPage />} />
          <Route path="/exam" element={<ExamRoomPage />} />
          <Route path="/verify/:code" element={<CertificateVerifyPage />} />
          <Route path="/verify" element={<CertificateVerifyPage />} />
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Admin Routes */}
          <Route path="/@/login" element={<AdminLoginPage />} />
          <Route path="/@" element={<AdminRoute><AdminLayout><AdminDashboardPage /></AdminLayout></AdminRoute>} />
          <Route path="/@/users" element={<AdminRoute><AdminLayout><AdminUsersPage /></AdminLayout></AdminRoute>} />
          <Route path="/@/transactions" element={<AdminRoute><AdminLayout><AdminTransactionsPage /></AdminLayout></AdminRoute>} />
          <Route path="/@/coupons" element={<AdminRoute><AdminLayout><AdminCouponsPage /></AdminLayout></AdminRoute>} />
          <Route path="/@/feedback" element={<AdminRoute><AdminLayout><AdminFeedbackPage /></AdminLayout></AdminRoute>} />
          <Route path="/@/cms" element={<AdminRoute><AdminLayout><AdminCmsPage /></AdminLayout></AdminRoute>} />

          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className={styles.appShell}>
      {showProfileModal && <CompleteProfileModal />}
      {/* Sidebar for Desktop */}
      {isAuthenticated && (
        <aside className={`${styles.sidebarDesktop} ${sidebarCollapsed ? styles.sidebarDesktopCollapsed : ''}`}>
          {/* Top Brand Header */}
          <div className={sidebarCollapsed ? styles.sidebarHeaderCollapsed : styles.sidebarHeader}>
            {sidebarCollapsed ? (
              <>
                <Link to="/" title="Examigo Home" className="flex items-center justify-center no-underline">
                  <ExamigoLogo size="sm" showText={false} />
                </Link>
                <button
                  onClick={toggleSidebar}
                  className={styles.toggleSidebarBtn}
                  title="Perluas Sidebar"
                >
                  <PanelLeftOpen style={{ width: '16px', height: '16px' }} />
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="flex items-center no-underline">
                  <ExamigoLogo size="sm" showBadge={false} />
                </Link>
                <button
                  onClick={toggleSidebar}
                  className={styles.toggleSidebarBtn}
                  title="Perkecil Sidebar"
                >
                  <PanelLeftClose style={{ width: '15px', height: '15px' }} />
                </button>
              </>
            )}
          </div>

          {/* Navigation Menu */}
          <div className={`${styles.sidebarNavMenu} ${sidebarCollapsed ? styles.sidebarNavMenuCollapsed : ''}`}>
            {/* Group 1: Workspace Utama */}
            <div className={`${styles.navGroup} ${sidebarCollapsed ? styles.navGroupCollapsed : ''}`}>
              {!sidebarCollapsed && <div className={styles.navGroupLabel}>Workspace</div>}
              {[
                { path: '/', label: 'Dashboard', icon: LayoutDashboard },
                { path: '/ai-generator', label: 'Generator Soal', icon: Sparkles, badge: 'NEW' },
                { path: '/question-bank', label: 'Bank Soal', icon: HelpCircle },
                { path: '/exam-builder', label: 'Exam Builder', icon: Layers },
                ...(isPaidUser ? [{ path: '/certificates', label: 'Desain Sertifikat', icon: Award }] : []),
                { path: '/analytics', label: 'Hasil & Analitik', icon: BarChart2 },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={
                      sidebarCollapsed
                        ? `${styles.navItemCollapsed} ${isActive ? styles.navItemActive : styles.navItemInactive}`
                        : `${styles.navItem} ${isActive ? styles.navItemActive : styles.navItemInactive}`
                    }
                  >
                    {sidebarCollapsed ? (
                      <>
                        <Icon style={{ width: '17px', height: '17px', color: isActive ? '#0F172A' : '#64748B' }} />
                        {item.badge && <span className={styles.navDotBadge} />}
                      </>
                    ) : (
                      <>
                        <div className={styles.navItemLeft}>
                          <Icon style={{ width: '16px', height: '16px', color: isActive ? '#0F172A' : '#64748B' }} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={styles.navBadge}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Group 2: Pengaturan & Profil */}
            <div className={`${styles.navGroup} ${sidebarCollapsed ? styles.navGroupCollapsed : ''}`}>
              {!sidebarCollapsed && <div className={styles.navGroupLabel}>Pengaturan</div>}
              {[
                { path: '/subscription', label: 'Langganan & Kuota', icon: CreditCard },
                { path: '/profile', label: 'Profil Saya', icon: UserIcon },
                { path: '/landing', label: 'Halaman Publik', icon: Globe },
                ...(user?.role === 'ADMIN' ? [{ path: '/@', label: 'Super Admin Panel', icon: Sparkles }] : []),
              ].map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={
                      sidebarCollapsed
                        ? `${styles.navItemCollapsed} ${isActive ? styles.navItemActive : styles.navItemInactive}`
                        : `${styles.navItem} ${isActive ? styles.navItemActive : styles.navItemInactive}`
                    }
                  >
                    {sidebarCollapsed ? (
                      <Icon style={{ width: '17px', height: '17px', color: isActive ? '#0F172A' : '#64748B' }} />
                    ) : (
                      <div className={styles.navItemLeft}>
                        <Icon style={{ width: '16px', height: '16px', color: isActive ? '#0F172A' : '#64748B' }} />
                        <span>{item.label}</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Widget: Status Kuota (Bukan Tombol Logout!) */}
          {!sidebarCollapsed ? (
            <div className={styles.sidebarBottomWidget}>
              <div className={styles.widgetHeader}>
                <span className={styles.widgetTitle}>Paket {user?.plan || 'Free'}</span>
                <Link to="/subscription" className={styles.widgetLink}>Kelola</Link>
              </div>
              <p className={styles.widgetDesc}>Akses bank soal AI & ujian real-time.</p>
            </div>
          ) : (
            <div className={styles.sidebarBottomWidgetCollapsed}>
              <Link to="/subscription" title="Status Langganan" className={styles.collapsedWidgetBtn}>
                <CreditCard style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>
          )}
        </aside>
      )}

      {/* Mobile Header */}
      {isAuthenticated && (
        <header className={styles.mobileHeader}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <ExamigoLogo size="sm" showBadge={false} />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Tombol Logout Cepat di Mobile Header */}
            <button
              onClick={logout}
              className={styles.mobileLogoutHeaderBtn}
              title="Keluar Akun"
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={styles.menuToggleBtn}
            >
              {mobileMenuOpen ? <X style={{ width: '18px', height: '18px' }} /> : <Menu style={{ width: '18px', height: '18px' }} />}
            </button>
          </div>
        </header>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && isAuthenticated && (
        <div className={styles.mobileDrawer}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : styles.navItemInactive}`}
                style={{ padding: '0.75rem 1rem' }}
              >
                <div className={styles.navItemLeft}>
                  <Icon style={{ width: '18px', height: '18px', color: isActive ? '#0F172A' : '#64748B' }} />
                  <span style={{ fontSize: '14px' }}>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Content Container with Modern Topbar */}
      <div className={styles.mainContainer}>
        {/* Desktop Topbar Header (Memuat Profil & TOMBOL LOGOUT di Kanan Atas!) */}
        {isAuthenticated && (
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <div className={styles.pageBreadcrumb}>
                <span className={styles.breadcrumbBrand}>Examigo</span>
                <span className={styles.breadcrumbSeparator}>/</span>
                <span className={styles.breadcrumbCurrent}>{getPageTitle()}</span>
              </div>
            </div>

            <div className={styles.topbarRight}>
              {/* Plan Badge */}
              <Link to="/subscription" className={styles.topbarPlanBadge} title="Status Kuota & Paket">
                {user?.role === 'ADMIN' ? 'Super Admin' : `${user?.plan || 'Free'} Plan`}
              </Link>

              {/* User Profile Chip */}
              <Link to="/profile" className={styles.topbarUserChip} title="Profil Saya">
                <div className={styles.topbarAvatar}>
                  {user?.name?.slice(0, 2).toUpperCase() || 'U'}
                </div>
                <span className={styles.topbarUserName}>{user?.name || 'User'}</span>
              </Link>

              {/* TOMBOL LOGOUT DI KANAN ATAS (Bukan di Bawah Sidebar!) */}
              <button
                onClick={logout}
                className={styles.topbarLogoutBtn}
                title="Keluar dari Akun"
              >
                <LogOut style={{ width: '14px', height: '14px' }} />
                <span>Keluar</span>
              </button>
            </div>
          </header>
        )}

        {/* Main App Viewport */}
        <main className={styles.mainViewport}>
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/login" element={<AuthPage initialMode="login" />} />
              <Route path="/register" element={<AuthPage initialMode="register" />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/exam-room/:code" element={<ExamRoomPage />} />
              <Route path="/exam-room" element={<ExamRoomPage />} />
              <Route path="/exam/join" element={<ExamRoomPage />} />
              <Route path="/exam/:code" element={<ExamRoomPage />} />
              <Route path="/exam" element={<ExamRoomPage />} />
              <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/ai-generator" element={<ProtectedRoute><AIGeneratorPage /></ProtectedRoute>} />
              <Route path="/question-bank" element={<ProtectedRoute><QuestionBankPage /></ProtectedRoute>} />
              <Route path="/exam-builder" element={<ProtectedRoute><ExamBuilderPage /></ProtectedRoute>} />
              <Route path="/certificates" element={<ProtectedRoute><CertificateSettingsPage /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/live-monitor/:examId" element={<ProtectedRoute><LiveMonitorPage /></ProtectedRoute>} />
              <Route path="/subscription" element={<ProtectedRoute><SubscriptionSettingsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
