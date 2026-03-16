import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import BeneficiariesPage from './pages/BeneficiariesPage';
import DatasetPage from './pages/DatasetPage';
import AlertsPage from './pages/AlertsPage';
import CasesPage from './pages/CasesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import DocumentThreatPage from './pages/DocumentThreatPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0e1a]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-transparent border-t-[#00d4ff] rounded-full animate-spin"></div>
        <p className="text-[#00d4ff] text-sm font-medium">Initializing CyberShield...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="beneficiaries" element={<BeneficiariesPage />} />
        <Route path="datasets" element={<DatasetPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="threat-scanner" element={<DocumentThreatPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(13, 25, 48, 0.95)',
              color: '#e2e8f0',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#00ff88', secondary: '#000' } },
            error: { iconTheme: { primary: '#ff0055', secondary: '#000' } },
          }}
        />
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  );
}
