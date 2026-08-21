import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  KeyRound, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Sparkles,
  X
} from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onPasswordResetSuccess?: (email: string, newPass: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onPasswordResetSuccess
}) => {
  const { allEmployees, login, logAuditEvent } = useApp();

  const [step, setStep] = useState<'email' | 'otp' | 'new_password' | 'success'>('email');
  const [email, setEmail] = useState<string>(initialEmail || 'vikram.singhania@verveadvisory.com');
  const [matchedEmployee, setMatchedEmployee] = useState<any>(null);
  const [generatedOtp, setGeneratedOtp] = useState<string>('948210');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(45);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail) {
      setErrorMsg('Please provide a valid corporate email address.');
      return;
    }

    const emp = allEmployees.find(e => 
      e.companyEmail.toLowerCase() === cleanEmail ||
      e.personalEmail.toLowerCase() === cleanEmail ||
      e.zoomEmail.toLowerCase() === cleanEmail
    );

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setMatchedEmployee(emp || null);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setEnteredOtp(code); // Pre-fill for ultra-smooth demo evaluation
      setCountdown(45);
      setStep('otp');
    }, 450);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setErrorMsg('Invalid verification OTP code. Please re-check the 6-digit pin.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('new_password');
    }, 300);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 8) {
      setErrorMsg('Password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Password confirmation does not match.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      logAuditEvent(
        'Authentication',
        'Self-Service Password Reset Completed',
        matchedEmployee?.id,
        undefined,
        `Account password updated for ${email} [Role: ${matchedEmployee?.role || 'employee'}]`
      );
    }, 500);
  };

  const handleLoginImmediately = () => {
    if (matchedEmployee) {
      login(matchedEmployee.companyEmail, newPassword, matchedEmployee.role, 'Self-Service Password Recovery');
    } else {
      login(email, newPassword, undefined, 'Self-Service Password Recovery');
    }
    if (onPasswordResetSuccess) {
      onPasswordResetSuccess(email, newPassword);
    }
    onClose();
  };

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 30, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score: 70, label: 'Good', color: 'bg-amber-500' };
    return { score: 100, label: 'Strong & Enterprise Compliant', color: 'bg-emerald-500' };
  };

  const strength = calculatePasswordStrength(newPassword);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl text-slate-900 relative overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Reset Workspace Password</h3>
              <p className="text-[11px] text-slate-500">Verve Zero-Trust Self-Service Recovery</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between my-4 relative z-10">
          {[
            { id: 'email', label: '1. Identity' },
            { id: 'otp', label: '2. 2FA PIN' },
            { id: 'new_password', label: '3. Security' },
            { id: 'success', label: '4. Done' }
          ].map((s, i) => {
            const isActive = step === s.id;
            const isPassed = (
              (step === 'otp' && i === 0) ||
              (step === 'new_password' && i <= 1) ||
              (step === 'success' && i <= 2)
            );

            return (
              <div key={s.id} className="flex items-center space-x-1">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                  isActive ? 'bg-indigo-600 text-white shadow-2xs' :
                  isPassed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold' :
                  'text-slate-400 bg-slate-100'
                }`}>
                  {s.label}
                </span>
                {i < 3 && <span className="text-slate-300 text-xs">→</span>}
              </div>
            );
          })}
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2 my-3 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: IDENTITY (CORPORATE EMAIL) */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-4 relative z-10 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@verveadvisory.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                A secure 6-digit recovery PIN will be simulated for your employee profile.
              </p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Generating Secure PIN...</span>
              ) : (
                <>
                  <span>Send Recovery PIN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 relative z-10 animate-in fade-in duration-150">
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Target Profile:</span>
                <span className="font-bold text-indigo-950">{matchedEmployee?.fullName || email}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Role Authority:</span>
                <span className="font-mono text-indigo-700 uppercase font-bold">
                  {matchedEmployee?.role?.replace('_', ' ') || 'EMPLOYEE'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Enter 6-Digit One-Time Verification PIN
              </label>
              <input
                type="text"
                maxLength={6}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                className="w-full text-center tracking-[0.5em] text-2xl font-mono py-2.5 bg-slate-50 border border-indigo-300 rounded-xl text-indigo-700 font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
              <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                <span>Simulated PIN: <strong className="text-indigo-700 font-mono font-bold">{generatedOtp}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    const code = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedOtp(code);
                    setEnteredOtp(code);
                    setCountdown(45);
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend in {countdown}s</span>
                </button>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Verify & Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SET NEW PASSWORD */}
        {step === 'new_password' && (
          <form onSubmit={handleResetPassword} className="space-y-4 relative z-10 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Enterprise Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Complexity:</span>
                  <span className="font-semibold">{strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${strength.color}`} 
                    style={{ width: `${strength.score}%` }} 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Password Policy Badge */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Security Policy Requirements</span>
              </div>
              <ul className="text-[10px] text-slate-500 list-disc list-inside space-y-0.5">
                <li className={newPassword.length >= 8 ? 'text-emerald-700 font-medium' : ''}>Minimum 8 characters length</li>
                <li className={/[0-9]/.test(newPassword) ? 'text-emerald-700 font-medium' : ''}>Contains numerical digits</li>
                <li className={matchedEmployee ? 'text-indigo-700 font-medium' : ''}>Privileges linked to {matchedEmployee?.fullName || 'Profile'}</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !newPassword || newPassword !== confirmPassword}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Updating Security Credentials...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Update Password & Save</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === 'success' && (
          <div className="text-center py-4 space-y-4 relative z-10 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Password Updated Successfully!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Your workspace credentials have been securely updated. Privileges remain bound to <strong>{matchedEmployee?.fullName || email}</strong> ({matchedEmployee?.role?.replace('_', ' ').toUpperCase() || 'EMPLOYEE'}).
              </p>
            </div>

            <div className="pt-2 flex flex-col space-y-2">
              <button
                type="button"
                onClick={handleLoginImmediately}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Workspace Now</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onPasswordResetSuccess) {
                    onPasswordResetSuccess(email, newPassword);
                  }
                  onClose();
                }}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Return to Sign-In Screen
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
