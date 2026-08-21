import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HrRequest, RequestType, RequestStatus } from '../../types';
import { 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  Send,
  HelpCircle,
  Building2,
  Lock
} from 'lucide-react';

export const HrRequestsHub: React.FC = () => {
  const { 
    currentUser, 
    hrRequests, 
    submitHrRequest, 
    updateHrRequestStatus, 
    currentRole,
    exportDataToCsv 
  } = useApp();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [form, setForm] = useState({
    requestType: 'Employment Letter' as HrRequest['requestType'],
    subject: '',
    description: '',
    urgency: 'Standard' as HrRequest['urgency']
  });

  const requestTypes: HrRequest['requestType'][] = [
    'Employment Letter',
    'Salary Certificate',
    'Experience Letter',
    'Document Request',
    'Profile Update',
    'HR Query',
    'Other Request'
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject) return;

    submitHrRequest({
      requestType: form.requestType,
      subject: form.subject,
      description: form.description,
      urgency: form.urgency
    });

    setIsNewModalOpen(false);
    setForm({
      requestType: 'Employment Letter',
      subject: '',
      description: '',
      urgency: 'Standard'
    });
  };

  const visibleRequests = ['super_admin', 'hr_admin'].includes(currentRole)
    ? hrRequests
    : hrRequests.filter(r => r.employeeId === currentUser.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Employee Services
            </span>
            <span className="text-xs text-slate-400">• SLA 24-48 Hours</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">HR Service Desk & Letter Generation</h2>
          <p className="text-xs text-slate-500">
            Request official employment verification, visa support, and salary certificates.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => exportDataToCsv('Verve_HR_Requests', visibleRequests)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Requests</span>
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Raise HR Ticket</span>
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Ticket & Type</th>
              <th className="p-3.5">Employee</th>
              <th className="p-3.5">Subject & Description</th>
              <th className="p-3.5">Urgency</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleRequests.map(req => (
              <tr key={req.id} className="hover:bg-slate-50">
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{req.requestType}</div>
                  <span className="text-[10px] font-mono text-slate-400">REQ-{req.id.slice(-4)}</span>
                </td>
                <td className="p-3.5">
                  <div className="font-semibold text-slate-800">{req.employeeName}</div>
                  <span className="text-[10px] text-slate-400">{req.department}</span>
                </td>
                <td className="p-3.5 max-w-xs">
                  <div className="font-bold text-slate-800 truncate">{req.subject}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{req.description}</div>
                </td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    req.urgency === 'Urgent' ? 'bg-rose-100 text-rose-800' :
                    req.urgency === 'Standard' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {req.urgency}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    req.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                    req.status === 'In Processing' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  {['super_admin', 'hr_admin'].includes(currentRole) && req.status !== 'Completed' && (
                    <button
                      onClick={() => updateHrRequestStatus(req.id, 'Completed', 'Document prepared and sealed on Verve letterhead.')}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold cursor-pointer"
                    >
                      Issue Letter
                    </button>
                  )}
                  {req.attachmentFileName && (
                    <button
                      onClick={() => alert(`Simulating download of ${req.attachmentFileName} on Verve Advisory letterhead.`)}
                      className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-semibold cursor-pointer ml-1"
                    >
                      Download Letter
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Raise Ticket Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Raise HR Letter / Service Request</h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Request Classification *</label>
                <select
                  value={form.requestType}
                  onChange={(e) => setForm({ ...form, requestType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-hidden"
                >
                  {requestTypes.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Need Employment Verification Letter for US Visa"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Instructions / Addressee</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Please address to 'Consulate General of the United States' including annual CTC."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Urgency Priority</label>
                <select
                  value={form.urgency}
                  onChange={(e) => setForm({ ...form, urgency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-hidden"
                >
                  <option value="Standard">Standard (24-48 Hours)</option>
                  <option value="Urgent">Urgent (Same Day Embassy Submission)</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
