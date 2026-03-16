import { useState, useEffect } from 'react';
import {
  Users, AlertTriangle, Shield, TrendingUp, Database,
  Activity, CheckCircle, Clock, ArrowUpRight, RefreshCw
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, BarElement, Filler, Tooltip, Legend
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  overviewStats, fraudTrendData, riskDistributionData,
  fraudBySchemeData, mockBeneficiaries
} from '../data/mockData';
import { useAlerts } from '../context/AlertContext';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Filler, Tooltip, Legend);

const chartDefaults = {
  plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } } },
  scales: {
    x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
};

function StatCard({ title, value, subtitle, icon: Icon, color, trend, format }) {
  return (
    <div className="stat-card group cursor-default" style={{ '--accent-color': color }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
            style={{ background: trend > 0 ? 'rgba(255,0,85,0.1)' : 'rgba(0,255,136,0.1)', color: trend > 0 ? '#ff4466' : '#00ff88' }}>
            <ArrowUpRight className="w-3 h-3" style={{ transform: trend < 0 ? 'rotate(90deg)' : 'none' }} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-black text-white mb-1" style={{ textShadow: `0 0 20px ${color}30` }}>
        {format ? format(value) : value.toLocaleString('en-IN')}
      </div>
      <div className="text-slate-400 text-sm font-medium">{title}</div>
      {subtitle && <div className="text-slate-600 text-xs mt-1">{subtitle}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { alerts, unreadCount } = useAlerts();
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState('2 minutes ago');

  const handleScan = () => {
    setScanning(true);
    toast.loading('Running AI fraud detection scan...', { id: 'scan' });
    setTimeout(() => {
      setScanning(false);
      setLastScan('just now');
      toast.success('Scan complete — 12 new anomalies detected!', { id: 'scan' });
    }, 3000);
  };

  const highRiskBeneficiaries = mockBeneficiaries.filter(b => b.riskScore >= 60).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Fraud Detection Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time AI-powered welfare fraud monitoring • Last scan: {lastScan}</p>
        </div>
        <button onClick={handleScan} disabled={scanning}
          className="btn-primary flex items-center gap-2 text-sm"
          id="run-scan-btn">
          <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning...' : 'Run AI Scan'}
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="Total Beneficiaries" value={overviewStats.totalBeneficiaries} subtitle="Active across all schemes" icon={Users} color="#00d4ff" />
        <StatCard title="Fraud Cases Detected" value={overviewStats.fraudDetected} subtitle="AI flagged this cycle" icon={AlertTriangle} color="#ff0055" trend={12} />
        <StatCard title="High Risk Beneficiaries" value={overviewStats.highRisk} subtitle="Score ≥ 60 requires review" icon={Shield} color="#ffc107" trend={8} />
        <StatCard title="Detection Accuracy" value={overviewStats.accuracy} subtitle="Isolation Forest model" icon={TrendingUp} color="#00ff88" format={v => `${v}%`} />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Cases Resolved', value: overviewStats.casesResolved, color: '#00ff88', icon: CheckCircle },
          { label: 'Active Alerts', value: unreadCount, color: '#ff0055', icon: Activity },
          { label: 'Datasets Analyzed', value: overviewStats.datasetsAnalyzed, color: '#00d4ff', icon: Database },
          { label: 'Funds Recovered', value: `₹${overviewStats.totalRecovered}B`, color: '#8b5cf6', icon: TrendingUp },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4 flex items-center gap-3">
            <s.icon className="w-5 h-5 flex-shrink-0" style={{ color: s.color }} />
            <div>
              <div className="text-white font-bold">{typeof s.value === 'number' ? s.value.toLocaleString('en-IN') : s.value}</div>
              <div className="text-slate-500 text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Fraud Trend - wide */}
        <div className="lg:col-span-2 chart-container">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-white">Fraud Detection Trend</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#ff0055]" />Detected
              <span className="w-2 h-2 rounded-full bg-[#00ff88] ml-2" />Cleared
            </div>
          </div>
          <div style={{ position: 'relative', height: '280px' }}>
            <Line data={fraudTrendData} options={{
              ...chartDefaults,
              responsive: true,
              maintainAspectRatio: false,
              plugins: { ...chartDefaults.plugins, tooltip: { backgroundColor: 'rgba(13,21,38,0.95)', titleColor: '#e2e8f0', bodyColor: '#94a3b8', borderColor: 'rgba(0,212,255,0.2)', borderWidth: 1 } },
            }} />
          </div>
        </div>

        {/* Risk Distribution - pie */}
        <div className="chart-container">
          <h3 className="font-bold text-white mb-5">Risk Score Distribution</h3>
          <div style={{ position: 'relative', height: '260px' }}>
            <Doughnut data={riskDistributionData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 }, padding: 16 } },
                tooltip: { backgroundColor: 'rgba(13,21,38,0.95)', titleColor: '#e2e8f0', bodyColor: '#94a3b8', borderColor: 'rgba(0,212,255,0.2)', borderWidth: 1 },
              },
              cutout: '65%',
            }} />
          </div>
        </div>
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Fraud by Scheme */}
        <div className="chart-container">
          <h3 className="font-bold text-white mb-5">Fraud by Welfare Scheme</h3>
          <div style={{ position: 'relative', height: '280px' }}>
            <Bar data={fraudBySchemeData} options={{
              ...chartDefaults,
              responsive: true,
              maintainAspectRatio: false,
              plugins: { ...chartDefaults.plugins, legend: { display: false }, tooltip: { backgroundColor: 'rgba(13,21,38,0.95)', titleColor: '#e2e8f0', bodyColor: '#94a3b8', borderColor: 'rgba(0,212,255,0.2)', borderWidth: 1 } },
            }} />
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-white mb-4">Recent Alerts</h3>
          <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
            {alerts.slice(0, 5).map(alert => (
              <div key={alert.id} className="alert-item"
                style={{ opacity: alert.read ? 0.6 : 1, borderColor: !alert.read ? (alert.type === 'critical' ? 'rgba(255,0,85,0.2)' : alert.type === 'high' ? 'rgba(255,193,7,0.15)' : 'rgba(0,212,255,0.1)') : undefined }}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: alert.type === 'critical' ? '#ff0055' : alert.type === 'high' ? '#ffc107' : '#00d4ff' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-semibold">{alert.title}</div>
                  <div className="text-slate-500 text-xs truncate">{alert.message}</div>
                  <div className="text-slate-700 text-xs mt-1 font-mono">{alert.time}</div>
                </div>
                {!alert.read && <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] flex-shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HIGH RISK TABLE */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white">Top High-Risk Beneficiaries</h3>
          <button onClick={() => window.location.href = '/dashboard/beneficiaries'}
            className="text-xs text-[#00d4ff] hover:underline">View all →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Beneficiary</th><th>ID</th><th>Scheme</th>
                <th>Claim Amount</th><th>Risk Score</th>
                <th>Fraud Type</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {highRiskBeneficiaries.map(b => (
                <tr key={b.id}>
                  <td className="font-medium text-white">{b.name}</td>
                  <td className="font-mono text-xs text-slate-500">{b.id}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>
                      {b.scheme}
                    </span>
                  </td>
                  <td className="font-mono">₹{b.claimAmount.toLocaleString('en-IN')}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${b.riskScore}%`,
                          background: b.riskScore >= 60 ? '#ff0055' : b.riskScore >= 30 ? '#ffc107' : '#00ff88'
                        }} />
                      </div>
                      <span className={b.riskScore >= 60 ? 'risk-high' : b.riskScore >= 30 ? 'risk-medium' : 'risk-low'}>
                        {b.riskScore}
                      </span>
                    </div>
                  </td>
                  <td className="text-slate-400 text-xs">{b.fraudType}</td>
                  <td>
                    <span className={b.status === 'Confirmed Fraud' ? 'status-confirmed' : b.status === 'Under Investigation' ? 'status-investigating' : 'status-cleared'}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="text-xs text-[#00d4ff] hover:underline">Review</button>
                      <button className="text-xs text-[#ff0055] hover:underline">Flag</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
