import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Role, 
  Employee, 
  Policy, 
  PolicyAcknowledgment, 
  ZoomMeetingRawEvent, 
  AttendanceRecord, 
  AttendanceRuleConfig,
  TimeOffNotification, 
  ReimbursementClaim, 
  PerformanceGoal,
  PerformanceReview,
  TrainingModule,
  TrainingEnrollment,
  ConfidentialCase, 
  DocumentRecord, 
  HrRequest,
  OffboardingRecord,
  AuditLogRecord,
  IntegrationConfig,
  ZoomSyncLog,
  SystemSettings,
  NotificationItem,
  ToastMessage
} from '../types';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_POLICIES, 
  INITIAL_RAW_ZOOM_EVENTS, 
  INITIAL_ATTENDANCE_RECORDS, 
  INITIAL_TIME_OFF_BROADCASTS, 
  INITIAL_REIMBURSEMENTS, 
  INITIAL_PERFORMANCE_GOALS,
  INITIAL_PERFORMANCE_REVIEWS,
  INITIAL_TRAINING_MODULES,
  INITIAL_TRAINING_ENROLLMENTS,
  INITIAL_CASES, 
  INITIAL_DOCUMENTS, 
  INITIAL_HR_REQUESTS,
  INITIAL_OFFBOARDING_RECORDS,
  INITIAL_AUDIT_LOGS,
  INITIAL_INTEGRATION_CONFIGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SYSTEM_SETTINGS
} from '../data/mockData';

interface AuthSessionInfo {
  loginTime: string;
  ipAddress: string;
  device: string;
  ssoProvider?: string;
}

interface AppContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  authSessionInfo: AuthSessionInfo | null;
  login: (email: string, password?: string, overrideRole?: Role, ssoProvider?: string) => boolean;
  loginAsPersona: (employeeId: string, role: Role) => void;
  logout: () => void;
  hasRoleAccess: (allowedRoles: Role[]) => boolean;

  // Roles & Active User
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUser: Employee;
  setCurrentUser: (emp: Employee) => void;
  switchRoleAccount: (role: 'super_admin' | 'manager' | 'employee') => void;
  allEmployees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id' | 'onboardingCompleted' | 'onboardingStep' | 'annualTimeOffDaysTaken' | 'mandatoryAnnualTimeOffTarget'>) => void;
  updateEmployee: (id: string, partial: Partial<Employee>) => void;
  
  // Navigation & UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isNotificationDropdownOpen: boolean;
  setIsNotificationDropdownOpen: (open: boolean) => void;

  // Onboarding Wizard
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  completeCurrentOnboardingStep: () => void;
  updateCurrentUserProfile: (partial: Partial<Employee>) => void;
  
  // Policies & Sign-offs
  policies: Policy[];
  acknowledgments: PolicyAcknowledgment[];
  acknowledgePolicy: (policyId: string, signatureName: string) => boolean;
  isPolicyAcknowledged: (policyId: string, employeeId?: string) => boolean;
  addPolicy: (policy: Omit<Policy, 'id'>) => void;
  updatePolicy: (policyId: string, updatedData: Partial<Policy>) => boolean;
  deletePolicy: (policyId: string) => boolean;

  // Documents Vault
  documents: DocumentRecord[];
  uploadDocument: (doc: Omit<DocumentRecord, 'id' | 'uploadDate' | 'uploadedBy' | 'status'>) => void;
  verifyDocument: (id: string, status: DocumentRecord['status']) => void;

  // Zoom Attendance Engine
  rawZoomEvents: ZoomMeetingRawEvent[];
  attendanceRecords: AttendanceRecord[];
  attendanceRules: AttendanceRuleConfig;
  setAttendanceRules: React.Dispatch<React.SetStateAction<AttendanceRuleConfig>>;
  addRawZoomEvent: (event: Omit<ZoomMeetingRawEvent, 'id' | 'syncedAt' | 'meetingUuid'>) => void;
  runAttendanceRulesEngine: (targetDate?: string) => void;
  resolveAttendanceException: (recordId: string, notes: string) => void;
  manualOverrideAttendance: (recordId: string, newStatus: AttendanceRecord['status'], notes: string) => void;

  // No-Leave & Wellbeing Tracking
  timeOffBroadcasts: TimeOffNotification[];
  broadcastTimeOff: (data: Omit<TimeOffNotification, 'id' | 'createdAt' | 'status' | 'employeeId' | 'employeeName' | 'department'>) => void;
  
  // Reimbursements
  reimbursements: ReimbursementClaim[];
  submitReimbursement: (claim: Omit<ReimbursementClaim, 'id' | 'submittedAt' | 'managerApprovalStatus' | 'financeVerificationStatus' | 'employeeId' | 'employeeName' | 'department'>) => void;
  approveReimbursementManager: (id: string, approvedAmount: number, notes?: string) => void;
  verifyReimbursementFinance: (id: string, paidDate?: string) => void;
  rejectReimbursement: (id: string, notes: string) => void;

  // Performance Management
  performanceGoals: PerformanceGoal[];
  performanceReviews: PerformanceReview[];
  addGoal: (goal: Omit<PerformanceGoal, 'id'>) => void;
  updateGoalProgress: (id: string, progress: number, status: PerformanceGoal['status']) => void;
  submitPerformanceReview: (review: Omit<PerformanceReview, 'id' | 'submittedAt'>) => void;
  completeManagerReview: (id: string, managerRating: number, managerComments: string, finalScore: number) => void;

  // Training & Development
  trainingModules: TrainingModule[];
  trainingEnrollments: TrainingEnrollment[];
  enrollInTraining: (trainingId: string) => void;
  updateTrainingProgress: (enrollmentId: string, progress: number) => void;

  // Confidential Cases & POSH
  confidentialCases: ConfidentialCase[];
  fileConfidentialCase: (data: Omit<ConfidentialCase, 'id' | 'ticketNumber' | 'filedAt' | 'status' | 'assignedHrName' | 'confidentialNotes'>) => string;
  updateCaseStatus: (id: string, status: ConfidentialCase['status'], note: string) => void;

  // HR Requests
  hrRequests: HrRequest[];
  submitHrRequest: (req: Omit<HrRequest, 'id' | 'submittedAt' | 'status' | 'employeeId' | 'employeeName' | 'department'>) => void;
  updateHrRequestStatus: (id: string, status: HrRequest['status'], resolutionNotes?: string) => void;

  // Separation & Offboarding
  offboardingRecords: OffboardingRecord[];
  submitResignation: (lastWorkingDayNotes?: string, waiverRequested?: boolean) => void;
  updateNoDuesClearance: (recordId: string, field: keyof OffboardingRecord['noDuesStatus'], value: boolean) => void;
  markFnfDisbursed: (recordId: string) => void;
  issueRelievingLetter: (recordId: string) => void;

  // Integrations & Sync
  integrationConfigs: IntegrationConfig[];
  toggleIntegrationMode: (serviceName: IntegrationConfig['serviceName']) => void;
  triggerManualSync: (serviceName: IntegrationConfig['serviceName']) => void;
  zoomSyncLogs: ZoomSyncLog[];

  // Audit Logs
  auditLogs: AuditLogRecord[];
  logAuditEvent: (module: AuditLogRecord['module'], action: string, recordId?: string, oldValue?: string, newValue?: string) => void;

  // System Settings
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message: string) => void;
  dismissToast: (id: string) => void;
  removeToast: (id: string) => void;

  // Utilities
  exportDataToCsv: (filename: string, rows: Record<string, any>[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Role & Current User State
  const [allEmployees, setAllEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('verve_employees_v2');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  // Authentication State
  const [authSession, setAuthSession] = useState<{
    isAuthenticated: boolean;
    userId: string;
    role: Role;
    sessionInfo: AuthSessionInfo;
  }>(() => {
    const saved = localStorage.getItem('verve_auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          isAuthenticated: true,
          userId: parsed.userId || 'emp-ananya-02',
          role: parsed.role || 'super_admin',
          sessionInfo: parsed.sessionInfo || {
            loginTime: new Date().toISOString(),
            ipAddress: '103.28.114.77 (Verve VPN)',
            device: 'Chrome 124.0 on macOS (Managed Device)',
            ssoProvider: parsed.ssoProvider || 'Verve Enterprise SSO'
          }
        };
      } catch {
        // invalid json fallback
      }
    }
    // Default to unauthenticated initial state so the login wall is shown
    return {
      isAuthenticated: false,
      userId: 'emp-vikram-partner',
      role: 'super_admin',
      sessionInfo: {
        loginTime: new Date().toISOString(),
        ipAddress: '103.28.114.77 (Verve VPN)',
        device: 'Chrome 124.0 on macOS (Managed Device)',
        ssoProvider: 'Verve Enterprise SSO'
      }
    };
  });

  const [currentRole, setCurrentRole] = useState<Role>(authSession.role);
  const [currentUserId, setCurrentUserId] = useState<string>(authSession.userId);
  const currentUser = allEmployees.find(e => e.id === currentUserId) || allEmployees[0];
  const isAuthenticated = authSession.isAuthenticated;
  const authSessionInfo = authSession.sessionInfo;

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState<boolean>(false);

  // 3. Onboarding
  const [onboardingStep, setOnboardingStep] = useState<number>(currentUser?.onboardingStep || 1);

  // 4. Policies
  const [policies, setPolicies] = useState<Policy[]>(() => {
    const saved = localStorage.getItem('verve_policies_v2');
    return saved ? JSON.parse(saved) : INITIAL_POLICIES;
  });

  const [acknowledgments, setAcknowledgments] = useState<PolicyAcknowledgment[]>(() => {
    const saved = localStorage.getItem('verve_policy_acks_v2');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ack-001',
        policyId: 'pol-no-leave',
        policyVersion: 'v2.4',
        employeeId: 'emp-ananya-02',
        employeeName: 'Ananya Sharma',
        acknowledgedAt: '2024-03-15T10:00:00Z',
        signatureName: 'Ananya Sharma',
        ipAddress: '103.21.54.9',
        deviceInfo: 'Chrome 122.0 on macOS (Verve VPN)'
      },
      {
        id: 'ack-002',
        policyId: 'pol-virtual-office',
        policyVersion: 'v3.1',
        employeeId: 'emp-ananya-02',
        employeeName: 'Ananya Sharma',
        acknowledgedAt: '2024-03-15T10:05:00Z',
        signatureName: 'Ananya Sharma',
        ipAddress: '103.21.54.9',
        deviceInfo: 'Chrome 122.0 on macOS (Verve VPN)'
      },
      {
        id: 'ack-003',
        policyId: 'pol-no-leave',
        policyVersion: 'v2.4',
        employeeId: 'emp-dev-01',
        employeeName: 'Dev Chavan',
        acknowledgedAt: '2026-08-01T11:20:00Z',
        signatureName: 'Dev Chavan',
        ipAddress: '103.28.114.77',
        deviceInfo: 'Chrome 124.0 on Windows (Verve VPN)'
      }
    ];
  });

  // 5. Documents
  const [documents, setDocuments] = useState<DocumentRecord[]>(() => {
    const saved = localStorage.getItem('verve_documents_v2');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  // 6. Attendance & Zoom Pipeline
  const [rawZoomEvents, setRawZoomEvents] = useState<ZoomMeetingRawEvent[]>(() => {
    const saved = localStorage.getItem('verve_zoom_events_v2');
    return saved ? JSON.parse(saved) : INITIAL_RAW_ZOOM_EVENTS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('verve_attendance_records_v2');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS;
  });

  const [attendanceRules, setAttendanceRules] = useState<AttendanceRuleConfig>({
    standardDailyHours: 8,
    weeklyWorkHours: 48,
    lateJoinThresholdMinutes: 15,
    earlyLeaveThresholdMinutes: 15,
    minimumPartialHoursThreshold: 4.0,
    autoFlagMissingZoomAfterHours: 18.5
  });

  // 7. Time-Off / Wellbeing
  const [timeOffBroadcasts, setTimeOffBroadcasts] = useState<TimeOffNotification[]>(() => {
    const saved = localStorage.getItem('verve_time_off_v2');
    return saved ? JSON.parse(saved) : INITIAL_TIME_OFF_BROADCASTS;
  });

  // 8. Reimbursements
  const [reimbursements, setReimbursements] = useState<ReimbursementClaim[]>(() => {
    const saved = localStorage.getItem('verve_reimbursements_v2');
    return saved ? JSON.parse(saved) : INITIAL_REIMBURSEMENTS;
  });

  // 9. Performance
  const [performanceGoals, setPerformanceGoals] = useState<PerformanceGoal[]>(() => {
    const saved = localStorage.getItem('verve_perf_goals_v2');
    return saved ? JSON.parse(saved) : INITIAL_PERFORMANCE_GOALS;
  });

  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(() => {
    const saved = localStorage.getItem('verve_perf_reviews_v2');
    return saved ? JSON.parse(saved) : INITIAL_PERFORMANCE_REVIEWS;
  });

  // 10. Training
  const [trainingModules] = useState<TrainingModule[]>(INITIAL_TRAINING_MODULES);
  const [trainingEnrollments, setTrainingEnrollments] = useState<TrainingEnrollment[]>(() => {
    const saved = localStorage.getItem('verve_training_enr_v2');
    return saved ? JSON.parse(saved) : INITIAL_TRAINING_ENROLLMENTS;
  });

  // 11. Confidential Cases
  const [confidentialCases, setConfidentialCases] = useState<ConfidentialCase[]>(() => {
    const saved = localStorage.getItem('verve_cases_v2');
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });

  // 12. HR Requests
  const [hrRequests, setHrRequests] = useState<HrRequest[]>(() => {
    const saved = localStorage.getItem('verve_hr_requests_v2');
    return saved ? JSON.parse(saved) : INITIAL_HR_REQUESTS;
  });

  // 13. Offboarding
  const [offboardingRecords, setOffboardingRecords] = useState<OffboardingRecord[]>(() => {
    const saved = localStorage.getItem('verve_offboarding_v2');
    return saved ? JSON.parse(saved) : INITIAL_OFFBOARDING_RECORDS;
  });

  // 14. Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(() => {
    const saved = localStorage.getItem('verve_audit_logs_v2');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // 15. Integrations & Logs
  const [integrationConfigs, setIntegrationConfigs] = useState<IntegrationConfig[]>(() => {
    const saved = localStorage.getItem('verve_integrations_v2');
    return saved ? JSON.parse(saved) : INITIAL_INTEGRATION_CONFIGS;
  });

  const [zoomSyncLogs, setZoomSyncLogs] = useState<ZoomSyncLog[]>([
    {
      id: 'sync-log-01',
      timestamp: '2026-08-20T18:35:00Z',
      eventsReceived: 5,
      matchedEmployees: 4,
      exceptionsDetected: 1,
      durationMs: 142,
      status: 'Success',
      message: 'Automated 15-minute Zoom webhook batch reconciled.'
    }
  ]);

  // 16. System Settings
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('verve_system_settings_v2');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_SETTINGS;
  });

  // 17. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('verve_notifications_v2');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // 18. Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistence Sync
  useEffect(() => { localStorage.setItem('verve_employees_v2', JSON.stringify(allEmployees)); }, [allEmployees]);
  useEffect(() => { localStorage.setItem('verve_policies_v2', JSON.stringify(policies)); }, [policies]);
  useEffect(() => { localStorage.setItem('verve_policy_acks_v2', JSON.stringify(acknowledgments)); }, [acknowledgments]);
  useEffect(() => { localStorage.setItem('verve_documents_v2', JSON.stringify(documents)); }, [documents]);
  useEffect(() => { localStorage.setItem('verve_zoom_events_v2', JSON.stringify(rawZoomEvents)); }, [rawZoomEvents]);
  useEffect(() => { localStorage.setItem('verve_attendance_records_v2', JSON.stringify(attendanceRecords)); }, [attendanceRecords]);
  useEffect(() => { localStorage.setItem('verve_time_off_v2', JSON.stringify(timeOffBroadcasts)); }, [timeOffBroadcasts]);
  useEffect(() => { localStorage.setItem('verve_reimbursements_v2', JSON.stringify(reimbursements)); }, [reimbursements]);
  useEffect(() => { localStorage.setItem('verve_perf_goals_v2', JSON.stringify(performanceGoals)); }, [performanceGoals]);
  useEffect(() => { localStorage.setItem('verve_perf_reviews_v2', JSON.stringify(performanceReviews)); }, [performanceReviews]);
  useEffect(() => { localStorage.setItem('verve_training_enr_v2', JSON.stringify(trainingEnrollments)); }, [trainingEnrollments]);
  useEffect(() => { localStorage.setItem('verve_cases_v2', JSON.stringify(confidentialCases)); }, [confidentialCases]);
  useEffect(() => { localStorage.setItem('verve_hr_requests_v2', JSON.stringify(hrRequests)); }, [hrRequests]);
  useEffect(() => { localStorage.setItem('verve_offboarding_v2', JSON.stringify(offboardingRecords)); }, [offboardingRecords]);
  useEffect(() => { localStorage.setItem('verve_audit_logs_v2', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('verve_integrations_v2', JSON.stringify(integrationConfigs)); }, [integrationConfigs]);
  useEffect(() => { localStorage.setItem('verve_system_settings_v2', JSON.stringify(systemSettings)); }, [systemSettings]);
  useEffect(() => { localStorage.setItem('verve_notifications_v2', JSON.stringify(notifications)); }, [notifications]);

  // Global Toast Helper
  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Audit Log Trigger
  const logAuditEvent = (module: AuditLogRecord['module'], action: string, recordId?: string, oldValue?: string, newValue?: string) => {
    const newLog: AuditLogRecord = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: currentUser ? currentUser.fullName : 'System User',
      userRole: currentRole,
      module,
      action,
      recordId,
      oldValue,
      newValue,
      ipAddress: '103.28.114.77 (Verve VPN)'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Role Access Checker
  const hasRoleAccess = (allowedRoles: Role[]): boolean => {
    return allowedRoles.includes(currentRole);
  };

  // Login Handler - Role and Privileges are strictly linked to the employee profile
  const login = (email: string, _password?: string, overrideRole?: Role, ssoProvider?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const foundEmp = allEmployees.find(e => 
      e.companyEmail.toLowerCase() === cleanEmail || 
      e.personalEmail.toLowerCase() === cleanEmail ||
      e.zoomEmail.toLowerCase() === cleanEmail
    );

    const targetEmp = foundEmp || allEmployees[0];
    
    // Privileges are derived directly from the registered profile
    const determinedRole: Role = targetEmp.role || overrideRole || 'employee';

    const session: AuthSessionInfo = {
      loginTime: new Date().toISOString(),
      ipAddress: '103.28.114.77 (Verve VPN)',
      device: 'Chrome 124.0 on macOS (Verve Managed Device)',
      ssoProvider: ssoProvider || (cleanEmail.includes('google') ? 'Google Workspace SSO' : 'Verve Corporate Auth')
    };

    setAuthSession({
      isAuthenticated: true,
      userId: targetEmp.id,
      role: determinedRole,
      sessionInfo: session
    });

    setCurrentUserId(targetEmp.id);
    setCurrentRole(determinedRole);
    setOnboardingStep(targetEmp.onboardingStep || 1);

    localStorage.setItem('verve_auth_session', JSON.stringify({
      userId: targetEmp.id,
      role: determinedRole,
      sessionInfo: session
    }));

    if (!targetEmp.onboardingCompleted && determinedRole === 'employee') {
      setActiveTab('onboarding');
    } else {
      setActiveTab('dashboard');
    }

    logAuditEvent(
      'Authentication', 
      `User Authenticated via ${session.ssoProvider}`, 
      targetEmp.id, 
      undefined, 
      `Logged in as ${targetEmp.fullName} [Role: ${determinedRole}]`
    );

    showToast('success', 'Access Granted', `Welcome back, ${targetEmp.fullName} • Assigned Role: ${determinedRole.replace('_', ' ').toUpperCase()}`);
    return true;
  };

  // Login as Persona Quick Action
  const loginAsPersona = (employeeId: string, roleOverride?: Role) => {
    const emp = allEmployees.find(e => e.id === employeeId) || allEmployees[0];
    const role: Role = roleOverride || emp.role || 'employee';
    const session: AuthSessionInfo = {
      loginTime: new Date().toISOString(),
      ipAddress: '103.28.114.77 (Verve VPN)',
      device: 'Chrome 124.0 on macOS (Verve Workstation)',
      ssoProvider: 'Verified Profile Login'
    };

    setAuthSession({
      isAuthenticated: true,
      userId: emp.id,
      role: role,
      sessionInfo: session
    });

    setCurrentUserId(emp.id);
    setCurrentRole(role);
    setOnboardingStep(emp.onboardingStep || 1);

    localStorage.setItem('verve_auth_session', JSON.stringify({
      userId: emp.id,
      role: role,
      sessionInfo: session
    }));

    if (!emp.onboardingCompleted && role === 'employee') {
      setActiveTab('onboarding');
    } else {
      setActiveTab('dashboard');
    }

    logAuditEvent('Authentication', 'Switched Persona Login', emp.id, undefined, `Role: ${role}, User: ${emp.fullName}`);
    showToast('success', 'Profile Loaded', `Authenticated as ${emp.fullName} [${role.replace('_', ' ').toUpperCase()}]`);
  };

  // Logout Handler
  const logout = () => {
    const userName = currentUser ? currentUser.fullName : 'User';
    localStorage.removeItem('verve_auth_session');
    setAuthSession(prev => ({
      ...prev,
      isAuthenticated: false
    }));
    logAuditEvent('Authentication', 'User Session Terminated', currentUser ? currentUser.id : undefined, undefined, `Logged out: ${userName}`);
    showToast('info', 'Logged Out', 'Your session has been securely ended.');
  };

  // Switch User - Synchronizes role strictly from the target employee profile
  const setCurrentUser = (emp: Employee) => {
    const assignedRole = emp.role || 'employee';
    setCurrentUserId(emp.id);
    setCurrentRole(assignedRole);
    setOnboardingStep(emp.onboardingStep || 1);
    setAuthSession(prev => ({
      ...prev,
      userId: emp.id,
      role: assignedRole
    }));
    localStorage.setItem('verve_auth_session', JSON.stringify({
      userId: emp.id,
      role: assignedRole,
      sessionInfo: authSessionInfo
    }));
    showToast('info', 'Switched Active Profile', `Active account: ${emp.fullName} [Role: ${assignedRole.replace('_', ' ').toUpperCase()}]`);
  };

  // Switch Role Account - directly maps 3 simple roles to authorized personas & email
  const switchRoleAccount = (targetRole: 'super_admin' | 'manager' | 'employee') => {
    let targetEmp: Employee | undefined;
    if (targetRole === 'super_admin') {
      targetEmp = allEmployees.find(e => e.role === 'super_admin') || allEmployees.find(e => e.id === 'emp-vikram-partner');
    } else if (targetRole === 'manager') {
      targetEmp = allEmployees.find(e => e.role === 'manager') || allEmployees.find(e => e.id === 'emp-ananya-02');
    } else {
      targetEmp = allEmployees.find(e => e.role === 'employee') || allEmployees.find(e => e.id === 'emp-dev-01');
    }

    if (targetEmp) {
      setCurrentUserId(targetEmp.id);
      setCurrentRole(targetEmp.role || targetRole);
      setOnboardingStep(targetEmp.onboardingStep || 1);
      setAuthSession(prev => ({
        ...prev,
        userId: targetEmp!.id,
        role: targetEmp!.role || targetRole
      }));
      localStorage.setItem('verve_auth_session', JSON.stringify({
        userId: targetEmp.id,
        role: targetEmp.role || targetRole,
        sessionInfo: authSessionInfo
      }));
      logAuditEvent('Authentication', 'Role Account Switched', targetEmp.id, undefined, `Role: ${targetRole}, Email: ${targetEmp.companyEmail}`);
      showToast('success', 'Account & Role Switched', `Logged in as ${targetEmp.fullName} (${targetEmp.companyEmail}) • Role: ${targetRole.replace('_', ' ').toUpperCase()}`);
    }
  };

  // Add Employee
  const addEmployee = (empData: Omit<Employee, 'id' | 'onboardingCompleted' | 'onboardingStep' | 'annualTimeOffDaysTaken' | 'mandatoryAnnualTimeOffTarget'>) => {
    const newEmpId = `emp-${Date.now().toString(36)}`;
    const newEmployee: Employee = {
      ...empData,
      id: newEmpId,
      onboardingCompleted: false,
      onboardingStep: 1,
      annualTimeOffDaysTaken: 0,
      mandatoryAnnualTimeOffTarget: 18
    };

    setAllEmployees(prev => [newEmployee, ...prev]);
    logAuditEvent('Employee Master', 'Added New Employee', newEmpId, undefined, `${newEmployee.fullName} (${newEmployee.designation})`);
    showToast('success', 'Employee Created', `${newEmployee.fullName} added with Zoom mapping ${newEmployee.zoomEmail}`);
  };

  // Update Employee
  const updateEmployee = (id: string, partial: Partial<Employee>) => {
    setAllEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        return { ...emp, ...partial };
      }
      return emp;
    }));
    logAuditEvent('Employee Master', 'Updated Employee Record', id, undefined, JSON.stringify(partial));
    showToast('success', 'Employee Updated', 'Employee master record synced successfully.');
  };

  const updateCurrentUserProfile = (partial: Partial<Employee>) => {
    updateEmployee(currentUser.id, partial);
  };

  // Onboarding Step Advancement
  const completeCurrentOnboardingStep = () => {
    const nextStep = Math.min(onboardingStep + 1, 7);
    setOnboardingStep(nextStep);
    
    setAllEmployees(prev => prev.map(emp => {
      if (emp.id === currentUser.id) {
        const isFinished = nextStep >= 7;
        return {
          ...emp,
          onboardingStep: nextStep,
          onboardingCompleted: isFinished || emp.onboardingCompleted,
          employmentStatus: isFinished && emp.employmentStatus === 'Onboarding' ? 'Probation' : emp.employmentStatus
        };
      }
      return emp;
    }));

    logAuditEvent('Onboarding', `Completed Induction Step ${onboardingStep}`, currentUser.id);
    showToast('success', `Induction Step Completed`, `Advanced to Step ${nextStep} in Verve Induction.`);
  };

  // Policy Management
  const addPolicy = (policyData: Omit<Policy, 'id'>) => {
    if (currentRole !== 'super_admin') {
      showToast('error', 'Access Denied', 'Only Super Admin can create firm governance policies.');
      return;
    }
    const newPolicy: Policy = {
      ...policyData,
      id: `pol-${Date.now().toString(36)}`
    };
    setPolicies(prev => [newPolicy, ...prev]);
    logAuditEvent('Policies', 'Created New Policy Document', newPolicy.id, undefined, newPolicy.title);
    showToast('success', 'Policy Created', `${newPolicy.title} published.`);
  };

  const updatePolicy = (policyId: string, updatedData: Partial<Policy>): boolean => {
    if (currentRole !== 'super_admin') {
      showToast('error', 'Access Denied', 'Only Super Admin is authorized to modify company policies.');
      return false;
    }
    setPolicies(prev => prev.map(p => {
      if (p.id === policyId) {
        return { ...p, ...updatedData };
      }
      return p;
    }));
    logAuditEvent('Policies', 'Updated Governance Policy', policyId, undefined, JSON.stringify(updatedData));
    showToast('success', 'Policy Updated', 'Policy terms and governance guidelines updated successfully.');
    return true;
  };

  const deletePolicy = (policyId: string): boolean => {
    if (currentRole !== 'super_admin') {
      showToast('error', 'Access Denied', 'Only Super Admin is authorized to remove company policies.');
      return false;
    }
    const target = policies.find(p => p.id === policyId);
    setPolicies(prev => prev.filter(p => p.id !== policyId));
    logAuditEvent('Policies', 'Archived/Removed Policy', policyId, target?.title, undefined);
    showToast('info', 'Policy Removed', `Policy removed from active governance records.`);
    return true;
  };

  const acknowledgePolicy = (policyId: string, signatureName: string): boolean => {
    const policy = policies.find(p => p.id === policyId);
    if (!policy) return false;

    const existing = acknowledgments.find(a => a.policyId === policyId && a.employeeId === currentUser.id);
    if (existing) {
      showToast('info', 'Policy Locked', 'This policy has already been signed and is permanently locked for your profile.');
      return true;
    }

    const newAck: PolicyAcknowledgment = {
      id: `ack-${Date.now()}`,
      policyId,
      policyVersion: policy.version,
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      acknowledgedAt: new Date().toISOString(),
      signatureName,
      ipAddress: '103.28.114.77',
      deviceInfo: navigator.userAgent
    };

    setAcknowledgments(prev => [newAck, ...prev]);
    logAuditEvent('Policies', `Digitally Signed ${policy.title}`, policyId, undefined, `Signature: ${signatureName}`);
    showToast('success', 'Policy Acknowledged & Locked', `Signed "${policy.title}". Record locked in employee compliance vault.`);
    return true;
  };

  const isPolicyAcknowledged = (policyId: string, employeeId?: string) => {
    const targetEmpId = employeeId || currentUser.id;
    return acknowledgments.some(a => a.policyId === policyId && a.employeeId === targetEmpId);
  };

  // Document Vault
  const uploadDocument = (docData: Omit<DocumentRecord, 'id' | 'uploadDate' | 'uploadedBy' | 'status'>) => {
    const newDoc: DocumentRecord = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: currentUser.fullName,
      status: 'Verified'
    };
    setDocuments(prev => [newDoc, ...prev]);
    logAuditEvent('Documents', `Uploaded Document: ${docData.documentName}`, newDoc.id);
    showToast('success', 'Document Stored', `${docData.documentName} encrypted & archived to Vault.`);
  };

  const verifyDocument = (id: string, status: DocumentRecord['status']) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, status } : doc));
    logAuditEvent('Documents', `Updated Document Verification: ${status}`, id);
    showToast('info', 'Document Status Updated', `Status changed to ${status}.`);
  };

  // Attendance Engine & Zoom Webhook Simulator
  const addRawZoomEvent = (event: Omit<ZoomMeetingRawEvent, 'id' | 'syncedAt' | 'meetingUuid'>) => {
    const newRaw: ZoomMeetingRawEvent = {
      ...event,
      id: `z-ev-${Date.now()}`,
      meetingUuid: `u-${event.meetingId}-${Date.now().toString(36)}`,
      syncedAt: new Date().toISOString()
    };
    setRawZoomEvents(prev => [newRaw, ...prev]);
    logAuditEvent('Attendance', `Ingested Zoom Webhook Event`, newRaw.meetingId, undefined, `${event.participantName} (${event.durationMinutes}m)`);
    showToast('info', 'Zoom Webhook Ingested', `Captured ${event.participantName} in ${event.meetingTopic}`);
    
    // Auto-run rules calculation
    setTimeout(() => {
      runAttendanceRulesEngine();
    }, 400);
  };

  const runAttendanceRulesEngine = (targetDate: string = '2026-08-20') => {
    const updatedRecords: AttendanceRecord[] = allEmployees.map(emp => {
      // Check planned absence / time off
      const hasTimeOff = timeOffBroadcasts.some(to => 
        to.employeeId === emp.id && targetDate >= to.startDate && targetDate <= to.endDate
      );

      if (hasTimeOff) {
        return {
          id: `att-${emp.id}-${targetDate}`,
          employeeId: emp.id,
          employeeName: emp.fullName,
          department: emp.department,
          date: targetDate,
          scheduledStart: emp.shiftStartTime,
          scheduledEnd: emp.shiftEndTime,
          firstZoomActivity: '--',
          lastZoomActivity: '--',
          totalTrackedHours: 0,
          meetingCount: 0,
          status: 'Time Off',
          flags: ['Advance Time-off Broadcast Verified'],
          source: 'Zoom Attendance',
          rawMeetingIds: [],
          syncTimestamp: new Date().toISOString()
        };
      }

      // Filter Zoom events by email or zoom ID
      const empEvents = rawZoomEvents.filter(ev => 
        ev.participantEmail.toLowerCase() === emp.zoomEmail.toLowerCase() ||
        (ev.participantZoomId && ev.participantZoomId === emp.zoomUserId)
      );

      if (empEvents.length === 0) {
        return {
          id: `att-${emp.id}-${targetDate}`,
          employeeId: emp.id,
          employeeName: emp.fullName,
          department: emp.department,
          date: targetDate,
          scheduledStart: emp.shiftStartTime,
          scheduledEnd: emp.shiftEndTime,
          firstZoomActivity: '--',
          lastZoomActivity: '--',
          totalTrackedHours: 0,
          meetingCount: 0,
          status: 'Exception',
          exceptionType: 'Missing Zoom Activity',
          flags: ['No Zoom Virtual Office Activity Detected'],
          source: 'Zoom Attendance',
          rawMeetingIds: [],
          hrReviewStatus: 'Pending',
          syncTimestamp: new Date().toISOString()
        };
      }

      const sorted = [...empEvents].sort((a, b) => new Date(a.joinTime).getTime() - new Date(b.joinTime).getTime());
      const firstJoin = new Date(sorted[0].joinTime);
      const lastLeave = new Date(sorted[sorted.length - 1].leaveTime);

      const totalMinutes = sorted.reduce((sum, item) => sum + item.durationMinutes, 0);
      const totalHours = Math.round((totalMinutes / 60) * 100) / 100;

      const firstActivityStr = firstJoin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const lastActivityStr = lastLeave.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const flags: string[] = [];
      let status: AttendanceRecord['status'] = 'Present';
      let exceptionType: AttendanceRecord['exceptionType'] = 'None';

      if (totalHours < attendanceRules.minimumPartialHoursThreshold) {
        status = 'Partial';
        exceptionType = 'Insufficient Duration';
        flags.push(`Virtual office duration (${totalHours}h) < ${attendanceRules.minimumPartialHoursThreshold}h threshold`);
      } else if (totalHours >= attendanceRules.standardDailyHours) {
        flags.push(`Daily Target Met (${totalHours}h active session)`);
      } else {
        flags.push(`Completed ${totalHours}h active virtual presence`);
      }

      if (empEvents.length > 1) {
        flags.push(`${empEvents.length} Zoom sessions consolidated`);
      }

      return {
        id: `att-${emp.id}-${targetDate}`,
        employeeId: emp.id,
        employeeName: emp.fullName,
        department: emp.department,
        date: targetDate,
        scheduledStart: emp.shiftStartTime,
        scheduledEnd: emp.shiftEndTime,
        firstZoomActivity: firstActivityStr,
        lastZoomActivity: lastActivityStr,
        totalTrackedHours: totalHours,
        meetingCount: empEvents.length,
        status,
        exceptionType: exceptionType !== 'None' ? exceptionType : undefined,
        flags,
        source: 'Zoom Attendance',
        rawMeetingIds: empEvents.map(e => e.meetingId),
        syncTimestamp: new Date().toISOString()
      };
    });

    setAttendanceRecords(updatedRecords);
    logAuditEvent('Attendance', 'Executed Attendance Rules Engine', targetDate);
    showToast('success', 'Rules Engine Processed', `Reconciled ${rawZoomEvents.length} Zoom events across ${allEmployees.length} employee schedules.`);
  };

  const resolveAttendanceException = (recordId: string, notes: string) => {
    setAttendanceRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          status: 'Present',
          exceptionType: 'None',
          hrReviewStatus: 'Resolved',
          hrNotes: notes,
          overriddenBy: currentUser.fullName,
          overriddenAt: new Date().toISOString(),
          flags: [...rec.flags, `HR Exception Resolved: ${notes}`]
        };
      }
      return rec;
    }));
    logAuditEvent('Attendance', 'Resolved Attendance Exception', recordId, undefined, notes);
    showToast('success', 'Exception Resolved', 'Attendance status overridden to Present with HR audit note.');
  };

  const manualOverrideAttendance = (recordId: string, newStatus: AttendanceRecord['status'], notes: string) => {
    setAttendanceRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          status: newStatus,
          hrReviewStatus: 'Resolved',
          hrNotes: notes,
          overriddenBy: currentUser.fullName,
          overriddenAt: new Date().toISOString(),
          flags: [...rec.flags, `Manual Override to ${newStatus}: ${notes}`]
        };
      }
      return rec;
    }));
    logAuditEvent('Attendance', `Manual Status Override to ${newStatus}`, recordId, undefined, notes);
    showToast('success', 'Status Overridden', `Attendance record set to ${newStatus}.`);
  };

  // Wellbeing / Time Off Broadcaster
  const broadcastTimeOff = (data: Omit<TimeOffNotification, 'id' | 'createdAt' | 'status' | 'employeeId' | 'employeeName' | 'department'>) => {
    const newBroadcast: TimeOffNotification = {
      ...data,
      id: `to-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      department: currentUser.department,
      createdAt: new Date().toISOString(),
      status: 'Communicated (No Approval Needed)'
    };

    setTimeOffBroadcasts(prev => [newBroadcast, ...prev]);

    setAllEmployees(prev => prev.map(emp => {
      if (emp.id === currentUser.id) {
        return {
          ...emp,
          annualTimeOffDaysTaken: emp.annualTimeOffDaysTaken + data.totalDays
        };
      }
      return emp;
    }));

    logAuditEvent('Time & Wellbeing', `Broadcasted ${data.totalDays} Days Time-Off`, newBroadcast.id);
    showToast('success', 'Time-Off Broadcasted', `Notice logged: ${data.totalDays} days. Handover colleague: ${data.coverageColleagueName}. No approval required.`);
  };

  // Reimbursements
  const submitReimbursement = (claimData: Omit<ReimbursementClaim, 'id' | 'submittedAt' | 'managerApprovalStatus' | 'financeVerificationStatus' | 'employeeId' | 'employeeName' | 'department'>) => {
    const today = new Date();
    // Pre-payroll cutoff compliance: submitted at least 7 days before month end
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRemainingInMonth = lastDayOfMonth - today.getDate();
    const isCompliant = daysRemainingInMonth >= systemSettings.reimbursementPayrollCutoffDays;

    const newClaim: ReimbursementClaim = {
      ...claimData,
      id: `reimb-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      department: currentUser.department,
      submittedAt: new Date().toISOString(),
      isPrePayrollCompliant: isCompliant,
      managerApprovalStatus: 'Pending',
      financeVerificationStatus: 'Pending'
    };

    setReimbursements(prev => [newClaim, ...prev]);
    logAuditEvent('Reimbursements', `Submitted Claim ${claimData.currency} ${claimData.requestedAmount}`, newClaim.id);
    showToast('success', 'Expense Claim Submitted', `Claim for ${claimData.currency} ${claimData.requestedAmount.toLocaleString()} submitted for manager review.`);
  };

  const approveReimbursementManager = (id: string, approvedAmount: number, notes?: string) => {
    setReimbursements(prev => prev.map(c => {
      if (c.id === id) {
        const excess = Math.max(0, c.requestedAmount - approvedAmount);
        return {
          ...c,
          managerApprovalStatus: 'Approved',
          approvedAmount,
          excessAmountBorneByEmployee: excess,
          approverName: currentUser.fullName,
          notes: notes || c.notes
        };
      }
      return c;
    }));
    logAuditEvent('Reimbursements', `Manager Approved Claim: ${approvedAmount}`, id);
    showToast('success', 'Claim Approved by Manager', 'Forwarded to HR & Finance for payout verification.');
  };

  const verifyReimbursementFinance = (id: string, paidDate?: string) => {
    setReimbursements(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          financeVerificationStatus: 'Paid',
          paidDate: paidDate || new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));
    logAuditEvent('Reimbursements', 'Finance Verified & Disbursed Claim', id);
    showToast('success', 'Finance Verified & Disbursed', 'Claim processed in payroll ledger.');
  };

  const rejectReimbursement = (id: string, notes: string) => {
    setReimbursements(prev => prev.map(c => c.id === id ? { ...c, managerApprovalStatus: 'Rejected', notes } : c));
    logAuditEvent('Reimbursements', 'Rejected Reimbursement Claim', id, undefined, notes);
    showToast('error', 'Claim Rejected', `Expense claim rejected: ${notes}`);
  };

  // Performance Management
  const addGoal = (goalData: Omit<PerformanceGoal, 'id'>) => {
    const newGoal: PerformanceGoal = { ...goalData, id: `goal-${Date.now()}` };
    setPerformanceGoals(prev => [newGoal, ...prev]);
    logAuditEvent('Performance', `Added KRA Goal: ${goalData.kraTitle}`, newGoal.id);
    showToast('success', 'Goal Added', `KRA goal "${goalData.kraTitle}" assigned.`);
  };

  const updateGoalProgress = (id: string, progressPercent: number, status: PerformanceGoal['status']) => {
    setPerformanceGoals(prev => prev.map(g => g.id === id ? { ...g, progressPercent, status } : g));
    logAuditEvent('Performance', `Updated Goal Progress: ${progressPercent}%`, id);
    showToast('info', 'Goal Progress Updated', `Progress set to ${progressPercent}%.`);
  };

  const submitPerformanceReview = (revData: Omit<PerformanceReview, 'id' | 'submittedAt'>) => {
    const newRev: PerformanceReview = {
      ...revData,
      id: `rev-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    setPerformanceReviews(prev => [newRev, ...prev]);
    logAuditEvent('Performance', `Submitted Self-Appraisal Review`, newRev.id);
    showToast('success', 'Self-Review Submitted', 'Performance appraisal forwarded to manager.');
  };

  const completeManagerReview = (id: string, managerRating: number, managerComments: string, finalScore: number) => {
    setPerformanceReviews(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          managerRating,
          managerComments,
          finalScore,
          status: 'Completed',
          completedAt: new Date().toISOString()
        };
      }
      return r;
    }));
    logAuditEvent('Performance', `Completed Manager Appraisal (Score: ${finalScore})`, id);
    showToast('success', 'Appraisal Finalized', `Final performance score ${finalScore}/5.0 recorded.`);
  };

  // Training & Development
  const enrollInTraining = (trainingId: string) => {
    const training = trainingModules.find(t => t.id === trainingId);
    if (!training) return;

    const existing = trainingEnrollments.find(e => e.trainingId === trainingId && e.employeeId === currentUser.id);
    if (existing) {
      showToast('info', 'Already Enrolled', 'You are already registered for this advisory module.');
      return;
    }

    const newEnr: TrainingEnrollment = {
      id: `enr-${Date.now()}`,
      trainingId,
      trainingTitle: training.title,
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      progressPercent: 0,
      status: 'Enrolled'
    };

    setTrainingEnrollments(prev => [newEnr, ...prev]);
    logAuditEvent('Training', `Enrolled in ${training.title}`, trainingId);
    showToast('success', 'Enrollment Confirmed', `Enrolled in "${training.title}".`);
  };

  const updateTrainingProgress = (enrollmentId: string, progress: number) => {
    setTrainingEnrollments(prev => prev.map(e => {
      if (e.id === enrollmentId) {
        const isCompleted = progress >= 100;
        return {
          ...e,
          progressPercent: progress,
          status: isCompleted ? 'Completed' : 'In Progress',
          completedDate: isCompleted ? new Date().toISOString().split('T')[0] : e.completedDate,
          certificateId: isCompleted ? `CERT-VRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : e.certificateId
        };
      }
      return e;
    }));
    logAuditEvent('Training', `Updated Training Progress: ${progress}%`, enrollmentId);
    showToast('info', 'Progress Saved', `Training module progress updated to ${progress}%.`);
  };

  // Confidential Cases & POSH
  const fileConfidentialCase = (caseData: Omit<ConfidentialCase, 'id' | 'ticketNumber' | 'filedAt' | 'status' | 'assignedHrName' | 'confidentialNotes'>) => {
    const isPosh = caseData.category === 'POSH (Sexual Harassment)';
    const prefix = isPosh ? 'VRV-POSH' : 'VRV-CONF';
    const ticketNumber = `${prefix}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newCase: ConfidentialCase = {
      ...caseData,
      id: `case-${Date.now()}`,
      ticketNumber,
      reporterEmployeeId: caseData.isAnonymous ? undefined : currentUser.id,
      reporterName: caseData.isAnonymous ? undefined : currentUser.fullName,
      filedAt: new Date().toISOString(),
      status: 'Open',
      assignedHrName: isPosh ? systemSettings.poshCommitteeLeadName : 'Kavita Deshmukh (Head of HR)',
      confidentialNotes: ['Case received under restricted access protocol.']
    };

    setConfidentialCases(prev => [newCase, ...prev]);
    logAuditEvent('HR Cases', `Filed Confidential Grievance: ${ticketNumber}`, newCase.id);
    showToast('success', 'Confidential Grievance Logged', `Case ID ${ticketNumber} encrypted and forwarded to Complaints Committee.`);
    return ticketNumber;
  };

  const updateCaseStatus = (id: string, status: ConfidentialCase['status'], note: string) => {
    setConfidentialCases(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          confidentialNotes: [...c.confidentialNotes, `${new Date().toLocaleDateString()}: ${note}`],
          resolvedAt: (status === 'Resolved' || status === 'Closed') ? new Date().toISOString() : c.resolvedAt
        };
      }
      return c;
    }));
    logAuditEvent('HR Cases', `Updated Case Status: ${status}`, id);
    showToast('info', 'Case Status Updated', `Status changed to: ${status}`);
  };

  // HR Requests
  const submitHrRequest = (reqData: Omit<HrRequest, 'id' | 'submittedAt' | 'status' | 'employeeId' | 'employeeName' | 'department'>) => {
    const newReq: HrRequest = {
      ...reqData,
      id: `hr-req-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      department: currentUser.department,
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
      assignedHrName: 'Kavita Deshmukh'
    };
    setHrRequests(prev => [newReq, ...prev]);
    logAuditEvent('HR Cases', `Submitted HR Request: ${reqData.requestType}`, newReq.id);
    showToast('success', 'HR Request Submitted', `Request for "${reqData.requestType}" dispatched to People team.`);
  };

  const updateHrRequestStatus = (id: string, status: HrRequest['status'], resolutionNotes?: string) => {
    setHrRequests(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          resolutionNotes: resolutionNotes || r.resolutionNotes,
          resolvedAt: status === 'Completed' ? new Date().toISOString() : r.resolvedAt,
          attachmentFileName: status === 'Completed' ? `Verve_Official_${r.requestType.replace(/\s+/g, '_')}.pdf` : r.attachmentFileName
        };
      }
      return r;
    }));
    logAuditEvent('HR Cases', `Updated HR Request Status: ${status}`, id);
    showToast('info', 'Request Updated', `HR request marked as ${status}.`);
  };

  // Separation & Offboarding
  const submitResignation = (lastWorkingDayNotes?: string, waiverRequested: boolean = false) => {
    const isManagerial = ['Manager', 'Associate Director', 'Partner'].includes(currentUser.level);
    const noticeDays = isManagerial ? systemSettings.defaultNoticePeriodManagerial : systemSettings.defaultNoticePeriodNonManagerial;
    
    const today = new Date();
    const lwdDate = new Date(today);
    lwdDate.setDate(lwdDate.getDate() + noticeDays);
    const lastWorkingDay = lwdDate.toISOString().split('T')[0];

    const fnfDate = new Date(lwdDate);
    fnfDate.setDate(fnfDate.getDate() + 10);
    const fnfDeadlineDate = fnfDate.toISOString().split('T')[0];

    const newOffboarding: OffboardingRecord = {
      id: `off-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      designation: currentUser.designation,
      department: currentUser.department,
      level: currentUser.level,
      separationType: 'Resignation',
      resignationDate: today.toISOString().split('T')[0],
      mandatoryNoticeDays: noticeDays,
      lastWorkingDay,
      waiverRequested,
      waiverApprovedByManagementAndHR: false,
      waiverNotes: lastWorkingDayNotes,
      handoverCompleted: false,
      handoverAssigneeName: currentUser.reportingManagerName,
      noDuesStatus: {
        itAssetsRevoked: false,
        financeAndClaimsCleared: false,
        managerKnowledgeHandover: false,
        hrExitInterviewCompleted: false,
        adminAccessTerminated: false
      },
      fnfDeadlineDate,
      fnfStatus: 'Pending Clearance',
      relievingLetterIssued: false,
      experienceLetterIssued: false
    };

    setOffboardingRecords(prev => [newOffboarding, ...prev]);

    setAllEmployees(prev => prev.map(emp => {
      if (emp.id === currentUser.id) {
        return { ...emp, employmentStatus: 'Notice Period' };
      }
      return emp;
    }));

    logAuditEvent('Offboarding', `Submitted Resignation (${noticeDays}d notice)`, newOffboarding.id);
    showToast('warning', 'Resignation Submitted', `Mandatory notice period of ${noticeDays} days initiated.`);
  };

  const updateNoDuesClearance = (recordId: string, field: keyof OffboardingRecord['noDuesStatus'], value: boolean) => {
    setOffboardingRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        const updatedNoDues = { ...r.noDuesStatus, [field]: value };
        const allCleared = Object.values(updatedNoDues).every(v => v === true);
        return {
          ...r,
          noDuesStatus: updatedNoDues,
          fnfStatus: allCleared ? 'Calculated' : r.fnfStatus
        };
      }
      return r;
    }));
    logAuditEvent('Offboarding', `Updated No-Dues Clearance: ${field}`, recordId);
    showToast('success', 'Clearance Updated', `No Dues parameter "${field}" updated.`);
  };

  const markFnfDisbursed = (recordId: string) => {
    setOffboardingRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          fnfStatus: 'Disbursed',
          relievingLetterIssued: true,
          experienceLetterIssued: true
        };
      }
      return r;
    }));
    logAuditEvent('Offboarding', 'Disbursed Full & Final Settlement', recordId);
    showToast('success', 'F&F Disbursed', 'Full & Final settlement completed within 10-day policy window.');
  };

  const issueRelievingLetter = (recordId: string) => {
    setOffboardingRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          relievingLetterIssued: true,
          experienceLetterIssued: true
        };
      }
      return r;
    }));
    logAuditEvent('Offboarding', 'Issued Relieving & Experience Documents', recordId);
    showToast('success', 'Documents Issued', 'Official Relieving and Experience letters generated.');
  };

  // Integrations
  const toggleIntegrationMode = (serviceName: IntegrationConfig['serviceName']) => {
    setIntegrationConfigs(prev => prev.map(cfg => {
      if (cfg.serviceName === serviceName) {
        const newMode = cfg.mode === 'MOCK' ? 'LIVE' : 'MOCK';
        return { ...cfg, mode: newMode };
      }
      return cfg;
    }));
    logAuditEvent('Integrations', `Toggled Integration Mode for ${serviceName}`);
    showToast('info', 'Integration Mode Toggled', `${serviceName} mode changed.`);
  };

  const triggerManualSync = (serviceName: IntegrationConfig['serviceName']) => {
    const timestamp = new Date().toISOString();
    setIntegrationConfigs(prev => prev.map(cfg => {
      if (cfg.serviceName === serviceName) {
        return {
          ...cfg,
          lastSuccessfulSync: timestamp,
          totalSyncedEvents: cfg.totalSyncedEvents + 12
        };
      }
      return cfg;
    }));

    if (serviceName === 'Zoom') {
      runAttendanceRulesEngine();
      setZoomSyncLogs(prev => [
        {
          id: `sync-${Date.now()}`,
          timestamp,
          eventsReceived: 12,
          matchedEmployees: allEmployees.length,
          exceptionsDetected: 1,
          durationMs: 210,
          status: 'Success',
          message: 'Manual sync completed via Zoom OAuth Pipeline.'
        },
        ...prev
      ]);
    }

    logAuditEvent('Integrations', `Triggered Manual Sync: ${serviceName}`);
    showToast('success', 'Sync Completed', `${serviceName} synchronized successfully.`);
  };

  // System Settings
  const updateSystemSettings = (partial: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...partial }));
    logAuditEvent('Settings', 'Updated System Configuration', undefined, undefined, JSON.stringify(partial));
    showToast('success', 'Settings Saved', 'Organization and policy settings updated.');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('info', 'Notifications Marked Read', 'All alerts cleared.');
  };

  // CSV Export Utility
  const exportDataToCsv = (filename: string, rows: Record<string, any>[]) => {
    if (!rows || rows.length === 0) {
      showToast('warning', 'No Data', 'No records available to export.');
      return;
    }

    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        headers.map(header => {
          const val = row[header];
          if (val === null || val === undefined) return '""';
          const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('success', 'Export Complete', `Downloaded ${filename}.csv`);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        authSessionInfo,
        login,
        loginAsPersona,
        logout,
        hasRoleAccess,
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        switchRoleAccount,
        allEmployees,
        addEmployee,
        updateEmployee,
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isNotificationDropdownOpen,
        setIsNotificationDropdownOpen,
        onboardingStep,
        setOnboardingStep,
        completeCurrentOnboardingStep,
        updateCurrentUserProfile,
        policies,
        acknowledgments,
        acknowledgePolicy,
        isPolicyAcknowledged,
        addPolicy,
        updatePolicy,
        deletePolicy,
        documents,
        uploadDocument,
        verifyDocument,
        rawZoomEvents,
        attendanceRecords,
        attendanceRules,
        setAttendanceRules,
        addRawZoomEvent,
        runAttendanceRulesEngine,
        resolveAttendanceException,
        manualOverrideAttendance,
        timeOffBroadcasts,
        broadcastTimeOff,
        reimbursements,
        submitReimbursement,
        approveReimbursementManager,
        verifyReimbursementFinance,
        rejectReimbursement,
        performanceGoals,
        performanceReviews,
        addGoal,
        updateGoalProgress,
        submitPerformanceReview,
        completeManagerReview,
        trainingModules,
        trainingEnrollments,
        enrollInTraining,
        updateTrainingProgress,
        confidentialCases,
        fileConfidentialCase,
        updateCaseStatus,
        hrRequests,
        submitHrRequest,
        updateHrRequestStatus,
        offboardingRecords,
        submitResignation,
        updateNoDuesClearance,
        markFnfDisbursed,
        issueRelievingLetter,
        integrationConfigs,
        toggleIntegrationMode,
        triggerManualSync,
        zoomSyncLogs,
        auditLogs,
        logAuditEvent,
        systemSettings,
        updateSystemSettings,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        toasts,
        showToast,
        dismissToast,
        removeToast: dismissToast,
        exportDataToCsv
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
