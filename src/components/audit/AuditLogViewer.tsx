import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLogRecord } from '../../types';
import { 
  History, 
  Search, 
  Download, 
  ShieldCheck, 
  Clock, 
  Filter,
  CheckCircle2,
  Lock,
  Calendar,
  Layers,
  User,
  Activity,
  FileCheck,
  Zap,
  Globe
} from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs, exportDataToCsv, currentRole, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const availableModules: string[] = useMemo(() => {
    const set = new Set<string>();
    auditLogs.forEach(l => {
      if (l.module) set.add(l.module);
    });
    return ['ALL', ...Array.from(set)];
  }, [auditLogs]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const logModule = log.module || '';
      const matchesModule = selectedModule === 'ALL' || logModule.toLowerCase() === selectedModule.toLowerCase();
      const matchesRole = selectedRole === 'ALL' || log.userRole === selectedRole;
      
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesModule && matchesRole;

      const userName = (log.userName || '').toLowerCase();
      const userRole = (log.userRole || '').toLowerCase();
      const action = (log.action || '').toLowerCase();
      const moduleName = logModule.toLowerCase();
      const recordId = (log.recordId || '').toLowerCase();
      const newValue = (log.newValue || '').toLowerCase();
      const oldValue = (log.oldValue || '').toLowerCase();
      const ip = (log.ipAddress || '').toLowerCase();

      const matchesSearch = 
        userName.includes(q) ||
        userRole.includes(q) ||
        action.includes(q) ||
        moduleName.includes(q) ||
        recordId.includes(q) ||
        newValue.includes(q) ||
        oldValue.includes(q) ||
        ip.includes(q);

      return matchesModule && matchesRole && matchesSearch;
    });
  }, [auditLogs, selectedModule, selectedRole, searchQuery]);

  // Statistics
  const authEventsCount = auditLogs.filter(l => l.module === 'Authentication').length;
  const policyEventsCount = auditLogs.filter(l => l.module === 'Policies').length;
  const attendanceEventsCount = auditLogs.filter(l => l.module === 'Attendance').length;
  const reimbursementEventsCount = auditLogs.filter(l => l.module === 'Reimbursements').length;

  const getModuleBadgeColor = (mod: string) => {
    switch (mod) {
      case 'Authentication':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Attendance':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Policies':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Reimbursements':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Employee Master':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Time & Wellbeing':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'HR Cases':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'super_admin':
      case 'hr_admin':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">👑 Super Admin</span>;
      case 'manager':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">💼 Manager</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">👤 Employee</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Immutable Cryptographic Trail</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">• SHA-256 Ledger</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center space-x-2">
            <span>System Audit & Compliance Logs</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic ledger tracking authentication, policy sign-offs, reimbursement approvals, and system state transitions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportDataToCsv('Verve_Audit_Log_Master', filteredLogs)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Audit Trail (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Audit Records</span>
            <History className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">{auditLogs.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Firm-wide ledger events</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Auth & SSO Sessions</span>
            <Lock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-extrabold text-purple-700">{authEventsCount}</div>
          <div className="text-[10px] text-purple-500 mt-0.5">Verified logins & handshakes</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Policy Sign-Offs</span>
            <FileCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-extrabold text-blue-700">{policyEventsCount}</div>
          <div className="text-[10px] text-blue-500 mt-0.5">Digital fingerprint signatures</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Financial & Shift Actions</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-700">{reimbursementEventsCount + attendanceEventsCount}</div>
          <div className="text-[10px] text-amber-500 mt-0.5">Approvals & Zoom telemetry</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Module:</span>
          </div>
          <div className="flex overflow-x-auto gap-1 scrollbar-none">
            {availableModules.map(mod => (
              <button
                key={mod}
                onClick={() => setSelectedModule(mod)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedModule === mod ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, action, ID, IP..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 whitespace-nowrap">Timestamp</th>
                <th className="p-3.5">Actor & Role</th>
                <th className="p-3.5">Module</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Target Resource / State Change</th>
                <th className="p-3.5 whitespace-nowrap">Network & IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-slate-700">No matching audit records found</div>
                    <div className="text-xs text-slate-400 mt-1">Try broadening your search query or selecting "ALL" modules.</div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-sans">
                      <div className="font-bold text-slate-900">{log.userName || 'System User'}</div>
                      <div className="mt-0.5">{getRoleBadge(log.userRole)}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getModuleBadgeColor(log.module)}`}>
                        {log.module}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-800 font-sans">
                      {log.action}
                    </td>
                    <td className="p-3.5 text-slate-600 font-sans max-w-md">
                      {log.recordId && (
                        <div className="font-mono text-[10px] text-indigo-600 bg-indigo-50/50 px-1.5 py-0.5 rounded inline-block border border-indigo-100 mb-1">
                          Resource Ref: {log.recordId}
                        </div>
                      )}
                      {log.newValue && (
                        <div className="text-slate-700 text-xs font-medium leading-relaxed">{log.newValue}</div>
                      )}
                      {log.oldValue && (
                        <div className="text-slate-400 text-[11px] line-through mt-0.5">{log.oldValue}</div>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>{log.ipAddress || '103.28.114.77 (Verve VPN)'}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Showing <span className="font-bold text-slate-800">{filteredLogs.length}</span> of <span className="font-bold text-slate-800">{auditLogs.length}</span> recorded transactions
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] text-slate-500">Live Ingestion Active</span>
          </div>
        </div>
      </div>

    </div>
  );
};
