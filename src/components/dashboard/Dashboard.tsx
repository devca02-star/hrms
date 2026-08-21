import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Video, 
  HeartHandshake, 
  Receipt, 
  ShieldAlert, 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Sparkles,
  PlusCircle,
  FileCheck,
  Zap,
  Coffee,
  Building2,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  UserPlus,
  FileText,
  Briefcase
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    currentRole, 
    currentUser, 
    allEmployees, 
    attendanceRecords, 
    reimbursements, 
    confidentialCases, 
    policies, 
    acknowledgments, 
    timeOffBroadcasts,
    performanceGoals,
    setActiveTab,
    runAttendanceRulesEngine
  } = useApp();

  // Metrics Calculation
  const totalEmployees = allEmployees.length;
  const activeEmployees = allEmployees.filter(e => e.employmentStatus === 'Confirmed' || e.employmentStatus === 'Probation').length;
  const onboardingCount = allEmployees.filter(e => e.employmentStatus === 'Onboarding' || e.employmentStatus === 'Pre-boarding').length;
  
  const todayAttendance = attendanceRecords.filter(r => r.date === '2026-08-20');
  const presentCount = todayAttendance.filter(r => r.status === 'Present').length;
  const exceptionCount = todayAttendance.filter(r => r.status === 'Exception' || r.status === 'Partial').length;
  const timeOffTodayCount = todayAttendance.filter(r => r.status === 'Time Off').length;

  const pendingClaims = reimbursements.filter(r => r.managerApprovalStatus === 'Pending');
  const pendingClaimsCount = pendingClaims.length;
  const totalPendingClaimAmount = pendingClaims.reduce((sum, c) => sum + c.requestedAmount, 0);

  const activeCases = confidentialCases.filter(c => c.status !== 'Closed' && c.status !== 'Resolved').length;

  // Personal metrics for employee view
  const myTimeOffTaken = currentUser.annualTimeOffDaysTaken;
  const myMandatoryTarget = currentUser.mandatoryAnnualTimeOffTarget;
  const myRestCompliancePercent = Math.min(100, Math.round((myTimeOffTaken / myMandatoryTarget) * 100));

  const myGoals = performanceGoals.filter(g => g.employeeId === currentUser.id);
  const myAverageGoalProgress = myGoals.length > 0
    ? Math.round(myGoals.reduce((sum, g) => sum + g.progressPercent, 0) / myGoals.length)
    : 0;

  const myUnsignedPolicies = policies.filter(p => !acknowledgments.some(a => a.policyId === p.id && a.employeeId === currentUser.id));

  // Department distribution
  const deptCounts: Record<string, number> = {};
  allEmployees.forEach(e => {
    deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Welcome Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.25),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentRole === 'super_admin' ? 'Super Admin Portal' : currentRole === 'hr_admin' ? 'HR Leadership Center' : currentRole === 'manager' ? 'Practice Management' : 'Consultant Workspace'}
              </span>
              <span className="text-slate-400 text-xs">• Verve Virtual HRMS</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1.5 tracking-tight">
              Good day, {currentUser.fullName}
            </h1>
            <p className="text-slate-300 text-xs mt-1 max-w-xl leading-relaxed">
              Operating on Verve Advisory’s 48-Hour Virtual Office model with high trust and zero leave gatekeeping. Taking at least 18 days of annual rest is strictly mandatory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('wellbeing')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Broadcast Time-Off</span>
            </button>
            <button
              onClick={() => setActiveTab('reimbursements')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Receipt className="w-4 h-4" />
              <span>Claim Expense</span>
            </button>
            {['super_admin', 'hr_admin'].includes(currentRole) && (
              <button
                onClick={() => {
                  runAttendanceRulesEngine();
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Zap className="w-4 h-4" />
                <span>Re-sync Zoom Engine</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. Super Admin Privileges & Governance Control Center */}
      {(currentRole === 'super_admin' || currentRole === 'hr_admin') && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-xs bg-linear-to-br from-indigo-50/50 via-white to-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <span>Super Admin Privilege & Executive Controls</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                    Full Platform Authority
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Manage firm-wide configuration, Zoom attendance engine, statutory audits, and employee records.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs self-start sm:self-auto"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Platform Config</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
            <button
              onClick={() => setActiveTab('directory')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <Users className="w-4 h-4 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Employee Master</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Edit profiles & bands</div>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <Video className="w-4 h-4 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Zoom Telemetry</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Override & sync shifts</div>
            </button>

            <button
              onClick={() => setActiveTab('reimbursements')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Expense Approvals</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Stage-2 payout release</div>
            </button>

            <button
              onClick={() => setActiveTab('integrations')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Integrations</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Zoom & Zoho webhooks</div>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <Clock className="w-4 h-4 text-slate-700 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Audit Logs</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Immutable ledger</div>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Statutory Reports</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Export payroll & tax</div>
            </button>
          </div>
        </div>
      )}

      {/* 2. Practice Manager Privileges & Team Supervision Hub */}
      {currentRole === 'manager' && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs bg-linear-to-br from-emerald-50/40 via-white to-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <span>Practice Manager & Team Lead Hub</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Practice Leadership
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Manage your direct report consultants, Zoom bullpen presence, expense approvals, and probation appraisals.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('reimbursements')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-white border border-emerald-200 hover:bg-emerald-50 transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs self-start sm:self-auto"
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pending Claims ({pendingClaimsCount})</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <button
              onClick={() => setActiveTab('directory')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">My Advisory Team</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Direct reports & capacity</div>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <Video className="w-4 h-4 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Team Zoom Presence</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Live bullpen cameras</div>
            </button>

            <button
              onClick={() => setActiveTab('reimbursements')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Stage-1 Approvals</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Review client expenses</div>
            </button>

            <button
              onClick={() => setActiveTab('performance')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Probation & Reviews</div>
              <div className="text-[10px] text-slate-500 mt-0.5">90-day milestone scores</div>
            </button>
          </div>
        </div>
      )}

      {/* Advisory Consultant / Associate Self-Service Workspace */}
      {currentRole === 'employee' && (
        <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-xs bg-linear-to-br from-blue-50/40 via-white to-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <span>Advisory Consultant Workspace</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    Consultant Portal
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Access your Zoom virtual bullpen status, mandatory rest logs, policy records, and expense submissions.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('wellbeing')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs self-start sm:self-auto"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
              <span>Broadcast Rest Notice</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <button
              onClick={() => setActiveTab('attendance')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <Video className="w-4 h-4 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Virtual Presence</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Today: {currentUser.shiftStartTime} - {currentUser.shiftEndTime}</div>
            </button>

            <button
              onClick={() => setActiveTab('wellbeing')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Mandatory Rest</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{myTimeOffTaken} / {myMandatoryTarget} days logged</div>
            </button>

            <button
              onClick={() => setActiveTab('reimbursements')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Submit Claim</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Client & travel receipts</div>
            </button>

            <button
              onClick={() => setActiveTab('performance')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">My Goals & KRAs</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Probation & milestones</div>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Workforce or My Status */}
        {['super_admin', 'hr_admin', 'manager'].includes(currentRole) ? (
          <div 
            onClick={() => setActiveTab('directory')}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Advisory Workforce</span>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{totalEmployees}</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {activeEmployees} Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {onboardingCount} in onboarding / probation
            </p>
          </div>
        ) : (
          <div 
            onClick={() => setActiveTab('wellbeing')}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Annual Rest Progress</span>
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <HeartHandshake className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{myTimeOffTaken} / {myMandatoryTarget}</span>
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {myRestCompliancePercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${myRestCompliancePercent}%` }} />
            </div>
          </div>
        )}

        {/* KPI 2: Zoom Virtual Office Attendance */}
        <div 
          onClick={() => setActiveTab('attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Zoom Virtual Office</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{presentCount} Present</span>
            {exceptionCount > 0 ? (
              <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <AlertCircle className="w-3 h-3 mr-1" />
                {exceptionCount} Exception
              </span>
            ) : (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                100% In Sync
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {timeOffTodayCount} consultant(s) on planned rest today
          </p>
        </div>

        {/* KPI 3: Expense Reimbursements */}
        <div 
          onClick={() => setActiveTab('reimbursements')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Expense Claims</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              ₹{totalPendingClaimAmount > 0 ? totalPendingClaimAmount.toLocaleString() : '0'}
            </span>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              {pendingClaims.length} Pending
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            7-day pre-payroll cutoff active
          </p>
        </div>

        {/* KPI 4: Compliance / Policies */}
        <div 
          onClick={() => setActiveTab('policies')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Policy Compliance</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">9 Active</span>
            {myUnsignedPolicies.length > 0 ? (
              <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                {myUnsignedPolicies.length} Unsigned
              </span>
            ) : (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Compliant
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            POSH, No-Leave, IP & 48h Matrix
          </p>
        </div>

      </div>

      {/* Main Charts & Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Charts & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Practice Distribution & Attendance Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Advisory Practice Allocation</h3>
                <p className="text-xs text-slate-500">Headcount distribution across specialized consulting domains</p>
              </div>
              <button 
                onClick={() => setActiveTab('directory')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
              >
                <span>View Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(deptCounts).map(([dept, count]) => {
                const percent = Math.round((count / totalEmployees) * 100);
                return (
                  <div key={dept} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span className="truncate">{dept}</span>
                      <span className="text-indigo-600">{count} consultants</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7-Day Attendance & Telemetry Stream */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Real-Time Zoom Telemetry Summary</h3>
                  <p className="text-xs text-slate-500">Auto-reconciliation against 48h shift schedule (Mon-Sat)</p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                Live Webhooks Active
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {todayAttendance.slice(0, 4).map(rec => (
                <div 
                  key={rec.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      rec.status === 'Present' ? 'bg-emerald-500' : rec.status === 'Time Off' ? 'bg-indigo-500' : 'bg-amber-500'
                    }`} />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{rec.employeeName}</div>
                      <div className="text-[11px] text-slate-500">
                        {rec.firstZoomActivity !== '--' ? `${rec.firstZoomActivity} - ${rec.lastZoomActivity}` : 'No Zoom Sessions'} • {rec.department}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      rec.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : 
                      rec.status === 'Time Off' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.status === 'Present' ? `${rec.totalTrackedHours}h Tracked` : rec.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{rec.flags[0]}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right 1 Col: Quick Actions, Alerts & Burnout Guard */}
        <div className="space-y-6">
          
          {/* Burnout Guard Alert Card */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Coffee className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Burnout Guard System Active</h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Financial advisory mandates are intensive. Consultants with fewer than 10 rest days taken by Q3 receive automatic wellbeing check-in alerts.
                </p>
                <button
                  onClick={() => setActiveTab('wellbeing')}
                  className="mt-2 text-xs font-semibold text-amber-900 underline hover:text-amber-950 cursor-pointer"
                >
                  View Wellbeing & Rest Ledger →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Hub */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Operational Actions</h3>
            <div className="space-y-2">
              
              {['super_admin', 'hr_admin'].includes(currentRole) && (
                <button
                  onClick={() => setActiveTab('directory')}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <PlusCircle className="w-4 h-4 text-indigo-600" />
                    <span>Onboard New Advisory Consultant</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}

              <button
                onClick={() => setActiveTab('wellbeing')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HeartHandshake className="w-4 h-4 text-rose-500" />
                  <span>Broadcast Advance Time-Off</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('reimbursements')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Receipt className="w-4 h-4 text-amber-500" />
                  <span>Submit Expense Reimbursement</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('cases')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  <span>File Confidential Grievance / POSH</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('requests')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Request Employment / Salary Letter</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

            </div>
          </div>

          {/* Policy Compliance Mini-Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Signed Governance</h3>
              <span className="text-xs font-bold text-indigo-600">
                {policies.length - myUnsignedPolicies.length} / {policies.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Cryptographically signed policies on record for your profile.
            </p>
            {myUnsignedPolicies.length > 0 ? (
              <button
                onClick={() => setActiveTab('policies')}
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Sign {myUnsignedPolicies.length} Pending Policies
              </button>
            ) : (
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All mandatory Verve policies acknowledged</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
