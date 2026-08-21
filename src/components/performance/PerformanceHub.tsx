import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PerformanceGoal, PerformanceReview, GoalStatus } from '../../types';
import { 
  TrendingUp, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Award, 
  Sliders, 
  Download, 
  Sparkles, 
  Star,
  Users,
  Target
} from 'lucide-react';

export const PerformanceHub: React.FC = () => {
  const { 
    currentUser, 
    performanceGoals, 
    performanceReviews, 
    addGoal, 
    updateGoalProgress, 
    submitPerformanceReview,
    allEmployees,
    currentRole,
    exportDataToCsv 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'my_goals' | 'reviews' | 'team_goals'>('my_goals');
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);

  // Goal Form State
  const [goalForm, setGoalForm] = useState({
    kraTitle: '',
    kpiMetrics: '',
    weightagePercent: '25',
    targetDate: new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0],
    cycle: 'Q3 2026' as PerformanceGoal['cycle']
  });

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalForm.kraTitle) return;

    addGoal({
      kraTitle: goalForm.kraTitle,
      kpiMetrics: goalForm.kpiMetrics,
      weightagePercent: parseInt(goalForm.weightagePercent) || 25,
      targetDate: goalForm.targetDate,
      progressPercent: 0,
      status: 'On Track',
      cycle: goalForm.cycle
    });

    setIsAddGoalModalOpen(false);
    setGoalForm({
      kraTitle: '',
      kpiMetrics: '',
      weightagePercent: '25',
      targetDate: new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0],
      cycle: 'Q3 2026'
    });
  };

  const myGoals = performanceGoals.filter(g => g.employeeId === currentUser.id);
  const myReviews = performanceReviews.filter(r => r.employeeId === currentUser.id);

  const avgProgress = myGoals.length > 0 
    ? Math.round(myGoals.reduce((sum, g) => sum + g.progressPercent, 0) / myGoals.length) 
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Advisory PMS
            </span>
            <span className="text-xs text-slate-400">• KRAs & 30-60-90 Day Appraisals</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Performance & Career Milestones</h2>
          <p className="text-xs text-slate-500">
            Track deal execution KRAs, advisory deliverables, and structured probation milestones.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => exportDataToCsv('Verve_Performance_Goals', performanceGoals)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export PMS</span>
          </button>

          <button
            onClick={() => setIsAddGoalModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Set New KRA Goal</span>
          </button>
        </div>
      </div>

      {/* PMS Overall Progress Card */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold">Overall Goal Execution Score</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Active KRA weightage average across {myGoals.length} key result areas.
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-300">{avgProgress}%</div>
            <span className="text-xs text-slate-400">Quarterly Target: 85%</span>
          </div>
        </div>

        <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${avgProgress}%` }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('my_goals')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'my_goals' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Assigned KRAs ({myGoals.length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'reviews' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Probation & Appraisal Reviews ({myReviews.length})
        </button>

        {['super_admin', 'hr_admin', 'manager'].includes(currentRole) && (
          <button
            onClick={() => setActiveTab('team_goals')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'team_goals' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Practice Team KRAs ({performanceGoals.length})
          </button>
        )}
      </div>

      {/* Tab 1: My Goals */}
      {activeTab === 'my_goals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myGoals.map(goal => (
              <div key={goal.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        Weightage: {goal.weightagePercent}% • {goal.cycle}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5">{goal.kraTitle}</h4>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 font-mono">{goal.progressPercent}%</span>
                  </div>
                  
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 mt-3 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Key KPI Metric: </span>
                    <span>{goal.kpiMetrics}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Target: {goal.targetDate}</span>
                    <span>Update Progress</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progressPercent}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const status = val === 100 ? 'Completed' : val > 30 ? 'On Track' : 'At Risk';
                      updateGoalProgress(goal.id, val, status);
                    }}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {performanceReviews.map(rev => (
            <div key={rev.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                    {rev.cycle}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {rev.employeeName} — Review Conducted by {rev.reviewerName}
                  </h4>
                  <p className="text-xs text-slate-400">Date: {rev.submittedAt.split('T')[0]}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Final Score</div>
                    <div className="text-sm font-bold text-indigo-600 flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rev.finalScore} / 5.0</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {rev.status}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900">Manager Comments:</span>
                <p>{rev.managerComments || rev.selfComments}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Team Goals */}
      {activeTab === 'team_goals' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">KRA Title</th>
                <th className="p-3.5">Cycle</th>
                <th className="p-3.5">Weightage</th>
                <th className="p-3.5">Target Date</th>
                <th className="p-3.5">Progress</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {performanceGoals.map(g => (
                <tr key={g.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">{g.kraTitle}</td>
                  <td className="p-3.5 text-slate-600">{g.cycle}</td>
                  <td className="p-3.5 font-mono text-slate-600">{g.weightagePercent}%</td>
                  <td className="p-3.5 font-mono text-slate-600">{g.targetDate}</td>
                  <td className="p-3.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${g.progressPercent}%` }} />
                      </div>
                      <span className="font-bold">{g.progressPercent}%</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {g.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Define Key Result Area (KRA)</h3>
              <button onClick={() => setIsAddGoalModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">KRA Objective Title *</label>
                <input
                  type="text"
                  required
                  value={goalForm.kraTitle}
                  onChange={(e) => setGoalForm({ ...goalForm, kraTitle: e.target.value })}
                  placeholder="e.g. Valuation Model Accuracy & LBO Template Creation"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weightage (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={goalForm.weightagePercent}
                    onChange={(e) => setGoalForm({ ...goalForm, weightagePercent: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Appraisal Cycle</label>
                  <select
                    value={goalForm.cycle}
                    onChange={(e) => setGoalForm({ ...goalForm, cycle: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-hidden"
                  >
                    <option value="Q1 2026">Q1 2026</option>
                    <option value="Q2 2026">Q2 2026</option>
                    <option value="Q3 2026">Q3 2026</option>
                    <option value="Probation (30-60-90)">Probation (30-60-90)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Completion Date</label>
                <input
                  type="date"
                  value={goalForm.targetDate}
                  onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">KPI Benchmark / Measurement</label>
                <input
                  type="text"
                  value={goalForm.kpiMetrics}
                  onChange={(e) => setGoalForm({ ...goalForm, kpiMetrics: e.target.value })}
                  placeholder="e.g. Zero formula errors in final client pitch books."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md cursor-pointer"
                >
                  Save KRA Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
