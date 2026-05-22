import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { AuthLayout } from './components/layout/AuthLayout';
import { MobileLayout } from './components/layout/MobileLayout';

const LoginPage       = lazy(() => import('./pages/auth/LoginPage'));
const HomePage        = lazy(() => import('./pages/marketplace/HomePage'));
const MarketplacePage = lazy(() => import('./pages/marketplace/MarketplacePage'));
const PropertyDetailPage = lazy(() => import('./pages/marketplace/PropertyDetailPage'));
const BookingFlowPage = lazy(() => import('./pages/booking/BookingFlowPage'));
const BookingSuccessPage = lazy(() => import('./pages/booking/BookingSuccessPage'));
const MpReturnPage = lazy(() => import('./pages/booking/MpReturnPage'));
const MyBookingsPage  = lazy(() => import('./pages/tenant/MyBookingsPage'));
const MyPaymentsPage  = lazy(() => import('./pages/tenant/MyPaymentsPage'));
const MessagesPage        = lazy(() => import('./pages/messages/MessagesPage'));
const AdminChatListPage   = lazy(() => import('./pages/admin/AdminChatListPage'));
const AdminChatConvPage   = lazy(() => import('./pages/messages/ChatPage'));
const ProfilePage     = lazy(() => import('./pages/tenant/ProfilePage'));
const SocioDashboardPage  = lazy(() => import('./pages/socio/SocioDashboardPage'));
const PropertyManagePage  = lazy(() => import('./pages/socio/PropertyManagePage'));
const AddPropertyPage     = lazy(() => import('./pages/socio/AddPropertyPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function SocioRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'SOCIO') return <Navigate to="/home" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/home" replace />;
  return <>{children}</>;
}

function RootRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'ADMIN') return <Navigate to="/admin-chat" replace />;
  return <Navigate to={user?.role === 'SOCIO' ? '/socio' : '/home'} replace />;
}

const Fallback = () => (
  <div className="flex items-center justify-center min-h-dvh bg-white">
    <div className="w-8 h-8 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          {/* Public auth — un solo componente, tab dinámico */}
          <Route path="/login"    element={<AuthLayout><LoginPage /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><LoginPage /></AuthLayout>} />

          {/* Tenant/Inquilino routes */}
          <Route path="/home" element={
            <ProtectedRoute><MobileLayout><HomePage /></MobileLayout></ProtectedRoute>
          } />
          <Route path="/properties" element={
            <ProtectedRoute><MobileLayout><MarketplacePage /></MobileLayout></ProtectedRoute>
          } />
          <Route path="/properties/:id" element={
            <ProtectedRoute><MobileLayout hideNav><PropertyDetailPage /></MobileLayout></ProtectedRoute>
          } />
          <Route path="/booking/:propertyId" element={
            <ProtectedRoute><BookingFlowPage /></ProtectedRoute>
          } />
          <Route path="/booking/success/:id" element={
            <ProtectedRoute><BookingSuccessPage /></ProtectedRoute>
          } />
          <Route path="/booking/mp-return" element={
            <ProtectedRoute><MpReturnPage /></ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute><MobileLayout><MyBookingsPage /></MobileLayout></ProtectedRoute>
          } />
          <Route path="/my-payments" element={
            <ProtectedRoute><MobileLayout><MyPaymentsPage /></MobileLayout></ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute><MobileLayout><MessagesPage /></MobileLayout></ProtectedRoute>
          } />

          {/* Admin mobile routes */}
          <Route path="/admin-chat" element={
            <AdminRoute><AdminChatListPage /></AdminRoute>
          } />
          <Route path="/admin-chat/:id" element={
            <AdminRoute><AdminChatConvPage /></AdminRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><MobileLayout><ProfilePage /></MobileLayout></ProtectedRoute>
          } />

          {/* Socio routes */}
          <Route path="/socio" element={
            <SocioRoute><MobileLayout><SocioDashboardPage /></MobileLayout></SocioRoute>
          } />
          <Route path="/socio/properties/:id" element={
            <SocioRoute><MobileLayout hideNav><PropertyManagePage /></MobileLayout></SocioRoute>
          } />
          <Route path="/socio/add-property" element={
            <SocioRoute><AddPropertyPage /></SocioRoute>
          } />

          {/* Fallback */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
