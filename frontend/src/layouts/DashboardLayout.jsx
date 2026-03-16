import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield, LayoutDashboard, Users, Database, Bell, FileText,
  BarChart3, Settings, LogOut, Menu, X, ChevronDown,
  Activity, AlertTriangle, FolderOpen, FileBarChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import toast from 'react-hot-toast';
import { BGPattern } from '../components/BGPattern';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/dashboard/beneficiaries', label: 'Beneficiaries', icon: Users },
  { path: '/dashboard/datasets', label: 'Datasets', icon: Database },
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/dashboard/alerts', label: 'Alerts', icon: Bell, badge: 3 },
  { path: '/dashboard/cases', label: 'Case Management', icon: FolderOpen },
  { path: '/dashboard/threat-scanner', label: 'Threat Scanner', icon: Shield },
  { path: '/dashboard/reports', label: 'Reports', icon: FileBarChart },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const roleColors = {
  Admin: '#00d4ff',
  Analyst: '#8b5cf6',
  'Field Officer': '#00ff88',
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { alerts, unreadCount, markRead } = useAlerts();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="flex h-screen bg-[#0a0e1a] overflow-hidden relative z-0">
      <BGPattern variant="grid" fill="#00d4ff" className="opacity-15" />
      {/* SIDEBAR */}
      <aside className={`flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0`}
        style={{ background: '#0d1526', borderRight: '1px solid rgba(0,212,255,0.08)' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #0070e0)', boxShadow: '0 0 15px rgba(0,212,255,0.3)' }}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-bold text-white text-sm">CyberShield</div>
              <div className="text-xs font-mono" style={{ color: '#00d4ff', opacity: 0.7 }}>AI FRAUD DETECTION</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const badgeCount = item.label === 'Alerts' ? unreadCount : item.badge;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`sidebar-link w-full relative ${isActive(item) ? 'active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
                id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
                {badgeCount > 0 && sidebarOpen && (
                  <span className="flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                    style={{ background: '#ff0055', color: '#fff', fontSize: '10px' }}>
                    {badgeCount}
                  </span>
                )}
                {badgeCount > 0 && !sidebarOpen && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: '#ff0055', color: '#fff', fontSize: '9px' }}>
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Status */}
        {sidebarOpen && (
          <div className="p-3 mx-3 mb-3 rounded-lg" style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.1)' }}>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
              <span className="text-[#00ff88] font-semibold">AI Engine Active</span>
            </div>
            <div className="text-slate-600 text-xs mt-1">Last scan: 2 min ago</div>
          </div>
        )}

        {/* User zone */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
          <div className={`flex items-center gap-3 p-2 rounded-lg ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm"
              style={{ background: `${roleColors[user?.role] || '#00d4ff'}20`, color: roleColors[user?.role] || '#00d4ff', border: `1px solid ${roleColors[user?.role] || '#00d4ff'}30` }}>
              {user?.name?.[0] || 'A'}
            </div>
            {sidebarOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-semibold truncate">{user?.name}</div>
                  <div className="text-xs truncate" style={{ color: roleColors[user?.role] || '#00d4ff', opacity: 0.8 }}>{user?.role}</div>
                </div>
                <button onClick={handleLogout} className="text-slate-600 hover:text-[#ff0055] transition-colors flex-shrink-0" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP HEADER */}
        <header className="flex items-center justify-between px-6 py-4 flex-shrink-0 relative z-50"
          style={{ background: 'rgba(13,21,38,0.8)', borderBottom: '1px solid rgba(0,212,255,0.08)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-500 hover:text-[#00d4ff] transition-colors p-1">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-white font-semibold text-sm">
                {navItems.find(n => isActive(n))?.label || 'Dashboard'}
              </h2>
              <div className="text-slate-600 text-xs font-mono">CyberShield v2.4.1 • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* System status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.15)', color: '#00ff88' }}>
              <Activity className="w-3 h-3" />
              <span>AI Engine Active</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg text-slate-500 hover:text-[#00d4ff] transition-colors"
                style={{ background: 'rgba(255,255,255,0.03)' }}
                id="notifications-btn"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: '#ff0055', color: '#fff', fontSize: '9px', boxShadow: '0 0 8px rgba(255,0,85,0.5)' }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 rounded-xl shadow-2xl z-50 overflow-hidden"
                  style={{ background: '#0d1526', border: '1px solid rgba(0,212,255,0.15)' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
                    <span className="text-white font-semibold text-sm">Alerts</span>
                    <button onClick={() => setNotifOpen(false)} className="text-slate-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {alerts.slice(0, 10).map(alert => (
                      <div key={alert.id} 
                        onClick={() => { markRead(alert.id); navigate('/dashboard/alerts'); setNotifOpen(false); }}
                        className="px-4 py-3 border-b cursor-pointer transition-colors hover:bg-[rgba(0,212,255,0.03)]"
                        style={{ borderColor: 'rgba(255,255,255,0.03)', opacity: alert.read ? 0.6 : 1 }}>
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: alert.type === 'critical' ? '#ff0055' : alert.type === 'high' ? '#ffc107' : '#00d4ff' }} />
                          <div>
                            <div className="text-white text-xs font-semibold">{alert.title}</div>
                            <div className="text-slate-500 text-xs mt-0.5">{alert.message}</div>
                            <div className="text-slate-600 text-xs mt-1 font-mono">{alert.time}</div>
                          </div>
                          {!alert.read && <span className="w-2 h-2 rounded-full bg-[#00d4ff] flex-shrink-0 mt-1" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 text-center">
                    <button onClick={() => { setNotifOpen(false); navigate('/dashboard/alerts'); }}
                      className="text-xs text-[#00d4ff] hover:underline">View all alerts →</button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
                style={{ background: `${roleColors[user?.role]}20`, color: roleColors[user?.role], border: `1px solid ${roleColors[user?.role]}30` }}>
                {user?.name?.[0]}
              </div>
              <div className="hidden md:block text-right">
                <div className="text-white text-xs font-semibold">{user?.name}</div>
                <div className="text-xs" style={{ color: roleColors[user?.role], opacity: 0.8 }}>{user?.role}</div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-600" />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
