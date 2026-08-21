import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  LogOut,
  Sliders,
  User
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    currentUser, 
    setCurrentUser,
    switchRoleAccount,
    allEmployees,
    setIsSearchModalOpen,
    isNotificationDropdownOpen,
    setIsNotificationDropdownOpen,
    notifications,
    markAllNotificationsRead,
    integrationConfigs,
    setActiveTab,
    logout,
    authSessionInfo
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const zoomConfig = integrationConfigs.find(c => c.serviceName === 'Zoom');
  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<string, { label: string; color: string; badge: string }> = {
    super_admin: { label: 'Super Admin', color: 'text-indigo-700 bg-indigo-50 border-indigo-200', badge: 'bg-indigo-600 text-white' },
    manager: { label: 'Manager', color: 'text-amber-700 bg-amber-50 border-amber-200', badge: 'bg-amber-600 text-white' },
    employee: { label: 'Employee', color: 'text-slate-700 bg-slate-100 border-slate-200', badge: 'bg-slate-700 text-white' },
    hr_admin: { label: 'Super Admin', color: 'text-indigo-700 bg-indigo-50 border-indigo-200', badge: 'bg-indigo-600 text-white' }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Organization */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs font-bold text-lg tracking-wider">
              V
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">VERVE ADVISORY</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Virtual HRMS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Valuations • M&A • Tax • Corporate Strategy</p>
            </div>
          </div>

          {/* Center Search Trigger */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <button 
              onClick={() => setIsSearchModalOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Search employees, policies, cases, reimbursements...</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white border border-slate-300 rounded shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Tools: Mode, Notifications, Role, User */}
          <div className="flex items-center space-x-3">
            
            {/* Zoom Pipeline Status Pill */}
            <div 
              onClick={() => setActiveTab('integrations')}
              title="Click to view Zoom Integration Pipeline"
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${zoomConfig?.status === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-semibold">Zoom {zoomConfig?.mode === 'LIVE' ? 'Live' : 'Mock'}</span>
              <span className="text-[10px] text-slate-500">• 48h Sync</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-semibold text-slate-800">Notifications</span>
                      <span className="text-xs text-slate-500">({unreadCount} new)</span>
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllNotificationsRead}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 mt-2">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No notifications to display
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            if (n.actionTab) setActiveTab(n.actionTab);
                            setIsNotificationDropdownOpen(false);
                          }}
                          className={`p-2.5 rounded-lg transition-colors cursor-pointer hover:bg-slate-50 ${n.read ? 'opacity-70' : 'bg-indigo-50/40'}`}
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="text-xs font-semibold text-slate-900">{n.title}</h4>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3 Simple Roles Account & Email Switcher */}
            <div className="relative flex items-center">
              <select
                value={currentRole === 'hr_admin' ? 'super_admin' : currentRole}
                onChange={(e) => switchRoleAccount(e.target.value as 'super_admin' | 'manager' | 'employee')}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border appearance-none cursor-pointer pr-7 shadow-2xs focus:outline-hidden transition-all ${roleLabels[currentRole]?.color || 'bg-slate-50 text-slate-800'}`}
                title="Switch active role & authorized account email"
              >
                <option value="super_admin">👑 Super Admin (vikram.singhania@verveadvisory.com)</option>
                <option value="manager">💼 Manager (ananya.sharma@verveadvisory.com)</option>
                <option value="employee">👤 Employee (dev.chavan@verveadvisory.com)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 pointer-events-none text-slate-500" />
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
              >
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.fullName} 
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300"
                />
                <div className="text-left hidden xl:block">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.fullName}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{currentUser.designation}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Details & Privilege Summary Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  
                  {/* Authenticated Profile Card */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={currentUser.avatarUrl} 
                        alt={currentUser.fullName} 
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/20 shadow-xs" 
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser.fullName}</h4>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800">
                            {currentUser.employeeCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 truncate">{currentUser.designation}</p>
                        <p className="text-[10px] text-indigo-600 font-medium truncate">{currentUser.department}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Linked System Role:</span>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${roleLabels[currentRole].color}`}>
                        {roleLabels[currentRole].label}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center space-x-1 bg-white p-1.5 rounded-lg border border-slate-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">Privileges strictly linked to profile <strong>{currentUser.employeeCode}</strong></span>
                    </div>
                  </div>

                  {/* Session Security Metadata */}
                  {authSessionInfo && (
                    <div className="p-2.5 bg-indigo-50/40 rounded-xl text-[10px] text-slate-500 border border-indigo-100 space-y-1 my-2">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-500">Auth Method:</span>
                        <span className="font-semibold text-slate-800">{authSessionInfo.ssoProvider || 'Verve Corporate Auth'}</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-500">VPN Node:</span>
                        <span className="text-slate-700">{authSessionInfo.ipAddress.split(' ')[0]}</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-500">Corporate Email:</span>
                        <span className="text-slate-700 truncate max-w-[150px]">{currentUser.companyEmail}</span>
                      </div>
                    </div>
                  )}

                  {/* Profile Quick Links */}
                  <div className="space-y-1 pt-1">
                    <button 
                      onClick={() => {
                        setActiveTab('employees');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-xs text-slate-700 hover:text-indigo-600 flex items-center space-x-2 px-2.5 py-2 rounded-lg hover:bg-indigo-50/50 cursor-pointer transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>View My Employee Profile Record</span>
                    </button>

                    {['super_admin', 'hr_admin'].includes(currentRole) && (
                      <button 
                        onClick={() => {
                          setActiveTab('settings');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-xs text-slate-700 hover:text-slate-900 flex items-center space-x-2 px-2.5 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        <Sliders className="w-3.5 h-3.5 text-slate-400" />
                        <span>System Settings</span>
                      </button>
                    )}

                    <button 
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-2 px-2.5 py-2 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors border-t border-slate-100 mt-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Log Out & Lock Workspace</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Logout Header Icon Button */}
            <button
              onClick={logout}
              title="Log Out & Lock Workspace"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-200"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
