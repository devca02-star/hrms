import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Mail,
  UserCheck,
  Check
} from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const LoginWall: React.FC = () => {
  const { 
    login, 
    systemSettings
  } = useApp();

  const [emailInput, setEmailInput] = useState<string>('vikram.singhania@verveadvisory.com');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  // Registered corporate accounts mapped to the 3 simple roles
  const quickAccounts = [
    {
      role: 'Super Admin',
      name: 'Vikramaditya Singhania',
      email: 'vikram.singhania@verveadvisory.com',
      badge: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      role: 'Manager',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@verveadvisory.com',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      role: 'Employee',
      name: 'Dev Chavan',
      email: 'dev.chavan@verveadvisory.com',
      badge: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  ];

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail) {
      setLoginError('Please enter your registered corporate work email address.');
      return;
    }

    if (!passwordInput) {
      setLoginError('Please enter your workspace password.');
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      login(emailInput, passwordInput);
      setIsAuthenticating(false);
    }, 350);
  };

  const handleQuickSelect = (email: string) => {
    setEmailInput(email);
    setPasswordInput('••••••••••••');
    setLoginError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans relative overflow-hidden">
      
      {/* Background Gradient & Light Geometric Grid matching dashboard */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-slate-100 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-600/20">
              V
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900">{systemSettings.organizationName.toUpperCase()}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Verve Advisory HRMS Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Valuations • M&A • Tax • Corporate Strategy</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Production Portal Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Hero & Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col lg:flex-row items-center justify-center gap-12">
        
        {/* Left Column: Platform Title & Scope */}
        <div className="w-full lg:w-5/12 space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Corporate Identity & Access Management</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Single Sign-In for <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-indigo-700 to-slate-900">
              Verve Advisory HRMS
            </span>
          </h2>

          <p className="text-sm text-slate-600 max-w-lg leading-relaxed">
            Welcome to the Verve Advisory enterprise workforce platform. Sign in with your registered corporate credentials to access your dashboard, directory, claims, and practice management tools.
          </p>

          {/* Quick Account Switcher Chips for Production Ease */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-center lg:justify-start gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Quick Account Pre-Fill:</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickAccounts.map((acc) => {
                const isSelected = emailInput.toLowerCase() === acc.email.toLowerCase();
                return (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleQuickSelect(acc.email)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20' 
                        : 'bg-white hover:bg-slate-50 border-slate-200/90 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-semibold text-xs text-slate-900">{acc.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${acc.badge}`}>
                          {acc.role}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono block truncate">{acc.email}</span>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Work Email Authentication Portal */}
        <div className="w-full lg:w-7/12 max-w-md">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 relative">
            
            <div className="mb-6 space-y-1">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Sign In to Your Account</h3>
              </div>
              <p className="text-xs text-slate-500">
                Enter your Verve Advisory work email to access your workspace.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2 font-medium">
                <Lock className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Production Work Email Sign-In Form */}
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              
              {/* Work Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Corporate Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@verveadvisory.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 pr-10 font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security & Access Scope Note */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Privileges are securely linked to your registered employee profile upon sign-in.
                </span>
              </div>

              {/* Remember Terminal */}
              <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              {/* Sign In CTA */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isAuthenticating ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In to Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 py-3.5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <span className="font-semibold text-slate-700">© 2026 Verve Advisory Services Ltd.</span>
        </div>
      </footer>

      {/* Forgot Password Recovery Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        initialEmail={emailInput}
        onPasswordResetSuccess={(email, newPass) => {
          setEmailInput(email);
          setPasswordInput(newPass);
        }}
      />

    </div>
  );
};
