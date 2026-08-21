import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Policy } from '../../types';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  FileEdit, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface PolicyEditorModalProps {
  policy?: Policy | null; // null for creating new policy
  isOpen: boolean;
  onClose: () => void;
}

export const PolicyEditorModal: React.FC<PolicyEditorModalProps> = ({
  policy,
  isOpen,
  onClose
}) => {
  const { currentRole, updatePolicy, addPolicy } = useApp();

  const isEditing = !!policy;

  const [title, setTitle] = useState(policy ? policy.title : '');
  const [category, setCategory] = useState<Policy['category']>(policy ? policy.category : 'Governance');
  const [version, setVersion] = useState(policy ? policy.version : 'v1.0');
  const [effectiveDate, setEffectiveDate] = useState(policy ? policy.effectiveDate : new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<Policy['status']>(policy ? policy.status : 'Active');
  const [summary, setSummary] = useState(policy ? policy.summary : '');
  const [keyHighlights, setKeyHighlights] = useState<string[]>(policy ? [...policy.keyHighlights] : ['']);
  const [fullText, setFullText] = useState<string[]>(policy ? [...policy.fullText] : ['']);
  
  // Comprehension check
  const [requiresComprehension, setRequiresComprehension] = useState(policy ? !!policy.requiresComprehensionCheck : false);
  const [questionText, setQuestionText] = useState(policy?.comprehensionQuestion?.question || '');
  const [options, setOptions] = useState<string[]>(policy?.comprehensionQuestion?.options || ['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState<number>(policy?.comprehensionQuestion?.correctIndex || 0);

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // RBAC Guard: Super Admin check
  if (currentRole !== 'super_admin') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-rose-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Access Denied</h3>
          <p className="text-xs text-slate-600">
            Only Super Admin has master authority to create or update firm-wide governance policies.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleAddHighlight = () => setKeyHighlights(prev => [...prev, '']);
  const handleRemoveHighlight = (index: number) => setKeyHighlights(prev => prev.filter((_, i) => i !== index));
  const handleUpdateHighlight = (index: number, val: string) => {
    setKeyHighlights(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleAddParagraph = () => setFullText(prev => [...prev, '']);
  const handleRemoveParagraph = (index: number) => setFullText(prev => prev.filter((_, i) => i !== index));
  const handleUpdateParagraph = (index: number, val: string) => {
    setFullText(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter a policy title.');
      return;
    }
    if (!summary.trim()) {
      setErrorMsg('Please enter an executive summary.');
      return;
    }

    const filteredHighlights = keyHighlights.map(k => k.trim()).filter(Boolean);
    if (filteredHighlights.length === 0) {
      setErrorMsg('Please provide at least one key highlight.');
      return;
    }

    const filteredFullText = fullText.map(t => t.trim()).filter(Boolean);
    if (filteredFullText.length === 0) {
      setErrorMsg('Please provide at least one detailed policy text section.');
      return;
    }

    let comprehensionPayload = undefined;
    if (requiresComprehension) {
      if (!questionText.trim()) {
        setErrorMsg('Please provide a comprehension question text.');
        return;
      }
      const validOptions = options.map(o => o.trim()).filter(Boolean);
      if (validOptions.length < 2) {
        setErrorMsg('Please provide at least 2 comprehension options.');
        return;
      }
      comprehensionPayload = {
        question: questionText.trim(),
        options: validOptions,
        correctIndex: Math.min(correctIndex, validOptions.length - 1)
      };
    }

    if (isEditing && policy) {
      updatePolicy(policy.id, {
        title: title.trim(),
        category,
        version: version.trim(),
        effectiveDate,
        status,
        summary: summary.trim(),
        keyHighlights: filteredHighlights,
        fullText: filteredFullText,
        requiresComprehensionCheck: requiresComprehension,
        comprehensionQuestion: comprehensionPayload
      });
    } else {
      addPolicy({
        title: title.trim(),
        category,
        version: version.trim() || 'v1.0',
        effectiveDate: effectiveDate || new Date().toISOString().split('T')[0],
        status,
        summary: summary.trim(),
        keyHighlights: filteredHighlights,
        fullText: filteredFullText,
        requiresComprehensionCheck: requiresComprehension,
        comprehensionQuestion: comprehensionPayload
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  {isEditing ? `Edit Governance Policy: ${policy.title}` : 'Author New Company Policy'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                  Super Admin Authority
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Authorized policy modifications will update master governance across the advisory firm.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Primary Meta Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Policy Document Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Comprehensive Virtual Workplace & Attendance Mandate"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Governance Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Policy['category'])}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Virtual Office">Virtual Office</option>
                <option value="Time & Wellbeing">Time & Wellbeing</option>
                <option value="Code of Conduct">Code of Conduct</option>
                <option value="Governance">Governance</option>
                <option value="Security & IP">Security & IP</option>
                <option value="Separation">Separation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Version Identifier *
              </label>
              <input
                type="text"
                required
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. v2.5"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Effective Date *
              </label>
              <input
                type="date"
                required
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Policy Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Policy['status'])}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Active">Active & Enforced</option>
                <option value="Draft">Draft (Internal Review)</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Executive Summary *
            </label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="High-level executive briefing of policy requirements and compliance mandates..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* Key Highlights */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Key Governance Principles (Pillars)
              </label>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold inline-flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Principle</span>
              </button>
            </div>

            <div className="space-y-2">
              {keyHighlights.map((kh, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="text-slate-400 font-mono text-[11px] w-5 text-right">{idx + 1}.</span>
                  <input
                    type="text"
                    value={kh}
                    onChange={(e) => handleUpdateHighlight(idx, e.target.value)}
                    placeholder={`Governance principle ${idx + 1}...`}
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  {keyHighlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Policy Framework Sections */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Detailed Policy Framework & Clauses
              </label>
              <button
                type="button"
                onClick={handleAddParagraph}
                className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold inline-flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Clause Paragraph</span>
              </button>
            </div>

            <div className="space-y-3">
              {fullText.map((para, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="text-slate-400 font-mono text-[11px] w-5 text-right mt-2">§{idx + 1}</span>
                  <textarea
                    rows={2}
                    value={para}
                    onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                    placeholder={`Legal clause and guidelines paragraph ${idx + 1}...`}
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
                  />
                  {fullText.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveParagraph(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Comprehension Check Toggle */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresComprehension}
                onChange={(e) => setRequiresComprehension(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="font-semibold text-slate-900 text-xs">
                Enforce Mandatory Comprehension Verification Check Prior to Signing
              </div>
            </label>

            {requiresComprehension && (
              <div className="space-y-3 pt-2 pl-6 border-l-2 border-indigo-200 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Comprehension Question *
                  </label>
                  <input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="e.g. Under the No-Leave Policy, what is the minimum required annual rest window?"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Options (Select the radio button for the correct answer)
                  </label>
                  {options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="correct-option"
                        checked={correctIndex === oIdx}
                        onChange={() => setCorrectIndex(oIdx)}
                        className="text-indigo-600"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const copy = [...options];
                          copy[oIdx] = e.target.value;
                          setOptions(copy);
                        }}
                        placeholder={`Option ${oIdx + 1}`}
                        className={`flex-1 px-3 py-1.5 text-xs border rounded-lg focus:outline-hidden ${
                          correctIndex === oIdx ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200'
                        }`}
                      />
                      {correctIndex === oIdx && (
                        <span className="text-[10px] font-bold text-emerald-600 font-mono">
                          CORRECT
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save & Enforce Policy Changes' : 'Publish Governance Policy'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
