import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Policy } from '../../types';
import { PolicyReaderModal } from './PolicyReaderModal';
import { PolicyEditorModal } from './PolicyEditorModal';
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Search, 
  Lock, 
  Sparkles,
  BookOpen,
  Plus,
  FileEdit,
  Trash2
} from 'lucide-react';

export const PolicyCenter: React.FC = () => {
  const { 
    policies, 
    acknowledgments, 
    currentUser, 
    allEmployees, 
    currentRole,
    deletePolicy,
    exportDataToCsv 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [viewTab, setViewTab] = useState<'policies' | 'compliance_matrix'>('policies');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'Virtual Office', 'Time & Wellbeing', 'Code of Conduct', 'Governance', 'Security & IP', 'Separation'];

  const filteredPolicies = policies.filter(p => {
    const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalAcksForUser = policies.filter(p => acknowledgments.some(a => a.policyId === p.id && a.employeeId === currentUser.id)).length;
  const compliancePercent = policies.length > 0 ? Math.round((totalAcksForUser / policies.length) * 100) : 100;

  // Compliance Matrix Data
  const complianceRows = allEmployees.map(emp => {
    const signedCount = policies.filter(p => acknowledgments.some(a => a.policyId === p.id && a.employeeId === emp.id)).length;
    const isFullCompliant = signedCount === policies.length;
    return {
      id: emp.id,
      name: emp.fullName,
      code: emp.employeeCode,
      department: emp.department,
      signedCount,
      totalPolicies: policies.length,
      percent: policies.length > 0 ? Math.round((signedCount / policies.length) * 100) : 100,
      isFullCompliant
    };
  });

  const handleOpenNewPolicy = () => {
    setEditingPolicy(null);
    setIsEditorOpen(true);
  };

  const handleEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy);
    setIsEditorOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              Governance & Compliance
            </span>
            <span className="text-xs text-slate-400">• {policies.length} Active Governance Policies</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Policy Governance & Compliance Center</h2>
          <p className="text-xs text-slate-500">
            Mandatory consulting frameworks: No-Leave policy, 18-day rest mandate, Zoom virtual presence, and POSH.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {currentRole === 'super_admin' && (
            <button
              onClick={handleOpenNewPolicy}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center space-x-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish New Policy</span>
            </button>
          )}

          {['super_admin', 'hr_admin', 'manager'].includes(currentRole) && (
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
              <button
                onClick={() => setViewTab('policies')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                  viewTab === 'policies' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Policy Repository
              </button>
              <button
                onClick={() => setViewTab('compliance_matrix')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                  viewTab === 'compliance_matrix' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Firm Compliance Matrix
              </button>
            </div>
          )}

          <button
            onClick={() => exportDataToCsv('Verve_Policy_Compliance_Matrix', complianceRows)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Compliance</span>
          </button>
        </div>
      </div>

      {/* User Compliance Tracker Banner */}
      <div className="p-4 rounded-xl bg-linear-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
            {currentUser.fullName}’s Sign-Off Status
          </span>
          <h3 className="text-lg font-bold mt-0.5">
            {totalAcksForUser} of {policies.length} Policies Signed & Locked
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Once signed during onboarding or compliance reviews, policy records are cryptographically locked for each employee.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-sm font-bold text-indigo-200">{compliancePercent}% Signed & Locked</span>
            <div className="w-32 bg-white/20 rounded-full h-2 mt-1 overflow-hidden">
              <div className="bg-emerald-400 h-2 rounded-full transition-all" style={{ width: `${compliancePercent}%` }} />
            </div>
          </div>
          {compliancePercent === 100 ? (
            <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {viewTab === 'policies' ? (
        <div className="space-y-4">
          {/* Filters & Categories */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex overflow-x-auto gap-1.5 scrollbar-none">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    activeCategory === c 
                      ? 'bg-indigo-600 text-white shadow-2xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search policies..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Policy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPolicies.map(pol => {
              const isSigned = acknowledgments.some(a => a.policyId === pol.id && a.employeeId === currentUser.id);
              const ackRecord = acknowledgments.find(a => a.policyId === pol.id && a.employeeId === currentUser.id);

              return (
                <div
                  key={pol.id}
                  className={`bg-white rounded-xl border p-5 shadow-2xs transition-all flex flex-col justify-between ${
                    isSigned ? 'border-emerald-200/80 hover:border-emerald-300' : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        {pol.category}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                          {pol.version}
                        </span>
                        {currentRole === 'super_admin' && (
                          <button
                            onClick={() => handleEditPolicy(pol)}
                            title="Edit policy terms (Super Admin authority)"
                            className="p-1 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-2.5 leading-snug">
                      {pol.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">
                      {pol.summary}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                      <div className="text-[11px] font-bold text-slate-700">Governance Highlights:</div>
                      <ul className="text-[11px] text-slate-500 list-disc pl-4 space-y-0.5">
                        {pol.keyHighlights.slice(0, 2).map((kh, i) => (
                          <li key={i} className="line-clamp-1">{kh}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    {isSigned ? (
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Locked & Signed</span>
                      </div>
                    ) : (
                      <span className="flex items-center space-x-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Sign Pending</span>
                      </span>
                    )}

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setSelectedPolicy(pol)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1 ${
                          isSigned 
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{isSigned ? 'View Locked Policy' : 'Review & Sign'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Firm Compliance Matrix View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Firm-Wide Policy Compliance Matrix</h3>
              <p className="text-xs text-slate-500">Live verification of immutable digital sign-offs across all advisory practices</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Consultant</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Signed / Total</th>
                  <th className="p-3.5">Compliance %</th>
                  <th className="p-3.5">Record State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complianceRows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{row.name} ({row.code})</td>
                    <td className="p-3.5 text-slate-600">{row.department}</td>
                    <td className="p-3.5 font-semibold text-indigo-600">{row.signedCount} / {row.totalPolicies}</td>
                    <td className="p-3.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${row.percent}%` }} />
                        </div>
                        <span className="font-bold">{row.percent}%</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {row.isFullCompliant ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1 w-max">
                          <Lock className="w-3 h-3" />
                          <span>100% Locked & Compliant</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 w-max">
                          {row.totalPolicies - row.signedCount} Pending Signature
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

      {/* Policy Reader Modal */}
      {selectedPolicy && (
        <PolicyReaderModal
          policy={selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
          onEditRequested={() => {
            const p = selectedPolicy;
            setSelectedPolicy(null);
            handleEditPolicy(p);
          }}
        />
      )}

      {/* Policy Editor Modal (Super Admin Only) */}
      <PolicyEditorModal
        policy={editingPolicy}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingPolicy(null);
        }}
      />

    </div>
  );
};
