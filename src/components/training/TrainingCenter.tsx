import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrainingModule, TrainingEnrollment } from '../../types';
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Award, 
  BookOpen, 
  Download, 
  Play, 
  Sparkles, 
  Search,
  ChevronRight
} from 'lucide-react';

export const TrainingCenter: React.FC = () => {
  const { 
    currentUser, 
    trainingModules, 
    trainingEnrollments, 
    enrollInTraining,
    updateTrainingProgress, 
    currentRole,
    exportDataToCsv 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Virtual Office & Culture', 'Valuation & Modeling', 'Compliance & POSH', 'Client Advisory Excellence'];

  const filteredModules = trainingModules.filter(m => {
    return activeCategory === 'ALL' || m.category === activeCategory;
  });

  const getEnrollment = (moduleId: string) => {
    return trainingEnrollments.find(e => e.trainingId === moduleId && e.employeeId === currentUser.id);
  };

  const handleSimulateProgress = (moduleId: string) => {
    const enrollment = getEnrollment(moduleId);
    if (!enrollment) {
      enrollInTraining(moduleId);
      return;
    }
    const current = enrollment.progressPercent || 0;
    const next = Math.min(100, current + 25);
    updateTrainingProgress(enrollment.id, next);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verve Academy
            </span>
            <span className="text-xs text-slate-400">• Financial Modeling & Compliance Certifications</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Advisory Academy & Training Center</h2>
          <p className="text-xs text-slate-500">
            Upskill in DCF valuation methods, POSH workplace standards, and M&A transaction mechanics.
          </p>
        </div>

        <button
          onClick={() => exportDataToCsv('Verve_Training_Enrollments', trainingEnrollments)}
          className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Enrollments</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              activeCategory === c 
                ? 'bg-emerald-600 text-white shadow-2xs' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map(mod => {
          const enrollment = getEnrollment(mod.id);
          const progress = enrollment?.progressPercent || 0;
          const isCompleted = progress === 100;

          return (
            <div
              key={mod.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    {mod.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{mod.durationHours}h • {mod.trainer}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2.5 leading-snug">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  {mod.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Completion Progress</span>
                    <span className="font-bold text-emerald-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {isCompleted ? (
                  <span className="flex items-center space-x-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Certified</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">
                    {progress > 0 ? 'In Progress' : 'Not Started'}
                  </span>
                )}

                <button
                  onClick={() => handleSimulateProgress(mod.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-xs flex items-center space-x-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{!enrollment ? 'Enroll' : progress < 100 ? '+25% Progress' : 'Review'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
