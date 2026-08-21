import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord } from '../../types';
import { X, CheckCircle2, AlertTriangle, MessageSquare, ShieldCheck } from 'lucide-react';

interface AttendanceExceptionModalProps {
  record: AttendanceRecord;
  onClose: () => void;
}

export const AttendanceExceptionModal: React.FC<AttendanceExceptionModalProps> = ({ record, onClose }) => {
  const { resolveAttendanceException, currentRole } = useApp();

  const [overrideStatus, setOverrideStatus] = useState<AttendanceRecord['status']>(record.status);
  const [resolutionNotes, setResolutionNotes] = useState(record.resolutionNotes || '');

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    resolveAttendanceException(record.id, overrideStatus, resolutionNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Resolve Virtual Attendance Exception</h3>
              <p className="text-xs text-slate-500">Record ID: {record.id} • Date: {record.date}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleResolve} className="p-6 space-y-4 text-xs">
          
          {/* Employee & Record Info */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Consultant:</span>
              <span className="font-bold text-slate-900">{record.employeeName} ({record.department})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Zoom Window:</span>
              <span className="font-mono text-slate-800">{record.firstZoomActivity} – {record.lastZoomActivity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tracked Duration:</span>
              <span className="font-bold text-indigo-600">{record.totalTrackedHours} Hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Triggered Flags:</span>
              <span className="font-semibold text-rose-600">{record.flags.join(', ')}</span>
            </div>
          </div>

          {/* Status Override */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Override Status Determination</label>
            <select
              value={overrideStatus}
              onChange={(e) => setOverrideStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Present">Present (Standard 48h Shift Fulfilled)</option>
              <option value="Partial">Partial Presence (Half Day Credited)</option>
              <option value="Exception">Exception (Unexcused Absence / Shortage)</option>
              <option value="Time Off">Wellbeing Time-Off (Excused Rest)</option>
            </select>
          </div>

          {/* Resolution Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">HR / Manager Resolution Notes *</label>
            <textarea
              required
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Employee attended off-platform client due diligence session on Microsoft Teams with Partner approval."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md cursor-pointer flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Resolve</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
