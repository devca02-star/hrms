import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';
import { RoleCapabilityMatrixModal } from '../auth/RoleCapabilityMatrixModal';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  roles: string[]; // super_admin, hr_admin, manager, employee
}

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentRole,
    isSidebarCollapsed, 
    setIsSidebarCollapsed,
    attendanceRecords,
    reimbursements,
    confidentialCases,
    policies,
    acknowledgments,
    currentUser
  } = useApp();

  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  // Dynamic Badges
  const pendingExceptionsCount = attendanceRecords.filter(r => r.status === 'Exception' && r.hrReviewStatus !== 'Resolved').length;
  const pendingClaimsCount = reimbursements.filter(r => r.managerApprovalStatus === 'Pending' || r.financeVerificationStatus === 'Pending').length;
  const pendingCasesCount = confidentialCases.filter(c => c.status === 'Open' || c.status === 'Investigation').length;
  const unsignedPoliciesCount = policies.filter(p => !acknowledgments.some(a => a.policyId === p.id && a.employeeId === currentUser.id)).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin', 'hr_admin', 'manager', 'employee']
    },
    {
      id: 'directory',
      label: currentRole === 'manager' ? 'My Advisory Team' : 'Employee Master',
      icon: Users,
      roles: ['super_admin', 'hr_admin', 'manager']
    },
    {
      id: 'onboarding',
      label: 'Onboarding & Induction',
      icon: UserPlus,
      roles: ['super_admin', 'hr_admin', 'employee']
    },
    {
      id: 'attendance',
      label: currentRole === 'employee' ? 'My Virtual Presence' : 'Zoom Attendance',
      icon: Video,
      badge: pendingExceptionsCount > 0 && ['super_admin', 'hr_admin', 'manager'].includes(currentRole) ? pendingExceptionsCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
      roles: ['super_admin', 'hr_admin', 'manager', 'employee']
    },
    {
      id: 'wellbeing',
      label: 'No-Leave Wellbeing',
      icon: HeartHandshake,
      roles: ['super_admin', 'hr_admin', 'manager', 'employee']
    },
    {
      id: 'policies',
      label: 'Policies & Sign-offs',
      icon: FileText,
      badge: currentRole === 'employee' && unsignedPoliciesCount > 0 ? unsignedPoliciesCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
      roles: ['super_admin', 'hr_admin', 'manager', 'employee']
    },
    {
      id: 'reimbursements',
      label: 'Expense Claims',
      icon: Receipt,
      badge: pendingClaimsCount > 0 && ['super_admin', 'hr_admin', 'manager'].includes(currentRole) ? pendingClaimsCount : undefined,
      badgeColor: 'bg-indigo-600 text-white',
      roles: ['super_admin', 'hr_admin', 'manager', 'employee']
    },
    {
      id: 'performance',
      label: 'Performance & PMS',
      icon: TrendingUp,
      roles: ['super_admin', 'hr_admin', 'manager', 'employee']
    },
    {
      id: 'training',
      label: 'Training Academy',
      icon: GraduationCap,
      roles: ['super_admin', 'hr_admin', 'manager', 'employee']
    },
    {
      id: 'cases',
      label: 'Confidential Grievances',
      icon: ShieldAlert,
      badge: pendingCasesCount > 0 && ['super_admin', 'hr_admin'].includes(currentRole) ? pendingCasesCount : undefined,
      badgeColor: 'bg-purple-600 text-white',
      roles: ['super_admin', 'hr_admin', 'employee']
    },
    {
      id: 'documents',
      label: 'Document Vault',
      icon: FolderLock,
      roles: ['super_admin', 'hr_admin', 'manager', 'employee']
    },
    {
      id: 'requests',
      label: 'HR Service Desk',
      icon: Sparkles,
      roles: ['super_admin', 'hr_admin', 'employee']
    },
    {
      id: 'separation',
      label: 'Offboarding & F&F',
      icon: UserMinus,
      roles: ['super_admin', 'hr_admin', 'manager', 'employee']
    },
    {
      id: 'reports',
      label: 'Analytics & Reports',
      icon: BarChart3,
      roles: ['super_admin', 'hr_admin', 'manager']
    },
    {
      id: 'integrations',
      label: 'Integration Pipeline',
      icon: Network,
      roles: ['super_admin', 'hr_admin']
    },
    {
      id: 'audit',
      label: 'System Audit Logs',
      icon: History,
      roles: ['super_admin', 'hr_admin']
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
      roles: ['super_admin', 'hr_admin']
    }
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside 
      className={`transition-all duration-300 ease-in-out bg-white border-r border-slate-200 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 z-20 select-none ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Navigation Links */}
      <div className="py-4 px-2 overflow-y-auto space-y-1">
        <div className={`px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
          {currentRole.replace('_', ' ').toUpperCase()} WORKSPACE
        </div>

        {visibleItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isSidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer group relative ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs border border-indigo-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {/* Badge */}
              {item.badge !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-indigo-600 text-white'} ${isSidebarCollapsed ? 'absolute top-1 right-1 px-1 text-[9px]' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Role Matrix, Culture Pillar & Collapse Toggle */}
      <div className="p-2 border-t border-slate-200 bg-slate-50/70 space-y-1.5">
        {/* Role & Capability Matrix Button */}
        <button
          onClick={() => setIsMatrixOpen(true)}
          title="Role-Based Access Control (RBAC) Capability Matrix"
          className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/80 transition-all cursor-pointer shadow-2xs group ${
            isSidebarCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="flex items-center space-x-2.5 truncate">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 group-hover:scale-110 transition-transform" />
            {!isSidebarCollapsed && <span className="truncate">Role Capability Matrix</span>}
          </div>
          {!isSidebarCollapsed && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-200/70 text-indigo-800 uppercase">
              RBAC
            </span>
          )}
        </button>

        {!isSidebarCollapsed && (
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700">
            <div className="flex items-center space-x-1.5 font-bold text-[11px] text-slate-900">
              <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Verve Culture Pillar</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              No leave balances. 18-day mandatory annual rest. 48-hour virtual presence on Zoom.
            </p>
          </div>
        )}

        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Menu</span>
            </div>
          )}
        </button>
      </div>

      <RoleCapabilityMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
      />
    </aside>
  );
};
