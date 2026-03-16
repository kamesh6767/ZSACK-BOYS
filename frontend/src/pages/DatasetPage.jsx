import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Trash2, Eye, Play, Database, RefreshCw } from 'lucide-react';
import { mockDatasets } from '../data/mockData';
import toast from 'react-hot-toast';

const SAMPLE_PREVIEW = [
  { name: 'Ramesh Kumar', address: '45 MG Road, Delhi', phone: '9876543210', bankAcc: 'SBI-4521', nationalId: 'UID-7821-4532', scheme: 'PM-KISAN', claimAmount: 6000, region: 'Delhi' },
  { name: 'Suresh Patel', address: '12 Ring Road, Mumbai', phone: '9123456780', bankAcc: 'HDFC-8832', nationalId: 'UID-3210-7654', scheme: 'NREGA', claimAmount: 12000, region: 'Maharashtra' },
  { name: 'Priya Singh', address: '78 Anna Nagar, Chennai', phone: '8765432190', bankAcc: 'SBI-4521', nationalId: 'UID-5542-1234', scheme: 'PM-AWY', claimAmount: 250000, region: 'Tamil Nadu' },
  { name: 'Arjun Mehta', address: '33 Koramangala, Bangalore', phone: '7654321890', bankAcc: 'ICICI-2211', nationalId: 'UID-9988-7766', scheme: 'PMJDY', claimAmount: 5000, region: 'Karnataka' },
  { name: 'Kavita Sharma', address: '90 Civil Lines, Jaipur', phone: '6543218900', bankAcc: 'PNB-6677', nationalId: 'UID-1122-3344', scheme: 'PM-KISAN', claimAmount: 6000, region: 'Rajasthan' },
];

function ProgressBar({ value, color }) {
  return (
    <div className="progress-bar flex-1">
      <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

export default function DatasetPage() {
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [datasets, setDatasets] = useState(mockDatasets);
  const fileRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFile = (file) => {
    if (!file.name.match(/\.(csv|xlsx|xls)$/)) {
      toast.error('Only CSV and Excel files are supported');
      return;
    }
    setUploadedFile(file);
    setAnalysisResult(null);
    toast.success(`File "${file.name}" ready for analysis`);
  };

  const runAnalysis = async () => {
    if (!uploadedFile) return;
    setProcessing(true);
    toast.loading('Processing dataset...', { id: 'analysis' });

    // Simulate multi-step processing
    await new Promise(r => setTimeout(r, 3500));
    const result = {
      totalRecords: Math.floor(Math.random() * 5000) + 1000,
      validRecords: 0,
      duplicates: Math.floor(Math.random() * 200) + 50,
      anomalies: Math.floor(Math.random() * 150) + 30,
      highRisk: Math.floor(Math.random() * 50) + 10,
      sharedAccounts: Math.floor(Math.random() * 30) + 5,
      missingFields: Math.floor(Math.random() * 20) + 2,
      completionTime: (Math.random() * 5 + 2).toFixed(1),
    };
    result.validRecords = result.totalRecords - result.duplicates - result.missingFields;
    setAnalysisResult(result);
    setProcessing(false);
    toast.success('Analysis complete! Fraud patterns detected.', { id: 'analysis' });

    // Add to datasets list
    const newDs = {
      id: `DS-00${datasets.length + 1}`,
      name: uploadedFile.name,
      records: result.totalRecords,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Analyzed',
      fraudFound: result.anomalies,
      scheme: 'Mixed',
    };
    setDatasets(prev => [newDs, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dataset Management</h1>
        <p className="text-slate-500 text-sm mt-1">Upload and analyze welfare beneficiary datasets for fraud detection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Zone */}
        <div>
          <h3 className="text-white font-semibold mb-4">Upload New Dataset</h3>
          <div
            className={`upload-zone ${dragging ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
              onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
            <Upload className="w-12 h-12 text-[#00d4ff] mx-auto mb-4 opacity-70" />
            <p className="text-white font-semibold mb-2">
              {dragging ? 'Drop your file here' : 'Drag & Drop or Click to Upload'}
            </p>
            <p className="text-slate-500 text-sm">Supports CSV, Excel (.xlsx, .xls)</p>
            <p className="text-slate-600 text-xs mt-2">Max 50MB • Encrypted at rest</p>
          </div>

          {uploadedFile && (
            <div className="mt-4 p-4 rounded-xl flex items-center gap-4"
              style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <FileText className="w-8 h-8 text-[#00d4ff]" />
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm truncate">{uploadedFile.name}</div>
                <div className="text-slate-500 text-xs">{(uploadedFile.size / 1024).toFixed(1)} KB • Ready for analysis</div>
              </div>
              <button onClick={runAnalysis} disabled={processing} className="btn-primary flex items-center gap-2 text-sm py-2">
                {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {processing ? 'Analyzing...' : 'Run AI Analysis'}
              </button>
            </div>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <div className="mt-4 glass-card p-5 space-y-4">
              <h4 className="text-white font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00ff88]" /> Analysis Complete
                <span className="text-slate-500 text-xs font-normal ml-auto">in {analysisResult.completionTime}s</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Records', value: analysisResult.totalRecords.toLocaleString(), color: '#00d4ff' },
                  { label: 'Valid Records', value: analysisResult.validRecords.toLocaleString(), color: '#00ff88' },
                  { label: 'Duplicates Found', value: analysisResult.duplicates, color: '#ff0055' },
                  { label: 'Anomalies Detected', value: analysisResult.anomalies, color: '#ffc107' },
                  { label: 'High Risk', value: analysisResult.highRisk, color: '#ff4466' },
                  { label: 'Shared Accounts', value: analysisResult.sharedAccounts, color: '#ff6b35' },
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-slate-500 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Processing steps */}
              <div className="space-y-2 text-xs font-mono">
                {['Data validation', 'Deduplication scan', 'Isolation Forest run', 'DBSCAN clustering', 'Risk scoring', 'Alert generation'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-500">
                    <CheckCircle className="w-3 h-3 text-[#00ff88]" />
                    {step} — <span className="text-[#00ff88]">Done</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Data Preview */}
        <div>
          <h3 className="text-white font-semibold mb-4">Dataset Field Preview</h3>
          <div className="glass-card overflow-hidden">
            <div className="p-3 border-b flex items-center gap-2 text-xs text-slate-500 font-mono"
              style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
              <Database className="w-3 h-3" /> welfare_sample_data.csv • 5 of 284,750 rows
            </div>
            <div className="overflow-x-auto">
              <table className="cyber-table text-xs">
                <thead>
                  <tr>
                    {Object.keys(SAMPLE_PREVIEW[0]).map(k => <th key={k} className="capitalize">{k}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_PREVIEW.map((row, i) => (
                    <tr key={i}>
                      {Object.entries(row).map(([k, v]) => (
                        <td key={k} className={k === 'bankAcc' && row.bankAcc === 'SBI-4521' ? 'text-[#ff0055]' : ''}>
                          {k === 'claimAmount' ? `₹${v.toLocaleString()}` : String(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 text-xs text-slate-600 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
              <AlertTriangle className="w-3 h-3 text-[#ff0055]" />
              <span className="text-[#ff0055]">Bank account SBI-4521 appears in multiple rows</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset History */}
      <div className="glass-card p-6">
        <h3 className="text-white font-bold mb-5">Dataset History</h3>
        <div className="overflow-x-auto">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Dataset Name</th><th>Scheme</th><th>Records</th>
                <th>Upload Date</th><th>Fraud Found</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map(ds => (
                <tr key={ds.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#00d4ff]" />
                      <div>
                        <div className="text-white text-sm font-medium">{ds.name}</div>
                        <div className="text-slate-600 text-xs font-mono">{ds.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                      {ds.scheme}
                    </span>
                  </td>
                  <td className="font-mono">{ds.records.toLocaleString()}</td>
                  <td className="text-slate-400 text-sm font-mono">{ds.uploadDate}</td>
                  <td>
                    <span className={ds.fraudFound > 0 ? 'text-[#ff0055] font-semibold' : 'text-slate-500'}>
                      {ds.fraudFound > 0 ? `⚠ ${ds.fraudFound}` : '—'}
                    </span>
                  </td>
                  <td>
                    <span className={ds.status === 'Analyzed' ? 'status-cleared' : 'status-investigating'}>
                      {ds.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-3">
                      <button onClick={() => toast.success('Viewing dataset...')} className="text-[#00d4ff] hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => toast.error('Dataset removed')} className="text-slate-600 hover:text-[#ff0055] transition-colors"><Trash2 className="w-4 h-4" /></button>
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
