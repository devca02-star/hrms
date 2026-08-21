import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OffboardingRecord } from '../../types';
import { 
  UserMinus, 
  CheckCircle2, 
  Clock, 
  Download, 
  AlertTriangle, 
  Key, 
  FileText, 
  Sparkles,
  PlusCircle,
  Award
} from 'lucide-react';

export const OffboardingManager: React.FC = () => {
  const { 
    currentUser, 
    offboardingRecords, 
    submitResignation, 
    updateNoDuesClearance, 
    markFnfDisbursed,
    issueRelievingLetter,
    allEmployees, 
    currentRole,
    exportDataToCsv 
  } = useApp();

  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [form, setForm] = useState({
    lastWorkingDayNotes: 'Moving to higher education / corporate venture.',
    waiverRequested: false
  });

  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    submitResignation(form.lastWorkingDayNotes, form.waiverRequested);
    setIsInitiateModalOpen(false);
  };

  const handleToggleClearance = (recordId: string, itemKey: keyof OffboardingRecord['noDuesStatus'], currentValue: boolean) => {
    updateNoDuesClearance(recordId, itemKey, !currentValue);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              Separation & F&F
            </span>
            <span className="text-xs text-slate-400">• Full & Final Settlement Pipeline (10-Day SLA)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Offboarding & Knowledge Transfer Console</h2>
          <p className="text-xs text-slate-500">
            Systematic deal handover, Zoom credential de-provisioning, and statutory dues settlement.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => exportDataToCsv('Verve_Offboarding_Records', offboardingRecords)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Offboarding</span>
          </button>

          <button
            onClick={() => setIsInitiateModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Resignation</span>
          </button>
        </div>
      </div>

      {/* Offboarding Records Grid */}
      <div className="space-y-4">
        {offboardingRecords.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No consultants currently in the separation or notice period pipeline.
          </div>
        ) : (
          offboardingRecords.map(rec => (
            <div key={rec.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-900">{rec.employeeName}</h3>
                    <span className="text-xs text-slate-400 font-mono">({rec.designation} • {rec.department})</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Resigned: {rec.resignationDate} • Notice Period: <strong>{rec.mandatoryNoticeDays} Days</strong> • LWD: <strong className="text-rose-600">{rec.lastWorkingDay}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    rec.fnfStatus === 'Disbursed' ? 'bg-emerald-100 text-emerald-800' : 
                    rec.fnfStatus === 'Calculated' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    F&F: {rec.fnfStatus}
                  </span>
                </div>
              </div>

              {/* Clearance Checkpoints */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Mandatory Clearance Milestones & Knowledge Handover
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label className="flex items-start space-x-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={rec.noDuesStatus.managerKnowledgeHandover}
                      onChange={() => handleToggleClearance(rec.id, 'managerKnowledgeHandover', rec.noDuesStatus.managerKnowledgeHandover)}
                      className="mt-0.5 text-indigo-600 rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800">Knowledge Transfer</span>
                      <p className="text-[10px] text-slate-400">Models & deal pitch books handed over</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={rec.noDuesStatus.itAssetsRevoked}
                      onChange={() => handleToggleClearance(rec.id, 'itAssetsRevoked', rec.noDuesStatus.itAssetsRevoked)}
                      className="mt-0.5 text-indigo-600 rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800">Zoom & IT Accounts Revoked</span>
                      <p className="text-[10px] text-slate-400">Virtual bullpens disconnected</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={rec.noDuesStatus.adminAccessTerminated}
                      onChange={() => handleToggleClearance(rec.id, 'adminAccessTerminated', rec.noDuesStatus.adminAccessTerminated)}
                      className="mt-0.5 text-indigo-600 rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800">NDA & Client Data Destruction</span>
                      <p className="text-[10px] text-slate-400">Confidential files verified wiped</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={rec.noDuesStatus.financeAndClaimsCleared}
                      onChange={() => handleToggleClearance(rec.id, 'financeAndClaimsCleared', rec.noDuesStatus.financeAndClaimsCleared)}
                      className="mt-0.5 text-indigo-600 rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800">Finance & Reimbursements Clear</span>
                      <p className="text-[10px] text-slate-400">All outstanding vouchers audited</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={rec.noDuesStatus.hrExitInterviewCompleted}
                      onChange={() => handleToggleClearance(rec.id, 'hrExitInterviewCompleted', rec.noDuesStatus.hrExitInterviewCompleted)}
                      className="mt-0.5 text-indigo-600 rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800">HR Exit Interview</span>
                      <p className="text-[10px] text-slate-400">Structured exit survey completed</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* F&F Actions */}
              {['super_admin', 'hr_admin'].includes(currentRole) && (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">
                    Target F&F Disbursal Deadline: <strong className="text-slate-800">{rec.fnfDeadlineDate}</strong>
                  </span>

                  <div className="flex items-center space-x-2">
                    {rec.fnfStatus !== 'Disbursed' && (
                      <button
                        onClick={() => markFnfDisbursed(rec.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Disburse Final Settlement
                      </button>
                    )}

                    {!rec.relievingLetterIssued && (
                      <button
                        onClick={() => issueRelievingLetter(rec.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Issue Relieving Letter
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Submit Resignation Modal */}
      {isInitiateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Submit Formal Resignation</h3>
              <button onClick={() => setIsInitiateModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleInitiate} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                <span className="font-bold">Notice Period Policy: </span>
                <span>
                  As a <strong>{currentUser.level}</strong>, the standard contractual notice period is 
                  <strong> {['Manager', 'Associate Director', 'Partner'].includes(currentUser.level) ? '90' : '60'} calendar days</strong>.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Handover Transition Notes</label>
                <textarea
                  rows={3}
                  required
                  value={form.lastWorkingDayNotes}
                  onChange={(e) => setForm({ ...form, lastWorkingDayNotes: e.target.value })}
                  placeholder="e.g. Pursuing personal entrepreneurial venture. Client models handed over to team."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden text-xs"
                />
              </div>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.waiverRequested}
                  onChange={(e) => setForm({ ...form, waiverRequested: e.target.checked })}
                  className="text-indigo-600 rounded"
                />
                <span className="text-slate-700 font-semibold">Request Notice Period Early Relief Waiver</span>
              </label>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsInitiateModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-md cursor-pointer"
                >
                  Confirm & Submit Resignation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
