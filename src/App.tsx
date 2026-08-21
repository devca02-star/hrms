import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Role } from './types';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { Toasts } from './components/Toasts';
import { LoginWall } from './components/auth/LoginWall';
import { AccessDeniedView } from './components/auth/AccessDeniedView';

// Main View Components
import { Dashboard } from './components/dashboard/Dashboard';
import { EmployeeDirectory } from './components/employees/EmployeeDirectory';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { ZoomAttendanceEngine } from './components/attendance/ZoomAttendanceEngine';
import { WellbeingTimeOff } from './components/wellbeing/WellbeingTimeOff';
import { PolicyCenter } from './components/policies/PolicyCenter';
import { ReimbursementPortal } from './components/reimbursements/ReimbursementPortal';
import { PerformanceHub } from './components/performance/PerformanceHub';
import { TrainingCenter } from './components/training/TrainingCenter';
import { ConfidentialCases } from './components/cases/ConfidentialCases';
import { DocumentVault } from './components/documents/DocumentVault';
import { HrRequestsHub } from './components/requests/HrRequestsHub';
import { OffboardingManager } from './components/separation/OffboardingManager';
import { IntegrationsConsole } from './components/integrations/IntegrationsConsole';
import { ReportsHub } from './components/reports/ReportsHub';
import { AuditLogViewer } from './components/audit/AuditLogViewer';
import { SystemSettingsView } from './components/settings/SystemSettingsView';

interface TabConfig {
  name: string;
  allowedRoles: Role[];
  component: React.ReactNode;
}

const MainContent: React.FC = () => {
  const { activeTab, currentRole } = useApp();

  const tabRegistry: Record<string, TabConfig> = {
    dashboard: {
      name: 'Executive Dashboard',
      allowedRoles: ['super_admin', 'hr_admin', 'manager', 'employee'],
      component: <Dashboard />
    },
    directory: {
      name: 'Employee Master & Directory',
      allowedRoles: ['super_admin', 'hr_admin', 'manager'],
      component: <EmployeeDirectory />
    },
    onboarding: {
      name: 'Onboarding & Induction Journey',
      allowedRoles: ['super_admin', 'hr_admin', 'employee'],
      component: <OnboardingWizard />
    },
    attendance: {
      name: 'Zoom 48h Virtual Attendance',
      allowedRoles: ['super_admin', 'hr_admin', 'manager', 'employee'],
      component: <ZoomAttendanceEngine />
    },
    wellbeing: {
      name: 'No-Leave Wellbeing & Rest Mandate',
      allowedRoles: ['super_admin', 'hr_admin', 'manager', 'employee'],
      component: <WellbeingTimeOff />
    },
    policies: {
      name: 'Digital Policies & Compliance Sign-offs',
      allowedRoles: ['super_admin', 'hr_admin', 'manager', 'employee'],
      component: <PolicyCenter />
    },
    reimbursements: {
      name: 'Expense Reimbursements & Claims',
      allowedRoles: ['super_admin', 'hr_admin', 'manager', 'employee'],
      component: <ReimbursementPortal />
    },
    performance: {
      name: 'Performance & PMS Appraisals',
      allowedRoles: ['super_admin', 'hr_admin', 'manager', 'employee'],
      component: <PerformanceHub />
    },
    training: {
      name: 'Advisory Training Academy',
      allowedRoles: ['super_admin', 'hr_admin', 'manager', 'employee'],
      component: <TrainingCenter />
    },
    cases: {
      name: 'Confidential Grievances & POSH ICC Desk',
      allowedRoles: ['super_admin', 'hr_admin', 'employee'],
      component: <ConfidentialCases />
    },
    documents: {
      name: 'KYC Document Vault',
      allowedRoles: ['super_admin', 'hr_admin', 'manager', 'employee'],
      component: <DocumentVault />
    },
    requests: {
      name: 'HR Service Desk & Letters',
      allowedRoles: ['super_admin', 'hr_admin', 'employee'],
      component: <HrRequestsHub />
    },
    separation: {
      name: 'Separation & 10-Day F&F Settlement',
      allowedRoles: ['super_admin', 'hr_admin', 'manager', 'employee'],
      component: <OffboardingManager />
    },
    reports: {
      name: 'Statutory Reports & Analytics Hub',
      allowedRoles: ['super_admin', 'hr_admin', 'manager'],
      component: <ReportsHub />
    },
    integrations: {
      name: 'Integration Pipeline (Zoho / Zoom)',
      allowedRoles: ['super_admin', 'hr_admin'],
      component: <IntegrationsConsole />
    },
    audit: {
      name: 'System Audit Logs',
      allowedRoles: ['super_admin', 'hr_admin'],
      component: <AuditLogViewer />
    },
    settings: {
      name: 'System Settings & Platform Rules',
      allowedRoles: ['super_admin', 'hr_admin'],
      component: <SystemSettingsView />
    }
  };

  const currentTabConfig = tabRegistry[activeTab] || tabRegistry.dashboard;

  const renderActiveView = () => {
    // Check RBAC permission for this tab
    if (!currentTabConfig.allowedRoles.includes(currentRole)) {
      return (
        <AccessDeniedView 
          requiredRoles={currentTabConfig.allowedRoles} 
          moduleName={currentTabConfig.name} 
        />
      );
    }

    return currentTabConfig.component;
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col antialiased text-slate-800 font-sans">
      <Header />
      
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      <GlobalSearchModal />
      <Toasts />
    </div>
  );
};

const AppRoot: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <>
        <LoginWall />
        <Toasts />
      </>
    );
  }

  return <MainContent />;
};

export function App() {
  return (
    <AppProvider>
      <AppRoot />
    </AppProvider>
  );
}

export default App;
