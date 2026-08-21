import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { 
  ShieldAlert, 
  ArrowLeft, 
  UserCheck, 
  Lock, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { RoleCapabilityMatrixModal } from './RoleCapabilityMatrixModal';

interface AccessDeniedViewProps {
  requiredRoles: Role[];
  moduleName: string;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({ requiredRoles, moduleName }) => {
  const { currentRole, currentUser, setActiveTab, loginAsPersona, allEmployees } = useApp();
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  const roleNames: Record<Role, string> = {
    super_admin: 'Super Admin (Partner)',
    hr_admin: 'HR Admin (People Lead)',
    manager: 'Practice Manager (Director)',
    employee: 'Advisory Consultant'
  };

  const getSuggestedUser = (targetRole: Role) => {
    if (targetRole === 'super_admin') {
      return allEmployees.find(e => e.id === 'emp-vikram-partner') || allEmployees[0];
    }
    if (targetRole === 'hr_admin') {
      return allEmployees.find(e => e.id === 'emp-kavita-hr') || allEmployees[0];
    }
    if (targetRole === 'manager') {
      return allEmployees.find(e => e.id === 'emp-ananya-02') || allEmployees[0];
    }
    return allEmployees.find(e => e.id === 'emp-dev-01') || allEmployees[0];
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Restricted Enterprise Resource</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Access Denied for {moduleName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            You do not have the required role privileges to access or modify this module under Verve Advisory's Role-Based Access Control (RBAC) policy.
          </p>
        </div>

        {/* Current Role vs Required Roles Card */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Your Active Authenticated Persona:</span>
            <span className="font-bold text-slate-800 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
              <span>{roleNames[currentRole]}</span>
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Logged in User:</span>
            <span className="font-semibold text-slate-700">{currentUser.fullName} ({currentUser.designation})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Authorized Roles Required:</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {requiredRoles.map(r => (
                <span key={r} className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {roleNames[r]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Elevate / Switch Persona Sandbox Buttons */}
        <div className="space-y-3">
          <div className="text-left">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Role Elevation (Interactive Demo & Evaluation Mode)
            </p>
            <p className="text-[11px] text-slate-500">
              Instantly switch to an authorized persona to test and inspect this module:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {requiredRoles.map(targetRole => {
              const targetEmp = getSuggestedUser(targetRole);
              return (
                <button
                  key={targetRole}
                  onClick={() => loginAsPersona(targetEmp.id, targetRole)}
                  className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all text-left group cursor-pointer shadow-2xs bg-white"
                >
                  <img src={targetEmp.avatarUrl} alt={targetEmp.fullName} className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                      Switch to {roleNames[targetRole].split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{targetEmp.fullName}</div>
                  </div>
                  <Sparkles className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to My Dashboard</span>
          </button>

          <button
            onClick={() => setIsMatrixOpen(true)}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>View Full Role Matrix</span>
          </button>
        </div>

      </div>

      <RoleCapabilityMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
      />
    </div>
  );
};
