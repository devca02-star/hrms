import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Department, EmployeeLevel, Role } from '../../types';
import { X, UserPlus, Video, Mail, Phone, Building2, Calendar, ShieldCheck, Lock } from 'lucide-react';

interface AddEmployeeModalProps {
  onClose: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ onClose }) => {
  const { allEmployees, addEmployee, showToast } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    personalEmail: '',
    companyEmail: '',
    phone: '',
    dateOfBirth: '1998-01-01',
    dateOfJoining: new Date().toISOString().split('T')[0],
    department: 'Valuations & Financial Modeling' as Department,
    designation: 'Financial Analyst',
    level: 'Associate' as EmployeeLevel,
    role: 'employee' as Role,
    reportingManagerId: allEmployees[1]?.id || '',
    reportingManagerName: allEmployees[1]?.fullName || 'Ananya Sharma',
    employmentType: 'Full-Time' as const,
    employmentStatus: 'Onboarding' as const,
    workLocation: 'Virtual Office (Remote)' as const,
    workScheduleType: 'Standard (Mon-Sat, 48h)' as const,
    shiftStartTime: '09:30',
    shiftEndTime: '18:30',
    timeZone: 'IST (UTC+5:30)',
    probationStatus: 'In Progress' as const,
    probationEndDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    zoomEmail: '',
    zoomUserId: '',
    emergencyContactName: '',
    emergencyContactRelationship: 'Parent',
    emergencyContactPhone: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  });

  const departments: Department[] = [
    'Valuations & Financial Modeling',
    'Corporate Advisory',
    'M&A Advisory',
    'Tax & Regulatory',
    'Strategy & Operations',
    'People & Culture'
  ];

  const levels: EmployeeLevel[] = [
    'Associate',
    'Senior Associate',
    'Consultant',
    'Manager',
    'Associate Director',
    'Partner'
  ];

  const handleNameChange = (name: string) => {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '.');
    const autoEmail = cleanName ? `${cleanName}@verveadvisory.com` : '';
    const autoZoomId = `zoom_usr_${Math.floor(100000 + Math.random() * 900000)}`;

    setFormData(prev => ({
      ...prev,
      fullName: name,
      companyEmail: autoEmail,
      zoomEmail: autoEmail,
      zoomUserId: prev.zoomUserId || autoZoomId
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.companyEmail) {
      showToast('error', 'Validation Error', 'Please provide Full Name and Company Email');
      return;
    }

    const employeeCode = `VER-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    addEmployee({
      employeeCode,
      fullName: formData.fullName,
      avatarUrl: formData.avatarUrl,
      role: formData.role,
      personalEmail: formData.personalEmail || `${formData.companyEmail.split('@')[0]}@gmail.com`,
      companyEmail: formData.companyEmail,
      phone: formData.phone || '+91 98200 00000',
      dateOfBirth: formData.dateOfBirth,
      dateOfJoining: formData.dateOfJoining,
      department: formData.department,
      designation: formData.designation,
      level: formData.level,
      reportingManagerId: formData.reportingManagerId,
      reportingManagerName: formData.reportingManagerName,
      employmentType: formData.employmentType,
      employmentStatus: formData.employmentStatus,
      workLocation: formData.workLocation,
      workScheduleType: formData.workScheduleType,
      shiftStartTime: formData.shiftStartTime,
      shiftEndTime: formData.shiftEndTime,
      timeZone: formData.timeZone,
      probationStatus: formData.probationStatus,
      probationEndDate: formData.probationEndDate,
      zoomEmail: formData.zoomEmail,
      zoomUserId: formData.zoomUserId,
      zoomPersonalRoomUrl: `https://verveadvisory.zoom.us/j/${formData.zoomUserId.replace(/[^0-9]/g, '') || '9900112233'}`,
      emergencyContact: {
        name: formData.emergencyContactName || 'Family Contact',
        relationship: formData.emergencyContactRelationship,
        phone: formData.emergencyContactPhone || '+91 98200 11111'
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Onboard New Advisory Consultant</h3>
              <p className="text-xs text-slate-500">Register employee and auto-provision Zoom Virtual Office mapping</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Siddharth Joshi"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Email *</label>
              <input
                type="email"
                required
                value={formData.companyEmail}
                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value, zoomEmail: e.target.value })}
                placeholder="siddharth.joshi@verveadvisory.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Advisory Practice / Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Senior M&A Associate"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Grade / Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as EmployeeLevel })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Linked System Role & Privileges *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full px-3 py-2 text-xs border border-indigo-200 bg-indigo-50/30 font-semibold text-indigo-900 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="employee">Employee / Consultant (Standard User)</option>
                <option value="manager">Manager (Practice Approver & KRA Reviews)</option>
                <option value="hr_admin">HR Admin (People & Operations Lead)</option>
                <option value="super_admin">Super Admin (Managing Partner / Executive)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reporting Manager</label>
              <select
                value={formData.reportingManagerId}
                onChange={(e) => {
                  const mgr = allEmployees.find(m => m.id === e.target.value);
                  setFormData({
                    ...formData,
                    reportingManagerId: e.target.value,
                    reportingManagerName: mgr?.fullName || ''
                  });
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {allEmployees.map(m => (
                  <option key={m.id} value={m.id}>{m.fullName} ({m.level})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Location</label>
              <select
                value={formData.workLocation}
                onChange={(e) => setFormData({ ...formData, workLocation: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Virtual Office (Remote)">Virtual Office (Remote)</option>
                <option value="Mumbai HQ">Mumbai HQ</option>
                <option value="Bengaluru Practice">Bengaluru Practice</option>
                <option value="Delhi NCR Client Office">Delhi NCR Client Office</option>
              </select>
            </div>
          </div>

          {/* Zoom Integration Mapping Block */}
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
            <div className="flex items-center space-x-2">
              <Video className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-indigo-950">Zoom Virtual Attendance Mapping</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-indigo-900 mb-1">Zoom Email (Webhook Matcher)</label>
                <input
                  type="email"
                  value={formData.zoomEmail}
                  onChange={(e) => setFormData({ ...formData, zoomEmail: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-indigo-900 mb-1">Zoom User ID</label>
                <input
                  type="text"
                  value={formData.zoomUserId}
                  onChange={(e) => setFormData({ ...formData, zoomUserId: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg focus:outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          {/* Work Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Joining</label>
              <input
                type="date"
                value={formData.dateOfJoining}
                onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Shift Start</label>
              <input
                type="text"
                value={formData.shiftStartTime}
                onChange={(e) => setFormData({ ...formData, shiftStartTime: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Shift End</label>
              <input
                type="text"
                value={formData.shiftEndTime}
                onChange={(e) => setFormData({ ...formData, shiftEndTime: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create & Provision Profile</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
