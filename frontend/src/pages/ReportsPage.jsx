import { useState } from 'react';
import { FileBarChart, Download, FileText, Table, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const REPORT_TYPES = [
  { id: 'fraud-summary', name: 'Fraud Detection Summary', desc: 'Complete overview of all detected fraud cases with statistics', icon: FileBarChart, color: '#ff0055' },
  { id: 'high-risk', name: 'High-Risk Beneficiaries', desc: 'Detailed list of beneficiaries with risk score ≥ 60', icon: FileText, color: '#ffc107' },
  { id: 'regional', name: 'Regional Fraud Patterns', desc: 'Geographic distribution of fraud cases across states', icon: Table, color: '#00d4ff' },
  { id: 'scheme-wise', name: 'Scheme-wise Analysis', desc: 'Fraud breakdown by welfare scheme type', icon: FileBarChart, color: '#8b5cf6' },
  { id: 'duplicate', name: 'Duplicate Identity Report', desc: 'All detected duplicate and clustered beneficiaries', icon: FileText, color: '#ff6b35' },
  { id: 'audit', name: 'Security Audit Log', desc: 'Complete audit trail of all admin and analyst actions', icon: Table, color: '#00ff88' },
];

const RECENT_REPORTS = [
  { name: 'fraud_summary_march_2024.pdf', type: 'Fraud Summary', date: '2024-03-10', size: '2.4 MB', format: 'PDF' },
  { name: 'high_risk_q1_2024.xlsx', type: 'High Risk', date: '2024-03-05', size: '1.1 MB', format: 'Excel' },
  { name: 'regional_patterns_q1.csv', type: 'Regional', date: '2024-03-01', size: '890 KB', format: 'CSV' },
  { name: 'audit_log_feb_2024.pdf', type: 'Audit', date: '2024-02-29', size: '3.2 MB', format: 'PDF' },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState({});
  const [format, setFormat] = useState('PDF');

  const generateReport = async (id) => {
    setGenerating(prev => ({ ...prev, [id]: true }));
    toast.loading(`Generating ${format} report...`, { id: `rpt-${id}` });
    await new Promise(r => setTimeout(r, 2500));
    setGenerating(prev => ({ ...prev, [id]: false }));
    toast.success(`Report exported as ${format}!`, { id: `rpt-${id}` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports & Exports</h1>
        <p className="text-slate-500 text-sm mt-1">Generate comprehensive fraud analysis reports in multiple formats</p>
      </div>

      {/* Format Selector */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-6 flex-wrap">
          <span className="text-slate-400 text-sm font-medium">Export Format:</span>
          {['PDF', 'CSV', 'Excel'].map(f => (
            <label key={f} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="format" value={f} checked={format === f} onChange={() => setFormat(f)}
                className="accent-[#00d4ff]" />
              <span className={`text-sm font-semibold ${format === f ? 'text-[#00d4ff]' : 'text-slate-500'}`}>{f}</span>
            </label>
          ))}
          <div className="ml-auto text-xs text-slate-600 font-mono">
            Reports encrypted with AES-256 before download
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {REPORT_TYPES.map(rpt => (
          <div key={rpt.id} className="glass-card p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${rpt.color}12`, border: `1px solid ${rpt.color}25` }}>
                <rpt.icon className="w-5 h-5" style={{ color: rpt.color }} />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{rpt.name}</div>
                <div className="text-slate-500 text-xs mt-0.5">{rpt.desc}</div>
              </div>
            </div>
            <button
              onClick={() => generateReport(rpt.id)}
              disabled={generating[rpt.id]}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              id={`generate-${rpt.id}`}
              style={generating[rpt.id]
                ? { background: 'rgba(255,255,255,0.03)', color: '#64748b', border: '1px solid rgba(255,255,255,0.05)' }
                : { background: `${rpt.color}12`, color: rpt.color, border: `1px solid ${rpt.color}25` }}>
              {generating[rpt.id]
                ? <><div className="w-4 h-4 border-2 border-t-current border-transparent rounded-full animate-spin" /> Generating...</>
                : <><Download className="w-4 h-4" /> Export as {format}</>
              }
            </button>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="glass-card p-6">
        <h3 className="text-white font-bold mb-5">Recent Reports</h3>
        <div className="space-y-3">
          {RECENT_REPORTS.map((r, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl transition-colors"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: r.format === 'PDF' ? 'rgba(255,0,85,0.1)' : r.format === 'Excel' ? 'rgba(0,255,136,0.1)' : 'rgba(0,212,255,0.1)' }}>
                <FileText className="w-4 h-4" style={{ color: r.format === 'PDF' ? '#ff0055' : r.format === 'Excel' ? '#00ff88' : '#00d4ff' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{r.name}</div>
                <div className="text-slate-500 text-xs">{r.type} • {r.date} • {r.size}</div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded font-mono flex-shrink-0"
                style={{ background: 'rgba(0,212,255,0.08)', color: '#00d4ff' }}>{r.format}</span>
              <button onClick={() => toast.success('Downloading report...')}
                className="text-slate-500 hover:text-[#00d4ff] transition-colors flex-shrink-0">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
