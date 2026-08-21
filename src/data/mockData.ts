import { 
  Employee, 
  Policy, 
  ZoomMeetingRawEvent, 
  AttendanceRecord, 
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
  NotificationItem
} from '../types';

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  organizationName: 'Verve Advisory',
  tagline: 'Premier Strategic & Financial Advisory Services',
  standardWorkWeekHours: 48,
  standardWorkDays: 'Monday – Saturday',
  defaultNoticePeriodNonManagerial: 60,
  defaultNoticePeriodManagerial: 90,
  reimbursementPayrollCutoffDays: 7,
  mandatoryAnnualRestDays: 18,
  poshCommitteeLeadName: 'Dr. Radhika Kulkarni',
  poshCommitteeLeadEmail: 'posh.chair@verveadvisory.com',
  supportEmail: 'people@verveadvisory.com'
};

export const INITIAL_POLICIES: Policy[] = [
  {
    id: 'pol-no-leave',
    title: 'No-Leave Policy & 18-Day Annual Wellbeing Mandate',
    category: 'Time & Wellbeing',
    version: 'v2.4',
    effectiveDate: '2026-01-01',
    status: 'Active',
    summary: 'Verve operates on a high-trust No-Leave model. There are no depleting leave balances or manager approval gatekeepers. However, taking at least 18 days of rest per year is mandatory to prevent burnout.',
    keyHighlights: [
      'No leave balances or ledger maintained in HRMS.',
      'Manager approval is NOT required for planned time off.',
      'Employees must broadcast planned absences at least 48 hours in advance to their team and designated coverage colleague.',
      'MANDATORY: Minimum 18 days of time off must be taken annually for health, family, and rest.',
      'Employees hold full accountability for client deliverable continuity.'
    ],
    fullText: [
      '1. Philosophy: Verve Advisory operates on personal accountability, high trust, and output-oriented advisory excellence. We believe professionals perform at their best when empowered to govern their own recovery schedules.',
      '2. Advance Communication: Planned absences must be submitted in the Verve Portal at least 48 hours in advance (or as early as feasible for sudden medical emergencies). Include the designated colleague managing client files.',
      '3. Mandatory 18-Day Minimum Rest: To guard against cognitive fatigue in demanding valuation and M&A mandates, every full-time consultant must take at least 18 rest days per calendar year. HR monitors this for burnout prevention.',
      '4. Client Continuity: The employee is responsible for completing scheduled briefings with coverage colleagues prior to departure.'
    ],
    requiresComprehensionCheck: true,
    comprehensionQuestion: {
      question: 'Under Verve Advisory’s No-Leave Policy, what is the mandatory minimum number of rest days you MUST take annually?',
      options: ['0 days (resting is optional)', '10 days', '18 days', '30 days'],
      correctIndex: 2
    }
  },
  {
    id: 'pol-virtual-office',
    title: 'Virtual Office Etiquette & Video Presence Policy',
    category: 'Virtual Office',
    version: 'v3.1',
    effectiveDate: '2026-01-01',
    status: 'Active',
    summary: 'Our primary workspace is the Zoom Virtual Office. Video cameras must remain active during scheduled work hours to maintain collaborative advisory engagement, with breaks allowed for meals and focus blocks.',
    keyHighlights: [
      'Video cameras must remain ON while logged into the Zoom Virtual Office.',
      'Camera framing: eye-level, well-lit background, no distracting movements.',
      'Audio muted by default; noise-canceling headsets required.',
      'Exceptions permitted for scheduled lunch/dinner breaks and designated deep-work offline focus blocks.'
    ],
    fullText: [
      '1. Zoom as the Corporate Office: Logging into our designated Zoom room constitutes entering the Verve Advisory workspace. Real-time availability and presence simulate an in-person bullpen environment.',
      '2. Camera Presence: Video presence is fundamental to team cohesion, transparent collaboration, and mentorship. Cameras must be on during working hours.',
      '3. Break Protocol: Video may be toggled off during lunch (13:00 - 14:00) and dinner (19:00 - 19:30) or during pre-approved offline modeling sprints.'
    ],
    requiresComprehensionCheck: true,
    comprehensionQuestion: {
      question: 'When is turning off your video camera allowed during the working day?',
      options: ['Whenever you want without notice', 'Only during lunch/dinner breaks or pre-scheduled focus blocks', 'Never under any circumstances', 'Only on alternate Saturdays'],
      correctIndex: 1
    }
  },
  {
    id: 'pol-schedule-48h',
    title: '48-Hour Work Week & Virtual Attendance Matrix',
    category: 'Virtual Office',
    version: 'v2.0',
    effectiveDate: '2026-01-01',
    status: 'Active',
    summary: 'Verve Advisory operates on a standard 48-hour work week (Monday through Saturday, 8 hours/day). Attendance is automatically captured via Zoom session telemetry.',
    keyHighlights: [
      'Standard Schedule: Monday to Saturday, 48 hours total per week.',
      'Standard Shift: 09:30 AM to 06:30 PM (includes 1 hour cumulative meal/rest breaks).',
      'Automated reconciliation: Zoom join/leave webhooks match scheduled shifts with a 15-minute grace threshold.',
      'Attendance under 4.0 hours per day is classified as Partial and requires an HR audit note.'
    ],
    fullText: [
      '1. Operational Cadence: To maintain responsive advisory bandwidth for transaction mandates, standard work consists of 48 hours distributed Monday through Saturday.',
      '2. Ingestion Pipeline: Attendance is recorded without manual punch-ins. Zoom session logs stream into the Verve Attendance Engine.',
      '3. Exceptions: First activity after 09:45 AM is flagged as Late Join. Missing Zoom logs for scheduled days prompt an automated inquiry.'
    ],
    requiresComprehensionCheck: true,
    comprehensionQuestion: {
      question: 'What is the standard work week duration at Verve Advisory?',
      options: ['35 hours (Mon-Fri)', '40 hours (Mon-Fri)', '48 hours (Mon-Sat)', '56 hours (Mon-Sun)'],
      correctIndex: 2
    }
  },
  {
    id: 'pol-attire',
    title: 'Workplace Attire & Professional Grooming Policy',
    category: 'Code of Conduct',
    version: 'v1.8',
    effectiveDate: '2026-01-01',
    status: 'Active',
    summary: 'Comfortable, smart-casual attire is permitted for internal Zoom virtual office hours. Formal business attire is mandatory for all client-facing interactions and pitch presentations.',
    keyHighlights: [
      'Internal Virtual Office: Smart casual, neat, professional appearance on camera.',
      'Client Engagements: Formal business attire (collared shirts, blazers, formal Indian/Western attire) is strictly required.',
      'Professional backdrop or Verve Advisory branded virtual background required for client calls.'
    ],
    fullText: [
      '1. Internal Sessions: Employees may wear clean, neat smart-casual apparel.',
      '2. Client Interactions: When meeting private equity sponsors, corporate promoters, or board members, strict business formal attire is required.',
      '3. Video Setup: Ensure neutral, clutter-free backgrounds or use the approved Verve branded background.'
    ]
  },
  {
    id: 'pol-posh',
    title: 'POSH (Prevention of Sexual Harassment) & Zero Tolerance Policy',
    category: 'Governance',
    version: 'v4.0',
    effectiveDate: '2026-01-01',
    status: 'Active',
    summary: 'Verve Advisory upholds a strict zero-tolerance policy against sexual harassment across all virtual workspaces (Zoom, Slack, email) and physical client settings. An independent Internal Complaints Committee oversees all cases.',
    keyHighlights: [
      'Applies equally to virtual communications, video calls, direct messages, and client events.',
      'Zero-tolerance: Any substantiated harassment leads to summary termination and statutory escalation.',
      'Internal Complaints Committee (ICC) led by an external independent presiding officer.',
      'Complete confidentiality and anti-retaliation protections guaranteed for all reporting persons.'
    ],
    fullText: [
      '1. Scope: Verve is committed to creating a secure, respectful, and harassment-free workplace for every individual.',
      '2. Virtual Harassment Definitions: Inappropriate remarks regarding appearance, unsolicited personal messages, displaying improper virtual backgrounds, or non-consensual recordings are actionable violations.',
      '3. ICC Inquiries: Complaints submitted via the Confidential Portal are encrypted and routed exclusively to the Presiding Officer. Investigations conclude within statutory timelines.'
    ],
    requiresComprehensionCheck: true,
    comprehensionQuestion: {
      question: 'Does the POSH policy cover virtual interactions on Zoom and team chats?',
      options: ['No, only physical offices', 'Yes, it applies fully to all virtual and digital interactions', 'Only if external clients are in the call', 'Only after regular business hours'],
      correctIndex: 1
    }
  },
  {
    id: 'pol-reimbursement',
    title: 'Expense Reimbursement & 7-Day Pre-Payroll Cutoff Policy',
    category: 'Governance',
    version: 'v2.2',
    effectiveDate: '2026-01-01',
    status: 'Active',
    summary: 'All legitimate business expenses (travel, client meals, certifications, courier) are reimbursed upon manager and finance approval. Claims must be submitted at least 7 days before monthly payroll processing.',
    keyHighlights: [
      'Eligible Categories: Travel, Lodging, Client Meals, Professional Certifications, Courier.',
      'Cutoff Rule: Claims submitted less than 7 days prior to payroll will be deferred to the subsequent cycle.',
      'Receipts & Tax Invoices: Itemized tax invoices with GSTIN mandatory for all claims exceeding ₹500.',
      'Expense caps: Any amount exceeding policy caps approved by managers is borne by the employee.'
    ],
    fullText: [
      '1. Permissible Expenses: Travel, accommodation, client hospitality, and professional advisory courses (e.g. CFA, Financial Modeling) are eligible for reimbursement.',
      '2. Approval Workflow: Employee submits claim with receipt -> Manager verifies business purpose and caps -> Finance reviews tax compliance -> Disbursed with monthly payroll.',
      '3. Cutoff: Submissions must be finalized at least 7 calendar days before month-end payroll calculation.'
    ],
    requiresComprehensionCheck: true,
    comprehensionQuestion: {
      question: 'What is the cutoff deadline for submitting reimbursement claims to ensure payout in the current month?',
      options: ['On the last day of the month', 'At least 7 days prior to payroll processing', 'Within 24 hours of incurring the expense', 'Whenever the manager remembers'],
      correctIndex: 1
    }
  },
  {
    id: 'pol-separation',
    title: 'Separation, Notice Period & 10-Day F&F Settlement Policy',
    category: 'Separation',
    version: 'v3.0',
    effectiveDate: '2026-01-01',
    status: 'Active',
    summary: 'Separation timelines are 60 days for non-managerial grades and 90 days for managerial/leadership grades. Full & Final settlement is completed within 10 days of the verified Last Working Day following multi-department No Dues clearance.',
    keyHighlights: [
      'Notice Period: 60 calendar days (Associate / Senior Associate / Consultant) | 90 calendar days (Manager and above).',
      'Notice waivers require joint sign-off from Practice Partner and HR Head.',
      'Mandatory 5-Department No Dues clearance (IT, Finance, Knowledge Transfer, HR, Admin).',
      'F&F Settlement: Disbursed strictly within 10 calendar days post-LWD once clearance is completed.',
      'Digital Relieving & Experience Letters generated upon final settlement.'
    ],
    fullText: [
      '1. Resignation Submission: Written resignation must be logged via the Verve HRMS Portal with copy to direct supervisor.',
      '2. Notice Period: 60 days for non-managerial consultants; 90 days for Manager, Associate Director, and Partner grades to ensure seamless client advisory transition.',
      '3. Clearance: Complete handover of financial models, advisory files, and access credentials must be certified by department leads.',
      '4. Settlement: All pending salary, approved reimbursements, and gratuity/tax adjustments are settled within 10 calendar days of LWD.'
    ]
  },
  {
    id: 'pol-ip-security',
    title: 'Intellectual Property, Confidentiality & Remote Data Security',
    category: 'Security & IP',
    version: 'v2.5',
    effectiveDate: '2026-01-01',
    status: 'Active',
    summary: 'Strict safeguarding of market-sensitive client data, M&A deal pipelines, and Verve valuation frameworks. Mandatory 2FA and prohibition of unencrypted data sharing.',
    keyHighlights: [
      'All advisory models, pitches, templates, and spreadsheets are the sole intellectual property of Verve Advisory.',
      'Strict prohibition of downloading confidential client files to personal non-managed devices.',
      'Mandatory 2-Factor Authentication (2FA) across Zoom, Google Workspace, Zoho, and ClickUp.',
      'Remote desktop screen locking after 3 minutes of inactivity.'
    ],
    fullText: [
      '1. Confidentiality Obligations: All consultants are bound by strict non-disclosure obligations regarding material non-public financial information.',
      '2. System Security: Use only encrypted Verve VPN connections when accessing client virtual data rooms (VDRs).',
      '3. IP Ownership: Any models, valuation scripts, or templates developed during employment belong exclusively to Verve Advisory.'
    ]
  },
  {
    id: 'pol-equal-opportunity',
    title: 'Equal Opportunity, Diversity & Anti-Discrimination Policy',
    category: 'Code of Conduct',
    version: 'v1.5',
    effectiveDate: '2026-01-01',
    status: 'Active',
    summary: 'Verve Advisory provides equal employment opportunities regardless of gender, caste, religion, sexual orientation, disability, or marital status.',
    keyHighlights: [
      'Zero discrimination in hiring, compensation, promotion, and project assignments.',
      'Merit-based performance appraisals evaluated via transparent KRAs.',
      'Grievance reporting channels with immediate executive escalation.'
    ],
    fullText: [
      '1. Commitment: We are dedicated to maintaining a diverse, inclusive, and high-trust consulting culture.',
      '2. Non-Discrimination: No employee or applicant will face discrimination on any grounds protected by law or human dignity standards.',
      '3. Redressal: Any grievance can be submitted confidentially to HR or the Ethics Committee.'
    ]
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-dev-01',
    employeeCode: 'VER-2026-088',
    fullName: 'Dev Chavan',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'employee',
    personalEmail: 'devchavan.advisory@gmail.com',
    companyEmail: 'dev.chavan@verveadvisory.com',
    phone: '+91 98201 44520',
    dateOfBirth: '1998-04-14',
    dateOfJoining: '2026-08-01',
    department: 'Valuations & Financial Modeling',
    designation: 'Senior Financial Analyst',
    level: 'Senior Associate',
    reportingManagerId: 'emp-ananya-02',
    reportingManagerName: 'Ananya Sharma (Associate Director)',
    employmentType: 'Full-Time',
    employmentStatus: 'Onboarding',
    workLocation: 'Virtual Office (Remote)',
    workScheduleType: 'Standard (Mon-Sat, 48h)',
    shiftStartTime: '09:30',
    shiftEndTime: '18:30',
    timeZone: 'IST (UTC+5:30)',
    probationStatus: 'In Progress',
    probationEndDate: '2026-10-30',
    zoomEmail: 'dev.chavan@verveadvisory.com',
    zoomUserId: 'zoom_usr_882019',
    zoomPersonalRoomUrl: 'https://verveadvisory.zoom.us/j/8820194452',
    emergencyContact: {
      name: 'Sunil Chavan',
      relationship: 'Father',
      phone: '+91 98201 11233'
    },
    onboardingCompleted: false,
    onboardingStep: 3,
    annualTimeOffDaysTaken: 2,
    mandatoryAnnualTimeOffTarget: 18
  },
  {
    id: 'emp-ananya-02',
    employeeCode: 'VER-2024-012',
    fullName: 'Ananya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    role: 'manager',
    personalEmail: 'ananya.sharma.fin@gmail.com',
    companyEmail: 'ananya.sharma@verveadvisory.com',
    phone: '+91 98112 33400',
    dateOfBirth: '1992-11-23',
    dateOfJoining: '2024-03-15',
    department: 'Corporate Advisory',
    designation: 'Associate Director - Advisory',
    level: 'Associate Director',
    reportingManagerId: 'emp-vikram-partner',
    reportingManagerName: 'Vikramaditya Singhania (Managing Partner)',
    employmentType: 'Full-Time',
    employmentStatus: 'Confirmed',
    workLocation: 'Mumbai HQ',
    workScheduleType: 'Standard (Mon-Sat, 48h)',
    shiftStartTime: '09:00',
    shiftEndTime: '18:00',
    timeZone: 'IST (UTC+5:30)',
    probationStatus: 'Confirmed',
    probationEndDate: '2024-06-15',
    zoomEmail: 'ananya.sharma@verveadvisory.com',
    zoomUserId: 'zoom_usr_129034',
    zoomPersonalRoomUrl: 'https://verveadvisory.zoom.us/j/1290349911',
    emergencyContact: {
      name: 'Rajesh Sharma',
      relationship: 'Spouse',
      phone: '+91 98112 99887'
    },
    onboardingCompleted: true,
    onboardingStep: 7,
    annualTimeOffDaysTaken: 14,
    mandatoryAnnualTimeOffTarget: 18
  },
  {
    id: 'emp-rohan-03',
    employeeCode: 'VER-2025-055',
    fullName: 'Rohan Mehta',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    role: 'employee',
    personalEmail: 'rohan.mehta.manda@gmail.com',
    companyEmail: 'rohan.mehta@verveadvisory.com',
    phone: '+91 98330 11299',
    dateOfBirth: '1997-02-18',
    dateOfJoining: '2025-02-01',
    department: 'M&A Advisory',
    designation: 'Corporate Advisory Associate',
    level: 'Associate',
    reportingManagerId: 'emp-ananya-02',
    reportingManagerName: 'Ananya Sharma (Associate Director)',
    employmentType: 'Full-Time',
    employmentStatus: 'Confirmed',
    workLocation: 'Virtual Office (Remote)',
    workScheduleType: 'Standard (Mon-Sat, 48h)',
    shiftStartTime: '09:00',
    shiftEndTime: '18:00',
    timeZone: 'IST (UTC+5:30)',
    probationStatus: 'Confirmed',
    probationEndDate: '2025-05-01',
    zoomEmail: 'rohan.mehta@verveadvisory.com',
    zoomUserId: 'zoom_usr_554411',
    zoomPersonalRoomUrl: 'https://verveadvisory.zoom.us/j/5544119833',
    emergencyContact: {
      name: 'Meena Mehta',
      relationship: 'Mother',
      phone: '+91 98330 44556'
    },
    onboardingCompleted: true,
    onboardingStep: 7,
    annualTimeOffDaysTaken: 19,
    mandatoryAnnualTimeOffTarget: 18
  },
  {
    id: 'emp-priya-04',
    employeeCode: 'VER-2025-063',
    fullName: 'Priya Kapoor',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    role: 'employee',
    personalEmail: 'priyakapoor.tax@gmail.com',
    companyEmail: 'priya.kapoor@verveadvisory.com',
    phone: '+91 99200 48811',
    dateOfBirth: '1995-07-09',
    dateOfJoining: '2025-06-10',
    department: 'Tax & Regulatory',
    designation: 'Tax & Compliance Specialist',
    level: 'Consultant',
    reportingManagerId: 'emp-ananya-02',
    reportingManagerName: 'Ananya Sharma (Associate Director)',
    employmentType: 'Full-Time',
    employmentStatus: 'Confirmed',
    workLocation: 'Virtual Office (Remote)',
    workScheduleType: 'Alternate (Sat-Thu, 48h)',
    shiftStartTime: '08:30',
    shiftEndTime: '17:30',
    timeZone: 'GST (UTC+4:00)',
    probationStatus: 'Confirmed',
    probationEndDate: '2025-09-10',
    zoomEmail: 'priya.kapoor@verveadvisory.com',
    zoomUserId: 'zoom_usr_637722',
    zoomPersonalRoomUrl: 'https://verveadvisory.zoom.us/j/6377229920',
    emergencyContact: {
      name: 'Vikas Kapoor',
      relationship: 'Brother',
      phone: '+91 99200 11223'
    },
    onboardingCompleted: true,
    onboardingStep: 7,
    annualTimeOffDaysTaken: 11,
    mandatoryAnnualTimeOffTarget: 18
  },
  {
    id: 'emp-vikram-partner',
    employeeCode: 'VER-2023-001',
    fullName: 'Vikramaditya Singhania',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    role: 'super_admin',
    personalEmail: 'vikram.singhania.lead@gmail.com',
    companyEmail: 'vikram.singhania@verveadvisory.com',
    phone: '+91 98210 99001',
    dateOfBirth: '1982-05-12',
    dateOfJoining: '2023-01-01',
    department: 'Corporate Advisory',
    designation: 'Managing Partner',
    level: 'Partner',
    reportingManagerId: 'emp-vikram-partner',
    reportingManagerName: 'Self / Board of Partners',
    employmentType: 'Full-Time',
    employmentStatus: 'Confirmed',
    workLocation: 'Mumbai HQ',
    workScheduleType: 'Standard (Mon-Sat, 48h)',
    shiftStartTime: '09:00',
    shiftEndTime: '18:00',
    timeZone: 'IST (UTC+5:30)',
    probationStatus: 'Confirmed',
    probationEndDate: '2023-01-01',
    zoomEmail: 'vikram.singhania@verveadvisory.com',
    zoomUserId: 'zoom_usr_001001',
    zoomPersonalRoomUrl: 'https://verveadvisory.zoom.us/j/0010019900',
    emergencyContact: {
      name: 'Gayatri Singhania',
      relationship: 'Spouse',
      phone: '+91 98210 11990'
    },
    onboardingCompleted: true,
    onboardingStep: 7,
    annualTimeOffDaysTaken: 16,
    mandatoryAnnualTimeOffTarget: 18
  },
  {
    id: 'emp-kavita-hr',
    employeeCode: 'VER-2024-008',
    fullName: 'Kavita Deshmukh',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    role: 'hr_admin',
    personalEmail: 'kavita.deshmukh.hr@gmail.com',
    companyEmail: 'kavita.deshmukh@verveadvisory.com',
    phone: '+91 98205 77660',
    dateOfBirth: '1991-09-15',
    dateOfJoining: '2024-02-15',
    department: 'People & Culture',
    designation: 'Head of People & Culture',
    level: 'Associate Director',
    reportingManagerId: 'emp-vikram-partner',
    reportingManagerName: 'Vikramaditya Singhania (Managing Partner)',
    employmentType: 'Full-Time',
    employmentStatus: 'Confirmed',
    workLocation: 'Mumbai HQ',
    workScheduleType: 'Standard (Mon-Sat, 48h)',
    shiftStartTime: '09:30',
    shiftEndTime: '18:30',
    timeZone: 'IST (UTC+5:30)',
    probationStatus: 'Confirmed',
    probationEndDate: '2024-05-15',
    zoomEmail: 'kavita.deshmukh@verveadvisory.com',
    zoomUserId: 'zoom_usr_008877',
    zoomPersonalRoomUrl: 'https://verveadvisory.zoom.us/j/0088776600',
    emergencyContact: {
      name: 'Nitin Deshmukh',
      relationship: 'Spouse',
      phone: '+91 98205 11223'
    },
    onboardingCompleted: true,
    onboardingStep: 7,
    annualTimeOffDaysTaken: 12,
    mandatoryAnnualTimeOffTarget: 18
  },
  {
    id: 'emp-sid-07',
    employeeCode: 'VER-2025-072',
    fullName: 'Siddharth Nair',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    role: 'employee',
    personalEmail: 'siddharth.nair.val@gmail.com',
    companyEmail: 'siddharth.nair@verveadvisory.com',
    phone: '+91 97450 66221',
    dateOfBirth: '1996-03-30',
    dateOfJoining: '2025-08-01',
    department: 'Valuations & Financial Modeling',
    designation: 'Financial Modeling Consultant',
    level: 'Consultant',
    reportingManagerId: 'emp-ananya-02',
    reportingManagerName: 'Ananya Sharma (Associate Director)',
    employmentType: 'Full-Time',
    employmentStatus: 'Confirmed',
    workLocation: 'Bengaluru Practice',
    workScheduleType: 'Standard (Mon-Sat, 48h)',
    shiftStartTime: '09:30',
    shiftEndTime: '18:30',
    timeZone: 'IST (UTC+5:30)',
    probationStatus: 'Confirmed',
    probationEndDate: '2025-11-01',
    zoomEmail: 'siddharth.nair@verveadvisory.com',
    zoomUserId: 'zoom_usr_723399',
    zoomPersonalRoomUrl: 'https://verveadvisory.zoom.us/j/7233996622',
    emergencyContact: {
      name: 'Preeti Nair',
      relationship: 'Sister',
      phone: '+91 97450 11998'
    },
    onboardingCompleted: true,
    onboardingStep: 7,
    annualTimeOffDaysTaken: 8,
    mandatoryAnnualTimeOffTarget: 18
  },
  {
    id: 'emp-tanya-08',
    employeeCode: 'VER-2026-091',
    fullName: 'Tanya Sen',
    avatarUrl: 'https://images.unsplash.com/photo-1534751516642-a171edd27cb4?w=200&auto=format&fit=crop&q=80',
    role: 'employee',
    personalEmail: 'tanyasen.strat@gmail.com',
    companyEmail: 'tanya.sen@verveadvisory.com',
    phone: '+91 98300 55432',
    dateOfBirth: '1999-10-05',
    dateOfJoining: '2026-08-15',
    department: 'Strategy & Operations',
    designation: 'Strategy Analyst',
    level: 'Associate',
    reportingManagerId: 'emp-ananya-02',
    reportingManagerName: 'Ananya Sharma (Associate Director)',
    employmentType: 'Full-Time',
    employmentStatus: 'Pre-boarding',
    workLocation: 'Virtual Office (Remote)',
    workScheduleType: 'Standard (Mon-Sat, 48h)',
    shiftStartTime: '09:30',
    shiftEndTime: '18:30',
    timeZone: 'IST (UTC+5:30)',
    probationStatus: 'In Progress',
    probationEndDate: '2026-11-15',
    zoomEmail: 'tanya.sen@verveadvisory.com',
    zoomUserId: 'zoom_usr_910044',
    zoomPersonalRoomUrl: 'https://verveadvisory.zoom.us/j/9100445543',
    emergencyContact: {
      name: 'Amit Sen',
      relationship: 'Father',
      phone: '+91 98300 11234'
    },
    onboardingCompleted: false,
    onboardingStep: 1,
    annualTimeOffDaysTaken: 0,
    mandatoryAnnualTimeOffTarget: 18
  }
];

export const INITIAL_RAW_ZOOM_EVENTS: ZoomMeetingRawEvent[] = [
  {
    id: 'z-ev-101',
    meetingId: '984-2201-9941',
    meetingUuid: 'u-98422019941-sessionA',
    meetingTopic: 'Verve Virtual Office - Room Alpha (Morning Bullpen)',
    participantName: 'Dev Chavan',
    participantEmail: 'dev.chavan@verveadvisory.com',
    participantZoomId: 'zoom_usr_882019',
    joinTime: '2026-08-20T09:34:10Z',
    leaveTime: '2026-08-20T13:02:15Z',
    durationMinutes: 208,
    syncedAt: '2026-08-20T13:05:00Z'
  },
  {
    id: 'z-ev-102',
    meetingId: '984-2201-9941',
    meetingUuid: 'u-98422019941-sessionB',
    meetingTopic: 'Verve Virtual Office - Room Alpha (Afternoon Modeling Sprint)',
    participantName: 'Dev Chavan',
    participantEmail: 'dev.chavan@verveadvisory.com',
    participantZoomId: 'zoom_usr_882019',
    joinTime: '2026-08-20T13:45:00Z',
    leaveTime: '2026-08-20T18:32:40Z',
    durationMinutes: 287,
    syncedAt: '2026-08-20T18:35:00Z'
  },
  {
    id: 'z-ev-103',
    meetingId: '812-4409-1120',
    meetingUuid: 'u-81244091120-dealdesk',
    meetingTopic: 'Project Blue Horizon - Client Valuation Model Review',
    participantName: 'Ananya Sharma',
    participantEmail: 'ananya.sharma@verveadvisory.com',
    participantZoomId: 'zoom_usr_129034',
    joinTime: '2026-08-20T09:02:00Z',
    leaveTime: '2026-08-20T18:15:00Z',
    durationMinutes: 553,
    syncedAt: '2026-08-20T18:20:00Z'
  },
  {
    id: 'z-ev-104',
    meetingId: '984-2201-9941',
    meetingUuid: 'u-98422019941-rohan1',
    meetingTopic: 'Verve Virtual Office - Room Alpha (Morning Bullpen)',
    participantName: 'Rohan Mehta',
    participantEmail: 'rohan.mehta@verveadvisory.com',
    participantZoomId: 'zoom_usr_554411',
    joinTime: '2026-08-20T09:50:15Z',
    leaveTime: '2026-08-20T17:50:00Z',
    durationMinutes: 480,
    syncedAt: '2026-08-20T18:00:00Z'
  },
  {
    id: 'z-ev-105',
    meetingId: '984-2201-9941',
    meetingUuid: 'u-98422019941-sid1',
    meetingTopic: 'Verve Virtual Office - Room Alpha (Morning Bullpen)',
    participantName: 'Siddharth Nair',
    participantEmail: 'siddharth.nair@verveadvisory.com',
    participantZoomId: 'zoom_usr_723399',
    joinTime: '2026-08-20T09:28:00Z',
    leaveTime: '2026-08-20T18:31:00Z',
    durationMinutes: 543,
    syncedAt: '2026-08-20T18:35:00Z'
  }
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att-dev-today',
    employeeId: 'emp-dev-01',
    employeeName: 'Dev Chavan',
    department: 'Valuations & Financial Modeling',
    date: '2026-08-20',
    scheduledStart: '09:30 AM',
    scheduledEnd: '06:30 PM',
    firstZoomActivity: '09:34 AM',
    lastZoomActivity: '06:32 PM',
    totalTrackedHours: 8.25,
    meetingCount: 2,
    status: 'Present',
    flags: ['Schedule Met (8h 15m active)', 'Camera Active Verified'],
    source: 'Zoom Attendance',
    rawMeetingIds: ['984-2201-9941'],
    syncTimestamp: '2026-08-20T18:35:00Z'
  },
  {
    id: 'att-ananya-today',
    employeeId: 'emp-ananya-02',
    employeeName: 'Ananya Sharma',
    department: 'Corporate Advisory',
    date: '2026-08-20',
    scheduledStart: '09:00 AM',
    scheduledEnd: '06:00 PM',
    firstZoomActivity: '09:02 AM',
    lastZoomActivity: '06:15 PM',
    totalTrackedHours: 9.21,
    meetingCount: 1,
    status: 'Present',
    flags: ['Full Virtual Office Attendance (9h 12m)'],
    source: 'Zoom Attendance',
    rawMeetingIds: ['812-4409-1120'],
    syncTimestamp: '2026-08-20T18:20:00Z'
  },
  {
    id: 'att-rohan-today',
    employeeId: 'emp-rohan-03',
    employeeName: 'Rohan Mehta',
    department: 'M&A Advisory',
    date: '2026-08-20',
    scheduledStart: '09:00 AM',
    scheduledEnd: '06:00 PM',
    firstZoomActivity: '09:50 AM',
    lastZoomActivity: '05:50 PM',
    totalTrackedHours: 8.0,
    meetingCount: 1,
    status: 'Exception',
    exceptionType: 'Late Join',
    flags: ['Late Join (50m after scheduled start)', 'Target 8.0h Met'],
    source: 'Zoom Attendance',
    rawMeetingIds: ['984-2201-9941'],
    hrReviewStatus: 'Pending',
    syncTimestamp: '2026-08-20T18:00:00Z'
  },
  {
    id: 'att-priya-today',
    employeeId: 'emp-priya-04',
    employeeName: 'Priya Kapoor',
    department: 'Tax & Regulatory',
    date: '2026-08-20',
    scheduledStart: '08:30 AM',
    scheduledEnd: '05:30 PM',
    firstZoomActivity: '--',
    lastZoomActivity: '--',
    totalTrackedHours: 0,
    meetingCount: 0,
    status: 'Time Off',
    flags: ['Advance Time-Off Notice on Record (Tax Filing Break)'],
    source: 'Zoom Attendance',
    rawMeetingIds: [],
    syncTimestamp: '2026-08-20T00:00:00Z'
  },
  {
    id: 'att-sid-today',
    employeeId: 'emp-sid-07',
    employeeName: 'Siddharth Nair',
    department: 'Valuations & Financial Modeling',
    date: '2026-08-20',
    scheduledStart: '09:30 AM',
    scheduledEnd: '06:30 PM',
    firstZoomActivity: '09:28 AM',
    lastZoomActivity: '06:31 PM',
    totalTrackedHours: 9.05,
    meetingCount: 1,
    status: 'Present',
    flags: ['Full Virtual Office Attendance'],
    source: 'Zoom Attendance',
    rawMeetingIds: ['984-2201-9941'],
    syncTimestamp: '2026-08-20T18:35:00Z'
  }
];

export const INITIAL_TIME_OFF_BROADCASTS: TimeOffNotification[] = [
  {
    id: 'to-001',
    employeeId: 'emp-priya-04',
    employeeName: 'Priya Kapoor',
    department: 'Tax & Regulatory',
    startDate: '2026-08-20',
    endDate: '2026-08-21',
    totalDays: 2,
    reasonCategory: 'Vacation & Rest',
    coveragePlan: 'Cross-border tax transfer files covered by Rohan Mehta. Urgent escalations direct to Ananya.',
    coverageColleagueName: 'Rohan Mehta',
    notifiedManager: true,
    notifiedTeam: true,
    createdAt: '2026-08-16T10:00:00Z',
    status: 'Communicated (No Approval Needed)'
  },
  {
    id: 'to-002',
    employeeId: 'emp-rohan-03',
    employeeName: 'Rohan Mehta',
    department: 'M&A Advisory',
    startDate: '2026-07-10',
    endDate: '2026-07-15',
    totalDays: 5,
    reasonCategory: 'Vacation & Rest',
    coveragePlan: 'M&A Due Diligence tracker updated on ClickUp. Pitch deck handed over to Dev Chavan.',
    coverageColleagueName: 'Dev Chavan',
    notifiedManager: true,
    notifiedTeam: true,
    createdAt: '2026-07-02T14:30:00Z',
    status: 'Communicated (No Approval Needed)'
  },
  {
    id: 'to-003',
    employeeId: 'emp-ananya-02',
    employeeName: 'Ananya Sharma',
    department: 'Corporate Advisory',
    startDate: '2026-06-01',
    endDate: '2026-06-07',
    totalDays: 6,
    reasonCategory: 'Personal / Family',
    coveragePlan: 'Corporate mandate lead coverage by Vikramaditya Singhania.',
    coverageColleagueName: 'Vikramaditya Singhania',
    notifiedManager: true,
    notifiedTeam: true,
    createdAt: '2026-05-20T09:00:00Z',
    status: 'Communicated (No Approval Needed)'
  }
];

export const INITIAL_REIMBURSEMENTS: ReimbursementClaim[] = [
  {
    id: 'reimb-001',
    employeeId: 'emp-dev-01',
    employeeName: 'Dev Chavan',
    department: 'Valuations & Financial Modeling',
    category: 'Courses',
    expenseDate: '2026-08-10',
    requestedAmount: 12500,
    currency: 'INR (₹)',
    description: 'Advanced M&A LBO Financial Modeling Certification & Dataset License',
    receiptName: 'WallStreetPrep_LBO_Invoice_2026.pdf',
    submittedAt: '2026-08-12T11:00:00Z',
    isPrePayrollCompliant: true,
    managerApprovalStatus: 'Approved',
    approvedAmount: 12500,
    financeVerificationStatus: 'Verified',
    excessAmountBorneByEmployee: 0,
    approverName: 'Ananya Sharma',
    notes: 'Approved under continuous professional advisory development budget.'
  },
  {
    id: 'reimb-002',
    employeeId: 'emp-ananya-02',
    employeeName: 'Ananya Sharma',
    department: 'Corporate Advisory',
    category: 'Client Meals',
    expenseDate: '2026-08-14',
    requestedAmount: 8400,
    currency: 'INR (₹)',
    description: 'Client Working Lunch with CXOs of Apex Healthcare Group for M&A Mandate',
    receiptName: 'TheOberoi_Invoice_Aug14.pdf',
    submittedAt: '2026-08-15T09:30:00Z',
    isPrePayrollCompliant: true,
    managerApprovalStatus: 'Approved',
    approvedAmount: 8000,
    financeVerificationStatus: 'Pending',
    excessAmountBorneByEmployee: 400,
    approverName: 'Vikramaditya Singhania',
    notes: 'Policy meal cap is ₹8,000 per engagement. Excess ₹400 borne by employee per Verve policy.'
  },
  {
    id: 'reimb-003',
    employeeId: 'emp-rohan-03',
    employeeName: 'Rohan Mehta',
    department: 'M&A Advisory',
    category: 'Business Travel',
    expenseDate: '2026-08-18',
    requestedAmount: 5600,
    currency: 'INR (₹)',
    description: 'Airport cab transfers and client site diligence in Pune',
    receiptName: 'Uber_Receipts_Pune_Aug18.pdf',
    submittedAt: '2026-08-19T16:00:00Z',
    isPrePayrollCompliant: true,
    managerApprovalStatus: 'Pending',
    financeVerificationStatus: 'Pending'
  }
];

export const INITIAL_PERFORMANCE_GOALS: PerformanceGoal[] = [
  {
    id: 'goal-01',
    employeeId: 'emp-dev-01',
    kraTitle: 'Valuation Modeling Accuracy & Speed',
    kpiMetrics: 'Deliver 100% audit-ready DCF & Comps models within 48h turnaround without formula errors',
    targetDate: '2026-10-30',
    weightagePercent: 40,
    progressPercent: 75,
    status: 'On Track',
    cycle: 'Probation (30-60-90)'
  },
  {
    id: 'goal-02',
    employeeId: 'emp-dev-01',
    kraTitle: 'Client Pitch Deck Contribution',
    kpiMetrics: 'Co-author 4 investment committee confidential information memorandums (CIMs)',
    targetDate: '2026-10-30',
    weightagePercent: 30,
    progressPercent: 60,
    status: 'On Track',
    cycle: 'Probation (30-60-90)'
  },
  {
    id: 'goal-03',
    employeeId: 'emp-dev-01',
    kraTitle: 'Virtual Office & Team Engagement',
    kpiMetrics: 'Maintain 95%+ Zoom presence and complete peer feedback loops',
    targetDate: '2026-10-30',
    weightagePercent: 30,
    progressPercent: 90,
    status: 'On Track',
    cycle: 'Probation (30-60-90)'
  },
  {
    id: 'goal-04',
    employeeId: 'emp-rohan-03',
    kraTitle: 'M&A Pipeline Execution',
    kpiMetrics: 'Manage diligence data rooms for 3 buy-side mandates and coordinate with external legal counsel',
    targetDate: '2026-09-30',
    weightagePercent: 50,
    progressPercent: 85,
    status: 'On Track',
    cycle: 'Q3 2026'
  }
];

export const INITIAL_PERFORMANCE_REVIEWS: PerformanceReview[] = [
  {
    id: 'rev-01',
    employeeId: 'emp-rohan-03',
    employeeName: 'Rohan Mehta',
    reviewerId: 'emp-ananya-02',
    reviewerName: 'Ananya Sharma',
    cycle: 'Q2 2026',
    selfRating: 4.5,
    selfComments: 'Successfully closed the Apex Healthcare diligence tracker with zero client escalations.',
    managerRating: 4.2,
    managerComments: 'Rohan demonstrates strong diligence instincts. Needs minor sharpening on DCF sensitivity tables.',
    finalScore: 4.3,
    status: 'Completed',
    submittedAt: '2026-07-05T10:00:00Z',
    completedAt: '2026-07-12T15:30:00Z'
  }
];

export const INITIAL_TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'trn-01',
    title: 'Virtual Office Operations & Zoom Collaboration Standards',
    category: 'Virtual Office & Culture',
    trainer: 'Kavita Deshmukh',
    date: '2026-08-25',
    durationHours: 2.0,
    mandatoryFor: ['All'],
    status: 'Active',
    description: 'Mastering Verve’s virtual presence protocols, breakout rooms, and confidentiality standards.'
  },
  {
    id: 'trn-02',
    title: 'Advanced Valuation, LBO Modeling & Sensitivity Engineering',
    category: 'Valuation & Modeling',
    trainer: 'Vikramaditya Singhania',
    date: '2026-09-02',
    durationHours: 6.0,
    mandatoryFor: ['Associate', 'Senior Associate', 'Consultant'],
    status: 'Upcoming',
    description: 'Comprehensive financial modeling masterclass tailored for cross-border private equity deals.'
  },
  {
    id: 'trn-03',
    title: 'POSH Compliance & Ethical Workplace Governance',
    category: 'Compliance & POSH',
    trainer: 'Dr. Radhika Kulkarni (ICC Chair)',
    date: '2026-08-28',
    durationHours: 1.5,
    mandatoryFor: ['All'],
    status: 'Active',
    description: 'Mandatory annual refresher on Prevention of Sexual Harassment in virtual and hybrid workplaces.'
  },
  {
    id: 'trn-04',
    title: 'Client Advisory Excellence & Pitch Presentation Mastery',
    category: 'Client Advisory Excellence',
    trainer: 'Ananya Sharma',
    date: '2026-09-10',
    durationHours: 3.5,
    mandatoryFor: ['Associate', 'Senior Associate', 'Consultant', 'Manager'],
    status: 'Upcoming',
    description: 'Frameworks for high-impact promoter negotiations, deck structuring, and executive presence.'
  }
];

export const INITIAL_TRAINING_ENROLLMENTS: TrainingEnrollment[] = [
  {
    id: 'enr-01',
    trainingId: 'trn-01',
    trainingTitle: 'Virtual Office Operations & Zoom Collaboration Standards',
    employeeId: 'emp-dev-01',
    employeeName: 'Dev Chavan',
    progressPercent: 100,
    status: 'Completed',
    completedDate: '2026-08-04',
    certificateId: 'CERT-VRV-2026-0881'
  },
  {
    id: 'enr-02',
    trainingId: 'trn-03',
    trainingTitle: 'POSH Compliance & Ethical Workplace Governance',
    employeeId: 'emp-dev-01',
    employeeName: 'Dev Chavan',
    progressPercent: 65,
    status: 'In Progress'
  },
  {
    id: 'enr-03',
    trainingId: 'trn-02',
    trainingTitle: 'Advanced Valuation, LBO Modeling & Sensitivity Engineering',
    employeeId: 'emp-dev-01',
    employeeName: 'Dev Chavan',
    progressPercent: 0,
    status: 'Enrolled'
  },
  {
    id: 'enr-04',
    trainingId: 'trn-01',
    trainingTitle: 'Virtual Office Operations & Zoom Collaboration Standards',
    employeeId: 'emp-rohan-03',
    employeeName: 'Rohan Mehta',
    progressPercent: 100,
    status: 'Completed',
    completedDate: '2025-02-10',
    certificateId: 'CERT-VRV-2025-0551'
  }
];

export const INITIAL_CASES: ConfidentialCase[] = [
  {
    id: 'case-01',
    ticketNumber: 'VRV-CONF-2026-019',
    category: 'Discrimination',
    priority: 'High',
    isAnonymous: true,
    isPoshRestricted: false,
    incidentDate: '2026-07-25',
    locationContext: 'Client Communication',
    description: 'External client representative made disparaging remarks regarding team member background during an advisory pitch debrief.',
    witnessesOrEvidence: 'Zoom call recording transcript timestamp 34:10, follow-up client email thread.',
    status: 'Investigation',
    assignedHrName: 'Kavita Deshmukh',
    confidentialNotes: [
      '2026-07-26: Client liaison contacted to reiterate Verve Advisory equal opportunity standards.',
      '2026-08-02: Team member reassigned to Project Apex with zero penalty.'
    ],
    filedAt: '2026-07-26T16:20:00Z'
  },
  {
    id: 'case-posh-02',
    ticketNumber: 'VRV-POSH-2026-004',
    category: 'POSH (Sexual Harassment)',
    priority: 'Critical',
    isAnonymous: false,
    isPoshRestricted: true,
    reporterEmployeeId: 'emp-priya-04',
    reporterName: 'Priya Kapoor',
    incidentDate: '2026-08-05',
    locationContext: 'Internal Messaging',
    description: 'Received inappropriate personal late-night text messages from a former contract vendor requesting non-business virtual meetings.',
    witnessesOrEvidence: 'Screenshots of WhatsApp & Zoom direct chat messages.',
    status: 'Under Review',
    assignedHrName: 'Dr. Radhika Kulkarni (ICC Chair)',
    confidentialNotes: [
      '2026-08-06: Formal notice of inquiry served to vendor management.',
      '2026-08-10: Vendor access credentials instantly revoked across all Verve instances.'
    ],
    filedAt: '2026-08-06T11:15:00Z'
  }
];

export const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'doc-01',
    employeeId: 'emp-dev-01',
    employeeName: 'Dev Chavan',
    documentName: 'Aadhaar Card (National ID)',
    category: 'Identity',
    fileName: 'Dev_Chavan_Aadhaar_Verified.pdf',
    fileSize: '1.4 MB',
    uploadDate: '2026-08-01',
    uploadedBy: 'Dev Chavan',
    accessLevel: 'Employee',
    status: 'Verified'
  },
  {
    id: 'doc-02',
    employeeId: 'emp-dev-01',
    employeeName: 'Dev Chavan',
    documentName: 'Permanent Account Number (PAN Card)',
    category: 'Identity',
    fileName: 'Dev_Chavan_PAN_Card.pdf',
    fileSize: '890 KB',
    uploadDate: '2026-08-01',
    uploadedBy: 'Dev Chavan',
    accessLevel: 'Employee',
    status: 'Verified'
  },
  {
    id: 'doc-03',
    employeeId: 'emp-dev-01',
    employeeName: 'Dev Chavan',
    documentName: 'Master of Business Administration (MBA Finance)',
    category: 'Joining',
    fileName: 'Dev_Chavan_MBA_Finance_Degree.pdf',
    fileSize: '3.2 MB',
    uploadDate: '2026-08-02',
    uploadedBy: 'Dev Chavan',
    accessLevel: 'HR',
    status: 'Verified'
  },
  {
    id: 'doc-04',
    employeeId: 'emp-dev-01',
    employeeName: 'Dev Chavan',
    documentName: 'Signed Employment Agreement & Non-Disclosure (NDA)',
    category: 'Employment',
    fileName: 'Verve_Advisory_Signed_Offer_NDA_Dev.pdf',
    fileSize: '2.1 MB',
    uploadDate: '2026-08-02',
    uploadedBy: 'Kavita Deshmukh',
    accessLevel: 'HR',
    status: 'Verified'
  },
  {
    id: 'doc-05',
    employeeId: 'emp-dev-01',
    employeeName: 'Dev Chavan',
    documentName: 'Cancelled Cheque for Salary Account Verification',
    category: 'Joining',
    fileName: 'HDFC_Bank_Cancelled_Cheque_Dev.pdf',
    fileSize: '650 KB',
    uploadDate: '2026-08-03',
    uploadedBy: 'Dev Chavan',
    accessLevel: 'HR',
    status: 'Verified'
  }
];

export const INITIAL_HR_REQUESTS: HrRequest[] = [
  {
    id: 'hr-req-01',
    employeeId: 'emp-dev-01',
    employeeName: 'Dev Chavan',
    department: 'Valuations & Financial Modeling',
    requestType: 'Employment Letter',
    subject: 'Request for Official Employment Verification Letter for Lease',
    description: 'Need formal Verve Advisory letter certifying employment for residential lease verification.',
    urgency: 'Standard',
    status: 'Completed',
    assignedHrName: 'Kavita Deshmukh',
    submittedAt: '2026-08-05T09:00:00Z',
    resolvedAt: '2026-08-06T14:00:00Z',
    resolutionNotes: 'Official letter generated and dispatched via email.',
    attachmentFileName: 'Verve_Employment_Verification_DevChavan.pdf'
  },
  {
    id: 'hr-req-02',
    employeeId: 'emp-rohan-03',
    employeeName: 'Rohan Mehta',
    department: 'M&A Advisory',
    requestType: 'Salary Certificate',
    subject: 'Salary Certificate for Home Loan Processing',
    description: 'Bank requires certified 6-month salary and bonus breakdown.',
    urgency: 'Urgent',
    status: 'In Processing',
    assignedHrName: 'Kavita Deshmukh',
    submittedAt: '2026-08-18T11:30:00Z'
  }
];

export const INITIAL_OFFBOARDING_RECORDS: OffboardingRecord[] = [
  {
    id: 'off-01',
    employeeId: 'emp-sample-exit',
    employeeName: 'Kunal Deshmukh',
    designation: 'Senior Valuation Associate',
    department: 'Valuations & Financial Modeling',
    level: 'Senior Associate',
    separationType: 'Resignation',
    resignationDate: '2026-07-01',
    mandatoryNoticeDays: 60,
    lastWorkingDay: '2026-08-30',
    waiverRequested: false,
    waiverApprovedByManagementAndHR: false,
    handoverCompleted: true,
    handoverAssigneeName: 'Dev Chavan',
    noDuesStatus: {
      itAssetsRevoked: true,
      financeAndClaimsCleared: true,
      managerKnowledgeHandover: true,
      hrExitInterviewCompleted: true,
      adminAccessTerminated: true
    },
    fnfDeadlineDate: '2026-09-09',
    fnfStatus: 'Calculated',
    relievingLetterIssued: false,
    experienceLetterIssued: false
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'aud-001',
    timestamp: '2026-08-20T09:30:00Z',
    userName: 'Vikramaditya Singhania',
    userRole: 'super_admin',
    module: 'Authentication',
    action: 'Executive SSO Login Verified',
    recordId: 'emp-vikram-partner',
    newValue: 'Session established via Google Workspace SSO (2FA Verified)',
    ipAddress: '103.21.54.9'
  },
  {
    id: 'aud-002',
    timestamp: '2026-08-20T09:45:00Z',
    userName: 'Vikramaditya Singhania',
    userRole: 'super_admin',
    module: 'Employee Master',
    action: 'Created Employee Record',
    recordId: 'emp-dev-01',
    newValue: 'Dev Chavan (Senior Financial Analyst - Strategic Advisory)',
    ipAddress: '103.21.54.9'
  },
  {
    id: 'aud-003',
    timestamp: '2026-08-20T10:15:00Z',
    userName: 'Dev Chavan',
    userRole: 'employee',
    module: 'Policies',
    action: 'Acknowledged Policy digitally',
    recordId: 'pol-no-leave',
    newValue: 'Signed v2.4 No-Leave Wellbeing & 18-Day Rest Mandate with SHA-256 fingerprint',
    ipAddress: '103.28.114.77'
  },
  {
    id: 'aud-004',
    timestamp: '2026-08-20T11:00:00Z',
    userName: 'Ananya Sharma',
    userRole: 'manager',
    module: 'Reimbursements',
    action: 'Stage-1 Manager Approval Granted',
    recordId: 'reimb-001',
    oldValue: 'Status: Pending Manager Review (₹12,500)',
    newValue: 'Status: Approved by Manager (Forwarded to Stage-2 Finance Release)',
    ipAddress: '103.21.54.9'
  },
  {
    id: 'aud-005',
    timestamp: '2026-08-20T14:20:00Z',
    userName: 'Dev Chavan',
    userRole: 'employee',
    module: 'Time & Wellbeing',
    action: 'Broadcast Mandatory Rest Notice',
    recordId: 'wo-2026-881',
    newValue: 'Rest Notice: 2026-08-28 to 2026-08-29 (2 Days - Mid-Project Recharge)',
    ipAddress: '103.28.114.77'
  },
  {
    id: 'aud-006',
    timestamp: '2026-08-20T16:45:00Z',
    userName: 'Vikramaditya Singhania',
    userRole: 'super_admin',
    module: 'Reimbursements',
    action: 'Stage-2 Finance Payout Cleared',
    recordId: 'reimb-001',
    oldValue: 'Status: Pending Finance Release',
    newValue: 'Status: Cleared for Direct Bank Transfer (₹12,500 to HDFC Bank A/C ...9012)',
    ipAddress: '103.21.54.9'
  },
  {
    id: 'aud-007',
    timestamp: '2026-08-20T18:35:00Z',
    userName: 'System Bot (Automated)',
    userRole: 'super_admin',
    module: 'Attendance',
    action: 'Zoom Webhook Ingestion & 48h Shift Engine Run',
    recordId: 'batch-2026-08-20',
    newValue: '12 active sessions synchronized, 1 tardiness anomaly flagged for manager review',
    ipAddress: '127.0.0.1'
  },
  {
    id: 'aud-008',
    timestamp: '2026-08-20T19:10:00Z',
    userName: 'Vikramaditya Singhania',
    userRole: 'super_admin',
    module: 'Settings',
    action: 'Updated Firm Compliance Settings',
    recordId: 'sys-config-main',
    oldValue: 'reimbursementCutoff: 5 days',
    newValue: 'reimbursementCutoff: 7 days before payroll cycle',
    ipAddress: '103.21.54.9'
  }
];

export const INITIAL_INTEGRATION_CONFIGS: IntegrationConfig[] = [
  {
    id: 'int-zoom',
    serviceName: 'Zoom',
    mode: 'MOCK',
    status: 'Connected',
    lastSuccessfulSync: '2026-08-20T18:35:00Z',
    syncFrequency: 'Every 15 Minutes',
    clientId: 'zm_client_vrv_advisory_prod',
    accountEmail: 'admin@verveadvisory.com',
    totalSyncedEvents: 1420
  },
  {
    id: 'int-zoho',
    serviceName: 'Zoho People',
    mode: 'MOCK',
    status: 'Connected',
    lastSuccessfulSync: '2026-08-20T18:30:00Z',
    syncFrequency: 'Hourly',
    clientId: 'zoho_ppl_verve_9921',
    accountEmail: 'hr@verveadvisory.com',
    totalSyncedEvents: 850
  },
  {
    id: 'int-clickup',
    serviceName: 'ClickUp',
    mode: 'MOCK',
    status: 'Connected',
    lastSuccessfulSync: '2026-08-20T17:00:00Z',
    syncFrequency: 'Hourly',
    clientId: 'clickup_ws_verve_ops',
    accountEmail: 'ops@verveadvisory.com',
    totalSyncedEvents: 340
  },
  {
    id: 'int-gsuite',
    serviceName: 'Google Workspace',
    mode: 'MOCK',
    status: 'Connected',
    lastSuccessfulSync: '2026-08-20T18:00:00Z',
    syncFrequency: 'Every 15 Minutes',
    clientId: 'gsuite_oauth_verve_corp',
    accountEmail: 'admin@verveadvisory.com',
    totalSyncedEvents: 5200
  },
  {
    id: 'int-payroll',
    serviceName: 'Payroll API',
    mode: 'MOCK',
    status: 'Connected',
    lastSuccessfulSync: '2026-08-15T00:00:00Z',
    syncFrequency: 'Daily (Midnight)',
    clientId: 'pay_disb_verve_bank_api',
    accountEmail: 'finance@verveadvisory.com',
    totalSyncedEvents: 94
  },
  {
    id: 'int-smtp',
    serviceName: 'Email SMTP',
    mode: 'MOCK',
    status: 'Connected',
    lastSuccessfulSync: '2026-08-20T18:40:00Z',
    syncFrequency: 'Every 15 Minutes',
    clientId: 'smtp_sendgrid_verve_mailer',
    accountEmail: 'notifications@verveadvisory.com',
    totalSyncedEvents: 2180
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    targetRoles: ['employee', 'new_hire' as any],
    targetEmployeeId: 'emp-dev-01',
    title: 'Policy Sign-Off Pending',
    message: 'Please review and acknowledge the Virtual Office Etiquette policy to complete Induction.',
    category: 'Policy',
    timestamp: '2026-08-20T09:00:00Z',
    read: false,
    actionTab: 'policies'
  },
  {
    id: 'notif-02',
    targetRoles: ['manager', 'hr_admin', 'super_admin'],
    title: 'Attendance Exception Detected',
    message: 'Rohan Mehta joined 50 mins after scheduled shift start on Aug 20. Pending review.',
    category: 'Attendance',
    timestamp: '2026-08-20T18:00:00Z',
    read: false,
    actionTab: 'attendance'
  },
  {
    id: 'notif-03',
    targetRoles: ['manager', 'hr_admin', 'super_admin'],
    title: 'New Reimbursement Claim',
    message: 'Rohan Mehta submitted a travel claim for ₹5,600 awaiting manager approval.',
    category: 'Reimbursement',
    timestamp: '2026-08-19T16:00:00Z',
    read: false,
    actionTab: 'reimbursements'
  },
  {
    id: 'notif-04',
    targetRoles: ['hr_admin', 'super_admin'],
    title: 'Burnout Guard Alert',
    message: 'Siddharth Nair has taken only 8 rest days this year against the 18-day mandatory target.',
    category: 'System',
    timestamp: '2026-08-18T10:00:00Z',
    read: true,
    actionTab: 'wellbeing'
  }
];
