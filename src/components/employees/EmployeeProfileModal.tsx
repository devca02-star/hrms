import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee, Department, EmployeeLevel } from '../../types';
import { 
  X, 
  User, 
  Briefcase, 
  Video, 
  FolderLock, 
  FileText, 
  TrendingUp, 
  GraduationCap, 
  Receipt, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface EmployeeProfileModalProps {
  employee: Employee;
  onClose: () => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({ employee, onClose }) => {
  const { 
    currentRole,
    policies, 
    acknowledgments, 
    attendanceRecords, 
    documents, 
    performanceGoals, 
    performanceReviews,
    trainingEnrollments,
    reimbursements,
    confidentialCases,
    exportDataToCsv
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'employment' | 'attendance' | 'documents' | 'policies' | 'performance' | 'training' | 'reimbursements' | 'cases' | 'timeline'>('overview');

  // Employee-specific datasets
  const empAttendance = attendanceRecords.filter(a => a.employeeId === employee.id);
  const empDocs = documents.filter(d => d.employeeId === employee.id);
  const empAcks = acknowledgments.filter(a => a.employeeId === employee.id);
  const empGoals = performanceGoals.filter(g => g.employeeId === employee.id);
  const empReviews = performanceReviews.filter(r => r.employeeId === employee.id);
  const empTrainings = trainingEnrollments.filter(t => t.employeeId === employee.id);
  const empClaims = reimbursements.filter(r => r.employeeId === employee.id);
  const empCases = confidentialCases.filter(c => c.reporterEmployeeId === employee.id);

  const tabs = [
    { id: 'overview', label: '1. Overview', icon: User },
    { id: 'employment', label: '2. Employment & Zoom', icon: Briefcase },
    { id: 'attendance', label: '3. Attendance', icon: Video },
    { id: 'documents', label: '4. Documents Vault', icon: FolderLock },
    { id: 'policies', label: '5. Policies & Sign-offs', icon: FileText },
    { id: 'performance', label: '6. Performance', icon: TrendingUp },
    { id: 'training', label: '7. Training', icon: GraduationCap },
    { id: 'reimbursements', label: '8. Reimbursements', icon: Receipt },
    { id: 'cases', label: '9. HR Cases', icon: ShieldAlert },
    { id: 'timeline', label: '10. Lifecycle Timeline', icon: Clock }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Summary Banner */}
        <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
            <img 
              src={employee.avatarUrl} 
              alt={employee.fullName} 
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-400/50 shadow-md"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">{employee.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {employee.employeeCode}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  employee.role === 'super_admin' ? 'bg-amber-500/30 text-amber-200 border border-amber-400/30' :
                  employee.role === 'hr_admin' ? 'bg-rose-500/30 text-rose-200 border border-rose-400/30' :
                  employee.role === 'manager' ? 'bg-blue-500/30 text-blue-200 border border-blue-400/30' :
                  'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30'
                }`}>
                  Role: {employee.role === 'super_admin' ? 'Super Admin' : employee.role === 'hr_admin' ? 'HR Admin' : employee.role === 'manager' ? 'Manager' : 'Employee'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  employee.employmentStatus === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  employee.employmentStatus === 'Onboarding' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                }`}>
                  {employee.employmentStatus}
                </span>
              </div>
              <p className="text-indigo-200 text-xs mt-1 font-medium">{employee.designation} • {employee.department}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                <span className="flex items-center space-x-1"><Mail className="w-3.5 h-3.5 text-indigo-400" /> <span>{employee.companyEmail}</span></span>
                <span className="flex items-center space-x-1"><Phone className="w-3.5 h-3.5 text-indigo-400" /> <span>{employee.phone}</span></span>
                <span className="flex items-center space-x-1"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> <span>{employee.workLocation}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* 10 Navigation Tabs Bar */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/70 px-4 scrollbar-none">
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive 
                    ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 max-h-[55vh] space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Annual Wellbeing Rest</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {employee.annualTimeOffDaysTaken} / {employee.mandatoryAnnualTimeOffTarget} Days
                  </div>
                  <p className="text-xs text-indigo-700 mt-1">Mandatory 18 days rest policy compliance</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Zoom Virtual Office</span>
                  <div className="text-xl font-bold text-slate-900 mt-1 truncate">
                    {employee.zoomUserId}
                  </div>
                  <p className="text-xs text-emerald-700 mt-1 truncate">{employee.zoomEmail}</p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                  <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Probation Status</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    {employee.probationStatus}
                  </div>
                  <p className="text-xs text-purple-700 mt-1">End: {employee.probationEndDate}</p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Emergency Contact Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Contact Name:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{employee.emergencyContact.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Relationship:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{employee.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Emergency Phone:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{employee.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMPLOYMENT & ZOOM */}
          {activeTab === 'employment' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Advisory Hierarchy</h4>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-slate-400">Reporting Manager:</span>
                      <p className="font-semibold text-slate-800">{employee.reportingManagerName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Advisory Grade:</span>
                      <p className="font-semibold text-slate-800">{employee.level}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Employment Type:</span>
                      <p className="font-semibold text-slate-800">{employee.employmentType}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Date of Joining:</span>
                      <p className="font-semibold text-slate-800">{employee.dateOfJoining}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Virtual Shift & Zoom Config</h4>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-slate-400">Work Schedule:</span>
                      <p className="font-semibold text-slate-800">{employee.workScheduleType}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Shift Window:</span>
                      <p className="font-semibold text-slate-800">{employee.shiftStartTime} – {employee.shiftEndTime} ({employee.timeZone})</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Zoom User ID:</span>
                      <p className="font-mono font-semibold text-indigo-600">{employee.zoomUserId}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Personal Zoom Room:</span>
                      <p className="font-mono text-slate-600 truncate">{employee.zoomPersonalRoomUrl || 'Auto-generated'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Zoom Virtual Attendance Logs</h4>
                <button
                  onClick={() => exportDataToCsv(`${employee.fullName}_Attendance`, empAttendance)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              {empAttendance.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                  No attendance records recorded yet for this consultant.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">First Activity</th>
                        <th className="p-3">Last Activity</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Flags</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {empAttendance.map(a => (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-800">{a.date}</td>
                          <td className="p-3 font-mono">{a.firstZoomActivity}</td>
                          <td className="p-3 font-mono">{a.lastZoomActivity}</td>
                          <td className="p-3 font-bold text-indigo-600">{a.totalTrackedHours}h</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              a.status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                              a.status === 'Time Off' ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="p-3 text-[11px] text-slate-500">{a.flags.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Archived Documents Vault</h4>
              {empDocs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                  No verified documents uploaded for this profile.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {empDocs.map(doc => (
                    <div key={doc.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{doc.documentName}</div>
                          <div className="text-[11px] text-slate-400">{doc.fileName} • {doc.fileSize}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: POLICIES */}
          {activeTab === 'policies' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Signed Policy Acknowledgments</h4>
              <div className="space-y-2">
                {policies.map(pol => {
                  const ack = empAcks.find(a => a.policyId === pol.id);
                  return (
                    <div key={pol.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">{pol.title}</div>
                        <div className="text-[11px] text-slate-400">Version {pol.version} • {pol.category}</div>
                      </div>
                      {ack ? (
                        <div className="text-right">
                          <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Signed</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(ack.acknowledgedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          Pending Sign-off
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: PERFORMANCE */}
          {activeTab === 'performance' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">KRAs & Performance Goals</h4>
              {empGoals.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                  No active performance goals assigned.
                </div>
              ) : (
                <div className="space-y-3">
                  {empGoals.map(g => (
                    <div key={g.id} className="p-3.5 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{g.kraTitle}</span>
                        <span className="font-bold text-indigo-600">{g.progressPercent}%</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{g.kpiMetrics}</p>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${g.progressPercent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: TRAINING */}
          {activeTab === 'training' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Advisory Training Modules</h4>
              {empTrainings.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                  Not enrolled in any training modules.
                </div>
              ) : (
                <div className="space-y-2">
                  {empTrainings.map(t => (
                    <div key={t.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">{t.trainingTitle}</div>
                        <div className="text-[11px] text-slate-400">Status: {t.status}</div>
                      </div>
                      <span className="text-xs font-bold text-indigo-600">{t.progressPercent}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: REIMBURSEMENTS */}
          {activeTab === 'reimbursements' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Expense Claims History</h4>
              {empClaims.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                  No expense claims submitted.
                </div>
              ) : (
                <div className="space-y-2">
                  {empClaims.map(c => (
                    <div key={c.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800">{c.description}</div>
                        <div className="text-[11px] text-slate-400">{c.category} • {c.expenseDate}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-indigo-600">{c.currency} {c.requestedAmount.toLocaleString()}</div>
                        <span className="text-[10px] text-slate-500">{c.managerApprovalStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: HR CASES */}
          {activeTab === 'cases' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Confidential Case Files</h4>
              {empCases.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                  No grievances or confidential cases on record.
                </div>
              ) : (
                <div className="space-y-2">
                  {empCases.map(c => (
                    <div key={c.id} className="p-3 rounded-xl border border-purple-200 bg-purple-50/30">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-900">{c.ticketNumber} ({c.category})</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">{c.status}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{c.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 10: LIFECYCLE TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Career & Induction Timeline</h4>
              <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6 text-xs">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                  <span className="font-bold text-slate-900">Offer Accepted & Profile Created</span>
                  <p className="text-[11px] text-slate-500">{employee.dateOfJoining}</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <span className="font-bold text-slate-900">Zoom Virtual Office Credential Provisioned</span>
                  <p className="text-[11px] text-slate-500">Auto-mapped to {employee.zoomEmail}</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white" />
                  <span className="font-bold text-slate-900">Probation Milestone (90 Days)</span>
                  <p className="text-[11px] text-slate-500">Scheduled: {employee.probationEndDate}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">Verve Advisory HRMS Master Registry</span>
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold cursor-pointer"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};
