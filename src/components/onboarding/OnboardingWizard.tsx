import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserPlus, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Video, 
  ShieldCheck, 
  Upload, 
  FileText, 
  Sparkles, 
  HeartHandshake,
  Clock,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { 
    currentUser, 
    onboardingStep, 
    setOnboardingStep,
    completeCurrentOnboardingStep, 
    updateCurrentUserProfile,
    policies,
    acknowledgments,
    acknowledgePolicy,
    uploadDocument,
    documents,
    currentRole,
    allEmployees,
    setCurrentUser
  } = useApp();

  const [signatureInput, setSignatureInput] = useState(currentUser.fullName);
  const [comprehensionAnswers, setComprehensionAnswers] = useState<Record<string, number>>({});
  const [selectedPolicyIndex, setSelectedPolicyIndex] = useState(0);

  // Form states for Step 2
  const [phone, setPhone] = useState(currentUser.phone);
  const [emergencyName, setEmergencyName] = useState(currentUser.emergencyContact.name);
  const [emergencyPhone, setEmergencyPhone] = useState(currentUser.emergencyContact.phone);

  const steps = [
    { num: 1, title: 'Welcome & Culture', desc: 'Verve Advisory high-trust pillars' },
    { num: 2, title: 'Profile & Emergency', desc: 'Verify personal & emergency data' },
    { num: 3, title: 'Zoom Virtual Office', desc: 'Setup camera & audio protocols' },
    { num: 4, title: 'Policy Sign-offs', desc: 'Review & digitally sign 9 policies' },
    { num: 5, title: 'Document Vault', desc: 'Upload KYC, IDs & degrees' },
    { num: 6, title: 'KRAs & 90-Day Goals', desc: 'Review probation milestones' },
    { num: 7, title: 'Induction Complete', desc: 'Official transition to practice' }
  ];

  const handlePrevStep = () => {
    if (onboardingStep > 1) {
      const prev = onboardingStep - 1;
      setOnboardingStep(prev);
      updateCurrentUserProfile({ onboardingStep: prev });
    }
  };

  const handleJumpToStep = (targetStep: number) => {
    if (targetStep >= 1 && targetStep <= 7) {
      setOnboardingStep(targetStep);
      updateCurrentUserProfile({ onboardingStep: targetStep });
    }
  };

  const currentPolicy = policies[selectedPolicyIndex] || policies[0];
  const isCurrentPolicySigned = acknowledgments.some(a => a.policyId === currentPolicy.id && a.employeeId === currentUser.id);

  const handleSignPolicy = () => {
    if (currentPolicy.requiresComprehensionCheck && currentPolicy.comprehensionQuestion) {
      const selectedAns = comprehensionAnswers[currentPolicy.id];
      if (selectedAns === undefined || selectedAns !== currentPolicy.comprehensionQuestion.correctIndex) {
        alert('Please select the correct answer to the comprehension check before signing.');
        return;
      }
    }
    acknowledgePolicy(currentPolicy.id, signatureInput || currentUser.fullName);
  };

  const handleSaveProfile = () => {
    updateCurrentUserProfile({
      phone,
      emergencyContact: {
        ...currentUser.emergencyContact,
        name: emergencyName,
        phone: emergencyPhone
      }
    });
    completeCurrentOnboardingStep();
  };

  const requiredDocTypes = [
    'National ID / Aadhaar',
    'Tax Card / PAN',
    'Educational Degree',
    'Signed Offer & NDA'
  ] as const;

  const uploadedDocTypes = documents.filter(d => d.employeeId === currentUser.id).map(d => d.documentName);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl mx-auto">
      
      {/* Top Cohort Switcher for Super Admins */}
      {currentRole === 'super_admin' && (
        <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-950">Super Admin Simulation: Select New Hire Context</span>
          </div>
          <select
            value={currentUser.id}
            onChange={(e) => {
              const selected = allEmployees.find(emp => emp.id === e.target.value);
              if (selected) setCurrentUser(selected);
            }}
            className="px-3 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg text-slate-800 focus:outline-hidden font-medium cursor-pointer"
          >
            {allEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.fullName} • Step {emp.onboardingStep}/7 ({emp.employmentStatus})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                Step {onboardingStep} of 7
              </span>
              <span className="text-xs text-slate-400">• New Consultant Induction</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {currentUser.fullName}’s Verve Advisory Onboarding
            </h2>
            <p className="text-xs text-slate-500">
              Assigned to {currentUser.department} • Reporting to {currentUser.reportingManagerName}
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-indigo-600">
              {Math.round((onboardingStep / 7) * 100)}% Completed
            </div>
            <div className="w-36 bg-slate-100 rounded-full h-2 mt-1.5 overflow-hidden">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(onboardingStep / 7) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stepper Wizard Indicator */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {steps.map(s => {
            const isDone = onboardingStep > s.num;
            const isCurrent = onboardingStep === s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => handleJumpToStep(s.num)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-left w-full ${
                  isCurrent ? 'bg-indigo-50 border-indigo-400 shadow-2xs ring-1 ring-indigo-400' :
                  isDone ? 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100/50' :
                  'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {s.num}
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-slate-800 truncate">{s.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Contents */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
        
        {/* STEP 1: WELCOME & CULTURE */}
        {onboardingStep === 1 && (
          <div className="space-y-6">
            <div className="max-w-2xl">
              <h3 className="text-lg font-bold text-slate-900">Welcome to Verve Advisory</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                We are a high-conviction financial and strategic advisory firm. Our culture is built on three uncompromising pillars designed for elite consulting execution.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-3">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">1. No-Leave Wellbeing</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  No leave balances or manager approval gatekeepers. Taking at least 18 days of annual rest is strictly mandatory.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3">
                  <Video className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">2. Virtual Bullpen (Zoom)</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Our virtual office operates on Zoom. Video cameras remain active to ensure high-touch collaboration and mentorship.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">3. 48-Hour Work Cadence</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Standard work week is Monday to Saturday (48 hours total) with automated telemetry ingestion from Zoom.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={completeCurrentOnboardingStep}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Acknowledge & Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROFILE & EMERGENCY CONTACT */}
        {onboardingStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Verify Personal & Emergency Details</h3>
              <p className="text-xs text-slate-600 mt-1">
                Please verify your active mobile phone number and primary emergency contact for compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Emergency Contact Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Shift Hours</label>
                <div className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono">
                  {currentUser.shiftStartTime} - {currentUser.shiftEndTime} ({currentUser.workScheduleType})
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-2xs transition-all cursor-pointer flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Save Profile & Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ZOOM VIRTUAL WORKPLACE SETUP */}
        {onboardingStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Zoom Virtual Office Telemetry Integration</h3>
              <p className="text-xs text-slate-600 mt-1">
                Your Zoom account is mapped to our real-time attendance rules engine.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Corporate Zoom Email:</span>
                <span className="font-mono font-bold text-indigo-600">{currentUser.zoomEmail}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Zoom User ID:</span>
                <span className="font-mono font-bold text-slate-900">{currentUser.zoomUserId}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Telemetry Ingestion Status:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active & Listening
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-2xs transition-all cursor-pointer flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={completeCurrentOnboardingStep}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Confirm Zoom Integration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: POLICY DIGITAL SIGN-OFFS */}
        {onboardingStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Mandatory Policy Digital Acknowledgement</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Read, comprehend, and cryptographically sign company policies.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-600">
                Policy {selectedPolicyIndex + 1} of {policies.length}
              </span>
            </div>

            {/* Policy Selector Pills */}
            <div className="flex overflow-x-auto gap-2 pb-2">
              {policies.map((p, idx) => {
                const isSigned = acknowledgments.some(a => a.policyId === p.id && a.employeeId === currentUser.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPolicyIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                      selectedPolicyIndex === idx ? 'bg-indigo-600 text-white shadow-xs' :
                      isSigned ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSigned && <CheckCircle2 className="w-3 h-3" />}
                    <span>{p.title.split(' ')[0]} {p.title.split(' ')[1]}</span>
                  </button>
                );
              })}
            </div>

            {/* Policy Reader Box */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-sm font-bold text-slate-900">{currentPolicy.title}</h4>
                <span className="text-xs text-slate-400">Version {currentPolicy.version}</span>
              </div>

              <p className="text-xs text-slate-700 font-medium leading-relaxed">{currentPolicy.summary}</p>

              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="font-bold text-slate-800">Key Policy Terms:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {currentPolicy.keyHighlights.map((kh, i) => (
                    <li key={i}>{kh}</li>
                  ))}
                </ul>
              </div>

              {/* Comprehension Check */}
              {currentPolicy.requiresComprehensionCheck && currentPolicy.comprehensionQuestion && (
                <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-2 mt-3">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                    Comprehension Verification
                  </span>
                  <p className="text-xs font-bold text-slate-900">{currentPolicy.comprehensionQuestion.question}</p>
                  <div className="space-y-1.5">
                    {currentPolicy.comprehensionQuestion.options.map((opt, oIdx) => (
                      <label key={oIdx} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name={`comp-${currentPolicy.id}`}
                          checked={comprehensionAnswers[currentPolicy.id] === oIdx}
                          onChange={() => setComprehensionAnswers({ ...comprehensionAnswers, [currentPolicy.id]: oIdx })}
                          className="text-indigo-600"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Signature Input */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {isCurrentPolicySigned ? (
                  <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Policy Acknowledged & Permanently Locked (SHA-256 Signed)</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={signatureInput}
                      onChange={(e) => setSignatureInput(e.target.value)}
                      placeholder="Type your full legal name"
                      className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono bg-white focus:outline-hidden"
                    />
                    <button
                      onClick={handleSignPolicy}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Sign Digitally
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-2xs transition-all cursor-pointer flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  disabled={selectedPolicyIndex === 0}
                  onClick={() => setSelectedPolicyIndex(p => Math.max(0, p - 1))}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                >
                  Previous Policy
                </button>
              </div>

              <button
                type="button"
                onClick={completeCurrentOnboardingStep}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Finish Policy Induction Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: DOCUMENT VAULT UPLOAD */}
        {onboardingStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Upload Essential Joining Documents</h3>
              <p className="text-xs text-slate-600 mt-1">
                Upload verified IDs and degree transcripts for your employee vault.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {requiredDocTypes.map(docType => {
                const isUploaded = uploadedDocTypes.some(d => d.includes(docType) || docType.includes(d));
                return (
                  <div key={docType} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{docType}</h4>
                      <span className="text-[10px] text-slate-400">PDF / JPG format • Max 10MB</span>
                    </div>

                    {isUploaded ? (
                      <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Uploaded</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          uploadDocument({
                            employeeId: currentUser.id,
                            employeeName: currentUser.fullName,
                            documentName: docType,
                            category: 'Identity',
                            fileName: `${currentUser.fullName.replace(/\s+/g, '_')}_${docType.replace(/\s+/g, '_')}.pdf`,
                            fileSize: '1.8 MB',
                            accessLevel: 'Employee'
                          });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Upload
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-2xs transition-all cursor-pointer flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={completeCurrentOnboardingStep}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Proceed to KRAs & Goals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: KRAS & PROBATION MILESTONES */}
        {onboardingStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">30-60-90 Day Probation Milestones</h3>
              <p className="text-xs text-slate-600 mt-1">
                Your key result areas (KRAs) established with {currentUser.reportingManagerName}.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Day 30: Advisory Modeling & Methodology Orientation</span>
                  <span className="text-indigo-600">Target: End of Month 1</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Complete internal valuation frameworks and attend live deal sprint sessions on Zoom.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Day 60: Client Deliverables & Pitch Authoring</span>
                  <span className="text-indigo-600">Target: End of Month 2</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Co-author at least 2 Confidential Information Memorandums (CIMs) and LBO models.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Day 90: Formal Probation Confirmation Review</span>
                  <span className="text-indigo-600">Date: {currentUser.probationEndDate}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  360 appraisal review with Practice Partner for transition to full permanent consultant.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-2xs transition-all cursor-pointer flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={completeCurrentOnboardingStep}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Finalize Induction</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: INDUCTION COMPLETE */}
        {onboardingStep === 7 && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Induction Completed Successfully!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Welcome aboard to Verve Advisory. You are fully provisioned with your Zoom Virtual Office credentials, signed policies on record, and 18-day mandatory rest tracker active.
            </p>
            <div className="pt-4 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-2xs transition-all cursor-pointer flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Review Milestones</span>
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-md cursor-pointer"
              >
                Go to Consultant Dashboard
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
