import { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, X, Filter, Eye } from 'lucide-react';
import { useAlerts } from '../context/AlertContext';
import toast from 'react-hot-toast';

const TYPE_CONFIG = {
  critical: { color: '#ff0055', bg: 'rgba(255,0,85,0.08)', border: 'rgba(255,0,85,0.2)', label: 'CRITICAL' },
  high: { color: '#ffc107', bg: 'rgba(255,193,7,0.08)', border: 'rgba(255,193,7,0.2)', label: 'HIGH' },
  medium: { color: '#00d4ff', bg: 'rgba(0,212,255,0.05)', border: 'rgba(0,212,255,0.15)', label: 'MEDIUM' },
  low: { color: '#00ff88', bg: 'rgba(0,255,136,0.05)', border: 'rgba(0,255,136,0.15)', label: 'LOW' },
};

export default function AlertsPage() {
  const { alerts, unreadCount, markRead, markAllRead, dismissAlert, setAlerts } = useAlerts();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = alerts.filter(a => {
    const matchFilter = filter === 'All' || a.type === filter.toLowerCase() || (filter === 'Unread' && !a.read);
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const dismissAll = () => { markAllRead(); toast.success('All alerts marked as read'); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alert Center</h1>
          <p className="text-slate-500 text-sm mt-1">{unreadCount} unread alerts • Real-time fraud notifications</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={dismissAll} className="btn-secondary flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>

      {/* Alert Type Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
          const count = alerts.filter(a => a.type === type).length;
          return (
            <div key={type} className="glass-card p-4 cursor-pointer transition-all duration-200"
              style={{ borderColor: cfg.border }}
              onClick={() => setFilter(type.charAt(0).toUpperCase() + type.slice(1))}>
              <div className="text-2xl font-black mb-1" style={{ color: cfg.color }}>{count}</div>
              <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{cfg.label} Alerts</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search alerts..."
          className="cyber-input text-sm py-2 flex-1 min-w-48"
        />
        <div className="flex gap-2 flex-wrap">
          {['All', 'Unread', 'Critical', 'High', 'Medium', 'Low'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${filter === f ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              style={filter === f ? { background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              {f} {f === 'All' && `(${alerts.length})`}
              {f === 'Unread' && `(${unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filtered.map(alert => {
          const cfg = TYPE_CONFIG[alert.type];
          return (
            <div key={alert.id}
              className={`p-5 rounded-xl border transition-all duration-200 ${!alert.read ? 'opacity-100' : 'opacity-60'}`}
              style={{ background: cfg.bg, borderColor: cfg.border }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${cfg.color}15` }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-bold mr-2 font-mono"
                        style={{ background: `${cfg.color}20`, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <span className="text-white font-semibold">{alert.title}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-slate-600 text-xs font-mono">{alert.time}</span>
                      {!alert.read && <span className="w-2 h-2 rounded-full" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }} />}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm">{alert.message}</p>
                  {!alert.read && (
                    <div className="flex gap-3 mt-3">
                      <button onClick={() => { markRead(alert.id); toast.success('Investigating case...'); }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: `${cfg.color}15`, color: cfg.color }}>
                        Investigate
                      </button>
                      <button onClick={() => markRead(alert.id)}
                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                        Mark as Read
                      </button>
                      <button onClick={() => dismissAlert(alert.id)}
                        className="text-xs text-slate-600 hover:text-[#ff0055] transition-colors ml-auto">
                        Dismiss
                      </button>
                    </div>
                  )}
                  {alert.read && (
                    <div className="flex gap-3 mt-3">
                      <button onClick={() => dismissAlert(alert.id)}
                        className="text-xs text-slate-600 hover:text-[#ff0055] transition-colors ml-auto">
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No alerts match the current filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
