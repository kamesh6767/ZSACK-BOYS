import { useState, useEffect } from 'react';
import { Shield, Lock, Bell, Database, Users, Key, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('cybershield_notifications');
    return saved ? JSON.parse(saved) : { email: true, dashboard: true, critical: true, weekly: false };
  });
  const [mlSettings, setMlSettings] = useState(() => {
    const saved = localStorage.getItem('cybershield_ml_settings');
    return saved ? JSON.parse(saved) : { threshold: 60, sensitivity: 'Medium', autoFlag: true };
  });
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    localStorage.setItem('cybershield_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cybershield_ml_settings', JSON.stringify(mlSettings));
  }, [mlSettings]);

  const save = () => toast.success('Settings saved successfully');

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Platform configuration and security settings</p>
      </div>

      {/* Profile */}
      <div className="glass-card p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-[#00d4ff]" /> Account Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">Full Name</label>
            <input className="cyber-input" defaultValue={user?.name} />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-2">Email</label>
            <input className="cyber-input" defaultValue={user?.email} type="email" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-2">Role</label>
            <div className="cyber-input text-slate-500 cursor-not-allowed" style={{ opacity: 0.6 }}>{user?.role}</div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-2">Department</label>
            <input className="cyber-input" defaultValue="Ministry of Finance — Audit Division" />
          </div>
        </div>
        <button onClick={save} className="btn-primary mt-4 text-sm">Save Profile</button>
      </div>

      {/* Security */}
      <div className="glass-card p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-[#ff0055]" /> Security Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">Current Password</label>
              <input className="cyber-input" type="password" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">New Password</label>
              <input className="cyber-input" type="password" placeholder="••••••••" />
            </div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.15)' }}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-[#00ff88]" />
              <span className="text-white text-sm font-semibold">Security Status</span>
            </div>
            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-[#00ff88]" />TLS 1.3 Encryption Active</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-[#00ff88]" />AES-256 Database Encryption</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-[#00ff88]" />All Actions Audit Logged</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-[#00ff88]" />Role-Based Access Control Active</div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-2 flex items-center gap-2">
              <Key className="w-3 h-3" /> API Access Key
              <button onClick={() => setShowKey(!showKey)} className="text-[#00d4ff] ml-2">
                {showKey ? <EyeOff className="w-3 h-3 inline" /> : <Eye className="w-3 h-3 inline" />}
              </button>
            </label>
            <div className="cyber-input font-mono text-xs select-all" style={{ letterSpacing: '0.05em' }}>
              {showKey ? 'cs_live_k8sX9mQrP2nVwL4jHtA7cFbE3' : '••••••••••••••••••••••••••••••'}
            </div>
          </div>
        </div>
        <button onClick={save} className="btn-danger mt-4 text-sm">Update Security</button>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-[#ffc107]" /> Notification Preferences</h3>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive fraud alerts via email' },
            { key: 'dashboard', label: 'Dashboard Alerts', desc: 'Real-time alerts in dashboard panel' },
            { key: 'critical', label: 'Critical Alert SMS', desc: 'SMS notifications for critical fraud cases' },
            { key: 'weekly', label: 'Weekly Summary Report', desc: 'Automated weekly fraud summary email' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <div className="text-white text-sm font-medium">{n.label}</div>
                <div className="text-slate-500 text-xs">{n.desc}</div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                className="w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0"
                style={{ background: notifications[n.key] ? '#00d4ff' : 'rgba(255,255,255,0.08)' }}>
                <span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                  style={{ left: notifications[n.key] ? '26px' : '4px' }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ML Settings */}
      <div className="glass-card p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Database className="w-4 h-4 text-[#8b5cf6]" /> AI Engine Configuration</h3>
        <div className="space-y-5">
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              Risk Score Threshold for Auto-Flagging: <span className="text-[#00d4ff] font-mono">{mlSettings.threshold}</span>
            </label>
            <input type="range" min="0" max="100" value={mlSettings.threshold}
              onChange={e => setMlSettings(prev => ({ ...prev, threshold: +e.target.value }))}
              className="w-full accent-[#00d4ff]" />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>0 (Flag All)</span><span>50 (Balanced)</span><span>100 (Strict)</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-2">Model Sensitivity</label>
            <div className="grid grid-cols-3 gap-3">
              {['Low', 'Medium', 'High'].map(s => (
                <button key={s} onClick={() => setMlSettings(prev => ({ ...prev, sensitivity: s }))}
                  className="py-2 rounded-lg text-sm font-semibold transition-all"
                  style={mlSettings.sensitivity === s
                    ? { background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)' }
                    : { background: 'rgba(255,255,255,0.03)', color: '#64748b', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div>
              <div className="text-white text-sm font-medium">Auto-Flag High Risk Cases</div>
              <div className="text-slate-500 text-xs">Automatically flag beneficiaries exceeding threshold</div>
            </div>
            <button onClick={() => setMlSettings(prev => ({ ...prev, autoFlag: !prev.autoFlag }))}
              className="w-11 h-6 rounded-full transition-all duration-300 relative"
              style={{ background: mlSettings.autoFlag ? '#8b5cf6' : 'rgba(255,255,255,0.08)' }}>
              <span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                style={{ left: mlSettings.autoFlag ? '26px' : '4px' }} />
            </button>
          </div>
        </div>
        <button onClick={save} className="btn-primary mt-4 text-sm">Save AI Settings</button>
      </div>
    </div>
  );
}
