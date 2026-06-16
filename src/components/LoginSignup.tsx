import { useState, FormEvent } from 'react';
import { Mail, Lock, User as UserIcon, X, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

interface LoginSignupProps {
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; avatar?: string }) => void;
  initialTab?: 'login' | 'signup';
}

export default function LoginSignup({ onClose, onLoginSuccess, initialTab = 'login' }: LoginSignupProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please provide your secure password');
      return;
    }
    if (activeTab === 'signup' && !name) {
      setError('Please state your full name');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters');
      return;
    }

    // Simulate successful login/signup
    if (activeTab === 'login') {
      setSuccess('Logged in successfully!');
      setTimeout(() => {
        onLoginSuccess({
          name: name || email.split('@')[0],
          email: email,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`
        });
        onClose();
      }, 1000);
    } else {
      setSuccess('Account created credentials saved successfully!');
      setTimeout(() => {
        onLoginSuccess({
          name: name,
          email: email,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`
        });
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF385C] via-rose-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 rounded-full transition-all text-gray-500 hover:text-[#FF385C] cursor-pointer"
          id="auth-close-button"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Main Content scrollable panel */}
        <div className="p-6 md:p-8 overflow-y-auto no-scrollbar">
          
          <div className="text-center mt-3 mb-6 select-none">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight flex items-center justify-center gap-2">
              <span className="text-[#FF385C]">★</span> ProStates Core Spaces
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">
              {activeTab === 'login' ? 'Welcome back! Explore your dream stays.' : 'Join the elite community of modern travelers.'}
            </p>
          </div>

          {/* Tab Selector Buttons */}
          <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800 mb-6 font-black text-xs select-none">
            <button
              onClick={() => {
                setActiveTab('login');
                setError('');
                setSuccess('');
              }}
              className={`py-2.5 rounded-lg transition-all cursor-pointer ${activeTab === 'login' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-slate-900'}`}
            >
              Log In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setError('');
                setSuccess('');
              }}
              className={`py-2.5 rounded-lg transition-all cursor-pointer ${activeTab === 'signup' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-slate-900'}`}
            >
              Sign Up
            </button>
          </div>

          {/* Notifications area */}
          {error && (
            <div className="mb-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400 font-bold animate-fade-in text-left">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-fade-in text-left">
              <Check className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Forms inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] transition-all outline-none"
                  />
                </div>
              </div>
            )}

            <div className="text-left">
              <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] transition-all outline-none"
                />
              </div>
            </div>

            <div className="text-left">
              <label className="block text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 dark:text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot section */}
            <div className="flex items-center justify-between text-xs font-bold select-none pt-1">
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#FF385C] focus:ring-[#FF385C]"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => alert("Simulation detail: A forgot password link has been sent to specified terminal inbox.")}
                className="text-[#FF385C] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              className="w-full mt-4 bg-[#FF385C] hover:bg-[#e62e50] text-white py-3.5 rounded-xl font-black text-sm shadow-md hover:shadow-rose-500/10 active:scale-[0.98] transition-all cursor-pointer text-center"
            >
              {activeTab === 'login' ? 'Confirm and Log In' : 'Join Membership'}
            </button>
          </form>

          {/* Social connections separator */}
          <div className="relative my-6 select-none">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-gray-400">or continue with</span>
            </div>
          </div>

          {/* Social Sign In Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                setEmail('ahad.google@example.com');
                setName('Ahad Google');
                setPassword('googlePass123');
              }}
              type="button"
              className="flex items-center justify-center gap-2 py-3 border border-gray-250 dark:border-gray-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer text-xs font-black text-slate-900 dark:text-white transition-all active:scale-95"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.44 1.7 14.89 1 12 1 7.35 1 3.37 3.67 1.45 7.55l3.77 2.92C6.1 7.08 8.82 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.55 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.48c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.75-4.92 3.75-8.58z" />
                <path fill="#FBBC05" d="M5.22 14.77C4.98 14.07 4.84 13.32 4.84 12.5s.14-1.57.38-2.27L1.45 7.31c-1.07 2.14-1.45 4.54-1.45 6.94 0 2.4.38 4.8 1.45 6.94l3.77-2.92z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.96-1.07 7.95-2.92l-3.7-2.87c-1.03.69-2.35 1.1-4.25 1.1-3.18 0-5.9-2.04-6.78-5.43L1.45 15.8C3.37 19.68 7.35 23 12 23z" />
              </svg>
              <span>Google Account</span>
            </button>
            <button
              onClick={() => {
                setEmail('ahad.apple@example.com');
                setName('Ahad Apple');
                setPassword('appleSecret7');
              }}
              type="button"
              className="flex items-center justify-center gap-2 py-3 border border-gray-250 dark:border-gray-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer text-xs font-black text-slate-900 dark:text-white transition-all active:scale-95"
            >
              <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.55 2.95-1.39z" />
              </svg>
              <span>Apple Passkey</span>
            </button>
          </div>

          <div className="mt-8 text-[11px] text-gray-500 font-semibold leading-relaxed">
            By logging in or creating a new profile, you acknowledge compliance with our standard <span className="underline cursor-pointer select-all">Terms of Conduct</span>, <span className="underline cursor-pointer select-all">Payment Protections</span>, and <span className="underline cursor-pointer select-all">Nondiscrimination guidelines</span>.
          </div>

        </div>

      </div>
    </div>
  );
}
