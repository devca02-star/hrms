import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  ShieldCheck, 
  Video, 
  HeartHandshake, 
  Receipt, 
  Database, 
  RotateCcw, 
  Save, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const SystemSettingsView: React.FC = () => {
  const { 
    systemSettings, 
    updateSystemSettings, 
    currentRole,
    showToast 
  } = useApp();

  const [settings, setSettings] = useState(systemSettings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole !== 'super_admin') {
      showToast('error', 'Access Denied', 'Only Super Admin is authorized to modify core system parameters.');
      return;
    }
    updateSystemSettings(settings);
    showToast('success', 'Settings Saved', 'System configurations updated successfully.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              Admin Configuration
            </span>
            <span className="text-xs text-slate-400">• Policy & Telemetry Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Platform Rules & System Configuration</h2>
          <p className="text-xs text-slate-500">
            Configure shift thresholds, mandatory rest days, and simulation modes.
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Organization Information */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Organization Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Legal Entity</label>
              <input
                type="text"
                value={settings.organizationName}
                onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Corporate Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* 48-Hour Virtual Office & Zoom Rules */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Video className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Zoom 48-Hour Shift Parameters</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Weekly Shift Hours</label>
              <input
                type="number"
                value={settings.standardWorkWeekHours}
                onChange={(e) => setSettings({ ...settings, standardWorkWeekHours: parseInt(e.target.value) || 48 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden font-bold"
              />
              <span className="text-[10px] text-slate-400">Monday to Saturday standard</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Standard Work Days</label>
              <input
                type="text"
                value={settings.standardWorkDays}
                onChange={(e) => setSettings({ ...settings, standardWorkDays: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Wellbeing Mandate & Cutoff */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <HeartHandshake className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900">Wellbeing & Reimbursement Governance</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mandatory Annual Rest Days</label>
              <input
                type="number"
                value={settings.mandatoryAnnualRestDays}
                onChange={(e) => setSettings({ ...settings, mandatoryAnnualRestDays: parseInt(e.target.value) || 18 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden font-bold text-rose-600"
              />
              <span className="text-[10px] text-slate-400">Strictly enforced to prevent burnout</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payroll Reimbursement Cutoff (Days before month-end)</label>
              <input
                type="number"
                min="1"
                max="15"
                value={settings.reimbursementPayrollCutoffDays}
                onChange={(e) => setSettings({ ...settings, reimbursementPayrollCutoffDays: parseInt(e.target.value) || 7 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden font-bold text-amber-600"
              />
              <span className="text-[10px] text-slate-400">Claims submitted after this move to next month</span>
            </div>
          </div>
        </div>

        {/* Governance & POSH */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Internal Complaints Committee (ICC) & Governance</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">POSH Committee Presiding Lead</label>
              <input
                type="text"
                value={settings.poshCommitteeLeadName}
                onChange={(e) => setSettings({ ...settings, poshCommitteeLeadName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confidential POSH Desk Email</label>
              <input
                type="email"
                value={settings.poshCommitteeLeadEmail}
                onChange={(e) => setSettings({ ...settings, poshCommitteeLeadEmail: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Changes</span>
          </button>
        </div>

      </form>

    </div>
  );
};
