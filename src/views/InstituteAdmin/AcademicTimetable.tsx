import React, { useState, useMemo } from 'react';
import {
  Calendar,
  BedDouble,
  Clock,
  User,
  MapPin,
  Building,
  Layers,
  Filter,
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

export const AcademicTimetable: React.FC = () => {
  const { timetable, programmes, navigate } = useApp();

  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedProgramme, setSelectedProgramme] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Unique venues
  const venueOptions = useMemo(() => {
    const set = new Set<string>();
    timetable.forEach(t => {
      if (t.venue) set.add(t.venue);
    });
    return Array.from(set).sort();
  }, [timetable]);

  // Filtered entries
  const filteredTimetable = useMemo(() => {
    return timetable.filter(entry => {
      if (selectedVenue !== 'all' && entry.venue !== selectedVenue) return false;
      if (selectedProgramme !== 'all' && entry.programmeId !== selectedProgramme) return false;
      if (selectedDay !== 'all' && entry.day !== selectedDay) return false;
      return true;
    });
  }, [timetable, selectedVenue, selectedProgramme, selectedDay]);

  const totalSessions = timetable.length;
  const activeVenues = venueOptions.length;
  const uniqueFaculty = useMemo(() => {
    const set = new Set<string>();
    timetable.forEach(t => {
      if (t.facultyName) set.add(t.facultyName);
    });
    return set.size;
  }, [timetable]);

  return (
    <PageContainer>
      {/* 1. Header with Shared Tab Toggle */}
      <div className="bg-white p-6 rounded-2xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              Residential Logistics & Curriculum
            </span>
            <SimulatedBadge text="Academic Schedule" />
          </div>
          <h2 className="text-2xl font-extrabold text-govText-primary mt-1">
            Weekly Academic Timetable Grid
          </h2>
          <p className="text-xs text-govText-secondary mt-1">
            Lecture halls, smart computer labs, and auditorium session scheduling across all enrolled batches.
          </p>
        </div>

        {/* Tab Switcher (Hostel & Timetable) */}
        <div className="flex bg-govBg p-1.5 rounded-xl border border-govTeal-100">
          <button
            onClick={() => navigate('/institute-admin/hostel')}
            className="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 text-govText-secondary hover:text-govText-primary"
          >
            <BedDouble className="w-4 h-4" />
            <span>Hostel Accommodation</span>
          </button>
          <button
            onClick={() => navigate('/institute-admin/timetable')}
            className="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 bg-govTeal-600 text-white shadow"
          >
            <Calendar className="w-4 h-4" />
            <span>Weekly Timetable Grid</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-govText-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-govText-secondary">Total Scheduled Slots</span>
            <Calendar className="w-4 h-4 text-govTeal-600" />
          </div>
          <p className="text-2xl font-extrabold text-govText-primary mt-2">{totalSessions}</p>
          <span className="text-[10px] text-govText-muted">Monday through Saturday</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-govText-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-govText-secondary">Active Learning Venues</span>
            <MapPin className="w-4 h-4 text-govTeal-600" />
          </div>
          <p className="text-2xl font-extrabold text-govText-primary mt-2">{activeVenues}</p>
          <span className="text-[10px] text-govText-muted">Smart Labs & Lecture Halls</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-govText-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-govText-secondary">Faculty Instructors</span>
            <User className="w-4 h-4 text-govTeal-600" />
          </div>
          <p className="text-2xl font-extrabold text-govText-primary mt-2">{uniqueFaculty}</p>
          <span className="text-[10px] text-govText-muted">Subject matter experts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-govText-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-govText-secondary">Active Batch</span>
            <Layers className="w-4 h-4 text-govTeal-600" />
          </div>
          <p className="text-2xl font-extrabold text-govTeal-800 mt-2">60 Trainees</p>
          <span className="text-[10px] text-emerald-700 font-semibold">PACS Batch 2026-01</span>
        </div>
      </div>

      {/* 3. Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Day Filter Pills */}
          <div className="flex items-center gap-1.5 bg-govBg p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedDay === 'all'
                  ? 'bg-govTeal-600 text-white shadow-xs'
                  : 'text-govText-secondary hover:text-govText-primary'
              }`}
            >
              All Days
            </button>
            {days.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  selectedDay === d
                    ? 'bg-govTeal-600 text-white shadow-xs font-bold'
                    : 'text-govText-secondary hover:text-govText-primary'
                }`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Venue Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-govText-secondary font-medium">Venue:</span>
            <select
              value={selectedVenue}
              onChange={e => setSelectedVenue(e.target.value)}
              className="bg-govBg border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-govText-primary font-medium focus:outline-none focus:ring-1 focus:ring-govTeal-500"
            >
              <option value="all">All Learning Venues</option>
              {venueOptions.map(v => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Programme Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-govText-secondary font-medium">Programme:</span>
            <select
              value={selectedProgramme}
              onChange={e => setSelectedProgramme(e.target.value)}
              className="bg-govBg border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-govText-primary font-medium focus:outline-none focus:ring-1 focus:ring-govTeal-500 max-w-xs truncate"
            >
              <option value="all">All Programmes</option>
              {programmes.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(selectedVenue !== 'all' || selectedProgramme !== 'all' || selectedDay !== 'all') && (
          <button
            onClick={() => {
              setSelectedVenue('all');
              setSelectedProgramme('all');
              setSelectedDay('all');
            }}
            className="text-xs text-govTeal-700 hover:text-govTeal-900 font-semibold underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* 4. Weekly Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days
          .filter(day => selectedDay === 'all' || selectedDay === day)
          .map(day => {
            const dayEntries = filteredTimetable.filter(t => t.day === day);

            return (
              <div
                key={day}
                className="bg-white rounded-2xl p-5 border border-govText-border shadow-sm flex flex-col space-y-3 hover:border-govTeal-300 transition-colors"
              >
                {/* Day Card Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-govTeal-50 text-govTeal-700 flex items-center justify-center font-bold text-xs">
                      {day.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-govText-primary">{day}</h4>
                      <p className="text-[10px] text-govText-muted">VAMNICOM Academic Block</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-govTeal-800 bg-govTeal-50 px-2 py-0.5 rounded border border-govTeal-200">
                    {dayEntries.length} Session{dayEntries.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Sessions in this day */}
                {dayEntries.length > 0 ? (
                  <div className="space-y-3 flex-1">
                    {dayEntries.map(entry => {
                      const prog = programmes.find(p => p.id === entry.programmeId);

                      return (
                        <div
                          key={entry.id}
                          className="bg-govBg/70 p-3.5 rounded-xl border border-gray-200 hover:bg-govBg hover:border-govTeal-300 transition-all space-y-2 group"
                        >
                          {/* Time & Venue */}
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="flex items-center gap-1.5 font-bold text-govTeal-800 bg-white px-2 py-0.5 rounded border border-gray-200">
                              <Clock className="w-3 h-3 text-govTeal-600" />
                              <span>{entry.timeSlot}</span>
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-govText-muted truncate max-w-[120px]">
                              <MapPin className="w-3 h-3 text-saffron-600 flex-shrink-0" />
                              <span className="truncate">{entry.venue}</span>
                            </span>
                          </div>

                          {/* Subject Title */}
                          <p className="font-bold text-xs text-govText-primary leading-snug group-hover:text-govTeal-800 transition-colors">
                            {entry.subject}
                          </p>

                          {/* Programme tag */}
                          {prog && (
                            <p className="text-[10px] text-govText-secondary truncate font-medium">
                              Batch: <span className="font-semibold text-govTeal-700">{prog.title}</span>
                            </p>
                          )}

                          {/* Faculty */}
                          <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-gray-200/80 text-govText-secondary">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3 text-govTeal-600" />
                              <span>Faculty: <strong className="text-govText-primary">{entry.facultyName}</strong></span>
                            </span>
                            <span className="text-[9.5px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                              Confirmed
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-10 text-center text-xs text-govText-muted flex-1 flex flex-col items-center justify-center">
                    <Calendar className="w-6 h-6 text-gray-300 mb-1" />
                    <span>No scheduled sessions for {day}</span>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </PageContainer>
  );
};
