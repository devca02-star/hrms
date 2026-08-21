import React from 'react';
import { Role } from '../../types';
import { 
  ShieldCheck, 
  X, 
  Check, 
  Minus, 
  Lock, 
  Users, 
  Video, 
  HeartHandshake, 
  Receipt, 
  TrendingUp, 
  GraduationCap, 
  ShieldAlert, 
  FolderLock, 
  FileText, 
  UserMinus, 
  Network, 
  History, 
  BarChart3, 
  Settings,
  Sparkles
} from 'lucide-react';

interface RoleCapabilityMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModuleCapability {
  name: string;
  category: string;
  icon: React.ElementType;
  super_admin: { access: 'Full Control' | 'Manage' | 'View' | 'None'; note: string };
  hr_admin: { access: 'Full Control' | 'Manage' | 'View' | 'None'; note: string };
  manager: { access: 'Full Control' | 'Manage' | 'View' | 'None'; note: string };
  employee: { access: 'Full Control' | 'Manage' | 'View' | 'None'; note: string };
}

export const RoleCapabilityMatrixModal: React.FC<RoleCapabilityMatrixModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const modules: ModuleCapability[] = [
    {
      name: 'Executive Dashboard',
      category: 'Core',
      icon: Sparkles,
      super_admin: { access: 'Full Control', note: 'Firm-wide metrics, partner pipeline & statutory counters' },
      hr_admin: { access: 'Manage', note: 'HR health, headcount attrition & compliance' },
      manager: { access: 'View', note: 'Practice team metrics & KRA progression' },
      employee: { access: 'View', note: 'Personal induction, shift hours & wellbeing tracker' }
    },
    {
      name: 'Employee Master & Directory',
      category: 'Workforce',
      icon: Users,
      super_admin: { access: 'Full Control', note: 'Create/edit/delete profiles, salary bands & probation' },
      hr_admin: { access: 'Full Control', note: 'KYC onboarding, profile updates & letters' },
      manager: { access: 'View', note: 'Direct reports & practice team only' },
      employee: { access: 'None', note: 'No access to other consultants’ master records' }
    },
    {
      name: 'Onboarding & Induction (7-Step)',
      category: 'Workforce',
      icon: Users,
      super_admin: { access: 'Manage', note: 'Cohort analytics & step verification override' },
      hr_admin: { access: 'Full Control', note: 'Assign steps, verify KYC docs & approve completion' },
      manager: { access: 'View', note: 'Track new joiner progress' },
      employee: { access: 'Manage', note: 'Complete personal 7-step onboarding wizard' }
    },
    {
      name: 'Zoom 48h Attendance & Telemetry',
      category: 'Operations',
      icon: Video,
      super_admin: { access: 'Full Control', note: 'Manual overrides, shift parameter tuning & raw events' },
      hr_admin: { access: 'Manage', note: 'Reconcile attendance & resolve late exceptions' },
      manager: { access: 'Manage', note: 'Review & approve direct report late join exceptions' },
      employee: { access: 'View', note: 'Personal check-in, presence telemetry & shift logging' }
    },
    {
      name: 'No-Leave Wellbeing & Rest Mandate',
      category: 'Operations',
      icon: HeartHandshake,
      super_admin: { access: 'Full Control', note: 'Firm-wide burnout heatmap & rest target config' },
      hr_admin: { access: 'Manage', note: '18-day mandatory compliance enforcement' },
      manager: { access: 'View', note: 'Monitor team rest coverage & project load' },
      employee: { access: 'Manage', note: 'Broadcast planned rest days & assign client coverage' }
    },
    {
      name: 'Digital Policies & Sign-offs',
      category: 'Governance',
      icon: FileText,
      super_admin: { access: 'Full Control', note: 'Publish new policies & audit acknowledgments' },
      hr_admin: { access: 'Full Control', note: 'Manage compliance quizzes & digital signatures' },
      manager: { access: 'View', note: 'View active firm policies' },
      employee: { access: 'Manage', note: 'Take mandatory comprehension check & cryptographically sign' }
    },
    {
      name: 'Reimbursements (2-Stage Approval)',
      category: 'Finance',
      icon: Receipt,
      super_admin: { access: 'Full Control', note: 'Firm payouts, cutoff overrides & executive signoff' },
      hr_admin: { access: 'Manage', note: 'Finance verification & payroll disbursement sync' },
      manager: { access: 'Manage', note: 'Stage 1: Verify business purpose & policy caps' },
      employee: { access: 'Manage', note: 'Submit claims, upload GST tax invoices & track status' }
    },
    {
      name: 'Performance Management & KRAs',
      category: 'Talent',
      icon: TrendingUp,
      super_admin: { access: 'Full Control', note: 'Appraisal cycles, promotion rosters & final ratings' },
      hr_admin: { access: 'Manage', note: 'Cycle scheduling & score consolidation' },
      manager: { access: 'Manage', note: 'Conduct 30-60-90 day and annual reviews for team' },
      employee: { access: 'Manage', note: 'Set personal KRA goals & submit self-appraisals' }
    },
    {
      name: 'Advisory Training Academy',
      category: 'Talent',
      icon: GraduationCap,
      super_admin: { access: 'Full Control', note: 'Author courses, assign mandatory modules' },
      hr_admin: { access: 'Manage', note: 'Track firm-wide completion metrics' },
      manager: { access: 'View', note: 'Recommend modules to analysts' },
      employee: { access: 'Manage', note: 'Enroll in courses & complete valuations/M&A assessments' }
    },
    {
      name: 'Confidential Grievances & POSH',
      category: 'Governance',
      icon: ShieldAlert,
      super_admin: { access: 'Manage', note: 'ICC Committee oversight' },
      hr_admin: { access: 'Full Control', note: 'Presiding Officer investigation desk & encrypted notes' },
      manager: { access: 'None', note: 'Strictly restricted for confidentiality' },
      employee: { access: 'Manage', note: 'File encrypted complaints with Presiding Officer' }
    },
    {
      name: 'KYC Document Vault',
      category: 'Compliance',
      icon: FolderLock,
      super_admin: { access: 'Full Control', note: 'Access all verified employee dossiers' },
      hr_admin: { access: 'Full Control', note: 'Verify PAN, Aadhaar, degree certs & joining letters' },
      manager: { access: 'View', note: 'View team NDAs and engagement letters' },
      employee: { access: 'Manage', note: 'Upload KYC docs & download signed joining letter' }
    },
    {
      name: 'HR Service Desk & Letters',
      category: 'Workforce',
      icon: Sparkles,
      super_admin: { access: 'Full Control', note: 'Master request approvals' },
      hr_admin: { access: 'Full Control', note: 'Issue bona fide letters, address proof & visa letters' },
      manager: { access: 'None', note: 'Handled directly by People team' },
      employee: { access: 'Manage', note: 'Request employment letters, PF updates & tax forms' }
    },
    {
      name: 'Offboarding & 10-Day F&F Settlement',
      category: 'Separation',
      icon: UserMinus,
      super_admin: { access: 'Full Control', note: 'Notice waiver signoff & F&F disbursement release' },
      hr_admin: { access: 'Full Control', note: '5-Department No Dues clearance & relieving letters' },
      manager: { access: 'Manage', note: 'Sign off on Knowledge Transfer & file handovers' },
      employee: { access: 'Manage', note: 'Submit resignation & track clearance checklist' }
    },
    {
      name: 'Statutory Reports & Analytics',
      category: 'Enterprise',
      icon: BarChart3,
      super_admin: { access: 'Full Control', note: 'Export payroll matrices, headcount & attendance' },
      hr_admin: { access: 'Full Control', note: 'Generate compliance rosters & CSV exports' },
      manager: { access: 'View', note: 'Export team productivity summaries' },
      employee: { access: 'None', note: 'Executive reports restricted' }
    },
    {
      name: 'Integration Pipeline (Zoho / Zoom)',
      category: 'Enterprise',
      icon: Network,
      super_admin: { access: 'Full Control', note: 'Manage API tokens, webhook endpoints & mock/live mode' },
      hr_admin: { access: 'Manage', note: 'Trigger manual sync with Zoho People' },
      manager: { access: 'None', note: 'Restricted' },
      employee: { access: 'None', note: 'Restricted' }
    },
    {
      name: 'System Audit Logs',
      category: 'Enterprise',
      icon: History,
      super_admin: { access: 'Full Control', note: 'Immutable audit ledger of all system mutations' },
      hr_admin: { access: 'View', note: 'View HR and document verification timestamps' },
      manager: { access: 'None', note: 'Restricted' },
      employee: { access: 'None', note: 'Restricted' }
    },
    {
      name: 'System Settings & Platform Rules',
      category: 'Enterprise',
      icon: Settings,
      super_admin: { access: 'Full Control', note: '48h work week rules, ICC chair, cutoff days' },
      hr_admin: { access: 'View', note: 'Read-only organization settings' },
      manager: { access: 'None', note: 'Restricted' },
      employee: { access: 'None', note: 'Restricted' }
    }
  ];

  const getBadge = (access: string) => {
    switch (access) {
      case 'Full Control':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">Full Control</span>;
      case 'Manage':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Manage / Sign</span>;
      case 'View':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">View Only</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-500 border border-rose-100">Restricted</span>;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/70 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 max-w-5xl w-full max-h-[85vh] my-auto flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Role-Based Access Control (RBAC) Capability Matrix</h3>
              <p className="text-xs text-slate-500">
                Privilege specifications across all Verve Advisory HRMS operational modules.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Legend Banner */}
        <div className="px-6 py-3 bg-indigo-50/50 border-b border-indigo-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <div>
              <span className="font-bold text-slate-800">👑 Super Admin</span>
              <span className="text-[10px] text-slate-500 block">vikram.singhania@verveadvisory.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
            <div>
              <span className="font-bold text-slate-800">💼 Manager</span>
              <span className="text-[10px] text-slate-500 block">ananya.sharma@verveadvisory.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
            <div>
              <span className="font-bold text-slate-800">👤 Employee</span>
              <span className="text-[10px] text-slate-500 block">dev.chavan@verveadvisory.com</span>
            </div>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold pl-2">System Module</th>
                <th className="pb-3 font-semibold text-indigo-700">👑 Super Admin</th>
                <th className="pb-3 font-semibold text-amber-700">💼 Manager</th>
                <th className="pb-3 font-semibold text-slate-700">👤 Employee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modules.map((m, idx) => {
                const Icon = m.icon;
                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pl-2 pr-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{m.name}</div>
                          <span className="text-[10px] text-slate-400">{m.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3 align-top">
                      {getBadge(m.super_admin.access)}
                      <p className="text-[10px] text-slate-500 mt-1 leading-tight">{m.super_admin.note}</p>
                    </td>
                    <td className="py-3 pr-3 align-top">
                      {getBadge(m.manager.access)}
                      <p className="text-[10px] text-slate-500 mt-1 leading-tight">{m.manager.note}</p>
                    </td>
                    <td className="py-3 pr-2 align-top">
                      {getBadge(m.employee.access)}
                      <p className="text-[10px] text-slate-500 mt-1 leading-tight">{m.employee.note}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Role-Based Access Control enforced at API & UI render boundaries.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium cursor-pointer"
          >
            Close Capability Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
