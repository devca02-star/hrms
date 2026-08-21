import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Policy } from '../../types';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  Lock, 
  Key, 
  FileEdit,
  Fingerprint
} from 'lucide-react';

interface PolicyReaderModalProps {
  policy: Policy;
  onClose: () => void;
  onEditRequested?: () => void;
}

export const PolicyReaderModal: React.FC<PolicyReaderModalProps> = ({ 
  policy, 
  onClose,
  onEditRequested 
}) => {
  const { currentUser, acknowledgments, acknowledgePolicy, currentRole } = useApp();

  const isSigned = acknowledgments.some(a => a.policyId === policy.id && a.employeeId === currentUser.id);
  const userAck = acknowledgments.find(a => a.policyId === policy.id && a.employeeId === currentUser.id);

  const [signatureName, setSignatureName] = useState(currentUser.fullName);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSign = () => {
    if (isSigned) {
      setErrorMsg('This policy is already signed and locked for your profile.');
      return;
    }

    if (policy.requiresComprehensionCheck && policy.comprehensionQuestion) {
      if (selectedOption === null) {
        setErrorMsg('Please answer the comprehension question prior to signing.');
        return;
      }
      if (selectedOption !== policy.comprehensionQuestion.correctIndex) {
        setErrorMsg('Incorrect answer to comprehension check. Please review the policy highlights.');
        return;
      }
    }

    if (!signatureName.trim()) {
      setErrorMsg('Please enter your full legal name as digital signature.');
      return;
    }

    setErrorMsg('');
    acknowledgePolicy(policy.id, signatureName);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">{policy.title}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700">
                  {policy.version}
                </span>
                {isSigned && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Effective: {policy.effectiveDate} • Category: {policy.category}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentRole === 'super_admin' && onEditRequested && (
              <button
                onClick={onEditRequested}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer border border-indigo-200"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Edit Policy</span>
              </button>
            )}

            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Policy Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700 leading-relaxed">
          
          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1">
            <h4 className="font-bold text-indigo-950 uppercase tracking-wider text-[11px]">Executive Summary</h4>
            <p className="text-indigo-900 font-medium">{policy.summary}</p>
          </div>

          {/* Key Highlights */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Key Governance Principles</h4>
            <div className="grid grid-cols-1 gap-2">
              {policy.keyHighlights.map((kh, idx) => (
                <div key={idx} className="flex items-start space-x-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{kh}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Text Sections */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Detailed Policy Framework</h4>
            {policy.fullText.map((section, idx) => (
              <p key={idx} className="text-slate-600 bg-white p-3 rounded-lg border border-slate-100 font-sans">
                {section}
              </p>
            ))}
          </div>

          {/* Comprehension Check (Only if not signed yet) */}
          {policy.requiresComprehensionCheck && policy.comprehensionQuestion && !isSigned && (
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <h4 className="font-bold text-amber-950 text-xs">Mandatory Comprehension Verification</h4>
              </div>
              <p className="font-semibold text-amber-900 text-xs">{policy.comprehensionQuestion.question}</p>
              <div className="space-y-2">
                {policy.comprehensionQuestion.options.map((opt, oIdx) => (
                  <label key={oIdx} className="flex items-center space-x-2.5 p-2 rounded-lg bg-white border border-amber-100 hover:border-amber-300 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name={`comp-modal-${policy.id}`}
                      checked={selectedOption === oIdx}
                      onChange={() => setSelectedOption(oIdx)}
                      className="text-indigo-600"
                    />
                    <span className="text-slate-800">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

        </div>

        {/* Digital Signature & Locked Record Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {isSigned && userAck ? (
            <div className="flex items-center space-x-3 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 flex-1">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <div className="text-xs font-bold text-emerald-950">Digitally Signed & Locked Record</div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-200/70 text-emerald-900">
                    SHA-256 IMMUTABLE
                  </span>
                </div>
                <div className="text-[10px] text-emerald-800 font-mono mt-0.5 truncate">
                  Signatory: <strong>{userAck.signatureName}</strong> ({currentUser.employeeCode}) • Signed: {new Date(userAck.acknowledgedAt).toLocaleString()}
                </div>
                <div className="text-[9px] text-emerald-700 font-mono mt-0.5 truncate">
                  Terminal IP: {userAck.ipAddress} • Policy for you is locked; no re-signing required.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 flex-1">
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="Type legal name to digitally sign"
                  className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-hidden font-mono flex-1 max-w-sm"
                />
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">SHA-256 Sig</span>
              </div>
              <button
                onClick={handleSign}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Execute Digital Signature</span>
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
