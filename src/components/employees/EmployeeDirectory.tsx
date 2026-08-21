import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee, Department, EmployeeLevel } from '../../types';
import { EmployeeProfileModal } from './EmployeeProfileModal';
import { AddEmployeeModal } from './AddEmployeeModal';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Download, 
  Video, 
  Mail, 
  Phone, 
  Building2, 
  LayoutGrid, 
  Table as TableIcon,
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const EmployeeDirectory: React.FC = () => {
  const { 
    allEmployees, 
    currentRole, 
    setCurrentUser, 
    exportDataToCsv 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [selectedProfileEmployee, setSelectedProfileEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const departments: Department[] = [
    'Valuations & Financial Modeling',
    'Corporate Advisory',
    'M&A Advisory',
    'Tax & Regulatory',
    'Strategy & Operations',
    'People & Culture'
  ];

  // Filtering
  const filteredEmployees = allEmployees.filter(emp => {
    const matchesSearch = 
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.companyEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.zoomUserId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || emp.employmentStatus === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Master Registry
            </span>
            <span className="text-xs text-slate-400">• {allEmployees.length} Consultants</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Employee Directory & Practice Roster</h2>
          <p className="text-xs text-slate-500">Centralized profile management, Zoom telemetry mapping, and policy compliance.</p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => exportDataToCsv('Verve_Advisory_Employees', filteredEmployees)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {['super_admin', 'hr_admin'].includes(currentRole) && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, code, designation, zoom ID..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-2">
            <select
              aria-label="Filter by Advisory Department"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Status Filter */}
            <select
              aria-label="Filter by Employment Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Probation">Probation</option>
              <option value="Notice Period">Notice Period</option>
              <option value="Pre-boarding">Pre-boarding</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded cursor-pointer ${viewMode === 'table' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map(emp => (
            <div
              key={emp.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={emp.avatarUrl}
                      alt={emp.fullName}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer" onClick={() => setSelectedProfileEmployee(emp)}>
                        {emp.fullName}
                      </h3>
                      <p className="text-[11px] text-slate-500">{emp.designation}</p>
                      <span className="text-[10px] font-mono text-slate-400">{emp.employeeCode}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    emp.employmentStatus === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    emp.employmentStatus === 'Onboarding' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {emp.employmentStatus}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[170px]">{emp.department}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Zoom User ID:</span>
                    <span className="font-mono text-indigo-600 font-semibold">{emp.zoomUserId}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Annual Rest:</span>
                    <span className="font-semibold text-slate-800">{emp.annualTimeOffDaysTaken} / {emp.mandatoryAnnualTimeOffTarget} days</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setCurrentUser(emp)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                >
                  View as Persona
                </button>

                <button
                  onClick={() => setSelectedProfileEmployee(emp)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <span>10-Tab Deep Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Consultant</th>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Practice</th>
                <th className="p-3.5">Designation & Grade</th>
                <th className="p-3.5">Zoom ID</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Rest Taken</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="p-3.5">
                    <div className="flex items-center space-x-2.5">
                      <img src={emp.avatarUrl} alt={emp.fullName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-slate-900">{emp.fullName}</div>
                        <div className="text-[11px] text-slate-400">{emp.companyEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-500">{emp.employeeCode}</td>
                  <td className="p-3.5 font-medium text-slate-700">{emp.department}</td>
                  <td className="p-3.5">
                    <div>{emp.designation}</div>
                    <div className="text-[10px] text-slate-400">{emp.level}</div>
                  </td>
                  <td className="p-3.5 font-mono text-indigo-600">{emp.zoomUserId}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {emp.employmentStatus}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-800">
                    {emp.annualTimeOffDaysTaken} / {emp.mandatoryAnnualTimeOffTarget}d
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedProfileEmployee(emp)}
                      className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 cursor-pointer"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Profile Modal */}
      {selectedProfileEmployee && (
        <EmployeeProfileModal
          employee={selectedProfileEmployee}
          onClose={() => setSelectedProfileEmployee(null)}
        />
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <AddEmployeeModal
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

    </div>
  );
};
