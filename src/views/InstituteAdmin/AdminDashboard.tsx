import React from 'react';
import {
  Users,
  Layers,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  BedDouble,
  QrCode,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { PageContainer } from '../../components/layout/PageContainer';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    programmes,
    nominations,
    updateNominationStatus,
    sessions,
    attendance,
    hostelBeds,
    navigate,
    institutes,
    t
  } = useApp();

  const userInstituteId = currentUser.instituteId || 'inst-vamnicom';
  const institute = institutes.find(i => i.id === userInstituteId) || institutes[0];

  const instProgrammes = programmes.filter(p => p.instituteId === userInstituteId);
  const pendingNominations = nominations.filter(n => n.status === 'pending');
  const occupiedBeds = hostelBeds.filter(b => b.status === 'occupied').length;

  return (
    <PageContainer>
      
      {/* 1. Institute Information Hero Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-govText-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              {institute.type} Operations Portal
            </span>
            <SimulatedBadge text="Institute ERP Live Node" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-govText-primary leading-snug break-words">
            {institute.name}
          </h2>
          <p className="text-xs text-govText-secondary leading-relaxed">
            Director: <strong className="text-govText-primary">{institute.director}</strong> • City: {institute.city}, {institute.state}
          </p>
        </div>

        <div className="flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={() => navigate('/institute-admin/sessions')}
            className="w-full sm:w-auto px-4 py-3 sm:py-2.5 bg-govTeal-600 hover:bg-govTeal-700 text-white font-bold rounded-xl text-xs shadow-xs flex items-center justify-center gap-2 min-h-[44px] cursor-pointer transition-colors"
          >
            <QrCode className="w-4 h-4 text-saffron-300" />
            <span>Launch Attendance Kiosk</span>
          </button>
        </div>
      </div>

      {/* 2. Metric Cards Grid: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-govText-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-govText-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Enrolled Trainees</span>
            <div className="w-9 h-9 rounded-xl bg-govTeal-50 flex items-center justify-center text-govTeal-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-govText-primary">
            {institute.activeCount}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Capacity: {institute.capacity} Seats</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-govText-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-govText-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Active Programmes</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-govText-primary">
            {instProgrammes.length}
          </p>
          <p className="text-[11px] text-govText-secondary">
            Residential & Hybrid Batches
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-govText-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-govText-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Nominations</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-900">
            {pendingNominations.length}
          </p>
          <p className="text-[11px] text-amber-700 font-semibold">
            Requires Admin Action
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-govText-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-govText-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Hostel Occupancy</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-govText-primary">
            {occupiedBeds} / {hostelBeds.length}
          </p>
          <p className="text-[11px] text-purple-700 font-semibold">
            {Math.round((occupiedBeds / hostelBeds.length) * 100)}% Beds Allocated
          </p>
        </div>

      </div>

      {/* 3. Grid: Pending Nominations & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Pending Nominations Table (7 cols on desktop, full width on mobile) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-6 border border-govText-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-govText-primary truncate">
                Trainee Nominations Management
              </h3>
              <p className="text-[11px] sm:text-xs text-govText-secondary truncate">
                PACS & Dairy cooperative candidate applications
              </p>
            </div>
            <button
              onClick={() => navigate('/institute-admin/nominations')}
              className="text-xs font-bold text-govTeal-700 hover:text-govTeal-900 flex items-center gap-1 flex-shrink-0 cursor-pointer min-h-[36px]"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Desktop/Tablet Table View (>= 640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-govBg text-govText-secondary uppercase font-semibold border-b border-gray-200">
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Cooperative</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {nominations.slice(0, 5).map(nom => (
                  <tr key={nom.id} className="hover:bg-govTeal-50/30 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-govText-primary">{nom.traineeName}</p>
                      <p className="text-[10px] text-govText-muted">{nom.traineeEmail}</p>
                    </td>
                    <td className="p-3 text-govText-secondary">{nom.cooperativeName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
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
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => updateNominationStatus(nom.id, 'approved')}
                            className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer transition-colors"
                            title="Approve Nomination"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateNominationStatus(nom.id, 'rejected')}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer transition-colors"
                            title="Reject Nomination"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[10px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List (< 640px) */}
          <div className="block sm:hidden space-y-3">
            {nominations.slice(0, 4).map(nom => (
              <div
                key={nom.id}
                className="bg-govBg/70 p-3.5 rounded-xl border border-gray-200 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-govText-primary truncate">{nom.traineeName}</p>
                    <p className="text-[10px] text-govText-secondary truncate mt-0.5">{nom.cooperativeName}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex-shrink-0 ${
                    nom.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : nom.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {nom.status}
                  </span>
                </div>

                {nom.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-200/60">
                    <button
                      onClick={() => updateNominationStatus(nom.id, 'approved')}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => updateNominationStatus(nom.id, 'rejected')}
                      className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Scheduled Sessions & Kiosk Link (5 cols on desktop, full width on mobile) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-6 border border-govText-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-sm sm:text-base text-govText-primary">
              Today's Live Sessions
            </h3>
            <span className="text-xs font-bold text-saffron-600 bg-saffron-50 px-2.5 py-0.5 rounded">
              {sessions.length} Scheduled
            </span>
          </div>

          <div className="space-y-3">
            {sessions.map(sess => (
              <div
                key={sess.id}
                className="bg-govBg p-3.5 sm:p-4 rounded-xl border border-govTeal-100 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-govTeal-700 uppercase">
                    {sess.timeSlot}
                  </span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded font-mono border border-gray-200">
                    {attendance.filter(a => a.sessionId === sess.id).length} Present
                  </span>
                </div>
                <h4 className="font-bold text-xs text-govText-primary">{sess.title}</h4>
                <p className="text-[11px] text-govText-secondary">{sess.room}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/institute-admin/timetable')}
            className="w-full py-3 sm:py-2.5 bg-govBg hover:bg-gray-100 text-govText-primary text-xs font-bold rounded-xl border border-govText-border flex items-center justify-center gap-2 min-h-[44px] cursor-pointer transition-colors"
          >
            <Calendar className="w-4 h-4 text-govTeal-600" />
            <span>Manage Weekly Timetable & Hostels</span>
          </button>
        </div>

      </div>

    </PageContainer>
  );
};
