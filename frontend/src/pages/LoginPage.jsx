import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ShadowOverlay from '../components/ShadowOverlay';
import toast from 'react-hot-toast';
import { BGPattern } from '../components/BGPattern';

const DEMO_ACCOUNTS = [
  { email: 'admin@cybershield.gov', password: 'Admin@123', role: 'Admin', color: '#00d4ff' },
  { email: 'analyst@cybershield.gov', password: 'Analyst@123', role: 'Analyst', color: '#8b5cf6' },
  { email: 'officer@cybershield.gov', password: 'Officer@123', role: 'Field Officer', color: '#00ff88' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = login(email, password);
    if (result.success) {
      toast.success('Access granted. Welcome to CyberShield.');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use a demo account below.');
    }
    setLoading(false);
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] px-4 relative overflow-hidden z-0">
      <BGPattern variant="grid" fill="#00d4ff" mask="fade-edges" className="opacity-15" />
      <ShadowOverlay 
        color="rgba(139, 92, 246, 0.08)"
        animation={{ scale: 40, speed: 15 }}
        noise={{ opacity: 0.05, scale: 1 }}
      >
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-full max-w-md relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #0070e0)', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">CyberShield Access Portal</h1>
              <p className="text-slate-500 text-sm mt-2">Authorized personnel only — Government AI System</p>
            </div>

            {/* Login Card */}
            <div className="glass-card p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="cyber-input pl-10"
                      placeholder="your.email@gov.in"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="cyber-input pl-10 pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: 'rgba(255,0,85,0.1)', border: '1px solid rgba(255,0,85,0.2)', color: '#ff4466' }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3"
                  id="login-btn"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Secure Login
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Demo Accounts */}
            <div className="mt-6">
              <p className="text-center text-xs text-slate-600 mb-3 uppercase tracking-wider font-mono">Demo Accounts</p>
              <div className="grid grid-cols-3 gap-3">
                {DEMO_ACCOUNTS.map((acc, i) => (
                  <button
                    key={i}
                    onClick={() => fillDemo(acc)}
                    id={`demo-${acc.role.toLowerCase().replace(' ', '-')}`}
                    className="p-3 rounded-lg text-center text-xs transition-all duration-200 cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${acc.color}25`, color: acc.color }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = acc.color + '60'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = acc.color + '25'}
                  >
                    <div className="font-semibold">{acc.role}</div>
                    <div className="text-slate-600 mt-1 font-mono" style={{ fontSize: '9px' }}>Click to fill</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center mt-6">
              <button onClick={() => navigate('/')} className="text-sm text-slate-600 hover:text-slate-400 transition-colors">
                ← Back to Landing Page
              </button>
            </div>

            <p className="text-center text-xs text-slate-700 mt-6">
              🔒 Secured with TLS 1.3 + AES-256 encryption • Audit logged
            </p>
          </div>
        </div>
      </ShadowOverlay>
    </div>
  );
}
