import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Download, 
  Users, 
  Video, 
  HeartHandshake, 
  Receipt, 
  FileText, 
  Calendar,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export const ReportsHub: React.FC = () => {
  const { 
    allEmployees, 
    attendanceRecords, 
    timeOffBroadcasts, 
    reimbursements, 
    policies, 
    acknowledgments, 
    exportDataToCsv 
  } = useApp();

  const [dateRange, setDateRange] = useState('Current Month (August 2026)');

  // Reports data generators
  const generateWorkforceReport = () => {
    return allEmployees.map(e => ({
      Code: e.employeeCode,
      Name: e.fullName,
      Department: e.department,
      Designation: e.designation,
      Grade: e.level,
      Manager: e.reportingManagerName,
      Status: e.employmentStatus,
      JoiningDate: e.dateOfJoining,
      RestDaysTaken: e.annualTimeOffDaysTaken,
      ZoomID: e.zoomUserId
    }));
  };

  const generateAttendanceSummaryReport = () => {
    return attendanceRecords.map(a => ({
      Date: a.date,
      Code: a.employeeCode,
      Name: a.employeeName,
      Department: a.department,
      DurationHours: a.totalTrackedHours,
      Status: a.status,
      Flags: a.flags.join(', '),
      ResolutionNotes: a.resolutionNotes || '--'
    }));
  };

  const generateReimbursementPayrollReport = () => {
    return reimbursements.map(r => ({
      ClaimID: r.id,
      Employee: r.employeeName,
      Department: r.department,
      Category: r.category,
      Amount: r.requestedAmount,
      Currency: r.currency,
      ExpenseDate: r.expenseDate,
      ManagerStatus: r.managerApprovalStatus,
      FinanceStatus: r.financeVerificationStatus,
      InvoiceNo: r.invoiceNumber
    }));
  };

  const generatePolicyComplianceReport = () => {
    return allEmployees.map(e => {
      const signed = policies.filter(p => acknowledgments.some(a => a.policyId === p.id && a.employeeId === e.id)).length;
      return {
        Employee: e.fullName,
        Department: e.department,
        SignedPolicies: signed,
        TotalPolicies: policies.length,
        CompliancePercent: `${Math.round((signed / policies.length) * 100)}%`,
        Status: signed === policies.length ? 'Compliant' : 'Pending Sign-offs'
      };
    });
  };

  const reports = [
    {
      title: 'Workforce Master & Roster Report',
      desc: 'Complete headcount, grade breakdown, reporting managers, and employment status.',
      icon: Users,
      action: () => exportDataToCsv('Verve_Workforce_Master', generateWorkforceReport())
    },
    {
      title: 'Zoom Virtual Attendance & Telemetry Ledger',
      desc: 'Daily shift logs, session duration, auto-reconciliation, and exception reviews.',
      icon: Video,
      action: () => exportDataToCsv('Verve_Zoom_Attendance_Telemetry', generateAttendanceSummaryReport())
    },
    {
      title: 'Monthly Expense Claims & Payroll Disbursement',
      desc: 'Verified claims ready for 7-day pre-payroll cutoff processing.',
      icon: Receipt,
      action: () => exportDataToCsv('Verve_Reimbursements_Payroll_Cutoff', generateReimbursementPayrollReport())
    },
    {
      title: 'Governance & Policy Digital Sign-Off Matrix',
      desc: 'Audit trail of signed policies, versioning, and compliance percentages.',
      icon: FileText,
      action: () => exportDataToCsv('Verve_Policy_Governance_Matrix', generatePolicyComplianceReport())
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Executive Analytics
            </span>
            <span className="text-xs text-slate-400">• Export & BI Hub</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Firm Analytics & Statutory Export Hub</h2>
          <p className="text-xs text-slate-500">
            Generate CSV and data feeds for payroll processing, compliance audits, and partner reviews.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="Current Month (August 2026)">Current Month (August 2026)</option>
            <option value="Q3 2026 (YTD)">Q3 2026 (YTD)</option>
            <option value="FY 2026-27 (Annual)">FY 2026-27 (Annual)</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep, idx) => {
          const Icon = rep.icon;
          return (
            <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between hover:border-indigo-300 transition-all">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{rep.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rep.desc}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Format: CSV / XLSX</span>
                <button
                  onClick={rep.action}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
