import React from 'react';
import { X, Shield, Lock, Globe, FileText, Bell, Zap, Info } from 'lucide-react';

export default function InfoModal({ isOpen, onClose, title, content }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0a0e1a]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg glass-card p-8 animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <Info className="w-5 h-5 text-[#00d4ff]" />
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>

        <div className="space-y-4 text-slate-300 leading-relaxed">
          <div className="text-sm">
            {content || "This section provides detailed information about CyberShield's protocols and administrative framework. Our AI systems are designed to ensure maximum transparency and security for government welfare distribution."}
          </div>
          
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 mt-6">
            <div className="flex items-center gap-2 text-[#00ff88] text-xs font-mono mb-2 uppercase tracking-wider">
              <Lock className="w-3 h-3" /> Security Level: Verified
            </div>
            <p className="text-xs text-slate-500 font-mono">
              IP TRACE: ACTIVE // ENCRYPTION: AES-256-GCM // AUTH: MFA_REQUIRED
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={onClose}
            className="btn-primary text-xs px-6 py-2"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
}
