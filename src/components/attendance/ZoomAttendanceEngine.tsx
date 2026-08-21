import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord } from '../../types';
import { ZoomWebhookTesterModal } from './ZoomWebhookTesterModal';
import { AttendanceExceptionModal } from './AttendanceExceptionModal';
import { 
  Video, 
  Calendar, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Download, 
  Zap, 
  Eye, 
  Sliders, 
  Activity,
  PlusCircle
} from 'lucide-react';

export const ZoomAttendanceEngine: React.FC = () => {
  const { 
    attendanceRecords, 
    allEmployees, 
    currentRole, 
    runAttendanceRulesEngine, 
    exportDataToCsv 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-20');

  const [isTesterModalOpen, setIsTesterModalOpen] = useState(false);
  const [selectedExceptionRecord, setSelectedExceptionRecord] = useState<AttendanceRecord | null>(null);

  const departments = [
    'Valuations & Financial Modeling',
    'Corporate Advisory',
    'M&A Advisory',
    'Tax & Regulatory',
    'Strategy & Operations',
    'People & Culture'
  ];

  // Filter attendance records
  const filteredRecords = attendanceRecords.filter(r => {
    const matchesDate = !selectedDate || r.date === selectedDate;
    const matchesSearch = 
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    const matchesDept = selectedDept === 'ALL' || r.department === selectedDept;

    return matchesDate && matchesSearch && matchesStatus && matchesDept;
  });

  const presentCount = attendanceRecords.filter(r => r.date === selectedDate && r.status === 'Present').length;
  const exceptionCount = attendanceRecords.filter(r => r.date === selectedDate && r.status === 'Exception').length;
  const partialCount = attendanceRecords.filter(r => r.date === selectedDate && r.status === 'Partial').length;
  const timeOffCount = attendanceRecords.filter(r => r.date === selectedDate && r.status === 'Time Off').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Virtual Office Telemetry
            </span>
            <span className="text-xs text-slate-400">• Mon–Sat 48h Shift Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Zoom Attendance & Virtual Presence</h2>
          <p className="text-xs text-slate-500">
            Real-time webhook ingestion and shift reconciliation. No manual card swiping.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportDataToCsv(`Zoom_Attendance_${selectedDate}`, filteredRecords)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Logs</span>
          </button>

          {['super_admin', 'hr_admin'].includes(currentRole) && (
            <>
              <button
                onClick={() => setIsTesterModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulate Webhook</span>
              </button>

              <button
                onClick={() => runAttendanceRulesEngine()}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Reconcile Shifts</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Present (Fulfilled)</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{presentCount}</div>
          <span className="text-[10px] text-slate-400">≥ 7.5h Zoom Session</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Exceptions</span>
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{exceptionCount}</div>
          <span className="text-[10px] text-rose-500">Requires review / override</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Partial Presence</span>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">{partialCount}</div>
          <span className="text-[10px] text-slate-400">4.0h - 7.4h session</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Wellbeing Rest</span>
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-2">{timeOffCount}</div>
          <span className="text-[10px] text-indigo-500">Broadcasted Time-Off</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by employee name, code, or department..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-hidden"
            />

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Partial">Partial</option>
              <option value="Exception">Exception</option>
              <option value="Time Off">Time Off</option>
            </select>
          </div>

        </div>
      </div>

      {/* Daily Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Consultant</th>
                <th className="p-3.5">Practice</th>
                <th className="p-3.5">First Zoom Join</th>
                <th className="p-3.5">Last Zoom Leave</th>
                <th className="p-3.5">Total Duration</th>
                <th className="p-3.5">Shift Target</th>
                <th className="p-3.5">Rules Engine Status</th>
                <th className="p-3.5">Flags</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No attendance records found matching filters for {selectedDate}.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{rec.employeeName}</div>
                      <span className="text-[10px] font-mono text-slate-400">{rec.employeeCode}</span>
                    </td>
                    <td className="p-3.5 text-slate-600">{rec.department}</td>
                    <td className="p-3.5 font-mono text-slate-700">{rec.firstZoomActivity}</td>
                    <td className="p-3.5 font-mono text-slate-700">{rec.lastZoomActivity}</td>
                    <td className="p-3.5 font-bold text-indigo-600">{rec.totalTrackedHours}h</td>
                    <td className="p-3.5 text-slate-500">{rec.scheduledHours}h</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                        rec.status === 'Time Off' ? 'bg-indigo-100 text-indigo-800' :
                        rec.status === 'Partial' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-[11px] text-slate-500">
                      {rec.flags.join(', ')}
                    </td>
                    <td className="p-3.5 text-right">
                      {['super_admin', 'hr_admin', 'manager'].includes(currentRole) && (
                        <button
                          onClick={() => setSelectedExceptionRecord(rec)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer text-xs"
                        >
                          {rec.status === 'Exception' ? 'Resolve' : 'Details'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isTesterModalOpen && (
        <ZoomWebhookTesterModal
          onClose={() => setIsTesterModalOpen(false)}
        />
      )}

      {selectedExceptionRecord && (
        <AttendanceExceptionModal
          record={selectedExceptionRecord}
          onClose={() => setSelectedExceptionRecord(null)}
        />
      )}

    </div>
  );
};
