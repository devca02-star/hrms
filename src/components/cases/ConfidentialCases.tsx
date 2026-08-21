import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConfidentialCase, CaseCategory, CaseStatus } from '../../types';
import { 
  ShieldAlert, 
  PlusCircle, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Clock, 
  FileText, 
  Send,
  Download,
  Info
} from 'lucide-react';

export const ConfidentialCases: React.FC = () => {
  const { 
    currentUser, 
    confidentialCases, 
    fileConfidentialCase, 
    updateCaseStatus, 
    currentRole,
    exportDataToCsv 
  } = useApp();

  const [isFilingModalOpen, setIsFilingModalOpen] = useState(false);

  // Filing Form State
  const [form, setForm] = useState({
    category: 'POSH (Sexual Harassment)' as ConfidentialCase['category'],
    incidentDate: new Date().toISOString().split('T')[0],
    description: '',
    isAnonymous: false,
    locationContext: 'Virtual Office / Zoom Call' as ConfidentialCase['locationContext'],
    witnessesOrEvidence: '',
    priority: 'High' as ConfidentialCase['priority']
  });

  const categories: ConfidentialCase['category'][] = [
    'POSH (Sexual Harassment)',
    'Employee Grievance',
    'Discrimination',
    'Retaliation',
    'Policy Violation',
    'Attendance Issue',
    'Performance Issue',
    'Disciplinary Matter',
    'Other'
  ];

  const handleFileCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description) return;

    fileConfidentialCase({
      category: form.category,
      incidentDate: form.incidentDate,
      description: form.description,
      isAnonymous: form.isAnonymous,
      isPoshRestricted: form.category === 'POSH (Sexual Harassment)',
      locationContext: form.locationContext,
      witnessesOrEvidence: form.witnessesOrEvidence,
      priority: form.priority
    });

    setIsFilingModalOpen(false);
    setForm({
      category: 'POSH (Sexual Harassment)',
      incidentDate: new Date().toISOString().split('T')[0],
      description: '',
      isAnonymous: false,
      locationContext: 'Virtual Office / Zoom Call',
      witnessesOrEvidence: '',
      priority: 'High'
    });
  };

  // Access Control: Employees only see their own cases; HR/Super Admin see all
  const visibleCases = ['super_admin', 'hr_admin'].includes(currentRole)
    ? confidentialCases
    : confidentialCases.filter(c => c.reporterEmployeeId === currentUser.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              Confidentiality Vault
            </span>
            <span className="text-xs text-slate-400">• POSH & Ethics Internal Committee</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Confidential Grievances & POSH Desk</h2>
          <p className="text-xs text-slate-500">
            End-to-end encrypted grievance intake governed by the Internal Complaints Committee (ICC).
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {['super_admin', 'hr_admin'].includes(currentRole) && (
            <button
              onClick={() => exportDataToCsv('Verve_Confidential_Cases_Encrypted', visibleCases)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Audit Trail</span>
            </button>
          )}

          <button
            onClick={() => setIsFilingModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>File Confidential Grievance</span>
          </button>
        </div>
      </div>

      {/* POSH / Zero Tolerance Notice */}
      <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 flex items-start space-x-3">
        <Lock className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-bold text-purple-900">Statutory POSH & Non-Retaliation Guarantee</h4>
          <p className="text-purple-800 mt-0.5 leading-relaxed">
            All submissions are routed exclusively to the Presiding Officer and external legal member of the Verve Advisory ICC. Whistleblowers and complainants are strictly protected against any adverse workplace actions.
          </p>
        </div>
      </div>

      {/* Cases List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="text-sm font-bold text-slate-900">
            {['super_admin', 'hr_admin'].includes(currentRole) ? 'All Internal Committee Dockets' : 'My Filed Grievances'} ({visibleCases.length})
          </h3>
        </div>

        {visibleCases.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs">No grievances or confidential matters logged in this registry.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {visibleCases.map(c => (
              <div key={c.id} className="p-5 hover:bg-slate-50 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono font-bold text-purple-900 text-xs px-2 py-0.5 rounded bg-purple-100">
                      {c.ticketNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{c.category}</span>
                    {c.isAnonymous && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-200 text-slate-700">
                        Anonymous
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'Resolved' || c.status === 'Closed' ? 'bg-emerald-100 text-emerald-800' :
                      c.status === 'Investigation' ? 'bg-purple-100 text-purple-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status}
                    </span>

                    {['super_admin', 'hr_admin'].includes(currentRole) && (
                      <select
                        aria-label="Update Case Status"
                        value={c.status}
                        onChange={(e) => updateCaseStatus(c.id, e.target.value as ConfidentialCase['status'], 'Updated via ICC Console.')}
                        className="text-[11px] font-semibold border border-slate-200 rounded px-2 py-1 bg-white cursor-pointer"
                      >
                        <option value="Open">Status: Open</option>
                        <option value="Under Review">Status: Under Review</option>
                        <option value="Investigation">Status: Investigation</option>
                        <option value="Action Required">Status: Action Required</option>
                        <option value="Resolved">Status: Resolved</option>
                        <option value="Closed">Status: Closed</option>
                      </select>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {c.description}
                </p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Incident Date: {c.incidentDate} • Location: {c.locationContext} • Filed: {new Date(c.filedAt).toLocaleDateString()}</span>
                  <span>Assigned Lead: {c.assignedHrName}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filing Modal */}
      {isFilingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">File Confidential Matter</h3>
              <button onClick={() => setIsFilingModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleFileCase} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Grievance Classification *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-hidden"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Incident</label>
                  <input
                    type="date"
                    value={form.incidentDate}
                    onChange={(e) => setForm({ ...form, incidentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Context / Location</label>
                  <select
                    value={form.locationContext}
                    onChange={(e) => setForm({ ...form, locationContext: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-hidden"
                  >
                    <option value="Virtual Office / Zoom Call">Virtual Office / Zoom Call</option>
                    <option value="Internal Messaging">Internal Messaging / Slack</option>
                    <option value="Client Communication">Client Communication</option>
                    <option value="In-Person Event">In-Person Advisory Event</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Account of Incident *</label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Please provide factual details of the occurrence, communication exchanges, and circumstances..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Evidence / Witness Names (Optional)</label>
                <input
                  type="text"
                  value={form.witnessesOrEvidence}
                  onChange={(e) => setForm({ ...form, witnessesOrEvidence: e.target.value })}
                  placeholder="e.g. Chat screenshots / meeting recordings available"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden text-xs"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Submit Anonymously</span>
                  <p className="text-[10px] text-slate-400">Mask your name and identity from the report record</p>
                </div>
                <input
                  type="checkbox"
                  checked={form.isAnonymous}
                  onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFilingModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Submit to ICC Desk</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
