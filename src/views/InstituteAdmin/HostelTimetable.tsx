import React, { useState } from 'react';
import {
  BedDouble,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Building,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { PageContainer } from '../../components/layout/PageContainer';

export const HostelTimetable: React.FC = () => {
  const { hostelBeds, updateHostelBed, timetable, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'hostel' | 'timetable'>('hostel');
  const [selectedBlock, setSelectedBlock] = useState<string>('all');

  const blocks = ['all', 'Block A (Men)', 'Block B (Women)', 'Executive Guest Block'];

  const filteredBeds = hostelBeds.filter(
    b => selectedBlock === 'all' || b.block === selectedBlock
  );

  const toggleBedStatus = (bedId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'occupied' ? 'vacant' : 'occupied';
    updateHostelBed(bedId, {
      status: nextStatus as any,
      traineeName: nextStatus === 'vacant' ? undefined : 'Allocated Candidate',
    });
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <PageContainer>
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              Residential Logistics ERP
            </span>
            <SimulatedBadge text="Campus Facility Operations" />
          </div>
          <h2 className="text-2xl font-extrabold text-govText-primary">
            Hostel Bed Allocation & Academic Timetable
          </h2>
          <p className="text-xs text-govText-secondary mt-1">
            Real-time room occupancy management and multi-room timetable scheduling.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-govBg p-1.5 rounded-xl border border-govTeal-100">
          <button
            onClick={() => setActiveTab('hostel')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'hostel'
                ? 'bg-govTeal-600 text-white shadow'
                : 'text-govText-secondary hover:text-govText-primary'
            }`}
          >
            <BedDouble className="w-4 h-4" />
            <span>Hostel Accommodation</span>
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'timetable'
                ? 'bg-govTeal-600 text-white shadow'
                : 'text-govText-secondary hover:text-govText-primary'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Weekly Timetable Grid</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Hostel Room & Bed Allocation */}
      {activeTab === 'hostel' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-govText-secondary">Filter by Block:</span>
              <div className="flex gap-2">
                {blocks.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBlock(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedBlock === b
                        ? 'bg-govTeal-600 text-white shadow-sm'
                        : 'bg-govBg hover:bg-gray-100 text-govText-secondary'
                    }`}
                  >
                    {b === 'all' ? 'All Blocks' : b}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                {hostelBeds.filter(b => b.status === 'occupied').length} Occupied
              </span>
              <span className="text-govText-muted bg-gray-100 px-2.5 py-1 rounded">
                {hostelBeds.filter(b => b.status === 'vacant').length} Vacant
              </span>
            </div>
          </div>

          {/* Beds Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredBeds.map(bed => {
              const isOccupied = bed.status === 'occupied';

              return (
                <div
                  key={bed.id}
                  className={`bg-white rounded-2xl border-2 p-5 space-y-3 transition-all shadow-sm hover:shadow-md ${
                    isOccupied ? 'border-govTeal-300' : 'border-gray-200 opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold font-mono text-govTeal-800 bg-govTeal-50 px-2 py-0.5 rounded border border-govTeal-200">
                      Room {bed.roomNumber} • {bed.bedNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      isOccupied ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {bed.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-govText-secondary truncate">
                    {bed.block}
                  </p>

                  <div className="bg-govBg p-3 rounded-xl border border-gray-100 min-h-[48px] flex items-center gap-2">
                    <User className="w-4 h-4 text-govTeal-600 flex-shrink-0" />
                    <span className="text-xs font-bold text-govText-primary truncate">
                      {bed.traineeName || 'Vacant Bed'}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleBedStatus(bed.id, bed.status)}
                    className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isOccupied
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-govTeal-600 hover:bg-govTeal-700 text-white shadow'
                    }`}
                  >
                    {isOccupied ? 'Vacate Bed' : 'Assign Candidate'}
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: Timetable Grid */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-2xl p-6 border border-govText-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-govText-primary">
                Weekly Academic Grid
              </h3>
              <p className="text-xs text-govText-secondary">
                Lecture halls, smart computer labs, and auditorium allocations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {days.map(day => {
              const dayEntries = timetable.filter(t => t.day === day);

              return (
                <div key={day} className="bg-govBg rounded-2xl p-5 border border-govTeal-100 space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h4 className="font-extrabold text-sm text-govTeal-900">{day}</h4>
                    <span className="text-[10px] font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded">
                      {dayEntries.length} Slots
                    </span>
                  </div>

                  {dayEntries.length > 0 ? (
                    <div className="space-y-2.5">
                      {dayEntries.map(entry => (
                        <div
                          key={entry.id}
                          className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[11px] text-govTeal-700 font-bold font-mono">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{entry.timeSlot}</span>
                            </span>
                          </div>
                          <p className="font-bold text-xs text-govText-primary">
                            {entry.subject}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-govText-muted pt-1 border-t border-gray-100">
                            <span>Faculty: <strong className="text-govText-primary">{entry.facultyName}</strong></span>
                            <span>{entry.venue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-govText-muted">
                      No scheduled sessions
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </PageContainer>
  );
};
