export type Role = 'super_admin' | 'hr_admin' | 'manager' | 'employee';

export type Department = 
  | 'Valuations & Financial Modeling'
  | 'Corporate Advisory'
  | 'M&A Advisory'
  | 'Tax & Regulatory'
  | 'Strategy & Operations'
  | 'People & Culture';

export type EmployeeLevel = 
  | 'Associate' 
  | 'Senior Associate' 
  | 'Consultant' 
  | 'Manager' 
  | 'Associate Director' 
  | 'Partner';

export interface Employee {
  id: string;
  employeeCode: string; // e.g. VER-2026-042
  fullName: string;
  avatarUrl: string;
  role: Role; // Explicitly linked system role & privilege scope
  personalEmail: string;
  companyEmail: string;
  phone: string;
  dateOfBirth: string;
  dateOfJoining: string;
  department: Department;
  designation: string;
  level: EmployeeLevel;
  reportingManagerId: string;
  reportingManagerName: string;
  employmentType: 'Full-Time' | 'Retainer / Contractor' | 'Intern';
  employmentStatus: 'Pre-boarding' | 'Onboarding' | 'Probation' | 'Confirmed' | 'Notice Period' | 'Exited';
  workLocation: 'Virtual Office (Remote)' | 'Mumbai HQ' | 'Bengaluru Practice' | 'Delhi NCR Client Office';
  workScheduleType: 'Standard (Mon-Sat, 48h)' | 'Alternate (Sat-Thu, 48h)' | 'Client Shift (US East)' | 'Client Shift (UK/EU)';
  shiftStartTime: string; // "09:00"
  shiftEndTime: string;   // "18:00"
  timeZone: string;       // "IST (UTC+5:30)"
  
  // Probation
  probationStatus: 'In Progress' | 'Confirmed' | 'Extended';
  probationEndDate: string; // YYYY-MM-DD

  // Zoom Mapping Keys (Critical for integration)
  zoomEmail: string;
  zoomUserId: string;
  zoomPersonalRoomUrl?: string;

  // Emergency contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };

  // Onboarding progress
  onboardingCompleted: boolean;
  onboardingStep: number;

  // Wellbeing / Time off (No-Leave policy)
  annualTimeOffDaysTaken: number;
  mandatoryAnnualTimeOffTarget: number; // 18 days
}

export interface Policy {
  id: string;
  title: string;
  category: 'Virtual Office' | 'Time & Wellbeing' | 'Code of Conduct' | 'Security & IP' | 'Governance' | 'Separation';
  version: string;
  effectiveDate: string;
  status: 'Active' | 'Draft' | 'Archived';
  summary: string;
  fullText: string[];
  keyHighlights: string[];
  requiresComprehensionCheck?: boolean;
  comprehensionQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export interface PolicyAcknowledgment {
  id: string;
  policyId: string;
  policyVersion: string;
  employeeId: string;
  employeeName: string;
  acknowledgedAt: string;
  signatureName: string;
  ipAddress: string;
  deviceInfo: string;
}

export interface ZoomMeetingRawEvent {
  id: string;
  meetingId: string;
  meetingUuid: string;
  meetingTopic: string;
  participantName: string;
  participantEmail: string;
  participantZoomId: string;
  joinTime: string; // ISO
  leaveTime: string; // ISO
  durationMinutes: number;
  syncedAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  date: string; // YYYY-MM-DD
  scheduledStart: string;
  scheduledEnd: string;
  firstZoomActivity: string; // e.g. "09:04 AM"
  lastZoomActivity: string;  // e.g. "06:02 PM"
  totalTrackedHours: number;
  meetingCount: number;
  status: 'Present' | 'Partial' | 'Missing' | 'Weekly Off' | 'Holiday' | 'Exception' | 'Time Off';
  exceptionType?: 'None' | 'Late Join' | 'Early Leave' | 'Missing Zoom Activity' | 'Insufficient Duration' | 'Unmatched Zoom User';
  flags: string[];
  source: 'Zoom Attendance';
  rawMeetingIds: string[];
  hrReviewStatus?: 'Pending' | 'Approved' | 'Resolved';
  hrNotes?: string;
  overriddenBy?: string;
  overriddenAt?: string;
  syncTimestamp: string;
}

export interface AttendanceRuleConfig {
  standardDailyHours: number; // default 8
  weeklyWorkHours: number;    // default 48
  lateJoinThresholdMinutes: number; // default 15
  earlyLeaveThresholdMinutes: number; // default 15
  minimumPartialHoursThreshold: number; // default 4.0
  autoFlagMissingZoomAfterHours: number; // default 18:30
}

export interface TimeOffNotification {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  startDate: string;
  endDate: string;
  totalDays: number;
  reasonCategory: 'Vacation & Rest' | 'Personal / Family' | 'Health & Recovery' | 'Emergency';
  coveragePlan: string;
  coverageColleagueName: string;
  notifiedManager: boolean;
  notifiedTeam: boolean;
  createdAt: string;
  status: 'Communicated (No Approval Needed)';
}

export interface ReimbursementClaim {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  category: 
    | 'Business Travel' 
    | 'Accommodation' 
    | 'Client Meals' 
    | 'Seminars'
    | 'Webinars' 
    | 'Courses'
    | 'Postage'
    | 'Courier' 
    | 'Client Entertainment'
    | 'Other Business Expense';
  expenseDate: string;
  requestedAmount: number;
  currency: string;
  description: string;
  receiptName: string;
  submittedAt: string;
  isPrePayrollCompliant: boolean; // Submitted >= 7 days before payroll
  managerApprovalStatus: 'Pending' | 'Approved' | 'Rejected';
  approvedAmount?: number;
  financeVerificationStatus: 'Pending' | 'Verified' | 'Paid';
  paidDate?: string;
  approverName?: string;
  excessAmountBorneByEmployee?: number;
  notes?: string;
}

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  kraTitle: string;
  kpiMetrics: string;
  targetDate: string;
  weightagePercent: number;
  progressPercent: number;
  status: 'On Track' | 'At Risk' | 'Completed' | 'Deferred';
  cycle: 'Q1 2026' | 'Q2 2026' | 'Q3 2026' | 'Probation (30-60-90)';
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  cycle: string;
  selfRating: number; // 1 to 5
  selfComments: string;
  managerRating: number; // 1 to 5
  managerComments: string;
  finalScore: number; // 1 to 5
  status: 'Draft' | 'Self Review Submitted' | 'Manager Reviewed' | 'Completed';
  submittedAt: string;
  completedAt?: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  category: 'Virtual Office & Culture' | 'Valuation & Modeling' | 'Compliance & POSH' | 'Client Advisory Excellence';
  trainer: string;
  date: string;
  durationHours: number;
  mandatoryFor: string[]; // levels or 'All'
  status: 'Active' | 'Upcoming' | 'Completed';
  description: string;
}

export interface TrainingEnrollment {
  id: string;
  trainingId: string;
  trainingTitle: string;
  employeeId: string;
  employeeName: string;
  progressPercent: number;
  status: 'Enrolled' | 'In Progress' | 'Completed';
  completedDate?: string;
  certificateId?: string;
}

export interface ConfidentialCase {
  id: string;
  ticketNumber: string;
  category: 
    | 'POSH (Sexual Harassment)' 
    | 'Employee Grievance'
    | 'Discrimination' 
    | 'Retaliation' 
    | 'Policy Violation'
    | 'Attendance Issue'
    | 'Performance Issue'
    | 'Disciplinary Matter'
    | 'Other';
  priority: 'High' | 'Critical' | 'Medium' | 'Low';
  isAnonymous: boolean;
  isPoshRestricted: boolean; // Accessible ONLY by POSH committee & super admin
  reporterEmployeeId?: string;
  reporterName?: string;
  incidentDate: string;
  locationContext: 'Virtual Office / Zoom Call' | 'Client Communication' | 'In-Person Event' | 'Internal Messaging';
  description: string;
  witnessesOrEvidence?: string;
  status: 'Open' | 'Under Review' | 'Investigation' | 'Action Required' | 'Resolved' | 'Closed';
  assignedHrName: string;
  confidentialNotes: string[];
  filedAt: string;
  resolvedAt?: string;
}

export interface DocumentRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  documentName: string;
  category: 'Identity' | 'Employment' | 'Joining' | 'Policy' | 'Performance' | 'Training' | 'Reimbursement' | 'Exit';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  uploadedBy: string;
  accessLevel: 'Employee' | 'Manager' | 'HR' | 'Admin';
  status: 'Verified' | 'Pending Verification' | 'Rejected';
}

export interface HrRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  requestType: 'Employment Letter' | 'Experience Letter' | 'Document Request' | 'Salary Certificate' | 'Profile Update' | 'HR Query' | 'Other Request';
  subject: string;
  description: string;
  urgency: 'Low' | 'Standard' | 'Urgent';
  status: 'Submitted' | 'In Processing' | 'Completed' | 'Rejected';
  assignedHrName?: string;
  submittedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  attachmentFileName?: string;
}

export interface OffboardingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: Department;
  level: EmployeeLevel;
  separationType: 'Resignation' | 'Mutual Separation' | 'Contract End' | 'Termination';
  resignationDate: string;
  mandatoryNoticeDays: number; // 60 for non-managerial, 90 for managerial+
  lastWorkingDay: string;
  waiverRequested: boolean;
  waiverApprovedByManagementAndHR: boolean;
  waiverNotes?: string;
  
  // Handover checklist
  handoverCompleted: boolean;
  handoverAssigneeName: string;

  // No Dues Clearance Checklist
  noDuesStatus: {
    itAssetsRevoked: boolean;
    financeAndClaimsCleared: boolean;
    managerKnowledgeHandover: boolean;
    hrExitInterviewCompleted: boolean;
    adminAccessTerminated: boolean;
  };
  
  // 10-day F&F settlement
  fnfDeadlineDate: string; // 10 days after last working day
  fnfStatus: 'Pending Clearance' | 'Calculated' | 'Disbursed';
  relievingLetterIssued: boolean;
  experienceLetterIssued: boolean;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  userName: string;
  userRole: Role;
  module: 
    | 'Authentication' 
    | 'Employee Master' 
    | 'Onboarding' 
    | 'Attendance' 
    | 'Time & Wellbeing'
    | 'Policies' 
    | 'Reimbursements' 
    | 'Performance' 
    | 'Training' 
    | 'HR Cases' 
    | 'Documents' 
    | 'Offboarding' 
    | 'Integrations' 
    | 'Settings';
  action: string;
  recordId?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress: string;
}

export interface IntegrationConfig {
  id: string;
  serviceName: 'Zoom' | 'Zoho People' | 'ClickUp' | 'Google Workspace' | 'Payroll API' | 'Email SMTP';
  mode: 'MOCK' | 'LIVE';
  status: 'Connected' | 'Disconnected' | 'Sync Error' | 'Configured';
  lastSuccessfulSync?: string;
  lastFailedSync?: string;
  syncFrequency: 'Every 15 Minutes' | 'Hourly' | 'Twice Daily' | 'Daily (Midnight)' | 'Manual Only';
  errorMessage?: string;
  clientId?: string;
  accountEmail?: string;
  totalSyncedEvents: number;
}

export interface ZoomSyncLog {
  id: string;
  timestamp: string;
  eventsReceived: number;
  matchedEmployees: number;
  exceptionsDetected: number;
  durationMs: number;
  status: 'Success' | 'Partial' | 'Failed';
  message: string;
}

export interface SystemSettings {
  organizationName: string;
  tagline: string;
  standardWorkWeekHours: number; // 48
  standardWorkDays: string; // "Monday - Saturday"
  defaultNoticePeriodNonManagerial: number; // 60
  defaultNoticePeriodManagerial: number; // 90
  reimbursementPayrollCutoffDays: number; // 7
  mandatoryAnnualRestDays: number; // 18
  poshCommitteeLeadName: string;
  poshCommitteeLeadEmail: string;
  supportEmail: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface NotificationItem {
  id: string;
  targetRoles: Role[];
  targetEmployeeId?: string;
  title: string;
  message: string;
  category: 'Attendance' | 'Policy' | 'Reimbursement' | 'Performance' | 'Onboarding' | 'Case' | 'System';
  timestamp: string;
  read: boolean;
  actionTab?: string;
}

export type TimeOffBroadcast = TimeOffNotification;
export type TimeOffType = TimeOffNotification['reasonCategory'] | string;
export type ReimbursementCategory = ReimbursementClaim['category'] | string;
export type GoalStatus = PerformanceGoal['status'];
export type CaseCategory = ConfidentialCase['category'];
export type CaseStatus = ConfidentialCase['status'];
export type DocumentCategory = DocumentRecord['category'] | string;
export type RequestType = HrRequest['requestType'];
export type RequestStatus = HrRequest['status'];
