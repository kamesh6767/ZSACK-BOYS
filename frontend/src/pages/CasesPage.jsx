import { useState } from 'react';
import { FolderOpen, MessageSquare, CheckCircle, Clock, XCircle, Eye, Plus, ChevronDown } from 'lucide-react';
import { mockCases } from '../data/mockData';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Under Investigation', 'Confirmed Fraud', 'False Positive', 'Closed'];
const PRIORITY_CFG = {
  Critical: { color: '#ff0055', bg: 'rgba(255,0,85,0.12)' },
  High: { color: '#ffc107', bg: 'rgba(255,193,7,0.12)' },
  Medium: { color: '#00d4ff', bg: 'rgba(0,212,255,0.1)' },
  Low: { color: '#00ff88', bg: 'rgba(0,255,136,0.1)' },
};

export default function CasesPage() {
  const [cases, setCases] = useState(mockCases);
  const [selectedCase, setSelectedCase] = useState(null);
  const [note, setNote] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = cases.filter(c => statusFilter === 'All' || c.status === statusFilter);

  const updateStatus = (id, status) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status, lastUpdated: new Date().toISOString().split('T')[0] } : c));
    if (selectedCase?.id === id) setSelectedCase(prev => ({ ...prev, status }));
    toast.success(`Case status updated to: ${status}`);
  };

  const addNote = () => {
    if (!note.trim() || !selectedCase) return;
    const updated = { ...selectedCase, notes: selectedCase.notes + '\n[' + new Date().toLocaleDateString() + '] ' + note };
    setCases(prev => prev.map(c => c.id === selectedCase.id ? updated : c));
    setSelectedCase(updated);
    setNote('');
    toast.success('Investigation note added');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Case Management</h1>
          <p className="text-slate-500 text-sm mt-1">{cases.length} active cases • Fraud investigation tracker</p>
        </div>
        <button onClick={() => toast.success('New case creation coming soon!')} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Case
        </button>
      </div>

      {/* Case Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Cases', value: cases.length, color: '#00d4ff' },
          { label: 'Confirmed Fraud', value: cases.filter(c => c.status === 'Confirmed Fraud').length, color: '#ff0055' },
          { label: 'Under Investigation', value: cases.filter(c => c.status === 'Under Investigation').length, color: '#ffc107' },
          { label: 'False Positives', value: cases.filter(c => c.status === 'False Positive').length, color: '#00ff88' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4">
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-slate-500 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === s ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            style={statusFilter === s ? { background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(c => {
            const pCfg = PRIORITY_CFG[c.priority] || PRIORITY_CFG.Medium;
            return (
              <div key={c.id}
                onClick={() => setSelectedCase(c)}
                className={`glass-card p-5 cursor-pointer transition-all duration-200 ${selectedCase?.id === c.id ? 'border-[rgba(0,212,255,0.4)]' : ''}`}
                style={selectedCase?.id === c.id ? { borderColor: 'rgba(0,212,255,0.4)', boxShadow: '0 0 20px rgba(0,212,255,0.05)' } : {}}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-500 text-xs font-mono">{c.id}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: pCfg.bg, color: pCfg.color }}>
                        {c.priority}
                      </span>
                    </div>
                    <div className="text-white font-semibold">{c.beneficiary}</div>
                  </div>
                  <span className={c.status === 'Confirmed Fraud' ? 'status-confirmed' : c.status === 'Under Investigation' ? 'status-investigating' : 'status-cleared'}>
                    {c.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                  <div><span className="text-slate-600">Fraud Type: </span>{c.fraudType}</div>
                  <div><span className="text-slate-600">Risk Score: </span>
                    <span className={c.riskScore >= 60 ? 'text-[#ff4466]' : c.riskScore >= 30 ? 'text-[#ffc107]' : 'text-[#00ff88]'}>
                      {c.riskScore}/100
                    </span>
                  </div>
                  <div><span className="text-slate-600">Assigned: </span>{c.assignedTo}</div>
                  <div><span className="text-slate-600">Updated: </span>{c.lastUpdated}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Case Detail Panel */}
        <div>
          {selectedCase ? (
            <div className="glass-card p-5 sticky top-0 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold">Case Details</h3>
                <button onClick={() => setSelectedCase(null)} className="text-slate-500 hover:text-white">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="text-slate-500 text-xs mb-1">Case ID</div>
                <div className="text-[#00d4ff] font-mono text-sm">{selectedCase.id}</div>
              </div>

              <div>
                <div className="text-slate-500 text-xs mb-1">Beneficiary</div>
                <div className="text-white font-semibold">{selectedCase.beneficiary}</div>
              </div>

              <div>
                <div className="text-slate-500 text-xs mb-1">Fraud Type</div>
                <div className="text-slate-300 text-sm">{selectedCase.fraudType}</div>
              </div>

              <div>
                <div className="text-slate-500 text-xs mb-1">Risk Score</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${selectedCase.riskScore}%`,
                      background: selectedCase.riskScore >= 60 ? '#ff0055' : '#ffc107'
                    }} />
                  </div>
                  <span className={`font-bold text-sm ${selectedCase.riskScore >= 60 ? 'text-[#ff4466]' : 'text-[#ffc107]'}`}>
                    {selectedCase.riskScore}
                  </span>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <div className="text-slate-500 text-xs mb-2">Update Status</div>
                <div className="grid grid-cols-1 gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => updateStatus(selectedCase.id, s)}
                      className={`text-sm py-2 px-3 rounded-lg text-left transition-colors font-medium ${selectedCase.status === s ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                      style={selectedCase.status === s ? { background: 'rgba(0,212,255,0.12)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.25)' } : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      {s === 'Confirmed Fraud' ? '⚠ Confirmed Fraud' : s === 'Under Investigation' ? '🔍 Under Investigation' : s === 'False Positive' ? '✓ False Positive' : '✕ Closed'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <div className="text-slate-500 text-xs mb-2 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> Investigation Notes
                </div>
                <div className="p-3 rounded-lg text-xs text-slate-400 mb-3 max-h-28 overflow-y-auto whitespace-pre-line"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {selectedCase.notes}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Add investigation note..."
                    className="cyber-input text-xs py-2 flex-1"
                    onKeyDown={e => e.key === 'Enter' && addNote()}
                  />
                  <button onClick={addNote} className="btn-primary text-xs px-3 py-2">Add</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 text-center text-slate-600">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a case to view details and manage investigation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
