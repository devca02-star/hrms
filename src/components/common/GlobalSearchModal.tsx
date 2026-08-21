import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  X, 
  Users, 
  FileText, 
  Receipt, 
  ShieldAlert, 
  FolderLock, 
  Sparkles, 
  Video, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    allEmployees, 
    policies, 
    reimbursements, 
    confidentialCases, 
    documents, 
    hrRequests, 
    setActiveTab,
    setCurrentUser
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const q = searchQuery.toLowerCase().trim();

  // Search Results
  const matchingEmployees = q 
    ? allEmployees.filter(e => 
        e.fullName.toLowerCase().includes(q) || 
        e.department.toLowerCase().includes(q) || 
        e.designation.toLowerCase().includes(q) ||
        e.zoomEmail.toLowerCase().includes(q) ||
        e.employeeCode.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchingPolicies = q 
    ? policies.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.summary.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchingReimbursements = q 
    ? reimbursements.filter(r => 
        r.employeeName.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchingCases = q 
    ? confidentialCases.filter(c => 
        c.ticketNumber.toLowerCase().includes(q) || 
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      ).slice(0, 2)
    : [];

  const matchingDocs = q 
    ? documents.filter(d => 
        d.documentName.toLowerCase().includes(q) || 
        d.fileName.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const quickActions = [
    { label: 'Broadcast Advance Time-Off', tab: 'wellbeing', icon: Sparkles },
    { label: 'Submit Reimbursement Claim', tab: 'reimbursements', icon: Receipt },
    { label: 'Simulate Zoom Webhook Ingestion', tab: 'attendance', icon: Video },
    { label: 'View 9 Verve HR Policies', tab: 'policies', icon: FileText },
    { label: 'Open Confidential Grievance Desk', tab: 'cases', icon: ShieldAlert },
    { label: 'View Employee Master Directory', tab: 'directory', icon: Users }
  ].filter(a => !q || a.label.toLowerCase().includes(q));

  const totalResults = matchingEmployees.length + matchingPolicies.length + matchingReimbursements.length + matchingCases.length + matchingDocs.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input 
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees, policies, cases, expenses, documents..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          
          {/* Quick Actions (when no query or matching) */}
          {quickActions.length > 0 && (!q || totalResults === 0) && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quick Shortcuts
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTab(action.tab);
                        setIsSearchModalOpen(false);
                      }}
                      className="flex items-center space-x-2.5 p-2 rounded-lg text-left text-xs text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer group"
                    >
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                      <span className="font-medium truncate">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Employees Results */}
          {matchingEmployees.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Employees & Consultants</span>
                <span>{matchingEmployees.length} found</span>
              </p>
              <div className="space-y-1">
                {matchingEmployees.map(emp => (
                  <div
                    key={emp.id}
                    onClick={() => {
                      setCurrentUser(emp);
                      setActiveTab('directory');
                      setIsSearchModalOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-indigo-50/70 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={emp.avatarUrl} alt={emp.fullName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{emp.fullName}</div>
                        <div className="text-[11px] text-slate-500">{emp.designation} • {emp.department}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                      <span className="font-mono">{emp.employeeCode}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Policies Results */}
          {matchingPolicies.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Company Policies</span>
                <span>{matchingPolicies.length} found</span>
              </p>
              <div className="space-y-1">
                {matchingPolicies.map(pol => (
                  <div
                    key={pol.id}
                    onClick={() => {
                      setActiveTab('policies');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2 rounded-lg hover:bg-indigo-50/70 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{pol.title}</div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {pol.version}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{pol.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reimbursements Results */}
          {matchingReimbursements.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Expense Claims
              </p>
              <div className="space-y-1">
                {matchingReimbursements.map(rem => (
                  <div
                    key={rem.id}
                    onClick={() => {
                      setActiveTab('reimbursements');
                      setIsSearchModalOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-indigo-50/70 transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{rem.description}</div>
                      <div className="text-[11px] text-slate-500">{rem.employeeName} • {rem.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-indigo-600">{rem.currency} {rem.requestedAmount.toLocaleString()}</div>
                      <span className="text-[10px] text-slate-400">{rem.managerApprovalStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {q && totalResults === 0 && (
            <div className="py-10 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No matching records found for "{searchQuery}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by employee name, policy keyword, or expense category.</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-3">
            <span>Navigate with arrows</span>
            <span>•</span>
            <span>Enter to select</span>
          </div>
          <span className="font-semibold text-indigo-600">Verve Advisory Search Engine</span>
        </div>

      </div>
    </div>
  );
};
