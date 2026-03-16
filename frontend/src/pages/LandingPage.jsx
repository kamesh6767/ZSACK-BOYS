import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, AlertTriangle, Users, TrendingUp, Database, Eye,
  Zap, BarChart3, Bell, FileSearch, ArrowRight, ChevronRight,
  CheckCircle, Globe, Lock, Activity, Github, FileText
} from 'lucide-react';
import ShadowOverlay from '../components/ShadowOverlay';
import InfoModal from '../components/InfoModal';
import SlideMenu from '../components/SlideMenu';
import { TextEffect } from '../components/TextEffect';
import FeatureCard from '../components/FeatureCard';
import { motion, AnimatePresence } from 'framer-motion';

// Animated counter component
function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const end = parseFloat(target);
        const duration = 2000;
        const step = (end / duration) * 16;
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start * 10) / 10);
        }, 16);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{count % 1 === 0 ? Math.floor(count) : count.toFixed(1)}{suffix}</span>;
}

const features = [
  { 
    icon: Zap, 
    title: 'Automated Fraud Detection', 
    desc: 'Isolation Forest ML model detects anomalous beneficiaries in milliseconds across millions of records.', 
    color: '#ff0055',
    details: [
      { label: 'Core Engine', value: 'Isolation Forest + Autoencoders' },
      { label: 'Throughput', value: '10M+ records / minute' },
      { label: 'Precision', value: '96.4% Accuracy' },
      { label: 'Audit Link', value: 'ISO-27001 Compliant' }
    ]
  },
  { 
    icon: Users, 
    title: 'Duplicate Identity Detection', 
    desc: 'DBSCAN clustering identifies beneficiaries sharing UIDs, phones, addresses, or bank accounts.', 
    color: '#00d4ff',
    details: [
      { label: 'Algorithm', value: 'DBSCAN + Fuzzy Matching' },
      { label: 'Identifiers', value: 'Aadhar, Phone, Address' },
      { label: 'Linking', value: 'Cross-scheme identity mapping' },
      { label: 'Speed', value: 'Real-time sync' }
    ]
  },
  { 
    icon: BarChart3, 
    title: 'Risk Scoring Engine', 
    desc: 'Each beneficiary is assigned a 0–100 fraud risk score with explainable AI indicators.', 
    color: '#8b5cf6',
    details: [
      { label: 'Variables', value: '200+ Behavioral signals' },
      { label: 'Explainability', value: 'SHAP/LIME indicator values' },
      { label: 'Classification', value: 'High/Med/Low priority' },
      { label: 'Automation', value: 'Case auto-generation' }
    ]
  },
  { 
    icon: Activity, 
    title: 'Real-time Monitoring', 
    desc: 'Live dashboard tracks fraud patterns, regional heatmaps, and scheme-wise anomalies.', 
    color: '#00ff88',
    details: [
      { label: 'Latencey', value: '< 200ms ingestion' },
      { label: 'Granularity', value: 'State/District/Taluk' },
      { label: 'Visuals', value: 'Real-time Heatmaps' },
      { label: 'Uptime', value: '99.9% Service SLA' }
    ]
  },
  { 
    icon: Eye, 
    title: 'Advanced Data Visualization', 
    desc: 'Interactive Chart.js dashboards with line graphs, pie charts, and geographic distributions.', 
    color: '#ffc107',
    details: [
      { label: 'Technology', value: 'Chart.js / Canvas API' },
      { label: 'Export', value: 'PDF / Audit-ready XLSX' },
      { label: 'Interactive', value: 'Drill-down exploration' },
      { label: 'Sharing', value: 'Secure shared links' }
    ]
  },
  { 
    icon: Bell, 
    title: 'Real-time Alerts', 
    desc: 'Instant notifications for detected fraud clusters, shared accounts, and high-risk beneficiaries.', 
    color: '#ff6b35',
    details: [
      { label: 'Channels', value: 'SMS, WhatsApp, Email' },
      { label: 'Trigger', value: 'Instant high-risk detection' },
      { label: 'Response', value: 'Automated case management' },
      { label: 'Priority', value: 'Tier-based escalations' }
    ]
  },
  { 
    icon: TrendingUp, 
    title: 'Multi-Dimensional Scaling', 
    desc: 'Advanced pattern recognition that scales across multiple welfare schemes simultaneously.', 
    color: '#00d4ff',
    details: [
      { label: 'Feature Space', value: '500+ Dimensional Analysis' },
      { label: 'Computation', value: 'Distributed GPU Clusters' },
      { label: 'Cross-Match', value: 'State-wide Schema Linking' },
      { label: 'API Sync', value: 'RESTful Webhooks' }
    ]
  },
  { 
    icon: Lock, 
    title: 'Blockchain Integrity', 
    desc: 'Immutable audit trails for every detection action, ensuring total transparency and security.', 
    color: '#8b5cf6',
    details: [
      { label: 'Ledger', value: 'Hyperledger Fabric' },
      { label: 'Hashing', value: 'SHA-256 Content ID' },
      { label: 'Consensus', value: 'Proof of Authority' },
      { label: 'Trust', value: 'Decentralized Audit Log' }
    ]
  },
  { 
    icon: FileText, 
    title: 'Forensic Trail Log', 
    desc: 'Complete history of beneficiary data changes and AI decisions for legal evidence.', 
    color: '#ff0055',
    details: [
      { label: 'Retention', value: '7-Year Legal Holding' },
      { label: 'Format', value: 'Digitally Signed JSON-LD' },
      { label: 'Auditability', value: 'Court-Ready Exports' },
      { label: 'Security', value: 'Hardware Security Module' }
    ]
  },
];

const problems = [
  { icon: Users, title: 'Duplicate Beneficiaries', desc: 'Millions of individuals enrolled multiple times under different identities to claim benefits repeatedly.' },
  { icon: AlertTriangle, title: 'Ghost / Fake Identities', desc: 'Fabricated IDs created without any physical existence to siphon government funds.' },
  { icon: Database, title: 'Fraudulent Subsidy Claims', desc: 'Inflated or ineligible subsidy claims submitted through forged documents and bribed officials.' },
  { icon: TrendingUp, title: 'Manual Verification Delays', desc: 'Conventional manual auditing is slow, costly, and misses sophisticated organized fraud networks.' },
];

const steps = [
  { step: '01', title: 'Upload Dataset', desc: 'Upload CSV/Excel beneficiary data via secure portal', icon: Database },
  { step: '02', title: 'Data Processing', desc: 'Automated cleaning, validation, and normalization', icon: FileSearch },
  { step: '03', title: 'AI Detection', desc: 'Isolation Forest + DBSCAN scan for anomalies', icon: Zap },
  { step: '04', title: 'Risk Scoring', desc: 'Each record scored 0–100 with fraud probability', icon: BarChart3 },
  { step: '05', title: 'Dashboard Alerts', desc: 'High-risk cases flagged with actionable insights', icon: Bell },
];

const govBenefits = [
  'Up to 97% reduction in undetected fraud',
  'Real-time investigation triggers',
  'Data-driven policy decisions',
  'Cross-scheme fraud detection',
];

const citizenBenefits = [
  'Fair and transparent benefit distribution',
  'Faster legitimate claim approvals',
  'Reduced administrative delays',
  'Improved government accountability',
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [modalData, setModalData] = useState({ open: false, title: '', content: '' });
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const slideRefs = {
    0: useRef(null),
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
    4: useRef(null),
    5: useRef(null),
  };

  const scrollToSlide = (index) => {
    setActiveSlide(index);
    const element = document.getElementById(`slide-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openInfo = (title) => {
    const contents = {
      'Dashboard': 'Centralized monitoring hub for all active welfare schemes and fraud metrics.',
      'Analytics': 'Advanced statistical decomposition of behavioral patterns using ML clustering.',
      'Fraud Detection': 'Protocol engine for identifying cross-scheme duplicate identities and ghost beneficiaries.',
      'Case Management': 'Operational workflow tools for tracking field investigations and enforcement actions.',
      'Documentation': 'Comprehensive technical guide for CyberShield API integration and administrative rules.',
      'API Reference': 'Detailed endpoint documentation for system-to-system automated data exchange.',
      'User Guide': 'Instructional manual for government analysts and administrative officers.',
      'Security Policy': 'Governing framework for data sovereignty, privacy protection, and encryption standards.',
      'About': 'The CyberShield mission: Securing the future of welfare through AI transparency.',
      'Privacy Policy': 'Our absolute commitment to citizen data protection and ethical AI governance.',
      'Contact': 'Direct communication protocols for administrative and technical support requests.',
    };
    setModalData({ open: true, title, content: contents[title] || '' });
  };

  const openFeatureInfo = (feature) => {
    const featureContent = (
      <div className="space-y-6">
        <p className="text-slate-300 text-sm leading-relaxed">{feature.desc}</p>
        <div className="bg-[#0a0e1a]/80 p-5 rounded-lg border border-white/10 shadow-inner">
          <h4 className="text-xs font-mono text-white mb-4 uppercase tracking-wider" style={{ color: feature.color }}>Technical Specifications</h4>
          <div className="space-y-3">
            {feature.details.map((d, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">{d.label}</span>
                <span className="text-sm text-slate-100 font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
    setModalData({ open: true, title: feature.title, content: featureContent });
  };

  return (
    <div className="h-screen bg-[#0a0e1a] text-slate-100 overflow-y-scroll overflow-x-hidden snap-y snap-mandatory scroll-smooth relative no-scrollbar">
      <SlideMenu activeSlide={activeSlide} onSelect={scrollToSlide} />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}
        style={{ background: scrolled ? 'rgba(10,14,26,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(0,212,255,0.1)' : 'none' }}>

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 pl-12 md:pl-0">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #0070e0)' }}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white">CyberShield</span>
              <span className="text-xs text-slate-500 block -mt-1 font-mono">AI FRAUD DETECTION</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="btn-secondary text-sm px-5 py-2">Login</button>
            <button onClick={() => navigate('/login')} className="btn-primary text-sm px-5 py-2 hover-glow">Get Started</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="slide-0" className="relative min-h-screen flex items-center overflow-hidden snap-start" onMouseEnter={() => setActiveSlide(0)}>
        <ShadowOverlay 
          color="rgba(0, 212, 255, 0.08)"
          animation={{ scale: 30, speed: 10 }}
          noise={{ opacity: 0.05, scale: 1.5 }}
        >
          <div className="absolute inset-0 cyber-grid opacity-20" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16 h-full flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-semibold font-mono uppercase tracking-wider"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                AI-Powered • Government Grade • Real-Time Detection
              </div>

              <TextEffect 
                as="h1" 
                preset="blur" 
                className="text-4xl md:text-7xl font-black text-white mb-8 uppercase tracking-tight leading-none"
              >
                AI FRAUD DETECTION FOR WELFARE SCHEMES
              </TextEffect>

              <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Using <span className="text-[#00d4ff] font-semibold">Artificial Intelligence</span> to prevent subsidy fraud and ensure fair distribution of government welfare benefits to genuine beneficiaries.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button onClick={() => navigate('/login')} className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                  <Shield className="w-5 h-5" /> Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('/login')} className="btn-secondary flex items-center gap-2 text-base px-8 py-4">
                  <Eye className="w-5 h-5" /> View Demo
                </button>
                <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#00d4ff] transition-colors px-6 py-4">
                  <Database className="w-4 h-4" /> Upload Dataset
                </button>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { value: '1.7', suffix: 'T', prefix: '₹', label: 'Estimated Fraud Loss', color: '#ff0055' },
                  { value: '40', suffix: 'M+', prefix: '', label: 'Duplicate Beneficiaries', color: '#ffc107' },
                  { value: '96', suffix: '%', prefix: '', label: 'Detection Accuracy', color: '#00ff88' },
                ].map((stat, i) => (
                  <div key={i} className="glass-card p-6 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `radial-gradient(ellipse at center, ${stat.color}08, transparent)` }} />
                    <div className="text-4xl font-black mb-1" style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}50` }}>
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                    </div>
                    <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ShadowOverlay>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #0a0e1a)' }} />
      </section>

      {/* PROBLEM SECTION */}
      <section id="slide-1" className="min-h-screen py-32 px-6 snap-start flex flex-col justify-center shrink-0" onMouseEnter={() => setActiveSlide(1)}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-[#ff0055] uppercase tracking-widest mb-3 block">The Problem</span>
            <h2 className="text-4xl font-bold text-white mb-4">The Scale of <span className="text-gradient-danger">Welfare Fraud</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Every year, billions of rupees meant for India's most vulnerable citizens are lost to organized fraud networks exploiting systemic weaknesses.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((p, i) => (
              <div key={i} className="glass-card p-6 group hover:border-[rgba(255,0,85,0.3)] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,0,85,0.1)' }}>
                  <p.icon className="w-6 h-6 text-[#ff0055]" />
                </div>
                <h3 className="font-bold text-white mb-2">{p.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section id="slide-2" className="min-h-screen py-32 px-6 snap-start flex flex-col justify-center shrink-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.02), transparent)' }} onMouseEnter={() => setActiveSlide(2)}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-3 block">Our Solution</span>
              <h2 className="text-4xl font-bold text-white mb-6">How <span className="text-gradient-cyber">CyberShield AI</span> Fights Fraud</h2>
              <p className="text-slate-400 leading-relaxed mb-8">CyberShield applies cutting-edge machine learning algorithms to government welfare datasets, identifying fraud patterns that human auditors would take years to find — in seconds.</p>
              <div className="space-y-4">
                {[
                  { title: 'Isolation Forest', desc: 'Detects statistical outliers and anomalous beneficiary records in large-scale datasets' },
                  { title: 'DBSCAN Clustering', desc: 'Groups suspicious beneficiaries sharing critical attributes like addresses or bank accounts' },
                  { title: 'Graph Network Analysis', desc: 'Maps hidden connections between beneficiaries using NetworkX relationship graphs' },
                  { title: 'Real-time Risk Scoring', desc: 'Assigns 0–100 fraud probability scores with interpretable indicators for every beneficiary' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-lg" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
                    <CheckCircle className="w-5 h-5 text-[#00d4ff] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-white text-sm">{item.title}</div>
                      <div className="text-slate-400 text-sm mt-1">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ background: '#00d4ff' }} />
              <div className="font-mono text-xs space-y-3">
                <div className="text-[#00d4ff] mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />CYBERSHIELD AI ENGINE — ACTIVE</div>
                {[
                  { label: '// Isolation Forest scan', value: '284,750 records', color: '#94a3b8' },
                  { label: 'Anomalies detected:', value: '1,847 flagged', color: '#ff0055' },
                  { label: 'DBSCAN clusters:', value: '23 suspicious groups', color: '#ffc107' },
                  { label: 'Shared bank accounts:', value: '312 conflicts', color: '#ff6b35' },
                  { label: 'Duplicate UIDs:', value: '89 pairs found', color: '#ff0055' },
                  { label: 'Ghost beneficiaries:', value: '156 suspected', color: '#ff6b35' },
                  { label: 'Risk scores computed:', value: '284,750 / 284,750', color: '#00ff88' },
                  { label: 'Detection accuracy:', value: '96.4%', color: '#00d4ff' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between" style={{ animationDelay: `${i * 0.1}s` }}>
                    <span className="text-slate-500">{row.label}</span>
                    <span style={{ color: row.color }}>{row.value}</span>
                  </div>
                ))}
                <div className="border-t border-slate-700 pt-3 mt-3">
                  <div className="flex justify-between text-[#00ff88]">
                    <span>STATUS</span>
                    <span className="animate-pulse">■ MONITORING ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="slide-3" className="min-h-screen py-32 px-6 snap-start flex flex-col justify-center shrink-0" onMouseEnter={() => setActiveSlide(3)}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-[#8b5cf6] uppercase tracking-widest mb-3 block">Platform Features</span>
            <h2 className="text-4xl font-bold text-white mb-4">Enterprise-Grade <span className="text-gradient-cyber">Fraud Intelligence</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Built for government scale — CyberShield handles millions of records with military-grade accuracy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={i} feature={f} onLearnMore={() => openFeatureInfo(f)} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="slide-4" className="min-h-screen py-32 px-6 snap-start flex flex-col justify-center shrink-0" style={{ background: 'linear-gradient(0deg, transparent, rgba(0,212,255,0.03), transparent)' }} onMouseEnter={() => setActiveSlide(4)}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-[#00ff88] uppercase tracking-widest mb-3 block">Process</span>
            <h2 className="text-4xl font-bold text-white mb-4">How It <span className="text-gradient-success">Works</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">From raw data to actionable fraud intelligence in 5 automated steps.</p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 opacity-20"
              style={{ background: 'linear-gradient(90deg, transparent 5%, #00d4ff 50%, transparent 95%)' }} />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {steps.map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 relative z-10"
                    style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.05))', border: '2px solid rgba(0,212,255,0.3)' }}>
                    <s.icon className="w-7 h-7 text-[#00d4ff]" />
                  </div>
                  <div className="text-[#00d4ff] font-mono text-xs font-bold mb-2">STEP {s.step}</div>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="slide-5" className="min-h-screen py-32 px-6 snap-start flex flex-col justify-center shrink-0" onMouseEnter={() => setActiveSlide(5)}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-[#ffc107] uppercase tracking-widest mb-3 block">Benefits</span>
            <h2 className="text-4xl font-bold text-white mb-4">Who <span className="text-gradient-cyber">Benefits</span></h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)' }}>
                  <Globe className="w-5 h-5 text-[#00d4ff]" />
                </div>
                <h3 className="text-xl font-bold text-white">For Government</h3>
              </div>
              <div className="space-y-3">
                {govBenefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#00d4ff] flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,255,136,0.1)' }}>
                  <Users className="w-5 h-5 text-[#00ff88]" />
                </div>
                <h3 className="text-xl font-bold text-white">For Citizens</h3>
              </div>
              <div className="space-y-3">
                {citizenBenefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#00ff88] flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION & FOOTER GROUP */}
      <div className="min-h-screen snap-start shrink-0 flex flex-col justify-end">
        <section className="py-24 px-6 flex-grow flex items-center">
          <div className="max-w-4xl mx-auto text-center w-full">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.1), transparent 70%)' }} />
            <div className="relative z-10">
              <Shield className="w-16 h-16 text-[#00d4ff] mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Eliminate Welfare Fraud?</h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">Join government agencies already using CyberShield to protect public funds and ensure benefits reach genuine beneficiaries.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => navigate('/login')} className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                  <Shield className="w-5 h-5" /> Access Dashboard <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('/login')} className="btn-secondary flex items-center gap-2 text-base px-8 py-4">
                  <Database className="w-5 h-5" /> Upload Dataset
                </button>
              </div>
            </div>
          </div>
        </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t py-12 px-6" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #0070e0)' }}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">CyberShield</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">AI-powered fraud detection system for government welfare schemes. Protecting public funds since 2024.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
              <div className="space-y-2 text-sm text-slate-500">
                {['Dashboard', 'Analytics', 'Fraud Detection', 'Case Management'].map(l => (
                  <div key={l} onClick={() => openInfo(l)} className="hover:text-[#00d4ff] cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Resources</h4>
              <div className="space-y-2 text-sm text-slate-500">
                {['Documentation', 'API Reference', 'User Guide', 'Security Policy'].map(l => (
                  <div key={l} onClick={() => openInfo(l)} className="hover:text-[#00d4ff] cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Organization</h4>
              <div className="space-y-2 text-sm text-slate-500">
                <div onClick={() => openInfo('About')} className="hover:text-[#00d4ff] cursor-pointer transition-colors">About</div>
                <div onClick={() => openInfo('Privacy Policy')} className="hover:text-[#00d4ff] cursor-pointer transition-colors">Privacy Policy</div>
                <div onClick={() => openInfo('Contact')} className="hover:text-[#00d4ff] cursor-pointer transition-colors">Contact</div>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#00d4ff] transition-colors">
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <p className="text-slate-600 text-sm">© 2024 CyberShield. Government AI Initiative. All rights reserved.</p>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Lock className="w-3 h-3" /> TLS Encrypted • AES-256 Database • SOC 2 Compliant
            </div>
          </div>
          </div>
        </footer>
      </div>

      <InfoModal 
        isOpen={modalData.open} 
        onClose={() => setModalData(prev => ({ ...prev, open: false }))}
        title={modalData.title}
        content={modalData.content}
      />
    </div>
  );
}
