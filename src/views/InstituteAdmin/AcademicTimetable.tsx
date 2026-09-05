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
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

export const AcademicTimetable: React.FC = () => {
  const { timetable, programmes, navigate } = useApp();

  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedProgramme, setSelectedProgramme] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [mobileDay, setMobileDay] = useState<string>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handlePrevDay = () => {
    const currentIndex = days.indexOf(mobileDay);
    const prevIndex = (currentIndex - 1 + days.length) % days.length;
    setMobileDay(days[prevIndex]);
  };

  const handleNextDay = () => {
    const currentIndex = days.indexOf(mobileDay);
    const nextIndex = (currentIndex + 1) % days.length;
    setMobileDay(days[nextIndex]);
  };

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
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-govText-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              Residential Logistics & Curriculum
            </span>
            <SimulatedBadge text="Academic Schedule" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-govText-primary mt-1 leading-snug">
            Weekly Academic Timetable Grid
          </h2>
          <p className="text-xs text-govText-secondary mt-1 leading-relaxed">
            Lecture halls, smart computer labs, and auditorium session scheduling across all enrolled batches.
          </p>
        </div>

        {/* Tab Switcher (Hostel & Timetable) */}
        <div className="flex bg-govBg p-1.5 rounded-xl border border-govTeal-100 w-full sm:w-auto">
          <button
            onClick={() => navigate('/institute-admin/hostel')}
            className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 text-govText-secondary hover:text-govText-primary min-h-[40px] cursor-pointer"
          >
            <BedDouble className="w-4 h-4" />
            <span>Hostel Accommodation</span>
          </button>
          <button
            onClick={() => navigate('/institute-admin/timetable')}
            className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 bg-govTeal-600 text-white shadow min-h-[40px] cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Weekly Timetable Grid</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
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
      <div className="bg-white p-4 rounded-2xl border border-govText-border shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Day Filter Pills (Desktop/Tablet) */}
          <div className="hidden sm:flex items-center gap-1.5 bg-govBg p-1 rounded-xl border border-gray-200 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
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
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  selectedDay === d
                    ? 'bg-govTeal-600 text-white shadow-xs font-bold'
                    : 'text-govText-secondary hover:text-govText-primary'
                }`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Venue & Programme dropdowns */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <span className="text-govText-secondary font-medium whitespace-nowrap">Venue:</span>
              <select
                value={selectedVenue}
                onChange={e => setSelectedVenue(e.target.value)}
                className="bg-govBg border border-gray-200 rounded-lg px-2.5 py-2 sm:py-1 text-xs text-govText-primary font-medium focus:outline-none focus:ring-1 focus:ring-govTeal-500 w-full sm:w-auto min-h-[38px] sm:min-h-0"
              >
                <option value="all">All Venues</option>
                {venueOptions.map(v => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <span className="text-govText-secondary font-medium whitespace-nowrap">Programme:</span>
              <select
                value={selectedProgramme}
                onChange={e => setSelectedProgramme(e.target.value)}
                className="bg-govBg border border-gray-200 rounded-lg px-2.5 py-2 sm:py-1 text-xs text-govText-primary font-medium focus:outline-none focus:ring-1 focus:ring-govTeal-500 w-full sm:w-auto max-w-full sm:max-w-xs truncate min-h-[38px] sm:min-h-0"
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
        </div>

        {(selectedVenue !== 'all' || selectedProgramme !== 'all' || selectedDay !== 'all') && (
          <div className="pt-2 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => {
                setSelectedVenue('all');
                setSelectedProgramme('all');
                setSelectedDay('all');
              }}
              className="text-xs text-govTeal-700 hover:text-govTeal-900 font-semibold underline py-1"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 4A. Mobile Single-Day View (< 768px) */}
      <div className="block md:hidden space-y-4">
        {/* Day Navigation Controls: Prev, Current Day, Next */}
        <div className="bg-white p-3 rounded-2xl border border-govText-border shadow-sm flex items-center justify-between gap-2">
          <button
            onClick={handlePrevDay}
            className="p-2.5 rounded-xl bg-govBg hover:bg-gray-200 text-govText-primary flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer transition-colors"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center min-w-0 flex-1">
            <h3 className="font-extrabold text-base text-govText-primary">
              {mobileDay}
            </h3>
            <p className="text-[10px] text-govText-muted">
              {filteredTimetable.filter(t => t.day === mobileDay).length} Scheduled Session{filteredTimetable.filter(t => t.day === mobileDay).length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={handleNextDay}
            className="p-2.5 rounded-xl bg-govBg hover:bg-gray-200 text-govText-primary flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer transition-colors"
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Day Chips Row (scrollable horizontally without overflow) */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {days.map(d => (
            <button
              key={d}
              onClick={() => setMobileDay(d)}
              className={`flex-1 min-w-[48px] py-2 px-1 rounded-xl text-xs font-bold transition-all text-center min-h-[42px] cursor-pointer ${
                mobileDay === d
                  ? 'bg-govTeal-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-govText-secondary hover:text-govText-primary'
              }`}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Sessions for Selected Single Day */}
        <div className="space-y-3">
          {filteredTimetable.filter(t => t.day === mobileDay).length > 0 ? (
            filteredTimetable
              .filter(t => t.day === mobileDay)
              .map(entry => {
                const prog = programmes.find(p => p.id === entry.programmeId);

                return (
                  <div
                    key={entry.id}
                    className="bg-white p-4 rounded-2xl border border-govText-border shadow-sm space-y-3"
                  >
                    {/* Time slot & Venue */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="flex items-center gap-1.5 font-bold font-mono text-govTeal-800 bg-govTeal-50 px-2.5 py-1 rounded-lg border border-govTeal-200">
                        <Clock className="w-3.5 h-3.5 text-govTeal-600" />
                        <span>{entry.timeSlot}</span>
                      </span>

                      <span className="flex items-center gap-1 text-[11px] text-govText-secondary font-medium truncate max-w-[140px]">
                        <MapPin className="w-3.5 h-3.5 text-saffron-600 flex-shrink-0" />
                        <span className="truncate">{entry.venue}</span>
                      </span>
                    </div>

                    {/* Subject Name */}
                    <div>
                      <h4 className="font-bold text-sm text-govText-primary leading-snug">
                        {entry.subject}
                      </h4>
                      {prog && (
                        <p className="text-[11px] text-govText-secondary mt-1">
                          Batch: <span className="font-semibold text-govTeal-700">{prog.title}</span>
                        </p>
                      )}
                    </div>

                    {/* Instructor & Status */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100 text-govText-secondary">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-govTeal-600" />
                        <span>Instructor: <strong className="text-govText-primary">{entry.facultyName}</strong></span>
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Confirmed
                      </span>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-xs text-govText-muted border border-govText-border shadow-sm space-y-1">
              <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-1" />
              <p className="font-bold text-sm text-govText-primary">No sessions for {mobileDay}</p>
              <p>Select another day from the switcher above.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4B. Desktop Weekly Grid Layout (>= 768px) */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
