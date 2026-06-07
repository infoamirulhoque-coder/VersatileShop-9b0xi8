import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { setAdminAuth } from '@/lib/storage';
import { ADMIN_PIN, LOGO_URL } from '@/constants';
import { toast } from 'sonner';

export default function Admin() {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (pin === ADMIN_PIN) {
        setAdminAuth(true);
        toast.success('অ্যাডমিন প্যানেলে স্বাগতম!');
        navigate('/admin/dashboard');
      } else {
        setError('ভুল পিন! আবার চেষ্টা করুন।');
        setPin('');
        toast.error('ভুল পিন!');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
      {/* Decorative */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-sm animate-scale-in">
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={LOGO_URL} alt="Logo" className="h-16 w-auto mx-auto object-contain mb-4" />
            <div className="flex items-center justify-center gap-2 text-white mb-1">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h1 className="text-xl font-extrabold">Admin Panel</h1>
            </div>
            <p className="bangla text-white/60 text-sm">নিরাপদ অ্যাডমিন অ্যাক্সেস</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="bangla text-white/80 text-sm font-medium block mb-2">পিন কোড</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="••••••"
                  maxLength={6}
                  autoComplete="off"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-center text-xl tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                />
                <button type="button" onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80">
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="bangla text-red-400 text-sm mt-2 text-center animate-fade-in-up">{error}</p>
              )}
            </div>

            {/* PIN dots visual */}
            <div className="flex justify-center gap-2">
              {[0,1,2,3,4,5].map(i => (
                <div key={i} className={`w-3 h-3 rounded-full transition-all duration-200 ${pin.length > i ? 'bg-cyan-400 scale-110' : 'bg-white/20'}`} />
              ))}
            </div>

            <button type="submit" disabled={loading || pin.length < 6}
              className="w-full btn-primary text-white py-3.5 rounded-xl font-bold bangla text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  লগইন করুন
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <a href="/" className="bangla text-white/50 text-xs hover:text-white/80 transition-colors">
              ← ওয়েবসাইটে ফিরুন
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
