import { useState } from 'react';
import { Search, Filter, Download, Eye, Flag, CheckCircle, ChevronDown } from 'lucide-react';
import { mockBeneficiaries } from '../data/mockData';
import toast from 'react-hot-toast';

const SCHEME_FILTERS = ['All', 'PM-KISAN', 'NREGA', 'PM-AWY', 'PMJDY', 'NSAP'];
const RISK_FILTERS = ['All', 'High Risk', 'Medium Risk', 'Low Risk'];
const STATUS_FILTERS = ['All', 'Confirmed Fraud', 'Under Investigation', 'Cleared'];

export default function BeneficiariesPage() {
  const [search, setSearch] = useState('');
  const [schemeFilter, setSchemeFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortField, setSortField] = useState('riskScore');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = mockBeneficiaries.filter(b => {
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) || b.nationalId.toLowerCase().includes(search.toLowerCase());
    const matchScheme = schemeFilter === 'All' || b.scheme === schemeFilter;
    const matchRisk = riskFilter === 'All' ||
      (riskFilter === 'High Risk' && b.riskScore >= 60) ||
      (riskFilter === 'Medium Risk' && b.riskScore >= 30 && b.riskScore < 60) ||
      (riskFilter === 'Low Risk' && b.riskScore < 30);
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchSearch && matchScheme && matchRisk && matchStatus;
  }).sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    return (a[sortField] > b[sortField] ? 1 : -1) * dir;
  });

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const toggleRow = (id) => setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Beneficiary Registry</h1>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} records • AI fraud risk scored</p>
        </div>
        <button onClick={() => toast.success('Exporting to CSV...')} className="btn-secondary flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: mockBeneficiaries.length, color: '#00d4ff' },
          { label: 'Confirmed Fraud', value: mockBeneficiaries.filter(b => b.status === 'Confirmed Fraud').length, color: '#ff0055' },
          { label: 'Under Investigation', value: mockBeneficiaries.filter(b => b.status === 'Under Investigation').length, color: '#ffc107' },
          { label: 'Cleared', value: mockBeneficiaries.filter(b => b.status === 'Cleared').length, color: '#00ff88' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
            <div>
              <div className="text-white font-bold text-lg">{s.value}</div>
              <div className="text-slate-500 text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="beneficiary-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID, national ID..."
              className="cyber-input pl-9 text-sm py-2"
            />
          </div>
          {[
            { label: 'Scheme', options: SCHEME_FILTERS, value: schemeFilter, set: setSchemeFilter },
            { label: 'Risk Level', options: RISK_FILTERS, value: riskFilter, set: setRiskFilter },
            { label: 'Status', options: STATUS_FILTERS, value: statusFilter, set: setStatusFilter },
          ].map((f, i) => (
            <div key={i} className="relative">
              <select
                value={f.value}
                onChange={e => f.set(e.target.value)}
                className="cyber-input text-sm py-2 pr-8 cursor-pointer appearance-none min-w-36"
              >
                {f.options.map(o => <option key={o} value={o}>{o === 'All' ? `All ${f.label}s` : o}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
            </div>
          ))}
          <div className="flex items-center gap-2 text-xs text-slate-500 ml-auto">
            <Filter className="w-3 h-3" />
            {filtered.length} results
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="cyber-table">
            <thead>
              <tr>
                <th className="w-8"><input type="checkbox" className="rounded" onChange={e => setSelectedRows(e.target.checked ? filtered.map(b => b.id) : [])} /></th>
                <th>Name</th>
                <th>National ID</th>
                <th>Scheme</th>
                <th>Bank Account</th>
                <th>Region</th>
                <th className="cursor-pointer select-none" onClick={() => toggleSort('claimAmount')}>
                  Claim Amount {sortField === 'claimAmount' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="cursor-pointer select-none" onClick={() => toggleSort('riskScore')}>
                  Risk Score {sortField === 'riskScore' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th>Fraud Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className={selectedRows.includes(b.id) ? 'bg-[rgba(0,212,255,0.05)]' : ''}>
                  <td><input type="checkbox" checked={selectedRows.includes(b.id)} onChange={() => toggleRow(b.id)} className="rounded" /></td>
                  <td>
                    <div className="font-medium text-white">{b.name}</div>
                    <div className="text-slate-600 text-xs font-mono">{b.id}</div>
                  </td>
                  <td className="font-mono text-xs text-slate-400">{b.nationalId}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>
                      {b.scheme}
                    </span>
                  </td>
                  <td className="font-mono text-xs text-slate-500">{b.bankAcc}</td>
                  <td className="text-slate-400 text-sm">{b.region}</td>
                  <td className="font-mono text-sm">₹{b.claimAmount.toLocaleString('en-IN')}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all" style={{
                          width: `${b.riskScore}%`,
                          background: b.riskScore >= 60 ? 'linear-gradient(90deg,#ff4466,#ff0055)' : b.riskScore >= 30 ? '#ffc107' : '#00ff88'
                        }} />
                      </div>
                      <span className={b.riskScore >= 60 ? 'risk-high' : b.riskScore >= 30 ? 'risk-medium' : 'risk-low'}>
                        {b.riskScore}
                      </span>
                    </div>
                  </td>
                  <td className="text-slate-400 text-xs max-w-28 truncate">{b.fraudType || '—'}</td>
                  <td>
                    <span className={b.status === 'Confirmed Fraud' ? 'status-confirmed' : b.status === 'Under Investigation' ? 'status-investigating' : 'status-cleared'}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => toast.success(`Reviewing case for ${b.name}`)}
                        className="text-[#00d4ff] hover:text-white transition-colors" title="Review">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => toast.error(`Case flagged: ${b.name}`)}
                        className="text-[#ffc107] hover:text-white transition-colors" title="Flag">
                        <Flag className="w-4 h-4" />
                      </button>
                      {b.status !== 'Cleared' && (
                        <button onClick={() => toast.success(`${b.name} approved`)}
                          className="text-[#00ff88] hover:text-white transition-colors" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            No beneficiaries match the current filters
          </div>
        )}
      </div>
    </div>
  );
}
