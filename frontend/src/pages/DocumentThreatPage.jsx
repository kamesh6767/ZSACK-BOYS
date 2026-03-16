import { useState, useEffect } from 'react';
import { 
  FileSearch, ShieldAlert, ShieldCheck, Upload, Trash2, 
  ExternalLink, FileText, AlertCircle, RefreshCw, Loader2,
  Lock, Search, Filter, ArrowUpRight
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default function DocumentThreatPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadProgress(10);

    try {
      setUploadProgress(30);
      const response = await axios.post(`${API_BASE_URL}/upload-document`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadProgress(100);
      toast.success('Document uploaded and scanned!');
      fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Clean': return '#00ff88';
      case 'Threat Detected': return '#ff0055';
      case 'Suspicious': return '#ffc107';
      case 'Scanning': return '#00d4ff';
      default: return '#94a3b8';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Clean': return <ShieldCheck className="w-4 h-4" style={{ color: '#00ff88' }} />;
      case 'Threat Detected': return <ShieldAlert className="w-4 h-4" style={{ color: '#ff0055' }} />;
      case 'Suspicious': return <AlertCircle className="w-4 h-4" style={{ color: '#ffc107' }} />;
      case 'Scanning': return <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#00d4ff' }} />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileSearch className="w-6 h-6 text-[#00d4ff]" />
            Document Threat Scanner
          </h1>
          <p className="text-slate-500 text-sm mt-1">Upload and analyze documents for potential security threats and malicious code using AI heuristics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchDocuments}
            className="p-2.5 rounded-lg border transition-all hover:bg-[rgba(255,255,255,0.05)]"
            style={{ backgroundColor: 'rgba(13,21,38,0.5)', borderColor: 'rgba(0,212,255,0.1)' }}
          >
            <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer transition-all shadow-lg hover:brightness-110 active:scale-95 text-white"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #0070e0)' }}>
            <Upload className="w-4 h-4" />
            Upload Document
            <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {uploading && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.03)] backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-[#00d4ff] animate-spin" />
              <span className="text-white font-medium">Analyzing Security Footprint...</span>
            </div>
            <span className="text-[#00d4ff] font-mono text-sm">{uploadProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#00d4ff]" 
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Scanned', value: documents.length, icon: FileText, color: '#00d4ff' },
          { label: 'Threats Detected', value: documents.filter(d => d.status === 'Threat Detected').length, icon: ShieldAlert, color: '#ff0055' },
          { label: 'Under Review', value: documents.filter(d => d.status === 'Suspicious').length, icon: AlertCircle, color: '#ffc107' },
          { label: 'Verified Clean', value: documents.filter(d => d.status === 'Clean').length, icon: ShieldCheck, color: '#00ff88' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl border" style={{ backgroundColor: '#0d1526', borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Documents Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#0d1526', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter scans by filename or status..." 
              className="w-full bg-[#0a0e1a]/50 border border-[rgba(255,255,255,0.05)] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#00d4ff]/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.05)] text-slate-400 hover:text-white text-xs transition-all">
              <Filter className="w-3.5 h-3.5" />
              Advanced Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0f192b] border-b border-[rgba(255,255,255,0.03)]">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Security Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Threat Score</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Scanner Payload</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.03)]">
              {documents.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-[rgba(0,212,255,0.05)]">
                        <Lock className="w-8 h-8 text-[#00d4ff] opacity-40" />
                      </div>
                      <div className="text-slate-400 font-medium">No documents scanned yet</div>
                      <div className="text-slate-600 text-sm">Upload a PDF or DOCX file to begin security analysis</div>
                    </div>
                  </td>
                </tr>
              )}
              
              {loading && Array(3).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="5" className="px-6 py-4 h-16 bg-[rgba(255,255,255,0.01)]" />
                </tr>
              ))}

              <AnimatePresence>
                {documents.map((doc) => (
                  <motion.tr 
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] group-hover:border-[#00d4ff]/20 transition-all">
                          <FileText className="w-5 h-5 text-slate-400 group-hover:text-[#00d4ff]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-[#00d4ff] transition-colors">{doc.filename}</div>
                          <div className="text-xs text-slate-600 font-mono mt-0.5">{doc.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold w-fit"
                        style={{ backgroundColor: `${getStatusColor(doc.status)}15`, color: getStatusColor(doc.status), border: `1px solid ${getStatusColor(doc.status)}25` }}>
                        {getStatusIcon(doc.status)}
                        {doc.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-16 bg-black/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${doc.threat_score}%`, 
                              backgroundColor: doc.threat_score > 60 ? '#ff0055' : doc.threat_score > 30 ? '#ffc107' : '#00ff88' 
                            }} 
                          />
                        </div>
                        <span className="text-xs font-mono text-slate-400">{doc.threat_score.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-500 line-clamp-1 italic max-w-[200px]">
                        {doc.threat_details || 'Scanning heuristics...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={doc.file_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 rounded-md hover:bg-[rgba(0,212,255,0.1)] text-slate-500 hover:text-[#00d4ff] transition-all"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                        <button className="p-1.5 rounded-md hover:bg-[rgba(255,0,85,0.1)] text-slate-600 hover:text-[#ff0055] transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
