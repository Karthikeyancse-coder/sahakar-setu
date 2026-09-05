import React, { useState, useMemo } from 'react';
import {
  FileCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Users,
  CheckSquare,
  Square,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

export const NominationsManagement: React.FC = () => {
  const { nominations, programmes, updateNominationStatus, bulkUpdateNominationStatus } = useApp();

  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedCoop, setSelectedCoop] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Unique cooperative organizations from nominations
  const cooperativeOptions = useMemo(() => {
    const set = new Set<string>();
    nominations.forEach(n => {
      if (n.cooperativeName) set.add(n.cooperativeName);
    });
    return Array.from(set).sort();
  }, [nominations]);

  // Filtered nominations
  const filteredNominations = useMemo(() => {
    return nominations.filter(nom => {
      if (selectedProgrammeId !== 'all' && nom.programmeId !== selectedProgrammeId) {
        return false;
      }
      if (selectedStatus !== 'all' && nom.status !== selectedStatus) {
        return false;
      }
      if (selectedCoop !== 'all' && nom.cooperativeName !== selectedCoop) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = nom.traineeName?.toLowerCase().includes(query);
        const matchesEmail = nom.traineeEmail?.toLowerCase().includes(query);
        const matchesCoop = nom.cooperativeName?.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesCoop) {
          return false;
        }
      }
      return true;
    });
  }, [nominations, selectedProgrammeId, selectedStatus, selectedCoop, searchQuery]);

  // Pending items among the currently filtered nominations (for selection)
  const pendingFiltered = useMemo(() => {
    return filteredNominations.filter(n => n.status === 'pending');
  }, [filteredNominations]);

  const isAllPendingSelected = pendingFiltered.length > 0 && pendingFiltered.every(n => selectedIds.includes(n.id));

  const handleSelectAll = () => {
    if (isAllPendingSelected) {
      // Deselect all
      setSelectedIds([]);
    } else {
      // Select all pending rows in view
      setSelectedIds(pendingFiltered.map(n => n.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    bulkUpdateNominationStatus(selectedIds, 'approved');
    setFeedbackMessage({
      type: 'success',
      text: `Successfully approved ${selectedIds.length} candidate nominations.`
    });
    setSelectedIds([]);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleBulkReject = () => {
    if (selectedIds.length === 0) return;
    bulkUpdateNominationStatus(selectedIds, 'rejected');
    setFeedbackMessage({
      type: 'success',
      text: `Successfully rejected ${selectedIds.length} candidate nominations.`
    });
    setSelectedIds([]);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleRowApprove = (id: string, name: string) => {
    updateNominationStatus(id, 'approved');
    setSelectedIds(prev => prev.filter(item => item !== id));
    setFeedbackMessage({
      type: 'success',
      text: `Approved nomination for ${name}.`
    });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleRowReject = (id: string, name: string) => {
    updateNominationStatus(id, 'rejected');
    setSelectedIds(prev => prev.filter(item => item !== id));
    setFeedbackMessage({
      type: 'error',
      text: `Rejected nomination for ${name}.`
    });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Metric counts
  const totalCount = nominations.length;
  const pendingCount = nominations.filter(n => n.status === 'pending').length;
  const approvedCount = nominations.filter(n => n.status === 'approved').length;
  const rejectedCount = nominations.filter(n => n.status === 'rejected').length;

  return (
    <PageContainer>
      {/* 1. Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              Centralized Admissions & Approvals
            </span>
            <SimulatedBadge text="All Institute Programmes" />
          </div>
          <h2 className="text-2xl font-extrabold text-govText-primary mt-1">
            Trainee Nominations Management
          </h2>
          <p className="text-xs text-govText-secondary mt-1">
            Aggregated queue of all PACS, dairy, and cooperative society sponsored trainee candidates across all active courses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-govText-secondary">
            Institute: <strong className="text-govText-primary">VAMNICOM Pune</strong>
          </span>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-govText-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-govText-secondary">Total Received</span>
            <Users className="w-4 h-4 text-govTeal-600" />
          </div>
          <p className="text-2xl font-extrabold text-govText-primary mt-2">{totalCount}</p>
          <span className="text-[10px] text-govText-muted">Across all programmes</span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-900 mt-2">{pendingCount}</p>
          <span className="text-[10px] text-amber-700 font-medium">Requires immediate action</span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-900 mt-2">{approvedCount}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Hostel & batch ready</span>
        </div>

        <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900">Rejected / Waitlist</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-900 mt-2">{rejectedCount}</p>
          <span className="text-[10px] text-rose-700 font-medium">Archived nominations</span>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 shadow-sm animate-fadeIn ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* 3. Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-govText-border shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex bg-govBg p-1 rounded-xl border border-gray-200 text-xs font-semibold overflow-x-auto scrollbar-none">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-govTeal-600 text-white shadow-xs font-bold'
                    : 'text-govText-secondary hover:text-govText-primary'
                }`}
              >
                {st === 'all' ? 'All' : st}
                {st === 'pending' && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-amber-950 font-extrabold">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-auto sm:min-w-[240px] sm:max-w-sm">
            <Search className="w-4 h-4 text-govText-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate, email, or society..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-govBg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-govTeal-500 focus:bg-white min-h-[40px]"
            />
          </div>
        </div>

        {/* Dropdown Filters: Programme & Cooperative */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-gray-100 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
            <span className="text-govText-secondary font-medium whitespace-nowrap">Programme:</span>
            <select
              value={selectedProgrammeId}
              onChange={e => setSelectedProgrammeId(e.target.value)}
              className="bg-govBg border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-govText-primary font-medium focus:outline-none focus:ring-1 focus:ring-govTeal-500 w-full sm:w-auto max-w-full truncate min-h-[38px]"
            >
              <option value="all">All Programmes ({nominations.length})</option>
              {programmes.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
            <span className="text-govText-secondary font-medium whitespace-nowrap">Cooperative:</span>
            <select
              value={selectedCoop}
              onChange={e => setSelectedCoop(e.target.value)}
              className="bg-govBg border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-govText-primary font-medium focus:outline-none focus:ring-1 focus:ring-govTeal-500 w-full sm:w-auto max-w-full sm:max-w-xs truncate min-h-[38px]"
            >
              <option value="all">All Cooperatives</option>
              {cooperativeOptions.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {(selectedProgrammeId !== 'all' || selectedStatus !== 'all' || selectedCoop !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedProgrammeId('all');
                setSelectedStatus('all');
                setSelectedCoop('all');
                setSearchQuery('');
              }}
              className="text-xs text-govTeal-700 hover:text-govTeal-900 font-semibold underline sm:ml-auto self-start sm:self-auto py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. Bulk Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-govTeal-900 text-white p-3.5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <span className="w-6 h-6 rounded-full bg-saffron-400 text-govTeal-950 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {selectedIds.length}
            </span>
            <span>Candidates Selected for Batch Review</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkApprove}
              className="flex-1 sm:flex-initial px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bulk Approve</span>
            </button>
            <button
              onClick={handleBulkReject}
              className="flex-1 sm:flex-initial px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Bulk Reject</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-2 bg-govTeal-800 hover:bg-govTeal-700 text-govTeal-100 rounded-lg text-xs font-medium transition-colors min-h-[40px] cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* 5. Aggregated Nominations Table */}
      <div className="bg-white rounded-2xl border border-govText-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-govBg/50">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-govText-primary">
              Showing {filteredNominations.length} Candidate Nominations
            </h3>
            {pendingFiltered.length > 0 && (
              <span className="text-[11px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                {pendingFiltered.length} Pending Actions
              </span>
            )}
          </div>

          <span className="text-xs text-govText-muted">
            National Council for Cooperative Training (NCCT)
          </span>
        </div>

        {/* Desktop Table View (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-govBg text-govText-secondary uppercase font-semibold border-b border-gray-200 select-none">
                <th className="p-3 w-10 text-center">
                  <button
                    onClick={handleSelectAll}
                    disabled={pendingFiltered.length === 0}
                    title={isAllPendingSelected ? "Deselect All Pending" : "Select All Pending"}
                    className="flex items-center justify-center text-govTeal-700 disabled:opacity-30"
                  >
                    {isAllPendingSelected ? (
                      <CheckSquare className="w-4 h-4 text-govTeal-700" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="p-3">Candidate</th>
                <th className="p-3">Cooperative Organization</th>
                <th className="p-3">Programme Applied To</th>
                <th className="p-3">Nominated Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Approval Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNominations.length > 0 ? (
                filteredNominations.map(nom => {
                  const prog = programmes.find(p => p.id === nom.programmeId);
                  const isSelected = selectedIds.includes(nom.id);
                  const isPending = nom.status === 'pending';

                  return (
                    <tr
                      key={nom.id}
                      className={`hover:bg-govTeal-50/30 transition-colors ${
                        isSelected ? 'bg-govTeal-50/50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center">
                        {isPending ? (
                          <button
                            onClick={() => handleToggleRow(nom.id)}
                            className="flex items-center justify-center text-govTeal-700 mx-auto"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-govTeal-700" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        ) : (
                          <span className="text-gray-300 font-mono text-[10px]">—</span>
                        )}
                      </td>

                      {/* Candidate */}
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-govTeal-100 text-govTeal-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {nom.traineeName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-govText-primary truncate">
                              {nom.traineeName}
                            </p>
                            <p className="text-[10px] text-govText-secondary font-mono truncate">
                              {nom.traineeEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Cooperative */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 text-govText-primary font-medium">
                          <Building2 className="w-3.5 h-3.5 text-govTeal-600 flex-shrink-0" />
                          <span className="truncate max-w-[220px]">{nom.cooperativeName}</span>
                        </div>
                      </td>

                      {/* Programme */}
                      <td className="p-3">
                        <span className="inline-block font-semibold text-govTeal-800 bg-govTeal-50/80 px-2 py-0.5 rounded border border-govTeal-200 max-w-[240px] truncate">
                          {prog ? prog.title : nom.programmeId}
                        </span>
                      </td>

                      {/* Nominated Date */}
                      <td className="p-3 text-govText-muted font-mono whitespace-nowrap">
                        {nom.nominatedDate}
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            nom.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : nom.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {nom.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right whitespace-nowrap">
                        {isPending ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleRowApprove(nom.id, nom.traineeName)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRowReject(nom.id, nom.traineeName)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-govText-muted italic">
                            {nom.status === 'approved' ? 'Enrolled in Batch' : 'Archived'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-govText-muted">
                    <p className="font-semibold text-sm">No nominations matched your filters</p>
                    <p className="text-xs mt-1">Try selecting "All Programmes" or clear your search keyword.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Candidate Card View (< 768px) */}
        <div className="block md:hidden divide-y divide-gray-100">
          {/* Mobile Select All Bar */}
          {pendingFiltered.length > 0 && (
            <div className="p-3 bg-govBg/70 border-b border-gray-100 flex items-center justify-between text-xs font-semibold">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-govTeal-800 min-h-[36px]"
              >
                {isAllPendingSelected ? (
                  <CheckSquare className="w-4 h-4 text-govTeal-700" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
                <span>{isAllPendingSelected ? 'Deselect All Pending' : 'Select All Pending for Bulk Action'}</span>
              </button>
            </div>
          )}

          {filteredNominations.length > 0 ? (
            filteredNominations.map(nom => {
              const prog = programmes.find(p => p.id === nom.programmeId);
              const isSelected = selectedIds.includes(nom.id);
              const isPending = nom.status === 'pending';

              return (
                <div
                  key={nom.id}
                  className={`p-4 space-y-3 transition-colors ${
                    isSelected ? 'bg-govTeal-50/50' : 'hover:bg-govBg/40'
                  }`}
                >
                  {/* Candidate Header */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isPending && (
                        <button
                          onClick={() => handleToggleRow(nom.id)}
                          className="flex items-center justify-center text-govTeal-700 flex-shrink-0 p-1"
                          aria-label={`Select ${nom.traineeName}`}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-govTeal-700" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      )}
                      <div className="w-8 h-8 rounded-full bg-govTeal-100 text-govTeal-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {nom.traineeName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-govText-primary truncate leading-tight">
                          {nom.traineeName}
                        </p>
                        <p className="text-[11px] text-govText-muted truncate mt-0.5">
                          {nom.traineeEmail}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                        nom.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : nom.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {nom.status}
                    </span>
                  </div>

                  {/* Cooperative Details */}
                  <div className="bg-govBg/80 p-2.5 rounded-xl border border-gray-100 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-govText-primary font-medium">
                      <Building2 className="w-3.5 h-3.5 text-govTeal-600 flex-shrink-0" />
                      <span className="truncate">{nom.cooperativeName}</span>
                    </div>

                    <div className="pt-1 text-[11px] text-govText-secondary">
                      <span className="text-govText-muted font-medium">Programme: </span>
                      <strong className="text-govTeal-800">{prog ? prog.title : nom.programmeId}</strong>
                    </div>

                    <div className="text-[10px] text-govText-muted flex items-center gap-1 pt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>Nominated Date: {nom.nominatedDate}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {isPending ? (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleRowApprove(nom.id, nom.traineeName)}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRowReject(nom.id, nom.traineeName)}
                        className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-right text-[11px] text-govText-muted font-medium">
                      {nom.status === 'approved' ? '✓ Enrolled in Programme Batch' : '✕ Nomination Archived'}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-govText-muted space-y-1">
              <p className="font-semibold text-sm">No nominations found</p>
              <p className="text-xs">Adjust your status or cooperative filters.</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
