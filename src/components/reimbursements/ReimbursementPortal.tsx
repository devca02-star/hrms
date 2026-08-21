import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReimbursementClaim, ReimbursementCategory } from '../../types';
import { 
  Receipt, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  FileText, 
  DollarSign, 
  AlertCircle, 
  Eye, 
  Send,
  Building2,
  Calendar
} from 'lucide-react';

export const ReimbursementPortal: React.FC = () => {
  const { 
    currentUser, 
    reimbursements, 
    submitReimbursement, 
    approveReimbursementManager, 
    verifyReimbursementFinance, 
    currentRole,
    exportDataToCsv 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'my_claims' | 'pending_approvals' | 'all_claims'>('my_claims');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  // Claim Form State
  const [formData, setFormData] = useState({
    category: 'Client Meals' as ReimbursementClaim['category'],
    requestedAmount: '',
    currency: 'INR',
    expenseDate: new Date().toISOString().split('T')[0],
    description: '',
    receiptName: 'client_tax_invoice.pdf',
    notes: ''
  });

  const categories: ReimbursementClaim['category'][] = [
    'Client Meals',
    'Business Travel',
    'Accommodation',
    'Seminars',
    'Webinars',
    'Courses',
    'Postage',
    'Courier',
    'Client Entertainment',
    'Other Business Expense'
  ];

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.requestedAmount || !formData.description) return;

    submitReimbursement({
      category: formData.category,
      requestedAmount: parseFloat(formData.requestedAmount),
      currency: formData.currency,
      expenseDate: formData.expenseDate,
      description: formData.description,
      receiptName: formData.receiptName,
      isPrePayrollCompliant: true,
      notes: formData.notes
    });

    setIsSubmitModalOpen(false);
    setFormData({
      category: 'Client Meals',
      requestedAmount: '',
      currency: 'INR',
      expenseDate: new Date().toISOString().split('T')[0],
      description: '',
      receiptName: 'client_tax_invoice.pdf',
      notes: ''
    });
  };

  const myClaims = reimbursements.filter(r => r.employeeId === currentUser.id);
  const pendingApprovals = reimbursements.filter(r => r.managerApprovalStatus === 'Pending' || r.financeVerificationStatus === 'Pending');

  const displayedClaims = 
    activeTab === 'my_claims' ? myClaims :
    activeTab === 'pending_approvals' ? pendingApprovals :
    reimbursements;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Expense Management
            </span>
            <span className="text-xs text-slate-400">• 2-Stage Approval Pipeline</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Reimbursements & Claims Portal</h2>
          <p className="text-xs text-slate-500">
            Submit client travel, advisory subscriptions, and home-office expenses before the 7-day payroll cutoff.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => exportDataToCsv('Verve_Expense_Claims', reimbursements)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Claims</span>
          </button>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Expense Claim</span>
          </button>
        </div>
      </div>

      {/* 7-Day Payroll Cutoff Notice */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-bold text-amber-900">Monthly Payroll Reimbursement Cutoff Notice</h4>
          <p className="text-amber-800 mt-0.5">
            All claims verified and approved at least 7 days before the month end will be disbursed in the current month’s advisory payroll cycle.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('my_claims')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'my_claims' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Expense Claims ({myClaims.length})
        </button>

        {['super_admin', 'hr_admin', 'manager'].includes(currentRole) && (
          <>
            <button
              onClick={() => setActiveTab('pending_approvals')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors flex items-center space-x-1.5 ${
                activeTab === 'pending_approvals' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Pending Review Pipeline</span>
              {pendingApprovals.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                  {pendingApprovals.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('all_claims')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                activeTab === 'all_claims' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Master Firm Claims ({reimbursements.length})
            </button>
          </>
        )}
      </div>

      {/* Claims List Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Claimant</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Expense Date</th>
                <th className="p-3.5">Description & Receipt</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">1. Manager Stage</th>
                <th className="p-3.5">2. Finance Stage</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedClaims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No reimbursement claims found in this view.
                  </td>
                </tr>
              ) : (
                displayedClaims.map(claim => (
                  <tr key={claim.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>{claim.employeeName}</div>
                      <span className="text-[10px] text-slate-400">{claim.department}</span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium">{claim.category}</td>
                    <td className="p-3.5 font-mono text-slate-600">{claim.expenseDate}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800">{claim.description}</div>
                      <span className="text-[10px] font-mono text-slate-400">{claim.receiptName}</span>
                    </td>
                    <td className="p-3.5 font-bold text-indigo-600">
                      {claim.currency} {claim.requestedAmount.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        claim.managerApprovalStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        claim.managerApprovalStatus === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {claim.managerApprovalStatus}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        claim.financeVerificationStatus === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                        claim.financeVerificationStatus === 'Paid' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {claim.financeVerificationStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {/* Manager Controls */}
                      {['super_admin', 'hr_admin', 'manager'].includes(currentRole) && claim.managerApprovalStatus === 'Pending' && (
                        <>
                          <button
                            onClick={() => approveReimbursementManager(claim.id, 'Approved', 'Manager reviewed & verified client mandate alignment.')}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer text-[11px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => approveReimbursementManager(claim.id, 'Rejected', 'Exceeds per diem limit without prior Partner approval.')}
                            className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold cursor-pointer text-[11px]"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* Finance Controls */}
                      {['super_admin', 'hr_admin'].includes(currentRole) && claim.managerApprovalStatus === 'Approved' && claim.financeVerificationStatus === 'Pending' && (
                        <button
                          onClick={() => verifyReimbursementFinance(claim.id, 'Paid', 'Verified GST invoice and queued for banking payout.')}
                          className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer text-[11px]"
                        >
                          Disburse
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Claim Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Submit Reimbursement Claim</h3>
                  <p className="text-xs text-slate-500">Attach valid tax invoice & select category</p>
                </div>
              </div>
              <button onClick={() => setIsSubmitModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitClaim} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-hidden"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requested Amount *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.requestedAmount}
                    onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                    placeholder="e.g. 4500"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden font-bold text-indigo-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-hidden font-mono"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Date *</label>
                <input
                  type="date"
                  required
                  value={formData.expenseDate}
                  onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Description & Business Purpose *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Client presentation taxi to Bandra Kurla Complex for M&A deal pitch."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Receipt Attachment File Name</label>
                <input
                  type="text"
                  value={formData.receiptName}
                  onChange={(e) => setFormData({ ...formData, receiptName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit for Manager Approval</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
