import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentRecord, DocumentCategory } from '../../types';
import { 
  FolderLock, 
  Upload, 
  Download, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Search, 
  Eye, 
  Lock,
  PlusCircle,
  Filter
} from 'lucide-react';

export const DocumentVault: React.FC = () => {
  const { 
    currentUser, 
    documents, 
    uploadDocument, 
    verifyDocument, 
    currentRole,
    allEmployees,
    exportDataToCsv 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form State
  const [docForm, setDocForm] = useState({
    targetEmployeeId: currentUser.id,
    documentName: '',
    category: 'Identity' as DocumentRecord['category'],
    accessLevel: 'Employee' as DocumentRecord['accessLevel'],
    fileName: 'document_scan.pdf',
    fileSize: '2.4 MB'
  });

  const categories: DocumentRecord['category'][] = ['Identity', 'Employment', 'Joining', 'Policy', 'Performance', 'Training', 'Reimbursement', 'Exit'];

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.documentName) return;

    const targetEmp = allEmployees.find(emp => emp.id === docForm.targetEmployeeId) || currentUser;

    uploadDocument({
      employeeId: targetEmp.id,
      employeeName: targetEmp.fullName,
      documentName: docForm.documentName,
      category: docForm.category,
      fileName: `${docForm.documentName.replace(/\s+/g, '_')}.pdf`,
      fileSize: docForm.fileSize,
      accessLevel: docForm.accessLevel
    });

    setIsUploadModalOpen(false);
    setDocForm({
      targetEmployeeId: currentUser.id,
      documentName: '',
      category: 'Identity',
      accessLevel: 'Employee',
      fileName: 'document_scan.pdf',
      fileSize: '2.4 MB'
    });
  };

  const visibleDocs = ['super_admin', 'hr_admin'].includes(currentRole)
    ? documents
    : documents.filter(d => d.employeeId === currentUser.id);

  const filteredDocs = visibleDocs.filter(d => {
    const matchesCategory = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchesSearch = 
      d.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Encrypted Storage
            </span>
            <span className="text-xs text-slate-400">• Employee Vault</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Digital Document Vault & KYC Repository</h2>
          <p className="text-xs text-slate-500">
            Securely manage joining agreements, tax records, identification cards, and degrees.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => exportDataToCsv('Verve_Document_Vault_Audit', visibleDocs)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Registry</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex overflow-x-auto gap-1.5 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              selectedCategory === 'ALL' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                selectedCategory === cat ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by name, consultant..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {doc.category}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                  doc.status === 'Pending Verification' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {doc.status}
                </span>
              </div>

              <div className="flex items-center space-x-3 mt-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1 truncate">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{doc.documentName}</h4>
                  <p className="text-xs text-slate-400 truncate">{doc.fileName} • {doc.fileSize}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Owner:</span>
                  <span className="font-semibold text-slate-800">{doc.employeeName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Access Tier:</span>
                  <span className="font-mono text-indigo-600">{doc.accessLevel}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
              </span>

              <div className="flex items-center space-x-1.5">
                {['super_admin', 'hr_admin'].includes(currentRole) && doc.status === 'Pending Verification' && (
                  <button
                    onClick={() => verifyDocument(doc.id, 'Verified')}
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold cursor-pointer"
                  >
                    Verify
                  </button>
                )}
                <button
                  onClick={() => alert(`Simulating secure download for ${doc.fileName}`)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Upload to Document Vault</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4 text-xs">
              {['super_admin', 'hr_admin'].includes(currentRole) && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Employee</label>
                  <select
                    value={docForm.targetEmployeeId}
                    onChange={(e) => setDocForm({ ...docForm, targetEmployeeId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-hidden"
                  >
                    {allEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.department})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title / Name *</label>
                <input
                  type="text"
                  required
                  value={docForm.documentName}
                  onChange={(e) => setDocForm({ ...docForm, documentName: e.target.value })}
                  placeholder="e.g. Master of Business Administration Degree"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Classification Category</label>
                  <select
                    value={docForm.category}
                    onChange={(e) => setDocForm({ ...docForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-hidden"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Access Level</label>
                  <select
                    value={docForm.accessLevel}
                    onChange={(e) => setDocForm({ ...docForm, accessLevel: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-hidden"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="HR">HR</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2 bg-slate-50">
                <Upload className="w-8 h-8 text-indigo-500 mx-auto" />
                <div className="text-slate-700 font-semibold">Drop PDF/PNG files here or click to browse</div>
                <div className="text-[10px] text-slate-400">PDF, PNG, JPG up to 25MB (Encrypted AES-256)</div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md cursor-pointer"
                >
                  Upload & Secure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
