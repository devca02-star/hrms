import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TimeOffNotification, TimeOffType } from '../../types';
import { 
  HeartHandshake, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Clock, 
  ShieldCheck, 
  Send, 
  Download,
  Info,
  ChevronRight
} from 'lucide-react';

export const WellbeingTimeOff: React.FC = () => {
  const { 
    currentUser, 
    timeOffBroadcasts, 
    broadcastTimeOff, 
    allEmployees, 
    currentRole,
    exportDataToCsv 
  } = useApp();

  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my_rest' | 'team_calendar' | 'burnout_guard'>('my_rest');

  // Form State
  const [formData, setFormData] = useState({
    reasonCategory: 'Vacation & Rest' as TimeOffNotification['reasonCategory'],
    startDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    coveragePlan: 'Deal models handed over; financial forecasts updated.',
    coverageColleagueName: allEmployees[1]?.fullName || 'Priya Sharma',
    notifiedManager: true,
    notifiedTeam: true
  });

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate days
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    broadcastTimeOff({
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalDays: Math.max(1, totalDays),
      reasonCategory: formData.reasonCategory,
      coveragePlan: formData.coveragePlan,
      coverageColleagueName: formData.coverageColleagueName,
      notifiedManager: formData.notifiedManager,
      notifiedTeam: formData.notifiedTeam
    });

    setIsBroadcastModalOpen(false);
  };

  const myBroadcasts = timeOffBroadcasts.filter(b => b.employeeId === currentUser.id);
  const daysTaken = currentUser.annualTimeOffDaysTaken;
  const mandatoryTarget = currentUser.mandatoryAnnualTimeOffTarget;
  const progressPercent = Math.min(100, Math.round((daysTaken / mandatoryTarget) * 100));

  // Burnout Guard List
  const burnoutAudit = allEmployees.map(emp => {
    const compliancePct = Math.round((emp.annualTimeOffDaysTaken / emp.mandatoryAnnualTimeOffTarget) * 100);
    const isAtRisk = emp.annualTimeOffDaysTaken < 8; // less than 8 days
    return {
      id: emp.id,
      name: emp.fullName,
      code: emp.employeeCode,
      department: emp.department,
      daysTaken: emp.annualTimeOffDaysTaken,
      target: emp.mandatoryAnnualTimeOffTarget,
      compliancePct,
      isAtRisk
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              High-Trust Culture
            </span>
            <span className="text-xs text-slate-400">• Zero Leave Accruals / Balances</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">No-Leave Wellbeing & Mandatory Rest</h2>
          <p className="text-xs text-slate-500">
            No manager approvals required. Simply broadcast your dates in advance and ensure deal coverage.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => exportDataToCsv('Verve_TimeOff_Ledger', timeOffBroadcasts)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Rest Logs</span>
          </button>

          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Broadcast Advance Time-Off</span>
          </button>
        </div>
      </div>

      {/* Mandatory 18-Day Rest Progress Card */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-rose-950 via-slate-900 to-indigo-950 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <HeartHandshake className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold">18-Day Mandatory Annual Rest Progress</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Verve Advisory strictly enforces at least 18 days of rest per year to sustain peak financial modeling and valuation focus.
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-rose-300">
              {daysTaken} / {mandatoryTarget} Days
            </div>
            <span className="text-xs text-slate-400">
              {daysTaken >= mandatoryTarget ? 'Mandatory target met' : `${mandatoryTarget - daysTaken} more days required this calendar year`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden p-0.5 border border-white/20">
          <div 
            className="bg-linear-to-r from-rose-500 to-indigo-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('my_rest')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'my_rest' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Broadcasted Time-Off ({myBroadcasts.length})
        </button>

        <button
          onClick={() => setActiveTab('team_calendar')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'team_calendar' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Firm-Wide Rest Feed ({timeOffBroadcasts.length})
        </button>

        {['super_admin', 'hr_admin', 'manager'].includes(currentRole) && (
          <button
            onClick={() => setActiveTab('burnout_guard')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'burnout_guard' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Burnout Guard Compliance
          </button>
        )}
      </div>

      {/* Tab 1: My Rest */}
      {activeTab === 'my_rest' && (
        <div className="space-y-4">
          {myBroadcasts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <HeartHandshake className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No time-off broadcasts yet</h4>
              <p className="text-xs text-slate-500 mt-1">
                Take advantage of Verve’s no-leave model by broadcasting your upcoming rest.
              </p>
              <button
                onClick={() => setIsBroadcastModalOpen(true)}
                className="mt-3 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
              >
                Broadcast Advance Notice
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myBroadcasts.map(b => (
                <div key={b.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {b.reasonCategory}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5">{b.totalDays} Days of Rest</h4>
                      <p className="text-xs text-slate-500">{b.startDate} to {b.endDate}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{b.status}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">{b.coveragePlan}</p>

                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
                    <span>Handover Delegate:</span>
                    <span className="font-semibold text-slate-800">{b.coverageColleagueName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Team Calendar */}
      {activeTab === 'team_calendar' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Consultant</th>
                <th className="p-3.5">Practice</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Dates</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Delegate</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeOffBroadcasts.map(b => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">{b.employeeName}</td>
                  <td className="p-3.5 text-slate-600">{b.department}</td>
                  <td className="p-3.5 text-slate-700">{b.reasonCategory}</td>
                  <td className="p-3.5 font-mono">{b.startDate} to {b.endDate}</td>
                  <td className="p-3.5 font-bold text-indigo-600">{b.totalDays} Days</td>
                  <td className="p-3.5 text-slate-600">{b.coverageColleagueName}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Burnout Guard Compliance */}
      {activeTab === 'burnout_guard' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs space-y-4">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Firm-Wide Rest Compliance & Burnout Guard</h3>
            <p className="text-xs text-slate-500">Employees falling below 8 days of rest by Q3 are highlighted for mandatory wellbeing check-ins.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Consultant</th>
                  <th className="p-3.5">Practice</th>
                  <th className="p-3.5">Days Taken / Target</th>
                  <th className="p-3.5">Progress</th>
                  <th className="p-3.5">Burnout Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {burnoutAudit.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{emp.name} ({emp.code})</td>
                    <td className="p-3.5 text-slate-600">{emp.department}</td>
                    <td className="p-3.5 font-bold text-indigo-600">{emp.daysTaken} / {emp.target} Days</td>
                    <td className="p-3.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${emp.compliancePct}%` }} />
                        </div>
                        <span className="font-bold">{emp.compliancePct}%</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {emp.isAtRisk ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center space-x-1 w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Needs Rest Check-in</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          On Track
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Broadcast Advance Time-Off</h3>
                  <p className="text-xs text-slate-500">No approval barrier. Auto-updates calendar & Zoom rules.</p>
                </div>
              </div>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Time-Off Reason Category</label>
                <select
                  value={formData.reasonCategory}
                  onChange={(e) => setFormData({ ...formData, reasonCategory: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-hidden"
                >
                  <option value="Vacation & Rest">Vacation & Rest (Planned Advance Notice)</option>
                  <option value="Health & Recovery">Health & Recovery / Wellness Rest</option>
                  <option value="Personal / Family">Personal / Family Commitment</option>
                  <option value="Emergency">Emergency Time-Off</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coverage Colleague (Advisory Peer)</label>
                <input
                  type="text"
                  value={formData.coverageColleagueName}
                  onChange={(e) => setFormData({ ...formData, coverageColleagueName: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client Coverage Plan</label>
                <textarea
                  rows={2}
                  required
                  value={formData.coveragePlan}
                  onChange={(e) => setFormData({ ...formData, coveragePlan: e.target.value })}
                  placeholder="e.g. Valuation models handed over; client deliverables queued for delivery."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Broadcast to Team</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
