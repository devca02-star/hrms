import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Network, 
  Video, 
  Database, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  RefreshCw, 
  Settings, 
  Activity,
  Zap,
  Sliders
} from 'lucide-react';

export const IntegrationsConsole: React.FC = () => {
  const { 
    integrationConfigs, 
    toggleIntegrationMode, 
    triggerManualSync, 
    runAttendanceRulesEngine,
    currentRole 
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    triggerManualSync('Zoom');
    triggerManualSync('Zoho People');
    runAttendanceRulesEngine();
    setTimeout(() => setIsSyncing(false), 800);
  };

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Zoom': return Video;
      case 'Zoho People': return Database;
      case 'Slack / Workspace': return MessageSquare;
      case 'Google Calendar': return Calendar;
      default: return Network;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Enterprise Pipeline
            </span>
            <span className="text-xs text-slate-400">• System of Record & Telemetry Sync</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Integration Pipeline & Webhook Telemetry</h2>
          <p className="text-xs text-slate-500">
            Real-time synchronization with Zoom Virtual Office, Zoho People SoR, and Google Calendar.
          </p>
        </div>

        <button
          disabled={isSyncing}
          onClick={handleSyncAll}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing Pipeline...' : 'Trigger Full Pipeline Sync'}</span>
        </button>
      </div>

      {/* Architecture Concept Card */}
      <div className="p-5 rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg space-y-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold">Verve Virtual HRMS Synchronized Ecosystem</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          <strong>Zoho People</strong> acts as the master System of Record (SoR) for official employee designations and compensation, while <strong>Zoom</strong> streams raw websocket telemetry for real-time 48-hour attendance calculations.
        </p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrationConfigs.map(config => {
          const Icon = getServiceIcon(config.serviceName);
          const isLive = config.mode === 'LIVE';

          return (
            <div key={config.serviceName} className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl ${isLive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{config.serviceName}</h3>
                      <p className="text-[11px] text-slate-400">Status: <strong className="text-emerald-600">{config.status}</strong></p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isLive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {config.mode} Mode
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Endpoint / URL:</span>
                    <span className="font-mono text-slate-700 truncate max-w-[200px]">{config.endpointUrl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sync Cadence:</span>
                    <span className="font-semibold text-slate-700">{config.syncFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Telemetry Ingestion:</span>
                    <span className="font-mono text-indigo-600 font-medium">
                      {new Date(config.lastSyncTimestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => toggleIntegrationMode(config.serviceName)}
                  className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center space-x-1 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Toggle to {isLive ? 'MOCK' : 'LIVE'}</span>
                </button>

                <button
                  onClick={() => triggerManualSync(config.serviceName)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Sync Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
