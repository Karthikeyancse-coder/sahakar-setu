import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  MapPin,
  Sparkles,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Programme } from '../../types';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { PageContainer } from '../../components/layout/PageContainer';

export const ProgrammesManagement: React.FC = () => {
  const {
    programmes,
    nominations,
    updateNominationStatus,
    bulkImportNominations,
    institutes,
    currentUser,
  } = useApp();

  const [selectedProgrammeId, setSelectedProgrammeId] = useState(programmes[0]?.id || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  // New Programme Form State
  const [newTitle, setNewTitle] = useState('');
  const [newStartDate, setNewStartDate] = useState('2026-04-01');
  const [newEndDate, setNewEndDate] = useState('2026-04-15');
  const [newMode, setNewMode] = useState<'residential' | 'online' | 'hybrid'>('residential');
  const [newCapacity, setNewCapacity] = useState(50);
  const [newCategory, setNewCategory] = useState('PACS Digitalization');

  // CSV Mock Input
  const [csvText, setCsvText] = useState(
    `Vikas More, vikas.more@pacs.org, Kolhapur District PACS\nPooja Sharma, pooja.s@dairy.coop, Anand Milk Producers\nSachin Kale, sachin.k@shg.mah.in, Sangli Women Federation`
  );

  const selectedProgramme = programmes.find(p => p.id === selectedProgrammeId) || programmes[0];
  const programmeNominations = nominations.filter(n => n.programmeId === selectedProgramme?.id);

  const handleBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = csvText.trim().split('\n');
    const parsed = lines.map(line => {
      const [name, email, coop] = line.split(',').map(s => s?.trim() || '');
      return { name, email, coop };
    }).filter(r => r.name && r.email);

    const count = bulkImportNominations(selectedProgramme.id, parsed);
    setImportSuccessMsg(`Successfully imported and approved ${count} trainee nominations!`);
    setTimeout(() => {
      setImportSuccessMsg(null);
      setIsCsvModalOpen(false);
    }, 2000);
  };

  return (
    <PageContainer>
      
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-govText-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              Training-ERP Module
            </span>
            <SimulatedBadge text="Federated Capacity Planning" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-govText-primary mt-1 leading-snug">
            Programmes & Trainee Nominations
          </h2>
          <p className="text-xs text-govText-secondary mt-1 leading-relaxed">
            Manage residential batches, state quotas, and institutional nominations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-govTeal-50 hover:bg-govTeal-100 text-govTeal-800 text-xs font-bold rounded-xl border border-govTeal-200 flex items-center justify-center gap-1.5 transition-colors min-h-[40px] cursor-pointer"
          >
            <Upload className="w-4 h-4 text-govTeal-700" />
            <span>Bulk CSV Import</span>
          </button>
        </div>
      </div>

      {/* Programmes List Grid: Stacks vertically on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {programmes.map(prog => {
          const isSelected = selectedProgrammeId === prog.id;
          const inst = institutes.find(i => i.id === prog.instituteId);
          const progNoms = nominations.filter(n => n.programmeId === prog.id);
          const approvedCount = progNoms.filter(n => n.status === 'approved').length;

          return (
            <div
              key={prog.id}
              onClick={() => setSelectedProgrammeId(prog.id)}
              className={`bg-white rounded-2xl p-4 sm:p-5 border-2 cursor-pointer transition-all space-y-3.5 shadow-sm hover:shadow-md ${
                isSelected
                  ? 'border-govTeal-600 ring-2 ring-govTeal-600/20'
                  : 'border-govText-border hover:border-govTeal-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200 uppercase">
                  {prog.mode}
                </span>
                <span className="text-xs font-semibold text-govText-muted">
                  {prog.startDate} to {prog.endDate}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-govText-primary leading-snug">
                  {prog.title}
                </h3>
                <p className="text-xs text-govTeal-700 mt-1 font-medium">
                  {inst?.name}
                </p>
              </div>

              {/* Capacity Bar */}
              <div className="space-y-1 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-govText-secondary">Enrolled / Capacity</span>
                  <span className="text-govTeal-800">{approvedCount} / {prog.capacity}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-govTeal-600 rounded-full"
                    style={{ width: `${Math.min(100, (approvedCount / prog.capacity) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nominations for Selected Programme */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-govText-border shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-govText-primary">
              Nominations: <span className="text-govTeal-700">{selectedProgramme?.title}</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-govText-secondary">
              Review and authorize trainee nominations from primary societies
            </p>
          </div>

          <span className="text-xs font-bold text-govTeal-800 bg-govBg px-3 py-1 rounded-lg border border-gray-200 self-start sm:self-auto">
            {programmeNominations.length} Candidates Nominated
          </span>
        </div>

        {/* Desktop Table View (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-govBg text-govText-secondary uppercase font-semibold border-b border-gray-200">
                <th className="p-3">Trainee Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Cooperative Organization</th>
                <th className="p-3">Nominated Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Approval Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {programmeNominations.map(nom => (
                <tr key={nom.id} className="hover:bg-govTeal-50/30 transition-colors">
                  <td className="p-3 font-bold text-govText-primary">{nom.traineeName}</td>
                  <td className="p-3 text-govText-secondary">{nom.traineeEmail}</td>
                  <td className="p-3 text-govText-primary font-medium">{nom.cooperativeName}</td>
                  <td className="p-3 text-govText-muted font-mono">{nom.nominatedDate}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      nom.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : nom.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {nom.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {nom.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => updateNominationStatus(nom.id, 'approved')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateNominationStatus(nom.id, 'rejected')}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-govText-muted">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Candidate Card View (< 768px) */}
        <div className="block md:hidden divide-y divide-gray-100">
          {programmeNominations.map(nom => (
            <div key={nom.id} className="py-3.5 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-sm text-govText-primary">{nom.traineeName}</p>
                  <p className="text-[11px] text-govText-muted font-mono">{nom.traineeEmail}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  nom.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : nom.status === 'rejected'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {nom.status}
                </span>
              </div>

              <div className="text-xs text-govText-secondary space-y-0.5">
                <p><span className="text-govText-muted">Society: </span>{nom.cooperativeName}</p>
                <p><span className="text-govText-muted">Date: </span>{nom.nominatedDate}</p>
              </div>

              {nom.status === 'pending' && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => updateNominationStatus(nom.id, 'approved')}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold min-h-[44px] flex items-center justify-center cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateNominationStatus(nom.id, 'rejected')}
                    className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold min-h-[44px] flex items-center justify-center cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bulk CSV Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-govTeal-200 w-full max-w-lg overflow-hidden">
            <div className="bg-govTeal-800 text-white p-5">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-saffron-300" />
                <span>Bulk CSV Trainee Nominations</span>
              </h3>
              <p className="text-xs text-govTeal-100 mt-0.5">
                Import multiple PACS candidates in a single batch
              </p>
            </div>

            <form onSubmit={handleBulkImport} className="p-6 space-y-4">
              {importSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{importSuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-govText-secondary mb-1">
                  Format: Name, Email, Cooperative (One per line)
                </label>
                <textarea
                  rows={6}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full p-3 font-mono text-xs rounded-xl border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-govText-primary text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-govTeal-600 hover:bg-govTeal-700 text-white text-xs font-bold rounded-xl shadow"
                >
                  Import Candidates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </PageContainer>
  );
};
