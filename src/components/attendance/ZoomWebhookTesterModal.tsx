import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Video, Sparkles, CheckCircle2, Code2 } from 'lucide-react';

interface ZoomWebhookTesterModalProps {
  onClose: () => void;
}

export const ZoomWebhookTesterModal: React.FC<ZoomWebhookTesterModalProps> = ({ onClose }) => {
  const { allEmployees, ingestZoomWebhook, showToast } = useApp();

  const [selectedEmpId, setSelectedEmpId] = useState(allEmployees[0]?.id || '');
  const [eventType, setEventType] = useState<'meeting.participant_joined' | 'meeting.participant_left'>('meeting.participant_joined');
  const [meetingTopic, setMeetingTopic] = useState('Verve Financial Modeling Bullpen Sprint');

  const selectedEmp = allEmployees.find(e => e.id === selectedEmpId) || allEmployees[0];

  const [customPayload, setCustomPayload] = useState<string>(() => {
    return JSON.stringify({
      event: 'meeting.participant_joined',
      event_ts: Date.now(),
      payload: {
        account_id: 'verve_zoom_corp_prod',
        object: {
          id: '8899001122',
          topic: 'Verve Financial Modeling Bullpen Sprint',
          type: 2,
          start_time: new Date().toISOString(),
          timezone: 'Asia/Kolkata',
          participant: {
            user_id: selectedEmp?.zoomUserId || 'zoom_usr_88201',
            user_name: selectedEmp?.fullName || 'Aarav Mehta',
            email: selectedEmp?.zoomEmail || 'aarav.mehta@verveadvisory.com',
            join_time: new Date().toISOString()
          }
        }
      }
    }, null, 2);
  });

  const handleUpdateTemplate = (empId: string, ev: 'meeting.participant_joined' | 'meeting.participant_left') => {
    setSelectedEmpId(empId);
    setEventType(ev);
    const emp = allEmployees.find(e => e.id === empId);

    const payload = {
      event: ev,
      event_ts: Date.now(),
      payload: {
        account_id: 'verve_zoom_corp_prod',
        object: {
          id: '8899001122',
          topic: meetingTopic,
          type: 2,
          start_time: new Date().toISOString(),
          timezone: 'Asia/Kolkata',
          participant: {
            user_id: emp?.zoomUserId || 'zoom_usr_88201',
            user_name: emp?.fullName || 'Aarav Mehta',
            email: emp?.zoomEmail || 'aarav.mehta@verveadvisory.com',
            join_time: new Date().toISOString()
          }
        }
      }
    };
    setCustomPayload(JSON.stringify(payload, null, 2));
  };

  const handleSendWebhook = () => {
    try {
      const parsed = JSON.parse(customPayload);
      ingestZoomWebhook(parsed);
      onClose();
    } catch (e: any) {
      showToast('error', 'Invalid JSON Payload', e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Zoom Webhook Event Simulator</h3>
              <p className="text-xs text-slate-500">Inject raw telemetry events into the Verve 48-Hour Attendance Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form & JSON Editor */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Advisory Consultant</label>
              <select
                value={selectedEmpId}
                onChange={(e) => handleUpdateTemplate(e.target.value, eventType)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-hidden"
              >
                {allEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.zoomUserId})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Zoom Event Type</label>
              <select
                value={eventType}
                onChange={(e) => handleUpdateTemplate(selectedEmpId, e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-hidden"
              >
                <option value="meeting.participant_joined">meeting.participant_joined (Join Session)</option>
                <option value="meeting.participant_left">meeting.participant_left (Leave Session)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Raw JSON Payload</label>
              <span className="text-[10px] font-mono text-slate-400">application/json</span>
            </div>
            <textarea
              rows={9}
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              className="w-full p-3 font-mono text-[11px] bg-slate-900 text-emerald-400 rounded-xl focus:outline-hidden border border-slate-700"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Auto-triggers reconciliation against shifts</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendWebhook}
                className="px-5 py-2 font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Inject Webhook</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
